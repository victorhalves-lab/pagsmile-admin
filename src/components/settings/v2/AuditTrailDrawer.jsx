import React, { useState } from 'react';
import SideDrawer from '@/components/common/SideDrawer';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { History, Search, Download, Filter, User } from 'lucide-react';

const AUDIT_LOG = [
  { id: 1, when: '08/05/2026 14:32', user: 'João Silva', action: 'Mudou 2FA method', from: 'SMS', to: 'Google Auth', section: 'security', critical: false },
  { id: 2, when: '08/05/2026 11:15', user: 'Maria Santos', action: 'Convidou usuário', target: 'pedro@empresa.com', section: 'users', critical: false },
  { id: 3, when: '07/05/2026 18:45', user: 'João Silva', action: 'Adicionou IP ao allowlist', value: '187.45.123.0/24', section: 'security', critical: true },
  { id: 4, when: '07/05/2026 09:22', user: 'João Silva', action: 'Alterou conta bancária principal', from: 'Itaú 12345', to: 'Bradesco 67890', section: 'bank', critical: true },
  { id: 5, when: '06/05/2026 16:30', user: 'Pedro Costa', action: 'Habilitou WebAuthn', section: 'security', critical: false },
  { id: 6, when: '05/05/2026 14:00', user: 'João Silva', action: 'Revogou API Key', target: 'pk_live_old123', section: 'integrations', critical: true },
  { id: 7, when: '04/05/2026 10:15', user: 'Maria Santos', action: 'Atualizou regime tributário', from: 'Lucro Presumido', to: 'Lucro Real', section: 'fiscal', critical: false },
  { id: 8, when: '03/05/2026 17:50', user: 'João Silva', action: 'Aprovou mudança crítica', target: 'Conta bancária', section: 'compliance', critical: false },
];

const SECTION_COLORS = {
  security: 'bg-red-100 text-red-700',
  users: 'bg-blue-100 text-blue-700',
  bank: 'bg-amber-100 text-amber-700',
  fiscal: 'bg-purple-100 text-purple-700',
  integrations: 'bg-cyan-100 text-cyan-700',
  compliance: 'bg-emerald-100 text-emerald-700',
};

export default function AuditTrailDrawer({ open, onOpenChange }) {
  const [filter, setFilter] = useState('');
  const [criticalOnly, setCriticalOnly] = useState(false);

  const filtered = AUDIT_LOG.filter((log) => {
    if (criticalOnly && !log.critical) return false;
    if (!filter) return true;
    return JSON.stringify(log).toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Audit Trail"
      description="Compliance SOC 2 / ISO 27001 — registro de mudanças de configuração"
      icon={History}
      size="lg"
      footer={
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" /> Exportar log completo (CSV)
        </Button>
      }
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input placeholder="Buscar usuário, ação, seção..." value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-8 h-8 text-xs" />
          </div>
          <Button
            size="sm"
            variant={criticalOnly ? 'default' : 'outline'}
            onClick={() => setCriticalOnly(!criticalOnly)}
            className={criticalOnly ? 'bg-red-500 hover:bg-red-600 h-8 text-xs' : 'h-8 text-xs'}
          >
            <Filter className="w-3.5 h-3.5 mr-1" /> Críticos
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-slate-50 rounded-lg text-center">
            <p className="text-lg font-bold text-slate-900">{AUDIT_LOG.length}</p>
            <p className="text-[10px] text-slate-500">Total 30d</p>
          </div>
          <div className="p-2 bg-red-50 rounded-lg text-center">
            <p className="text-lg font-bold text-red-700">{AUDIT_LOG.filter((l) => l.critical).length}</p>
            <p className="text-[10px] text-red-600">Críticos</p>
          </div>
          <div className="p-2 bg-emerald-50 rounded-lg text-center">
            <p className="text-lg font-bold text-emerald-700">3</p>
            <p className="text-[10px] text-emerald-600">Usuários ativos</p>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((log) => (
            <div key={log.id} className={`p-2.5 rounded-lg border ${log.critical ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <Badge className={`text-[9px] border-0 ${SECTION_COLORS[log.section] || 'bg-slate-100 text-slate-700'}`}>
                    {log.section}
                  </Badge>
                  {log.critical && <Badge className="bg-red-500 text-white text-[9px] border-0">CRÍTICO</Badge>}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{log.when}</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{log.action}</p>
              {(log.from || log.to || log.value || log.target) && (
                <p className="text-[11px] text-slate-600 mt-1">
                  {log.from && <span>de <code className="bg-slate-100 px-1 rounded">{log.from}</code></span>}
                  {log.to && <span> → <code className="bg-slate-100 px-1 rounded">{log.to}</code></span>}
                  {log.value && <code className="bg-slate-100 px-1 rounded">{log.value}</code>}
                  {log.target && <code className="bg-slate-100 px-1 rounded">{log.target}</code>}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1.5">
                <User className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] text-slate-500">{log.user}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SideDrawer>
  );
}