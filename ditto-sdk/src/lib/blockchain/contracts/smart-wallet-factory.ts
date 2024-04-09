import { DittoProvider } from '../../provider/types';
import { DittoContract } from './types';
import { smartWalletfactoryAbi } from '../abi';
import { dittoSmartWalletFactoryAddresses } from '../addresses/smart-wallet-factory';
import { Chain } from '../chains/types';

export class SmartWalletFactory {
  private _contract!: DittoContract;
  private _abi = smartWalletfactoryAbi;

  constructor(private readonly provider: DittoProvider) {
    const factoryAddress = this.getFactoryAddress();
    this._contract = this.provider
      .getContractFactory()
      .getContract(factoryAddress, JSON.stringify(this._abi));
  }

  public getFactoryAddress() {
    // TODO: get network from provider
    const network = Chain.Polygon;
    return dittoSmartWalletFactoryAddresses[network];
  }

  public async predictVaultAddress(vaultId: number) {
    const address = await this.provider.getSigner().getAddress();
    return this._contract.call('predictDeterministicVaultAddress', [address, vaultId]);
  }

  public async deploy(version: number, vaultId: number) {
    return this._contract.call('deploy', [version, vaultId]);
  }

  public async addNewImplementation(newImplementation: string) {
    return this._contract.call('addNewImplementation', [newImplementation]);
  }

  public async crossChainDeploy(creator: string, version: number, vaultId: number) {
    return this._contract.call('crossChainDeploy', [creator, version, vaultId]);
  }

  public async owner() {
    return this._contract.call('owner');
  }

  public async implementation(version: number) {
    return this._contract.call('implementation', [version]);
  }

  public async versions() {
    return this._contract.call('versions');
  }

  public async renounceOwnership() {
    return this._contract.call('renounceOwnership');
  }

  public async setBridgeReceiverContract(dittoBridgeReceiver: string) {
    return this._contract.call('setBridgeReceiverContract', [dittoBridgeReceiver]);
  }

  public async setEntryPointCreatorAddress(entryPointCreator: string) {
    return this._contract.call('setEntryPointCreatorAddress', [entryPointCreator]);
  }

  public async transferOwnership(newOwner: string) {
    return this._contract.call('transferOwnership', [newOwner]);
  }

  public async upgradeLogic() {
    return this._contract.call('upgradeLogic');
  }

  public async vaultProxyAdmin() {
    return this._contract.call('vaultProxyAdmin');
  }
}
