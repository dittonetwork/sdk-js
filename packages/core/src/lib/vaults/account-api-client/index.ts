import { Chain } from '../../blockchain/chains/types';
import { BaseApiClient } from '../../network/api-client/base-api-client';
import { FullData, VaultDto } from './types';
import { omit } from 'rambda';
import { Address } from '../../types';

export class AccountApiClient extends BaseApiClient {
  public getFullData() {
    return this.doGet<FullData>('/user/full-data');
  }

  public async getVaults(chainId: Chain): Promise<VaultDto[]> {
    const fullData = await this.getFullData();

    return fullData.accounts
      .map((account) =>
        account.vaults.map((vault, idx) => ({
          ...omit(['id'], vault),
          id: idx,
          uuid: vault.id,
          ownerAddress: account.address as Address,
        }))
      )
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
