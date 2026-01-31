import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  DollarSign,
  Clock,
  FileText,
  Shield,
  Target,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Eye,
  Download,
  ChevronRight,
  AlertCircle,
  Gavel,
  Scale,
  Brain,
  Zap,
  BarChart3,
  Calendar,
  RefreshCw,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import { processDisputeManagerMessage, disputeManagerQuickPrompts } from '@/components/agents/DisputeManagerChatLogic';

export default function DisputeManager() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // KPI Data
  const kpis = {
    totalDisputes: 47,
    openDisputes: 12,
    totalValue: 'R$ 127.450,00',
    winRate: 72,
    avgResolutionTime: '8.3 dias',
    potentialRecovery: 'R$ 89.200,00'
  };

  // Simulated disputes data
  const disputes = [
    {
      id: 'CB-2024-001',
      transactionId: 'TXN-847392',
      type: 'chargeback',
      status: 'pending',
      amount: 2450.00,
      customer: 'João Silva',
      customerDocument: '***456.789-**',
      reason: 'Fraude - Não Reconhece a Transação',
      reasonCode: '10.4',
      cardBrand: 'Visa',
      openedDate: '2024-01-28',
      deadline: '2024-02-12',
      daysRemaining: 5,
      aiWinProbability: 87,
      aiRecommendation: 'contest',
      aiJustification: 'Transação possui 3DS autenticado, IP do cliente compatível com histórico, e produto foi entregue conforme rastreamento.',
      evidence: {
        has3DS: true,
        hasDeliveryProof: true,
        hasCustomerHistory: true,
        hasAntifraudApproval: true
      }
    },
    {
      id: 'CB-2024-002',
      transactionId: 'TXN-847128',
      type: 'chargeback',
      status: 'in_analysis',
      amount: 890.00,
      customer: 'Maria Santos',
      customerDocument: '***123.456-**',
      reason: 'Produto/Serviço não recebido',
      reasonCode: '13.1',
      cardBrand: 'Mastercard',
      openedDate: '2024-01-26',
      deadline: '2024-02-10',
      daysRemaining: 3,
      aiWinProbability: 45,
      aiRecommendation: 'accept',
      aiJustification: 'Rastreamento mostra entrega, porém sem comprovante de recebimento assinado. Histórico de contestações do cliente.',
      evidence: {
        has3DS: false,
        hasDeliveryProof: false,
        hasCustomerHistory: true,
        hasAntifraudApproval: true
      }
    },
    {
      id: 'CB-2024-003',
      transactionId: 'TXN-846995',
      type: 'pre_chargeback',
      status: 'pending',
      amount: 5200.00,
      customer: 'Pedro Oliveira',
      customerDocument: '***789.012-**',
      reason: 'Alerta Ethoca - Suspeita de Fraude',
      reasonCode: 'ETHOCA',
      cardBrand: 'Visa',
      openedDate: '2024-01-30',
      deadline: '2024-02-01',
      daysRemaining: 1,
      aiWinProbability: 92,
      aiRecommendation: 'contest',
      aiJustification: 'Recomendação: Reembolso preventivo. Cliente com histórico limpo, valor alto. Reembolso evita chargeback e preserva ratio.',
      evidence: {
        has3DS: true,
        hasDeliveryProof: true,
        hasCustomerHistory: true,
        hasAntifraudApproval: true
      }
    },
    {
      id: 'CB-2024-004',
      transactionId: 'TXN-846501',
      type: 'chargeback',
      status: 'won',
      amount: 1780.00,
      customer: 'Ana Costa',
      customerDocument: '***345.678-**',
      reason: 'Transação Duplicada',
      reasonCode: '12.6',
      cardBrand: 'Elo',
      openedDate: '2024-01-15',
      deadline: '2024-01-30',
      daysRemaining: 0,
      aiWinProbability: 95,
      aiRecommendation: 'contest',
      aiJustification: 'Contestação bem-sucedida. Evidências comprovaram transação única.',
      evidence: {
        has3DS: true,
        hasDeliveryProof: true,
        hasCustomerHistory: true,
        hasAntifraudApproval: true
      }
    },
    {
      id: 'CB-2024-005',
      transactionId: 'TXN-846102',
      type: 'chargeback',
      status: 'lost',
      amount: 3400.00,
      customer: 'Carlos Mendes',
      customerDocument: '***901.234-**',
      reason: 'Fraude - Cartão Roubado',
      reasonCode: '10.1',
      cardBrand: 'Mastercard',
      openedDate: '2024-01-10',
      deadline: '2024-01-25',
      daysRemaining: 0,
      aiWinProbability: 15,
      aiRecommendation: 'accept',
      aiJustification: 'Transação sem 3DS, IP diferente do histórico, produto de alto risco.',
      evidence: {
        has3DS: false,
        hasDeliveryProof: true,
        hasCustomerHistory: false,
        hasAntifraudApproval: false
      }
    }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      pending: { label: 'Pendente', variant: 'outline', className: 'border-amber-500 text-amber-600 bg-amber-50' },
      in_analysis: { label: 'Em Análise', variant: 'outline', className: 'border-blue-500 text-blue-600 bg-blue-50' },
      contested: { label: 'Contestado', variant: 'outline', className: 'border-purple-500 text-purple-600 bg-purple-50' },
      won: { label: 'Ganho', variant: 'outline', className: 'border-green-500 text-green-600 bg-green-50' },
      lost: { label: 'Perdido', variant: 'outline', className: 'border-red-500 text-red-600 bg-red-50' }
    };
    const config = configs[status] || configs.pending;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type) => {
    if (type === 'pre_chargeback') {
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Pré-Chargeback</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700 border-red-200">Chargeback</Badge>;
  };

  const filteredDisputes = selectedTab === 'all' 
    ? disputes 
    : disputes.filter(d => {
        if (selectedTab === 'pending') return d.status === 'pending' || d.status === 'in_analysis';
        if (selectedTab === 'high_probability') return d.aiWinProbability >= 70;
        if (selectedTab === 'urgent') return d.daysRemaining <= 3 && d.status !== 'won' && d.status !== 'lost';
        return true;
      });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
            <Gavel className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dispute Manager</h1>
            <p className="text-slate-500 dark:text-slate-400">Gestor Inteligente de Disputas e Chargebacks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Link to={createPageUrl('DisputeManagerSettings')}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">Total Disputas</span>
            <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{kpis.totalDisputes}</p>
          <p className="text-xs text-slate-500">{kpis.openDisputes} abertas</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">Valor Total</span>
            <DollarSign className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{kpis.totalValue}</p>
          <p className="text-xs text-slate-500">em disputa</p>
        </Card>

        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-green-600 whitespace-nowrap overflow-hidden text-ellipsis">Win Rate</span>
            <Target className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400 truncate">{kpis.winRate}%</p>
          <p className="text-xs text-green-600">acima da média</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">Tempo Médio</span>
            <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{kpis.avgResolutionTime}</p>
          <p className="text-xs text-slate-500">resolução</p>
        </Card>

        <Card className="p-4 bg-[#2bc196]/5 border-[#2bc196]/20">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-[#2bc196] whitespace-nowrap overflow-hidden text-ellipsis">Recuperação</span>
            <Zap className="w-5 h-5 text-[#2bc196] flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-[#2bc196] truncate">{kpis.potentialRecovery}</p>
          <p className="text-xs text-[#2bc196]">potencial</p>
        </Card>

        <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-amber-600 whitespace-nowrap overflow-hidden text-ellipsis">Urgentes</span>
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 truncate">3</p>
          <p className="text-xs text-amber-600">prazo &lt; 3 dias</p>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-[#2bc196]/20 bg-gradient-to-r from-[#2bc196]/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2bc196] to-[#5cf7cf] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Análise IA do Dispute Manager</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>3 disputas</strong> com alta probabilidade de ganho (≥85%) aguardando ação. 
                Valor total: <strong>R$ 8.530</strong>. 
                Recomendação: contestar imediatamente para maximizar recuperação.
              </p>
            </div>
            <Button className="bg-[#2bc196] hover:bg-[#2bc196]/90">
              Contestar Todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disputes Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Lista de Disputas</CardTitle>
              <CardDescription>Gerencie e conteste chargebacks com apoio de IA</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Buscar por ID ou cliente..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todas ({disputes.length})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({disputes.filter(d => d.status === 'pending' || d.status === 'in_analysis').length})</TabsTrigger>
              <TabsTrigger value="high_probability">Alta Prob. Ganho ({disputes.filter(d => d.aiWinProbability >= 70).length})</TabsTrigger>
              <TabsTrigger value="urgent">Urgentes ({disputes.filter(d => d.daysRemaining <= 3 && d.status !== 'won' && d.status !== 'lost').length})</TabsTrigger>
            </TabsList>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-slate-500">ID</th>
                    <th className="text-left p-3 text-xs font-medium text-slate-500">Tipo</th>
                    <th className="text-left p-3 text-xs font-medium text-slate-500">Cliente</th>
                    <th className="text-left p-3 text-xs font-medium text-slate-500">Motivo</th>
                    <th className="text-right p-3 text-xs font-medium text-slate-500">Valor</th>
                    <th className="text-center p-3 text-xs font-medium text-slate-500">Prob. Ganho</th>
                    <th className="text-center p-3 text-xs font-medium text-slate-500">Prazo</th>
                    <th className="text-center p-3 text-xs font-medium text-slate-500">Status</th>
                    <th className="text-center p-3 text-xs font-medium text-slate-500">Recomendação IA</th>
                    <th className="text-center p-3 text-xs font-medium text-slate-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDisputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-sm text-slate-900 dark:text-white">{dispute.id}</p>
                          <p className="text-xs text-slate-500">{dispute.transactionId}</p>
                        </div>
                      </td>
                      <td className="p-3">{getTypeBadge(dispute.type)}</td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm text-slate-900 dark:text-white">{dispute.customer}</p>
                          <p className="text-xs text-slate-500">{dispute.customerDocument}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="max-w-[200px]">
                          <p className="text-sm text-slate-900 dark:text-white truncate">{dispute.reason}</p>
                          <p className="text-xs text-slate-500">{dispute.cardBrand} • {dispute.reasonCode}</p>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          R$ {dispute.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-bold ${
                            dispute.aiWinProbability >= 70 ? 'text-green-600' : 
                            dispute.aiWinProbability >= 40 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {dispute.aiWinProbability}%
                          </span>
                          <Progress 
                            value={dispute.aiWinProbability} 
                            className="w-16 h-1.5"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {dispute.status !== 'won' && dispute.status !== 'lost' ? (
                          <Badge variant="outline" className={
                            dispute.daysRemaining <= 3 ? 'border-red-500 text-red-600 bg-red-50' : 
                            dispute.daysRemaining <= 7 ? 'border-amber-500 text-amber-600 bg-amber-50' : ''
                          }>
                            {dispute.daysRemaining}d
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center">{getStatusBadge(dispute.status)}</td>
                      <td className="p-3 text-center">
                        {dispute.status !== 'won' && dispute.status !== 'lost' && (
                          <Badge className={
                            dispute.aiRecommendation === 'contest' 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }>
                            {dispute.aiRecommendation === 'contest' ? '✓ Contestar' : '✗ Aceitar'}
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSelectedDispute(dispute)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {dispute.status !== 'won' && dispute.status !== 'lost' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-[#2bc196] hover:text-[#2bc196] hover:bg-[#2bc196]/10"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dispute Detail Modal/Drawer */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDispute(null)}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Detalhes da Disputa {selectedDispute.id}</CardTitle>
                  <CardDescription>Transação {selectedDispute.transactionId}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDispute(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Analysis */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#2bc196]/10 to-transparent border border-[#2bc196]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-[#2bc196]" />
                  <h4 className="font-semibold text-slate-900 dark:text-white">Análise do Dispute Manager</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{selectedDispute.aiJustification}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-slate-500">Probabilidade de Ganho</span>
                    <p className={`text-2xl font-bold ${
                      selectedDispute.aiWinProbability >= 70 ? 'text-green-600' : 
                      selectedDispute.aiWinProbability >= 40 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {selectedDispute.aiWinProbability}%
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Recomendação</span>
                    <Badge className={`mt-1 ${
                      selectedDispute.aiRecommendation === 'contest' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {selectedDispute.aiRecommendation === 'contest' ? 'Contestar' : 'Aceitar Perda'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Evidence Checklist */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Checklist de Evidências</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'has3DS', label: 'Autenticação 3DS' },
                    { key: 'hasDeliveryProof', label: 'Comprovante de Entrega' },
                    { key: 'hasCustomerHistory', label: 'Histórico do Cliente' },
                    { key: 'hasAntifraudApproval', label: 'Aprovação Antifraude' }
                  ].map((item) => (
                    <div 
                      key={item.key}
                      className={`p-3 rounded-lg border flex items-center gap-2 ${
                        selectedDispute.evidence[item.key] 
                          ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                          : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      {selectedDispute.evidence[item.key] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1 bg-[#2bc196] hover:bg-[#2bc196]/90">
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Dossiê de Contestação
                </Button>
                <Button variant="outline" className="flex-1">
                  Aceitar Perda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Agent Chat Interface */}
      <AgentChatInterface
        agentName="dispute_manager"
        agentDisplayName="Dispute Manager"
        agentDescription="Gestor inteligente de disputas"
        quickPrompts={disputeManagerQuickPrompts}
        onProcessMessage={processDisputeManagerMessage}
        welcomeMessage="Olá! 👋 Sou o Dispute Manager, seu assistente para gestão de chargebacks e disputas. Posso ajudar a analisar casos, gerar contestações e configurar regras automáticas. Como posso ajudar?"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        accentColor="#ef4444"
      />

      {/* Floating Button */}
      <AgentFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        agentName="Dispute Manager"
        accentColor="#ef4444"
      />
    </div>
  );
}