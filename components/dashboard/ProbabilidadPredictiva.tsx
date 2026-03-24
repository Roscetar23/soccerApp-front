"use client";

import { Equipo, EstadisticasEquipo } from "@/types/equipo.types";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface ProbabilidadPredictivaProps {
  equipo: Equipo;
  estadisticas: EstadisticasEquipo;
}

export default function ProbabilidadPredictiva({ equipo, estadisticas }: ProbabilidadPredictivaProps) {
  // Simulación de Motor de IA Predictivo (Cálculos con metadatos reales)
  const probabilidad = useMemo(() => {
    let base = estadisticas.porcentajeVictorias;
    
    // Bonificadores ofensivos
    if (estadisticas.promedioTirosAlArco > 10) base += 8;
    else if (estadisticas.promedioTirosAlArco > 6) base += 4;
    else if (estadisticas.promedioTirosAlArco < 3) base -= 6;

    // Bonificadores defensivos / control
    if (estadisticas.promedioPases > 400) base += 5;
    else if (estadisticas.promedioPases < 200) base -= 3;

    // Penalizaciones disciplinarias
    if (estadisticas.promedioFaltas > 15) base -= 8;

    // Historial crítico (Si las últimas 2 fueron derrotas "P", bajar moraleja)
    const ultimos = estadisticas.ultimosPartidos;
    if (ultimos[0] === 'P' && ultimos[1] === 'P') base -= 10;
    if (ultimos[0] === 'G' && ultimos[1] === 'G') base += 10;

    // Límite entre 5% y 95% para realismo
    return Math.max(5, Math.min(95, Math.round(base)));
  }, [estadisticas]);

  // UI Themes por Nivel de Probabilidad
  const getTheme = (prob: number) => {
    if (prob >= 65) return { color: 'text-neon', border: 'border-neon/50', shadow: 'shadow-neon/20', bg: 'bg-neon/10', title: 'Claro Favorito 🚀' };
    if (prob >= 40) return { color: 'text-yellow-400', border: 'border-yellow-400/50', shadow: 'shadow-yellow-400/20', bg: 'bg-yellow-400/10', title: 'Partido Cerrado ⚔️' };
    return { color: 'text-red-500', border: 'border-red-500/50', shadow: 'shadow-red-500/20', bg: 'bg-red-500/10', title: 'Underdog Crítico ⚠️' };
  };

  const theme = getTheme(probabilidad);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className={`bg-card transition-colors rounded-2xl p-6 border border-foreground/5 shadow-xl flex flex-col items-center justify-center relative overflow-hidden h-full`}
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 rounded-full ${theme.bg}`}></div>
      
      <h3 className="bebas-neue-regular tracking-widest text-3xl text-foreground/90 drop-shadow-sm mb-2">
        Motor Predictivo IA
      </h3>
      <p className="text-sm text-foreground/60 text-center max-w-[250px] mb-10 pb-4 border-b border-foreground/5">
        Probabilidad de victoria proyectada para el próximo enfrentamiento.
      </p>

      {/* SVG Radial Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center z-10 mb-8 mt-4">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="6" className="text-foreground/5" />
          <motion.circle 
            cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" 
            strokeDasharray="439.8"
            initial={{ strokeDashoffset: 439.8 }}
            animate={{ strokeDashoffset: 439.8 - (439.8 * probabilidad) / 100 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            strokeLinecap="round"
            className={`${theme.color}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className={`text-5xl font-black ${theme.color} drop-shadow-md`}
          >
            {probabilidad}%
          </motion.span>
        </div>
      </div>

      <div className="mt-12 text-center relative z-10 flex flex-col items-center gap-5">
         <span className={`text-sm font-bold px-4 py-2 rounded-full border ${theme.border} ${theme.bg} ${theme.color}`}>
           {theme.title}
         </span>
         <p className="text-xs text-foreground/40 mt-4 leading-relaxed max-w-[250px]">
           Calculado analizando Tasa de Tiros, Faltas, Pases y Racha del equipo <strong>{equipo.nombre}</strong>.
         </p>
      </div>
    </motion.div>
  );
}
