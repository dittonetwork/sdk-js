import { Button, formatAddress, Popover, PopoverContent, PopoverTrigger } from '@ditto-sdk/shared';
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { Link } from "react-router-dom";
import {
  BrowserStorage,
  EthersContractFactory,
  EthersSigner,
  Provider,
  SmartWalletFactoryContract,
} from '@ditto-sdk/ditto-sdk';
import { ethers } from 'ethers';
import { useState } from 'react';

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
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
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
  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
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
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>('');

  const handlePredictVaultAddressSDKClick = async () => {  
    const signer = await new ethers.BrowserProvider(window.ethereum!).getSigner();

    const provider = new Provider({
      signer: new EthersSigner(signer),
      storage: new BrowserStorage(),
      contractFactory: new EthersContractFactory(ethers.Contract, signer),
    });

    const smartWalletFactory = new SmartWalletFactoryContract(provider, new EthersSigner(signer));

    const addr = await smartWalletFactory.predictVaultAddress();
    console.log('addr', addr);
  };

  const handlePredictVaultAddressClick = async () => {
    // const signer = await new ethers.BrowserProvider(window.ethereum!).getSigner();
    
    // const contractFactory = new Contract(factoryAddress, factoryAbi, signer);

    // const vault = await contractFactory.predictDeterministicVaultAddress(
    //       signer.address,
    //       vaultId
    //   );
    //   console.log(vault);

    //   // deploy
    //   const vaultCodeSize = (await provider.getCode(vault)).length;
    //   let tx;

    //   if (vaultCodeSize === 0) {
    //       tx = await contractFactory.deploy(1, vaultId);
    //       console.log(await tx.wait());
    //   }
  }


  return (
    <div className="w-full h-screen">
      <NavBar />
      <div className="flex flex-col py-4 px-10 h-screen">
        <h1 className="text-6xl">Getting started</h1>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Smart Wallet</h2>
            <p className="text-gray-600">
              Create a smart wallet and deploy it to the blockchain
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  className="w-min"
                  onClick={handlePredictVaultAddressClick}
                >
                  Predict Vault Address (SDK)
                </Button>

                <Button
                  className="w-min"
                  onClick={handlePredictVaultAddressClick}
                >
                  Predict Vault Address
                </Button>
              </div>
              <p className="text-gray-600">
                This will predict the address of the smart wallet based on the wallet address
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Workflow</h2>
            <p className="text-gray-600">
              Create a workflow and deploy it to the blockchain
            </p>
          </div>
        </div> 
      </div>
    </div>
  );
}

export default App;
