import React, { useState } from 'react';
import {
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function IBPixLimits() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLimit, setEditingLimit] = useState(null);
  const [newLimitValue, setNewLimitValue] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const limits = {
    daytime: {
      perTransaction: 50000,
      daily: 200000,
      usedToday: 2500,
      period: '6h às 20h'
    },
    nighttime: {
      perTransaction: 5000,
      daily: 10000,
      usedToday: 0,
      period: '20h às 6h'
    }
  };

  const limitHistory = [
    {
      id: 1,
      date: '15/01/2026',
      type: 'Aumento diurno',
      from: 100000,
      to: 200000,
      status: 'approved'
    },
    {
      id: 2,
      date: '10/12/2025',
      type: 'Aumento noturno',
      from: 5000,
      to: 10000,
      status: 'rejected'
    },
  ];

  const daytimeUsagePercent = (limits.daytime.usedToday / limits.daytime.daily) * 100;
  const daytimeAvailable = limits.daytime.daily - limits.daytime.usedToday;

  const handleEditLimit = (type) => {
    setEditingLimit(type);
    setNewLimitValue('');
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Limites Pix</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie seus limites de transferência</p>
        </div>
      </div>

      {/* Current Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daytime Limit */}
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Limite Diurno</CardTitle>
                  <p className="text-sm text-slate-500">{limits.daytime.period}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditLimit('daytime')}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Alterar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Por Transação</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(limits.daytime.perTransaction)}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Diário</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(limits.daytime.daily)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Utilizado hoje</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(limits.daytime.usedToday)}
                </span>
              </div>
              <Progress value={daytimeUsagePercent} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Disponível</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(daytimeAvailable)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nighttime Limit */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Limite Noturno</CardTitle>
                  <p className="text-sm text-slate-500">{limits.nighttime.period}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditLimit('nighttime')}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Alterar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Por Transação</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(limits.nighttime.perTransaction)}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Diário</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(limits.nighttime.daily)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Limites noturnos são mais baixos por segurança. Transações acima do limite serão bloqueadas automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Limit Change Info */}
      <Card className="bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Sobre alterações de limite</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong>Aumentos</strong> podem levar até 48 horas para serem aprovados e podem requerer análise de segurança.</span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Reduções</strong> são aplicadas imediatamente para sua segurança.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* History */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Histórico de Alterações
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y dark:divide-slate-700">
              {limitHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500 w-20">{item.date}</div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.type}</p>
                      <p className="text-sm text-slate-500">
                        {formatCurrency(item.from)} → {formatCurrency(item.to)}
                      </p>
                    </div>
                  </div>
                  {item.status === 'approved' ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Aprovado
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-0">
                      <XCircle className="w-3 h-3 mr-1" />
                      Negado
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Limit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Solicitar Alteração de Limite {editingLimit === 'daytime' ? 'Diurno' : 'Noturno'}
            </DialogTitle>
            <DialogDescription>
              Informe o novo valor desejado para o limite.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Limite por transação (atual: {formatCurrency(
                editingLimit === 'daytime' ? limits.daytime.perTransaction : limits.nighttime.perTransaction
              )})</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={newLimitValue}
                  onChange={(e) => setNewLimitValue(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium">Prazo de análise</p>
                <p>Aumentos de limite podem levar até 48 horas para aprovação.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#00D26A] hover:bg-[#00B85C]">
              Solicitar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}