import React, { useState } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const QUICK_RESULTS = [
  { section: 'security', label: 'Configurar 2FA', match: '2fa, autenticação, segurança' },
  { section: 'security', label: 'Alterar senha', match: 'senha, password' },
  { section: 'security', label: 'IP Allowlist', match: 'ip, allowlist, restrição' },
  { section: 'sso', label: 'Configurar SSO/SAML', match: 'sso, saml, okta, azure' },
  { section: 'users', label: 'Convidar usuário', match: 'usuário, convite, time' },
  { section: 'users', label: 'Matriz de permissões', match: 'permissão, rbac, role' },
  { section: 'fiscal', label: 'Regime tributário', match: 'fiscal, imposto, simples, lucro' },
  { section: 'fiscal', label: 'NF-e configuração', match: 'nfe, nota fiscal' },
  { section: 'compliance', label: 'Status SOC 2 / LGPD', match: 'soc2, lgpd, pci, compliance' },
  { section: 'bank', label: 'Adicionar conta bancária', match: 'banco, conta, ted' },
  { section: 'notifications', label: 'Notificações WhatsApp', match: 'whatsapp, notificação' },
  { section: 'preferences', label: 'Fuso horário', match: 'timezone, fuso, idioma' },
];

export default function SettingsSearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const filtered = query.length > 0
    ? QUICK_RESULTS.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.match.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar configurações... (ex: 2FA, SSO, regime tributário)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="pl-9 pr-16 h-10 text-sm bg-white"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-500">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </div>

      {focused && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-30">
          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Resultados</span>
            <Badge className="bg-[#2bc196]/10 text-[#2bc196] border-0 text-[9px]">{filtered.length}</Badge>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((r, i) => (
              <button
                key={i}
                onClick={() => { onSelect?.(r.section); setQuery(''); }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition-colors text-left group"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{r.label}</p>
                  <p className="text-[10px] text-slate-500">→ {r.section}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2bc196]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}