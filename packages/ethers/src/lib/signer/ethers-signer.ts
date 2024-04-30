import { Signer, Wallet } from 'ethers';
import {
  Address,
  DittoSigner,
  Transaction,
  MutationTransactionReturnType,
} from '@ditto-network/core';

export class EthersSigner implements DittoSigner {
  constructor(private readonly ethersSigner: Signer | Wallet) {}

  public async getAddress(): Promise<Address> {
    const address = await this.ethersSigner.getAddress();
    return address as Address;
  }

  public async sendTransaction(tx: Transaction): Promise<MutationTransactionReturnType> {
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
    const balance = await this.ethersSigner.provider!.getBalance(address);
    return balance.toString();
  }
}
