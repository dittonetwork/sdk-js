## Actions

Actions are the building blocks of a workflow. They are the steps that are executed by triggers. \
Each action has a configuration that defines how it should be executed. And [common configuration](../triggers/README.md#common-configuration) that is used by all actions.

We have the following actions available:

- Uniswap swap action.

### Uniswap Swap Action

UniSwap swap action is an action that swaps tokens on UniSwap. We can combine price-based trigger and build limit order workflow.

Configuration for UniSwap swap action:

```typescript
type ActionConfig = {
  fromToken: TokenLight;
  toToken: TokenLight;
  fromAmount: string;
  slippagePercent?: number;
  providerStrategy:
    | { type: 'nodejs'; rpcUrl: string; chainId: Chain }
    | { type: 'browser'; provider: ethers.providers.ExternalProvider };
};
```

#### fromToken: { address: string, decimals: number }

Token object that represents the token from which the swap is made.

#### toToken: { address: string, decimals: number }

Token object that represents the token to which the swap is made.

#### fromAmount: string

Amount of `fromToken` that should be swapped. It is a string that represents the amount in weis multiplied by 10^fromToken.decimals.

#### slippagePercent: number

Optional parameter that determines the slippage percent. 0.5 by default.

#### ProviderStrategy

It is a config for the provider that is used to execute the swap. It can be one of the following:

- **NodeJS provider**:\
  Type is `{ type: 'nodejs'; rpcUrl: string; chainId: Chain }`\
  Usually it is

```typescript
const providerStrategy = {
  type: 'nodejs',
  rpcUrl: 'https://mainnet.infura.io/v3/your-infura-id',
  chainId: Chain.Polygon,
};
```

- **Browser provider**: \
  Type is `{ type: 'browser'; provider: ethers.providers.ExternalProvider }`\
  Usually it is

```typescript
const providerStrategy = {
  type: 'browser',
  provider: window.ethereum,
};
```

**Example**

```typescript
new UniswapSwapActionCallDataBuilder({
  fromToken: wmatic,
  toToken: usdt,
  fromAmount: `333444555000000`,
  slippagePercent: 0.05,
  providerStrategy: {
    type: 'nodejs',
    chainId: chainId,
    rpcUrl: process.env.INFURA_API_URL!,
  },
});
```

Here we swap 0.000333444555 WMATIC to USDT with 0.05 slippage.

You don't suppose to use native tokens, only wrappers.\
Under the hood we use `@uniswap/smart-order-router` for generating call data.
