import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone, AlertTriangle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EscalationSimulator({ open, onOpenChange }) {
  const escalationSteps = [
    {
      day: "D-30",
      channel: "WhatsApp",
      icon: MessageSquare,
      message: "Primeiro contato amigável",
      status: "sent",
      color: "blue"
    },
    {
      day: "D-15",
      channel: "Email + WhatsApp + SMS",
      icon: Mail,
      message: "Lembrete de pendência",
      status: "sent",
      color: "blue"
    },
    {
      day: "D-7",
      channel: "Notificação",
      icon: AlertTriangle,
      message: "Alerta de possível suspensão",
      status: "scheduled",
      color: "amber"
    },
    {
      day: "D-3",
      channel: "Ligação",
      icon: Phone,
      message: "Ligação automatizada",
      status: "scheduled",
      color: "orange"
    },
    {
      day: "D+1",
      channel: "Sistema",
      icon: Ban,
      message: "Suspensão temporária",
      status: "pending",
      color: "red"
    }
  ];

  const statusColors = {
    sent: "bg-blue-100 text-blue-700 border-blue-200",
    scheduled: "bg-amber-100 text-amber-700 border-amber-200",
    pending: "bg-slate-100 text-slate-500 border-slate-200"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fluxo de Escalação de Não-Conformidade</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {escalationSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  step.status === 'sent' && "bg-blue-100",
                  step.status === 'scheduled' && "bg-amber-100",
                  step.status === 'pending' && "bg-slate-100"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    step.status === 'sent' && "text-blue-600",
                    step.status === 'scheduled' && "text-amber-600",
                    step.status === 'pending' && "text-slate-400"
                  )} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{step.day}</span>
                    <Badge variant="outline" className={statusColors[step.status]}>
                      {step.status === 'sent' ? 'Enviado' : step.status === 'scheduled' ? 'Agendado' : 'Pendente'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{step.channel}</p>
                  <p className="text-xs text-slate-500">{step.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Nota:</strong> O processo pode ser interrompido a qualquer momento quando o merchant regularizar a situação.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}