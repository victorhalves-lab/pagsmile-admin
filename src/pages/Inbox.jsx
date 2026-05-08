import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Inbox as InboxIcon, ShieldAlert, AlertTriangle, ArrowUpFromLine, Repeat, RefreshCcw, ShieldCheck, Webhook, ScrollText, TicketPercent, Clock, CheckCheck, Filter, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import QuickFilters from '@/components/common/QuickFilters';
import EmptyStateRich from '@/components/common/EmptyStateRich';
import BulkActionsBar from '@/components/common/BulkActionsBar';
import PageHeader from '@/components/common/PageHeader';
import { inboxItems } from '@/components/mockData/futureAdminMocks';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const TYPE_CONFIG = {
  dispute: { Icon: ShieldAlert, color: 'text-red-600 bg-red-50 dark:bg-red-950/40', label: 'Disputa' },
  pre_chargeback: { Icon: AlertTriangle, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40', label: 'Pré-CB' },
  kyc: { Icon: ShieldCheck, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40', label: 'KYC' },
  withdrawal: { Icon: ArrowUpFromLine, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40', label: 'Saque' },
  subscription: { Icon: Repeat, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40', label: 'Assinatura' },
  retry: { Icon: RefreshCcw, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40', label: 'Retentativa' },
  risk: { Icon: AlertTriangle, color: 'text-red-600 bg-red-50 dark:bg-red-950/40', label: 'Risco' },
  webhook: { Icon: Webhook, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800', label: 'Webhook' },
  compliance: { Icon: ScrollText, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40', label: 'Compliance' },
  coupon: { Icon: TicketPercent, color: 'text-pink-600 bg-pink-50 dark:bg-pink-950/40', label: 'Cupom' },
};

const SEVERITY_CONFIG = {
  critical: { label: 'Crítico', class: 'bg-red-500/10 text-red-600 border-red-500/30' },
  high: { label: 'Alta', class: 'bg-orange-500/10 text-orange-600 border-orange-500/30' },
  medium: { label: 'Média', class: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
  low: { label: 'Baixa', class: 'bg-slate-500/10 text-slate-600 border-slate-500/30' },
};

export default function Inbox() {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [severity, setSeverity] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [resolved, setResolved] = useState([]);

  const visibleItems = useMemo(() => inboxItems.filter((it) => {
    if (resolved.includes(it.id)) return false;
    if (filter !== 'all' && it.type !== filter) return false;
    if (severity && it.severity !== severity) return false;
    if (search && !`${it.title} ${it.subtitle}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filter, severity, search, resolved]);

  const counts = useMemo(() => {
    const c = { all: 0 };
    inboxItems.forEach((it) => {
      if (resolved.includes(it.id)) return;
      c.all++;
      c[it.type] = (c[it.type] || 0) + 1;
    });
    return c;
  }, [resolved]);

  const handleResolve = (ids) => {
    setResolved((r) => [...r, ...ids]);
    setSelected([]);
    toast({ title: 'Resolvido', description: `${ids.length} item(s) saíram da Inbox.` });
  };
  const handleSnooze = (ids) => {
    setResolved((r) => [...r, ...ids]);
    setSelected([]);
    toast({ title: 'Adiado por 24h' });
  };

  const filterOptions = [
    { value: 'all', label: 'Tudo', count: counts.all },
    { value: 'dispute', label: 'Disputas', icon: ShieldAlert, count: counts.dispute || 0 },
    { value: 'pre_chargeback', label: 'Pré-CB', icon: AlertTriangle, count: counts.pre_chargeback || 0 },
    { value: 'kyc', label: 'KYC', icon: ShieldCheck, count: counts.kyc || 0 },
    { value: 'withdrawal', label: 'Saques', icon: ArrowUpFromLine, count: counts.withdrawal || 0 },
    { value: 'subscription', label: 'Assinaturas', icon: Repeat, count: counts.subscription || 0 },
    { value: 'retry', label: 'Retentativas', icon: RefreshCcw, count: counts.retry || 0 },
    { value: 'risk', label: 'Risco', icon: AlertTriangle, count: counts.risk || 0 },
    { value: 'webhook', label: 'Webhooks', icon: Webhook, count: counts.webhook || 0 },
    { value: 'compliance', label: 'Compliance', icon: ScrollText, count: counts.compliance || 0 },
    { value: 'coupon', label: 'Cupons', icon: TicketPercent, count: counts.coupon || 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inbox" subtitle="Tudo que precisa da sua atenção em um só lugar" icon={InboxIcon} sparkles />

      <div className="rounded-2xl border border-[#2bc196]/30 bg-gradient-to-r from-[#2bc196]/10 via-[#2bc196]/5 to-transparent p-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2bc196]">DIA Sugere</span>
            <Badge variant="secondary" className="text-[10px]">Auto-priorizado</Badge>
          </div>
          <h3 className="text-sm font-semibold mb-1">Foque em "Chargeback #CB-9821" — vence em 6h e tem 78% de probabilidade de ganho.</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Reembolsar os 3 pré-CBs Ethoca economiza R$ 4.120 e evita 3 chargebacks.</p>
        </div>
        <Button size="sm" variant="ghost" className="text-[#2bc196] hover:bg-[#2bc196]/10">Aceitar</Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Severidade:</span>
            {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => setSeverity(severity === key ? null : key)}
                className={cn('text-xs px-2 py-1 rounded-md border font-medium', severity === key ? cfg.class : 'border-slate-200 dark:border-slate-700 text-slate-500')}>
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
        <QuickFilters options={filterOptions} value={filter} onChange={(v) => setFilter(v || 'all')} />
      </div>

      <div className="space-y-2">
        {visibleItems.length === 0 ? (
          <EmptyStateRich icon={CheckCheck} title="Inbox zero!" description="Nada acionável no momento."
            primaryAction={{ label: 'Ver resolvidos', onClick: () => setResolved([]) }} />
        ) : visibleItems.map((item) => {
          const cfg = TYPE_CONFIG[item.type];
          const Icon = cfg.Icon;
          const sev = SEVERITY_CONFIG[item.severity];
          const isSelected = selected.includes(item.id);
          const deadline = item.deadline ? formatDistanceToNow(item.deadline, { addSuffix: true, locale: ptBR }) : null;
          return (
            <div key={item.id} className={cn('flex items-start gap-3 p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all',
              isSelected ? 'border-[#2bc196] ring-2 ring-[#2bc196]/20' : 'border-slate-200 dark:border-slate-700 hover:border-[#2bc196]/30')}>
              <Checkbox checked={isSelected} onCheckedChange={() => setSelected((s) => s.includes(item.id) ? s.filter((x) => x !== item.id) : [...s, item.id])} className="mt-1" />
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="outline" className="text-[10px] h-5">{cfg.label}</Badge>
                  <Badge variant="outline" className={cn('text-[10px] h-5', sev.class)}>{sev.label}</Badge>
                  {deadline && (<span className="inline-flex items-center gap-1 text-[10px] text-orange-600 font-medium"><Clock className="w-3 h-3" />{deadline}</span>)}
                </div>
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.actions.map((a, i) => (
                  <Button key={i} size="sm" variant={a.primary ? 'default' : a.variant === 'destructive' ? 'destructive' : 'ghost'}
                    onClick={() => handleResolve([item.id])} className={cn('h-8 text-xs', a.primary && 'bg-[#2bc196] hover:bg-[#25a880]')}>
                    {a.label}
                  </Button>
                ))}
                <Link to={createPageUrl(item.source)} className="text-slate-400 hover:text-[#2bc196] p-1"><ExternalLink className="w-4 h-4" /></Link>
              </div>
            </div>
          );
        })}
      </div>

      <BulkActionsBar count={selected.length}
        actions={[
          { label: 'Resolver', icon: CheckCheck, onClick: () => handleResolve(selected) },
          { label: 'Adiar 24h', icon: Clock, onClick: () => handleSnooze(selected) },
        ]} onClear={() => setSelected([])} />
    </div>
  );
}