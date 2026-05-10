import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CallTimerBadge({ onStart, onStop, started }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {started ? (
        <>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-mono font-bold text-emerald-800 text-sm">{mm}:{ss}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={onStop} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <PhoneOff className="w-3.5 h-3.5 mr-1" /> Encerrar
          </Button>
        </>
      ) : (
        <Button size="sm" onClick={onStart} className="bg-emerald-600 hover:bg-emerald-700">
          <Phone className="w-3.5 h-3.5 mr-1" /> Iniciar chamada
        </Button>
      )}
    </div>
  );
}