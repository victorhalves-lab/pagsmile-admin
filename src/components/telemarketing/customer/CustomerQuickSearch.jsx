import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CustomerQuickSearch({ onFound, onCreateNew }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!q.trim()) return;
    setSearching(true);
    try {
      const all = await base44.entities.Customer.list('-created_date', 200);
      const term = q.toLowerCase().replace(/\D/g, '');
      const termRaw = q.toLowerCase();
      const matches = all.filter((c) => {
        const doc = (c.document || '').replace(/\D/g, '');
        const phone = (c.phone || '').replace(/\D/g, '');
        return (
          (term && (doc.includes(term) || phone.includes(term))) ||
          (c.name || '').toLowerCase().includes(termRaw) ||
          (c.email || '').toLowerCase().includes(termRaw)
        );
      });
      setResults(matches.slice(0, 5));
      setSearched(true);
    } catch (e) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar por CPF/CNPJ, telefone, nome ou e-mail…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="text-base"
          autoFocus
        />
        <Button onClick={handleSearch} disabled={searching} className="bg-[#2bc196] hover:bg-[#25a880]">
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="border rounded-lg divide-y">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => onFound(c)}
              className="w-full text-left p-3 hover:bg-slate-50 transition-colors"
            >
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-slate-500 flex gap-3">
                <span>{c.document || '—'}</span>
                <span>{c.phone || '—'}</span>
                <span>{c.email || '—'}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed rounded-lg">
          <p className="text-sm text-slate-500 mb-3">Nenhum cliente encontrado.</p>
          <Button onClick={onCreateNew} variant="outline">
            <UserPlus className="w-4 h-4 mr-2" /> Cadastrar novo cliente
          </Button>
        </div>
      )}

      {!searched && (
        <Button variant="outline" className="w-full" onClick={onCreateNew}>
          <UserPlus className="w-4 h-4 mr-2" /> Ou cadastrar novo cliente agora
        </Button>
      )}
    </div>
  );
}