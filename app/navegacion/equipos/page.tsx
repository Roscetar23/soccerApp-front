'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTablaPosiciones, fetchEstadisticasEquipo, fetchProximosPartidosEquipo } from '@/lib/api';
import { Equipo, Liga, EstadisticasEquipo } from '@/types/equipo.types';
import { Partido } from '@/types/partido.types';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EstadisticasGrid from '@/components/dashboard/EstadisticasGrid';
import UltimosPartidosChart from '@/components/dashboard/UltimosPartidosChart';
import Image from 'next/image';

const LIGAS: Liga[] = ['colombiana', 'española', 'inglesa'];

const LIGA_LABELS: Record<Liga, string> = {
  colombiana: 'Liga Colombiana',
  española: 'Liga Española',
  inglesa: 'Liga Inglesa',
};

export default function EquiposDashboard() {
  const [activeLiga, setActiveLiga] = useState<Liga>('colombiana');
  const [equiposPorLiga, setEquiposPorLiga] = useState<Record<Liga, Equipo[]>>({
    colombiana: [],
    española: [],
    inglesa: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTeam, setSelectedTeam] = useState<Equipo | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [partidosLoading, setPartidosLoading] = useState(false);
  const [selectedStats, setSelectedStats] = useState<EstadisticasEquipo | null>(null);
  const [proximosPartidos, setProximosPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    Promise.allSettled(LIGAS.map((liga) => fetchTablaPosiciones(liga))).then((results) => {
      const agrupados: Record<Liga, Equipo[]> = { colombiana: [], española: [], inglesa: [] };
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          agrupados[LIGAS[i]] = result.value;
        }
      });
      setEquiposPorLiga(agrupados);
      setLoading(false);
    }).catch(() => {
      // Si el enpoint falla, evitamos crashear y mostramos error seguro
      setError('Error al cargar tabla de clasificación del servidor.');
      setLoading(false);
    });
  }, []);

  // Fetch stats and next matches when a team is clicked
  useEffect(() => {
    if (!selectedTeam) return;
    setStatsLoading(true);
    setPartidosLoading(true);
    
    Promise.allSettled([
      fetchEstadisticasEquipo(selectedTeam._id),
      fetchProximosPartidosEquipo(selectedTeam.nombre)
    ]).then(([statsRes, partidosRes]) => {
      if (statsRes.status === 'fulfilled') setSelectedStats(statsRes.value);
      if (partidosRes.status === 'fulfilled') setProximosPartidos(partidosRes.value);
      setStatsLoading(false);
      setPartidosLoading(false);
    });
  }, [selectedTeam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4">
        <ErrorMessage message={error} />
        <p className="text-foreground/50 text-sm">Asegúrate de que el Backend esté corriendo en el puerto respectivo.</p>
      </div>
    );
  }

  const equiposMostrados = equiposPorLiga[activeLiga] || [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-12 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-8 px-6 text-center"
        >
          <h1 className="text-5xl lg:text-7xl font-bebas tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-neon to-cyan-500 drop-shadow-sm">
            Ligas Internacionales
          </h1>
          <p className="text-foreground/60 mt-4 font-inter max-w-xl mx-auto text-sm lg:text-base">
            Selecciona una liga profesional para analizar su tabla de de posiciones oficial y el calendario en vivo.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-wrap justify-center gap-3 lg:gap-6 mb-12 px-4"
        >
          {LIGAS.map(liga => (
            <button
              key={liga}
              onClick={() => {
                setActiveLiga(liga);
                setSelectedTeam(null);
                setSelectedStats(null);
              }}
              className={`px-6 lg:px-8 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95 ${
                activeLiga === liga 
                  ? 'bg-neon/90 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400' 
                  : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {LIGA_LABELS[liga]}
            </button>
          ))}
        </motion.div>

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-card bg-opacity-40 border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 font-bebas text-neon tracking-wider">Tabla Clasificación</h2>
            <div className="overflow-x-auto min-h-[300px]">
              {equiposMostrados.length === 0 ? (
                <p className="text-foreground/50 text-center mt-10">No hay equipos registrados en esta liga</p>
              ) : (
                <table className="w-full text-left font-inter">
                  <thead>
                    <tr className="text-foreground/50 border-b border-white/10 text-xs lg:text-sm uppercase tracking-wider">
                      <th className="pb-4 pl-2 font-semibold">Pos</th>
                      <th className="pb-4 font-semibold">Equipo</th>
                      <th className="pb-4 text-center font-semibold text-white">PTS</th>
                      <th className="pb-4 text-center hidden sm:table-cell font-semibold">PJ</th>
                      <th className="pb-4 text-center hidden sm:table-cell font-semibold">V</th>
                      <th className="pb-4 text-center hidden sm:table-cell font-semibold">E</th>
                      <th className="pb-4 text-center hidden sm:table-cell font-semibold">D</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    key={activeLiga} 
                  >
                    {equiposMostrados.map((team, index) => (
                      <motion.tr 
                        key={team._id}
                        variants={{
                          hidden: { opacity: 0, y: 15 },
                          show: { opacity: 1, y: 0 }
                        }}
                        onClick={() => setSelectedTeam(team)}
                        className={`cursor-pointer transition-all duration-200 border-b border-white/5 last:border-0 hover:bg-white/5 group ${
                          selectedTeam?._id === team._id ? 'bg-emerald-500/10 border-l-2 border-l-neon' : 'border-l-2 border-l-transparent'
                        }`}
                      >
                        <td className={`py-5 pl-4 font-bold ${index < 3 ? 'text-neon' : 'text-foreground/70'}`}>
                          {index + 1}
                        </td>
                        <td className="py-5 font-semibold text-foreground group-hover:text-emerald-300 transition-colors flex items-center gap-3">
                          {team.escudo && team.escudo.startsWith('http') && (
                            <Image src={team.escudo} alt={team.nombre} width={24} height={24} className="object-contain" unoptimized />
                          )}
                          {team.nombre}
                        </td>
                        <td className="py-5 text-center font-bold text-lg text-white group-hover:text-emerald-400">
                          {team.estadisticas?.puntos || 0}
                        </td>
                        <td className="py-5 text-center hidden sm:table-cell text-foreground/70">{team.estadisticas?.partidosJugados || 0}</td>
                        <td className="py-5 text-center hidden sm:table-cell text-emerald-400/80">{team.estadisticas?.victorias || 0}</td>
                        <td className="py-5 text-center hidden sm:table-cell text-gray-400">{team.estadisticas?.empates || 0}</td>
                        <td className="py-5 text-center hidden sm:table-cell text-red-400/80">{team.estadisticas?.derrotas || 0}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 min-h-[500px]"
          >
            {selectedTeam ? (
              <>
                <div className="relative bg-gradient-to-br from-card to-background border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 rounded-bl-full group-hover:scale-110 transition-transform blur-xl" />
                  
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    {selectedTeam.escudo && selectedTeam.escudo.startsWith('http') && (
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image src={selectedTeam.escudo} alt={selectedTeam.nombre} fill className="object-contain" unoptimized />
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-bebas uppercase tracking-wider">{selectedTeam.nombre}</h3>
                      <p className="text-xs text-neon uppercase tracking-widest font-semibold">{LIGA_LABELS[selectedTeam.liga]}</p>
                    </div>
                  </div>

                  {statsLoading ? (
                    <div className="flex justify-center py-10 relative z-10"><Spinner /></div>
                  ) : selectedStats ? (
                    <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="bg-black/40 p-4 rounded-xl flex flex-col items-center justify-center border border-white/5 hover:border-emerald-500/30 transition-colors">
                        <p className="text-foreground/50 text-xs uppercase mb-1 font-medium tracking-wide">Goles a Favor</p>
                        <p className="text-3xl font-bold text-emerald-400 font-bebas tracking-wider">{selectedStats.golesFavor || 0}</p>
                      </div>
                      <div className="bg-black/40 p-4 rounded-xl flex flex-col items-center justify-center border border-white/5 hover:border-red-500/30 transition-colors">
                        <p className="text-foreground/50 text-xs uppercase mb-1 font-medium tracking-wide">Goles en Contra</p>
                        <p className="text-3xl font-bold text-red-500/80 font-bebas tracking-wider">{selectedStats.golesContra || 0}</p>
                      </div>
                      
                      <div className="col-span-2 mt-4 space-y-4">
                        <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                          <p className="text-foreground/60 text-xs font-semibold mb-3 uppercase tracking-wide">Desempeño</p>
                          <EstadisticasGrid estadisticas={selectedStats} />
                        </div>
                        <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                          <p className="text-foreground/60 text-xs font-semibold mb-2 uppercase tracking-wide">Últimos resultados</p>
                          <UltimosPartidosChart resultados={selectedStats.ultimosPartidos} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground/50 text-sm mt-4 relative z-10">Estadísticas no disponibles</p>
                  )}
                </div>

                {/* Card Próximos Partidos Reales desde Backend */}
                <div className="bg-card bg-opacity-40 border border-white/10 rounded-3xl p-8 shadow-2xl flex-1 backdrop-blur-md">
                  <h3 className="text-2xl font-bold mb-6 font-bebas text-cyan-400 tracking-wider">Próximos Encuentros</h3>
                  {partidosLoading ? (
                    <div className="flex justify-center p-8"><Spinner /></div>
                  ) : (
                    <div className="space-y-4">
                      {proximosPartidos.map(match => (
                        <motion.div 
                          key={match._id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-black/30 border border-white/5 p-5 rounded-2xl hover:bg-black/50 hover:border-cyan-500/30 transition-all duration-300"
                        >
                          <div className="flex justify-between items-center mb-4 text-xs font-medium text-foreground/50 uppercase tracking-wide">
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              {new Date(match.fechaPartido).toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="truncate ml-4 max-w-[120px]">{match.estadio}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold font-inter text-sm lg:text-base">
                            <span className={`flex-1 text-right break-words ${match.equipoLocal === selectedTeam.nombre ? 'text-neon' : 'text-foreground'}`}>
                              {match.equipoLocal}
                            </span>
                            <span className="text-foreground/30 px-3 py-1 font-bebas tracking-widest bg-white/5 rounded-lg mx-3">VS</span>
                            <span className={`flex-1 break-words ${match.equipoVisitante === selectedTeam.nombre ? 'text-neon' : 'text-foreground'}`}>
                              {match.equipoVisitante}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      {proximosPartidos.length === 0 && (
                        <div className="text-center py-12 text-foreground/40 text-sm font-inter">No hay partidos programados próximamente.</div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
               <div className="bg-card/40 border border-white/10 rounded-3xl p-12 text-center shadow-xl h-full flex flex-col items-center justify-center backdrop-blur-md">
                <span className="text-5xl mb-6 opacity-80 rotate-12">👆</span>
                <p className="text-foreground/60 font-inter max-w-xs leading-relaxed">Selecciona un equipo de la tabla para analizar al detalle sus estadísticas de goles y el calendario.</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
