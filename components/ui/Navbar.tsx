'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/contador', label: 'Partidos' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-700 px-6 py-3">
      <ul className="flex gap-6">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={
                  isActive
                    ? 'font-bold text-emerald-400 border-b-2 border-emerald-400 pb-1 transition-colors'
                    : 'text-slate-300 hover:text-emerald-300 transition-colors'
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
