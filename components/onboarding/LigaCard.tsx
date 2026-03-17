import { Liga } from "@/types/equipo.types";

interface LigaCardProps {
  liga: Liga;
  seleccionada: boolean;
  onSelect: (liga: Liga) => void;
}

const LIGA_CONFIG: Record<Liga, { emoji: string; nombre: string }> = {
  colombiana: { emoji: "🇨🇴", nombre: "Liga Colombiana" },
  española: { emoji: "🇪🇸", nombre: "Liga Española" },
  inglesa: { emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", nombre: "Premier League" },
};

export default function LigaCard({ liga, seleccionada, onSelect }: LigaCardProps) {
  const { emoji, nombre } = LIGA_CONFIG[liga];

  return (
    <button
      onClick={() => onSelect(liga)}
      className={`
        flex flex-col items-center justify-center gap-3 p-6 rounded-xl w-full
        border-2 transition-all duration-200 cursor-pointer
        ${
          seleccionada
            ? "border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-900/30"
            : "border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800"
        }
      `}
    >
      <span className="text-4xl">{emoji}</span>
      <span
        className={`text-sm font-semibold tracking-wide ${
          seleccionada ? "text-emerald-400" : "text-slate-300"
        }`}
      >
        {nombre}
      </span>
    </button>
  );
}
