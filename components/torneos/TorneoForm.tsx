'use client';

import { useState, useEffect } from 'react';
import { Torneo, TipoTorneo } from '@/types/torneo.types';
import { Equipo } from '@/types/equipo.types';
import { createTorneo, fetchEquipos, createEquipo } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

interface TorneoFormProps {
  onCreated: (torneo: Torneo) => void;
}

const INITIAL_TIPO: TipoTorneo = 'eliminacion_directa';

export default function TorneoForm({ onCreated }: TorneoFormProps) {
  const { data: session } = useSession();
  
  // Estados del Torneo
  const [nombre, setNombre] = useState('');
  const [tipoFormato, setTipoFormato] = useState<TipoTorneo>(INITIAL_TIPO);
  const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([]);
  const [selectedEquipos, setSelectedEquipos] = useState<string[]>([]);
  
  // Estados UI
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados Formulario Creación Rápida Equipo
  const [showCreateEquipo, setShowCreateEquipo] = useState(false);
  const [newEqNombre, setNewEqNombre] = useState('');
  const [newEqEscudo, setNewEqEscudo] = useState('');
  const [creatingEquipo, setCreatingEquipo] = useState(false);

  useEffect(() => {
    // Only load teams once session status is resolved
    if (session?.user?.id) {
       cargarEquipos();
    } else if (session === null) {
       // if not logged in, it will load general teams
       cargarEquipos();
    }
  }, [session]);

  const cargarEquipos = () => {
    setLoadingEquipos(true);
    fetchEquipos(undefined, session?.user?.id)
      .then((data) => setEquiposDisponibles(data))
      .catch(() => setError('Error al cargar la lista de equipos globales.'))
      .finally(() => setLoadingEquipos(false));
  };

  const toggleEquipo = (id: string) => {
    setSelectedEquipos((prev) => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleCrearEquipoRapido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqNombre || !newEqEscudo) return;
    setCreatingEquipo(true);
    setError(null);
    try {
      const currentUserId = session?.user?.id;
      const eq = await createEquipo({
        nombre: newEqNombre,
        escudo: newEqEscudo,
        fechaCreacion: new Date().toISOString(),
        liga: 'barrio', // Siempre por defecto barrio en esta vista rápida
        userId: currentUserId
      });
      // Añadir al catálogo local y auto-seleccionar
      setEquiposDisponibles(prev => [...prev, eq]);
      setSelectedEquipos(prev => [...prev, eq._id!]);
      
      setNewEqNombre('');
      setNewEqEscudo('');
      setShowCreateEquipo(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el equipo de barrio');
    } finally {
      setCreatingEquipo(false);
    }
  };

  const resetForm = () => {
    setNombre('');
    setTipoFormato(INITIAL_TIPO);
    setSelectedEquipos([]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEquipos.length < 2) {
      setError('Debes seleccionar al menos 2 equipos para iniciar el torneo.');
      return;
    }

    const currentUserId = session?.user?.id;
    if (!currentUserId) {
      setError('Error de sesión: No se encuentra un usuario activo. Por favor vuelve a iniciar sesión.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const torneo = await createTorneo({ 
        nombre, 
        tipoFormato, 
        userId: currentUserId,
        equipos: selectedEquipos 
      });
      onCreated(torneo);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el torneo en el backend');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 bg-card/60 backdrop-blur-xl p-6 rounded-2xl border border-foreground/5 shadow-2xl relative"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl animate-pulse">
          <p>{error}</p>
        </div>
      )}

      {/* SUB-FORMULARIO: Creador Rápido de Equipos Amateurs */}
      <AnimatePresence>
        {showCreateEquipo && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCrearEquipoRapido}
            className="bg-neon/10 border border-neon/30 p-4 rounded-xl space-y-4 mb-6 overflow-hidden"
          >
            <h3 className="bebas-neue-regular tracking-wide text-2xl text-neon">Crear Equipo Inventado</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Nombre (Ej: Los Galácticos)"
                value={newEqNombre}
                onChange={(e) => setNewEqNombre(e.target.value)}
                required
                className="flex-1 bg-background/80 border border-neon/50 rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-neon outline-none"
              />
              <input
                type="url"
                placeholder="URL del escudo (logo.png)"
                value={newEqEscudo}
                onChange={(e) => setNewEqEscudo(e.target.value)}
                required
                className="flex-1 bg-background/80 border border-neon/50 rounded-lg px-3 py-2 text-foreground focus:ring-1 focus:ring-neon outline-none"
              />
              <button 
                type="submit"
                disabled={creatingEquipo}
                className="bg-neon text-black font-bold px-6 py-2 rounded-lg hover:bg-neon/80 disabled:opacity-50 transition-colors"
              >
                {creatingEquipo ? 'Guardando...' : 'Crear'}
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => setShowCreateEquipo(false)}
              className="text-xs text-foreground/50 hover:text-foreground underline underline-offset-2"
            >
              Cancelar
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FORMULARIO PRINCIPAL DE TORNEO */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2 text-foreground/80" htmlFor="torneo-nombre">
            Nombre del torneo
          </label>
          <input
            id="torneo-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Copa de Verano 2026"
            className="w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:ring-2 focus:ring-neon focus:border-neon outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-foreground/80" htmlFor="torneo-tipo">
            Formato de Torneo
          </label>
          <select
            id="torneo-tipo"
            value={tipoFormato}
            onChange={(e) => setTipoFormato(e.target.value as TipoTorneo)}
            className="w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-neon focus:border-neon outline-none transition-all"
          >
            <option value="eliminacion_directa">Fase Eliminatoria (Play-offs)</option>
            <option value="liguilla">Liguilla (Liga / Puntos)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-foreground/80">
            <span>Seleccionados: {selectedEquipos.length}</span>
            <button 
              type="button"
              onClick={() => setShowCreateEquipo(!showCreateEquipo)}
              className="text-xs bg-neon/20 hover:bg-neon/30 text-neon border border-neon/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Crear Equipo Rápido
            </button>
          </label>
          
          {loadingEquipos ? (
            <div className="py-4"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {equiposDisponibles.map((equipo) => {
                const isSelected = selectedEquipos.includes(equipo._id!);
                return (
                  <div 
                    key={equipo._id}
                    onClick={() => toggleEquipo(equipo._id!)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${isSelected ? 'border-neon bg-neon/10 scale-[1.02] shadow-neon/10 shadow-lg z-10 relative' : 'border-foreground/5 hover:border-foreground/20 bg-background/30 hover:bg-background/60'}`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${isSelected ? 'bg-neon border-neon' : 'border-foreground/30'}`}>
                      {isSelected && <span className="text-black text-xs font-bold">✓</span>}
                    </div>
                    <img src={equipo.escudo} alt={equipo.nombre} className="w-8 h-8 object-cover rounded-full shadow-sm bg-white" />
                    <span className="text-sm font-bold text-foreground truncate">{equipo.nombre}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          type="submit"
          disabled={submitting || selectedEquipos.length < 2}
          className="w-full py-4 px-6 rounded-xl font-bold text-black bg-neon hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-neon/20 mt-6"
        >
          {submitting ? 'Alistando Cancha...' : '🚀 ARRANCAR TORNEO'}
        </motion.button>
      </form>
    </motion.div>
  );
}
