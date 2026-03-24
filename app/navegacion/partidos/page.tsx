import { fetchProximosPartidos } from '@/lib/api';
import CountdownCard from '@/components/contador/CountdownCard';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default async function PartidosPage() {
  let partidos: Awaited<ReturnType<typeof fetchProximosPartidos>> = [];
  let error = null;

  try {
    partidos = await fetchProximosPartidos();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Error al cargar partidos';
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
          Próximos{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-cyan-500">
            Partidos
          </span>
        </h1>

        {error && <ErrorMessage message={error} />}

        {!error && partidos.length === 0 && (
          <p className="text-center text-foreground/60">No hay partidos próximos</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partidos.map((partido) => (
            <CountdownCard key={partido._id} partido={partido} />
          ))}
        </div>
      </div>
    </div>
  );
}
