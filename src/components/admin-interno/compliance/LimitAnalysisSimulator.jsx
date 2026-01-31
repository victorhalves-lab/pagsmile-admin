import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AgentChatInterface from '@/components/common/AgentChatInterface';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import {
  TrendingUp, DollarSign, BarChart3, CheckCircle2, AlertTriangle,
  FileText, Clock, Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockTransactionalHistory = [
  { month: 'Ago', volume: 85000 },
  { month: 'Set', volume: 92000 },
  { month: 'Out', volume: 98000 },
  { month: 'Nov', volume: 105000 },
  { month: 'Dez', volume: 112000 },
  { month: 'Jan', volume: 118000 }
];

export default function LimitAnalysisSimulator({ merchant, requestedLimit, currentLimit }) {
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalysis = (text) => {
    if (!analysisComplete) {
      setTimeout(() => setAnalysisComplete(true), 2000);
      
      return {
        role: 'assistant',
        content: `Analisando solicitação de aumento de limite de **R$ ${currentLimit.toLocaleString()}** para **R$ ${requestedLimit.toLocaleString()}**...\n\nAnalisando:\n• Histórico transacional dos últimos 6 meses\n• Saúde financeira\n• Chargebacks e disputas\n• Capacidade operacional`,
        timestamp: new Date().toISOString()
      };
    }

    return {
      role: 'assistant',
      content: `✅ **Análise Multidimensional Completa**\n\n**Histórico Transacional**: Excelente ⭐\n• Crescimento consistente de 8% a.m.\n• Aprovação média: 91%\n• Zero chargebacks nos últimos 90 dias\n\n**Saúde Financeira**: Boa ✅\n• Extratos validados\n• Capacidade confirmada\n\n**Decisão Gradual**:\n• **Imediatamente**: R$ 250k (150% aumento)\n• **Após 30 dias**: R$ 350k com performance mantida\n• **Após 60 dias**: R$ 500k completos\n\nIsso protege vocês e nós enquanto o negócio escala. Faz sentido?`,
      richContent: (
        <div className="space-y-3 mt-3">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Imediato</span>
                  <span className="text-lg font-bold text-green-600">R$ 250k</span>
                </div>
                <Progress value={50} className="bg-green-100" />
              </div>
            </CardContent>
          </Card>
          <SimulatedActionButton
            actionLabel="Limite aprovado gradualmente"
            icon={CheckCircle2}
          >
            Aprovar Limite Gradual
          </SimulatedActionButton>
        </div>
      ),
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Histórico Transacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={mockTransactionalHistory}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#2bc196" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Crescimento consistente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Saúde Financeira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Extratos validados</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>DRE disponível</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Capacidade confirmada</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Comportamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Chargebacks (90d)</span>
                <Badge className="bg-green-100 text-green-700">0</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Disputas</span>
                <Badge className="bg-green-100 text-green-700">0</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Taxa de aprovação</span>
                <Badge className="bg-green-100 text-green-700">91%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Chat */}
      <Card className="h-[400px]">
        <AgentChatInterface
          agentName="Identity Onboarder"
          onSendMessage={handleAnalysis}
          placeholder="Digite para iniciar a análise..."
          quickPrompts={["Iniciar análise de aumento de limite"]}
          accentColor="purple"
        />
      </Card>
    </div>
  );
}