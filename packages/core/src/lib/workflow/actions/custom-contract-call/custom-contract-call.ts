import VaultABI from '../../../blockchain/abi/VaultABI.json';
import {
  CallData,
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../../builders/types';
import { Address } from '../../../types';

export type CallItem = {
  contract: Address;
  method: string;
  abi: any;
  args: any[];
  value?: string | number | bigint; // native amount to send with the call
};

type ActionConfig = {
  items: CallItem[];
  value?: bigint;
};

export class CustomContractCall implements CallDataBuilder {
  private vaultInterface: any;

  constructor(
    protected readonly config: ActionConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {
    this.vaultInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));
  }

  public async build(): Promise<CallDataBuilderReturnData> {
    const callData = new Set<CallData>();

    for (const item of this.config.items) {
      if (!item.contract || !item.method || !item.abi) continue;

      const contractInterface = this.commonCallDataBuilderConfig.provider
        .getContractFactory()
        .getContractInterface(JSON.stringify(item.abi));

      const functionCallData = contractInterface.encodeFunctionData(item.method, item.args);

      callData.add({
        to: item.contract,
        callData: this.vaultInterface.encodeFunctionData("execute", [
          item.contract,
          item.value ? String(item.value) : "0",
          functionCallData,
        ]),
      });
    }

    return { callData, value: this.config.value || BigInt(0) };
  }
}
