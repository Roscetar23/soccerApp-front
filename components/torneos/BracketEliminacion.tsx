"use client";

import { useState, useMemo } from "react";
import { Equipo } from "@/types/equipo.types";
import { PartidoTorneo } from "@/types/partido.types";
import { computarRondasEliminacion } from "@/lib/torneo.utils";

interface BracketEliminacionProps {
  equipos: Equipo[];
  partidos: PartidoTorneo[];
}

const SLOT_HEIGHT = 56;
const SLOT_WIDTH = 200;
const CONNECTOR_WIDTH = 32;
const HEADER_HEIGHT = 28;

function getRondaLabel(rondaIdx: number, totalRondas: number): string {
  const fromEnd = totalRondas - 1 - rondaIdx;
  if (rondaIdx === 0) return "Primera Ronda";
  if (fromEnd === 0) return "Campeón";
  if (fromEnd === 1) return "Final";
  if (fromEnd === 2) return "Semifinal";
  if (fromEnd === 3) return "Cuartos";
  return `Ronda ${rondaIdx + 1}`;
}

function EquipoModal({ equipo, onClose }: { equipo: Equipo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl flex flex-col w-72"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium leading-none"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col items-center gap-5 px-8 pb-8 pt-2">
          <img
            src={equipo.escudo}
            alt={equipo.nombre}
            className="w-28 h-28 object-contain bg-white rounded-full p-2"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <span className="text-white font-bold text-lg text-center">{equipo.nombre}</span>
        </div>
      </div>
    </div>
  );
}

function EquipoSlot({ equipo, esBye }: { equipo: Equipo | null; esBye: boolean }) {
  const [open, setOpen] = useState(false);

  if (esBye) {
    return (
      <div
        className="border border-slate-600 bg-slate-900 rounded flex items-center px-3 gap-2"
        style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT - 8 }}
      >
        <span className="text-sm text-slate-500 italic">BYE</span>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div
        className="border border-slate-600 bg-slate-800/60 rounded flex items-center px-3 gap-2"
        style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT - 8 }}
      >
        <span className="text-sm text-slate-500">—</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-emerald-500 rounded flex items-center px-3 gap-2 transition-colors cursor-pointer w-full text-left"
        style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT - 8 }}
      >
        <img src={equipo.escudo} className="w-5 h-5 object-contain bg-white rounded-sm" />
        <span className="text-sm text-white truncate font-medium">{equipo.nombre}</span>
      </button>
      {open && <EquipoModal equipo={equipo} onClose={() => setOpen(false)} />}
    </div>
  );
}

export default function BracketEliminacion({ equipos, partidos }: BracketEliminacionProps) {
  const comp = useMemo(() => computarRondasEliminacion(equipos, partidos), [equipos, partidos]);
  const { rondas, totalSlotsPrimeraRonda } = comp;
  const totalRondas = rondas.length;
  const totalHeight = totalSlotsPrimeraRonda * SLOT_HEIGHT + HEADER_HEIGHT + 20;

  return (
    <div className="overflow-x-auto pb-4 mt-6 custom-scrollbar">
      <div className="flex flex-row items-stretch min-w-max" style={{ height: totalHeight }}>
        {rondas.map((slots, rondaIdx) => {
          const slotsCount = slots.length;
          const slotSpacing = (totalSlotsPrimeraRonda * SLOT_HEIGHT) / slotsCount;
          const isLast = rondaIdx === totalRondas - 1;

          return (
            <div key={rondaIdx} className="flex flex-col" style={{ width: SLOT_WIDTH + (isLast ? 0 : CONNECTOR_WIDTH) }}>
              <div
                className="text-xs text-emerald-400 font-semibold text-center flex-shrink-0 flex items-center justify-center"
                style={{ height: HEADER_HEIGHT, width: SLOT_WIDTH }}
              >
                {getRondaLabel(rondaIdx, totalRondas)}
              </div>

              <div className="relative flex-1" style={{ width: SLOT_WIDTH + (isLast ? 0 : CONNECTOR_WIDTH) }}>
                {slots.map((slot, slotIdx) => {
                  const centerY = slotSpacing * slotIdx + slotSpacing / 2;
                  const slotTop = centerY - (SLOT_HEIGHT - 8) / 2;
                  const isPair = slotIdx % 2 === 0;

                  return (
                    <div key={slotIdx}>
                      <div className="absolute" style={{ top: slotTop, left: 0 }}>
                        <EquipoSlot equipo={slot.equipo} esBye={slot.esBye} />
                      </div>

                      {!isLast && (
                        <svg
                          className="absolute overflow-visible"
                          style={{
                            top: slotSpacing * slotIdx,
                            left: SLOT_WIDTH,
                            width: CONNECTOR_WIDTH,
                            height: slotSpacing * 2,
                            display: isPair ? "block" : "none",
                          }}
                        >
                          <line x1={0} y1={slotSpacing / 2} x2={CONNECTOR_WIDTH} y2={slotSpacing / 2} stroke="#475569" strokeWidth={1.5} />
                          <line x1={0} y1={slotSpacing + slotSpacing / 2} x2={CONNECTOR_WIDTH} y2={slotSpacing + slotSpacing / 2} stroke="#475569" strokeWidth={1.5} />
                          <line x1={CONNECTOR_WIDTH} y1={slotSpacing / 2} x2={CONNECTOR_WIDTH} y2={slotSpacing + slotSpacing / 2} stroke="#475569" strokeWidth={1.5} />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
