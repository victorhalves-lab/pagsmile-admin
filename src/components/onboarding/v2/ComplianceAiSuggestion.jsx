import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Card de sugestão da IA antes de mostrar as 3 opções.
 * Reduz fricção: "Recomendamos: PIX + Cartão" baseado em Step3.
 */
export default function ComplianceAiSuggestion({
  recommendation = 'both',
  reasoning = 'Identificamos seu perfil como e-commerce com faturamento estimado de R$ 50k/mês. Para maximizar conversão, recomendamos aceitar PIX + Cartão.',
  estimatedTime = '15-25 min',
  onAccept,
  onSeeOptions,
}) {
  const labels = {
    pix: 'PIX apenas',
    card: 'Cartão apenas',
    both: 'PIX + Cartão',
  };

  return (
    <Card className="border-2 border-[#2bc196]/30 bg-gradient-to-br from-emerald-50 via-white to-blue-50 shadow-lg shadow-emerald-500/10">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900">Recomendação da IA</h3>
              <Badge className="bg-[#2bc196] text-white text-[10px]">
                Para você
              </Badge>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {reasoning}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1">
                Configuração sugerida
              </div>
              <div className="text-2xl font-black text-slate-900">
                {labels[recommendation]}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">KYC: <strong className="text-slate-900">{estimatedTime}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-500">Aprovação esperada: <strong className="text-emerald-600">88%</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={onAccept} className="flex-1 bg-[#2bc196] hover:bg-[#239b7a] gap-2">
            Aceitar recomendação
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={onSeeOptions}>
            Ver outras opções
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}