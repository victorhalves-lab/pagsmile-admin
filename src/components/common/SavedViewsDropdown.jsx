import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bookmark, Plus, Star, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

/**
 * Saved views dropdown. UI-only — keeps state locally.
 */
export default function SavedViewsDropdown({ defaultViews = [] }) {
  const { toast } = useToast();
  const [views, setViews] = useState(defaultViews);
  const [active, setActive] = useState(defaultViews[0]?.id);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    const v = { id: Date.now().toString(), name: name.trim(), shared: false };
    setViews([...views, v]);
    setActive(v.id);
    setName('');
    toast({ title: 'Visão salva', description: `"${v.name}" foi adicionada às suas visões.` });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setViews(views.filter((v) => v.id !== id));
    if (active === id) setActive(null);
  };

  const activeView = views.find((v) => v.id === active);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bookmark className="w-4 h-4 text-[#2bc196]" />
          {activeView ? activeView.name : 'Minhas visões'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center justify-between">
          Visões salvas
          <span className="text-xs text-slate-500 font-normal">{views.length}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {views.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-slate-500">
            Nenhuma visão salva ainda
          </div>
        )}
        {views.map((v) => (
          <DropdownMenuItem
            key={v.id}
            onClick={() => setActive(v.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {active === v.id ? (
                <Star className="w-3.5 h-3.5 fill-[#2bc196] text-[#2bc196]" />
              ) : (
                <Star className="w-3.5 h-3.5 text-slate-400" />
              )}
              {v.name}
            </span>
            <button onClick={(e) => handleDelete(v.id, e)} className="opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
            </button>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="p-2 flex gap-1">
          <Input
            placeholder="Nome da visão atual..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="h-8 text-xs"
          />
          <Button size="icon" onClick={handleSave} disabled={!name.trim()} className="h-8 w-8 bg-[#2bc196] hover:bg-[#25a880]">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}