import { fetchProximosPartidos } from '@/lib/api';
import CountdownCard from '@/components/contador/CountdownCard';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default async function ContadorPage() {
  let partidos = [];
  let error = null;

  try {
    partidos = await fetchProximosPartidos();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error al cargar partidos';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Próximos Partidos</h1>
      
      {error && <ErrorMessage message={error} />}
      
      {!error && partidos.length === 0 && (
        <p className="text-center text-gray-600">No hay partidos próximos</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partidos.map((partido) => (
          <CountdownCard key={partido._id} partido={partido} />
        ))}
      </div>
    </div>
  );
}
