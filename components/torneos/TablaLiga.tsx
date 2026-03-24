'use client';

import { Equipo } from "@/types/equipo.types";
import { PartidoTorneo } from "@/types/partido.types";
import { useMemo } from "react";

interface TablaLigaProps {
  equipos: Equipo[];
  partidos: PartidoTorneo[];
}

export default function TablaLiga({ equipos, partidos }: TablaLigaProps) {
  const clasificacion = useMemo(() => {
    const stats: Record<string, any> = {};
    equipos.forEach(eq => {
      stats[eq._id] = {
        equipo: eq,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        gf: 0,
        gc: 0,
        df: 0,
        pts: 0
      };
    });

    const finalizados = partidos.filter(p => p.estado === 'finalizado');
    finalizados.forEach(p => {
      const idLocal = p.equipoLocal?._id;
      const idVisita = p.equipoVisitante?._id;
      
      const gl = p.golesLocal || 0;
      const gv = p.golesVisitante || 0;

      if (idLocal && idVisita && stats[idLocal] && stats[idVisita]) {
        stats[idLocal].pj += 1;
        stats[idVisita].pj += 1;
        
        stats[idLocal].gf += gl;
        stats[idLocal].gc += gv;
        stats[idVisita].gf += gv;
        stats[idVisita].gc += gl;

        if (gl > gv) {
          stats[idLocal].pg += 1;
          stats[idLocal].pts += 3;
          stats[idVisita].pp += 1;
        } else if (gv > gl) {
          stats[idVisita].pg += 1;
          stats[idVisita].pts += 3;
          stats[idLocal].pp += 1;
        } else {
          stats[idLocal].pe += 1;
          stats[idVisita].pe += 1;
          stats[idLocal].pts += 1;
          stats[idVisita].pts += 1;
        }
      }
    });

    const result = Object.values(stats).map(s => {
      s.df = s.gf - s.gc;
      return s;
    });

    return result.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.df !== a.df) return b.df - a.df;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.equipo.nombre.localeCompare(b.equipo.nombre);
    });
  }, [equipos, partidos]);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-white text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 text-sm">
              <th className="py-3 px-4 text-left w-10">#</th>
              <th className="py-3 px-4 text-left">Equipo</th>
              <th className="py-3 px-2 text-center" title="Partidos Jugados">PJ</th>
              <th className="py-3 px-2 text-center" title="Ganados">G</th>
              <th className="py-3 px-2 text-center" title="Empatados">E</th>
              <th className="py-3 px-2 text-center" title="Perdidos">P</th>
              <th className="py-3 px-2 text-center" title="Goles a Favor">GF</th>
              <th className="py-3 px-2 text-center" title="Goles en Contra">GC</th>
              <th className="py-3 px-2 text-center" title="Diferencia de Gol">DF</th>
              <th className="py-3 px-4 text-center font-bold text-white">PTS</th>
            </tr>
          </thead>
          <tbody>
            {clasificacion.map((fila, index) => (
              <tr
                key={fila.equipo._id}
                className="border-b border-slate-700 last:border-0 hover:bg-slate-700 transition-colors"
              >
                <td className="py-3 px-4 text-slate-400 text-sm">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fila.equipo.escudo}
                      alt={`Escudo de ${fila.equipo.nombre}`}
                      className="object-contain w-7 h-7 rounded-sm bg-white"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <span className="font-medium whitespace-nowrap">{fila.equipo.nombre}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center text-slate-300">{fila.pj}</td>
                <td className="py-3 px-2 text-center text-emerald-400">{fila.pg}</td>
                <td className="py-3 px-2 text-center text-yellow-500">{fila.pe}</td>
                <td className="py-3 px-2 text-center text-red-400">{fila.pp}</td>
                <td className="py-3 px-2 text-center text-slate-300">{fila.gf}</td>
                <td className="py-3 px-2 text-center text-slate-300">{fila.gc}</td>
                <td className="py-3 px-2 text-center font-mono text-slate-200">
                  {fila.df > 0 ? `+${fila.df}` : fila.df}
                </td>
                <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-900/10">
                  {fila.pts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
