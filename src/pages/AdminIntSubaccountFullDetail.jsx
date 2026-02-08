import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Store,
  Building2,
  User,
  CreditCard,
  FileText,
  Shield,
  AlertTriangle,
  ArrowLeftRight,
  Settings,
  DollarSign,
  History,
  Check,
  Lock,
  Pause,
  Play,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Landmark,
  Eye,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { mockHierarchicalSubaccounts, mockSubaccountTransactions, mockMainMerchants } from '@/components/mockData/adminInternoMocks';

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right max-w-[60%]">{value || '-'}</span>
  </div>
);

export default function AdminIntSubaccountFullDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const subaccountId = urlParams.get('id');

  const [activeTab, setActiveTab] = useState('cadastrais');
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });
  const [actionReason, setActionReason] = useState('');

  const subaccount = mockHierarchicalSubaccounts.find(s => s.id === subaccountId) || mockHierarchicalSubaccounts[0];
  const parentMerchant = mockMainMerchants.find(m => m.id === subaccount.parent_merchant_id);
  const transactions = mockSubaccountTransactions.filter(t => t.subaccount_id === subaccount.id).slice(0, 5);

  const handleAction = (type) => {
    setActionDialog({ open: true, type });
    setActionReason('');
  };

  const confirmAction = () => {
    // Aqui chamaria a função de backend
    console.log(`Action: ${actionDialog.type}, Reason: ${actionReason}`);
    setActionDialog({ open: false, type: null });
    setActionReason('');
  };

  const getActionTitle = () => {
    switch (actionDialog.type) {
      case 'approve': return 'Aprovar Subconta';
      case 'block': return 'Bloquear Subconta';
      case 'suspend': return 'Suspender Subconta';
      case 'reactivate': return 'Reativar Subconta';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={subaccount.business_name}
        subtitle={`CNPJ: ${subaccount.document}`}
        icon={Store}
        breadcrumbs={[
          { label: 'Gestão de Comerciantes', page: 'AdminIntMerchantsOverview' },
          { label: parentMerchant?.business_name || 'Comerciante', page: `AdminIntMerchantProfile?id=${subaccount.parent_merchant_id}` },
          { label: subaccount.business_name }
        ]}
        actions={
          <div className="flex gap-2">
            {subaccount.status === 'pending_compliance' && (
              <Button onClick={() => handleAction('approve')} className="bg-emerald-600 hover:bg-emerald-700">
                <Check className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
            )}
            {subaccount.status === 'active' && (
              <>
                <Button variant="outline" onClick={() => handleAction('suspend')} className="text-amber-600 border-amber-300 hover:bg-amber-50">
                  <Pause className="w-4 h-4 mr-2" />
                  Suspender
                </Button>
                <Button variant="outline" onClick={() => handleAction('block')} className="text-red-600 border-red-300 hover:bg-red-50">
                  <Lock className="w-4 h-4 mr-2" />
                  Bloquear
                </Button>
              </>
            )}
            {(subaccount.status === 'suspended' || subaccount.status === 'blocked') && (
              <Button onClick={() => handleAction('reactivate')} className="bg-emerald-600 hover:bg-emerald-700">
                <Play className="w-4 h-4 mr-2" />
                Reativar
              </Button>
            )}
          </div>
        }
      />

      {/* Status e KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 mb-2">Status</p>
            <StatusBadge status={subaccount.status} size="lg" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 mb-1">Volume Total</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(subaccount.total_volume)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 mb-1">Saldo Disponível</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(subaccount.available_balance)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 mb-1">Saldo Pendente</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(subaccount.pending_balance)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 mb-1">Saldo Bloqueado</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(subaccount.blocked_balance)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto p-1 bg-white dark:bg-slate-800 border rounded-lg mb-4 gap-1">
          <TabsTrigger value="cadastrais">📝 Dados Cadastrais</TabsTrigger>
          <TabsTrigger value="bancarios">🏦 Dados Bancários</TabsTrigger>
          <TabsTrigger value="documentos">📁 Documentos</TabsTrigger>
          <TabsTrigger value="compliance">🛡️ Compliance & Risco</TabsTrigger>
          <TabsTrigger value="transacoes">💳 Transações</TabsTrigger>
          <TabsTrigger value="limites">📊 Limites</TabsTrigger>
          <TabsTrigger value="taxas">💰 Taxas</TabsTrigger>
          <TabsTrigger value="historico">📜 Histórico & Notas</TabsTrigger>
        </TabsList>

        {/* Tab: Dados Cadastrais */}
        <TabsContent value="cadastrais">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Dados da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="Nome Fantasia" value={subaccount.business_name} />
                <InfoRow label="Razão Social" value={subaccount.legal_name} />
                <InfoRow label="CNPJ/CPF" value={subaccount.document} />
                <InfoRow label="E-mail" value={subaccount.email} icon={Mail} />
                <InfoRow label="Telefone" value={subaccount.phone} icon={Phone} />
                <InfoRow label="Website" value={subaccount.website} icon={Globe} />
                <InfoRow label="Data de Abertura" value={new Date(subaccount.opening_date).toLocaleDateString('pt-BR')} icon={Calendar} />
                <InfoRow label="Categoria" value={subaccount.category} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="Logradouro" value={`${subaccount.address?.street}, ${subaccount.address?.number}`} />
                <InfoRow label="Complemento" value={subaccount.address?.complement} />
                <InfoRow label="Bairro" value={subaccount.address?.neighborhood} />
                <InfoRow label="Cidade" value={subaccount.address?.city} />
                <InfoRow label="Estado" value={subaccount.address?.state} />
                <InfoRow label="CEP" value={subaccount.address?.zip_code} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  MCC / CNAE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InfoRow label="MCC Declarado" value={subaccount.mcc_declared} />
                <InfoRow label="MCC Descrição" value={subaccount.mcc_description} />
                <InfoRow label="CNAE Declarado" value={subaccount.cnae_declared} />
                {subaccount.mcc_observed && (
                  <InfoRow label="MCC Observado" value={subaccount.mcc_observed} />
                )}
                <div className="mt-4">
                  <Badge variant={subaccount.mcc_compliance_status === 'compliant' ? 'success' : 'destructive'}>
                    MCC: {subaccount.mcc_compliance_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Sócios / Representantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subaccount.partners?.map((partner, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-2">
                    <p className="font-medium text-slate-900 dark:text-white">{partner.name}</p>
                    <p className="text-sm text-slate-500">CPF: {partner.cpf} • Participação: {partner.share}</p>
                    <div className="flex gap-2 mt-2">
                      {partner.pep && <Badge variant="destructive">PEP</Badge>}
                      {partner.sanctions && <Badge variant="destructive">Sanções</Badge>}
                      {!partner.pep && !partner.sanctions && <Badge variant="success">Sem restrições</Badge>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Dados Bancários */}
        <TabsContent value="bancarios">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                Contas Bancárias Cadastradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subaccount.bank_accounts?.map((account, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-slate-900 dark:text-white">{account.bank_name}</span>
                        <Badge variant="secondary">Código: {account.bank_code}</Badge>
                      </div>
                      {account.is_primary && <Badge variant="success">Principal</Badge>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Agência</p>
                        <p className="font-medium">{account.agency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Conta</p>
                        <p className="font-medium">{account.account_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Tipo</p>
                        <p className="font-medium">{account.account_type === 'checking' ? 'Corrente' : 'Poupança'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Chave PIX</p>
                        <p className="font-medium text-sm">{account.pix_key}</p>
                        <p className="text-xs text-slate-400">({account.pix_key_type})</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Documentos */}
        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos Enviados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Upload</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subaccount.documents?.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(doc.uploaded_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> Ver
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" /> Baixar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* KYC Data */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Dados do Questionário KYC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(subaccount.kyc_data || {}).map(([key, value]) => (
                  <div key={key} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Compliance & Risco */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Score de Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                    subaccount.ai_compliance_score >= 80 ? 'bg-emerald-100 text-emerald-600' :
                    subaccount.ai_compliance_score >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <span className="text-4xl font-bold">{subaccount.ai_compliance_score}</span>
                  </div>
                  <p className="text-lg font-semibold mb-2">Score HELENA</p>
                  <Badge variant={subaccount.ai_compliance_status === 'approved' ? 'success' : subaccount.ai_compliance_status === 'rejected' ? 'destructive' : 'secondary'}>
                    {subaccount.ai_compliance_status}
                  </Badge>
                </div>
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Justificativa da IA:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{subaccount.ai_compliance_justification}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Red Flags Identificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subaccount.ai_compliance_red_flags?.length > 0 ? (
                  <div className="space-y-2">
                    {subaccount.ai_compliance_red_flags.map((flag, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-700 dark:text-red-400">{flag}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-700 dark:text-emerald-400">Nenhum red flag identificado</span>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Nível de Risco:</p>
                  <Badge 
                    variant={subaccount.risk_level === 'low' ? 'success' : subaccount.risk_level === 'critical' ? 'destructive' : 'secondary'}
                    className="text-sm px-3 py-1"
                  >
                    {subaccount.risk_level?.toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Status de Compliance:</p>
                  <Badge variant={subaccount.compliance_status === 'compliant' ? 'success' : 'secondary'}>
                    {subaccount.compliance_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações de Gestão */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Ações de Gestão da Subconta</CardTitle>
              <CardDescription>Aprove, suspenda ou bloqueie esta subconta conforme necessário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {subaccount.status === 'pending_compliance' && (
                  <Button onClick={() => handleAction('approve')} className="bg-emerald-600 hover:bg-emerald-700">
                    <Check className="w-4 h-4 mr-2" />
                    Aprovar Subconta
                  </Button>
                )}
                {subaccount.status === 'active' && (
                  <>
                    <Button variant="outline" onClick={() => handleAction('suspend')} className="text-amber-600 border-amber-300 hover:bg-amber-50">
                      <Pause className="w-4 h-4 mr-2" />
                      Suspender Subconta
                    </Button>
                    <Button variant="outline" onClick={() => handleAction('block')} className="text-red-600 border-red-300 hover:bg-red-50">
                      <Lock className="w-4 h-4 mr-2" />
                      Bloquear Subconta
                    </Button>
                  </>
                )}
                {(subaccount.status === 'suspended' || subaccount.status === 'blocked') && (
                  <Button onClick={() => handleAction('reactivate')} className="bg-emerald-600 hover:bg-emerald-700">
                    <Play className="w-4 h-4 mr-2" />
                    Reativar Subconta
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Transações */}
        <TabsContent value="transacoes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5" />
                Transações Recentes
              </CardTitle>
              <Link to={createPageUrl(`AdminIntSubaccountTransactions?id=${subaccount.id}`)}>
                <Button variant="outline" size="sm">
                  Ver Todas <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cliente</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                      <TableCell>{new Date(txn.date).toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(txn.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{txn.method}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={txn.status} />
                      </TableCell>
                      <TableCell>{txn.customer?.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Limites */}
        <TabsContent value="limites">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Limites Configurados
              </CardTitle>
              <Link to={createPageUrl(`AdminIntSubaccountLimits?id=${subaccount.id}`)}>
                <Button variant="outline" size="sm">
                  Gerenciar Limites <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Por Transação</p>
                  <p className="text-2xl font-bold">{formatCurrency(subaccount.limits?.per_transaction)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Diário</p>
                  <p className="text-2xl font-bold">{formatCurrency(subaccount.limits?.daily)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Mensal</p>
                  <p className="text-2xl font-bold">{formatCurrency(subaccount.limits?.monthly)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">PIX Por Transação</p>
                  <p className="text-2xl font-bold">{formatCurrency(subaccount.limits?.pix_per_transaction)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">PIX Diário</p>
                  <p className="text-2xl font-bold">{formatCurrency(subaccount.limits?.pix_daily)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Taxas */}
        <TabsContent value="taxas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Taxas Configuradas
              </CardTitle>
              <Link to={createPageUrl(`AdminIntSubaccountRates?id=${subaccount.id}`)}>
                <Button variant="outline" size="sm">
                  Ver Detalhes <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">MDR Crédito</p>
                  <p className="text-2xl font-bold">{subaccount.rates_config?.mdr_credit}%</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">MDR Débito</p>
                  <p className="text-2xl font-bold">{subaccount.rates_config?.mdr_debit}%</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">MDR PIX</p>
                  <p className="text-2xl font-bold">{subaccount.rates_config?.mdr_pix}%</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Taxa Fixa Cartão</p>
                  <p className="text-2xl font-bold">R$ {subaccount.rates_config?.fixed_fee_card?.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Taxa Fixa PIX</p>
                  <p className="text-2xl font-bold">R$ {subaccount.rates_config?.fixed_fee_pix?.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Taxa de Antecipação</p>
                  <p className="text-2xl font-bold">{subaccount.rates_config?.anticipation_rate}%</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>Plano:</strong> {subaccount.plan_name}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Histórico & Notas */}
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Notas Internas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subaccount.notes?.length > 0 ? (
                <div className="space-y-3">
                  {subaccount.notes.map((note, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-slate-900 dark:text-white">{note.content}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {note.user} • {new Date(note.date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Nenhuma nota registrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Ação */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle()}</DialogTitle>
            <DialogDescription>
              Você está prestes a {actionDialog.type === 'approve' ? 'aprovar' : actionDialog.type === 'block' ? 'bloquear' : actionDialog.type === 'suspend' ? 'suspender' : 'reativar'} a subconta <strong>{subaccount.business_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Textarea
              id="reason"
              placeholder="Informe o motivo desta ação..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null })}>
              Cancelar
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionDialog.type === 'approve' || actionDialog.type === 'reactivate'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : actionDialog.type === 'block'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}