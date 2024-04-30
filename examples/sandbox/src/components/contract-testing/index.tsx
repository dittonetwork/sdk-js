import { useEffect, useState } from 'react';
import {
  Address,
  BrowserStorage,
  MutationTransactionReturnType,
  Provider,
} from '@ditto-network/core';
import storageAbi from './storage.abi.json';
import { Web3 } from 'web3';
import { Web3jsContractFactory, Web3jsSigner } from '@ditto-network/web3.js';

export const ContractTesting = () => {
  const [auth, setAuth] = useState(false);
  const [provider, setProvider] = useState<Provider>();
  const [hash, setHash] = useState('');
  const [value, setValue] = useState<string>('');

  const getProvider = async () => {
    const web3 = new Web3(window.ethereum);
    await window.ethereum!.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0] as Address;

    const txParamsBuildFn = async () => {
      const { baseFeePerGas } = await web3.eth.getBlock('pending');
      return {
        from: account,
        maxFeePerGas: `${BigInt(2) * baseFeePerGas!}`,
        maxPriorityFeePerGas: `${baseFeePerGas! / BigInt(2)}`,
      };
    };

    return new Provider({
      signer: new Web3jsSigner(web3, account, txParamsBuildFn),
      storage: new BrowserStorage(),
      contractFactory: new Web3jsContractFactory(web3, txParamsBuildFn),
    });
  };

  useEffect(() => {
    getProvider().then((provider) => {
      setProvider(provider);
    });
  }, []);

  // useEffect(() => {
  //   const browserProvider = new ethers.BrowserProvider(window.ethereum!);
  //   browserProvider.getSigner().then((signer) => {
  //     const provider = new Provider({
  //       signer: new EthersSigner(signer),
  //       storage: new BrowserStorage(),
  //       contractFactory: new EthersContractFactory(signer),
  //     });
  //
  //     setProvider(provider);
  //   });
  // }, []);

  const handleSignClick = async () => {
    const authResult = await provider!.authenticate();
    setAuth(authResult);
  };

  const handleGetValueClick = async () => {
    const contract = provider!
      .getContractFactory()
      .getContract('0xd10e3E8EbC4B55eAE572181be1554356Fb2a7767', JSON.stringify(storageAbi));

    const result = await contract.call<bigint>('retrieve');
    setValue(result.toString());
  };

  const handleSetValueClick = async () => {
    const value = prompt('Enter a value');
    const contract = provider!
      .getContractFactory()
      .getContract('0xd10e3E8EbC4B55eAE572181be1554356Fb2a7767', JSON.stringify(storageAbi));

    const tx = await contract.call<MutationTransactionReturnType, [bigint]>('store', [
      BigInt(value!),
    ]);
    setHash(`Wait for ${tx.hash} to be mined...`);

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
