'use client';

import { useState, useEffect } from 'react';
import { fetchEquipos, deleteEquipo } from '@/lib/api';
import { Equipo, Liga } from '@/types/equipo.types';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';

export default function AdminEquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [ligaFiltro, setLigaFiltro] = useState<Liga | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEquipos = async () => {
    try {
      setLoading(true);
      const data = await fetchEquipos(ligaFiltro);
      setEquipos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ligaFiltro]);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return;

    try {
      await deleteEquipo(id);
      await loadEquipos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el equipo');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Administrar Equipos</h1>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Volver a Admin
          </Link>
          <Link
            href="/admin/equipos/crear"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Crear Equipo
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="liga-filtro" className="text-sm font-medium text-gray-700 mr-2">
          Filtrar por liga:
        </label>
        <select
          id="liga-filtro"
          value={ligaFiltro ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            setLigaFiltro(val === '' ? undefined : (val as Liga));
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas</option>
          <option value="colombiana">colombiana</option>
          <option value="española">española</option>
          <option value="inglesa">inglesa</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Escudo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Liga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipos.map((equipo) => (
                <tr key={equipo._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{equipo.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={equipo.escudo}
                      alt={`Escudo de ${equipo.nombre}`}
                      className="h-10 w-10 object-contain"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{equipo.liga}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(equipo.fechaCreacion).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-4">
                      <Link
                        href={`/admin/equipos/${equipo._id}/estadisticas`}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        Estadísticas
                      </Link>
                      <button
                        onClick={() => handleDelete(equipo._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {equipos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hay equipos registrados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
