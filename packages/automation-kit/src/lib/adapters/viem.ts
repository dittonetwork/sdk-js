import { Account, createPublicClient, createWalletClient, http } from 'viem';
import { polygon } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts'
import { AbstractAdapter, ContractCallParams } from './abstract';

export class ViemAdapter extends AbstractAdapter {
  private client: ReturnType<typeof createPublicClient>;
  private walletClient: ReturnType<typeof createWalletClient>;
  private account: Account;

  constructor(providerUrl: string, privateKey: string) {
    super();
    let pk = privateKey as `0x${string}`;
    this.client = createPublicClient({
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
    const chainId = await this.client.getChainId();
    return chainId.toString();
  }

  async contractCall({ address, abi, method, args }: ContractCallParams): Promise<any> {
    const result = await this.client.readContract({
      address: address as `0x${string}`,
      abi: abi,
      functionName: method as string,
      args: args,
    });
    return result;
  }

  async sendTransaction({ address, abi, method, args }: ContractCallParams): Promise<any> {
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
}
