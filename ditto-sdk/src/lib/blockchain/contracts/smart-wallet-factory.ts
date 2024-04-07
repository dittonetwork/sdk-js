import { DittoProvider } from '../../provider/types';
import { DittoContract } from './types';
import { smartWalletfactoryAbi } from '../abi';
import { dittoSmartWalletFactoryAddresses } from '../addresses/smart-wallet-factory';
import { Chain } from '../chains/types';

export class SmartWalletFactory {
  private _contract!: DittoContract;
  // TODO: restore previous smart wallet index
  private _vaultId = 1;
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

  public async predictVaultAddress() {
    const address = await this.provider.getSigner().getAddress();
    return this._contract.call('predictDeterministicVaultAddress', [address, this._vaultId])
  }

  public async deploy() {
    // TODO: add deploy logic
    throw new Error('Method not implemented.');
  }

  // TODO: list
}
