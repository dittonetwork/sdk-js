import { ethers } from 'ethers';
import { EthersContractInterface } from './ethers-contract-interface';
import { Address, Maybe } from '@ditto-network/core';
import { DittoContract, DittoContractNotInitializedError } from '@ditto-network/core';

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

  public async call<R, P extends unknown[]>(
    method: string,
    params: P = [] as unknown as P
  ): Promise<R> {
    if (!this.nativeContract) {
      throw new DittoContractNotInitializedError();
    }

    const result =
      params.length > 0
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

  public async getPastEvents(eventName: string, options: { fromBlock?: number; toBlock?: number }) {
    const { fromBlock = 0, toBlock = 'latest' } = options;
    const filter = this.nativeContract.filters[eventName]();
    const events = await this.nativeContract.queryFilter(filter, fromBlock, toBlock);
    return events;
  }
}
