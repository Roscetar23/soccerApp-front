'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchTorneoById, fetchPartidosTorneo } from '@/lib/api';
import { Torneo } from '@/types/torneo.types';
import { PartidoTorneo } from '@/types/partido.types';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import BracketEliminacion from '@/components/torneos/BracketEliminacion';
import TablaLiga from '@/components/torneos/TablaLiga';
import PartidoTorneoForm from '@/components/torneos/PartidoTorneoForm';
import HistorialPartidos from '@/components/torneos/HistorialPartidos';

export default function TorneoDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [partidos, setPartidos] = useState<PartidoTorneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = () => {
    setLoading(true);
    Promise.all([
      fetchTorneoById(id as string),
      fetchPartidosTorneo(id as string)  
    ])
    .then(([torneoData, partidosData]) => {
      setTorneo(torneoData);
      setPartidos(partidosData);
    })
    .catch(() => setError('Error al cargar el torneo y/o sus resultados'))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => router.push('/navegacion/torneos')}
          className="text-foreground/60 hover:text-foreground transition-colors text-sm"
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
              <h1 className="text-3xl font-bold text-neon">{torneo.nombre}</h1>
              {torneo.tipoFormato === 'eliminacion_directa' ? (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-neon/20 text-neon border border-neon/30">
                  Eliminación directa
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Liga
                </span>
              )}
            </div>

            <PartidoTorneoForm 
              torneo={torneo}
              partidos={partidos} 
              onPartidoCreated={() => {
                cargarDatos(); // Refresh table!
              }} 
            />

            {torneo.tipoFormato === 'eliminacion_directa' && (
              <BracketEliminacion equipos={torneo.equipos} partidos={partidos} />
            )}

            {torneo.tipoFormato === 'liguilla' && (
              <TablaLiga equipos={torneo.equipos} partidos={partidos} />
            )}

            <HistorialPartidos partidos={partidos} />
          </>
        )}
      </div>
    </div>
  );
}
