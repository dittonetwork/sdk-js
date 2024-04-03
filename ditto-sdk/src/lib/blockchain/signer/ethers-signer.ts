import { JsonRpcSigner, Transaction } from 'ethers';
import { DittoSigner } from './types';
import { TxHash, WalletAddress } from '../../types';

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

  public getRawSigner(): JsonRpcSigner {
    return this.ethersSigner;
  }
}
