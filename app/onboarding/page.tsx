'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchEquipos, saveFavorito } from '@/lib/api';
import { Equipo, Liga } from '@/types/equipo.types';
import LigaCard from '@/components/onboarding/LigaCard';
import EquipoCard from '@/components/onboarding/EquipoCard';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

type Paso = 1 | 2;

const LIGAS: Liga[] = ['colombiana', 'española', 'inglesa'];

export default function OnboardingWizard() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>(1);
  const [ligaSeleccionada, setLigaSeleccionada] = useState<Liga | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (paso === 2 && ligaSeleccionada) {
      cargarEquipos(ligaSeleccionada);
    }
  }, [paso, ligaSeleccionada]);

  const handleSelectLiga = (liga: Liga) => {
    setLigaSeleccionada(liga);
    setPaso(2);
  };

  const handleSelectEquipo = async (equipo: Equipo) => {
    try {
      localStorage.setItem('ligaFavorita', equipo.liga);
      localStorage.setItem('equipoFavorito', equipo._id);
    } catch {}
    try {
      await saveFavorito(equipo.liga, equipo._id);
    } catch {}
    router.push('/navegacion');
  };

  const handleAtras = () => {
    setPaso(1);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Indicador de progreso */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <p className="text-slate-400 text-sm font-medium">Paso {paso} de 2</p>
        <div className="flex gap-2">
          <div className={`w-8 h-2 rounded-full transition-colors duration-300 ${paso >= 1 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
          <div className={`w-8 h-2 rounded-full transition-colors duration-300 ${paso >= 2 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
        </div>
      </div>

      {paso === 1 && (
        <div className="w-full max-w-lg flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-white text-center">
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
        </div>
      )}

      {paso === 2 && (
        <div className="w-full max-w-2xl flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-white text-center">
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
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
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

          <button
            onClick={handleAtras}
            className="mt-2 px-5 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            ← Atrás
          </button>
        </div>
      )}
    </div>
  );
}
