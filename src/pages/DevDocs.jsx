import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { BookOpen, Code, ExternalLink, Zap, FileText, Terminal, Github, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SDKS = [
  { lang: 'Node.js', icon: '🟢', cmd: 'npm install @pagsmile/sdk', repo: '#', version: 'v3.2.1' },
  { lang: 'Python', icon: '🐍', cmd: 'pip install pagsmile', repo: '#', version: 'v2.8.4' },
  { lang: 'Ruby', icon: '💎', cmd: 'gem install pagsmile', repo: '#', version: 'v1.9.0' },
  { lang: 'Go', icon: '🦫', cmd: 'go get github.com/pagsmile/pagsmile-go', repo: '#', version: 'v1.4.2' },
  { lang: 'PHP', icon: '🐘', cmd: 'composer require pagsmile/pagsmile-php', repo: '#', version: 'v2.1.0' },
  { lang: 'Java', icon: '☕', cmd: 'maven: br.pagsmile:pagsmile-java:2.0', repo: '#', version: 'v2.0.5' },
];

const QUICK_GUIDES = [
  { title: 'Build a checkout in 5 minutes', desc: 'Tutorial guiado de ponta a ponta', time: '5 min', icon: '🛒' },
  { title: 'Receive your first webhook', desc: 'Configure e teste seu primeiro endpoint', time: '3 min', icon: '🪝' },
  { title: 'Implement Pix payments', desc: 'Pix copia-e-cola e QR dinâmico', time: '8 min', icon: '⚡' },
  { title: 'Handle disputes & chargebacks', desc: 'Receba alertas e conteste', time: '10 min', icon: '⚖️' },
  { title: 'Build a marketplace with split', desc: 'Multi-seller com split rules', time: '15 min', icon: '🏪' },
  { title: 'Subscriptions & recurring billing', desc: 'Crie planos e gerencie assinaturas', time: '12 min', icon: '🔁' },
];

export default function DevDocs() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Documentação"
        subtitle="Guia completo · API reference · Code samples · Tutoriais"
        icon={BookOpen}
        breadcrumbs={[{ label: 'Developer Hub', page: 'Developers' }, { label: 'Docs' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Github className="w-4 h-4 mr-1" /> GitHub</Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]" size="sm" onClick={() => window.open('https://docs.pagsmile.com', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-1" /> docs.pagsmile.com
            </Button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Pesquisar na documentação... (ex: 'criar transação Pix', 'webhook signature')" className="pl-9 h-11" />
      </div>

      {/* AI search hint */}
      <div className="rounded-xl border border-violet-200 bg-violet-50 dark:bg-violet-500/10 p-3 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-violet-800">Pergunte em linguagem natural</p>
          <p className="text-xs text-violet-600">Ex: "Como criar um payment de R$ 100 com PIX em Node.js?" — IA gera código pronto</p>
        </div>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
          <Zap className="w-4 h-4 mr-1" /> Perguntar
        </Button>
      </div>

      {/* Quick start guides */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3">⚡ Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_GUIDES.map((g) => (
            <Card key={g.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{g.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{g.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{g.desc}</p>
                    <Badge variant="outline" className="text-[10px] mt-2">⏱ {g.time}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SDKs */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide mb-3">📦 SDKs Oficiais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SDKS.map((sdk) => (
            <Card key={sdk.lang}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{sdk.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{sdk.lang}</p>
                    <Badge variant="outline" className="text-[10px]">{sdk.version}</Badge>
                  </div>
                </div>
                <code className="block bg-slate-900 text-emerald-300 text-[10px] font-mono p-2 rounded mt-2">
                  {sdk.cmd}
                </code>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                  Ver no GitHub <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CLI */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-sm font-bold">PagSmile CLI</p>
              <p className="text-xs text-slate-500">Ferramenta para dev local: criar test events, listen webhooks, deploy plugins</p>
            </div>
          </div>
          <code className="block p-3 bg-slate-900 text-emerald-300 text-xs rounded font-mono space-y-1">
            <div># Instalar</div>
            <div>$ npm install -g @pagsmile/cli</div>
            <div></div>
            <div># Listen webhooks no localhost</div>
            <div>$ pagsmile listen --forward-to localhost:3000/webhook</div>
            <div></div>
            <div># Trigger evento de teste</div>
            <div>$ pagsmile trigger transaction.approved</div>
          </code>
        </CardContent>
      </Card>

      {/* Other resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="hover:shadow-md cursor-pointer">
          <CardContent className="p-4">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm font-bold">OpenAPI Spec</p>
            <p className="text-xs text-slate-500 mt-1">Spec completa em formato OpenAPI 3.1</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md cursor-pointer">
          <CardContent className="p-4">
            <Code className="w-6 h-6 text-violet-600 mb-2" />
            <p className="text-sm font-bold">Postman Collection</p>
            <p className="text-xs text-slate-500 mt-1">Auto-updated · 100+ requests prontos</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md cursor-pointer">
          <CardContent className="p-4">
            <BookOpen className="w-6 h-6 text-amber-600 mb-2" />
            <p className="text-sm font-bold">API Reference</p>
            <p className="text-xs text-slate-500 mt-1">Todos os endpoints com exemplos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}