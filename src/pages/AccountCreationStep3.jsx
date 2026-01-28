import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Building2, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AccountCreationStep3() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: '',
    corporateName: '',
    tradeName: '',
    address: '',
    avgMonthlyRevenue: '',
    businessType: '',
    businessModelDetails: '',
    operationDetails: '',
    whatSells: '',
    websiteOrSocial: '',
    positionInCompany: '',
    birthDate: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCnpjLookup = () => {
    // Simula consulta CNPJ
    if (formData.cnpj.length >= 14) {
      setFormData(prev => ({
        ...prev,
        corporateName: 'Empresa Exemplo Ltda',
        tradeName: 'Empresa Exemplo',
        address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
      }));
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('onboarding_user') || '{}');
      const selectedPlan = localStorage.getItem('selected_plan');

      // Criar subaccount
      await base44.entities.Subaccount.create({
        business_name: formData.tradeName || formData.corporateName,
        legal_name: formData.corporateName,
        document: formData.cnpj,
        document_type: 'cnpj',
        email: userData.email,
        phone: userData.phone,
        status: 'pending_compliance',
        selected_plan: selectedPlan,
        onboarding_step: 3,
        website: formData.websiteOrSocial,
        kyc_data: {
          initial_data: formData,
          user_data: userData,
        }
      });

      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/6bc1f8b3d_Logo-modo-escuro.png"
              alt="PagSmile Logo"
              className="h-10"
            />
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-800">Dados da Empresa</CardTitle>
          <CardDescription className="text-gray-500">Etapa 3 de 3 - Informações do seu negócio</CardDescription>
          <div className="flex gap-2 justify-center mt-4">
            <div className="w-20 h-1.5 rounded-full bg-[#00D26A]"></div>
            <div className="w-20 h-1.5 rounded-full bg-[#00D26A]"></div>
            <div className="w-20 h-1.5 rounded-full bg-[#00D26A]"></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <div className="flex gap-2">
                <Input 
                  id="cnpj" 
                  placeholder="00.000.000/0000-00" 
                  value={formData.cnpj} 
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleCnpjLookup}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="corporateName">Razão Social</Label>
              <Input id="corporateName" value={formData.corporateName} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tradeName">Nome Fantasia</Label>
              <Input id="tradeName" value={formData.tradeName} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" value={formData.address} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avgMonthlyRevenue">Faturamento Médio Mensal</Label>
              <Select onValueChange={(v) => setFormData(p => ({...p, avgMonthlyRevenue: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10k">Até R$ 10.000</SelectItem>
                  <SelectItem value="10k-50k">R$ 10.000 - R$ 50.000</SelectItem>
                  <SelectItem value="50k-100k">R$ 50.000 - R$ 100.000</SelectItem>
                  <SelectItem value="100k-500k">R$ 100.000 - R$ 500.000</SelectItem>
                  <SelectItem value="500k+">Acima de R$ 500.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessType">Tipo de Negócio</Label>
              <Select onValueChange={(v) => setFormData(p => ({...p, businessType: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS / Software</SelectItem>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="retail">Varejo Físico</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="infoproducts">Infoprodutos</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="whatSells">O que a empresa vende/transaciona</Label>
              <Textarea 
                id="whatSells" 
                placeholder="Ex: Roupas, cosméticos, brinquedos; assinaturas de serviços digitais como software ou demais serviços; cursos, infoprodutos; etc."
                value={formData.whatSells} 
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="businessModelDetails">Detalhes do modelo de Negócio</Label>
              <Textarea 
                id="businessModelDetails" 
                placeholder="Detalhe seu modelo de negócio"
                value={formData.businessModelDetails} 
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="operationDetails">Detalhes da Operação</Label>
              <Textarea 
                id="operationDetails" 
                placeholder="Conte sobre sua operação (Ex: Como funciona seu processo de venda? Qual o volume esperado de transações? Qual o perfil do seu cliente? Detalhes sobre a logística, entrega, etc.)"
                value={formData.operationDetails} 
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="websiteOrSocial">Site ou Rede Social</Label>
              <Input id="websiteOrSocial" placeholder="https://" value={formData.websiteOrSocial} onChange={handleChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="positionInCompany">Cargo que ocupa na empresa</Label>
              <Input id="positionInCompany" placeholder="Ex: CEO, Diretor" value={formData.positionInCompany} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input id="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('PlanSelection')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button onClick={handleFinish} disabled={loading} className="bg-[#00D26A] hover:bg-[#00A854]">
            {loading ? 'Criando...' : 'Finalizar Cadastro'} <Building2 className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}