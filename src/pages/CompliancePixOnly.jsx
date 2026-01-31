import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, Circle, CheckCircle } from 'lucide-react';
import LanguageSelector from '@/components/i18n/LanguageSelector';

// New Shared Components
import Step1_Identificacao from '@/components/compliance/shared/Step1_Identificacao';
import Step2_TipoEmpresa from '@/components/compliance/shared/Step2_TipoEmpresa';
import Step3_Endereco from '@/components/compliance/shared/Step3_Endereco';
import Step4_Atividade from '@/components/compliance/shared/Step4_Atividade';
import Step5_Volumetria from '@/components/compliance/shared/Step5_Volumetria';
import Step6_PerfilClientes from '@/components/compliance/shared/Step6_PerfilClientes';
import Step7_Responsaveis from '@/components/compliance/shared/Step7_Responsaveis';
import Step8_PLDSancoes from '@/components/compliance/shared/Step8_PLDSancoes';
import Step9_PLDRiscos from '@/components/compliance/shared/Step9_PLDRiscos';
import Step10_PLDOperacao from '@/components/compliance/shared/Step10_PLDOperacao';
import Step11_Confirmacao from '@/components/compliance/shared/Step11_Confirmacao';

export default function CompliancePixOnly() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 11;
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (fieldId, index, subField, value) => {
    setFormData(prev => {
      const newItems = [...(prev[fieldId] || [])];
      newItems[index] = { ...newItems[index], [subField]: value };
      return { ...prev, [fieldId]: newItems };
    });
  };

  const handleAddArrayItem = (fieldId, newItem) => {
    setFormData(prev => ({ ...prev, [fieldId]: [...(prev[fieldId] || []), newItem] }));
  };

  const handleRemoveArrayItem = (fieldId, index) => {
    setFormData(prev => ({ ...prev, [fieldId]: (prev[fieldId] || []).filter((_, i) => i !== index) }));
  };

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem('compliance_data_pix', JSON.stringify(formData));
    navigate(createPageUrl('DocumentUploadPix'));
  };

  const progressPercent = (currentSection / totalSections) * 100;

  const steps = [
    { title: t('onboarding.step_identification'), Component: Step1_Identificacao },
    { title: t('onboarding.step_company_type'), Component: Step2_TipoEmpresa },
    { title: t('onboarding.step_address'), Component: Step3_Endereco },
    { title: t('onboarding.step_activity'), Component: Step4_Atividade },
    { title: t('onboarding.step_volume'), Component: Step5_Volumetria },
    { title: t('onboarding.step_client_profile'), Component: Step6_PerfilClientes },
    { title: t('onboarding.step_responsibles'), Component: Step7_Responsaveis },
    { title: t('onboarding.step_pld_sanctions'), Component: Step8_PLDSancoes },
    { title: t('onboarding.step_pld_risks'), Component: Step9_PLDRiscos },
    { title: t('onboarding.step_pld_operation'), Component: Step10_PLDOperacao },
    { title: t('onboarding.step_confirmation'), Component: Step11_Confirmacao },
  ];

  const CurrentComponent = steps[currentSection - 1]?.Component;
  const currentTitle = steps[currentSection - 1]?.title;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/2cf8bf7b4_Logo-modo-claro.png"
              alt="PagSmile Logo"
              className="h-8"
            />
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <div className="text-right">
                <h1 className="text-lg font-bold text-slate-800">{t('onboarding.compliance_pix')}</h1>
                <p className="text-sm text-slate-500">{currentTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              {t('onboarding.step_x_of_y', { current: currentSection, total: totalSections })}
            </span>
            <span className="text-sm font-medium text-[#2bc196]">
              {t('onboarding.percent_completed', { percent: Math.round(progressPercent) })}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Step Indicators (Mobile) */}
      <div className="md:hidden bg-white border-b border-slate-100 overflow-x-auto">
        <div className="flex px-4 py-2 gap-1">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                idx + 1 < currentSection 
                  ? 'bg-[#2bc196] text-white' 
                  : idx + 1 === currentSection 
                    ? 'bg-[#2bc196]/20 text-[#2bc196] border-2 border-[#2bc196]' 
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              {idx + 1 < currentSection ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
        <div className="flex gap-8">
          {/* Sidebar Steps (Desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-2">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    idx + 1 === currentSection 
                      ? 'bg-[#2bc196]/10 border-2 border-[#2bc196]' 
                      : idx + 1 < currentSection 
                        ? 'bg-emerald-50' 
                        : 'bg-white border border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx + 1 < currentSection 
                      ? 'bg-[#2bc196] text-white' 
                      : idx + 1 === currentSection 
                        ? 'bg-[#2bc196] text-white' 
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {idx + 1 < currentSection ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-sm font-medium ${
                    idx + 1 === currentSection ? 'text-[#2bc196]' : idx + 1 < currentSection ? 'text-emerald-700' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 min-w-0">
            {CurrentComponent && (
              <CurrentComponent 
                formData={formData} 
                handleChange={handleChange} 
                handleArrayChange={handleArrayChange}
                handleAddArrayItem={handleAddArrayItem}
                handleRemoveArrayItem={handleRemoveArrayItem}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {currentSection === 1 ? (
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link to={createPageUrl('ComplianceOnboardingStart')}>
                <ArrowLeft className="w-4 h-4" /> {t('onboarding.back')}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="lg" onClick={handlePrevious} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> {t('onboarding.previous')}
            </Button>
          )}
          
          {currentSection < totalSections ? (
            <Button size="lg" onClick={handleNext} className="bg-[#2bc196] hover:bg-[#239b7a] text-white gap-2 px-8">
              {t('onboarding.next')} <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} className="bg-[#2bc196] hover:bg-[#239b7a] text-white gap-2 px-8">
              {t('onboarding.finish')} <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}