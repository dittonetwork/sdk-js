import React from 'react';

type PropsType = {
  onSubmit: (
    from: string,
    fromDecimals: number,
    to: string,
    toDecimals: number,
    amount: bigint
  ) => Promise<void>;
};

export const Form: React.FC<PropsType> = (props) => {
  const [fromTokenAddress, setFromTokenAddress] = React.useState<string>(
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  );
  const [toTokenAddress, setToTokenAddress] = React.useState<string>(
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
  );
  const [amount, setAmount] = React.useState<bigint>(BigInt(12345600000000000));
  const [fromDecimals, setFromDecimals] = React.useState<number>(18);
  const [toDecimals, setToDecimals] = React.useState<number>(6);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onSubmit = async () => {
    setIsLoading(true);
    await props.onSubmit(fromTokenAddress, fromDecimals, toTokenAddress, toDecimals, amount);
    setIsLoading(false);
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
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="fromDecimals"
              type="number"
              placeholder="0"
              value={fromDecimals}
              onChange={(e) => setFromDecimals(Number(e.target.value))}
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
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="fromDecimals"
              type="number"
              placeholder="0"
              value={toDecimals}
              onChange={(e) => setToDecimals(Number(e.target.value))}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount (in weis):
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              placeholder="0"
              value={amount.toString()}
              onChange={(e) => setAmount(BigInt(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
