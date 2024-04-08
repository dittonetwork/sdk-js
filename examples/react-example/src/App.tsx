import React, { useEffect } from 'react';
import './App.css';
import { Form } from './components/Form';
import { BrowserProvider } from 'ethers';

function App() {
  const [dittoProvider, setDittoProvider] = React.useState<DittoProvider>();

  useEffect(() => {
    const init = async () => {
      const browserProvider = new BrowserProvider(window.ethereum!);
      const signer = await browserProvider.getSigner();

      const provider = new DittoProvider({
        signer: new EthersSigner(signer),
        storage: new BrowserStorage(),
        contractFactory: new EthersContractFactory(signer),
      });

      setDittoProvider(provider);

      await dittoProvider!.authenticate();
    };

    init();
  }, []);

  const handleSubmit = (from: string, to: string, amount: number) => {
    console.log(from, to, amount);
  };

  return <Form onSubmit={handleSubmit} />;
}

export default App;
