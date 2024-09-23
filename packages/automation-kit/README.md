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

- **`contractCall`**
- **`sendTransaction`**
- **`signTransaction`**
- **`estimateGas`**
