import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { toast } from 'sonner';

export default function CommunicationDispatcherDrawer({ open, onOpenChange, recipients = [], defaultTemplate = 'generic', context }) {
  const [channel, setChannel] = useState('email');
  const [template, setTemplate] = useState(defaultTemplate);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    onOpenChange(false);
    toast.success(`Comunicação enviada para ${recipients.length} destinatário(s) via ${channel.toUpperCase()}`);
  };

  return (
    <EntityFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Despacho de comunicação"
      description={context || 'Notificar destinatários afetados pela mudança'}
      icon={Send}
      size="md"
      onSubmit={handleSubmit}
      submitLabel="Enviar comunicação"
    >
      <div className="space-y-4">
        <div>
          <Label className="text-xs uppercase">Destinatários ({recipients.length})</Label>
          <div className="flex gap-1 flex-wrap mt-1">
            {recipients.map((r, i) => <Badge key={i} variant="outline" className="text-[10px]">{r.name}</Badge>)}
          </div>
        </div>
        <div>
          <Label>Canal</Label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="in_app">Notificação in-app</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Template</Label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="generic">Genérico</SelectItem>
              <SelectItem value="rate_change">Mudança de taxa</SelectItem>
              <SelectItem value="policy_change">Mudança de política</SelectItem>
              <SelectItem value="account_status">Status de conta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Mensagem complementar (opcional)</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Texto adicional a incluir na comunicação..." className="min-h-[100px]" />
        </div>
      </div>
    </EntityFormDrawer>
  );
}