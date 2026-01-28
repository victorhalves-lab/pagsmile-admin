import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  X,
  Copy,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function IBExtract() {
  const [period, setPeriod] = useState('30d');
  const [transactionType, setTransactionType] = useState('all');
  const [direction, setDirection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Mock data
  const periodSummary = {
    initialBalance: 60430.50,
    finalBalance: 125430.50,
    totalEntries: 250000.00,
    totalExits: 185000.00
  };

  const transactions = [
    {
      id: 'PIX-2026012714324598765',
      endToEndId: 'E123456782026012714324598765432',
      type: 'received',
      description: 'Empresa XYZ Ltda',
      payerName: 'Empresa XYZ Ltda',
      payerDocument: '12.345.678/0001-90',
      payerBank: 'Banco Inter (077)',
      payerKey: 'financeiro@xyz.com.br',
      recipientName: 'Loja ABC Comércio Ltda',
      recipientDocument: '98.765.432/0001-10',
      recipientBank: 'PagSmile (XXX)',
      recipientKey: '98.765.432/0001-10',
      amount: 5000.00,
      balanceAfter: 125430.50,
      date: '2026-01-27',
      time: '14:32:45',
      memo: 'Pagamento referente à NF 4523 - Serviços de marketing digital'
    },
    {
      id: 'PIX-2026012711154598765',
      endToEndId: 'E987654322026012711154598765432',
      type: 'sent',
      description: 'Fornecedor ABC',
      payerName: 'Loja ABC Comércio Ltda',
      payerDocument: '98.765.432/0001-10',
      payerBank: 'PagSmile (XXX)',
      payerKey: '98.765.432/0001-10',
      recipientName: 'Fornecedor ABC Ltda',
      recipientDocument: '12.345.678/0001-90',
      recipientBank: 'Banco do Brasil (001)',
      recipientKey: 'forn@abc.com',
      amount: 2500.00,
      balanceAfter: 120430.50,
      date: '2026-01-27',
      time: '11:15:22',
      memo: 'Pagamento NF 4567 - Material de escritório'
    },
    {
      id: 'PIX-2026012709454598765',
      endToEndId: 'E456789012026012709454598765432',
      type: 'received',
      description: 'Cliente Maria',
      payerName: 'Maria Santos',
      payerDocument: '***456.789-**',
      payerBank: 'Nubank (260)',
      payerKey: '(11) 9****-4567',
      recipientName: 'Loja ABC Comércio Ltda',
      recipientDocument: '98.765.432/0001-10',
      recipientBank: 'PagSmile (XXX)',
      recipientKey: '98.765.432/0001-10',
      amount: 3200.00,
      balanceAfter: 122930.50,
      date: '2026-01-27',
      time: '09:45:10',
      memo: ''
    },
    {
      id: 'PIX-2026012618454598765',
      endToEndId: 'E789012342026012618454598765432',
      type: 'received',
      description: 'João Silva',
      payerName: 'João Silva',
      payerDocument: '***123.456-**',
      payerBank: 'Itaú (341)',
      payerKey: 'joao@email.com',
      recipientName: 'Loja ABC Comércio Ltda',
      recipientDocument: '98.765.432/0001-10',
      recipientBank: 'PagSmile (XXX)',
      recipientKey: '98.765.432/0001-10',
      amount: 1200.00,
      balanceAfter: 119730.50,
      date: '2026-01-26',
      time: '18:45:33',
      memo: ''
    },
    {
      id: 'PIX-2026012610004598765',
      endToEndId: 'E012345672026012610004598765432',
      type: 'sent',
      description: 'Aluguel - Imobiliária',
      payerName: 'Loja ABC Comércio Ltda',
      payerDocument: '98.765.432/0001-10',
      payerBank: 'PagSmile (XXX)',
      payerKey: '98.765.432/0001-10',
      recipientName: 'Imobiliária Centro LTDA',
      recipientDocument: '**567.890/0001-**',
      recipientBank: 'Bradesco (237)',
      recipientKey: 'aluguel@imob.com.br',
      amount: 3500.00,
      balanceAfter: 118530.50,
      date: '2026-01-26',
      time: '10:00:00',
      memo: 'Aluguel referente ao mês de Janeiro/2026'
    },
  ];

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Extrato</h1>
          <p className="text-slate-500 dark:text-slate-400">Histórico completo de movimentações</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="sent">Pix Enviado</SelectItem>
                <SelectItem value="received">Pix Recebido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Direção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="in">Entradas</SelectItem>
                <SelectItem value="out">Saídas</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  Excel/CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  OFX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Period Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Saldo Inicial</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(periodSummary.initialBalance)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Saldo Final</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(periodSummary.finalBalance)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <p className="text-xs text-emerald-600 uppercase tracking-wider">Entradas</p>
            <p className="text-lg font-bold text-emerald-600 mt-1">
              + {formatCurrency(periodSummary.totalEntries)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <p className="text-xs text-red-600 uppercase tracking-wider">Saídas</p>
            <p className="text-lg font-bold text-red-600 mt-1">
              - {formatCurrency(periodSummary.totalExits)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date}>
              <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/50 border-y dark:border-slate-700">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {formatDateHeader(date)}
                </p>
              </div>
              {dayTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => setSelectedTransaction(transaction)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b dark:border-slate-700 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500 w-12">
                      {transaction.time.slice(0, 5)}
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      transaction.type === 'received'
                        ? "bg-emerald-100 dark:bg-emerald-900/50"
                        : "bg-red-100 dark:bg-red-900/50"
                    )}>
                      {transaction.type === 'received' ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {transaction.type === 'received' ? 'Pix Recebido' : 'Pix Enviado'}
                      </p>
                      <p className="text-sm text-slate-500">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold",
                        transaction.type === 'received' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {transaction.type === 'received' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Saldo: {formatCurrency(transaction.balanceAfter)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t dark:border-slate-700">
            <p className="text-sm text-slate-500">
              Mostrando 1-5 de 156 movimentações
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Página {currentPage} de 32
              </span>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Movimentação</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center py-4 border-b dark:border-slate-700">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3",
                  selectedTransaction.type === 'received'
                    ? "bg-emerald-100 dark:bg-emerald-900/50"
                    : "bg-red-100 dark:bg-red-900/50"
                )}>
                  {selectedTransaction.type === 'received' ? (
                    <ArrowDownLeft className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <p className="text-sm text-slate-500 uppercase tracking-wider">
                  {selectedTransaction.type === 'received' ? 'Pix Recebido' : 'Pix Enviado'}
                </p>
                <p className={cn(
                  "text-3xl font-bold mt-1",
                  selectedTransaction.type === 'received' ? "text-emerald-600" : "text-red-600"
                )}>
                  {selectedTransaction.type === 'received' ? '+' : '-'} {formatCurrency(selectedTransaction.amount)}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  {new Date(selectedTransaction.date + 'T' + selectedTransaction.time).toLocaleString('pt-BR')}
                </p>
              </div>

              {/* Transaction Info */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Informações da Transação
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID da Transação</span>
                    <span className="font-mono text-slate-900 dark:text-white">{selectedTransaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">End-to-End ID</span>
                    <span className="font-mono text-xs text-slate-900 dark:text-white">{selectedTransaction.endToEndId.slice(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Concluída
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Payer/Recipient Info */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {selectedTransaction.type === 'received' ? 'Pagador' : 'Destinatário'}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nome</span>
                    <span className="text-slate-900 dark:text-white">
                      {selectedTransaction.type === 'received' ? selectedTransaction.payerName : selectedTransaction.recipientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CPF/CNPJ</span>
                    <span className="text-slate-900 dark:text-white">
                      {selectedTransaction.type === 'received' ? selectedTransaction.payerDocument : selectedTransaction.recipientDocument}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Instituição</span>
                    <span className="text-slate-900 dark:text-white">
                      {selectedTransaction.type === 'received' ? selectedTransaction.payerBank : selectedTransaction.recipientBank}
                    </span>
                  </div>
                </div>
              </div>

              {/* Memo */}
              {selectedTransaction.memo && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Descrição
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    {selectedTransaction.memo}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t dark:border-slate-700">
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Baixar Comprovante
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}