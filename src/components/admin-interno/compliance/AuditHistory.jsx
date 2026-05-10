import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, History, Bot, User, Shield, FileText, Send, Settings } from 'lucide-react';
import { mockAuditLogs } from '@/components/admin-interno/compliance/onboarding/mocks/complianceExtraMock';

const actionIcons = {
  APPROVAL: { icon: Shield, color: 'text-emerald-600 bg-emerald-100' },
  REJECTION: { icon: Shield, color: 'text-red-600 bg-red-100' },
  STATUS_CHANGE: { icon: History, color: 'text-blue-600 bg-blue-100' },
  DOC_REQUEST: { icon: Send, color: 'text-purple-600 bg-purple-100' },
  HELENA_DECISION: { icon: Bot, color: 'text-indigo-600 bg-indigo-100' },
  POLICY_UPDATE: { icon: Settings, color: 'text-amber-600 bg-amber-100' },
  OVERRIDE: { icon: User, color: 'text-rose-600 bg-rose-100' },
};

export default function AuditHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.actionType === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [searchTerm, actionFilter]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: mockAuditLogs.length,
      today: mockAuditLogs.filter((l) => new Date(l.timestamp) >= today).length,
      helena: mockAuditLogs.filter((l) => l.actionType === 'HELENA_DECISION').length,
      manual: mockAuditLogs.filter((l) => l.actor !== 'sistema@pagsmile.com').length,
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-slate-500">Eventos totais</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
          <p className="text-xs text-slate-500">Hoje</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{stats.helena}</p>
          <p className="text-xs text-slate-500">Decisões Helena</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.manual}</p>
          <p className="text-xs text-slate-500">Ações manuais</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-5 h-5" /> Trilha de Auditoria Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por caso, usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Tipo de ação" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="APPROVAL">Aprovações</SelectItem>
                <SelectItem value="REJECTION">Rejeições</SelectItem>
                <SelectItem value="STATUS_CHANGE">Mudanças de status</SelectItem>
                <SelectItem value="DOC_REQUEST">Solicitações de docs</SelectItem>
                <SelectItem value="HELENA_DECISION">Decisões Helena</SelectItem>
                <SelectItem value="POLICY_UPDATE">Atualizações de política</SelectItem>
                <SelectItem value="OVERRIDE">Overrides</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {filtered.map((log) => {
              const cfg = actionIcons[log.actionType] || actionIcons.STATUS_CHANGE;
              const Icon = cfg.icon;
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{log.actionLabel}</span>
                      <Badge variant="outline" className="text-xs font-mono">{log.entityId}</Badge>
                      {log.details?.previousStatus && log.details?.newStatus && (
                        <span className="text-xs text-slate-500">
                          {log.details.previousStatus} → <span className="font-semibold">{log.details.newStatus}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{log.actionDescription}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        {log.actor === 'sistema@pagsmile.com' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {log.actor}
                      </span>
                      <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                      {log.ipAddress && <span className="font-mono">IP: {log.ipAddress}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                Nenhum evento encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}