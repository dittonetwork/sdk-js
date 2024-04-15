import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import {
  BrowserStorage,
  Chain,
  EthersContractFactory,
  EthersSigner,
  Provider,
  SmartWalletFactory,
} from '@ditto-network/core';

export const Vaults: React.FC = () => {
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

  const handleGetDefaultVaultClick = async () => {
    if (!provider) {
      alert('No provider');
      return;
    }

    try {
      const sw = new SmartWalletFactory(provider);
      const defaultVault = await sw.getDefaultOrCreateVault(Chain.Polygon);
      alert(defaultVault.getAddress());
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetListClick = async () => {
    if (!provider) {
      alert('No provider');
      return;
    }

    try {
      const sw = new SmartWalletFactory(provider!);
      const list = await sw.list(Chain.Polygon);
      console.log('list', list);
      alert(`There are ${list.length} vaults in the list.`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTestVersions = async () => {
    if (!provider) {
      alert('No provider');
      return;
    }

    try {
      const sw = new SmartWalletFactory(provider!);
      const list = await sw.list(Chain.Polygon);

      const versions = await Promise.all(
        list.map(async (vault) => [vault.getAddress(), await vault.getVersion()])
      );

      alert(`There are versions ${JSON.stringify(Object.fromEntries(versions))}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="pt-4 text-center">Vaults</h1>
      <br />
      <div className="flex min-h-screen justify-center">
        <div className="flex flex-col gap-4">
          {!isAuthenticated && (
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
          )}

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleGetDefaultVaultClick}
          >
            Get default vault
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleGetListClick}
          >
            Get list
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleTestVersions}
          >
            Test versions
          </button>
        </div>
      </div>
    </>
  );
};
