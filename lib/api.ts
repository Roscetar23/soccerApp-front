import { BACKEND_URL } from './constants';
import { Partido } from '@/types/partido.types';

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
