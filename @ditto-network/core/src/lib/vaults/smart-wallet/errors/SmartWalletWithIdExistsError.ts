export class SmartWalletWithIdExistsError extends Error {
  constructor(id: number) {
    super(`Vault with id=${id} already exists`);
  }
}
