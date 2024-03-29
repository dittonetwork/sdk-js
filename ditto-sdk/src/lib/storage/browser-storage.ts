import { DittoStorage } from './types';
import { Maybe } from '../types';

export class BrowserStorage implements DittoStorage {
  public get<T = Maybe<string>>(key: string): Promise<T> | T {
    const item = localStorage.getItem(key);
    return item as T;
  }

  public remove(key: string): void | Promise<void> {
    localStorage.removeItem(key);
  }

  public set(key: string, value: string): void | Promise<void> {
    localStorage.setItem(key, value);
  }
}
