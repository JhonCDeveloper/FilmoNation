import { FilmoNationLogo } from './Logo';
import Navbar from '../feature/Navbar';

export default function Header() {
  return (
    <header className="w-full border-b border-line bg-surface">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-5 flex items-center justify-between">
        <FilmoNationLogo />
        <Navbar />
      </div>
    </header>
  );
}
