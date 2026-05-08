import React from 'react';
import SimulatedOnboardingChat from '@/components/common/SimulatedOnboardingChat';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Zap, Clock, Target, Sparkles } from 'lucide-react';
import KycChecklistSidebar from '@/components/onboarding/v2/KycChecklistSidebar';
import AgentTransparencyBanner from '@/components/onboarding/v2/AgentTransparencyBanner';
import LiveKpiBadges from '@/components/onboarding/v2/LiveKpiBadges';
import HelpFloater from '@/components/onboarding/v2/HelpFloater';

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
            <Badge className="bg-gradient-to-r from-[#2bc196] to-emerald-500 text-white gap-1 ml-2">
              <Sparkles className="w-3 h-3" />
              Caminho recomendado
            </Badge>
          </div>
          <p className="text-slate-600">Cadastro inteligente e automatizado - KYC/KYB em 15-30 minutos</p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              15-30min em média
            </Badge>
            <Badge variant="outline" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
              <Target className="w-3 h-3" />
              72% auto-aprovação
            </Badge>
            <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
              <Zap className="w-3 h-3" />
              99.9% precisão
            </Badge>
          </div>
        </div>

        {/* Agent transparency banner */}
        <AgentTransparencyBanner />

        {/* Main Chat Interface + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <Card className="h-[700px]">
            <SimulatedOnboardingChat questionnaireType={questionnaireType} />
          </Card>
          <div className="hidden lg:block">
            <KycChecklistSidebar />
          </div>
        </div>

        {/* Live KPIs (substitui marketing copy genérico) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Em tempo real na PagSmile</h3>
            <span className="text-[10px] text-slate-400">
              Atualizado há 2 minutos
            </span>
          </div>
          <LiveKpiBadges />
        </div>
      </div>
      <HelpFloater />
    </div>
  );
}