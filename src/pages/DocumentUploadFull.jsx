import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, ArrowRight, Upload, CheckCircle2, FileText, 
  File, AlertCircle, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const requiredDocuments = [
  { id: 'partners_id', name: 'RG ou CNH dos sócios / Representante Legal', description: 'Documento de identificação válido', required: true },
  { id: 'company_address_proof', name: 'Comprovante de Endereço da Empresa', description: 'Conta de luz, água ou telefone (últimos 90 dias)', required: true },
  { id: 'representative_address_proof', name: 'Comprovante de Endereço do Representante', description: 'Conta de luz, água ou telefone (últimos 90 dias)', required: true },
  { id: 'cnpj_card', name: 'Cartão CNPJ', description: 'Documento emitido pela Receita Federal', required: true },
  { id: 'social_contract', name: 'Contrato Social e Última Alteração', description: 'Documento de constituição da empresa atualizado', required: true },
  { id: 'balance_sheet', name: 'Balanço Patrimonial', description: 'Demonstrativo contábil do último exercício', required: true },
  { id: 'dre', name: 'DRE', description: 'Demonstração do Resultado do Exercício', required: true },
  { id: 'kyc_policy', name: 'Política de KYC', description: 'Política de Know Your Customer da empresa', required: true },
  { id: 'financial_statements', name: 'Demonstrativos financeiros dos últimos 3 exercícios', description: 'Preferencialmente auditados', required: true },
  { id: 'balancete', name: 'Balancete mais recente', description: 'Balancete contábil atualizado', required: true },
  { id: 'partners_selfie', name: 'Selfie dos sócios com o documento', description: 'Foto segurando o documento de identidade', required: false },
  { id: 'pld_policy', name: 'Política de PLD/FT', description: 'Política de Prevenção à Lavagem de Dinheiro', required: true },
];

export default function DocumentUploadFull() {
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState({});

  const handleFileSelect = (docId) => {
    // Simula upload
    setUploadedDocs(prev => ({
      ...prev,
      [docId]: { name: `documento_${docId}.pdf`, uploaded: true }
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
  const requiredCount = requiredDocuments.filter(d => d.required).length;
  const allRequiredUploaded = requiredDocuments.filter(d => d.required).every(d => uploadedDocs[d.id]);
  const progressPercent = (uploadedCount / requiredCount) * 100;

  const handleContinue = () => {
    navigate(createPageUrl('LivenessFacematchStep'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/6bc1f8b3d_Logo-modo-escuro.png"
            alt="PagSmile Logo"
            className="h-10 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload de Documentos</h1>
          <p className="text-gray-500">Compliance PIX + Cartão - Documentação completa</p>
          <div className="max-w-md mx-auto mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{uploadedCount} de {requiredCount} documentos obrigatórios</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3 mb-8">
          {requiredDocuments.map((doc) => {
            const isUploaded = uploadedDocs[doc.id];
            
            return (
              <Card key={doc.id} className={cn(
                "border transition-all",
                isUploaded ? "border-green-200 bg-green-50/50" : "border-gray-200"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      isUploaded ? "bg-green-100" : "bg-gray-100"
                    )}>
                      {isUploaded ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <FileText className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">{doc.name}</h3>
                        {doc.required ? (
                          <span className="text-xs text-red-500 font-medium">*Obrigatório</span>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Opcional</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                      {isUploaded && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <File className="w-3 h-3" />
                          {uploadedDocs[doc.id].name}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {isUploaded ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveFile(doc.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleFileSelect(doc.id)}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Enviar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alert */}
        {!allRequiredUploaded && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Documentos pendentes</p>
              <p className="text-sm text-amber-700">
                Envie todos os documentos obrigatórios para continuar com a verificação de identidade.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link to={createPageUrl('ComplianceFullKYC')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button 
            onClick={handleContinue} 
            disabled={!allRequiredUploaded}
            className="bg-[#00D26A] hover:bg-[#00A854]"
          >
            Continuar para Verificação <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}