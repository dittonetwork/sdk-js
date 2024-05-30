import {
  Address,
  Chain,
  CommonBuilderOptions,
  InMemoryStorage,
  PriceTrigger,
  Provider,
  SmartWalletFactory,
  TimeBasedTrigger,
  TimeScale,
  tokens,
  UniswapSwapActionCallDataBuilder,
  WorkflowsFactory,
} from '@ditto-network/core';
import { Web3jsContractFactory, Web3jsSigner } from '@ditto-network/web3.js';
import { Web3 } from 'web3';

(async () => {
  const chainId = Chain.Polygon;

  const web3 = new Web3(process.env.INFURA_API_URL!);
  const accounts = web3.eth.accounts.wallet.add(`0x${process.env.PRIVATE_KEY!}`);
  const account = accounts[0].address! as Address;

  const txParamsBuildFn = async () => {
    const { baseFeePerGas } = await web3.eth.getBlock('pending');

    return {
      from: account,
      maxFeePerGas: `${BigInt(2) * baseFeePerGas!}`,
      maxPriorityFeePerGas: `${baseFeePerGas! / BigInt(2)}`,
    };
  };

  const storage = new InMemoryStorage();
  const dittoProvider = new Provider({
    signer: new Web3jsSigner(web3, account, txParamsBuildFn),
    storage,
    contractFactory: new Web3jsContractFactory(web3, txParamsBuildFn),
  });

  const needAuth = await dittoProvider.needAuthentication();
  if (needAuth) {
    await dittoProvider.authenticate();
  }

  const accountAddress = await dittoProvider.getSigner().getAddress();

  const swFactory = new SmartWalletFactory(dittoProvider);
  // const vault = await swFactory.getDefaultOrCreateVault(chainId);
  const vaultAddress = '0xb1Ec673122AC9eb2f3efb51c62911D16d3a29919' as Address; // vault.getAddress()!;

  const commonConfig = {
    chainId,
    recipient: vaultAddress,
    accountAddress,
    vaultAddress,
    provider: dittoProvider,
  } satisfies CommonBuilderOptions;

  const workflowsFactory = new WorkflowsFactory(dittoProvider);

  const wmatic = tokens.wrappedNative[Chain.Polygon];
  const usdt = tokens.stableCoins[Chain.Polygon].USDT;

  const timeTrigger = new TimeBasedTrigger(
    {
      repeatTimes: 2,
      startAtTimestamp: new Date().getTime() / 1000 + 120,
      cycle: {
        frequency: 1,
        scale: TimeScale.Minutes,
      },
    },
    commonConfig
  );

  // rate = how much of fromToken you should pay to get one toToken
  // rate should be:
  // a) higher than triggerAtPrice if priceMustBeHigherThan is true
  // b) lower than triggerAtPrice if priceMustBeHigherThan is false
  // in this case rate is 0.88 (0.88 USDT for 1 WMATIC)
  // triggerAtPrice is 0.3 (300000 / 1e6)
  // current rate is higher than triggerAtPrice and priceMustBeHigherThan is true so the trigger should be triggered
  const priceTrigger = new PriceTrigger(
    {
      uniswapPoolFeeTier: 3000,
      triggerAtPrice: '300000',
      priceMustBeHigherThan: true,
      fromToken: usdt,
      toToken: wmatic,
    },
    commonConfig
  );

  const usePriceTrigger = true;

  const wf = await workflowsFactory.create({
    name: 'My first workflow',
    triggers: [usePriceTrigger ? priceTrigger : timeTrigger],
    actions: [
      new UniswapSwapActionCallDataBuilder(
        {
          fromToken: wmatic,
          toToken: usdt,
          fromAmount: `333444555000000`,
          slippagePercent: 0.05,
          providerStrategy: {
            type: 'nodejs',
            chainId: chainId,
            rpcUrl: process.env.INFURA_API_URL!,
          },
        },
        commonConfig
      ),
    ],
    chainId,
  });

  const hash = await wf.buildAndDeploy(commonConfig.vaultAddress, commonConfig.accountAddress);
  console.log('Workflow hash:', hash);
})();
