"use client";

import { useState } from "react";
import { Equipo } from "@/types/equipo.types";

interface EquipoCardProps {
  equipo: Equipo;
  onSelect: (equipo: Equipo) => void;
}

export default function EquipoCard({ equipo, onSelect }: EquipoCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => onSelect(equipo)}
      className="
        flex flex-col items-center justify-center gap-3 p-5 rounded-xl w-full
        border-2 border-slate-700 bg-slate-800/50 transition-all duration-200 cursor-pointer
        hover:border-emerald-500 hover:bg-emerald-950/30 hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/30
      "
    >
      <div className="w-16 h-16 flex items-center justify-center">
        {imgError ? (
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-400">
              {equipo.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          <img
            src={equipo.escudo}
            alt={`Escudo de ${equipo.nombre}`}
            width={64}
            height={64}
            className="object-contain w-16 h-16"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <span className="text-sm font-semibold tracking-wide text-slate-300 text-center leading-tight">
        {equipo.nombre}
      </span>
    </button>
  );
}
