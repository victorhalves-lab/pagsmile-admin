import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Calendar, FileText, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ScheduleReportDialog({ open, onOpenChange, dashboardName }) {
  const [frequency, setFrequency] = useState('weekly');
  const [day, setDay] = useState('monday');
  const [hour, setHour] = useState('09');
  const [format, setFormat] = useState('pdf');
  const [recipients, setRecipients] = useState([]);
  const [emailInput, setEmailInput] = useState('');

  const addEmail = () => {
    if (emailInput && !recipients.includes(emailInput)) {
      setRecipients([...recipients, emailInput]);
      setEmailInput('');
    }
  };

  const handleSave = () => {
    toast.success(`Relatório agendado: ${frequency} para ${recipients.length} pessoa(s)`);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Agendar envio
          </DialogTitle>
          <DialogDescription>
            Receba <strong>{dashboardName || 'este dashboard'}</strong> automaticamente por email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] uppercase font-bold">Frequência</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily" className="text-xs">Diário</SelectItem>
                  <SelectItem value="weekly" className="text-xs">Semanal</SelectItem>
                  <SelectItem value="monthly" className="text-xs">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold">Hora</Label>
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={String(i).padStart(2, '0')} className="text-xs">
                      {String(i).padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {frequency === 'weekly' && (
            <div>
              <Label className="text-[10px] uppercase font-bold">Dia da semana</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday" className="text-xs">Segunda</SelectItem>
                  <SelectItem value="tuesday" className="text-xs">Terça</SelectItem>
                  <SelectItem value="wednesday" className="text-xs">Quarta</SelectItem>
                  <SelectItem value="thursday" className="text-xs">Quinta</SelectItem>
                  <SelectItem value="friday" className="text-xs">Sexta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-[10px] uppercase font-bold">Formato</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'csv', label: 'CSV', icon: FileText },
                { id: 'link', label: 'Link', icon: Mail },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 justify-center transition ${
                    format === f.id ? 'border-[#2bc196] bg-[#2bc196]/10 text-[#2bc196]' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <f.icon className="w-3.5 h-3.5" /> {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[10px] uppercase font-bold">Destinatários</Label>
            <div className="flex gap-2">
              <Input
                placeholder="email@empresa.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                className="h-9 text-xs"
              />
              <Button size="sm" variant="outline" onClick={addEmail} className="h-9"><Plus className="w-3.5 h-3.5" /></Button>
            </div>
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {recipients.map(e => (
                  <Badge key={e} variant="outline" className="gap-1 pr-1">
                    {e}
                    <button onClick={() => setRecipients(recipients.filter(x => x !== e))} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancelar</Button>
          <Button className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={handleSave} disabled={recipients.length === 0}>
            Agendar envio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}