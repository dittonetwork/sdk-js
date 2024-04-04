import { DittoWorkflow, WorkflowInitOptions, WorkflowStatus } from './types';
import { DittoSigner } from '../blockchain/signer/types';

export class Workflow implements DittoWorkflow {
  constructor(
    private readonly signer: DittoSigner,
    private readonly options: WorkflowInitOptions
  ) {}

  public async build(): Promise<void> {
    const callData = await Promise.all([
      ...this.options.triggers.map((trigger) => trigger.build()),
      ...this.options.actions.map((action) => action.build()),
    ]);
  }

  public activate(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public deactivate(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public getId(): string {
    return '';
  }

  public getStatus(): WorkflowStatus {
    return WorkflowStatus.ACTIVE;
  }

  public isActivated(): boolean {
    return false;
  }
}
