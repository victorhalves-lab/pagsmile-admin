import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Clock,
  Lock,
  Truck,
  DollarSign,
  ChevronRight,
  Info,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function BalanceSummaryCards({ balances, isLoading, onAction }) {
  const {
    available = 0,
    pending = 0,
    blocked = 0,
    inTransit = 0,
    pendingBreakdown = [],
    blockedBreakdown = []
  } = balances || {};

  const total = available + pending + blocked + inTransit;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Saldo Disponível - Destaque Principal */}
      <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet className="w-16 h-16 text-emerald-600" />
        </div>
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-medium text-emerald-800 whitespace-nowrap overflow-hidden text-ellipsis">Saldo Disponível</p>
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-1 truncate">{formatCurrency(available)}</p>
          </div>
          <Button 
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            onClick={() => onAction?.('withdraw')}
          >
            Sacar Agora
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* 2. Saldo a Liberar - Informativo com Breakdown */}
      <Card className="border-blue-100 bg-white shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">A Liberar</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-gray-400" /></TooltipTrigger>
                  <TooltipContent>Recebíveis futuros agendados</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(pending)}</p>
            
            <div className="mt-3 space-y-1">
              {pendingBreakdown.slice(0, 2).map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-500">
                  <span>{item.label}</span>
                  <span className="font-medium text-gray-700">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 justify-between px-0"
            onClick={() => onAction?.('receivables')}
          >
            Ver Agenda
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* 3. Saldo Bloqueado - Alerta */}
      <Card className="border-orange-100 bg-white shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Bloqueado</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-gray-400" /></TooltipTrigger>
                  <TooltipContent>Retenções por disputa ou risco</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(blocked)}</p>
            
            <div className="mt-3 space-y-1">
              {blockedBreakdown.slice(0, 2).map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-500">
                  <span>{item.label}</span>
                  <span className="font-medium text-gray-700">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 justify-between px-0"
            onClick={() => onAction?.('blocked')}
          >
            Ver Detalhes
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* 4. Em Trânsito - Status de Saque */}
      <Card className="border-purple-100 bg-purple-50/30 shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Em Trânsito</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-gray-400" /></TooltipTrigger>
                  <TooltipContent>Saques solicitados aguardando compensação bancária</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate">{formatCurrency(inTransit)}</p>
            <p className="text-xs text-purple-600 mt-2 bg-purple-100 inline-block px-2 py-0.5 rounded-full font-medium">
              Aguardando Banco
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 justify-between px-0"
            onClick={() => onAction?.('withdrawals')}
          >
            Acompanhar Saques
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* 5. Saldo Total - Visão Geral */}
      <Card className="border-gray-200 bg-gray-50/50 shadow-sm">
        <CardContent className="p-5 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <p className="text-sm font-medium text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Saldo Total</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1 truncate">{formatCurrency(total)}</p>
          <p className="text-xs text-gray-500">Soma de todos os saldos</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
             <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={() => onAction?.('receivables')}
             >
                <Download className="w-3 h-3 mr-2" />
                Relatório Geral
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}