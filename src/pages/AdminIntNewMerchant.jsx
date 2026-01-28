import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Building2, User, MapPin, Briefcase, CheckCircle, ChevronRight, ChevronLeft,
  Search, Loader2, CreditCard, QrCode, FileText, Edit
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Dados Básicos', icon: Building2 },
  { id: 2, title: 'Contato e Endereço', icon: User },
  { id: 3, title: 'Comercial e Métodos', icon: Briefcase },
  { id: 4, title: 'Revisão e Criação', icon: CheckCircle }
];

const SEGMENTS = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS/Digital' },
  { value: 'educacao', label: 'Educação' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'varejo', label: 'Varejo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'games', label: 'Games' },
  { value: 'viagens', label: 'Viagens' },
  { value: 'saude', label: 'Saúde' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'outros', label: 'Outros' }
];

const VOLUME_RANGES = [
  { value: 'under_10k', label: 'Até R$ 10.000' },
  { value: '10k_50k', label: 'R$ 10.000 - R$ 50.000' },
  { value: '50k_100k', label: 'R$ 50.000 - R$ 100.000' },
  { value: '100k_500k', label: 'R$ 100.000 - R$ 500.000' },
  { value: '500k_1m', label: 'R$ 500.000 - R$ 1.000.000' },
  { value: 'over_1m', label: 'Acima de R$ 1.000.000' }
];

