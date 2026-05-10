import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mail, MessageSquare, Copy, Check, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { myMockSubsellerCases, myMerchantInfo } from '@/components/my-compliance/mocks/mySubsellersMock';

export default function MySubsellerDocsResend() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const subseller = useMemo(() => myMockSubsellerCases.find((c) => c.id === id) || myMockSubsellerCases.find((c) => c.status === 'docs_requested'), [id]);
  const [channel, setChannel] = useState('email');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!subseller) return <div className="p-12 text-center">Subseller não encontrado</div>;

  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const docLink = `${base}/ComplianceDocOnly?case=${subseller.case_id}&merchant=${myMerchantInfo.id}`;
  const pendingDocs = subseller.pending_docs || ['Comprovante de Endereço', 'Selfie + Documento'];

  const handleResend = () => {
    toast.success(`Link reenviado via ${channel === 'email' ? 'email' : 'WhatsApp'}`);
    navigate(`/MySubsellerCaseDetail?id=${subseller.id}`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(docLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copiado');
  };

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Reenviar Link de Documentos</h1>
        <p className="text-sm text-slate-500">
          Para: <strong>{subseller.razao_social || subseller.nome_completo}</strong> ({subseller.email})
        </p>
      </div>

      {pendingDocs.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-700 dark:text-amber-300">Documentos Pendentes</h3>
          </div>
          <div className="space-y-2">
            {pendingDocs.map((d, i) => (
              <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg text-sm">
                <FileText className="w-4 h-4 text-amber-600" /> {d}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5 space-y-5">
        <div>
          <Label className="font-bold mb-3 block">Canal de envio</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setChannel('email')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${channel === 'email' ? 'border-[#2bc196] bg-[#2bc196]/5' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <Mail className="w-5 h-5 text-[#2bc196] mb-2" />
              <p className="font-bold text-sm">Email</p>
              <p className="text-[11px] text-slate-500">Para {subseller.email}</p>
            </button>
            <button
              onClick={() => setChannel('whatsapp')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${channel === 'whatsapp' ? 'border-[#2bc196] bg-[#2bc196]/5' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <MessageSquare className="w-5 h-5 text-[#2bc196] mb-2" />
              <p className="font-bold text-sm">WhatsApp</p>
              <p className="text-[11px] text-slate-500">Para {subseller.telefone || '(número não cadastrado)'}</p>
            </button>
          </div>
        </div>

        <div>
          <Label>Mensagem personalizada (opcional)</Label>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Adicione uma mensagem ao reenvio... ex: 'Por favor envie os documentos pendentes nos próximos 3 dias.'"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label>Link a ser enviado</Label>
          <div className="mt-1 flex gap-2">
            <code className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs font-mono break-all">{docLink}</code>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Este link leva direto para o upload dos documentos pendentes — sem refazer o questionário inteiro.
          </p>
        </div>

        <Button onClick={handleResend} className="w-full" size="lg">
          <Send className="w-4 h-4 mr-2" /> Reenviar via {channel === 'email' ? 'Email' : 'WhatsApp'}
        </Button>
      </div>
    </div>
  );
}