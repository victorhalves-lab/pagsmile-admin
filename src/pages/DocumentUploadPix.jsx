import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Removed 'required: true' to make them optional as requested
const requiredDocuments = [
  { id: 'cnpj_card', name: 'Cartão CNPJ', description: 'Receita Federal' },
  { id: 'social_contract', name: 'Contrato Social', description: 'Constituição' },
  { id: 'partners_id', name: 'RG/CNH Sócios', description: 'Identificação' },
  { id: 'company_address_proof', name: 'Endereço Empresa', description: 'Comprovante' },
  { id: 'partners_selfie', name: 'Selfie com Doc', description: 'Foto do rosto' },
  { id: 'partners_address_proof', name: 'Endereço Sócios', description: 'Comprovante' },
  { id: 'balance_sheet', name: 'Balanço Patrimonial', description: 'Último exercício' },
  { id: 'dre', name: 'DRE', description: 'Demonstrativo' },
  { id: 'balancete', name: 'Balancete', description: 'Mais recente' },
  { id: 'pld_policy', name: 'Política PLD', description: 'Prevenção' },
];

export default function DocumentUploadPix() {
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState({});

  const handleFileSelect = (docId) => {
    // Simula upload
    setUploadedDocs(prev => ({
      ...prev,
      [docId]: { name: `doc.pdf`, uploaded: true }
    }));
  };

  const handleRemoveFile = (docId) => {
    setUploadedDocs(prev => {
      const newDocs = { ...prev };
      delete newDocs[docId];
      return newDocs;
    });
  };

  const uploadedCount = Object.keys(uploadedDocs).length;
  const totalCount = requiredDocuments.length;
  const progressPercent = (uploadedCount / totalCount) * 100;

  const handleContinue = () => {
    navigate(createPageUrl('LivenessFacematchStep'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/2cf8bf7b4_Logo-modo-claro.png"
            alt="PagSmile Logo"
            className="h-8 mx-auto mb-2"
          />
          <h1 className="text-xl font-bold text-gray-800">Upload de Documentos</h1>
          <div className="max-w-md mx-auto mt-2 flex items-center gap-3">
             <Progress value={progressPercent} className="h-1.5 flex-1" />
             <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{uploadedCount} de {totalCount}</span>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          {requiredDocuments.map((doc) => {
            const isUploaded = uploadedDocs[doc.id];
            
            return (
              <div 
                key={doc.id} 
                className={cn(
                  "relative flex flex-col items-center justify-between p-3 rounded-xl border transition-all h-36 bg-white group hover:shadow-md",
                  isUploaded ? "border-green-200 bg-green-50/30" : "border-slate-200"
                )}
              >
                {isUploaded && (
                  <button 
                    onClick={() => handleRemoveFile(doc.id)}
                    className="absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2 mt-1",
                  isUploaded ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                )}>
                  {isUploaded ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                
                <div className="text-center w-full px-1">
                  <h3 className="text-xs font-bold text-slate-800 leading-tight mb-0.5 line-clamp-2 min-h-[2.5em]">{doc.name}</h3>
                  <p className="text-[10px] text-slate-400 truncate">{doc.description}</p>
                </div>
                
                <div className="mt-2 w-full">
                  {isUploaded ? (
                    <div className="text-[10px] text-green-600 font-medium text-center bg-green-100/50 rounded py-1">
                      Enviado
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFileSelect(doc.id)}
                      className="w-full h-7 text-xs border-dashed border-slate-300 hover:border-[#00c295] hover:text-[#00c295]"
                    >
                      <Upload className="w-3 h-3 mr-1" /> Upload
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button variant="ghost" asChild size="sm">
            <Link to={createPageUrl('CompliancePixOnly')}>
              <ArrowLeft className="mr-2 h-3 w-3" /> Voltar
            </Link>
          </Button>
          <Button 
            onClick={handleContinue} 
            size="sm"
            className="bg-[#00D26A] hover:bg-[#00A854] px-8 rounded-full font-bold"
          >
            Continuar <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}