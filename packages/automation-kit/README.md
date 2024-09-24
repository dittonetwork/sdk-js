# automation-kit

This library was generated with [Nx](https://nx.dev).


## Building

Run `nx build automation-kit` to build the library.


## Running unit tests

Run `nx test automation-kit` to execute the unit tests via [Vitest](https://vitest.dev/).

---


## Automation-kit Architecture

The `automation-kit` provides a set of high-level functions to interact with smart contracts, designed for seamless creation and management of Ditto automation workflows.


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


### `web3-adapter-core` API

The `web3-adapter-core` serves as the abstraction layer for interacting with smart contracts. It will handle tasks such as:
1. **Building transactions** (`contractCall`), interacting with contracts, signing, and sending transactions.
2. Abstracts the complexities of interacting with the blockchain, whether it's via **ethers.js**, **web3.js**, or **viem**.

- **`use`** — Initializes the Web3Adapter with a specific library.
- **`contractCall`**
- **`sendTransaction`**
- **`signTransaction`**
- **`estimateGas`**

---


### How **automation-kit** and **web3-adapter-core** Work Together:

1. **automation-kit** contains the logic for interacting with smart contracts, including ABI and methods such as `predictVaultAddress`, `deploy`, `deposit`, etc.
2. **web3-adapter-core** abstracts the blockchain interaction. All calls that require network communication, such as transaction building and sending, will be done through **web3-adapter-core** methods (`contractCall`, `sendTransaction`, etc.).
3. **automation-kit** passes the necessary data (contract addresses, ABI, method parameters) to **web3-adapter-core**, which then interacts with the blockchain to complete the transaction.


#### Example `web3-adapter-core` API usage in `automation-kit`:

```typescript
import { sendTransaction, contractCall } from 'web3-adapter-core';
import { VaultFactoryABI } from './abis/VaultFactoryABI.json';

// Method to predict the vault address
async function predictVaultAddress(creator: string, vaultId: number) {
    const result = await contractCall({
        address: '0xVaultFactoryAddress',
        abi: VaultFactoryABI,
        method: 'predictDeterministicVaultAddress',
        args: [creator, vaultId],
        type: 'view'
    });
    return result;
}
```


### User Setup Example:

1. **Initialize Web3Adapter**: Users will initialize **web3-adapter-core** using a configuration method like `init` or `use`. This setup allows users to choose which network library to use (e.g., ethers.js or web3.js).

```typescript
import { Web3Adapter } from 'web3-adapter-core';
import { EthersAdapter } from 'web3-adapter-ethers';  // or web3.js

// Initialize Web3Adapter with Ethers.js as the underlying adapter
Web3Adapter.use(new EthersAdapter({
    providerUrl: 'https://mainnet.infura.io/v3/...', 
    privateKey: '0xYourPrivateKey',
}));
```

2. **Import and Use Functions from Automation-kit**: Once the Web3Adapter is initialized, users can then import functions from `automation-kit` and execute contract methods. The actual blockchain interactions will be handled by **web3-adapter-core**.

```typescript
import { predictVaultAddress, deposit } from 'automation-kit';

// Example: Predict vault address using SmartWalletFactory
const vaultAddress = await predictVaultAddress('0xCreatorAddress', 1);
console.log('Predicted vault address:', vaultAddress);

// Example: Deposit funds into a SmartWallet
const txHash = await deposit('1000000000000000000'); // deposit 1 ETH
console.log('Transaction hash:', txHash);
```


### Result package structure:

- **`@ditto-network/automation-kit`**: Set of high-level functions for working with smart contracts. Modules: `SmartWalletFactory`, `SmartWallet`, and `WorkflowFactory`

- **`@ditto-network/web3-adapter-core`**: The core package, containing no external library dependencies. This package defines the core functionality and interfaces for interacting with the blockchain (e.g., `contractCall`, `sendTransaction`).

- **`@ditto-network/web3-adapter-ethers`**: Adapter for **ethers.js**. Provides integration with **ethers.js** for interacting with the blockchain.

- **`@ditto-network/web3-adapter-web3js`**: Adapter for **web3.js**. Offers the necessary functionality for working with **web3.js**.

- **`@ditto-network/web3-adapter-viem`**: Adapter for **Viem**. Integrates **Viem** for blockchain interactions.

Each adapter will specify its dependency on the respective blockchain library using **peerDependencies**, allowing users to install their own versions of the required libraries.
