import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollText, Download, Filter, Search, User, Settings, ShieldCheck, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const MOCK_AUDIT = [
  { id: 1, timestamp: '2026-05-09T14:42:18', user: 'admin@pagsmile.com', action: 'split_rule.update', target: 'merchant_001', severity: 'high', diff: { before: '10/90', after: '12/88' }, ip: '189.45.12.84', userAgent: 'Chrome/123.0' },
  { id: 2, timestamp: '2026-05-09T14:32:10', user: 'analyst@pagsmile.com', action: 'risk_rule.create', target: 'rule_velocity_v2', severity: 'medium', ip: '189.45.12.85' },
  { id: 3, timestamp: '2026-05-09T13:42:00', user: 'admin@pagsmile.com', action: 'orchestration_flow.publish', target: 'flow_002', severity: 'high', ip: '189.45.12.84' },
  { id: 4, timestamp: '2026-05-09T13:15:00', user: 'compliance@pagsmile.com', action: 'mcc.approve_change', target: 'merchant_023', severity: 'medium', diff: { before: '5411', after: '4789' } },
  { id: 5, timestamp: '2026-05-09T12:18:00', user: 'admin@pagsmile.com', action: 'limit.update', target: 'merchant_007', severity: 'high', diff: { before: 'R$50k', after: 'R$200k' } },
  { id: 6, timestamp: '2026-05-09T11:45:00', user: 'system', action: 'kyc.auto_approved', target: 'merchant_134', severity: 'low' },
  { id: 7, timestamp: '2026-05-09T11:30:00', user: 'admin@pagsmile.com', action: 'subaccount.suspend', target: 'merchant_088', severity: 'critical', diff: { reason: 'Chargeback ratio > 1%' } },
  { id: 8, timestamp: '2026-05-09T10:15:00', user: 'analyst@pagsmile.com', action: 'dispute.contest', target: 'dispute_445', severity: 'low' },
];

const SEV = {
  critical: 'bg-red-100 text-red-700 border-red-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  low: 'bg-slate-100 text-slate-600 border-slate-300',
};

export default function AdminIntAuditTrailEnhanced() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_AUDIT.filter(a =>
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    a.user.toLowerCase().includes(search.toLowerCase()) ||
    a.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail Enhanced"
        subtitle="Trilha completa de auditoria com diff de mudanças, severidade e atribuição forense"
        icon={ScrollText}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Administração' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filtros</Button>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Eventos Hoje</p><p className="text-2xl font-bold">847</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Críticos</p><p className="text-2xl font-bold text-red-600">3</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Usuários únicos</p><p className="text-2xl font-bold">12</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Compliance Score</p><p className="text-2xl font-bold text-emerald-600">98.4%</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por ação, usuário ou alvo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Eventos · {filtered.length}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((a) => (
              <div key={a.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className={`text-[10px] border ${SEV[a.severity]}`}>
                        {a.severity}
                      </Badge>
                      <code className="text-xs font-bold">{a.action}</code>
                      <span className="text-xs text-slate-500">→</span>
                      <Badge variant="secondary" className="font-mono text-[10px]">{a.target}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold">{a.user}</span>
                      <span className="text-slate-400"> · {new Date(a.timestamp).toLocaleString('pt-BR')}</span>
                      {a.ip && <span className="text-slate-400"> · IP {a.ip}</span>}
                    </p>
                    {a.diff && (
                      <div className="mt-2 grid grid-cols-2 gap-2 max-w-xl">
                        <div className="rounded bg-red-50 p-2 border border-red-200">
                          <p className="text-[10px] text-red-600 uppercase">Antes</p>
                          <p className="text-xs font-mono">{typeof a.diff.before === 'string' ? a.diff.before : JSON.stringify(a.diff.before || a.diff)}</p>
                        </div>
                        <div className="rounded bg-emerald-50 p-2 border border-emerald-200">
                          <p className="text-[10px] text-emerald-600 uppercase">Depois</p>
                          <p className="text-xs font-mono">{a.diff.after ? a.diff.after : '—'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}