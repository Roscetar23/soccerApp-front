'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { uploadExcelMundial } from '@/lib/api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Spinner from '@/components/ui/Spinner';

export default function ImportarMundialPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona un archivo Excel (.xlsx)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await uploadExcelMundial(file);
      setSuccess(data.message || 'Importación del Mundial completada con éxito.');
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo. Asegúrate de que el Backend está corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-2xl text-white"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-4xl font-bold mb-6 font-bebas tracking-wide text-[#d4af37]">Configuración Mundial 2026</h1>
      
      <div className="bg-black/60 backdrop-blur-md border border-[#d4af37]/30 rounded-2xl p-8 shadow-2xl">
        <p className="text-gray-300 mb-8 font-inter leading-relaxed">
          Sube el archivo Excel que contiene la configuración oficial de la Copa del Mundo 2026. <br/>
          Debe contener obligatoriamente 3 hojas: <span className="font-bold text-[#f3e5ab]">Sedes</span>, <span className="font-bold text-[#f3e5ab]">Clasificados</span> y <span className="font-bold text-[#f3e5ab]">Grupos</span>.
        </p>

        {error && <ErrorMessage message={error} />}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="p-4 mb-6 bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37] rounded-xl font-medium"
          >
            🎉 {success} Redirigiendo al panel de Admin...
          </motion.div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex flex-col items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-[#d4af37]/40 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-[#d4af37]/10 transition-colors group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏆</span>
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold text-[#d4af37]">Click para buscar</span> o arrastra el archivo Excel aquí
                </p>
                <p className="text-xs text-gray-500 font-mono">Formato requerido: .XLSX</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm border border-[#d4af37]/50 px-4 py-3 rounded-lg flex justify-between items-center bg-[#d4af37]/10"
            >
              <span className="font-mono text-[#f3e5ab]">{file.name}</span>
              <span className="text-black font-semibold text-xs border bg-[#d4af37] border-[#d4af37]/30 px-2 py-1 rounded-md">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </motion.div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-3 w-full border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <motion.button
              type="submit"
              disabled={loading || !file}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 w-full bg-gradient-to-r from-[#b5952f] to-[#d4af37] text-black rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-inter"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner /> Sincronizando Mongo...
                </div>
              ) : 'Actualizar Hub Mundial'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
