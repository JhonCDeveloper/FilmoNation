import { Link } from 'react-router';
import { HeaderSearch } from './HeaderSearch';

export default function Navbar() {
  return (
    <nav className="flex items-center gap-10 text-ink-muted font-mono text-sm">
      <Link className="whitespace-nowrap hover:text-brand transition-colors" to="/territorio">
        TERRITORIO
      </Link>
      <Link className="whitespace-nowrap hover:text-brand transition-colors" to="/pasaporte">
        MI PASAPORTE
      </Link>

      {/* Buscador Predictivo */}
      <HeaderSearch />
    </nav>
  );
}
