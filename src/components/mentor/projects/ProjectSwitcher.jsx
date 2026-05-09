import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown, Layers, CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MOCK_PROJECTS, PROJECT_STATUSES } from '../mocks/projectsMock';

/**
 * ProjectSwitcher — dropdown global no header (estilo Stripe/Notion workspace switcher)
 * Mostra qual projeto está sendo operado e permite alternar entre eles.
 */
export default function ProjectSwitcher({ currentProjectId = 'prj_001', onSwitch, compact = false }) {
  const [current, setCurrent] = useState(currentProjectId);
  const navigate = useNavigate();
  const project = MOCK_PROJECTS.find((p) => p.id === current) || MOCK_PROJECTS[0];

  const handleSwitch = (p) => {
    setCurrent(p.id);
    if (onSwitch) onSwitch(p);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9">
          <Layers className="w-3.5 h-3.5 text-[#2bc196]" />
          {!compact && (
            <>
              <span className="text-xs font-medium truncate max-w-[140px]">{project.trade}</span>
              <Badge className="text-[9px] py-0 h-4">{project.companies_count} empresas</Badge>
            </>
          )}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="text-xs">Projeto ativo (multi-tenant)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MOCK_PROJECTS.map((p) => (
          <DropdownMenuItem key={p.id} onClick={() => handleSwitch(p)} className="flex items-start gap-2 cursor-pointer">
            {current === p.id ? <CheckCircle2 className="w-4 h-4 text-[#2bc196] mt-0.5" /> : <div className="w-4 h-4" />}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{p.trade}</p>
                <Badge className={`text-[9px] py-0 h-4 ${PROJECT_STATUSES[p.status]?.color}`}>{PROJECT_STATUSES[p.status]?.label}</Badge>
              </div>
              <p className="text-[10px] text-slate-500">{p.project_name}</p>
              <div className="flex gap-2 mt-0.5 text-[10px] text-slate-500">
                <span>{p.companies_count} empresas</span>
                <span>·</span>
                <span>{p.merchants_count} lojistas</span>
                <span>·</span>
                <span className="font-bold text-emerald-600">{(p.monthly_tpv / 1_000_000).toFixed(0)}mi/mês</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(createPageUrl('AdminIntProjects'))}>
          <Layers className="w-3.5 h-3.5 mr-2" />Ver todos os projetos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(createPageUrl('AdminIntProjects'))}>
          <Plus className="w-3.5 h-3.5 mr-2" />Novo projeto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}