import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe, Smartphone, Monitor, Users as UsersIcon, ShoppingCart, Clock, Filter,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

/**
 * Cards de decomposição: audiência, origem, devices, top produtos, hora/dia, funnel
 */
export default function CouponDetailBreakdowns({ coupon }) {
  // Mocks
  const audience = [
    { name: 'Novos clientes', value: 64, color: '#10b981' },
    { name: 'Recorrentes', value: 28, color: '#3b82f6' },
    { name: 'VIPs', value: 8, color: '#a855f7' },
  ];
  const origins = [
    { name: 'Instagram', value: 62 },
    { name: 'E-mail', value: 18 },
    { name: 'Direto', value: 12 },
    { name: 'Google', value: 8 },
  ];
  const devices = [
    { name: 'Mobile', value: 73, icon: Smartphone, color: 'text-emerald-600' },
    { name: 'Desktop', value: 24, icon: Monitor, color: 'text-blue-600' },
    { name: 'Tablet', value: 3, icon: Smartphone, color: 'text-slate-500' },
  ];
  const products = [
    { name: 'Curso Marketing Digital', uses: 28 },
    { name: 'E-book Receitas Fit', uses: 19 },
    { name: 'Mentoria 1h', uses: 14 },
  ];
  const heatmapData = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    value: Math.floor(Math.sin(h / 3) * 30 + 40 + Math.random() * 15),
  }));
  const funnel = [
    { stage: 'Emitido', value: 1000 },
    { stage: 'Visto', value: 420 },
    { stage: 'Aplicado', value: 287 },
    { stage: 'Pago', value: coupon.times_used },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Audiência */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <UsersIcon className="w-4 h-4" /> Audiência que usou
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {audience.map((a, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs">
                <span>{a.name}</span>
                <span className="font-bold">{a.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                <div className="h-full" style={{ width: `${a.value}%`, backgroundColor: a.color }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Origem */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" /> Origem do tráfego
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {origins.map((o, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs">{o.name}</span>
              <Badge variant="outline" className="text-[10px]">{o.value}%</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Devices */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Dispositivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {devices.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${d.color}`} />
                  {d.name}
                </div>
                <span className="font-bold">{d.value}%</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Top produtos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Top produtos comprados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {products.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="truncate">{p.name}</span>
              <Badge variant="outline" className="text-[10px] flex-shrink-0">{p.uses} usos</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hora/dia heatmap simplificado */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> Uso por hora do dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={heatmapData}>
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                {heatmapData.map((d, i) => (
                  <Cell key={i} fill={d.value > 50 ? '#10b981' : d.value > 30 ? '#fbbf24' : '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-slate-500 mt-1">Pico entre 19h-22h. Considere divulgar nesse horário.</p>
        </CardContent>
      </Card>

      {/* Funnel */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Funil de uso do cupom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {funnel.map((f, i) => {
            const pct = (f.value / funnel[0].value) * 100;
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>{f.stage}</span>
                  <span className="font-bold">{f.value.toLocaleString()}</span>
                </div>
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded">
                  <div className="h-full bg-[#2bc196] rounded transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}