'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchTorneos, deleteTorneo } from '@/lib/api';
import { Torneo } from '@/types/torneo.types';
import TorneosList from '@/components/torneos/TorneosList';
import TorneoForm from '@/components/torneos/TorneoForm';
import Spinner from '@/components/ui/Spinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function TorneosPage() {
  const { data: session, status } = useSession();
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    const userId = session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }
    
    fetchTorneos(userId)
      .then((data) => setTorneos(data))
      .catch(() => setError('Error al cargar los torneos'))
      .finally(() => setLoading(false));
  }, [status, session]);

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
    <div className="min-h-screen bg-background transition-colors duration-300 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-neon">Torneos</h1>

        <h2 className="text-neon font-semibold text-lg">Crear torneo</h2>
        <TorneoForm onCreated={handleCreated} />

        {loading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && (!torneos || torneos.length === 0) && (
          <div className="bg-foreground/5 p-8 rounded-2xl flex flex-col items-center justify-center border border-foreground/10 text-center gap-4">
            <span className="text-4xl">🏆</span>
            <p className="text-foreground/60 text-lg font-bold">No tienes torneos creados</p>
            <p className="text-foreground/40 text-sm">¡Adelante, crea uno nuevo para empezar a administrar!</p>
            <button
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="mt-2 px-6 py-2 bg-neon/10 hover:bg-neon/20 border border-neon/30 text-neon font-bold rounded-lg transition-colors"
            >
               + Crear Primer Torneo
            </button>
          </div>
        )}

        {!loading && torneos && torneos.length > 0 && (
          <>
            <h2 className="text-neon font-semibold text-lg">Mis torneos</h2>
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
