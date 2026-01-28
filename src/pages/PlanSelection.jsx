import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PlanCard from '@/components/onboarding/PlanCard';
import { getLogoUrlByTheme } from '@/components/utils/branding';

export default function PlanSelection() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Para quem está começando',
      mdr1x: '3.99%',
      mdr2_6x: '4.49%',
      mdr7_12x: '5.49%',
      pixRate: '0.79%',
      anticipationTerm: 'D+30',
      anticipationFee: 'R$ 0,20',
      anticipationRate: '1,99%',
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Para negócios em expansão',
      mdr1x: '4.09%',
      mdr2_6x: '4.69%',
      mdr7_12x: '5.49%',
      pixRate: '0.79%',
      anticipationTerm: 'D+15',
      anticipationFee: 'R$ 0,20',
      anticipationRate: '2,39%',
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Solução completa',
      mdr1x: '3.99%',
      mdr2_6x: '4.49%',
      mdr7_12x: '5.49%',
      pixRate: '0.79%',
      anticipationTerm: 'D+7',
      anticipationFee: 'R$ 0,20',
      anticipationRate: '2,59%',
    },
    {
      id: 'instant',
      name: 'Instant (D+1)',
      description: 'Liquidez máxima',
      mdr1x: '3.59%',
      mdr2_6x: '4.19%',
      mdr7_12x: '4.79%',
      pixRate: '0.79%',
      anticipationTerm: 'D+1',
      anticipationFee: 'R$ 0,20',
      anticipationRate: '2,89%',
    },
  ];

  const handleContinue = () => {
    if (selectedPlan) {
      localStorage.setItem('selected_plan', selectedPlan);
      navigate(createPageUrl('AccountCreationStep3'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-6 px-4 pb-32 md:pb-8 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-6 hover:opacity-80 transition-opacity">
            <img
              src={getLogoUrlByTheme('light')}
              alt="PagSmile Logo"
              className="h-12"
            />
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Escolha seu Plano</h1>
          <p className="text-lg text-slate-500 font-medium">Etapa 2 de 3 - Selecione o plano ideal para seu negócio</p>
          
          {/* Enhanced Progress Bar */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#2bc196] border-2 border-[#2bc196]" />
               <div className="w-24 h-1.5 rounded-full bg-[#2bc196]" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#2bc196] z-10 relative shadow-[0_0_10px_rgba(0,194,149,0.4)]" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#2bc196]" />
              </div>
              <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#2bc196] to-emerald-500 shadow-sm" />
            </div>
            
            <div className="flex flex-col items-center gap-2 opacity-30">
               <div className="w-3 h-3 rounded-full bg-slate-200 border-2 border-slate-300" />
               <div className="w-24 h-1.5 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-lg mx-auto fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-20 md:static md:bg-transparent md:border-0 md:p-0">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('AccountCreationStep1')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!selectedPlan}
            size="lg"
            className="bg-[#2bc196] hover:bg-[#239b7a] text-white shadow-lg shadow-[#2bc196]/20 hover:shadow-[#2bc196]/40 px-10 rounded-full font-bold transition-all transform hover:-translate-y-0.5"
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}