import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain, Activity, Target, Zap, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, RefreshCw,
} from 'lucide-react';
import {
  mockHelenaMetrics, mockHelenaFeedbackLog, mockHelenaTrainingHistory,
} from '@/components/admin-interno/compliance/onboarding/mocks/complianceExtraMock';

export default function HelenaTraining() {
  const m = mockHelenaMetrics;

  return (
    <div className="space-y-6">
      {/* Header com versão atual */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Helena IA — Sentinel</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Modelo: <span className="font-mono font-bold text-purple-600">{m.modelVersion}</span> • {m.totalDecisions.toLocaleString()} decisões totais
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" /> Re-treinar
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Brain className="w-4 h-4 mr-2" /> Nova versão
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-slate-500">Acurácia</span>
            </div>
            <p className="text-3xl font-black text-emerald-600">{m.accuracy}%</p>
            <Progress value={m.accuracy} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-slate-500">Concordância analistas</span>
            </div>
            <p className="text-3xl font-black text-blue-600">{m.agreementRate}%</p>
            <Progress value={m.agreementRate} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-slate-500">Confiança média</span>
            </div>
            <p className="text-3xl font-black text-purple-600">{m.avgConfidence}%</p>
            <Progress value={m.avgConfidence} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-slate-500">Tempo médio</span>
            </div>
            <p className="text-3xl font-black text-amber-600">{(m.avgProcessingTimeMs / 1000).toFixed(1)}s</p>
            <p className="text-xs text-slate-400 mt-2">por decisão</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Métricas do Modelo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Precision', value: m.precision },
              { label: 'Recall', value: m.recall },
              { label: 'F1 Score', value: m.f1Score },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">{metric.label}</span>
                  <span className="font-bold">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-1.5" />
              </div>
            ))}
            <div className="pt-2 border-t mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-500">Exemplos treino</p>
                <p className="font-bold text-slate-900 dark:text-white">{m.trainingExamples.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Feedback pendente</p>
                <p className="font-bold text-amber-600">{m.pendingFeedback}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Histórico de Treinamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockHelenaTrainingHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <Badge variant="outline" className="font-mono text-xs flex-shrink-0">{h.version}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{h.notes}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(h.date).toLocaleDateString('pt-BR')} • +{h.examplesAdded} exemplos
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${parseFloat(h.accuracyDelta) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {parseFloat(h.accuracyDelta) >= 0 ? '+' : ''}{h.accuracyDelta}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback dos analistas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Feedback dos Analistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockHelenaFeedbackLog.slice(0, 8).map((fb) => (
              <div key={fb.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  fb.feedbackType === 'positive' ? 'bg-emerald-100 text-emerald-600' :
                  fb.feedbackType === 'negative' ? 'bg-red-100 text-red-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {fb.feedbackType === 'positive' ? <ThumbsUp className="w-4 h-4" /> :
                   fb.feedbackType === 'negative' ? <ThumbsDown className="w-4 h-4" /> :
                   <MessageSquare className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className="text-xs font-mono">{fb.case_id}</Badge>
                    <Badge className="text-xs bg-purple-100 text-purple-700 border-0">Helena: {fb.helenaDecision}</Badge>
                    {fb.analystDecision === 'OVERRIDDEN' && (
                      <Badge className="text-xs bg-rose-100 text-rose-700 border-0">Override</Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{fb.comment}</p>
                  <p className="text-xs text-slate-500 mt-1">{fb.analyst} • {new Date(fb.timestamp).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}