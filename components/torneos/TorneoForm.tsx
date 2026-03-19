'use client';

import { useState } from 'react';
import { Torneo, TipoTorneo, EquipoTorneo } from '@/types/torneo.types';
import { createTorneo } from '@/lib/api';

interface TorneoFormProps {
  onCreated: (torneo: Torneo) => void;
}

const INITIAL_TIPO: TipoTorneo = 'eliminacion_directa';

export default function TorneoForm({ onCreated }: TorneoFormProps) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoTorneo>(INITIAL_TIPO);
  const [equipos, setEquipos] = useState<EquipoTorneo[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEquipo = () => {
    setEquipos((prev) => [...prev, { nombre: '', escudo: '' }]);
  };

  const removeEquipo = (index: number) => {
    setEquipos((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEquipo = (index: number, field: keyof EquipoTorneo, value: string) => {
    setEquipos((prev) =>
      prev.map((eq, i) => (i === index ? { ...eq, [field]: value } : eq))
    );
  };

  const resetForm = () => {
    setNombre('');
    setTipo(INITIAL_TIPO);
    setEquipos([]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const torneo = await createTorneo({ nombre, tipo, equipos });
      onCreated(torneo);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el torneo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="torneo-nombre">
          Nombre del torneo
        </label>
        <input
          id="torneo-nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="torneo-tipo">
          Tipo
        </label>
        <select
          id="torneo-tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoTorneo)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="eliminacion_directa">Eliminación directa</option>
          <option value="liga">Liga</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Equipos</span>
          <button
            type="button"
            onClick={addEquipo}
            className="text-sm text-emerald-600 hover:text-emerald-500"
          >
            + Agregar equipo
          </button>
        </div>

        {equipos.map((equipo, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Nombre del equipo"
              value={equipo.nombre}
              onChange={(e) => updateEquipo(index, 'nombre', e.target.value)}
              required
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <input
              type="url"
              placeholder="URL del escudo"
              value={equipo.escudo}
              onChange={(e) => updateEquipo(index, 'escudo', e.target.value)}
              required
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeEquipo(index)}
              className="text-red-500 hover:text-red-400 text-sm px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting || equipos.length === 0}
        className="w-full py-2 px-4 rounded font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Creando...' : 'Crear torneo'}
      </button>
    </form>
  );
}
