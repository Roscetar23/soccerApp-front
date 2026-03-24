'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchEstadisticasEquipo, saveEstadisticasEquipo } from '@/lib/api';
import { ResultadoPartido } from '@/types/equipo.types';
import Spinner from '@/components/ui/Spinner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EstadisticasEquipoPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [loadingInicial, setLoadingInicial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [porcentajeVictorias, setPorcentajeVictorias] = useState<string>('');
  const [promedioPases, setPromedioPases] = useState<string>('');
  const [promedioTirosAlArco, setPromedioTirosAlArco] = useState<string>('');
  const [promedioFaltas, setPromedioFaltas] = useState<string>('');
  const [ultimosPartidos, setUltimosPartidos] = useState<ResultadoPartido[]>([]);

  useEffect(() => {
    fetchEstadisticasEquipo(id)
      .then((data) => {
        setPorcentajeVictorias(String(data.porcentajeVictorias));
        setPromedioPases(String(data.promedioPases));
        setPromedioTirosAlArco(String(data.promedioTirosAlArco));
        setPromedioFaltas(String(data.promedioFaltas));
        setUltimosPartidos(data.ultimosPartidos);
      })
      .catch(() => {
        // Error al cargar → formulario vacío, no bloquear
      })
      .finally(() => setLoadingInicial(false));
  }, [id]);

  const handleAddPartido = () => {
    if (ultimosPartidos.length < 5) {
      setUltimosPartidos([...ultimosPartidos, 'G']);
    }
  };

  const handleRemovePartido = (index: number) => {
    setUltimosPartidos(ultimosPartidos.filter((_, i) => i !== index));
  };

  const handlePartidoChange = (index: number, value: ResultadoPartido) => {
    const updated = [...ultimosPartidos];
    updated[index] = value;
    setUltimosPartidos(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    const pv = parseFloat(porcentajeVictorias);
    if (isNaN(pv) || pv < 0 || pv > 100) {
      setValidationError('El porcentaje de victorias debe estar entre 0 y 100.');
      return;
    }

    setSubmitting(true);
    try {
      await saveEstadisticasEquipo(id, {
        porcentajeVictorias: pv,
        promedioPases: parseInt(promedioPases, 10),
        promedioTirosAlArco: parseInt(promedioTirosAlArco, 10),
        promedioFaltas: parseInt(promedioFaltas, 10),
        ultimosPartidos,
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/equipos'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar las estadísticas');
      setSubmitting(false);
    }
  };

  if (loadingInicial) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/equipos" className="text-blue-600 hover:text-blue-800">
          ← Volver
        </Link>
        <h1 className="text-4xl font-bold mt-4">Estadísticas del Equipo</h1>
      </div>

      {validationError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          {validationError}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Estadísticas guardadas correctamente. Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Porcentaje de Victorias (0–100)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={porcentajeVictorias}
            onChange={(e) => setPorcentajeVictorias(e.target.value)}
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promedio de Pases
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={promedioPases}
            onChange={(e) => setPromedioPases(e.target.value)}
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promedio de Tiros al Arco
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={promedioTirosAlArco}
            onChange={(e) => setPromedioTirosAlArco(e.target.value)}
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promedio de Faltas
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={promedioFaltas}
            onChange={(e) => setPromedioFaltas(e.target.value)}
            required
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Últimos Partidos ({ultimosPartidos.length}/5)
            </label>
            <button
              type="button"
              onClick={handleAddPartido}
              disabled={ultimosPartidos.length >= 5}
              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Agregar
            </button>
          </div>
          <div className="space-y-2">
            {ultimosPartidos.map((resultado, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-6">#{index + 1}</span>
                <select
                  value={resultado}
                  onChange={(e) => handlePartidoChange(index, e.target.value as ResultadoPartido)}
                  className="flex-1 px-3 py-2 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="G">G — Ganado</option>
                  <option value="P">P — Perdido</option>
                  <option value="E">E — Empatado</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemovePartido(index)}
                  className="text-red-500 hover:text-red-700 text-sm px-2"
                >
                  Quitar
                </button>
              </div>
            ))}
            {ultimosPartidos.length === 0 && (
              <p className="text-sm text-foreground/60 italic">Sin partidos agregados.</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting || success}
            className="flex-1 bg-blue-600 text-foreground py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? 'Guardando...' : 'Guardar Estadísticas'}
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
