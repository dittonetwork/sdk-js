import {
  CallData,
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../builders/types';
import { noopBuilderData } from '../builders';
import { ZERO_ADDRESS } from '../../blockchain/addresses/zero-address';
import VaultABI from '../../blockchain/abi/VaultABI.json';
import Erc20TokenABI from '../../blockchain/abi/Erc20TokenABI.json';
import { wrappedNativeTokens } from '../../blockchain/addresses/tokens';
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, AlphaRouterParams, SwapType } from '@uniswap/smart-order-router';
import { parseUniswapRouterCallData } from '../../utils/parse-uniswap-router-call-data';
import { DittoContractInterface } from '../../blockchain/contracts/types';

type ActionConfig = {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  slippagePercent?: number;
};

export class UniswapSwapAction implements CallDataBuilder {
  constructor(
    protected readonly config: ActionConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {}
  public async build(): Promise<CallDataBuilderReturnData> {
    const callData = new Set<CallData>();
    const vaultInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));

    const value =
      this.config.fromToken === ZERO_ADDRESS ? BigInt(this.config.fromAmount) : BigInt(0);

    if (value > 0) {
      callData.add({
        to: this.commonCallDataBuilderConfig.vaultAddress,
        callData: vaultInterface.encodeFunctionData('wrapNativeFromVaultBalance', [
          value.toString(),
        ]),
      });
    } else if (
      this.commonCallDataBuilderConfig.vaultAddress.toLowerCase() !==
      this.commonCallDataBuilderConfig.recipient.toLowerCase()
    ) {
      const tokenInterface = this.commonCallDataBuilderConfig.provider
        .getContractFactory()
        .getContractInterface(JSON.stringify(Erc20TokenABI));

      const transferCallData = tokenInterface.encodeFunctionData('transfer', [
        this.commonCallDataBuilderConfig.recipient,
        this.config.fromAmount,
      ]);

      callData.add({
        to: this.config.fromToken,
        callData: transferCallData,
      });
    }

    const wrappedNativeTokenAddress = wrappedNativeTokens[this.commonCallDataBuilderConfig.chainId];

    if (
      value > 0 &&
      this.config.toToken.toLowerCase() === wrappedNativeTokenAddress.toLowerCase()
    ) {
      return Promise.resolve({
        callData,
        value,
      });
    }

    if (
      this.config.toToken === ZERO_ADDRESS &&
      this.config.fromToken.toLowerCase() === wrappedNativeTokenAddress.toLowerCase()
    ) {
      const unwrapCallData = vaultInterface.encodeFunctionData('unwrapNative', [
        this.config.fromAmount,
      ]);

      return Promise.resolve({
        callData,
        value,
      });
    }

    const uniswapRouterData = await this.createUniswapRoute(
      this.config.fromAmount,
      this.config.fromToken,
      this.config.toToken,
      this.commonCallDataBuilderConfig.chainId as number,
      this.commonCallDataBuilderConfig.provider.getSigner().getRawSigner(),
      this.commonCallDataBuilderConfig.recipient,
      this.config.slippagePercent !== undefined ? this.config.slippagePercent * 100 : undefined
    );

    if (!uniswapRouterData?.tx) throw new Error('Uniswap route not build');

    this.generateCallDataFromUniswapRoute(
      uniswapRouterData.tx.calldata,
      this.config.fromToken,
      this.config.toToken,
      this.config.slippagePercent ?? 0.5,
      vaultInterface
    ).forEach((item) =>
      callData.add({
        to: this.commonCallDataBuilderConfig.vaultAddress,
        callData: item,
      })
    );

    return Promise.resolve(noopBuilderData);
  }

  private async createUniswapRoute(
    amountIn: string,
    fromTokenAddress: string,
    toTokenAddress: string,
    chainId: AlphaRouterParams['chainId'],
    provider: AlphaRouterParams['provider'],
    recipient: string,
    slippage = 50
  ) {
    const router = new AlphaRouter({
      chainId,
      provider,
    });

    const fromToken = new Token(chainId, fromTokenAddress, 0);
    const toToken = new Token(chainId, toTokenAddress, 0);

    const route = await router.route(
      CurrencyAmount.fromRawAmount(fromToken, amountIn),
      toToken,
      TradeType.EXACT_INPUT,
      {
        recipient: recipient,
        slippageTolerance: new Percent(slippage, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
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
          (BigInt(slippage) * BigInt(1e16)).toString(),
        ])
      );
    });

    return callData;
  }
}
