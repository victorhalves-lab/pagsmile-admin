import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { TrendingUp } from 'lucide-react';

export default function Step5_Volumetria({ formData, handleChange }) {
  const { t } = useTranslation();
  
  return (
    <FormSection title={t('compliance_forms.financial_volume')} subtitle={t('compliance_forms.transaction_estimates')} icon={TrendingUp}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.estimated_monthly_volume')} *</Label>
            <Input 
              className="h-12 text-base"
              placeholder={t('compliance_forms.currency_placeholder')} 
              value={formData.volumeMensalEstimado || ''} 
              onChange={(e) => handleChange('volumeMensalEstimado', e.target.value)} 
            />
            <p className="text-xs text-slate-500">{t('compliance_forms.monthly_transactions_help')}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.average_ticket')} *</Label>
            <Input 
              className="h-12 text-base"
              placeholder={t('compliance_forms.currency_placeholder')} 
              value={formData.ticketMedio || ''} 
              onChange={(e) => handleChange('ticketMedio', e.target.value)} 
            />
            <p className="text-xs text-slate-500">{t('compliance_forms.average_ticket_help')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.monthly_transactions')} *</Label>
            <Input 
              className="h-12 text-base"
              type="number"
              placeholder={t('compliance_forms.monthly_transactions_placeholder')} 
              value={formData.qtdTransacoesMensal || ''} 
              onChange={(e) => handleChange('qtdTransacoesMensal', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">{t('compliance_forms.annual_revenue')}</Label>
            <Input 
              className="h-12 text-base"
              placeholder={t('compliance_forms.currency_placeholder')} 
              value={formData.faturamentoAnual || ''} 
              onChange={(e) => handleChange('faturamentoAnual', e.target.value)} 
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}