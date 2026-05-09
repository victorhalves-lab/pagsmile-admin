import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { FileText, Sparkles, AlertTriangle, Bug, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const changelog = [
  {
    version: '2026-05-01',
    date: '01 mai 2026',
    type: 'major',
    items: [
      { type: 'feature', text: 'Novo endpoint GET /v1/disputes/:id/evidence — gestão completa de evidências de chargeback' },
      { type: 'feature', text: 'Suporte a Restricted Keys com permissões granulares por recurso' },
      { type: 'improvement', text: 'Latência p99 reduzida em 40% no endpoint /v1/transactions' },
    ],
  },
  {
    version: '2026-04-15',
    date: '15 abr 2026',
    type: 'minor',
    items: [
      { type: 'feature', text: 'Webhook events expandidos: 30 novos eventos disponíveis (med.*, identity.*)' },
      { type: 'feature', text: 'Plugin marketplace com 30+ integrações brasileiras nativas' },
      { type: 'fix', text: 'Corrigido bug em retentativas de webhook quando endpoint retornava 503' },
    ],
  },
  {
    version: '2026-03-20',
    date: '20 mar 2026',
    type: 'minor',
    items: [
      { type: 'breaking', text: 'Deprecation: parâmetro `customer_data` no /v1/transactions será removido em 2026-09-20. Use `customer` (objeto)' },
      { type: 'feature', text: 'Novo header `Pagsmile-Version` para versionamento explícito' },
      { type: 'improvement', text: 'Idempotency keys agora aceitam até 255 caracteres' },
    ],
  },
];

const TYPE_CFG = {
  feature: { icon: Sparkles, label: 'Feature', cls: 'bg-emerald-100 text-emerald-700' },
  improvement: { icon: Zap, label: 'Improvement', cls: 'bg-blue-100 text-blue-700' },
  fix: { icon: Bug, label: 'Fix', cls: 'bg-violet-100 text-violet-700' },
  breaking: { icon: AlertTriangle, label: 'Breaking', cls: 'bg-red-100 text-red-700' },
};

export default function DevChangelog() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-5">
      <PageHeader
        title="Changelog & API Versioning"
        subtitle="Histórico público de mudanças · Política de deprecation"
        icon={FileText}
        breadcrumbs={[{ label: 'Developer Hub', page: 'Developers' }, { label: 'Changelog' }]}
        actions={
          <Button variant="outline" size="sm">📡 Subscribe to RSS</Button>
        }
      />

      {/* Deprecation policy callout */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/10 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">Política de Deprecation</p>
          <p className="text-xs text-amber-700 mt-1">
            Mudanças breaking são anunciadas com <strong>180 dias</strong> de antecedência. Você sempre pode fixar uma versão da API
            usando o header <code className="bg-amber-100 px-1 rounded text-[10px]">Pagsmile-Version: 2026-05-01</code>.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-white border h-9">
          <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
          <TabsTrigger value="feature" className="text-xs">Features</TabsTrigger>
          <TabsTrigger value="improvement" className="text-xs">Melhorias</TabsTrigger>
          <TabsTrigger value="fix" className="text-xs">Correções</TabsTrigger>
          <TabsTrigger value="breaking" className="text-xs">Breaking</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Versions */}
      <div className="space-y-4">
        {changelog.map((v) => {
          const filteredItems = filter === 'all' ? v.items : v.items.filter((i) => i.type === filter);
          if (filteredItems.length === 0) return null;
          return (
            <div key={v.version} className="rounded-xl border bg-white dark:bg-slate-900 overflow-hidden">
              <div className="px-5 py-3 border-b bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                <code className="text-xs font-mono font-bold">v{v.version}</code>
                <span className="text-xs text-slate-500">{v.date}</span>
                <Badge variant="outline" className={cn('text-[10px] ml-auto', v.type === 'major' && 'border-emerald-500 text-emerald-700')}>
                  {v.type === 'major' ? 'Major' : 'Minor'}
                </Badge>
              </div>
              <div className="divide-y">
                {filteredItems.map((item, i) => {
                  const cfg = TYPE_CFG[item.type];
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="px-5 py-3 flex items-start gap-3 text-sm">
                      <Badge className={cn('text-[10px] flex-shrink-0', cfg.cls)}>
                        <Icon className="w-3 h-3 mr-1" /> {cfg.label}
                      </Badge>
                      <p className="flex-1 text-slate-700 dark:text-slate-200">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}