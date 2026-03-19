import { Equipo } from "@/types/equipo.types";
import EscudoImage from "./EscudoImage";

interface EquipoHeaderProps {
  equipo: Equipo;
}

const LIGA_LABELS: Record<Equipo["liga"], string> = {
  colombiana: "Liga Colombiana",
  española: "La Liga",
  inglesa: "Premier League",
};

export default function EquipoHeader({ equipo }: EquipoHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <EscudoImage
        src={equipo.escudo}
        alt={`Escudo de ${equipo.nombre}`}
      />
      <h1 className="text-3xl font-bold text-emerald-400 text-center">
        {equipo.nombre}
      </h1>
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700 text-slate-200 border border-slate-600">
        {LIGA_LABELS[equipo.liga]}
      </span>
    </div>
  );
}
