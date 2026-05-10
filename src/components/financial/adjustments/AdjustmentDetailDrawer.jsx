import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, Shield, History, Download } from 'lucide-react';
import { ADJUSTMENT_STATUS, ADJUSTMENT_REASONS, formatCurrency } from './mocks/manualAdjustmentsMock';

export default function AdjustmentDetailDrawer({ open, onOpenChange, adjustment }) {
  if (!adjustment) return null;
  const status = ADJUSTMENT_STATUS[adjustment.status];
  const reason = ADJUSTMENT_REASONS[adjustment.reason || adjustment.reason_code];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="font-mono text-sm">{adjustment.id}</span>
            <Badge className={status?.color}>{status?.label}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className={`p-4 rounded-lg ${adjustment.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <p className="text-xs text-slate-500 mb-1">{adjustment.type === 'credit' ? 'Crédito' : 'Débito'}</p>
            <p className={`text-3xl font-black ${adjustment.type === 'credit' ? 'text-emerald-700' : 'text-red-700'}`}>
              {adjustment.type === 'credit' ? '+' : '−'}{formatCurrency(adjustment.amount)}
            </p>
            <p className="text-xs text-slate-600 mt-1">{adjustment.merchant?.name} · {adjustment.merchant?.cnpj}</p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview" className="text-xs">Visão</TabsTrigger>
              <TabsTrigger value="accounting" className="text-xs">Contábil</TabsTrigger>
              <TabsTrigger value="evidence" className="text-xs">Evidências</TabsTrigger>
              <TabsTrigger value="audit" className="text-xs">Auditoria</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-3 space-y-2 text-xs">
              <Field label="Motivo" value={<Badge className={reason?.color}>{reason?.label}</Badge>} />
              <Field label="Categoria" value={adjustment.category} />
              <Field label="Descrição" value={adjustment.description} />
              <Field label="Solicitante" value={adjustment.created_by} />
              <Field label="Aprovador L2" value={adjustment.approved_by || '—'} />
              <Field label="Criado em" value={new Date(adjustment.created_at).toLocaleString('pt-BR')} />
              {adjustment.executed_at && <Field label="Executado em" value={new Date(adjustment.executed_at).toLocaleString('pt-BR')} />}
            </TabsContent>

            <TabsContent value="accounting" className="mt-3 space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between"><span>Conta origem</span><span>{adjustment.type === 'credit' ? 'PAGSMILE_REVENUE_4011' : 'PAGSMILE_FEES_3022'}</span></div>
                <div className="flex justify-between"><span>Conta destino</span><span>MERCHANT_BALANCE_{adjustment.merchant?.id}</span></div>
                <div className="flex justify-between font-bold pt-2 border-t"><span>Valor:</span><span>{formatCurrency(adjustment.amount)}</span></div>
              </div>
              <p className="text-[10px] text-slate-500">Histórico contábil aplicado conforme regras de classificação automática.</p>
            </TabsContent>

            <TabsContent value="evidence" className="mt-3 space-y-2 text-xs">
              <p className="text-slate-500 mb-2">{adjustment.evidence_count} evidência(s) anexada(s)</p>
              {Array.from({ length: adjustment.evidence_count || 0 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2 border rounded-lg">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="flex-1">evidence_{i + 1}.pdf</span>
                  <Button size="sm" variant="ghost" className="h-7 text-[10px]">
                    <Download className="w-3 h-3 mr-1" /> Baixar
                  </Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="audit" className="mt-3 space-y-2 text-xs">
              <div className="border-l-2 border-violet-300 pl-3 space-y-2">
                <div>
                  <p className="font-bold">Solicitação criada</p>
                  <p className="text-[10px] text-slate-500">{adjustment.created_by} · {new Date(adjustment.created_at).toLocaleString('pt-BR')}</p>
                </div>
                {adjustment.approved_by && (
                  <div>
                    <p className="font-bold">Aprovação L2</p>
                    <p className="text-[10px] text-slate-500">{adjustment.approved_by}</p>
                  </div>
                )}
                {adjustment.executed_at && (
                  <div>
                    <p className="font-bold">Executado</p>
                    <p className="text-[10px] text-slate-500">{new Date(adjustment.executed_at).toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between items-start py-1 border-b last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-right ml-2">{value}</span>
    </div>
  );
}