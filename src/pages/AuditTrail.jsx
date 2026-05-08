import React, { useState, useMemo } from 'react';
import { ScrollText, User, Globe, Monitor, Search, Settings as SettingsIcon, Plus, Pencil, Trash2, CheckCircle2, LogIn, Bot, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import ExportButton from '@/components/common/ExportButton';
import QuickFilters from '@/components/common/QuickFilters';
import { auditEvents } from '@/components/mockData/futureAdminMocks';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ACTION_ICONS = {
  created: { Icon: Plus, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  updated: { Icon: Pencil, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  deleted: { Icon: Trash2, color: 'text-red-600 bg-red-50 dark:bg-red-950/40' },
  approved: { Icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  auto_approved: { Icon: Bot, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40' },
  login: { Icon: LogIn, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
};

const SEVERITY_CLASS = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/30',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  low: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
};

export default function AuditTrail() {
  const [search, setSearch] = useState('');
  const [actor, setActor] = useState('all');
  const [object, setObject] = useState('all');
  const [period, setPeriod] = useState('7d');

  const events = useMemo(() => auditEvents.filter((e) => {
    if (search && !`${e.actor} ${e.action} ${e.objectName}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (actor !== 'all' && e.actorEmail !== actor) return false;
    if (object !== 'all' && e.object !== object) return false;
    return true;
  }), [search, actor, object]);

  const grouped = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      const key = format(e.createdAt, 'yyyy-MM-dd');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    return Array.from(map.entries());
  }, [events]);

  return (
    <div className="space-y-6">
      <PageHeader title="Trilha de auditoria" subtitle="Histórico completo de ações realizadas em sua conta" icon={ScrollText}
        actions={<ExportButton filename="audit-trail" />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Eventos (7d)', value: '1.284', delta: '+12% vs sem. ant.' },
          { label: 'Usuários ativos', value: '8', delta: '5 admin · 3 ops' },
          { label: 'Ações críticas', value: '4', delta: 'todas com 2-pessoas' },
          { label: 'Logins (24h)', value: '23', delta: 'todas com MFA' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-[11px] text-emerald-600 mt-1">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={actor} onValueChange={setActor}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os usuários</SelectItem>
            <SelectItem value="joao@pagsmile.com">João Silva</SelectItem>
            <SelectItem value="maria@pagsmile.com">Maria Santos</SelectItem>
            <SelectItem value="carlos@pagsmile.com">Carlos Lima</SelectItem>
            <SelectItem value="system@pagsmile">Sistema</SelectItem>
          </SelectContent>
        </Select>
        <Select value={object} onValueChange={setObject}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os objetos</SelectItem>
            <SelectItem value="AntifraudRule">Regras antifraude</SelectItem>
            <SelectItem value="Withdrawal">Saques</SelectItem>
            <SelectItem value="ApiKey">API Keys</SelectItem>
            <SelectItem value="Anticipation">Antecipações</SelectItem>
            <SelectItem value="Subaccount">Subcontas</SelectItem>
            <SelectItem value="Webhook">Webhooks</SelectItem>
          </SelectContent>
        </Select>
        <QuickFilters options={[{ value: '24h', label: '24h' }, { value: '7d', label: '7d' }, { value: '30d', label: '30d' }, { value: '90d', label: '90d' }]}
          value={period} onChange={(v) => v && setPeriod(v)} />
      </div>

      <div className="space-y-6">
        {grouped.map(([day, items]) => (
          <div key={day}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {format(new Date(day), "dd 'de' MMMM, yyyy", { locale: ptBR })} · {items.length} evento(s)
            </h3>
            <div className="space-y-2">
              {items.map((e) => {
                const cfg = ACTION_ICONS[e.action] || { Icon: SettingsIcon, color: 'text-slate-600 bg-slate-100' };
                const Icon = cfg.Icon;
                return (
                  <div key={e.id} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[#2bc196]/30 hover:shadow-sm">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', cfg.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold">{e.actor}</span>
                        <span className="text-xs text-slate-500">{e.action.replace('_', ' ')}</span>
                        <Badge variant="outline" className="text-[10px] h-5">{e.object}</Badge>
                        <Badge variant="outline" className={cn('text-[10px] h-5', SEVERITY_CLASS[e.severity])}>{e.severity}</Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{e.objectName}</p>
                      {e.diff && (
                        <div className="mt-2 inline-flex items-center gap-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 font-mono">
                          {Object.entries(e.diff).map(([k, v]) => (
                            <span key={k}>
                              <span className="text-slate-500">{k}:</span>{' '}
                              <span className="line-through text-red-600">{String(v.from)}</span>{' '}
                              <ChevronRight className="inline w-3 h-3 text-slate-400" />{' '}
                              <span className="text-emerald-600 font-semibold">{String(v.to)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 flex-wrap">
                        <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />{e.actorEmail}</span>
                        <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" />{e.ip} · {e.location}</span>
                        <span className="inline-flex items-center gap-1"><Monitor className="w-3 h-3" />{e.userAgent}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDistanceToNow(e.createdAt, { addSuffix: true, locale: ptBR })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}