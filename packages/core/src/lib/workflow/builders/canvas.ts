import { Address, JSONObject, Nullable } from '../../types';
import { CallDataBuilder, CallDataBuilderReturnData } from './types';
import { DittoProvider } from '../../provider/types';

// классов не избежать, т.к. в дальнейшем нам надо будет параметризовать реестр классов для экшенов
// Map<string, typeof PersistentCallDataBuilder>
abstract class PersistentCallDataBuilder<T = { name: string } & JSONObject>
  implements CallDataBuilder
{
  protected abstract readonly name: string;

  abstract build(): Promise<CallDataBuilderReturnData>;
  abstract restore(data: T, provider: DittoProvider, vaultAddress: Address): Promise<void>;
  abstract getDataForRestore(): Promise<T>;
}

type UserPersistentCallDataBuilderConfig = { name: string; value: string; value2: number };
export class UserPersistentCallDataBuilder extends PersistentCallDataBuilder<UserPersistentCallDataBuilderConfig> {
  protected readonly name = 'UserPersistentCallDataBuilder::1';

  private initialData: Nullable<UserPersistentCallDataBuilderConfig> = null;

  constructor(
    private readonly provider: DittoProvider,
    private readonly config: UserPersistentCallDataBuilderConfig
  ) {
    super();
  }

  public async build(): Promise<CallDataBuilderReturnData> {
    const accountAddress = await this.provider.getSigner().getAddress();

    return Promise.resolve({
      callData: new Set([
        {
          to: accountAddress,
          callData: '0xdeadbeef0009',
        },
      ]),
      value: BigInt(0),
    });
  }

  public getDataForRestore(): Promise<UserPersistentCallDataBuilderConfig> {
    if (!this.initialData) {
      throw new Error('Initial data is not set');
    }

    return Promise.resolve(this.initialData);
  }

  restore(
    data: UserPersistentCallDataBuilderConfig,
    provider: DittoProvider,
    vaultAddress: Address
  ): Promise<void> {
    return Promise.resolve(undefined);
  }
}

class WorkflowFactory implements IWorkflowFactory {
  private readonly customActions: Map<string, typeof PersistentCallDataBuilder> = new Map();

  // мы будем делать это сами неявно для пользователя
  public registerCustomAction(action: typeof PersistentCallDataBuilder, name: string): void {
    this.customActions.set(name, action);
  }
}

interface IWorkflowFactory {
  registerCustomAction(action: typeof PersistentCallDataBuilder, name: string): void;
}
