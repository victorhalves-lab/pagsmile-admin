import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, Trash2, MousePointer, FileCheck, TrendingUp, Building2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { LINK_TYPE_CONFIG } from './mocks/onboardingLinksV4Mock';
import ModeloBadge from './ModeloBadge';

export default function V4LinksTable({ links, onDelete }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
      toast.success('Link copiado!');
    } catch (e) {
      toast.error('Falha ao copiar');
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800/50">
            <TableHead className="text-[11px] font-bold uppercase">Link</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Tipo</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Modelo</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Criado por</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Cliques</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Submissões</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Conversão</TableHead>
            <TableHead className="text-[11px] font-bold uppercase">Status</TableHead>
            <TableHead className="text-right text-[11px] font-bold uppercase">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-slate-400">
                Nenhum link encontrado
              </TableCell>
            </TableRow>
          ) : (
            links.map((link) => {
              const cfg = LINK_TYPE_CONFIG[link.type] || { label: link.type, icon: '🔗', color: '#94A3B8' };
              return (
                <TableRow key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <TableCell>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{link.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate max-w-[280px]">{link.url}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{ color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}10` }}
                    >
                      <span>{cfg.icon}</span> {cfg.label}
                    </span>
                  </TableCell>
                  <TableCell>{link.modelo_compliance && <ModeloBadge modelo={link.modelo_compliance} />}</TableCell>
                  <TableCell>
                    {link.created_by_type === 'pagsmile_admin' ? (
                      <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-0 gap-1">
                        <Shield className="w-3 h-3" /> PagSmile
                      </Badge>
                    ) : (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 gap-1">
                        <Building2 className="w-3 h-3" /> {link.merchant_pai_name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <MousePointer className="w-3 h-3 text-slate-400" />
                      {link.clicks_count || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-slate-400" />
                      {link.submissions_count || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      {(link.conversion_rate || 0).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      link.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0'
                    }>
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => handleCopy(link.url, link.id)}
                        className="h-7 px-2"
                      >
                        {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => window.open(link.url, '_blank')}
                        className="h-7 px-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      {onDelete && (
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => onDelete(link.id)}
                          className="h-7 px-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
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