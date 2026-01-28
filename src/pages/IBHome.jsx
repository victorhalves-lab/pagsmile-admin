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

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00D26A]/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#00D26A]" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Saldo Disponível</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(balance.available)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs text-slate-400">Bloqueado</p>
                <p className="text-sm font-semibold text-amber-400">{formatCurrency(balance.blocked)}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-xs text-slate-400">Saldo Total</p>
              <p className="text-sm font-semibold">{formatCurrency(balance.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Link to={createPageUrl('IBPixSend')}>
            <Card className="hover:shadow-lg hover:border-[#00D26A]/30 transition-all cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#00D26A]/10 flex items-center justify-center mb-3 group-hover:bg-[#00D26A]/20 transition-colors">
                  <Send className="w-6 h-6 text-[#00D26A]" />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">Enviar Pix</p>
                <p className="text-xs text-slate-500 mt-1">Transferir agora</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('IBPixReceive')}>
            <Card className="hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">Receber Pix</p>
                <p className="text-xs text-slate-500 mt-1">QR Code e chaves</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('IBPixKeys')}>
            <Card className="hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Key className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">Minhas Chaves</p>
                <p className="text-xs text-slate-500 mt-1">Gerenciar chaves</p>
              </CardContent>
            </Card>
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