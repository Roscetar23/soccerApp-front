'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Partido } from '@/types/partido.types';
import CountdownCard from '@/components/contador/CountdownCard';

interface PartidosDashboardClientProps {
  initialPartidos: Partido[];
}

export default function PartidosDashboardClient({ initialPartidos }: PartidosDashboardClientProps) {
  // Estados de Filtros (Slice 01)
  const [selectedLiga, setSelectedLiga] = useState<string>('Todas');
  const [selectedEquipo, setSelectedEquipo] = useState<string>('Todos');
  const [selectedEstadio, setSelectedEstadio] = useState<string>('Todos');

  // Lógica Inteligente para extraer listas únicas basadas en el arreglo que provee la API
  const ligasUnicas = useMemo(() => {
    const set = new Set(initialPartidos.map(p => p.competicion));
    return ['Todas', ...Array.from(set).filter(Boolean)];
  }, [initialPartidos]);

  const equiposUnicos = useMemo(() => {
    // Los equipos disponibles cambian según si hay liga seleccionada
    const partidosFiltrados = selectedLiga !== 'Todas' 
      ? initialPartidos.filter(p => p.competicion === selectedLiga)
      : initialPartidos;
      
    const set = new Set<string>();
    partidosFiltrados.forEach(p => {
      if (p.equipoLocal) set.add(p.equipoLocal);
      if (p.equipoVisitante) set.add(p.equipoVisitante);
    });
    return ['Todos', ...Array.from(set).sort()];
  }, [initialPartidos, selectedLiga]);

  const estadiosUnicos = useMemo(() => {
    // Limitar estadios según liga
    const partidosFiltrados = selectedLiga !== 'Todas' 
      ? initialPartidos.filter(p => p.competicion === selectedLiga)
      : initialPartidos;
      
    const set = new Set(partidosFiltrados.map(p => p.estadio));
    return ['Todos', ...Array.from(set).filter(e => e && e !== 'TBD').sort()];
  }, [initialPartidos, selectedLiga]);

  // Lógica central: Aplicar el cruce de todos los filtros a la vez
  const partidosFiltrados = useMemo(() => {
    return initialPartidos.filter(p => {
      const matchLiga = selectedLiga === 'Todas' || p.competicion === selectedLiga;
      const matchEquipo = selectedEquipo === 'Todos' || p.equipoLocal === selectedEquipo || p.equipoVisitante === selectedEquipo;
      const matchEstadio = selectedEstadio === 'Todos' || p.estadio === selectedEstadio;
      return matchLiga && matchEquipo && matchEstadio;
    });
  }, [initialPartidos, selectedLiga, selectedEquipo, selectedEstadio]);

  // Manejador: Cuando cambia la liga, limpiamos los filtros "hijos" para evitar cruces imposibles.
  const handleLigaChange = (liga: string) => {
    setSelectedLiga(liga);
    setSelectedEquipo('Todos'); 
    setSelectedEstadio('Todos');
  };

  // UI Split State (Slice 02)
  const [selectedPartidoId, setSelectedPartidoId] = useState<string | null>(null);

  // Auto-seleccionar el primer partido cuando cambian los filtros
  useEffect(() => {
    if (partidosFiltrados.length > 0) {
      if (!partidosFiltrados.find(p => p._id === selectedPartidoId)) {
        setSelectedPartidoId(partidosFiltrados[0]._id);
      }
    } else {
      setSelectedPartidoId(null);
    }
  }, [partidosFiltrados, selectedPartidoId]);

  const selectedPartido = partidosFiltrados.find(p => p._id === selectedPartidoId) || partidosFiltrados[0];

  return (
    <div>
      {/* Zona de Filtros Lógicos (Slice 01 UI) */}
      <div className="bg-card border border-white/5 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-end shadow-xl">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-foreground/50 uppercase tracking-widest font-semibold ml-1">Filtro por Liga</label>
          <select 
            value={selectedLiga} 
            onChange={e => handleLigaChange(e.target.value)}
            className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-neon transition-colors text-sm font-inter"
          >
            {ligasUnicas.map(l => <option key={l} value={l} className="bg-background">{l === 'Todas' ? 'Ver Todas' : l.toUpperCase()}</option>)}
          </select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-foreground/50 uppercase tracking-widest font-semibold ml-1">Filtro por Equipo</label>
          <select 
            value={selectedEquipo} 
            onChange={e => setSelectedEquipo(e.target.value)}
            className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-neon transition-colors text-sm font-inter"
          >
            {equiposUnicos.map(e => <option key={e} value={e} className="bg-background">{e}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-foreground/50 uppercase tracking-widest font-semibold ml-1">Filtro por Estadio</label>
          <select 
            value={selectedEstadio} 
            onChange={e => setSelectedEstadio(e.target.value)}
            className="bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-neon transition-colors text-sm font-inter"
          >
            {estadiosUnicos.map(e => <option key={e} value={e} className="bg-background">{e}</option>)}
          </select>
        </div>
        
        <div className="ml-auto text-sm text-foreground/40 font-inter font-medium tracking-wide">
          {partidosFiltrados.length} partidos encontrados
        </div>
      </div>

      {/* Grid Split UI (Slice 02) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
        
        {/* Lado Izquierdo: Lista Compacta de Partidos (Con animaciones en cascada) */}
        <motion.div 
          key={selectedLiga + selectedEquipo + selectedEstadio} // Refresca la animación cuando mutan los filtros
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          initial="hidden"
          animate="show"
          className="lg:col-span-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar"
        >
          {partidosFiltrados.map((partido) => (
            <motion.button
              variants={{
                hidden: { opacity: 0, x: -20 },
                show: { opacity: 1, x: 0 }
              }}
              key={partido._id}
              onClick={() => setSelectedPartidoId(partido._id)}
              className={`text-left border rounded-3xl p-5 transition-all duration-300 transform active:scale-[0.98] ${
                selectedPartidoId === partido._id 
                  ? 'bg-gradient-to-br from-neon/10 to-transparent border-neon shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50' 
                  : 'bg-card bg-opacity-40 border-white/5 hover:bg-white/5 hover:border-white/20 hover:scale-[1.01]'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] md:text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">
                  {partido.competicion}
                </span>
                <span className="text-xs font-medium text-foreground/50 border border-white/5 px-2 py-1 rounded-md">
                  {new Date(partido.fechaPartido).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className={`font-bold text-base md:text-lg truncate w-[42%] text-right transition-colors ${selectedPartidoId === partido._id ? 'text-white' : 'text-foreground/80'}`}>
                  {partido.equipoLocal}
                </span>
                <span className="text-xs text-foreground/30 font-bebas tracking-widest px-2">VS</span>
                <span className={`font-bold text-base md:text-lg truncate w-[42%] transition-colors ${selectedPartidoId === partido._id ? 'text-white' : 'text-foreground/80'}`}>
                  {partido.equipoVisitante}
                </span>
              </div>
            </motion.button>
          ))}
          
          {partidosFiltrados.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-black/20 rounded-3xl p-10 border border-white/5 flex flex-col items-center justify-center min-h-[200px]"
            >
              <span className="text-4xl mb-4 opacity-50">🔍</span>
              <p className="text-foreground/50 font-inter text-sm">No hay partidos próximos con esta combinación de filtros.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Lado Derecho: Hero Widget del Cronómetro con AnimatePresence */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedPartido ? (
              <motion.div 
                key={selectedPartido._id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                className="sticky top-28 w-full max-w-2xl mx-auto"
              >
                <div className="transform scale-100 lg:scale-[1.02] transition-transform duration-500">
                  <CountdownCard partido={selectedPartido} />
                </div>
              </motion.div>
            ) : (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="h-full min-h-[400px] border border-white/5 bg-card/30 rounded-3xl flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm"
               >
                  <div className="w-16 h-16 rounded-full border-t-2 border-neon animate-spin mb-4" />
                  <p className="text-foreground/40 font-inter tracking-wide uppercase text-sm">Esperando Partidos</p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
