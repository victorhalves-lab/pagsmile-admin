import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Card de antecipação contextual.
 * Padrão Pagar.me / Cielo / PagBank / Stone — CTA #1 de adquirentes BR.
 *
 * Mostra "Você pode antecipar R$ X agora pagando Y% de taxa".
 */
export default function AnticipationContextCard({
  receivableAmount = 212880,
  feePercentage = 1.99,
  netAmount,
}) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value || 0);

  const fee = (receivableAmount * feePercentage) / 100;
  const net = netAmount ?? receivableAmount - fee;

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#2bc196] via-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 relative">
      {/* Decorative dots */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 right-12 w-20 h-20 bg-white/5 rounded-full -mb-10" />

      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Antecipação disponível
              </span>
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </div>

            <p className="text-[11px] text-white/80 mb-1">Você pode antecipar até</p>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight">
              {formatCurrency(receivableAmount)}
            </p>
            <p className="text-[11px] text-white/80 mt-1.5">
              Taxa de <span className="font-bold text-white">{feePercentage.toFixed(2)}%</span> ·
              Você recebe <span className="font-bold text-white">{formatCurrency(net)}</span> hoje
            </p>
          </div>

          <Link to={createPageUrl('Anticipation')} className="flex-shrink-0">
            <Button
              size="sm"
              className="bg-white hover:bg-white/90 text-[#2bc196] font-bold h-10 px-4 shadow-md"
            >
              Antecipar agora
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}