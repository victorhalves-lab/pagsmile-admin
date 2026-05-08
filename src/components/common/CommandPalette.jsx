import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command';
import {
  Inbox, ScrollText, FolderOpen, Code2, Bot, Layers, Bell, Users, Sparkles,
  LayoutDashboard, ArrowLeftRight, CreditCard, Repeat, ShieldAlert, Wallet,
  ArrowUpFromLine, UserCircle, Plug, FileText, Search,
} from 'lucide-react';

const PAGES = [
  { name: 'Inbox', icon: Inbox, group: 'Trabalho diário', keywords: 'inbox bandeja entrada' },
  { name: 'Dashboard', icon: LayoutDashboard, group: 'Trabalho diário', keywords: 'dashboard home' },
  { name: 'AiAgentsHub', label: 'Hub de Agentes IA', icon: Bot, group: 'Trabalho diário', keywords: 'agentes ia ai dia copilot' },
  { name: 'Transactions', label: 'Transações', icon: ArrowLeftRight, group: 'Operações', keywords: 'transactions transacoes' },
  { name: 'Subscriptions', label: 'Assinaturas', icon: Repeat, group: 'Operações', keywords: 'subscriptions assinaturas mrr' },
  { name: 'PaymentLinks', label: 'Links de pagamento', icon: CreditCard, group: 'Operações', keywords: 'links pagamento payment' },
  { name: 'DisputeDashboard', label: 'Disputas', icon: ShieldAlert, group: 'Operações', keywords: 'disputes chargeback' },
  { name: 'FinancialOverview', label: 'Financeiro', icon: Wallet, group: 'Operações', keywords: 'financial financeiro saldo' },
  { name: 'Withdrawals', label: 'Saques', icon: ArrowUpFromLine, group: 'Operações', keywords: 'withdrawals saques' },
  { name: 'Customers', label: 'Clientes', icon: UserCircle, group: 'Operações', keywords: 'customers clientes' },
  { name: 'AuditTrail', label: 'Trilha de auditoria', icon: ScrollText, group: 'Avançado', keywords: 'audit auditoria log' },
  { name: 'Documents', label: 'Centro de documentos', icon: FolderOpen, group: 'Avançado', keywords: 'documents documentos pdf' },
  { name: 'Developers', label: 'Developer Hub', icon: Code2, group: 'Avançado', keywords: 'developers api' },
  { name: 'Playbooks', label: 'Playbooks', icon: Layers, group: 'Avançado', keywords: 'playbooks templates' },
  { name: 'NotificationCenter', label: 'Notificações', icon: Bell, group: 'Avançado', keywords: 'notifications alertas' },
  { name: 'TeamSettings', label: 'Time & Permissões', icon: Users, group: 'Avançado', keywords: 'team time permissions roles' },
  { name: 'ImpactPreviewDemo', label: 'Preview de impacto', icon: Sparkles, group: 'Avançado', keywords: 'preview impacto simulator' },
  { name: 'ApiKeys', label: 'API Keys', icon: Plug, group: 'Avançado', keywords: 'api keys' },
  { name: 'Webhooks', icon: Plug, group: 'Avançado', keywords: 'webhooks' },
  { name: 'Reports', label: 'Relatórios', icon: FileText, group: 'Avançado', keywords: 'reports relatorios' },
];

const ACTIONS = [
  { label: 'Novo link de pagamento', icon: CreditCard, target: 'PaymentLinkCreate' },
  { label: 'Aprovar saque pendente', icon: ArrowUpFromLine, target: 'Withdrawals' },
  { label: 'Convidar membro do time', icon: Users, target: 'TeamSettings' },
  { label: 'Ver Inbox (atalho I)', icon: Inbox, target: 'Inbox' },
];

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onOpenChange]);

  const go = (page) => {
    onOpenChange(false);
    navigate(createPageUrl(page));
  };

  const groups = PAGES.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar páginas, ações, atalhos..." />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>

        <CommandGroup heading="⚡ Ações rápidas">
          {ACTIONS.map((a) => (
            <CommandItem key={a.label} onSelect={() => go(a.target)} value={a.label}>
              <a.icon className="w-4 h-4 mr-2 text-[#2bc196]" />
              {a.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {Object.entries(groups).map(([group, pages]) => (
          <React.Fragment key={group}>
            <CommandSeparator />
            <CommandGroup heading={group}>
              {pages.map((p) => {
                const Icon = p.icon;
                return (
                  <CommandItem key={p.name} onSelect={() => go(p.name)} value={`${p.label || p.name} ${p.keywords || ''}`}>
                    <Icon className="w-4 h-4 mr-2 text-slate-500" />
                    {p.label || p.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}