import type { Transaction as EtherTransaction } from 'ethers';

export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Maybe<T> = Optional<T> | Nullable<T>;

export type WalletAddress = `0x${string}`;
export type Address = `0x${string}`;

export type Transaction = Partial<Pick<EtherTransaction, 'from' | 'to' | 'data' | 'value'>>;

export type TxHash = string;

export type Dict<T = unknown> = Record<string, T>;

export type JSONBody = string | number | boolean | JSONObject;

export interface JSONObject {
  [x: string]: JSONBody;
}
