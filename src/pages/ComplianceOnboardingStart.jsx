import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, QrCode, CreditCard, Wallet } from 'lucide-react';
import CardSelectionItem from '@/components/ui/card-selection-item';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import StepProgressEnhanced from '@/components/onboarding/v2/StepProgressEnhanced';
import ComplianceAiSuggestion from '@/components/onboarding/v2/ComplianceAiSuggestion';
import HelpFloater from '@/components/onboarding/v2/HelpFloater';

export default function ComplianceOnboardingStart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const aiRecommendation = 'both';

  const paymentMethods = [
    { 
      id: 'pix', 
      title: t('onboarding.pix_only'), 
      icon: QrCode, 
      description: t('onboarding.pix_only_desc'),
      details: 'KYC simplificado · ~5 min · Taxa 0.99% · Sem chargeback'
    },
    { 
      id: 'card', 
      title: t('onboarding.card_only'), 
      icon: CreditCard, 
      description: t('onboarding.card_only_desc'),
      details: 'KYC pleno · 15-30 min · Taxa 2.99% à vista · Permite parcelar'
    },
    { 
      id: 'both', 
      title: t('onboarding.pix_card'), 
      icon: Wallet, 
      description: t('onboarding.pix_card_desc'),
      details: 'KYC pleno · 15-25 min · Taxas combinadas · Maximiza conversão'
    },
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      localStorage.setItem('payment_method_type', selectedMethod);
      if (selectedMethod === 'pix') {
        navigate(createPageUrl('CompliancePixOnly'));
      } else {
        navigate(createPageUrl('ComplianceFullKYC'));
      }
    }
  };

  const handleAcceptAi = () => {
    setSelectedMethod(aiRecommendation);
    localStorage.setItem('payment_method_type', aiRecommendation);
    navigate(createPageUrl('ComplianceFullKYC'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 relative">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={getLogoUrlByTheme('light')}
            alt="PagSmile Logo"
            className="h-10 mx-auto mb-6"
          />
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{t('onboarding.complete_compliance')}</h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">{t('onboarding.compliance_intro')}</p>
        </div>

        {/* Step progress */}
        <div className="mb-8">
          <StepProgressEnhanced currentStep={4} />
        </div>

        {/* AI Suggestion or Manual Options */}
        {!showOptions ? (
          <div className="mb-8">
            <ComplianceAiSuggestion
              recommendation={aiRecommendation}
              onAccept={handleAcceptAi}
              onSeeOptions={() => setShowOptions(true)}
            />
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <button 
                onClick={() => setShowOptions(false)}
                className="text-xs text-[#2bc196] hover:underline font-medium"
              >
                ← Voltar para recomendação da IA
              </button>
            </div>
            {/* Payment Methods */}
            <div className="grid gap-4 mb-10">
              {paymentMethods.map((method) => (
                <CardSelectionItem
                  key={method.id}
                  icon={method.icon}
                  title={method.title}
                  description={method.description}
                  details={method.details}
                  isSelected={selectedMethod === method.id}
                  onClick={() => setSelectedMethod(method.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Navigation */}
        {showOptions && (
          <div className="flex justify-between items-center">
            <Button variant="ghost" asChild>
              <Link to={createPageUrl('Dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.back_to_dashboard')}
              </Link>
            </Button>
            <Button 
              onClick={handleContinue} 
              disabled={!selectedMethod}
              className="bg-[#2bc196] hover:bg-[#239b7a]"
            >
              {t('onboarding.continue')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <HelpFloater />
    </div>
  );
}