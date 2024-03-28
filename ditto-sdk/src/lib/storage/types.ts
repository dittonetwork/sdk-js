interface DittoStorage {
  set(key: string, value: string): void | Promise<void>;
  get<T = Optional<string>>(key: string): T | Promise<T>;
  remove(key: string): void | Promise<void>;
}
