import React from 'react';
import { Mail, Smartphone, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Picker de canal de verificação: Email / SMS / WhatsApp.
 * WhatsApp tem badge "Recomendado" pelo delivery rate superior no Brasil.
 */
const channels = [
  { 
    id: 'whatsapp', 
    label: 'WhatsApp', 
    icon: MessageCircle, 
    color: 'text-emerald-600',
    bg: 'bg-emerald-500',
    deliveryRate: '95%',
    recommended: true,
  },
  { 
    id: 'sms', 
    label: 'SMS', 
    icon: Smartphone, 
    color: 'text-blue-600',
    bg: 'bg-blue-500',
    deliveryRate: '85%',
  },
  { 
    id: 'email', 
    label: 'Email', 
    icon: Mail, 
    color: 'text-slate-600',
    bg: 'bg-slate-500',
    deliveryRate: '70%',
  },
];

export default function VerificationChannelPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto">
      {channels.map(ch => {
        const Icon = ch.icon;
        const selected = value === ch.id;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onChange(ch.id)}
            className={cn(
              "relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 gap-1.5",
              selected
                ? "border-[#2bc196] bg-[#2bc196]/5 shadow-sm"
                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            {ch.recommended && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] px-1.5 py-0 h-4">
                Recomendado
              </Badge>
            )}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              selected ? `${ch.bg} text-white` : "bg-slate-100 text-slate-400"
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={cn(
              "font-bold text-xs",
              selected ? ch.color : 'text-slate-500'
            )}>
              {ch.label}
            </span>
            <span className="text-[10px] text-slate-400">
              {ch.deliveryRate} entrega
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { channels };