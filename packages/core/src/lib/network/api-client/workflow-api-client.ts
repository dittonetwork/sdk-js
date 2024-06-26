import { BaseApiClient } from './base-api-client';
import { Execution } from '../../workflow/execution';

export class WorkflowApiClient extends BaseApiClient {
  public getWorkflows(): Promise<Execution[]> {
    return this.doGet<Execution[]>('/workflow/multiple');
  }

  public getWorkflow(id: string): Promise<Execution> {
    return this.doGet<Execution>(`/workflow/single/${id}`);
  }
}
