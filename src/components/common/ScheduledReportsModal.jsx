import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Mail, MessageSquare, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Scheduled Reports Modal [#68].
 * + Toggles WhatsApp/SMS [#65] no mesmo lugar de configuração de notificações.
 * Padrão Stripe / Adyen.
 */
export default function ScheduledReportsModal({ open, onClose }) {
  const [frequency, setFrequency] = React.useState('weekly');
  const [day, setDay] = React.useState('monday');
  const [time, setTime] = React.useState('09:00');
  const [email, setEmail] = React.useState('');
  const [channelEmail, setChannelEmail] = React.useState(true);
  const [channelSlack, setChannelSlack] = React.useState(false);
  const [channelWhats, setChannelWhats] = React.useState(false);
  const [channelSMS, setChannelSMS] = React.useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Relatório agendado',
      description: `Será enviado ${frequency === 'daily' ? 'diariamente' : frequency === 'weekly' ? 'semanalmente' : 'mensalmente'} às ${time}.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2bc196]" />
            <DialogTitle>Agendar relatório</DialogTitle>
          </div>
          <DialogDescription>
            Receba um snapshot do seu dashboard automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Frequência */}
          <div className="space-y-2">
            <Label className="text-xs">Frequência</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === 'weekly' && (
            <div className="space-y-2">
              <Label className="text-xs">Dia da semana</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Segunda</SelectItem>
                  <SelectItem value="tuesday">Terça</SelectItem>
                  <SelectItem value="wednesday">Quarta</SelectItem>
                  <SelectItem value="thursday">Quinta</SelectItem>
                  <SelectItem value="friday">Sexta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs">Horário</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Email de destino</Label>
            <Input type="email" placeholder="email@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Canais [#65] */}
          <div className="space-y-2">
            <Label className="text-xs">Canais de envio</Label>
            <div className="space-y-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              {[
                { id: 'email', label: 'Email',    icon: Mail,           value: channelEmail, set: setChannelEmail },
                { id: 'slack', label: 'Slack',    icon: MessageSquare,  value: channelSlack, set: setChannelSlack },
                { id: 'whats', label: 'WhatsApp', icon: MessageSquare,  value: channelWhats, set: setChannelWhats, premium: true },
                { id: 'sms',   label: 'SMS',      icon: Phone,          value: channelSMS,   set: setChannelSMS,   premium: true },
              ].map((ch) => {
                const Icon = ch.icon;
                return (
                  <div key={ch.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm">{ch.label}</span>
                      {ch.premium && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">
                          Premium
                        </span>
                      )}
                    </div>
                    <Switch checked={ch.value} onCheckedChange={ch.set} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-[#2bc196] hover:bg-[#239b7a]">
            Salvar agendamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}