import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  QrCode,
  RotateCcw,
  ShieldAlert,
  ArrowUpFromLine,
  Zap,
  Settings,
  ArrowLeftRight,
  FileText,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const categoryConfig = {
  sale: { label: 'Venda', icon: CreditCard, color: 'text-green-600' },
  sale_card: { label: 'Venda Cartão', icon: CreditCard, color: 'text-green-600' },
  sale_pix: { label: 'Venda Pix', icon: QrCode, color: 'text-green-600' },
  refund: { label: 'Estorno', icon: RotateCcw, color: 'text-orange-600' },
  chargeback: { label: 'Chargeback', icon: ShieldAlert, color: 'text-red-600' },
  chargeback_reversal: { label: 'Reversão de CB', icon: ShieldAlert, color: 'text-green-600' },
  withdrawal: { label: 'Saque', icon: ArrowUpFromLine, color: 'text-purple-600' },
  anticipation: { label: 'Antecipação', icon: Zap, color: 'text-blue-600' },
  fee: { label: 'Taxa', icon: Settings, color: 'text-gray-600' },
  adjustment: { label: 'Ajuste', icon: FileText, color: 'text-gray-600' },
  split: { label: 'Split', icon: ArrowLeftRight, color: 'text-indigo-600' },
  transfer: { label: 'Transferência', icon: ArrowLeftRight, color: 'text-indigo-600' },
};

export default function FinancialStatementTable({ entries, isLoading, onViewTransaction }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Nenhuma movimentação encontrada no período selecionado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[180px]">Data/Hora</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const config = categoryConfig[entry.category] || categoryConfig.adjustment;
            const Icon = config.icon;
            const isCredit = entry.type === 'credit';

            return (
              <TableRow key={entry.id} className="hover:bg-gray-50">
                <TableCell className="text-sm">
                  <div>
                    {format(new Date(entry.created_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(entry.created_date), 'HH:mm', { locale: ptBR })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      isCredit ? "bg-green-100" : "bg-red-100"
                    )}>
                      {isCredit ? (
                        <ArrowUpCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Icon className={cn("w-4 h-4", config.color)} />
                        <span className="font-medium text-sm">{config.label}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{entry.description || '-'}</p>
                  {entry.reference_id && (
                    <p className="text-xs text-gray-500">Ref: {entry.reference_id}</p>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-semibold",
                    isCredit ? "text-green-600" : "text-red-600"
                  )}>
                    {isCredit ? '+' : '-'} {formatCurrency(Math.abs(entry.amount))}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(entry.balance_after)}
                </TableCell>
                <TableCell>
                  {entry.reference_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewTransaction?.(entry.reference_id)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}