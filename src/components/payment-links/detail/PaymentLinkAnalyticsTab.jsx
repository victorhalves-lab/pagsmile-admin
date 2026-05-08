import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Tablet, Globe, Clock, Calendar } from 'lucide-react';

export default function PaymentLinkAnalyticsTab({ link }) {
  const devices = [
    { name: 'Mobile', icon: Smartphone, share: 68, conversion: 4.2 },
    { name: 'Desktop', icon: Monitor, share: 27, conversion: 8.1 },
    { name: 'Tablet', icon: Tablet, share: 5, conversion: 6.4 },
  ];

  const sources = [
    { name: 'Instagram', share: 42, color: 'pink' },
    { name: 'WhatsApp', share: 28, color: 'emerald' },
    { name: 'Direto', share: 15, color: 'slate' },
    { name: 'Facebook', share: 10, color: 'blue' },
    { name: 'Email', share: 5, color: 'amber' },
  ];

  const peakHours = [
    { hour: '20-21h', sales: 18 },
    { hour: '21-22h', sales: 15 },
    { hour: '12-13h', sales: 11 },
    { hour: '19-20h', sales: 9 },
  ];

  const colorMap = {
    pink: 'bg-pink-500',
    emerald: 'bg-emerald-500',
    slate: 'bg-slate-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Device */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Por dispositivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {devices.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.name} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-slate-500">{d.share}% tráfego • {d.conversion}% conv</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${d.share}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Source UTM */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" /> Origem do tráfego (UTM)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sources.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${colorMap[s.color]}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-slate-500">{s.share}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                  <div className={`h-full ${colorMap[s.color]}`} style={{ width: `${s.share}%` }} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hour */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> Horários de pico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {peakHours.map((h, i) => (
            <div key={h.hour} className="flex items-center gap-3">
              <Badge variant="outline" className="text-[10px] w-8 justify-center">{i + 1}º</Badge>
              <span className="text-sm flex-1">{h.hour}</span>
              <span className="text-sm font-semibold text-emerald-600">{h.sales} vendas</span>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 pt-2 border-t">
            <strong>Sugestão:</strong> agendar disparos de WhatsApp e email entre 19-22h.
          </p>
        </CardContent>
      </Card>

      {/* Comparison */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Comparação com outros links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-xs">
            <p className="font-semibold text-emerald-700">+18% conversão vs média da conta</p>
            <p className="text-emerald-600">Este link performa acima dos outros 12 ativos.</p>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs">
            <p className="font-semibold text-amber-700">Ticket médio 22% abaixo do top performer</p>
            <p className="text-amber-600">Considere testar valor mais alto ou order bump.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}