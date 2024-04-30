import { DittoProvider, DittoProviderConfig } from './types';
import { DittoStorage } from '../storage/types';
import { VoidStorage } from '../storage/void-storage';
import { DittoHttpClient } from '../network/http-client';
import { AuthApiClient } from '../network/api-client/auth-api-client';
import { HttpClient } from '../network/http-client/types';
import { isJwtValid } from '../utils/is-jwt-valid';
import { ACCESS_TOKEN_KEY } from '../constants';
import { DittoSigner } from '../signer/types';
import { ContractFactory, DittoContract, DittoContractInterface } from '../contracts/types';

export class Provider implements DittoProvider {
  private readonly httpClient: DittoHttpClient;
  private readonly authApiClient: AuthApiClient;
  private readonly signer: DittoSigner;
  private readonly storage: DittoStorage;
  private readonly contractFactory: ContractFactory<DittoContract, DittoContractInterface>;

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

    this.storage.set(ACCESS_TOKEN_KEY, accessToken);

    return true;
  }

  public getSigner(): DittoSigner {
    return this.signer;
  }

  public async needAuthentication(): Promise<boolean> {
    const accessTokenRaw = this.storage.get(ACCESS_TOKEN_KEY);
    const accessToken = accessTokenRaw instanceof Promise ? await accessTokenRaw : accessTokenRaw;

    return !isJwtValid(accessToken);
  }

  public getStorage(): DittoStorage {
    return this.config.storage;
  }

  public getHttpClient(): HttpClient {
    return this.httpClient;
  }

  public getContractFactory(): ContractFactory<DittoContract, DittoContractInterface> {
    return this.contractFactory;
  }
}
