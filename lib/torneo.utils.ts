import { Equipo } from "@/types/equipo.types";
import { PartidoTorneo } from "@/types/partido.types";

export type Slot = { equipo: Equipo | null; esBye: boolean };

export function computarRondasEliminacion(equipos: Equipo[], partidos: PartidoTorneo[]) {
  const numRondas = Math.ceil(Math.log2(Math.max(equipos.length, 2)));
  const totalSlotsPrimeraRonda = Math.pow(2, numRondas);
  const rondas: Slot[][] = [];

  const primeraRonda: Slot[] = Array.from({ length: totalSlotsPrimeraRonda }, (_, i) =>
    i < equipos.length
      ? { equipo: equipos[i], esBye: false }
      : { equipo: null, esBye: true }
  );
  rondas.push(primeraRonda);

  const pendingMatches: { local: Equipo; visitante: Equipo; ronda: number }[] = [];

  for (let roundIdx = 1; roundIdx <= numRondas; roundIdx++) {
    const parentRonda = rondas[roundIdx - 1];
    const newRonda: Slot[] = [];

    for (let i = 0; i < parentRonda.length; i += 2) {
      const slotA = parentRonda[i];
      const slotB = parentRonda[i + 1];

      let winner: Equipo | null = null;
      let esBye = false;

      if (slotA.esBye && slotB.esBye) {
        esBye = true;
      } else if (slotA.esBye && slotB.equipo) {
        winner = slotB.equipo;
      } else if (slotB.esBye && slotA.equipo) {
        winner = slotA.equipo;
      } else if (slotA.equipo && slotB.equipo) {
        const eqA = slotA.equipo;
        const eqB = slotB.equipo;

        const match = partidos.find(p => 
          p.estado === 'finalizado' && 
          ((p.equipoLocal?._id === eqA._id && p.equipoVisitante?._id === eqB._id) || 
           (p.equipoLocal?._id === eqB._id && p.equipoVisitante?._id === eqA._id))
        );

        if (match) {
          const isLocalA = match.equipoLocal?._id === eqA._id;
          const golesA = isLocalA ? (match.golesLocal || 0) : (match.golesVisitante || 0);
          const golesB = isLocalA ? (match.golesVisitante || 0) : (match.golesLocal || 0);
          const penalesA = isLocalA ? (match.penalesLocal || 0) : (match.penalesVisitante || 0);
          const penalesB = isLocalA ? (match.penalesVisitante || 0) : (match.penalesLocal || 0);
          
          if (golesA > golesB) winner = eqA;
          else if (golesB > golesA) winner = eqB;
          else {
             // Empate en Eliminatoria: Revisar Penales
             if (penalesA > penalesB) winner = eqA;
             else if (penalesB > penalesA) winner = eqB;
             else winner = eqA; // Default anti-crashing if math fails
          }
        } else {
          pendingMatches.push({ local: eqA, visitante: eqB, ronda: roundIdx });
        }
      }
      newRonda.push({ equipo: winner, esBye });
    }
    rondas.push(newRonda);
  }
  return { rondas, pendingMatches, numRondas, totalSlotsPrimeraRonda };
}

export function getPartidosFaltantesLiga(equipos: Equipo[], partidos: PartidoTorneo[]) {
  const pendingMatches: { local: Equipo; visitante: Equipo; vuelta: boolean }[] = [];
  const finalizados = partidos.filter(p => p.estado === 'finalizado');
  
  for (let i = 0; i < equipos.length; i++) {
    for (let j = i + 1; j < equipos.length; j++) {
      const eqA = equipos[i];
      const eqB = equipos[j];
      
      const encounters = finalizados.filter(p => 
         (p.equipoLocal?._id === eqA._id && p.equipoVisitante?._id === eqB._id) ||
         (p.equipoLocal?._id === eqB._id && p.equipoVisitante?._id === eqA._id)
      );

      if (encounters.length === 0) {
        pendingMatches.push({ local: eqA, visitante: eqB, vuelta: false });
        pendingMatches.push({ local: eqB, visitante: eqA, vuelta: true });
      } else if (encounters.length === 1) {
        const primerPartido = encounters[0];
        if (primerPartido.equipoLocal?._id === eqA._id) {
           pendingMatches.push({ local: eqB, visitante: eqA, vuelta: true });
        } else {
           pendingMatches.push({ local: eqA, visitante: eqB, vuelta: true });
        }
      }
    }
  }
  return pendingMatches;
}
