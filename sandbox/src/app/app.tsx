import React from 'react';
import { Button, formatAddress, Popover, PopoverContent, PopoverTrigger } from '@ditto-sdk/shared';
import { useSDK, MetaMaskProvider } from '@metamask/sdk-react';
import { Link } from 'react-router-dom';
import {
  BrowserStorage,
  EthersContractFactory,
  EthersSigner,
  Provider,
  SmartWalletFactory,
} from '@ditto-sdk/ditto-sdk';
import { Contract, ethers } from 'ethers';

// https://github.com/Uniswap/smart-order-router/issues/484
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.Browser = {
  T: () => undefined,
};

const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if {
      sdk.terminate();
    }
  };

  return (
    <div className="relative">
      {connected ? (
        <Popover>
          <PopoverTrigger>{formatAddress(account)}</PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

const NavBar = () => {
  const host = typeof window !== 'undefined' ? window.location.host : 'defaultHost';

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: 'Next-Metamask-Boilerplate',
      url: host, // using the host constant defined above
    },
  };

  return (
    <nav className="flex items-center justify-between max-w-screen-xl px-6 mx-auto py-7 rounded-xl">
      <Link to="/" className="flex gap-1 px-6">
        <span className="hidden text-2xl font-bold sm:block">
          <span className="text-gray-900">Ditto React Example Dapp</span>
        </span>
      </Link>
      <div className="flex gap-4 px-6">
        <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
          <ConnectWalletButton />
        </MetaMaskProvider>
      </div>
    </nav>
  );
};

export function App() {
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [provider, setProvider] = React.useState<Provider | null>(null);
  const [auth, setAuth] = React.useState(false);
  const [smartWalletAddress, setSmartWalletAddress] = React.useState<string>('');

  // TODO: fix workaround for init provider
  React.useEffect(() => {
    setTimeout(initProvider, 300);
  }, []);

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

  const handleSignSDKClick = async () => {
    console.log('handleSignSDKClick', provider);
    if (!provider) return;

    // TODO: а если юзер захочет минимизировать кол-во подписей?
    const authResult = await provider.authenticate();
    setAuth(authResult);
  };

  const handlePredictVaultAddressSDKClick = async () => {
    console.log('handlePredictVaultAddressSDKClick');
    if (!provider) return;

    const smartWalletFactory = new SmartWalletFactory(provider);

    const vaultId = 1;
    const addr = await smartWalletFactory.predictVaultAddress(vaultId);
    setSmartWalletAddress(addr as string);
  };

  return (
    <div className="w-full h-screen">
      <NavBar />
      <div className="flex flex-col py-4 px-10 h-screen">
        <h1 className="text-6xl">Getting started</h1>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Init</h2>
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
            <h2 className="text-2xl font-bold">Auth</h2>
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

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button className="w-min" onClick={handlePredictVaultAddressSDKClick}>
                  Predict Vault Address
                </Button>
              </div>
              <p className="text-gray-600">
                This will predict the address of the smart wallet based on the wallet address
              </p>
              <p className="text-gray-600">
                Predicted address: {smartWalletAddress ? smartWalletAddress : '❌ Not predicted'}
              </p>
            </div>
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
