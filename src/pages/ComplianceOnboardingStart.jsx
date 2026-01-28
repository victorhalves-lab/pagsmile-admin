import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, QrCode, CreditCard, Wallet } from 'lucide-react';
import CardSelectionItem from '@/components/ui/card-selection-item';
import { getLogoUrlByTheme } from '@/components/utils/branding';

export default function ComplianceOnboardingStart() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { 
      id: 'pix', 
      title: 'Somente PIX', 
      icon: QrCode, 
      description: 'Transações rápidas e de baixo custo',
      details: 'Processo simplificado de compliance'
    },
    { 
      id: 'card', 
      title: 'Somente Cartão', 
      icon: CreditCard, 
      description: 'Aceite as principais bandeiras',
      details: 'Requer compliance completo (KYC/KYB)'
    },
    { 
      id: 'both', 
      title: 'PIX + Cartão', 
      icon: Wallet, 
      description: 'Solução completa para vendas',
      details: 'Requer compliance completo (KYC/KYB)'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <img
            src={getLogoUrlByTheme('light')}
            alt="PagSmile Logo"
            className="h-10 mx-auto mb-6"
          />
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Complete seu Compliance</h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">Para começarmos, escolha a modalidade de pagamento que melhor se adapta ao seu modelo de negócio.</p>
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

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('Dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
            </Link>
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!selectedMethod}
            className="bg-[#2bc196] hover:bg-[#239b7a]"
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}