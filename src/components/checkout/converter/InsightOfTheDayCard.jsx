import React from 'react';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * "Insight do dia" — porta de entrada acionável quando merchant abre ConverterAgent.
 */
export default function InsightOfTheDayCard() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">Insight do dia · 08 mai</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">IA</span>
          </div>
          <h3 className="text-lg font-bold mb-1">Recomendamos: rodar A/B em layout mobile</h3>
          <p className="text-sm opacity-90 mb-3">
            Mobile representa <strong>68% do tráfego</strong> mas converte 50% menos que desktop.
            Histórico mostra que <strong>1-step layout</strong> ganha em 87% dos peers SaaS BR.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Lift estimado: +12% conversão mobile</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-purple-700 hover:bg-white/90 gap-1"
              onClick={() => toast.success('Configurando A/B test em layout mobile...')}
            >
              Iniciar teste agora <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}