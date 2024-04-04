export interface Execution {
  id: string;
  vaultId: string;
  constructorState: Constructor;
  triggerStates: unknown[];
  actionStates: unknown[];
  created_at: Date;
  is_public: null;
  execution_state: 'active' | 'complete' | 'error' | null;
}

interface Constructor {
  createdAt: number;
  updatedAt: number;
  automationId: string;
  automationName: string;
  automationState: ConstructorAutomationStates;
  constructorState: ConstructorState;
  taskId?: string;
  smartWalletId?: string;
  immediateDeposit?: boolean;
  oneTimeExecution?: boolean;
  triggersConfigured?: boolean;
  deployedWorkflowKey?: string;
  singleExecutionAmount?: string;
  smartWalletConfigured?: boolean;
  chainId?: string;
}

enum ConstructorAutomationStates {
  Draft = 'draft',
  Active = 'active',
  Disabled = 'disabled',
  Completed = 'completed',
}

enum ConstructorState {
  Initial,
  AutomationCreate,
  Summary,
  Final,
}
