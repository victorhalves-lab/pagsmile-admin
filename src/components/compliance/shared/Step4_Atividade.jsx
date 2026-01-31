import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Briefcase } from 'lucide-react';

export default function Step4_Atividade({ formData, handleChange }) {
  const { t } = useTranslation();
  
  return (
    <FormSection title={t('compliance_forms.economic_activity')} subtitle={t('compliance_forms.cnae_description')} icon={Briefcase}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.main_cnae')} *</Label>
          <Input 
            className="h-12 text-base"
            placeholder={t('compliance_forms.main_cnae_placeholder')} 
            value={formData.cnaePrincipal || ''} 
            onChange={(e) => handleChange('cnaePrincipal', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.secondary_cnaes')}</Label>
          <Textarea 
            className="min-h-[80px] text-base resize-none"
            placeholder={t('compliance_forms.secondary_cnaes_placeholder')} 
            value={formData.cnaesSecundarios || ''} 
            onChange={(e) => handleChange('cnaesSecundarios', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.activity_description')} *</Label>
          <Textarea 
            className="min-h-[120px] text-base resize-none"
            placeholder={t('compliance_forms.activity_description_placeholder')} 
            value={formData.descricaoAtividade || ''} 
            onChange={(e) => handleChange('descricaoAtividade', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}