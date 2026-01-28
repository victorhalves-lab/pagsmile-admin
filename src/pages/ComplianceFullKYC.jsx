import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

// Novos componentes divididos (Full KYC)
import Step1_DadosCadastrais from '@/components/compliance/full/steps/Step1_DadosCadastrais';
import Step3_Enderecos from '@/components/compliance/full/steps/Step3_Enderecos';
import Step4_Atividade from '@/components/compliance/full/steps/Step4_Atividade';
import Step5_Volumetria from '@/components/compliance/full/steps/Step5_Volumetria';
import Step6_Clientes from '@/components/compliance/full/steps/Step6_Clientes';

// Componentes existentes reutilizados
import Section3Licenciamento from '@/components/compliance/full/Section3Licenciamento';
import Section4UBO from '@/components/compliance/full/Section4UBO';
import Section5Socios from '@/components/compliance/full/Section5Socios';
import Section6Responsaveis from '@/components/compliance/full/Section6Responsaveis';

// Novos componentes divididos de Compliance, PLD e Transacional
import Step11_Compliance_Sancoes from '@/components/compliance/full/steps/Step11_Compliance_Sancoes';
import Step12_Compliance_Riscos from '@/components/compliance/full/steps/Step12_Compliance_Riscos';
import Step13_Compliance_Atividades from '@/components/compliance/full/steps/Step13_Compliance_Atividades';
import Step14_PLD_Politicas from '@/components/compliance/full/steps/Step14_PLD_Politicas';
import Step15_PLD_KYC from '@/components/compliance/full/steps/Step15_PLD_KYC';
import Step16_PLD_Monitoramento from '@/components/compliance/full/steps/Step16_PLD_Monitoramento';
import Step17_PLD_Governanca from '@/components/compliance/full/steps/Step17_PLD_Governanca';
import Step18_Transacional_Perfil from '@/components/compliance/full/steps/Step18_Transacional_Perfil';
import Step19_Transacional_Metricas from '@/components/compliance/full/steps/Step19_Transacional_Metricas';
import Step20_Transacional_Reembolso from '@/components/compliance/full/steps/Step20_Transacional_Reembolso';

// Componentes finais existentes
import Section10Marketplace from '@/components/compliance/full/Section10Marketplace';
import Section11SegurancaCartao from '@/components/compliance/full/Section11SegurancaCartao';
import Section12Confirmacao from '@/components/compliance/full/Section12Confirmacao';

export default function ComplianceFullKYC() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 22;
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
    localStorage.setItem('compliance_data_full', JSON.stringify(formData));
    navigate(createPageUrl('DocumentUploadFull'));
  };

  const progressPercent = (currentSection / totalSections) * 100;

  const steps = [
    { title: 'Dados Cadastrais', Component: Step1_DadosCadastrais },
    { title: 'Localização', Component: Step3_Enderecos },
    { title: 'Atividade', Component: Step4_Atividade },
    { title: 'Volumetria', Component: Step5_Volumetria },
    { title: 'Clientes', Component: Step6_Clientes },
    { title: 'Licenciamento', Component: Section3Licenciamento },
    { title: 'UBO', Component: Section4UBO },
    { title: 'Sócios', Component: Section5Socios },
    { title: 'Responsáveis', Component: Section6Responsaveis },
    { title: 'Sanções', Component: Step11_Compliance_Sancoes },
    { title: 'Riscos', Component: Step12_Compliance_Riscos },
    { title: 'Ativ. Sensíveis', Component: Step13_Compliance_Atividades },
    { title: 'PLD Políticas', Component: Step14_PLD_Politicas },
    { title: 'PLD KYC', Component: Step15_PLD_KYC },
    { title: 'PLD Monitoramento', Component: Step16_PLD_Monitoramento },
    { title: 'PLD Governança', Component: Step17_PLD_Governanca },
    { title: 'Perfil Transacional', Component: Step18_Transacional_Perfil },
    { title: 'Métricas', Component: Step19_Transacional_Metricas },
    { title: 'Reembolsos', Component: Step20_Transacional_Reembolso },
    { title: 'Marketplace', Component: Section10Marketplace },
    { title: 'Segurança', Component: Section11SegurancaCartao },
    { title: 'Confirmação', Component: Section12Confirmacao },
  ];

  const CurrentComponent = steps[currentSection - 1]?.Component;
  const currentTitle = steps[currentSection - 1]?.title;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-2 md:p-4 pb-20 md:pb-4">
      <div className="w-full max-w-7xl bg-white shadow-2xl border border-slate-100 rounded-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#00c295] to-emerald-600 w-full" />
        <div className="text-center pb-2 pt-4 px-4">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/6bc1f8b3d_Logo-modo-escuro.png"
            alt="PagSmile Logo"
            className="h-6 mx-auto mb-2"
          />
          <h1 className="text-lg font-bold text-gray-800 mb-0">Compliance Completo (KYC/KYB)</h1>
          <p className="text-xs text-gray-500 mb-2">Etapa {currentSection} de {totalSections} - {currentTitle}</p>
          <div className="max-w-md mx-auto">
            <Progress value={progressPercent} className="h-1" />
          </div>
        </div>

        <div className="p-3 md:p-6 space-y-3">
          <div className="overflow-y-auto max-h-[75vh] px-1 custom-scrollbar">
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

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2 fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 z-20 md:static md:bg-transparent md:border-0 md:p-0">
            {currentSection === 1 ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to={createPageUrl('ComplianceOnboardingStart')}>
                  <ArrowLeft className="mr-2 h-3 w-3" /> Voltar
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-3 w-3" /> Anterior
              </Button>
            )}
            
            {currentSection < totalSections ? (
              <Button size="sm" onClick={handleNext} className="bg-[#00D26A] hover:bg-[#00A854] text-white">
                Próxima <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSubmit} className="bg-[#00D26A] hover:bg-[#00A854] text-white">
                Continuar <Check className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}