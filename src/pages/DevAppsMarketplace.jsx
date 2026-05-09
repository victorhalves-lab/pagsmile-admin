import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Store, Sparkles, Star, Download, Rocket, ShieldCheck, Search, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const APPS = [
  { id: 1, name: 'Recovery Pro', author: 'PagSmile Labs', desc: 'Recuperação automatizada de pagamentos com IA', emoji: '⚡', rating: 4.9, installs: 1250, price: 'R$ 99/mês', verified: true, featured: true, category: 'recovery' },
  { id: 2, name: 'Dispute Defender', author: 'ChargeShield', desc: 'Contestação automática com IA + base de evidências', emoji: '🛡️', rating: 4.8, installs: 890, price: 'R$ 149/mês', verified: true, featured: true, category: 'disputes' },
  { id: 3, name: 'PIX Splitter Plus', author: 'CodeBR', desc: 'Split avançado para marketplaces com lógica condicional', emoji: '💸', rating: 4.7, installs: 560, price: 'Free', verified: true, category: 'split' },
  { id: 4, name: 'WhatsApp Receipts', author: 'NotifyHub', desc: 'Envia comprovantes via WhatsApp automaticamente', emoji: '💬', rating: 4.6, installs: 1820, price: 'R$ 49/mês', verified: false, category: 'communication' },
  { id: 5, name: 'Tax Calculator BR', author: 'FiscalApps', desc: 'Calcula impostos automaticamente em cada transação', emoji: '🇧🇷', rating: 4.5, installs: 720, price: 'R$ 79/mês', verified: true, category: 'fiscal' },
  { id: 6, name: 'Subscription Saver', author: 'ChurnFighters', desc: 'Workflows de retenção para reduzir cancelamentos', emoji: '🔁', rating: 4.7, installs: 640, price: 'R$ 199/mês', verified: true, category: 'retention' },
];

export default function DevAppsMarketplace() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = APPS.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'featured' && !a.featured) return false;
    if (tab === 'verified' && !a.verified) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Apps Marketplace"
        subtitle="Apps de terceiros que estendem o PagSmile · Estilo Shopify App Store"
        icon={Store}
        breadcrumbs={[{ label: 'Developer Hub', page: 'Developers' }, { label: 'Apps Marketplace' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Rocket className="w-4 h-4 mr-1" /> Publicar app
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" /> Para devs
            </Button>
          </div>
        }
      />

      {/* Hero callout */}
      <div className="rounded-xl border border-violet-300 bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-500/10 dark:via-blue-500/10 dark:to-emerald-500/10 p-6 flex items-center gap-5">
        <div className="text-5xl flex-shrink-0">🚀</div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-1">Estenda o PagSmile com apps de terceiros</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Centenas de apps construídos pela comunidade — recovery, disputes, fiscal, comunicação. Você pode também publicar o seu.
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Badge className="bg-emerald-100 text-emerald-700 border-0">{APPS.length}+ apps</Badge>
          <Badge className="bg-blue-100 text-blue-700 border-0">{APPS.filter(a => a.verified).length} verificados</Badge>
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar apps... (ex: 'recovery', 'WhatsApp', 'fiscal')"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white border h-9">
            <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
            <TabsTrigger value="featured" className="text-xs">⭐ Em destaque</TabsTrigger>
            <TabsTrigger value="verified" className="text-xs">✓ Verificados</TabsTrigger>
            <TabsTrigger value="popular" className="text-xs">🔥 Populares</TabsTrigger>
            <TabsTrigger value="new" className="text-xs">✨ Novos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Apps grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((app) => (
          <Card key={app.id} className="hover:shadow-lg transition-all cursor-pointer relative">
            {app.featured && (
              <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] z-10">
                ⭐ Featured
              </Badge>
            )}
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">{app.emoji}</span>
                </div>
                <div className="flex-1 min-w-0 pr-16">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-sm truncate">{app.name}</p>
                    {app.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500">por {app.author}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">{app.desc}</p>

              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{app.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{app.installs.toLocaleString('pt-BR')}</span>
                </div>
                <Badge className={cn('text-[10px] border-0 ml-auto', app.price === 'Free' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                  {app.price}
                </Badge>
              </div>

              <Button size="sm" className="w-full mt-3 bg-[#2bc196] hover:bg-[#239b7a]">
                Ver detalhes
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit your app */}
      <Card className="bg-gradient-to-br from-violet-500/5 to-blue-500/5 border-violet-300">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="text-4xl flex-shrink-0">🚀</div>
          <div className="flex-1">
            <p className="text-sm font-bold">Quer publicar seu app no Marketplace?</p>
            <p className="text-xs text-slate-600 mt-0.5">Junte-se a +500 desenvolvedores que ganham revenue share publicando apps. Submissão grátis · review em 5 dias.</p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Rocket className="w-4 h-4 mr-2" /> Publicar agora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}