import { Web3 } from 'web3';
import { PayableCallOptions } from 'web3-types';
import { Address, ContractFactory } from '@ditto-network/core';
import { Web3jsContract } from './web3js-contract';
import { Web3jsContractInterface } from './web3js-contract-interface';

export class Web3jsContractFactory
  implements ContractFactory<Web3jsContract, Web3jsContractInterface>
{
  constructor(
    private readonly web3: Web3,
    private readonly txParamsDecorator: () => Promise<PayableCallOptions> = async () => ({})
  ) {}

  public getContract(address: Address, abi: string) {
    return new Web3jsContract(address, abi, this.web3, this.txParamsDecorator);
  }

  public getContractInterface(abi: string) {
    return new Web3jsContractInterface(abi, this.web3);
  }
}
