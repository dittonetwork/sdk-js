import { ethers } from 'ethers';
import { EthersContract } from './ethers-contract';
import { EthersContractInterface } from './ethers-contract-interface';
import { Address } from '@ditto-network/core';
import { ContractFactory } from '@ditto-network/core';

export class EthersContractFactory
  implements ContractFactory<EthersContract, EthersContractInterface>
{
  constructor(private readonly signer: ethers.Signer | ethers.Wallet) {}

  public getContract(address: Address, abi: string) {
    return new EthersContract(address, abi, this.signer);
  }

  public getContractInterface(abi: string) {
    return new EthersContractInterface(abi);
  }
}
