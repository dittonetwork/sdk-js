import React, { useEffect } from 'react';
import '../styles.css';
import { Form } from './components/Form';
import { BrowserProvider } from 'ethers';
import {
  Provider as DittoProvider,
  EthersSigner,
  BrowserStorage,
  EthersContractFactory,
  WorkflowsFactory,
} from '@ditto-sdk/ditto-sdk';
import { UniswapSwapActionCallDataBuilder } from '@ditto-sdk/uniswap-swap-action';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [dittoProvider, setDittoProvider] = React.useState<DittoProvider>();

  useEffect(() => {
    const init = async () => {
      const browserProvider = new BrowserProvider((window as any).ethereum!);
      const signer = await browserProvider.getSigner();
      const provider = new DittoProvider({
        signer: new EthersSigner(signer),
        storage: new BrowserStorage(),
        contractFactory: new EthersContractFactory(signer),
      });

      const needAuth = await provider.needAuthentication();
      setIsAuthenticated(!needAuth);
      setDittoProvider(provider);
    };

    init();
  }, []);

  const handleSubmit = async (
    from: string,
    fromDecimals: number,
    to: string,
    toDecimals: number,
    amount: bigint
  ) => {
    const vaultAddress = '0x8db38B3825D0C4EA7f826E7CA6D5e99F8f07D43a';
    const accountAddress = '0xAfe67Bfc16D0d7e2De988A1f89971aa3747221fF';

    const workflowFactory = new WorkflowsFactory(dittoProvider!);

    const commonConfig = {
      chainId: 137,
      recipient: vaultAddress,
      accountAddress,
      vaultAddress,
      provider: dittoProvider!,
    };

    const wf = await workflowFactory.create({
      name: 'My first workflow',
      triggers: [],
      actions: [
        new UniswapSwapActionCallDataBuilder(
          {
            fromToken: { address: from, decimals: fromDecimals },
            toToken: { address: to, decimals: toDecimals },
            fromAmount: `${amount}`,
            slippagePercent: 0.05,
            providerStrategy: {
              type: 'browser',
              provider: (window as any).ethereum!,
            },
          },
          commonConfig
        ),
      ],
      chainId: 137,
    });

    const hash = await wf.buildAndDeploy(accountAddress);
    alert(`Workflow created with hash: ${hash}`);
  };

  const handleAuthClick = async () => {
    const isAuth = await dittoProvider!.authenticate();
    setIsAuthenticated(isAuth);
  };

  return isAuthenticated ? (
    <Form onSubmit={handleSubmit} />
  ) : (
    <div className="flex p-8 justify-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={handleAuthClick}
      >
        Auth
      </button>
    </div>
  );
}

export default App;
