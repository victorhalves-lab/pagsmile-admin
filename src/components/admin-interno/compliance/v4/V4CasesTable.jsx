import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, ArrowUpDown } from 'lucide-react';
import CaseTypeBadge from './CaseTypeBadge';
import CaseStatusBadge from './CaseStatusBadge';
import RiskBandBadge from './RiskBandBadge';
import OrigemBadge from './OrigemBadge';
import ModeloBadge from './ModeloBadge';

export default function V4CasesTable({ cases, onSort, sortField, sortOrder }) {
  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const getDocOrName = (c) => {
    if (c.tipo === 'subseller_pf') return { name: c.nome_completo, doc: c.cpf };
    return { name: c.nome_fantasia || c.razao_social, doc: c.cnpj };
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800/50">
            <TableHead className="text-[11px] font-bold uppercase">
              <button onClick={() => onSort?.('case_id')} className="flex items-center gap-1 hover:text-[#2bc196]">
                Caso <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Tipo</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Empresa / Pessoa</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Merchant Pai</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Modelo</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Origem</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Status</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Score / Banda</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">
              <button onClick={() => onSort?.('submitted_at')} className="flex items-center gap-1 hover:text-[#2bc196]">
                Submetido <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead className="text-right text-[11px] font-bold uppercase">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-12 text-slate-400">
                Nenhum caso encontrado
              </TableCell>
            </TableRow>
          ) : (
            cases.map((c) => {
              const info = getDocOrName(c);
              return (
                <TableRow key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {c.case_id}
                    </span>
                  </TableCell>
                  <TableCell><CaseTypeBadge tipo={c.tipo} /></TableCell>
                  <TableCell>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                      {info.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{info.doc}</div>
                  </TableCell>
                  <TableCell>
                    {c.merchant_pai_name ? (
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        {c.merchant_pai_name}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell><ModeloBadge modelo={c.modelo_compliance} /></TableCell>
                  <TableCell><OrigemBadge origem={c.origem} /></TableCell>
                  <TableCell><CaseStatusBadge status={c.status} /></TableCell>
                  <TableCell><RiskBandBadge band={c.risk_band} score={c.risk_score} /></TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                    {formatDate(c.submitted_at || c.created_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/AdminIntComplianceCaseDetail?id=${c.id}`}>
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}