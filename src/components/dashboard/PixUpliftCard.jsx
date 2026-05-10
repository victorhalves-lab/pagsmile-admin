import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Fingerprint } from 'lucide-react';
import { FLOW_COMPARISON } from '@/components/transactions/pix/pixFlowMockData';

/**
 * Card "WOW" no Dashboard que sugere ativar PIX Biometria
 * mostrando o uplift de conversão potencial.
 */
export default function PixUpliftCard() {
  const current = FLOW_COMPARISON.manual.conversion;
  const target = FLOW_COMPARISON.biometric.conversion;
  const uplift = target - current;

  return (
    <Card className="bg-gradient-to-br from-violet-50 via-fuchsia-50 to-emerald-50 border-violet-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-xs font-semibold text-violet-700 uppercase">Oportunidade detectada</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Habilite <span className="text-violet-700">PIX por Biometria</span> e aumente sua conversão de <span className="line-through text-gray-500">{current}%</span> → <span className="text-emerald-700 font-bold">{target}%</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              +{uplift}pp de conversão · jornada em ~12s (vs 3min) · fraude 15x menor · sem redirect.
            </p>
            <div className="mt-3 flex gap-2">
              <Link to="/OpenFinanceHub">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1">
                  Habilitar agora <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
              <Link to="/PixBiometricInsights">
                <Button size="sm" variant="outline">Ver insights</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}