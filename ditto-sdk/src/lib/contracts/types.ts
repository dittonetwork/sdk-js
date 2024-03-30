import { WalletAddress } from '../types';

export interface ContractFactory<T extends DittoContract> {
  getContract(address: WalletAddress, abi: string): Promise<T>;
}

export interface DittoContract {
  call<P, R>(method: string, params: P): Promise<R>;
}

export class DittoContractNotInitializedError extends Error {}
