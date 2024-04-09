import { DittoStorage } from '../storage/types';
import {
  ContractFactory,
  DittoContract,
  DittoContractInterface,
} from '../blockchain/contracts/types';
import { HttpClient } from '../network/http-client/types';
import { DittoSigner } from '../blockchain/signer/types';

export interface DittoProvider {
  authenticate(): Promise<boolean>;
  needAuthentication(): Promise<boolean>;

  getStorage(): DittoStorage;
  getHttpClient(): HttpClient;
  getContractFactory(): ContractFactory<DittoContract, DittoContractInterface>;
  getSigner(): DittoSigner;
}

export interface DittoProviderConfig {
  signer: DittoSigner;
  storage: DittoStorage;
  contractFactory: ContractFactory<DittoContract, DittoContractInterface>;
}
