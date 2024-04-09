import { Maybe, WalletAddress } from '../../types';

export interface ContractFactory<T extends DittoContract, I extends DittoContractInterface> {
  getContract(address: WalletAddress, abi: string): T;
  getContractInterface(abi: string): I;
}

export interface DittoContract extends DittoContractInterface {
  call<R, P extends unknown[] = []>(method: string, ...params: P): Promise<R>;
  estimateGas(method: string, params: unknown[]): Promise<number>;
}

export interface DittoContractInterface {
  selector(method: string): Maybe<string>;
  encodeFunctionData(method: string, params: unknown[]): string;
}

export class DittoContractNotInitializedError extends Error {}
