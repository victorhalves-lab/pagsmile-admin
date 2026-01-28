import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getLogoUrlByTheme } from '@/components/utils/branding';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4 pb-32 md:pb-8">
      <Card className="w-full max-w-7xl shadow-2xl border border-slate-100 rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#00c295] to-emerald-600 w-full" />
        <CardHeader className="text-center pb-4 pt-6 bg-white">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-6 hover:opacity-80 transition-opacity">
            <img
              src={getLogoUrlByTheme('light')}
              alt="PagSmile Logo"
              className="h-12 transition-all duration-300 hover:scale-105"
            />
          </Link>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">Dados da Empresa</CardTitle>
          <CardDescription className="text-slate-500 text-base mt-2">Etapa 3 de 3 - Informações do seu negócio</CardDescription>
          
          {/* Enhanced Progress Bar */}
          <div className="flex items-center justify-center gap-3 mt-8">
             <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#00c295] border-2 border-[#00c295]" />
               <div className="w-24 h-1.5 rounded-full bg-[#00c295]" />
             </div>
             
             <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#00c295] border-2 border-[#00c295]" />
               <div className="w-24 h-1.5 rounded-full bg-[#00c295]" />
             </div>
             
             <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#00c295] z-10 relative shadow-[0_0_10px_rgba(0,194,149,0.4)]" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#00c295]" />
              </div>
              <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#00c295] to-emerald-500 shadow-sm" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="space-y-2 md:col-span-4">
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
            
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="corporateName">Razão Social</Label>
              <Input id="corporateName" value={formData.corporateName} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="tradeName">Nome Fantasia</Label>
              <Input id="tradeName" value={formData.tradeName} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" value={formData.address} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2 md:col-span-3">
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
            
            <div className="space-y-2 md:col-span-3">
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
            
            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="whatSells">O que a empresa vende/transaciona</Label>
              <Textarea 
                id="whatSells" 
                placeholder="Ex: Roupas, cosméticos..."
                value={formData.whatSells} 
                onChange={handleChange}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="businessModelDetails">Detalhes do modelo de Negócio</Label>
              <Textarea 
                id="businessModelDetails" 
                placeholder="Detalhe seu modelo..."
                value={formData.businessModelDetails} 
                onChange={handleChange}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="operationDetails">Detalhes da Operação</Label>
              <Textarea 
                id="operationDetails" 
                placeholder="Conte sobre sua operação..."
                value={formData.operationDetails} 
                onChange={handleChange}
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="websiteOrSocial">Site ou Rede Social</Label>
              <Input id="websiteOrSocial" placeholder="https://" value={formData.websiteOrSocial} onChange={handleChange} />
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="positionInCompany">Cargo na empresa</Label>
              <Input id="positionInCompany" placeholder="Ex: CEO, Diretor" value={formData.positionInCompany} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-20 md:static md:bg-transparent md:border-0 md:p-8">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('PlanSelection')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button 
            onClick={handleFinish} 
            disabled={loading} 
            size="lg"
            className="bg-[#00c295] hover:bg-[#00a880] text-white shadow-lg shadow-[#00c295]/20 hover:shadow-[#00c295]/40 px-10 rounded-full font-bold transition-all transform hover:-translate-y-0.5"
          >
            {loading ? 'Criando...' : 'Finalizar Cadastro'} <Building2 className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}