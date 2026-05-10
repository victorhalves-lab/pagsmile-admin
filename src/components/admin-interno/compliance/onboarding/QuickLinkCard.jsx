import React from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuickLinkCard({ item, copied, onCopy }) {
  const Icon = item.icon;
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#003459] p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${item.color}15`, color: item.color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</h3>
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">{item.desc}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onCopy(item.url, item.key)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all',
            copied
              ? 'bg-[#2bc196] text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#2bc196]/10 hover:text-[#2bc196]'
          )}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
        <button
          onClick={() => window.open(item.url, '_blank')}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}