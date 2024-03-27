# SDK js
[Good reference ](https://github.com/dittonetwork/sdk-core)

## Authenticate

**Interface:**
```typescript
/**
 * Used for all the Ditto related operations
 */
interface DittoProvider {
  constructor(config: DittoProviderConfig): DittoProvider;
    
  authenticate(): Promise<boolean>
}

interface DittoProviderConfig {
  signer: SignerTypeHere, 
  provider: JSONProviderTypeHere,
  // DittoProvider will try to detect storage by himself, but also will be able to set custom one 
  storage?: DittoProviderStorage,  
}

// for browser usage, will be set automatically in browser if not defined other
class DittoProviderLocalStorage implements DittoProviderStorage { ... }

// for server usage, will be set automatically on a server if not defined other
class DittoProviderFileStorage implements DittoProviderStorage { ... }

interface DittoProviderStorage {
  set(key: string, value: string): void | Promise<void>,
  get<T = Optional<string>>(key: string): T | Promise<T>,  
  remove(key: string): void | Promise<void>,  
} 
```

**Example:**
```typescript
import { DittoProvider } from '@dittoproject/provider'
import { Factory as WorkflowsFactory } from '@dittoproject/workflows'

class InMemoryStorage implements DittoProviderStorage {
  private _inMemoryStorage: Record<string, string> = {} 
    
  public get(key: string): Optional<string> {
    return this._inMemoryStorage[key];
  }  
  
  public set(key: string, value: string) {
    this._inMemoryStorage[key] = value;  
  }  
  
  public remove(key: string): void {
    delete this._inMemoryStorage[key]
  }  
}

async function main() {
  const provider = new DittoProvider({
    signer,
    provider: jsonRpcProvider,
    storage: new InMemoryStorage(),  
  })

  await provider.authenticate() // here internally will be update authKey for apiClient

  const history = await new WorkflowsFactory(provider).getHistory({ limit: 10, offset: 0 })
  ...
}
```


## Workflows

**Interface:**
```typescript
type Execution = {
  workflowId: string
  // Need to be defined
}

enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}


interface Workflow {
  deactiate(): Promise<boolean>
  activate(): Promise<boolean>

  isActivated(): boolean
  getId(): string
  getStatus(): WorkflowStatus
}



type PaginationParams = {
  limit: number
  offset: number
}

type Trigger = {
  // Need to be defined
}

type Actions = {
  // Need to be defined
}

interface Factory {
  create(name: string, triggers: Trigger[], actions: Actions[], chainId: number): Promise<Workflow>


  getHistory(pagination: PaginationParams): Promise<Execution[]>
  getList(statuses: WorkflowStatus[], pagination: PaginationParams): Promise<Workflow[]>
  getCountByStatus(status: WorkflowStatus): Promise<number>
  getById(id: string): Promise<Workflow>
}
```

**Example:**
```typescript
  import { DittoProvider } from '@dittoproject/provider'
  import { Factory as WorkflowsFactory, Triggers, Actions } from '@dittoproject/workflows'

  async function main() {
    const provider = new DittoProvider({
      signer,
      provider: jsonRpcProvider
    })

    await provider.authenticate()

    const workflows = new WorkflowsFactory(provider)

    await workflows.create('First Automation', [Trigger.Instant], [ Actions.SwapWithUniswap ], 137)
    
    ...
  }
```


## Smart Wallets (Vaults)

**Interface:**
```typescript
type Asset = {
  id: string
  amount: number
}

interface Factory {
  list(chainId: number): Promise<SmartWallet[]>
  getByAddress(chainId: number, address: string): Promise<SmartWallet>
}

interface SmartWallet {
  rename(name: string): Promise<string>
  withdraw(assetID: string, amount: number): Promise<boolean>
  deposit(assetID: string, amount: number): Promise<boolean>
  upgrade(version: string): Promise<boolean>
  hide(): Promise<boolean>
  show(): Promise<boolean>
  deploy(): Promise<boolean>


  isDeployed(): boolean
  getAddress(): string
  getAvailableVersions(): Promise<string[]>
  getAssets(): Asset[]
  getBalance(): Asset
  getName(): string
  getVersion(): string
}
```

**Example:**

```typescript
  import { DittoProvider } from '@dittoproject/provider'
  import { Factory as SmartWalletsFactory } from '@dittoproject/smartwallets'

  async function main() {
    const provider = new DittoProvider({
      signer,
      provider: jsonRpcProvider
    })

    await provider.authenticate()

    const walletsFactory = new SmartWalletsFactory(provider)

    const wallets = await walletsFactory.list(137)

    // or

    const wallet = await walletsFactory.getByAddress(137, '0x000')

    await wallet.rename('some other name')
    ...
  }
```