import React, { useState } from 'react';
import { Bell, Mail, Smartphone, MessageCircle, Webhook as WebhookIcon, Slack, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import { notificationChannels, notificationEvents } from '@/components/mockData/futureAdminMocks';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const CHANNEL_ICONS = { email: Mail, sms: Smartphone, push: Bell, whatsapp: MessageCircle, slack: Slack, webhook: WebhookIcon };

export default function NotificationCenter() {
  const { toast } = useToast();
  const [channels, setChannels] = useState(notificationChannels);
  const [events, setEvents] = useState(notificationEvents);

  const toggleChannel = (id) => {
    setChannels((c) => c.map((ch) => ch.id === id ? { ...ch, enabled: !ch.enabled } : ch));
    toast({ title: 'Canal atualizado' });
  };

  const toggleEventChannel = (eventId, channelId) => {
    setEvents((evs) => evs.map((e) => {
      if (e.id !== eventId) return e;
      const has = e.channels.includes(channelId);
      return { ...e, channels: has ? e.channels.filter((c) => c !== channelId) : [...e.channels, channelId] };
    }));
  };

  const enabledChannels = channels.filter((c) => c.enabled);
  const groupedEvents = events.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    acc[e.category].push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="Centro de notificações" subtitle="Configure como e onde receber alertas" icon={Bell} sparkles />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Canais de comunicação</h2>
          <Button size="sm" variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Adicionar canal</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {channels.map((c) => {
            const Icon = CHANNEL_ICONS[c.id];
            return (
              <Card key={c.id} className={cn('transition-all', c.enabled && 'border-[#2bc196]/40 ring-1 ring-[#2bc196]/10')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.enabled ? 'bg-[#2bc196]/10 text-[#2bc196]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}>
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    <Switch checked={c.enabled} onCheckedChange={() => toggleChannel(c.id)} />
                  </div>
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{c.address}</p>
                  <div className="mt-2">
                    {c.verified ? (
                      <Badge variant="outline" className="text-[10px] gap-1 text-emerald-600 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Verificado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] gap-1 text-amber-600 border-amber-500/30">
                        <AlertCircle className="w-3 h-3" /> Não verificado
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Eventos & Canais</h2>
          <p className="text-xs text-slate-500">Em quais canais cada evento será enviado</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Evento</th>
                {enabledChannels.map((c) => {
                  const Icon = CHANNEL_ICONS[c.id];
                  return (
                    <th key={c.id} className="px-3 py-3 text-center font-medium text-slate-500 w-20">
                      <div className="flex flex-col items-center gap-1">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="text-[10px]">{c.name}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {Object.entries(groupedEvents).map(([category, items]) => (
                <React.Fragment key={category}>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                    <td colSpan={enabledChannels.length + 1} className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">{category}</td>
                  </tr>
                  {items.map((e) => (
                    <tr key={e.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{e.label}</p>
                        <p className="text-xs text-slate-500">{e.description}</p>
                      </td>
                      {enabledChannels.map((c) => (
                        <td key={c.id} className="px-3 py-3 text-center">
                          <Switch checked={e.channels.includes(c.id)} onCheckedChange={() => toggleEventChannel(e.id, c.id)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}