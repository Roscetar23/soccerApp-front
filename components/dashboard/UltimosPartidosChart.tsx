import { ResultadoPartido } from "@/types/equipo.types";

interface UltimosPartidosChartProps {
  resultados: ResultadoPartido[];
}

const badgeConfig: Record<ResultadoPartido, { bg: string; label: string }> = {
  G: { bg: "bg-emerald-500", label: "G" },
  P: { bg: "bg-red-500", label: "P" },
  E: { bg: "bg-yellow-500", label: "E" },
};

export default function UltimosPartidosChart({ resultados }: UltimosPartidosChartProps) {
  if (resultados.length === 0) {
    return <p className="text-gray-400 text-sm">Sin partidos recientes</p>;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {resultados.map((resultado, index) => {
        const { bg, label } = badgeConfig[resultado];
        return (
          <span
            key={index}
            className={`${bg} text-white font-bold text-sm w-8 h-8 flex items-center justify-center rounded-full`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
