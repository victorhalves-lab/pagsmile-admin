import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Quick replies / chips para o chat conversacional.
 * Reduz typos e acelera respostas pré-prontas.
 */
export default function ChatQuickReplies({ 
  options = ['Sim', 'Não', 'Pular essa pergunta'], 
  onSelect 
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect?.(opt)}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-semibold",
            "bg-white border-2 border-[#2bc196]/30 text-[#2bc196]",
            "hover:bg-[#2bc196]/5 hover:border-[#2bc196] hover:scale-105",
            "transition-all"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}