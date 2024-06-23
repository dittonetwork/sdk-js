# @ditto-network/core

A JavaScript SDK for building workflows on the Ditto Network, enabling a Smart Account experience at any level of your project. This SDK provides the necessary tools and adapters for interacting with the blockchain and constructing workflows. You can use the provided adapters or implement your own.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Examples](#examples)
  - [Node.js](#nodejs)
  - [React](#react)
- [Actions and Triggers](#actions-and-triggers)
  - [Actions](#actions)
  - [Triggers](#triggers)
    - [Instant Trigger](#instant-trigger)
    - [Price-Based Trigger](#price-based-trigger)
    - [Time-Based Trigger](#time-based-trigger)
- [Documentation](#documentation)


## Installation

```bash
npm install @ditto-network/core @ditto-network/web3.js web3
```


## Getting Started

Here’s a quick guide to get you started with the Ditto Network SDK:


## Modules

- **Provider**
- **SmartWalletFactory**
- **WorkflowsFactory**
- **Triggers**
- **Actions**


### Provider

The `Provider` module is responsible for setting up the connection to the blockchain and managing interactions.


#### Initialization

```typescript
import { Provider as DittoProvider, BrowserStorage } from '@ditto-network/core';
import { EthersSigner, EthersContractFactory } from '@ditto-network/ethers';
import { ethers } from 'ethers';

const ethersProvider = new ethers.BrowserProvider(window.ethereum!);
const signer = await ethersProvider.getSigner();
const provider = new DittoProvider({
  signer: new EthersSigner(signer),
  storage: new BrowserStorage(),
  contractFactory: new EthersContractFactory(signer),
});
```


### Smart Wallet (Vault)

The Vault is a modular smart contract wallet designed to securely hold and manage assets, execute deferred tasks, and interact with DeFi protocols.


#### Methods

##### getNextVaultId

Retrieves the next available Vault ID for the specified blockchain network. This method is useful for generating a new Vault without conflicts.

```typescript
const chainId = 1; // Ethereum mainnet
const nextVaultId = await swFactory.getNextVaultId(chainId);
console.log(`Next Vault ID: ${nextVaultId}`);
```

- `chainId`: The ID of the blockchain network.


##### getVaultAddress

Predicts the address of the Vault based on the specified chain ID and Vault ID. This method is useful for knowing the Vault address before actually deploying it.

```typescript
const chainId = 1; // Ethereum mainnet
const vaultId = 2; // Example Vault ID
const vaultAddress = await swFactory.getVaultAddress(chainId, vaultId);
console.log(`Predicted Vault Address: ${vaultAddress}`);
```

- `chainId`: The ID of the blockchain network.
- `vaultId`: The ID of the Vault.


##### createVault

Creates a new smart wallet (Vault) on the specified blockchain network. This method deploys the Vault contract and returns the deployed Vault instance.

```typescript
import { SmartWalletFactory } from '@ditto-network/core';

const swFactory = new SmartWalletFactory(provider);
const chainId = 137; // Polygon
const nextVaultId = await swFactory.getNextVaultId(chainId);
const vault = await swFactory.createVault(chainId, nextVaultId);
const vaultAddress = vault.getAddress();
console.log(`New Vault Address: ${vaultAddress}`);
```

- `chainId`: The ID of the blockchain network.
- `vaultId`: The ID for the new Vault.


##### getDefaultOrCreate

Retrieves the default Vault for the specified chain ID and account address. If no default Vault exists, it creates a new one.

```typescript
const chainId = 1; // Ethereum mainnet
const accountAddress = '0xYourAccountAddress';
const vault = await swFactory.getDefaultOrCreate(chainId, accountAddress);
const vaultAddress = vault.getAddress();
console.log(`Default or New Vault Address: ${vaultAddress}`);
```

- `chainId`: The ID of the blockchain network.
- `accountAddress`: The account address for which the default Vault is retrieved or created.


## Actions and Triggers

### Actions

Actions are the building blocks of a workflow. They are the steps that are executed by triggers. Each action has a configuration that defines how it should be executed. Here are available actions:


#### Uniswap Swap Action

The UniSwap swap action is an action that swaps tokens on UniSwap. It can be combined with price-based triggers to build a limit order workflow.

**Configuration for UniSwap swap action:**
```typescript
type ActionConfig = {
  fromToken: { address: string, decimals: number };
  toToken: { address: string, decimals: number };
  fromAmount: string;
  slippagePercent?: number;
  providerStrategy:
    | { type: 'nodejs'; rpcUrl: string; chainId: number }
    | { type: 'browser'; provider: ethers.providers.ExternalProvider };
};
```

- **fromToken**: Token object that represents the token from which the swap is made.
- **toToken**: Token object that represents the token to which the swap is made.
- **fromAmount**: Amount of `fromToken` that should be swapped, represented in weis multiplied by 10^fromToken.decimals.
- **slippagePercent**: Optional parameter that determines the slippage percent, default is 0.5%.
- **ProviderStrategy**: Configuration for the provider used to execute the swap. It can be one of the following:
  - **NodeJS provider**: `{ type: 'nodejs'; rpcUrl: string; chainId: number }`
    ```typescript
    const providerStrategy = {
      type: 'nodejs',
      rpcUrl: 'https://mainnet.infura.io/v3/your-infura-id',
      chainId: 1, // Ethereum mainnet chain ID
    };
    ```
  - **Browser provider**: `{ type: 'browser'; provider: ethers.providers.ExternalProvider }`
    ```typescript
    const providerStrategy = {
      type: 'browser',
      provider: window.ethereum,
    };
    ```

**Example**
```typescript
new UniswapSwapActionCallDataBuilder(
  {
    fromToken: { address: '0x...', decimals: 18 },
    toToken: { address: '0x...', decimals: 6 },
    fromAmount: '1000000000000000000', // 1 token in wei
    slippagePercent: 0.05,
    providerStrategy: {
      type: 'nodejs',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    },
  },
);
```
In this example, 1 token of `fromToken` is swapped to `toToken` with 0.05% slippage using the NodeJS provider strategy.


### Triggers

Triggers define the conditions under which actions are executed. Here are the available triggers:


#### Instant Trigger

The Instant Trigger executes an action immediately without any conditions.

**Example**
```typescript
const instantTrigger = new InstantTrigger();
```

#### Price-Based Trigger

A price-based trigger executes an action when the price of a specified asset meets certain conditions.

**Configuration for Price-Based Trigger:**
```typescript
type PriceTriggerConfig = {
  uniswapPoolFeeTier: FeeAmount;
  triggerAtPrice: string; // weis * 10**fromToken.decimals
  priceMustBeHigherThan?: boolean;
  fromToken: { address: string, decimals: number };
  toToken: { address: string, decimals: number };
  providerStrategy:
    | { type: 'nodejs'; rpcUrl: string; chainId: number }
    | { type: 'browser'; provider: ethers.providers.ExternalProvider };
};
```

- **uniswapPoolFeeTier**: The fee tier of the Uniswap pool.
- **triggerAtPrice**: The price target that triggers the action.
- **priceMustBeHigherThan**: Optional boolean to specify if the price must be higher than the target price.
- **fromToken**: Token object representing the asset whose price is being monitored.
- **toToken**: Token object representing the target asset.
- **ProviderStrategy**: Configuration for the provider used to monitor the price.

**Example**
```typescript
const priceTrigger = new PriceTrigger({
  uniswapPoolFeeTier: FeeAmount.LOW,
  triggerAtPrice: '2000000000000000000', // 2 tokens in wei
  priceMustBeHigherThan: true,
  fromToken: { address: '0x...', decimals: 18 },
  toToken: { address: '0x...', decimals: 6 },
  providerStrategy: {
    type: 'nodejs',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    chainId: 1,
  },
});
```
In this example, the trigger is set to execute an action when the price of the specified token is greater than 2 tokens.


#### Time-Based Trigger

A time-based trigger executes an action at specified intervals.

**Configuration for Time-Based Trigger:**
```typescript
type TimeTriggerConfig = {
  startAtTimestamp: number; // Unix timestamp when the trigger should start
  repeatTimes?: number; // Number of times the trigger should repeat
  cycle: { frequency: number; scale: TimeScale };
  providerStrategy:
    | { type: 'nodejs'; rpcUrl: string; chainId: number }
    | { type: 'browser'; provider: ethers.providers.ExternalProvider };
};
```

- **startAtTimestamp**: Unix timestamp when the trigger should start.
- **repeatTimes**: Optional number of times the trigger should repeat.
- **cycle**: Object defining the frequency and scale (e.g., minutes, hours, days) of the trigger.
- **ProviderStrategy**: Configuration for the provider used to manage the time-based execution.

**Example**
```typescript
const timeTrigger = new TimeTrigger({
  startAtTimestamp: Math.floor(Date.now() / 1000) + 3600, // Start in 1 hour
  repeatTimes: 10, // Repeat 10 times
  cycle: { frequency: 1, scale: TimeScale.Hours },
  providerStrategy: {
    type: 'nodejs',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
    chainId: 1,
  },
});
```
In this example, the trigger is set to execute an action every hour, starting in one hour, and will repeat 10 times.


## Examples

### Node.js

For Node.js examples, see:

- [Web3.js example](https://github.com/dittonetwork/sdk-js/blob/master/examples/nodejs-example/web3js.ts)
- [Ethers.js example](https://github.com/dittonetwork/sdk-js/blob/master/examples/nodejs-example/ethers.ts)

### React

For React examples, see the sandbox project in [examples/sandbox](https://github.com/dittonetwork/sdk-js/tree/master/examples/sandbox) or [examples/react-example](https://github.com/dittonetwork/sdk-js/tree/master/examples/react-example).

To run the React examples:

```bash
npm run serve
```


## Documentation

For detailed documentation and API reference, visit our [documentation site](https://docs.dittonetwork.io).
