# @ditto-network/core

Core library for creating and managing workflows in the Ditto Network. This library provides tools for creating, configuring, and signing workflows that can be executed in a decentralized network.

## Installation

```bash
npm install @ditto-network/core viem
```

or

```bash
yarn add @ditto-network/core viem
```

> **Note**: This library requires `viem` as a peer dependency for blockchain interactions and signing workflows. Make sure to install it along with the core package.

## Overview

The `@ditto-network/core` package provides tools for working with the Ditto Network blockchain infrastructure, allowing you to create automated workflows that can be executed based on schedules or blockchain events.

Main components:

- **Workflow Builder** - creation and configuration of workflows
- **Job Builder** - creation and configuration of jobs within a workflow
- **Step Builder** - creation and configuration of steps within jobs
- **Workflow Signer** - tools for signing workflows
- **Kepler Client** - client for interacting with the Kepler blockchain, which is a core component of the Ditto Network infrastructure responsible for transaction verification, workflow state management, and providing a secure environment for execution of workflows

## Core Concepts

### Workflow

A workflow is a container for a set of jobs that defines when and how these jobs should be executed. A workflow can be triggered on a schedule or in response to blockchain events.

### Job

A job is a set of steps that should be executed together. Jobs can depend on other jobs, creating a directed acyclic graph (DAG) for execution.

### Step

A step is an atomic operation within a job. There are two types of steps:

- **Contract Call** - a smart contract call
- **Action** - execution of a predefined action

### Kepler Blockchain

Kepler is a specialized blockchain that forms a core part of the Ditto Network infrastructure. It serves several critical functions:

- **Workflow Management** - Stores and manages workflow definitions and their execution states
- **Transaction Verification** - Verifies the validity of transactions and actions requested by workflows
- **Secure Environment** - Provides a secure and decentralized environment for workflow execution
- **Account Management** - Manages account nonces for proper transaction ordering

The Ditto Network uses Kepler to ensure workflows are executed reliably and securely in a decentralized manner.

## Usage

### Creating a workflow

```typescript
import {
  createWorkflowBuilder,
  createJobBuilder,
  createWorkflowSignerBuilder,
  createKeplerClient,
} from "@ditto-network/core";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

// Create a wallet client for signing operations
const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});
// Create a Kepler client
const keplerClient = createKeplerClient("http://localhost:26657");

// Create a signer for signing the workflow
const signer = await createWorkflowSignerBuilder(walletClient)
  .setDomain({
    name: "Ditto Network",
    version: "1",
    chainId: 1,
  })
  .build();

// Create a workflow
const workflow = await createWorkflowBuilder()
  .withName("Limit Order Workflow")
  .onScheduleTrigger({ cron: "0 * * * *" }) // Execute every hour
  .addJob((job) =>
    job
      .withBaseParams({ id: "send-money", chainId: 1 })
      .addStep((step) =>
        step.withName("Send money").withContractCall({
          address: "0xE...",
          calldata: "0x5...",
        })
      )
      .withGasLimitChecker({
        max_fee: 1000,
        max_priority_fee: 100000,
      })
  )
  .addJob((job) =>
    job
      .withBaseParams({ id: "check-and-swap", chainId: 1 })
      .addStep((step) =>
        step.withName("Approve and swap").withAction({
          uses: "ditto/appore-and-swap@v1",
          with: {
            token_in: "0x4...",
            token_out: "0xP...",
            amount_in: "1000000000000000000",
            slippage: "0.01",
            spender: "0xE...",
          },
        })
      )
      .dependsOn("send-money")
      .setAssetPriceChecker({
        sell_asset: "0x4...",
        buy_asset: "0xG...",
        limit_price: "2000",
        operator: "lte",
      })
      .setGasLimitChecker({
        max_fee: 100,
        max_priority_fee: 10000,
      })
  )
  .withSigner(signer)
  .withKeplerClient(keplerClient)
  .buildAndSign();

console.log(workflow);
```

### Creating a workflow with dependencies between jobs

