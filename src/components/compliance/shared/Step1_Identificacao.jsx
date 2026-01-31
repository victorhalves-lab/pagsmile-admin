import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';

export default function Step1_Identificacao({ formData, handleChange }) {
  const { t } = useTranslation();
  
  return (
    <FormSection title={t('compliance_forms.company_identification')} subtitle={t('compliance_forms.basic_registration_data')} icon={Building2}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.cnpj')} *</Label>
            <Input 
              className="h-12 text-base"
              placeholder={t('compliance_forms.cnpj_placeholder')} 
              value={formData.cnpj || ''} 
              onChange={(e) => handleChange('cnpj', e.target.value)} 
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.activity_start_date')} *</Label>
            <Input 
              className="h-12 text-base"
              type="date" 
              value={formData.dataInicioAtividade || ''} 
              onChange={(e) => handleChange('dataInicioAtividade', e.target.value)} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.corporate_name')} *</Label>
          <Input 
            className="h-12 text-base"
            placeholder={t('compliance_forms.corporate_name_placeholder')} 
            value={formData.razaoSocial || ''} 
            onChange={(e) => handleChange('razaoSocial', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.trade_name')}</Label>
          <Input 
            className="h-12 text-base"
            placeholder={t('compliance_forms.trade_name_placeholder')} 
            value={formData.nomeFantasia || ''} 
            onChange={(e) => handleChange('nomeFantasia', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}