export default function AdminIntNewMerchant() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const [cnpjData, setCnpjData] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1
    personType: 'pj',
    document: '',
    legalName: '',
    tradeName: '',
    stateRegistration: '',
    stateRegistrationExempt: false,
    website: '',
    // Step 2
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    // Step 3
    segment: '',
    volumeRange: '',
    averageTicket: '',
    salesRep: '',
    methodCard: true,
    methodPix: true,
    methodBoleto: false,
    initialStatus: 'kyc_pending',
    // Step 4
    sendWelcomeEmail: true,
    createKycTask: true,
    notifySalesRep: false
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCNPJSearch = async () => {
    if (formData.document.length < 14) return;
    
    setIsLoadingCNPJ(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCnpjData({
      legalName: 'EMPRESA EXEMPLO LTDA',
      tradeName: 'Loja Exemplo',
      status: 'ATIVA',
      openDate: '15/03/2018',
      legalNature: '206-2 - Sociedade Empresária Limitada',
      mainActivity: '47.11-3-02 - Comércio varejista'
    });
    
    updateFormData('legalName', 'EMPRESA EXEMPLO LTDA');
    updateFormData('tradeName', 'Loja Exemplo');
    setIsLoadingCNPJ(false);
  };

  const handleCEPSearch = async () => {
    if (formData.cep.length < 8) return;
    
    // Simulate CEP lookup
    updateFormData('street', 'Avenida Paulista');
    updateFormData('neighborhood', 'Bela Vista');
    updateFormData('city', 'São Paulo');
    updateFormData('state', 'SP');
  };

  const handleSubmit = () => {
    console.log('Creating merchant:', formData);
    // Would call API here
    navigate(createPageUrl('AdminIntMerchantsList'));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.document && formData.legalName && formData.tradeName;
      case 2:
        return formData.contactName && formData.contactEmail && formData.contactPhone && formData.cep && formData.street && formData.number;
      case 3:
        return formData.segment && formData.volumeRange && (formData.methodCard || formData.methodPix || formData.methodBoleto);
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <PageHeader
        title="Novo Merchant"
        subtitle="Cadastrar novo cliente na plataforma"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Merchants', page: 'AdminIntMerchantsList' },
          { label: 'Novo', page: 'AdminIntNewMerchant' }
        ]}
      />

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.id 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary' : 'text-slate-400'}`}>
                  Etapa {step.id}
                </p>
                <p className="text-xs text-slate-500">{step.title}</p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded ${
                currentStep > step.id ? 'bg-primary' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Dados Básicos */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Básicos</CardTitle>
            <CardDescription>Informações cadastrais da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Tipo de Pessoa *</Label>
              <RadioGroup
                value={formData.personType}
                onValueChange={(value) => updateFormData('personType', value)}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pj" id="pj" />
                  <Label htmlFor="pj">Pessoa Jurídica (CNPJ)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pf" id="pf" />
                  <Label htmlFor="pf">Pessoa Física (CPF)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>{formData.personType === 'pj' ? 'CNPJ' : 'CPF'} *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder={formData.personType === 'pj' ? '00.000.000/0000-00' : '000.000.000-00'}
                  value={formData.document}
                  onChange={(e) => updateFormData('document', e.target.value)}
                />
                {formData.personType === 'pj' && (
                  <Button variant="outline" onClick={handleCNPJSearch} disabled={isLoadingCNPJ}>
                    {isLoadingCNPJ ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            {cnpjData && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <p className="text-sm font-medium text-green-800 mb-2">📋 Dados da Receita Federal</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-slate-500">Razão Social:</span> {cnpjData.legalName}</div>
                    <div><span className="text-slate-500">Nome Fantasia:</span> {cnpjData.tradeName}</div>
                    <div><span className="text-slate-500">Situação:</span> <Badge className="bg-green-500">✅ {cnpjData.status}</Badge></div>
                    <div><span className="text-slate-500">Data Abertura:</span> {cnpjData.openDate}</div>
                    <div className="col-span-2"><span className="text-slate-500">Natureza Jurídica:</span> {cnpjData.legalNature}</div>
                    <div className="col-span-2"><span className="text-slate-500">Atividade Principal:</span> {cnpjData.mainActivity}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label>Razão Social *</Label>
              <Input
                value={formData.legalName}
                onChange={(e) => updateFormData('legalName', e.target.value)}
              />
            </div>

            <div>
              <Label>Nome Fantasia *</Label>
              <Input
                value={formData.tradeName}
                onChange={(e) => updateFormData('tradeName', e.target.value)}
              />
            </div>

            <div>
              <Label>Inscrição Estadual</Label>
              <div className="flex items-center gap-4">
                <Input
                  value={formData.stateRegistration}
                  onChange={(e) => updateFormData('stateRegistration', e.target.value)}
                  disabled={formData.stateRegistrationExempt}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ie-exempt"
                    checked={formData.stateRegistrationExempt}
                    onCheckedChange={(checked) => updateFormData('stateRegistrationExempt', checked)}
                  />
                  <Label htmlFor="ie-exempt">Isento de IE</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Website</Label>
              <Input
                type="url"
                placeholder="https://www.exemplo.com.br"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Contato e Endereço */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Contato e Endereço</CardTitle>
            <CardDescription>Informações de contato e localização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-4">Contato Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Responsável *</Label>
                  <Input
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cargo/Função</Label>
                  <Input
                    value={formData.contactRole}
                    onChange={(e) => updateFormData('contactRole', e.target.value)}
                  />
                </div>
                <div>
                  <Label>E-mail *</Label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Telefone *</Label>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>CEP *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="00000-000"
                      value={formData.cep}
                      onChange={(e) => updateFormData('cep', e.target.value)}
                      onBlur={handleCEPSearch}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="md:col-span-2">
                  <Label>Logradouro *</Label>
                  <Input
                    value={formData.street}
                    onChange={(e) => updateFormData('street', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Número *</Label>
                  <Input
                    value={formData.number}
                    onChange={(e) => updateFormData('number', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Complemento</Label>
                  <Input
                    value={formData.complement}
                    onChange={(e) => updateFormData('complement', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label>Bairro *</Label>
                  <Input
                    value={formData.neighborhood}
                    onChange={(e) => updateFormData('neighborhood', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cidade *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label>UF *</Label>
                  <Select value={formData.state} onValueChange={(v) => updateFormData('state', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Comercial e Métodos */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Comercial e Métodos de Pagamento</CardTitle>
            <CardDescription>Configurações comerciais e métodos desejados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Segmento de Atuação *</Label>
                <Select value={formData.segment} onValueChange={(v) => updateFormData('segment', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SEGMENTS.map(seg => (
                      <SelectItem key={seg.value} value={seg.value}>{seg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Volume Mensal Estimado *</Label>
                <Select value={formData.volumeRange} onValueChange={(v) => updateFormData('volumeRange', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {VOLUME_RANGES.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ticket Médio Estimado *</Label>
                <Input
                  type="number"
                  placeholder="R$ 0,00"
                  value={formData.averageTicket}
                  onChange={(e) => updateFormData('averageTicket', e.target.value)}
                />
              </div>
              <div>
                <Label>Comercial Responsável</Label>
                <Select value={formData.salesRep} onValueChange={(v) => updateFormData('salesRep', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                    <SelectItem value="joao">João Silva</SelectItem>
                    <SelectItem value="ana">Ana Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Métodos de Pagamento *</Label>
              <div className="space-y-3">
                <Card className={`cursor-pointer transition-all ${formData.methodCard ? 'border-blue-500 bg-blue-50' : ''}`} 
                      onClick={() => updateFormData('methodCard', !formData.methodCard)}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <Checkbox checked={formData.methodCard} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Cartão de Crédito e Débito</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Bandeiras: Visa, Mastercard, Elo, Amex, Hiper</p>
                      <p className="text-sm text-slate-500">Taxa padrão: 4.49% + R$ 0,00 (configurável após cadastro)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${formData.methodPix ? 'border-green-500 bg-green-50' : ''}`}
                      onClick={() => updateFormData('methodPix', !formData.methodPix)}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <Checkbox checked={formData.methodPix} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-green-500" />
                        <span className="font-medium">PIX</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Liquidação: Instantânea (D+0)</p>
                      <p className="text-sm text-slate-500">Taxa padrão: 0.99% (configurável após cadastro)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${formData.methodBoleto ? 'border-amber-500 bg-amber-50' : ''}`}
                      onClick={() => updateFormData('methodBoleto', !formData.methodBoleto)}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <Checkbox checked={formData.methodBoleto} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-500" />
                        <span className="font-medium">Boleto Bancário</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Compensação: D+0 ou D+1</p>
                      <p className="text-sm text-slate-500">Taxa padrão: R$ 2,50 por boleto (configurável após cadastro)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Status Inicial</Label>
              <RadioGroup
                value={formData.initialStatus}
                onValueChange={(v) => updateFormData('initialStatus', v)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lead" id="status-lead" />
                  <Label htmlFor="status-lead">Lead (apenas cadastro, sem operação)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kyc_pending" id="status-kyc" />
                  <Label htmlFor="status-kyc">Em Análise (iniciar processo de KYC)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="status-active" />
                  <Label htmlFor="status-active" className="text-slate-400">Ativo (pular KYC - apenas para gerentes)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Revisão */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Dados Básicos</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">CNPJ:</span> {formData.document}</div>
              <div><span className="text-slate-500">Razão Social:</span> {formData.legalName}</div>
              <div><span className="text-slate-500">Nome Fantasia:</span> {formData.tradeName}</div>
              <div><span className="text-slate-500">Website:</span> {formData.website || '—'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Contato</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Responsável:</span> {formData.contactName} {formData.contactRole && `(${formData.contactRole})`}</div>
              <div><span className="text-slate-500">E-mail:</span> {formData.contactEmail}</div>
              <div><span className="text-slate-500">Telefone:</span> {formData.contactPhone}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Endereço</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{formData.street}, {formData.number} {formData.complement && `- ${formData.complement}`}</p>
              <p>{formData.neighborhood} - {formData.city}/{formData.state} - CEP {formData.cep}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Comercial e Métodos</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                <Edit className="w-4 h-4 mr-1" /> Editar
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">Segmento:</span> {SEGMENTS.find(s => s.value === formData.segment)?.label}</div>
              <div><span className="text-slate-500">Volume Est.:</span> {VOLUME_RANGES.find(v => v.value === formData.volumeRange)?.label}</div>
              <div><span className="text-slate-500">Ticket Médio:</span> R$ {formData.averageTicket}</div>
              <div><span className="text-slate-500">Comercial:</span> {formData.salesRep || '—'}</div>
              <div className="col-span-2">
                <span className="text-slate-500">Métodos:</span>
                <span className="ml-2">
                  {formData.methodCard && <Badge className="mr-1">💳 Cartão</Badge>}
                  {formData.methodPix && <Badge className="mr-1">⚡ PIX</Badge>}
                  {formData.methodBoleto && <Badge>📄 Boleto</Badge>}
                </span>
              </div>
              <div><span className="text-slate-500">Status Inicial:</span> {formData.initialStatus === 'lead' ? 'Lead' : formData.initialStatus === 'kyc_pending' ? 'Em Análise' : 'Ativo'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações Automáticas Após Criação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="welcome-email"
                  checked={formData.sendWelcomeEmail}
                  onCheckedChange={(checked) => updateFormData('sendWelcomeEmail', checked)}
                />
                <Label htmlFor="welcome-email">Enviar e-mail de boas-vindas ao merchant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="kyc-task"
                  checked={formData.createKycTask}
                  onCheckedChange={(checked) => updateFormData('createKycTask', checked)}
                />
                <Label htmlFor="kyc-task">Criar tarefa de KYC para equipe de compliance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-sales"
                  checked={formData.notifySalesRep}
                  onCheckedChange={(checked) => updateFormData('notifySalesRep', checked)}
                />
                <Label htmlFor="notify-sales">Notificar comercial responsável via Slack</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(createPageUrl('AdminIntMerchantsList'))}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {currentStep > 1 ? 'Voltar' : 'Cancelar'}
        </Button>

        {currentStep < 4 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
            Próximo: {STEPS[currentStep]?.title}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2">
            <Building2 className="w-4 h-4" /> Criar Merchant
          </Button>
        )}
      </div>
    </div>
  );
}