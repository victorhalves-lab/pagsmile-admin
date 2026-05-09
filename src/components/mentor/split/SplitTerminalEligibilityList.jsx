import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, AlertTriangle, Lock, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);
const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

/**
 * Lista de terminais elegíveis com checkbox · Mentor F2855-F2858, F2938-F2960.
 * Mostra elegibilidade, conflitos com outros splits e permite multi-seleção.
 */
export default function SplitTerminalEligibilityList({ terminals = [], selectedIds = [], onChange }) {
  const [search, setSearch] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [eligibilityFilter, setEligibilityFilter] = useState('all');

  const filtered = useMemo(() => {
    return terminals.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.tid.includes(search) ||
        t.terminal_id.toLowerCase().includes(search.toLowerCase());
      const matchModality = modalityFilter === 'all' || t.modality === modalityFilter;
      const matchEligibility =
        eligibilityFilter === 'all' ||
        (eligibilityFilter === 'eligible' && t.eligible) ||
        (eligibilityFilter === 'conflict' && t.conflict_split_id) ||
        (eligibilityFilter === 'linked' && t.linked_to_current);
      return matchSearch && matchModality && matchEligibility;
    });
  }, [terminals, search, modalityFilter, eligibilityFilter]);

  const toggle = (id, eligible) => {
    if (!eligible) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    const eligibleIds = filtered.filter((t) => t.eligible).map((t) => t.terminal_id);
    const allSelected = eligibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      onChange(selectedIds.filter((id) => !eligibleIds.includes(id)));
    } else {
      onChange(Array.from(new Set([...selectedIds, ...eligibleIds])));
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between gap-2 flex-wrap">
          <span>Pool de Terminais ({filtered.length})</span>
          <span className="text-[10px] font-normal text-slate-500">
            {selectedIds.length} selecionado(s) na configuração desejada
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar por nome, TID ou ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 text-xs"
            />
          </div>
          <Select value={modalityFilter} onValueChange={setModalityFilter}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas modalidades</SelectItem>
              <SelectItem value="e-commerce">E-commerce</SelectItem>
              <SelectItem value="pos">POS físico</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eligibilityFilter} onValueChange={setEligibilityFilter}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="eligible">Elegíveis</SelectItem>
              <SelectItem value="linked">Já vinculados</SelectItem>
              <SelectItem value="conflict">Em conflito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="p-2 w-10">
                  <Checkbox
                    checked={
                      filtered.filter((t) => t.eligible).length > 0 &&
                      filtered.filter((t) => t.eligible).every((t) => selectedIds.includes(t.terminal_id))
                    }
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="text-left p-2 font-semibold">Terminal</th>
                <th className="text-left p-2 font-semibold">TID</th>
                <th className="text-left p-2 font-semibold">Modalidade</th>
                <th className="text-right p-2 font-semibold">TPV 30d</th>
                <th className="text-right p-2 font-semibold">Última atividade</th>
                <th className="text-left p-2 font-semibold">Elegibilidade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const checked = selectedIds.includes(t.terminal_id);
                return (
                  <tr
                    key={t.terminal_id}
                    className={cn(
                      'border-t border-slate-200 dark:border-slate-700 transition-colors',
                      !t.eligible && 'opacity-60 bg-red-50/30',
                      checked && t.eligible && 'bg-emerald-50/40',
                      t.eligible && 'cursor-pointer hover:bg-slate-50'
                    )}
                    onClick={() => toggle(t.terminal_id, t.eligible)}
                  >
                    <td className="p-2 text-center">
                      {t.eligible ? (
                        <Checkbox checked={checked} />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-2">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{t.name}</p>
                      <code className="font-mono text-[10px] text-slate-500">{t.terminal_id}</code>
                    </td>
                    <td className="p-2 font-mono">{t.tid}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-[10px]">{t.modality}</Badge>
                    </td>
                    <td className="p-2 text-right font-bold">{formatCurrency(t.tpv_30d)}</td>
                    <td className="p-2 text-right text-slate-500 text-[10px]">{formatDateTime(t.last_activity_at)}</td>
                    <td className="p-2">
                      {t.linked_to_current && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Vinculado</Badge>
                      )}
                      {t.conflict_split_id && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-700">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="truncate">Conflito: {t.conflict_split_name}</span>
                        </div>
                      )}
                      {!t.linked_to_current && !t.conflict_split_id && t.eligible && (
                        <span className="text-[10px] text-slate-500">{t.eligibility_reason}</span>
                      )}
                      {!t.eligible && !t.conflict_split_id && (
                        <span className="text-[10px] text-red-600">{t.eligibility_reason}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-xs text-slate-500">
                    Nenhum terminal corresponde aos filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}