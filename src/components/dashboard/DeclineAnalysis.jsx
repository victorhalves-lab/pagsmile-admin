import React from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  CreditCard, 
  Shield, 
  TrendingUp,
  RefreshCw,
  Ban
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const declineReasons = [
  {
    code: '51',
    label: 'NSF (Saldo Insuficiente)',
    description: 'Cartão sem saldo ou limite',
    recoverable: true,
    strategy: 'Oferecer Pix com desconto ou mais parcelas',
    icon: CreditCard,
    color: '#EF4444'
  },
  {
    code: '54',
    label: 'Limite Excedido',
    description: 'Limite de crédito ultrapassado',
    recoverable: true,
    strategy: 'Sugerir parcelamento ou outro cartão',
    icon: TrendingUp,
    color: '#F97316'
  },
  {
    code: '14',
    label: 'Cartão Inválido/Expirado',
    description: 'Dados do cartão incorretos',
    recoverable: true,
    strategy: 'Solicitar atualização do cartão',
    icon: Ban,
    color: '#8B5CF6'
  },
  {
    code: '59',
    label: 'Fraude/Suspeita',
    description: 'Bloqueio por suspeita de fraude',
    recoverable: false,
    strategy: 'Contato manual necessário',
    icon: Shield,
    color: '#DC2626'
  },
  {
    code: '05',
    label: 'Erro do Emissor',
    description: 'Problema técnico do banco',
    recoverable: true,
    strategy: 'Retry automático após 15 minutos',
    icon: RefreshCw,
    color: '#6B7280'
  },
];

export default function DeclineAnalysis({ transactions = [] }) {
  const declined = transactions.filter(t => t.status === 'declined' && t.type === 'card');
  
  // Group by decline reason
  const reasonBreakdown = declineReasons.map(reason => {
    const count = declined.filter(t => t.decline_code === reason.code).length;
    const value = declined
      .filter(t => t.decline_code === reason.code)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const percentage = declined.length > 0 ? (count / declined.length) * 100 : 0;
    
    return {
      ...reason,
      count,
      value,
      percentage
    };
  }).filter(r => r.count > 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value || 0);
  };

  const totalRecoverable = reasonBreakdown
    .filter(r => r.recoverable)
    .reduce((sum, r) => sum + r.value, 0);

  const chartData = reasonBreakdown.map(r => ({
    name: r.label,
    value: r.count
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Análise de Recusas</h3>
          <p className="text-sm text-gray-500">{declined.length} transações recusadas</p>
        </div>
        <Button variant="outline" size="sm" className="text-[#2bc196] border-[#2bc196]/30">
          Payment Recovery AI
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={reasonBreakdown[index].color}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} transações`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="space-y-3">
          {reasonBreakdown.map((reason) => {
            const Icon = reason.icon;
            
            return (
              <div
                key={reason.code}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded" style={{ backgroundColor: `${reason.color}20` }}>
                    <Icon className="w-4 h-4" style={{ color: reason.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{reason.label}</p>
                      <div className="flex items-center gap-2">
                        {reason.recoverable && (
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            Recuperável
                          </Badge>
                        )}
                        <span className="text-sm font-semibold">{reason.count}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{reason.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: reason.color }}>
                        {formatCurrency(reason.value)} ({reason.percentage.toFixed(0)}%)
                      </span>
                      {reason.recoverable && (
                        <span className="text-xs text-gray-500">{reason.strategy}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recovery Opportunity */}
      {totalRecoverable > 0 && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-emerald-900">Oportunidade de Recuperação</p>
              <p className="text-sm text-emerald-700">
                {formatCurrency(totalRecoverable)} em transações recuperáveis com o Recovery Agent
              </p>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Ativar Recovery
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}