// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — FINANCEIRO OPS (Admin Interno) — Parte 2/2
// Cobre as 6 páginas operacionais/transacionais do módulo Financeiro:
//   - AdminIntSettlements.jsx          (218 linhas) — Liquidações em lote
//   - AdminIntWithdrawals.jsx          (293 linhas) — Saques com SideDrawer Detail+Reject
//   - AdminIntWithdrawalApprovals.jsx  (406 linhas) — Aprovação manual COM SDK REAL
//   - AdminIntAnticipations.jsx        (192 linhas) — Antecipações
//   - AdminIntStatements.jsx           (163 linhas) — Extratos por Merchant
//   - AdminIntBalanceManagement.jsx    (267 linhas) — Gestão de Saldos com 2 Dialogs
// ============================================================================

export const AdminIntFinancialOpsDoc = {
  pageId: 'AdminIntFinancialOps',
  pagePaths: [
    '/AdminIntSettlements',
    '/AdminIntWithdrawals',
    '/AdminIntWithdrawalApprovals',
    '/AdminIntAnticipations',
    '/AdminIntStatements',
    '/AdminIntBalanceManagement',
  ],
  module: 'Admin Interno',
  section: 'Financeiro — Operações (Liquidações + Saques + Aprovações + Antecipações + Extratos + Saldos)',

  explainer: {
    oneLiner:
      'Sexteto operacional do back-office financeiro com TRANSAÇÕES REAIS de dinheiro — todas com toast.success fake exceto WithdrawalApprovals: (1) Settlements 218L 100% mock com 3 Tabs (Agenda 5 settlements c/ Checkbox seletivo só para "pending" + 4 stats summary + DropdownMenu 3 ações condicional por status + barra inferior "Selecionados N (R$X)" com Button Executar Liquidação / Execute placeholder vazio / History placeholder vazio), 6 statusConfig com emojis ⏳🟡🔵🟢🔴🟠; (2) Withdrawals 293L 100% mock com 5 stats coloridos + Filtros 2 Selects + DataTable nativa 8-col com 3 ações condicionais (Eye sempre / Check verde só pending → toast / X red só pending → setRejectModal), 2 SideDrawers (Detail size=lg com 3 cards Dados+Saldo+Validações 4 checks SEMPRE green hardcoded + footer Aprovar/Rejeitar / Reject icon AlertTriangle red com Select 5 motivos + Textarea — gap: Select sem state, validação de motivo "obrigatório" no label mas não bloqueia submit), 5 statusConfig (pending/approved/processing/processed/rejected); (3) WithdrawalApprovals 406L COM SDK REAL useQuery em WithdrawalApproval entity + useMutation update com base44.auth.me, é a ÚNICA com persistência real, 3 stats (pendingCount / pendingValue / highRiskCount risk_score>70) com cards condicionais (yellow se highRisk>0 muda border + bg), Table com 9-col incluindo Risco Badge (>70 red / >40 yellow / else green) + Destino com QrCode/Landmark dependendo de pix_key, SideDrawer Review size=lg com 3 cards (Cliente+Motivo Manual / 3 cards valor Bruto+Taxa+Líquido / Conta destino) + Risk Flags array em red + 2 Big Buttons Aprovar (green) / Rejeitar (red) com state visual, Textarea Comments (asterisco condicional para rejeitar mas SEM validação real); (4) Anticipations 192L 100% mock com 5 stats (Disponível R$5.2M / Antecipado Hoje R$1.8M / Pendentes 3 / Receita Mês R$36K / Taxa 1.95% a.m.) + 3 Tabs (Requests com tabela 8-col c/ ações condicionais Check/X só pending toast / Agenda placeholder vazio / History filter status=processed); (5) Statements 163L 100% mock com Card seletor merchant (Input search + Select 3 hardcoded — gap: state mas não filtra) + Card "MERCHANT: Loja do João" hardcoded com Period filter 2 datepickers + Type select + Button Gerar Extrato (sem onClick) + 4 summary cards (Entradas/Saídas/Saldo Inicial/Saldo Final) + tabela 4-col com ArrowUpRight/ArrowDownRight + saldo running, typeLabels declarado mas não usado; (6) BalanceManagement 267L 100% mock com 5 stats incluindo "Negativo" red+count + tabela 6-col com saldo negativo destacado red + 3 ações Eye/PlusCircle/Lock, 2 Dialog modals (Adjust com radio Crédito/Débito + Input value + Select 6 motivos + Textarea + warning amber "registrado em auditoria com seu usuário" / Block com Input + Select 5 motivos chargeback/fraud/compliance/legal/other + Textarea — ambos toast e fecham sem validação). PADRÃO TOXIC: 5/6 PÁGINAS USAM toast FAKE (apenas WithdrawalApprovals tem persistência real).',

    settlementsMicroscopic: {
      role: 'Liquidações em lote — seleção múltipla com checkbox para executar batch',
      backendIntegration: 'NENHUMA — 5 mocks settlements + statusConfig 6 entradas',
      pageHeader: {
        title: '"Liquidações"',
        breadcrumbs: '[Financeiro → Liquidações]',
        actions: 'NENHUMA',
      },
      threeTabs: {
        agenda: {
          filtersCard: '3 controles (Select today default/tomorrow/7d w-140 + Select Merchant w-180 placeholder + Button "Filtrar") — gap: NENHUM tem onValueChange efetivo',
          summary4: 'Total / Merchants Set count / Transações sum / Média/Merchant calculada',
          tableNative: {
            columns: '8 cols (Checkbox sel / Data / Merchant Link → MerchantProfile blue / Transações center / Bruto right / Líquido right bold / Status Badge com emoji / Ações DropdownMenu)',
            checkboxLogic: 'disabled IF status !== "pending" — selectAll com array de IDs pending toggle inversão',
            dropdownMenu: 'Ver Detalhes (sem onClick) / IF pending → Executar (toast) + Reter (sem onClick) / IF held → Liberar (sem onClick)',
          },
          batchBar: 'IF selected.length > 0 → footer "Selecionados N (R$X)" + Button "Executar Liquidação" → toast.success + clear selected',
        },
        execute: 'placeholder vazio com Calendar icon + texto "Selecione as liquidações na aba Agenda para executar em lote"',
        history: 'placeholder vazio com Button Exportar (sem onClick) + texto "Nenhuma liquidação executada no período selecionado"',
      },
      statusConfig6: {
        scheduled: 'slate ⏳ Agendada',
        pending: 'yellow 🟡 Pendente',
        processing: 'blue 🔵 Processando',
        executed: 'green 🟢 Executada',
        error: 'red 🔴 Erro',
        held: 'orange 🟠 Retida',
      },
      knownGapsSettlements: [
        'Filtros (Select tempo/merchant/Button Filtrar) sem onValueChange',
        '"Ver Detalhes" do DropdownMenu sem onClick',
        '"Reter" / "Liberar" do DropdownMenu sem onClick',
        'Tab Execute / History são placeholders vazios',
        'Mock só tem 2 status (pending/scheduled) mas config define 6',
        'Executar é apenas toast — não persiste em entidade',
      ],
    },

    withdrawalsMicroscopic: {
      role: 'Lista operacional de saques pendentes — aprovar/rejeitar individualmente ou em lote',
      backendIntegration: 'NENHUMA — 4 mocks withdrawals + statusConfig 5 entradas',
      pageHeader: {
        title: '"Saques"',
        breadcrumbs: '[Financeiro → Saques]',
      },
      stats5: 'Pendentes yellow / Aprovados blue / Processados green / Rejeitados red / Total Hoje white com count + value formatCurrency cada',
      filtersCard: 'Select status (default pending) / Select período (default today, sem efeito) / Button Exportar (sem onClick)',
      tableNative: {
        columns: '8 cols (Checkbox sel / ID font-mono / Data/Hora / Merchant Link / Valor right bold / Taxa right slate / Status Badge com Icon / Ações 3 botões condicionais)',
        actions: [
          'Eye (sempre) → setDetailModal(w)',
          'IF pending: Check green → toast.success("Saque aprovado!")',
          'IF pending: X red → setRejectModal(w)',
        ],
        batchBar: 'IF selected.length > 0 → "Selecionados N" + Button "Aprovar em Lote" → toast + clear',
      },
      detailSideDrawer: {
        size: 'lg',
        icon: 'Eye',
        title: '"Detalhes do Saque #{id}"',
        content: '3 sub-cards: (1) Status Badge top / (2) grid 2-cols Dados do Saque + Saldo do Merchant / (3) Validações 4 checks SEMPRE green CheckCircle hardcoded ("Saldo disponível suficiente / Dentro do limite diário / Conta bancária verificada / Sem bloqueios ativos")',
        gap: '4 validações são static green — não validam dados reais',
        footer: 'IF status pending → Aprovar (toast) + Rejeitar (closes detail, opens reject) / ELSE null',
      },
      rejectSideDrawer: {
        icon: 'AlertTriangle iconClassName="bg-red-100 text-red-600"',
        title: '"Rejeitar Saque"',
        content: 'p informativo + Select 5 motivos (balance/limit/account/blocked/other) com label "(obrigatório)" + Textarea Observações',
        footer: 'Cancelar + Button bg-red-600 "Confirmar Rejeição" → toast + close',
        gap: 'Select sem onValueChange / "obrigatório" só visual, não bloqueia / não persiste',
      },
      knownGapsWithdrawals: [
        'Top Checkbox da tabela sem onCheckedChange',
        'Filtro period sem efeito',
        'Exportar sem onClick',
        'Aprovar individual ou em lote = toast fake',
        'Rejeitar SideDrawer Select sem state vinculado',
        'Validações no Detail são 4 checks green hardcoded',
        '"obrigatório" sem validação real',
      ],
    },

    withdrawalApprovalsMicroscopic: {
      role: 'Aprovação manual de saques sinalizados — única página da seção com persistência real',
      backendIntegration: {
        sdkCalls: [
          'base44.entities.WithdrawalApproval.filter({ status: "pending" }, "-created_date", 100)',
          'base44.entities.WithdrawalApproval.list("-created_date", 200)',
        ],
        mutation: 'base44.entities.WithdrawalApproval.update(id, { status, reviewed_by: user.email, reviewed_at: ISO, admin_comments }) com auth.me invalida queryKey',
      },
      pageHeader: {
        title: '"Aprovação de Saques"',
        subtitle: 'Revise e aprove saques que requerem validação manual',
        breadcrumbs: '[Financeiro → Aprovação de Saques]',
      },
      stats3: [
        'Aguardando Aprovação border-yellow-300 bg-yellow-50 / Clock yellow / count + value',
        'Alto Risco border CONDICIONAL (red se highRiskCount>0) / AlertTriangle red / risk_score>70',
        'Aprovados Hoje / CheckCircle green / count filter status=approved',
      ],
      table9Cols: [
        'Cliente — Building2 + business_name + document',
        'Valor right bold',
        'Taxa right red',
        'Líquido right green bold',
        'Destino — IF pix_key → QrCode green + bank_name + pix_key / ELSE → Landmark + Ag/Cc',
        'Motivo — approvalReasonLabels (5 high_value/first_withdrawal/new_bank_account/flagged_account/manual_request)',
        'Risco Badge condicional 3 levels (>70 red / >40 yellow / else green) com risk_score raw',
        'Solicitado em format dd/MM/yyyy HH:mm ptBR',
        'Botão "Revisar" → openReviewDialog',
      ],
      reviewSideDrawer: {
        size: 'lg',
        icon: 'ArrowUpFromLine',
        title: '"Revisar Solicitação de Saque"',
        description: 'Analise a solicitação e aprove ou rejeite',
        sections: [
          'Card grid 2-cols Cliente (business_name+doc) + Motivo Manual',
          '3 cards valor (Bruto bg-slate / Taxa bg-red / Líquido bg-green border-2 destacado)',
          'Conta de Destino com mesmo padrão pix_key vs agência',
          'Risk Flags array.map → AlertTriangle red items (condicional length>0)',
          'Decision Buttons grid 2-cols Aprovar (green se selected) / Rejeitar (red se selected) toggle visual',
          'Comments Textarea com label asterisco condicional "Comentários *" se rejected',
        ],
        footer: 'Cancelar + Button "Confirmar Decisão" disabled IF !decision || isPending / className verde se approved / vermelho se rejected',
        validation: 'handleReview valida !decision → toast.error("Selecione uma decisão") — NÃO valida comments mesmo se rejected',
      },
      knownGapsWithdrawalApprovals: [
        'Comments asterisco visual mas sem validação real (rejeitar sem comentário passa)',
        'risk_flags renderiza apenas se length>0 — undefined/null tudo OK',
        'Cards condicionais usam template literals, não cn() (consistência visual)',
        'Não exporta detalhes para auditoria — apenas grava admin_comments',
      ],
    },

    anticipationsMicroscopic: {
      role: 'Antecipação de recebíveis — solicitações pendentes + agenda + histórico',
      backendIntegration: 'NENHUMA — 4 mocks anticipations + statusConfig 4 entradas',
      pageHeader: {
        title: '"Antecipação"',
        breadcrumbs: '[Financeiro → Antecipação]',
      },
      stats5: [
        'Disponível p/ Antecip. R$5.2M blue',
        'Antecipado (Hoje) R$1.8M green',
        'Pendentes 3 yellow + value R$450K',
        'Receita (Mês) R$36K purple',
        'Taxa Média 1.95% a.m. white',
      ],
      threeTabs: {
        requests: {
          tableNative: '8-col com ID font-mono / Data / Merchant Link / Valor / Taxa red / Líquido green / Status Badge / Ações Eye + IF requested → Check (toast.success "aprovada") / X (toast.error "rejeitada")',
        },
        agenda: 'placeholder vazio com Calendar icon + "Visualização da agenda de recebíveis antecipáveis por merchant"',
        history: 'tabela 6-col reduzida (sem ações) com filter status=processed + Button Exportar sem onClick',
      },
      statusConfig4: 'requested yellow / approved blue / processed green / rejected red',
      knownGapsAnticipations: [
        'Eye sem onClick',
        'Tab Agenda placeholder vazio',
        'Aprovação/Rejeição é apenas toast — não persiste',
        'Não calcula taxa dinamicamente (sempre 1.95%)',
      ],
    },

    statementsMicroscopic: {
      role: 'Extrato/movimentação consolidada por merchant — visão de saldo running',
      backendIntegration: 'NENHUMA — 7 mocks movements com balance running + summary 4 valores',
      pageHeader: {
        title: '"Extratos"',
        breadcrumbs: '[Financeiro → Extratos]',
      },
      merchantSelector: 'Input search com state + Select 3 merchants hardcoded — gap: estado capturado mas não troca o card abaixo',
      cardMerchantStatement: {
        header: '"MERCHANT: Loja do João (ID: 12345)" — HARDCODED',
        periodFilter: '2 datepickers (De default 2026-01-01 / Até default 2026-01-28) + Select Type (all/credit/debit) + Button "Gerar Extrato" — gap: button sem onClick',
        summary4: 'Entradas R$125.430 green / Saídas R$98.750 red / Saldo Inicial R$15.320 / Saldo Final R$42.000 blue',
        movementsTable: '4-col (Data / Descrição / Valor com ArrowUpRight credit OR ArrowDownRight debit colorido / Saldo running)',
      },
      typeLabelsDeclared: '7 entries (SETTLEMENT/WITHDRAWAL/ANTICIPATION/CHARGEBACK/FEE/ADJUSTMENT_CREDIT/ADJUSTMENT_DEBIT) — gap: declarado mas NÃO usado em nenhum lugar do código',
      knownGapsStatements: [
        'Selector Input + Select sem efeito',
        'Card de merchant sempre mostra "Loja do João" hardcoded',
        'Button "Gerar Extrato" sem onClick',
        'typeLabels object morto (não usado)',
        'Não tem paginação para movements',
        'Datepickers sem onChange',
      ],
    },

    balanceManagementMicroscopic: {
      role: 'Gestão de saldos — visão consolidada com ajustes e bloqueios manuais (modais)',
      backendIntegration: 'NENHUMA — 4 mocks balances',
      pageHeader: {
        title: '"Gestão de Saldos"',
        breadcrumbs: '[Financeiro → Gestão de Saldos]',
      },
      stats5: [
        'Total Disponível green Math.max(0, available) sum',
        'Bloqueado orange + count merchants com blocked>0',
        'A Liquidar blue toSettle sum',
        'Negativo red value abs + count negativos',
        'Merchants c/ Saldo (filter available>0).length / total',
      ],
      filtersCard: 'Select 4 opções (all/positive/negative/blocked sem efeito) + Input search com state efetivo (filtra merchant + merchantId) + Button Exportar sem onClick',
      tableNative: {
        columns: '6-col (Merchant Link / Disponível right text-red-600 condicional negativo / Bloqueado orange OR "-" / A Liquidar blue / Total bold / Ações 3 botões)',
        actions: 'Eye (sem onClick) / PlusCircle → setAdjustModal / Lock → setBlockModal',
      },
      adjustModalDialog: {
        title: '"Ajuste de Saldo"',
        content: 'Info merchant + saldo / Radio Crédito vs Débito (state real adjustType) / Input number Valor (sem state) / Select 6 motivos correction/bonus/refund/fee/reconciliation/other (sem state) / Textarea (sem state) / Box amber AlertTriangle "registrado em auditoria com seu nome de usuário"',
        footer: 'Cancelar + Confirmar Ajuste → toast.success + close',
        gap: 'Apenas adjustType tem state — Input/Select/Textarea sem onValueChange',
      },
      blockModalDialog: {
        title: '"Bloquear Saldo" com Lock icon',
        content: 'Info merchant + saldo disponível / Input number / Select 5 motivos (chargeback/fraud/compliance/legal/other) / Textarea',
        footer: 'Cancelar + Button bg-orange-600 "Confirmar Bloqueio" → toast + close',
      },
      knownGapsBalanceManagement: [
        'Filtro Select 4 opções sem onValueChange',
        'Eye sem onClick',
        'Adjust Modal: Apenas radio com state, restante decorativo',
        'Block Modal: TODOS inputs sem state',
        'Sem validação de valor vs saldo disponível em ambos modais',
        'Box "registrado em auditoria" é cosmético — não há AuditLog real',
        'Botão Exportar sem onClick',
      ],
    },
  },

  technical: {
    fileLocations: {
      settlements: 'pages/AdminIntSettlements.jsx (218 linhas)',
      withdrawals: 'pages/AdminIntWithdrawals.jsx (293 linhas)',
      withdrawalApprovals: 'pages/AdminIntWithdrawalApprovals.jsx (406 linhas — único com SDK + Mutation)',
      anticipations: 'pages/AdminIntAnticipations.jsx (192 linhas)',
      statements: 'pages/AdminIntStatements.jsx (163 linhas)',
      balanceManagement: 'pages/AdminIntBalanceManagement.jsx (267 linhas)',
    },
    sdkUsageSummary: {
      noSdk: '5 páginas (Settlements, Withdrawals, Anticipations, Statements, BalanceManagement)',
      withSdk: '1 página (WithdrawalApprovals com 2 useQuery + 1 useMutation com auth.me)',
    },
    componentReuse: {
      SideDrawer: 'Withdrawals 2x (Detail + Reject) + WithdrawalApprovals 1x (Review)',
      DialogShadcn: 'BalanceManagement 2x (Adjust + Block)',
      tableNative: 'Settlements + Withdrawals + Anticipations + Statements + BalanceManagement (TODOS preferiram <table> nativa em vez de DataTable common)',
      tableShadcn: 'WithdrawalApprovals usa Table/TableRow do shadcn (única consistente)',
      sonnerToast: 'Importado em todas EXCETO Statements (única sem toast)',
    },
    statusConfigDuplication: {
      Settlements: '6 entries (scheduled/pending/processing/executed/error/held) com emoji 🟡🔵🟢🔴🟠⏳',
      Withdrawals: '5 entries (pending/approved/processing/processed/rejected) com Lucide icons',
      WithdrawalApprovals: '4 entries (pending/approved/rejected/processing) bg+text+border tailwind',
      Anticipations: '4 entries (requested/approved/processed/rejected) só bg+text',
      duplication: 'CADA página tem seu próprio statusConfig inline — NENHUM compartilhado com common/StatusBadge',
    },
    crossPageRelationships: {
      settlements_to_merchant: 'Coluna Merchant → AdminIntMerchantProfile?id={merchantId}',
      withdrawals_to_merchant: 'Idem',
      withdrawalApprovals_no_navigation: 'Apenas botão Revisar (abre Drawer)',
      anticipations_to_merchant: 'Idem',
      statements_to_no_merchant: 'Selector hardcoded — Link ausente',
      balanceManagement_to_merchant: 'Coluna Merchant → AdminIntMerchantProfile?id={merchantId}',
    },
    knownGapsCrossSection: [
      '5/6 páginas usam toast como ação fake — apenas WithdrawalApprovals persiste',
      'statusConfig duplicado 4x sem reuso',
      '5/6 páginas usam <table> nativa em vez de DataTable common',
      'Validações "obrigatório" são labels visuais sem bloqueio real',
      'Selects de período/filtro decorativos em quase todas',
      'Auditoria mencionada (boxes amber) mas não persiste em AuditLog entity',
      'Pages sem paginação (Settlements/Anticipations/Statements/BalanceManagement)',
    ],
  },
};

export default AdminIntFinancialOpsDoc;