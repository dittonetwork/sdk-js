import { Signer, Transaction, BrowserProvider, Wallet } from 'ethers';
import { Address, TxHash, DittoSigner } from '@ditto-network/core';

export class EthersSigner implements DittoSigner {
  constructor(private readonly ethersSigner: Signer | Wallet) {}

  public async getAddress(): Promise<Address> {
    const address = await this.ethersSigner.getAddress();
    return address as Address;
  }

  public async sendTransaction(
    tx: Transaction
  ): Promise<{ hash: TxHash; wait: () => Promise<unknown> }> {
    const { hash, wait } = await this.ethersSigner.sendTransaction(tx);
    return { hash, wait };
  }

  public signMessage(message: string): Promise<string> {
    return this.ethersSigner.signMessage(message);
  }

  public getRawSigner(): Signer {
    return this.ethersSigner;
  }

  public async getBalance(address: Address): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const balance = await new BrowserProvider(window.ethereum).getBalance(address);
    return balance.toString();
  }
}
