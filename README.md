# SDK js
[Good reference](https://github.com/dittonetwork/sdk-core)

## Authenticate

**Interfaces:**
```typescript
/**
 * Used for all the Ditto related operations
 */
interface DittoProvider {
  constructor(config: DittoProviderConfig): void;
    
  authenticate(): Promise<boolean>
  
  getStorage(): DittoStorage
  getHttpClient(): HttpClient
}

interface DittoProviderConfig {
  signer: Signer,
  storage: DittoStorage, // Storage is reserved
  httpClient: HttpClient,
}
```

**Example:**
```typescript
import { DittoProvider } from '@dittoproject/provider'
import { Factory as WorkflowsFactory } from '@dittoproject/workflows'

async function main() {
  const provider = new DittoProvider({
    signer,
    storage: new InMemoryStorage(),  
  })

  await provider.authenticate()

  const history = await new WorkflowsFactory(provider).getHistory({ limit: 10, offset: 0 })
}
```

## Storage
**Interfaces:**
```typescript
interface Storage {
  set(key: string, value: string): void | Promise<void>,
  get<T = Optional<string>>(key: string): T | Promise<T>,  
  remove(key: string): void | Promise<void>,  
} 
```

**Example**
```typescript
// for browser usage
class BrowserStorage implements DittoStorage { ... }

// for server usage
class FileStorage implements DittoStorage { ... }

// example of custom storage
class InMemoryStorage implements DittoStorage {
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
```

## HttpClient

**Interfaces:**
```typescript
interface HttpClient {
    post(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
    get(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
}
```

## Workflows

**Interfaces:**
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
  constructor(provider: DittoProvider): void;
  
  create(name: string, triggers: Trigger[], actions: Actions[], chainId: number): Promise<Workflow>


  getHistory(pagination: PaginationParams): Promise<Execution[]>
  getList(statuses: WorkflowStatus[], pagination: PaginationParams): Promise<Workflow[]>
  getCountByStatus(status: WorkflowStatus): Promise<number>
  getById(id: string): Promise<Workflow>
}
```

**Example:**
```typescript
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

**Interfaces:**
```typescript
type Asset = {
  id: string
  amount: number
}

interface Factory {
  constructor(provider: DittoProvider): void;
  
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
  async function main() {
    const provider = new DittoProvider({
      signer,
      httpClient,
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
