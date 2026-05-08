import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Heart, RotateCcw, ShoppingBag, Megaphone, Check, ArrowRight, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const objectives = [
  { id: 'acquisition', label: 'Aquisição de novos clientes', desc: 'Atrair quem nunca comprou', icon: Heart, color: 'text-pink-600 bg-pink-50' },
  { id: 'retention', label: 'Retenção / Loyalty', desc: 'Recompensar clientes recorrentes', icon: RotateCcw, color: 'text-blue-600 bg-blue-50' },
  { id: 'recovery', label: 'Recuperação de abandono', desc: 'Trazer de volta carrinho não convertido', icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'promotion', label: 'Promoção / Campanha', desc: 'Campanha sazonal ou flash', icon: Megaphone, color: 'text-amber-600 bg-amber-50' },
];

const suggestionsByObjective = {
  acquisition: { code: 'BEMVINDO10', value: 10, type: 'percentage', name: 'Boas-vindas 10%', min_purchase_amount: 50, usage_limit_per_user: 1 },
  retention: { code: 'VIP5', value: 5, type: 'percentage', name: 'Loyalty VIP', is_stackable: true },
  recovery: { code: 'VOLTA10', value: 10, type: 'percentage', name: 'Recuperação de carrinho', min_purchase_amount: 50 },
  promotion: { code: 'PROMO20', value: 20, type: 'percentage', name: 'Promoção flash', applies_to: 'all_products' },
};

export default function CouponWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState(null);
  const [config, setConfig] = useState(null);

  const pickObjective = (id) => {
    setObjective(id);
    setConfig(suggestionsByObjective[id]);
    setStep(2);
  };

  const refineValue = (newValue) => {
    setConfig({ ...config, value: parseFloat(newValue) || 0 });
  };

  return (
    <Card className="max-w-xl mx-auto border-[#2bc196]/30">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2bc196]" />
            Cupom em 60 segundos
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs" onClick={onCancel}>
            Pular wizard
          </Button>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                s <= step ? 'bg-[#2bc196]' : 'bg-slate-200 dark:bg-slate-700'
              )}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <>
            <p className="text-sm font-semibold">Qual objetivo desta campanha?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {objectives.map((o) => {
                const Icon = o.icon;
                return (
                  <button
                    key={o.id}
                    onClick={() => pickObjective(o.id)}
                    className="text-left p-3 border-2 rounded-xl hover:border-[#2bc196] transition-all"
                  >
                    <div className={`inline-flex p-2 rounded-lg ${o.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold mt-2">{o.label}</p>
                    <p className="text-[11px] text-slate-500">{o.desc}</p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && config && (
          <>
            <p className="text-sm font-semibold">A IA sugeriu esta configuração:</p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Código</span>
                <Input
                  value={config.code}
                  onChange={(e) => setConfig({ ...config, code: e.target.value.toUpperCase() })}
                  className="w-40 h-7 font-mono text-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Valor (%)</span>
                <Input
                  type="number"
                  value={config.value}
                  onChange={(e) => refineValue(e.target.value)}
                  className="w-24 h-7 text-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Nome</span>
                <Input
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="w-48 h-7 text-xs"
                />
              </div>
            </div>

            {/* Benchmark */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5">
              <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">📊 Benchmark</p>
              <p className="text-[11px] text-blue-700 dark:text-blue-300">
                Cupons de {config.value}% têm <strong>{(15 + config.value * 0.8).toFixed(0)}% de conversão</strong> em média.
                {config.value > 20 && ' Acima de 20% reduz margem em ~6%.'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Voltar
              </Button>
              <Button
                className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
                onClick={() => onComplete(config)}
              >
                <Check className="w-4 h-4 mr-2" /> Criar cupom
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}