import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import Section1Cadastrais from '@/components/compliance/pix/Section1Cadastrais';
import Section2Atividade from '@/components/compliance/pix/Section2Atividade';
import Section3Canais from '@/components/compliance/pix/Section3Canais';
import Section4Licenciamento from '@/components/compliance/pix/Section4Licenciamento';
import Section5Beneficiarios from '@/components/compliance/pix/Section5Beneficiarios';
import Section6Socios from '@/components/compliance/pix/Section6Socios';
import Section7Responsaveis from '@/components/compliance/pix/Section7Responsaveis';
import Section8PldFt from '@/components/compliance/pix/Section8PldFt';
import Section9RepresentanteFinal from '@/components/compliance/pix/Section9RepresentanteFinal';

export default function CompliancePixOnly() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 9;
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

  const sectionTitles = [
    'Informações Cadastrais',
    'Atividade e Negócios',
    'Canais de Atendimento',
    'Licenciamento',
    'Beneficiários Finais',
    'Sócios e Administradores',
    'Responsáveis',
    'Compliance e PLD/FT',
    'Representante Legal e Finalização'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/6bc1f8b3d_Logo-modo-escuro.png"
            alt="PagSmile Logo"
            className="h-10 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Compliance PIX</h1>
          <p className="text-gray-500">Etapa {currentSection} de {totalSections} - {sectionTitles[currentSection - 1]}</p>
          <div className="max-w-md mx-auto mt-4">
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="space-y-6">
          {currentSection === 1 && <Section1Cadastrais formData={formData} handleChange={handleChange} />}
          {currentSection === 2 && <Section2Atividade formData={formData} handleChange={handleChange} />}
          {currentSection === 3 && <Section3Canais formData={formData} handleChange={handleChange} handleArrayChange={handleArrayChange} handleAddArrayItem={handleAddArrayItem} handleRemoveArrayItem={handleRemoveArrayItem} />}
          {currentSection === 4 && <Section4Licenciamento formData={formData} handleChange={handleChange} />}
          {currentSection === 5 && <Section5Beneficiarios formData={formData} handleArrayChange={handleArrayChange} handleAddArrayItem={handleAddArrayItem} handleRemoveArrayItem={handleRemoveArrayItem} />}
          {currentSection === 6 && <Section6Socios formData={formData} handleArrayChange={handleArrayChange} handleAddArrayItem={handleAddArrayItem} handleRemoveArrayItem={handleRemoveArrayItem} />}
          {currentSection === 7 && <Section7Responsaveis formData={formData} handleChange={handleChange} />}
          {currentSection === 8 && <Section8PldFt formData={formData} handleChange={handleChange} />}
          {currentSection === 9 && <Section9RepresentanteFinal formData={formData} handleChange={handleChange} />}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            {currentSection === 1 ? (
              <Button variant="ghost" asChild>
                <Link to={createPageUrl('ComplianceOnboardingStart')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
            
            {currentSection < totalSections ? (
              <Button onClick={handleNext} className="bg-[#00D26A] hover:bg-[#00A854]">
                Próxima Etapa <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#00D26A] hover:bg-[#00A854]">
                Continuar para Documentos <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}