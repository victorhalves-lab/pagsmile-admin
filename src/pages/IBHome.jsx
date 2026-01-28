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
  Lock
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
    { id: 1, type: 'received', description: 'Empresa XYZ Ltda', date: 'Hoje, 14:32', amount: 5000.00 },
    { id: 2, type: 'sent', description: 'Fornecedor ABC', date: 'Hoje, 11:15', amount: 2500.00 },
    { id: 3, type: 'received', description: 'Cliente João Silva', date: 'Ontem, 18:45', amount: 1200.00 },
    { id: 4, type: 'sent', description: 'Aluguel - Imobiliária', date: 'Ontem, 10:00', amount: 3500.00 },
    { id: 5, type: 'received', description: 'Pagamento Fatura #4523', date: '25/01, 09:23', amount: 8750.00 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Home</h1>
          <p className="text-slate-500 dark:text-slate-400">Bem-vindo à sua conta digital</p>
        </div>
      </div>

      {/* Compact Balance & Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compact Balance Card */}
        <div className="md:col-span-2">
          <Card className="bg-gradient-to-br from-[#101F3E] via-[#101F3E] to-[#1a2c52] text-white border-0 shadow-xl overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 p-32 bg-[#00D26A] opacity-[0.03] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Saldo em Conta</p>
                    <button onClick={() => setShowBalance(!showBalance)} className="text-slate-500 hover:text-white transition-colors">
                      {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">
                    {formatCurrency(balance.available)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#00D26A]/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[#00D26A]" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6 pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Bloqueado</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">{formatCurrency(balance.blocked)}</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase">Total</span>
                  <span className="text-sm font-medium text-slate-200 mt-0.5">{formatCurrency(balance.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compact Quick Actions */}
        <div className="flex flex-col gap-3 justify-center">
          <Link to={createPageUrl('IBPixSend')}>
            <Button variant="outline" className="w-full justify-start h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm relative overflow-hidden group">
              <div className="w-8 h-8 rounded-lg bg-[#00D26A]/10 flex items-center justify-center mr-3 group-hover:bg-[#00D26A] transition-colors">
                <Send className="w-4 h-4 text-[#00D26A] group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Enviar Pix</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
            </Button>
          </Link>
          
          <Link to={createPageUrl('IBPixReceive')}>
            <Button variant="outline" className="w-full justify-start h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm relative overflow-hidden group">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-500 transition-colors">
                <QrCode className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Receber Pix</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
            </Button>
          </Link>
          
          <Link to={createPageUrl('IBPixKeys')}>
            <Button variant="outline" className="w-full justify-start h-12 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm relative overflow-hidden group">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-500 transition-colors">
                <Key className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Minhas Chaves</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-slate-300" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Month Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Resumo do Mês
          </h2>
          <Badge variant="outline" className="font-normal">Janeiro</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Entradas</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(monthSummary.entries)}</p>
              <div className="mt-3">
                <div className="w-full h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">+{monthSummary.entriesChange}% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-slate-900">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Saídas</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(monthSummary.exits)}</p>
              <div className="mt-3">
                <div className="w-full h-2 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-600 font-medium">+{monthSummary.exitsChange}% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold">Últimas Movimentações</CardTitle>
          <Link to={createPageUrl('IBExtract')}>
            <Button variant="ghost" size="sm" className="text-[#00D26A] hover:text-[#00D26A] hover:bg-[#00D26A]/10">
              Ver extrato
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y dark:divide-slate-700">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    transaction.type === 'received'
                      ? "bg-emerald-100 dark:bg-emerald-900/50"
                      : "bg-red-100 dark:bg-red-900/50"
                  )}>
                    {transaction.type === 'received' ? (
                      <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {transaction.type === 'received' ? 'Pix Recebido' : 'Pix Enviado'}
                    </p>
                    <p className="text-sm text-slate-500">{transaction.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-semibold",
                    transaction.type === 'received' ? "text-emerald-600" : "text-red-600"
                  )}>
                    {transaction.type === 'received' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-slate-500">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}