# Ditto Network JS SDK

A JavaScript SDK for building workflows on the Ditto Network, enabling a Smart Account experience at any level of your project.

> [!WARNING]  
> THESE ARE STILL IN DEVELOPMENT AND CAN BE CHANGED AT ANY TIME.


## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Examples](#examples)
- [Contributing](#contributing)
- [Changelog](#changelog)


## Introduction

The Ditto Network SDK is designed to simplify the development of blockchain-based applications by providing a suite of tools for managing smart accounts, interacting with the blockchain, and building complex workflows.


## Installation

To install the SDK, use the following commands:

```bash
npm install @ditto-network/core @ditto-network/web3.js web3
```


## Getting Started

Here’s a quick guide to get you started with the Ditto Network SDK:


### Initialize SDK

```javascript
import { Provider, SmartWalletFactory, BrowserStorage } from '@ditto-network/core';
import { EthersSigner, EthersContractFactory } from '@ditto-network/ethers';

const provider = new Provider({
  signer: new EthersSigner(signer),
  storage: new BrowserStorage(),
  contractFactory: new EthersContractFactory(signer),
});
const swFactory = new SmartWalletFactory(provider);

const sw = await swFactory.getDefaultOrCreateVault();
const vaultAddress = sw.getAddress();

console.log('Vault address:', vaultAddress);
```

For more detailed examples, check the [examples](#examples) section.


## Documentation

For comprehensive documentation and details on how to use the Ditto Network, please refer to the main documentation in the [`@ditto-network/core`](https://github.com/dittonetwork/sdk-js/blob/master/packages/core/README.md) package.


### Navigation

- **[`examples/`](https://github.com/dittonetwork/sdk-js/tree/master/examples)**: Contains example projects for Node.js and React.
- **[`packages/`](https://github.com/dittonetwork/sdk-js/tree/master/packages)**: Contains the core packages of the SDK, including `core`, `ethers`, and `web3js`.
- **[`ARCHITECTURE.md`](https://github.com/dittonetwork/sdk-js/blob/master/ARCHITECTURE.md)**: Detailed information about the architecture of the project.
- **[`CHANGELOG.md`](https://github.com/dittonetwork/sdk-js/blob/master/CHANGELOG.md)**: A log of changes and updates to the project.
- **[`CONTRIBUTING.md`](https://github.com/dittonetwork/sdk-js/blob/master/CONTRIBUTING.md)**: Guidelines for contributing to the project.


## Examples

We provide a variety of examples to help you get started with different environments:

- **Node.js Examples**: Located in the [`examples/nodejs-example`](https://github.com/dittonetwork/sdk-js/tree/master/examples/nodejs-example) directory.
- **React Examples**: Located in the [`examples/react-example`](https://github.com/dittonetwork/sdk-js/tree/master/examples/react-example) directory.
- **Sandbox**: Located in the [`examples/sandbox`](https://github.com/dittonetwork/sdk-js/tree/master/examples/sandbox) directory.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request. For more details, refer to our [contributing guidelines](https://github.com/dittonetwork/sdk-js/blob/master/CONTRIBUTING.md).


## Changelog

For a list of changes and updates, see the [CHANGELOG.md](https://github.com/dittonetwork/sdk-js/blob/master/CHANGELOG.md) file.
