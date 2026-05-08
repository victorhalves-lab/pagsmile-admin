import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const TEMPLATES = [
  { id: 'recovery', label: '💸 Recovery — Pagamento falhou', subject: 'Sua compra está quase concluída!' },
  { id: 'vip_welcome', label: '👑 VIP Welcome', subject: 'Bem-vindo ao programa VIP' },
  { id: 'birthday', label: '🎂 Aniversário', subject: 'Parabéns! Um presente especial' },
  { id: 'retention', label: '🎁 Retention — 15% off', subject: 'Oferta exclusiva para você' },
  { id: 'card_expiring', label: '💳 Cartão expirando', subject: 'Atualize seu cartão' },
  { id: 'nps', label: '⭐ NPS / Pesquisa', subject: 'Como foi sua experiência?' },
  { id: 'custom', label: '✏️ Mensagem personalizada', subject: '' },
];

export default function CommsInlineBar({ customer }) {
  const [open, setOpen] = useState(null); // 'email' | 'whatsapp' | 'sms' | null
  const [template, setTemplate] = useState('custom');
  const [message, setMessage] = useState('');

  const channelConfig = {
    email: { icon: Mail, label: 'Email', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', target: customer?.email },
    whatsapp: { icon: MessageSquare, label: 'WhatsApp', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100', target: customer?.phone },
    sms: { icon: Phone, label: 'SMS', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100', target: customer?.phone },
    push: { icon: Bell, label: 'Push', color: 'text-orange-600 bg-orange-50 hover:bg-orange-100', target: 'App' },
  };

  const handleSend = () => {
    toast.success(`${channelConfig[open].label} enviado para ${channelConfig[open].target}`);
    setOpen(null);
    setMessage('');
    setTemplate('custom');
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {Object.entries(channelConfig).map(([key, c]) => {
          const Icon = c.icon;
          return (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => setOpen(key)}
              className={`gap-1.5 ${c.color} border-0`}
            >
              <Icon className="w-3.5 h-3.5" />
              {c.label}
            </Button>
          );
        })}
      </div>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {open && React.createElement(channelConfig[open].icon, { className: 'w-4 h-4' })}
              Enviar {open && channelConfig[open].label} para {customer?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Template</label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 mb-1 block">Mensagem</label>
              <Textarea
                rows={5}
                placeholder={`Digite sua mensagem ${open === 'whatsapp' ? '(WhatsApp Business)' : ''}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {open === 'whatsapp' && (
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 Mensagens WhatsApp Business são enviadas via templates aprovados pela Meta.
                </p>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600">
              <strong>Destinatário:</strong> {open && channelConfig[open].target}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Cancelar</Button>
            <Button onClick={handleSend} className="bg-[#2bc196] hover:bg-[#239b7a]">
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}