import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './app/app';
import { MetaMaskProvider } from '@metamask/sdk-react';
import { ContractTesting } from './components/contract-testing';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
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
        <Route path="/contracts" element={<ContractTesting />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

//  <SignerTest /> for sdk testing
