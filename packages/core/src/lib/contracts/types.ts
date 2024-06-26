import { Address, Maybe } from '../types';
import { JSONObject } from '../network/api-client/types';
import { EventLog, Log } from 'ethers';

export interface ContractFactory<T extends DittoContract, I extends DittoContractInterface> {
  getContract(address: Address, abi: string): T;
  getContractInterface(abi: string): I;
}

export interface DittoContract extends DittoContractInterface {
  call<R, P extends unknown[] = []>(
    method: string,
    params?: P,
    additionalTxParams?: JSONObject
  ): Promise<R>;
  estimateGas(method: string, params: unknown[], additionalTxParams?: JSONObject): Promise<bigint>;
  encodeFunctionData(method: string, params: unknown[]): string;
  selector(method: string): Maybe<string>;
  getPastEvents(eventName: string, options: { fromBlock?: number; toBlock?: string | number }): Promise<any[]>;
}

export interface DittoContractInterface {
  selector(method: string): Maybe<string>;
  encodeFunctionData(method: string, params: unknown[]): string;
}

export class DittoContractNotInitializedError extends Error {}

export class DittoContractMethodNotFoundError extends Error {}


  export interface Erc20Token {
    symbol: string
    address: Address
    decimals: number
    name: string
  }
