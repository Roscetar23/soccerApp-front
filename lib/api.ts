import { BACKEND_URL } from './constants';
import { Partido } from '@/types/partido.types';
import { Equipo, Liga, CreateEquipoDto, UpdateEquipoDto } from '@/types/equipo.types';

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

export async function saveFavorito(liga: string, equipo: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liga, equipo }),
  });
  if (!response.ok) {
    throw new Error('Error al guardar favorito');
  }
}
