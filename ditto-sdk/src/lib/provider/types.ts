interface DittoProvider {
  constructor(config: DittoProviderConfig): void;

  authenticate(): Promise<boolean>;

  getStorage(): DittoStorage;
  getHttpClient(): HttpClient;
}

interface DittoProviderConfig {
  signer: Signer;
  storage: DittoStorage;
  httpClient: HttpClient;
}
