import React, { useState, useEffect } from 'react';
import AgentChatInterface from './AgentChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Upload, AlertCircle, Clock } from 'lucide-react';

export default function SimulatedOnboardingChat({ questionnaireType = "kyc_full" }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Olá! Sou o assistente de cadastro da PagSmile. Vou te ajudar a liberar sua conta o mais rápido possível. Vamos começar?\n\nPara ${questionnaireType === 'kyc_full' ? 'uma análise completa' : 'cadastro PIX simplificado'}, vou precisar de alguns dados e documentos. Deve levar apenas 15-30 minutos.`,
      timestamp: new Date().toISOString()
    }
  ]);

  const steps = {
    kyc_full: [
      { id: 'cnpj', label: 'CNPJ', status: 'pending' },
      { id: 'docs_empresa', label: 'Docs Empresa', status: 'pending' },
      { id: 'docs_socios', label: 'Docs Sócios', status: 'pending' },
      { id: 'validacao_externa', label: 'Validação Externa', status: 'pending' },
      { id: 'analise_risco', label: 'Análise de Risco', status: 'pending' },
      { id: 'decisao', label: 'Decisão', status: 'pending' }
    ],
    kyc_pix: [
      { id: 'cnpj', label: 'CNPJ', status: 'pending' },
      { id: 'docs_basicos', label: 'Docs Básicos', status: 'pending' },
      { id: 'validacao', label: 'Validação', status: 'pending' },
      { id: 'decisao', label: 'Decisão', status: 'pending' }
    ]
  };

  const [stepsStatus, setStepsStatus] = useState(steps[questionnaireType] || steps.kyc_full);

  const simulatedResponses = {
    "12345678000100": {
      role: 'assistant',
      content: `CNPJ validado ✅\n\n**Empresa**: TechStore Comércio de Eletrônicos Ltda\n**Situação**: Ativa\n**CNAE**: 4751-2/01 - Comércio varejista especializado de equipamentos e suprimentos de informática\n\nPerfeito! Agora vou precisar dos seguintes documentos:\n\n1. Contrato Social ou Última Alteração Contratual\n2. RG ou CNH dos sócios\n3. Comprovante de Endereço da empresa (últimos 90 dias)`,
      richContent: (
        <div className="space-y-2 mt-2">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Upload Contrato Social
          </Button>
        </div>
      ),
      timestamp: new Date().toISOString()
    }
  };

  const handleMessage = (text) => {
    // Simular respostas baseadas no input
    if (/^\d{14}$/.test(text.replace(/\D/g, ''))) {
      // É um CNPJ
      const updatedSteps = [...stepsStatus];
      updatedSteps[0].status = 'completed';
      setStepsStatus(updatedSteps);
      return simulatedResponses["12345678000100"];
    }

    return {
      role: 'assistant',
      content: `Entendi! Você disse: "${text}". Continue com o processo de onboarding.`,
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Progress Sidebar */}
      <Card className="lg:w-64 p-4">
        <h3 className="font-semibold mb-4 text-sm">Progresso do Cadastro</h3>
        <div className="space-y-3">
          {stepsStatus.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                step.status === 'completed' && "bg-green-500 text-white",
                step.status === 'pending' && "bg-slate-200 text-slate-500",
                step.status === 'processing' && "bg-blue-500 text-white animate-pulse"
              )}>
                {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-xs font-medium",
                  step.status === 'completed' && "text-green-700",
                  step.status === 'pending' && "text-slate-500",
                  step.status === 'processing' && "text-blue-700"
                )}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Estimated Time */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4" />
            <span>Tempo estimado: 15-30min</span>
          </div>
        </div>
      </Card>

      {/* Chat Interface */}
      <div className="flex-1">
        <AgentChatInterface
          agentName="Identity Onboarder"
          initialMessages={messages}
          onSendMessage={handleMessage}
          placeholder="Digite aqui (ex: seu CNPJ)..."
          quickPrompts={[
            "Iniciar cadastro",
            "12.345.678/0001-00 (exemplo de CNPJ)",
            "Preciso de ajuda com os documentos"
          ]}
        />
      </div>
    </div>
  );
}