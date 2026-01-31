import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Building2, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SelectionButton from '@/components/ui/selection-button';
import LanguageSelector from '@/components/i18n/LanguageSelector';

export default function AccountCreationStep3() {
  const { t } = useTranslation();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4 pb-32 md:pb-8 relative">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>
      <Card className="w-full max-w-7xl shadow-2xl border border-slate-100 rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#2bc196] to-emerald-600 w-full" />
        <CardHeader className="text-center pb-4 pt-6 bg-white">
          <Link to={createPageUrl('LandingPage')} className="inline-flex items-center justify-center mb-6 hover:opacity-80 transition-opacity">
            <img
              src={getLogoUrlByTheme('light')}
              alt="PagSmile Logo"
              className="h-12 transition-all duration-300 hover:scale-105"
            />
          </Link>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('onboarding.company_data')}</CardTitle>
          <CardDescription className="text-slate-500 text-base mt-2">{t('onboarding.step_3_of_3')}</CardDescription>
          
          {/* Enhanced Progress Bar */}
          <div className="flex items-center justify-center gap-3 mt-8">
             <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#2bc196] border-2 border-[#2bc196]" />
               <div className="w-24 h-1.5 rounded-full bg-[#2bc196]" />
             </div>
             
             <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#2bc196] border-2 border-[#2bc196]" />
               <div className="w-24 h-1.5 rounded-full bg-[#2bc196]" />
             </div>
             
             <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#2bc196] z-10 relative shadow-[0_0_10px_rgba(0,194,149,0.4)]" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#2bc196]" />
              </div>
              <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#2bc196] to-emerald-500 shadow-sm" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="cnpj">{t('onboarding.cnpj')}</Label>
              <div className="flex gap-2">
                <Input 
                  id="cnpj" 
                  placeholder={t('onboarding.cnpj_placeholder')} 
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
              <Label htmlFor="corporateName">{t('onboarding.corporate_name')}</Label>
              <Input id="corporateName" value={formData.corporateName} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="tradeName">{t('onboarding.trade_name')}</Label>
              <Input id="tradeName" value={formData.tradeName} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="address">{t('onboarding.address')}</Label>
              <Input id="address" value={formData.address} onChange={handleChange} className="bg-gray-50" />
            </div>
            
            <div className="space-y-2 md:col-span-12">
              <Label htmlFor="avgMonthlyRevenue">{t('onboarding.avg_monthly_revenue')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { value: '0-10k', label: t('onboarding.revenue_0_10k') },
                  { value: '10k-50k', label: t('onboarding.revenue_10k_50k') },
                  { value: '50k-100k', label: t('onboarding.revenue_50k_100k') },
                  { value: '100k-500k', label: t('onboarding.revenue_100k_500k') },
                  { value: '500k+', label: t('onboarding.revenue_500k_plus') }
                ].map(opt => (
                  <SelectionButton
                    key={opt.value}
                    selected={formData.avgMonthlyRevenue === opt.value}
                    onClick={() => setFormData(p => ({...p, avgMonthlyRevenue: opt.value}))}
                  >
                    {opt.label}
                  </SelectionButton>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-12">
              <Label htmlFor="businessType">{t('onboarding.business_type')}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { value: 'ecommerce', label: t('onboarding.type_ecommerce') },
                  { value: 'saas', label: t('onboarding.type_saas') },
                  { value: 'services', label: t('onboarding.type_services') },
                  { value: 'retail', label: t('onboarding.type_retail') },
                  { value: 'marketplace', label: t('onboarding.type_marketplace') },
                  { value: 'infoproducts', label: t('onboarding.type_infoproducts') },
                  { value: 'other', label: t('onboarding.type_other') }
                ].map(opt => (
                  <SelectionButton
                    key={opt.value}
                    selected={formData.businessType === opt.value}
                    onClick={() => setFormData(p => ({...p, businessType: opt.value}))}
                  >
                    {opt.label}
                  </SelectionButton>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="whatSells">{t('onboarding.what_sells')}</Label>
              <Textarea 
                id="whatSells" 
                placeholder={t('onboarding.what_sells_placeholder')}
                value={formData.whatSells} 
                onChange={handleChange}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="businessModelDetails">{t('onboarding.business_model_details')}</Label>
              <Textarea 
                id="businessModelDetails" 
                placeholder={t('onboarding.business_model_placeholder')}
                value={formData.businessModelDetails} 
                onChange={handleChange}
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2 md:col-span-6">
              <Label htmlFor="operationDetails">{t('onboarding.operation_details')}</Label>
              <Textarea 
                id="operationDetails" 
                placeholder={t('onboarding.operation_placeholder')}
                value={formData.operationDetails} 
                onChange={handleChange}
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="websiteOrSocial">{t('onboarding.website_social')}</Label>
              <Input id="websiteOrSocial" placeholder={t('onboarding.website_placeholder')} value={formData.websiteOrSocial} onChange={handleChange} />
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="positionInCompany">{t('onboarding.position_company')}</Label>
              <Input id="positionInCompany" placeholder={t('onboarding.position_placeholder')} value={formData.positionInCompany} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-20 md:static md:bg-transparent md:border-0 md:p-8">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('PlanSelection')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('onboarding.back')}
            </Link>
          </Button>
          <Button 
            onClick={handleFinish} 
            disabled={loading} 
            size="lg"
            className="bg-[#2bc196] hover:bg-[#239b7a] text-white shadow-lg shadow-[#2bc196]/20 hover:shadow-[#2bc196]/40 px-10 rounded-full font-bold transition-all transform hover:-translate-y-0.5"
          >
            {loading ? t('onboarding.creating') : t('onboarding.finish_registration')} <Building2 className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}