import React, { useState } from 'react';
import { MessageCircle, X, HelpCircle, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Botão flutuante de ajuda no canto inferior direito.
 * Reduz drop-off em travamentos.
 */
export default function HelpFloater() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#2bc196]" />
              Precisa de ajuda?
            </h4>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Estamos online — resposta em menos de 1 minuto.
          </p>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium transition">
              <MessageCircle className="w-4 h-4" />
              Chat ao vivo
            </button>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium transition">
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
            <a href="mailto:onboarding@pagsmile.com" className="w-full flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition">
              <Mail className="w-4 h-4" />
              onboarding@pagsmile.com
            </a>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Travou? Compartilhe o link com sócio/contador.
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-14 h-14 rounded-full bg-gradient-to-br from-[#2bc196] to-emerald-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-110 flex items-center justify-center",
          open && "rotate-90"
        )}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}