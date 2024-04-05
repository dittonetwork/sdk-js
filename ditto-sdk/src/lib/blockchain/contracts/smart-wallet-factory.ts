import { DittoProvider } from '../../provider/types';
import { DittoContract } from './types';
import { DittoSigner } from '../signer/types';
import { smartWalletfactoryAbi } from '../abi';

const DEFAULT_FACTORY_ADDRESS = "0xaB5F025297E40bd5ECf340d1709008eFF230C6cA";

export class SmartWalletFactory {
  private _contract!: DittoContract;
  private _vaultId = 1; 
  private _factoryAddress = DEFAULT_FACTORY_ADDRESS;
  private _abi = smartWalletfactoryAbi;

  constructor(private readonly provider: DittoProvider, private readonly signer: DittoSigner) {
    this._contract = this.provider.getContractFactory().getContract(this._factoryAddress, JSON.stringify(this._abi));
  }

  public async predictVaultAddress() {
    const address = await this.signer.getAddress();
    return this._contract.call('predictDeterministicVaultAddress', [address, this._vaultId])
  }

  public async deploy() {
    return this._contract.call('deploy', [this._vaultId])
  }

  // TODO: list
}
