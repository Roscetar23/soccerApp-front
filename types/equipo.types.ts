export type Liga = "colombiana" | "española" | "inglesa" | "barrio";

export interface Equipo {
  _id: string;
  nombre: string;
  escudo: string;        // URL de imagen
  fechaCreacion: string; // ISO date string
  liga: Liga;
  userId?: string;
}

export interface CreateEquipoDto {
  nombre: string;
  escudo: string;
  fechaCreacion: string;
  liga: Liga;
  userId?: string;
}

export interface UpdateEquipoDto {
  nombre?: string;
  escudo?: string;
  fechaCreacion?: string;
  liga?: Liga;
}

export type ResultadoPartido = "G" | "P" | "E";

export interface EstadisticasEquipo {
  ultimosPartidos: ResultadoPartido[];
  porcentajeVictorias: number;
  promedioPases: number;
  promedioTirosAlArco: number;
  promedioFaltas: number;
}
