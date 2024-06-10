import VaultFactoryABI from '../blockchain/abi/VaultFactoryABI.json';
import { DittoProvider } from '../provider/types';
import { AccountApiClient } from './account-api-client';
import { pathOr } from 'rambda';
import { Factory } from './types';
import { SmartWallet } from './smart-wallet/smart-wallet';
import { SmartWalletVersion } from './smart-wallet/types';
import { SmartWalletCreationError } from './smart-wallet/errors/SmartWalletCreationError';
import { config } from '../config/config';
import { Chain } from '../blockchain/chains/types';
import { Address, Maybe, MutationTransactionReturnType } from '../types';
import { DittoContract } from '../contracts/types';

export class SmartWalletFactory implements Factory {
  private readonly apiClient: AccountApiClient;

  private chainToContractMap: Partial<{ [key in Chain]: DittoContract }> = {
    //
  };

  constructor(private readonly provider: DittoProvider) {
    this.apiClient = new AccountApiClient(provider.getHttpClient(), provider.getStorage());
  }

  public getContractAddress(chainId: number): Address {
    const address = config.vaultFactoryAddresses[chainId as Chain];
    
    if (!address) {
      throw new Error(`Vault factory address for chain ${chainId} not found`);
    }
    
    return address;
  }

  public async deploy(id: number, chainId: Chain, version: SmartWalletVersion = 3) {
    const isVaultExists = await this.isVaultWithIdExists(id, chainId);

    if (isVaultExists) {
      throw new Error(`Vault with id=${id} already exists`);
    }

    return this.getContract(chainId).call<MutationTransactionReturnType, unknown[]>('deploy', [
      version,
      id,
    ]);
  }

  public async list(chainId: Chain): Promise<SmartWallet[]> {
    const vaults = await this.apiClient.getVaults(chainId);

    const promises = await Promise.allSettled(
      vaults.map(async (item) => {
        const { id, version } = await SmartWallet.getVersionAndIdByAddress(
          item.address,
          this.provider,
          item.chainId
        );

        return new SmartWallet(this.provider, chainId, version, item.address, id);
      })
    );

    return promises
      .filter((promise) => promise.status === 'fulfilled')
      .map((promise) => (promise as PromiseFulfilledResult<SmartWallet>).value);
  }

  public async getDefaultOrCreateVault(chainId: Chain, defaultId = 1): Promise<SmartWallet> {
    const accountAddress = await this.provider.getSigner().getAddress();

    const defaultVault = await this.fetchFirstVault(chainId);
    if (defaultVault) {
      return defaultVault;
    }

    const vaultWithDefaultIdExists = await this.isVaultWithIdExists(defaultId, chainId);
    if (vaultWithDefaultIdExists) {
      // predicted is not in list, but exists, link it with account
      const predictedAddress = await this.predictVaultAddress(accountAddress, chainId, defaultId);
      await this.apiClient.linkVault(chainId, predictedAddress, accountAddress);

      const firstVault = await this.fetchFirstVault(chainId);
      return firstVault!;
    }

    const tx = await this.deploy(defaultId, chainId);
    const receipt = await tx.wait();

    const vaultAddress = pathOr(null, ['events', 1, 'args', 1], receipt);
    if (!vaultAddress) {
      throw new SmartWalletCreationError();
    }

    await this.apiClient.linkVault(chainId, vaultAddress, accountAddress);

    const firstVault = await this.fetchFirstVault(chainId);
    return firstVault!;
  }

  public async getVaultAddress(chainId: Chain, defaultId = 1): Promise<Address> {
    const accountAddress = await this.provider.getSigner().getAddress();
    return this.predictVaultAddress(accountAddress, chainId, defaultId);
  }

  public getByAddress(_chainId: Chain, _address: string): Promise<SmartWallet> {
    throw new Error('Method not implemented.');
  }

  public async createVault(chainId: Chain, vaultId: number, version: SmartWalletVersion = 3): Promise<SmartWallet> {
    const accountAddress = await this.provider.getSigner().getAddress();

    // Check if the vault already exists
    const isVaultExists = await this.isVaultWithIdExists(vaultId, chainId);
    if (isVaultExists) {
      throw new Error(`Vault with id=${vaultId} already exists`);
    }

    // Deploy the vault
    const tx = await this.deploy(vaultId, chainId, version);
    const receipt = await tx.wait();

    // Get the vault address from the receipt
    const vaultAddress = pathOr(null, ['events', 1, 'args', 1], receipt);
    if (!vaultAddress) {
      throw new SmartWalletCreationError();
    }

    // Link the vault to the account
    await this.apiClient.linkVault(chainId, vaultAddress, accountAddress);

    // Return the new SmartWallet instance
    return new SmartWallet(this.provider, chainId, version, vaultAddress, vaultId);
  }

  private getContract(chainId: Chain): DittoContract {
    if (!this.chainToContractMap[chainId]) {
      this.chainToContractMap[chainId] = this.provider
        .getContractFactory()
        .getContract(config.vaultFactoryAddresses[chainId], JSON.stringify(VaultFactoryABI));
    }

    return this.chainToContractMap[chainId]!;
  }

  private predictVaultAddress(
    accountAddress: Address,
    chainId: Chain,
    vaultId: number
  ): Promise<Address> {
    return this.getContract(chainId).call('predictDeterministicVaultAddress', [
      accountAddress,
      vaultId,
    ]);
  }

  private async fetchFirstVault(chainId: Chain): Promise<Maybe<SmartWallet>> {
    const list = await this.list(chainId);
    return list[0];
  }

  private async isVaultWithIdExists(id: number, chainId: Chain): Promise<boolean> {
    let exist = false;

    try {
      await this.getContract(chainId).estimateGas('deploy', [3, id]);
    } catch (_) {
      exist = true;
    }

    return exist;
  }

  // TODO: Get the next available vault ID for the account from the contract
  // when supported by the contract
  public async getNextVaultId(chainId: Chain): Promise<number> {
    const accountAddress = await this.provider.getSigner().getAddress();

    const events = await this.getContract(chainId).getPastEvents('VaultCreated', {
      fromBlock: 0,
      toBlock: 'latest'
    });
    const relatedEvents = events.filter(event => event.args[0] === accountAddress);

    let highestVaultId = 0;
    relatedEvents.forEach((event) => {
      const vaultId = parseInt(event.args[2], 10);
      if (vaultId > highestVaultId) {
        highestVaultId = vaultId;
      }
    });

    return highestVaultId + 1;
  }
}
