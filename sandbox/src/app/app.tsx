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
import React from 'react';

const factoryAddress = '0xF03C8CaB74b5721eB81210592C9B06f662e9951E';
const factoryAbi = `[
  {
    "type": "function",
    "name": "addNewImplementation",
    "inputs": [
      {
        "name": "newImplemetation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "crossChainDeploy",
    "inputs": [
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "version",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "vaultId",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deploy",
    "inputs": [
      {
        "name": "version",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "vaultId",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "implementation",
    "inputs": [
      {
        "name": "version",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "predictDeterministicVaultAddress",
    "inputs": [
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "vaultId",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [
      {
        "name": "predicted",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setBridgeReceiverContract",
    "inputs": [
      {
        "name": "_dittoBridgeReceiver",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setEntryPointCreatorAddress",
    "inputs": [
      {
        "name": "_entryPointCreator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "upgradeLogic",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "vaultProxyAdmin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "versions",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false,
    "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
  },
  {
    "type": "event",
    "name": "VaultCreated",
    "inputs": [
      {
        "name": "creator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "vault",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "vaultId",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      }
    ],
    "anonymous": false,
    "signature": "0x78f8ade376823ef6c3e593ee05639dd8d167f50df13b54ed4e283fc734b7daa1"
  },
  {
    "type": "error",
    "name": "Ownable_NewOwnerCannotBeAddressZero",
    "inputs": [],
    "signature": "0x7b30466f"
  },
  {
    "type": "error",
    "name": "Ownable_SenderIsNotOwner",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "signature": "0x37c14b45"
  },
  {
    "type": "error",
    "name": "VaultFactory_AlreadyInitialized",
    "inputs": [],
    "signature": "0xd1a8e5c3"
  },
  {
    "type": "error",
    "name": "VaultFactory_IdAlreadyUsed",
    "inputs": [
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "vaultId",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "signature": "0xb1c9479c"
  },
  {
    "type": "error",
    "name": "VaultFactory_InvalidDeployArguments",
    "inputs": [],
    "signature": "0x527df1b3"
  },
  {
    "type": "error",
    "name": "VaultFactory_NotAuthorized",
    "inputs": [],
    "signature": "0x1c1c04bb"
  },
  {
    "type": "error",
    "name": "VaultFactory_VersionDoesNotExist",
    "inputs": [],
    "signature": "0xd4e632e3"
  }
]
`;

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
    if (sdk) {
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

    const addr = await smartWalletFactory.predictVaultAddress();
    setSmartWalletAddress(addr as string);
  };

  const handlePredictVaultAddressClick = async () => {
    if (!provider) {
      alert('Please init provider and connect wallet');
      return;
    }

    const contractFactory = new Contract(
      factoryAddress,
      factoryAbi,
      provider.getSigner().getRawSigner()
    );
    const address = await provider?.getSigner().getAddress();
    const vaultId = 1;

    const vault = await contractFactory.predictDeterministicVaultAddress(address, vaultId);
    setSmartWalletAddress(vault);
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
                  Init provider (SDK)
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
                  Sign message (SDK)
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
                  Predict Vault Address (SDK)
                </Button>

                <Button className="w-min" onClick={handlePredictVaultAddressClick}>
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
