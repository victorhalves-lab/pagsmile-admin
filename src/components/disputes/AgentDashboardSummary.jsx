import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bot, 
  Shield, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Target,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentDashboardSummary({ 
  config = {},
  onToggleAgent,
  isLoading = false
}) {
  const winRate = config.total_won && config.total_disputes_managed 
    ? ((config.total_won / (config.total_won + config.total_lost)) * 100).toFixed(1) 
    : 0;

  const stats = [
    {
      label: 'Disputas Gerenciadas',
      value: config.total_disputes_managed || 0,
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Win Rate',
      value: `${winRate}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Valor Protegido',
      value: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
        notation: 'compact'
      }).format(config.total_value_protected || 0),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Pré-CBs Prevenidos',
      value: config.total_pre_cbs_prevented || 0,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Dispute Manager Agent</CardTitle>
              <p className="text-xs text-gray-500">Gerenciamento inteligente de disputas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={cn(
              config.is_agent_enabled 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-600"
            )}>
              {config.is_agent_enabled ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Ativo
                </>
              ) : 'Inativo'}
            </Badge>
            <Switch 
              checked={config.is_agent_enabled || false}
              onCheckedChange={onToggleAgent}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={cn("p-3 rounded-lg", stat.bgColor)}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-xs text-gray-600">{stat.label}</span>
              </div>
              <p className={cn("text-xl font-bold", stat.color)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {config.is_agent_enabled && (
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-900">Configuração Atual</p>
                <p className="text-xs text-purple-700 mt-1">
                  Auto-ação para probabilidade ≥{config.auto_action_probability_threshold || 70}% 
                  e valor ≤ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(config.max_value_for_auto_action || 500)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}