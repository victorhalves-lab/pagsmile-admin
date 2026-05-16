import React from 'react';
import { Button } from '@/components/ui/button';
import { PulsePill } from '@/components/pulse';
import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AnticipationContextCard({
  receivableAmount = 212880,
  feePercentage = 1.99,
  netAmount,
}) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
    }).format(v || 0);

  const fee = (receivableAmount * feePercentage) / 100;
  const net = netAmount ?? receivableAmount - fee;

  return (
    <div
      className="pulse-kpi is-glow-mint h-full"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2bc196]/15 flex items-center justify-center border border-[#2bc196]/25">
            <Zap className="w-4 h-4 text-[#18866a]" />
          </div>
          <span className="pulse-eyebrow">ANTECIPAÇÃO · disponível</span>
        </div>
        <PulsePill tone="mint" size="xs" variant="solid">✦ ELEGÍVEL</PulsePill>
      </div>

      <div>
        <p className="text-[11.5px] text-[#5a5a5a] mb-1">Você pode antecipar até</p>
        <p className="pulse-mono font-bold tracking-tight text-[#282828] text-[32px] leading-none">
          {fmt(receivableAmount)}
        </p>
      </div>

      <div className="flex items-center gap-4 text-[11.5px] text-[#5a5a5a]">
        <span>Taxa <b className="pulse-mono text-[#282828]">{feePercentage.toFixed(2)}%</b></span>
        <span className="w-px h-3 bg-[#e7e7e7]" />
        <span>Você recebe <b className="pulse-mono text-[#18866a]">{fmt(net)}</b> hoje</span>
      </div>

      <Link to={createPageUrl('Anticipation')} className="block mt-1">
        <Button
          size="sm"
          className="bg-[#2bc196] hover:bg-[#20a780] text-white font-semibold h-9 w-full"
        >
          Antecipar agora
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}