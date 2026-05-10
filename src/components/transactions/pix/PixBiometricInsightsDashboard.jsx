import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { BIOMETRIC_CONVERSION_BY_BANK, BIOMETRIC_FAILURES, FLOW_COMPARISON } from './pixFlowMockData';

export default function PixBiometricInsightsDashboard() {
  const totalSessions = BIOMETRIC_CONVERSION_BY_BANK.reduce((s, b) => s + b.sessions, 0);
  const totalPaid = BIOMETRIC_CONVERSION_BY_BANK.reduce((s, b) => s + b.paid, 0);
  const overallConv = totalSessions > 0 ? (totalPaid / totalSessions) * 100 : 0;
  const manualConv = FLOW_COMPARISON.manual.conversion;
  const uplift = overallConv - manualConv;

  return (
    <div className="space-y-6">
      {/* Hero KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint className="w-4 h-4 text-violet-600" />
              <span className="text-xs text-violet-700 uppercase">Conversão Biometria</span>
            </div>
            <p className="text-2xl font-bold text-violet-700">{overallConv.toFixed(1)}%</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{uplift.toFixed(0)}pp vs Manual
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-gray-500 uppercase">Latência Média</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{(FLOW_COMPARISON.biometric.avg_journey / 1000).toFixed(0)}s</p>
            <p className="text-xs text-gray-500 mt-1">vs {(FLOW_COMPARISON.manual.avg_journey / 60000).toFixed(0)}min Manual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase">Sessões (30d)</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalSessions.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-gray-500 mt-1">{totalPaid.toLocaleString('pt-BR')} pagas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-xs text-gray-500 uppercase">Fraud Rate</span>
            </div>
            <p className="text-2xl font-bold text-rose-700">{FLOW_COMPARISON.biometric.fraud_rate}%</p>
            <p className="text-xs text-emerald-600 mt-1">15x menor que Manual</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual vs Biometric */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-base">⚡ Comparativo: Manual vs Biometria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">PIX Manual</p>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-600">Conversão</span><span className="font-bold">{FLOW_COMPARISON.manual.conversion}%</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Tempo médio</span><span className="font-bold">{(FLOW_COMPARISON.manual.avg_journey / 60000).toFixed(1)} min</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Ticket médio</span><span className="font-bold">R$ {FLOW_COMPARISON.manual.ticket_avg}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Fraude</span><span className="font-bold">{FLOW_COMPARISON.manual.fraud_rate}%</span></div>
              </div>
            </div>
            <div className="space-y-3 border-l pl-6 border-emerald-300">
              <p className="text-xs font-semibold text-violet-600 uppercase">PIX Biometria 👆</p>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-600">Conversão</span><span className="font-bold text-emerald-700">{FLOW_COMPARISON.biometric.conversion}%</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Tempo médio</span><span className="font-bold text-emerald-700">{(FLOW_COMPARISON.biometric.avg_journey / 1000).toFixed(0)}s</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Ticket médio</span><span className="font-bold text-emerald-700">R$ {FLOW_COMPARISON.biometric.ticket_avg}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Fraude</span><span className="font-bold text-emerald-700">{FLOW_COMPARISON.biometric.fraud_rate}%</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion by bank */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversão por Banco do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={BIOMETRIC_CONVERSION_BY_BANK}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bank" />
              <YAxis unit="%" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="conversion" name="Conversão %">
                {BIOMETRIC_CONVERSION_BY_BANK.map((b, i) => (
                  <Cell key={i} fill={b.conversion >= 85 ? '#10b981' : b.conversion >= 80 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Failures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Motivos de Falha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {BIOMETRIC_FAILURES.map((f, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{f.reason}</span>
                  <span className="text-sm font-medium">{f.count} ({f.pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}