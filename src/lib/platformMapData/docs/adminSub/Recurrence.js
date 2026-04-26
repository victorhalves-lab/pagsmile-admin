// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Recurrence (Motor de Recorrência)
// ============================================================================
// Arquivo dedicado, fidelidade absoluta ao código real de pages/Recurrence.jsx.
// Cada KPI, cada aba, cada linha da tabela, cada switch, cada cor, cada cálculo,
// cada item de dropdown, cada campo de dialog, documentado individualmente.
// ============================================================================

export const RecurrenceDoc = {
  pageId: 'Recurrence',
  pagePath: '/Recurrence',
  module: 'Assinaturas',
  parentPage: 'Subscriptions',

  // ==========================================================================
  // CAMADA EXPLAINER — Por que esta página existe e qual o valor de negócio
  // ==========================================================================
  explainer: {
    oneLiner:
      'Motor operacional que executa cada cobrança recorrente individual, gerencia retentativas inteligentes em caso de falha e dispara notificações automáticas — é o "coração que bate" das assinaturas.',

    distinctionFromSubscriptions: {
      subscriptions:
        '/Subscriptions é o CONTRATO entre cliente e merchant: define que João assinou o Plano Premium em 15/06/2025, paga R$ 299,90/mês, está ativo. Olha o relacionamento como um todo (lifetime, churn, MRR agregado).',
      recurrence:
        '/Recurrence é a EXECUÇÃO de cada cobrança individual: dia 15/02/2026, 08h00, tentar cobrar R$ 299,90 no cartão •••• 4532, se falhar agendar retentativa em 1 dia, se falhar de novo em 3 dias, etc. Olha o "motor" de processamento.',
      analogy:
        'Subscriptions é o RH (gestão do contrato de trabalho); Recurrence é o sistema de Folha (que efetivamente paga todo dia 5).',
    },

    coreCapabilities: [
      'Visão consolidada de todas as cobranças recorrentes individuais (independente do plano de origem)',
      'Configuração granular do motor de retentativas (número de tentativas, intervalos, política)',
      'Métricas operacionais de execução: taxa de sucesso de cobrança, taxa de recuperação, MRR efetivo',
      'Controle ciclo-a-ciclo: pausar uma recorrência específica sem cancelar a assinatura inteira',
      'Histórico granular de cada tentativa de cobrança com motivo de falha técnico',
      'Configuração de notificações por evento (lembrete, sucesso, falha, expiração de cartão)',
      'Automações condicionais (ex: após 4 falhas → pausar; cartão expirado → enviar link de atualização)',
    ],

    whoUsesIt: [
      'Time de Operações Financeiras: monitora execução diária de cobranças, age sobre falhas críticas',
      'Time de Customer Success: identifica clientes em risco (failed_attempts > 0) antes do churn',
      'Time de Produto/Growth: ajusta política de retentativa para maximizar recuperação sem irritar clientes',
      'Suporte: investiga falhas específicas reportadas pelo cliente ("não foi cobrado este mês")',
    ],

    keyDifferenceFromSubscription: {
      pause:
        'Pausar em /Subscriptions pausa o CONTRATO inteiro (acesso suspenso). Pausar em /Recurrence pode pausar apenas a execução automática de uma cobrança específica (cliente continua tendo acesso, mas merchant gerencia manualmente o pagamento).',
      cancel:
        'Cancelar em /Subscriptions encerra o relacionamento. Cancelar em /Recurrence remove a entrada do motor de cobrança (a assinatura pode continuar, mas precisa de configuração nova de pagamento).',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA — Estrutura, componentes e comportamento granular
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Recurrence.jsx',
    totalLines: 1030,

    imports: {
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient (importados, não usados ativamente — preparado para integração com base44.entities)'],
      lucideIcons: [
        'Repeat — ícone-âncora da página e da aba "Recorrências"',
        'CreditCard — método cartão',
        'QrCode — método Pix Recorrente (cor emerald-500)',
        'DollarSign — KPI MRR e aba "Cobranças"',
        'RefreshCw — motor de retentativas, aba "Retentativas", taxa de recuperação',
        'CheckCircle2 — taxa de sucesso',
        'AlertTriangle — alerta de pendências (cor amber)',
        'Pause / Play — ações de pausar/retomar no dropdown',
        'XCircle — cancelar (vermelho destrutivo)',
        'Edit3 — editar recorrência',
        'Eye — ver detalhes',
        'Settings — botão "Configurar Retentativas"',
        'Mail — notificações por e-mail',
        'Bell — aba notificações',
        'Zap — automações (cor amber-500)',
        'Target / TrendingUp / TrendingDown / Calendar / Clock — auxiliares',
        'BarChart3 — aba Dashboard',
        'ArrowRight — separador visual nas automações',
      ],
      uiComponents: ['Button', 'Badge', 'Card+CardHeader+CardContent+CardTitle+CardDescription', 'Tabs+TabsList+TabsTrigger+TabsContent', 'Input', 'Label', 'Progress', 'Select+SelectTrigger+SelectContent+SelectItem+SelectValue', 'DropdownMenu+DropdownMenuTrigger+DropdownMenuContent+DropdownMenuItem+DropdownMenuSeparator', 'Dialog+DialogContent+DialogHeader+DialogTitle+DialogDescription+DialogFooter', 'Table+TableHeader+TableBody+TableRow+TableHead+TableCell', 'Switch'],
      utilities: ['cn (classnames)', 'format/addDays/differenceInDays do date-fns', 'ptBR locale'],
      charts: ['AreaChart+Area+XAxis+YAxis+CartesianGrid+Tooltip+ResponsiveContainer (recharts)', 'BarChart+Bar', 'PieChart+Pie+Cell'],
      sharedComponents: ['PageHeader (header consistente da plataforma)', 'KPICard (card métrica padrão com sparkline)'],
    },

    // ------------------------------------------------------------------------
    // CONSTANTES DE CONFIGURAÇÃO (definidas fora do componente)
    // ------------------------------------------------------------------------
    configurationConstants: {
      statusConfig: {
        purpose: 'Mapeia cada status de recorrência para label em português + className do Badge.',
        scope: 'Definido em escopo de módulo (não estado React) — é estático e reutilizável.',
        entries: {
          active: { label: 'Ativa', className: 'bg-green-100 text-green-700', meaning: 'Recorrência saudável, próxima cobrança agendada normalmente.' },
          paused: { label: 'Pausada', className: 'bg-gray-100 text-gray-600', meaning: 'Cobrança suspensa intencionalmente; merchant decide quando retomar.' },
          pending_retry: { label: 'Aguardando Retentativa', className: 'bg-amber-100 text-amber-700', meaning: 'Última cobrança falhou, motor de retentativas vai tentar novamente conforme política.' },
          failed: { label: 'Falhou', className: 'bg-red-100 text-red-700', meaning: 'Esgotou todas as retentativas configuradas, requer ação manual.' },
          cancelled: { label: 'Cancelada', className: 'bg-slate-100 text-slate-600', meaning: 'Encerrada permanentemente; não há próxima cobrança (campo "Próxima Cobrança" mostra "-").' },
          completed: { label: 'Concluída', className: 'bg-blue-100 text-blue-700', meaning: 'Recorrência atingiu o número total de ciclos definidos com sucesso.' },
        },
      },
      frequencyLabels: {
        purpose: 'Tradução dos enums de frequência para português visível.',
        entries: {
          daily: 'Diário',
          weekly: 'Semanal',
          biweekly: 'Quinzenal',
          monthly: 'Mensal',
          bimonthly: 'Bimestral',
          quarterly: 'Trimestral',
          custom: 'Personalizado',
        },
        notes: '"daily", "bimonthly" e "custom" não aparecem nos filtros de UI — só "weekly", "biweekly", "monthly", "quarterly" são selecionáveis no dialog de criação. Mas o mapa cobre eventuais dados legados.',
      },
      paymentMethodLabels: {
        credit_card: 'Cartão de Crédito',
        pix_recorrente: 'Pix Recorrente',
        boleto: 'Boleto',
      },
    },

    // ------------------------------------------------------------------------
    // ESTADO LOCAL (useState)
    // ------------------------------------------------------------------------
    componentState: {
      activeTab: { initial: "'dashboard'", purpose: 'Controla qual das 5 abas está visível. Aceita: dashboard | recurrences | charges | retry | notifications.' },
      searchTerm: { initial: "''", purpose: 'Termo de busca aplicado na aba "Recorrências". Busca em customer_name, customer_email e id (case-insensitive).' },
      statusFilter: { initial: "'all'", purpose: 'Filtro de status na aba "Recorrências". "all" desativa o filtro.' },
      paymentMethodFilter: { initial: "'all'", purpose: 'Filtro por método de pagamento na aba "Recorrências".' },
      showNewRecurrenceDialog: { initial: 'false', purpose: 'Controla visibilidade do dialog "Nova Recorrência" disparado pelo botão verde no header.' },
      showRetryConfigDialog: { initial: 'false', purpose: 'Estado declarado mas atualmente apenas o botão "Configurar Retentativas" o seta — o dialog em si não está renderizado no JSX (preparado para implementação futura). Atalho real: ir para a aba "Retentativas" que já tem a UI completa.' },
    },

    // ------------------------------------------------------------------------
    // FUNÇÕES UTILITÁRIAS LOCAIS
    // ------------------------------------------------------------------------
    localFunctions: {
      formatCurrency: {
        signature: '(value) => string',
        implementation: "Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)",
        nuance: 'O `|| 0` protege contra valores undefined/null (renderiza R$ 0,00 em vez de NaN).',
        usedIn: ['KPI MRR', 'coluna Valor da tabela', 'coluna Total Cobrado', 'tooltip do gráfico de receita', 'cards de Recuperadas/Não-recuperadas', 'aba Cobranças'],
      },
    },

    // ------------------------------------------------------------------------
    // DADOS MOCK
    // ------------------------------------------------------------------------
    mockData: {
      recurrences: {
        count: 5,
        purpose: 'Demonstra os principais cenários: ativa-saudável, ativa-Pix, em retentativa, semanal-com-falha-recuperada, trimestral-boleto.',
        items: [
          { id: 'REC-001', customer: 'João Silva', amount: 299.90, frequency: 'monthly', method: 'credit_card (Visa •••• 4532)', status: 'active', failed_attempts: 0, charges_count: 7, total_charged: 'R$ 2.099,30', notes: 'Caso típico saudável: 7 ciclos pagos sem falhas.' },
          { id: 'REC-002', customer: 'Maria Santos', amount: 89.90, frequency: 'monthly', method: 'pix_recorrente', status: 'active', failed_attempts: 0, charges_count: 5, total_charged: 'R$ 449,50', notes: 'Demonstra ticket baixo com Pix Recorrente.' },
          { id: 'REC-003', customer: 'Pedro Costa', amount: 1500.00, frequency: 'monthly', method: 'credit_card (Mastercard •••• 8821)', status: 'pending_retry', failed_attempts: 2, charges_count: 10, total_charged: 'R$ 15.000,00', last_failure_reason: 'Cartão recusado - Saldo insuficiente', notes: 'Caso B2B em risco: 2 falhas consecutivas, motor já agendou nova tentativa.' },
          { id: 'REC-004', customer: 'Ana Oliveira', amount: 199.00, frequency: 'weekly', method: 'credit_card (Elo •••• 1234)', status: 'active', failed_attempts: 1, charges_count: 12, total_charged: 'R$ 2.388,00', notes: 'Status "active" mas com 1 falha histórica recuperada (badge laranja "1 falha(s)" aparece junto do status).' },
          { id: 'REC-005', customer: 'Carlos Mendes', amount: 4999.00, frequency: 'quarterly', method: 'boleto', status: 'active', failed_attempts: 0, charges_count: 4, total_charged: 'R$ 19.996,00', notes: 'Enterprise trimestral: ticket alto, baixa frequência, baixo risco.' },
        ],
      },
      revenueChartData: 'Array de 5 meses (Set→Jan): R$45k → R$52k → R$58k → R$61k → R$68k. Crescimento monotônico de ~51% em 5 meses.',
      paymentMethodDistribution: '[Cartão 65%, Pix 25%, Boleto 10%] — cores: #3B82F6 (azul), #00D26A (verde PagSmile), #F59E0B (amber).',
      frequencyDistribution: '[Mensal 156, Semanal 42, Quinzenal 28, Trimestral 15] — total 241 recorrências (não bate com os 5 do mock, é exemplificativo do gráfico).',
    },

    // ------------------------------------------------------------------------
    // CÁLCULOS DERIVADOS (executados a cada render)
    // ------------------------------------------------------------------------
    derivedCalculations: {
      activeRecurrences: {
        formula: "recurrences.filter(r => r.status === 'active')",
        result: '4 das 5 (todos exceto REC-003 que está pending_retry)',
      },
      mrr: {
        formula: 'Soma de valor mensalizado de cada ativa',
        normalization: {
          weekly: '× 4 (aproxima 4 semanas/mês)',
          biweekly: '× 2',
          monthly: '× 1',
          quarterly: '÷ 3',
        },
        criticalNuance: 'Ignora "biweekly /= 2" e "daily" (não tratado). Para `weekly: 199 * 4 = 796`. MRR final do mock ≈ 299.90 + 89.90 + (199*4) + (4999/3) ≈ R$ 2.852,13.',
        excludesFrom: 'Não inclui REC-003 (pending_retry) — MRR aqui é apenas de recorrências ATIVAS, não receita prevista.',
      },
      pendingRetry: {
        formula: "recurrences.filter(r => r.status === 'pending_retry')",
        result: '1 (REC-003)',
        usedFor: 'Renderização condicional do alerta amber no Dashboard.',
      },
      totalCustomers: {
        formula: 'new Set(recurrences.map(r => r.customer_email)).size',
        nuance: 'Usa Set para deduplicar — mesmo cliente com múltiplas recorrências conta apenas 1 vez.',
        result: '5 emails únicos no mock',
      },
      avgTicket: {
        formula: 'sum(amount) / length, com guard contra divisão por zero',
        result: '(299.90 + 89.90 + 1500 + 199 + 4999) / 5 = R$ 1.417,56',
        notUsedInUI: 'Calculado mas não exibido em nenhum KPI atualmente — preparado para evolução.',
      },
      recoveryRate: { value: 78, hardcoded: true, displayedIn: 'KPI "Taxa de Recuperação" + barra de progresso na aba Retentativas (78.3% lá).' },
      chargeSuccessRate: { value: 94.5, hardcoded: true, displayedIn: 'KPI "Taxa de Sucesso".' },
    },

    // ------------------------------------------------------------------------
    // FILTRAGEM (aba Recorrências)
    // ------------------------------------------------------------------------
    filteringLogic: {
      filteredRecurrences: {
        composition: 'AND de 3 critérios independentes',
        searchMatch: '!searchTerm OR customer_name||customer_email||id contém searchTerm (toLowerCase em ambos)',
        statusMatch: "statusFilter === 'all' OR r.status === statusFilter",
        paymentMatch: "paymentMethodFilter === 'all' OR r.payment_method === paymentMethodFilter",
        emptyState: 'NÃO IMPLEMENTADO — se filteredRecurrences.length === 0 a tabela renderiza apenas o cabeçalho sem mensagem (gap de UX a evoluir).',
      },
    },

    // ------------------------------------------------------------------------
    // ESTRUTURA HIERÁRQUICA: <PageHeader> + <Tabs>
    // ------------------------------------------------------------------------
    layout: {
      rootContainer: '<div className="space-y-6">',

      pageHeader: {
        component: 'PageHeader (componente compartilhado)',
        title: '"Motor de Recorrência"',
        subtitle: '"Gerencie cobranças recorrentes de forma inteligente"',
        breadcrumbs: [
          { label: 'Assinaturas', page: 'Subscriptions' },
          { label: 'Recorrência', page: 'Recurrence' },
        ],
        actions: {
          buttonConfigureRetries: {
            label: 'Configurar Retentativas',
            icon: 'Settings (esquerda, 16px)',
            variant: 'outline (borda neutra)',
            onClick: 'setShowRetryConfigDialog(true)',
            note: 'Como o dialog em si não existe no JSX, o resultado prático é nenhum efeito visível. Recomendação: redirecionar para tab "retry".',
          },
          buttonNewRecurrence: {
            label: 'Nova Recorrência',
            icon: 'Plus',
            className: 'bg-[#00D26A] hover:bg-[#00A854] (verde-marca PagSmile)',
            onClick: 'setShowNewRecurrenceDialog(true) → abre Dialog (documentado adiante)',
          },
        },
      },

      tabs: {
        rootProps: 'value={activeTab} onValueChange={setActiveTab} className="space-y-6"',
        listStyle: 'TabsList: bg-white border shadow-sm h-12',
        triggerActiveStyle: 'data-[state=active]:bg-[#00D26A] data-[state=active]:text-white gap-2',
        triggers: [
          { value: 'dashboard', icon: 'BarChart3', label: 'Dashboard' },
          { value: 'recurrences', icon: 'Repeat', label: 'Recorrências' },
          { value: 'charges', icon: 'DollarSign', label: 'Cobranças' },
          { value: 'retry', icon: 'RefreshCw', label: 'Retentativas' },
          { value: 'notifications', icon: 'Bell', label: 'Notificações' },
        ],
      },
    },

    // ------------------------------------------------------------------------
    // ABA 1 — DASHBOARD (granular)
    // ------------------------------------------------------------------------
    tabDashboard: {
      gridKpis: {
        wrapper: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        cards: [
          {
            title: 'MRR (Receita Mensal)',
            valueSource: 'mrr (calculado em runtime)',
            format: 'currency',
            change: '+12.5% (hardcoded)',
            icon: 'DollarSign',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            meaning: 'Monthly Recurring Revenue — soma normalizada de todas as recorrências ATIVAS em base mensal. Métrica-âncora SaaS.',
          },
          {
            title: 'Recorrências Ativas',
            valueSource: 'activeRecurrences.length',
            format: 'number',
            change: '+8 (hardcoded — provavelmente +8 unidades, não %)',
            icon: 'Repeat',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            meaning: 'Contagem absoluta de recorrências em estado active.',
          },
          {
            title: 'Taxa de Sucesso',
            valueSource: 'chargeSuccessRate (94.5)',
            format: 'percentage',
            change: '+2.3%',
            icon: 'CheckCircle2',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            meaning: '% de cobranças aprovadas na PRIMEIRA tentativa, sem precisar do motor de retentativa. Mede saúde do book de pagantes.',
          },
          {
            title: 'Taxa de Recuperação',
            valueSource: 'recoveryRate (78)',
            format: 'percentage',
            change: '+5.1%',
            icon: 'RefreshCw',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            meaning: '% de cobranças que falharam na 1ª tentativa MAS foram recuperadas em alguma retentativa. Mede eficácia do motor de dunning. 78% é considerado bom.',
          },
        ],
      },

      pendingRetryAlert: {
        renderCondition: 'pendingRetry.length > 0',
        wrapper: 'Card border-amber-200 bg-amber-50',
        layout: 'flex items-center gap-4 + ícone 48x48 amber-100 com AlertTriangle 24px amber-600',
        title: '`{pendingRetry.length} recorrência(s) aguardando retentativa`',
        body: 'O motor de retentativas está configurado para tentar novamente automaticamente.',
        cta: 'Botão "Ver Detalhes" (variant outline, border-amber-300, text-amber-700) — sem onClick implementado (deveria filtrar a tabela para status=pending_retry).',
      },

      chartsRow: {
        layout: 'grid lg:grid-cols-3 gap-6',
        revenueChart: {
          span: 'lg:col-span-2 (ocupa 2/3)',
          title: 'Evolução da Receita Recorrente',
          description: 'Últimos 5 meses',
          height: 300,
          chart: 'AreaChart com gradient #00D26A (3% opacity → 0%)',
          axisX: 'month (Set→Jan)',
          axisY: 'tickFormatter "R$ {valor/1000}k"',
          tooltipFormat: 'formatCurrency completo',
          stroke: '#00D26A strokeWidth 2',
        },
        paymentMethodPie: {
          span: '1/3',
          title: 'Métodos de Pagamento',
          description: 'Distribuição por método',
          chart: 'PieChart donut (innerRadius 60, outerRadius 80)',
          labels: '`${name} ${value}%` no perímetro',
          legend: 'Custom flex justify-center gap-4 com bolinhas coloridas + nome',
        },
      },

      frequencyChart: {
        title: 'Distribuição por Frequência',
        description: 'Quantidade de recorrências por periodicidade',
        height: 250,
        chart: 'BarChart com Bar fill #00D26A radius [4,4,0,0] (cantos superiores arredondados)',
        purpose: 'Permite ao merchant entender concentração de seu book — ex: se 95% é mensal, qualquer otimização em ciclo mensal tem alto leverage.',
      },
    },

    // ------------------------------------------------------------------------
    // ABA 2 — RECORRÊNCIAS (granular)
    // ------------------------------------------------------------------------
    tabRecurrences: {
      filtersBar: {
        wrapper: 'Card → CardContent p-4 → flex flex-wrap items-center gap-4',
        searchInput: {
          icon: 'Search 16px slate-400 (absoluto, left-3, vertical center)',
          placeholder: 'Buscar por cliente, e-mail ou ID...',
          flexBehavior: 'flex-1 min-w-[200px] (cresce, mas não menor que 200px)',
          binding: 'value/onChange → searchTerm',
        },
        statusSelect: {
          width: 'w-40',
          placeholder: 'Status',
          options: ['Todos os Status (all)', 'Ativas (active)', 'Pausadas (paused)', 'Retentativa (pending_retry)', 'Falharam (failed)', 'Canceladas (cancelled)'],
          missing: 'Não inclui "completed" — gap menor.',
        },
        paymentMethodSelect: {
          width: 'w-44',
          options: ['Todos os Métodos (all)', 'Cartão de Crédito', 'Pix Recorrente', 'Boleto'],
        },
      },

      table: {
        wrapper: 'Card → CardContent p-0 (zero padding, tabela ocupa toda largura)',
        headerRowStyle: 'bg-slate-50',
        columns: [
          {
            label: 'Recorrência',
            content: 'description (em font-medium) + id (text-xs slate-500)',
            example: '"Plano Premium Mensal" / "REC-001"',
          },
          {
            label: 'Cliente',
            content: 'customer_name + customer_email (text-xs)',
          },
          {
            label: 'Valor',
            content: 'formatCurrency(amount) (font-semibold) + frequencyLabels[frequency] (text-xs)',
            example: '"R$ 299,90" / "Mensal"',
          },
          {
            label: 'Método',
            renderLogic: {
              credit_card: '<CreditCard slate-400/> + "•••• {card_last_four}"',
              pix_recorrente: '<QrCode emerald-500/> + "Pix"',
              boleto: 'apenas texto "Boleto"',
            },
            criticalDetail: 'card_brand existe nos dados mas NÃO é exibido visualmente — apenas last_four. Oportunidade: mostrar logo da bandeira.',
          },
          {
            label: 'Próxima Cobrança',
            renderLogic: {
              ifNotCancelled: 'format(next_charge_date, dd/MM/yyyy) + "em N dias" via differenceInDays',
              ifCancelled: 'Texto "-" cinza',
            },
            edgeCase: 'differenceInDays pode retornar NEGATIVO se data for no passado — neste caso renderiza "em -X dias", o que é tecnicamente correto mas confuso de UX.',
          },
          {
            label: 'Status',
            content: 'Badge principal de statusConfig[r.status]',
            extraBadge: 'Se failed_attempts > 0 → Badge variant outline amber: `{failed_attempts} falha(s)` ao lado do status principal',
            insight: 'Permite ver, p.ex., recorrência ATIVA mas com histórico de falhas (REC-004 = active + 1 falha).',
          },
          {
            label: 'Total Cobrado',
            content: 'formatCurrency(total_charged) emerald-600 + charges_count text-xs',
            example: '"R$ 2.099,30" / "7 cobranças"',
          },
          {
            label: '[ações]',
            header: 'Vazio (apenas TableHead/>)',
            content: 'DropdownMenu disparado por Button ghost icon h-8 w-8 com MoreHorizontal',
          },
        ],

        actionsDropdown: {
          alignment: 'end (alinhado à direita do trigger)',
          alwaysVisibleItems: [
            { icon: 'Eye', label: 'Ver detalhes', onClick: 'não implementado (alvo: drawer ou /RecurrenceDetail)' },
            { icon: 'Edit3', label: 'Editar', onClick: 'não implementado' },
          ],
          separator: 'DropdownMenuSeparator',
          conditionalItems: {
            ifActive: { icon: 'Pause', label: 'Pausar', condition: "r.status === 'active'" },
            ifPaused: { icon: 'Play', label: 'Retomar', condition: "r.status === 'paused'" },
            ifPendingRetry: { icon: 'RefreshCw', label: 'Forçar retentativa', condition: "r.status === 'pending_retry'" },
          },
          finalSeparator: 'DropdownMenuSeparator',
          destructiveItem: { icon: 'XCircle', label: 'Cancelar', className: 'text-red-600' },
          nuance: 'Apenas UM dos 3 itens condicionais é renderizado por vez (dependendo do status atual). Status "failed", "cancelled" e "completed" não mostram ação intermediária — só "Ver/Editar/Cancelar".',
        },
      },
    },

    // ------------------------------------------------------------------------
    // ABA 3 — COBRANÇAS (Histórico)
    // ------------------------------------------------------------------------
    tabCharges: {
      title: 'Histórico de Cobranças',
      description: 'Todas as cobranças processadas pelo motor de recorrência',
      data: 'HARDCODED no JSX (não é loop sobre dados — são 3 linhas estáticas para demo)',
      columns: ['Data', 'Recorrência', 'Cliente', 'Valor', 'Método', 'Status', 'Tentativas'],
      rows: [
        { date: '27/01/2026 08:00', recurrence: 'Plano Premium Mensal', customer: 'João Silva', amount: 'R$ 299,90', method: 'CreditCard •••• 4532', status: 'Aprovada (green-100)', attempts: '1' },
        { date: '26/01/2026 10:30', recurrence: 'Licença Empresarial', customer: 'Pedro Costa', amount: 'R$ 1.500,00', method: 'CreditCard •••• 8821', status: 'Aguardando (amber-100)', attempts: '2/4' },
        { date: '25/01/2026 09:15', recurrence: 'Assinatura Básica', customer: 'Maria Santos', amount: 'R$ 89,90', method: 'QrCode Pix', status: 'Aprovada (green-100)', attempts: '1' },
      ],
      meaning: 'Diferença vs. /Transactions: aqui só aparecem cobranças DO MOTOR (capture_method=recurring); em /Transactions aparecem TODAS as transações da conta (e-commerce, POS, recurring).',
      gap: 'Sem filtros, sem paginação, sem busca — é uma view "primeira impressão", não operacional para volume real.',
    },

    // ------------------------------------------------------------------------
    // ABA 4 — RETENTATIVAS (granular crítica)
    // ------------------------------------------------------------------------
    tabRetry: {
      layout: 'grid lg:grid-cols-2 gap-6 (2 cards lado a lado em desktop)',

      configCard: {
        title: 'Motor de Retentativas (com ícone RefreshCw verde-marca)',
        description: 'Configure as regras de retentativa para cobranças falhas',

        toggleAutomaticRetries: {
          label: 'Retentativas Automáticas',
          subLabel: 'Tentar novamente cobranças que falharem',
          control: 'Switch defaultChecked (ligado por padrão)',
          impact: 'Se desligar, todas as recorrências passam direto para "failed" no primeiro fracasso.',
        },

        maxRetriesSelect: {
          label: 'Número máximo de tentativas',
          defaultValue: '4',
          options: ['2 tentativas', '3 tentativas', '4 tentativas', '5 tentativas'],
          tradeoff: 'Mais tentativas = maior recuperação MAS maior custo de processamento (cada tentativa cartão tem MDR/iof) e maior fricção/irritação do cliente.',
        },

        retryIntervalsGrid: {
          label: 'Intervalo entre tentativas',
          layout: 'grid grid-cols-4 gap-2',
          cells: [
            { ordinal: '1ª', interval: '1 dia', logic: 'Recuperação rápida — tipicamente recupera saldo insuficiente que entrou na conta' },
            { ordinal: '2ª', interval: '3 dias', logic: 'Período médio — fim de semana ou novo ciclo de salário' },
            { ordinal: '3ª', interval: '7 dias', logic: 'Espera próximo ciclo de pagamento' },
            { ordinal: '4ª', interval: '15 dias', logic: 'Última tentativa — confiança baixa, mas evita churn definitivo' },
          ],
          isInteractive: false,
          implementationNote: 'Atualmente são DIVS estáticas. Em produção devem virar inputs editáveis com validação (intervalos crescentes, total ≤ 30 dias).',
        },

        saveButton: 'w-full bg-[#00D26A] — "Salvar Configurações" (sem onClick implementado)',
      },

      statsCard: {
        title: 'Performance de Recuperação',
        description: 'Últimos 30 dias',

        recoveryGrid: {
          layout: 'grid grid-cols-2 gap-4',
          recovered: { wrapper: 'p-4 bg-emerald-50 rounded-xl', label: 'Recuperadas (emerald-600)', value: '47 (text-3xl bold emerald-700)', subValue: 'R$ 12.350,00 (emerald-600 text-xs)' },
          notRecovered: { wrapper: 'p-4 bg-red-50 rounded-xl', label: 'Não recuperadas (red-600)', value: '13', subValue: 'R$ 3.420,00' },
          ratio: '47 / (47+13) = 78.3% — bate exatamente com o KPI Taxa de Recuperação',
        },

        recoveryRateProgress: {
          label: 'Taxa de Recuperação (slate-600) com valor "78.3%" verde-marca à direita',
          progress: '<Progress value={78.3} className="h-3"/> (barra alta com 12px)',
        },

        recoveryByAttemptBreakdown: {
          title: 'Recuperação por tentativa:',
          rows: [
            { attempt: '1ª tentativa', percentage: 45, insight: 'Quase metade das recuperações vêm da PRIMEIRA retentativa — significa que muitos casos são saldo temporário.' },
            { attempt: '2ª tentativa', percentage: 25 },
            { attempt: '3ª tentativa', percentage: 6, insight: 'Drop drástico — 3ª tentativa tem ROI baixo.' },
            { attempt: '4ª tentativa', percentage: 2, insight: 'Praticamente nula — questão estratégica: vale o custo? Sim apenas se ticket alto.' },
          ],
          totalCheck: '45+25+6+2=78 ≈ 78.3% — coerente',
          rowLayout: 'flex justify-between: label esquerda, [Progress w-24 h-2] + label "%" direita',
        },
      },
    },

    // ------------------------------------------------------------------------
    // ABA 5 — NOTIFICAÇÕES
    // ------------------------------------------------------------------------
    tabNotifications: {
      layout: 'grid lg:grid-cols-2 gap-6',

      emailNotificationsCard: {
        title: 'Notificações por E-mail (ícone Mail blue-600)',
        description: 'Configure os e-mails enviados aos clientes',
        items: [
          { name: 'Lembrete de cobrança', subLabel: '3 dias antes da cobrança', defaultChecked: true, purpose: 'Reduz fricção: cliente sabe que vai sair débito.' },
          { name: 'Cobrança realizada', subLabel: 'Após cobrança bem-sucedida', defaultChecked: true, purpose: 'Confirmação positiva — recibo automático.' },
          { name: 'Cobrança falhou', subLabel: 'Quando a cobrança falhar', defaultChecked: true, purpose: 'CRÍTICO: cliente toma ação antes do churn (atualizar cartão, depositar saldo).' },
          { name: 'Cartão expirando', subLabel: '30 dias antes do vencimento', defaultChecked: true, purpose: 'Prevenção pró-ativa de involuntary churn.' },
        ],
        itemLayout: 'flex justify-between p-3 bg-slate-50 rounded-lg + Switch defaultChecked à direita',
      },

      automationsCard: {
        title: 'Automações (ícone Zap amber-500)',
        description: 'Ações automáticas baseadas em eventos',
        items: [
          {
            trigger: 'Após 4 falhas consecutivas',
            action: 'Pausar recorrência e notificar equipe',
            statusBadge: 'Ativo (variant outline)',
            arrowIcon: 'ArrowRight (slate-600)',
          },
          {
            trigger: 'Cartão expirado',
            action: 'Enviar link para atualização do cartão',
            statusBadge: 'Ativo',
          },
          {
            trigger: 'Cobrança recuperada',
            action: 'Reativar acesso do cliente',
            statusBadge: 'Ativo',
            insight: 'Crítico para SaaS com gating de feature: bloqueio temporário durante falha + reativação automática quando recupera.',
          },
        ],
        newAutomationButton: 'variant outline w-full + Plus icon — "Nova Automação" (sem onClick)',
        gap: 'Itens não são editáveis via UI, são apenas "leitura" das automações pré-configuradas.',
      },
    },

    // ------------------------------------------------------------------------
    // DIALOG: Nova Recorrência
    // ------------------------------------------------------------------------
    dialogNewRecurrence: {
      controlState: 'showNewRecurrenceDialog (boolean)',
      maxWidth: 'max-w-lg (~512px)',
      header: {
        title: 'Nova Recorrência',
        description: 'Configure uma nova cobrança recorrente',
      },
      fields: [
        {
          label: 'Cliente',
          control: 'Select',
          placeholder: 'Selecione o cliente',
          options: ['João Silva', 'Maria Santos', 'Pedro Costa'],
          gap: 'Hardcoded — em produção deve buscar de base44.entities.Customer.list()',
        },
        {
          label: 'Valor',
          control: 'Input type=number',
          placeholder: '0,00',
          colSpan: '1 (em grid de 2 cols)',
          gap: 'Sem máscara monetária — usuário digita "29990" mas precisa entender que é em reais.',
        },
        {
          label: 'Frequência',
          control: 'Select',
          defaultValue: 'monthly',
          options: ['Semanal (weekly)', 'Quinzenal (biweekly)', 'Mensal (monthly)', 'Trimestral (quarterly)'],
          colSpan: '1',
          notes: 'Não inclui "biweekly" no mock list de filtro mas inclui aqui — leve inconsistência. Não inclui "annual"/"semiannual" disponíveis em SubscriptionPlan.',
        },
        {
          label: 'Método de Pagamento',
          control: 'Select',
          defaultValue: 'credit_card',
          options: ['Cartão de Crédito', 'Pix Recorrente', 'Boleto'],
        },
        {
          label: 'Descrição',
          control: 'Input',
          placeholder: 'Ex: Assinatura Premium Mensal',
          purpose: 'Texto livre que aparecerá na coluna "Recorrência" da tabela e em soft descriptors.',
        },
        {
          label: 'Data da primeira cobrança',
          control: 'Input type=date',
          purpose: 'Define start_date — todas as cobranças subsequentes serão calculadas a partir desta data + frequency.',
        },
      ],
      footer: {
        cancelButton: 'variant outline → setShowNewRecurrenceDialog(false)',
        submitButton: 'bg-[#00D26A] hover:bg-[#00A854] — "Criar Recorrência" (sem onClick implementado)',
      },
      missingValidation: 'Sem validação react-hook-form/zod — produção exigiria: amount>0, customer obrigatório, data ≥ hoje, etc.',
    },

    // ------------------------------------------------------------------------
    // INTEGRAÇÕES & GAPS DE BACKEND
    // ------------------------------------------------------------------------
    integrationStatus: {
      currentlyMocked: [
        'Lista de recorrências (array hardcoded)',
        'Histórico de cobranças (3 linhas hardcoded)',
        'Distribuição por método/frequência (chart data hardcoded)',
        'KPIs (recoveryRate=78, chargeSuccessRate=94.5)',
      ],
      shouldUse: [
        'base44.entities.Subscription para origem das recorrências (cada Subscription é um "contrato"; o motor de recorrência aqui poderia usar campos como next_billing_date, status, payment_method)',
        'base44.entities.Transaction.filter({capture_method: "recurring"}) para a aba Cobranças',
        'base44.entities.DunningConfig para a aba Retentativas (já existe a entidade com retry_count, retry_intervals, etc.)',
      ],
      observation: 'Os imports de useQuery/useMutation/useQueryClient e base44 estão presentes mas não utilizados — sinaliza intenção de migrar para integração real.',
    },

    // ------------------------------------------------------------------------
    // RELACIONAMENTOS COM OUTRAS PÁGINAS
    // ------------------------------------------------------------------------
    pageRelationships: {
      parent: '/Subscriptions (breadcrumb sobe para lá)',
      siblings: ['/SubscriptionPlans (catálogo)', '/SubscriptionAnalytics (métricas executivas)', '/DunningSettings (configuração separada e mais profunda do dunning)'],
      conceptualOverlap: {
        withDunningSettings: 'A aba "Retentativas" aqui é uma versão simplificada do que /DunningSettings oferece de forma completa (com horários, dias da semana, IA otimizada, Pix discount, SMS, WhatsApp). Esta aba é o "quick edit" — para granularidade total, ir para /DunningSettings.',
        withTransactions: 'A aba "Cobranças" é uma view filtrada de /Transactions onde capture_method = "recurring".',
      },
    },

    // ------------------------------------------------------------------------
    // GAPS & OPORTUNIDADES IDENTIFICADAS
    // ------------------------------------------------------------------------
    knownGaps: [
      'Empty state ausente quando filteredRecurrences.length === 0',
      'Botão "Configurar Retentativas" do header tem state mas dialog não está renderizado — leva a inação',
      'Dropdown "Cancelar" não tem confirmation modal (ação destrutiva sem proteção)',
      'Aba Cobranças sem paginação/filtros/busca',
      'Intervalos de retentativa são DIVS estáticas, não inputs editáveis',
      'Notificações têm switches sem persistência (defaultChecked, não controlled)',
      'Sem integração real com base44.entities — é tudo mock',
      'differenceInDays pode renderizar valores negativos sem tratamento',
      'Sem export CSV/Excel da tabela de recorrências',
      'Sem audit trail das ações (quem pausou? quando? por que?)',
    ],
  },
};

export default RecurrenceDoc;