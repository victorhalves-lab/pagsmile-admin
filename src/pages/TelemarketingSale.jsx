import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Phone } from 'lucide-react';
import TelemarketingWizard from '@/components/telemarketing/TelemarketingWizard';
import TelemarketingSummaryPanel from '@/components/telemarketing/TelemarketingSummaryPanel';
import CallTimerBadge from '@/components/telemarketing/CallTimerBadge';
import StepCustomerIdentification from '@/components/telemarketing/steps/StepCustomerIdentification';
import StepProducts from '@/components/telemarketing/steps/StepProducts';
import StepPaymentSplit from '@/components/telemarketing/steps/StepPaymentSplit';
import StepFraudConfirmation from '@/components/telemarketing/steps/StepFraudConfirmation';
import StepReviewAndCharge from '@/components/telemarketing/steps/StepReviewAndCharge';

const EMPTY_SALE = {
  customer: null,
  items: [],
  payments: [],
  discount: 0,
  total: 0,
  consent_recorded: false,
  fraud_checks: {},
  operator_notes: '',
  risk_score: null,
};

export default function TelemarketingSale() {
  const [step, setStep] = useState(1);
  const [sale, setSale] = useState(EMPTY_SALE);
  const [callStarted, setCallStarted] = useState(false);

  const updateSale = (patch) => setSale((s) => ({ ...s, ...patch }));

  const reset = () => {
    setSale(EMPTY_SALE);
    setStep(1);
    setCallStarted(false);
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader
          title="Venda por Telefone (MOTO)"
          description="Fluxo guiado para o time de telemarketing realizar vendas durante a ligação."
          icon={Phone}
        />
        <CallTimerBadge
          started={callStarted}
          onStart={() => setCallStarted(true)}
          onStop={() => setCallStarted(false)}
        />
      </div>

      <TelemarketingWizard current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {step === 1 && (
            <StepCustomerIdentification sale={sale} updateSale={updateSale} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepProducts sale={sale} updateSale={updateSale} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <StepPaymentSplit sale={sale} updateSale={updateSale} onNext={() => setStep(4)} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <StepFraudConfirmation sale={sale} updateSale={updateSale} onNext={() => setStep(5)} onBack={() => setStep(3)} />
          )}
          {step === 5 && (
            <StepReviewAndCharge sale={sale} onBack={() => setStep(4)} onReset={reset} />
          )}
        </div>

        <div className="lg:col-span-1">
          <TelemarketingSummaryPanel sale={sale} currentStep={step} />
        </div>
      </div>
    </div>
  );
}