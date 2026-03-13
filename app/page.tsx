import { fetchProximosPartidos } from '@/lib/api';
import CountdownClock from '@/components/contador/CountdownClock';

export default async function Home() {
  let partidoMundial = null;

  try {
    const partidos = await fetchProximosPartidos();
    // Buscar el partido del mundial (puedes ajustar el filtro según tu necesidad)
    partidoMundial = partidos.find(p => 
      p.competicion.toLowerCase().includes('mundial') || 
      p.competicion.toLowerCase().includes('world cup')
    ) || partidos[0]; // Si no hay mundial, toma el primer partido
  } catch (err) {
    console.error('Error al cargar partidos:', err);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center justify-center gap-8 px-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            ⚽ Mundial de Fútbol
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-12">
            Esto falta para el inicio del mundial
          </p>
        </div>
        
        {partidoMundial ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 w-full">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {partidoMundial.equipoLocal} vs {partidoMundial.equipoVisitante}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">{partidoMundial.competicion}</p>
              <p className="text-md text-gray-500 dark:text-gray-500">{partidoMundial.estadio}</p>
            </div>
            
            <CountdownClock targetDate={new Date(partidoMundial.fechaPartido)} />
            
            <p className="text-center text-gray-600 dark:text-gray-400 mt-8 text-lg">
              {new Date(partidoMundial.fechaPartido).toLocaleString('es-ES', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 w-full text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No hay partidos programados
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
