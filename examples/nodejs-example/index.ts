import { ethers } from 'ethers';
import {
  EthersContractFactory,
  InMemoryStorage,
  Provider,
  EthersSigner,
  tokens,
  Chain,
  WorkflowsFactory,
  SmartWalletFactory,
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

  const accountAddress = await dittoProvider.getSigner().getAddress();

  const swFactory = new SmartWalletFactory(dittoProvider, chainId);
  const vault = await swFactory.getDefaultOrCreateVault(chainId);
  const vaultAddress = vault.address;

  const commonConfig = {
    chainId,
    recipient: vaultAddress,
    accountAddress,
    vaultAddress,
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

  const hash = await wf.buildAndDeploy(commonConfig.vaultAddress, commonConfig.accountAddress);
  console.log('Workflow hash:', hash);
})();
