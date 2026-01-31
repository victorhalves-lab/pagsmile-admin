import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from '@/components/compliance/FormSection';
import { CheckCircle, FileCheck, Shield } from 'lucide-react';

export default function Step11_Confirmacao({ formData, handleChange }) {
  const { t } = useTranslation();
  
  return (
    <FormSection title={t('compliance_forms.confirmation_declarations')} subtitle={t('compliance_forms.final_review')} icon={CheckCircle}>
      <div className="space-y-8">
        <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800 text-lg">{t('compliance_forms.almost_there')}</h3>
              <p className="text-emerald-700 mt-1">
                {t('compliance_forms.review_message')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox 
              id="declaracao1"
              checked={formData.declaracao1 || false}
              onCheckedChange={(checked) => handleChange('declaracao1', checked)}
              className="mt-1 h-6 w-6"
            />
            <Label htmlFor="declaracao1" className="text-base text-slate-700 cursor-pointer leading-relaxed">
              {t('compliance_forms.declaration_1')}
            </Label>
          </div>

          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox 
              id="declaracao2"
              checked={formData.declaracao2 || false}
              onCheckedChange={(checked) => handleChange('declaracao2', checked)}
              className="mt-1 h-6 w-6"
            />
            <Label htmlFor="declaracao2" className="text-base text-slate-700 cursor-pointer leading-relaxed">
              {t('compliance_forms.declaration_2')}
            </Label>
          </div>

          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <Checkbox 
              id="declaracao3"
              checked={formData.declaracao3 || false}
              onCheckedChange={(checked) => handleChange('declaracao3', checked)}
              className="mt-1 h-6 w-6"
            />
            <Label htmlFor="declaracao3" className="text-base text-slate-700 cursor-pointer leading-relaxed">
              {t('compliance_forms.declaration_3_prefix')} <a href="#" className="text-[#2bc196] underline">{t('compliance_forms.terms_of_use')}</a> {t('compliance_forms.and')} <a href="#" className="text-[#2bc196] underline">{t('compliance_forms.privacy_policy')}</a> {t('compliance_forms.declaration_3_suffix')}
            </Label>
          </div>
        </div>

        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <p className="text-blue-700 text-sm">
              <strong>{t('compliance_forms.security_notice')}</strong> {t('compliance_forms.security_message')}
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}