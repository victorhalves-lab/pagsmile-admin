import React, { useState } from 'react';
import { Sparkles, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Sticky top banner indicating that the app is running in "demo / future-state" prototype mode.
 * Dismissible per-session.
 */
export default function DemoModeBanner({ className }) {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('demoBannerDismissed') === '1');

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('demoBannerDismissed', '1');
    setDismissed(true);
  };

  return (
    <div className={cn(
      'relative w-full bg-gradient-to-r from-violet-600 via-[#2bc196] to-cyan-500 text-white text-xs',
      className
    )}>
      <div className="flex items-center justify-center gap-2 px-4 py-1.5">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span className="font-medium">
          <strong className="uppercase tracking-wider mr-1">Modo Demo · Future State</strong>
          Você está navegando em um protótipo de alta-fidelidade da plataforma. Dados são simulados.
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-white/20 text-[10px]">
          <Eye className="w-3 h-3" /> Apenas visualização
        </span>
        <button
          onClick={handleDismiss}
          className="ml-3 p-0.5 rounded hover:bg-white/20"
          aria-label="Fechar banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}