export interface Partido {
  _id: string;
  equipoLocal: string;
  equipoVisitante: string;
  competicion: string;
  fechaPartido: string;
  estadio: string;
  estado?: string;
}
