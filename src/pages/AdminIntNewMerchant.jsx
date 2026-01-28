import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, User, FileText, CreditCard, Check, ArrowRight, 
  ArrowLeft, AlertCircle, Upload, Plus, Trash2
} from 'lucide-react';

export default function AdminIntNewMerchant() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Dados Básicos
    business_name: '',
    legal_name: '',
    document: '',
    document_type: 'cnpj',
    email: '',
    phone: '',
    website: '',
    // Step 2 - Endereço e MCC
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    mcc: '',
    category: '',
    // Step 3 - Sócios
    partners: [],
    // Step 4 - Plano e Taxas
    plan: '',
    mdr_credit: '',
    mdr_debit: '',
    mdr_pix: '',
    payment_term: 'd14',
    // Step 5 - Vendedor
    commercial_agent: '',
    notes: ''
  });

  const [newPartner, setNewPartner] = useState({ name: '', cpf: '', share: '', pep: false });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPartner = () => {
    if (newPartner.name && newPartner.cpf) {
      setFormData(prev => ({
        ...prev,
        partners: [...prev.partners, { ...newPartner, id: Date.now() }]
      }));
      setNewPartner({ name: '', cpf: '', share: '', pep: false });
    }
  };

  const removePartner = (id) => {
    setFormData(prev => ({
      ...prev,
      partners: prev.partners.filter(p => p.id !== id)
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    // Mock submit
    alert('Merchant criado com sucesso! (Mock)');
    window.location.href = createPageUrl('AdminIntMerchantsList');
  };

  const steps = [
    { num: 1, label: 'Dados Básicos', icon: Building2 },
    { num: 2, label: 'Endereço & MCC', icon: FileText },
    { num: 3, label: 'Sócios', icon: User },
    { num: 4, label: 'Plano & Taxas', icon: CreditCard },
    { num: 5, label: 'Finalização', icon: Check }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Novo Merchant"
        subtitle="Cadastro manual de merchant"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Merchants', page: 'AdminIntMerchants' },
          { label: 'Novo', page: 'AdminIntNewMerchant' }
        ]}
      />

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  step === s.num 
                    ? 'bg-[#00D26A] text-white' 
                    : step > s.num 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                }`}
                onClick={() => setStep(s.num)}
              >
                <s.icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden md:inline">{s.label}</span>
                <span className="text-sm font-medium md:hidden">{s.num}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${step > s.num ? 'bg-[#00D26A]' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Step 1 - Dados Básicos */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Dados da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Documento</Label>
                    <Select value={formData.document_type} onValueChange={(v) => handleChange('document_type', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                        <SelectItem value="cpf">CPF (MEI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{formData.document_type === 'cnpj' ? 'CNPJ' : 'CPF'}</Label>
                    <Input 
                      placeholder={formData.document_type === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'}
                      value={formData.document}
                      onChange={(e) => handleChange('document', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Razão Social</Label>
                    <Input 
                      placeholder="Nome registrado"
                      value={formData.legal_name}
                      onChange={(e) => handleChange('legal_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Nome Fantasia</Label>
                    <Input 
                      placeholder="Nome comercial"
                      value={formData.business_name}
                      onChange={(e) => handleChange('business_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input 
                      type="email"
                      placeholder="contato@empresa.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input 
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Website</Label>
                    <Input 
                      placeholder="https://www.empresa.com"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Endereço e MCC */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>CEP</Label>
                    <Input 
                      placeholder="00000-000"
                      value={formData.address_zip}
                      onChange={(e) => handleChange('address_zip', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Rua</Label>
                    <Input 
                      placeholder="Nome da rua"
                      value={formData.address_street}
                      onChange={(e) => handleChange('address_street', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Número</Label>
                    <Input 
                      placeholder="123"
                      value={formData.address_number}
                      onChange={(e) => handleChange('address_number', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Complemento</Label>
                    <Input 
                      placeholder="Sala, Andar..."
                      value={formData.address_complement}
                      onChange={(e) => handleChange('address_complement', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Bairro</Label>
                    <Input 
                      placeholder="Bairro"
                      value={formData.address_neighborhood}
                      onChange={(e) => handleChange('address_neighborhood', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <Input 
                      placeholder="Cidade"
                      value={formData.address_city}
                      onChange={(e) => handleChange('address_city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Select value={formData.address_state} onValueChange={(v) => handleChange('address_state', v)}>
                      <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">SP</SelectItem>
                        <SelectItem value="RJ">RJ</SelectItem>
                        <SelectItem value="MG">MG</SelectItem>
                        <SelectItem value="RS">RS</SelectItem>
                        <SelectItem value="PR">PR</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="BA">BA</SelectItem>
                        <SelectItem value="GO">GO</SelectItem>
                        <SelectItem value="DF">DF</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Categoria e MCC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>MCC</Label>
                    <Select value={formData.mcc} onValueChange={(v) => handleChange('mcc', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione o MCC" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5411">5411 - Supermercados</SelectItem>
                        <SelectItem value="5812">5812 - Restaurantes</SelectItem>
                        <SelectItem value="5651">5651 - Varejo de Roupas</SelectItem>
                        <SelectItem value="5732">5732 - Eletrônicos</SelectItem>
                        <SelectItem value="5734">5734 - Software</SelectItem>
                        <SelectItem value="5999">5999 - Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="varejo">Varejo</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Sócios */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quadro Societário</h3>
                
                {/* Lista de sócios adicionados */}
                {formData.partners.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {formData.partners.map((partner) => (
                      <div key={partner.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <User className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-sm text-slate-500">CPF: {partner.cpf} • {partner.share}%</p>
                          </div>
                          {partner.pep && <Badge variant="destructive">PEP</Badge>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removePartner(partner.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulário para adicionar sócio */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-slate-700 dark:text-slate-300">Adicionar Sócio</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Nome Completo</Label>
                      <Input 
                        placeholder="Nome do sócio"
                        value={newPartner.name}
                        onChange={(e) => setNewPartner(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>CPF</Label>
                      <Input 
                        placeholder="000.000.000-00"
                        value={newPartner.cpf}
                        onChange={(e) => setNewPartner(p => ({ ...p, cpf: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Participação (%)</Label>
                      <Input 
                        placeholder="50"
                        type="number"
                        value={newPartner.share}
                        onChange={(e) => setNewPartner(p => ({ ...p, share: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pep" 
                          checked={newPartner.pep}
                          onCheckedChange={(c) => setNewPartner(p => ({ ...p, pep: c }))}
                        />
                        <Label htmlFor="pep" className="text-sm">PEP</Label>
                      </div>
                      <Button onClick={addPartner} size="sm">
                        <Plus className="w-4 h-4 mr-1" /> Adicionar
                      </Button>
                    </div>
                  </div>
                </div>

                {formData.partners.length === 0 && (
                  <div className="flex items-center gap-2 mt-4 text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Adicione pelo menos um sócio para continuar.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4 - Plano e Taxas */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Plano Comercial</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Plano</Label>
                    <Select value={formData.plan} onValueChange={(v) => handleChange('plan', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione o plano" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="custom">Customizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Prazo de Recebimento</Label>
                    <Select value={formData.payment_term} onValueChange={(v) => handleChange('payment_term', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="d1">D+1</SelectItem>
                        <SelectItem value="d14">D+14</SelectItem>
                        <SelectItem value="d30">D+30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Taxas (MDR)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Crédito à Vista (%)</Label>
                    <Input 
                      placeholder="2.99"
                      type="number"
                      step="0.01"
                      value={formData.mdr_credit}
                      onChange={(e) => handleChange('mdr_credit', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Débito (%)</Label>
                    <Input 
                      placeholder="1.99"
                      type="number"
                      step="0.01"
                      value={formData.mdr_debit}
                      onChange={(e) => handleChange('mdr_debit', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Pix (%)</Label>
                    <Input 
                      placeholder="0.99"
                      type="number"
                      step="0.01"
                      value={formData.mdr_pix}
                      onChange={(e) => handleChange('mdr_pix', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 - Finalização */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Vendedor Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Vendedor</Label>
                    <Select value={formData.commercial_agent} onValueChange={(v) => handleChange('commercial_agent', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione o vendedor" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joao">João Silva</SelectItem>
                        <SelectItem value="maria">Maria Santos</SelectItem>
                        <SelectItem value="pedro">Pedro Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label>Observações Internas</Label>
                <Textarea 
                  placeholder="Notas sobre o merchant..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Resumo */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <h4 className="font-semibold mb-4">Resumo do Cadastro</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Empresa</p>
                    <p className="font-medium">{formData.business_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">CNPJ</p>
                    <p className="font-medium">{formData.document || '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">MCC</p>
                    <p className="font-medium">{formData.mcc || '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Plano</p>
                    <p className="font-medium capitalize">{formData.plan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">MDR Crédito</p>
                    <p className="font-medium">{formData.mdr_credit ? `${formData.mdr_credit}%` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">MDR Pix</p>
                    <p className="font-medium">{formData.mdr_pix ? `${formData.mdr_pix}%` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Sócios</p>
                    <p className="font-medium">{formData.partners.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Vendedor</p>
                    <p className="font-medium capitalize">{formData.commercial_agent || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            
            {step < 5 ? (
              <Button onClick={nextStep} className="bg-[#00D26A] hover:bg-[#00b059]">
                Próximo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#00D26A] hover:bg-[#00b059]">
                <Check className="w-4 h-4 mr-2" /> Criar Merchant
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}