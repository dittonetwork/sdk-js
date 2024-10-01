# automation-kit

This library was generated with [Nx](https://nx.dev).


## Building

Run `nx build automation-kit` to build the library.


## Running unit tests

Run `nx test automation-kit` to execute the unit tests via [Vitest](https://vitest.dev/).

---


## TODO

- finish `createWorkflow` method
- add timebased trigger
- add pricebased trigger
- add custom contract call action
- extract client/provider creation logic from adapters
- import `ethers`, `web3`, and `viem` dynamically in adapters
- remove `simulate` option from methods and find solution to test write requests


## Automation-kit Architecture

The `automation-kit` provides a set of high-level functions to interact with smart contracts, designed for seamless creation and management of Ditto automation workflows.

It abstracts blockchain interactions like transaction building, signing, and sending via a single adapter (e.g., ethers.js, web3.js, or viem) under the hood, ensuring that all smart contract calls consistently use the same adapter.

---

### `automation-kit` API

#### SmartWalletFactory (`VaultFactoryABI.json`)

- **`predictVaultAddress`**
- **`deploy`**
- **`getVersionAndIdByAddress`**


#### SmartWallet (`VaultABI.json`)

- **`deposit`**
- **`withdraw`**
- **`upgrade`**
- **`executeOperation`**


#### WorkflowFactory (`VaultABI.json`)

- **`createWorkflow (buildAndDeploy)`** -> addWorkflowAndGelatoTask

---


### Example Code of Automation-Kit

```typescript
import { contractCall } from './web3-adapter';
import { VaultFactoryABI } from './abis/VaultFactoryABI.json';

// Predict the vault address
async function predictVaultAddress(creator: string, vaultId: number) {
  const result = await contractCall({
    address: '0xVaultFactoryAddress',
    abi: VaultFactoryABI,
    method: 'predictDeterministicVaultAddress',
    args: [creator, vaultId],
    type: 'view',
  });
  return result;
}
```


### Example of Automation-Kit Usage

1. **Initialize Automation-Kit**: Users initialize the Automation Kit through a setup `createAutomationKit` method. This method will allow users to choose a library (e.g., ethers.js or web3.js).

```typescript
import { createAutomationKit, MultiSenderAction } from '@ditto-network/automation-kit';    // Core action
import { EthersAdapter } from '@ditto-network/automation-kit-ethers';
import { UniswapSwapAction } from 'ditto-automation-uniswap-action';  // External action


// Initialize Automation-kit
const automationKit = createAutomationKit({
  adapter: new EthersAdapter(),
});
```

2. **Import and Use Functions from Automation-kit**: Once the Automation Kit initialized (`createAutomationKit`), users can import functions from `automation-kit` and interact with contracts. Blockchain interactions like building, signing, and sending transactions will be handled by the adapter.

```typescript
import { predictVaultAddress, deposit } from '@ditto-network/automation-kit';

// Predict vault address using SmartWalletFactory
const vaultAddress = await predictVaultAddress('0xCreatorAddress', 1);
console.log('Predicted vault address:', vaultAddress);

// Deposit funds into a SmartWallet
const txHash = await deposit('0xCreatorAddress', '1000000000000000000'); // deposit 1 ETH
console.log('Transaction hash:', txHash);
```

---

### Example of Creating a Workflow

```typescript
import { createWorkflow } from '@ditto-network/automation-kit';

// Build and deploy a workflow
const workflowId = await createWorkflow({
  name: 'MultiSender Action Example',
  triggers: [createTimebasedTrigger({...})], // or [] for no triggers === instant workflow execution
  actions: [createMultiSenderAction({...})],
});
console.log('Workflow created with ID:', workflowId);
```

### Resulting Package Structure

- **`@ditto-network/automation-kit`**: A set of high-level functions for interacting with smart contracts. Modules include `SmartWalletFactory`, `SmartWallet`, and `WorkflowFactory`.
- **`@ditto-network/automation-kit-ethers`**: Adapter for **ethers.js**, providing integration for blockchain interaction.
- **`@ditto-network/automation-kit-web3js`**: Adapter for **web3.js**, offering the required functionality for working with **web3.js**.
- **`@ditto-network/automation-kit-viem`**: Adapter for **Viem**, integrating it for blockchain interactions.

Each adapter uses **peerDependencies** for its respective blockchain library, allowing users to install and manage their preferred versions.
