'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPartido } from '@/lib/api';
import Link from 'next/link';

export default function CrearPartidoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      await createPartido({
        equipoLocal: formData.get('equipoLocal') as string,
        equipoVisitante: formData.get('equipoVisitante') as string,
        competicion: formData.get('competicion') as string,
        fechaPartido: new Date(formData.get('fechaPartido') as string).toISOString(),
        estadio: formData.get('estadio') as string,
      });
      
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el partido');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Volver
        </Link>
        <h1 className="text-4xl font-bold mt-4">Crear Nuevo Partido</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipo Local
          </label>
          <input
            type="text"
            name="equipoLocal"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Real Madrid"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipo Visitante
          </label>
          <input
            type="text"
            name="equipoVisitante"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Barcelona"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Competición
          </label>
          <input
            type="text"
            name="competicion"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Champions League"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y Hora del Partido
          </label>
          <input
            type="datetime-local"
            name="fechaPartido"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estadio
          </label>
          <input
            type="text"
            name="estadio"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Santiago Bernabéu"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-foreground py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : 'Crear Partido'}
          </button>
          <Link
            href="/admin"
            className="flex-1 text-center border border-foreground/20 py-2 px-4 rounded-lg hover:bg-foreground/5"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
