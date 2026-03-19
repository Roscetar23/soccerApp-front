'use client';

import { useRouter } from 'next/navigation';
import { Torneo } from '@/types/torneo.types';

interface TorneosListProps {
  torneos: Torneo[];
  onDelete: (id: string) => Promise<void>;
  deletingId: string | null;
}

export default function TorneosList({ torneos, onDelete, deletingId }: TorneosListProps) {
  const router = useRouter();

  return (
    <ul className="space-y-3">
      {torneos.map((torneo) => (
        <li
          key={torneo._id}
          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900">{torneo.nombre}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {torneo.tipo === 'eliminacion_directa' ? 'Eliminación directa' : 'Liga'}
            </span>
            <span className="text-sm text-gray-500">{torneo.equipos.length} equipos</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/navegacion/torneos/${torneo._id}`)}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md transition-colors"
            >
              Ver torneo
            </button>
            <button
              onClick={() => onDelete(torneo._id)}
              disabled={deletingId === torneo._id}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === torneo._id ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
