'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { EstadisticasEquipo } from '@/types/equipo.types';

interface EstadisticasGridProps {
  estadisticas: EstadisticasEquipo;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 flex flex-col items-center justify-center gap-1">
      <span className="text-4xl font-bold text-emerald-400">{value}</span>
      <span className="text-sm text-slate-400 text-center">{label}</span>
    </div>
  );
}

export default function EstadisticasGrid({ estadisticas }: EstadisticasGridProps) {
  const { porcentajeVictorias, promedioPases, promedioTirosAlArco, promedioFaltas } = estadisticas;

  const radialData = [
    { name: 'Victorias', value: porcentajeVictorias, fill: '#10b981' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Porcentaje de victorias — RadialBarChart */}
      <div className="bg-slate-800 rounded-xl p-5 flex flex-col items-center justify-center gap-1">
        <div className="w-full h-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              startAngle={90}
              endAngle={90 - (porcentajeVictorias / 100) * 360}
              data={radialData}
            >
              <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#1e293b' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <span className="text-2xl font-bold text-emerald-400">{porcentajeVictorias}%</span>
        <span className="text-sm text-slate-400 text-center">% Victorias</span>
      </div>

      <StatCard label="Promedio Pases" value={promedioPases} />
      <StatCard label="Tiros al Arco" value={promedioTirosAlArco} />
      <StatCard label="Promedio Faltas" value={promedioFaltas} />
    </div>
  );
}
