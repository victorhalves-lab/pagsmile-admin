import React, { useState } from 'react';
import { Bookmark, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTransactionsContext } from './TransactionsContext';
import { toast } from 'sonner';

/**
 * Saved Views (Stripe/Mercury) — salvar combinações nomeadas de filtros.
 */
export default function SavedViewsManager() {
  const { savedViews, saveView, applyView, deleteView } = useTransactionsContext();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    saveView(name.trim());
    toast.success(`View "${name}" salva`);
    setName('');
    setCreating(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Bookmark className="w-3.5 h-3.5" />
          Views
          {savedViews.length > 0 && (
            <span className="ml-1 px-1.5 py-0 text-[10px] bg-slate-100 rounded-full">{savedViews.length}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs uppercase text-slate-500">Views salvas</DropdownMenuLabel>
        {savedViews.length === 0 && (
          <p className="text-xs text-slate-400 px-2 py-3 text-center">Nenhuma view salva ainda</p>
        )}
        {savedViews.map(v => (
          <DropdownMenuItem key={v.id} className="flex items-center justify-between gap-2" onSelect={(e) => e.preventDefault()}>
            <button className="flex-1 text-left text-sm" onClick={() => { applyView(v); toast.success(`View "${v.name}" aplicada`); }}>
              {v.name}
            </button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { deleteView(v.id); toast.success('View removida'); }}>
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {!creating ? (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCreating(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Salvar filtros atuais como view
          </DropdownMenuItem>
        ) : (
          <div className="p-2 flex gap-1">
            <Input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome da view"
              className="h-8 text-xs"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button size="icon" className="h-8 w-8 bg-[#2bc196] hover:bg-[#25a880]" onClick={handleSave}>
              <Check className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}