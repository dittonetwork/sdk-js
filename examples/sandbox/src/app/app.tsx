import React from 'react';
import { Button } from '../components/ui';
import { useSDK } from '@metamask/sdk-react';
import { ethers } from 'ethers';
import {
  Chain,
  CommonBuilderOptions,
  InMemoryStorage,
  PriceTrigger,
  Provider as DittoProvider,
  SmartWalletFactory,
  TimeBasedTrigger,
  TimeScale,
  tokens,
  UniswapSwapActionCallDataBuilder,
  WorkflowsFactory,
  BrowserStorage,
} from '@ditto-network/core';
import { EthersSigner, EthersContractFactory } from '@ditto-network/ethers';
import useLocalStorage from '../hooks/use-local-storage';

const networkNames = {
  [Chain.Polygon]: 'Polygon Mainnet',
  [Chain.Arbitrum]: 'Arbitrum Mainnet',
};

const ConnectWalletButton = () => {
  const { sdk, connected, connecting } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn('No accounts found', err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  return (
    <div className="relative">
      {connected ? (
        <Button onClick={disconnect}>Disconnect</Button>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          Connect
        </Button>
      )}
    </div>
  );
};

export function App() {
  const { account, chainId: _chainId } = useSDK();
  const chainId = (_chainId as unknown) as Chain | undefined;

  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [provider, setProvider] = React.useState<DittoProvider | null>(null);
  const [swFactory, setSWFactory] = React.useState<SmartWalletFactory | null>(null);
  const [isAuthenticated, setAuth] = React.useState(false);
  const [swAddress, setSWAddress] = React.useState('');
  const [workflowHash, setWorkflowHash] = React.useState<string>('');
  const [nextVaultId, setNextVaultId] = useLocalStorage<number>('nextVaultId', 1);

  React.useEffect(() => {
    if (chainId) initProvider();
  }, [chainId]);

  const initProvider = async () => {
    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await ethersProvider.getSigner();
      const provider = new DittoProvider({
        signer: new EthersSigner(signer),
        storage: new BrowserStorage(),
        contractFactory: new EthersContractFactory(signer),
      });
      const swFactory = new SmartWalletFactory(provider);
      const nextVaultId = chainId ? await swFactory.getNextVaultId(+chainId) : 1;
      const vaultAddress = chainId ? await swFactory.getVaultAddress(+chainId, nextVaultId) : '';
      const needAuth = await provider.needAuthentication();

      setAuth(!needAuth);
      setSigner(signer);
      setProvider(provider);
      setSWFactory(swFactory);
      setSWAddress(vaultAddress);
      setNextVaultId(nextVaultId);
    } catch (error) {
      console.error('Error initializing provider:', error);
    }
  };

  const handleSignSDKClick = async () => {
    if (!provider) return;

    try {
      const needAuth = await provider.needAuthentication();
      if (needAuth) await provider.authenticate();
      setAuth(true);
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const handleGetSmartWalletAddressClick = async () => {
    if (!provider || !signer || !chainId || !swFactory) return;

    try {
      const vaultAddress = await swFactory.getVaultAddress(+chainId, nextVaultId);
      setSWAddress(vaultAddress);
    } catch (error) {
      console.error('Error getting smart wallet address:', error);
    }
  };

  const handleDeploySmartWalletClick = async () => {
    if (!provider || !signer || !chainId || !swFactory) return;

    try {
      const vault = await swFactory.createVault(+chainId, nextVaultId);
      const vaultAddress = vault.getAddress()!;
      setSWAddress(vaultAddress);
      setNextVaultId(nextVaultId + 1); // Increment vault ID and save to local storage
    } catch (error) {
      console.error('Error deploying smart wallet:', error);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!provider || !signer || !chainId) return;

    console.log('not implemented');
  };

  return (
    <div className="w-full h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col py-4 px-10 h-screen">
        <h1 className="text-4xl font-bold">Getting started with Ditto Network</h1>

        {/* Step 1: Connect Wallet */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 1: Connect Wallet</h2>
            <p className="text-gray-600">To get the signer</p>
            <div className="flex flex-col gap-2">
              <ConnectWalletButton />
              <p className="text-gray-600">
                Wallet: {account ? '✅ ' + account : '❌ Not initialized'}
                <br />
                Network:{' '}
                {chainId
                  ? networkNames[Number(chainId) as Chain] || Number(chainId)
                  : '❌ Not initialized'}
                <br />
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Initialize Provider */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 2: Initialize Provider</h2>
            <p className="text-gray-600">Initialize the provider to start using the SDK</p>
            <div className="flex flex-col gap-2">
              <Button className="w-min" onClick={initProvider}>
                Init provider
              </Button>
              <p className="text-gray-600">
                Provider: {provider ? '✅ Initialized' : '❌ Not initialized'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Authenticate */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 3: Authenticate</h2>
            <p className="text-gray-600">API Authentication (for history) - sign a message</p>
            <div className="flex flex-col gap-2">
              <Button className="w-min" onClick={handleSignSDKClick}>
                Sign message
              </Button>
              <p className="text-gray-600">
                Login status: {isAuthenticated ? '✅ Logged in' : '❌ Not logged in'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <h2 className="text-2xl font-bold">Step 4: Get Smart Wallet Address and Deploy</h2>
            <p className="text-gray-600">
              You can predict the address of the smart wallet before deploying it.
            </p>
            <div className="flex gap-2">
              <Button className="w-min" onClick={handleGetSmartWalletAddressClick}>
                Get Address
              </Button>
              <Button className="w-min" onClick={handleDeploySmartWalletClick}>
                Deploy
              </Button>
            </div>
            <p className="text-gray-600">
              Smart Wallet Address:{' '}
              {swAddress ? `✅ ${swAddress}` : '❌ Not created'}<br/>
              Next wallet id: {nextVaultId}
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <h2 className="text-2xl font-bold">Step 5: Create Workflow</h2>
            <p className="text-gray-600">Compose actions and triggers to create a workflow.</p>
            <Button className="w-min" onClick={handleCreateWorkflow}>
              Create
            </Button>
            <p className="text-gray-600">
              Workflow hash: {workflowHash ? `✅ ${workflowHash}` : '❌ Not created'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
