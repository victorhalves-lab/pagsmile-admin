import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Download, Check, ExternalLink, Plug, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PRICING_CFG = {
  free: { label: 'Grátis', cls: 'bg-emerald-100 text-emerald-700' },
  paid: { label: 'Pago', cls: 'bg-amber-100 text-amber-700' },
  freemium: { label: 'Freemium', cls: 'bg-blue-100 text-blue-700' },
};

export default function PluginCardEnhanced({ plugin, isInstalled, onInstall, onConfigure, onSelect }) {
  const pricing = PRICING_CFG[plugin.pricing] || PRICING_CFG.free;
  const lastUpdate = plugin.last_updated ? formatDistanceToNow(new Date(plugin.last_updated), { addSuffix: false, locale: ptBR }) : null;

  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-all cursor-pointer relative group',
        isInstalled && 'border-emerald-300 bg-emerald-50/30'
      )}
      onClick={() => onSelect?.(plugin)}
    >
      {/* Floating tags */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
        {plugin.is_popular && (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px]">
            <TrendingUp className="w-3 h-3 mr-0.5" /> Popular
          </Badge>
        )}
        {plugin.is_new && (
          <Badge className="bg-gradient-to-r from-violet-500 to-blue-500 text-white border-0 text-[10px]">
            <Sparkles className="w-3 h-3 mr-0.5" /> Novo
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Header: logo + name */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center p-2 border flex-shrink-0">
            {plugin.logo ? (
              <img src={plugin.logo} alt={plugin.name} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-2xl">{plugin.emoji || '🔌'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-semibold text-sm truncate">{plugin.name}</h4>
              {plugin.is_verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" title="Verificado pelo PagSmile" />
              )}
              {plugin.is_br && (
                <span className="text-xs" title="Brasileiro">🇧🇷</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{plugin.description}</p>
          </div>
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          {plugin.rating && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">{plugin.rating}</span>
              <span>({plugin.reviews})</span>
            </div>
          )}
          {plugin.installs && (
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{plugin.installs.toLocaleString('pt-BR')}</span>
            </div>
          )}
          <Badge className={cn('text-[10px] border-0', pricing.cls)}>{pricing.label}</Badge>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mt-3">
          {plugin.features.slice(0, 3).map((f, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] font-normal">{f}</Badge>
          ))}
        </div>

        {/* Footer info */}
        {lastUpdate && (
          <p className="text-[10px] text-slate-400 mt-2">Atualizado há {lastUpdate}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          {isInstalled ? (
            <>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => onConfigure?.(plugin)}>
                <Check className="w-3 h-3 mr-1" /> Configurar
              </Button>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => window.open(plugin.documentation_url, '_blank')}>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" className="flex-1 h-8 text-xs bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => onInstall?.(plugin)}>
                <Download className="w-3 h-3 mr-1" /> Instalar
              </Button>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => window.open(plugin.documentation_url, '_blank')}>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}