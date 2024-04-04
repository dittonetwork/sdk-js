import { ContractFactory } from '../types';
import { ethers } from 'ethers';
import { EthersContract } from './ethers-contract';
import { WalletAddress } from '../../types';

export class EthersContractFactory implements ContractFactory<EthersContract> {
  constructor(
    private readonly ethersContractClass: typeof ethers.Contract,
    private readonly signer: ethers.Signer
  ) {}

  public getContract(address: WalletAddress, abi: string) {
    const contract = new this.ethersContractClass(address, abi, this.signer);
    return new EthersContract(contract);
  }
}
