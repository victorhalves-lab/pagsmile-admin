import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  Eye,
  EyeOff,
  Send,
  QrCode,
  Key,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Wallet,
  Lock,
  Sparkles,
  Calendar,
  Clock,
  CreditCard,
  Banknote,
  CircleDollarSign,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function IBHome() {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (value) => {
    if (!showBalance) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Mock data
  const balance = {
    available: 125430.50,
    blocked: 5000.00,
    total: 130430.50
  };

  const monthSummary = {
    entries: 250000.00,
    entriesChange: 18,
    exits: 185000.00,
    exitsChange: 5
  };

  const recentTransactions = [
    { id: 1, type: 'received', description: 'Empresa XYZ Ltda', date: 'Hoje, 14:32', amount: 5000.00, category: 'Vendas' },
    { id: 2, type: 'sent', description: 'Fornecedor ABC', date: 'Hoje, 11:15', amount: 2500.00, category: 'Fornecedores' },
    { id: 3, type: 'received', description: 'Cliente João Silva', date: 'Ontem, 18:45', amount: 1200.00, category: 'Vendas' },
    { id: 4, type: 'sent', description: 'Aluguel - Imobiliária', date: 'Ontem, 10:00', amount: 3500.00, category: 'Despesas' },
    { id: 5, type: 'received', description: 'Pagamento Fatura #4523', date: '25/01, 09:23', amount: 8750.00, category: 'Recebíveis' },
  ];

  const quickActions = [
    { icon: Send, label: 'Enviar Pix', page: 'IBPixSend', color: 'from-[#2bc196] to-emerald-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { icon: QrCode, label: 'Receber Pix', page: 'IBPixReceive', color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
    { icon: Key, label: 'Minhas Chaves', page: 'IBPixKeys', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50', textColor: 'text-violet-600' },
    { icon: CreditCard, label: 'Cartões', page: 'IBHome', color: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-50', textColor: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header with greeting */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#2bc196]" />
            <span className="text-sm text-[#2bc196] font-medium">Bom dia!</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sua Conta Digital</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" />
            Última atualização: agora mesmo
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-[#2bc196] to-emerald-500 text-white border-0 px-3 py-1">
          <CircleDollarSign className="w-3 h-3 mr-1" /> Conta Ativa
        </Badge>
      </div>

      {/* Main Balance Card */}
      <Card className="bg-gradient-to-br from-[#002443] via-[#003459] to-[#004D73] text-white border-0 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2bc196] opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2bc196] to-emerald-500 flex items-center justify-center shadow-lg shadow-[#2bc196]/30">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Saldo Disponível</p>
                    <button onClick={() => setShowBalance(!showBalance)} className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-4xl font-black tracking-tight text-white mt-1">
                    {formatCurrency(balance.available)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase block">Bloqueado</span>
                    <span className="text-sm font-bold text-amber-400">{formatCurrency(balance.blocked)}</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Banknote className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase block">Total</span>
                    <span className="text-sm font-bold text-white">{formatCurrency(balance.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions inside card */}
            <div className="flex gap-3">
              {quickActions.slice(0, 3).map((action, idx) => {
                const IconComponent = action.icon;
                return (
                  <Link key={idx} to={createPageUrl(action.page)}>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 min-w-[90px]">
                      <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", action.color)}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-white">{action.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Month Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2bc196]" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Resumo do Mês</h2>
          </div>
          <Badge variant="outline" className="font-semibold border-[#2bc196] text-[#2bc196]">
            Janeiro 2026
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white dark:from-emerald-950/40 dark:via-emerald-950/20 dark:to-slate-900 overflow-hidden relative group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 opacity-10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-[#2bc196] flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <ArrowDownLeft className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Entradas</span>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Total recebido</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{monthSummary.entriesChange}%</span>
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{formatCurrency(monthSummary.entries)}</p>
              <div className="mt-4">
                <div className="w-full h-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-[#2bc196] rounded-full transition-all duration-500" style={{ width: '100%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 via-red-50/50 to-white dark:from-red-950/40 dark:via-red-950/20 dark:to-slate-900 overflow-hidden relative group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 opacity-10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">Saídas</span>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70">Total enviado</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/50">
                  <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">+{monthSummary.exitsChange}%</span>
                </div>
              </div>
              <p className="text-3xl font-black text-red-700 dark:text-red-300">{formatCurrency(monthSummary.exits)}</p>
              <div className="mt-4">
                <div className="w-full h-3 bg-red-100 dark:bg-red-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-500" style={{ width: '74%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#2bc196]/20">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">Últimas Movimentações</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">Suas transações recentes</p>
            </div>
          </div>
          <Link to={createPageUrl('IBExtract')}>
            <Button variant="outline" size="sm" className="gap-2 border-[#2bc196] text-[#2bc196] hover:bg-[#2bc196] hover:text-white transition-all duration-300">
              Ver extrato
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((transaction, idx) => (
              <div
                key={transaction.id}
                className={cn(
                  "flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group",
                  idx === 0 && "bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110",
                    transaction.type === 'received'
                      ? "bg-gradient-to-br from-emerald-400 to-[#2bc196] shadow-emerald-500/20"
                      : "bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/20"
                  )}>
                    {transaction.type === 'received' ? (
                      <ArrowDownLeft className="w-5 h-5 text-white" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {transaction.type === 'received' ? 'Pix Recebido' : 'Pix Enviado'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-slate-200 text-slate-500">
                        {transaction.category}
                      </Badge>
                      <span className="text-xs text-slate-400">{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-lg font-bold",
                    transaction.type === 'received' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {transaction.type === 'received' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}