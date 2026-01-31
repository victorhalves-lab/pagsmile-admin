import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import {
  Brain, TrendingUp, Target, Zap, Database, Cpu, CheckCircle2,
  AlertTriangle, BarChart3, RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const performanceData = [
  { month: 'Ago', accuracy: 92, recall: 88, f1: 90 },
  { month: 'Set', accuracy: 93, recall: 89, f1: 91 },
  { month: 'Out', accuracy: 94, recall: 91, f1: 92.5 },
  { month: 'Nov', accuracy: 95, recall: 92, f1: 93.5 },
  { month: 'Dez', accuracy: 95.5, recall: 93, f1: 94.2 },
  { month: 'Jan', accuracy: 96, recall: 94, f1: 95 }
];

const trainingStats = {
  dataset_size: '10M conversas',
  fraud_cases: '50K casos',
  regulations: 'Circular 3.978, Lei 9.613/98, CVM 617',
  countries: '20 países',
  last_training: '2026-01-25',
  next_training: '2026-02-01'
};

export default function HelenaTraining() {
  const [isRetraining, setIsRetraining] = useState(false);

  return (
    <div className="space-y-6">
      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Accuracy</p>
                <p className="text-4xl font-bold text-green-600">96%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+4% vs 6 meses</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Recall</p>
                <p className="text-4xl font-bold text-blue-600">94%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600">+6% vs 6 meses</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">F1-Score</p>
                <p className="text-4xl font-bold text-purple-600">95%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600">+5% vs 6 meses</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Evolução de Performance do Modelo
          </CardTitle>
          <CardDescription>Métricas de qualidade nos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <XAxis dataKey="month" />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#2bc196" strokeWidth={2} name="Accuracy" />
              <Line type="monotone" dataKey="recall" stroke="#3b82f6" strokeWidth={2} name="Recall" />
              <Line type="monotone" dataKey="f1" stroke="#8b5cf6" strokeWidth={2} name="F1-Score" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Training Dataset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="w-5 h-5 text-blue-600" />
              Dataset de Treinamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Conversas de KYC Reais</span>
                <Badge className="bg-blue-600">{trainingStats.dataset_size}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Casos de Fraude</span>
                <Badge className="bg-red-600">{trainingStats.fraud_cases}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Regulações Brasileiras</span>
                <Badge className="bg-green-600">Completo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Best Practices</span>
                <Badge className="bg-purple-600">{trainingStats.countries}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              Retreinamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Último Retreinamento:</span>
                <span className="font-medium">{trainingStats.last_training}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Próximo Agendado:</span>
                <span className="font-medium">{trainingStats.next_training}</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs text-purple-700 mb-2">
                <strong>Frequência:</strong> Retreino diário com novos dados
              </p>
              <p className="text-xs text-purple-700">
                <strong>Modo:</strong> Incremental com validação A/B
              </p>
            </div>

            <SimulatedActionButton
              actionLabel="Retreinamento iniciado (simulado)"
              icon={RefreshCw}
              variant="outline"
              className="w-full"
            >
              Simular Retreinamento
            </SimulatedActionButton>
          </CardContent>
        </Card>
      </div>

      {/* Capabilities */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50/50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Capacidades Especializadas da Helena
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Detecção de Evasão', desc: 'Identifica quando merchant tenta evitar perguntas' },
              { label: 'Explicação Regulatória', desc: 'Explica requirements em linguagem simples' },
              { label: 'Negociação Suave', desc: 'Convence merchants relutantes' },
              { label: 'Educação Contextual', desc: 'Ensina sobre compliance durante o processo' }
            ].map((cap, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{cap.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}