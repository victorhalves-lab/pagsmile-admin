import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const COMPLIANCE_TYPES = [
  { value: 'PIX', label: '💳 PIX Merchant', model: 'CompliancePixMerchantV4' },
  { value: 'FULL', label: '🔒 Full KYC/KYB', model: 'ComplianceEcommerceV4' },
  { value: 'LITE', label: '⚡ Lite (SaaS)', model: 'ComplianceSaaSV4' },
  { value: 'ECOMMERCE', label: '🛒 E-commerce', model: 'ComplianceEcommerceV4' },
  { value: 'SAAS', label: '☁️ SaaS', model: 'ComplianceSaaSV4' },
  { value: 'MARKETPLACE', label: '🏪 Marketplace', model: 'ComplianceMarketplaceV4' },
  { value: 'INFOPRODUTOS', label: '📚 Infoprodutos', model: 'ComplianceInfoprodutosV4' },
];

export default function GenerateLinkForm({ base, onLinkGenerated }) {
  const [form, setForm] = useState({
    complianceType: 'PIX',
    commercialAgentName: '',
    utmSource: '',
    notes: '',
  });
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const uniqueCode = `LNK-${Date.now().toString(36).toUpperCase()}`;
    const typeConfig = COMPLIANCE_TYPES.find((t) => t.value === form.complianceType);
    let url = `${base}/ComplianceDinamico?model=${typeConfig.model}&ref=${uniqueCode}`;
    if (form.utmSource) url += `&utm_source=${form.utmSource}`;

    const newLink = {
      id: uniqueCode,
      uniqueCode,
      complianceType: form.complianceType,
      commercialAgentName: form.commercialAgentName || null,
      utmSource: form.utmSource || null,
      notes: form.notes || null,
      url,
      clickCount: 0,
      submissionCount: 0,
      completedCount: 0,
      created_date: new Date().toISOString(),
    };

    setGenerated(newLink);
    onLinkGenerated?.(newLink);
    toast.success('Link gerado com sucesso!');
  };

  const handleCopy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated.url);
    } catch (e) { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copiado!');
  };

  return (
    <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="w-10 h-10 rounded-xl bg-[#2bc196]/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#2bc196]" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">Gerar Novo Link de Compliance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Crie um link customizado para envio direto ao cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Compliance *</Label>
          <Select value={form.complianceType} onValueChange={(v) => setForm({ ...form, complianceType: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPLIANCE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Agente Comercial (opcional)</Label>
          <Input
            placeholder="Ex: João Silva"
            value={form.commercialAgentName}
            onChange={(e) => setForm({ ...form, commercialAgentName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>UTM Source (opcional)</Label>
          <Input
            placeholder="Ex: google_ads"
            value={form.utmSource}
            onChange={(e) => setForm({ ...form, utmSource: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Notas internas (opcional)</Label>
          <Input
            placeholder="Ex: Lead qualificado XPTO"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </div>

      <Button onClick={handleGenerate} className="w-full bg-[#2bc196] hover:bg-[#25a880] text-white">
        <LinkIcon className="w-4 h-4 mr-2" />
        Gerar Link
      </Button>

      {generated && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Link gerado:</p>
              <p className="text-sm font-mono text-slate-700 dark:text-slate-200 break-all">{generated.url}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            Código: <span className="font-mono font-bold">{generated.uniqueCode}</span>
          </p>
        </div>
      )}
    </div>
  );
}