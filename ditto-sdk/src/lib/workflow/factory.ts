import {
  Actions,
  Factory as IWorkflowFactory,
  PaginationParams,
  Trigger,
  Workflow,
  WorkflowStatus,
} from './types';
import { DittoProvider } from '../provider/types';
import { WorkflowApiClient } from '../api-client/workflow-api-client';
import { Execution } from './dto/execution.dto';

export class WorkflowsFactory implements IWorkflowFactory {
  private readonly apiClient: WorkflowApiClient;

  constructor(provider: DittoProvider) {
    this.apiClient = new WorkflowApiClient(provider.getHttpClient(), provider.getStorage());
  }

  public create(
    name: string,
    triggers: Trigger[],
    actions: Actions[],
    chainId: number
  ): Promise<Workflow> {
    throw new Error('Method not implemented.');
  }

  public async getById(id: string): Promise<Workflow> {
    const result = await this.apiClient.getWorkflow(id);

    return result as unknown as Workflow;
  }

  public getCountByStatus(status: WorkflowStatus): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public getHistory(_pagination: PaginationParams): Promise<Execution[]> {
    return this.apiClient.getWorkflows();
  }

  public async getList(
    statuses: WorkflowStatus[],
    pagination: PaginationParams
  ): Promise<Workflow[]> {
    throw new Error('Method not implemented.');
  }
}
