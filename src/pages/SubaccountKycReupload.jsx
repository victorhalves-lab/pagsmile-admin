import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, AlertTriangle, Upload, CheckCircle2, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Lojista vê quais documentos foram rejeitados + faz reupload self-service.
 */
const documents = [
  { id: 'D1', label: 'Contrato Social', status: 'approved', uploaded_at: '2026-04-12' },
  { id: 'D2', label: 'Cartão CNPJ', status: 'approved', uploaded_at: '2026-04-12' },
  { id: 'D3', label: 'Comprovante de Endereço', status: 'rejected', uploaded_at: '2026-04-12', rejection_reason: 'Documento ilegível — qualidade da imagem baixa. Reenvie um documento original em alta resolução.' },
  { id: 'D4', label: 'RG do Sócio Principal', status: 'rejected', uploaded_at: '2026-04-12', rejection_reason: 'CPF do documento não confere com o cadastro do sócio.' },
  { id: 'D5', label: 'Procuração', status: 'pending', uploaded_at: null },
];

export default function SubaccountKycReupload() {
  const [reuploaded, setReuploaded] = useState({});

  const handleUpload = (id) => {
    setReuploaded({ ...reuploaded, [id]: true });
  };

  const STATUS_CFG = {
    approved: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Aprovado' },
    rejected: { color: 'bg-red-100 text-red-700', icon: X, label: 'Rejeitado' },
    pending: { color: 'bg-amber-100 text-amber-700', icon: AlertTriangle, label: 'Pendente' },
    reuploaded: { color: 'bg-blue-100 text-blue-700', icon: Upload, label: 'Reenviado — em análise' },
  };

  const rejectedCount = documents.filter(d => d.status === 'rejected' && !reuploaded[d.id]).length;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <PageHeader
        title="Documentos KYC"
        subtitle="Acompanhe o status dos seus documentos e reenvie os rejeitados"
        icon={FileCheck}
      />

      {rejectedCount > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-900">{rejectedCount} documento(s) rejeitado(s) precisam ser reenviados</p>
              <p className="text-xs text-red-800 mt-0.5">A liberação total das suas operações depende da aprovação destes documentos.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {documents.map((d) => {
          const effectiveStatus = reuploaded[d.id] ? 'reuploaded' : d.status;
          const cfg = STATUS_CFG[effectiveStatus];
          const StatusIcon = cfg.icon;
          return (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-[240px]">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{d.label}</p>
                      {d.uploaded_at && <p className="text-[11px] text-slate-500 mt-0.5">Enviado em {d.uploaded_at}</p>}
                      {d.status === 'rejected' && !reuploaded[d.id] && (
                        <div className="mt-2 p-2 rounded bg-red-50 border border-red-200 text-xs text-red-800">
                          <strong>Motivo da rejeição:</strong> {d.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cfg.color}><StatusIcon className="w-3 h-3 mr-1" />{cfg.label}</Badge>
                    {(d.status === 'rejected' && !reuploaded[d.id]) && (
                      <Button size="sm" onClick={() => handleUpload(d.id)}>
                        <Upload className="w-3 h-3 mr-1" /> Reenviar
                      </Button>
                    )}
                    {d.status === 'pending' && (
                      <Button size="sm" onClick={() => handleUpload(d.id)}>
                        <Upload className="w-3 h-3 mr-1" /> Enviar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}