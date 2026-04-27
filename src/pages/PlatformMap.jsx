import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Map, Store, ShieldCheck, Landmark, BookOpen, Sparkles, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLogoUrlByTheme } from '@/components/utils/branding';
import { platformMapModules } from '@/lib/platformMapData';
import PlatformMapNav from '@/components/platform-map/PlatformMapNav';
import PlatformMapContent from '@/components/platform-map/PlatformMapContent';
import PlatformMapPdfExport from '@/components/platform-map/PlatformMapPdfExport';

const ICONS = {
  Store,
  ShieldCheck,
  Landmark,
  UserPlus,
};

export default function PlatformMap() {
  const [activeModuleId, setActiveModuleId] = useState(platformMapModules[0].id);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [search, setSearch] = useState('');

  const activeModule = useMemo(
    () => platformMapModules.find((m) => m.id === activeModuleId),
    [activeModuleId]
  );

  const selectedPage = useMemo(() => {
    if (!selectedPageId) return null;
    for (const section of activeModule.sections) {
      const found = section.pages.find((p) => p.id === selectedPageId);
      if (found) return found;
    }
    return null;
  }, [selectedPageId, activeModule]);

  // Estatísticas globais
  const stats = useMemo(() => {
    let total = 0;
    let documented = 0;
    platformMapModules.forEach((m) => {
      m.sections.forEach((s) => {
        s.pages.forEach((p) => {
          total += 1;
          if (p.content !== null) documented += 1;
        });
      });
    });
    return { total, documented, percent: Math.round((documented / total) * 100) };
  }, []);

  const handleModuleChange = (moduleId) => {
    setActiveModuleId(moduleId);
    setSelectedPageId(null);
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  Mapa da Plataforma
                </h1>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Documentação microscópica de toda a plataforma PagSmile
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">
                {stats.documented}/{stats.total}
              </span>
              <span className="text-xs text-slate-500">páginas</span>
            </Badge>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-700">{stats.percent}% documentado</span>
            </div>
            <PlatformMapPdfExport />
          </div>
        </div>

        {/* Tabs de Módulos */}
        <div className="px-6 flex items-center gap-1 border-t border-slate-100">
          {platformMapModules.map((mod) => {
            const Icon = ICONS[mod.iconName] || Store;
            const isActive = mod.id === activeModuleId;
            const moduleStats = {
              total: mod.sections.reduce((acc, s) => acc + s.pages.length, 0),
              documented: mod.sections.reduce(
                (acc, s) => acc + s.pages.filter((p) => p.content !== null).length,
                0
              ),
            };
            return (
              <button
                key={mod.id}
                onClick={() => handleModuleChange(mod.id)}
                className={cn(
                  'relative flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                    isActive ? 'shadow-sm' : ''
                  )}
                  style={{
                    backgroundColor: isActive ? `${mod.color}15` : '#f1f5f9',
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? mod.color : '#64748b' }}
                  />
                </div>
                <div className="text-left">
                  <div className="leading-tight">{mod.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {moduleStats.documented}/{moduleStats.total} páginas
                  </div>
                </div>
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: mod.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body: Nav + Content */}
      <div className="flex-1 flex overflow-hidden">
        <PlatformMapNav
          module={activeModule}
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
          search={search}
          onSearchChange={setSearch}
        />
        <PlatformMapContent module={activeModule} page={selectedPage} />
      </div>
    </div>
  );
}