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
};

type ActionConfig = {
  items: CallItem[];
  value?: bigint;
};

export class CustomContractCall implements CallDataBuilder {
  constructor(
    protected readonly config: ActionConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {}

  public async build(): Promise<CallDataBuilderReturnData> {
    const callData = new Set<CallData>();

    for (const item of this.config.items) {
      if (!item.contract || !item.method || !item.abi) continue;

    const contractInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(item.abi));

      callData.add({
        to: item.contract,
        callData: contractInterface.encodeFunctionData(item.method, item.args),
      });
    }

    return { callData, value: this.config.value || BigInt(0) };
  }
}




  // public encodeExecuteFunctionCallRaw(
  //   pointer: string,
  //   to: string,
  //   callData: string,
  //   nativeAmount?: string | number
  // ): CallData {
  //   return {
  //     pointer: pointer,
  //     callData: this.vaultInterface.encodeFunctionData("execute", [
  //       to,
  //       nativeAmount ?? "0",
  //       callData
  //     ]),
  //     value: nativeAmount?.toString()
  //   }
  // }

  // public encodeExecuteFunctionCall(
  //   pointer: string,
  //   callParams: {
  //     functionName: string,
  //     data: any[],
  //     to: string,
  //     nativeAmount?: string | number,
  //     viewData?: string
  //   }
  // ): CallData {
  //   const functionCall = this.encodeFunctionData(pointer, callParams.functionName, callParams.data, callParams.viewData)

  //   return {
  //     pointer,
  //     callData: this.vaultInterface.encodeFunctionData("execute", [
  //       callParams.to,
  //       callParams.nativeAmount ?? "0",
  //       functionCall.callData
  //     ])
  //   }
  // }
