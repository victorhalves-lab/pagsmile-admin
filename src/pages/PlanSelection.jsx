import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import PlanCardFull from '@/components/onboarding/PlanCardFull';
import PlanInstallmentSimulator from '@/components/admin-interno/plans/PlanInstallmentSimulator';
import { PLAN_TEMPLATES } from '@/components/admin-interno/plans/planSchema';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function PlanSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [simulatorPlan, setSimulatorPlan] = useState(null);

  // Catálogo público — usa o mesmo schema completo do admin interno
  const plans = [
    { id: 'starter', ...PLAN_TEMPLATES.starter },
    { id: 'growth', ...PLAN_TEMPLATES.growth },
    { id: 'pro', ...PLAN_TEMPLATES.pro },
    {
      id: 'instant',
      ...PLAN_TEMPLATES.pro,
      name: 'Instant (D+1)',
      description: 'Liquidez máxima',
      anticipation: { ...PLAN_TEMPLATES.pro.anticipation, settlement_term: 'D+1', rate_monthly: 2.89 },
      card: { ...PLAN_TEMPLATES.pro.card, mdr_1x: 3.59, mdr_2_6x: 4.19, mdr_7_12x: 4.79 },
    },
  ];

  const handleContinue = () => {
    if (selectedPlan) {
      localStorage.setItem('selected_plan', selectedPlan);
      navigate(createPageUrl('AccountCreationStep3'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 py-6 px-4 pb-32 md:pb-8 relative">
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-6 hover:opacity-80 transition-opacity">
            <img src={getLogoUrlByTheme('light')} alt="PagSmile Logo" className="h-12" />
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('onboarding.choose_plan')}</h1>
          <p className="text-base text-slate-500 font-medium max-w-xl mx-auto">
            Transparência total — veja todos os custos do plano antes de escolher
          </p>

          {/* Progress */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2bc196]" />
              <div className="w-20 h-1 rounded-full bg-[#2bc196]" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#2bc196] shadow-[0_0_10px_rgba(43,193,150,0.4)]" />
              <div className="w-20 h-1 rounded-full bg-[#2bc196]/40" />
            </div>
            <div className="flex flex-col items-center gap-1.5 opacity-30">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <div className="w-20 h-1 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {plans.map((plan) => (
            <PlanCardFull
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={setSelectedPlan}
              onOpenSimulator={(p) => setSimulatorPlan(p)}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-2xl mx-auto fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 z-20 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('AccountCreationStep1')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.back')}
            </Link>
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan}
            size="lg"
            className="bg-[#2bc196] hover:bg-[#239b7a] text-white shadow-lg shadow-[#2bc196]/30 hover:shadow-[#2bc196]/50 px-10 rounded-full font-bold transition-all transform hover:-translate-y-0.5"
          >
            {t('onboarding.continue')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Simulator Modal */}
      <Dialog open={!!simulatorPlan} onOpenChange={(o) => !o && setSimulatorPlan(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Simulador — Plano {simulatorPlan?.name}</DialogTitle>
          </DialogHeader>
          {simulatorPlan && <PlanInstallmentSimulator plan={simulatorPlan} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}