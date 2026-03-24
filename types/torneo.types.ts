import { Equipo } from './equipo.types';

export type TipoTorneo = "eliminacion_directa" | "liguilla";

export interface Torneo {
  _id: string;
  nombre: string;
  tipoFormato: TipoTorneo;
  userId: string;
  equipos: Equipo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTorneoDto {
  nombre: string;
  tipoFormato: TipoTorneo;
  userId: string;
  equipos: string[]; // Arreglo de ObjectIds (strings)
}
