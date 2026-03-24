'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEquipo } from '@/lib/api';
import { Liga } from '@/types/equipo.types';
import Link from 'next/link';

export default function CrearEquipoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await createEquipo({
        nombre: formData.get('nombre') as string,
        escudo: formData.get('escudo') as string,
        fechaCreacion: new Date(formData.get('fechaCreacion') as string).toISOString(),
        liga: formData.get('liga') as Liga,
      });

      router.push('/admin/equipos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el equipo');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/equipos" className="text-blue-600 hover:text-blue-800">
          ← Volver
        </Link>
        <h1 className="text-4xl font-bold mt-4">Crear Nuevo Equipo</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Real Madrid"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escudo (URL de imagen)
          </label>
          <input
            type="url"
            name="escudo"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com/escudo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Creación
          </label>
          <input
            type="date"
            name="fechaCreacion"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liga
          </label>
          <select
            name="liga"
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="colombiana">colombiana</option>
            <option value="española">española</option>
            <option value="inglesa">inglesa</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-foreground py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : 'Crear Equipo'}
          </button>
          <Link
            href="/admin/equipos"
            className="flex-1 text-center border border-foreground/20 py-2 px-4 rounded-lg hover:bg-foreground/5"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
