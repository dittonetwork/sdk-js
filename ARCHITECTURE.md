# Architecture

This document describes the high-level architecture of the Ditto Network JS SDK.


## Workflow Configuration Specification

JSON serializable format

- **issuer**: (String) The entity responsible for the workflow.
- **name**: (String) A brief and descriptive name for the workflow.
- **hint**: (String) A short description or hint about what the workflow does.
- **triggers**: (Array) A list of trigger objects that define when the workflow should be executed.
- **actions**: (Array) A list of action objects that define what operations the workflow performs.

```json
{
  "issuer": "Ditto",
  "name": "Send assets to multiple addresses",
  "hint": "Send your assets to multiple addresses in one transaction",
  "triggers": [
    {
      "type": "Core.Scheduled",
      "options": {
        "frequency": "daily",
        "time": "08:00"
      }
    }
  ],
  "actions": [
    {
      "type": "Application.MultiSender",
      "options": {
        "items": [
          {
            "asset": {
              "address": "0xTokenAddress",
              "decimals": 18
            },
            "amount": "100",
            "to": "0xRecipientAddress"
          },
          {
            "asset": null,
            "amount": "0.1",
            "to": "0xAnotherRecipientAddress"
          }
        ]
      }
    }
  ]
}
```


### Trigger and Action Objects

#### Trigger

A trigger object defines the conditions under which the workflow is executed.

- **type**: (String) The type of trigger. This should correspond to a predefined trigger type in the application.
- **options**?: (Object) An optional set of parameters specific to the trigger type.

```json
{
  "type": "Core.Scheduled",
  "options": {
    "frequency": "daily",
    "time": "08:00"
  }
}
```

- **type**: Specifies a scheduled trigger.
- **options**:
  - **frequency**: The frequency with which the trigger should activate (e.g., "daily", "weekly").
  - **time**: The specific time of day the trigger should activate.


#### Action

An action object defines the operations that are performed when the workflow is triggered.

- **type**: (String) The type of action. This should correspond to a predefined action type in the application.
- **options**?: (Object) An optional set of parameters specific to the action type.

```json
{
  "type": "Application.MultiSender",
  "options": {
    "items": [
      {
        "asset": {
          "address": "0xTokenAddress",
          "decimals": 18
        },
        "amount": "100",
        "to": "0xRecipientAddress"
      },
      {
        "asset": null,
        "amount": "0.1",
        "to": "0xAnotherRecipientAddress"
      }
    ]
  }
}
```

- **type**: Specifies a multi-send action by the application.
- **options**:
  - **items**: An array of objects representing the assets to be sent, each containing:
    - **asset**?: An optional object representing the ERC20 token.
      - **address**: The address of the ERC20 token.
      - **decimals**: The number of decimals for the ERC20 token.
    - **amount**: The amount of the asset to send.
    - **to**: The recipient address.


### Extending Configuration

This format is designed to be extensible. Additional triggers and actions can be defined by specifying new types and corresponding options. This approach allows for a highly customizable and adaptable workflow configuration system.

```ts
const wf = workflowFactory
  // Registers an action with the workflow using the action class directly
  .registerAction(MultiSenderAction) // => new MultiSenderAction(options)
  // Registers a trigger with the workflow using the trigger class directly
  .registerTrigger(PriceBasedTrigger) // => new PriceBasedTrigger(options, commonConfig)
```


### Using Configuration

Below is a complete example of a workflow configuration:

```ts
const workflowFactory = new WorkflowsFactory(provider);

const config = {
  name: 'Send assets to multiple addresses',
  issuer: 'Ditto',
  hint: 'Send your assets to multiple addresses in one transaction',
  triggers: [
    {
      type: 'Core.Scheduled',
      options: {
        frequency: 'daily',
        time: '08:00'
      }
    }
  ],
  actions: [
    {
      type: 'Application.MultiSender',
      options: {
        items: [
          {
            asset: {
              address: '0xTokenAddress',
              decimals: 18
            },
            amount: '100',
            to: '0xRecipientAddress'
          },
          {
            asset: null,
            amount: '0.1',
            to: '0xAnotherRecipientAddress'
          }
        ]
      }
    }
  ],
};

const wf = workflowFactory
  .registerAction(MultiSenderAction)
  .registerTrigger(ScheduledTrigger)
  // Creates a workflow from the given configuration object.
  .createFromConfig(config);

const deployedWorkflow = await wf.buildAndDeploy(swAddress, accountAddress);
```

