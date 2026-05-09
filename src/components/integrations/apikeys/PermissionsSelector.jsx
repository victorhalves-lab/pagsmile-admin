import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Shield, ScanLine } from 'lucide-react';

const SCOPES = [
  { id: 'transactions', label: 'Transações', desc: 'Criar, listar, capturar, estornar' },
  { id: 'customers', label: 'Clientes', desc: 'CRUD de clientes e cards' },
  { id: 'subscriptions', label: 'Assinaturas', desc: 'Planos, recorrências, dunning' },
  { id: 'webhooks', label: 'Webhooks', desc: 'Receber e validar eventos' },
  { id: 'reports', label: 'Relatórios', desc: 'Analytics e exports' },
  { id: 'subaccounts', label: 'Subcontas', desc: 'Marketplace operations' },
];

const PRESETS = [
  {
    id: 'read_only',
    icon: Eye,
    label: 'Read-only',
    desc: 'Apenas leitura — bom para BI e analytics',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'write_payments',
    icon: Pencil,
    label: 'Write Payments',
    desc: 'Cria pagamentos, mas não acessa clientes',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'webhook_only',
    icon: ScanLine,
    label: 'Webhook-only',
    desc: 'Só consome webhooks, não cria nada',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'full',
    icon: Shield,
    label: 'Full Access',
    desc: 'Acesso completo (não recomendado)',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'custom',
    icon: Shield,
    label: 'Custom',
    desc: 'Selecionar permissões granulares',
    badge: 'bg-slate-100 text-slate-700',
  },
];

export default function PermissionsSelector({ preset = 'full', onPresetChange, scopes = [], onScopesChange }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo de Permissão (Restricted Keys)</Label>
        <p className="text-xs text-slate-500 mt-1">Escolha um preset ou customize as permissões. Reduza o blast radius se a chave vazar.</p>
      </div>

      <RadioGroup value={preset} onValueChange={onPresetChange} className="space-y-2">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                preset === p.id ? 'border-[#2bc196] bg-[#2bc196]/5' : 'border-slate-200 hover:bg-slate-50'
              }`}
              onClick={() => onPresetChange?.(p.id)}
            >
              <RadioGroupItem value={p.id} className="mt-0.5" />
              <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{p.label}</span>
                  <Badge className={`${p.badge} border-0 text-[10px]`}>{p.id}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </RadioGroup>

      {preset === 'custom' && (
        <div className="space-y-2 pl-3 border-l-2 border-[#2bc196]/30">
          <p className="text-xs font-semibold text-slate-700">Selecione recursos:</p>
          {SCOPES.map((s) => (
            <div key={s.id} className="flex items-start gap-2">
              <Checkbox
                id={`scope_${s.id}`}
                checked={scopes.includes(s.id)}
                onCheckedChange={(c) => {
                  const next = c ? [...scopes, s.id] : scopes.filter((x) => x !== s.id);
                  onScopesChange?.(next);
                }}
              />
              <label htmlFor={`scope_${s.id}`} className="text-sm cursor-pointer flex-1">
                <span className="font-medium">{s.label}</span>
                <span className="text-xs text-slate-500 block">{s.desc}</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}