import {
  Address,
  DittoSigner,
  MutationTransactionReturnType,
  Transaction,
} from '@ditto-network/core';
import { Web3 } from 'web3';
import { webPromiEventToTxPromise } from '../utils/web-promi-event-to-tx-promise';
import { PayableCallOptions } from 'web3-types';

export class Web3jsSigner implements DittoSigner {
  constructor(
    private readonly web3: Web3,
    private readonly address: Address,
    private readonly txParamsDecorator: () => Promise<PayableCallOptions> = async () => ({})
  ) {}

  public getAddress(): Promise<Address> {
    return Promise.resolve(this.address);
  }

  public async getBalance(address: Address): Promise<string> {
    const balance = await this.web3.eth.getBalance(address);
    return balance.toString();
  }

  public async sendTransaction(tx: Transaction): Promise<MutationTransactionReturnType> {
    const txParams = await this.txParamsDecorator();

    const enrichedTx = {
      type: BigInt(2),
      ...txParams,
      ...tx,
    };

    return webPromiEventToTxPromise(
      this.web3.eth.sendTransaction({
        ...enrichedTx,
        gas: await this.web3.eth.estimateGas(enrichedTx),
      })
    );
  }

  public async signMessage(message: string): Promise<string> {
    const address = await this.getAddress();

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const signedMessage = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      if (typeof signedMessage === 'string') {
        return signedMessage;
      }

      return signedMessage as string;
    }

    const signedMessage = await this.web3.eth.sign(this.web3.utils.asciiToHex(message), address);

    if (typeof signedMessage === 'string') {
      return signedMessage;
    }

    return signedMessage.signature as string;
  }
}
