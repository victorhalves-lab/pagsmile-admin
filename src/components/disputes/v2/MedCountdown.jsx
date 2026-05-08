import React, { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MedCountdown({ deadline, compact = false }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    deadline ? differenceInSeconds(new Date(deadline), new Date()) : 0
  );

  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => {
      setSecondsLeft(differenceInSeconds(new Date(deadline), new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!deadline) return <span className="text-slate-400 text-xs">—</span>;

  if (secondsLeft <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-bold">
        <Clock className="w-3 h-3" /> Expirado
      </span>
    );
  }

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isCritical = secondsLeft < 7200; // <2h
  const isUrgent = secondsLeft < 14400; // <4h

  const text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <span className={cn(
      'inline-flex items-center gap-1 font-mono font-bold',
      compact ? 'text-xs' : 'text-sm',
      isCritical ? 'text-red-700 animate-pulse' : isUrgent ? 'text-orange-600' : 'text-emerald-700'
    )}>
      {isCritical ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
      {text}
    </span>
  );
}