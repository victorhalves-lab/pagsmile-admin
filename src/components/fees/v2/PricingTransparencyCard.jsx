import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Layers, Info } from 'lucide-react';

const COMPONENTS = [
  { label: 'Interchange (Bandeira)', value: 1.65, color: 'bg-blue-500', desc: 'Taxa repassada ao banco emissor' },
  { label: 'Fee da Rede (Visa/MC)', value: 0.15, color: 'bg-purple-500', desc: 'Network fee paga à bandeira' },
  { label: 'Adquirente', value: 0.65, color: 'bg-orange-500', desc: 'Cielo / Stone / Adyen — processamento' },
  { label: 'Antifraude (incluso)', value: 0.30, color: 'bg-red-500', desc: 'Análise comportamental + ML' },
  { label: '3DS Auth', value: 0.10, color: 'bg-cyan-500', desc: 'Liability shift Visa/MC' },
  { label: 'Margem PagSmile', value: 0.14, color: 'bg-emerald-500', desc: 'Plataforma + suporte + features' },
];

export default function PricingTransparencyCard() {
  const total = COMPONENTS.reduce((s, c) => s + c.value, 0);

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Pricing Transparency · Crédito Vista Visa/MC
            <Badge className="bg-blue-100 text-blue-700 border-0 text-[9px]">Diferencial</Badge>
          </CardTitle>
          <span className="text-xs text-slate-500">Decomposição da MDR de {total.toFixed(2)}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-8 rounded-lg overflow-hidden mb-3 shadow-sm">
          {COMPONENTS.map((c) => (
            <TooltipProvider key={c.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`${c.color} hover:opacity-80 cursor-help transition-opacity flex items-center justify-center`}
                    style={{ width: `${(c.value / total) * 100}%` }}
                  >
                    <span className="text-[9px] font-bold text-white">{c.value.toFixed(2)}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-bold">{c.label}: {c.value.toFixed(2)}%</p>
                  <p className="text-[10px] text-slate-300">{c.desc}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {COMPONENTS.map((c) => (
            <div key={c.label} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
              <div className={`w-3 h-3 rounded ${c.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-slate-700 truncate">{c.label}</p>
                <p className="text-xs font-bold text-slate-900">{c.value.toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-800">
            <span className="font-bold">Transparência total:</span> Você sabe exatamente para onde vai cada centavo. Margem PagSmile (0,14%) é a menor da indústria — somos honestos sobre nossos custos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}