import type { Transaction as EtherTransaction } from 'ethers';

export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Maybe<T> = Optional<T> | Nullable<T>;

export type WalletAddress = string;
export type Address = string;

export type Transaction = Partial<Pick<EtherTransaction, 'from' | 'to' | 'data' | 'value'>>;

export type TxHash = string;
