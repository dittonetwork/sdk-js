import { Address, DittoContract, Maybe } from '@ditto-network/core';
import { Contract, Web3 } from 'web3';
import { PayableCallOptions } from 'web3-types';
import { Web3jsContractInterface } from './web3js-contract-interface';
import { getMethodFromAbi } from '../utils/get-method-from-abi';
import { webPromiEventToTxPromise } from '../utils/web-promi-event-to-tx-promise';

export class Web3jsContract implements DittoContract {
  private readonly nativeContract: Contract<any>;
  private contractInterface: Web3jsContractInterface;
  private readonly abi: Array<Record<string, any>>;

  constructor(
    address: Address,
    abi: string,
    web3: Web3,
    private readonly txParamsEnrichFn: () => Promise<PayableCallOptions> = async () => ({})
  ) {
    this.abi = JSON.parse(abi);

    this.nativeContract = new Contract(JSON.parse(abi), address);
    this.nativeContract.provider = web3.currentProvider;

    this.contractInterface = new Web3jsContractInterface(abi, web3);
  }

  public async call<R, P extends unknown[]>(method: string, ...params: P): Promise<R> {
    if (this.isReadOnlyMethod(method)) {
      const result = await this.nativeContract.methods[method](...params).call();
      return result as R;
    }

    const txParams = await this.txParamsEnrichFn();
    const gas = await this.estimateGas(method, params, txParams);

    return webPromiEventToTxPromise(
      this.nativeContract.methods[method](...params).send({
        gas: `${gas}`,
        type: 2,
        ...txParams,
      })
    ) as Promise<R>;
  }

  public encodeFunctionData(method: string, params: unknown[]): string {
    return this.contractInterface.encodeFunctionData(method, params);
  }

  public async estimateGas(
    method: string,
    params: unknown[],
    txParams?: PayableCallOptions
  ): Promise<bigint> {
    txParams = txParams || (await this.txParamsEnrichFn());

    return this.nativeContract.methods[method](...params).estimateGas(txParams);
  }

  public selector(method: string): Maybe<string> {
    return this.contractInterface.selector(method);
  }

  private isReadOnlyMethod(method: string): boolean {
    return getMethodFromAbi(method, this.abi).stateMutability === 'view';
  }

  public async getPastEvents(
    eventName: string,
    options: { fromBlock?: number; toBlock?: string | number } = {}
  ) {
    const { fromBlock = 0, toBlock = 'latest' } = options;
    const events = await this.nativeContract.getPastEvents(eventName, {
      fromBlock,
      toBlock,
    });
    return events;
  }
}
