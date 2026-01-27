import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PlanCard from '@/components/onboarding/PlanCard';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00D26A] flex items-center justify-center">
              <span className="text-white font-bold text-lg">PS</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Escolha seu Plano</h1>
          <p className="text-gray-500">Etapa 2 de 3 - Selecione o plano ideal para seu negócio</p>
          <div className="flex gap-2 justify-center mt-4">
            <div className="w-20 h-1.5 rounded-full bg-[#00D26A]"></div>
            <div className="w-20 h-1.5 rounded-full bg-[#00D26A]"></div>
            <div className="w-20 h-1.5 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('AccountCreationStep1')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!selectedPlan}
            className="bg-[#00D26A] hover:bg-[#00A854]"
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}