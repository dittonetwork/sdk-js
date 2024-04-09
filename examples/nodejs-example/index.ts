import { ethers } from 'ethers';
import {
  EthersContractFactory,
  InMemoryStorage,
  Provider,
  EthersSigner,
  tokens,
  Chain,
  WorkflowsFactory,
} from '@ditto-sdk/ditto-sdk';
import { UniswapSwapActionCallDataBuilder } from '@ditto-sdk/uniswap-swap-action';

(async () => {
  const chainId = Chain.Polygon;

  const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL!, chainId);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const storage = new InMemoryStorage();
  const dittoProvider = new Provider({
    signer: new EthersSigner(wallet),
    storage,
    contractFactory: new EthersContractFactory(wallet),
  });

  const needAuth = await dittoProvider.needAuthentication();
  if (needAuth) {
    await dittoProvider.authenticate();
  }

  const commonConfig = {
    chainId,
    recipient: '0x8db38B3825D0C4EA7f826E7CA6D5e99F8f07D43a',
    accountAddress: '0xAfe67Bfc16D0d7e2De988A1f89971aa3747221fF',
    vaultAddress: '0x8db38B3825D0C4EA7f826E7CA6D5e99F8f07D43a',
    provider: dittoProvider,
  };

  const workflowsFactory = new WorkflowsFactory(dittoProvider);

  const wf = await workflowsFactory.create({
    name: 'My first workflow',
    triggers: [],
    actions: [
      new UniswapSwapActionCallDataBuilder(
        {
          fromToken: tokens.native[chainId],
          toToken: tokens.stableCoins[chainId].USDT,
          fromAmount: `1234567890000000`,
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

  const hash = await wf.buildAndDeploy(commonConfig.accountAddress);
  console.log('Workflow hash:', hash);
})();
