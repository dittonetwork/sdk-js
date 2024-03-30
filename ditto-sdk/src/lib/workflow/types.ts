import { Execution } from './dto/execution.dto';

export enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export interface Workflow {
  deactivate(): Promise<boolean>;
  activate(): Promise<boolean>;

  isActivated(): boolean;
  getId(): string;
  getStatus(): WorkflowStatus;
}

export interface Factory {
  create(name: string, triggers: Trigger[], actions: Actions[], chainId: number): Promise<Workflow>;

  getHistory(pagination: PaginationParams): Promise<Execution[]>;
  getList(statuses: WorkflowStatus[], pagination: PaginationParams): Promise<Workflow[]>;
  getCountByStatus(status: WorkflowStatus): Promise<number>;
  getById(id: string): Promise<Workflow>;
}

export type Trigger = {
  // Need to be defined
};

export type Actions = {
  // Need to be defined
};

export type PaginationParams = {
  limit: number;
  offset: number;
};
