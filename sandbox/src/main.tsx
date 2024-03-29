import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { MetaMaskProvider } from '@metamask/sdk-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </StrictMode>
);
