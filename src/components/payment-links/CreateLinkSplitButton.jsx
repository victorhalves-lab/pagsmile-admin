import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown, Zap, Sparkles, Settings2 } from 'lucide-react';
import ExpressLinkDrawer from './drawers/ExpressLinkDrawer';
import AILinkDrawer from './drawers/AILinkDrawer';

/**
 * Split-button: ação primária = Express (mais comum).
 * Dropdown: IA / Editor completo.
 */
export default function CreateLinkSplitButton() {
  const navigate = useNavigate();
  const [expressOpen, setExpressOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <Button
          onClick={() => setExpressOpen(true)}
          className="bg-[#2bc196] hover:bg-[#239b7a] rounded-r-none border-r border-[#239b7a]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Link
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-[#2bc196] hover:bg-[#239b7a] rounded-l-none px-2"
              aria-label="Mais opções de criação"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem onClick={() => setExpressOpen(true)} className="py-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mr-2">
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Express</p>
                <p className="text-[11px] text-slate-500">3 campos · 30 segundos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAiOpen(true)} className="py-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Com IA</p>
                <p className="text-[11px] text-slate-500">Descreva, IA cria tudo</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(createPageUrl('PaymentLinkCreate'))}
              className="py-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mr-2">
                <Settings2 className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Editor Completo</p>
                <p className="text-[11px] text-slate-500">Todas as opções avançadas</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ExpressLinkDrawer open={expressOpen} onOpenChange={setExpressOpen} />
      <AILinkDrawer open={aiOpen} onOpenChange={setAiOpen} />
    </>
  );
}