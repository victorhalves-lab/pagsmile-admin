import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { UserCircle } from 'lucide-react';

export default function Step7_Responsaveis({ formData, handleChange }) {
  const { t } = useTranslation();
  
  return (
    <FormSection title={t('compliance_forms.company_responsibles')} subtitle={t('compliance_forms.main_contacts')} icon={UserCircle}>
      <div className="space-y-8">
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">{t('compliance_forms.legal_representative')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.full_name')} *</Label>
              <Input 
                className="h-12 text-base"
                placeholder={t('compliance_forms.responsible_name_placeholder')} 
                value={formData.responsavelNome || ''} 
                onChange={(e) => handleChange('responsavelNome', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.cpf')} *</Label>
              <Input 
                className="h-12 text-base"
                placeholder={t('compliance_forms.cpf_placeholder')} 
                value={formData.responsavelCPF || ''} 
                onChange={(e) => handleChange('responsavelCPF', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.email')} *</Label>
              <Input 
                className="h-12 text-base"
                type="email"
                placeholder={t('compliance_forms.email_placeholder')} 
                value={formData.responsavelEmail || ''} 
                onChange={(e) => handleChange('responsavelEmail', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.phone')} *</Label>
              <Input 
                className="h-12 text-base"
                placeholder={t('compliance_forms.phone_placeholder')} 
                value={formData.responsavelTelefone || ''} 
                onChange={(e) => handleChange('responsavelTelefone', e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">{t('compliance_forms.financial_contact')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.full_name')}</Label>
              <Input 
                className="h-12 text-base"
                placeholder={t('compliance_forms.financial_name_placeholder')} 
                value={formData.financeiroNome || ''} 
                onChange={(e) => handleChange('financeiroNome', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.email')}</Label>
              <Input 
                className="h-12 text-base"
                type="email"
                placeholder={t('compliance_forms.financial_email_placeholder')} 
                value={formData.financeiroEmail || ''} 
                onChange={(e) => handleChange('financeiroEmail', e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}