import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Activity, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * Multi-perfil [#38] — começando com 2 perfis (CEO + Ops).
 * Padrão Adyen (saved views).
 *
 * O perfil define quais zonas/cards são exibidos no Dashboard.
 */

export const PROFILES = {
  ceo: {
    id: 'ceo',
    label: 'Visão CEO',
    description: 'Receita, metas, fluxo financeiro',
    icon: Crown,
    color: 'text-amber-600',
    sections: ['alerts', 'balance', 'forecast', 'goals', 'gmv', 'recovery', 'levers', 'flow', 'ai'],
  },
  ops: {
    id: 'ops',
    label: 'Visão Operacional',
    description: 'Performance, transações, atividade ao vivo',
    icon: Activity,
    color: 'text-blue-600',
    sections: ['alerts', 'balance', 'gmv', 'performance', 'acquirers', 'channels', 'funnel', 'activity', 'volume'],
  },
};

export function useProfile() {
  const [profile, setProfile] = React.useState(() => {
    return localStorage.getItem('dashboardProfile') || 'ceo';
  });

  const change = (id) => {
    setProfile(id);
    localStorage.setItem('dashboardProfile', id);
  };

  const showSection = (section) => {
    return PROFILES[profile]?.sections.includes(section) ?? true;
  };

  return { profile, setProfile: change, showSection, currentProfile: PROFILES[profile] };
}

export default function ProfileSwitcher({ profile, onChange }) {
  const current = PROFILES[profile] || PROFILES.ceo;
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Icon className={cn('w-4 h-4', current.color)} />
          <span className="font-medium">{current.label}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-slate-500">
          Perfil de visualização
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(PROFILES).map((p) => {
          const PIcon = p.icon;
          const active = profile === p.id;
          return (
            <DropdownMenuItem
              key={p.id}
              onClick={() => onChange(p.id)}
              className="cursor-pointer p-3"
            >
              <div className="flex items-start gap-3 w-full">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', `${p.color.replace('text', 'bg')}/10`)}>
                  <PIcon className={cn('w-4 h-4', p.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.label}</p>
                  <p className="text-[11px] text-slate-500">{p.description}</p>
                </div>
                {active && <Check className="w-4 h-4 text-[#2bc196] flex-shrink-0" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}