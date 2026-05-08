import React, { useState, useEffect } from 'react';
import { QrCode, AlertCircle, CheckCircle2, Clock, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PIX Operações ao vivo — tempo médio de pagamento, expiração, atrasos do BACEN.
 * Atualiza visualmente como um terminal "pulsante" (paridade com Mercado Pago).
 */
export default function PixOpsLiveCard() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setPulse(p => p + 1), 3000);
    return () => clearInterval(i);
  }, []);

  const stats = [
    { label: 'Tempo médio de pagamento', value: '2:14', sub: 'min · meta: <3min', good: true, icon: Clock },
    { label: 'Taxa de expiração', value: '12.3%', sub: '-2pp vs ontem', good: true, icon: TrendingDown },
    { label: 'Atrasos BACEN', value: '0', sub: 'tudo liquidado em <10s', good: true, icon: CheckCircle2 },
    { label: 'QRs pendentes', value: '47', sub: 'expiram em até 30min', good: false, icon: AlertCircle },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-xl p-4 text-white shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          <h4 className="text-sm font-semibold">PIX Operações — ao vivo</h4>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full bg-emerald-300 transition-opacity", pulse % 2 === 0 ? "opacity-100" : "opacity-30")} />
          <span className="text-[10px] uppercase tracking-wider opacity-70">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={cn("w-3.5 h-3.5", s.good ? "text-emerald-300" : "text-amber-300")} />
                <p className="text-[10px] uppercase tracking-wide opacity-80">{s.label}</p>
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] opacity-70 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}