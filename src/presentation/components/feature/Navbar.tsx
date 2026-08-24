import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex items-center gap-10 text-ink-muted font-mono text-sm">
      <a className="whitespace-nowrap" href="/">
        TERRITORIO
      </a>
      <a className="whitespace-nowrap" href="/">
        MI PASAPORTE
      </a>
      <a className="whitespace-nowrap" href="/">
        EXPEDIENTE
      </a>

      <div className="relative w-full max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          type="search"
          placeholder="Buscar Territorio..."
          className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring focus:ring-brand"
        />
      </div>
    </nav>
  );
}
