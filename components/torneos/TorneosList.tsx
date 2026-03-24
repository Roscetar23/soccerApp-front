'use client';

import { useRouter } from 'next/navigation';
import { Torneo } from '@/types/torneo.types';
import { motion, AnimatePresence } from 'framer-motion';

interface TorneosListProps {
  torneos: Torneo[];
  onDelete: (id: string) => Promise<void>;
  deletingId: string | null;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function TorneosList({ torneos, onDelete, deletingId }: TorneosListProps) {
  const router = useRouter();

  return (
    <motion.ul 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-4"
    >
      <AnimatePresence>
        {torneos.map((torneo) => (
          <motion.li
            key={torneo._id}
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className="flex flex-col sm:flex-row items-center justify-between bg-card/40 border border-foreground/10 rounded-2xl px-6 py-5 shadow-lg relative overflow-hidden group"
          >
            {/* Glow decorativo de background al hover */}
            <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/5 transition-colors pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full sm:w-auto">
              <span className="font-bold text-foreground text-xl tracking-wide">{torneo.nombre}</span>
              
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-neon tracking-wide">
                  {torneo.tipoFormato === 'eliminacion_directa' ? '⚡ ELIMINACIÓN' : '🏆 LIGUILLA'}
                </span>
                <span className="text-sm font-semibold text-foreground/50 bg-foreground/5 px-3 py-1 rounded-full">
                  {torneo.equipos?.length || 0} Equipos
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/navegacion/torneos/${torneo._id}`)}
                className="text-sm font-bold text-black hover:bg-neon/90 bg-neon px-4 py-2 rounded-xl transition-all shadow-lg shadow-neon/20"
              >
                Panel de Control
              </motion.button>
              <button
                onClick={() => onDelete(torneo._id)}
                disabled={deletingId === torneo._id}
                className="text-sm px-4 py-2 font-bold text-red-500 hover:text-white hover:bg-red-500/80 border border-red-500/30 bg-red-500/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === torneo._id ? '...' : 'Borrar'}
              </button>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
