import { EthersSigner } from './signer';
import { Provider } from './provider';
import { BrowserStorage } from './storage';

export function dittoSdk(): string {
  return 'ditto-sdk';
}

export { EthersSigner, Provider, BrowserStorage };
