'use client';

import CountdownClock from './CountdownClock';
import { Partido } from '@/types/partido.types';

interface CountdownCardProps {
  partido: Partido;
}

export default function CountdownCard({ partido }: CountdownCardProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white text-center mb-1">
          {partido.equipoLocal} <span className="text-emerald-400">vs</span> {partido.equipoVisitante}
        </h2>
        <p className="text-center text-emerald-300/80 text-sm font-medium">{partido.competicion}</p>
        <p className="text-center text-slate-400 text-xs mt-1">{partido.estadio}</p>
      </div>
      <CountdownClock targetDate={new Date(partido.fechaPartido)} />
      <p className="text-center text-xs text-slate-500 mt-4">
        {new Date(partido.fechaPartido).toLocaleString('es-ES', {
          dateStyle: 'full',
          timeStyle: 'short',
        })}
      </p>
    </div>
  );
}
