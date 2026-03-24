'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/onboarding');
    }
  }, [session, status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
      } else {
        router.push('/onboarding');
      }
    } catch {
      setError('Error de conexión. Por favor, inténtalo más tarde.');
    } finally {
      setIsPending(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4 transition-colors duration-300">
      {/* Background Orbs leveraging CSS variables */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-1000 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md flex flex-col items-center gap-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-6xl mb-2 drop-shadow-md"
          >
            ⚽
          </motion.div>
          <h1 className="font-bebas text-6xl text-foreground tracking-wider transition-colors drop-shadow-lg">
            THE MATCH{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-cyan-500">
              AWAITS
            </span>
          </h1>
          <p className="text-foreground/60 text-base transition-colors font-medium">
            Inicia sesión para saltar a la cancha
          </p>
        </div>

        {/* Login card: Ultra-Premium Glassmorphism */}
        <div className="w-full bg-card/60 backdrop-blur-xl border border-foreground/10 hover:border-neon/30 transition-all duration-300 rounded-3xl p-8 flex flex-col gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] xl:shadow-none dark:shadow-neon/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-foreground/80 text-sm font-semibold ml-1">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/30 transition-all"
                placeholder="Ej. Diegol10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-foreground/80 text-sm font-semibold ml-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/40 focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/30 transition-all"
                placeholder="Tu contraseña secreta"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-sm text-center font-medium" 
                role="alert"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isPending}
              className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-neon to-cyan-500 hover:from-neon hover:to-cyan-400 text-black font-extrabold tracking-wide transition-all shadow-lg shadow-neon/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Conectando...
                </>
              ) : (
                'Entrar a la Cancha'
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-foreground/50 text-xs text-center font-medium">
          Al entrar, aceptas los términos de juego de esta plataforma.
        </p>
      </motion.div>
    </div>
  );
}
