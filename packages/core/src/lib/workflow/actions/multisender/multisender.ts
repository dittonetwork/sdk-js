import VaultABI from '../../../blockchain/abi/VaultABI.json';
import { tokens } from '../../../blockchain/tokens';
import {
  CallData,
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../../builders/types';
import { isNativeToken } from '../../../blockchain/tokens/utils';
import { Erc20Token } from '../../../contracts/types';
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

    const { chainId } = this.commonCallDataBuilderConfig;

    for (const item of this.config.items) {
      if (!item.to || !item.amount) continue;

      const asset = item.asset || tokens.native[chainId];
      const amount = item.amount;

      const isTokenNative = isNativeToken(asset.address, this.commonCallDataBuilderConfig.chainId);

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
