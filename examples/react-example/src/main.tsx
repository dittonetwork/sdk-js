import * as ReactDOM from 'react-dom/client';

import App from './app/app';

// https://github.com/Uniswap/smart-order-router/issues/484
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.Browser = {
  T: () => undefined,
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
