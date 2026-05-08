import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Atalhos de teclado (Linear/Notion style).
 * Aparece quando user pressiona "?".
 */
export default function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const shortcuts = [
    { group: 'Navegação', items: [
      { keys: ['⌘', 'K'], action: 'Abrir busca universal' },
      { keys: ['G', 'T'], action: 'Ir para Transações' },
      { keys: ['G', 'D'], action: 'Ir para Dashboard' },
      { keys: ['G', 'F'], action: 'Ir para Financeiro' },
    ]},
    { group: 'Tabs (dentro de Transações)', items: [
      { keys: ['1'], action: 'Aba Todas' },
      { keys: ['2'], action: 'Aba Cartão' },
      { keys: ['3'], action: 'Aba PIX' },
      { keys: ['4'], action: 'Aba Reembolsos' },
      { keys: ['5'], action: 'Aba Recusas' },
    ]},
    { group: 'Ações na lista', items: [
      { keys: ['↑', '↓'], action: 'Navegar entre linhas' },
      { keys: ['Enter'], action: 'Abrir detalhe (drawer)' },
      { keys: ['Esc'], action: 'Fechar drawer/modal' },
      { keys: ['F'], action: 'Focar busca' },
      { keys: ['/'], action: 'Limpar filtros' },
    ]},
    { group: 'Contextual', items: [
      { keys: ['?'], action: 'Mostrar atalhos (esta tela)' },
      { keys: ['R'], action: 'Reembolsar transação selecionada' },
      { keys: ['C'], action: 'Capturar pré-autorização' },
    ]},
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Atalhos de teclado
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map(g => (
            <div key={g.group}>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">{g.group}</p>
              <div className="space-y-1.5">
                {g.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{it.action}</span>
                    <div className="flex items-center gap-1">
                      {it.keys.map((k, j) => (
                        <kbd key={j} className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 text-center mt-2">
          Pressione <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded">?</kbd> a qualquer momento para ver esta tela.
        </p>
      </DialogContent>
    </Dialog>
  );
}