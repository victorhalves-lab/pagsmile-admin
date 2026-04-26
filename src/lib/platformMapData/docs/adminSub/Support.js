// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Support
// Fidelidade absoluta a pages/Support.jsx (598 linhas).
// ============================================================================

export const SupportDoc = {
  pageId: 'Support',
  pagePath: '/Support',
  module: 'Configurações & Suporte',
  parentPage: null,

  explainer: {
    oneLiner:
      'Central de ajuda e suporte ao merchant — PageHeader com 2 actions (Meus Tickets / Abrir Ticket), 3 Tabs principais (Central de Ajuda / Meus Tickets / Status da Plataforma). Tab Central de Ajuda: 4 Quick Action cards (Documentação/API Reference/DIA Copilot/Chat ao Vivo) + Status da Plataforma resumido + Search FAQ + 3 categorias de FAQs com Accordion (Transações 3qa, Financeiro 3qa, Disputas 3qa). Tab Tickets: DataTable com 5 colunas e CRUD via SupportTicket entity. Tab Status: 6 sistemas operacionais + Incidentes Ativos + Manutenções Programadas + Subscribe to Updates. Dialog "Abrir Ticket" com 4 campos.',

    threeMainTabs: {
      help: '4 Quick Actions + Status Platform resumido + Search FAQ + 3 Tabs FAQ (Transações/Financeiro/Disputas)',
      tickets: 'Card com header "Meus Tickets" + Button "Novo Ticket" + DataTable',
      status: '6 Service Cards + Incidentes Ativos (empty) + Manutenções Programadas + Subscribe',
    },

    fourQuickActions: {
      documentation: 'Book azul + "Documentação" + "Guias e tutoriais" + ExternalLink',
      apiReference: 'FileText roxo + "API Reference" + "Referência técnica" + ExternalLink',
      diaCopilot: 'Sparkles emerald + "DIA Copilot" + "Assistente IA" + ChevronRight',
      liveChat: 'MessageSquare laranja + "Chat ao Vivo" + "Fale conosco" + ChevronRight',
      gap: 'Todos são <a href="#"> — não navegam para nenhum lugar',
    },

    threeFAQCategories: {
      transactions: '3 perguntas (recusa/prazo D+30/estornar)',
      financial: '3 perguntas (mínimo R$100 saque/processamento Pix 2h TED D+1/antecipação)',
      disputes: '3 perguntas (definição CB/contestar/perder)',
    },

    sixServicesPlatform: ['API operational', 'Checkout operational', 'Admin operational', 'Webhooks operational', 'Pix operational', 'Antifraude operational'],

    fiveTicketStatuses: {
      open: 'bg-blue-100 text-blue-700 — "Aberto"',
      in_progress: 'bg-yellow-100 text-yellow-700 — "Em Andamento"',
      waiting_customer: 'bg-purple-100 text-purple-700 — "Aguardando Resposta"',
      resolved: 'bg-emerald-100 text-emerald-700 — "Resolvido"',
      closed: 'bg-gray-100 text-gray-700 — "Fechado"',
    },

    fiveTicketCategories: {
      technical: 'Técnico',
      financial: 'Financeiro',
      commercial: 'Comercial',
      disputes: 'Disputas',
      other: 'Outro',
    },

    fourTicketPriorities: 'Baixa / Média (default) / Alta / Crítica',

    oneScheduledMaintenance: '2026-02-01, 03:00-05:00, API, "Atualização de segurança programada"',
  },

  technical: {
    fileLocation: 'pages/Support.jsx',
    totalLines: 598,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.SupportTicket',
      uiComponents: ['Button', 'Input', 'Textarea', 'Label', 'Badge', 'Tabs stack', 'Accordion stack', 'Select stack', 'Dialog stack', 'Card stack'],
      sharedComponents: ['PageHeader', 'DataTable'],
      utilities: ['cn (importado sem uso)', 'sonner toast'],
      lucideIcons: 'HelpCircle (sem uso), MessageSquare, Book, FileText, ExternalLink, Search, ChevronRight, CheckCircle, AlertTriangle, Clock (sem uso), Sparkles, Send, Upload (sem uso), Eye (sem uso), RefreshCw (sem uso), Bell, Calendar, XCircle (sem uso), History',
    },

    componentState: {
      searchTerm: { initial: "''", purpose: 'Filtro do FAQ search' },
      isTicketOpen: { initial: 'false', purpose: 'Toggle Dialog Abrir Ticket' },
      activeTab: { initial: "'help'", purpose: 'Tab principal (help/tickets/status)' },
      ticket: { initial: '{ category: "", subject: "", description: "", priority: "medium" }', purpose: 'Form do dialog' },
    },

    backendIntegration: {
      query: {
        queryKey: "['support-tickets']",
        queryFn: 'base44.entities.SupportTicket.list("-created_date", 50)',
      },
      createTicketMutation: {
        mutationFn: 'SupportTicket.create({ ...data, ticket_id: TKT-{Date.now()}, status: "open" })',
        onSuccess: 'invalidate + close + reset + toast',
      },
    },

    constants: {
      faqs: '3 categorias com 9 perguntas total — { category, questions: [{ q, a }] }',
      statusItems: '6 sistemas hardcoded',
      incidents: 'Array vazio (sem incidentes mock)',
      maintenances: '1 manutenção mock',
      ticketStatusConfig: 'hash com 5 statuses',
      ticketColumns: '5 colunas para DataTable',
    },

    helperFunctions: {
      handleSubmitTicket: {
        validation: 'category && subject && description (priority opcional)',
        action: 'createTicketMutation.mutate(ticket)',
      },
    },

    layout: {
      pageHeader: {
        title: '"Suporte"',
        subtitle: '"Central de ajuda e suporte"',
        breadcrumbs: [{ label: 'Suporte', page: 'Support' }],
        actions: [
          'Button outline + History + "Meus Tickets" → setActiveTab("tickets")',
          'Button bg-#00D26A + MessageSquare + "Abrir Ticket" → setIsTicketOpen(true)',
        ],
      },

      mainTabs: {
        value: 'activeTab',
        onValueChange: 'setActiveTab',
        tabsList: [
          'TabsTrigger value="help" "Central de Ajuda"',
          'TabsTrigger value="tickets" "Meus Tickets" + Badge secondary count tickets não-closed',
          'TabsTrigger value="status" "Status da Plataforma"',
        ],
      },

      tabHelp: {
        quickActionsGrid: {
          layout: 'grid 1/4 cols gap-4',
          renderEach: {
            wrapper: 'a href="# (gap: sem destino) p-4 bg-white rounded-xl border hover:border-#00D26A/30 hover:shadow-md group',
            left: 'iconBox p-2.5 rounded-lg + bg-color-100 + icon 5x5 color-600',
            middle: 'p font-medium group-hover:text-#00D26A + p-xs gray description',
            right: 'ExternalLink ou ChevronRight 4x4 gray-300',
          },
          items: 'documentation/apiReference/diaCopilot/liveChat',
        },

        statusBlock: {
          wrapper: 'bg-white rounded-xl border p-5',
          header: 'h3 "Status da Plataforma" + Badge bg-emerald-100 "Todos os sistemas operacionais"',
          grid: 'grid 2/4 cols — para cada item: CheckCircle emerald + name',
        },

        searchAndFAQs: {
          wrapper: 'bg-white rounded-xl border p-5',
          header: 'h3 "Perguntas Frequentes" + relative max-w-md + Search 4x4 absolute + Input "Buscar..." pl-9',
          tabsContainer: {
            defaultValue: '"Transações"',
            tabsList: 'TabsTrigger por categoria',
            tabsContent: {
              renderEach: {
                accordion: 'type=single collapsible space-y-2',
                filterLogic: '!searchTerm || q.toLowerCase().includes(searchTerm.toLowerCase()) || a.toLowerCase().includes(searchTerm.toLowerCase())',
                accordionItem: 'border rounded-lg px-4 — AccordionTrigger pergunta + AccordionContent gray-600 resposta',
              },
            },
          },
        },
      },

      tabTickets: {
        card: {
          header: 'CardTitle "Meus Tickets" + CardDescription + Button bg-#00D26A "Novo Ticket"',
          content: {
            component: 'DataTable',
            props: {
              columns: 'ticketColumns (5)',
              data: 'tickets',
              loading: 'isLoading',
              searchable: 'true',
              searchPlaceholder: 'Buscar tickets...',
              pagination: 'true',
              pageSize: '10',
              currentPage: '1',
              totalItems: 'tickets.length',
              emptyMessage: 'Nenhum ticket encontrado',
            },
          },
        },
        ticketColumns: [
          { key: 'ticket_id', label: 'ID', render: 'code text-xs bg-gray-100 px-2 py-1 rounded' },
          { key: 'subject', label: 'Assunto', render: 'span font-medium' },
          { key: 'category', label: 'Categoria', render: 'Badge outline capitalize com tradução PT' },
          { key: 'status', label: 'Status', render: 'Badge color-coded via ticketStatusConfig' },
          { key: 'created_date', label: 'Criado em', render: 'toLocaleDateString pt-BR ou "-"' },
        ],
      },

      tabStatus: {
        statusOverviewCard: {
          header: 'CardTitle "Status dos Serviços" + CardDescription "Atualizado há 2 minutos" (gap: hardcoded) + Badge bg-emerald-100',
          content: 'grid 2/3/6 cols — para cada serviço: bg-gray-50 rounded-lg p-3 + CheckCircle emerald + name font-medium',
        },

        activeIncidentsCard: {
          header: 'CardTitle AlertTriangle yellow-500 + "Incidentes Ativos"',
          ifEmpty: 'center py-8 + CheckCircle 12x12 emerald + "Nenhum incidente ativo no momento"',
          ifPopulated: 'p-4 border-yellow-200 bg-yellow-50 + h4 title + sub description',
        },

        scheduledMaintenanceCard: {
          header: 'CardTitle Calendar blue-500 + "Manutenções Programadas"',
          renderEach: {
            wrapper: 'p-4 border rounded-lg flex justify-between',
            left: 'p font-medium description + p sm gray "Serviço: {service}"',
            right: 'p font-medium toLocaleDateString pt-BR + p sm gray time',
          },
          ifEmpty: 'p gray center "Nenhuma manutenção programada"',
        },

        subscribeCard: {
          content: 'Bell gray-400 + "Receber atualizações de status" + sub "Seja notificado..." + Button outline "Assinar Atualizações"',
          gap: 'Botão SEM onClick',
        },
      },

      ticketDialog: {
        renderIf: 'isTicketOpen',
        size: 'max-w-md',
        title: '"Abrir Ticket de Suporte"',
        description: '"Descreva seu problema e nossa equipe responderá em breve"',
        body: [
          { label: 'Categoria *', control: 'Select [Técnico/Financeiro/Comercial/Disputas/Outro]' },
          { label: 'Prioridade', control: 'Select [Baixa/Média default/Alta/Crítica]' },
          { label: 'Assunto *', control: 'Input "Resumo do problema"' },
          { label: 'Descrição *', control: 'Textarea rows=4' },
        ],
        footer: 'Button outline Cancelar + Button bg-#00D26A + Send + "Enviar Ticket" → handleSubmitTicket',
      },
    },

    knownGaps: [
      'cn, HelpCircle, Clock, Upload, Eye, RefreshCw, XCircle (lucide) importados sem uso',
      'Quick Actions são <a href="#"> — TODOS sem destino real (não navegam)',
      'Botão "Assinar Atualizações" SEM onClick',
      '"Atualizado há 2 minutos" hardcoded — sem timestamp dinâmico',
      'incidents array hardcoded vazio — sem fonte real',
      'maintenances array hardcoded com 1 entry estática (futuro: 2026-02-01)',
      'statusItems hardcoded — todos sempre operational, sem health check real',
      'Sem upload de anexos no ticket (Upload importado mas não usado)',
      'Sem visualização de detalhe de ticket (linha do DataTable não tem onClick)',
      'Sem reabrir ticket fechado',
      'Sem chat realtime no ticket',
      'Sem notificação ao receber resposta do ticket',
      'Sem auto-refresh dos tickets',
      'Quick Action "Chat ao Vivo" sem implementação real',
      'Quick Action "DIA Copilot" deveria abrir chat — apenas href="#"',
      'Search da FAQ funciona apenas para Tabs — Accordion abre default no primeiro mas não destaca match',
    ],

    relationshipsToOtherPages: {
      settingsPage: '/SettingsPage — irmão da seção Configurações & Suporte',
      diaCopilot: '/DIACopilot — Quick Action menciona mas não navega',
      transactions: '/Transactions — FAQ refere a estornos',
      withdrawals: '/Withdrawals — FAQ refere a saques',
      anticipation: '/Anticipation — FAQ refere a antecipação',
      chargebacks: '/Chargebacks — FAQ refere a chargebacks',
      adminIntSupport: '/AdminIntSupport — visão admin interno (suporte como agente)',
    },
  },
};

export default SupportDoc;