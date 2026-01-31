import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { MapPin } from 'lucide-react';

export default function Step3_Endereco({ formData, handleChange }) {
  const { t } = useTranslation();
  
  return (
    <FormSection title={t('compliance_forms.commercial_address')} subtitle={t('compliance_forms.headquarters_branches')} icon={MapPin}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.registered_address')} *</Label>
          <Textarea 
            className="min-h-[100px] text-base resize-none"
            placeholder={t('compliance_forms.address_placeholder')} 
            value={formData.enderecoComercial || ''} 
            onChange={(e) => handleChange('enderecoComercial', e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.zip_code')}</Label>
            <Input 
              className="h-12 text-base"
              placeholder="00000-000" 
              value={formData.cep || ''} 
              onChange={(e) => handleChange('cep', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.state')}</Label>
            <Input 
              className="h-12 text-base"
              placeholder={t('compliance_forms.state_placeholder')} 
              value={formData.estado || ''} 
              onChange={(e) => handleChange('estado', e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.other_offices')}</Label>
          <Textarea 
            className="min-h-[80px] text-base resize-none"
            placeholder={t('compliance_forms.other_offices_placeholder')} 
            value={formData.outrosEnderecos || ''} 
            onChange={(e) => handleChange('outrosEnderecos', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}