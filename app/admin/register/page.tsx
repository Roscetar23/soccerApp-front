'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsPending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setUsername('');
        setPassword('');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? 'Error al registrar el usuario');
      }
    } catch {
      setError('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Registrar Usuario</h1>
          <p className="text-foreground/60 text-sm">Crea un nuevo usuario en el sistema</p>
        </div>

        {/* Card */}
        <div className="bg-card/80 transition-colors backdrop-blur-sm border border-foreground/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-foreground/80 text-sm font-medium">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl bg-foreground/5 transition-colors border border-foreground/20 text-foreground placeholder-slate-400 focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-colors"
                placeholder="Nombre de usuario"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-foreground/80 text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl bg-foreground/5 transition-colors border border-foreground/20 text-foreground placeholder-slate-400 focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-colors"
                placeholder="Contraseña"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="text-neon text-sm text-center" role="status">
                Usuario registrado correctamente.
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-600 hover:bg-slate-500 text-foreground font-semibold transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrar usuario'
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href="/admin" className="text-foreground/60 hover:text-foreground/80 text-sm transition-colors">
            ← Volver a Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
