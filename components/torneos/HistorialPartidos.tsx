"use client";

import { PartidoTorneo } from "@/types/partido.types";

interface HistorialPartidosProps {
  partidos: PartidoTorneo[];
}

export default function HistorialPartidos({ partidos }: HistorialPartidosProps) {
  const finalizados = partidos
    .filter((p) => p.estado === "finalizado")
    .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());

  if (finalizados.length === 0) return null;

  const formatter = new Intl.DateTimeFormat("es-CO", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mt-12 bg-card/60 backdrop-blur-xl rounded-3xl border border-foreground/10 overflow-hidden shadow-2xl p-6">
      <h3 className="text-xl font-bold text-neon mb-6 flex items-center gap-3">
        <span className="text-2xl">📋</span> Bitácora de Resultados
      </h3>
      <div className="space-y-3">
        {finalizados.map((partido) => {
          const huboPenales =
            partido.penalesLocal !== undefined && partido.penalesVisitante !== undefined;

          // Protecciones por si algún equipo fue borrado de base de datos
          if (!partido.equipoLocal || !partido.equipoVisitante) return null;

          return (
            <div
              key={partido._id}
              className="bg-background/80 border border-foreground/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-foreground/5 hover:border-foreground/10 transition-colors shadow-sm"
            >
              <div className="flex-1 w-full flex items-center justify-center md:justify-end gap-3 text-right">
                <span className="font-bold text-foreground/90 text-sm md:text-base">
                  {partido.equipoLocal.nombre}
                </span>
                <img
                  src={partido.equipoLocal.escudo}
                  alt={partido.equipoLocal.nombre}
                  className="w-10 h-10 rounded-full bg-white object-contain shadow-sm border border-foreground/10 p-1"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>

              <div className="flex flex-col items-center justify-center min-w-[120px]">
                <div className="flex items-center gap-4 bg-foreground/5 px-5 py-2 rounded-xl border border-foreground/10 shadow-inner">
                  <span className="text-2xl font-black text-foreground">
                    {partido.golesLocal}
                  </span>
                  <span className="text-xs text-foreground/30 font-bold uppercase tracking-widest">
                    vs
                  </span>
                  <span className="text-2xl font-black text-foreground">
                    {partido.golesVisitante}
                  </span>
                </div>
                {huboPenales && (
                  <span className="text-xs text-purple-400 font-bold mt-2 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 shadow-sm">
                    Pen: {partido.penalesLocal} - {partido.penalesVisitante}
                  </span>
                )}
              </div>

              <div className="flex-1 w-full flex items-center justify-center md:justify-start gap-3 text-left">
                <img
                  src={partido.equipoVisitante.escudo}
                  alt={partido.equipoVisitante.nombre}
                  className="w-10 h-10 rounded-full bg-white object-contain shadow-sm border border-foreground/10 p-1"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <span className="font-bold text-foreground/90 text-sm md:text-base">
                  {partido.equipoVisitante.nombre}
                </span>
              </div>

              <div className="text-xs text-foreground/40 hidden lg:block uppercase font-bold tracking-wider">
                {partido.fechaHora ? formatter.format(new Date(partido.fechaHora)) : "Registrado"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
