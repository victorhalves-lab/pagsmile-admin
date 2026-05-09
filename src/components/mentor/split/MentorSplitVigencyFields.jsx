import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, PauseCircle, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Campos Mentor (F2792, F2790, F2891):
 *  - Vigência (start/end)
 *  - Status distinto (ativo / suspenso / encerrado)
 *  - charge_processing_fee (split sobre bruto vs líquido)
 */
export default function MentorSplitVigencyFields({ value = {}, onChange }) {
  const update = (field, val) => onChange({ ...value, [field]: val });

  return (
    <div className="space-y-3 bg-violet-50/30 dark:bg-violet-900/10 border border-violet-200 rounded-lg p-3">
      <p className="text-[10px] uppercase font-bold text-violet-700 flex items-center gap-1">
        <Calendar className="w-3 h-3" /> Mentor · Vigência, Status & Tarifa
      </p>

      {/* Vigência */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Vigente de</Label>
          <Input
            type="date"
            value={value.vigency_start || ''}
            onChange={(e) => update('vigency_start', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Vigente até</Label>
          <Input
            type="date"
            value={value.vigency_end || ''}
            onChange={(e) => update('vigency_end', e.target.value)}
            className="mt-1"
            placeholder="indeterminado"
          />
          <p className="text-[10px] text-slate-500 mt-0.5">Vazio = indeterminado</p>
        </div>
      </div>

      {/* Status distinto */}
      <div>
        <Label className="text-xs flex items-center gap-1">
          <PauseCircle className="w-3 h-3" /> Status (3 estados distintos)
        </Label>
        <Select
          value={value.lifecycle_status || 'active'}
          onValueChange={(v) => update('lifecycle_status', v)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              <span className="text-emerald-700 font-semibold">● Ativo</span> — em produção
            </SelectItem>
            <SelectItem value="suspended">
              <span className="text-amber-700 font-semibold">● Suspenso</span> — pausa temporária
            </SelectItem>
            <SelectItem value="terminated">
              <span className="text-slate-600 font-semibold">● Encerrado</span> — definitivo
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggle bruto/líquido */}
      <div>
        <Label className="text-xs flex items-center gap-1">
          <Calculator className="w-3 h-3" /> Tratamento da tarifa de processamento
        </Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {[
            { key: 'liquid', label: 'Sobre LÍQUIDO', desc: 'MDR deduzido antes da divisão' },
            { key: 'gross', label: 'Sobre BRUTO', desc: 'Cada um paga sua parte da MDR' },
          ].map((opt) => {
            const selected = value.charge_processing_fee === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => update('charge_processing_fee', opt.key)}
                className={cn(
                  'text-left p-2 rounded-lg border text-xs transition',
                  selected
                    ? 'border-violet-500 bg-violet-100 dark:bg-violet-900/30 ring-2 ring-violet-300'
                    : 'border-slate-200 bg-white hover:border-violet-300'
                )}
              >
                <p className="font-bold text-slate-800 dark:text-slate-100">{opt.label}</p>
                <p className="text-[10px] text-slate-500">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}