import { DittoProvider, DittoProviderConfig } from './types';
import { DittoStorage } from '../storage/types';
import { DittoHttpClient } from '../http-client';
import { HttpClient } from '../http-client/types';
import { DittoSigner } from '../signer/types';
import { ContractFactory, DittoContract } from '../contracts/types';

export class Provider implements DittoProvider {
  private readonly httpClient: DittoHttpClient;

  private readonly signer: DittoSigner;

  private readonly storage: DittoStorage;

  private readonly contractFactory: ContractFactory<DittoContract>;

  constructor(private readonly config: DittoProviderConfig) {
    this.httpClient = new DittoHttpClient();
    this.signer = config.signer;
    this.storage = config.storage;
    this.contractFactory = config.contractFactory;
  }

  public async authenticate(): Promise<boolean> {
    const walletAddress = await this.signer.getAddress();

    const nonceRaw = await this.httpClient.get(
      '/authentication/nonce?walletAddress=' + walletAddress
    );
    const { nonce } = await nonceRaw.json();
    const signedMessage = await this.signer.signMessage(nonce);

    const verificationResponseRaw = await this.httpClient.post('/authentication/verify', {
      body: JSON.stringify({
        signature: signedMessage,
        walletAddress,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { accessToken } = (await verificationResponseRaw.json()) as {
      accessToken: string;
    };

    this.httpClient.setAuthKey(accessToken);

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
