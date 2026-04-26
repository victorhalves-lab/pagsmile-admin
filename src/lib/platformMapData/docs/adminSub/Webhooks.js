// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Webhooks
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/Webhooks.jsx (339 linhas).
// Cada coluna, cada item do dropdown, cada checkbox de evento, cada ícone
// color-coded por status — documentado individualmente.
// ============================================================================

export const WebhooksDoc = {
  pageId: 'Webhooks',
  pagePath: '/Webhooks',
  module: 'Integrações',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Painel de configuração de webhooks — endpoints HTTP que o PagSmile chama automaticamente quando eventos acontecem (transação aprovada, chargeback recebido, assinatura cancelada). DataTable com 7 colunas (Webhook color-coded por status, Status, Eventos count, Taxa de Sucesso com Progress bar, Enviados + falhas, Último Envio, Ações), Info Card educativo "O que são Webhooks?" e SideDrawer de criação com Nome + URL + 11 checkboxes de eventos.',

    whyWebhooksMatter: {
      reasoning:
        'Sem webhooks, merchant precisa fazer POLLING (consultar API a cada X segundos) — caro, lento, ineficiente. Com webhooks, PagSmile NOTIFICA automaticamente. Aprovou? Webhook. Chargeback recebido? Webhook. Sistema do merchant reage em tempo real (libera produto, manda e-mail, atualiza ERP).',
      reverseAPI: 'Webhook = "API reversa" — em vez do cliente chamar o servidor, servidor chama o cliente quando algo acontece',
    },

    elevenAvailableEvents: {
      transactionEvents: [
        'transaction.approved — Transação Aprovada',
        'transaction.declined — Transação Recusada',
        'transaction.refunded — Transação Estornada',
      ],
      chargebackEvents: [
        'chargeback.received — Chargeback Recebido',
        'chargeback.won — Chargeback Vencido (ganho)',
        'chargeback.lost — Chargeback Perdido',
      ],
      subscriptionEvents: [
        'subscription.created — Assinatura Criada',
        'subscription.cancelled — Assinatura Cancelada',
        'subscription.payment_failed — Pagamento de Assinatura Falhou',
      ],
      pixEvents: ['pix.received — Pix Recebido'],
      withdrawalEvents: ['withdrawal.completed — Saque Concluído'],
    },

    threeStatusStates: {
      active: 'emerald — funcionando normalmente',
      failing: 'red — falhando consistentemente (>20% falhas em janela)',
      inactive: 'gray — pausado manualmente',
    },

    threeColorBandsForSuccessRate: {
      green: '>=95% — emerald-600 (saudável)',
      yellow: '80-94% — yellow-600 (atenção)',
      red: '<80% — red-600 (problema)',
    },

    sevenColumnsTable: {
      col1: 'Webhook — quadrado 10x10 color-coded por status + Webhook icon + name + url truncado',
      col2: 'Status — StatusBadge',
      col3: 'Eventos — "{N} eventos" (count do array)',
      col4: 'Taxa de Sucesso — Progress bar w-16 h-2 + percentual color-coded',
      col5: 'Enviados — total_sent + linha vermelha "{X} falhas" se >0',
      col6: 'Último Envio — format dd/MM HH:mm ou "Nunca"',
      col7: 'Ações — DropdownMenu (Ver detalhes / Testar / Copiar Secret / Pausar-Ativar / Excluir)',
    },

    fiveDropdownActions: {
      verDetalhes: 'Eye icon — gap: sem onClick',
      testar: 'Play icon — gap: sem onClick (deveria disparar evento de teste)',
      copiarSecret: 'Copy icon — copia row.secret + toast "Secret copiado!"',
      pausarAtivar: 'Conditional: Pause se active OR Play se inactive — gap: sem onClick',
      excluir: 'Trash2 + text-red-600 — gap: sem onClick',
    },

    coreCapabilities: [
      'PageHeader com CTA verde "Novo Webhook"',
      'Info Card educativo (azul) explicando webhooks',
      'DataTable com searchable em name/URL + pagination 25',
      'Color-coding triplo: ícone, status, taxa de sucesso',
      'Progress bar visual da success_rate',
      'SideDrawer com 11 checkboxes para selecionar eventos',
      'Validação 3 campos: name + url + events.length > 0',
      'Geração automática de secret: whsec_${Math.random()}',
      'Webhook ID: wh_${Date.now()}',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Webhooks.jsx',
    totalLines: 339,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.Webhook',
      sharedComponents: ['PageHeader', 'DataTable', 'StatusBadge', 'SideDrawer'],
      uiComponents: [
        'Button', 'Badge', 'Input', 'Label', 'Checkbox',
        'DropdownMenu stack',
        'Progress',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast', 'date-fns format', 'date-fns/locale ptBR'],
      lucideIcons: [
        'Webhook — header drawer + col1 + Info Card icon',
        'Plus — header CTA',
        'Eye — Ver detalhes',
        'MoreHorizontal — DropdownMenu trigger',
        'CheckCircle — importado sem uso',
        'XCircle — importado sem uso',
        'AlertTriangle — importado sem uso',
        'RefreshCw — importado sem uso',
        'Copy — Copiar Secret',
        'Trash2 — Excluir (red)',
        'Play — Testar / Ativar',
        'Pause — Pausar',
      ],
      constants: {
        availableEvents: 'Array com 11 objetos { id, label }',
      },
    },

    componentState: {
      isCreateOpen: { initial: 'false', purpose: 'Toggle SideDrawer' },
      newWebhook: {
        initial: '{ name: "", url: "", events: [] }',
        purpose: 'Form state',
      },
    },

    backendIntegration: {
      query: {
        queryKey: "['webhooks']",
        queryFn: 'base44.entities.Webhook.list("-created_date", 50)',
      },
      createMutation: {
        mutationFn: 'Webhook.create({ ...data, webhook_id: wh_{Date.now()}, secret: whsec_{Math.random()}, status: active })',
        onSuccess: 'invalidate + setIsCreateOpen(false) + reset newWebhook + toast.success',
      },
    },

    helperFunctions: {
      toggleEvent: {
        signature: '(eventId) => void',
        logic: 'setNewWebhook(prev => ({ ...prev, events: prev.events.includes(eventId) ? prev.events.filter(...) : [...prev.events, eventId] }))',
      },
      handleCreate: {
        validations: 'if (!name || !url || events.length === 0) toast.error("Preencha todos os campos obrigatórios"); return',
        dispatch: 'createMutation.mutate(newWebhook)',
      },
    },

    layout: {
      pageHeader: {
        title: '"Webhooks"',
        subtitle: '"Configure notificações para seus sistemas"',
        breadcrumbs: [
          { label: 'Integrações', page: 'Integrations' },
          { label: 'Webhooks', page: 'Webhooks' },
        ],
        actions: 'Button bg-#00D26A + Plus + "Novo Webhook"',
      },

      infoCard: {
        wrapper: 'bg-blue-50 border border-blue-200 rounded-xl p-4',
        layout: 'flex items-start gap-3',
        icon: 'Webhook 5x5 blue-600 flex-shrink-0 mt-0.5',
        title: 'O que são Webhooks?',
        body: 'Webhooks são notificações HTTP enviadas automaticamente para sua URL quando eventos importantes acontecem, como transações aprovadas, chargebacks recebidos, etc.',
      },

      dataTable: {
        component: 'DataTable',
        props: 'columns + data + loading + searchable + searchPlaceholder "Buscar por nome ou URL..." + pagination 25 + emptyMessage',
        columns: [
          {
            key: 'name',
            render: {
              colorBox: 'w-10 h-10 rounded-lg adaptive: active=bg-emerald-100, failing=bg-red-100, else=bg-gray-100',
              icon: 'Webhook 5x5 adaptive: active=text-emerald-600, failing=text-red-600, else=text-gray-400',
              text: 'name + url truncate max-w-200',
            },
          },
          { key: 'status', render: 'StatusBadge' },
          { key: 'events', render: '"{value?.length || 0} eventos"' },
          {
            key: 'success_rate',
            render: {
              wrapper: 'flex items-center gap-2',
              progress: 'Progress w-16 h-2 value=rate',
              percentage: 'font-medium adaptive: >=95 emerald-600, >=80 yellow-600, else red-600',
              defaultRate: 100,
            },
          },
          {
            key: 'total_sent',
            render: {
              line1: 'value || 0',
              line2: 'if total_failed > 0 → red-500 "{total_failed} falhas"',
            },
          },
          { key: 'last_sent_at', render: 'format dd/MM HH:mm ou "Nunca"' },
          {
            key: 'actions',
            render: {
              dropdown: [
                'Eye + "Ver detalhes" (gap: sem onClick)',
                'Play + "Testar" (gap: sem onClick)',
                'Copy + "Copiar Secret" → navigator.clipboard.writeText(row.secret) + toast',
                'Conditional Pause/Play "Pausar/Ativar" (gap: sem onClick)',
                'Trash2 + "Excluir" red-600 (gap: sem onClick)',
              ],
            },
          },
        ],
      },

      sideDrawer: {
        title: '"Novo Webhook"',
        description: '"Configure uma URL para receber notificações de eventos"',
        icon: 'Webhook',
        body: {
          field1: {
            label: 'Nome *',
            placeholder: 'Ex: Meu Sistema',
          },
          field2: {
            label: 'URL de Destino *',
            placeholder: 'https://seu-sistema.com/webhook',
            helpText: 'Deve ser uma URL HTTPS acessível publicamente',
          },
          field3: {
            label: 'Eventos para Notificar *',
            grid: 'grid grid-cols-1 gap-2',
            renderEach: 'flex items-center gap-2: Checkbox + label htmlFor',
            checkboxLogic: 'checked={newWebhook.events.includes(event.id)} onCheckedChange={() => toggleEvent(event.id)}',
            events: 'Map sobre availableEvents (11 itens)',
          },
        },
        footer: 'flex justify-end gap-3: Button outline "Cancelar" + Button verde "Criar Webhook" (disabled isPending, label "Criando..." se isPending)',
      },
    },

    knownGaps: [
      'CheckCircle, XCircle, AlertTriangle, RefreshCw (lucide) importados sem uso',
      'Itens do dropdown sem onClick: Ver detalhes, Testar, Pausar/Ativar, Excluir',
      'Nenhum filtro por status (active/failing/inactive)',
      'Sem badge contador no header',
      'URL não é validada como HTTPS (campo aceita HTTP)',
      'Sem teste prévio do endpoint antes de salvar',
      'Sem log de tentativas individuais (apenas success_rate agregado)',
      'Sem retry policy configurável',
      'Sem timeout configurável',
      'Versão (v1/v2) hardcoded "v1" no schema mas UI não permite escolher',
      'Lista de events não tem categoria visual (transactions/chargebacks/etc.)',
      'Sem busca/filtro nos eventos no drawer (11 visíveis, mas tendência a crescer)',
      'Sem botão "Selecionar todos" / "Desmarcar todos" para events',
      'Sem preview do payload que será enviado',
      'Sem documentação inline do schema do payload por evento',
    ],

    relationshipsToOtherPages: {
      apiKeys: '/ApiKeys — irmão de integrações (mesmo módulo)',
      plugins: '/Plugins — irmão',
      adminIntWebhooks: '/AdminIntWebhooks — visão admin interno (todos os webhooks da plataforma + monitoramento)',
      adminIntIntegrations: '/AdminIntIntegrations — admin gerencia integrações cross-merchants',
      transactions: '/Transactions — fonte dos eventos transaction.*',
      chargebacks: '/Chargebacks — fonte dos eventos chargeback.*',
      subscriptions: '/Subscriptions — fonte dos eventos subscription.*',
    },
  },
};

export default WebhooksDoc;