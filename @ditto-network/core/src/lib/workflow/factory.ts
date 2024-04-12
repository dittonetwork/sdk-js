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
import VaultABI from '../blockchain/abi/VaultABI.json';
import { Address, TxHash } from '../types';

export class WorkflowsFactory implements IWorkflowFactory {
  private readonly apiClient: WorkflowApiClient;

  constructor(private readonly provider: DittoProvider) {
    this.apiClient = new WorkflowApiClient(provider.getHttpClient(), provider.getStorage());
  }

  public create(options: WorkflowInitOptions): Promise<DittoWorkflow> {
    const wf = new Workflow(options, this.provider);

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

  public async deactivateWorkflow(address: Address, id: number): Promise<TxHash> {
    const vaultContract = this.provider
      .getContractFactory()
      .getContract(address, JSON.stringify(VaultABI));

    const tx = await vaultContract.call<{ hash: string }, [number]>('deactivateWorkflow', id);
    return tx.hash;
  }
}
