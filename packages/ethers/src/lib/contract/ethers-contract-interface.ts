import { ethers } from 'ethers';
import { Maybe } from '@ditto-network/core';
import { DittoContractInterface } from '@ditto-network/core';

export class EthersContractInterface implements DittoContractInterface {
  private readonly ethersInterface: ethers.Interface;

  constructor(abi: string) {
    this.ethersInterface = new ethers.Interface(abi);
  }

  public selector(method: string): Maybe<string> {
    return this.ethersInterface.getFunction(method)?.selector;
  }

  public encodeFunctionData(method: string, params: string[]): string {
    return this.ethersInterface.encodeFunctionData(method, params);
  }
}
