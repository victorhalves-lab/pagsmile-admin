import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Building2, User, Mail, Copy, Check,
  Sparkles, Link as LinkIcon, FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { myMockInvitations, myMerchantInfo } from '@/components/my-compliance/mocks/mySubsellersMock';

export default function MySubsellerInvite() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('subseller_pj');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('invite');

  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const linkUrl = `${base}/AccountCreationStep1?type=subseller&kind=${tipo === 'subseller_pj' ? 'pj' : 'pf'}&merchant_id=${myMerchantInfo.id}`;

  const handleSend = () => {
    if (!email || !name) {
      toast.error('Preencha nome e email');
      return;
    }
    toast.success(`Convite enviado para ${email}`);
    setEmail('');
    setName('');
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copiado!');
  };

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/MySubsellersCases')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Convidar Subseller</h1>
            <p className="text-sm text-slate-500">Envie um convite por email ou compartilhe seu link de onboarding com a sua marca</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="invite"><Mail className="w-3.5 h-3.5 mr-1" /> Convite por Email</TabsTrigger>
          <TabsTrigger value="link"><LinkIcon className="w-3.5 h-3.5 mr-1" /> Link Compartilhável</TabsTrigger>
          <TabsTrigger value="history">Histórico ({myMockInvitations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-5">
            <div>
              <Label className="font-bold mb-3 block">Tipo de Subseller</Label>
              <RadioGroup value={tipo} onValueChange={setTipo} className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${tipo === 'subseller_pj' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <RadioGroupItem value="subseller_pj" className="sr-only" />
                  <Building2 className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-bold text-sm">Pessoa Jurídica (PJ)</p>
                  <p className="text-[11px] text-slate-500">CNPJ, contrato social, UBOs</p>
                </label>
                <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${tipo === 'subseller_pf' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <RadioGroupItem value="subseller_pf" className="sr-only" />
                  <User className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="font-bold text-sm">Pessoa Física (PF)</p>
                  <p className="text-[11px] text-slate-500">CPF, RG/CNH, selfie</p>
                </label>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome / Razão Social</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo ou Razão Social" className="mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" className="mt-1" />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">📧 Pré-visualização do email</p>
              <div className="bg-white dark:bg-slate-900 rounded-lg p-3 text-xs">
                <p className="text-slate-500">De: {myMerchantInfo.name} via PagSmile</p>
                <p className="text-slate-500">Para: {email || 'subseller@exemplo.com'}</p>
                <p className="text-slate-500 mb-2">Assunto: Convite para integração com {myMerchantInfo.name}</p>
                <p className="text-slate-700 dark:text-slate-200">Olá <strong>{name || '[nome]'}</strong>, você foi convidado para integrar como subseller da {myMerchantInfo.name}. Para começar, complete seu cadastro de compliance no link abaixo:</p>
                <p className="mt-2 text-purple-600 font-mono text-[10px] break-all">{linkUrl}</p>
              </div>
            </div>

            <Button onClick={handleSend} className="w-full" size="lg">
              <Send className="w-4 h-4 mr-2" /> Enviar Convite
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="link" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-5">
            <div>
              <Label className="font-bold mb-3 block">Tipo de Link</Label>
              <RadioGroup value={tipo} onValueChange={setTipo} className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer border-2 rounded-xl p-4 ${tipo === 'subseller_pj' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <RadioGroupItem value="subseller_pj" className="sr-only" />
                  <Building2 className="w-5 h-5 text-purple-600 mb-1" />
                  <p className="font-bold text-sm">Link PJ</p>
                </label>
                <label className={`cursor-pointer border-2 rounded-xl p-4 ${tipo === 'subseller_pf' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <RadioGroupItem value="subseller_pf" className="sr-only" />
                  <User className="w-5 h-5 text-purple-600 mb-1" />
                  <p className="font-bold text-sm">Link PF</p>
                </label>
              </RadioGroup>
            </div>

            <div>
              <Label>Seu link de onboarding</Label>
              <div className="flex gap-2 mt-1">
                <Input value={linkUrl} readOnly className="font-mono text-xs" />
                <Button onClick={handleCopyLink} variant="outline">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Este link já vem com sua marca <strong>{myMerchantInfo.name}</strong> aplicada (white-label).
                Compartilhe via WhatsApp, email, redes sociais ou QR code.
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                <strong>Dica:</strong> Você pode gerenciar todos os seus links em "Meus Links de Compliance".
              </p>
              <Button size="sm" variant="outline" onClick={() => navigate('/MyComplianceLinks')}>
                Ver Meus Links
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-5 space-y-2">
          {myMockInvitations.map((inv) => (
            <div key={inv.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{inv.name}</span>
                  <Badge variant="outline" className="text-[10px]">{inv.tipo === 'subseller_pj' ? 'PJ' : 'PF'}</Badge>
                </div>
                <p className="text-[11px] text-slate-500">{inv.email} · enviado {new Date(inv.invited_at).toLocaleDateString('pt-BR')}</p>
              </div>
              {inv.clicked && <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">Clicou</Badge>}
              <Badge className={
                inv.status === 'sent' ? 'bg-emerald-100 text-emerald-700 border-0' :
                inv.status === 'expired' ? 'bg-red-100 text-red-700 border-0' :
                'bg-slate-100 text-slate-700 border-0'
              }>{inv.status}</Badge>
              {inv.status !== 'expired' && <Button size="sm" variant="ghost">Reenviar</Button>}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}