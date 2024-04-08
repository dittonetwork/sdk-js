export const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-lg font-semibold">
        <a href="/" className="hover:text-gray-300">
          Home
        </a>
      </div>
      <div className="flex gap-4">
        <a href="/contracts" className="hover:text-gray-300">
          Contracts
        </a>
        <a href="/auth" className="hover:text-gray-300">
          Auth
        </a>
        <a href="/workflows" className="hover:text-gray-300">
          Workflows
        </a>
      </div>
    </div>
  </nav>
);
