import { ethers } from 'ethers';

import { AbstractAdapter, ContractCallParams } from './abstract';


export class EthersAdapter extends AbstractAdapter {
  provider: ethers.JsonRpcProvider;
  signer: ethers.Signer;

  constructor(providerUrl: string, privateKey: string) {
    super();
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  async getAddress() {
    return this.signer.getAddress();
  }

  async getChainId() {
    return String((await this.provider.getNetwork())?.chainId);
  }

  async readContract({ address, abi, method, args }: ContractCallParams) {
    const contract = new ethers.Contract(address, abi, this.provider);
    return contract[method](...args);
  }

  async writeContract({ address, abi, method, args }: ContractCallParams) {
    const contract = new ethers.Contract(address, abi, this.signer);
    const tx = await contract[method](...args);
    return tx.wait();
  }
  
  async simulateContract({ address, abi, method, args }: ContractCallParams) {
    const contract = new ethers.Contract(address, abi, this.signer);
    return contract[method].staticCall(...args);
  }
}
