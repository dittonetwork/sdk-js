import { DittoProvider, DittoProviderConfig } from './types';
import { DittoStorage } from '../storage/types';
import { DittoHttpClient } from '../http-client';
import { HttpClient } from '../http-client/types';
import { DittoSigner } from '../signer/types';
import { ContractFactory, DittoContract } from '../contracts/types';
import { DittoApiClient } from './api-client';

export class Provider implements DittoProvider {
  private readonly httpClient: DittoHttpClient;
  private readonly apiClient: DittoApiClient;

  private readonly signer: DittoSigner;

  private readonly storage: DittoStorage;

  private readonly contractFactory: ContractFactory<DittoContract>;

  constructor(private readonly config: DittoProviderConfig) {
    this.storage = config.storage;

    this.httpClient = new DittoHttpClient();
    this.apiClient = new DittoApiClient(this.httpClient, this.storage);

    this.signer = config.signer;
    this.contractFactory = config.contractFactory;
  }

  public async authenticate(): Promise<boolean> {
    const walletAddress = await this.signer.getAddress();

    const nonce = await this.apiClient.getAuthNonce(walletAddress);
    const signedMessage = await this.signer.signMessage(nonce);
    const accessToken = await this.apiClient.getAccessToken(signedMessage, walletAddress);

    this.storage.set('access-token', accessToken);

    return true;
  }

  public getStorage(): DittoStorage {
    return this.config.storage;
  }

  public getHttpClient(): HttpClient {
    return this.httpClient;
  }

  public getContractFactory(): ContractFactory<DittoContract> {
    return this.contractFactory;
  }
}
