import { FilmoNationLogo } from './Logo';
import Navbar from '../feature/Navbar';

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full py-5 px-8 md:px-20 border-b border-line bg-surface">
      <FilmoNationLogo />
      <Navbar />
    </header>
  );
}
