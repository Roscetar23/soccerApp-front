'use client';

import { useCountdown } from '@/hooks/useCountdown';

interface CountdownClockProps {
  targetDate: Date;
}

export default function CountdownClock({ targetDate }: CountdownClockProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="flex gap-4 justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold">{String(days).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Días</div>
      </div>
      <div className="text-4xl font-bold">:</div>
      <div className="text-center">
        <div className="text-4xl font-bold">{String(hours).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Horas</div>
      </div>
      <div className="text-4xl font-bold">:</div>
      <div className="text-center">
        <div className="text-4xl font-bold">{String(minutes).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Minutos</div>
      </div>
      <div className="text-4xl font-bold">:</div>
      <div className="text-center">
        <div className="text-4xl font-bold">{String(seconds).padStart(2, '0')}</div>
        <div className="text-sm text-gray-600">Segundos</div>
      </div>
    </div>
  );
}
