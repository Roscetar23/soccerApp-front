import { BACKEND_URL } from './constants';
import { Partido } from '@/types/partido.types';
import { Equipo, Liga, CreateEquipoDto, UpdateEquipoDto, EstadisticasEquipo } from '@/types/equipo.types';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchProximosPartidos(): Promise<Partido[]> {
  const response = await fetch(`${BACKEND_URL}/partidos/proximos`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Error al cargar partidos');
  }
  return response.json();
}

export async function fetchPartidos(): Promise<Partido[]> {
  const response = await fetch(`${BACKEND_URL}/partidos`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Error al cargar partidos');
  }
  return response.json();
}

export async function fetchPartidoById(id: string): Promise<Partido> {
  const response = await fetch(`${BACKEND_URL}/partidos/${id}`);
  if (!response.ok) {
    throw new Error('Error al cargar el partido');
  }
  return response.json();
}

export async function createPartido(partido: Omit<Partido, '_id'>): Promise<Partido> {
  const response = await fetch(`${BACKEND_URL}/partidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partido),
  });
  if (!response.ok) {
    throw new Error('Error al crear el partido');
  }
  return response.json();
}

export async function updatePartido(id: string, data: Partial<Partido>): Promise<Partido> {
  const response = await fetch(`${BACKEND_URL}/partidos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el partido');
  }
  return response.json();
}

export async function deletePartido(id: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/partidos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el partido');
  }
}

export async function fetchEquipos(liga?: Liga): Promise<Equipo[]> {
  const url = liga ? `${BACKEND_URL}/equipos?liga=${liga}` : `${BACKEND_URL}/equipos`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Error al cargar equipos');
  }
  return response.json();
}

export async function fetchEquipoById(id: string): Promise<Equipo> {
  const response = await fetch(`${BACKEND_URL}/equipos/${id}`);
  if (!response.ok) {
    throw new Error('Error al cargar el equipo');
  }
  return response.json();
}

export async function createEquipo(data: CreateEquipoDto): Promise<Equipo> {
  const response = await fetch(`${BACKEND_URL}/equipos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Error al crear el equipo');
  }
  return response.json();
}

export async function updateEquipo(id: string, data: UpdateEquipoDto): Promise<Equipo> {
  const response = await fetch(`${BACKEND_URL}/equipos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el equipo');
  }
  return response.json();
}

export async function deleteEquipo(id: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/equipos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el equipo');
  }
}

export async function saveFavorito(liga: string, equipo: string, userId: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liga, equipo, userId }),
  });
  if (!response.ok) {
    throw new ApiError(response.status, 'Error al guardar favorito');
  }
}

export type Favorito = { liga: string; equipo: string; userId: string };

export async function getFavoritosByUsuario(userId: string): Promise<Favorito[]> {
  const response = await fetch(`${BACKEND_URL}/favoritos/usuario/${userId}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Error al obtener favoritos');
  }
  return response.json();
}

export async function fetchEstadisticasEquipo(id: string): Promise<EstadisticasEquipo> {
  const response = await fetch(`${BACKEND_URL}/equipos/${id}/estadisticas`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Error al cargar estadísticas del equipo');
  }
  return response.json() as Promise<EstadisticasEquipo>;
}

export async function saveEstadisticasEquipo(id: string, data: EstadisticasEquipo): Promise<EstadisticasEquipo> {
  const response = await fetch(`${BACKEND_URL}/equipos/${id}/estadisticas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Error al guardar estadísticas del equipo');
  }
  return response.json() as Promise<EstadisticasEquipo>;
}

import { Torneo, CreateTorneoDto } from '@/types/torneo.types';

export async function fetchTorneos(): Promise<Torneo[]> {
  const response = await fetch(`${BACKEND_URL}/torneos`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Error al cargar torneos');
  }
  return response.json();
}

export async function fetchTorneoById(id: string): Promise<Torneo> {
  const response = await fetch(`${BACKEND_URL}/torneos/${id}`);
  if (!response.ok) {
    throw new Error('Error al cargar el torneo');
  }
  return response.json();
}

export async function createTorneo(data: CreateTorneoDto): Promise<Torneo> {
  const response = await fetch(`${BACKEND_URL}/torneos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Error al crear el torneo');
  }
  return response.json();
}

export async function deleteTorneo(id: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/torneos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el torneo');
  }
}