```typescript
import {
  createWorkflowBuilder,
  createKeplerClient,
  createWorkflowSignerBuilder,
} from "@ditto-network/core";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

// Create a wallet client for signing operations
const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

// Create Kepler client
const keplerClient = createKeplerClient("http://localhost:26657");

// Create signer
const signer = await createWorkflowSignerBuilder(walletClient)
  .setDomain({
    name: "Ditto Network",
    version: "1",
    chainId: 1,
  })
  .build();

const workflow = await createWorkflowBuilder()
  .withName("Workflow with Dependencies")
  .onScheduleTrigger({ cron: "0 0 * * *" }) // Daily at midnight
  .addJob((job) =>
    job.withBaseParams({ id: "job-1", chainId: 1 }).addStep((step) =>
      step.withName("Fetch Data").withContractCall({
        address: "0x1234567890123456789012345678901234567890",
        calldata: "0xabcdef",
      })
    )
  )
  .addJob((job) =>
    job
      .withBaseParams({ id: "job-2", chainId: 1 })
      .dependsOn("job-1") // Depends on job-1 completion
      .addStep((step) =>
        step.withName("Process Data").withContractCall({
          address: "0x0987654321098765432109876543210987654321",
          calldata: "0xfedcba",
        })
      )
  )
  .withSigner(signer)
  .withKeplerClient(keplerClient)
  .buildAndSign();
```

### Creating a step with an action

```typescript
job.addStep((step) =>
  step.withName("Execute Action").withAction({
    uses: "ditto/context@v1",
    with: { param1: "value1", param2: "value2" },
  })
);
```

### Adding checkers to a job

Checkers allow you to add conditions under which a job can be executed:

```typescript
job
  .withBaseParams({ id: "job-with-checkers", chainId: 1 })
  .withGasLimitChecker({
    max_fee: 100000000000,
    max_priority_fee: 2000000000,
  })
  .withCountChecker(5) // Maximum 5 executions
  .withAssetPriceChecker({
    sell_asset: "0xTokenA",
    buy_asset: "0xTokenB",
    limit_price: "1000000000000000000",
    operator: ">=",
  })
  .withOnChainCallChecker({
    abi: "function isEnabled() returns (bool)",
    method: "isEnabled",
    chain_id: 1,
    args: [],
  });
```

### Creating a workflow with a blockchain event trigger

```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  createWorkflowBuilder,
  createKeplerClient,
  createWorkflowSignerBuilder,
} from "@ditto-network/core";

// Setup wallet and clients
const account = privateKeyToAccount("0xYourPrivateKey");
const walletClient = createWalletClient({
  account,
  transport: http("https://mainnet.example.com"),
});
const keplerClient = createKeplerClient("http://localhost:26657");
const signer = await createWorkflowSignerBuilder(walletClient)
  .setDomain({
    name: "Ditto Network",
    version: "1",
    chainId: 1,
  })
  .build();

// Create workflow with blockchain event trigger
const workflow = await createWorkflowBuilder()
  .withName('Event-Triggered Workflow')
  .onChainEventTrigger({
    abi: '[{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}]}]',
    addresses: ['0x1234567890123456789012345678901234567890'],
    event_name: 'Transfer'
  })
  .addJob((job) => /* ... */)
  .withSigner(signer)
  .withKeplerClient(keplerClient)
  .buildAndSign();
```

## API Reference

### createWorkflowBuilder

Creates a builder for workflows with a fluent API.

```typescript
const builder = createWorkflowBuilder();
```

**Methods:**

- **withName(name: string)** - Sets the workflow name
- **onScheduleTrigger(trigger: ScheduleTrigger)** - Adds a schedule-based trigger
- **onChainEventTrigger(trigger: OnchainEventTrigger)** - Adds a blockchain event trigger
- **addJob(enrich: (jobBuilder: JobBuilder) => JobBuilder)** - Adds a job
- **withSigner(signer: WorkflowSigner)** - Sets the signer for signature
- **withKeplerClient(client: KeplerClient)** - Sets the Kepler client
- **withCount(count: number)** - Sets the maximum number of executions
- **withExpiration(timestamp: number)** - Sets the expiration time
- **buildAndSign()** - Creates and signs the workflow

### createJobBuilder

Creates a builder for jobs with a method chain.

```typescript
const jobBuilder = createJobBuilder();
```

**Methods:**

- **withBaseParams(params: { id: string, chainId: number })**

  - `id` - Unique identifier for the job
  - `chainId` - ID of the blockchain network where the job will be executed
  - Sets the basic parameters for the job

- **addStep(enrich: (stepBuilder: StepBuilder) => StepBuilder)**

  - `stepBuilder` - Builder for creating a step
  - Adds a new step to the job using the provided enricher function
  - Returns the updated job builder

