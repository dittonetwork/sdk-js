import { JsonRpcSigner } from 'ethers';
import { Transaction, TxHash, WalletAddress } from '../types';
import { DittoSigner } from './types';

export class EthersSigner implements DittoSigner {
  constructor(private readonly ethersSigner: JsonRpcSigner) {}

  public getAddress(): Promise<WalletAddress> {
    return this.ethersSigner.getAddress();
  }

  public async sendTransaction(tx: Transaction): Promise<TxHash> {
    const { hash } = await this.ethersSigner.sendTransaction(tx);
    return hash;
  }

  public signMessage(message: string): Promise<string> {
    return this.ethersSigner.signMessage(message);
  }
}
