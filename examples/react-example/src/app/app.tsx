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
  SmartWalletFactory,
  Chain,
  UniswapSwapActionCallDataBuilder,
} from '@ditto-sdk/ditto-sdk';

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
    const chainId = Chain.Polygon;
    const accountAddress = await dittoProvider!.getSigner().getAddress();

    const swFactory = new SmartWalletFactory(dittoProvider!, chainId);
    const vault = await swFactory.getDefaultOrCreateVault(chainId);
    const vaultAddress = vault.address;
    const workflowFactory = new WorkflowsFactory(dittoProvider!);

    const commonConfig = {
      chainId,
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

    const hash = await wf.buildAndDeploy(vaultAddress, accountAddress);
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
