import { useEffect, useState } from 'react';
import {
  BaseApiError,
  BrowserStorage,
  Chain,
  EthersContractFactory,
  EthersSigner,
  PriceTriggerCallDataBuilder,
  Provider,
  tokens,
  WorkflowExecution,
  WorkflowsFactory,
} from '@ditto-sdk/ditto-sdk';
import { BrowserProvider, ethers } from 'ethers';
import { UniswapSwapActionCallDataBuilder } from '@ditto-sdk/uniswap-swap-action';

export const Workflows = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>([]);

  useEffect(() => {
    new ethers.BrowserProvider(window.ethereum!).getSigner().then((signer) => {
      setProvider(
        new Provider({
          signer: new EthersSigner(signer),
          storage: new BrowserStorage(),
          contractFactory: new EthersContractFactory(signer),
        })
      );
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
      recipient: '0x8db38B3825D0C4EA7f826E7CA6D5e99F8f07D43a',
      accountAddress: '0xAfe67Bfc16D0d7e2De988A1f89971aa3747221fF',
      vaultAddress: '0x8db38B3825D0C4EA7f826E7CA6D5e99F8f07D43a',
      provider: provider!,
    };

    const wf = await workflowsFactory.create({
      name: 'test wf',
      triggers: [
        new PriceTriggerCallDataBuilder(
          {
            uniswapPoolFeeTier: 500,
            triggerAtPrice: 500000000000000000, // 500000000000000000
            priceMustBeHigherThan: true,
            token: tokens.wrappedNative[Chain.Polygon],
            baseToken: tokens.stableCoins[Chain.Polygon].USDT,
          },
          commonConfig
        ),
        // new TimeBasedTrigger(
        //   {
        //     startAtTimestamp: Number((new Date().getTime() / 1000).toFixed(0)) + 60,
        //     repeatTimes: 2,
        //     cycle: {
        //       frequency: 1,
        //       scale: TimeScale.Minutes,
        //     },
        //   },
        //   commonConfig
        // ),
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
            fromToken: tokens.native[Chain.Polygon],
            toToken: tokens.stableCoins[Chain.Polygon].USDT,
            fromAmount: `123456789000000000`,
            slippagePercent: 0.05,
            providerStrategy: {
              type: 'browser',
              // @ts-expect-error
              provider: window.ethereum!,
            },
          },
          commonConfig
        ),
      ],
      chainId: Chain.Polygon,
    });

    await wf.buildAndDeploy('0xAfe67Bfc16D0d7e2De988A1f89971aa3747221fF');
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
