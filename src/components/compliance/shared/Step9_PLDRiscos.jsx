import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { AlertTriangle } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const PLDQuestion = ({ id, label, detailLabel, formData, handleChange, yesLabel, noLabel }) => (
  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
    <Label className="text-sm font-semibold text-slate-700">{label}</Label>
    <div className="flex gap-4">
      <SelectionButton 
        className="flex-1" 
        selected={formData[id] === 'sim'} 
        onClick={() => handleChange(id, 'sim')}
      >
        {yesLabel}
      </SelectionButton>
      <SelectionButton 
        className="flex-1" 
        selected={formData[id] === 'nao'} 
        onClick={() => handleChange(id, 'nao')}
      >
        {noLabel}
      </SelectionButton>
    </div>
    {formData[id] === 'sim' && (
      <Textarea 
        className="min-h-[80px] text-base resize-none mt-4" 
        placeholder={detailLabel} 
        value={formData[`${id}_detalhe`] || ''} 
        onChange={(e) => handleChange(`${id}_detalhe`, e.target.value)} 
      />
    )}
  </div>
);

export default function Step9_PLDRiscos({ formData, handleChange }) {
  const { t } = useTranslation();
  
  return (
    <FormSection title={t('compliance_forms.pld_risks')} subtitle={t('compliance_forms.risk_assessment')} icon={AlertTriangle}>
      <div className="space-y-6">
        <PLDQuestion 
          id="riscos_pep" 
          label={t('compliance_forms.pep_question')} 
          detailLabel={t('compliance_forms.pep_detail')}
          formData={formData} 
          handleChange={handleChange}
          yesLabel={t('compliance_forms.yes')}
          noLabel={t('compliance_forms.no')}
        />
        <PLDQuestion 
          id="riscos_lavagem" 
          label={t('compliance_forms.money_laundering_question')} 
          detailLabel={t('compliance_forms.money_laundering_detail')}
          formData={formData} 
          handleChange={handleChange}
          yesLabel={t('compliance_forms.yes')}
          noLabel={t('compliance_forms.no')}
        />
        <PLDQuestion 
          id="riscos_operacoes" 
          label={t('compliance_forms.atypical_operations_question')} 
          detailLabel={t('compliance_forms.atypical_operations_detail')}
          formData={formData} 
          handleChange={handleChange}
          yesLabel={t('compliance_forms.yes')}
          noLabel={t('compliance_forms.no')}
        />
      </div>
    </FormSection>
  );
}