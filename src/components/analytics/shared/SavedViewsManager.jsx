import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Bookmark, Plus, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Gerenciador de views salvas — salva combinações de filtros + período.
 * Persiste em localStorage por chave única.
 */
export default function SavedViewsManager({ storageKey = 'analytics_views', currentState, onLoadView }) {
  const [views, setViews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch { return []; }
  });
  const [newName, setNewName] = useState('');
  const [showSave, setShowSave] = useState(false);

  const persist = (v) => {
    setViews(v);
    localStorage.setItem(storageKey, JSON.stringify(v));
  };

  const save = () => {
    if (!newName.trim()) return;
    const next = [...views, { id: Date.now(), name: newName.trim(), state: currentState, createdAt: new Date().toISOString() }];
    persist(next);
    setNewName('');
    setShowSave(false);
    toast.success(`View "${newName}" salva`);
  };

  const remove = (id) => {
    persist(views.filter(v => v.id !== id));
    toast.success('View removida');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Bookmark className="w-3.5 h-3.5" /> Views {views.length > 0 && `(${views.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs">Views salvas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {views.length === 0 && (
          <p className="text-xs text-slate-500 px-2 py-3 text-center">Nenhuma view salva ainda</p>
        )}
        {views.map(v => (
          <DropdownMenuItem
            key={v.id}
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => { onLoadView?.(v.state); toast.success(`View "${v.name}" carregada`); }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs truncate">{v.name}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); remove(v.id); }}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {showSave ? (
          <div className="p-2 space-y-2">
            <Input
              autoFocus
              placeholder="Nome da view (ex: Black Friday)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              className="h-8 text-xs"
            />
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs flex-1" onClick={save}>Salvar</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowSave(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <DropdownMenuItem onClick={(e) => { e.preventDefault(); setShowSave(true); }} className="cursor-pointer">
            <Plus className="w-3.5 h-3.5 mr-2" /> <span className="text-xs">Salvar visão atual</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}