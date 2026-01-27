import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  QrCode,
  Link2,
  Repeat,
  ShieldAlert,
  Wallet,
  ArrowUpFromLine,
  Users,
  UserCircle,
  BarChart3,
  Plug,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  Building2,
  FileText,
  Key,
  Webhook,
  Store,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    page: 'Dashboard',
  },
  {
    id: 'transactions',
    label: 'Transações',
    icon: ArrowLeftRight,
    page: 'Transactions',
    badge: '24',
    submenu: [
      { label: 'Todas as Transações', page: 'Transactions' },
      { label: 'Cartão', page: 'CardTransactions' },
      { label: 'Pix', page: 'PixTransactions' },
      { label: 'Análise de Recusas', page: 'DeclineAnalysis' },
    ]
  },
  {
    id: 'checkout',
    label: 'Checkout',
    icon: CreditCard,
    page: 'CheckoutBuilder',
    submenu: [
      { label: 'Builder', page: 'CheckoutBuilder' },
      { label: 'Meus Checkouts', page: 'Checkouts' },
      { label: 'Templates', page: 'CheckoutTemplates' },
      { label: 'Analytics', page: 'CheckoutAnalytics' },
      { label: 'Converter Agent', page: 'ConverterAgent' },
    ]
  },
  {
    id: 'links',
    label: 'Links de Pagamento',
    icon: Link2,
    page: 'PaymentLinks',
    badge: '12',
  },
  {
    id: 'subscriptions',
    label: 'Assinaturas',
    icon: Repeat,
    page: 'Subscriptions',
    submenu: [
      { label: 'Assinaturas', page: 'Subscriptions' },
      { label: 'Planos', page: 'SubscriptionPlans' },
      { label: 'Dunning', page: 'DunningSettings' },
      { label: 'Analytics', page: 'SubscriptionAnalytics' },
    ]
  },
  {
    id: 'disputes',
    label: 'Disputas',
    icon: ShieldAlert,
    page: 'DisputeDashboard',
    badge: '3',
    badgeVariant: 'destructive',
    submenu: [
      { label: 'Dashboard', page: 'DisputeDashboard' },
      { label: 'Pré-Chargebacks', page: 'PreChargebacks' },
      { label: 'Chargebacks', page: 'Chargebacks' },
    ]
  },
  {
    id: 'financial',
    label: 'Financeiro',
    icon: Wallet,
    page: 'FinancialOverview',
    submenu: [
      { label: 'Visão Geral', page: 'FinancialOverview' },
      { label: 'Extrato', page: 'FinancialStatement' },
      { label: 'Agenda de Recebíveis', page: 'ReceivablesAgenda' },
      { label: 'Antecipação', page: 'Anticipation' },
      { label: 'Split', page: 'SplitManagement' },
    ]
  },
  {
    id: 'withdrawals',
    label: 'Saques',
    icon: ArrowUpFromLine,
    page: 'Withdrawals',
  },
  {
    id: 'subaccounts',
    label: 'Subcontas',
    icon: Building2,
    page: 'SubaccountsDashboard',
    submenu: [
      { label: 'Dashboard', page: 'SubaccountsDashboard' },
      { label: 'Todas as Subcontas', page: 'SubaccountsList' },
      { label: 'Onboarding', page: 'SubaccountOnboarding' },
    ]
  },
  {
    id: 'customers',
    label: 'Clientes',
    icon: UserCircle,
    page: 'Customers',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    page: 'Reports',
    submenu: [
      { label: 'Relatórios', page: 'Reports' },
      { label: 'Dashboards Customizados', page: 'CustomDashboards' },
    ]
  },
  {
    id: 'integrations',
    label: 'Integrações',
    icon: Plug,
    page: 'ApiKeys',
    submenu: [
      { label: 'Chaves de API', page: 'ApiKeys' },
      { label: 'Webhooks', page: 'Webhooks' },
      { label: 'Plugins e Conectores', page: 'Plugins' },
    ]
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    page: 'SettingsPage',
  },
  {
    id: 'support',
    label: 'Suporte',
    icon: HelpCircle,
    page: 'Support',
  },
];

