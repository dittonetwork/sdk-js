import { DittoProvider, DittoProviderConfig } from './types';
import { DittoStorage } from '../storage/types';
import { DittoHttpClient } from '../http-client';
import { HttpClient } from '../http-client/types';
import { DittoSigner } from '../signer/types';
import { ContractFactory, DittoContract } from '../contracts/types';
import { AuthApiClient } from '../api-client/auth-api-client';
import { VoidStorage } from '../storage/void-storage';

export class Provider implements DittoProvider {
  private readonly httpClient: DittoHttpClient;
  private readonly authApiClient: AuthApiClient;

  private readonly signer: DittoSigner;

  private readonly storage: DittoStorage;

  private readonly contractFactory: ContractFactory<DittoContract>;

  constructor(private readonly config: DittoProviderConfig) {
    this.storage = config.storage;

    this.httpClient = new DittoHttpClient();
    this.authApiClient = new AuthApiClient(this.httpClient, new VoidStorage());

    this.signer = config.signer;
    this.contractFactory = config.contractFactory;
  }

  public async authenticate(): Promise<boolean> {
    const walletAddress = await this.signer.getAddress();

    const nonce = await this.authApiClient.getAuthNonce(walletAddress);
    const signedMessage = await this.signer.signMessage(nonce);
    const accessToken = await this.authApiClient.getAccessToken(signedMessage, walletAddress);

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
