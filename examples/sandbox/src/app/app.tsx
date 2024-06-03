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

const networkNames = {
  // [Chain.Ethereum]: 'Ethereum Mainnet',
  [Chain.Polygon]: 'Polygon Mainnet',
  [Chain.Arbitrum]: 'Arbitrum Mainnet',
};

const ConnectWalletButton = () => {
  const { sdk, connected, connecting } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
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
        <Button onClick={disconnect}>
          Disconnect
        </Button>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          Connect
        </Button>
      )}
    </div>
  );
};

export function App() {
  const { account, chainId } = useSDK();
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [provider, setProvider] = React.useState<DittoProvider | null>(null);
  const [auth, setAuth] = React.useState(false);
  const [workflowHash, setWorkflowHash] = React.useState<string>('');

  React.useEffect(() => {
    initProvider();
  }, []);

  const initProvider = async () => {
    const ethersProvider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await ethersProvider.getSigner();
    const provider = new DittoProvider({
      signer: new EthersSigner(signer),
      storage: new BrowserStorage(),
      contractFactory: new EthersContractFactory(signer),
    });
    const auth = !(await provider.needAuthentication());
    setAuth(auth);

    setSigner(signer);
    setProvider(provider);
  };

  const handleSignSDKClick = async () => {
    if (!provider) return;

    const needAuth = await provider.needAuthentication();
    if (needAuth) {
      await provider.authenticate();
    }
    setAuth(true);
  };

  const handleCreateWorkflow = async () => {
    if (!provider || !signer) return;

    const chainId = Chain.Polygon;
    const accountAddress = await signer.getAddress();

    console.log('Account address:', accountAddress);

    const swFactory = new SmartWalletFactory(provider);
    const vault = await swFactory.getDefaultOrCreateVault(chainId);
    const vaultAddress = vault.getAddress()!;
  };

  return (
    <div className="w-full h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col py-4 px-10 h-screen">
        <h1 className="text-4xl font-bold">Getting Started with Our SDK</h1> 

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 1: Connect Wallet</h2>
            <p className="text-gray-600">To get the signer</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <ConnectWalletButton />
              </div>
              <p className="text-gray-600">
                Wallet: {account ? '✅ ' + account : '❌ Not initialized'}<br />
                Network: {chainId ? networkNames[Number(chainId) as Chain] : '❌ Not initialized'}<br />
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 2: Initialize Provider</h2>
            <p className="text-gray-600">Initialize the provider to start using the SDK</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button className="w-min" onClick={initProvider}>
                  Init provider
                </Button>
              </div>
              <p className="text-gray-600">
                Provider: {provider ? '✅ Initialized' : '❌ Not initialized'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 3: Authenticate</h2>
            <p className="text-gray-600">API: Authenticate the user by signing a message</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button className="w-min" onClick={handleSignSDKClick}>
                  Sign message
                </Button>
              </div>
              <p className="text-gray-600">Login status: {auth ? '✅ Logged in' : '❌ Not logged in'}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 4: Create Smart Wallet</h2>
            <p className="text-gray-600">Deploy a smart wallet...</p>
            <div className="flex gap-2">
              <Button className="w-min" onClick={handleCreateWorkflow}>
                Deploy
              </Button>
            </div>
            <p className="text-gray-600">
              Smart Wallet Address: {workflowHash ? `✅ ${workflowHash}` : '❌ Not created'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
