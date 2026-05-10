import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Repeat, TrendingUp, TrendingDown, CheckCircle, XCircle, CalendarClock } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { MANDATE_MOCK, MANDATE_COHORT_MOCK, REVOCATION_REASONS, FLOW_COMPARISON } from './pixFlowMockData';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function PixMandateHealthDashboard() {
  const active = MANDATE_MOCK.filter(m => m.status === 'active');
  const revoked = MANDATE_MOCK.filter(m => m.status === 'revoked');
  const failed = MANDATE_MOCK.filter(m => m.status === 'failed');
  const mrr = active.reduce((s, m) => s + m.amount, 0);
  const totalCharges = MANDATE_MOCK.reduce((s, m) => s + m.successful_charges + m.failed_charges, 0);
  const successCharges = MANDATE_MOCK.reduce((s, m) => s + m.successful_charges, 0);
  const successRate = totalCharges > 0 ? (successCharges / totalCharges) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-500 uppercase">Mandatos Ativos</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{active.length}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-gray-500 uppercase">MRR (PIX Auto)</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{fmt(mrr)}</p>
            <p className="text-xs text-gray-500 mt-1">Recorrente / mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-gray-500 uppercase">Sucesso 1ª Tentativa</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{FLOW_COMPARISON.automatic.success_rate_1st}%</p>
            <p className="text-xs text-emerald-600 mt-1">→ {FLOW_COMPARISON.automatic.success_rate_3rd}% até 3ª tentativa</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span className="text-xs text-gray-500 uppercase">Churn Mensal</span>
            </div>
            <p className="text-2xl font-bold text-rose-700">{FLOW_COMPARISON.automatic.churn_monthly}%</p>
            <p className="text-xs text-gray-500 mt-1">{revoked.length} revogados</p>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Survival */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sobrevivência de Mandatos (Cohort)</CardTitle>
          <p className="text-xs text-gray-500">% de mandatos ainda ativos mês a mês após criação</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={MANDATE_COHORT_MOCK}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="m1" name="M+1" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="m2" name="M+2" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="m3" name="M+3" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="m4" name="M+4" stroke="#ec4899" strokeWidth={2} />
              <Line type="monotone" dataKey="m5" name="M+5" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revocations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Motivos de Revogação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={REVOCATION_REASONS} dataKey="count" nameKey="reason" cx="50%" cy="50%" outerRadius={80} label>
                  {REVOCATION_REASONS.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Próximas cobranças */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="w-4 h-4" /> Próximas Cobranças
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[240px] overflow-y-auto">
              {active.slice(0, 6).map(m => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div>
                    <p className="text-sm font-medium">{m.customer}</p>
                    <p className="text-xs text-gray-500">{m.plan} · {m.bank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{fmt(m.amount)}</p>
                    <p className="text-xs text-gray-500">{m.next_charge}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mandate Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mandatos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Plano</th>
                  <th className="text-left p-2">Banco</th>
                  <th className="text-right p-2">Valor</th>
                  <th className="text-center p-2">Sucesso/Falha</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {MANDATE_MOCK.map(m => (
                  <tr key={m.id} className="border-b">
                    <td className="p-2 font-medium">{m.customer}</td>
                    <td className="p-2 text-gray-600">{m.plan}</td>
                    <td className="p-2 text-gray-600">{m.bank}</td>
                    <td className="p-2 text-right font-semibold">{fmt(m.amount)}</td>
                    <td className="p-2 text-center">
                      <span className="text-emerald-700">{m.successful_charges}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-rose-700">{m.failed_charges}</span>
                    </td>
                    <td className="p-2 text-center">
                      {m.status === 'active' && <Badge className="bg-emerald-100 text-emerald-700 border-0">Ativo</Badge>}
                      {m.status === 'revoked' && <Badge className="bg-gray-100 text-gray-700 border-0">Revogado</Badge>}
                      {m.status === 'failed' && <Badge className="bg-rose-100 text-rose-700 border-0">Falhando</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}