This setup is equivalent to the following:

```ts
const workflowFactory = new WorkflowsFactory(provider);

const wf = await workflowFactory.create({
  name: 'My first workflow',
  triggers: [
    new ScheduledTrigger(
      {
        frequency: 'daily',
        time: '08:00'
      },
      commonConfig
    ),
  ],
  actions: [
    new MultiSenderActionCallDataBuilder(
      {
        items: [
          {
            asset: {
              address: '0xTokenAddress',
              decimals: 18
            },
            amount: '100',
            to: '0xRecipientAddress'
          },
          {
            asset: null,
            amount: '0.1',
            to: '0xAnotherRecipientAddress'
          }
        ]
      },
      commonConfig
    ),
  ],
  chainId,
});

const deployedWorkflow = await wf.buildAndDeploy(swAddress, accountAddress);
```


### Implementing Actions

Actions should implement the `AbstractAction` class with a static `id` and a `build` method.

```ts
abstract class AbstractAction {
  static id: string;

  abstract build(): Promise<CallDataBuilderReturnData>;
}
```

Each action class should define a unique static `id` to identify the action type and implement the `build` method to return the necessary data for the action.

```ts
class MultiSenderAction extends AbstractAction {
  static id = 'Application.MultiSender';

  constructor(options) {
    super();
    this.options = options;
  }

  async build(): Promise<CallDataBuilderReturnData> {
    // Implementation for building the multi-send action call data
  }
}
```

This ensures that all actions adhere to a common interface, making it easier to register and manage different types of actions within the workflow system.

---

> [!WARNING]  
> HERE IS THE VERSION OF THE ARCHITECTURE THAT WAS DESIGNED. HOWEVER, THE ACTUAL IMPLEMENTATION ARE DIFFERENT. SO WE'LL JUST SAVE IT FOR A WHILE AND SYNCHRONIZE IT WITH THE REAL IMPLEMENTATION LATER.


## Authenticate

**Interfaces:**

```typescript
/**
 * Used for all the Ditto related operations
 */
interface DittoProvider {
  constructor(config: DittoProviderConfig): void;

  authenticate(): Promise<boolean>;
  needAuthentication(): Promise<boolean>;

  getStorage(): DittoStorage;
  getHttpClient(): HttpClient;
  getContractFactory(): ContractFactory<DittoContract>;
}

interface DittoProviderConfig {
  signer: Signer;
  storage: DittoStorage;
  contractFactory: ContractFactory<DittoContract>;
}
```

**Example:**

```typescript
import { DittoProvider } from '@dittoproject/provider';
import { Factory as WorkflowsFactory } from '@dittoproject/workflows';

async function main() {
  const signer = await new ethers.BrowserProvider(window.ethereum!).getSigner();
  const dittoSigner = new EthersSigner(signer);

  const provider = new DittoProvider({
    signer: dittoSigner,
    storage: new InMemoryStorage(),
    contractFactory: new EthersContractFactory(ethers.Contract, signer),
  });

  const needAuth = await provider.needAuthentication();
  if (needAuth) {
    await provider.authenticate();
  }

  const history = await new WorkflowsFactory(provider).getHistory({ limit: 10, offset: 0 });
}
```

## Contract

**Interfaces:**

```typescript
interface ContractFactory<T extends DittoContract> {
  getContract(address: WalletAddress, abi: string): Promise<T>;
}

interface DittoContract {
  call<P, R>(method: string, params: P): Promise<R>;
}
```

**Example**

