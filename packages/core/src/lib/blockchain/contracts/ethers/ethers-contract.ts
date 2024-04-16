import { DittoContractNotInitializedError, DittoContract } from '../types';
import { ethers } from 'ethers';
import { Address, Maybe } from '../../../types';
import { EthersContractInterface } from './ethers-contract-interface';

export class EthersContract implements DittoContract {
  private readonly nativeContract: ethers.Contract;
  private readonly contractInterface: EthersContractInterface;

  constructor(
    address: Address,
    abi: string,
    private readonly signer: ethers.Signer | ethers.Wallet
  ) {
    this.nativeContract = new ethers.Contract(address, abi, this.signer);
    this.contractInterface = new EthersContractInterface(abi);
  }

  public async call<R, P extends unknown[] = []>(method: string, ...params: P): Promise<R> {
    if (!this.nativeContract) {
      throw new DittoContractNotInitializedError();
    }

    const result = params
      ? await this.nativeContract[method](...params)
      : await this.nativeContract[method]();

    return result as R;
  }

  public selector(method: string): Maybe<string> {
    return this.contractInterface.selector(method);
  }

  public encodeFunctionData(method: string, params: string[]): string {
    return this.contractInterface.encodeFunctionData(method, params);
  }

  public estimateGas(method: string, params: unknown[]): Promise<bigint> {
    return this.nativeContract[method].estimateGas(...params);
  }
}
