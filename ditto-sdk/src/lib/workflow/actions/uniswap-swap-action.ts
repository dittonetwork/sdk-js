import {
  CallData,
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../builders/types';
import { ZERO_ADDRESS } from '../../blockchain/addresses/zero-address';
import VaultABI from '../../blockchain/abi/VaultABI.json';
import Erc20TokenABI from '../../blockchain/abi/Erc20TokenABI.json';
import { CurrencyAmount, Percent, Token as UniswapToken, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, AlphaRouterParams, SwapType } from '@uniswap/smart-order-router';
import { parseUniswapRouterCallData } from '../../utils/parse-uniswap-router-call-data';
import { DittoContractInterface } from '../../blockchain/contracts/types';
import { ethers } from 'ethers5';
import { Address } from '../../types';
import type { Token } from '../../ditto-sdk';
import { isNativeToken } from '../../blockchain/tokens/ utils/is-native-token';
import { isAddressesEqual } from '../../blockchain/tokens/ utils/is-addresses-equal';
import { BalanceCheckerService } from '../../blockchain/services/balance-checker-service';
import { wrappedNativeTokens } from '../../blockchain/tokens/wrappedNative';

type ActionConfig = {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  slippagePercent?: number;
};

export class UniswapSwapActionCallDataBuilder implements CallDataBuilder {
  private readonly balanceCheckerService: BalanceCheckerService;

  constructor(
    protected readonly config: ActionConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {
    this.balanceCheckerService = new BalanceCheckerService(
      this.commonCallDataBuilderConfig.provider
    );
  }

  public async build(): Promise<CallDataBuilderReturnData> {
    const checks: Array<() => Promise<boolean>> = [];
    const callData = new Set<CallData>();

    const vaultInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));
    const erc20Interface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(Erc20TokenABI));

    const isFromTokenIsNative = isNativeToken(
      this.config.fromToken.address,
      this.commonCallDataBuilderConfig.chainId
    );
    const isToTokenIsNative = isNativeToken(
      this.config.toToken.address,
      this.commonCallDataBuilderConfig.chainId
    );

    const value = isFromTokenIsNative ? BigInt(this.config.fromAmount) : BigInt(0);

    // when source token is native
    if (isFromTokenIsNative) {
      checks.push(async () => {
        return this.balanceCheckerService.hasEnoughBalance(
          this.config.fromToken.address,
          this.config.fromAmount,
          this.commonCallDataBuilderConfig.chainId
        );
      });

      callData.add({
        to: this.commonCallDataBuilderConfig.vaultAddress,
        callData: vaultInterface.encodeFunctionData('wrapNativeFromVaultBalance', [
          value.toString(),
        ]),
      });
    } else if (
      // when recipient is not vault
      !isAddressesEqual(
        this.commonCallDataBuilderConfig.vaultAddress,
        this.commonCallDataBuilderConfig.recipient
      )
    ) {
      const transferCallData = erc20Interface.encodeFunctionData('transfer', [
        this.commonCallDataBuilderConfig.recipient,
        this.config.fromAmount,
      ]);

      checks.push(async () =>
        this.balanceCheckerService.hasEnoughBalance(
          this.config.fromToken.address,
          this.config.fromAmount,
          this.commonCallDataBuilderConfig.chainId
        )
      );

      // @todo should I check for allowance?

      callData.add({
        to: this.config.fromToken.address,
        callData: transferCallData,
      });
    }

    // when transfer from native token to wrapped native token
    const wrappedNativeTokenAddress =
      wrappedNativeTokens[this.commonCallDataBuilderConfig.chainId].address;
    if (
      isFromTokenIsNative &&
      isAddressesEqual(this.config.toToken.address, wrappedNativeTokenAddress)
    ) {
      return Promise.resolve({
        callData,
        value,
        additionalChecks: checks,
      });
    }

    // when transfer from wrapped native token to native token
    if (
      isToTokenIsNative &&
      isAddressesEqual(this.config.fromToken.address, wrappedNativeTokenAddress)
    ) {
      const unwrapCallData = vaultInterface.encodeFunctionData('unwrapNative', [
        this.config.fromAmount,
      ]);

      callData.add({
        to: this.commonCallDataBuilderConfig.vaultAddress,
        callData: unwrapCallData,
      });

      return Promise.resolve({
        callData,
        value,
        additionalChecks: checks,
      });
    }

    // regular swap
    const uniswapRouterData = await this.createUniswapRoute(
      this.config.fromAmount,
      isFromTokenIsNative
        ? wrappedNativeTokens[this.commonCallDataBuilderConfig.chainId]
        : this.config.fromToken,
      this.config.toToken,
      this.commonCallDataBuilderConfig.chainId as number,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      new ethers.providers.Web3Provider(window.ethereum!),
      this.commonCallDataBuilderConfig.recipient,
      this.config.slippagePercent !== undefined ? this.config.slippagePercent * 100 : undefined
    );

    if (!uniswapRouterData?.tx) throw new Error('Uniswap route not build');

    this.generateCallDataFromUniswapRoute(
      uniswapRouterData.tx.calldata,
      this.config.fromToken.address,
      this.config.toToken.address,
      this.config.slippagePercent ?? 0.5,
      vaultInterface
    ).forEach((item) =>
      callData.add({
        to: this.commonCallDataBuilderConfig.vaultAddress,
        callData: item,
      })
    );

    return {
      callData,
      value: BigInt(parseInt(uniswapRouterData.estimatedOutput).toFixed(0)),
    };
  }

  private async createUniswapRoute<T extends { address: Address; decimals: number }>(
    amountIn: string,
    fromTokenLight: T,
    toTokenLight: T,
    chainId: AlphaRouterParams['chainId'],
    provider: AlphaRouterParams['provider'],
    recipient: string,
    slippage = 50
  ) {
    const router = new AlphaRouter({
      chainId,
      provider,
    });

    const fromToken = new UniswapToken(chainId, fromTokenLight.address, fromTokenLight.decimals);
    const toToken = new UniswapToken(chainId, toTokenLight.address, toTokenLight.decimals);

    const route = await router.route(
      CurrencyAmount.fromRawAmount(fromToken, amountIn),
      toToken,
      TradeType.EXACT_INPUT,
      {
        recipient: recipient,
        slippageTolerance: new Percent(slippage, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800), // @todo for scheduled trigger it should be maximum
        type: SwapType.SWAP_ROUTER_02,
      },
      {
        maxSwapsPerPath: 4,
        v3PoolSelection: {
          topN: 1,
          topNDirectSwaps: 1,
          topNTokenInOut: 1,
          topNSecondHop: 1,
          topNWithEachBaseToken: 1,
          topNWithBaseToken: 1,
        },
      }
    );

    return {
      tx: route?.methodParameters,
      data: route,
      estimatedOutput: route?.trade.swaps.slice(-1)[0]?.outputAmount?.toFixed() ?? '0',
    };
  }

  private generateCallDataFromUniswapRoute(
    initialCallData: string,
    fromAddress: string | undefined,
    toAddress: string | undefined,
    slippage: string | number,
    vaultInterface: DittoContractInterface
  ) {
    const parsedDataArray = parseUniswapRouterCallData(initialCallData);

    const callData = new Set<string>();

    parsedDataArray.forEach((parsedDataPiece, index) => {
      if (!fromAddress) return;

      callData.add(
        vaultInterface.encodeFunctionData('uniswapSwapExactInput', [
          parsedDataPiece.tokens,
          parsedDataPiece.poolFees,
          parsedDataPiece.amountIn,
          false,
          index === parsedDataArray.length - 1 && toAddress === ZERO_ADDRESS,
          BigInt(+slippage * 1e16).toString(),
        ])
      );
    });

    return callData;
  }
}
