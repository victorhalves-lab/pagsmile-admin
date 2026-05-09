import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { BookmarkPlus, Bookmark, Share2, Trash2, ChevronDown, Star } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Mentor F0067–F0070 — Visões salvas (combinações de filtros nomeadas).
 * Privadas (do operador) e compartilháveis via URL.
 */
const DEFAULT_VIEWS = [
  { id: 'v1', name: 'Lojistas em risco — Risco', filters: { risk_level: ['Alto', 'Crítico'], is_blocked_antifraud: false }, isPrivate: false, owner: 'Sistema' },
  { id: 'v2', name: 'Para Compliance revisar — KYC expirando', filters: { kyc_status: ['Expirando'] }, isPrivate: false, owner: 'Sistema' },
  { id: 'v3', name: 'Top 100 TPV', filters: { tpv_min: 1000000 }, isPrivate: false, owner: 'Sistema' },
];

export default function SavedViewsManager({ currentFilters, onLoadView }) {
  const [views, setViews] = useState(DEFAULT_VIEWS);
  const [saveDialog, setSaveDialog] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewPrivate, setNewViewPrivate] = useState(true);

  const saveView = () => {
    if (!newViewName.trim()) return;
    const view = { id: `v${Date.now()}`, name: newViewName, filters: currentFilters, isPrivate: newViewPrivate, owner: 'Você' };
    setViews([view, ...views]);
    setNewViewName('');
    setSaveDialog(false);
    toast.success(`Visão "${newViewName}" salva`);
  };

  const deleteView = (id) => {
    setViews(views.filter(v => v.id !== id));
    toast.success('Visão removida');
  };

  const shareView = (view) => {
    const url = `${window.location.origin}${window.location.pathname}?view=${view.id}`;
    navigator.clipboard?.writeText(url);
    toast.success('Link copiado');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Bookmark className="w-4 h-4" />
            Visões salvas
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Carregar visão</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {views.map((v) => (
            <DropdownMenuItem key={v.id} className="flex items-start gap-2 py-2 cursor-pointer" onClick={() => onLoadView?.(v.filters)}>
              <Star className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{v.name}</p>
                <p className="text-[10px] text-slate-500">
                  {Object.keys(v.filters).length} filtros · {v.isPrivate ? 'Privada' : v.owner}
                </p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); shareView(v); }} className="p-1 hover:bg-slate-100 rounded">
                <Share2 className="w-3 h-3 text-slate-400" />
              </button>
              {v.owner === 'Você' && (
                <button onClick={(e) => { e.stopPropagation(); deleteView(v.id); }} className="p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSaveDialog(true)}>
            <BookmarkPlus className="w-4 h-4 mr-2" />
            Salvar visão atual
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={saveDialog} onOpenChange={setSaveDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Salvar visão atual</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Nome da visão *</label>
              <Input value={newViewName} onChange={(e) => setNewViewName(e.target.value)} placeholder="Ex: Lojistas em risco" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={newViewPrivate} onChange={(e) => setNewViewPrivate(e.target.checked)} />
              Privada (apenas eu vejo)
            </label>
            <p className="text-xs text-slate-500">
              {Object.keys(currentFilters || {}).filter(k => currentFilters[k]).length} filtros serão salvos.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialog(false)}>Cancelar</Button>
            <Button onClick={saveView}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}