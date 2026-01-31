import React from 'react';
import SimulatedOnboardingChat from '@/components/common/SimulatedOnboardingChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Zap, Clock, Target } from 'lucide-react';

export default function OnboardingAgentChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const questionnaireType = urlParams.get('type') || 'kyc_full';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Identity Onboarder</h1>
          </div>
          <p className="text-slate-600">Cadastro inteligente e automatizado - KYC/KYB em 15-30 minutos</p>
          
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              15-30min
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Target className="w-3 h-3" />
              85% conclusão
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Zap className="w-3 h-3" />
              99.9% precisão
            </Badge>
          </div>
        </div>

        {/* Main Chat Interface */}
        <Card className="h-[700px]">
          <SimulatedOnboardingChat questionnaireType={questionnaireType} />
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Segurança Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                Validação em tempo real com OCR, APIs governamentais, bureaus de crédito e listas PEP/sanctions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                Aprovação Instantânea
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                70% dos casos aprovados automaticamente. Score de risco calculado em tempo real com IA
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Experiência Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                NPS superior a 80 pontos. Interface conversacional sem formulários complexos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}