const aiAgents = [
  { id: 'dia', label: 'DIA Copilot', description: 'Assistente inteligente', page: 'DIACopilot' },
  { id: 'recovery', label: 'Recovery Agent', description: 'Recuperação de pagamentos', page: 'RecoveryAgent' },
  { id: 'converter', label: 'Converter Agent', description: 'Otimização de checkout', page: 'ConverterAgent' },
  { id: 'dispute', label: 'Dispute Manager', description: 'Gestão de disputas', page: 'DisputeAgentSettings' },
  { id: 'origination', label: 'Origination Agent', description: 'Onboarding inteligente', page: 'OriginationAgentSettings' },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['transactions', 'financial']);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const toggleSubmenu = (id) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const isActivePage = (page) => currentPageName === page;
  const isActiveSection = (item) => {
    if (isActivePage(item.page)) return true;
    if (item.submenu) {
      return item.submenu.some(sub => isActivePage(sub.page));
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans antialiased selection:bg-primary/20 selection:text-primary">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-[#0F172A] text-slate-300 transition-all duration-300 shadow-2xl",
        sidebarOpen ? "w-64" : "w-20",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            "flex items-center h-16 px-4 border-b border-slate-800/50",
            sidebarOpen ? "justify-between" : "justify-center"
          )}>
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00D26A] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PS</span>
                  </div>
                  <span className="text-white font-semibold">PagSmile Sub</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white hover:bg-white/10 hidden lg:flex"
                  onClick={() => setSidebarOpen(false)}
                >
                  <PanelLeftClose className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeft className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                          isActiveSection(item)
                            ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,210,106,0.15)]"
                            : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActiveSection(item) ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                        {sidebarOpen && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                              <Badge 
                                variant={item.badgeVariant || "secondary"} 
                                className={cn(
                                  "h-5 px-1.5 text-[10px] rounded-full",
                                  item.badgeVariant === 'destructive' 
                                    ? "bg-red-500/20 text-red-400 border-0" 
                                    : "bg-white/10 text-white border-0"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronDown className={cn(
                              "w-4 h-4 transition-transform duration-200 text-slate-500",
                              expandedMenus.includes(item.id) && "rotate-180 text-primary"
                            )} />
                          </>
                        )}
                      </button>
                      {sidebarOpen && expandedMenus.includes(item.id) && (
                        <div className="ml-4 mt-1 pl-4 border-l border-slate-800 space-y-1">
                          {item.submenu.map((sub, idx) => (
                            <Link
                              key={idx}
                              to={createPageUrl(sub.page)}
                              className={cn(
                                "block px-3 py-2 rounded-lg text-sm transition-all relative",
                                isActivePage(sub.page)
                                  ? "text-primary font-medium bg-primary/5"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                              )}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={createPageUrl(item.page)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActivePage(item.page)
                          ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,210,106,0.15)]"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActivePage(item.page) ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badgeVariant || "secondary"} 
                              className={cn(
                                "h-5 px-1.5 text-[10px] rounded-full",
                                item.badgeVariant === 'destructive' 
                                  ? "bg-red-500/20 text-red-400 border-0" 
                                  : "bg-white/10 text-white border-0"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* AI Agents Section */}
            {sidebarOpen && (
              <div className="px-3 mt-8">
                <div className="px-3 mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Agentes de IA
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                </div>
                <div className="space-y-1">
                {aiAgents.map((agent) => (
                  <Link
                    key={agent.id}
                    to={createPageUrl(agent.page)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative overflow-hidden",
                      isActivePage(agent.page)
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {isActivePage(agent.page) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />
                    )}
                    <div className={cn(
                      "relative w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-300 shadow-lg",
                      isActivePage(agent.page) 
                          ? "bg-gradient-to-br from-primary to-emerald-600 text-white shadow-primary/25" 
                          : "bg-slate-800/50 text-slate-500 group-hover:bg-primary/20 group-hover:text-primary border border-slate-700/50 group-hover:border-primary/30"
                    )}>
                       <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="relative z-10 font-medium">{agent.label}</span>
                    {isActivePage(agent.page) && (
                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </Link>
                ))}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-t border-slate-800/50 bg-[#0B1121]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-slate-700/50 group">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-slate-700 group-hover:border-primary transition-colors">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                          <AvatarFallback className="bg-primary text-white font-bold">JD</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0B1121] rounded-full"></span>
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">João Silva</p>
                      <p className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">joao@pagsmile.com</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="relative hidden sm:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                <Input
                  placeholder="Buscar transações, clientes, (⌘K)"
                  className="w-64 lg:w-96 pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Assistant Button */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 shadow-sm"
                onClick={() => setShowAIPanel(!showAIPanel)}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">DIA Copilot</span>
              </Button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full w-10 h-10">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-4 text-sm text-gray-500 text-center">
                    Nenhuma notificação nova
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile User Avatar */}
              <Avatar className="h-8 w-8 lg:hidden">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback className="bg-[#00D26A] text-white text-xs">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D26A] to-[#00A854] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">DIA Copilot</h3>
                <p className="text-xs text-gray-500">Assistente Inteligente</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowAIPanel(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4 h-[calc(100%-140px)] overflow-y-auto">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">
                Olá! Sou o DIA, seu assistente inteligente. Como posso ajudar você hoje?
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Sugestões</p>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#00D26A] hover:bg-[#00D26A]/5 transition-colors text-sm">
                📊 Analisar taxa de aprovação do mês
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#00D26A] hover:bg-[#00D26A]/5 transition-colors text-sm">
                💰 Ver oportunidades de recuperação
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#00D26A] hover:bg-[#00D26A]/5 transition-colors text-sm">
                ⚠️ Disputas que precisam de atenção
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="relative">
              <Input placeholder="Digite sua pergunta..." className="pr-10" />
              <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-[#00D26A] hover:bg-[#00A854]">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --pagsmile-dark: #101F3E;
          --pagsmile-green: #00D26A;
        }
      `}</style>
    </div>
  );
}