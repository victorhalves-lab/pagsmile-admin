import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { ShoppingBag } from 'lucide-react';
import TelemarketingWizard from '@/components/telemarketing/TelemarketingWizard';
import TelemarketingSummaryPanel from '@/components/telemarketing/TelemarketingSummaryPanel';
import StepCustomerIdentification from '@/components/telemarketing/steps/StepCustomerIdentification';
import StepProducts from '@/components/telemarketing/steps/StepProducts';
import StepPaymentSplit from '@/components/telemarketing/steps/StepPaymentSplit';
import StepConsentLink from '@/components/telemarketing/steps/StepConsentLink';
import StepReviewAndCharge from '@/components/telemarketing/steps/StepReviewAndCharge';

const EMPTY_SALE = {
  customer: null,
  items: [],
  payments: [],
  discount: 0,
  total: 0,
  operator_notes: '',
};

export default function TelemarketingSale() {
  const [step, setStep] = useState(1);
  const [sale, setSale] = useState(EMPTY_SALE);

  const updateSale = (patch) => setSale((s) => ({ ...s, ...patch }));

  const reset = () => {
    setSale(EMPTY_SALE);
    setStep(1);
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      <PageHeader
        title="Venda Manual"
        description="Preencha os dados do cliente, os produtos e a forma de pagamento para registrar a venda."
        icon={ShoppingBag}
      />

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
            <StepConsentLink sale={sale} updateSale={updateSale} onNext={() => setStep(5)} onBack={() => setStep(3)} />
          )}
          {step === 5 && (
            <StepReviewAndCharge sale={sale} updateSale={updateSale} onBack={() => setStep(4)} onReset={reset} />
          )}
        </div>

        <div className="lg:col-span-1">
          <TelemarketingSummaryPanel sale={sale} currentStep={step} />
        </div>
      </div>
    </div>
  );
}