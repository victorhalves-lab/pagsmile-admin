import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import FormSection from '@/components/compliance/FormSection';
import { ArrowLeft, ArrowRight, Building2, Users, Wallet, FileText } from 'lucide-react';

export default function CompliancePixOnly() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Dados Cadastrais
    corporateName: '',
    tradeName: '',
    cnpj: '',
    activityStartDate: '',
    numEmployees: '',
    commercialAddress: '',
    
    // Atividade
    businessScope: '',
    estimatedMonthlyValue: '',
    avgTicket: '',
    corporateWebsite: '',
    
    // Responsável
    responsibleName: '',
    responsibleRole: '',
    responsibleEmail: '',
    responsiblePhone: '',
    
    // Financeiro
    currentPixCost: '',
    currentPixCostType: 'percentage',
    
    // Declarações
    agreeToTerms: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    localStorage.setItem('compliance_data', JSON.stringify(formData));
    navigate(createPageUrl('LivenessFacematchStep'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#00D26A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Compliance PIX</h1>
          <p className="text-gray-500">Processo simplificado para operações PIX</p>
        </div>

        <div className="space-y-6">
          {/* Seção 1: Dados Cadastrais */}
          <FormSection title="Dados Cadastrais" subtitle="Informações básicas da empresa" icon={Building2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razão Social</Label>
                <Input 
                  placeholder="Nome da empresa" 
                  value={formData.corporateName} 
                  onChange={(e) => handleChange('corporateName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Nome Fantasia</Label>
                <Input 
                  placeholder="Nome comercial" 
                  value={formData.tradeName} 
                  onChange={(e) => handleChange('tradeName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input 
                  placeholder="00.000.000/0000-00" 
                  value={formData.cnpj} 
                  onChange={(e) => handleChange('cnpj', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Início das Atividades</Label>
                <Input 
                  type="date" 
                  value={formData.activityStartDate} 
                  onChange={(e) => handleChange('activityStartDate', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Quantidade de Colaboradores</Label>
                <Select onValueChange={(v) => handleChange('numEmployees', v)} value={formData.numEmployees}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1 a 10</SelectItem>
                    <SelectItem value="11-50">11 a 50</SelectItem>
                    <SelectItem value="51-200">51 a 200</SelectItem>
                    <SelectItem value="201+">Mais de 200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Endereço Comercial</Label>
                <Textarea 
                  placeholder="Endereço completo conforme CNPJ" 
                  value={formData.commercialAddress} 
                  onChange={(e) => handleChange('commercialAddress', e.target.value)} 
                />
              </div>
            </div>
          </FormSection>

          {/* Seção 2: Atividade */}
          <FormSection title="Atividade e Negócios" subtitle="Detalhes da operação" icon={Wallet}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Escopo do Negócio</Label>
                <Textarea 
                  placeholder="Descreva a atividade principal da empresa..." 
                  value={formData.businessScope} 
                  onChange={(e) => handleChange('businessScope', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Estimativa de Volume Mensal (R$)</Label>
                <Input 
                  type="number" 
                  placeholder="0,00" 
                  value={formData.estimatedMonthlyValue} 
                  onChange={(e) => handleChange('estimatedMonthlyValue', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Ticket Médio (R$)</Label>
                <Input 
                  type="number" 
                  placeholder="0,00" 
                  value={formData.avgTicket} 
                  onChange={(e) => handleChange('avgTicket', e.target.value)} 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Site Corporativo</Label>
                <Input 
                  type="url" 
                  placeholder="https://www.suaempresa.com.br" 
                  value={formData.corporateWebsite} 
                  onChange={(e) => handleChange('corporateWebsite', e.target.value)} 
                />
              </div>
            </div>
          </FormSection>

          {/* Seção 3: Responsável */}
          <FormSection title="Responsável pelo Financeiro" subtitle="Dados do contato principal" icon={Users}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input 
                  placeholder="Nome do responsável" 
                  value={formData.responsibleName} 
                  onChange={(e) => handleChange('responsibleName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input 
                  placeholder="Ex: Diretor Financeiro" 
                  value={formData.responsibleRole} 
                  onChange={(e) => handleChange('responsibleRole', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input 
                  type="email" 
                  placeholder="email@empresa.com" 
                  value={formData.responsibleEmail} 
                  onChange={(e) => handleChange('responsibleEmail', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input 
                  placeholder="(11) 99999-9999" 
                  value={formData.responsiblePhone} 
                  onChange={(e) => handleChange('responsiblePhone', e.target.value)} 
                />
              </div>
            </div>
          </FormSection>

          {/* Seção 4: Financeiro */}
          <FormSection title="Informações Financeiras" subtitle="Custos atuais de PIX" icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Custo Atual do PIX</Label>
                <Input 
                  placeholder="Ex: 0.99 ou 1.50" 
                  value={formData.currentPixCost} 
                  onChange={(e) => handleChange('currentPixCost', e.target.value)} 
                />
              </div>
              <div className="space-y-3">
                <Label>Tipo de Custo</Label>
                <RadioGroup 
                  value={formData.currentPixCostType} 
                  onValueChange={(v) => handleChange('currentPixCostType', v)} 
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="cost-pct" />
                    <Label htmlFor="cost-pct" className="font-normal">Percentual (%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="cost-fixed" />
                    <Label htmlFor="cost-fixed" className="font-normal">Valor Fixo (R$)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </FormSection>

          {/* Declaração */}
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="agreeToTerms" 
                  checked={formData.agreeToTerms} 
                  onCheckedChange={(c) => handleChange('agreeToTerms', c)} 
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
                  Declaro que as informações fornecidas neste questionário são verdadeiras e precisas, 
                  e me comprometo a atualizá-las sempre que houver alteração. Autorizo a PagSmile a 
                  verificar os dados junto a bureaus e fontes públicas.
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button variant="ghost" asChild>
              <Link to={createPageUrl('ComplianceOnboardingStart')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Link>
            </Button>
            <Button onClick={handleSubmit} className="bg-[#00D26A] hover:bg-[#00A854]">
              Continuar para Verificação <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}