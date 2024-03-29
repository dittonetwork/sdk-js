import { EthersSigner } from '../ditto-sdk';
import { DittoStorage } from '../storage/types';
import { HttpClient } from '../http-client/types';

export interface DittoProvider {
  // @todo add typing for constructor

  authenticate(): Promise<boolean>;

  getStorage(): DittoStorage;
  getHttpClient(): HttpClient;
}

export interface DittoProviderConfig {
  signer: EthersSigner;
  storage: DittoStorage;
}
