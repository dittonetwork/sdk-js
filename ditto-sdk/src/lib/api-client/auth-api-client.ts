import { AuthNonce } from './types';
import { BaseApiClient } from './base-api-client';
import { WalletAddress } from '../types';

export class AuthApiClient extends BaseApiClient {
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
}
