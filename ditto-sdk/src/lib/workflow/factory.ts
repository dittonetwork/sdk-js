import {
  Factory as IWorkflowFactory,
  PaginationParams,
  DittoWorkflow,
  WorkflowInitOptions,
  WorkflowStatus,
} from './types';
import { DittoProvider } from '../provider/types';
import { Execution } from './execution';
import { Workflow } from './workflow';
import { WorkflowApiClient } from '../network/api-client/workflow-api-client';

export class WorkflowsFactory implements IWorkflowFactory {
  private readonly apiClient: WorkflowApiClient;

  constructor(private readonly provider: DittoProvider) {
    this.apiClient = new WorkflowApiClient(provider.getHttpClient(), provider.getStorage());
  }

  public create(options: WorkflowInitOptions): Promise<DittoWorkflow> {
    const wf = new Workflow(this.provider.getSigner(), options);

    return Promise.resolve(wf);
  }

  public async getById(id: string): Promise<DittoWorkflow> {
    const result = await this.apiClient.getWorkflow(id);

    return result as unknown as DittoWorkflow;
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
  ): Promise<DittoWorkflow[]> {
    throw new Error('Method not implemented.');
  }
}