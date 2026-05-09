import React from 'react';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, Download, ExternalLink, ShieldCheck, Plug, Check, AlertCircle, Activity, Settings, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function PluginDetailDrawer({ open, onOpenChange, plugin, isInstalled, onInstall, onConfigure }) {
  if (!plugin) return null;

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={plugin.name}
      description={plugin.description}
      icon={Plug}
      size="lg"
      footer={
        <div className="flex gap-2 w-full">
          {isInstalled ? (
            <Button className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => onConfigure?.(plugin)}>
              <Settings className="w-4 h-4 mr-2" /> Configurar
            </Button>
          ) : (
            <Button className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => onInstall?.(plugin)}>
              <Download className="w-4 h-4 mr-2" /> Instalar
            </Button>
          )}
          <Button variant="outline" onClick={() => window.open(plugin.documentation_url, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" /> Docs
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Hero */}
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border flex-shrink-0 p-3">
            {plugin.logo ? (
              <img src={plugin.logo} alt={plugin.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-4xl">{plugin.emoji || '🔌'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">{plugin.name}</h2>
              {plugin.is_verified && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-0.5" /> Verificado
                </Badge>
              )}
              {plugin.is_br && <span title="Brasileiro">🇧🇷</span>}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{plugin.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-slate-700 dark:text-slate-200">{plugin.rating}</span>
                <span>({plugin.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>{plugin.installs?.toLocaleString('pt-BR')} instalações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-4 h-9">
            <TabsTrigger value="overview" className="text-xs">Visão geral</TabsTrigger>
            <TabsTrigger value="features" className="text-xs">Funcionalidades</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
            <TabsTrigger value="changelog" className="text-xs">Changelog</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <div className="rounded-lg border p-3 text-sm space-y-2">
              <p className="text-xs text-slate-500 uppercase font-semibold">Informações</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-500">Categoria:</span> <span className="capitalize font-medium">{plugin.category}</span></div>
                <div><span className="text-slate-500">Pricing:</span> <span className="capitalize font-medium">{plugin.pricing}</span></div>
                <div><span className="text-slate-500">Última atualização:</span> <span className="font-medium">{plugin.last_updated && format(new Date(plugin.last_updated), 'dd MMM yyyy', { locale: ptBR })}</span></div>
                <div><span className="text-slate-500">Versão atual:</span> <span className="font-mono font-medium">v2.3.1</span></div>
              </div>
            </div>

            <div className="rounded-lg border p-3 text-sm">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Health Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs">Saudável · latência 120ms · 0 incidentes</span>
              </div>
            </div>

            {plugin.is_br && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">🇧🇷 Plugin brasileiro nativo</p>
                <p className="text-xs text-emerald-700 mt-1">Suporte em português, conformidade fiscal BR e equipe de suporte local.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="features" className="mt-3">
            <ul className="space-y-2">
              {plugin.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
              💡 Quer ver screenshots e vídeo demo? <a href={plugin.documentation_url} className="underline font-semibold">Acesse a documentação completa →</a>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-3 space-y-3">
            <div className="text-center py-6">
              <div className="text-5xl font-bold">{plugin.rating}</div>
              <div className="flex justify-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(plugin.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">Baseado em {plugin.reviews} avaliações</p>
            </div>
            <div className="space-y-3">
              {[
                { author: 'Carlos M.', rating: 5, comment: 'Instalação muito fácil, integrei em 10 minutos.', date: '2 dias atrás' },
                { author: 'Mariana S.', rating: 5, comment: 'Suporte rápido e plugin estável.', date: '1 semana atrás' },
                { author: 'João P.', rating: 4, comment: 'Funciona muito bem, só faltou docs em PT-BR.', date: '2 semanas atrás' },
              ].map((r, i) => (
                <div key={i} className="rounded-lg border p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">{r.author}</p>
                    <span className="text-slate-500">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{r.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="changelog" className="mt-3 space-y-3">
            {[
              { version: 'v2.3.1', date: '22 abr 2026', changes: ['Suporte a PIX QR Code dinâmico', 'Melhorias de performance'] },
              { version: 'v2.3.0', date: '15 mar 2026', changes: ['Webhook signing v2', 'Refunds parciais'] },
              { version: 'v2.2.0', date: '10 fev 2026', changes: ['Multi-currency', 'Bug fixes'] },
            ].map((v) => (
              <div key={v.version} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-xs font-mono font-bold">{v.version}</code>
                  <span className="text-[10px] text-slate-500">{v.date}</span>
                </div>
                <ul className="space-y-1">
                  {v.changes.map((c, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-600">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </SideDrawer>
  );
}