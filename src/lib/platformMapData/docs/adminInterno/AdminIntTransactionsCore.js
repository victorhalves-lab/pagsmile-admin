// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — TRANSAÇÕES CORE (Admin Interno) — Parte 1/2
// Fidelidade absoluta a 3 páginas centrais (~1.230 linhas):
//  - AdminIntTransactionsDashboard.jsx (437 linhas)
//  - AdminIntTransactionsList.jsx (414 linhas)
//  - AdminIntTransactionDetail.jsx (380 linhas)
// ============================================================================

export const AdminIntTransactionsCoreDoc = {
  pageId: 'AdminIntTransactionsCore',
  pagePaths: [
    '/AdminIntTransactionsDashboard',
    '/AdminIntTransactionsList',
    '/AdminIntTransactionDetail',
  ],
  module: 'Admin Interno',
  section: 'Transações — Core (Dashboard + Listagem + Detalhe)',

  explainer: {
    oneLiner:
      'Trio de páginas que forma a espinha dorsal de transações: (1) Dashboard com Insights Banner gradient navy "Powered by AI" mostrando 3 InsightCards (TPV +18% acima média / BIN 4111XX recusa +15% c/ action "Investigar" / Ticket Médio +8%) + 6 KPICards (TPV R$2.8M c/ size=large + Transações 18.5K + Aprovação 87.3% + Recusadas 2.4K + Ticket R$151 + Chargebacks 0.12%) + 4 Tabs (Overview AreaChart Cartão+PIX 12 horas c/ linearGradients + PieChart Mix 4 métodos com legenda lateral — Card 4 KPIs + 5 barras Aprovação por Bandeira c/ cores brand hex hardcoded — PIX 3 cards gradient In/Out/Saldo + 4 KPIs + BarChart "Entrada vs Saída" — Declines 4 KPIs + 5 Top Motivos coloridos); (2) List com 3 Tabs (Todas/PIX/Cartão) + KPIs CONDICIONAIS por tab (6/5/6 cards) + Search "Ctrl+K" placeholder + 2 Selects + tabela 8-col com Link tx → Detail e merchant → MerchantProfile + DropdownMenu 4 ações + paginação numérica 1-5; (3) Detail com Header Card 4-grid (Valor/Método/Merchant/Pagador) + 4 Action Buttons + DropdownMenu Mais Ações + 7 Tabs (Dados c/ 2 cards / Pagador c/ Reveal Drawer + 5 fields todos masked HARDCODED / Pagamento conditional credit_card vs pix / Antifraude Score 15/100 + barra + 5 Analysis Data hardcoded / Processing 6 acquirer fields / Timeline 8 eventos formato HH:MM:SS.mmm c/ emojis 🆕🔍✅📤📥🔄📧✅ TODA HARDCODED / Notas vazia) + 2 SideDrawers (Refund c/ Radio Total/Parcial inline Input + Select 6 motivos + warning vermelho / Reveal c/ Select 4 motivos + warning amber + "auditoria"). PALETA 7 cores KPICard. Status enum 6 valores. Reveal NÃO desmascara após "Revelar" — auditoria fake.',

    dashboardMicroscopic: {
      role: 'Dashboard analítico em tempo real para diagnóstico de processamento — 4 lentes (Overview/Card/PIX/Declines)',
      pageHeader: {
        title: 'Dashboard de Transações',
        subtitle: 'Visão em tempo real do processamento',
        breadcrumbs: '[Transações → Dashboard]',
        actions: 'Badge "Tempo Real" emerald c/ pulse + Button "Hoje" + RefreshCw — TODOS sem onClick',
      },
      insightsBanner: {
        wrapper: 'Card gradient #002443 → #003459 text-white',
        threeCards: [
          'success TrendingUp — "TPV 18% acima da média" + projeção R$ 3.2M',
          'warning AlertTriangle — "BIN 4111XX recusas altas" +15% 3h + action "Investigar"',
          'info DollarSign — "Ticket médio +8%" eletrônicos',
        ],
        gap: 'actionLabel "Investigar" SEM onClick — só hover:underline',
      },
      sixMainKPIs: {
        cards: [
          'TPV Hoje R$2.8M emerald +18% size=large',
          'Transações 18.5K blue +12% subtitle 324 tx/min',
          'Aprovação 87.3% emerald +0.5%',
          'Recusadas 2.4K red -2% subtitle 12.7%',
          'Ticket Médio R$151 purple +8%',
          'Chargebacks 0.12% amber subtitle "Dentro do limite"',
        ],
        kpiCardPalette: '7 cores (emerald/blue/red/amber/purple/teal/indigo) cada com bg+icon+border',
      },
      fourTabs: {
        overview: {
          volumeAreaChart: 'AreaChart 12 pontos 00-22 c/ linearGradients colorCartao #3B82F6 / colorPix #14B8A6',
          mixPieChart: 'PieChart innerRadius 50 outerRadius 80 + 4 segments (Crédito 52% / Débito 16% / PIX 30% / Boleto 2%)',
        },
        card: {
          fourSubKPIs: 'TPV Cartão R$1.9M / Aprovação 87.8% / 3DS 78% / Antifraude 2.1%',
          approvalByBrand: '5 brands com cores hex: Visa #1A1F71 / Mastercard #EB001B / Elo #00A4E0 / Amex #006FCF / Hipercard #B3131B',
          gap: 'Brand colors hardcoded mas BARRA usa cor por threshold (≥88 emerald / ≥85 amber / else red) — discrepância',
        },
        pix: {
          threeGradientCards: 'PIX Entrada R$820K emerald / PIX Saída R$30K red / Saldo Líquido R$790K blue',
          gap: 'Saldo Líquido R$790K hardcoded (não calcula 820-30)',
          fourKPIs: 'TPV PIX R$850K / Conversão 92% / Tempo 8s / QR Expirados 4.2%',
          barChart: 'BarChart 6 horas — labels "Entrada vs Saída" mas dataKeys "gerados/pagos" — inconsistente semanticamente',
        },
        declines: {
          fourKPIs: 'Total 2.4K / Taxa 12.7% / Soft 68% / Hard 32%',
          fiveTopReasons: [
            'Saldo Insuficiente 35% 3.240 #EF4444',
            'Cartão Inválido 18% 1.665 #F97316',
            'Senha Incorreta 12% 1.110 #EAB308',
            'Suspeita de Fraude 8% 740 #8B5CF6',
            'Limite Excedido 7% 648 #EC4899',
          ],
          gap: 'Soma 80% — restante 20% não documentado',
        },
      },
      footerLink: 'flex justify-center → Link AdminIntTransactionsList → Button outline Eye "Ver Lista Completa de Transações"',
      knownGapsDashboard: [
        'Botões "Hoje" / RefreshCw / Investigar SEM onClick',
        'Insights Banner hardcoded — não vem de IA real',
        'Saldo Líquido R$790K hardcoded (não calcula)',
        'PIX BarChart label "Entrada vs Saída" não casa com dataKeys gerados/pagos',
        'Top Motivos pct soma 80%',
        'Brand colors mock mas barras usam threshold colors',
      ],
    },

    listMicroscopic: {
      role: 'Lista operacional com tabs reativos que reescrevem KPIs dinamicamente conforme método selecionado',
      backendIntegration: "import { mockTransactions } from '@/components/mockData/adminInternoMocks'",
      stateAndFilters: {
        searchTerm: 'string c/ Ctrl+K (label only — sem keybind real)',
        activeTab: 'all/pix/card default all',
        period: 'today/yesterday/7d/30d/month — gap: NÃO entra no filter',
        selectedStatus: 'all/approved/refused/pending/chargeback (omite processing/refunded)',
        currentPage: 'number',
        itemsPerPage: '25 fixed (Select w-120 não atualiza state real)',
        filterLogic: 'matchSearch (id||document||external_reference) AND matchStatus AND matchTab',
      },
      threeTabsWithDynamicKPIs: {
        all: '6 KPIs (TPV/Trans/Aprov/Recusadas/Pendentes/Ticket)',
        pix: '5 KPIs (TPV PIX/Trans PIX/Conversão/Tempo 8s hardcoded/Ticket)',
        card: '6 KPIs (TPV Cartão/Trans/Aprov/Chargebacks 12 hardcoded/3DS 78% hardcoded/Antifraude 2.3% hardcoded)',
      },
      transactionsTable: {
        eightColumns: [
          'ID/Referência — Link Detail font-mono [#2bc196] + tx.id.slice(0,12)... + IF external_reference → "Ref: {ref}" 10px',
          'Data — toLocaleDateString + toLocaleTimeString c/ second',
          'Merchant — Link MerchantProfile + ID',
          'Pagador — avatar User + name||payer_name + document||email truncate',
          'Valor — formatCurrency + IF installments>1 → "Nx" 10px',
          'Método — paymentMethodConfig 4 (credit_card/debit_card/pix/boleto) + brand opacity-70',
          'Status — statusConfig 6 (approved/refused/pending/processing/chargeback/refunded)',
          'Ações — Eye Link Detail + DropdownMenu 4 items (Ver/Copiar/Estornar conditional/Reenviar Webhook) — TODOS items SEM onClick',
        ],
      },
      paginationFooter: {
        leftControls: 'Anterior disabled IF page=1 + numeric pages [1..min(5, totalPages)] + Próxima disabled IF page=totalPages',
        rightSelect: '"25 por pág" — gap: NÃO atualiza itemsPerPage',
        gap: 'Pagination sem ellipsis para >5 páginas',
      },
      knownGapsList: [
        'Period select sem efeito no filter',
        'Select "25 por pág" não atualiza state',
        'Search Ctrl+K placeholder sem listener',
        'Status select omite processing/refunded',
        'DropdownMenu items todos SEM onClick',
        'Botões Exportar/Atualizar SEM onClick',
        'Cards hardcoded em Tab Cartão (Chargebacks/3DS/Antifraude)',
        'PIX Tempo Médio 8s hardcoded',
        'KPICard component duplicado vs Dashboard',
      ],
    },

    detailMicroscopic: {
      role: 'Drill-down completo de uma transação — 7 abas + 2 ações modais (estorno/reveal) com auditoria',
      pageEntry: {
        urlParam: 'searchParams.get(id)',
        fallback: "tx = mockTransactions.find(t => t.id === txId) || mockTransactions[0]",
        gap: 'Fallback silencioso para [0] sem 404',
      },
      pageHeader: {
        title: '{tx.id}',
        subtitle: 'Detalhes da Transação',
        breadcrumbs: '[Transações → Lista (page=AdminIntTransactionsList) → {tx.id}]',
        actionElement: 'ArrowLeft "Voltar à Lista"',
      },
      headerCard: {
        topRow: 'h2 2xl tx.id + StatusBadge',
        fourGrid: [
          'VALOR — formatCurrency xl + IF installments → "Nx {amount/N}"',
          'MÉTODO — pix "◉ PIX" / credit/debit "💳 {brand}"',
          'MERCHANT — Link MerchantProfile + ID',
          'PAGADOR — name + font-mono "***. ***.***-**" HARDCODED MASK',
        ],
        actionButtons: [
          'CONDITIONAL approved → "Estornar" → setRefundModal(true)',
          '"Copiar Dados" → navigator.clipboard.writeText(tx.id) + toast (gap: copia só ID)',
          '"Reenviar Webhook" → toast.success',
          'DropdownMenu "Mais Ações" → 3 items (Comprovante/Abrir Merchant/Adicionar Nota) — TODOS sem onClick',
        ],
      },
      sevenTabs: {
        dados: '2 cards: Identificadores (5 lines) + Valores (5 lines com Taxa formatCurrency + %, Líquido green, Moeda BRL hardcoded)',
        pagador: {
          revealButton: 'Eye "Revelar Dados" → setRevealModal(true)',
          fiveFieldsAllMasked: [
            'Nome → customer.name',
            'CPF/CNPJ → "***. ***.***-**" hardcoded (não respeita format CPF/CNPJ)',
            'E-mail → "j***@email.com" hardcoded',
            'Telefone → "(11) 9****-1234" hardcoded',
            'IP → 189.123.456.789 NÃO MASCARADO (PII!)',
          ],
        },
        pagamento: {
          conditionalByMethod: '5 fields IF credit/debit (Bandeira/last4/Portador "JOAO DA SILVA" hardcoded/Parcelas) / 3 fields IF pix (End-to-End ID) / fallback "Não disponível"',
        },
        antifraude: {
          scoreBox: 'bg-green + Status 🟢 APROVADO + Score 15/100 (Baixo) + barra width 15% + 4 labels Baixo/Médio/Alto/Crítico',
          fourMetadata: 'Provider ClearSale / ID CS-987654321 / Tempo 1.2s / Decisão automática Sim — TUDO HARDCODED',
          fiveAnalysisData: 'IP comprador / Device ID / Device Score / Histórico CPF (5 compras 30 dias) / Velocidade 1 tx/hora — TUDO HARDCODED',
        },
        processing: '6 fields acquirer (Adquirente/NSU/Auth Code/TID/Return Code 00/Mensagem) com fallbacks hardcoded mascarando ausência',
        timeline: {
          eightHardcodedEvents: [
            '14:32:45.123 🆕 TRANSACTION_CREATED — Origem API v2 IP 189.123.456.789',
            '14:32:45.456 🔍 ANTIFRAUD_STARTED — Provider ClearSale',
            '14:32:46.789 ✅ ANTIFRAUD_APPROVED — Score 15 Tempo 1.2s',
            '14:32:47.012 📤 SENT_TO_ACQUIRER — Adquirente Cielo',
            '14:32:48.345 📥 AUTHORIZATION_RECEIVED — Código ABC123 NSU 123456789 00 Aprovada',
            '14:32:48.678 🔄 STATUS_CHANGED — PENDING → APPROVED',
            '14:32:49.000 📧 WEBHOOK_SENT — 200 OK 0.3s',
            '14:33:00.000 ✅ CAPTURE_CONFIRMED — Valor R$ 299,00',
          ],
          gap: 'Timeline 100% HARDCODED — mesma para qualquer tx (não lê tx.timeline)',
        },
        notas: '"+ Adicionar Nota" sem onClick + "Nenhuma nota registrada"',
      },
      refundSideDrawer: {
        title: 'Estornar Transação',
        topInfo: 'Transação tx.id + Valor disponível formatCurrency(amount)',
        refundTypeRadio: '2 options Total/Parcial inline Input — Input parcial só aparece após selecionar radio',
        reasonSelect: '6 motivos (customer_request/not_delivered/defect/fraud/operational/other)',
        warningBox: '"⚠️ Esta ação não pode ser desfeita."',
        footer: 'Cancelar + Confirmar bg-red-600 → toast.success + close',
        gap: 'Footer NÃO valida tipo+motivo+valor — sempre processa',
      },
      revealSideDrawer: {
        title: 'Revelar Dados do Pagador',
        warningBox: '"⚠️ Esta ação será registrada em auditoria."',
        reasonSelect: '4 motivos (support/fraud/legal/other)',
        footer: 'Cancelar + "Revelar e Registrar" → toast.success + close',
        gap: 'Após "Revelar e Registrar" os dados na Tab Pagador continuam mascarados — auditoria fake',
        gap2: 'Motivo não é required',
      },
      knownGapsDetail: [
        'Fallback silencioso para [0] sem 404',
        'Mask hardcoded sem respeitar CPF/CNPJ format',
        'IP NÃO mascarado mesmo sendo PII',
        'Antifraude TUDO hardcoded (Score/Provider/Device)',
        'Timeline 100% HARDCODED — não lê tx.timeline',
        'Refund parcial sem validação amount<=tx.amount',
        'Refund footer ignora form — sempre processa',
        'Reveal não desmascara após "Revelar e Registrar"',
        'Reveal motivo não required',
        '"Mais Ações" DropdownMenu 3 items SEM onClick',
        '"+ Adicionar Nota" SEM onClick',
        'Copiar Dados copia só tx.id (label engana)',
        'Updated_date usa tx.date',
        'Portador "JOAO DA SILVA" hardcoded',
      ],
    },
  },

  technical: {
    fileLocations: {
      dashboard: 'pages/AdminIntTransactionsDashboard.jsx (437 linhas — Recharts heavy)',
      list: 'pages/AdminIntTransactionsList.jsx (414 linhas)',
      detail: 'pages/AdminIntTransactionDetail.jsx (380 linhas)',
    },
    backendIntegrationMap: {
      dashboard: 'NENHUMA — todos os mocks internos',
      list: "import { mockTransactions } from '@/components/mockData/adminInternoMocks'",
      detail: 'mesmo mockTransactions + searchParams',
      gap: 'Nenhuma SDK base44.entities.Transaction',
    },
    componentReuse: {
      KPICard: 'INLINE 3x duplicado em Dashboard+List (7 vs 6 cores) + Orchestration/BIN/Retry',
      InsightCard: 'Apenas Dashboard — 4 types (success/warning/info/danger)',
      StatusBadge: 'Detail usa shared common; List INLINE statusConfig 6 entradas',
      paymentMethodConfig: 'INLINE em List apenas',
      SideDrawer: 'Detail (2x) — Refund + Reveal',
    },
    crossPageRelationships: {
      dashboard_to_list: 'Footer "Ver Lista Completa" → AdminIntTransactionsList',
      list_to_detail: 'Coluna ID + Eye → AdminIntTransactionDetail?id={tx.id}',
      list_to_merchant: 'Coluna Merchant → AdminIntMerchantProfile?id={merchant_id}',
      detail_to_list: '"Voltar à Lista" + breadcrumb',
      detail_to_merchant: 'Header MERCHANT field → MerchantProfile',
    },
    knownGapsCrossPage: [
      'KPICard duplicado em 3+ páginas com paletas diferentes',
      'mockTransactions única fonte — NENHUMA SDK',
      'StatusConfig/PaymentMethodConfig duplicados (inline vs common)',
      'Detail timeline 100% hardcoded mesmo tendo tx.timeline na entidade',
      'Antifraude tab toda hardcoded',
      'PII masks sem format CPF/CNPJ',
      'Reveal Drawer não desmascara — auditoria fake',
      'Refund Drawer não valida amount',
      'Period select em List sem efeito',
    ],
  },
};

export default AdminIntTransactionsCoreDoc;