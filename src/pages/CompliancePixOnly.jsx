import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

// Shared Components
import Step1_DadosCadastrais from '@/components/compliance/shared/Step1_DadosCadastrais';
import Step2_LocalizacaoAtividade from '@/components/compliance/shared/Step2_LocalizacaoAtividade';
import Step3_VolumetriaClientes from '@/components/compliance/shared/Step3_VolumetriaClientes';
import Step_ResponsaveisCanais from '@/components/compliance/shared/Step_ResponsaveisCanais';

// PIX Specific Components
import Step4_SociosUBO_Pix from '@/components/compliance/pix/steps/Step4_SociosUBO_Pix';
import Step7_PLD_Sancoes from '@/components/compliance/pix/steps/Step7_PLD_Sancoes';
import Step8_PLD_Riscos from '@/components/compliance/pix/steps/Step8_PLD_Riscos';
import Step9_PLD_Operacao from '@/components/compliance/pix/steps/Step9_PLD_Operacao';
import Section4Licenciamento from '@/components/compliance/pix/Section4Licenciamento';
import Section9RepresentanteFinal from '@/components/compliance/pix/Section9RepresentanteFinal';

export default function CompliancePixOnly() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 10;
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
    { title: 'Dados Cadastrais', Component: Step1_DadosCadastrais },
    { title: 'Localização e Atividade', Component: Step2_LocalizacaoAtividade },
    { title: 'Volumetria e Clientes', Component: Step3_VolumetriaClientes },
    { title: 'Sócios e UBOs', Component: Step4_SociosUBO_Pix },
    { title: 'Responsáveis e Canais', Component: Step_ResponsaveisCanais },
    { title: 'Licenciamento', Component: Section4Licenciamento },
    { title: 'PLD - Sanções', Component: Step7_PLD_Sancoes },
    { title: 'PLD - Riscos', Component: Step8_PLD_Riscos },
    { title: 'PLD - Operação', Component: Step9_PLD_Operacao },
    { title: 'Finalização', Component: Section9RepresentanteFinal },
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
          <h1 className="text-lg font-bold text-gray-800 mb-0">Compliance PIX</h1>
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