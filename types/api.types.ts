import { Partido } from './partido.types';

export interface CreatePartidoDto {
  equipoLocal: string;
  equipoVisitante: string;
  competicion: string;
  fechaPartido: string;
  estadio: string;
}

export interface UpdatePartidoDto {
  equipoLocal?: string;
  equipoVisitante?: string;
  competicion?: string;
  fechaPartido?: string;
  estadio?: string;
  estado?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
