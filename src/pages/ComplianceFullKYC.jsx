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
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import FormSection from '@/components/compliance/FormSection';
import DynamicRepeater from '@/components/compliance/DynamicRepeater';
import { 
  ArrowLeft, ArrowRight, Building2, Briefcase, Scale, Users, Phone, Shield, 
  FileCheck, Activity, Store, Lock, FileText, Check
} from 'lucide-react';

export default function ComplianceFullKYC() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 6;

  const [formData, setFormData] = useState({
    // Section 1: Dados Cadastrais
    cnpj: '', corporateName: '', tradeName: '', companyType: '', commercialAddress: '',
    activityStartDate: '', numEmployees: '', otherOfficesAddress: '',
    
    // Section 2: Atividade
    mainProductType: '', productServiceDescription: '', businessScope: '',
    estimatedMonthlyVolume: '', avgTicket: '', corporateWebsite: '',
    salesChannels: [], growthExpectation: '',
    
    // Section 3: Licenciamento
    requiresLicense: '', regulatoryBody: '', registrationNumber: '',
    
    // Section 4: UBO e Sócios
    isPublicCompany: '',
    uboList: [],
    partnersAdminsDirectors: [],
    
    // Section 5: Compliance/Risco
    inSanctionLists: '', operatesWithCrypto: '', operatesWithGambling: '',
    operatesInHighRiskActivity: '', hasPldFtPolicy: '', performsKycKybClients: '',
    hasTransactionMonitoringSystem: '',
    
    // Section 6: Declarações
    declarationsTrueAndComplete: false,
    declarationsNoIllegalActivities: false,
    declarationsAuthorizeVerification: false,
    termsAndConditionsAccepted: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRepeaterChange = (fieldId, index, subField, value) => {
    setFormData(prev => {
      const newItems = [...prev[fieldId]];
      newItems[index] = { ...newItems[index], [subField]: value };
      return { ...prev, [fieldId]: newItems };
    });
  };

  const handleAddItem = (fieldId, newItem) => {
    setFormData(prev => ({ ...prev, [fieldId]: [...prev[fieldId], newItem] }));
  };

  const handleRemoveItem = (fieldId, index) => {
    setFormData(prev => ({ ...prev, [fieldId]: prev[fieldId].filter((_, i) => i !== index) }));
  };

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem('compliance_data', JSON.stringify(formData));
    navigate(createPageUrl('LivenessFacematchStep'));
  };

  const progressPercent = (currentSection / totalSections) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#00D26A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">PS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Compliance Completo (KYC/KYB)</h1>
          <p className="text-gray-500">Etapa {currentSection} de {totalSections}</p>
          <div className="max-w-md mx-auto mt-4">
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Dados Cadastrais */}
          {currentSection === 1 && (
            <FormSection title="Dados Cadastrais da Empresa" subtitle="Informações básicas" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={(e) => handleChange('cnpj', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Razão Social</Label>
                  <Input placeholder="Nome da empresa" value={formData.corporateName} onChange={(e) => handleChange('corporateName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nome Fantasia</Label>
                  <Input placeholder="Nome comercial" value={formData.tradeName} onChange={(e) => handleChange('tradeName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Empresa</Label>
                  <Select onValueChange={(v) => handleChange('companyType', v)} value={formData.companyType}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ltda">Sociedade Limitada</SelectItem>
                      <SelectItem value="sa">S.A.</SelectItem>
                      <SelectItem value="eireli">EIRELI</SelectItem>
                      <SelectItem value="mei">MEI</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de Início das Atividades</Label>
                  <Input type="date" value={formData.activityStartDate} onChange={(e) => handleChange('activityStartDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade de Colaboradores</Label>
                  <Select onValueChange={(v) => handleChange('numEmployees', v)} value={formData.numEmployees}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1 a 10</SelectItem>
                      <SelectItem value="11-50">11 a 50</SelectItem>
                      <SelectItem value="51-200">51 a 200</SelectItem>
                      <SelectItem value="201-500">201 a 500</SelectItem>
                      <SelectItem value="500+">Mais de 500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço Comercial (CNPJ)</Label>
                  <Textarea placeholder="Endereço completo" value={formData.commercialAddress} onChange={(e) => handleChange('commercialAddress', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Outros Escritórios (opcional)</Label>
                  <Textarea placeholder="Endereços de outros escritórios, se houver" value={formData.otherOfficesAddress} onChange={(e) => handleChange('otherOfficesAddress', e.target.value)} />
                </div>
              </div>
            </FormSection>
          )}

          {/* Section 2: Atividade e Negócios */}
          {currentSection === 2 && (
            <FormSection title="Atividade e Negócios" subtitle="Detalhes da operação" icon={Briefcase}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo Principal de Produto/Serviço</Label>
                  <Select onValueChange={(v) => handleChange('mainProductType', v)} value={formData.mainProductType}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software">Software (SaaS)</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="services">Serviços Digitais</SelectItem>
                      <SelectItem value="education">Educação/Cursos</SelectItem>
                      <SelectItem value="health">Saúde/Bem-estar</SelectItem>
                      <SelectItem value="food">Alimentação</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Site Corporativo</Label>
                  <Input type="url" placeholder="https://" value={formData.corporateWebsite} onChange={(e) => handleChange('corporateWebsite', e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Descrição dos Produtos/Serviços</Label>
                  <Textarea placeholder="Descreva seus produtos ou serviços..." value={formData.productServiceDescription} onChange={(e) => handleChange('productServiceDescription', e.target.value)} rows={3} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Escopo do Negócio</Label>
                  <Textarea placeholder="Descreva detalhadamente a atividade da empresa..." value={formData.businessScope} onChange={(e) => handleChange('businessScope', e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Volume Mensal Estimado (R$)</Label>
                  <Select onValueChange={(v) => handleChange('estimatedMonthlyVolume', v)} value={formData.estimatedMonthlyVolume}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-10k">Até R$ 10.000</SelectItem>
                      <SelectItem value="10k-50k">R$ 10.000 - R$ 50.000</SelectItem>
                      <SelectItem value="50k-100k">R$ 50.000 - R$ 100.000</SelectItem>
                      <SelectItem value="100k-500k">R$ 100.000 - R$ 500.000</SelectItem>
                      <SelectItem value="500k-1m">R$ 500.000 - R$ 1.000.000</SelectItem>
                      <SelectItem value="1m+">Acima de R$ 1.000.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ticket Médio (R$)</Label>
                  <Select onValueChange={(v) => handleChange('avgTicket', v)} value={formData.avgTicket}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50">Até R$ 50</SelectItem>
                      <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                      <SelectItem value="100-500">R$ 100 - R$ 500</SelectItem>
                      <SelectItem value="500-1k">R$ 500 - R$ 1.000</SelectItem>
                      <SelectItem value="1k+">Acima de R$ 1.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Canais de Venda</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {['Site próprio', 'App móvel', 'WhatsApp', 'Link de pagamento', 'Loja física', 'Marketplace', 'Televendas'].map(channel => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ch-${channel}`}
                          checked={formData.salesChannels.includes(channel)}
                          onCheckedChange={(checked) => {
                            if (checked) handleChange('salesChannels', [...formData.salesChannels, channel]);
                            else handleChange('salesChannels', formData.salesChannels.filter(c => c !== channel));
                          }}
                        />
                        <Label htmlFor={`ch-${channel}`} className="text-sm font-normal">{channel}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FormSection>
          )}

          {/* Section 3: Licenciamento */}
          {currentSection === 3 && (
            <FormSection title="Licenciamento e Regulação" subtitle="Licenças necessárias" icon={Scale}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>A empresa necessita de licença para operar?</Label>
                  <RadioGroup value={formData.requiresLicense} onValueChange={(v) => handleChange('requiresLicense', v)} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="rl-yes" />
                      <Label htmlFor="rl-yes" className="font-normal">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="rl-no" />
                      <Label htmlFor="rl-no" className="font-normal">Não</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.requiresLicense === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Órgão Regulador</Label>
                      <Input placeholder="Ex: ANVISA, CVM, BACEN" value={formData.regulatoryBody} onChange={(e) => handleChange('regulatoryBody', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Número de Registro/Licença</Label>
                      <Input placeholder="Número do registro" value={formData.registrationNumber} onChange={(e) => handleChange('registrationNumber', e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </FormSection>
          )}

          {/* Section 4: UBO e Sócios */}
          {currentSection === 4 && (
            <FormSection title="Beneficiários Finais e Sócios" subtitle="Estrutura societária" icon={Users}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>A empresa é de capital aberto?</Label>
                  <RadioGroup value={formData.isPublicCompany} onValueChange={(v) => handleChange('isPublicCompany', v)} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pc-yes" />
                      <Label htmlFor="pc-yes" className="font-normal">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pc-no" />
                      <Label htmlFor="pc-no" className="font-normal">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.isPublicCompany === 'no' && (
                  <DynamicRepeater
                    label="Beneficiários Finais (participação > 25%)"
                    items={formData.uboList}
                    onAddItem={() => handleAddItem('uboList', { name: '', cpf: '', participation: '', isPEP: '' })}
                    onRemoveItem={(idx) => handleRemoveItem('uboList', idx)}
                    addLabel="Adicionar beneficiário"
                    renderItem={(item, idx) => (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome Completo</Label>
                          <Input value={item.name} onChange={(e) => handleRepeaterChange('uboList', idx, 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>CPF</Label>
                          <Input value={item.cpf} onChange={(e) => handleRepeaterChange('uboList', idx, 'cpf', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>% Participação</Label>
                          <Input type="number" value={item.participation} onChange={(e) => handleRepeaterChange('uboList', idx, 'participation', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <Label>É PEP?</Label>
                          <RadioGroup value={item.isPEP} onValueChange={(v) => handleRepeaterChange('uboList', idx, 'isPEP', v)} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id={`pep-${idx}-yes`} />
                              <Label htmlFor={`pep-${idx}-yes`} className="font-normal">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id={`pep-${idx}-no`} />
                              <Label htmlFor={`pep-${idx}-no`} className="font-normal">Não</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  />
                )}

                <DynamicRepeater
                  label="Sócios / Administradores / Diretores"
                  items={formData.partnersAdminsDirectors}
                  onAddItem={() => handleAddItem('partnersAdminsDirectors', { name: '', role: '', cpf: '', email: '' })}
                  onRemoveItem={(idx) => handleRemoveItem('partnersAdminsDirectors', idx)}
                  addLabel="Adicionar pessoa"
                  renderItem={(item, idx) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome Completo</Label>
                        <Input value={item.name} onChange={(e) => handleRepeaterChange('partnersAdminsDirectors', idx, 'name', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Select onValueChange={(v) => handleRepeaterChange('partnersAdminsDirectors', idx, 'role', v)} value={item.role}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="socio">Sócio</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="diretor">Diretor</SelectItem>
                            <SelectItem value="procurador">Procurador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>CPF</Label>
                        <Input value={item.cpf} onChange={(e) => handleRepeaterChange('partnersAdminsDirectors', idx, 'cpf', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input type="email" value={item.email} onChange={(e) => handleRepeaterChange('partnersAdminsDirectors', idx, 'email', e.target.value)} />
                      </div>
                    </div>
                  )}
                />
              </div>
            </FormSection>
          )}

          {/* Section 5: Compliance */}
          {currentSection === 5 && (
            <FormSection title="Compliance e Controles" subtitle="Perguntas de risco" icon={Shield}>
              <div className="space-y-6">
                {[
                  { id: 'inSanctionLists', label: 'Algum sócio ou beneficiário está em listas de sanções?' },
                  { id: 'operatesWithCrypto', label: 'A empresa opera com criptomoedas?' },
                  { id: 'operatesWithGambling', label: 'A empresa opera com jogos ou apostas?' },
                  { id: 'operatesInHighRiskActivity', label: 'Atua em atividade de alto risco (nutra, viagens, leilões)?' },
                  { id: 'hasPldFtPolicy', label: 'Possui Política de PLD/FT documentada?' },
                  { id: 'performsKycKybClients', label: 'Realiza KYC/KYB dos próprios clientes?' },
                  { id: 'hasTransactionMonitoringSystem', label: 'Possui sistema de monitoramento de transações?' },
                ].map((question) => (
                  <div key={question.id} className="space-y-3 p-4 bg-slate-50 rounded-lg">
                    <Label>{question.label}</Label>
                    <RadioGroup value={formData[question.id]} onValueChange={(v) => handleChange(question.id, v)} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                        <Label htmlFor={`${question.id}-yes`} className="font-normal">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${question.id}-no`} />
                        <Label htmlFor={`${question.id}-no`} className="font-normal">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </FormSection>
          )}

          {/* Section 6: Declarações */}
          {currentSection === 6 && (
            <FormSection title="Declarações e Termos" subtitle="Confirmação final" icon={FileText}>
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    { id: 'declarationsTrueAndComplete', label: 'Declaro que todas as informações são verdadeiras e completas' },
                    { id: 'declarationsNoIllegalActivities', label: 'Declaro que a empresa não atua em atividades ilegais ou proibidas' },
                    { id: 'declarationsAuthorizeVerification', label: 'Autorizo a PagSmile a verificar os dados junto a bureaus e fontes públicas' },
                  ].map((decl) => (
                    <div key={decl.id} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                      <Checkbox 
                        id={decl.id} 
                        checked={formData[decl.id]} 
                        onCheckedChange={(c) => handleChange(decl.id, c)} 
                      />
                      <Label htmlFor={decl.id} className="text-sm font-normal leading-relaxed cursor-pointer">
                        {decl.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Termo de Responsabilidade e Veracidade</h4>
                  <div className="h-32 overflow-y-auto bg-slate-50 rounded p-3 text-sm text-gray-600 mb-4">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                    <p className="mt-2">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="termsAndConditionsAccepted" 
                      checked={formData.termsAndConditionsAccepted} 
                      onCheckedChange={(c) => handleChange('termsAndConditionsAccepted', c)} 
                    />
                    <Label htmlFor="termsAndConditionsAccepted" className="text-sm font-normal">
                      Li, compreendi e <strong>ACEITO INTEGRALMENTE</strong> o Termo de Responsabilidade e Veracidade
                    </Label>
                  </div>
                </div>
              </div>
            </FormSection>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            {currentSection === 1 ? (
              <Button variant="ghost" asChild>
                <Link to={createPageUrl('ComplianceOnboardingStart')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
            
            {currentSection < totalSections ? (
              <Button onClick={handleNext} className="bg-[#00D26A] hover:bg-[#00A854]">
                Próxima Etapa <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#00D26A] hover:bg-[#00A854]">
                Enviar para Análise <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}