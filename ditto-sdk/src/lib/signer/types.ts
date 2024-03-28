interface Signer {
  getAddress(): Promise<WalletAddress>;
  sendTransaction(tx: Transaction): Promise<TxHash>;
  signMessage(message: string): Promise<string>;
}
