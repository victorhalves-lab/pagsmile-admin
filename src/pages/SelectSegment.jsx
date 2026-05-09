import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Sparkles, CreditCard, Zap, Wallet } from 'lucide-react';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import StepProgressEnhanced from '@/components/onboarding/v2/StepProgressEnhanced';
import BusinessSegmentSelector from '@/components/onboarding/v2/BusinessSegmentSelector';

/**
 * Etapa de seleção de segmento de negócio.
 * Vem entre AccountCreationStep1 e PlanSelection.
 *
 * O segmento é gravado em localStorage('onboarding_segment') e usado depois para:
 *  - Carregar o questionário de compliance correto (ComplianceFullKYC dinâmico)
 *  - Definir o score base do V4
 *  - Selecionar documentos condicionais
 */
export default function SelectSegment() {
  const navigate = useNavigate();
  const [segment, setSegment] = useState(localStorage.getItem('onboarding_segment') || '');

  const handleNext = () => {
    if (!segment) return;
    localStorage.setItem('onboarding_segment', segment);
    navigate(createPageUrl('PlanSelection'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-4 pb-32">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <Card className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#003459]/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2 pt-4">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-2 hover:opacity-80 transition-opacity">
            <img src={getLogoUrlByTheme('light')} alt="PagSmile Logo" className="h-8" />
          </Link>
          <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Qual o segmento do seu negócio?
          </CardTitle>
          <CardDescription className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Personalizamos o cadastro, as taxas e o questionário de compliance conforme o seu segmento.
          </CardDescription>

          <div className="mt-6">
            <StepProgressEnhanced currentStep={2} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2 px-6 sm:px-10">
          {/* Disclaimer: tudo já vem incluso */}
          <div className="bg-gradient-to-r from-[#2bc196]/10 to-emerald-50 border border-[#2bc196]/20 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#2bc196] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm text-emerald-900">Sua conta já vem completa</p>
              <p className="text-xs text-emerald-800 mt-1">
                Independente do segmento escolhido, você terá acesso a:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-xs font-semibold text-emerald-700">
                  <CreditCard className="w-3 h-3" /> Cartão de Crédito/Débito
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-xs font-semibold text-emerald-700">
                  <Zap className="w-3 h-3" /> PIX
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-emerald-200 text-xs font-semibold text-emerald-700">
                  <Wallet className="w-3 h-3" /> Conta bancária
                </span>
              </div>
            </div>
          </div>

          <BusinessSegmentSelector value={segment} onChange={setSegment} />

          <p className="text-xs text-center text-slate-400">
            Você poderá ajustar o segmento depois nas configurações da conta.
          </p>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button variant="ghost" className="text-slate-500" asChild>
            <Link to={createPageUrl('AccountCreationStep1')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={!segment}
            className="bg-[#2bc196] hover:bg-[#239b7a] text-white font-bold px-10 rounded-full shadow-lg shadow-[#2bc196]/20 hover:shadow-[#2bc196]/40 transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}