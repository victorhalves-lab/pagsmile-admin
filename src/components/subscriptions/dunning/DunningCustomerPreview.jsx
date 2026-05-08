import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Phone, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const previews = {
  email_d0: {
    type: 'email', day: 'D+0', from: 'pagamentos@suamarca.com',
    subject: 'Tivemos um problema com seu pagamento',
    body: 'Olá [Cliente],\n\nDetectamos que sua cobrança de R$ 299,90 não foi aprovada. Tente atualizar seus dados de pagamento aqui: [link]\n\nSeu acesso continua ativo por enquanto.',
  },
  sms_d3: {
    type: 'sms', day: 'D+3',
    body: 'Sua assinatura está pendente. Atualize seu cartão para evitar interrupção: [link curto]',
  },
  whatsapp_d7: {
    type: 'whatsapp', day: 'D+7',
    body: 'Oi [Cliente]! 👋 Vimos que sua mensalidade está pendente. Que tal pagar via PIX com 5% de desconto? [link]',
  },
};

export default function DunningCustomerPreview() {
  const [selected, setSelected] = useState('email_d0');
  const p = previews[selected];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Customer view preview
        </CardTitle>
        <p className="text-[11px] text-slate-500">Veja como o cliente vai receber cada comunicação</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-1.5">
          {Object.entries(previews).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSelected(k)}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
                selected === k ? 'border-[#2bc196] bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              {v.type === 'email' && <Mail className="w-3 h-3 inline mr-1" />}
              {v.type === 'sms' && <MessageSquare className="w-3 h-3 inline mr-1" />}
              {v.type === 'whatsapp' && <Phone className="w-3 h-3 inline mr-1" />}
              {v.day}
            </button>
          ))}
        </div>

        {p.type === 'email' && (
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 border-b text-xs">
              <p><span className="text-slate-500">De:</span> <span className="font-medium">{p.from}</span></p>
              <p><span className="text-slate-500">Assunto:</span> <span className="font-bold">{p.subject}</span></p>
            </div>
            <div className="p-4 text-xs whitespace-pre-line text-slate-700 dark:text-slate-300">{p.body}</div>
          </div>
        )}

        {p.type === 'sms' && (
          <div className="max-w-xs mx-auto">
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-2xl rounded-bl-sm p-3 text-xs text-blue-900 dark:text-blue-100">
              {p.body}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 text-center">SMS</p>
          </div>
        )}

        {p.type === 'whatsapp' && (
          <div className="max-w-xs mx-auto">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl rounded-bl-sm p-3 text-xs text-slate-900 dark:text-slate-100 whitespace-pre-line">
              {p.body}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 text-center">WhatsApp</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}