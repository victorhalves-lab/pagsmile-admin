import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Mail, ShoppingBag, CreditCard, Tag } from 'lucide-react';

const ACTIVITIES = [
  { time: 'há 5 min', event: 'Cliente acessou portal', icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
  { time: 'hoje 09:32', event: 'Email "Recovery campaign" aberto', icon: Mail, color: 'bg-blue-50 text-blue-600' },
  { time: 'ontem 14:15', event: 'Compra realizada — R$ 299,00', icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
  { time: '3d atrás', event: 'Cartão atualizado (Account Updater)', icon: CreditCard, color: 'bg-orange-50 text-orange-600' },
  { time: '7d atrás', event: 'Tag "Premium" adicionada', icon: Tag, color: 'bg-yellow-50 text-yellow-600' },
];

export default function CustomerActivityCompact() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-slate-600" />
          <p className="text-sm font-semibold">Logs de Atividade</p>
        </div>
        <div className="space-y-2">
          {ACTIVITIES.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{a.event}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{a.time}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}