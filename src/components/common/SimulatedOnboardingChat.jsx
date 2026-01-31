import React, { useState, useEffect } from 'react';
import AgentChatInterface from './AgentChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Upload, AlertCircle, Clock, FileText, Users, Building2, Scale, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SimulatedOnboardingChat({ questionnaireType = "kyc_full" }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [documentsCollected, setDocumentsCollected] = useState({});
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Olá! Sou o assistente de cadastro da PagSmile. Vou te ajudar a liberar sua conta o mais rápido possível. Vamos começar?\n\nPara ${questionnaireType === 'kyc_full' ? 'uma análise completa (PIX + Cartão)' : 'cadastro PIX simplificado'}, vou precisar de alguns dados e documentos. Deve levar apenas 15-30 minutos.\n\n**Etapas do processo:**\n${questionnaireType === 'kyc_full' ? '1. Identificação da empresa\n2. Tipo e estrutura empresarial\n3. Endereço e localização\n4. Atividade econômica (CNAE/MCC)\n5. Volumetria esperada\n6. Perfil de clientes\n7. Responsáveis e contatos\n8. UBO (Beneficiários Finais)\n9. Sócios e participação\n10. Licenciamento específico\n11. Configurações de Marketplace (se aplicável)\n12. Segurança de Cartão\n13. PLD - Sanções e PEP\n14. PLD - Riscos\n15. PLD - Operação\n16. Confirmação final' : '1. Identificação\n2. Documentação básica\n3. Validação\n4. Aprovação'}`,
      timestamp: new Date().toISOString()
    }
  ]);

  const complianceSteps = {
    kyc_full: [
      { id: 'identificacao', label: 'Identificação', icon: Building2, status: 'pending', description: 'CNPJ, Razão Social, Nome Fantasia' },
      { id: 'tipo_empresa', label: 'Tipo Empresa', icon: FileText, status: 'pending', description: 'Porte, Natureza Jurídica' },
      { id: 'endereco', label: 'Endereço', icon: Building2, status: 'pending', description: 'Sede, Filiais' },
      { id: 'atividade', label: 'Atividade', icon: Scale, status: 'pending', description: 'CNAE/MCC, Produtos' },
      { id: 'volumetria', label: 'Volumetria', icon: FileText, status: 'pending', description: 'Faturamento, Ticket Médio' },
      { id: 'perfil_clientes', label: 'Perfil Clientes', icon: Users, status: 'pending', description: 'B2B/B2C, Segmentação' },
      { id: 'responsaveis', label: 'Responsáveis', icon: Users, status: 'pending', description: 'Contatos, Autorizados' },
      { id: 'ubo', label: 'UBO', icon: Users, status: 'pending', description: 'Beneficiários Finais' },
      { id: 'socios', label: 'Sócios', icon: Users, status: 'pending', description: 'Participação Societária' },
      { id: 'licenciamento', label: 'Licenciamento', icon: Shield, status: 'pending', description: 'Licenças Específicas' },
      { id: 'marketplace', label: 'Marketplace', icon: Building2, status: 'pending', description: 'Split, SubSellers' },
      { id: 'seguranca_cartao', label: 'Segurança Cartão', icon: Shield, status: 'pending', description: '3DS, Antifraude' },
      { id: 'pld_sancoes', label: 'PLD - Sanções', icon: Shield, status: 'pending', description: 'PEP, Listas Restritivas' },
      { id: 'pld_riscos', label: 'PLD - Riscos', icon: Shield, status: 'pending', description: 'Análise de Risco' },
      { id: 'pld_operacao', label: 'PLD - Operação', icon: Shield, status: 'pending', description: 'Políticas PLD/FT' },
      { id: 'confirmacao', label: 'Confirmação', icon: CheckCircle2, status: 'pending', description: 'Revisão Final' },
      { id: 'docs_validacao', label: 'Validação Docs', icon: FileText, status: 'pending', description: 'OCR, Autenticidade' },
      { id: 'validacao_externa', label: 'Validação Externa', icon: Shield, status: 'pending', description: 'Receita, Bureaus, PEP' },
      { id: 'analise_risco', label: 'Análise de Risco', icon: Shield, status: 'pending', description: 'Score ML, Decisão' },
      { id: 'decisao_final', label: 'Decisão Final', icon: CheckCircle2, status: 'pending', description: 'Aprovação/Pendência' }
    ],
    kyc_pix: [
      { id: 'identificacao', label: 'Identificação', icon: Building2, status: 'pending', description: 'CNPJ Básico' },
      { id: 'docs_basicos', label: 'Docs Básicos', icon: FileText, status: 'pending', description: 'Contrato, RG Sócios' },
      { id: 'validacao', label: 'Validação', icon: Shield, status: 'pending', description: 'APIs Externas' },
      { id: 'decisao', label: 'Decisão', icon: CheckCircle2, status: 'pending', description: 'Aprovação Rápida' }
    ]
  };

  const [stepsStatus, setStepsStatus] = useState(complianceSteps[questionnaireType] || complianceSteps.kyc_full);

  const documentRequirements = {
    kyc_full: {
      empresa: [
        { id: 'contrato_social', name: 'Contrato Social ou Última Alteração Contratual', required: true },
        { id: 'comprovante_endereco', name: 'Comprovante de Endereço (últimos 90 dias)', required: true },
        { id: 'alvara', name: 'Alvará de Funcionamento', required: false },
        { id: 'licencas', name: 'Licenças Específicas (se aplicável)', required: false }
      ],
      socios: [
        { id: 'rg_cnh', name: 'RG ou CNH de cada sócio', required: true },
        { id: 'cpf', name: 'CPF dos sócios', required: true },
        { id: 'comprovante_residencia', name: 'Comprovante de Residência dos sócios', required: true }
      ],
      financeiros: [
        { id: 'extrato_bancario', name: 'Extrato Bancário (3 meses)', required: false },
        { id: 'dre', name: 'DRE (se disponível)', required: false }
      ]
    }
  };

  const handleMessage = (text) => {
    const textLower = text.toLowerCase();
    
    // CNPJ validation
    if (/^\d{14}$/.test(text.replace(/\D/g, ''))) {
      const updatedSteps = [...stepsStatus];
      updatedSteps[0].status = 'completed';
      if (updatedSteps[1]) updatedSteps[1].status = 'processing';
      setStepsStatus(updatedSteps);
      
      setTimeout(() => {
        const steps2 = [...stepsStatus];
        steps2[0].status = 'completed';
        steps2[1].status = 'completed';
        if (steps2[2]) steps2[2].status = 'processing';
        setStepsStatus(steps2);
      }, 2000);

      return {
        role: 'assistant',
        content: `CNPJ validado ✅\n\n**Empresa**: TechStore Comércio de Eletrônicos Ltda\n**Situação**: Ativa ✅\n**Abertura**: 15/03/2020\n**CNAE**: 4751-2/01 - Comércio varejista de equipamentos de informática\n**Porte**: ME - Microempresa\n**Sócios identificados**: João Silva (60%), Maria Santos (40%)\n\n---\n\n**Etapa 2: Tipo de Empresa** ✅ _Detectado automaticamente: LTDA, Microempresa_\n\n**Etapa 3: Endereço**\nConfirma o endereço registrado?\n📍 Rua Augusta, 1234 - Consolação, São Paulo/SP - CEP 01304-001`,
        richContent: (
          <div className="space-y-2 mt-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              ✅ Sim, está correto
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              📝 Endereço mudou recentemente
            </Button>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    // Confirmar endereço
    if (textLower.includes('sim') || textLower.includes('correto') || textLower.includes('confirmo')) {
      const updatedSteps = [...stepsStatus];
      if (updatedSteps[2]) updatedSteps[2].status = 'completed';
      if (updatedSteps[3]) updatedSteps[3].status = 'processing';
      setStepsStatus(updatedSteps);

      return {
        role: 'assistant',
        content: `Endereço confirmado ✅\n\n**Etapa 4: Atividade Econômica**\nVejo que vocês são comércio de eletrônicos. Me ajuda a entender melhor:\n\n1. Qual o principal canal de vendas?\n2. Vocês vendem produtos físicos ou digitais (ou ambos)?\n3. Trabalham com marketplace ou apenas loja própria?`,
        richContent: (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button variant="outline" size="sm">E-commerce próprio</Button>
            <Button variant="outline" size="sm">Marketplace</Button>
            <Button variant="outline" size="sm">Loja física + online</Button>
            <Button variant="outline" size="sm">B2B</Button>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    // E-commerce próprio
    if (textLower.includes('e-commerce') || textLower.includes('ecommerce') || textLower.includes('loja online')) {
      const updatedSteps = [...stepsStatus];
      if (updatedSteps[3]) updatedSteps[3].status = 'completed';
      if (updatedSteps[4]) updatedSteps[4].status = 'processing';
      setStepsStatus(updatedSteps);

      return {
        role: 'assistant',
        content: `E-commerce próprio identificado ✅\n\n**Etapa 5: Volumetria e Faturamento**\nPara calibrar seus limites e condições:\n\n1. **Faturamento mensal médio**: Qual a expectativa?\n2. **Ticket médio**: Valor médio por transação?\n3. **Volume de transações**: Quantas vendas por mês?\n\nExemplo de resposta: "Faturamos cerca de R$ 50k/mês, ticket médio de R$ 150, umas 300 vendas/mês"`,
        richContent: (
          <div className="space-y-2 mt-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">💡 <strong>Dica:</strong> Seja realista! Isso nos ajuda a configurar limites adequados e evitar bloqueios futuros.</p>
            </div>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    // Volumetria
    if (textLower.includes('50k') || textLower.includes('faturamento') || textLower.includes('150')) {
      const updatedSteps = [...stepsStatus];
      if (updatedSteps[4]) updatedSteps[4].status = 'completed';
      if (updatedSteps[5]) updatedSteps[5].status = 'processing';
      setStepsStatus(updatedSteps);

      return {
        role: 'assistant',
        content: `Volumetria registrada ✅\n\n📊 **Faturamento**: R$ 50k/mês\n💰 **Ticket médio**: R$ 150\n📦 **Transações**: ~300/mês\n\nBaseado nisso:\n• **Limite inicial sugerido**: R$ 75k/mês\n• **Limite por transação**: R$ 5k\n• **Perfil de risco**: Baixo-Médio\n\n**Etapa 6: Perfil de Clientes**\nQuem são seus clientes principais?\n\n1. B2C (pessoa física) ou B2B (empresas)?\n2. Qual região geográfica (Nacional? SP? Sudeste?)?\n3. Faixa etária predominante (se B2C)?`,
        richContent: (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button variant="outline" size="sm">B2C - Pessoa Física</Button>
            <Button variant="outline" size="sm">B2B - Empresas</Button>
            <Button variant="outline" size="sm">Misto B2C + B2B</Button>
            <Button variant="outline" size="sm">Nacional</Button>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    // Perfil clientes
    if (textLower.includes('b2c') || textLower.includes('pessoa física')) {
      const updatedSteps = [...stepsStatus];
      if (updatedSteps[5]) updatedSteps[5].status = 'completed';
      if (updatedSteps[6]) updatedSteps[6].status = 'processing';
      setStepsStatus(updatedSteps);

      return {
        role: 'assistant',
        content: `Perfil B2C confirmado ✅\n\n**Etapa 7: Responsáveis e Contatos**\nPreciso dos contatos principais:\n\n1. **Responsável Financeiro**: Nome, Email, Telefone\n2. **Responsável Técnico** (para integração): Nome, Email\n3. **Responsável Legal/Compliance**: Nome, Email\n\nPode informar ao menos o financeiro para continuarmos?`,
        richContent: (
          <div className="space-y-2 mt-3">
            <div className="p-2 bg-slate-50 rounded text-xs">
              <strong>Exemplo:</strong><br/>
              João Silva - financeiro@techstore.com - (11) 98765-4321
            </div>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    // Responsáveis
    if (textLower.includes('@') && (textLower.includes('financeiro') || textLower.includes('joao') || textLower.includes('maria'))) {
      const updatedSteps = [...stepsStatus];
      if (updatedSteps[6]) updatedSteps[6].status = 'completed';
      if (updatedSteps[7]) updatedSteps[7].status = 'processing';
      setStepsStatus(updatedSteps);

      return {
        role: 'assistant',
        content: `Responsável Financeiro registrado ✅\n\n**Etapa 8: UBO - Beneficiários Finais**\nIdentifiquei 2 sócios no QSA:\n• João Silva (60%)\n• Maria Santos (40%)\n\nAmbos são os beneficiários finais reais da empresa? Existe alguém com controle indireto ou participação através de outra empresa?`,
        richContent: (
          <div className="space-y-2 mt-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              ✅ Sim, apenas João e Maria
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              📋 Há outros beneficiários
            </Button>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    // Upload de documentos
    if (textLower.includes('upload') || textLower.includes('enviar') || textLower.includes('documento')) {
      setDocumentsCollected(prev => ({ ...prev, contrato_social: true }));
      
      const updatedSteps = [...stepsStatus];
      const docsStep = updatedSteps.findIndex(s => s.id === 'docs_validacao');
      if (docsStep >= 0) {
        updatedSteps[docsStep].status = 'processing';
        setStepsStatus(updatedSteps);

        setTimeout(() => {
          const steps2 = [...stepsStatus];
          steps2[docsStep].status = 'completed';
          setStepsStatus(steps2);
        }, 3000);
      }

      return {
        role: 'assistant',
        content: `📄 Documento recebido!\n\n**Validando Contrato Social...**\n\n⏳ Aplicando OCR e extração de dados...\n⏳ Verificando autenticidade...\n⏳ Cruzando com dados da Receita Federal...`,
        richContent: (
          <div className="space-y-3 mt-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Processando documento...</span>
                <span className="text-blue-600">85%</span>
              </div>
              <Progress value={85} className="h-1.5" />
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-3">
              <p className="text-xs font-medium text-green-700">✅ Documento validado com sucesso!</p>
              <p className="text-xs text-green-600 mt-1">
                • Estrutura societária confirmada<br/>
                • Registro na Junta Comercial: Válido<br/>
                • Última alteração: 10/01/2024
              </p>
            </div>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    // Finalização
    if (textLower.includes('finalizar') || textLower.includes('concluir') || textLower.includes('terminar')) {
      const updatedSteps = stepsStatus.map(s => ({ ...s, status: 'completed' }));
      setStepsStatus(updatedSteps);

      return {
        role: 'assistant',
        content: `🎉 **Análise Completa - Cadastro Aprovado!**\n\n**Score de Risco**: 782/1000 (Baixo Risco)\n**Decisão**: Aprovação Automática ✅\n**Tempo total**: 18 minutos\n\n**Configuração da conta:**\n• Limite mensal: R$ 75.000\n• Limite por transação: R$ 5.000\n• Métodos: PIX + Cartão (crédito/débito)\n• Agenda de repasse: D+14\n• Antifraude: Ativado (score médio)\n• 3DS: Opcional para transações > R$ 500\n\n**Próximos passos:**\n1. Receberá credenciais de acesso por email em até 5 minutos\n2. Nosso time de ativação entrará em contato em 24h\n3. DIA Merchant Copilot te ajudará com a primeira venda\n\n**Sua conta está ativa!** 🚀`,
        richContent: (
          <div className="space-y-2 mt-3">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
              <p className="text-sm font-bold text-green-800 mb-2">📧 Email de boas-vindas enviado!</p>
              <p className="text-xs text-green-700">Confira sua caixa de entrada e spam.</p>
            </div>
          </div>
        ),
        timestamp: new Date().toISOString()
      };
    }

    return {
      role: 'assistant',
      content: `Entendi! Você disse: "${text}"\n\nVamos continuar com o processo. Qual informação você gostaria de fornecer agora?`,
      timestamp: new Date().toISOString()
    };
  };

  const completedCount = stepsStatus.filter(s => s.status === 'completed').length;
  const progressPercent = (completedCount / stepsStatus.length) * 100;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Progress Sidebar */}
      <Card className="lg:w-72 p-4 max-h-[700px] overflow-y-auto">
        <div className="sticky top-0 bg-white pb-3 mb-3 border-b">
          <h3 className="font-semibold mb-2 text-sm">Progresso do Cadastro</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{completedCount} de {stepsStatus.length} etapas</span>
              <span className="font-medium text-[#2bc196]">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="space-y-2">
          {stepsStatus.map((step, idx) => {
            const Icon = step.icon || FileText;
            return (
              <div key={step.id} className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg transition-all",
                step.status === 'completed' && "bg-green-50 border border-green-200",
                step.status === 'processing' && "bg-blue-50 border-2 border-blue-400 shadow-sm",
                step.status === 'pending' && "bg-slate-50 border border-slate-200"
              )}>
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                  step.status === 'completed' && "bg-green-500 text-white",
                  step.status === 'pending' && "bg-slate-300 text-slate-600",
                  step.status === 'processing' && "bg-blue-500 text-white animate-pulse"
                )}>
                  {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs font-semibold",
                    step.status === 'completed' && "text-green-700",
                    step.status === 'pending' && "text-slate-500",
                    step.status === 'processing' && "text-blue-700"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{step.description}</p>
                </div>
                {step.status === 'processing' && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Estimated Time & Docs Collected */}
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Tempo estimado: 15-30min</span>
            </div>
          </div>
          
          {Object.keys(documentsCollected).length > 0 && (
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-green-700 mb-2">
                <FileText className="w-4 h-4" />
                <span className="font-semibold">Documentos Coletados:</span>
              </div>
              <div className="space-y-1">
                {Object.keys(documentsCollected).map(docId => (
                  <div key={docId} className="flex items-center gap-1 text-[10px] text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{docId.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Chat Interface */}
      <div className="flex-1">
        <AgentChatInterface
          agentName="Identity Onboarder"
          initialMessages={messages}
          onSendMessage={handleMessage}
          placeholder="Digite aqui (ex: seu CNPJ, confirmar endereço, etc)..."
          quickPrompts={[
            "12.345.678/0001-00",
            "Sim, está correto",
            "E-commerce próprio",
            "Faturamos R$ 50k/mês, ticket R$ 150",
            "B2C - Pessoa Física",
            "joao@techstore.com",
            "Upload documento",
            "Finalizar cadastro"
          ]}
          accentColor="emerald"
        />
      </div>
    </div>
  );
}