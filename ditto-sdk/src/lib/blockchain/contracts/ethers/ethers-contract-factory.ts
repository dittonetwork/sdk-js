import { ContractFactory } from '../types';
import { ethers } from 'ethers';
import { EthersContract } from './ethers-contract';
import { WalletAddress } from '../../../types';
import { EthersContractInterface } from './ethers-contract-interface';

export class EthersContractFactory
  implements ContractFactory<EthersContract, EthersContractInterface>
{
  constructor(private readonly signer: ethers.Signer | ethers.Wallet) {}

  public getContract(address: WalletAddress, abi: string) {
    return new EthersContract(address, abi, this.signer);
  }

  public getContractInterface(abi: string) {
    return new EthersContractInterface(abi);
  }
}
