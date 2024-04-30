# @ditto-network/web3.js

Web3.js adapter for Ditto Network SDK.

## How to use
### Node.js version

```typescript
const web3 = new Web3(process.env.INFURA_API_URL!);

// accounts initialization
const accounts = web3.eth.accounts.wallet.add(`0x${process.env.PRIVATE_KEY!}`);
const account = accounts[0].address! as Address;

// use this function if you want to pass some params for all txs,
// (calc maxFeePerGas and maxPriorityFeePerGas based on the pending block, for example)
// sdk doesn't calculate these values for you
// you able to pass additional params to signer.sendTransaction / contract.call for every call, 
// but if you want to setup it once, you can do it here only once
const txParamsDecorator = async () => {
  const { baseFeePerGas } = await web3.eth.getBlock('pending');

  return {
    maxFeePerGas: `${BigInt(2) * baseFeePerGas!}`,
    maxPriorityFeePerGas: `${baseFeePerGas! / BigInt(2)}`,
  };
};

const dittoProvider = new Provider({
  signer: new Web3jsSigner(web3, account, txParamsDecorator),
  storage: new InMemoryStorage(),
  contractFactory: new Web3jsContractFactory(web3, txParamsDecorator),
});
```

### Browser version

```typescript
const web3 = new Web3(window.ethereum);

// accounts initialization
await window.ethereum!.request({ method: 'eth_requestAccounts' });
const accounts = await web3.eth.getAccounts();
const account = accounts[0] as Address;

const txParamsDecorator = async () => {
  const { baseFeePerGas } = await web3.eth.getBlock('pending');

  return {
    from: account,
    maxFeePerGas: `${BigInt(2) * baseFeePerGas!}`,
    maxPriorityFeePerGas: `${baseFeePerGas! / BigInt(2)}`,
  };
};

const dittoProvider = new Provider({
  signer: new Web3jsSigner(web3, account, txParamsDecorator),
  storage: new BrowserStorage(),
  contractFactory: new Web3jsContractFactory(web3, txParamsDecorator),
});
```

## Building

Run `nx build web3js` to build the library.

## Running unit tests

Run `nx test web3js` to execute the unit tests via [Vitest](https://vitest.dev/).
