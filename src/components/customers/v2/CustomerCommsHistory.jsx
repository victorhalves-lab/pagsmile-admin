import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare, Phone, Bell, CheckCheck, Eye, MousePointerClick } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SAMPLE_COMMS = [
  { id: 1, channel: 'email', subject: 'Sua compra está quase concluída!', date: '2026-05-05T10:30:00', status: 'opened', clicked: true, template: 'Recovery' },
  { id: 2, channel: 'whatsapp', subject: 'Confirmação de pedido #1234', date: '2026-05-03T14:15:00', status: 'delivered', clicked: false, template: 'Order Confirmation' },
  { id: 3, channel: 'email', subject: 'Bem-vindo ao programa VIP', date: '2026-04-28T09:00:00', status: 'opened', clicked: true, template: 'VIP Welcome' },
  { id: 4, channel: 'sms', subject: 'Seu cartão expira em 30 dias', date: '2026-04-20T11:45:00', status: 'sent', clicked: false, template: 'Card Expiring' },
  { id: 5, channel: 'email', subject: 'Como foi sua experiência?', date: '2026-04-15T16:00:00', status: 'opened', clicked: false, template: 'NPS Survey' },
];

const channelConfig = {
  email: { icon: Mail, color: 'text-blue-600 bg-blue-50' },
  whatsapp: { icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50' },
  sms: { icon: Phone, color: 'text-purple-600 bg-purple-50' },
  push: { icon: Bell, color: 'text-orange-600 bg-orange-50' },
};

const statusConfig = {
  sent: { label: 'Enviado', color: 'bg-slate-100 text-slate-600', icon: CheckCheck },
  delivered: { label: 'Entregue', color: 'bg-blue-100 text-blue-700', icon: CheckCheck },
  opened: { label: 'Aberto', color: 'bg-emerald-100 text-emerald-700', icon: Eye },
  clicked: { label: 'Clicou', color: 'bg-purple-100 text-purple-700', icon: MousePointerClick },
};

export default function CustomerCommsHistory() {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Histórico de Comunicações</p>
          <p className="text-xs text-slate-500">Últimos 30 dias · {SAMPLE_COMMS.length} comunicações</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-blue-50 rounded-lg p-2.5 text-center">
            <Mail className="w-3.5 h-3.5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-700">3</p>
            <p className="text-[10px] text-blue-600">Email</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-700">1</p>
            <p className="text-[10px] text-emerald-600">WhatsApp</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2.5 text-center">
            <Phone className="w-3.5 h-3.5 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-purple-700">1</p>
            <p className="text-[10px] text-purple-600">SMS</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2.5 text-center">
            <Eye className="w-3.5 h-3.5 text-orange-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-orange-700">60%</p>
            <p className="text-[10px] text-orange-600">Open Rate</p>
          </div>
        </div>

        <div className="space-y-2">
          {SAMPLE_COMMS.map(c => {
            const ch = channelConfig[c.channel];
            const ChIcon = ch.icon;
            const st = statusConfig[c.clicked ? 'clicked' : c.status];
            const StIcon = st.icon;
            return (
              <div key={c.id} className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ch.color}`}>
                  <ChIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{c.subject}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{c.template}</Badge>
                    <Badge className={`${st.color} border-0 text-[10px] gap-1`}>
                      <StIcon className="w-2.5 h-2.5" />
                      {st.label}
                    </Badge>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 whitespace-nowrap">
                  {format(new Date(c.date), 'dd/MM HH:mm', { locale: ptBR })}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}