import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Trophy, Calendar, Tags, Lock } from 'lucide-react';

export default function ShowcaseFeatures({ showcase, onUpdate }) {
  const features = [
    {
      key: 'search',
      icon: Search,
      label: 'Busca interna',
      desc: 'Cliente busca dentro da vitrine',
      enabled: showcase?.allow_search !== false,
    },
    {
      key: 'social_proof',
      icon: Trophy,
      label: 'Social proof',
      desc: '"X pessoas compraram esta semana"',
      enabled: showcase?.social_proof_enabled || false,
      tag: 'IMPACTA CONV',
      tagColor: 'emerald',
    },
    {
      key: 'live_notifications',
      icon: Bell,
      label: 'Notificações em tempo real',
      desc: 'Popups "João comprou há 3 min"',
      enabled: showcase?.live_notifications_enabled || false,
      tag: 'NOVO',
      tagColor: 'blue',
    },
    {
      key: 'event_mode',
      icon: Calendar,
      label: 'Modo evento ao vivo',
      desc: 'Countdown + contador de vagas',
      enabled: showcase?.event_mode_enabled || false,
      tag: 'BLACK FRIDAY',
      tagColor: 'red',
    },
    {
      key: 'categories',
      icon: Tags,
      label: 'Filtros por categoria',
      desc: 'Cliente filtra por seção',
      enabled: showcase?.categories_enabled || true,
    },
    {
      key: 'cart',
      icon: Lock,
      label: 'Carrinho multi-link',
      desc: 'Cliente compra vários links de uma vez',
      enabled: showcase?.allow_cart || false,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Features da vitrine</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.key}
              className="flex items-start justify-between p-2.5 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Icon className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Label className="text-sm font-medium">{f.label}</Label>
                    {f.tag && (
                      <Badge
                        className={`text-[9px] ${
                          f.tagColor === 'emerald'
                            ? 'bg-emerald-500'
                            : f.tagColor === 'blue'
                            ? 'bg-blue-500'
                            : 'bg-red-500'
                        } text-white`}
                      >
                        {f.tag}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{f.desc}</p>
                </div>
              </div>
              <Switch
                checked={f.enabled}
                onCheckedChange={(v) => onUpdate?.(f.key, v)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}