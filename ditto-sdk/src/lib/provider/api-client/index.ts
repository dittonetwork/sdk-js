import { AuthNonce, JSONBody } from './types';
import { DittoHttpClient } from '../../http-client';
import { Maybe, WalletAddress } from '../../types';
import { DittoStorage } from '../../storage/types';

export class DittoApiClient {
  constructor(
    private readonly httpClient: DittoHttpClient,
    private readonly storage: DittoStorage
  ) {}

  public async getAuthNonce(walletAddress: WalletAddress): Promise<AuthNonce> {
    const { nonce } = await this.doGet<{ nonce: string }>('/authentication/nonce', {
      walletAddress,
    });
    return nonce;
  }

  public async getAccessToken(
    signedMessage: string,
    walletAddress: WalletAddress
  ): Promise<string> {
    const { accessToken } = await this.doPost<{ accessToken: string }>('/authentication/verify', {
      signature: signedMessage,
      walletAddress,
    });

    return accessToken;
  }

  private async doGet<T>(path: string, query: Record<string, string>): Promise<T> {
    const accessToken = await this.getAuthKey();
    const response = await this.httpClient.get(
      `${path}?${Object.entries(query).reduce(
        (acc, item) =>
          acc.length === 0 ? `${item[0]}=${item[1]}` : `${acc}&${item[0]}=${item[1]}`,
        ''
      )}`,
      {
        headers: {
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
      }
    );

    const result = await response.json();

    return result as T;
  }

  private async doPost<T, P = JSONBody>(path: string, body: P): Promise<T> {
    const accessToken = await this.getAuthKey();
    const response = await this.httpClient.post(path, {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: accessToken } : {}),
      },
    });

    const result = await response.json();

    return result as T;
  }

  private async getAuthKey(): Promise<Maybe<string>> {
    const authKeyRaw = this.storage.get('access-token');
    if (authKeyRaw instanceof Promise) {
      return await authKeyRaw;
    }

    if (typeof authKeyRaw === 'string') {
      return authKeyRaw;
    }

    return undefined;
  }
}
