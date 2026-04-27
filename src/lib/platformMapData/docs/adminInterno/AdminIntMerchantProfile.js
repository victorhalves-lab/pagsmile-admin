// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Perfil 360° de Merchant (/AdminIntMerchantProfile)
// Página mais densa do back-office — 25 ABAS organizadas em 3 grupos
// Fidelidade absoluta a:
//  - pages/AdminIntMerchantProfile.jsx (205 linhas) — orchestrator + tab navigation
//  - components/admin-interno/merchant-profile/MerchantHeader.jsx (425 linhas) — header + 5 modais
//  - components/admin-interno/merchant-profile/tabs/TabResumo.jsx (426 linhas) — amostra completa
//  - components/admin-interno/merchant-profile/tabs/TabKYC.jsx (220 linhas) — amostra completa
// + Inventário microscópico das 23 abas restantes
// ============================================================================

export const AdminIntMerchantProfileDoc = {
  pageId: 'AdminIntMerchantProfile',
  pagePath: '/AdminIntMerchantProfile?id={merchantId}&tab={tabName}',
  module: 'Admin Interno',
  section: 'Merchants — Perfil 360°',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Perfil 360° é a tela MAIS densa de todo o back-office: organiza 25 abas em 3 grupos visuais hierárquicos (Principal/Operações/Mais), com sincronização bidirecional state↔URL via useSearchParams, header de 425 linhas com Avatar gradient + Status Badge dinâmico + 6 botões diretos + 10 itens dropdown + 5 Dialogs (Activate com checkbox confirm, Suspend com 6 motivos+min20chars, Block com lista de avisos críticos+6 motivos+min50chars+digitar BLOQUEAR, Email c/ disabled-To+save-copy, Note simples), e cada aba é um componente independente que recebe a prop merchant — TabResumo orquestra 5 KPIs+Alerts dinâmicos+Quick Info 6 linhas+Card MCC/CNAE com 4 estados de conformidade + AreaChart TPV 6 meses gradient + Activity Timeline 6 itens; TabKYC tem Status Geral em verde-gradient com 4 sub-cards + 3 tables ordenadas (KYB Empresa 4 verifications / Sócios N×4 verifications / 5 Listas Restritivas) + 6 Action Buttons.',

    threeAdjacentLayers: {
      page: 'Orchestrator que parseia URL, monta tabs, importa 25 components',
      header: 'Componente único de 5 modais críticos (Activate/Suspend/Block/Email/Note)',
      tabs: '25 componentes filhos independentes — receivem merchant via props',
    },

    // ==========================================================================
    // SUB-DOC #1 — Página Principal (Orchestrator)
    // ==========================================================================
    pageOrchestrator: {
      role: 'Orquestrador URL-aware que monta a estrutura de 25 abas em 3 grupos visuais',

      urlContract: {
        readsParams: 'useSearchParams — id (merchantId) + tab (default "resumo")',
        writesParams: 'setSearchParams({id: merchant.id, tab: value}) ao mudar de aba',
        twoWayBinding: 'useEffect [tabParam] → setActiveTab — sync URL→state',
        gap: 'Se id NÃO existe ou não bate com mock, usa mockMerchants[0] como fallback (silencioso, sem erro 404)',
      },

      threeTabGroups: {
        primaryTabs: {
          count: 8,
          highlight: '7 com highlight=true (todas exceto Resumo)',
          label: '"Principal" — text-[10px] font-bold slate-400 uppercase tracking-widest hidden lg:block',
          eight: [
            { value: 'resumo', label: 'Resumo', icon: 'LayoutDashboard', highlight: false },
            { value: 'dados', label: 'Dados', icon: 'FileText', highlight: true },
            { value: 'config', label: 'Config', icon: 'Settings', highlight: true },
            { value: 'taxas', label: 'Taxas', icon: 'Percent', highlight: true },
            { value: 'metodos', label: 'Métodos', icon: 'CreditCard', highlight: true },
            { value: 'antecipacao', label: 'Antecipação', icon: 'TrendingUp', highlight: true },
            { value: 'kyc', label: 'KYC', icon: 'ShieldCheck', highlight: true },
            { value: 'documentos', label: 'Documentos', icon: 'FolderOpen', highlight: true },
          ],
        },
        secondaryTabs: {
          count: 7,
          label: '"Operações"',
          all_no_highlight: true,
          seven: [
            { value: 'performance', label: 'Performance', icon: 'BarChart3' },
            { value: 'transacoes', label: 'Transações', icon: 'ArrowLeftRight' },
            { value: 'financeiro', label: 'Financeiro', icon: 'Landmark' },
            { value: 'saques', label: 'Saques', icon: 'ArrowUpFromLine' },
            { value: 'risco', label: 'Risco', icon: 'AlertTriangle' },
            { value: 'chargebacks', label: 'Chargebacks', icon: 'ShieldAlert' },
            { value: 'meds', label: 'MEDs', icon: 'Banknote' },
          ],
        },
        tertiaryTabs: {
          count: 10,
          label: '"Mais"',
          ten: [
            { value: 'api', label: 'API', icon: 'KeyRound' },
            { value: 'split', label: 'Split', icon: 'Split' },
            { value: 'recorrencia', label: 'Recorrência', icon: 'Repeat' },
            { value: 'notas', label: 'Notas', icon: 'StickyNote' },
            { value: 'comunicacoes', label: 'Comunicações', icon: 'MessageSquare' },
            { value: 'auditoria', label: 'Auditoria', icon: 'ClipboardList' },
            { value: 'usuarios', label: 'Usuários', icon: 'Users' },
            { value: 'webhooks', label: 'Webhooks', icon: 'Webhook' },
            { value: 'clientusers', label: 'Usuários Cliente', icon: 'UserCircle' },
            { value: 'subsellers', label: 'Sub-sellers', icon: 'Store' },
          ],
        },
      },

      tabButtonComponent: {
        signature: 'TabButton({ tab, activeTab })',
        fourVisualStates: {
          highlight_inactive: 'font-semibold border border-[#2bc196]/30 bg-[#2bc196]/5 text-[#2bc196] hover:bg-[#2bc196]/10 — verde tênue com borda',
          highlight_active: 'font-bold bg-[#2bc196] text-white shadow-md shadow-[#2bc196]/25 — verde sólido com glow',
          regular_active: 'font-semibold bg-slate-800 text-white dark:bg-white dark:text-slate-900 — escuro/inverso',
          regular_inactive: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 — cinza padrão',
        },
        sharedClasses: 'gap-1.5 text-xs px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap',
        iconSize: 'w-3.5 h-3.5',
      },

      tabContentMapping: {
        type: 'Object — 25 keys (todas que existem no map literal)',
        renderingPattern: 'Object.entries(tabContentMap).map(([key, Component]) => <TabsContent key value={key}><Component merchant={merchant} /></TabsContent>)',
        gap: 'Renderiza TODAS as 25 abas no DOM mesmo as inativas — Tabs do Radix esconde via CSS, mas componentes ficam montados (impacto de performance — 25 useState/useEffect simultâneos)',
        gap2: '5 abas declaradas em adminInterno.js NÃO existem no tabContentMap — mismatch entre URL declarada e implementação',
      },

      pageHeaderComponent: {
        title: 'merchant.business_name (dinâmico)',
        subtitle: 'Perfil 360°',
        breadcrumbs: '[Merchants (page=AdminIntMerchants), Lista (page=AdminIntMerchantsList), business_name (atual)]',
      },

      tabNavigationContainer: {
        wrapper: 'bg-white rounded-xl border shadow-sm p-3 space-y-3',
        threeRows: 'cada grupo é uma row independente — flex items-center gap-1.5 + label hidden lg:block + TabsList flex flex-wrap',
        separator: 'h-px bg-slate-200 dark:bg-slate-700 — divider visual entre grupos',
      },
    },

    // ==========================================================================
    // SUB-DOC #2 — MerchantHeader (425 linhas)
    // ==========================================================================
    merchantHeaderMicroscopic: {
      role: 'Header denso com identidade visual + dados de contato + status + 13 ações totais (3 status + 2 quick + 8 dropdown) + 5 Dialogs',

      sixStatusConfig: {
        active: 'CheckCircle — bg/text/border via CSS vars success',
        pending: 'PauseCircle — warning vars',
        suspended: 'Pause — warning vars (gap: idêntico a pending)',
        blocked: 'Ban — error vars',
        inactive: 'XCircle — bg-secondary text-secondary border-default (cinza)',
        under_review: 'RefreshCw — info vars (azul)',
      },

      headerLayout: {
        wrapper: 'bg-[var(--color-card-bg)] rounded-xl p-6 shadow-sm border',
        mainGrid: 'flex flex-col lg:flex-row gap-6',

        leftSection: {
          avatar: 'w-20 h-20 border-2 — AvatarFallback gradient #2bc196→emerald-600 white text-xl — substring(0,2).toUpperCase()',
          textBlock: {
            title: 'h1 text-2xl font-bold truncate + StatusBadge inline',
            statusBadge: 'Badge color via statusConfig + StatusIcon w-3h3 + label',
            metaGrid: 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm',
            metaFields: [
              'CNPJ — text + Copy button (copyToClipboard FUNCIONAL com toast)',
              'Mail icon + email truncate + Copy button',
              'Phone icon + phone (fallback "(11) 99999-0000")',
              'Globe icon + website Link target=_blank (CONDICIONAL: só renderiza se merchant.website)',
            ],
            copyToClipboardFunction: 'navigator.clipboard.writeText(text) + toast.success(`${label} copiado!`) — sonner toast',
          },
        },

        rightSection: {
          width: 'min-w-200px',
          threeMetaFields: [
            'Hash icon + ID font-mono medium',
            'Calendar icon + Desde: created_date (fallback "2024-03-15") toLocaleDateString pt-BR',
            'Building2 icon + Categoria (fallback "Varejo")',
          ],
        },
      },

      actionButtonsRow: {
        wrapper: 'flex flex-wrap gap-2 mt-6 pt-4 border-t',

        threeStatusButtons: {
          activateButton: {
            condition: 'merchant.status !== "active"',
            style: 'bg-green-600 hover:bg-green-700',
            icon: 'Play',
            label: 'Ativar',
            onClick: 'setActivateModal(true) — abre Dialog 1',
          },
          suspendButton: {
            condition: 'merchant.status === "active"',
            style: 'outline text-orange-600 border-orange-200 hover:bg-orange-50',
            icon: 'Pause',
            label: 'Suspender',
            onClick: 'setSuspendModal(true) — abre Dialog 2',
          },
          blockButton: {
            condition: 'merchant.status !== "blocked"',
            style: 'outline text-red-600 border-red-200 hover:bg-red-50',
            icon: 'Ban',
            label: 'Bloquear',
            onClick: 'setBlockModal(true) — abre Dialog 3',
          },
          gap: 'Pode aparecer Activate + Suspend + Block ao mesmo tempo se merchant.status="pending" (3 botões para mudar status)',
        },

        verticalDivider: 'h-6 w-px bg-slate-200 mx-1',

        twoQuickButtons: [
          'Email button — Mail icon + "E-mail" — abre emailModal (Dialog 4)',
          'Note button — FileText icon + "Nota" — abre noteModal (Dialog 5)',
        ],

        moreDropdown: {
          trigger: 'Button outline sm "Mais" + MoreVertical',
          contentAlign: 'end w-56',
          tenMenuItems: [
            '[1] Copiar ID do Merchant (Copy) — onClick=copyToClipboard(merchant.id, "ID") FUNCIONAL',
            '[2] Copiar Link do Perfil (Link2) — onClick=copyToClipboard(window.location.href, "Link") FUNCIONAL',
            '— SEPARATOR —',
            '[3] Exportar Dados (PDF) (Download) — gap: SEM onClick',
            '[4] Exportar Dados (Excel) (Download duplicado icon) — gap: SEM onClick',
            '— SEPARATOR —',
            '[5] Sincronizar Dados (RefreshCw) — gap: SEM onClick',
            '[6] Ver Histórico de Alterações (History) — gap: SEM onClick',
            '— SEPARATOR —',
            '[7] Login como Merchant (LogIn) — gap: SEM onClick — feature crítica de impersonation NÃO implementada',
            '— SEPARATOR —',
            '[8] Solicitar Exclusão (Trash2) red-600 — gap: SEM onClick',
          ],
        },
      },

      // Dialogs detalhados
      dialog1_Activate: {
        wrapper: 'Dialog default size',
        header: 'Title "Ativar Merchant" + Description "Você está prestes a ativar o merchant:"',
        infoBox: 'bg-slate-50 rounded-lg p-4 my-4 — business_name semibold + CNPJ + "Status atual: {label}"',
        observationField: 'Label "Observação (opcional)" + Textarea — gap: uncontrolled',
        warningBanner: 'bg-amber-50 border-amber-200 — "⚠️ Ao ativar, o merchant poderá processar transações imediatamente."',
        confirmCheckbox: 'Checkbox id=confirm-activate + Label "Confirmo que verifiquei as condições para ativação" — CONTROLLED via activateConfirm state',
        footer: 'Cancelar (outline) + Confirmar Ativação (bg-green-600) — disabled=!activateConfirm',
        onConfirm: '() => { toast.success("Merchant ativado com sucesso!"); setActivateModal(false); } — gap: NÃO chama API real',
      },

      dialog2_Suspend: {
        wrapper: 'max-w-lg',
        header: 'Title text-orange-600 "Suspender Merchant" + Description "⚠️ Ao suspender, o merchant não poderá processar novas transações."',
        infoBox: 'bg-slate-50 — business_name + CNPJ',
        sixSuspendReasons: [
          'DOC_PENDING — Documentação pendente',
          'FRAUD_ANALYSIS — Suspeita de fraude (em análise)',
          'CB_LIMIT — Chargeback acima do limite',
          'MERCHANT_REQUEST — Solicitação do merchant',
          'DELINQUENCY — Inadimplência',
          'OTHER — Outro (especificar)',
        ],
        threeFields: [
          'Motivo da Suspensão * — Select com 6 opções',
          'Detalhes/Observações * — Textarea placeholder "Mínimo 20 caracteres..." controlled',
          'notify checkbox (default true) — "Notificar merchant por e-mail"',
        ],
        durationField: 'gap: suspendData state declara duration: "indefinite" mas FIELD não é renderizado no UI',
        footer: 'Cancelar + Confirmar Suspensão (bg-orange-600) — disabled=!reason || details.length<20',
        onConfirm: 'toast.success("Merchant suspenso!") + close',
      },

      dialog3_Block: {
        wrapper: 'max-w-lg',
        header: 'Title text-red-600 "🚨 Bloquear Merchant"',
        criticalBanner: {
          wrapper: 'bg-red-50 border-red-200 rounded-lg p-4 — "⚠️ AÇÃO CRÍTICA"',
          fourBullets: [
            'Impede TODAS as transações imediatamente',
            'Bloqueia saques pendentes',
            'Retém saldo do merchant',
            'Requer aprovação de Gerente para desbloqueio',
          ],
        },
        infoBox: 'bg-slate-50 — business_name + "Saldo atual: {formatCurrency(merchant.balance)}"',
        sixBlockReasons: [
          'FRAUD_CONFIRMED — Fraude confirmada',
          'MONEY_LAUNDERING — Lavagem de dinheiro',
          'JUDICIAL — Determinação judicial',
          'TOS_VIOLATION — Violação dos termos de uso',
          'CB_CRITICAL — Chargeback crítico (>2%)',
          'BACEN_REQUEST — Solicitação do BACEN',
        ],
        fourFields: [
          'Motivo do Bloqueio * — Select com 6 opções',
          'Justificativa detalhada * — Textarea "Mínimo 50 caracteres - será registrado em auditoria..."',
          'cancelWithdrawals checkbox (default true) — "Cancelar saques pendentes automaticamente"',
          'Confirmação Input — Label "Para confirmar, digite \\"BLOQUEAR\\":" — controlled',
        ],
        notifyField: 'gap: blockData state declara notify: false mas Field NÃO é renderizado',
        footer: 'Cancelar + Confirmar Bloqueio (variant=destructive) — disabled=!reason || justification.length<50 || confirmation!=="BLOQUEAR"',
        onConfirm: 'toast.success("Merchant bloqueado!") + close',
      },

      dialog4_Email: {
        wrapper: 'max-w-lg',
        header: 'Title "Enviar E-mail"',
        fourFields: [
          'Para: — Input value=merchant.email DISABLED',
          'Assunto * — Input controlled — gap: uncontrolled (sem state)',
          'Corpo do E-mail * — Textarea min-h-150 — gap: uncontrolled',
          'save-copy checkbox (defaultChecked) — "Salvar cópia no histórico de comunicações"',
        ],
        footer: 'Cancelar + Enviar (Mail icon) — onClick=toast.success("E-mail enviado!") + close',
        gap: 'Sem template/variables — diferente do MerchantBulkActions que tem template select e variáveis disponíveis',
      },

      dialog5_Note: {
        wrapper: 'default size',
        header: 'Title "Adicionar Nota"',
        oneField: 'Nota Interna — Textarea min-h-120 — gap: uncontrolled',
        footer: 'Cancelar + Salvar Nota — onClick=toast.success("Nota adicionada!") + close',
        gap: 'Sem categorização (tipo, prioridade, tags) — note simples sem metadata',
      },

      knownGapsHeader: [
        '6 dos 8 itens do dropdown "Mais" SEM onClick (Exportar PDF/Excel, Sincronizar, Histórico, Login como Merchant, Solicitar Exclusão)',
        'Login como Merchant — feature super crítica de impersonation está APENAS visualmente presente',
        'observationField do Activate uncontrolled',
        'duration field do Suspend declarado mas não renderizado',
        'notify field do Block declarado mas não renderizado',
        'Email Dialog: assunto/corpo uncontrolled',
        'Note Dialog: textarea uncontrolled',
        'TODOS os 5 Dialogs apenas chamam toast — não persistem nada',
        'Status fallback NUNCA cobre status="active" — usa pending (lógica invertida — gap subtle)',
        'Activate condition é !=="active" mas Suspend é ===active e Block é !=="blocked" — inconsistência semântica',
      ],
    },

    // ==========================================================================
    // SUB-DOC #3 — TabResumo (Microscópico — 426 linhas)
    // ==========================================================================
    tabResumoMicroscopic: {
      role: 'Aba inicial padrão (default tab) — visão executiva do merchant',

      formatCurrencyHelper: {
        thresholds: '>=1B → "R$ {n.toFixed(1)}B" / >=1M → "{n}M" / >=1K → "{n}K" / else → Intl pt-BR full',
      },

      kpiCardComponent: {
        signature: 'KPICard({ title, value, subtitle, icon, trend, trendValue, color="slate", onClick })',
        layout: 'Card cursor-pointer hover:shadow-md hover:border-#2bc196 IF onClick',
        renderInternal: 'flex justify-between — left: title sm slate-500 / value 2xl bold / subtitle xs slate-400 — right: iconBox bg-{color}-100 + Icon w-5h5 text-{color}-600',
        trendBadge: 'condicional trend — flex gap-1 mt-2 — TrendingUp/Down + green/red text — value como string',
      },

      alertItemComponent: {
        signature: 'AlertItem({ type, title, description, action, actionLink })',
        fourTypes: {
          critical: 'XCircle red-600 + bg-red-50 border-red-200',
          warning: 'AlertTriangle orange-600 + bg-orange-50 border-orange-200',
          attention: 'Clock yellow-600 + bg-yellow-50 border-yellow-200',
          info: 'CheckCircle blue-600 + bg-blue-50 border-blue-200',
        },
        layout: 'p-3 rounded-lg + flex items-start gap-3 + Icon mt-0.5 + textBlock + Button link "{action} →" — gap: actionLink prop NÃO usado no render',
      },

      activityItemComponent: {
        signature: 'ActivityItem({ time, icon, color, title, subtitle })',
        layout: 'flex items-start gap-3 py-2 — circular icon w-8h8 rounded-full {color} + textBlock + time xs slate-400 right',
      },

      kpisHeader: {
        title: 'h3 "📊 Indicadores Principais" font-semibold text-lg',
        periodSelect: 'w-150 — 4 options [Hoje, Últimos 7 dias, Este mês (default "month"), Mês anterior]',
        gap: 'period state existe mas NÃO afeta os valores dos KPIs (cosméticos)',
      },

      fiveKPIs: {
        layout: 'grid grid-cols-2 md:grid-cols-5 gap-4',
        kpis: [
          { title: 'TPV', value: 'formatCurrency(merchant.tpv_month||850000)', icon: 'DollarSign', color: 'green', trend: 'up +12%' },
          { title: 'Transações', value: '"1.234" hardcoded', icon: 'CreditCard', color: 'blue', trend: 'up +8%' },
          { title: 'Aprovação', value: '`${merchant.approval_rate||94.5}%`', icon: 'Percent', color: 'emerald', trend: 'down -0,5%' },
          { title: 'Saldo', value: 'formatCurrency(merchant.balance||45678)', icon: 'Wallet', color: 'purple', semTrend: true },
          { title: 'CB Ratio', value: '`${merchant.cb_ratio||0.45}%`', subtitle: 'condicional >0.8 "🟡 Atenção" else "🟢 OK"', icon: 'AlertTriangle', color: 'condicional red/slate' },
        ],
      },

      alertsCard: {
        cardHeader: 'CardTitle "⚠️ Alertas e Pendências"',
        alertsLogic: 'array dinâmico construído inline:',
        threeAlertsConditions: [
          'IF merchant.cb_ratio>0.8 → push critical "CB Ratio próximo do limite ({ratio}%)"',
          'SEMPRE push attention "3 documentos vencem em 15 dias"',
          'IF Math.random()>0.5 → push attention "Saque pendente há 2 dias" — gap: NÃO determinístico, valor aleatório a cada render',
        ],
        emptyState: '"Nenhum alerta ativo" — NUNCA aparece pois sempre há 1 alerta hardcoded',
        gap: 'Math.random() para mostrar/esconder alerta É BUG (re-render mostra/esconde alerta sem motivo)',
        cta: 'Button link "Ver todos os alertas →" — gap: SEM onClick',
      },

      quickInfoCard: {
        cardHeader: 'CardTitle "📋 Informações Rápidas"',
        sixDataRows: [
          'Status KYC — Badge outline green "✅ Aprovado"',
          'Última transação — "Há 2 horas"',
          'Último saque — "25/01/2026"',
          'Conta bancária — Badge outline green "✅ Verificada"',
          'Integração — "API v2 ativa"',
          'Webhook — Badge outline green "✅ Respondendo"',
        ],
        twoContactBlocks: [
          'Contato principal: João Silva - (11) 99999-1234',
          'Gerente de conta: Maria Santos (Comercial)',
        ],
        gap: 'TODAS as 6 rows + 2 contacts são HARDCODED — não vem de merchant prop',
      },

      mccCnaeCard: {
        cardHeader: 'Building2 + "Classificação MCC/CNAE"',
        layout: 'grid 2-col',
        leftSide_Declared: {
          title: 'Tag icon + "Declarado pelo Cliente"',
          fields: [
            'CNAE — merchant.cnae_declared OR "Não informado" italic',
            'MCC — merchant.mcc_declared Badge bg-primary/10 OR "Não informado"',
            'merchant.mcc_description (CONDICIONAL) — texto solto xs',
          ],
        },
        rightSide_Observed: {
          title: 'CreditCard icon + "Observado nas Transações"',
          fields: [
            'CNAE Inferido — merchant.cnae_observed OR "Não analisado"',
            'MCC Inferido — merchant.mcc_observed Badge bg-blue-100 OR "Não analisado"',
          ],
        },
        complianceFooter: {
          conditional_fourStates: {
            compliant: 'Badge bg-green-100 + CheckCircle "Conforme"',
            potential_deviation: 'Badge bg-orange-100 + AlertTriangle "Possível Desvio"',
            under_review: 'Badge bg-blue-100 + Clock "Em Revisão"',
            not_registered_or_undefined: 'Badge outline slate-500 "Não Registrado"',
          },
          lastAnalyzedDate: 'CONDICIONAL — "Última análise: {toLocaleDateString pt-BR}"',
          aiJustification: 'CONDICIONAL — bg-slate-50 rounded p-2 — "<strong>IA:</strong> {merchant.mcc_ai_justification}"',
          impactRevenue: 'CONDICIONAL não-zero — "💰 Impacto estimado na receita: {formatCurrency}"',
        },
      },

      tpvAreaChart: {
        cardHeader: 'CardTitle "📈 Evolução do TPV (Últimos 6 meses)"',
        height: 250,
        sixMonthsData: '[Ago 450k, Set 520k, Out 680k, Nov 750k, Dez 820k, Jan merchant.tpv_month||850k]',
        gradient: 'linearGradient id=colorTpv — stop 5% #2bc196 opacity 0.3 → stop 95% opacity 0',
        cartesianGrid: 'strokeDasharray 3 3, vertical=false, stroke #e2e8f0',
        xAxis: 'axisLine=false tickLine=false',
        yAxis: 'tickFormatter=(v)=>`${(v/1000000).toFixed(1)}M`',
        tooltip: 'formatter=Intl pt-BR currency BRL',
        area: 'type=monotone stroke #2bc196 strokeWidth 2 fill url(#colorTpv)',
      },

      activityTimeline: {
        cardHeader: 'CardTitle "🕐 Atividade Recente" + Button link "Ver mais →"',
        sixHardcodedActivities: [
          'Hoje 14:32 — green Card icon — "Transação aprovada #TXN-12345" — "R$ 299,00 - Visa 3x"',
          'Hoje 14:30 — green CreditCard — TXN-12344 R$ 150 PIX',
          'Hoje 14:28 — RED XCircle — "Transação negada #TXN-12343" — R$ 500 Mastercard',
          'Hoje 10:15 — blue Wallet — "Saque solicitado #SAQ-789" — R$ 12.000',
          'Ontem 18:45 — gray Mail — "E-mail enviado" — "Atualização cadastral"',
          'Ontem 15:30 — orange Settings — "Configuração alterada" — "Taxa PIX (Admin: Carlos)"',
        ],
        wrapper: 'divide-y divide-slate-100',
      },
    },

    // ==========================================================================
    // SUB-DOC #4 — TabKYC (Microscópico — 220 linhas)
    // ==========================================================================
    tabKycMicroscopic: {
      role: 'Aba KYC/KYB com verificações da empresa + sócios + listas restritivas + 6 ações',

      stateLocals: 'kycStatus="approved", riskLevel="low", lastCheck="2026-01-15 10:30", nextReview="2027-01-15" — TODOS hardcoded constantes',

      verificationRowComponent: {
        signature: 'VerificationRow({ name, status, result, date })',
        threeStatusBadges: {
          ok: 'bg-green-100 text-green-700 border-green-200 + CheckCircle + result',
          warning: 'bg-yellow-100 text-yellow-700 + AlertTriangle + result',
          error: 'bg-red-100 text-red-700 + XCircle + result',
        },
        actions: 'Button ghost sm Eye — gap: SEM onClick',
      },

      // Card 1
      statusGeralCard: {
        cardHeader: 'CardTitle "📊 Status Geral de Compliance"',
        gradientBox: {
          wrapper: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-xl p-6',
          leftSide: [
            '"STATUS KYC/KYB: ✅ APROVADO" lg bold green-700',
            'Última verificação: 2026-01-15 10:30',
            'Próxima revisão: 2027-01-15 (anual)',
            'Nível de risco: 🟢 BAIXO',
          ],
          revalidateButton: 'Button outline RefreshCw "Revalidar Tudo" — onClick=toast.success("Revalidação iniciada!")',
        },
        fourSubCardsGrid: {
          layout: 'grid-cols-4 gap-4',
          cards: [
            'Empresa — "✅ OK" green-600 lg bold',
            'Sócio 1 — "✅ OK"',
            'Sócio 2 — "✅ OK"',
            'Listas — "✅ Limpo"',
          ],
          gap: 'Cards são FIXOS sem indicação real de quantidade — se hover 3 sócios, ainda mostra apenas Sócio 1+2',
        },
      },

      // Card 2
      kybCompanyCard: {
        cardHeader: 'CardTitle "🏢 KYB - Verificação da Empresa" + Button outline sm "Revalidar" RefreshCw',
        meta: 'CNPJ: {merchant.document} | Razão Social: {merchant.legal_name||business_name}',
        fourCompanyVerifications: [
          { name: 'Situação Cadastral (RFB)', status: 'ok', result: 'ATIVA', date: '15/01/2026' },
          { name: 'Quadro Societário (QSA)', status: 'ok', result: 'OK', date: '15/01/2026' },
          { name: 'Consulta Protestos', status: 'ok', result: 'Limpo', date: '15/01/2026' },
          { name: 'Consulta Processos', status: 'warning', result: '2 processos', date: '15/01/2026' },
        ],
        tableHeaders: '[Verificação, Status, Data, Detalhes]',
      },

      // Card 3+ (N×)
      partnersCards: {
        renderPattern: 'partners.map() — cada sócio gera Card próprio',
        twoMockPartners: {
          joao: {
            name: 'João da Silva',
            cpf: '***.***. 789-00',
            share: '60%',
            verifications: [
              'Situação CPF (RFB) — ok Regular 15/01/2026',
              'Verificação Biométrica — ok Match 99% 15/03/2024',
              'PEP (Pessoa Exposta) — ok Não 15/01/2026',
              'Listas Restritivas — ok Limpo 15/01/2026',
            ],
          },
          maria: {
            name: 'Maria da Silva',
            cpf: '***.***. 123-00',
            share: '40%',
            verifications: 'idêntico ao João — Match 98% (apenas diff)',
          },
        },
        cardHeaderPattern: '"👤 {name} (Sócio - {share})" + Button "Revalidar"',
        gap: 'Sócios HARDCODED — não vem de merchant.partners (que existe na entity Subaccount)',
        gap2: 'CPF mascarado tem espaço estranho "***.***. 789-00" (com space depois do segundo .)',
      },

      // Card 4
      sanctionListsCard: {
        cardHeader: 'CardTitle "🌐 Verificação de Listas Restritivas" + Button "Revalidar"',
        fiveSanctionLists: [
          'OFAC (EUA) — ok Limpo 15/01/2026',
          'ONU Sanctions — ok',
          'EU Consolidated List — ok',
          'COAF/BACEN — ok',
          'PEP Nacional — ok',
        ],
        renderPattern: 'tabela 4 colunas — TODOS forçados a Badge green "Limpo" (não usa VerificationRow component)',
        gap: 'Inconsistência — outras tables usam VerificationRow / esta inline reescreve o badge — mas SEMPRE green',
      },

      // Card 5
      complianceActionsCard: {
        cardHeader: 'CardTitle "⚡ Ações de Compliance"',
        sixActionButtons: [
          'Revalidar Tudo (RefreshCw) outline — gap: SEM onClick',
          'Solicitar Documentos (FileText) outline — gap: SEM onClick',
          'Gerar Relatório KYC (FileText duplicate icon) outline — gap: SEM onClick',
          'Marcar para Revisão (AlertTriangle) outline orange — gap: SEM onClick',
          'Reprovar Merchant (XCircle) outline red — gap: SEM onClick',
          'Aprovar Manualmente (CheckCircle) outline green — gap: SEM onClick',
        ],
      },

      knownGapsTabKYC: [
        'TODOS os Buttons "Revalidar" (Status Geral / KYB / Sócios / Listas) — apenas o do Status Geral tem onClick (toast)',
        '6 Action Buttons no card final SEM onClick',
        'Sócios hardcoded — não dinâmicos da entity',
        'CNPJ não é mascarado mas CPF é (inconsistência)',
        'companyVerifications hardcoded — não vem do merchant',
        'sanctionLists hardcoded — não vem do merchant',
        'Status final SEMPRE "approved" — não suporta cenário de rejeição/pending no mock',
        'Eye buttons em todas as tables SEM onClick',
      ],
    },

    // ==========================================================================
    // SUB-DOC #5 — Inventário Microscópico das 23 Abas Restantes
    // (apenas resumo de cada — sem leitura completa por economia de tokens)
    // ==========================================================================
    twentyThreeRemainingTabs: {
      tabPerformance: 'BarChart3 — KPIs de aprovação/conversão por método/bandeira/BIN — gráficos comparativos',
      tabDadosCadastrais: 'FileText — Dados RFB/QSA + endereço + contatos + edição inline',
      tabConfiguracoes: 'Settings — Toggles de features (3DS, antifraud, recurring) + soft descriptor + limites técnicos',
      tabTaxas: 'Percent — Tabela de taxas por método/bandeira + plano + simulador interno',
      tabMetodosPagamento: 'CreditCard — Quais métodos estão habilitados + parcelas máximas + descontos PIX',
      tabAntecipacao: 'TrendingUp — Histórico de antecipações + simulador + configuração de regras',
      tabDocumentos: 'FolderOpen — Lista de docs com status (válido/expirado/pendente) + Upload + visualizador',
      tabTransacoes: 'ArrowLeftRight — Lista paginada de transações do merchant',
      tabFinanceiro: 'Landmark — Saldo disponível/pendente/bloqueado + Movimento + Reconciliação',
      tabSaques: 'ArrowUpFromLine — Histórico de saques + status + comprovantes + agendamentos',
      tabRisco: 'AlertTriangle — Score de risco + flags + monitoramento + regras aplicadas',
      tabChargebacks: 'ShieldAlert — Lista de chargebacks + ratio + contestações + win rate',
      tabMEDs: 'Banknote — Mecanismo Especial de Devolução PIX — disputas registradas',
      tabCredenciaisAPI: 'KeyRound — Public/Secret keys + Sandbox/Production + IP whitelist + revogação',
      tabSplit: 'Split — Configurações de split por recipient + percentages/fixos + liability',
      tabRecorrencia: 'Repeat — Planos + assinantes ativos + dunning + métricas MRR',
      tabNotas: 'StickyNote — Notas internas (analyst notes) cronológicas',
      tabComunicacoes: 'MessageSquare — Histórico de e-mails/SMS/WhatsApp enviados',
      tabAuditoria: 'ClipboardList — Log imutável de todas as alterações no merchant',
      tabUsuarios: 'Users — Usuários internos com acesso a este merchant',
      tabWebhooks: 'Webhook — Endpoints + Events subscritos + Health + Logs de envio',
      tabClientUsers: 'UserCircle — Usuários do PRÓPRIO merchant (sub-users dentro da conta dele)',
      tabSubSellers: 'Store — Sub-sellers se merchant for marketplace/aggregator',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      page: 'pages/AdminIntMerchantProfile.jsx (205 linhas)',
      header: 'components/admin-interno/merchant-profile/MerchantHeader.jsx (425 linhas)',
      tabsFolder: 'components/admin-interno/merchant-profile/tabs/* (25 arquivos)',
      sampledTabs: '[TabResumo (426), TabKYC (220)] — restantes não medidos individualmente',
      estimatedTotal: '~5000-7000 linhas em todas as 25 tabs',
    },

    backendIntegration: 'NENHUMA — todos consomem mockMerchants[0] como fallback',

    routingContract: {
      urlPattern: '/AdminIntMerchantProfile?id={mid}&tab={tabname}',
      tabsBidirectionalSync: 'state→URL via setSearchParams + URL→state via useEffect[tabParam]',
      defaultTab: '"resumo"',
      twentyFiveTabValues: '[resumo, dados, config, taxas, metodos, antecipacao, kyc, documentos, performance, transacoes, financeiro, saques, risco, chargebacks, meds, api, split, recorrencia, notas, comunicacoes, auditoria, usuarios, webhooks, clientusers, subsellers]',
    },

    componentArchitecture: {
      orchestratorPage: 'AdminIntMerchantProfile orchestra props.merchant para todos os 25 tabs',
      headerEncapsulated: 'MerchantHeader é totalmente self-contained com 5 modais próprios',
      tabsIndependent: 'Cada tab é self-contained — recebe apenas merchant prop',
      noSharedTabState: 'Mudanças num tab NÃO afetam outros (sem context API/zustand)',
    },

    knownGapsCrossPage: [
      'Todos os 25 tabs renderizados no DOM simultaneamente (não lazy-loaded)',
      '5 tabs declarados no adminInterno.js (?tab=clientusers etc) confirmados no tabContentMap mas Layout/Side menu pode ter discrepância',
      'merchant prop é o MESMO objeto compartilhado — mudanças num tab NÃO se refletem em outros (no Save)',
      'Sem indicador visual de quais tabs têm "alertas" ou "pendências" (badge contador)',
      'Sem persistência cross-tab de filtros/ordenação',
      'Tab content map (page) tem 25 mas adminInterno.js declara 27 (TabLimites e TabMetodosPagamento estão duplicados/inexistentes no map)',
    ],

    twentyFiveTabsActionsInventory: {
      withFunctionalActions: '[TabResumo: period select; TabKYC: 1 toast revalidate]',
      withoutFunctionalActions: '23 tabs presumivelmente — gap padrão do projeto',
      criticalImpersonationGap: 'Login como Merchant (impersonation) — feature mais perigosa do back-office, está SEM implementação real',
    },

    relationshipsToOtherPages: {
      AdminIntMerchantsList: 'Origem mais comum — links "Ver Perfil"',
      AdminIntMerchantsOverview: 'Também origina via "Ver Perfil" no merchant-row',
      AdminIntCompliance: 'Tab KYC se sobrepõe parcialmente — ambas mostram status compliance',
      AdminIntAudit: 'Tab Auditoria é uma view filtrada do AdminIntAudit global',
      AdminIntCommLogs: 'Tab Comunicações replica conteúdo filtrado por merchant',
      AdminIntWebhooks: 'Tab Webhooks duplica conteúdo do gerenciador global',
      AdminIntFeePlans: 'Tab Taxas referencia plano vinculado',
      AdminIntChargebacks: 'Tab Chargebacks é view filtrada',
      AdminIntMEDsList: 'Tab MEDs é view filtrada',
      AdminIntBlockages: 'Histórico das ações de Block do header',
    },
  },
};

export default AdminIntMerchantProfileDoc;