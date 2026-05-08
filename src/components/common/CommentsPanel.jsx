import React, { useState } from 'react';
import { MessageSquare, Send, AtSign, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const initialMock = [
  {
    id: 1,
    author: 'Maria Santos',
    initials: 'MS',
    role: 'Risco',
    text: 'Cliente entrou em contato pelo chat. Confirmou compra. @joao pode liberar.',
    mentions: ['joao'],
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
    internal: true,
  },
  {
    id: 2,
    author: 'João Silva',
    initials: 'JS',
    role: 'Operações',
    text: 'Confirmado. Liberando saque R$ 12.450,00 e marcando como resolvido.',
    mentions: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    internal: true,
  },
];

/**
 * Inline comments / notes panel.
 * UI-only — keeps comments in local state.
 */
export default function CommentsPanel({ entityType = 'item', entityId = '—', className }) {
  const [comments, setComments] = useState(initialMock);
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    const mentions = (text.match(/@(\w+)/g) || []).map((m) => m.slice(1));
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: 'Você',
        initials: 'EU',
        role: 'Operações',
        text: text.trim(),
        mentions,
        createdAt: new Date(),
        internal: true,
      },
    ]);
    setText('');
  };

  return (
    <div className={cn('rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900', className)}>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2bc196]" />
          <h3 className="text-sm font-semibold">Comentários internos</h3>
          <Badge variant="secondary" className="h-5 text-[10px]">{comments.length}</Badge>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
          <Lock className="w-3 h-3" /> Privado · time apenas
        </span>
      </div>

      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-[#2bc196]/10 text-[#2bc196] text-xs font-semibold">
                {c.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{c.author}</span>
                <span className="text-[10px] text-slate-500">{c.role}</span>
                <span className="text-[10px] text-slate-400 ml-auto">
                  {formatDistanceToNow(c.createdAt, { addSuffix: true, locale: ptBR })}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed whitespace-pre-wrap">
                {c.text.split(/(@\w+)/).map((part, i) =>
                  part.startsWith('@') ? (
                    <span key={i} className="text-[#2bc196] font-medium">{part}</span>
                  ) : (
                    part
                  )
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Adicione um comentário... use @ para mencionar"
          className="min-h-[64px] text-sm resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd();
          }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-slate-500">
            <AtSign className="w-3 h-3 inline mr-0.5" />
            Mencione com @ · ⌘+Enter para enviar
          </span>
          <Button size="sm" onClick={handleAdd} disabled={!text.trim()} className="h-7 bg-[#2bc196] hover:bg-[#25a880]">
            <Send className="w-3 h-3 mr-1.5" />
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}