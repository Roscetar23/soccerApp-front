'use client';

import { useEffect, useState } from 'react';
import { fetchEquipos, fetchEstadisticasEquipo } from '@/lib/api';
import { Equipo, Liga, EstadisticasEquipo } from '@/types/equipo.types';
import Spinner from '@/components/ui/Spinner';
import Image from 'next/image';
import EstadisticasGrid from '@/components/dashboard/EstadisticasGrid';
import UltimosPartidosChart from '@/components/dashboard/UltimosPartidosChart';

const LIGAS: Liga[] = ['colombiana', 'española', 'inglesa'];

const LIGA_LABELS: Record<Liga, string> = {
  colombiana: 'Liga Colombiana',
  española: 'La Liga',
  inglesa: 'Premier League',
};

function EquipoRow({ equipo }: { equipo: Equipo }) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<EstadisticasEquipo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (stats) return; // ya cargadas
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEstadisticasEquipo(equipo._id);
      setStats(data);
    } catch {
      setError('Estadísticas no disponibles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card transition-colors rounded-xl overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-foreground/5 transition-colors transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image
              src={equipo.escudo}
              alt={equipo.nombre}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="text-foreground font-medium">{equipo.nombre}</span>
        </div>
        <span className="text-foreground/60 text-sm">{open ? '▲ Ocultar' : '▼ Ver estadísticas'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-700 pt-4">
          {loading && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
          {error && <p className="text-yellow-400 text-sm">{error}</p>}
          {stats && (
            <div className="space-y-4">
              <EstadisticasGrid estadisticas={stats} />
              <div className="bg-background transition-colors rounded-lg p-4">
                <p className="text-foreground/60 text-xs font-semibold mb-2 uppercase tracking-wide">Últimos partidos</p>
                <UltimosPartidosChart resultados={stats.ultimosPartidos} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EquiposPage() {
  const [equiposPorLiga, setEquiposPorLiga] = useState<Record<Liga, Equipo[]>>({
    colombiana: [],
    española: [],
    inglesa: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled(LIGAS.map((liga) => fetchEquipos(liga))).then((results) => {
      const agrupados: Record<Liga, Equipo[]> = { colombiana: [], española: [], inglesa: [] };
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          agrupados[LIGAS[i]] = result.value;
        }
      });
      setEquiposPorLiga(agrupados);
      setLoading(false);
    }).catch(() => {
      setError('Error al cargar los equipos');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300 flex justify-center items-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-foreground">Equipos</h1>
        {LIGAS.map((liga) => (
          <section key={liga}>
            <h2 className="text-neon font-semibold text-lg mb-4">{LIGA_LABELS[liga]}</h2>
            {equiposPorLiga[liga].length === 0 ? (
              <p className="text-slate-500 text-sm">No hay equipos registrados en esta liga.</p>
            ) : (
              <div className="space-y-3">
                {equiposPorLiga[liga].map((equipo) => (
                  <EquipoRow key={equipo._id} equipo={equipo} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
