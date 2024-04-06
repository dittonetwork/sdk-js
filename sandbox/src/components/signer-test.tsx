import {
  BrowserStorage,
  EthersContractFactory,
  EthersSigner,
  Provider,
} from '@ditto-sdk/ditto-sdk';
import { ethers } from 'ethers';
import { useState } from 'react';

export const SignerTest = () => {
  const [auth, setAuth] = useState(false);

  const handleSignClick = async () => {
    const signer = await new ethers.BrowserProvider(window.ethereum!).getSigner();

    const provider = new Provider({
      signer: new EthersSigner(signer),
      storage: new BrowserStorage(),
      contractFactory: new EthersContractFactory(signer),
    });

    const authResult = await provider.authenticate();
    setAuth(authResult);
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-white shadow-lg rounded-lg mt-5">
      <h1 className="font-bold text-center mb-4 w-100">{auth ? 'Logged in' : 'Please login'}</h1>

      <h1 className="text-xl font-bold text-center mb-4">Ditto SDK checker</h1>
      <p className="text-gray-600 mb-4">Connect wallet and press the button</p>

      <div className="text-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSignClick}
        >
          Sign message
        </button>
      </div>
    </div>
  );
};
