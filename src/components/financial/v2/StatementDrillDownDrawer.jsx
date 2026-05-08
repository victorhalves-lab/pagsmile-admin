import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, ArrowDownCircle, Copy, ExternalLink, Receipt, Tag, Calendar, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fmtBRL } from './utils';
import { toast } from 'sonner';

// Drill-down drawer for statement entries — Stripe inspired
export default function StatementDrillDownDrawer({ entry, open, onClose }) {
  if (!entry) return null;

  const isCredit = entry.type === 'credit';

  const copyId = () => {
    navigator.clipboard.writeText(entry.entry_id || entry.id);
    toast.success('ID copiado');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {isCredit ? (
                <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <ArrowUpCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base truncate">{entry.description || entry.category}</SheetTitle>
              <SheetDescription className="capitalize text-xs">{entry.category}</SheetDescription>
            </div>
            <div className={`text-xl font-bold ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
              {isCredit ? '+' : '-'}{fmtBRL(entry.amount)}
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Detalhes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Detalhes</h4>
            <div className="space-y-1.5 text-sm">
              <Row icon={Hash} label="ID do lançamento">
                <button onClick={copyId} className="font-mono text-xs hover:text-blue-600 inline-flex items-center gap-1">
                  {entry.entry_id || entry.id} <Copy className="w-3 h-3" />
                </button>
              </Row>
              <Row icon={Calendar} label="Data">
                {entry.created_date ? format(new Date(entry.created_date), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }) : '-'}
              </Row>
              <Row icon={Tag} label="Categoria">
                <Badge variant="outline" className="capitalize">{entry.category}</Badge>
              </Row>
              {entry.balance_after !== undefined && (
                <Row icon={Receipt} label="Saldo após">
                  <span className="font-mono">{fmtBRL(entry.balance_after)}</span>
                </Row>
              )}
              {entry.reference_id && (
                <Row icon={Hash} label="Referência">
                  <span className="font-mono text-xs">{entry.reference_id}</span>
                </Row>
              )}
            </div>
          </div>

          {/* Liquidação */}
          {(entry.settlement_date || entry.available_date) && (
            <div className="space-y-2 pt-3 border-t">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Liquidação</h4>
              <div className="space-y-1.5 text-sm">
                {entry.settlement_date && (
                  <Row icon={Calendar} label="Data de liquidação">
                    {format(new Date(entry.settlement_date), 'dd/MM/yyyy')}
                  </Row>
                )}
                {entry.available_date && (
                  <Row icon={Calendar} label="Disponível em">
                    {format(new Date(entry.available_date), 'dd/MM/yyyy')}
                  </Row>
                )}
              </div>
            </div>
          )}

          {/* Linha do tempo simplificada */}
          <div className="space-y-2 pt-3 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Timeline</h4>
            <div className="space-y-2">
              <TimelineDot label="Lançamento criado" date={entry.created_date} done />
              {entry.settlement_date && (
                <TimelineDot label="Liquidação prevista" date={entry.settlement_date} done={new Date(entry.settlement_date) <= new Date()} />
              )}
            </div>
          </div>

          <div className="pt-3 border-t flex gap-2">
            {entry.reference_id && (
              <Button variant="outline" size="sm" className="flex-1">
                <ExternalLink className="w-3 h-3 mr-1" />
                Ver transação
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1">
              <Receipt className="w-3 h-3 mr-1" />
              Gerar comprovante
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <div className="text-slate-800 text-sm">{children}</div>
    </div>
  );
}

function TimelineDot({ label, date, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <span className="text-xs text-slate-700 flex-1">{label}</span>
      {date && <span className="text-[10px] text-slate-500">{format(new Date(date), 'dd/MM HH:mm')}</span>}
    </div>
  );
}