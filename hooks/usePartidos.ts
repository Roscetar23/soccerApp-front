'use client';

import { useState, useEffect } from 'react';
import { fetchProximosPartidos } from '@/lib/api';
import { Partido } from '@/types/partido.types';

export function usePartidos() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProximosPartidos()
      .then((data) => {
        setPartidos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { partidos, loading, error };
}
