import { DittoContractNotInitializedError, DittoContract } from '../types';
import { ethers } from 'ethers';

export class EthersContract implements DittoContract {
  constructor(private readonly nativeContract: ethers.Contract) {}

  public async call<P, R>(method: string, params: P): Promise<R> {
    if (!this.nativeContract) {
      throw new DittoContractNotInitializedError();
    }

    const result = params
      ? await this.nativeContract[method](params)
      : await this.nativeContract[method]();

    return result as R;
  }
}
