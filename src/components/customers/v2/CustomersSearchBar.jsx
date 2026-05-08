import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SUGGESTIONS = [
  'comprou > R$ 500 últimos 30 dias',
  'clientes do RJ que são VIP',
  'cartões expirando este mês',
  'VIPs sem assinatura ativa',
];

export default function CustomersSearchBar({ value, onChange, placeholder = 'Buscar por nome, e-mail, CPF/CNPJ, telefone ou Customer ID...' }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder={placeholder}
          className="pl-10 pr-24 h-11"
        />
        <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#2bc196] to-emerald-400 text-white border-0 gap-1 text-[10px]">
          <Sparkles className="w-3 h-3" /> AI Search
        </Badge>
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {focused && !value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-30">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">💡 Tente buscas inteligentes</p>
          <div className="space-y-1">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => onChange(s)}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3 text-[#2bc196]" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}