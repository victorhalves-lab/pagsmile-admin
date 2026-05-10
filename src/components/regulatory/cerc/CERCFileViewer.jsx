import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, FileText, Code, GitCompare, CheckCircle, AlertTriangle } from 'lucide-react';
import { CERC_FILE_TYPES, SAMPLE_CNAB_CONTENT, SAMPLE_XML_CONTENT } from '../mocks/urMock';
import { toast } from 'sonner';

export default function CERCFileViewer({ open, onOpenChange, file }) {
  if (!file) return null;
  const type = CERC_FILE_TYPES[file.type];
  const content = file.format === 'XML' ? SAMPLE_XML_CONTENT : SAMPLE_CNAB_CONTENT;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="font-mono text-sm">{file.id}</span>
            <Badge className={`${type?.color}`}>{type?.label}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Metadata */}
          <div className="p-3 bg-slate-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div><p className="text-[10px] text-slate-500">Formato</p><p className="font-bold">{file.format}</p></div>
            <div><p className="text-[10px] text-slate-500">Direção</p><p className="font-bold">{file.direction === 'inbound' ? 'CERC → PagSmile' : 'PagSmile → CERC'}</p></div>
            <div><p className="text-[10px] text-slate-500">Tamanho</p><p className="font-bold">{(file.size_bytes / 1024).toFixed(1)} KB</p></div>
            <div><p className="text-[10px] text-slate-500">Registros</p><p className="font-bold">{file.records_count}</p></div>
            <div className="col-span-2 md:col-span-4"><p className="text-[10px] text-slate-500">Checksum</p><p className="font-mono text-[10px]">{file.checksum}</p></div>
          </div>

          {/* Validation */}
          <div className={`p-3 rounded-lg border ${file.status === 'processed' ? 'bg-emerald-50 border-emerald-200' : file.status === 'error' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-2 text-xs">
              {file.status === 'processed' ? (
                <><CheckCircle className="w-4 h-4 text-emerald-600" /><span>Validação contra schema CERC: <strong>OK</strong></span></>
              ) : (
                <><AlertTriangle className="w-4 h-4 text-amber-600" /><span>Validação: <strong>{file.status === 'error' ? 'Falhou' : 'Pendente'}</strong></span></>
              )}
            </div>
          </div>

          {/* View tabs */}
          <Tabs defaultValue="raw">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="raw" className="text-xs"><FileText className="w-3 h-3 mr-1" />Bruto</TabsTrigger>
              <TabsTrigger value="structured" className="text-xs"><Code className="w-3 h-3 mr-1" />Interpretado</TabsTrigger>
              <TabsTrigger value="diff" className="text-xs"><GitCompare className="w-3 h-3 mr-1" />Diff versões</TabsTrigger>
            </TabsList>

            <TabsContent value="raw" className="mt-3">
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[10px] overflow-x-auto whitespace-pre">
{content}
              </pre>
            </TabsContent>

            <TabsContent value="structured" className="mt-3 space-y-2">
              <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-[11px]">
                <div className="font-bold text-violet-700">Header</div>
                <div className="ml-4 space-y-0.5 font-mono text-[10px]">
                  <div>FileType: <strong>{file.type}</strong></div>
                  <div>Originator: <strong>PAGSMILE</strong></div>
                  <div>RecordCount: <strong>{file.records_count}</strong></div>
                  <div>Timestamp: <strong>{new Date(file.created_at).toISOString()}</strong></div>
                </div>
                <div className="font-bold text-violet-700 pt-2 border-t">Records (preview)</div>
                <div className="ml-4 space-y-1">
                  {Array.from({ length: Math.min(3, file.records_count) }).map((_, i) => (
                    <div key={i} className="bg-white rounded p-2 border font-mono text-[10px]">
                      <div>UR-{String(2026000 + i).padStart(7, '0')} → Merchant 12345678000190 → R$ {(50000 - i * 12000).toLocaleString('pt-BR')}</div>
                    </div>
                  ))}
                  {file.records_count > 3 && <p className="text-[10px] text-slate-500">... +{file.records_count - 3} registros</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="diff" className="mt-3">
              {file.version > 1 ? (
                <div className="space-y-2 text-[11px]">
                  <p className="text-slate-500">Comparando v{file.version} ↔ v{file.version - 1}</p>
                  <div className="font-mono text-[10px] space-y-0.5">
                    <div className="bg-red-50 px-2 py-1 rounded">- 0000003UR-202600002 ... 0000005000000</div>
                    <div className="bg-emerald-50 px-2 py-1 rounded">+ 0000003UR-202600002 ... 0000003500000</div>
                    <p className="text-[10px] text-slate-500 mt-1">Diferença detectada: valor da UR-202600002 corrigido de R$ 50.000 para R$ 35.000</p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-slate-500 text-sm py-4">Esta é a primeira versão do arquivo</p>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t">
            <Button size="sm" variant="outline" onClick={() => toast.success('Download iniciado')}><Download className="w-3 h-3 mr-1" /> Baixar bruto</Button>
            {file.status === 'error' && (
              <Button size="sm" variant="outline" onClick={() => toast.success('Reprocessamento iniciado')}><RefreshCw className="w-3 h-3 mr-1" /> Reprocessar</Button>
            )}
            <Button size="sm" variant="outline" onClick={() => toast.success('Análise estruturada exportada')}>Exportar análise (PDF/XLSX)</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}