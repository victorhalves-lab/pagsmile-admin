import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, RotateCw, Shield } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CFG = {
  ready: { label: 'Pronto', color: 'bg-emerald-100 text-emerald-700' },
  processing: { label: 'Processando', color: 'bg-blue-100 text-blue-700' },
  queued: { label: 'Em fila', color: 'bg-slate-100 text-slate-700' },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-700' },
  expired: { label: 'Expirado', color: 'bg-slate-200 text-slate-500' },
};

const FORMAT_CFG = {
  CSV: { color: 'bg-emerald-100 text-emerald-700' },
  XLSX: { color: 'bg-blue-100 text-blue-700' },
  PDF: { color: 'bg-red-100 text-red-700' },
  JSON: { color: 'bg-violet-100 text-violet-700' },
  XML: { color: 'bg-amber-100 text-amber-700' },
};

const DEST_CFG = {
  download: { label: 'Download', icon: '⬇️' },
  email: { label: 'E-mail', icon: '✉️' },
  sftp: { label: 'SFTP', icon: '🔐' },
  s3: { label: 'S3 Bucket', icon: '☁️' },
};

const MASKING_CFG = {
  minimal: { label: 'Mínimo', color: 'bg-slate-100 text-slate-700' },
  standard: { label: 'Padrão PCI', color: 'bg-emerald-100 text-emerald-700' },
  high: { label: 'Alto · LGPD', color: 'bg-violet-100 text-violet-700' },
};

export default function ExportJobsTable({ jobs = [] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-2 font-semibold">Job · Solicitante</th>
                <th className="text-center p-2 font-semibold">Formato</th>
                <th className="text-right p-2 font-semibold">Linhas</th>
                <th className="text-left p-2 font-semibold">Filtros aplicados</th>
                <th className="text-center p-2 font-semibold">Mascaramento</th>
                <th className="text-center p-2 font-semibold">Destino</th>
                <th className="text-left p-2 font-semibold">Justificativa</th>
                <th className="text-center p-2 font-semibold">Status</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const status = STATUS_CFG[j.status];
                const fmt = FORMAT_CFG[j.format];
                const dest = DEST_CFG[j.destination];
                const mask = MASKING_CFG[j.masking_level];
                return (
                  <tr key={j.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-2">
                      <p className="font-mono text-[10px]">{j.id}</p>
                      <p className="text-[10px] text-slate-500">{j.requested_by.split('@')[0]} · {new Date(j.requested_at).toLocaleString('pt-BR')}</p>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${fmt?.color} font-bold`}>{j.format}</Badge>
                    </td>
                    <td className="text-right p-2">
                      <p className="font-mono">{j.total_rows.toLocaleString('pt-BR')}</p>
                      {j.file_size_mb && <p className="text-[9px] text-slate-500">{j.file_size_mb} MB</p>}
                      {j.status === 'processing' && j.progress_pct && (
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1 mt-1 ml-auto">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${j.progress_pct}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-[10px] max-w-[220px]">
                      <p className="text-slate-600 dark:text-slate-400">{j.filters_summary}</p>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${mask?.color}`}>
                        <Shield className="w-2.5 h-2.5 mr-0.5" />{mask?.label}
                      </Badge>
                    </td>
                    <td className="text-center p-2 text-[11px]">
                      <span>{dest?.icon}</span>
                      <span className="ml-1">{dest?.label}</span>
                    </td>
                    <td className="p-2 text-[10px] italic max-w-[220px]">"{j.justification}"</td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                      {j.eta_min && <p className="text-[9px] text-slate-500 mt-0.5">ETA {j.eta_min}min</p>}
                      {j.expires_at && <p className="text-[9px] text-slate-500 mt-0.5">expira {new Date(j.expires_at).toLocaleDateString('pt-BR')}</p>}
                      {j.error && <p className="text-[9px] text-red-600 mt-0.5 max-w-[140px]">{j.error}</p>}
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        {j.status === 'ready' && (
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="Baixar" onClick={() => toast.success('Download iniciado')}>
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Detalhes" onClick={() => toast.info(`Trilha auditável do job ${j.id}`)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        {(j.status === 'failed' || j.status === 'expired') && (
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="Re-exportar" onClick={() => toast.info('Re-exportação com mesmos parâmetros')}>
                            <RotateCw className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}