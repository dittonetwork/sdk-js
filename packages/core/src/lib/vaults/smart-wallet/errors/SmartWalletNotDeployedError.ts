export class SmartWalletNotDeployedError extends Error {
  constructor() {
    super('Smart wallet not deployed');
  }
}
