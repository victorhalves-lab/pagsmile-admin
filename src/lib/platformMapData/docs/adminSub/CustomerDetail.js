// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /CustomerDetail
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/CustomerDetail.jsx (597 linhas).
// Cada tab, cada bloco do header, cada coluna de transação, cada item de cartão,
// cada item de assinatura, cada item de disputa, cada Dialog — documentado.
// ============================================================================

export const CustomerDetailDoc = {
  pageId: 'CustomerDetail',
  pagePath: '/CustomerDetail',
  module: 'Clientes',
  parentPage: 'Customers',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Perfil 360° do cliente — recebe id via URL params, busca Customer + Transaction + Subscription + Dispute em 4 queries paralelas, exibe header card com 4 stats coloridas (Compras / LTV / Ticket Médio / Score de Risco) + 5 Tabs (Informações / Transações / Cartões / Assinaturas / Disputas), Dialogs para Adicionar Tag e Solicitar Cartão.',

    customer360Concept: {
      reasoning:
        'Operadores precisam visão consolidada do cliente: comportamento de compra, métodos preferidos, recorrência, problemas (disputas, chargebacks). Dispersar dados em telas separadas é ineficiente.',
      datasources: '4 entidades: Customer (perfil) + Transaction (histórico) + Subscription (recorrência) + Dispute (problemas)',
    },

    fourHeaderStats: {
      total_purchases: 'Compras — count das compras (text-3xl gray-900)',
      total_spent: 'LTV — text-3xl emerald-600 formatCurrency',
      average_ticket: 'Ticket Médio — text-3xl blue-600',
      risk_score: 'Score de Risco — text-3xl purple-600 + escala 0-100',
    },

    fiveTabsConcept: {
      info: '4 cards 2x2: Contato / Atividade / Endereços / Risco e Disputas',
      transactions: 'DataTable com 5 colunas + 50 transactions',
      cards: 'saved_cards do customer + CTA Solicitar Cartão',
      subscriptions: 'Lista de Subscription com plan/amount/billing/next_billing/status',
      disputes: 'Lista de Dispute com type/reason/amount/status',
    },

    fiveSegmentsLogic: 'Idêntico ao /Customers — segmentConfig 5 entradas (new, recurring, vip, at_risk, inactive) com label/color/icon',

    threeRiskScoreColorBands: {
      green: '<30 — emerald-600',
      yellow: '30-60 — yellow-600',
      red: '>=60 — red-600',
    },

    twoDialogsAuxiliary: {
      addTag: {
        trigger: 'DropdownMenu "Adicionar Tag" + button no card cards',
        size: 'max-w-sm',
        body: 'Label + Input "Nome da Tag" placeholder "Ex: Premium, Empresa, Parceiro"',
        cta: 'bg-#00D26A "Adicionar" → toast "Tag adicionada!" + close (gap: NÃO persiste)',
      },
      addCard: {
        trigger: 'DropdownMenu "Solicitar Cartão" + cards tab CTAs',
        size: 'max-w-sm',
        body: 'Texto: "Um e-mail será enviado para {customer.email} com um link seguro para cadastro de cartão."',
        cta: 'bg-#00D26A + Send + "Enviar Link" → toast "Link enviado por e-mail!" (gap: SEM envio real)',
      },
    },

    coreCapabilities: [
      'URLSearchParams para extrair customer id',
      '4 useQuery paralelas com enabled condicional ao customer.email',
      'Loading state com RefreshCw spin',
      'PageHeader com title=customer.name + subtitle "Perfil 360°"',
      'Header Card com avatar 20x20 + 4 stats coloridas',
      '5 Tabs com defaultValue=info e badge no Tab Transações',
      'Tab Info com 4 sub-cards (Contato / Atividade / Endereços / Risco)',
      'Tab Cartões com lista de saved_cards (•••• last_four + brand + expiry) + Trash2',
      'Tab Subscriptions com next_billing_date + StatusBadge',
      'Tab Disputes com dispute_id + reason + amount red + StatusBadge',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/CustomerDetail.jsx',
    totalLines: 597,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery'],
      base44: 'base44.entities.Customer / Transaction / Subscription / Dispute',
      navigation: ['Link', 'createPageUrl from @/utils'],
      sharedComponents: ['PageHeader', 'DataTable', 'StatusBadge'],
      uiComponents: [
        'Button', 'Badge', 'Avatar+AvatarFallback',
        'Tabs+TabsContent+TabsList+TabsTrigger',
        'Card+CardContent+CardHeader+CardTitle',
        'Input', 'Label',
        'Dialog stack', 'DropdownMenu stack',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast', 'date-fns format', 'date-fns/locale ptBR'],
      lucideIcons: [
        'ArrowLeft — importado sem uso',
        'Mail — botão Enviar E-mail + Tab Info contato',
        'Phone — Tab Info',
        'CreditCard — Tab Info doc + Cards + DropdownMenu',
        'MapPin — Endereços',
        'Calendar — Tab Info Primeira Compra',
        'ShoppingBag — Última Compra',
        'TrendingUp — segment recurring',
        'AlertTriangle — segment at_risk + Risco e Disputas Chargebacks',
        'Star — segment new',
        'Tag — Adicionar Tag',
        'Send — botão Enviar Link no Add Card Dialog',
        'Plus — botão Solicitar Cartão',
        'Trash2 — remover cartão',
        'Monitor / Smartphone — importados sem uso',
        'MoreHorizontal — DropdownMenu trigger',
        'Eye — importado sem uso',
        'RefreshCw — loading state + Estornos',
        'Shield — Score de Risco + empty Disputes',
        'Crown — segment vip',
        'Clock — segment inactive',
      ],
      localUtility: { formatCurrency: 'inline' },
      constants: {
        segmentConfig: 'Object com 5 segments {label, color, icon}',
      },
    },

    componentState: {
      isAddTagOpen: { initial: 'false', purpose: 'Add Tag Dialog' },
      isAddCardOpen: { initial: 'false', purpose: 'Add Card Dialog' },
      newTag: { initial: "''", purpose: 'Input do dialog Add Tag' },
    },

    backendIntegration: {
      urlParams: 'new URLSearchParams(window.location.search).get("id")',
      queryCustomer: {
        queryKey: "['customer', customerId]",
        queryFn: 'Customer.filter({ id: customerId }) → customers[0]',
        enabled: '!!customerId',
        gap: 'usa filter+[0] em vez de Customer.get(id) — menos eficiente',
      },
      queryTransactions: {
        queryKey: "['customer-transactions', customer?.email]",
        queryFn: 'Transaction.filter({ customer_email }, "-created_date", 50)',
        enabled: '!!customer?.email',
      },
      querySubscriptions: {
        queryKey: "['customer-subscriptions', customer?.email]",
        queryFn: 'Subscription.filter({ customer_email })',
      },
      queryDisputes: {
        queryKey: "['customer-disputes', customer?.email]",
        queryFn: 'Dispute.filter({ customer_email })',
      },
    },

    loadingState: {
      condition: 'isLoading || !customer',
      ui: 'flex items-center justify-center h-64 + RefreshCw 6x6 animate-spin gray-400',
    },

    layout: {
      pageHeader: {
        title: 'customer.name',
        subtitle: '"Perfil 360° do cliente"',
        breadcrumbs: [{ label: 'Clientes', page: 'Customers' }, { label: 'customer.name' }],
        actions: [
          'Button outline + Mail + "Enviar E-mail" (gap: sem onClick)',
          {
            dropdown: 'Button outline + MoreHorizontal',
            items: [
              'Tag + "Adicionar Tag" → setIsAddTagOpen(true)',
              'CreditCard + "Solicitar Cartão" → setIsAddCardOpen(true)',
            ],
          },
        ],
      },

      headerCard: {
        wrapper: 'Card → CardContent p-6',
        layout: 'flex flex-col md:flex-row gap-6',
        leftBlock: {
          avatar: 'Avatar 20x20 bg-#101F3E text-white text-2xl + iniciais auto',
          info: 'h2 2xl bold + email gray-500 + Badge segment com config.icon + tags map',
        },
        rightStatsGrid: {
          layout: 'flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-auto',
          stats: [
            { bg: 'bg-gray-50', value: 'total_purchases || 0', label: 'Compras', textColor: 'gray-900' },
            { bg: 'bg-emerald-50', value: 'formatCurrency(total_spent)', label: 'LTV', textColor: 'emerald-600' },
            { bg: 'bg-blue-50', value: 'formatCurrency(average_ticket)', label: 'Ticket Médio', textColor: 'blue-600' },
            { bg: 'bg-purple-50', value: 'risk_score || 0', label: 'Score de Risco', textColor: 'purple-600' },
          ],
        },
      },

      tabs: {
        defaultValue: 'info',
        triggers: [
          'info — "Informações"',
          'transactions — "Transações" + Badge transactions.length',
          'cards — "Cartões"',
          'subscriptions — "Assinaturas"',
          'disputes — "Disputas"',
        ],
      },

      tabInfo: {
        layout: 'grid grid-cols-1 lg:grid-cols-2 gap-6',

        contactCard: {
          title: 'Informações de Contato',
          rows: [
            { icon: 'Mail (bg-gray-100)', label: 'E-mail', value: 'customer.email' },
            { icon: 'Phone', label: 'Telefone', value: 'customer.phone || "Não informado"' },
            { icon: 'CreditCard', label: 'Documento', value: '{customer.document} ({document_type uppercase})' },
          ],
        },

        activityCard: {
          title: 'Atividade',
          rows: [
            { icon: 'Calendar emerald (bg-emerald-100)', label: 'Primeira Compra', value: 'format dd/MM/yyyy ou N/A' },
            { icon: 'ShoppingBag blue (bg-blue-100)', label: 'Última Compra', value: 'format dd/MM/yyyy ou N/A' },
            { icon: 'CreditCard purple (bg-purple-100)', label: 'Método Preferido', value: 'preferred_payment_method ou "Cartão"' },
          ],
        },

        addressesCard: {
          title: 'Endereços',
          listLogic: 'customer.addresses?.length > 0',
          itemRender: 'p-3 bg-gray-50 + MapPin + street/number + city/state/zip_code',
          emptyState: 'text-sm gray-500 "Nenhum endereço cadastrado"',
        },

        riskAndDisputesCard: {
          title: 'Risco e Disputas',
          rows: [
            {
              icon: 'Shield gray',
              label: 'Score de Risco',
              value: 'risk_score/100 com cor dinâmica: <30 emerald, <60 yellow, ≥60 red',
            },
            {
              icon: 'AlertTriangle gray',
              label: 'Chargebacks',
              value: 'count + classe red-600 se > 0',
            },
            {
              icon: 'RefreshCw gray',
              label: 'Estornos',
              value: 'refunds_count || 0',
            },
          ],
        },
      },

      tabTransactions: {
        wrapper: 'Card → CardContent p-6',
        component: 'DataTable',
        columns: [
          { key: 'transaction_id', render: 'code bg-gray-100 + slice 12 chars + "..."' },
          { key: 'created_date', render: 'format dd/MM/yyyy HH:mm' },
          { key: 'type', render: 'Badge outline capitalize' },
          { key: 'amount', render: 'font-semibold formatCurrency' },
          { key: 'status', render: 'StatusBadge' },
        ],
        props: 'searchable + searchPlaceholder + pagination pageSize=10 + emptyMessage "Nenhuma transação encontrada"',
      },

      tabCards: {
        header: 'CardTitle "Cartões Tokenizados" + Button sm + Plus + "Solicitar Cartão" → setIsAddCardOpen',
        listLogic: 'customer.saved_cards?.length > 0',
        itemRender: {
          wrapper: 'flex items-center justify-between p-4 border border-gray-100 rounded-lg',
          left: 'p-3 bg-gray-100 + CreditCard + "•••• {last_four}" + "{brand} • Expira {expiry}"',
          right: 'Badge outline emerald "Ativo" + Trash2 button red',
        },
        emptyState: 'CreditCard 12x12 gray-300 + "Nenhum cartão salvo" + Button outline "Solicitar Cadastro de Cartão"',
      },

      tabSubscriptions: {
        wrapper: 'Card → CardContent p-6',
        listLogic: 'subscriptions.length > 0',
        itemRender: {
          wrapper: 'flex items-center justify-between p-4 border rounded-lg',
          left: 'plan_name + "{formatCurrency(amount)} / {billing_cycle === monthly ? \'mês\' : billing_cycle}"',
          rightInfo: '"Próxima cobrança" + format dd/MM/yyyy ou N/A',
          rightBadge: 'StatusBadge',
        },
        emptyState: 'RefreshCw 12x12 gray-300 + "Nenhuma assinatura ativa"',
      },

      tabDisputes: {
        wrapper: 'Card → CardContent p-6',
        listLogic: 'disputes.length > 0',
        itemRender: {
          wrapper: 'flex items-center justify-between p-4 border rounded-lg',
          left: '"Disputa #{dispute_id}" + "{type} • {reason_description}"',
          rightAmount: 'font-semibold red-600 formatCurrency',
          rightBadge: 'StatusBadge',
        },
        emptyState: 'Shield 12x12 gray-300 + "Nenhuma disputa registrada"',
      },

      addTagDialog: {
        trigger: 'isAddTagOpen state',
        size: 'max-w-sm',
        title: 'Adicionar Tag',
        description: 'Adicione uma tag para classificar este cliente',
        body: 'Label "Nome da Tag" + Input placeholder "Ex: Premium, Empresa, Parceiro"',
        footer: [
          'Button outline "Cancelar" → close',
          {
            primary: 'Button bg-#00D26A "Adicionar"',
            onClick: 'toast.success "Tag adicionada!" + close + clear newTag',
            gap: 'NÃO PERSISTE no Customer (apenas toast)',
          },
        ],
      },

      addCardDialog: {
        trigger: 'isAddCardOpen state',
        size: 'max-w-sm',
        title: 'Solicitar Cadastro de Cartão',
        description: 'Envie um link seguro para o cliente cadastrar um cartão',
        body: 'Texto explicativo com customer.email destacado',
        footer: [
          'Button outline "Cancelar"',
          {
            primary: 'Button bg-#00D26A + Send + "Enviar Link"',
            onClick: 'toast.success "Link enviado por e-mail!" + close',
            gap: 'NÃO ENVIA email real',
          },
        ],
      },
    },

    knownGaps: [
      'ArrowLeft, Monitor, Smartphone, Eye (lucide) importados sem uso',
      'Customer.filter({id})[0] em vez de Customer.get(id) — gap eficiência',
      'Add Tag Dialog não persiste no entity Customer.tags',
      'Add Card Dialog não chama backend — apenas toast',
      'Botão "Enviar E-mail" (header) sem onClick',
      'Botão Trash2 do Card sem onClick — não remove cartão',
      'Tab Cards não mostra is_default ou data de adição',
      'Tab Transactions sem onRefresh',
      'Tab Disputes sem link clicável para /DisputeContestation?id=X',
      'Tab Subscriptions sem link para detalhe da assinatura',
      'Loading state quebra completa — não há skeleton parcial',
      'Sem ação de "marcar como VIP" / mudar segment manualmente',
      'risk_score: 0 mostra "0/100" cinza — não diferencia de "score não calculado"',
      'breadcrumbs.page "Customers" — alias possivelmente inconsistente',
      'urlParams.get("id") sem validação — se id inválido, mostra loading infinito',
    ],

    relationshipsToOtherPages: {
      customers: '/Customers — pai (breadcrumb + link de retorno)',
      transactions: '/Transactions — fonte das transactions exibidas',
      transactionDetail: '/TransactionDetail — gap: deveria linkar do dispute_id na tab Transações',
      subscriptions: '/Subscriptions — fonte das subscriptions',
      disputeContestation: '/DisputeContestation — gap: deveria linkar das disputas',
      adminIntMerchantProfile: '/AdminIntMerchantProfile — visão admin (perfil do merchant que vendeu para este cliente)',
    },
  },
};

export default CustomerDetailDoc;