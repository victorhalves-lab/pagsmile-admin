import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * Mentor F0001–F0094 — Painel lateral de filtros avançados.
 * 30+ filtros que não cabem na barra superior. Usado por Risco/Compliance/Suporte.
 */
const FILTERS_CONFIG = [
  {
    section: 'Identificação',
    fields: [
      { id: 'document_exact', label: 'Documento (CNPJ/CPF) exato', type: 'text', placeholder: '00.000.000/0000-00' },
      { id: 'document_radical', label: 'Documento parcial (radical para filiais)', type: 'text', placeholder: 'Primeiros 8 dígitos' },
      { id: 'business_name', label: 'Nome fantasia (contém)', type: 'text' },
      { id: 'legal_name', label: 'Razão social (contém)', type: 'text' },
    ],
  },
  {
    section: 'Comercial',
    fields: [
      { id: 'plan', label: 'Plano de venda', type: 'select', options: ['Starter', 'Growth', 'Pro', 'Enterprise', 'Custom'] },
      { id: 'commercial_agent', label: 'Representante comercial', type: 'select', options: ['João Silva', 'Maria Santos', 'Pedro Oliveira'] },
      { id: 'group', label: 'Grupo / Rede', type: 'text', placeholder: 'Buscar grupo...' },
      { id: 'company_holding', label: 'Empresa controladora', type: 'text', placeholder: 'Buscar holding...' },
    ],
  },
  {
    section: 'Operacional',
    fields: [
      { id: 'acquirers', label: 'Adquirentes vinculados', type: 'multi', options: ['Stone', 'Cielo', 'Rede', 'PagBank', 'GetNet'] },
      { id: 'mcc', label: 'MCC', type: 'text', placeholder: '5411' },
      { id: 'cnae', label: 'CNAE', type: 'text', placeholder: '47.13-0-04' },
      { id: 'channels', label: 'Canais habilitados', type: 'multi', options: ['E-commerce', 'POS', 'Link de Pagamento', 'Recorrência'] },
      { id: 'paylink_enabled', label: 'Paylink habilitado', type: 'checkbox' },
    ],
  },
  {
    section: 'Volumetria',
    fields: [
      { id: 'tpv_min', label: 'TPV mínimo (mensal)', type: 'number', placeholder: 'R$ 0' },
      { id: 'tpv_max', label: 'TPV máximo (mensal)', type: 'number', placeholder: 'R$ ∞' },
      { id: 'tx_count_min', label: 'Nº de transações mínimo', type: 'number' },
      { id: 'last_tx_days', label: 'Última transação há mais de (dias)', type: 'number' },
    ],
  },
  {
    section: 'Datas',
    fields: [
      { id: 'created_from', label: 'Cadastrado desde', type: 'date' },
      { id: 'created_to', label: 'Cadastrado até', type: 'date' },
      { id: 'approved_from', label: 'Aprovado desde', type: 'date' },
      { id: 'approved_to', label: 'Aprovado até', type: 'date' },
    ],
  },
  {
    section: 'Compliance',
    fields: [
      { id: 'kyc_status', label: 'Status KYC', type: 'multi', options: ['Aprovado', 'Pendente', 'Rejeitado', 'Expirando'] },
      { id: 'formation', label: 'Formação societária', type: 'select', options: ['MEI', 'EIRELI', 'Ltda', 'S.A.', 'Outros'] },
      { id: 'has_pep', label: 'Possui sócio PEP', type: 'checkbox' },
      { id: 'has_pendency', label: 'Tem pendência financeira', type: 'checkbox' },
      { id: 'has_contract_effects', label: 'Tem efeito de contrato ativo', type: 'checkbox' },
    ],
  },
  {
    section: 'Risco / Bloqueio',
    fields: [
      { id: 'risk_level', label: 'Nível de risco', type: 'multi', options: ['Baixo', 'Médio', 'Alto', 'Crítico'] },
      { id: 'cb_ratio_max', label: 'Chargeback ratio máximo (%)', type: 'number', placeholder: '1.0' },
      { id: 'is_blocked_antifraud', label: 'Bloqueio antifraude ativo', type: 'checkbox' },
      { id: 'is_blocked_regulatory', label: 'Bloqueio regulatório ativo', type: 'checkbox' },
      { id: 'is_blocked_judicial', label: 'Bloqueio judicial ativo', type: 'checkbox' },
    ],
  },
];

export default function AdvancedFiltersDrawer({ filters, onApply }) {
  const [draft, setDraft] = useState(filters || {});
  const [open, setOpen] = useState(false);

  const update = (id, value) => setDraft({ ...draft, [id]: value });
  const reset = () => setDraft({});
  const apply = () => { onApply?.(draft); setOpen(false); };

  const activeCount = Object.values(draft).filter(v => v !== undefined && v !== '' && v !== false && (!Array.isArray(v) || v.length > 0)).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros avançados
          {activeCount > 0 && (
            <span className="bg-purple-600 text-white rounded-full px-2 text-[10px] font-bold">{activeCount}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filtros Avançados (Mentor)
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {FILTERS_CONFIG.map((section) => (
            <div key={section.section}>
              <p className="text-[11px] font-black uppercase tracking-widest text-purple-700 mb-3">{section.section}</p>
              <div className="space-y-3">
                {section.fields.map((f) => (
                  <div key={f.id}>
                    {f.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={!!draft[f.id]} onCheckedChange={(v) => update(f.id, v)} />
                        <span className="text-sm">{f.label}</span>
                      </label>
                    ) : f.type === 'multi' ? (
                      <div>
                        <Label className="text-xs mb-1.5 block">{f.label}</Label>
                        <div className="flex flex-wrap gap-1.5">
                          {f.options.map((opt) => {
                            const arr = draft[f.id] || [];
                            const checked = arr.includes(opt);
                            return (
                              <button
                                key={opt}
                                onClick={() => update(f.id, checked ? arr.filter(x => x !== opt) : [...arr, opt])}
                                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                                  checked ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : f.type === 'select' ? (
                      <div>
                        <Label className="text-xs mb-1.5 block">{f.label}</Label>
                        <select
                          value={draft[f.id] || ''}
                          onChange={(e) => update(f.id, e.target.value)}
                          className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 bg-white"
                        >
                          <option value="">Todos</option>
                          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <Label className="text-xs mb-1.5 block">{f.label}</Label>
                        <Input
                          type={f.type}
                          value={draft[f.id] || ''}
                          onChange={(e) => update(f.id, e.target.value)}
                          placeholder={f.placeholder}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="border-t pt-4 sticky bottom-0 bg-white -mx-6 px-6 pb-4">
          <Button variant="outline" onClick={reset} className="gap-1"><RotateCcw className="w-4 h-4" /> Limpar</Button>
          <Button onClick={apply}>Aplicar ({activeCount})</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}