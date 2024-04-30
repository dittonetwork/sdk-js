import { DittoContractInterface, Maybe } from '@ditto-network/core';
import { Web3 } from 'web3';
import { getMethodFromAbi } from '../utils/get-method-from-abi';

export class Web3jsContractInterface implements DittoContractInterface {
  constructor(private readonly abi: string, private readonly web3: Web3) {}

  public encodeFunctionData(method: string, params: unknown[]): string {
    return this.web3.eth.abi.encodeFunctionCall(getMethodFromAbi(method, this.abi), params);
  }

  public selector(method: string): Maybe<string> {
    return this.web3.eth.abi.encodeFunctionSignature(getMethodFromAbi(method, this.abi));
  }
}
