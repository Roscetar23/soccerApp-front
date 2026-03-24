'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchEquipoById, fetchEstadisticasEquipo } from '@/lib/api';
import { Equipo, EstadisticasEquipo } from '@/types/equipo.types';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EquipoHeader from '@/components/dashboard/EquipoHeader';
import EstadisticasGrid from '@/components/dashboard/EstadisticasGrid';
import UltimosPartidosChart from '@/components/dashboard/UltimosPartidosChart';
import ProbabilidadPredictiva from '@/components/dashboard/ProbabilidadPredictiva';

export default function NavegacionPage() {
  const [equipoId, setEquipoId] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [equipoError, setEquipoError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEquipo | null>(null);
  const [estadisticasError, setEstadisticasError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('equipoFavorito');
    setEquipoId(id);

    if (!id) return;

    setLoading(true);

    Promise.allSettled([
      fetchEquipoById(id),
      fetchEstadisticasEquipo(id),
    ]).then(([equipoResult, estadisticasResult]) => {
      if (equipoResult.status === 'fulfilled') {
        setEquipo(equipoResult.value);
      } else {
        setEquipoError(equipoResult.reason?.message ?? 'Error al cargar el equipo');
      }

      if (estadisticasResult.status === 'fulfilled') {
        setEstadisticas(estadisticasResult.value);
      } else {
        setEstadisticasError('Estadísticas no disponibles');
      }

      setLoading(false);
    });
  }, []);

  const handleRetry = () => {
    if (!equipoId) return;
    setEquipoError(null);
    setEstadisticasError(null);
    setLoading(true);

    Promise.allSettled([
      fetchEquipoById(equipoId),
      fetchEstadisticasEquipo(equipoId),
    ]).then(([equipoResult, estadisticasResult]) => {
      if (equipoResult.status === 'fulfilled') {
        setEquipo(equipoResult.value);
      } else {
        setEquipoError(equipoResult.reason?.message ?? 'Error al cargar el equipo');
      }

      if (estadisticasResult.status === 'fulfilled') {
        setEstadisticas(estadisticasResult.value);
      } else {
        setEstadisticasError('Estadísticas no disponibles');
      }

      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Mientras el useEffect no corrió aún (SSR/hydration) */}
        {equipoId === undefined && (
          <div className="flex justify-center mt-20">
            <Spinner />
          </div>
        )}

        {equipoId === null && (
          <div className="text-center space-y-4 mt-20">
            <p className="text-foreground/60 text-lg">
              Completa el onboarding para ver tu equipo favorito
            </p>
            <Link
              href="/onboarding"
              className="inline-block mt-2 px-6 py-3 rounded-xl bg-neon hover:bg-neon/80 text-black font-semibold shadow-lg shadow-neon/20 transition-all"
            >
              Ir al onboarding
            </Link>
          </div>
        )}

        {equipoId !== null && loading && (
          <div className="flex justify-center mt-20">
            <Spinner />
          </div>
        )}

        {equipoId !== null && !loading && equipoError && (
          <div className="mt-20">
            <ErrorMessage message={equipoError} />
            <button
              onClick={handleRetry}
              className="mt-4 px-6 py-3 rounded-xl bg-neon hover:bg-neon/80 text-black font-semibold shadow-lg shadow-neon/20 transition-all"
            >
              Reintentar
            </button>
          </div>
        )}

        {equipoId !== null && !loading && equipo && (
          <>
            <EquipoHeader equipo={equipo} />

            {estadisticasError && (
              <p className="text-yellow-400 text-sm text-center mt-2">{estadisticasError}</p>
            )}

            {estadisticas && (
              <div className="space-y-6 mt-4">
                <EstadisticasGrid estadisticas={estadisticas} />
                
                {/* Gráficas secundarias en Grid Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Historial Chart */}
                  <div className="bg-card transition-colors rounded-2xl p-6 border border-foreground/5 shadow-xl h-full">
                    <h2 className="bebas-neue-regular tracking-widest text-2xl text-foreground/90 mb-4 drop-shadow-sm text-center md:text-left">
                      Últimos partidos
                    </h2>
                    <div className="h-[250px] w-full flex items-center justify-center">
                      <UltimosPartidosChart resultados={estadisticas.ultimosPartidos} />
                    </div>
                  </div>

                  {/* Motor Predictivo */}
                  <div className="h-full">
                    <ProbabilidadPredictiva equipo={equipo} estadisticas={estadisticas} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
