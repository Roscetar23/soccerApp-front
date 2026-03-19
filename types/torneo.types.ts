export type TipoTorneo = "eliminacion_directa" | "liga";

export interface EquipoTorneo {
  nombre: string;
  escudo: string;
}

export interface Torneo {
  _id: string;
  nombre: string;
  tipo: TipoTorneo;
  equipos: EquipoTorneo[];
}

export interface CreateTorneoDto {
  nombre: string;
  tipo: TipoTorneo;
  equipos: EquipoTorneo[];
}
