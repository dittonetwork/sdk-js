import { ethers } from 'ethers5';
import BigNumber from 'bignumber.js';
import { AlphaRouter, AlphaRouterParams, SwapType } from '@uniswap/smart-order-router';
import { CurrencyAmount, Percent, Token as UniswapToken, TradeType } from '@uniswap/sdk-core';
import VaultABI from '../../../blockchain/abi/VaultABI.json';
import Erc20TokenABI from '../../../blockchain/abi/Erc20TokenABI.json';
import { TokenLight, tokens } from '../../../blockchain/tokens';
import { Chain } from '../../../blockchain/chains/types';
import {
  CallData,
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../../builders/types';
import { isNativeToken, isAddressesEqual } from '../../../blockchain/tokens/utils';
import { DittoContractInterface, Erc20Token } from '../../../contracts/types';
import { Address } from '../../../types';

export type MultiSenderItem = {
  asset: Erc20Token | null;
  amount: bigint;
  to: Address;
};

type ActionConfig = {
  items: MultiSenderItem[];
};

export class MultiSenderAction implements CallDataBuilder {
  constructor(
    protected readonly config: ActionConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {}

  public async build(): Promise<CallDataBuilderReturnData> {
    const callData = new Set<CallData>();

    const vaultInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));
    const erc20Interface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(Erc20TokenABI));

    const { chainId } = this.commonCallDataBuilderConfig;

    for (const item of this.config.items) {
      if (!item.to || !item.amount) continue;

      const asset = item.asset || tokens.native[chainId];
      const amount = item.amount // new BigNumber(item.amount).shiftedBy(asset.decimals).toFixed(0)

      const isTokenNative = isNativeToken(
        asset.address,
        this.commonCallDataBuilderConfig.chainId
      );

      if (isTokenNative) {
        callData.add({
          to: this.commonCallDataBuilderConfig.vaultAddress,
          callData: vaultInterface.encodeFunctionData('withdrawNative', [item.to, amount]),
        });
      } else {
        callData.add({
          to: this.commonCallDataBuilderConfig.vaultAddress,
          callData: vaultInterface.encodeFunctionData('withdrawERC20', [
            asset.address,
            item.to,
            amount,
          ]),
        });
      }
    }

    return { callData, value: BigInt(0) };
  }
}
