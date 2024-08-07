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
    - [Uniswap Swap Action](#uniswap-swap-action)
    - [MultiSender Action](#multisender-action)
    - [Custom Contract Call Action](#custom-contract-call-action)
  - [Triggers](#triggers)
    - [Instant Trigger](#instant-trigger)
    - [Price-Based Trigger](#price-based-trigger)
    - [Time-Based Trigger](#time-based-trigger)
- [Workflow Creation](#workflow-creation)
- [Implementing Custom Actions](#implementing-custom-actions)
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

##### getLastVaultId

Retrieves the next available Vault ID for the specified blockchain network. This method is useful for generating a new Vault without conflicts.

```typescript
const chainId = 1; // Ethereum mainnet
const lastVaultId = await swFactory.getLastVaultId(chainId);
console.log(`Last Vault ID: ${lastVaultId}`);
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
const lastVaultId = await swFactory.getLastVaultId(chainId);
const vault = await swFactory.createVault(chainId, nextVaultId + 1);
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


#### MultiSender Action

The MultiSender Action allows you to send tokens to multiple recipients in a single transaction.

**Configuration for MultiSender Action:**
```typescript
type MultiSenderActionConfig = {
  items: { to: string, amount: string, asset: { address: string, decimals: number } }[];
};
```

- **items**: Array of objects, each representing a recipient with the address, amount, and asset.

**Example**
```typescript
const multiSenderActionConfig = {
  items: [
    { to: '0xRecipientAddress1', amount: '1000000000000000000', asset: { address: '0x...', decimals: 18 } }, // 1 token in wei
    { to: '0xRecipientAddress2', amount: '2000000', asset: { address: '0x...', decimals: 6 } }, // 2 tokens in smallest unit
  ],
};
const multiSenderAction = new MultiSenderAction(multiSenderActionConfig, commonConfig);
```


#### Custom Contract Call Action

The `CustomContractCall` action allows you to interact with any smart contract by specifying the contract address, ABI, function name, and arguments. This action is useful for executing custom logic or interacting with contracts not directly supported by the SDK.

**Configuration for Custom Contract Call Action:**
```typescript
type ActionConfig = {
  address: Address;
  functionName: string;
  abi: any;
  args: any[];
  value?: bigint; // native amount to send with the call
};
```

- **address**: The address of the target contract.
- **functionName**: The name of the function to be called on the contract.
- **abi**: The ABI of the target contract.
- **args**: An array of arguments to be passed to the function.
- **value**: (Optional) The native amount to send with the call, default is `0`.


**Example usage**

Here is an example of a workflow that uses the `CustomContractCall` action to disperse Ether to multiple recipients:

```typescript
import disperseAbi from './path/to/disperseAbi.json';
import { parseUnits } from 'ethers';

const recepients = [
  ['0x...', '0.1'], // 0.1 MATIC
  ['0x...', '0.2'], // 0.2 MATIC
];

new CustomContractCall(
  {
    address: '0xD152f549545093347A162Dce210e7293f1452150',
    abi: disperseAbi,
    functionName: 'disperseEther',
    args: [
      recepients.map(([to]) => to),
      recepients.map(([, amount]) => parseUnits(amount)),
    ],
    value: recepients.reduce(
      (acc, [, amount]) => acc + parseUnits(amount),
      BigInt(0)
    ),
  },
  commonConfig
);
```


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


## Workflow Creation

Creating workflows involves defining triggers and actions, and deploying them on the blockchain.

**Example**
```typescript
const workflowFactory = new WorkflowsFactory(provider);

  const wf = await workflowFactory.create({
    name: 'MultiSender Action Example',
    triggers: [new InstantTrigger()], // or [] for no triggers === instant workflow execution
    actions: [
      new MultiSenderAction(
        {
          items: recepients.map(([to, amount]) => ({
            to,
            amount: parseUnits(amount, tokens.usdt.decimals),
            asset: tokens.usdt,
          })),
        },
        commonConfig
      ),
    ],
    chainId,
  });

  const tx = await wf.buildAndDeploy(swAddress, account as Address);
```

In this example, tokens are sent to multiple recipients with the specified amounts.


## Implementing Custom Actions

Creating a custom action allows you to extend the functionality of your workflow beyond predefined actions like MultiSenderAction. You can define custom actions to interact with smart contracts or execute specific logic required for your application.

### Steps to Implement a Custom Action

1. **Define the Configuration**: Specify the parameters required for your action.
2. **Implement the Action Class**: Create a class that implements the `CallDataBuilder` interface.
3. **Build Call Data**: Encode the function calls to interact with the blockchain.


### Example SendTokens Action

The following example demonstrates how to create a custom action that sends tokens to a recipient.

```typescript
import { CallDataBuilder } from '@ditto-network/core';

// 1. Define the configuration for the SendTokens action
// This type specifies the parameters required to send tokens
type SendTokensConfig = {
  to: string; // The recipient's address
  token: Erc20Token; // The ERC20 token to be sent
  amount: string; // The amount of tokens to send, specified as a string
};

// 2. Implement the CallDataBuilder interface for the SendTokens action
// This class will build the call data necessary to perform the token transfer
export class SendTokens implements CallDataBuilder {
  // Constructor to initialize the SendTokens class with configuration and common builder options
  constructor(
    protected readonly config: SendTokensConfig,
    protected readonly commonCallDataBuilderConfig: CommonBuilderOptions
  ) {}

  // The build method is required by the CallDataBuilder interface
  // It constructs the call data for the token transfer
  public async build(): Promise<CallDataBuilderReturnData> {
    // Initialize a Set to hold the call data
    const callData = new Set<CallData>();

    // Get the contract interface for the Vault contract from the provider
    const vaultInterface = this.commonCallDataBuilderConfig.provider
      .getContractFactory()
      .getContractInterface(JSON.stringify(VaultABI));

    // Extract the chain ID from the common builder options
    const { chainId } = this.commonCallDataBuilderConfig;

    // Add the call data for withdrawing ERC20 tokens
    callData.add({
      to: this.commonCallDataBuilderConfig.vaultAddress, // The address of the Vault contract
      callData: vaultInterface.encodeFunctionData('withdrawERC20', [
        this.config.token.address, // The address of the ERC20 token
        this.config.to, // The recipient's address
        this.config.amount, // The amount of tokens to send
      ]),
    });

    // Return the call data and value (value is set to the token amount converted to BigInt)
    return { callData, value: BigInt(this.config.amount) };
  }
}

// 3. Use the Custom Action in a Workflow
const wf = await workflowFactory.create({
  name: 'Custom Action Example',
  triggers: [new InstantTrigger()],
  actions: [ 
    new SendTokens({
      to: '0x', // recipient address
      token: { address: '0x', decimals: 18 }, // token address and decimals
      amount: '1000000000000000000', // 1 token in wei
    }, commonConfig)
  ],
  chainId,
});

const tx = await wf.buildAndDeploy(swAddress, account as Address);
```

Implementing custom actions allows you to tailor workflows to your specific requirements, making it possible to automate a wide range of blockchain interactions. By following the steps to define the configuration, implement the action class, and build call data, you can extend the capabilities of your workflows beyond predefined actions.


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
