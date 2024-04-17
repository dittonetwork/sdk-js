```typescript
import { Workflow } from './workflow';

class WorkflowsFactory implements IWorkflowFactory {
  public async save(wf: Workflow): void {
    const persistentActions = await Promise.all(wf.actions.map(async (action) => action.getDataForRestore()))
    // persistentActions here are serialized to json objects w/o any methods and circular dependencies

    // ...

    httpClient.saveWorkflow(wf.getId(), persistentActions);
  }

  public async restore(wf: Workflow): void {
    const ctx: ContextConfig = { ... }
    const persistentActions = httpClient.getWorkflowActions(wf.getId());
    
    wf.actions = await Promise.all(persistentActions.map(async (actionData) => {
      const ActionClass = this.customActions.get(actionData.name);
      // как мы инстанцируем экшн с пустым конструктором, если у класса конструктор с параметрами? 
      // поэтому конструктор должен быть либо пустым, либо унифицированным
      // но т.к мы через конструктор для экшенов передаем конфиг и доп данные, предлагаю и тут так делать
      const action = new ActionClass(actionData, provider); 
      await action.restore(); // и restore будет не нужен 
      return action;
    }))
  }
}
```