- **dependsOn(jobIds: string | string[])**

  - `jobIds` - IDs of jobs that the current job depends on
  - Can be a single string for one dependency or an array for multiple
  - Defines the execution order of jobs

- **withAccountAbstraction(address: string)**

  - `address` - Smart contract address for account abstraction
  - Enables the use of account abstraction for job execution

- **withOnChainCallChecker(checker: OnChainCallChecker)**

  - `checker` - Object with parameters for on-chain call verification:
    - `abi` - ABI for contract call
    - `method` - Method name to call
    - `chain_id` - Network ID
    - `args` - Arguments for the call

- **withGasLimitChecker(limit: GasLimitChecker)**

  - `limit` - Object with gas limits:
    - `max_fee` - Maximum gas fee
    - `max_priority_fee` - Maximum priority fee

- **withCountChecker(count: number)**

  - `count` - Maximum number of job executions
  - Limits how many times the job can be executed

- **withAssetPriceChecker(checker: AssetPriceChecker)**
  - `checker` - Parameters for asset price verification:
    - `sell_asset` - Address of token to sell
    - `buy_asset` - Address of token to buy
    - `limit_price` - Threshold price
    - `operator` - Comparison operator (GT, LT, GTE, LTE, EQ)

### createStepBuilder

Creates a builder for steps with a method chain.

```typescript
const stepBuilder = createStepBuilder();
```

**Methods:**

- **withName(name: string)**

  - `name` - Human-readable name for the step
  - Used for identification and logging purposes
  - Should be descriptive and unique within the job

- **withContractCall(params: { address: string, calldata: string })**

  - `address` - Ethereum smart contract address to call
  - `calldata` - ABI-encoded function call data
  - Configures the step to make a contract call on the blockchain
  - The calldata must match the contract's interface

- **withAction(params: { uses: string, with: Record<string, string> })**
  - `uses` - Action identifier in format "owner/action@version"
  - `with` - Key-value pairs of action parameters:
    - Keys are parameter names defined by the action
    - Values are strings that will be passed to the action
  - Configures the step to execute a predefined action
  - Actions are reusable components that perform specific tasks

### createWorkflowSignerBuilder

Creates a builder for a workflow signer.

```typescript
const signerBuilder = createWorkflowSignerBuilder(walletClient);
```

**Methods:**

- **setDomain(domain: TypedDataDomain)** - Sets the domain for EIP-712 signature:
  - `name` - Domain name (e.g. "Ditto Network")
  - `version` - Domain version (e.g. "1")
  - `chainId` - Chain ID (e.g. 1 for Ethereum mainnet)
  - `verifyingContract` (optional) - Contract address for verification
  - `salt` (optional) - Unique value to prevent signature reuse
- **build()** - Creates the signer object

### createKeplerClient

Creates a client for interacting with the Kepler blockchain.

```typescript
const client = createKeplerClient(rpcEndpoint);
```

The Kepler client provides a connection to the Kepler blockchain, which is the backbone of the Ditto Network infrastructure. Through this client, workflows can interact with the Kepler chain to verify accounts, retrieve nonces, and manage blockchain state.

**Methods:**

- **connect()** - Connects to the Kepler RPC
- **getAccountNonce(address: string)** - Gets the account nonce
- **disconnect()** - Disconnects from the Kepler RPC

## Data Types

### Workflow

Represents a complete workflow.

```typescript
type Workflow = {
  name: string;
  id: string;
  on: WorkflowTriggers;
  count?: number;
  expired_at?: number;
  signature: string;
  jobs: Job[];
  nonce: number;
};
```

### Job

Represents a job within a workflow.

```typescript
type Job = {
  id: string;
  chain_id: number;
  account_abstraction?: string;
  needs?: string[];
  checkers: Checkers;
  steps: Step[];
};
```

### Step

Represents a step within a job.

```typescript
type Step = ContractCallStep | ActionStep;

type ContractCallStep = {
  name: string;
  address: string;
  calldata: string;
};

type ActionStep = {
  name: string;
  uses: string;
  with: Record<string, string>;
};
```

### Checkers

Represents various checks that can be applied to a job.

```typescript
type Checkers = {
  onchain_calls?: OnChainCallChecker[];
  gas_limit?: GasLimitChecker;
  count?: number;
  asset_price_checker?: AssetPriceChecker;
};
```

## License

ISC
