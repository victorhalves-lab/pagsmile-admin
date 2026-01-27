import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { QrCode, CreditCard, Wallet, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ComplianceOnboardingStart() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { 
      id: 'pix', 
      name: 'Somente PIX', 
      icon: QrCode, 
      description: 'Transações rápidas e de baixo custo',
      details: 'Processo simplificado de compliance'
    },
    { 
      id: 'card', 
      name: 'Somente Cartão', 
      icon: CreditCard, 
      description: 'Aceite as principais bandeiras',
      details: 'Requer compliance completo (KYC/KYB)'
    },
    { 
      id: 'both', 
      name: 'PIX + Cartão', 
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
          <div className="w-12 h-12 rounded-xl bg-[#00D26A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete seu Compliance</h1>
          <p className="text-gray-500">Escolha a modalidade de pagamento que deseja utilizar</p>
        </div>

        {/* Payment Methods */}
        <div className="grid gap-4 mb-8">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <Card 
                key={method.id}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  isSelected 
                    ? "border-2 border-[#00D26A] shadow-lg shadow-[#00D26A]/10 bg-[#00D26A]/5" 
                    : "border border-gray-200 hover:border-gray-300 hover:shadow-md"
                )}
                onClick={() => setSelectedMethod(method.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                      isSelected ? "bg-[#00D26A] text-white" : "bg-gray-100 text-gray-500"
                    )}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
                      <p className="text-gray-500">{method.description}</p>
                      <p className="text-sm text-gray-400 mt-1">{method.details}</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected 
                        ? "border-[#00D26A] bg-[#00D26A]" 
                        : "border-gray-300"
                    )}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
            className="bg-[#00D26A] hover:bg-[#00A854]"
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}