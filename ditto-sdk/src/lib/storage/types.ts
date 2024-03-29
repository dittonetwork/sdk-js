import { Maybe } from '../types';

export interface DittoStorage {
  set(key: string, value: string): void | Promise<void>;
  get<T = Maybe<string>>(key: string): T | Promise<T>;
  remove(key: string): void | Promise<void>;
}
