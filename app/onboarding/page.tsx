'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchEquipos, saveFavorito, getFavoritosByUsuario, ApiError } from '@/lib/api';
import { Equipo, Liga } from '@/types/equipo.types';
import LigaCard from '@/components/onboarding/LigaCard';
import EquipoCard from '@/components/onboarding/EquipoCard';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

type Paso = 1 | 2;

const LIGAS: Liga[] = ['colombiana', 'española', 'inglesa'];

export default function OnboardingWizard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [paso, setPaso] = useState<Paso>(1);
  const [ligaSeleccionada, setLigaSeleccionada] = useState<Liga | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingFavorito, setCheckingFavorito] = useState(true);

  const cargarEquipos = async (liga: Liga) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEquipos(liga);
      setEquipos(data);
    } catch {
      setError('No se pudieron cargar los equipos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    const userId = session?.user?.id;
    if (!userId) {
      setCheckingFavorito(false);
      return;
    }
    getFavoritosByUsuario(userId)
      .then((favoritos) => {
        if (favoritos.length >= 1) {
          // Sincronizar localStorage para que el dashboard funcione
          try {
            localStorage.setItem('ligaFavorita', favoritos[0].liga);
            localStorage.setItem('equipoFavorito', favoritos[0].equipo);
          } catch {}
          router.push('/navegacion');
        } else {
          setCheckingFavorito(false);
        }
      })
      .catch(() => {
        setCheckingFavorito(false);
      });
  }, [status, session]);

  useEffect(() => {
    if (paso === 2 && ligaSeleccionada) {
      cargarEquipos(ligaSeleccionada);
    }
  }, [paso, ligaSeleccionada]);

  const handleSelectLiga = (liga: Liga) => {
    setLigaSeleccionada(liga);
    setPaso(2);
  };

  const handleSelectEquipo = async (equipo: Equipo) => {
    const userId = session?.user?.id;
    try {
      localStorage.setItem('ligaFavorita', equipo.liga);
      localStorage.setItem('equipoFavorito', equipo._id);
    } catch {}
    try {
      await saveFavorito(equipo.liga, equipo._id, userId!);
      router.push('/navegacion');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        router.push('/navegacion');
      } else {
        setError('No se pudo guardar tu selección. Intenta de nuevo.');
      }
    }
  };

  const handleAtras = () => {
    setPaso(1);
  };

  if (checkingFavorito) {
    return (
      <div className="bg-background transition-colors duration-300 min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-background transition-colors duration-300 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Indicador de progreso */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <p className="text-foreground/60 text-sm font-medium">Paso {paso} de 2</p>
        <div className="flex gap-2">
          <div className={`w-8 h-2 rounded-full transition-colors duration-300 ${paso >= 1 ? 'bg-neon hover:bg-neon/80 text-black' : 'bg-foreground/5 transition-colors'}`} />
          <div className={`w-8 h-2 rounded-full transition-colors duration-300 ${paso >= 2 ? 'bg-neon hover:bg-neon/80 text-black' : 'bg-foreground/5 transition-colors'}`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {paso === 1 && (
          <motion.div 
            key="paso1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-lg flex flex-col items-center gap-6"
          >
          <h1 className="bebas-neue-regular tracking-wider text-5xl md:text-6xl text-foreground text-center drop-shadow-md">
            Selecciona tu liga favorita
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {LIGAS.map((liga) => (
              <LigaCard
                key={liga}
                liga={liga}
                seleccionada={ligaSeleccionada === liga}
                onSelect={handleSelectLiga}
              />
            ))}
          </div>
          </motion.div>
        )}

        {paso === 2 && (
          <motion.div 
            key="paso2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-2xl flex flex-col items-center gap-6"
          >
          <h1 className="bebas-neue-regular tracking-wider text-5xl md:text-6xl text-foreground text-center drop-shadow-md">
            Selecciona tu equipo favorito
          </h1>

          {loading && (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-4 w-full">
              <ErrorMessage message={error} />
              <button
                onClick={() => ligaSeleccionada && cargarEquipos(ligaSeleccionada)}
                className="px-8 py-3 rounded-xl bg-neon hover:bg-neon/80 text-black font-semibold transition-all hover:scale-105 shadow-lg shadow-neon/20"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && equipos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
              {equipos.map((equipo) => (
                <EquipoCard
                  key={equipo._id}
                  equipo={equipo}
                  onSelect={handleSelectEquipo}
                />
              ))}
            </div>
          )}

          {error && paso === 2 && !loading && equipos.length > 0 && (
            <ErrorMessage message={error} />
          )}

          <button
            onClick={handleAtras}
            className="mt-6 px-6 py-2 rounded-xl border-2 border-foreground/10 text-foreground/80 hover:border-neon hover:text-foreground transition-all text-sm font-semibold tracking-wide"
          >
            ← Atrás
          </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
