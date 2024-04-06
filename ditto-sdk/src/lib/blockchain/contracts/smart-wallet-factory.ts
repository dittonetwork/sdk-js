import { DittoProvider } from '../../provider/types';
import { DittoContract } from './types';
import { smartWalletfactoryAbi } from '../abi';

const DEFAULT_FACTORY_ADDRESS = '0xF03C8CaB74b5721eB81210592C9B06f662e9951E';

export class SmartWalletFactory {
  private _contract!: DittoContract;
  private _vaultId = 1;
  private _factoryAddress = DEFAULT_FACTORY_ADDRESS;
  private _abi = smartWalletfactoryAbi;

  constructor(private readonly provider: DittoProvider) {
    this._contract = this.provider
      .getContractFactory()
      .getContract(this._factoryAddress, JSON.stringify(this._abi));
  }

  public async predictVaultAddress() {
    const address = await this.provider.getSigner().getAddress();
    return this._contract.call('predictDeterministicVaultAddress', [address, this._vaultId])
  }

  public async deploy() {
    return this._contract.call('deploy', [this._vaultId]);
  }

  // TODO: list
}
