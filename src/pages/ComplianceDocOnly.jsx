import React, { useMemo, useState } from 'react';
import { Upload, CheckCircle2, FileText, AlertTriangle, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import WhiteLabelHeader, { WhiteLabelFooter } from '@/components/white-label/WhiteLabelHeader';
import { getBrandingFromUrl } from '@/components/white-label/mockWhiteLabelMerchants';

/**
 * Página pública para upload-only de documentos pendentes.
 * - Acessada via link enviado por MySubsellerDocsResend ou link tipo "doc_only".
 * - White-label: aplica branding do merchant pai (querystring merchant_id).
 *
 * INTEGRAÇÃO BACKEND:
 *   - Lookup do caso → ENDPOINT NECESSÁRIO: GET /onboarding/case/:case_id (público com token)
 *   - Upload → base44.integrations.Core.UploadFile + criar DocumentUpload
 *   - Submit final → ENDPOINT NECESSÁRIO: POST /compliance/finalizeDocsResubmission
 */
const MOCK_PENDING_DOCS = [
  { code: 'address_proof', name: 'Comprovante de Endereço', description: 'Conta de luz, água ou telefone (últimos 90 dias)', max_size_mb: 5, accepted: 'PDF, JPG, PNG' },
  { code: 'selfie_with_doc', name: 'Selfie + Documento', description: 'Foto sua segurando RG ou CNH ao lado do rosto', max_size_mb: 5, accepted: 'JPG, PNG' },
];

export default function ComplianceDocOnly() {
  const branding = useMemo(() => getBrandingFromUrl(), []);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const caseId = params.get('case') || 'CASE-2026-DEMO';

  const [uploads, setUploads] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleUpload = (docCode, file) => {
    if (!file) return;
    setUploads((p) => ({ ...p, [docCode]: { name: file.name, size: file.size, uploaded_at: new Date().toISOString() } }));
    toast.success(`${file.name} carregado com sucesso`);
  };

  const handleRemove = (docCode) => {
    setUploads((p) => {
      const c = { ...p };
      delete c[docCode];
      return c;
    });
  };

  const allUploaded = MOCK_PENDING_DOCS.every((d) => uploads[d.code]);

  const handleSubmit = () => {
    if (!allUploaded) {
      toast.error('Por favor envie todos os documentos pendentes');
      return;
    }
    setSubmitted(true);
  };

  const accent = branding.brand_color_primary;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC' }}>
        <WhiteLabelHeader branding={branding} subtitle="Envio de documentos" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md text-center bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `${accent}20`, color: accent }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Documentos enviados!</h1>
            <p className="text-sm text-slate-500 mb-6">
              Recebemos seus documentos. A análise leva entre 1 e 3 dias úteis. Você receberá um email
              de <strong>{branding.business_name_display}</strong> assim que tudo estiver finalizado.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 font-mono">
              Caso: {caseId}
            </div>
          </div>
        </div>
        <WhiteLabelFooter branding={branding} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC' }}>
      <WhiteLabelHeader branding={branding} subtitle="Envio de documentos pendentes" />

      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-6 pb-5 border-b border-slate-100">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}20`, color: accent }}
            >
              <Upload className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-slate-900">Envie os documentos pendentes</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Caso: <span className="font-mono">{caseId}</span> · {MOCK_PENDING_DOCS.length} documentos solicitados
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Sua análise está pausada aguardando os documentos abaixo. Após o envio, retomamos automaticamente.
            </p>
          </div>

          <div className="space-y-4">
            {MOCK_PENDING_DOCS.map((doc) => {
              const uploaded = uploads[doc.code];
              return (
                <div
                  key={doc.code}
                  className={`rounded-xl border-2 p-4 transition ${uploaded ? 'border-emerald-200 bg-emerald-50/40' : 'border-dashed border-slate-200 bg-slate-50/40'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-slate-200">
                      {doc.code === 'selfie_with_doc' ? <Camera className="w-5 h-5 text-slate-400" /> : <FileText className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm text-slate-900">{doc.name}</p>
                        {uploaded && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Enviado</Badge>}
                      </div>
                      <p className="text-xs text-slate-500">{doc.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Aceitos: {doc.accepted} · Máx {doc.max_size_mb} MB
                      </p>

                      {uploaded ? (
                        <div className="mt-3 flex items-center gap-2 bg-white rounded-lg p-2 border border-slate-200">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-mono flex-1 truncate">{uploaded.name}</span>
                          <button onClick={() => handleRemove(doc.code)} className="text-slate-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-xs font-bold transition hover:opacity-90"
                          style={{ background: accent, color: 'white' }}>
                          <Upload className="w-3.5 h-3.5" />
                          Enviar arquivo
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleUpload(doc.code, e.target.files?.[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!allUploaded}
            size="lg"
            className="w-full mt-6 hover:opacity-90"
            style={allUploaded ? { background: accent, color: 'white' } : {}}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {allUploaded ? 'Enviar documentos para análise' : `Faltam ${MOCK_PENDING_DOCS.length - Object.keys(uploads).length} documentos`}
          </Button>

          <p className="text-center text-[11px] text-slate-400 mt-4">
            Seus dados são tratados com segurança. Apenas <strong>{branding.business_name_display}</strong> e a PagSmile (operadora de pagamentos) terão acesso.
          </p>
        </div>
      </div>

      <WhiteLabelFooter branding={branding} />
    </div>
  );
}