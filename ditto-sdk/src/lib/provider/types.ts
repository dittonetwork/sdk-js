import { EthersSigner } from '../ditto-sdk';
import { DittoStorage } from '../storage/types';
import { HttpClient } from '../http-client/types';
import { ContractFactory, DittoContract } from '../contracts/types';
import { DittoSigner } from '../signer/types';

export interface DittoProvider {
  // @todo add typing for constructor

  authenticate(): Promise<boolean>;

  getSigner(): DittoSigner;
  getStorage(): DittoStorage;
  getHttpClient(): HttpClient;
  getContractFactory(): ContractFactory<DittoContract>;
}

export interface DittoProviderConfig {
  signer: EthersSigner;
  storage: DittoStorage;
  contractFactory: ContractFactory<DittoContract>;
}
