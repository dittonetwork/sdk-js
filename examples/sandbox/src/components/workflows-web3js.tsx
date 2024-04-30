import { useEffect, useState } from 'react';
import {
  BaseApiError,
  BrowserStorage,
  Chain,
  PriceTrigger,
  Provider,
  tokens,
  WorkflowExecution,
  WorkflowsFactory,
  UniswapSwapActionCallDataBuilder,
  Address,
  TimeBasedTrigger,
  TimeScale,
} from '@ditto-network/core';
import { Web3jsContractFactory, Web3jsSigner } from '@ditto-network/web3.js';
import { Web3 } from 'web3';

export const WorkflowsWeb3js = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>([]);

  const getProvider = async () => {
    const web3 = new Web3(window.ethereum);
    await window.ethereum!.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0] as Address;

    console.log('Current account:', account);

    const txParamsBuildFn = async () => {
      const { baseFeePerGas } = await web3.eth.getBlock('pending');

      return {
        from: account,
        maxFeePerGas: `${BigInt(2) * baseFeePerGas!}`,
        maxPriorityFeePerGas: `${baseFeePerGas! / BigInt(2)}`,
      };
    };

    return new Provider({
      signer: new Web3jsSigner(web3, account, txParamsBuildFn),
      storage: new BrowserStorage(),
      contractFactory: new Web3jsContractFactory(web3, txParamsBuildFn),
    });
  };

  useEffect(() => {
    getProvider().then((provider) => {
      setProvider(provider);
    });
  }, []);

  const handleAuthClick = async () => {
    await provider!.authenticate();
  };

  const handleGetWorkflowsHistoryClick = async () => {
    const workflowsFactory = new WorkflowsFactory(provider!);

    try {
      const history: WorkflowExecution[] = await workflowsFactory.getHistory({
        limit: 10,
        offset: 0,
      });
      setWorkflowExecutions(history);
    } catch (error) {
      if (error instanceof BaseApiError && error.code === 401) {
        alert('Please auth');
        return;
      }
      throw error;
    }
  };

  const handleGetSingleWorkflowClick = async (id: string) => {
    const workflowsFactory = new WorkflowsFactory(provider!);
    const workflow = await workflowsFactory.getById(id);

    alert(JSON.stringify(workflow));
  };

  const handleCreateWorkflowClick = async () => {
    const workflowsFactory = new WorkflowsFactory(provider!);

    const commonConfig = {
      chainId: 137,
      recipient: '0xb1Ec673122AC9eb2f3efb51c62911D16d3a29919' as Address,
      accountAddress: '0xAfe67Bfc16D0d7e2De988A1f89971aa3747221fF' as Address,
      vaultAddress: '0xb1Ec673122AC9eb2f3efb51c62911D16d3a29919' as Address,
      provider: provider!,
    };

    const wf = await workflowsFactory.create({
      name: 'test wf',
      triggers: [
        // new PriceTrigger(
        //   {
        //     uniswapPoolFeeTier: 500,
        //     triggerAtPrice: '500000000000000000',
        //     priceMustBeHigherThan: true,
        //     fromToken: tokens.wrappedNative[Chain.Polygon],
        //     toToken: tokens.stableCoins[Chain.Polygon].USDT,
        //   },
        //   commonConfig
        // ),
        new TimeBasedTrigger(
          {
            startAtTimestamp: Number((new Date().getTime() / 1000).toFixed(0)) + 60,
            repeatTimes: 2,
            cycle: {
              frequency: 1,
              scale: TimeScale.Minutes,
            },
          },
          commonConfig
        ),
      ],
      actions: [
        /* new UniswapSwapActionCallDataBuilder(
          {
            fromToken: tokens.wrapped[Chain.Polygon].WMATIC,
            toToken: tokens.native[Chain.Polygon],
            fromAmount: `123450000000000`,
            slippagePercent: 0.1,
          },
          commonConfig
        ),*/

        /* new UniswapSwapActionCallDataBuilder(
          {
            fromToken: tokens.native[Chain.Polygon],
            toToken: tokens.stableCoins[Chain.Polygon].USDC,
            fromAmount: `111110000000000`,
            slippagePercent: 0.01,
          },
          commonConfig
        ),*/

        new UniswapSwapActionCallDataBuilder(
          {
            fromToken: tokens.wrappedNative[Chain.Polygon],
            toToken: tokens.stableCoins[Chain.Polygon].USDT,
            fromAmount: `12345678900000`,
            slippagePercent: 0.05,
            providerStrategy: {
              type: 'browser',
              provider: (window as any).ethereum,
            },
          },
          commonConfig
        ),
      ],
      chainId: Chain.Polygon,
    });

    const hash = await wf.buildAndDeploy(
      '0xb1Ec673122AC9eb2f3efb51c62911D16d3a29919',
      '0xAfe67Bfc16D0d7e2De988A1f89971aa3747221fF'
    );

    console.log('hash', hash);
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-white shadow-lg rounded-lg mt-5">
      <h1 className="font-bold text-center mb-4 w-100">Workflows sandbox</h1>

      <div className="text-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAuthClick}
        >
          Auth
        </button>
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGetWorkflowsHistoryClick}
        >
          Get workflows history
        </button>
        <button
          className="mt-4 ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCreateWorkflowClick}
        >
          Build and deploy a workflow
        </button>
      </div>

      {workflowExecutions && (
        <div className="mt-4 text-center">
          {workflowExecutions.map((execution) => (
            <button
              className="mt-4 w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              onClick={() => handleGetSingleWorkflowClick(execution.id)}
              key={execution.id}
            >
              {execution.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
