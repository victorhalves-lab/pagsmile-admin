import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { FileText, Users } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step2_TipoEmpresa({ formData, handleChange }) {
  const { t } = useTranslation();
  
  const companyTypes = [
    { value: 'LTDA', label: t('compliance_forms.ltda'), desc: t('compliance_forms.ltda_desc') },
    { value: 'SA', label: t('compliance_forms.sa'), desc: t('compliance_forms.sa_desc') },
    { value: 'EIRELI', label: t('compliance_forms.eireli'), desc: t('compliance_forms.eireli_desc') },
    { value: 'MEI', label: t('compliance_forms.mei'), desc: t('compliance_forms.mei_desc') },
    { value: 'SLU', label: t('compliance_forms.slu'), desc: t('compliance_forms.slu_desc') },
    { value: 'Outro', label: t('compliance_forms.other'), desc: t('compliance_forms.other_desc') },
  ];

  return (
    <FormSection title={t('compliance_forms.company_type')} subtitle={t('compliance_forms.legal_nature_structure')} icon={FileText}>
      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.company_type_field')} *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {companyTypes.map(opt => (
              <SelectionButton
                key={opt.value}
                selected={formData.tipoEmpresa === opt.value}
                onClick={() => handleChange('tipoEmpresa', opt.value)}
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
          <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.employees_count')} *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '1-5', label: '1-5' },
              { value: '6-10', label: '6-10' },
              { value: '11-50', label: '11-50' },
              { value: '50+', label: '50+' },
            ].map(opt => (
              <SelectionButton
                key={opt.value}
                selected={formData.qtdColaboradores === opt.value}
                onClick={() => handleChange('qtdColaboradores', opt.value)}
              >
                {opt.label}
              </SelectionButton>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
}