import { Asset, ISmartWallet, SmartWalletVersion } from './types';
import { DittoContract } from '../../blockchain/contracts/types';
import { DittoProvider } from '../../provider/types';
import VaultFactoryABI from '../../blockchain/abi/VaultFactoryABI.json';
import VaultAbi from '../../blockchain/abi/VaultABI.json';
import { SmartWalletWithIdExistsError } from './errors/SmartWalletWithIdExistsError';
import { Address, Chain, isAddressesEqual } from '../../ditto-sdk';
import { config } from '../../config/config';
import { Maybe, Nullable } from '../../types';
import { SmartWalletNotDeployedError } from './errors/SmartWalletNotDeployedError';

export class SmartWallet implements ISmartWallet {
  private readonly vaultFactoryContract: DittoContract;
  private _vaultContract: Nullable<DittoContract> = null;

  private get vaultContract(): DittoContract {
    if (!this.address) {
      throw new SmartWalletNotDeployedError();
    }

    if (!this._vaultContract) {
      this._vaultContract = this.provider
        .getContractFactory()
        .getContract(this.address, JSON.stringify(VaultAbi));
    }

    return this._vaultContract;
  }

  constructor(
    private readonly provider: DittoProvider,
    private readonly chainId: Chain,
    private readonly version: SmartWalletVersion,
    private readonly address: Maybe<Address>,
    private readonly id: number
  ) {
    this.vaultFactoryContract = this.provider
      .getContractFactory()
      .getContract(config.vaultFactoryAddresses[this.chainId], JSON.stringify(VaultFactoryABI));
  }

  public static async getVersionAndIdByAddress(
    vaultAddress: Address,
    provider: DittoProvider,
    chainId: Chain
  ): Promise<{ version: SmartWalletVersion; id: number }> {
    const vaultContract = provider
      .getContractFactory()
      .getContract(vaultAddress, JSON.stringify(VaultAbi));

    const implementationAddress = await vaultContract.call<Address>('getImplementationAddress');
    const implementations = config.vaultImplementations[chainId];
    const version = (implementations.findIndex((implementation) =>
      isAddressesEqual(implementation, implementationAddress)
    ) + 1) as SmartWalletVersion;

    const [_, id] = await vaultContract.call<[Address, bigint], []>('creatorAndId');

    return { version, id: Number(id) };
  }

  public async deploy(): Promise<boolean> {
    const isVaultExists = await this.isVaultExists();

    if (isVaultExists) {
      throw new SmartWalletWithIdExistsError(this.id);
    }

    await this.vaultFactoryContract.call<{ wait: () => Promise<unknown> }, unknown[]>(
      'deploy',
      this.version,
      this.id
    );

    return true;
  }

  public deposit(assetId: string, amount: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public getAddress(): Maybe<Address> {
    return this.address;
  }

  public getAssets(): Asset[] {
    throw new Error('Method not implemented.');
  }

  public async getMaximumVersion(): Promise<SmartWalletVersion> {
    const version = await this.vaultFactoryContract.call<bigint, unknown[]>('versions');
    return Number(version) as SmartWalletVersion;
  }

  public getBalance(): Asset {
    throw new Error('Method not implemented.');
  }

  public getName(): string {
    throw new Error('Method not implemented.');
  }

  public async getVersion(): Promise<SmartWalletVersion> {
    // getImplementationAddress returns address of implementation that you should use for getting version
    // from predefined array
    const implementationAddress = (await this.vaultContract.call(
      'getImplementationAddress'
    )) as Address;
    const implementations = config.vaultImplementations[this.chainId];

    return (implementations.findIndex((implementation) =>
      isAddressesEqual(implementation, implementationAddress)
    ) + 1) as SmartWalletVersion;
  }

  public hide(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public async isDeployed(): Promise<boolean> {
    return this.isVaultExists();
  }

  public rename(name: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public show(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public upgrade(version: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public withdraw(assetID: string, amount: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  private async isVaultExists(): Promise<boolean> {
    let exist = false;

    try {
      await this.vaultFactoryContract.estimateGas('deploy', [this.version, this.id]);
    } catch (_) {
      exist = true;
    }

    return exist;
  }
}
