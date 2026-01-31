import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LimitAnalysisSimulator from './LimitAnalysisSimulator';
import AgentChatInterface from '@/components/common/AgentChatInterface';
import { TrendingUp, Building2, Globe, Repeat, BarChart3 } from 'lucide-react';

export default function SpecialAnalysisHub() {
  const [analysisType, setAnalysisType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const analysisTypes = [
    {
      id: 'limit',
      title: 'Aumento de Limite',
      description: 'Análise multidimensional para solicitações de limite',
      icon: TrendingUp,
      color: 'blue',
      metrics: { time: '5min', automation: '80%' }
    },
    {
      id: 'model_change',
      title: 'Mudança de Modelo',
      description: 'Análise para E-commerce → Marketplace, B2C → B2B, etc.',
      icon: Building2,
      color: 'purple',
      metrics: { time: '20min', automation: '60%' }
    },
    {
      id: 'international',
      title: 'Expansão Internacional',
      description: 'Compliance FATCA, CRS e legislação local',
      icon: Globe,
      color: 'green',
      metrics: { time: '30min', automation: '50%' }
    },
    {
      id: 'subscription',
      title: 'Modelo de Assinatura',
      description: 'Regras de recurring, cancelamento, trials',
      icon: Repeat,
      color: 'amber',
      metrics: { time: '15min', automation: '70%' }
    }
  ];

  const handleOpenAnalysis = (type) => {
    setAnalysisType(type);
    setModalOpen(true);
  };

  const renderAnalysisContent = () => {
    if (analysisType?.id === 'limit') {
      return (
        <LimitAnalysisSimulator
          merchant={{ name: 'TechStore Ltda' }}
          currentLimit={100000}
          requestedLimit={500000}
        />
      );
    }

    if (analysisType?.id === 'model_change') {
      const handleModelChangeMessage = (text) => {
        return {
          role: 'assistant',
          content: `Entendi que vocês vão começar a ter outros vendedores na plataforma (E-commerce → Marketplace). Isso é uma mudança importante!\n\nPreciso entender algumas coisas:\n\n1. **Modelo de split**: Como será a divisão de pagamentos?\n2. **KYC dos subvendedores**: Vocês vão validar ou nós?\n3. **Responsabilidade**: Quem responde por chargebacks?\n4. **Volume esperado**: Quantos sellers inicialmente?\n\nBaseado nisso, posso precisar de:\n• Atualização do contrato social (se houver)\n• Política de KYC para seus vendedores\n• Termos de uso do marketplace\n• Segregação de contas para split payment`,
          timestamp: new Date().toISOString()
        };
      };

      return (
        <AgentChatInterface
          agentName="Identity Onboarder"
          onSendMessage={handleModelChangeMessage}
          placeholder="Descreva a mudança de modelo..."
          quickPrompts={["Vamos virar marketplace", "Mudança de B2C para B2B"]}
          accentColor="purple"
        />
      );
    }

    return (
      <div className="text-center py-12 text-slate-500">
        Simulador para {analysisType?.title} em desenvolvimento
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysisTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className="hover:shadow-lg transition-all cursor-pointer border-2"
              onClick={() => handleOpenAnalysis(type)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-${type.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${type.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{type.title}</CardTitle>
                      <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{type.metrics.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{type.metrics.automation} automação</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-5xl h-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {analysisType && React.createElement(analysisType.icon, { className: "w-5 h-5" })}
              Análise Especial: {analysisType?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {renderAnalysisContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}