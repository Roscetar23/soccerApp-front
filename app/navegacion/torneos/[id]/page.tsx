'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchTorneoById } from '@/lib/api';
import { Torneo } from '@/types/torneo.types';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import BracketEliminacion from '@/components/torneos/BracketEliminacion';
import TablaLiga from '@/components/torneos/TablaLiga';

export default function TorneoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTorneoById(id as string)
      .then((data) => setTorneo(data))
      .catch(() => setError('Error al cargar el torneo'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/navegacion/torneos')}
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← Volver
        </button>

        {loading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && torneo && (
          <>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-emerald-400">{torneo.nombre}</h1>
              {torneo.tipo === 'eliminacion_directa' ? (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Eliminación directa
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Liga
                </span>
              )}
            </div>

            {torneo.tipo === 'eliminacion_directa' && (
              <BracketEliminacion equipos={torneo.equipos} />
            )}

            {torneo.tipo === 'liga' && (
              <TablaLiga equipos={torneo.equipos} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
