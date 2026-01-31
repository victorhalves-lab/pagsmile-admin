import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Users } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step6_PerfilClientes({ formData, handleChange }) {
  const { t } = useTranslation();
  
  const clientTypes = [
    { value: 'Pessoa Física (B2C)', label: t('compliance_forms.individual'), desc: t('compliance_forms.individual_desc') },
    { value: 'Pessoa Jurídica (B2B)', label: t('compliance_forms.business'), desc: t('compliance_forms.business_desc') },
    { value: 'Ambos', label: t('compliance_forms.both'), desc: t('compliance_forms.both_desc') },
  ];

  return (
    <FormSection title={t('compliance_forms.client_profile')} subtitle={t('compliance_forms.target_audience')} icon={Users}>
      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.client_type')} *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clientTypes.map(opt => (
              <SelectionButton
                key={opt.value}
                selected={formData.tipoClientes === opt.value}
                onClick={() => handleChange('tipoClientes', opt.value)}
              >
                <div className="text-center">
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-xs opacity-70 mt-1">{opt.desc}</div>
                </div>
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.international_proportion')} *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['0%', '1-25%', '26-50%', '50%+'].map(opt => (
              <SelectionButton
                key={opt}
                selected={formData.proporcaoInternacional === opt}
                onClick={() => handleChange('proporcaoInternacional', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.main_clients')}</Label>
          <Textarea 
            className="min-h-[100px] text-base resize-none"
            placeholder={t('compliance_forms.main_clients_placeholder')} 
            value={formData.principaisClientes || ''} 
            onChange={(e) => handleChange('principaisClientes', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}