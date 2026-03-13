'use client';

import { useCountdown } from '@/hooks/useCountdown';

interface CountdownClockProps {
  targetDate: Date;
}

export default function CountdownClock({ targetDate }: CountdownClockProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="flex gap-4 md:gap-6 justify-center items-center flex-wrap">
      <TimeCard value={days} label="DAYS" />
      <TimeCard value={hours} label="HOURS" />
      <TimeCard value={minutes} label="MINUTES" />
      <TimeCard value={seconds} label="SECONDS" animate />
    </div>
  );
}

function TimeCard({ value, label, animate = false }: { value: number; label: string; animate?: boolean }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
      <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-emerald-500/20 shadow-2xl min-w-[120px] md:min-w-[160px]">
        <div className={`text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400 tabular-nums ${animate ? 'animate-pulse' : ''}`}>
          {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs md:text-sm font-semibold text-emerald-300/70 tracking-widest mt-2">
          {label}
        </div>
      </div>
    </div>
  );
}
