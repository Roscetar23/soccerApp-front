'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

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
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch {
      // ignorar error del backend, el logout del frontend siempre procede
    }
    try {
      localStorage.removeItem('ligaFavorita');
      localStorage.removeItem('equipoFavorito');
    } catch {}
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
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
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="text-sm text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Cerrando...' : 'Cerrar sesión'}
      </button>
    </nav>
  );
}
