import { DittoStorage } from './types';
import { Maybe } from '../types';

export class InMemoryStorage implements DittoStorage {
  private readonly storage: Record<string, unknown>;

  constructor() {
    this.storage = {};
  }

  public get<T = Maybe<string>>(key: string): Promise<T> | T {
    const item = this.storage[key];
    return item as T;
  }

  public set(key: string, value: unknown) {
    this.storage[key] = value;
  }

  public remove(key: string): void | Promise<void> {
    delete this.storage[key];
  }
}
