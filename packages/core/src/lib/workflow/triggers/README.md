## Triggers

Trigger is an event that starts the workflow. There are three types of triggers:
- instant trigger
- time-based trigger
- price-based trigger

If trigger can not be executed due to lack of native token for gas, the trigger will try to run workflow when the native token will become available.

Each described trigger has own configuration that defines how it should be executed. And [common configuration](#common-configuration) that is used by all triggers.

### Instant Trigger
Instant trigger is a trigger that starts the workflow immediately after creation. It is useful for one-time workflows. \
It is a trigger that does not have any configuration.

### Time-based Trigger
Time-based trigger is a trigger that starts the workflow at a specific time and optional repetitive cycles.\
It is useful for workflows that need to be executed at a specific time with specific repeat cycles.

It is type of configuration for time-based trigger:
```typescript
type TriggerConfig = {
  startAtTimestamp: number;
  repeatTimes?: number;
  cycle: {
    frequency: number;
    scale: TimeScale;
  };
};
```

#### startAtTimestamp: number
timestamp when the workflow should be started. It is a Unix timestamp in seconds\
(`Math.round(Date.now() / 1000) + 120` will return timestamp for trigger that will start workflow in 2 minutes (120 seconds ) from now). 


#### repeatTimes: number
number of times the workflow should be repeated. If not provided, the workflow will be repeated once.

#### cycle: { frequency: number, scale: TimeScale }  
Object that contains frequency and scale of the cycle.
Cycle is a period of time between two executions of the workflow.

- frequency: number of cycles
- scale: unit of the cycle. It can be one of the following:
  - `TimeScale.Seconds`
  - `TimeScale.Minutes`
  - `TimeScale.Hours`
  - `TimeScale.Days`
  - `TimeScale.Weeks`
  - `TimeScale.Months`

cycle with frequency 2 and scale `TimeScale.Minutes` will repeat the workflow every 2 days, for example.

**Example**
```typescript
const trigger = new TimeBasedTrigger(
  {
    repeatTimes: 5,
    startAtTimestamp: new Date().getTime() / 1000 + 120,
    cycle: {
      frequency: 10,
      scale: TimeScale.Minutes,
    },
  },
  commonConfig
)
```
Here, the workflow will be started in 2 minutes and repeated 5 times every 10 minutes.

### Price-based Trigger
Price-based trigger is a trigger that starts the workflow when the price of the token reaches a specific value in other token.\

It is type of configuration for price-based trigger:
```typescript
type TriggerConfig = {
  uniswapPoolFeeTier: FeeAmount;
  triggerAtPrice: string;
  priceMustBeHigherThan?: boolean;
  fromToken: TokenLight;
  toToken: TokenLight;
};
```
#### uniswapPoolFeeTier: FeeAmount
Fee tier of the Uniswap pool. It can be one of the following:
```typescript
export declare enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000
}
```
#### triggerAtPrice: string
Price at which the workflow should be started. It is a string that represents the price in weis multiplied by 10^fromToken.decimals.\
In other words, it is the rate - how much of `fromToken` you should pay to get one `toToken`.

Rate should be:
- higher than `triggerAtPrice` if `priceMustBeHigherThan` is `true`
- lower than `triggerAtPrice` if `priceMustBeHigherThan` is `false`

#### priceMustBeHigherThan: boolean
Optional parameter that determines if the rate should be higher or lower than `triggerAtPrice`.\
By default is `false`.

#### fromToken: { address: string; decimals: number }
Token object that represents the token from which the rate is calculated.

#### toToken: { address: string; decimals: number }
Token object that represents the token to which the rate is calculated.

**Example**
```typescript
const priceTrigger = new PriceTrigger({
  uniswapPoolFeeTier: 3000,
  triggerAtPrice: '300000',
  priceMustBeHigherThan: true,
  fromToken: usdt,
  toToken: wmatic,
})
```

In this example rate is 0.88 (0.88 USDT for 1 WMATIC).
`triggerAtPrice` is 0.3 (300000 / 10 ^ 6 (decimals of USDT))\
Current rate is higher than `triggerAtPrice` and `priceMustBeHigherThan` is true,\
so the trigger should be triggered.

## Common Configuration
Configuration that is used by all our triggers and actions.\
It is a type of configuration for common configuration:
```typescript
export interface CommonBuilderOptions {
  chainId: Chain;
  recipient: Address;
  accountAddress: string;
  vaultAddress: Address;
  provider: DittoProvider;
}
```

#### chainId: Chain
Chain id of the chain on which the workflow should be executed.

#### recipient: string
Address of the recipient of the workflow. It is an address that will receive the tokens after the workflow is executed.

#### accountAddress: string
Address of the account that will execute the workflow.

#### vaultAddress: string
Address of the smart wallet that will be used to execute the workflow. Usually it is the same as `recipient`.

#### provider: DittoProvider
Instance of the DittoProvider that is used to execute the workflow.
