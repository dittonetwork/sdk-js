import { DittoStorage } from './types';
import { Maybe } from '../types';

export class VoidStorage implements DittoStorage {
  public get<T = Maybe<string>>(_key: string): Promise<T> | T {
    return undefined as T;
  }

  public remove(_key: string): void | Promise<void> {
    return undefined;
  }

  public set(_key: string, _value: string): void | Promise<void> {
    return undefined;
  }
}
