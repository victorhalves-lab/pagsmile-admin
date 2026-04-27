// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — DISPUTAS E BLOQUEIOS (Admin Interno)
// Fidelidade absoluta a 4 páginas (~733 linhas):
//  - AdminIntChargebacksList.jsx (259 linhas) — gestão Chargebacks com 6 stats + Urgent + Filters + Table
//  - AdminIntPreChargebacks.jsx (143 linhas) — fila Ethoca/Verifi com SideDrawer ação
//  - AdminIntMEDsList.jsx (217 linhas) — gestão MEDs PIX BACEN com 5 stats + Urgent
//  - AdminIntBlockages.jsx (113 linhas) — DataTable bloqueios + SideDrawer Novo
// ============================================================================

export const AdminIntDisputesAndBlockagesDoc = {
  pageId: 'AdminIntDisputesAndBlockages',
  pagePaths: [
    '/AdminIntChargebacksList',
    '/AdminIntPreChargebacks',
    '/AdminIntMEDsList',
    '/AdminIntBlockages',
  ],
  module: 'Admin Interno',
  section: 'Risco e Compliance — Disputas e Bloqueios',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Quatro páginas que formam o pipeline COMPLETO de disputas pós-transação: (1) PreChargebacks é o "para-fraudes" antecipado — fila Ethoca/Verifi com 3 alertas mock urgency=critical/high mostrando dot animate-pulse + DataTable c/ Eye/Reembolsar/Ignorar e SideDrawer "Ação no Pré-Chargeback" com Prazo Box vermelho + grid 4 fields + Select 5 ações (refund/partial/contest/contact/ignore) + Input Valor + Textarea + footer 3 buttons (Reembolsar verde/Contestar Proativamente/Cancelar); (2) ChargebacksList usa CSS variables (var(--color-*)) ao invés de Tailwind direct — 6 stats grid (CB Ratio 0.45% + 5 status) + sub-card "Prazos Urgentes" com pulse + 6 filters (período/status/merchant/bandeira/motivo + 2 inputs valor) + tabela nativa HTML 8-col com Link merchant cliclável + paginação 1-50 de 234 com Anterior disabled + 6 mocks (3 open urgentes + 1 in_defense + 1 won + 1 lost); (3) MEDsList é gêmea ESTRUTURAL de Chargebacks mas para PIX (BACEN 7 dias) — 5 stats (sem awaiting), 6 mocks bancos (Nubank/Itaú/Bradesco/Santander/BB/Caixa), filtros REDUZIDOS (apenas período+status), tabela 8-col com banco em vez de bandeira, SEM paginação (assimétrico vs Chargebacks); (4) Blockages é a MAIS minimalista (113 linhas) — DataTable com 3 mocks (VDMP/HighCB/CB-456) + SideDrawer "Novo Bloqueio" com 5 fields obrigatórios (Merchant/Tipo c/ 5 opções/Valor/Motivo/Justificativa) + Warning bg-red-50 final + breadcrumbs aponta erradamente para "AdminIntRetention" (página inexistente).',

    fourPageOverview: {
      preChargebacks: 'Antecipação de fraude (Ethoca/Verifi) — janela 4-10h URGENTE',
      chargebacks: 'Gestão pós-CB com defesa formal — janela dias',
      meds: 'PIX equivalente do CB sob regulamentação BACEN 7 dias',
      blockages: 'Holdbacks/bloqueios manuais (113 linhas — minimalista)',
    },

    designSystemNote: {
      cssVariables: 'ChargebacksList e MEDsList usam EXTENSIVAMENTE CSS variables (var(--color-bg-page), var(--color-warning-bg), var(--color-success-text), etc) — diferente das outras páginas que usam Tailwind direto',
      gap: 'Inconsistência de padrão visual entre páginas — algumas usam tokens (CSS vars), outras usam Tailwind classes hardcoded (bg-red-100)',
    },

    // ==========================================================================
    // SUB-DOC #1 — AdminIntPreChargebacks (Ethoca/Verifi)
    // ==========================================================================
    preChargebacksMicroscopic: {
      role: 'Fila de alertas PRÉ-chargeback dos provedores Ethoca (Mastercard) e Verifi (Visa) — janela curta de 4-10h para evitar CB formal',

      threeMockAlerts: [
        { id: 'PCB-001', amount: 2350, provider: 'Ethoca', deadline: '4h', merchant: 'Loja ABC', txn: '12345678', reason: '10.4 Fraude', urgency: 'critical' },
        { id: 'PCB-002', amount: 890, provider: 'Verifi', deadline: '5h', merchant: 'Tech Solutions', txn: '12345679', reason: '13.1 Não recebeu', urgency: 'critical' },
        { id: 'PCB-003', amount: 1500, provider: 'Ethoca', deadline: '10h', merchant: 'Moda Express', txn: '12345680', reason: '4837 Fraude', urgency: 'high' },
      ],

      pageHeader: {
        title: 'Pré-Chargebacks',
        subtitle: 'Fila de Alertas (Ethoca/Verifi)',
        breadcrumbs: '[Risco (page=AdminIntRisk) → Pré-Chargebacks (atual)]',
      },

      dataTable: {
        wrapper: 'Card → CardContent pt-6 → DataTable',
        eightColumns: [
          {
            header: '(vazio)',
            accessorKey: 'urgency',
            cell: 'div w-3h3 rounded-full + critical → bg-red-500 animate-pulse / high → bg-orange-500 (sem pulse)',
            gap: 'pulse APENAS em critical — sutil mas inconsistente para acessibilidade',
          },
          'ID — accessorKey id',
          'Valor — accessorKey amount + cell `R$ ${value}` (gap: NÃO usa formatCurrency Intl)',
          'Provedor — accessorKey provider',
          'Prazo — accessorKey deadline + cell font-bold text-red-600',
          'Merchant — accessorKey merchant',
          'Reason Code — accessorKey reason',
          {
            header: 'Ações',
            id: 'actions',
            threeButtons: [
              'Eye (ghost h-8 w-8) — onClick=setSelectedAlert(row.original) → ABRE Drawer',
              'CheckCircle bg-green-600 (h-8 w-8 p-0) title="Reembolsar" — onClick=setSelectedAlert(row.original) (mesmo que Eye!)',
              'XCircle destructive (h-8 w-8 p-0) title="Ignorar" — onClick=toast.info("Alerta ignorado")',
            ],
            gap: 'Eye e Reembolsar abrem o MESMO drawer — botão "Reembolsar" não executa ação direta',
          },
        ],
      },

      sideDrawerActionPCB: {
        wrapper: 'SideDrawer size=lg + icon AlertTriangle + iconClassName "bg-red-100 text-red-600"',
        title: 'Ação no Pré-Chargeback',
        description: 'selectedAlert?.id (mostra "PCB-001")',

        deadlineBox: {
          wrapper: 'p-4 bg-red-50 border border-red-200 rounded-lg',
          firstLine: 'Clock 4x4 red-600 + "Prazo: {deadline}" font-bold text-red-700',
          secondLine: 'sm red-600 — "Provedor: {provider}"',
          gap: 'Não há countdown timer — apenas exibe string ("4h")',
        },

        fourFieldsGrid: {
          layout: 'grid grid-cols-2 gap-4',
          fields: [
            'Valor — bg-slate-50 — "R$ {amount.toLocaleString(pt-BR)}" xl bold',
            'Merchant — bg-slate-50 — name medium',
            'Transação — bg-slate-50 — txn font-mono sm',
            'Reason Code — bg-slate-50 — reason medium',
          ],
        },

        actionRecommendedSelect: {
          label: 'Ação Recomendada',
          defaultValue: 'refund',
          fiveOptions: [
            'refund — "Reembolso total" (default)',
            'partial_refund — "Reembolso parcial"',
            'contest — "Contestar proativamente"',
            'contact — "Contactar cliente"',
            'ignore — "Ignorar"',
          ],
        },

        refundAmountInput: {
          label: 'Valor do Reembolso',
          type: 'number',
          defaultValue: 'selectedAlert.amount',
          gap: 'NÃO ajusta automaticamente quando ação muda para "partial_refund"',
        },

        observationsTextarea: {
          label: 'Observações',
          rows: 3,
          placeholder: 'Notas internas sobre esta ação...',
        },

        footer: {
          threeButtons: [
            'Cancelar — outline → setSelectedAlert(null)',
            'Reembolsar — bg-green-600 + CheckCircle → toast.success("Reembolso processado!") + close',
            'Contestar Proativamente — outline → toast.success("Contestação proativa iniciada!") + close',
          ],
          gap: 'Botões footer NÃO consideram o Select "Ação Recomendada" escolhido — sempre fazem refund OU contest, ignorando partial/contact/ignore',
          gap2: 'Sem botão para "Ignorar" no footer — apenas inline na tabela',
        },
      },

      knownGapsPreChargebacks: [
        'Botão "Reembolsar" inline na tabela apenas abre Drawer — não reembolsa diretamente',
        'Footer 3 buttons fixed — não respeita Select de ação escolhido',
        'Sem countdown real do prazo (4h vira string)',
        'Sem badge de urgência visível na tabela (só dot)',
        'animate-pulse apenas em critical (high não pulsa)',
        'Sem confirmation antes de Reembolsar (decisão financeira sem confirmação)',
        'NÃO usa formatCurrency Intl no Valor da tabela',
        'Sem filtros, busca ou paginação',
        'Stats summary ausentes (vs Chargebacks que tem 6 KPIs)',
      ],
    },

    // ==========================================================================
    // SUB-DOC #2 — AdminIntChargebacksList
    // ==========================================================================
    chargebacksListMicroscopic: {
      role: 'Centro de gestão de chargebacks formais (Visa/Master/Elo/Amex) — pós-acionamento bandeira',

      designSystemUseCSSVars: {
        cssVariablesUsed: [
          '--color-bg-page (background da página)',
          '--color-card-bg / --color-card-border',
          '--color-warning-bg/-text/-border (Aberto)',
          '--color-info-bg/-text/-border (Em Defesa)',
          '--color-success-bg/-text/-border (Ganho)',
          '--color-error-bg/-text/-border (Perdido)',
          '--color-bg-secondary / --color-text-secondary (Aguardando)',
          '--color-text-link (Link merchant)',
          '--color-text-tertiary (labels secundários)',
          '--color-border-light (separators tabela)',
          '--color-bg-hover (row hover)',
        ],
        gap: 'Estilo SOMENTE com vars — quebra dark mode se vars não definidos no theme',
      },

      sixMockChargebacks: [
        { id: 'CB-12345', merchant: 'Loja do João', amount: 299, brand: 'Visa', reason: 'Fraude', reasonCode: '10.4', deadline: '29/01/2026', status: 'open', urgent: true },
        { id: 'CB-12346', merchant: 'Tech Store', amount: 500, brand: 'Master', reason: 'Prod. Não Rec.', reasonCode: '4853', deadline: '30/01/2026', status: 'open', urgent: true },
        { id: 'CB-12347', merchant: 'Moda Fashion', amount: 150, brand: 'Elo', reason: 'Cancelamento', reasonCode: '83', deadline: '31/01/2026', status: 'open', urgent: false },
        { id: 'CB-12340', merchant: 'Loja do João', amount: 199, brand: 'Visa', reason: 'Fraude', reasonCode: '10.4', deadline: '-', status: 'in_defense' },
        { id: 'CB-12335', merchant: 'Tech Store', amount: 89.90, brand: 'Visa', reason: 'Diferente', reasonCode: '53', deadline: '-', status: 'won' },
        { id: 'CB-12330', merchant: 'Moda Fashion', amount: 450, brand: 'Amex', reason: 'Fraude', reasonCode: 'F10', deadline: '-', status: 'lost' },
      ],

      fiveStatusConfig: {
        open: 'Aberto (warning vars)',
        in_defense: 'Em Defesa (info vars)',
        awaiting: 'Aguardando (bg-secondary/text-secondary)',
        won: 'Ganho (success vars)',
        lost: 'Perdido (error vars)',
      },

      pageHeader: {
        title: 'Gestão de Chargebacks',
        breadcrumbs: '[Risco e Compliance → Chargebacks]',
      },

      sixStatsRow: {
        wrapper: 'Card "📊 Resumo Geral" + Select w-120 (7d/30d/90d default 30d)',
        layout: 'grid grid-cols-6 gap-4',
        sixStats: [
          'CB Ratio — 0.45% (success vars + 🟢 OK badge)',
          'Abertos — count=15, value=R$4.500,00 (warning bg)',
          'Em Defesa — count=23, value=R$7.800,00 (info bg)',
          'Aguardando — count=12, value=R$3.200,00 (secondary bg)',
          'Ganhos — 32 (68%), value=R$9.500,00 (success bg)',
          'Perdidos — 15 (32%), value=R$4.200,00 (error bg)',
        ],
      },

      urgentDeadlinesCard: {
        conditional: 'IF urgentChargebacks.length > 0 (filter urgent && status=open)',
        wrapper: 'Card border-error-border bg-error-bg',
        title: 'AlertTriangle red + "Prazos Urgentes (Próximos 3 dias)"',
        eachAlert: {
          wrapper: 'flex items-center justify-between p-3 bg-primary rounded-lg border-default',
          leftBlock: '🔴 + ID font-mono + merchant + amount formatCurrency',
          rightBlock: 'Clock + "Prazo: {deadline}" red font-medium + Button sm "Defender" FileText → toast.info("Abrindo modal de defesa...")',
        },
      },

      filtersCard: {
        wrapper: 'Card → flex flex-wrap gap-3',
        sevenFilters: [
          'Período Select w-120 (7d/30d/90d)',
          'Status Select w-130 (Todos/Abertos/Em Defesa/Ganhos/Perdidos — gap: NÃO inclui Aguardando)',
          'Merchant Select w-150 placeholder="Merchant" (Todos/Loja do João/Tech Store)',
          'Bandeira Select w-120 placeholder="Bandeira" (Todas/Visa/Mastercard/Elo)',
          'Motivo Select w-120 placeholder="Motivo" (Todos/Fraude/Não Recebido/Diferente)',
          '2 Inputs Number (De R$ / Até R$) w-100 cada',
          '2 Buttons (Filtrar / Exportar Download)',
        ],
        gap: 'Botão "Filtrar" sem onClick',
        gap2: 'Botão "Exportar" sem onClick',
        gap3: 'Status filter omite "awaiting" mas KPI mostra count=12',
      },

      chargebacksTable: {
        wrapper: 'Card + native HTML <table> w-full text-sm',
        eightColumns: [
          'ID — font-mono xs',
          'Merchant — Link → AdminIntMerchantProfile?id={merchantId} — text-link hover:underline',
          'Valor — text-right font-medium formatCurrency',
          'Bandeira — text-secondary',
          'Motivo — text-secondary',
          {
            header: 'Prazo',
            cell: 'IF deadline!=="-" → flex items-center gap-1 + IF urgent → "🔴 + {deadline}" text-error font-medium / ELSE just deadline / ELSE "-"',
          },
          {
            header: 'Status',
            cell: 'Badge + status==="won" → "🟢" / status==="lost" → "🔴" / + label',
          },
          {
            header: 'Ações (text-center)',
            cells: [
              'Eye ghost sm — gap: SEM onClick',
              'CONDICIONAL status==="open" → FileText ghost sm → toast.info("Abrindo defesa...")',
            ],
          },
        ],
      },

      paginationFooter: {
        wrapper: 'flex items-center justify-between mt-4 pt-4 border-t',
        leftText: '"Mostrando 1-50 de 234"',
        rightControls: [
          'Button outline sm "◀ Anterior" disabled',
          '"Página 1 de 5" px-3 py-1 sm',
          'Button outline sm "Próxima ▶" — gap: SEM onClick',
        ],
      },

      knownGapsChargebacks: [
        'Eye action SEM onClick',
        'Filtros NÃO aplicam (Filtrar SEM onClick)',
        'Exportar SEM onClick',
        'Paginação Próxima SEM onClick',
        'Status filter omite "awaiting" mas KPI mostra count=12',
        'Defender via toast.info — não abre Modal/Drawer real',
        'Link merchant Página 1 de 5 hardcoded',
        'CSS Vars usadas EM TODA a página — risco em dark mode',
        'Reason Code (10.4, 4853) presente nos mocks mas NÃO renderizado na tabela',
        'Sem indicação visual de dias restantes vs string deadline',
      ],
    },

    // ==========================================================================
    // SUB-DOC #3 — AdminIntMEDsList
    // ==========================================================================
    medsListMicroscopic: {
      role: 'PIX equivalente do Chargeback — MED (Mecanismo Especial de Devolução) regulamentado BACEN 7 dias',

      designSystemUseCSSVars: 'IDÊNTICO ao ChargebacksList — usa var(--color-*) em toda a página',

      sixMockMEDs: [
        { id: 'MED-001', merchant: 'Loja do João', amount: 500, reason: 'Fraude', bank: 'Nubank', deadline: '30/01/2026', status: 'open', urgent: true },
        { id: 'MED-002', merchant: 'Tech Store', amount: 350, reason: 'Erro Op.', bank: 'Itaú', deadline: '31/01/2026', status: 'open', urgent: true },
        { id: 'MED-003', merchant: 'Moda Fashion', amount: 200, reason: 'Fraude', bank: 'Bradesco', deadline: '02/02/2026', status: 'open', urgent: false },
        { id: 'MED-004', merchant: 'Loja do João', amount: 150, reason: 'Fraude', bank: 'Santander', deadline: '-', status: 'in_contest' },
        { id: 'MED-005', merchant: 'Tech Store', amount: 280, reason: 'Erro Op.', bank: 'BB', deadline: '-', status: 'won' },
        { id: 'MED-006', merchant: 'Moda Fashion', amount: 420, reason: 'Fraude', bank: 'Caixa', deadline: '-', status: 'lost' },
      ],

      fourStatusConfig: {
        open: 'Aberto (warning)',
        in_contest: 'Em Contestação (info)',
        won: 'Ganho (success)',
        lost: 'Perdido (error)',
        gap: 'Apenas 4 status — NÃO tem "awaiting" como Chargebacks',
      },

      pageHeader: {
        title: 'Gestão de MEDs (PIX)',
        breadcrumbs: '[Risco e Compliance → MEDs]',
      },

      fiveStatsRow: {
        wrapper: 'Card "Banknote + Resumo Geral" + Select w-120 período',
        layout: 'grid grid-cols-5 gap-4 — 1 a MENOS que Chargebacks (sem Aguardando)',
        fiveStats: [
          'MED Rate — 0.02% (success + 🟢 OK)',
          'Abertos — 8, R$2.100,00 (warning)',
          'Em Contestação — 5, R$1.500,00 (info)',
          'Ganhos — 13 (72%), R$3.200,00 (success)',
          'Perdidos — 5 (28%), R$1.000,00 (error)',
        ],
      },

      urgentMedsCard: {
        conditional: 'IF urgentMeds.length > 0',
        title: 'AlertTriangle red + "Prazos Urgentes (7 dias - Regulamentação BACEN)"',
        gapNoteworthy: 'Title cita "Regulamentação BACEN" — destaque legal vs Chargebacks que cita só "Próximos 3 dias"',
        eachAlert: {
          extraField: 'Adiciona Badge variant=outline com nome do BANCO entre amount e prazo',
          gap: 'Banco aparece como Badge no urgent mas como coluna text-secondary na tabela — inconsistente',
        },
      },

      filtersCard: {
        wrapper: 'Card → flex flex-wrap gap-3',
        twoFiltersAndTwoButtons: [
          'Período Select w-120 (7d/30d/90d)',
          'Status Select w-150 (Todos/Abertos/Em Contestação/Ganhos/Perdidos)',
          'Button outline "🔍 Filtrar"',
          'Button outline "Download Exportar"',
        ],
        gapVsChargebacks: 'Apenas 2 filtros vs Chargebacks que tem 7 — perda de granularidade. SEM filtro por Banco/Motivo/Valor',
      },

      medsTable: {
        wrapper: 'Card + native HTML table',
        eightColumns: [
          'ID — font-mono xs',
          'Merchant — Link → AdminIntMerchantProfile?id={merchantId}',
          'Valor — text-right font-medium formatCurrency',
          'Motivo — text-secondary',
          'Banco — text-secondary (substitui "Bandeira" do CB)',
          'Prazo — flex + 🔴 IF urgent',
          'Status — Badge (sem emoji prefix como CB tem)',
          'Ações — Eye + FileText IF status=open',
        ],
        gapVsChargebacks: 'NÃO tem paginação footer (Chargebacks tem) — mais simples',
      },

      knownGapsMEDs: [
        'Estrutura idêntica a Chargebacks mas com 4 status (sem awaiting)',
        'Apenas 2 filtros (vs 7 em Chargebacks) — perda de granularidade',
        'Sem paginação footer (Chargebacks tem 1-50 de 234)',
        'Sem coluna BIN/Bandeira (PIX não tem, mas falta MerchantBank na coluna principal)',
        'Banco como Badge no urgent mas text-secondary na tabela — inconsistência',
        'Status Badge sem emoji prefix (Chargebacks tem 🟢/🔴)',
        'Eye SEM onClick',
        'Filtrar e Exportar SEM onClick',
        'Reason Code não documentado (PIX usa "Fraude" e "Erro Op." sem códigos BACEN)',
      ],
    },

    // ==========================================================================
    // SUB-DOC #4 — AdminIntBlockages (mais minimalista)
    // ==========================================================================
    blockagesMicroscopic: {
      role: 'Holdbacks / Bloqueios manuais de saldo merchant — operação punitiva ou preventiva',

      threeMockData: [
        { merchant: 'Fashion Mall', type: 'risk', amount: '85000', reason: 'VDMP Program', date: '15/12/2025' },
        { merchant: 'Games Online', type: 'risk', amount: '25000', reason: 'High CB Ratio', date: '20/12/2025' },
        { merchant: 'Loja XYZ', type: 'chargeback', amount: '12350', reason: 'CB-00456', date: '10/01/2026' },
      ],

      pageHeader: {
        title: 'Bloqueios Ativos',
        subtitle: 'Gestão de Bloqueios e Holdbacks',
        breadcrumbs: '[Retenção (page=AdminIntRetention) → Bloqueios (page=#)]',
        gapBreadcrumbs: 'AdminIntRetention é página inexistente. Bloqueios atual aponta page="#" — sem rota válida',
        actions: 'Button bg-red-600 "Novo Bloqueio" Lock → setShowNewBlockage(true)',
      },

      dataTable: {
        wrapper: 'Card → CardContent pt-6 → DataTable',
        sixColumns: [
          'Merchant',
          'Tipo — cell=StatusBadge component',
          'Valor — cell `R$ ${parseInt(value).toLocaleString(pt-BR)}` (gap: parseInt perde decimais. NÃO formatCurrency)',
          'Motivo',
          'Desde — date string',
          {
            header: 'Ações',
            twoButtons: [
              'Eye (ghost sm) — gap: SEM onClick',
              'Unlock outline (text-green-600) "Liberar" — gap: SEM onClick',
            ],
          },
        ],
      },

      newBlockageSideDrawer: {
        wrapper: 'SideDrawer + icon Lock + iconClassName="bg-red-100 text-red-600"',
        title: 'Novo Bloqueio',
        description: 'Criar bloqueio de saldo para um merchant',

        fiveFields: [
          {
            field: 'Merchant *',
            type: 'Select',
            options: ['Fashion Mall', 'Games Online', 'Loja XYZ'],
            gap: 'options HARDCODED — não vem de entidade Subaccount',
          },
          {
            field: 'Tipo de Bloqueio *',
            type: 'Select',
            fiveOptions: ['risk — Risco', 'chargeback — Chargeback', 'fraud — Fraude', 'compliance — Compliance', 'judicial — Judicial'],
          },
          {
            field: 'Valor a Bloquear (R$) *',
            type: 'Input number',
            placeholder: '0,00',
          },
          {
            field: 'Motivo / Referência *',
            type: 'Input',
            placeholder: 'Ex: CB-00456, VDMP Program...',
          },
          {
            field: 'Justificativa Detalhada *',
            type: 'Textarea rows=4',
            placeholder: 'Descreva o motivo do bloqueio...',
          },
        ],

        warningBox: {
          wrapper: 'p-3 bg-red-50 border border-red-200 rounded-lg sm text-red-700',
          text: '⚠️ O valor será retido do saldo disponível do merchant imediatamente.',
        },

        footer: {
          twoButtons: [
            'Cancelar — outline → setShowNewBlockage(false)',
            'Criar Bloqueio — bg-red-600 + Lock → toast.success("Bloqueio criado!") + close',
          ],
          gap: 'Sem validação dos 5 campos required* — pode salvar tudo vazio',
          gap2: 'Warning box informa "imediatamente" mas execução é toast-only — não persiste',
        },
      },

      knownGapsBlockages: [
        'Breadcrumb aponta para página inexistente (AdminIntRetention)',
        'Página minúscula (113 lines) — SEM stats summary, SEM filtros, SEM busca',
        'Action Eye SEM onClick',
        'Action Liberar (Unlock) SEM onClick — botão crítico funcionalmente vazio',
        'Validação 5 fields required SEM enforcement',
        'parseInt no Valor perde decimais',
        'Merchant select hardcoded com 3 opções',
        'Sem campo de validade do bloqueio (tempo determinado vs permanente)',
        'Sem audit log de quem criou/liberou',
        'Sem distinção entre "Bloquear total" vs "Holdback parcial"',
        'Toast warning "imediatamente" mas sem ação real',
      ],
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      preChargebacks: 'pages/AdminIntPreChargebacks.jsx (143 linhas)',
      chargebacks: 'pages/AdminIntChargebacksList.jsx (259 linhas — usa CSS vars)',
      meds: 'pages/AdminIntMEDsList.jsx (217 linhas — usa CSS vars)',
      blockages: 'pages/AdminIntBlockages.jsx (113 linhas — minimalista)',
    },

    backendIntegrationMap: {
      preChargebacks: 'NENHUMA — alerts[3 mocks Ethoca/Verifi]',
      chargebacks: 'NENHUMA — chargebacks[6] + statusConfig + stats hardcoded',
      meds: 'NENHUMA — meds[6] + statusConfig + stats hardcoded',
      blockages: 'NENHUMA — data[3 mocks]',
    },

    componentReuse: {
      DataTable: 'PreChargebacks + Blockages (não Chargebacks/MEDs que usam native HTML)',
      StatusBadge: 'Blockages (Tipo column)',
      SideDrawer: 'PreChargebacks (Ação) + Blockages (Novo Bloqueio)',
      nativeHTMLTable: 'Chargebacks + MEDs — assimetria com PreChargebacks/Blockages',
      cssVariables: 'Chargebacks + MEDs (var(--color-*)) — únicas duas páginas com tokens',
    },

    crossPageRelationships: {
      chargebacks_to_merchant: 'Link col Merchant → AdminIntMerchantProfile?id={merchantId} (FUNCIONAL)',
      meds_to_merchant: 'Link col Merchant → AdminIntMerchantProfile?id={merchantId} (FUNCIONAL)',
      blockages_breadcrumb_broken: 'Breadcrumb → AdminIntRetention (inexistente)',
      preChargebacks_no_merchantLink: 'PreChargebacks merchant column NÃO tem Link — apenas string',
    },

    knownGapsCrossPage: [
      'NENHUMA das 4 tem integração SDK base44 — totalmente mockadas',
      'Chargebacks usa native HTML table; PreChargebacks usa DataTable — duas estruturas diferentes para conceito similar',
      'CSS vars usadas APENAS em Chargebacks/MEDs — outras 2 usam Tailwind direto',
      'PreChargebacks tem urgency dot pulse mas Chargebacks NÃO tem (apenas emoji 🔴)',
      'Status enum não compartilhado: Chargebacks 5 status (open/in_defense/awaiting/won/lost), MEDs 4 (open/in_contest/won/lost), PreChargebacks 0 enum',
      'Reason Code (10.4, 4853, 4837) presente em mocks mas só PCB renderiza na tabela',
      'Filtros assimétricos: Chargebacks=7, MEDs=2, Blockages=0, PreChargebacks=0',
      'Botões críticos sem onClick: Eye (todas), Liberar (Blockages), Filtrar/Exportar (Chargebacks/MEDs)',
      'Win Rate NÃO mostrado em Chargebacks/MEDs apesar do RiskDashboard exibir 68%/72%',
      'Sem export CSV/Excel real apesar de botão "Exportar" em Chargebacks/MEDs',
      'Sem fluxo de "Aceitar perda" formal (apenas Ignorar em PCB)',
      'Sem upload de evidências no fluxo de Defesa (toast só abre placeholder)',
    ],
  },
};

export default AdminIntDisputesAndBlockagesDoc;