```typescript
const abi = `[
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "num",
        "type": "uint256"
      }
    ],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`
const smartContractAddress = '0xd10e3E8EbC4B55eAE572181be1554356Fb2a7767'

const provider = new DittoProvider({
  // here we use wrapper over ethersjs contracts
  contractFactory: new EthersContractFactory(ethers.Contract, signer),
  ...
})

const contract = await provider.getContractFactory().getContract(smartContractAddress, abi);

// write method
const { hash } = await contract.call<string, { hash: string }>('store', [12345n]);
// wallet will be opened, you should write tx and send to blockchain and wait for tx mining

// read method
const storedNumber = await contract.call<null, bigint>('retrieve', [])
// stored number is 12345n
```

## Storage

**Interfaces:**

```typescript
interface DittoStorage {
  set(key: string, value: string): void | Promise<void>;
  get<T = Optional<string>>(key: string): T | Promise<T>;
  remove(key: string): void | Promise<void>;
}
```

**Example**

```typescript
// for browser usage
class BrowserStorage implements DittoStorage {
  //
}

// for server usage
class FileStorage implements DittoStorage {
  //
}

// example of custom storage
class InMemoryStorage implements DittoStorage {
  private _inMemoryStorage: Record<string, string> = {};

  public get(key: string): Optional<string> {
    return this._inMemoryStorage[key];
  }

  public set(key: string, value: string) {
    this._inMemoryStorage[key] = value;
  }

  public remove(key: string): void {
    delete this._inMemoryStorage[key];
  }
}
```

## HttpClient

**Interfaces:**

```typescript
interface HttpClient {
  post(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  get(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}
```

## Workflows

**Interfaces:**

```typescript
type Execution = {
  workflowId: string;
  // Need to be defined
};

enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

interface WorkflowInitOptions {
  name: string;
  trigger: TriggerWithConfiguration;
  actions: ActionWithConfiguration[];
  chainId: number;
}

interface Workflow {
  deactivate(): Promise<boolean>;
  activate(): Promise<boolean>;

  isActivated(): boolean;
  getId(): string;
  getStatus(): WorkflowStatus;
}

type PaginationParams = {
  limit: number;
  offset: number;
};

enum Triggers {
  Schedule = 'schedule',
  Instant = 'instant',
  Price = 'price',
}

enum Actions {
  SwapWithUniswap = 'swapWithUniswap',
}

interface Factory {
  create(options: WorkflowInitOptions): Promise<Workflow>;

  getHistory(pagination: PaginationParams): Promise<Execution[]>;
  getList(statuses: WorkflowStatus[], pagination: PaginationParams): Promise<Workflow[]>;
  getCountByStatus(status: WorkflowStatus): Promise<number>;
  getById(id: string): Promise<Workflow>;
}
```

**Example:**

```typescript
async function main() {
  const provider = new DittoProvider({
    signer,
    provider: jsonRpcProvider,
  });

  await provider.authenticate();

  const workflows = new WorkflowsFactory(provider);

  await workflows.create('First Automation', [Trigger.Instant], [Actions.SwapWithUniswap], 137);
}
```

## Smart Wallets (Vaults)

**Interfaces:**

```typescript
type Asset = {
  id: string;
  amount: number;
};

interface Factory {
  constructor(provider: DittoProvider): void;

  getDefaultOrCreateVault(chainId: Chain): Promise<Maybe<SmartWallet>>;
  getByAddress(chainId: number, address: string): Promise<SmartWallet>;

  list(chainId: number): Promise<SmartWallet[]>;
}

interface SmartWallet {
  rename(name: string): Promise<string>;
  withdraw(assetID: string, amount: number): Promise<boolean>;
  deposit(assetID: string, amount: number): Promise<boolean>;
  upgrade(version: string): Promise<boolean>;
  hide(): Promise<boolean>;
  show(): Promise<boolean>;
  deploy(): Promise<boolean>;

  isDeployed(): boolean;
  getAddress(): string;
  getMaximumVersion(): Promise<SmartWalletVersion>;
  getAssets(): Asset[];
  getBalance(): Asset;
  getName(): string;
  getVersion(): string;
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
