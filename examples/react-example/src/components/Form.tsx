import React from 'react';

type PropsType = {
  onSubmit: (from: string, to: string, amount: number) => void;
};

export const Form: React.FC<PropsType> = (props) => {
  const [fromTokenAddress, setFromTokenAddress] = React.useState<string>(
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  );
  const [toTokenAddress, setToTokenAddress] = React.useState<string>(
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
  );
  const [amount, setAmount] = React.useState<number>(1234560000);

  const onSubmit = () => {
    props.onSubmit(fromTokenAddress, toTokenAddress, 1234560000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-xl">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="network">
              Network:
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                id="network"
              >
                <option>Polygon</option>
                <option>Ethereum</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.95 7.95L10 12l4.05-4.05-1.414-1.415L10 9.172 7.364 6.536 5.95 7.95z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="from-token-address"
            >
              From token address:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="from-token-address"
              type="text"
              placeholder="0x..."
              value={fromTokenAddress}
              onChange={(e) => setFromTokenAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="to-token-address"
            >
              To token address:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="to-token-address"
              type="text"
              placeholder="0x..."
              value={toTokenAddress}
              onChange={(e) => setToTokenAddress(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount (Tokens):
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onSubmit}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
