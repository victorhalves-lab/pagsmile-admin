import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle2, AlertCircle, Eye, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DocumentUploadSimulator({ 
  documentType = "CNH",
  onUploadComplete 
}) {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, validating, completed, rejected
  const [validationResults, setValidationResults] = useState(null);

  const handleUpload = () => {
    setUploadStatus('uploading');
    
    setTimeout(() => {
      setUploadStatus('validating');
      
      setTimeout(() => {
        const isValid = Math.random() > 0.2; // 80% chance de ser válido
        
        setValidationResults({
          ocr: {
            nome: "João da Silva",
            cpf: "123.456.789-00",
            data_nascimento: "01/01/1980",
            numero_documento: "12345678900",
            validade: "01/01/2030"
          },
          authenticity: {
            score: isValid ? 0.95 : 0.45,
            micro_patterns: isValid ? "Aprovado" : "Suspeito",
            fonts: isValid ? "Oficiais" : "Divergentes",
            metadata: isValid ? "Limpo" : "Editado"
          },
          cross_validation: {
            receita_federal: isValid ? "Aprovado ✅" : "Divergência",
            serpro: isValid ? "Aprovado ✅" : "Não validado"
          }
        });
        
        setUploadStatus(isValid ? 'completed' : 'rejected');
        if (onUploadComplete) {
          onUploadComplete(isValid);
        }
      }, 2000);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Upload de {documentType}</CardTitle>
          <Badge variant={
            uploadStatus === 'completed' ? 'default' : 
            uploadStatus === 'rejected' ? 'destructive' : 
            'secondary'
          }>
            {uploadStatus === 'idle' && 'Aguardando'}
            {uploadStatus === 'uploading' && 'Enviando...'}
            {uploadStatus === 'validating' && 'Validando...'}
            {uploadStatus === 'completed' && 'Aprovado'}
            {uploadStatus === 'rejected' && 'Rejeitado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {uploadStatus === 'idle' && (
          <Button onClick={handleUpload} className="w-full gap-2">
            <Upload className="w-4 h-4" />
            Simular Upload de {documentType}
          </Button>
        )}

        {(uploadStatus === 'uploading' || uploadStatus === 'validating') && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#2bc196]" />
          </div>
        )}

        {(uploadStatus === 'completed' || uploadStatus === 'rejected') && validationResults && (
          <div className="space-y-4">
            {/* Document Preview */}
            <div className="bg-slate-100 rounded-lg p-4 flex items-center justify-center">
              <FileText className="w-16 h-16 text-slate-400" />
            </div>

            {/* OCR Results */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Dados Extraídos (OCR)
              </h4>
              <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
                {Object.entries(validationResults.ocr).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-mono font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Authenticity Check */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Verificação de Autenticidade</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Score de Fraude:</span>
                  <Badge variant={validationResults.authenticity.score > 0.7 ? 'default' : 'destructive'}>
                    {(validationResults.authenticity.score * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Micro-padrões:</span>
                  <span className={cn(
                    "font-medium",
                    validationResults.authenticity.micro_patterns === 'Aprovado' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {validationResults.authenticity.micro_patterns}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Fontes:</span>
                  <span className={cn(
                    "font-medium",
                    validationResults.authenticity.fonts === 'Oficiais' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {validationResults.authenticity.fonts}
                  </span>
                </div>
              </div>
            </div>

            {/* Cross Validation */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Validações Externas</h4>
              <div className="space-y-2">
                {Object.entries(validationResults.cross_validation).map(([api, result]) => (
                  <div key={api} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{api.replace(/_/g, ' ')}:</span>
                    <span className={cn(
                      "font-medium",
                      result.includes('Aprovado') ? 'text-green-600' : 'text-red-600'
                    )}>
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Result */}
            <div className={cn(
              "p-3 rounded-lg flex items-center gap-2",
              uploadStatus === 'completed' ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            )}>
              {uploadStatus === 'completed' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Documento validado ✅</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Preciso de uma foto melhor da página 2</span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}