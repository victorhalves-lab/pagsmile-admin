import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SideDrawer from '@/components/common/SideDrawer';
import { ExternalLink } from 'lucide-react';

/**
 * DetailDrawer — Drawer para quick-view de uma entidade (lojista, transação, link, etc.)
 *
 * Props:
 *  - open, onOpenChange
 *  - title, subtitle, icon
 *  - statusBadge: ReactNode
 *  - kpis: [{ label, value, color? }]
 *  - sections: [{ title, content }]   — blocos visuais
 *  - primaryActions: ReactNode      — ações principais (footer left)
 *  - openFullPageLink: { label, onClick }  — botão "Abrir página completa"
 *  - size: default 'lg'
 *  - children                       — conteúdo livre adicional
 */
export default function DetailDrawer({
  open,
  onOpenChange,
  title,
  subtitle,
  icon,
  statusBadge,
  kpis,
  sections,
  primaryActions,
  openFullPageLink,
  size = 'lg',
  children,
}) {
  const footer = (primaryActions || openFullPageLink) ? (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">{primaryActions}</div>
      {openFullPageLink && (
        <Button variant="outline" size="sm" onClick={openFullPageLink.onClick} className="gap-1">
          {openFullPageLink.label || 'Abrir página completa'}
          <ExternalLink className="w-3 h-3" />
        </Button>
      )}
    </div>
  ) : null;

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={subtitle}
      icon={icon}
      size={size}
      footer={footer}
    >
      <div className="space-y-5">
        {statusBadge && <div>{statusBadge}</div>}

        {/* KPIs */}
        {kpis && kpis.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {kpis.map((k, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-3"
              >
                <p className="text-[10px] uppercase text-slate-500 font-semibold">{k.label}</p>
                <p className={`text-base font-bold mt-0.5 ${k.color || 'text-slate-900 dark:text-slate-100'}`}>
                  {k.value}
                </p>
                {k.sublabel && <p className="text-[10px] text-slate-500 mt-0.5">{k.sublabel}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Seções */}
        {sections && sections.map((section, i) => (
          <div key={i} className="space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-500">{section.title}</p>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              {section.content}
            </div>
          </div>
        ))}

        {children}
      </div>
    </SideDrawer>
  );
}