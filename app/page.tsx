import { fetchProximosPartidos } from '@/lib/api';
import CountdownClock from '@/components/contador/CountdownClock';

export default async function Home() {
  let partidoMundial = null;

  try {
    const partidos = await fetchProximosPartidos();
    partidoMundial = partidos.find(p => 
      p.competicion.toLowerCase().includes('mundial') || 
      p.competicion.toLowerCase().includes('world cup')
    ) || partidos[0];
  } catch (err) {
    console.error('Error al cargar partidos:', err);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(16, 185, 129, 0.1) 50px, rgba(16, 185, 129, 0.1) 51px)`,
        }}></div>
      </div>
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>

      <main className="relative flex flex-col items-center justify-center min-h-screen gap-12 px-4 md:px-8 py-12 z-10">
        <div className="text-center space-y-6 max-w-5xl">
          <div className="inline-block">
            <div className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-white italic">THE MATCH </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic">AWAITS</span>
            </div>
          </div>
          
          {partidoMundial && (
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Feel the roar of the crowd. The season's biggest rivalry is almost here.
            </p>
          )}
        </div>
        
        {partidoMundial ? (
          <div className="w-full max-w-6xl space-y-8">
            <CountdownClock targetDate={new Date(partidoMundial.fechaPartido)} />
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-emerald-500/20">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/50">
                  ⚽
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-400 uppercase tracking-wide">Match Details</p>
                  <p className="text-lg font-bold text-white">
                    {partidoMundial.equipoLocal} vs {partidoMundial.equipoVisitante}
                  </p>
                </div>
              </div>
              
              <p className="text-emerald-400 font-semibold text-lg">
                {partidoMundial.competicion}
              </p>
              
              <p className="text-gray-400 text-sm">
                {new Date(partidoMundial.fechaPartido).toLocaleString('es-ES', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })} • {partidoMundial.estadio}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-emerald-500/20">
            <p className="text-xl text-gray-400">
              No hay partidos programados
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
