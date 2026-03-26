'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { fetchMundialConfig } from '@/lib/api';

type TabId = 'intro' | 'sedes' | 'grupos' | 'equipos';

export default function MundialHubPage() {
  const [activeTab, setActiveTab] = useState<TabId>('intro');
  const [mundialData, setMundialData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMundialConfig()
      .then(data => {
        setMundialData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching Mundial Data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] transition-colors duration-300 px-4 py-8 relative overflow-hidden">
      {/* Círculos de luz trasera mundialista */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#2a0845]/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <nav className="w-full flex justify-between items-center mb-10">
          <Link href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 font-inter text-sm group">
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Volver al inicio
          </Link>
          <div className="font-bebas text-xl md:text-2xl tracking-widest text-[#d4af37]">ROAD TO 2026</div>
        </nav>

        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] mb-2 text-center drop-shadow-lg font-bebas tracking-wide">
          Copa del Mundo 2026
        </h1>
        <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto font-inter">
          El mayor espectáculo de la tierra. Explora las sedes oficiales, los grupos y los equipos clasificados en este hub interactivo.
        </p>

        {/* Structure similar to Partidos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-4">
           
           {/* Sidebar Izquierdo: Lista en columna */}
           <div className="lg:col-span-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-3 custom-scrollbar">
              {[
                { id: 'intro', label: '🏟️ Introducción Mundial' },
                { id: 'sedes', label: '📍 Sedes Oficiales' },
                { id: 'grupos', label: '🏆 Fase de Grupos' },
                { id: 'equipos', label: '🌍 Naciones Clasificadas' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`text-left border rounded-3xl p-5 transition-all duration-300 font-bebas tracking-wider text-xl transform active:scale-[0.98] ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-br from-[#d4af37]/10 to-transparent border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/50 text-white' 
                      : 'bg-[#0a0a0b] bg-opacity-40 border-white/5 text-white/50 hover:bg-white/5 hover:border-white/20 hover:text-white hover:scale-[1.01]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Panel Derecho: Sin caja restrictiva, fluye libremente estilo Partidos */}
           <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                
                {loading && (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                     className="h-full min-h-[400px] border border-white/5 bg-black/20 rounded-3xl flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm"
                   >
                      <div className="w-16 h-16 rounded-full border-t-2 border-[#d4af37] animate-spin mb-4" />
                      <p className="text-[#d4af37]/50 font-inter tracking-wide uppercase text-sm">Cargando Datos de MongoDB...</p>
                   </motion.div>
                )}

                {!loading && mundialData && activeTab === 'intro' && (
                  <motion.div 
                    key="intro"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full flex flex-col items-center justify-center p-6 border border-white/5 rounded-3xl bg-black/20 backdrop-blur-sm min-h-[400px] text-center"
                  >
                    <h2 className="text-4xl md:text-5xl font-bebas text-[#d4af37] tracking-wider mb-6">El Mundial de Norteamérica</h2>
                    <p className="text-white/80 font-inter leading-relaxed text-lg mb-6 max-w-2xl">
                      La Copa Mundial de la FIFA 2026 será la 23.ª edición del campeonato. 
                      Por primera vez, será organizado conjuntamente por 3 países enormes.
                    </p>
                    <p className="text-[#f3e5ab] text-xl md:text-xl font-bold uppercase tracking-widest bg-[#d4af37]/10 px-6 py-2 rounded-full mb-8">Canadá • México • Estados Unidos</p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                        <div className="text-center p-4 md:p-6 bg-black/40 rounded-2xl border border-[#d4af37]/10 shadow-lg">
                          <p className="text-[#d4af37] font-bebas text-4xl drop-shadow-md">48</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mt-1">Naciones</p>
                        </div>
                        <div className="text-center p-4 md:p-6 bg-black/40 rounded-2xl border border-[#d4af37]/10 shadow-lg">
                          <p className="text-[#d4af37] font-bebas text-4xl drop-shadow-md">104</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mt-1">Partidos</p>
                        </div>
                        <div className="text-center p-4 md:p-6 bg-black/40 rounded-2xl border border-[#d4af37]/10 shadow-lg">
                          <p className="text-[#d4af37] font-bebas text-4xl drop-shadow-md">16</p>
                          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mt-1">Ciudades</p>
                        </div>
                    </div>
                  </motion.div>
                )}

                {!loading && mundialData && activeTab === 'sedes' && (
                  <motion.div 
                    key="sedes"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                      {mundialData.sedes.map((sede: any, idx: number) => (
                        <div key={idx} className="bg-black/30 p-6 md:p-8 min-h-[140px] rounded-[2rem] border border-white/5 hover:border-[#d4af37]/40 transition-colors shadow-lg flex items-center gap-6">
                          <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-2xl border border-white/5 overflow-hidden flex-shrink-0 relative shadow-inner">
                            {sede.imagen && (sede.imagen.startsWith('http') || sede.imagen.startsWith('/')) ? (
                              <img src={sede.imagen} alt={sede.nombre} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">{sede.imagen || '🏟️'}</div>
                            )}
                          </div>
                          <div className="overflow-hidden flex-1">
                             <h3 className="text-2xl md:text-3xl font-bold font-bebas tracking-wide text-white truncate">{sede.nombre}</h3>
                             <p className="text-sm md:text-base font-medium text-[#d4af37] uppercase tracking-wider my-2 truncate">{sede.ciudad}, {sede.pais}</p>
                             <p className="text-sm text-white/50 font-mono tracking-tight bg-black/40 inline-block px-3 py-1 rounded-md">C: {sede.capacidad}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {!loading && mundialData && activeTab === 'grupos' && (
                  <motion.div 
                    key="grupos"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                      {mundialData.grupos.map((grupo: any, idx: number) => (
                        <div key={idx} className="bg-black/60 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                          <div className="bg-gradient-to-r from-[#d4af37]/20 to-transparent p-4 border-b border-[#d4af37]/20 flex justify-center">
                            <h3 className="font-bebas text-2xl text-[#f3e5ab] tracking-widest">{grupo.nombre}</h3>
                          </div>
                          <ul className="p-1">
                            {grupo.equipos.map((equipo: any, i: number) => (
                              <li key={i} className="py-3 px-4 text-sm font-inter border-b border-white/5 last:border-0 text-white/80 flex items-center">
                                <span className="w-6 h-6 flex items-center justify-center bg-[#d4af37]/20 text-[#d4af37] rounded-full mr-3 text-xs">{i+1}</span>
                                <span className={equipo.includes('Por Definir') ? 'text-white/30 italic font-mono text-xs' : ''}>{equipo}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {!loading && mundialData && activeTab === 'equipos' && (
                  <motion.div 
                    key="equipos"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-8">
                      {mundialData.clasificados.map((equipo: any, idx: number) => (
                        <div key={idx} className="bg-black/40 p-8 min-h-[220px] rounded-[2rem] border border-white/10 hover:border-[#d4af37]/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center text-center gap-5 shadow-2xl">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 drop-shadow-2xl rounded-full overflow-hidden border-2 border-white/10 relative">
                             {equipo.bandera && (equipo.bandera.startsWith('http') || equipo.bandera.startsWith('/')) ? (
                                <img src={equipo.bandera} alt={equipo.nombre} className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl md:text-7xl">{equipo.bandera || '🏳️'}</div>
                             )}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-xl md:text-2xl tracking-wide uppercase mb-2 line-clamp-2">{equipo.nombre}</h3>
                            <p className="text-xs md:text-sm font-bold text-[#d4af37] uppercase tracking-widest bg-[#d4af37]/10 px-4 py-1.5 rounded-full inline-block">{equipo.region}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
           
        </div>
      </div>
    </div>
  );
}
