import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, FileText, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function PlatformMapNav({
  module,
  selectedPageId,
  onSelectPage,
  search,
  onSearchChange,
}) {
  const [expandedSections, setExpandedSections] = useState(
    () => module.sections.map((s) => s.id) // todas expandidas por padrão
  );

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  };

  // Filtra páginas pela busca
  const matchesSearch = (page) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return page.label.toLowerCase().includes(s) || page.id.toLowerCase().includes(s);
  };

  // Conta páginas documentadas
  const totalPages = module.sections.reduce((acc, s) => acc + s.pages.length, 0);
  const documentedPages = module.sections.reduce(
    (acc, s) => acc + s.pages.filter((p) => p.content !== null).length,
    0
  );

  return (
    <aside className="w-80 border-r border-slate-200 bg-white flex flex-col h-full">
      {/* Header com busca */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">{module.label}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{module.shortLabel}</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar página..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary" className="text-[10px]">
            {documentedPages}/{totalPages} documentadas
          </Badge>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${(documentedPages / totalPages) * 100}%`,
                backgroundColor: module.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Lista de seções/páginas */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {module.sections.map((section) => {
            const filteredPages = section.pages.filter(matchesSearch);
            if (search && filteredPages.length === 0) return null;

            const isExpanded = expandedSections.includes(section.id) || !!search;

            return (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                  <span className="flex-1 text-left">{section.label}</span>
                  <span className="text-[10px] text-slate-400">{filteredPages.length}</span>
                </button>

                {isExpanded && (
                  <div className="ml-2 mt-0.5 space-y-0.5">
                    {filteredPages.map((page) => {
                      const isDocumented = page.content !== null;
                      const isSelected = selectedPageId === page.id;
                      return (
                        <button
                          key={page.id}
                          onClick={() => onSelectPage(page.id)}
                          className={cn(
                            'w-full flex items-start gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all group',
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          )}
                        >
                          {isDocumented ? (
                            <CheckCircle2
                              className={cn(
                                'w-3.5 h-3.5 mt-0.5 flex-shrink-0',
                                isSelected ? 'text-emerald-400' : 'text-emerald-500'
                              )}
                            />
                          ) : (
                            <Circle
                              className={cn(
                                'w-3.5 h-3.5 mt-0.5 flex-shrink-0',
                                isSelected ? 'text-slate-400' : 'text-slate-300'
                              )}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{page.label}</div>
                            <div
                              className={cn(
                                'text-[10px] font-mono truncate',
                                isSelected ? 'text-slate-400' : 'text-slate-400'
                              )}
                            >
                              {page.route}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}