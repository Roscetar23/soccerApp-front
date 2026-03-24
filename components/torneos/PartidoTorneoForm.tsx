'use client';

import { useState, useMemo } from 'react';
import { Torneo } from '@/types/torneo.types';
import { PartidoTorneo } from '@/types/partido.types';
import { createPartidoTorneo } from '@/lib/api';
import { computarRondasEliminacion, getPartidosFaltantesLiga } from '@/lib/torneo.utils';
import { motion } from 'framer-motion';

interface PartidoTorneoFormProps {
  torneo: Torneo;
  partidos: PartidoTorneo[];
  onPartidoCreated: () => void;
}

export default function PartidoTorneoForm({ torneo, partidos, onPartidoCreated }: PartidoTorneoFormProps) {
  const defaultLocal = '';
  const defaultVisitante = '';
  const [selectedMatchIdx, setSelectedMatchIdx] = useState<number | ''>('');
  const [golesLocal, setGolesLocal] = useState<number>(0);
  const [golesVisitante, setGolesVisitante] = useState<number>(0);
  const [penalesLocal, setPenalesLocal] = useState<number>(0);
  const [penalesVisitante, setPenalesVisitante] = useState<number>(0);
  
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computar Partidos Válidos
  const matchesDisponibles = useMemo(() => {
    if (torneo.tipoFormato === 'eliminacion_directa') {
      const { pendingMatches } = computarRondasEliminacion(torneo.equipos, partidos);
      return pendingMatches.map(m => ({ 
        local: m.local, 
        visitante: m.visitante, 
        label: `Pendiente Eliminatoria: ${m.local.nombre} vs ${m.visitante.nombre}` 
      }));
    } else {
      const pend = getPartidosFaltantesLiga(torneo.equipos, partidos);
      return pend.map(m => ({
        local: m.local,
        visitante: m.visitante,
        label: `Liguilla ${m.vuelta ? '(Vuelta)' : '(Ida)'}: ${m.local.nombre} vs ${m.visitante.nombre}`
      }));
    }
  }, [torneo, partidos]);

  const esEmpate = golesLocal === golesVisitante && isOpen && selectedMatchIdx !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMatchIdx === '') {
      setError('Debes seleccionar un encuentro válido del torneo.');
      return;
    }

    const { local, visitante } = matchesDisponibles[selectedMatchIdx as number];

    // Validar Eliminacion Directa no puede empatar sin penales funcionales
    if (torneo.tipoFormato === 'eliminacion_directa' && golesLocal === golesVisitante) {
      if (penalesLocal === penalesVisitante) {
        setError('En eliminación directa debe haber un ganador de los penaltis.');
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    try {
      await createPartidoTorneo({
        torneo: torneo._id,
        equipoLocal: local._id,
        equipoVisitante: visitante._id,
        fechaHora: new Date().toISOString(),
        golesLocal: golesLocal || 0,
        golesVisitante: golesVisitante || 0,
        penalesLocal: (esEmpate && torneo.tipoFormato === 'eliminacion_directa') ? penalesLocal : undefined,
        penalesVisitante: (esEmpate && torneo.tipoFormato === 'eliminacion_directa') ? penalesVisitante : undefined,
        estado: 'finalizado', // Todo form guardará como finalizado
      });
      onPartidoCreated();
      setIsOpen(false);
      setSelectedMatchIdx('');
      setGolesLocal(0);
      setGolesVisitante(0);
      setPenalesLocal(0);
      setPenalesVisitante(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el resultado');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8 mt-4">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto bg-neon text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-neon/20 hover:bg-neon/90 transition-all flex items-center justify-center gap-2"
        >
          <span>⚽</span> Registrar Oficialmente un Marcador
        </motion.button>
      ) : (
        <motion.div
           initial={{ opacity: 0, height: 0, y: -20 }}
           animate={{ opacity: 1, height: 'auto', y: 0 }}
           exit={{ opacity: 0, height: 0 }}
           className="bg-card/50 backdrop-blur-xl border border-neon/30 p-6 rounded-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-neon/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="bebas-neue-regular text-2xl text-neon tracking-wide">Dictar Resultado Oficial</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground/50 hover:text-white transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm animate-pulse">
                {error}
              </div>
            )}

            {matchesDisponibles.length === 0 ? (
               <div className="bg-foreground/5 p-4 rounded-xl text-center text-foreground/50 border border-foreground/10 font-bold">
                 ¡El torneo no tiene más partidos pendientes por jugar! Ya todo está definido en los cuadros/tablas.
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="w-full px-4 py-3 bg-background border border-neon/30 rounded-xl relative z-20">
                   <label className="block text-xs uppercase tracking-widest text-neon/70 font-bold mb-2">Selecciona un Encuentro Autorizado</label>
                   <select
                     value={selectedMatchIdx}
                     onChange={(e) => setSelectedMatchIdx(e.target.value === '' ? '' : Number(e.target.value))}
                     required
                     className="w-full bg-background outline-none text-foreground font-bold focus:ring-0 cursor-pointer"
                   >
                     <option value="" disabled>-- Elige el partido --</option>
                     {matchesDisponibles.map((m, i) => (
                       <option key={i} value={i}>{m.label}</option>
                     ))}
                   </select>
                </div>

                {selectedMatchIdx !== '' && (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Equipo Local */}
                    <div className="flex-1 w-full space-y-3 p-4 bg-background/50 rounded-xl border border-white/5 flex flex-col items-center">
                      <img src={matchesDisponibles[selectedMatchIdx as number].local.escudo} className="w-12 h-12 rounded-full shadow-md bg-white object-contain" />
                      <label className="block text-sm font-bold text-foreground/80 text-center">{matchesDisponibles[selectedMatchIdx as number].local.nombre}</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Goles"
                        value={golesLocal}
                        onChange={(e) => setGolesLocal(Number(e.target.value))}
                        className="w-24 text-center text-4xl font-bold bg-transparent border-b-2 border-foreground/20 focus:border-neon outline-none py-2"
                      />
                    </div>

                    <div className="text-2xl font-bold text-foreground/20">VS</div>

                    {/* Equipo Visitante */}
                    <div className="flex-1 w-full space-y-3 p-4 bg-background/50 rounded-xl border border-white/5 flex flex-col items-center">
                       <img src={matchesDisponibles[selectedMatchIdx as number].visitante.escudo} className="w-12 h-12 rounded-full shadow-md bg-white object-contain" />
                      <label className="block text-sm font-bold text-foreground/80 text-center">{matchesDisponibles[selectedMatchIdx as number].visitante.nombre}</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Goles"
                        value={golesVisitante}
                        onChange={(e) => setGolesVisitante(Number(e.target.value))}
                        className="w-24 text-center text-4xl font-bold bg-transparent border-b-2 border-foreground/20 focus:border-neon outline-none py-2"
                      />
                    </div>
                  </div>
                )}

                {/* PENALES - SE MUESTRA SOLO SI ESTÁN EMPATADOS Y ES ELIMINACIÓN DIRECTA */}
                {esEmpate && torneo.tipoFormato === 'eliminacion_directa' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-slate-950/80 border border-purple-500/50 rounded-xl shadow-lg mt-6 flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                     <div className="w-full text-center md:text-left text-sm font-bold text-purple-300">
                        ¡Ronda de Penaltis requerida por el formato de torneo!
                     </div>
                     <div className="flex items-center justify-center gap-4 w-full md:w-auto">
                        <div className="flex flex-col items-center gap-1 w-16">
                           <span className="text-xs text-purple-400">Pen (L)</span>
                           <input type="number" min="0" value={penalesLocal} onChange={(e) => setPenalesLocal(Number(e.target.value))} className="w-full text-center bg-background border border-purple-500/50 rounded-lg text-lg text-purple-200 outline-none focus:ring-1 focus:ring-purple-400" />
                        </div>
                        <div className="flex flex-col items-center gap-1 w-16">
                           <span className="text-xs text-purple-400">Pen (V)</span>
                           <input type="number" min="0" value={penalesVisitante} onChange={(e) => setPenalesVisitante(Number(e.target.value))} className="w-full text-center bg-background border border-purple-500/50 rounded-lg text-lg text-purple-200 outline-none focus:ring-1 focus:ring-purple-400" />
                        </div>
                     </div>
                  </motion.div>
                )}

                {/* Botonera inferior */}
                <div className="flex items-center justify-end pt-4 border-t border-foreground/10">
                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.05 }}
                    whileTap={{ scale: submitting ? 1 : 0.95 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-neon text-black font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-neon/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Guardando...' : 'Fijar Marcador y Avanzar Gráficas'}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
