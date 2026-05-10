import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, Clock, FileWarning } from 'lucide-react';
import { toast } from 'sonner';

const ANOMALIES = [
  {
    severity: 'high',
    title: 'URs vencendo em 24h sem registro confirmado',
    description: '3 URs próximas do vencimento ainda em status "pendente registro" — risco de descumprimento regulatório',
    value: 'R$ 142.500',
    count: 3,
    action: 'Priorizar',
    icon: Clock,
  },
  {
    severity: 'high',
    title: 'Concentração de divergências em adquirente Stone',
    description: 'Aumento de 4x em divergências CERC nas últimas 24h originadas em URs Stone — possível mudança recente na integração',
    value: 'R$ 89.200',
    count: 8,
    action: 'Investigar',
    icon: AlertTriangle,
  },
  {
    severity: 'medium',
    title: 'URs com múltiplos efeitos em conflito',
    description: '4 URs com cessão fiduciária + oneração judicial sobrepostas — Jurídico precisa avaliar precedência',
    value: 'R$ 245.300',
    count: 4,
    action: 'Escalar Jurídico',
    icon: FileWarning,
  },
  {
    severity: 'medium',
    title: 'Lojista Mega Lojas com taxa de bloqueio judicial atípica',
    description: 'Lojista acumulou 12 oneraçãos judiciais em 30 dias (média 2,1 mesma janela) — perfil de risco elevado',
    value: 'R$ 320.150',
    count: 12,
    action: 'Revisar relação',
    icon: AlertTriangle,
  },
  {
    severity: 'low',
    title: 'Tempo médio de registro acima do benchmark',
    description: 'Média do dia: 4,8h vs benchmark 1h — investigar possível instabilidade na integração com CERC',
    value: '—',
    count: 142,
    action: 'Acompanhar',
    icon: Clock,
  },
];

const colors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function URAnomaliesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          Anomalias regulatórias detectadas pela IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ANOMALIES.map((a, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
            <a.icon className={`w-4 h-4 mt-0.5 ${a.severity === 'high' ? 'text-red-500' : a.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-bold">{a.title}</p>
                <Badge className={`${colors[a.severity]} text-[9px] border`}>{a.severity.toUpperCase()}</Badge>
                {a.count > 1 && <Badge variant="outline" className="text-[9px]">{a.count} casos</Badge>}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{a.description}</p>
              {a.value !== '—' && <p className="text-[10px] text-slate-400 mt-1">Impacto: <strong>{a.value}</strong></p>}
            </div>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.success(`Ação "${a.action}" iniciada`)}>{a.action}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}