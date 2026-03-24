import { Equipo } from './equipo.types';
import { Torneo } from './torneo.types';

export interface Partido {
  _id: string;
  equipoLocal: string;
  equipoVisitante: string;
  competicion: string;
  fechaPartido: string;
  estadio: string;
  estado?: string;
}

export interface PartidoTorneo {
  _id: string;
  torneo: Torneo | string;
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  fechaHora: string;
  golesLocal?: number;
  golesVisitante?: number;
  penalesLocal?: number;
  penalesVisitante?: number;
  estado: "programado" | "finalizado";
}

export interface CreatePartidoTorneoDto {
  torneo: string;
  equipoLocal: string;
  equipoVisitante: string;
  fechaHora: string;
  golesLocal?: number;
  golesVisitante?: number;
  penalesLocal?: number;
  penalesVisitante?: number;
  estado?: string;
}
