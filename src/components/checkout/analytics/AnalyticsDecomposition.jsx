import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Monitor, Tablet, Globe, MapPin, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Decomposição por device / origem / país / checkout específico.
 * DIFERENCIAL — Stripe e Shopify mostram aggregate; aqui o merchant decompõe em 1 click.
 */
export default function AnalyticsDecomposition() {
  const [dim, setDim] = useState('device');

  const data = {
    device: [
      { label: 'Mobile',  share: 68, conv: 7.2, ticket: 184, icon: Smartphone, tone: 'red' },
      { label: 'Desktop', share: 28, conv: 14.8, ticket: 312, icon: Monitor,    tone: 'emerald' },
      { label: 'Tablet',  share: 4,  conv: 11.3, ticket: 247, icon: Tablet,     tone: 'amber' },
    ],
    origin: [
      { label: 'Orgânico (Google)', share: 35, conv: 12.4, ticket: 240, icon: Globe, tone: 'emerald' },
      { label: 'Meta Ads',          share: 28, conv: 8.9,  ticket: 195, icon: Globe, tone: 'amber' },
      { label: 'Google Ads',        share: 22, conv: 11.2, ticket: 220, icon: Globe, tone: 'emerald' },
      { label: 'E-mail marketing',  share: 10, conv: 18.7, ticket: 280, icon: Globe, tone: 'emerald' },
      { label: 'Direto',             share: 5,  conv: 9.1,  ticket: 210, icon: Globe, tone: 'amber' },
    ],
    region: [
      { label: 'SP', share: 42, conv: 11.8, ticket: 245, icon: MapPin, tone: 'emerald' },
      { label: 'RJ', share: 18, conv: 9.4,  ticket: 218, icon: MapPin, tone: 'amber' },
      { label: 'MG', share: 12, conv: 10.2, ticket: 198, icon: MapPin, tone: 'emerald' },
      { label: 'RS', share: 8,  conv: 12.6, ticket: 234, icon: MapPin, tone: 'emerald' },
      { label: 'Outros', share: 20, conv: 8.7, ticket: 187, icon: MapPin, tone: 'amber' },
    ],
    checkout: [
      { label: 'Checkout principal', share: 60, conv: 11.2, ticket: 230, icon: Tag, tone: 'emerald' },
      { label: 'BF Premium',         share: 25, conv: 18.4, ticket: 420, icon: Tag, tone: 'emerald' },
      { label: 'Lançamento',         share: 10, conv: 6.8,  ticket: 180, icon: Tag, tone: 'red' },
      { label: 'Recorrência',        share: 5,  conv: 14.1, ticket: 89,  icon: Tag, tone: 'emerald' },
    ],
  }[dim];

  const tones = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">Decomposição da conversão</CardTitle>
          <Tabs value={dim} onValueChange={setDim}>
            <TabsList>
              <TabsTrigger value="device" className="text-xs">Device</TabsTrigger>
              <TabsTrigger value="origin" className="text-xs">Origem</TabsTrigger>
              <TabsTrigger value="region" className="text-xs">Região</TabsTrigger>
              <TabsTrigger value="checkout" className="text-xs">Checkout</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((row, i) => {
            const Icon = row.icon;
            return (
              <div key={i} className="grid grid-cols-12 gap-3 items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="col-span-3 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium truncate">{row.label}</span>
                </div>
                <div className="col-span-2 text-xs text-slate-500">{row.share}% tráfego</div>
                <div className="col-span-4">
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full",
                      row.tone === 'emerald' ? 'bg-emerald-500' : row.tone === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                    )} style={{ width: `${row.conv * 5}%` }} />
                  </div>
                </div>
                <div className={cn("col-span-1 text-sm font-bold text-right", tones[row.tone])}>{row.conv}%</div>
                <div className="col-span-2 text-xs text-right text-slate-600">R$ {row.ticket}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}