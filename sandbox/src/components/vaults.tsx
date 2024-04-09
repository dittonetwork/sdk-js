import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import {
  BrowserStorage,
  Chain,
  EthersContractFactory,
  EthersSigner,
  Provider,
  SmartWalletFactory,
} from '@ditto-sdk/ditto-sdk';

export const Vaults: React.FC<{}> = () => {
  const [provider, setProvider] = React.useState<Provider | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const browserProvider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await browserProvider.getSigner();
      const provider = new Provider({
        signer: new EthersSigner(signer),
        storage: new BrowserStorage(),
        contractFactory: new EthersContractFactory(signer as any),
      });

      setProvider(provider);
    };

    init();
  }, []);

  return (
    <>
      <h1 className="pt-4 text-center">Vaults</h1>
      <br />
      <div className="flex min-h-screen justify-center">
        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              if (!provider) {
                alert('No provider');
                return;
              }

              try {
                await provider.authenticate();
                setIsAuthenticated(true);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Authenticate
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              if (!provider) {
                alert('No provider');
                return;
              }

              try {
                const sw = new SmartWalletFactory(provider!, Chain.Polygon);
                const defaultVault = await sw.getDefaultOrCreateVault(Chain.Polygon);
                alert(defaultVault.address);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Get default vault
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
              if (!provider) {
                alert('No provider');
                return;
              }

              try {
                const sw = new SmartWalletFactory(provider!, Chain.Polygon);
                const predictedAddress = await sw.predictVaultAddress();
                alert(predictedAddress);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Predict Vault Address
          </button>
        </div>
      </div>
    </>
  );
};
