import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Clock,
  FileText,
  Shield,
  Target,
  Search,
  Filter,
  Eye,
  Download,
  ChevronRight,
  AlertCircle,
  Brain,
  Zap,
  Settings,
  User,
  Building2,
  Upload,
  Camera,
  FileCheck,
  FileX,
  RefreshCw,
  Play,
  CheckCheck,
  CircleDot,
  Loader2,
  Scale,
  ShieldCheck,
  Fingerprint,
  ScanFace,
  Globe,
  Save,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import { processIdentityOnboarderMessage, identityOnboarderQuickPrompts } from '@/components/agents/IdentityOnboarderChatLogic';

export default function AdminIntIdentityOnboarder() {
  const [selectedTab, setSelectedTab] = useState('simulator');
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationData, setSimulationData] = useState({
    cnpj: '',
    businessName: '',
    openingDate: '',
    mcc: '',
    estimatedVolume: '',
    address: ''
  });
  const [simulationResults, setSimulationResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helena AI Settings State
  const [helenaSettings, setHelenaSettings] = useState({
    helenaEnabled: true,
    autoApproveThreshold: 80,
    autoRejectThreshold: 30,
    highRiskMCCAutoApproveLimit: 70,
    requireManualForHighRiskMCC: true,
    mccWeight: 25,
    addressWeight: 20,
    documentWeight: 25,
    pepWeight: 15,
    financialWeight: 15,
    pepCheckRequired: true,
    sanctionsCheckRequired: true,
    addressVerificationRequired: true,
    livenessRequired: true
  });

  // KPIs
  const kpis = {
    totalSubmissions: 234,
    pendingAnalysis: 18,
    avgProcessingTime: '4.2h',
    autoApprovalRate: '67%',
    manualReviewRate: '28%',
    rejectionRate: '5%'
  };

  // Queue data
  const pendingQueue = [
    {
      id: 'KYC-2024-001',
      businessName: 'TechStore Brasil LTDA',
      cnpj: '12.345.678/0001-90',
      type: 'kyc_full',
      submittedAt: '2024-01-30 14:32',
      waitingTime: '2.5h',
      helenaScore: 87,
      helenaStatus: 'approved',
      priority: 'normal'
    },
    {
      id: 'KYC-2024-002',
      businessName: 'Fashion Express ME',
      cnpj: '98.765.432/0001-10',
      type: 'kyc_pix',
      submittedAt: '2024-01-30 13:15',
      waitingTime: '3.8h',
      helenaScore: 45,
      helenaStatus: 'manual_review',
      priority: 'high',
      redFlags: ['Sócio com restrições', 'Endereço inconsistente']
    },
    {
      id: 'KYC-2024-003',
      businessName: 'GameZone Digital',
      cnpj: '11.222.333/0001-44',
      type: 'kyc_full',
      submittedAt: '2024-01-30 11:45',
      waitingTime: '5.2h',
      helenaScore: 23,
      helenaStatus: 'rejected',
      priority: 'critical',
      redFlags: ['CNPJ com restrições graves', 'PEP identificado', 'Setor de alto risco']
    }
  ];

  // Simulation steps
  const simulationSteps = [
    { id: 'dados_cadastrais', label: 'Dados Cadastrais', icon: Building2 },
    { id: 'validacao_cnpj', label: 'Validação CNPJ', icon: FileCheck },
    { id: 'analise_socios', label: 'Análise de Sócios', icon: User },
    { id: 'verificacao_pep', label: 'Verificação PEP', icon: Shield },
    { id: 'analise_risco', label: 'Análise de Risco', icon: Scale },
    { id: 'decisao_final', label: 'Decisão Final', icon: CheckCheck }
  ];

  // Start simulation
  const startSimulation = () => {
    if (!simulationData.cnpj || !simulationData.businessName) {
      return;
    }
    
    setIsProcessing(true);
    setSimulationStep(1);
    
    // Simulate each step
    const runSteps = async () => {
      for (let i = 1; i <= 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSimulationStep(i);
      }
      
      // Generate results based on inputs
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      const status = score >= 80 ? 'approved' : score >= 50 ? 'manual_review' : 'rejected';
      
      setSimulationResults({
        score,
        status,
        validations: {
          cnpj: { status: 'valid', message: 'CNPJ ativo na Receita Federal' },
          address: { status: 'valid', message: 'Endereço validado via correios' },
          partners: { status: score >= 70 ? 'valid' : 'warning', message: score >= 70 ? 'Sócios sem restrições' : 'Sócio com histórico de inadimplência' },
          pep: { status: 'valid', message: 'Nenhum PEP identificado' },
          sanctions: { status: 'valid', message: 'Não consta em listas de sanções' },
          mcc: { status: score >= 60 ? 'valid' : 'warning', message: score >= 60 ? 'MCC compatível com atividade' : 'MCC de alto risco' }
        },
        recommendation: status === 'approved' 
          ? 'Aprovação automática recomendada. Todos os critérios atendidos.'
          : status === 'manual_review'
          ? 'Encaminhado para revisão manual. Verificar pontos de atenção identificados.'
          : 'Recusa recomendada. Múltiplas inconsistências identificadas.',
        processingTime: '3.2s'
      });
      
      setIsProcessing(false);
    };
    
    runSteps();
  };

  const resetSimulation = () => {
    setSimulationStep(0);
    setSimulationResults(null);
    setSimulationData({
      cnpj: '',
      businessName: '',
      openingDate: '',
      mcc: '',
      estimatedVolume: '',
      address: ''
    });
  };

  const getStatusBadge = (status) => {
    const configs = {
      approved: { label: 'Aprovado', className: 'bg-green-100 text-green-700 border-green-200' },
      manual_review: { label: 'Revisão Manual', className: 'bg-amber-100 text-amber-700 border-amber-200' },
      rejected: { label: 'Recusado', className: 'bg-red-100 text-red-700 border-red-200' },
      pending: { label: 'Pendente', className: 'bg-slate-100 text-slate-700 border-slate-200' }
    };
    const config = configs[status] || configs.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Fingerprint className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Identity Onboarder</h1>
            <p className="text-slate-500 dark:text-slate-400">KYC/KYB Copilot - Validação Inteligente de Identidade</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Helena AI Ativa</span>
          </div>
          <Link to={createPageUrl('AdminIntIdentityOnboarderSettings')}>
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
            <span className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">Submissões</span>
            <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{kpis.totalSubmissions}</p>
          <p className="text-xs text-slate-500">este mês</p>
        </Card>

        <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-amber-600 whitespace-nowrap overflow-hidden text-ellipsis">Pendentes</span>
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 truncate">{kpis.pendingAnalysis}</p>
          <p className="text-xs text-amber-600">aguardando</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">Tempo Médio</span>
            <Zap className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{kpis.avgProcessingTime}</p>
          <p className="text-xs text-slate-500">processamento</p>
        </Card>

        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-green-600 whitespace-nowrap overflow-hidden text-ellipsis">Auto-Aprovação</span>
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400 truncate">{kpis.autoApprovalRate}</p>
          <p className="text-xs text-green-600">taxa Helena</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">Revisão Manual</span>
            <Eye className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">{kpis.manualReviewRate}</p>
          <p className="text-xs text-slate-500">encaminhados</p>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-red-600 whitespace-nowrap overflow-hidden text-ellipsis">Recusas</span>
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          </div>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400 truncate">{kpis.rejectionRate}</p>
          <p className="text-xs text-red-600">taxa geral</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="simulator" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator">Simulador de Onboarding</TabsTrigger>
          <TabsTrigger value="queue">Fila de Análise ({kpis.pendingAnalysis})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="helena-config">Configurações Helena AI</TabsTrigger>
        </TabsList>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-600" />
                <CardTitle>Simulador de Validação KYC/KYB</CardTitle>
              </div>
              <CardDescription>
                Simule o processo completo de validação de identidade e veja como a Helena AI analisa os dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Form */}
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input 
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={simulationData.cnpj}
                      onChange={(e) => setSimulationData({...simulationData, cnpj: e.target.value})}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessName">Razão Social *</Label>
                    <Input 
                      id="businessName"
                      placeholder="Nome da empresa"
                      value={simulationData.businessName}
                      onChange={(e) => setSimulationData({...simulationData, businessName: e.target.value})}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mcc">MCC</Label>
                    <Select 
                      value={simulationData.mcc}
                      onValueChange={(value) => setSimulationData({...simulationData, mcc: value})}
                      disabled={isProcessing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o MCC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5411">5411 - Supermercados</SelectItem>
                        <SelectItem value="5812">5812 - Restaurantes</SelectItem>
                        <SelectItem value="5912">5912 - Farmácias</SelectItem>
                        <SelectItem value="5999">5999 - E-commerce Geral</SelectItem>
                        <SelectItem value="7995">7995 - Jogos/Apostas (Alto Risco)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="volume">Volume Mensal Estimado</Label>
                    <Select 
                      value={simulationData.estimatedVolume}
                      onValueChange={(value) => setSimulationData({...simulationData, estimatedVolume: value})}
                      disabled={isProcessing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Até R$ 50.000</SelectItem>
                        <SelectItem value="medium">R$ 50.000 - R$ 500.000</SelectItem>
                        <SelectItem value="large">R$ 500.000 - R$ 2.000.000</SelectItem>
                        <SelectItem value="enterprise">Acima de R$ 2.000.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={startSimulation}
                      disabled={isProcessing || !simulationData.cnpj || !simulationData.businessName}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar Simulação
                        </>
                      )}
                    </Button>
                    {(simulationStep > 0 || simulationResults) && (
                      <Button variant="outline" onClick={resetSimulation}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress & Results */}
                <div className="lg:col-span-2">
                  {/* Steps Progress */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Etapas de Validação</h4>
                    <div className="space-y-3">
                      {simulationSteps.map((step, idx) => {
                        const isCompleted = simulationStep > idx;
                        const isCurrent = simulationStep === idx + 1;
                        const isPending = simulationStep <= idx;
                        
                        return (
                          <div 
                            key={step.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              isCompleted 
                                ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                                : isCurrent
                                ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-slate-200 bg-slate-50 dark:bg-slate-800'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : isCurrent
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : isCurrent ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <step.icon className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                isCompleted ? 'text-green-700' : isCurrent ? 'text-indigo-700' : 'text-slate-600'
                              }`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <p className="text-xs text-indigo-600">Processando...</p>
                              )}
                            </div>
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-700">✓</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Results */}
                  {simulationResults && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      {/* Score Card */}
                      <div className={`p-6 rounded-xl border-2 ${
                        simulationResults.status === 'approved'
                          ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                          : simulationResults.status === 'manual_review'
                          ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20'
                          : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Brain className="w-8 h-8 text-indigo-600" />
                            <div>
                              <p className="text-sm text-slate-600">Helena AI Score</p>
                              <p className="text-3xl font-bold">{simulationResults.score}/100</p>
                            </div>
                          </div>
                          {getStatusBadge(simulationResults.status)}
                        </div>
                        <Progress value={simulationResults.score} className="h-3 mb-4" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{simulationResults.recommendation}</p>
                        <p className="text-xs text-slate-500 mt-2">Tempo de processamento: {simulationResults.processingTime}</p>
                      </div>

                      {/* Validation Details */}
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(simulationResults.validations).map(([key, val]) => (
                          <div 
                            key={key}
                            className={`p-3 rounded-lg border ${
                              val.status === 'valid' 
                                ? 'border-green-200 bg-green-50' 
                                : 'border-amber-200 bg-amber-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {val.status === 'valid' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                              )}
                              <span className="text-xs font-medium capitalize">
                                {key.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{val.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!simulationResults && simulationStep === 0 && (
                    <div className="h-full flex items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                      <div>
                        <ScanFace className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Pronto para simular</p>
                        <p className="text-sm text-slate-500">Preencha os dados e clique em "Iniciar Simulação"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Fila de Análise</CardTitle>
                  <CardDescription>Submissões aguardando processamento ou revisão manual</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Buscar por CNPJ ou nome..." className="pl-9 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingQueue.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      item.priority === 'critical'
                        ? 'border-red-200 bg-red-50/50 dark:bg-red-900/10'
                        : item.priority === 'high'
                        ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-900/10'
                        : 'border-slate-200 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Building2 className={`w-8 h-8 flex-shrink-0 ${
                          item.helenaStatus === 'approved'
                            ? 'text-green-600'
                            : item.helenaStatus === 'manual_review'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-900 dark:text-white">{item.businessName}</p>
                            <Badge variant="outline" className="text-xs">{item.type.toUpperCase()}</Badge>
                          </div>
                          <p className="text-sm text-slate-500">{item.cnpj} • ID: {item.id}</p>
                          <p className="text-xs text-slate-400 mt-1">Submetido em {item.submittedAt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Helena Score */}
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Helena Score</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${
                              item.helenaScore >= 70 ? 'text-green-600' :
                              item.helenaScore >= 40 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {item.helenaScore}
                            </span>
                            {getStatusBadge(item.helenaStatus)}
                          </div>
                        </div>

                        {/* Waiting Time */}
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">Em Fila</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.waitingTime}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link to={createPageUrl('AdminIntComplianceReview') + `?id=${item.id}`}>
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              <Eye className="w-4 h-4 mr-2" />
                              Analisar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Red Flags */}
                    {item.redFlags && item.redFlags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 flex-wrap">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-xs font-medium text-red-600">Red Flags:</span>
                          {item.redFlags.map((flag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-red-300 text-red-600 bg-red-50">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Decisões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Auto-Aprovados', value: 67, color: 'bg-green-500' },
                    { label: 'Revisão Manual', value: 28, color: 'bg-amber-500' },
                    { label: 'Recusados', value: 5, color: 'bg-red-500' }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Helena AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-600">Precisão de Decisões</span>
                    <span className="text-lg font-bold text-green-600">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-600">Tempo Médio Processamento</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">2.8s</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-600">Falsos Positivos</span>
                    <span className="text-lg font-bold text-amber-600">3.1%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-600">Falsos Negativos</span>
                    <span className="text-lg font-bold text-red-600">0.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Helena AI Config Tab */}
        <TabsContent value="helena-config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  Thresholds de Decisão
                </CardTitle>
                <CardDescription>Defina os limites para decisões automáticas da Helena</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label className="text-base">Helena AI Ativa</Label>
                    <p className="text-sm text-slate-500">Habilita análise automática de KYC/KYB</p>
                  </div>
                  <Switch 
                    checked={helenaSettings.helenaEnabled}
                    onCheckedChange={(v) => setHelenaSettings({...helenaSettings, helenaEnabled: v})}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Threshold de Auto-Aprovação: <span className="text-green-600 font-bold">{helenaSettings.autoApproveThreshold}</span></Label>
                  <Slider 
                    value={[helenaSettings.autoApproveThreshold]}
                    onValueChange={([v]) => setHelenaSettings({...helenaSettings, autoApproveThreshold: v})}
                    min={60}
                    max={95}
                    step={5}
                  />
                  <p className="text-xs text-slate-500">Score Helena acima deste valor = aprovação automática</p>
                </div>

                <div className="space-y-3">
                  <Label>Threshold de Auto-Rejeição: <span className="text-red-600 font-bold">{helenaSettings.autoRejectThreshold}</span></Label>
                  <Slider 
                    value={[helenaSettings.autoRejectThreshold]}
                    onValueChange={([v]) => setHelenaSettings({...helenaSettings, autoRejectThreshold: v})}
                    min={10}
                    max={50}
                    step={5}
                  />
                  <p className="text-xs text-slate-500">Score Helena abaixo deste valor = rejeição automática</p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <Label className="text-amber-800">Zona de Revisão Manual</Label>
                  </div>
                  <p className="text-sm text-amber-700">
                    Scores entre {helenaSettings.autoRejectThreshold} e {helenaSettings.autoApproveThreshold} serão encaminhados para análise manual.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Limite Auto-Aprovação MCCs Alto Risco: <span className="font-bold">{helenaSettings.highRiskMCCAutoApproveLimit}</span></Label>
                  <Slider 
                    value={[helenaSettings.highRiskMCCAutoApproveLimit]}
                    onValueChange={([v]) => setHelenaSettings({...helenaSettings, highRiskMCCAutoApproveLimit: v})}
                    min={50}
                    max={90}
                    step={5}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <Label className="text-sm">Exigir Revisão Manual p/ Alto Risco</Label>
                    <p className="text-xs text-slate-500">Mesmo com score alto</p>
                  </div>
                  <Switch 
                    checked={helenaSettings.requireManualForHighRiskMCC}
                    onCheckedChange={(v) => setHelenaSettings({...helenaSettings, requireManualForHighRiskMCC: v})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Risk Weights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600" />
                  Pesos de Risco no Score
                </CardTitle>
                <CardDescription>Ajuste a importância de cada fator (total deve ser 100%)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'mccWeight', label: 'MCC / Atividade', icon: Target },
                  { key: 'addressWeight', label: 'Validação de Endereço', icon: Building2 },
                  { key: 'documentWeight', label: 'Documentos', icon: FileText },
                  { key: 'pepWeight', label: 'PEP / Sanções', icon: ShieldCheck },
                  { key: 'financialWeight', label: 'Perfil Financeiro', icon: Scale },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <Label className="text-sm">{label}</Label>
                      </div>
                      <span className="font-bold text-sm">{helenaSettings[key]}%</span>
                    </div>
                    <Slider 
                      value={[helenaSettings[key]]}
                      onValueChange={([v]) => setHelenaSettings({...helenaSettings, [key]: v})}
                      min={5}
                      max={40}
                      step={5}
                    />
                  </div>
                ))}

                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <p className="text-sm font-medium">
                    Total: {helenaSettings.mccWeight + helenaSettings.addressWeight + helenaSettings.documentWeight + helenaSettings.pepWeight + helenaSettings.financialWeight}%
                  </p>
                  {(helenaSettings.mccWeight + helenaSettings.addressWeight + helenaSettings.documentWeight + helenaSettings.pepWeight + helenaSettings.financialWeight) !== 100 && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ O total deve ser 100%</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validations */}
          <Card>
            <CardHeader>
              <CardTitle>Validações Obrigatórias</CardTitle>
              <CardDescription>Defina quais verificações são requeridas no processo de KYC/KYB</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    <div>
                      <Label className="text-sm">Verificação PEP</Label>
                      <Badge className="bg-red-100 text-red-700 text-xs ml-2">Crítico</Badge>
                    </div>
                  </div>
                  <Switch 
                    checked={helenaSettings.pepCheckRequired}
                    onCheckedChange={(v) => setHelenaSettings({...helenaSettings, pepCheckRequired: v})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <Label className="text-sm">Verificação Sanções</Label>
                      <Badge className="bg-red-100 text-red-700 text-xs ml-2">Crítico</Badge>
                    </div>
                  </div>
                  <Switch 
                    checked={helenaSettings.sanctionsCheckRequired}
                    onCheckedChange={(v) => setHelenaSettings({...helenaSettings, sanctionsCheckRequired: v})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <Label className="text-sm">Validação Endereço</Label>
                  </div>
                  <Switch 
                    checked={helenaSettings.addressVerificationRequired}
                    onCheckedChange={(v) => setHelenaSettings({...helenaSettings, addressVerificationRequired: v})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-indigo-600" />
                    <Label className="text-sm">Liveness + Facematch</Label>
                  </div>
                  <Switch 
                    checked={helenaSettings.livenessRequired}
                    onCheckedChange={(v) => setHelenaSettings({...helenaSettings, livenessRequired: v})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações Helena AI
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Agent Chat Interface */}
      <AgentChatInterface
        agentName="identity_onboarder"
        agentDisplayName="Identity Onboarder"
        agentDescription="KYC/KYB Copilot - Helena AI"
        quickPrompts={identityOnboarderQuickPrompts}
        onProcessMessage={processIdentityOnboarderMessage}
        welcomeMessage="Olá! 👋 Sou o Identity Onboarder, assistente para análise KYC/KYB. Posso ajudar a analisar casos, detalhar red flags, configurar a Helena AI e gerenciar a fila. Como posso ajudar?"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        accentColor="#6366f1"
      />

      {/* Floating Button */}
      <AgentFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        agentName="Identity Onboarder"
        accentColor="#6366f1"
      />
    </div>
  );
}