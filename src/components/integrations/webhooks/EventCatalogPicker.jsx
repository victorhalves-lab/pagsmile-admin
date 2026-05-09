import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { eventCatalog } from './eventCatalog';
import { Button } from '@/components/ui/button';

export default function EventCatalogPicker({ selected = [], onChange }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(eventCatalog.map((c) => c.category));

  const toggleCat = (cat) =>
    setExpanded((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  const toggleEvent = (eventId) => {
    if (selected.includes(eventId)) {
      onChange?.(selected.filter((e) => e !== eventId));
    } else {
      onChange?.([...selected, eventId]);
    }
  };

  const toggleCategoryAll = (events) => {
    const allSelected = events.every((e) => selected.includes(e.id));
    if (allSelected) {
      onChange?.(selected.filter((s) => !events.find((e) => e.id === s)));
    } else {
      const newIds = events.map((e) => e.id).filter((id) => !selected.includes(id));
      onChange?.([...selected, ...newIds]);
    }
  };

  const filterCategory = (events) =>
    !search ? events : events.filter((e) => e.label.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()));

  const totalEvents = eventCatalog.reduce((sum, c) => sum + c.events.length, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{selected.length}</span> de {totalEvents} eventos selecionados
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onChange?.(eventCatalog.flatMap(c => c.events).map(e => e.id))}>
            Selecionar todos
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onChange?.([])}>
            Limpar
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar evento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-8 text-sm"
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {eventCatalog.map((cat) => {
          const filtered = filterCategory(cat.events);
          if (filtered.length === 0 && search) return null;
          const isExpanded = expanded.includes(cat.category);
          const selectedInCat = filtered.filter((e) => selected.includes(e.id)).length;

          return (
            <div key={cat.category} className="rounded-lg border">
              <button
                onClick={() => toggleCat(cat.category)}
                className="w-full flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                <span className="text-base">{cat.icon}</span>
                <span className="text-sm font-semibold flex-1 text-left">{cat.category}</span>
                {selectedInCat > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {selectedInCat}/{filtered.length}
                  </Badge>
                )}
                <span
                  className="text-[10px] text-blue-600 hover:underline px-2"
                  onClick={(e) => { e.stopPropagation(); toggleCategoryAll(filtered); }}
                >
                  {filtered.every((e) => selected.includes(e.id)) ? 'Limpar' : 'Todos'}
                </span>
              </button>
              {isExpanded && (
                <div className="border-t divide-y">
                  {filtered.map((event) => (
                    <label
                      key={event.id}
                      htmlFor={event.id}
                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    >
                      <Checkbox
                        id={event.id}
                        checked={selected.includes(event.id)}
                        onCheckedChange={() => toggleEvent(event.id)}
                      />
                      <code className="text-[10px] font-mono text-slate-500 flex-shrink-0 w-44 truncate">{event.id}</code>
                      <span className="text-xs flex-1">{event.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}