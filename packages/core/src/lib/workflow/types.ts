import { Execution } from './execution';
import { CallDataBuilder } from './builders/types';
import { Chain } from '../blockchain/chains/types';
import { Address, TxHash } from '../types';

export enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export interface WorkflowInitOptions {
  name: string;
  triggers: CallDataBuilder[];
  actions: CallDataBuilder[];
  chainId: Chain;
  maxGasPrice?: number;
  maxGasLimit?: number;
}

export interface DittoWorkflow {
  buildAndDeploy(vaultAddress: Address, accountAddress: Address): Promise<TxHash>;

  deactivate(): Promise<boolean>;
  activate(): Promise<boolean>;

  isActivated(): boolean;
  getId(): string;
  getStatus(): WorkflowStatus;
}

export interface Factory {
  create(options: WorkflowInitOptions): Promise<DittoWorkflow>;

  getHistory(pagination: PaginationParams): Promise<Execution[]>;
  getList(statuses: WorkflowStatus[], pagination: PaginationParams): Promise<DittoWorkflow[]>;
  getCountByStatus(status: WorkflowStatus): Promise<number>;
  getById(id: string): Promise<DittoWorkflow>;
}

export type PaginationParams = {
  limit: number;
  offset: number;
};
