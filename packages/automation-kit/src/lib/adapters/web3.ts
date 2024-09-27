import Web3 from 'web3';
import { AbstractAdapter, ContractCallParams } from './abstract';

export class Web3Adapter extends AbstractAdapter {
  web3: Web3;
  account: string;

  constructor(providerUrl: string, privateKey: string) {
    super();
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    if (!privateKey.startsWith('0x')) privateKey = '0x' + privateKey;
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
  }

  async getAddress() {
    return this.account;
  }

  async getChainId() {
    return String(await this.web3.eth.net.getId());
  }

  async readContract({ address, abi, method, args }: ContractCallParams): Promise<any> {
    const contract = new this.web3.eth.Contract(abi, address);
    const result = await contract.methods[method](...args).call();
    return result;
  }

  async writeContract({ address, abi, method, args }: ContractCallParams): Promise<any> {
    const contract = new this.web3.eth.Contract(abi, address);
    const gasEstimate = await contract.methods[method](...args).estimateGas({ from: this.account });
    const transaction = await contract.methods[method](...args).send({
      from: this.account,
      gas: String(gasEstimate),
    });
    return transaction;
  }

  async simulateContract({ address, abi, method, args }: ContractCallParams): Promise<any> {
    const contract = new this.web3.eth.Contract(abi, address);
    return contract.methods[method](...args).call({
      from: this.account
    });
  }

  encodeFunctionCall(abi: any, method: string, args: any[]): string {
    const contract = new this.web3.eth.Contract(abi);
    return contract.methods[method](...args).encodeABI();
  }

  async estimateGas({ address, abi, method, args }: ContractCallParams){
    const contract = new this.web3.eth.Contract(abi, address);
    return contract.methods[method](...args).estimateGas({ from: this.account });
  }
}
