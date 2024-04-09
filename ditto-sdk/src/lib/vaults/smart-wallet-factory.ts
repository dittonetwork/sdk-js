import VaultFactoryABI from '../blockchain/abi/VaultFactoryABI.json';
import { DittoContract } from '../blockchain/contracts/types';
import { DittoProvider } from '../provider/types';
import { Chain } from '../ditto-sdk';
import { dittoSmartWalletFactoryAddresses } from '../blockchain/addresses/smart-wallet-factory';
import { AccountApiClient } from './account-api-client';
import { pathOr } from 'rambda';

export class SmartWalletFactory {
  private _contract!: DittoContract;
  // TODO: restore previous smart wallet index
  private _vaultId = 1;

  private readonly apiClient: AccountApiClient;

  constructor(private readonly provider: DittoProvider, chain: Chain) {
    const factoryAddress = this.getFactoryAddress(chain);
    this._contract = this.provider
      .getContractFactory()
      .getContract(factoryAddress, JSON.stringify(VaultFactoryABI));

    this.apiClient = new AccountApiClient(provider.getHttpClient(), provider.getStorage());
  }

  public getFactoryAddress(chain: Chain) {
    return dittoSmartWalletFactoryAddresses[chain];
  }

  public async predictVaultAddress(): Promise<string> {
    const address = await this.provider.getSigner().getAddress();
    return this._contract.call('predictDeterministicVaultAddress', address, this._vaultId);
  }

  public deploy(id = 1) {
    return this._contract.call<{ wait: () => Promise<unknown> }, unknown[]>('deploy', 3, id);
  }

  public list(chain: Chain) {
    return this.apiClient.getVaults(chain);
  }

  public async getDefaultOrCreateVault(chain: Chain) {
    const vaults = await this.list(chain);
    const predictedAddress = await this.predictVaultAddress();

    if (vaults.length > 0) {
      return vaults[0];
    }

    let estimated = -1;
    try {
      estimated = await this._contract.estimateGas('deploy', [3, vaults.length + 1]);
    } catch (_) {
      //
    }

    // estimation of deploy is failed due to vault with id exists
    if (estimated === -1) {
      // if predicted is not in list, link it with account
      if (!vaults.find((v) => v.address === predictedAddress)) {
        const accountAddress = await this.provider.getSigner().getAddress();
        await this.apiClient.linkVault(chain, predictedAddress, accountAddress);
        const newVaults = await this.list(chain);
        return newVaults[0];
      }
    }

    const tx = await this.deploy(1);
    const receipt = await tx.wait();

    const vaultId = pathOr(null, ['events', 1, 'args', 1], receipt);
    if (!vaultId) {
      throw new Error('Vault not created');
    }

    const accountAddress = await this.provider.getSigner().getAddress();
    await this.apiClient.linkVault(Chain.Polygon, vaultId, accountAddress);

    const newVaults = await this.list(chain);
    return newVaults[0];
  }
}
