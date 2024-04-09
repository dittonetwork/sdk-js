import { BaseApiClient } from '../../network/api-client/base-api-client';
import { FullData, Vault } from './types';
import { Chain } from '../../ditto-sdk';

export class AccountApiClient extends BaseApiClient {
  public getFullData() {
    return this.doGet<FullData>('/user/full-data');
  }

  public async getVaults(chainId: Chain): Promise<Vault[]> {
    const fullData = await this.getFullData();

    return fullData.accounts
      .map((account) => account.vaults)
      .flat()
      .filter((item) => item.chainId === chainId);
  }

  public async linkVault(chainId: Chain, vaultAddress: string, accountAddress: string) {
    return this.doPost('/vault/add-deployed', {
      chainId,
      vaultAddress,
      accountAddress,
    });
  }
}
