import { Account, createPublicClient, createWalletClient, http, encodeFunctionData } from 'viem';
import { polygon } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts'
import { AbstractAdapter, ContractCallParams } from './abstract';

export class ViemAdapter extends AbstractAdapter {
  private publicClient: ReturnType<typeof createPublicClient>;
  private walletClient: ReturnType<typeof createWalletClient>;
  private account: Account;

  constructor(providerUrl: string, privateKey: string) {
    super();
    let pk = privateKey as `0x${string}`;
    this.publicClient = createPublicClient({
      chain: polygon,
      transport: http(providerUrl),
    });
    if (!pk.startsWith('0x')) pk = '0x' + pk as `0x${string}`;
    const account = privateKeyToAccount(pk);
    if (!account) throw new Error('Invalid private key');
    this.walletClient = createWalletClient({
      account,
      chain: polygon,
      transport: http(providerUrl),
    });
    this.account = account;
  }

  async getAddress() {
    return this.account.address;
  }

  async getChainId(): Promise<string> {
    const chainId = await this.publicClient.getChainId();
    return chainId.toString();
  }

  async readContract({ address, abi, method, args }: ContractCallParams): Promise<any> {
    const result = await this.publicClient.readContract({
      address: address as `0x${string}`,
      abi: abi,
      functionName: method as string,
      args: args,
    });
    return result;
  }

  async writeContract({ address, abi, method, args }: ContractCallParams): Promise<any> {
    const result = await this.walletClient.writeContract({
      address: address as `0x${string}`,
      chain: polygon,
      abi: abi,
      functionName: method as string,
      args: args,
      account: this.account,
    });
    return result;
  }

  async simulateContract({ address, abi, method, args }: ContractCallParams): Promise<any> {
    const {result} = await this.publicClient.simulateContract({
      address: address as `0x${string}`,
      abi: abi,
      functionName: method as string,
      args: args,
      account: this.account,
      chain: polygon,
    });
    return result;
  }

  encodeFunctionCall(abi: any, method: string, args: any[]): string {
    const functionData = encodeFunctionData({
      abi,
      functionName: method,
      args,
    });
    return functionData;
  }

  async estimateGas({ address, abi, method, args }: ContractCallParams) {
    const data = this.encodeFunctionCall(abi, method, args) as `0x${string}`;
    return this.publicClient.estimateGas({
      data,
      account: this.account.address,
      to: address as `0x${string}`,
      value: BigInt(0),
    });
  }
}
