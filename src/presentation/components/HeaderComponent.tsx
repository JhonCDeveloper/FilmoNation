import { FilmoNationLogo } from '../../shared/components/Logo';
import { Search } from 'lucide-react';


export default function Header() {
    return (
        <header className="flex justify-between w-screen py-10 px-20 bg-panel border-b-px">
            <FilmoNationLogo />
            <nav className="flex items-center gap-10 text-ink-muted">

                <a className="whitespace-nowrap" href="/">TERRITORIO</a>
                <a className="whitespace-nowrap" href="/">MI PASAPORTE</a>
                <a className="whitespace-nowrap" href="/">EXPEDIENTE</a>

                <div className="relative w-full max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="search" placeholder="Explorar Nuevos Territorios..." className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-brand" />
                </div>
            </nav>
        </header>
    )
}