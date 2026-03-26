'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { uploadExcelLigas } from '@/lib/api';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Spinner from '@/components/ui/Spinner';

export default function ImportarLigasPage() {
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
      const data = await uploadExcelLigas(file);
      setSuccess(data.message || 'Importación completada con éxito.');
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
      className="container mx-auto px-4 py-8 max-w-2xl"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-4xl font-bold mb-6 font-bebas tracking-wide">Importar Ligas Profesionales</h1>
      
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
        <p className="text-gray-300 mb-8 font-inter">
          Sube el archivo Excel que contiene las 3 hojas designadas (Equipos, Partidos y Estadísticas). 
          El proceso importará de manera segura sin crear duplicados.
        </p>

        {error && <ErrorMessage message={error} />}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="p-4 mb-6 bg-emerald-500/20 text-emerald-300 border border-emerald-500 rounded-xl"
          >
            {success} Redirigiendo al panel...
          </motion.div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex flex-col items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-white/20 border-dashed rounded-xl cursor-pointer bg-black/20 hover:bg-white/5 transition-colors group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-emerald-500/80 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Click para buscar</span> o arrastra el archivo aquí
                </p>
                <p className="text-xs text-gray-500 font-mono">.XLSX, .XLS, .CSV</p>
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
              className="text-sm border border-emerald-500/30 px-4 py-3 rounded-lg flex justify-between items-center bg-emerald-900/20"
            >
              <span className="font-mono text-emerald-50">{file.name}</span>
              <span className="text-emerald-400 font-semibold text-xs border border-emerald-400/30 px-2 py-1 rounded-md">
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
              Volver
            </button>
            <motion.button
              type="submit"
              disabled={loading || !file}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-inter"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner /> Procesando...
                </div>
              ) : 'Subir e Importar'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
