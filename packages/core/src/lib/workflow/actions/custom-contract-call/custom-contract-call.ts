import VaultABI from '../../../blockchain/abi/VaultABI.json';
import {
  CallData,
  CallDataBuilder,
  CallDataBuilderReturnData,
  CommonBuilderOptions,
} from '../../builders/types';
import { Address } from '../../../types';

type ActionConfig = {
  address: Address;
  functionName: string;
  abi: any;
  args: any[];
  value?: bigint; // native amount to send with the call
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

    if (!this.config.address || !this.config.functionName || !this.config.abi) {
      throw new Error("Invalid configuration");
    }

    const contractInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(this.config.abi));

    const functionCallData = contractInterface.encodeFunctionData(this.config.address, this.config.args);

    callData.add({
      to: this.commonCallDataBuilderConfig.vaultAddress,
      callData: this.vaultInterface.encodeFunctionData("execute", [
        this.config.address,
        this.config.value ? String(this.config.value) : "0",
        functionCallData,
      ]),
    });

    return { callData, value: BigInt(0) };
  }
}
