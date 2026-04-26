// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /PreChargebacks
// ============================================================================
// Arquivo dedicado, fidelidade absoluta ao código real de pages/PreChargebacks.jsx.
// Cada KPI, cada lógica de countdown, cada coluna da tabela, cada estado de
// dialog (4 tipos!), cada switch da config de auto-reembolso — documentado.
// ============================================================================

export const PreChargebacksDoc = {
  pageId: 'PreChargebacks',
  pagePath: '/PreChargebacks',
  module: 'Disputas',
  parentPage: 'DisputeDashboard',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Centro operacional de PRÉ-CHARGEBACKS — alertas Ethoca/Verifi enviados pelas bandeiras ANTES do chargeback formal, dando ao merchant uma janela curta (24-72h) para reembolsar proativamente, ignorar estrategicamente ou contatar o cliente — evitando que vire CB e impacte o ratio.',

    whatIsAPreChargeback: {
      definition:
        'Um pré-chargeback é uma NOTIFICAÇÃO ANTECIPADA enviada pelos serviços Ethoca (programa Visa) ou Verifi (programa Mastercard) quando o cliente abre uma reclamação no banco emissor — mas ANTES do banco abrir o chargeback formal.',
      analogy:
        'É como o aviso prévio em uma demissão: o "rompimento" ainda não aconteceu juridicamente, mas você sabe que vai acontecer. Você tem alguns dias para "renegociar" (reembolsar) e evitar o processo formal.',
      whyItExists:
        'Bancos emissores e adquirentes preferem que o merchant resolva direto — chargebacks geram custo administrativo para todos. Ethoca/Verifi vendem essa "ponte" como serviço.',
    },

    threeStrategicActions: {
      refund: {
        what: 'Reembolso TOTAL preventivo',
        when: 'Valor baixo, cliente legítimo, fraude provável',
        outcome: 'Status vira "reimbursed" — alerta resolvido, NÃO conta como CB no ratio',
        cost: 'Perde 100% da transação',
      },
      partialRefund: {
        what: 'Reembolso PARCIAL',
        when: 'Cliente recebeu mercadoria mas reclama de valor (item diferente, quantidade errada)',
        outcome: 'Status "reimbursed" + valor armazenado em partial_refund_amount',
        cost: 'Perde apenas o valor parcial',
      },
      ignore: {
        what: 'Não fazer nada / "aceitar" o alerta',
        when: 'Disputa parece fraudulenta DA PARTE DO CLIENTE (first-party fraud), valor alto, evidências fortes',
        outcome: 'Status "accepted" — vai virar CB formal, mas merchant vai contestar com confiança',
        cost: 'Possível CB com fee + impacto no ratio se perder',
      },
    },

    economicMath: {
      typicalCost: 'CB formal médio: $25 fee + valor da transação + impacto no ratio + 30 min de trabalho administrativo. Pré-CB: apenas o valor reembolsado.',
      breakeven: 'Para um ticket de $100: pré-CB = perda $100; CB com fee $25 + 50% chance de perder = perda esperada $75. Aqui a matemática vira para CONTESTAR. Para tickets baixos (<$50), reembolsar quase sempre vence.',
    },

    coreCapabilities: [
      '4 KPIs operacionais: alertas pendentes, urgentes (<24h), valor em risco, status do auto-reembolso',
      'Banner vermelho de alerta crítico quando há urgentes — reforço visual de prazo',
      'Filtros por status (pending/resolved) e origem (Ethoca/Verifi)',
      'Tabela de alertas com countdown de prazo dinâmico (verde/amber/vermelho/expirado)',
      'Dialog de detalhes com info completa + dica educativa em verde',
      'Dialog de ação universal — 4 modos (refund / partial / ignore / contact) com UI distinta cada',
      'Dialog de configuração de Auto-Reembolso — regras automáticas para alertas que atendem critérios',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/PreChargebacks.jsx',
    totalLines: 793,

    imports: {
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.Dispute (filter type IN [alert_ethoca, alert_verifi]) + base44.entities.AutoReimburseConfig',
      lucideIcons: [
        'AlertTriangle — KPI Alertas Pendentes (laranja) e ícones de urgência',
        'Clock — KPI Urgentes (<24h) e ícone de prazo',
        'DollarSign — KPI Valor em Risco e ícone do valor no detalhes',
        'Eye — botão "ver detalhes" na tabela',
        'Undo2 — ícone do reembolso (verde-emerald)',
        'Ban — ícone do "ignorar" (cinza-slate)',
        'Settings — botão "Auto-Reembolso" no header',
        'AlertCircle — ícone do banner urgente',
        'Zap — ícone do auto-reembolso (verde)',
        'User — ícone do cliente nos detalhes',
        'Hash — ícone da transação nos detalhes',
        'CheckCircle2 — ícone do empty state e success',
        'XCircle — não usado ativamente',
        'MessageSquare — ícone do contato com cliente (azul)',
        'Shield — ícone do header do dialog de detalhes',
        'Sparkles — ícone da dica educativa (verde)',
      ],
      uiComponents: ['Card+CardContent', 'Button', 'Badge', 'Input', 'Label', 'Switch', 'Select+items', 'Dialog stack completo', 'Textarea', 'Table stack', 'Skeleton'],
      utilities: ['cn', 'differenceInHours/differenceInDays/format do date-fns'],
      navigation: ['Link (react-router-dom)', 'createPageUrl'],
      sharedComponents: ['PageHeader', 'StatusBadge'],
    },

    // ------------------------------------------------------------------------
    // SUBCOMPONENTES INTERNOS (definidos no mesmo arquivo)
    // ------------------------------------------------------------------------
    internalSubcomponents: {
      DeadlineCountdown: {
        signature: '({ deadline }) => Badge | "-"',
        purpose: 'Renderiza badge dinâmica baseada em quanto tempo falta até o prazo',
        states: [
          { condition: '!deadline', render: '<span text-slate-400 text-sm>"-"</span>' },
          { condition: 'hoursLeft < 0', render: 'Badge slate-50 com Clock + "Expirado"' },
          { condition: 'hoursLeft < 24', render: 'Badge red-50 ANIMATE-PULSE com AlertTriangle + "{hoursLeft}h restantes" — pulsação chama atenção urgente' },
          { condition: 'daysLeft <= 3', render: 'Badge amber-50 com Clock + "{daysLeft} dias"' },
          { condition: 'else (>3 dias)', render: 'Badge emerald-50 com Clock + "{daysLeft} dias"' },
        ],
        criticalDetail: 'A pulsação do red é deliberada — força o olho do operador a focar nos casos críticos.',
      },

      KPICard: {
        signature: '({ title, value, subValue, icon: Icon, color }) => Card',
        colorPalettes: ['default (slate)', 'orange (gradient orange-50→white)', 'red', 'green (emerald)', 'amber'],
        layout: 'flex justify-between → coluna texto à esquerda + ícone 40x40 rounded-xl à direita',
        typography: 'title text-xs uppercase tracking-wide / value text-2xl bold / subValue text-sm',
      },

      EmptyState: {
        purpose: 'Tela "tudo certo!" quando não há pré-chargebacks',
        layout: 'centro com círculo emerald-100 80x80 + CheckCircle2 verde + h3 + parágrafo explicativo',
        message: '"Nenhum pré-chargeback pendente" + "Ótimo! Você não tem alertas Ethoca ou Verifi no momento."',
        emotionalDesign: 'Cores positivas (verde) — celebra o estado bom em vez de mostrar tabela vazia neutra',
      },

      TableSkeleton: {
        layout: '5 linhas placeholder com 6 skeletons cada (badge, texto, texto, texto, badge, button)',
        usage: 'Renderizado durante isLoading da query',
      },
    },

    // ------------------------------------------------------------------------
    // ESTADO LOCAL
    // ------------------------------------------------------------------------
    componentState: {
      selectedAlert: { initial: 'null', purpose: 'Alert atualmente sendo agido (passado para o dialog de ação)' },
      actionDialog: { initial: '{ open: false, type: null }', purpose: 'Controle do dialog de ações. type ∈ [refund, partial_refund, ignore, contact]' },
      partialAmount: { initial: "''", purpose: 'Valor digitado no input de reembolso parcial' },
      contactNotes: { initial: "''", purpose: 'Texto digitado no textarea de contato com cliente' },
      filters: { initial: "{ status: 'all', source: 'all' }", purpose: 'Filtros da tabela' },
      showAutoConfig: { initial: 'false', purpose: 'Controle do dialog de configuração de auto-reembolso' },
      detailsDialog: { initial: '{ open: false, alert: null }', purpose: 'Controle do dialog de detalhes (separado do actionDialog)' },
    },

    // ------------------------------------------------------------------------
    // QUERIES E MUTATIONS
    // ------------------------------------------------------------------------
    backendIntegration: {
      queryPreChargebacks: {
        queryKey: "['pre-chargebacks']",
        queryFn: "base44.entities.Dispute.filter({ type: { $in: ['alert_ethoca', 'alert_verifi'] } }, '-alert_deadline')",
        ordering: 'Por alert_deadline DESCENDENTE — gap: o usual seria ASCENDENTE (mais urgentes primeiro). Pode ser um bug.',
      },
      queryAutoConfig: {
        queryKey: "['auto-reimburse-config']",
        queryFn: 'base44.entities.AutoReimburseConfig.list()',
        unwrapping: 'autoConfig = autoConfigs?.[0] || {} — assume 1 config global',
      },
      updateMutation: {
        mutationFn: '({ id, data }) => base44.entities.Dispute.update(id, data)',
        onSuccess: 'invalidateQueries(["pre-chargebacks"]) + setActionDialog({open:false, type:null}) + setSelectedAlert(null)',
        purpose: 'Aplica resolução do alerta (refund/ignore/etc)',
      },
      saveAutoConfigMutation: {
        mutationFn: 'Update se existe id, Create se novo',
        onSuccess: 'invalidateQueries(["auto-reimburse-config"])',
        gap: 'NÃO fecha o dialog após save — usuário precisa fechar manualmente',
      },
    },

    // ------------------------------------------------------------------------
    // FILTRAGEM E CÁLCULOS
    // ------------------------------------------------------------------------
    filteringAndCalculations: {
      safeDisputes: 'disputes || [] (defensivo contra null)',
      filteredDisputes: {
        logic: [
          'guard !d → false',
          "filters.status === 'pending' → status IN [received, pending]",
          "filters.status === 'resolved' → status IN [reimbursed, won, lost]",
          'filters.source !== "all" → d.type === filters.source',
        ],
      },
      pendingAlerts: { filter: "['received', 'pending'].includes(d.status)", meaning: 'Alertas que ainda exigem ação' },
      totalPendingValue: { formula: 'sum(pendingAlerts.amount || 0)', meaning: 'R$ em risco se nenhum for reembolsado' },
      urgentAlerts: { filter: 'pendingAlerts onde differenceInHours(deadline, agora) < 24', meaning: 'Sub-conjunto crítico — janela de ação inferior a 24h' },
    },

    // ------------------------------------------------------------------------
    // FUNÇÃO handleAction (lógica de cada tipo de ação)
    // ------------------------------------------------------------------------
    handleActionLogic: {
      switch: {
        refund: {
          updates: '{ resolution_action: "refund", status: "reimbursed" }',
          meaning: 'Marca como reembolsado integralmente — não vira CB',
        },
        partial_refund: {
          updates: '{ resolution_action: "partial_refund", status: "reimbursed", partial_refund_amount: parseFloat(partialAmount) }',
          meaning: 'Reembolso parcial com valor extraído do input',
        },
        ignore: {
          updates: '{ resolution_action: "ignore", status: "accepted" }',
          meaning: 'Aceita o alerta mas NÃO reembolsa — vai virar CB',
        },
        contact_customer: {
          updates: '{ resolution_action: "contact_customer", contacted_customer: true, customer_contact_notes: contactNotes }',
          meaning: 'Marca contato feito mas NÃO resolve o alerta — apenas registra histórico',
          gap: 'Não muda o status — alerta continua "pendente". Pode confundir o operador.',
        },
      },
    },

    // ------------------------------------------------------------------------
    // LAYOUT
    // ------------------------------------------------------------------------
    layout: {
      pageHeader: {
        title: '"Pré-Chargebacks"',
        subtitle: '"Alertas Ethoca e Verifi - Resolva antes que virem chargebacks"',
        breadcrumbs: [{ label: 'Disputas', page: 'DisputeDashboard' }, { label: 'Pré-Chargebacks' }],
        action: {
          button: 'Settings + "Auto-Reembolso"',
          variant: 'outline size=sm',
          onClick: 'setShowAutoConfig(true)',
        },
      },

      kpiCards: {
        layout: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        cards: [
          { title: 'Alertas Pendentes', value: 'pendingAlerts.length', icon: 'AlertTriangle', color: 'orange' },
          { title: 'Urgentes (<24h)', value: 'urgentAlerts.length', icon: 'Clock', color: 'red' },
          { title: 'Valor em Risco', value: 'formatCurrency(totalPendingValue)', icon: 'DollarSign', color: 'amber' },
          { title: 'Auto-Reembolso', value: 'autoConfig?.is_enabled ? "Ativo" : "Inativo"', icon: 'Zap', color: 'green' },
        ],
      },

      urgentAlertBanner: {
        renderCondition: 'urgentAlerts.length > 0',
        wrapper: 'Card border-red-300 bg-gradient-to-r from-red-50 to-orange-50',
        layout: 'flex items-center gap-4: ícone 48x48 red-100 com AlertCircle red-600 + texto + botão',
        title: 'font-semibold red-900 — `Atenção: ${count} alerta(s) com prazo crítico!`',
        body: 'text-sm red-700 — "Esses alertas expiram em menos de 24 horas..."',
        cta: 'Button bg-red-600 — "Ver Urgentes" — gap: sem onClick implementado',
      },

      filters: {
        wrapper: 'Card → CardContent p-4 → flex flex-wrap gap-4',
        statusSelect: { width: 'w-44', options: ['Todos Status', 'Pendentes', 'Resolvidos'] },
        sourceSelect: { width: 'w-44', options: ['Todas Origens', 'Ethoca', 'Verifi'] },
      },

      tableColumns: [
        {
          name: 'Origem',
          render: 'Badge OUTLINE com cor por tipo',
          colors: { alert_ethoca: 'bg-orange-50 text-orange-700 border-orange-200', alert_verifi: 'bg-blue-50 text-blue-700 border-blue-200' },
          labels: { alert_ethoca: 'Ethoca', alert_verifi: 'Verifi' },
        },
        {
          name: 'Transação',
          render: 'Link azul-blue-600 com fonte mono — leva para /TransactionDetail?id={transaction_id}',
        },
        { name: 'Cliente', render: 'div com customer_name (font-medium) + customer_email (text-xs gray-500)' },
        { name: 'Valor', render: 'formatCurrency(amount) font-semibold' },
        { name: 'Motivo', render: 'reason_description || reason_code, truncate em 150px' },
        { name: 'Prazo', render: '<DeadlineCountdown deadline={alert_deadline} />' },
        { name: 'Status', render: '<StatusBadge status={status} />' },
        {
          name: 'Ações',
          alignment: 'text-right',
          buttons: [
            { icon: 'Eye slate-500', onClick: 'handleViewDetails(row)' },
            {
              icon: 'Undo2 emerald-600',
              onClick: 'handleOpenActionDialog(row, "refund")',
              renderIf: '["received", "pending"].includes(row.status)',
            },
            {
              icon: 'Ban slate-500',
              onClick: 'handleOpenActionDialog(row, "ignore")',
              renderIf: 'mesma condição acima',
            },
          ],
          gap: 'Não há botão para "partial_refund" ou "contact" aqui — só acessíveis via dialog de detalhes ou nunca acessível (gap)',
        },
      ],
    },

    // ------------------------------------------------------------------------
    // DIALOG 1 — DETAILS
    // ------------------------------------------------------------------------
    dialogDetails: {
      maxWidth: 'max-w-2xl',
      header: {
        layout: 'flex gap-3: ícone 40x40 rounded-xl + texto duplo',
        iconBgPerType: { alert_ethoca: 'bg-orange-100 + Shield orange-600', alert_verifi: 'bg-blue-100 + Shield blue-600' },
        title: '"Detalhes do Pré-Chargeback"',
        subtitle: 'Alerta Ethoca | Alerta Verifi (dinâmico)',
      },
      sections: [
        { name: 'Main Info', layout: 'grid 2 cols: card slate-50 com Hash+Transação | card slate-50 com DollarSign+Valor' },
        { name: 'Customer Info', layout: 'card border com User azul + nome + email' },
        { name: 'Reason', layout: 'card border com AlertTriangle amber + reason_description || reason_code' },
        { name: 'Deadline', layout: 'card border com Clock vermelho + DeadlineCountdown + (data formatada dd/MM/yyyy HH:mm)' },
        {
          name: 'Tip',
          layout: 'card emerald gradient com Sparkles emerald + texto educativo',
          message:
            '"Reembolsar preventivamente evita que esse alerta se torne um chargeback real, protegendo seu ratio e evitando taxas adicionais das bandeiras."',
          purpose: 'Educa o operador novato sobre o trade-off correto',
        },
      ],
      footer: {
        cancelButton: '"Fechar" (variant outline)',
        conditionalButtons: {
          renderIf: '["received", "pending"].includes(status)',
          ignoreButton: '"Ignorar" + Ban — variant outline border-slate-300',
          refundButton: '"Reembolsar" + Undo2 — bg-emerald-600',
          handler: 'Fecha details dialog primeiro, depois abre actionDialog do tipo escolhido',
        },
      },
    },

    // ------------------------------------------------------------------------
    // DIALOG 2 — ACTION (universal, 4 modos)
    // ------------------------------------------------------------------------
    dialogAction: {
      headerSwitch: {
        refund: 'Undo2 emerald + "Reembolsar Preventivamente"',
        partial_refund: 'DollarSign blue + "Reembolso Parcial"',
        ignore: 'Ban slate + "Ignorar Alerta"',
        contact: 'MessageSquare blue + "Contatar Cliente"',
      },
      contextHeader: {
        layout: 'flex gap-4 p-3 bg-slate-50 rounded-lg',
        info: 'Transação (mono) | divider | Valor (semibold)',
      },
      bodySwitch: {
        refund: {
          render: 'Card emerald com CheckCircle2 + texto explicativo confirmando "O valor X será estornado..."',
          purpose: 'CONFIRMAÇÃO clara antes de executar',
        },
        partial_refund: {
          render: 'Label + Input number max={selectedAlert.amount} + texto "Valor original: X"',
          binding: 'partialAmount state',
        },
        ignore: {
          render: 'Card AMBER com AlertTriangle + texto de WARNING sobre risco',
          warningMessage: '"Ao ignorar, o alerta pode se tornar um chargeback real se o cliente prosseguir. Isso impactará seu ratio de disputas."',
          purpose: 'FORÇA o operador a entender o risco antes de confirmar',
        },
        contact: {
          render: 'Label + Textarea rows=4',
          binding: 'contactNotes state',
        },
      },
      footer: {
        cancelButton: '"Cancelar" → fecha sem ação',
        confirmButton: {
          label: 'updateMutation.isPending ? "Processando..." : "Confirmar"',
          disabled: 'updateMutation.isPending',
          colorByType: { refund: 'bg-emerald-600 hover:bg-emerald-700', ignore: 'bg-slate-600 hover:bg-slate-700', other: 'default verde-marca' },
        },
      },
    },

    // ------------------------------------------------------------------------
    // DIALOG 3 — AUTO-REIMBURSE CONFIG
    // ------------------------------------------------------------------------
    dialogAutoReimburse: {
      maxWidth: 'max-w-lg',
      header: 'Zap emerald + "Auto-Reembolso" + "Configure regras automáticas"',

      sections: [
        {
          name: 'Master Toggle',
          layout: 'flex justify-between p-4 bg-slate-50 rounded-xl',
          label: '"Habilitar Auto-Reembolso"',
          subLabel: '"Reembolsar automaticamente alertas que atendam aos critérios"',
          control: 'Switch → onCheckedChange salva imediatamente via mutation',
          immediateSave: 'Cada switch faz mutate inline — não tem "salvar tudo" no final',
        },
        {
          name: 'Value Threshold',
          control: 'Input number defaultValue=100',
          onBlur: 'Salva via mutation com value_threshold parseado',
          subText: '"Alertas acima deste valor não serão reembolsados automaticamente"',
          gap: 'defaultValue + onBlur — uncontrolled. Não há feedback visual de save',
        },
        {
          name: 'Reason Codes',
          render: 'Loop sobre [fraud, not_recognized, unauthorized] com checkbox para cada',
          checkboxes: 'native HTML <input type="checkbox"> com defaultChecked baseado em config.reason_codes_to_auto_reimburse?.includes',
          gap: 'Native checkbox sem onChange registrado — checkboxes ficam decorativos! Bug crítico de funcionalidade.',
          labels: {
            fraud: 'Fraude confirmada',
            not_recognized: 'Não reconhece a compra',
            unauthorized: 'Transação não autorizada',
          },
        },
        {
          name: 'Email Notification',
          control: 'Switch → notification_email_enabled',
          purpose: 'Recebe e-mail quando ocorrer auto-reembolso',
        },
      ],

      footer: 'Apenas botão "Fechar" (não tem "Salvar" porque saves são inline)',
    },

    // ------------------------------------------------------------------------
    // GAPS & OPORTUNIDADES
    // ------------------------------------------------------------------------
    knownGaps: [
      'Ordering DESC por alert_deadline pode ser bug (deveria ser ASC para urgentes primeiro)',
      'Botão "Ver Urgentes" no banner sem onClick',
      'Ações "partial_refund" e "contact" sem ponto de entrada na tabela (só refund e ignore)',
      'handleAction com type "contact_customer" não muda status — alerta fica indefinidamente "pendente"',
      'Checkboxes de reason codes no dialog de auto-reembolso são decorativos (sem onChange)',
      'Save de inputs do auto-reembolso é inline e silencioso — sem feedback visual',
      'XCircle importado mas não usado',
      'detailsDialog.alert pode ficar stale se dispute for atualizado em outra aba/sessão',
    ],

    relationshipsToOtherPages: {
      disputeDashboard: 'Acessada via quick action laranja',
      transactionDetail: 'Coluna "Transação" é link para /TransactionDetail?id={transaction_id}',
      chargebacks: 'Se merchant escolhe "ignore", o alerta provavelmente vira CB que aparece em /Chargebacks',
    },
  },
};

export default PreChargebacksDoc;