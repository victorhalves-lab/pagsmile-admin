import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Mail, Building2, ArrowUpDown, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

const STATUS_BADGES = {
  Aprovado: { icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  Recusado: { icon: XCircle, className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
  Manual: { icon: AlertTriangle, className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  'Em Análise': { icon: Clock, className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
  Pendente: { icon: Clock, className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_BADGES[status] || STATUS_BADGES.Pendente;
  const Icon = cfg.icon;
  return (
    <Badge className={`${cfg.className} gap-1 border-0`}>
      <Icon className="w-3 h-3" /> {status}
    </Badge>
  );
}

function ScorePill({ score }) {
  if (score == null) return <span className="text-slate-400">—</span>;
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{Math.round(score)}</span>
    </div>
  );
}

export default function ComplianceCasesTable({ cases = [], onSort, sortField, sortOrder }) {
  const SortBtn = ({ field, label }) => (
    <button onClick={() => onSort?.(field)} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
      {label} <ArrowUpDown className="w-3 h-3" />
    </button>
  );
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><SortBtn field="case_id" label="Caso" /></TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead><SortBtn field="riskScore" label="Score" /></TableHead>
            <TableHead>Decisão IA</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><SortBtn field="created_date" label="Criado" /></TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((c) => (
            <TableRow key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell className="font-mono text-xs">{c.case_id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.merchantName}</p>
                    <p className="text-xs text-slate-500">{c.cnpj}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell><Badge variant="outline">{c.merchantType}</Badge></TableCell>
              <TableCell><ScorePill score={c.riskScore} /></TableCell>
              <TableCell>
                <span className={
                  c.iaDecision === 'Aprovado' ? 'text-emerald-600 font-semibold text-sm' :
                  c.iaDecision === 'Recusado' ? 'text-red-600 font-semibold text-sm' :
                  'text-amber-600 font-semibold text-sm'
                }>
                  {c.iaDecision}
                </span>
              </TableCell>
              <TableCell><StatusBadge status={c.status} /></TableCell>
              <TableCell className="text-xs text-slate-500">
                {new Date(c.created_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem><Mail className="w-4 h-4 mr-2" /> Enviar e-mail</DropdownMenuItem>
                      <DropdownMenuItem><CheckCircle2 className="w-4 h-4 mr-2" /> Aprovar</DropdownMenuItem>
                      <DropdownMenuItem><XCircle className="w-4 h-4 mr-2" /> Reprovar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {cases.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-slate-500">Nenhum caso encontrado.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}