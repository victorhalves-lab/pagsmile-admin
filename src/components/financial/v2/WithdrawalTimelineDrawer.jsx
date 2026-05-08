import React from 'react';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, ArrowUpFromLine, Building2, Download, X, RefreshCcw, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const TimelineStep = ({ icon: Icon, label, time, done, active }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-emerald-500 text-white' : active ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className={`flex-1 w-px ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />
    </div>
    <div className="pb-6">
      <p className={`text-sm font-medium ${done || active ? 'text-slate-800' : 'text-slate-400'}`}>{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{time || '—'}</p>
    </div>
  </div>
);

/**
 * Drawer com timeline visual + ações (cancelar, comprovante, repetir).
 */
export default function WithdrawalTimelineDrawer({ withdrawal, open, onOpenChange }) {
  if (!withdrawal) return null;

  const isPending = ['pending', 'processing'].includes(withdrawal.status);
  const isCompleted = withdrawal.status === 'completed';

  const handleCopy = () => {
    navigator.clipboard.writeText(withdrawal.withdrawal_id);
    toast.success('ID copiado');
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Detalhes do Saque"
      description={withdrawal.withdrawal_id}
      icon={ArrowUpFromLine}
      footer={
        <div className="flex justify-between gap-2 w-full">
          <div className="flex gap-2">
            {isPending && (
              <Button variant="outline" size="sm" onClick={() => toast.success('Saque cancelado (mock)')}>
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
            )}
            {isCompleted && (
              <>
                <Button variant="outline" size="sm" onClick={() => toast.success('Comprovante gerado (mock)')}>
                  <Download className="w-4 h-4 mr-1" /> Comprovante
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success('Repetindo saque (mock)')}>
                  <RefreshCcw className="w-4 h-4 mr-1" /> Repetir
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Resumo */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Valor</span>
            <span className="font-bold text-lg text-slate-800">{formatCurrency(withdrawal.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Tipo</span>
            <Badge variant="outline">{withdrawal.pix_key ? 'PIX' : 'TED'}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Conta destino</span>
            <span className="text-sm text-slate-700">{withdrawal.bank_name || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">ID</span>
            <button onClick={handleCopy} className="text-sm text-slate-700 flex items-center gap-1 hover:text-emerald-600">
              {withdrawal.withdrawal_id} <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Linha do tempo</h4>
          <div>
            <TimelineStep icon={CheckCircle2} label="Solicitado" time={format(new Date(withdrawal.created_date), 'dd/MM HH:mm')} done />
            <TimelineStep icon={CheckCircle2} label="Aprovado internamente" time={format(new Date(withdrawal.created_date), 'dd/MM HH:mm')} done={!isPending || withdrawal.status === 'processing'} />
            <TimelineStep icon={Clock} label="Em processamento bancário" time={isPending ? 'Em andamento' : format(new Date(withdrawal.created_date), 'dd/MM HH:mm')} done={isCompleted} active={withdrawal.status === 'processing'} />
            <TimelineStep icon={Building2} label="Confirmado em conta destino" time={isCompleted ? format(new Date(withdrawal.created_date), 'dd/MM HH:mm') : null} done={isCompleted} />
          </div>
        </div>

        {/* Decomposição */}
        <div className="p-4 border rounded-lg space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Decomposição</h4>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Valor solicitado</span>
            <span className="text-slate-700">{formatCurrency(withdrawal.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Taxa PagSmile</span>
            <span className="text-red-600">-{formatCurrency(withdrawal.fee || 0)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t">
            <span className="font-semibold text-slate-700">Líquido recebido</span>
            <span className="font-bold text-emerald-600">{formatCurrency(withdrawal.net_amount || withdrawal.amount)}</span>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}