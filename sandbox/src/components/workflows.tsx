import { useEffect, useState } from 'react';
import {
  BaseApiError,
  BrowserStorage,
  EthersContractFactory,
  EthersSigner,
  Provider,
  WorkflowExecution,
  WorkflowsFactory,
} from '@ditto-sdk/ditto-sdk';
import { ethers } from 'ethers';

export const Workflows = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [workflowExecutions, setWorkflowExecutions] = useState<WorkflowExecution[]>([]);

  useEffect(() => {
    new ethers.BrowserProvider(window.ethereum!).getSigner().then((signer) => {
      setProvider(
        new Provider({
          signer: new EthersSigner(signer),
          storage: new BrowserStorage(),
          contractFactory: new EthersContractFactory(ethers.Contract, signer),
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
