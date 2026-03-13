'use client';

import CountdownClock from './CountdownClock';
import { Partido } from '@/types/partido.types';

interface CountdownCardProps {
  partido: Partido;
}

export default function CountdownCard({ partido }: CountdownCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-lg bg-white">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-center mb-2">
          {partido.equipoLocal} vs {partido.equipoVisitante}
        </h2>
        <p className="text-center text-gray-600">{partido.competicion}</p>
        <p className="text-center text-sm text-gray-500">{partido.estadio}</p>
      </div>
      <CountdownClock targetDate={new Date(partido.fechaPartido)} />
      <p className="text-center text-sm text-gray-500 mt-4">
        {new Date(partido.fechaPartido).toLocaleString('es-ES', {
          dateStyle: 'full',
          timeStyle: 'short',
        })}
      </p>
    </div>
  );
}
