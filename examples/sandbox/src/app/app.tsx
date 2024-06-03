import React from 'react';
import { Button, Popover, PopoverContent, PopoverTrigger } from '../components/ui';
import { formatAddress } from '../lib/utils';
import { useSDK, MetaMaskProvider } from '@metamask/sdk-react';
import { Link } from 'react-router-dom';
import { BrowserStorage, Chain, Provider, SmartWalletFactory } from '@ditto-network/core';
import { EthersContractFactory, EthersSigner } from '@ditto-network/ethers';
import { ethers } from 'ethers';

// https://github.com/Uniswap/smart-order-router/issues/484
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.Browser = {
  T: () => undefined,
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
  const { account } = useSDK();
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [provider, setProvider] = React.useState<Provider | null>(null);
  const [auth, setAuth] = React.useState(false);
  const [smartWalletAddress, setSmartWalletAddress] = React.useState<string>('');

  // TODO: fix workaround for init provider
  React.useEffect(() => {
    setTimeout(initProvider, 300);
  }, []);

  // 
  // 
  // 01. Init provider
  // 
  const initProvider = async () => {
    const signer = await new ethers.BrowserProvider(window.ethereum!).getSigner();
    setSigner(signer);

    const provider = new Provider({
      signer: new EthersSigner(signer),
      storage: new BrowserStorage(),
      contractFactory: new EthersContractFactory(signer),
    });

    setProvider(provider);
  };

  //
  //
  // 02. Sign message
  //
  const handleSignSDKClick = async () => {
    if (!provider) return;

    // TODO: а если юзер захочет минимизировать кол-во подписей?
    const authResult = await provider.authenticate();
    setAuth(authResult);
  };

  return (
    <div className="w-full h-screen max-w-screen-xl mx-auto">
      <div className="flex flex-col py-4 px-10 h-screen">
        <h1 className="text-4xl font-bold">Getting started</h1> 

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">00. Connect wallet</h2>
            <p className="text-gray-600">To get signer</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <ConnectWalletButton />
              </div>
              <p className="text-gray-600">
                Wallet: {account ? '✅ ' + account : '❌ Not initialized'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">01. Init</h2>
            <p className="text-gray-600">Init provider</p>
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

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">02. Auth</h2>
            <p className="text-gray-600">Connect wallet</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button className="w-min" onClick={handleSignSDKClick}>
                  Sign message
                </Button>
              </div>
              <p className="text-gray-600">Login status: {auth ? '✅ Logged in' : '❌ False'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Smart Wallet</h2>
            <p className="text-gray-600">Create a smart wallet and deploy it to the blockchain</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Workflow</h2>
            <p className="text-gray-600">Create a workflow and deploy it to the blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
