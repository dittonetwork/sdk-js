import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './app/app';
import { MetaMaskProvider } from '@metamask/sdk-react';
// import { ContractTesting } from './components/contract-testing';
// import { SignerTest } from './components/signer-test';
// import { Workflows } from './components/workflows';
// import { Navbar } from './navbar';
// import { Vaults } from './components/vaults';
// import { WorkflowsWeb3js } from '@/components/workflows-web3js';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    {/* <Navbar /> */}

    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MetaMaskProvider
              debug
              sdkOptions={{
                dappMetadata: {
                  name: 'Ditto React Example Dapp',
                  url: window.location.href,
                },
              }}
            >
              <App />
            </MetaMaskProvider>
          }
        />
        {/* <Route path="/contracts" element={<ContractTesting />} /> */}
        {/* <Route path="/auth" element={<SignerTest />} /> */}
        {/* <Route path="/workflows" element={<Workflows />} /> */}
        {/* <Route path="/workflows-web3js" element={<WorkflowsWeb3js />} /> */}
        {/* <Route path="/vaults" element={<Vaults />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

//  <SignerTest /> for sdk testing
