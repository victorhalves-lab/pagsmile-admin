import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Copy, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import { statusConfig } from '@/components/mentor/mocks/spotAnticipationMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const formatDate = (d) => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

const HealthBadge = ({ score }) => {
  const color = score >= 90 ? 'bg-green-100 text-green-700' : score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return <Badge className={`${color} border-0 text-xs`}>{score}</Badge>;
};

const SLAIcon = ({ adherence }) => {
  if (adherence === 'critical') return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
  if (adherence === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
};

export default function MentorAnticipationTable({ items, selected, onToggle, onToggleAll }) {
  const allChecked = items.length > 0 && selected.length === items.length;

  const copyId = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    toast.success('ID copiado');
  };

  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-slate-900">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
          <tr className="border-b">
            <th className="text-left py-3 px-3 w-10">
              <Checkbox checked={allChecked} onCheckedChange={onToggleAll} />
            </th>
            <th className="text-left py-3 px-3 font-medium text-slate-600 dark:text-slate-300">ID</th>
            <th className="text-left py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Criada</th>
            <th className="text-left py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Lojista</th>
            <th className="text-right py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Valor Solic.</th>
            <th className="text-right py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Taxa</th>
            <th className="text-right py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Líquido</th>
            <th className="text-center py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Prazo</th>
            <th className="text-center py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Recebíveis</th>
            <th className="text-center py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Pagamento</th>
            <th className="text-left py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Status</th>
            <th className="text-center py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Saúde</th>
            <th className="text-center py-3 px-3 font-medium text-slate-600 dark:text-slate-300">SLA</th>
            <th className="text-right py-3 px-3 font-medium text-slate-600 dark:text-slate-300">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const cfg = statusConfig[item.status];
            const isSelected = selected.includes(item.id);
            return (
              <tr key={item.id} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isSelected ? 'bg-violet-50 dark:bg-violet-900/10' : ''}`}>
                <td className="py-3 px-3">
                  <Checkbox checked={isSelected} onCheckedChange={() => onToggle(item.id)} />
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <Link to={createPageUrl('AdminIntAnticipationDetail360') + '?id=' + item.id} className="text-blue-600 hover:underline font-mono text-xs">
                      {item.id}
                    </Link>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => copyId(item.id, e)}>
                      <Copy className="w-3 h-3 text-slate-400" />
                    </Button>
                  </div>
                  {item.external_ref && <p className="text-[10px] text-slate-400 ml-0">ref: {item.external_ref}</p>}
                </td>
                <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-300">{formatDate(item.created_at)}</td>
                <td className="py-3 px-3">
                  <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + item.merchant.id} className="hover:underline">
                    <p className="font-medium text-sm">{item.merchant.fantasy}</p>
                    <p className="text-[10px] text-slate-400">{item.merchant.cnpj}</p>
                  </Link>
                </td>
                <td className="py-3 px-3 text-right font-medium">{formatCurrency(item.vl_ordered)}</td>
                <td className="py-3 px-3 text-right">
                  <span className="text-xs text-slate-700">{item.rt_spot_anticipation}%</span>
                  <p className="text-[10px] text-slate-400">{formatCurrency(item.rate_value)}</p>
                </td>
                <td className="py-3 px-3 text-right font-medium text-emerald-600">{formatCurrency(item.total)}</td>
                <td className="py-3 px-3 text-center text-xs">{item.avg_term_days}d</td>
                <td className="py-3 px-3 text-center text-xs">{item.receivables_count}</td>
                <td className="py-3 px-3 text-center text-xs">
                  {new Date(item.dt_payment).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </td>
                <td className="py-3 px-3">
                  <Badge className={`${cfg.color} border-0 text-xs`}>{cfg.label}</Badge>
                  {item.sub_status && <p className="text-[10px] text-red-500 mt-0.5">{item.sub_status}</p>}
                </td>
                <td className="py-3 px-3 text-center"><HealthBadge score={item.health_score} /></td>
                <td className="py-3 px-3 text-center"><SLAIcon adherence={item.sla_adherence} /></td>
                <td className="py-3 px-3 text-right">
                  <Link to={createPageUrl('AdminIntAnticipationDetail360') + '?id=' + item.id}>
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-slate-50 dark:bg-slate-800 font-medium">
          <tr>
            <td colSpan={4} className="py-3 px-3 text-sm text-slate-600">Totalizadores ({items.length})</td>
            <td className="py-3 px-3 text-right">{formatCurrency(items.reduce((s, i) => s + i.vl_ordered, 0))}</td>
            <td className="py-3 px-3 text-right text-xs text-violet-600">
              {formatCurrency(items.reduce((s, i) => s + i.rate_value, 0))}
              <p className="text-[10px] text-slate-400">receita</p>
            </td>
            <td className="py-3 px-3 text-right text-emerald-600">{formatCurrency(items.reduce((s, i) => s + i.total, 0))}</td>
            <td colSpan={7}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}