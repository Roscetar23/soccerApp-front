import { EquipoTorneo } from "@/types/torneo.types";

interface TablaLigaProps {
  equipos: EquipoTorneo[];
}

export default function TablaLiga({ equipos }: TablaLigaProps) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <table className="w-full text-white">
        <thead>
          <tr className="border-b border-slate-700 text-slate-400 text-sm">
            <th className="py-3 px-4 text-left w-10">#</th>
            <th className="py-3 px-4 text-left">Equipo</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo, index) => (
            <tr
              key={index}
              className="border-b border-slate-700 last:border-0 hover:bg-slate-700 transition-colors"
            >
              <td className="py-3 px-4 text-slate-400 text-sm">{index + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={equipo.escudo}
                    alt={`Escudo de ${equipo.nombre}`}
                    width={28}
                    height={28}
                    className="object-contain w-7 h-7"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="font-medium">{equipo.nombre}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
