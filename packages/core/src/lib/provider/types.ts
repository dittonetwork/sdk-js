import { DittoStorage } from '../storage/types';
import { HttpClient } from '../network/http-client/types';
import { DittoSigner } from '../signer/types';
import { ContractFactory, DittoContract, DittoContractInterface } from '../contracts/types';

export interface DittoProvider {
  authenticate(): Promise<boolean>;
  needAuthentication(): Promise<boolean>;

  getSigner(): DittoSigner;
  getStorage(): DittoStorage;
  getHttpClient(): HttpClient;
  getContractFactory(): ContractFactory<DittoContract, DittoContractInterface>;
}

export interface DittoProviderConfig {
  signer: DittoSigner;
  storage: DittoStorage;
  contractFactory: ContractFactory<DittoContract, DittoContractInterface>;
}
