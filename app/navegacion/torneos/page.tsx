'use client';

import { useEffect, useState } from 'react';
import { fetchTorneos, deleteTorneo } from '@/lib/api';
import { Torneo } from '@/types/torneo.types';
import TorneosList from '@/components/torneos/TorneosList';
import TorneoForm from '@/components/torneos/TorneoForm';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function TorneosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTorneos()
      .then((data) => setTorneos(data))
      .catch(() => setError('Error al cargar los torneos'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTorneo(id);
      setTorneos((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError('Error al eliminar el torneo');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreated = (torneo: Torneo) => {
    setTorneos((prev) => [...prev, torneo]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-emerald-400">Torneos</h1>

        <h2 className="text-emerald-400 font-semibold text-lg">Crear torneo</h2>
        <TorneoForm onCreated={handleCreated} />

        {loading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && torneos.length === 0 && (
          <p className="text-slate-400 text-center py-8">No hay torneos creados</p>
        )}

        {!loading && torneos.length > 0 && (
          <>
            <h2 className="text-emerald-400 font-semibold text-lg">Mis torneos</h2>
            <TorneosList
            torneos={torneos}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
          </>
        )}
      </div>
    </div>
  );
}
