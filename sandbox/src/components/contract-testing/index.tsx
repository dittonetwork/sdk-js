import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { BrowserStorage, EthersContractFactory, EthersSigner, Provider } from '@ditto-sdk/core';
import storageAbi from './storage.abi.json';

export const ContractTesting = () => {
  const [auth, setAuth] = useState(false);
  const [provider, setProvider] = useState<Provider>();
  const [hash, setHash] = useState('');
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const browserProvider = new ethers.BrowserProvider(window.ethereum!);
    browserProvider.getSigner().then((signer) => {
      const provider = new Provider({
        signer: new EthersSigner(signer),
        storage: new BrowserStorage(),
        contractFactory: new EthersContractFactory(signer),
      });

      setProvider(provider);
    });
  }, []);

  const handleSignClick = async () => {
    const authResult = await provider!.authenticate();
    setAuth(authResult);
  };

  const handleGetValueClick = async () => {
    const contract = await provider!
      .getContractFactory()
      .getContract('0xd10e3E8EbC4B55eAE572181be1554356Fb2a7767', JSON.stringify(storageAbi));

    const result = await contract.call<null, bigint>('retrieve', null);
    setValue(result.toString());
  };

  const handleSetValueClick = async () => {
    const value = prompt('Enter a value');
    const contract = await provider!
      .getContractFactory()
      .getContract('0xd10e3E8EbC4B55eAE572181be1554356Fb2a7767', JSON.stringify(storageAbi));

    // @ts-expect-error cast
    const tx = await contract.call<string, { hash: string }>('store', BigInt(value!));
    setHash(`Wait for ${tx.hash} to be mined...`);
    // @ts-expect-error hack
    await tx.wait();
    setValue('');
    setHash(`Tx mined! Pls retieve the value`);
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-white shadow-lg rounded-lg mt-5">
      <h1 className="font-bold text-center mb-4 w-100">{auth ? 'Logged in' : 'Please login'}</h1>

      <h1 className="text-xl font-bold text-center mb-4">Ditto SDK checker::Contracts</h1>

      <div className="text-center">
        {!auth && (
          <>
            <p className="text-gray-600 mb-4 text-center">Connect wallet and press the button</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSignClick}
            >
              Auth
            </button>
          </>
        )}

        {auth && (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleGetValueClick}
            >
              Get value
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
              onClick={handleSetValueClick}
            >
              Set value
            </button>
            {hash && <div>{hash}</div>}
            {value && <div>Value: {value}</div>}
          </>
        )}
      </div>
    </div>
  );
};
