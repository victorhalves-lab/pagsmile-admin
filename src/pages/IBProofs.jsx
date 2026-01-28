import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  Calendar,
  Share2,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  File,
  FileSpreadsheet
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
import { cn } from '@/lib/utils';

export default function IBProofs() {
  const [period, setPeriod] = useState('30d');
  const [transactionType, setTransactionType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const proofs = [
    {
      id: 'PIX-2026012715324598765',
      type: 'sent',
      description: 'Fornecedor ABC Ltda',
      amount: 2500.00,
      date: '27/01/2026',
      time: '15:32'
    },
    {
      id: 'PIX-2026012714324598765',
      type: 'received',
      description: 'Empresa XYZ Ltda',
      amount: 5000.00,
      date: '27/01/2026',
      time: '14:32'
    },
    {
      id: 'PIX-2026012610004598765',
      type: 'sent',
      description: 'Aluguel - Imobiliária',
      amount: 3500.00,
      date: '26/01/2026',
      time: '10:00'
    },
    {
      id: 'PIX-2026012618454598765',
      type: 'received',
      description: 'João Silva',
      amount: 1200.00,
      date: '26/01/2026',
      time: '18:45'
    },
    {
      id: 'PIX-2026012509234598765',
      type: 'received',
      description: 'Pagamento Fatura #4523',
      amount: 8750.00,
      date: '25/01/2026',
      time: '09:23'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Comprovantes</h1>
          <p className="text-slate-500 dark:text-slate-400">Central de documentos e comprovantes</p>
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
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
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

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por ID, nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proofs List */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Comprovantes
        </h2>
        <Card>
          <CardContent className="p-0 divide-y dark:divide-slate-700">
            {proofs.map((proof) => (
              <div key={proof.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      proof.type === 'received'
                        ? "bg-emerald-100 dark:bg-emerald-900/50"
                        : "bg-red-100 dark:bg-red-900/50"
                    )}>
                      {proof.type === 'received' ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {proof.type === 'received' ? 'Pix Recebido' : 'Pix Enviado'}
                        </p>
                        <span className="text-sm text-slate-500">
                          {proof.date} {proof.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{proof.description}</p>
                      <p className={cn(
                        "font-semibold mt-1",
                        proof.type === 'received' ? "text-emerald-600" : "text-red-600"
                      )}>
                        {proof.type === 'received' ? '+' : '-'} {formatCurrency(proof.amount)}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-1">ID: {proof.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Documents Section */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Documentos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">Extrato Mensal</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Gerar extrato em PDF de qualquer período
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Gerar Extrato
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <File className="w-7 h-7 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">Informe de Rendimentos</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Para declaração de Imposto de Renda
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Baixar 2025
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}