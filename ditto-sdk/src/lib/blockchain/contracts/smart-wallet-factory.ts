import { ethers } from 'ethers';
import { WalletAddress } from '../../types';
import { abi as factoryAbi } from '../../abi/IVaultFactory.json';

import { DittoProvider } from '../../provider/types';
import { DittoContract } from './types';
import { DittoSigner } from '../signer/types';

const DEFAULT_FACTORY_ADDRESS = "0xd80372247b20Bf3D726FebfbD79Ad5145875a328";


export class SmartWalletFactoryContract {
  private _contract?: DittoContract;
  private _vaultId = 1; 
  private _factoryAddress = DEFAULT_FACTORY_ADDRESS;
  private _abi = factoryAbi;

  constructor(private readonly provider: DittoProvider, private readonly signer: DittoSigner) {}

  async init() {
    this._contract = await this.provider.getContractFactory().getContract(this._factoryAddress, this._abi);
  }

  public async predictVaultAddress() {
    if (!this._contract) {
      await this.init();
    }

    return (this._contract as any).predictDeterministicVaultAddress(
        await this.signer.getAddress(),
        this._vaultId,
    );
  }

  public async deploy() {
    if (!this._contract) {
      await this.init();
    }

    return (this._contract as any).deploy(this._vaultId);
  }
}
