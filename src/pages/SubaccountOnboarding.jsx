import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  User,
  FileText,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const steps = [
  { id: 1, title: 'Dados da Empresa', icon: Building2 },
  { id: 2, title: 'Sócios', icon: User },
  { id: 3, title: 'Documentos', icon: FileText },
  { id: 4, title: 'Conta Bancária', icon: CreditCard },
  { id: 5, title: 'Revisão', icon: CheckCircle2 },
];

const mccOptions = [
  { value: '5411', label: '5411 - Supermercados e Mercearias' },
  { value: '5812', label: '5812 - Restaurantes' },
  { value: '5691', label: '5691 - Vestuário' },
  { value: '5732', label: '5732 - Eletrônicos' },
  { value: '7311', label: '7311 - Publicidade' },
  { value: '8099', label: '8099 - Serviços de Saúde' },
  { value: '5999', label: '5999 - Varejo em Geral' },
];

export default function SubaccountOnboarding() {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company data
    document: '',
    business_name: '',
    legal_name: '',
    mcc: '',
    email: '',
    phone: '',
    website: '',
    opening_date: '',
    address: {
      zip_code: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    // Partners
    partners: [{
      name: '',
      cpf: '',
      birth_date: '',
      ownership_percentage: 100,
      is_legal_representative: true
    }],
    // Documents
    documents: [],
    // Bank account
    bank_account: {
      bank_code: '',
      bank_name: '',
      agency: '',
      account_number: '',
      account_digit: '',
      account_type: 'checking',
      pix_key: '',
      pix_key_type: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Subaccount.create({
      ...data,
      subaccount_id: `SUB-${Date.now()}`,
      status: 'under_review',
      onboarding_step: 5,
      onboarding_completed: true
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subaccounts'] });
      toast.success('Subconta cadastrada com sucesso! Aguardando análise.');
      window.location.href = createPageUrl('Subaccounts');
    }
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const addPartner = () => {
    setFormData(prev => ({
      ...prev,
      partners: [...prev.partners, {
        name: '',
        cpf: '',
        birth_date: '',
        ownership_percentage: 0,
        is_legal_representative: false
      }]
    }));
  };

  const removePartner = (index) => {
    setFormData(prev => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== index)
    }));
  };

  const updatePartner = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      partners: prev.partners.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    createMutation.mutate(formData);
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nova Subconta"
        subtitle="Cadastre uma nova subconta no seu marketplace"
        breadcrumbs={[
          { label: 'Subcontas', href: 'SubaccountsDashboard' },
          { label: 'Novo Cadastro' }
        ]}
      />

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                  currentStep > step.id ? "bg-green-500 text-white" :
                  currentStep === step.id ? "bg-blue-500 text-white" :
                  "bg-gray-200 text-gray-500"
                )}>
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "ml-2 text-sm font-medium hidden md:block",
                  currentStep >= step.id ? "text-gray-900" : "text-gray-500"
                )}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4",
                    currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Company Data */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Dados da Empresa
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CNPJ *</Label>
                  <Input
                    value={formData.document}
                    onChange={(e) => updateField('document', e.target.value)}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Razão Social *</Label>
                  <Input
                    value={formData.legal_name}
                    onChange={(e) => updateField('legal_name', e.target.value)}
                    placeholder="Razão Social da Empresa LTDA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome Fantasia *</Label>
                  <Input
                    value={formData.business_name}
                    onChange={(e) => updateField('business_name', e.target.value)}
                    placeholder="Nome Fantasia"
                  />
                </div>
                <div className="space-y-2">
                  <Label>MCC (Categoria) *</Label>
                  <Select
                    value={formData.mcc}
                    onValueChange={(value) => updateField('mcc', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mccOptions.map(mcc => (
                        <SelectItem key={mcc.value} value={mcc.value}>
                          {mcc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>E-mail Comercial *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone Comercial *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://www.empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Abertura</Label>
                  <Input
                    type="date"
                    value={formData.opening_date}
                    onChange={(e) => updateField('opening_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Endereço Comercial</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>CEP *</Label>
                    <Input
                      value={formData.address.zip_code}
                      onChange={(e) => updateNestedField('address', 'zip_code', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Rua *</Label>
                    <Input
                      value={formData.address.street}
                      onChange={(e) => updateNestedField('address', 'street', e.target.value)}
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número *</Label>
                    <Input
                      value={formData.address.number}
                      onChange={(e) => updateNestedField('address', 'number', e.target.value)}
                      placeholder="123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input
                      value={formData.address.complement}
                      onChange={(e) => updateNestedField('address', 'complement', e.target.value)}
                      placeholder="Sala 101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bairro *</Label>
                    <Input
                      value={formData.address.neighborhood}
                      onChange={(e) => updateNestedField('address', 'neighborhood', e.target.value)}
                      placeholder="Bairro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade *</Label>
                    <Input
                      value={formData.address.city}
                      onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado *</Label>
                    <Select
                      value={formData.address.state}
                      onValueChange={(value) => updateNestedField('address', 'state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
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
            </div>
          )}

          {/* Step 2: Partners */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Sócios e Representantes
                </h3>
                <Button variant="outline" size="sm" onClick={addPartner}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Sócio
                </Button>
              </div>

              {formData.partners.map((partner, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sócio {index + 1}</span>
                    {formData.partners.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => removePartner(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo *</Label>
                      <Input
                        value={partner.name}
                        onChange={(e) => updatePartner(index, 'name', e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CPF *</Label>
                      <Input
                        value={partner.cpf}
                        onChange={(e) => updatePartner(index, 'cpf', e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Nascimento *</Label>
                      <Input
                        type="date"
                        value={partner.birth_date}
                        onChange={(e) => updatePartner(index, 'birth_date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Participação Societária (%)</Label>
                      <Input
                        type="number"
                        value={partner.ownership_percentage}
                        onChange={(e) => updatePartner(index, 'ownership_percentage', parseFloat(e.target.value))}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={partner.is_legal_representative}
                      onChange={(e) => updatePartner(index, 'is_legal_representative', e.target.checked)}
                      className="rounded"
                    />
                    <Label className="font-normal">Este sócio é representante legal da empresa</Label>
                  </div>
                </div>
              ))}

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Todos os sócios com participação acima de 25% devem ser cadastrados. 
                  Ao menos um representante legal é obrigatório.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type: 'contrato_social', label: 'Contrato Social / Estatuto' },
                  { type: 'cartao_cnpj', label: 'Cartão CNPJ' },
                  { type: 'comprovante_endereco', label: 'Comprovante de Endereço' },
                  { type: 'documento_socio', label: 'RG ou CNH dos Sócios' },
                ].map(doc => (
                  <div key={doc.type} className="p-4 border-2 border-dashed rounded-lg text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium text-sm">{doc.label}</p>
                    <p className="text-xs text-gray-500 mb-3">PDF, PNG ou JPG até 10MB</p>
                    <Button variant="outline" size="sm">
                      Selecionar Arquivo
                    </Button>
                  </div>
                ))}
              </div>

              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  Os documentos serão validados automaticamente. 
                  Documentos ilegíveis ou inválidos podem atrasar a aprovação.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 4: Bank Account */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Conta Bancária para Recebimentos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Banco *</Label>
                  <Select
                    value={formData.bank_account.bank_code}
                    onValueChange={(value) => {
                      const banks = { '001': 'Banco do Brasil', '341': 'Itaú', '033': 'Santander', '104': 'Caixa', '237': 'Bradesco', '260': 'Nubank' };
                      updateNestedField('bank_account', 'bank_code', value);
                      updateNestedField('bank_account', 'bank_name', banks[value] || '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                      <SelectItem value="341">341 - Itaú</SelectItem>
                      <SelectItem value="033">033 - Santander</SelectItem>
                      <SelectItem value="104">104 - Caixa</SelectItem>
                      <SelectItem value="237">237 - Bradesco</SelectItem>
                      <SelectItem value="260">260 - Nubank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Conta *</Label>
                  <Select
                    value={formData.bank_account.account_type}
                    onValueChange={(value) => updateNestedField('bank_account', 'account_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Conta Corrente</SelectItem>
                      <SelectItem value="savings">Conta Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Agência *</Label>
                  <Input
                    value={formData.bank_account.agency}
                    onChange={(e) => updateNestedField('bank_account', 'agency', e.target.value)}
                    placeholder="0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conta *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.bank_account.account_number}
                      onChange={(e) => updateNestedField('bank_account', 'account_number', e.target.value)}
                      placeholder="00000000"
                      className="flex-1"
                    />
                    <Input
                      value={formData.bank_account.account_digit}
                      onChange={(e) => updateNestedField('bank_account', 'account_digit', e.target.value)}
                      placeholder="0"
                      className="w-16"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Chave Pix (opcional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Chave</Label>
                    <Select
                      value={formData.bank_account.pix_key_type}
                      onValueChange={(value) => updateNestedField('bank_account', 'pix_key_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="random">Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Chave Pix</Label>
                    <Input
                      value={formData.bank_account.pix_key}
                      onChange={(e) => updateNestedField('bank_account', 'pix_key', e.target.value)}
                      placeholder="Informe a chave"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Revisão do Cadastro
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Empresa
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">CNPJ:</span> {formData.document || '-'}</p>
                      <p><span className="text-gray-500">Razão Social:</span> {formData.legal_name || '-'}</p>
                      <p><span className="text-gray-500">Nome Fantasia:</span> {formData.business_name || '-'}</p>
                      <p><span className="text-gray-500">MCC:</span> {formData.mcc || '-'}</p>
                      <p><span className="text-gray-500">E-mail:</span> {formData.email || '-'}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Sócios
                    </h4>
                    <div className="space-y-2 text-sm">
                      {formData.partners.map((p, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span>{p.name || `Sócio ${i + 1}`}</span>
                          <Badge variant="outline">{p.ownership_percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Conta Bancária
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Banco:</span> {formData.bank_account.bank_name || '-'}</p>
                      <p><span className="text-gray-500">Agência:</span> {formData.bank_account.agency || '-'}</p>
                      <p><span className="text-gray-500">Conta:</span> {formData.bank_account.account_number}-{formData.bank_account.account_digit}</p>
                      {formData.bank_account.pix_key && (
                        <p><span className="text-gray-500">Pix:</span> {formData.bank_account.pix_key}</p>
                      )}
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      Após o envio, o cadastro será analisado automaticamente pelo nosso sistema de IA.
                      Você receberá uma notificação com o resultado em até 24 horas.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>

            {currentStep < 5 ? (
              <Button onClick={handleNext}>
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enviar Cadastro
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}