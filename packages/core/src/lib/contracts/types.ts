import { Address, Maybe } from '../types';
import { JSONObject } from '../network/api-client/types';

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
}

export interface DittoContractInterface {
  selector(method: string): Maybe<string>;
  encodeFunctionData(method: string, params: unknown[]): string;
}

export class DittoContractNotInitializedError extends Error {}

export class DittoContractMethodNotFoundError extends Error {}
