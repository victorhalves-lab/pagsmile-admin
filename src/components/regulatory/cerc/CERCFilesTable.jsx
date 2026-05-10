import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, ArrowDown, ArrowUp } from 'lucide-react';
import { CERC_FILE_TYPES } from '../mocks/urMock';

export default function CERCFilesTable({ items, onViewDetail }) {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-slate-900">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr className="border-b">
            <th className="text-left p-2 font-semibold">ID</th>
            <th className="text-left p-2 font-semibold">Tipo</th>
            <th className="text-center p-2 font-semibold">Formato</th>
            <th className="text-center p-2 font-semibold">Direção</th>
            <th className="text-left p-2 font-semibold">Nome</th>
            <th className="text-right p-2 font-semibold">Tamanho</th>
            <th className="text-right p-2 font-semibold">Registros</th>
            <th className="text-left p-2 font-semibold">Data</th>
            <th className="text-center p-2 font-semibold">Status</th>
            <th className="text-center p-2 font-semibold">Versão</th>
            <th className="text-right p-2 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => {
            const type = CERC_FILE_TYPES[f.type];
            return (
              <tr key={f.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-2 font-mono text-[10px]">
                  <button onClick={() => onViewDetail?.(f)} className="text-violet-600 hover:underline">{f.id}</button>
                </td>
                <td className="p-2"><Badge className={`${type?.color} text-[9px]`}>{type?.label}</Badge></td>
                <td className="p-2 text-center"><Badge variant="outline" className="text-[9px]">{f.format}</Badge></td>
                <td className="p-2 text-center">
                  {f.direction === 'inbound' ? (
                    <Badge className="bg-blue-100 text-blue-700 text-[9px]"><ArrowDown className="w-2.5 h-2.5 mr-0.5" />IN</Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 text-[9px]"><ArrowUp className="w-2.5 h-2.5 mr-0.5" />OUT</Badge>
                  )}
                </td>
                <td className="p-2 font-mono text-[10px] truncate max-w-[200px]">{f.file_name}</td>
                <td className="p-2 text-right text-[10px]">{(f.size_bytes / 1024).toFixed(0)} KB</td>
                <td className="p-2 text-right">{f.records_count}</td>
                <td className="p-2 text-[10px]">{new Date(f.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td className="p-2 text-center">
                  {f.status === 'processed' && <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">OK</Badge>}
                  {f.status === 'pending' && <Badge className="bg-amber-100 text-amber-700 text-[9px]">Pend.</Badge>}
                  {f.status === 'error' && <Badge className="bg-red-100 text-red-700 text-[9px]">Erro</Badge>}
                </td>
                <td className="p-2 text-center text-[10px]">v{f.version}</td>
                <td className="p-2 text-right">
                  <div className="flex gap-0.5 justify-end">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onViewDetail?.(f)}><Eye className="w-3 h-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6"><Download className="w-3 h-3" /></Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}