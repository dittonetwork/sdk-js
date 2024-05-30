# @ditto-network/core

`@ditto-network/core` is an abstraction layer for building workflows on the Ditto Network. It contains all the logic required for interacting with the blockchain and constructing workflows. You can use the provided adapters to interact with the blockchain, or implement your own adapters.  


## Installation

```bash
npm install @ditto-network/core @ditto-network/web3.js web3
```

or 

```bash
yarn add @ditto-network/core @ditto-network/web3.js web3
```


## Examples

### Node.js

For Node.js examples, see:

- [Web3.js example](examples/nodejs-example/web3js.ts)
- [Ethers.js example](examples/nodejs-example/ethers.ts)


### React

For React examples, see the sandbox project in [examples/sandbox](https://github.com/dittonetwork/sdk-js/tree/master/examples/sandbox).

To run the React examples:

```bash
npm run serve
```

or 

```bash
yarn serve
```


## Documentation

- [Triggers](src/lib/workflow/triggers/README.md)
- [Actions](src/lib/workflow/actions/README.md)
