import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle, CheckCircle2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export default function MentorBulkMerchantPicker({ merchants = [], selectedIds = [], onChange }) {
  const [search, setSearch] = useState('');
  const [showOnlyEligible, setShowOnlyEligible] = useState(true);

  const filtered = useMemo(() => {
    return merchants.filter((m) => {
      if (showOnlyEligible && !m.eligible) return false;
      if (search) return m.business_name.toLowerCase().includes(search.toLowerCase());
      return true;
    });
  }, [merchants, search, showOnlyEligible]);

  const toggle = (id) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter((x) => x !== id));
    else onChange([...selectedIds, id]);
  };

  const selectAllEligible = () => {
    const eligibleIds = filtered.filter((m) => m.eligible).map((m) => m.merchant_id);
    onChange(eligibleIds);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-600" />
          Merchants alvo · {selectedIds.length} de {filtered.length} selecionado(s)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Buscar merchant…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <button
            onClick={() => setShowOnlyEligible(!showOnlyEligible)}
            className={cn(
              'px-3 py-1.5 rounded-md text-[11px] font-semibold border transition',
              showOnlyEligible
                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200'
            )}
          >
            {showOnlyEligible ? '✓ Só elegíveis' : 'Mostrar todos'}
          </button>
          <Button variant="outline" size="sm" onClick={selectAllEligible} className="h-9 text-xs">
            Selecionar todos elegíveis
          </Button>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-1.5 pr-1">
          {filtered.map((m) => {
            const isSelected = selectedIds.includes(m.merchant_id);
            const disabled = !m.eligible;
            return (
              <div
                key={m.merchant_id}
                onClick={() => !disabled && toggle(m.merchant_id)}
                className={cn(
                  'flex items-center gap-3 p-2.5 rounded-lg border transition',
                  disabled
                    ? 'bg-slate-50 dark:bg-slate-900 opacity-60 cursor-not-allowed border-slate-200'
                    : isSelected
                      ? 'bg-violet-50 border-violet-300 cursor-pointer'
                      : 'bg-white dark:bg-slate-800 border-slate-200 hover:border-violet-300 cursor-pointer'
                )}
              >
                <Checkbox checked={isSelected} disabled={disabled} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{m.business_name}</p>
                    {m.eligible ? (
                      <Badge className="bg-emerald-100 text-emerald-700 text-[9px] gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> elegível
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 text-[9px] gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> bloqueado
                      </Badge>
                    )}
                    {m.has_active_split && (
                      <Badge variant="outline" className="text-[9px]">
                        já possui split
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                    <span>{m.merchant_id}</span>
                    <span>·</span>
                    <span>TPV 30d: {fmtBRL(m.tpv_30d)}</span>
                    {m.eligibility_reason && (
                      <span className="text-red-600">· {m.eligibility_reason}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}