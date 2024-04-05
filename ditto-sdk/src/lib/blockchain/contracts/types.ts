import { Maybe, WalletAddress } from '../../types';

export interface ContractFactory<T extends DittoContract, I extends DittoContractInterface> {
  getContract(address: WalletAddress, abi: string): T;
  getContractInterface(abi: string): I;
}

export interface DittoContract extends DittoContractInterface {
  call<P, R>(method: string, params: P): Promise<R>;
}

export interface DittoContractInterface {
  selector(method: string): Maybe<string>;
  encodeFunctionData(method: string, params: unknown[]): string;
}

export class DittoContractNotInitializedError extends Error {}
