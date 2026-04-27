// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBExtract (Internet Banking) — Entrega 15
// ----------------------------------------------------------------------------
// SEGUNDA página do módulo INTERNET BANKING — Extrato/Histórico Completo.
//
//   1. IBExtract.jsx (511 linhas) — Histórico completo de movimentações
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada principalmente pelo Botão "Ver Extrato" do IBHome (Link → IBExtract)
// - É a tela onde o merchant consulta o HISTÓRICO COMPLETO da conta digital
//   com filtros, busca, paginação e detalhamento por transação
// - Diferentemente do IBHome (vitrine visual com 5 mocks resumidos), o IBExtract
//   é o equivalente bancário tradicional (extrato detalhado por dia)
// - Identidade visual mais SOBRIA que o IBHome — sem hero card navy, sem blurs,
//   foca em listagem cinza/branca tipo "extrato bancário tradicional"
//
// IMPORTANTE — DIFERENÇA ARQUITETURAL CRÍTICA:
// - IBHome usa i18n COMPLETO (22 keys do namespace internet_banking)
// - IBExtract usa **ZERO i18n** — todas as strings em português HARDCODED
//   ("Extrato", "Histórico completo de movimentações", "Hoje", "Ontem",
//   "Saldo Inicial", "Saldo Final", "Entradas", "Saídas", "Pix Recebido",
//   "Pix Enviado", "Pagador", "Destinatário", labels dos Selects, etc.)
// - GAP ARQUITETURAL — duas páginas adjacentes do mesmo módulo com paradigmas
//   de internacionalização DIVERGENTES (similar aos gaps cromáticos dos agentes
//   IA do Admin Interno onde Hub e Settings divergem)
// ============================================================================

export const IBExtractDoc = {
  pageId: 'IBExtract',
  pagePaths: ['/IBExtract'],
  module: 'Internet Banking',
  section: 'Extrato — Histórico completo (segunda tela do módulo)',

  explainer: {
    oneLiner:
      'Tela de Extrato bancário tradicional do Internet Banking — 511 linhas 100% MOCK — segunda página mais densa do módulo IB e a primeira com **interatividade real funcional** (modal de detalhes que ABRE com onClick — diferente do IBHome onde cursor-pointer é morto). Estrutura em 4 grandes blocos verticais: (1) **Header simples** com título "Extrato" 2xl-bold + sublabel "Histórico completo de movimentações" — SEM saudação contextual (diferente do IBHome) SEM Badge de status SEM ícone — design ultra-minimal que reforça o tom "extrato bancário tradicional" / (2) **Card de Filtros horizontal** com 5 controles em flex-wrap: Calendar icon decorativo (não interativo) + Select Período 6 opts (Hoje / Últimos 7d / Últimos 30d default / Últimos 90d / Este mês / Personalizado — opção "Personalizado" SEM date picker associado, gap de UX) + Select Tipo 3 opts (Todos / Pix Enviado / Pix Recebido) + Select Direção 3 opts (Todos / Entradas / Saídas) — **REDUNDÂNCIA CRÍTICA**: Tipo e Direção são funcionalmente idênticos (Pix Enviado = Saídas / Pix Recebido = Entradas) — gap arquitetural onde 2 Selects controlam o mesmo conceito + Input Search com Search icon absolute placeholder "Buscar por nome, descrição..." controlado por searchQuery state + DropdownMenu Exportar com 3 itens (PDF / Excel-CSV / OFX — todos SEM onClick funcional, dead actions); flex-wrap permite responsividade mas resulta em layout quebrado em telas médias / (3) **4 KPI Cards Period Summary** grid-cols-2 lg:grid-cols-4: Saldo Inicial 60.430,50 (cinza neutro) / Saldo Final 125.430,50 (cinza neutro) / Entradas +250.000,00 (emerald-50 bg + emerald-600 text + prefixo "+") / Saídas -185.000,00 (red-50 bg + red-600 text + prefixo "-") — diferença Final-Inicial = 65.000 que bate com Entradas-Saídas = 250.000-185.000 = 65.000 (consistência matemática real ao contrário do IBHome) / (4) **Lista de Movimentações** Card com header CardTitle "Movimentações" base size + body p-0 onde acontece a feature mais sofisticada da página: **AGRUPAMENTO POR DATA** via reduce — função `groupedTransactions` agrega transactions[] em objeto `{[date]: [...transactions]}` permitindo renderização de cabeçalhos de dia + Object.entries(groupedTransactions).map renderiza cada grupo com header sticky-like bg-slate-50 px-6 py-2 border-y exibindo `formatDateHeader(date)` que aplica lógica de comparação Date.toDateString para retornar "Hoje" / "Ontem" / fallback toLocaleDateString pt-BR formato "27 de janeiro de 2026" — função INTELIGENTE que respeita timezone (date + "T00:00:00" para evitar shift UTC) — feature ÚNICA do IBExtract no módulo IB / dentro de cada grupo, dayTransactions.map renderiza uma row por transação com onClick → setSelectedTransaction(transaction) (FUNCIONAL — abre o Dialog modal): row é flex justify-between com hover:bg-slate-50 cursor-pointer transition-colors border-b last:border-b-0 / Esquerda: time slice(0, 5) extrai HH:MM da string completa "14:32:45" exibido em w-12 (largura fixa para alinhamento vertical entre rows) + circle 8w8 condicional (received=bg-emerald-100 com ArrowDownLeft emerald-600 / sent=bg-red-100 com ArrowUpRight red-600) + label fixo "Pix Recebido"/"Pix Enviado" font-medium + sublabel description slate-500 / Direita: valor font-semibold com prefixo +/- e cor emerald/red + sublabel "Saldo: R$ 125.430,50" cinza (saldo running CORRETO calculado linha a linha) + ChevronRight cinza decorativo que indica clicável — diferente do IBHome aqui o cursor-pointer ENTREGA ação real / **5 mocks com estrutura RICA** (estrutura de dados muito mais detalhada que IBHome — cada transaction tem 14 campos: id PIX-AAAAMMDDhhmm... / endToEndId E29-chars / type / description curta / payerName + payerDocument + payerBank + payerKey / recipientName + recipientDocument + recipientBank + recipientKey / amount / balanceAfter / date / time / memo opcional) — payer e recipient documentam ambos os lados da transação respeitando direção (received vs sent) com mascaramento parcial de CPF (***456.789-** padrão LGPD/BACEN) e telefones ((11) 9****-4567) / Documents diferentes mostram que payer ou recipient é o próprio merchant (Loja ABC Comércio Ltda 98.765.432/0001-10 PagSmile XXX) sempre como contraparte fixa — gap mock: o ID do merchant não vem de auth real (deveria ser useState do user logado) / **Pagination** flex justify-between border-t com label "Mostrando 1-5 de 156 movimentações" HARDCODED (não calcula real do array de 5 mocks) + 3 botões: ChevronLeft disabled (state currentPage=1) / "Página 1 de 32" (HARDCODED — 32 não calcula 156/5=31.2≈32 mas STRING fixa) / ChevronRight habilitado mas SEM onClick que avance a página (gap funcional — paginação é puramente visual); (5) **Dialog Modal de Detalhes** controlado por `selectedTransaction` state — `<Dialog open={!!selectedTransaction} onOpenChange={...}>` reseta selectedTransaction para null ao fechar — max-w-lg com 5 sub-blocos verticais quando há transação selecionada: (a) **Header centralizado** circle 16w16 condicional (received=emerald / sent=red) com ArrowDownLeft/ArrowUpRight 8w8 + label uppercase "Pix Recebido"/"Pix Enviado" + valor 3xl-bold com prefixo +/- e cor + timestamp formatado via `new Date(date + "T" + time).toLocaleString("pt-BR")` que produz "27/01/2026 14:32:45" (b) **Informações da Transação** seção uppercase tracking-wider com 3 rows flex justify-between: ID da Transação font-mono / End-to-End ID font-mono text-xs com `.slice(0, 20) + "..."` truncamento manual SEM clipboard copy (gap UX — IDs são identificadores únicos PIX que merchants frequentemente precisam copiar para suporte BACEN) / Status Badge emerald hardcoded "Concluída" com CheckCircle2 — todos os mocks sempre Concluída (nunca pending/error/cancelled) (c) **Pagador OU Destinatário** título condicional baseado em type (received → "Pagador" / sent → "Destinatário") com 3 rows: Nome / CPF-CNPJ / Instituição — usa ternários inline em CADA campo `received ? payerX : recipientX` repetindo lógica 6× quando poderia derivar `const counterparty = received ? {name: payerName, doc: payerDocument, bank: payerBank} : {...}` (gap de DRY no código mas não afeta UX) — **gap CRÍTICO**: NÃO mostra a Chave PIX (`payerKey`/`recipientKey`) que está no mock — campo presente nos dados mas não renderizado, apesar de ser informação CHAVE em comprovantes BACEN (d) **Memo** seção condicional `{selectedTransaction.memo && (...)}` — se memo presente exibe em bg-slate-50 rounded-lg p-3 — apenas 3 dos 5 mocks têm memo (mocks 1, 2 e 5 — "Cliente Maria" e "João Silva" têm memo: "" string vazia que truthy/falsy resolve corretamente), os 2 sem memo escondem o bloco (e) **Actions** flex gap-3 pt-4 border-t com 2 Buttons outline flex-1: "Baixar Comprovante" FileText icon + "Compartilhar" Share2 icon — AMBOS SEM onClick (dead actions — gap conhecido do mock); 6 useState hooks: period default "30d" / transactionType default "all" / direction default "all" / searchQuery default "" / **selectedTransaction default null** (controla Dialog) / currentPage default 1 — TODOS os 6 estados controlam UI mas APENAS selectedTransaction é funcionalmente conectado (abre Modal); searchQuery, period, transactionType, direction são CAPTURADOS mas NÃO USADOS para filtrar transactions — array é renderizado fixo independente dos Selects (gap funcional crítico — a UI promete filtros que não filtram); paginação é estética; estrutura visual é deliberadamente "tradicional bancária" sem gradients chamativos — IBHome era vitrine, IBExtract é ferramenta operacional.',

    sectionsBreakdown: {
      headerMinimal: {
        role: 'Header minimalista — proposital para tom "extrato bancário"',
        structure: 'flex justify-between mas right-side VAZIO (sem badge/sem botão)',
        content: '[Title "Extrato" 2xl-bold / Sublabel "Histórico completo de movimentações" slate-500]',
        contrastWithIBHome: 'IBHome tinha Sparkles+saudação+Clock+last_update+Badge gradient — aqui é apenas título nu',
        gap: 'Não tem ícone de cabeçalho (todas as outras páginas usam icon contextual)',
      },

      filtersCard: {
        role: 'Barra de filtros horizontal flex-wrap',
        structure: 'Card single CardContent p-4 flex flex-wrap items-center gap-4',
        controls: [
          'Calendar icon decorativo (não interativo) — apenas marcador visual',
          'Select Período w-40 com 6 opts (today/7d/30d-default/90d/month/custom)',
          'Select Tipo w-36 com 3 opts (all/sent/received)',
          'Select Direção w-32 com 3 opts (all/in/out)',
          'Input Search flex-1 min-w-[200px] com Search icon absolute',
          'DropdownMenu Exportar com 3 itens PDF/Excel-CSV/OFX',
        ],
        criticalRedundancy: {
          gap: 'Tipo e Direção são funcionalmente IDÊNTICOS — Pix Enviado = Saídas e Pix Recebido = Entradas',
          impact: 'Usuário pode escolher "Pix Enviado" no Tipo E "Entradas" na Direção criando estado conflitante',
          designPlan: 'Talvez planejaram suportar futuramente outros tipos (TED/Boleto/Transferência interna) que justificariam separar Tipo de Direção, mas hoje 100% das transações são PIX',
        },
        gaps: [
          'Calendar icon não-interativo — apenas decorativo',
          'Período "Personalizado" SEM date picker associado (selecionar não abre nada)',
          'Tipo e Direção redundantes',
          'searchQuery captura digitação MAS não filtra array de transações',
          'period/transactionType/direction states existem MAS não filtram nada',
          'Exportar PDF/Excel-CSV/OFX — todos SEM onClick (dead actions)',
        ],
      },

      periodSummaryKPIs: {
        role: 'Resumo financeiro do período em 4 KPIs simples',
        gridLayout: 'grid-cols-2 lg:grid-cols-4 gap-4',
        cards: [
          'Saldo Inicial — neutro slate / 60.430,50',
          'Saldo Final — neutro slate / 125.430,50',
          'Entradas — emerald-50 bg + emerald-600 text com prefixo "+" / 250.000,00',
          'Saídas — red-50 bg + red-600 text com prefixo "-" / 185.000,00',
        ],
        mathConsistency: '125.430,50 - 60.430,50 = 65.000 = 250.000 - 185.000 (BATE matematicamente — mais consistente que IBHome)',
        designContrast: 'NÃO tem gradients/blurs/3xl-fonts — é text-lg-bold simples — design propositalmente "extrato bancário tradicional"',
        comparedToIBHome: 'IBHome usa cards 3xl-font-black com gradient borders e blur-circles para Entradas/Saídas — aqui é minimalista',
      },

      transactionsListGrouped: {
        role: 'Feature MAIS SOFISTICADA da página — listagem agrupada por data',
        cardStructure: 'Card com CardTitle "Movimentações" base size + CardContent p-0 pt-4',

        groupingLogic: {
          function: 'groupedTransactions = transactions.reduce((groups, t) => { groups[t.date] = groups[t.date] || []; groups[t.date].push(t); return groups; }, {})',
          purpose: 'Transforma array linear em objeto {data: [transactions]} para renderização agrupada',
          renderPattern: 'Object.entries(groupedTransactions).map(([date, dayTransactions]) => ...)',
          dateHeaderFunction: 'formatDateHeader(dateStr) com lógica de comparação Date.toDateString',
          dateHeaderLogic: '[hoje?: "Hoje" / ontem?: "Ontem" / else: toLocaleDateString pt-BR "27 de janeiro de 2026"]',
          timezoneSafety: 'Concatena "T00:00:00" em date string para forçar interpretação local (evita shift UTC) — boa prática',
        },

        dayHeader: {
          structure: 'div px-6 py-2 bg-slate-50 border-y',
          content: 'p-text font-medium slate-600 com formatDateHeader(date)',
          appearance: 'Sticky-like visualmente mas SEM position:sticky CSS (gap UX — em listas longas perde contexto ao rolar)',
        },

        rowStructure: {
          interactivity: 'onClick={() => setSelectedTransaction(transaction)} — FUNCIONAL (abre Modal)',
          contrastWithIBHome: 'IBHome também tinha cursor-pointer mas SEM onClick — aqui IBExtract entrega o que promete',
          layout: 'flex justify-between border-b last:border-b-0',

          leftBlock: {
            structure: 'flex items-center gap-4',
            elements: [
              'time HH:MM via `transaction.time.slice(0, 5)` — extrai apenas hora-minuto da string "14:32:45" — width fixa w-12 para alinhar verticalmente entre rows',
              'circle 8w8 condicional (received=emerald-100/600 / sent=red-100/600) — MENOR que o circle do IBHome (12w12 lá) — propositalmente mais discreto',
              'texto duplo: heading fixo "Pix Recebido"/"Pix Enviado" font-medium IGNORANDO description (mesmo gap do IBHome) + sublabel description slate-500',
            ],
          },

          rightBlock: {
            structure: 'flex items-center gap-6',
            elements: [
              'valor font-semibold com prefixo +/- e cor emerald/red',
              'sublabel "Saldo: R$ X" — saldo running calculado linha a linha (consistente com balanceAfter de cada mock)',
              'ChevronRight w-4 cinza decorativo — indica clicável',
            ],
          },
        },

        timeFormatTrick: '`transaction.time.slice(0, 5)` extrai HH:MM de "14:32:45" — solução simples mas frágil (assume formato HH:MM:SS sempre)',

        runningBalance: 'Cada transação tem campo `balanceAfter` no mock que reflete o saldo após aquela transação — exibido como "Saldo: R$ X" — INFORMAÇÃO ÚNICA do IBExtract não presente no IBHome',
      },

      paginationFake: {
        role: 'Paginação visual sem funcionalidade real',
        structure: 'flex justify-between px-6 py-4 border-t',
        leftLabel: '"Mostrando 1-5 de 156 movimentações" HARDCODED',
        rightControls: '[ChevronLeft Button outline disabled (state) / "Página 1 de 32" HARDCODED string / ChevronRight Button outline (sem disabled MAS sem onClick funcional)]',
        gaps: [
          'Total "156" HARDCODED — não conta o array real',
          '"Página 1 de 32" HARDCODED — 156/5=31.2≠32 (string fixa)',
          'currentPage state existe MAS apenas usado no label + disabled do ChevronLeft (===1)',
          'ChevronRight habilitado MAS sem onClick que mude page',
          'Sem seletor de items per page',
          'Sem jump direto para página específica',
          'Sem indicador "primeiro/último"',
        ],
      },

      detailModal: {
        role: 'Dialog max-w-lg com detalhamento completo da transação selecionada',
        controlState: '`<Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>`',
        renderCondition: '`{selectedTransaction && (...)}` dentro do DialogContent',
        gap: 'open={!!selectedTransaction} é truthy-coerção — funciona mas open={Boolean(selectedTransaction)} seria mais explícito',

        subBlock1Header: {
          purpose: 'Identificação visual primária — circle grande + valor 3xl',
          structure: 'div text-center py-4 border-b',
          content: '[circle 16w16 condicional emerald/red com ArrowDownLeft/Up 8w8 / label uppercase "Pix Recebido"/"Pix Enviado" / valor 3xl-bold com prefixo+cor / timestamp formatado pt-BR]',
          timestampFormat: 'new Date(date + "T" + time).toLocaleString("pt-BR") → "27/01/2026 14:32:45"',
        },

        subBlock2TransactionInfo: {
          title: 'Informações da Transação (uppercase tracking-wider)',
          rows: [
            'ID da Transação — font-mono — exibe completo "PIX-2026012714324598765"',
            'End-to-End ID — font-mono text-xs com `.slice(0, 20) + "..."` truncamento manual',
            'Status — Badge emerald hardcoded "Concluída" com CheckCircle2',
          ],
          gaps: [
            'IDs sem botão Copy clipboard (gap UX — IDs frequentemente copiados para suporte BACEN)',
            'End-to-End ID truncado SEM hover/tooltip mostrando completo',
            'Status SEMPRE "Concluída" — sem suporte a pending/error/cancelled (5 mocks são todos completed)',
            'Sem campo "Tipo de Chave" (CPF/CNPJ/Email/Telefone/Random) que está no schema BACEN',
          ],
        },

        subBlock3Counterparty: {
          title: 'condicional — "Pagador" se received / "Destinatário" se sent',
          purpose: 'Mostra dados do OUTRO lado da transação (sempre o que NÃO é o merchant)',
          rows: [
            'Nome — payerName ou recipientName',
            'CPF/CNPJ — payerDocument ou recipientDocument com mascaramento parcial preservado',
            'Instituição — payerBank ou recipientBank',
          ],
          ternaryRepetition: 'Lógica `received ? payerX : recipientX` repete em CADA row — gap de DRY no código',
          missingField: 'CHAVE PIX (`payerKey`/`recipientKey`) está no mock MAS NÃO RENDERIZADA — campo crítico de comprovante BACEN ausente',
          maskingExamples: [
            'CPF: ***456.789-** (4 dígitos visíveis padrão BACEN)',
            'CNPJ: 12.345.678/0001-90 (visível quando empresa)',
            'Telefone: (11) 9****-4567',
            'Email: visível completo (financeiro@xyz.com.br)',
          ],
        },

        subBlock4Memo: {
          renderCondition: '`{selectedTransaction.memo && (...)}` — esconde se vazio',
          structure: 'p-text bg-slate-50 rounded-lg p-3 com texto cinza',
          mocksWithMemo: '3 dos 5 mocks (PIX 1, 2, 5)',
          mocksWithoutMemo: '2 dos 5 (Maria Santos / João Silva — memo: "")',
          gap: 'Empty string "" é falsy — esconde corretamente — mas se memo fosse undefined também esconderia (boa prática implícita)',
        },

        subBlock5Actions: {
          structure: 'flex gap-3 pt-4 border-t',
          buttons: '[Baixar Comprovante FileText / Compartilhar Share2] — ambos outline flex-1',
          gap: 'AMBOS SEM onClick — dead actions (mock conhecido)',
          missingActions: [
            'Copy ID button',
            'Reprocessar / Estornar',
            'Reportar problema',
            'Adicionar contato aos favoritos (se contraparte é nova)',
            'Criar regra de categorização automática',
          ],
        },
      },
    },

    knownGapsAcrossPage: [
      'ZERO i18n — todas as strings em PT hardcoded (gap arquitetural com IBHome que tem 22 keys i18n)',
      'Filtros Tipo e Direção redundantes — controlam mesmo conceito',
      'searchQuery / period / transactionType / direction states existem MAS não filtram array',
      'Período "Personalizado" sem date picker associado',
      'Calendar icon decorativo não-interativo',
      'Exportar PDF/Excel-CSV/OFX — 3 ações dead (sem onClick)',
      'Pagination labels "1-5 de 156" e "Página 1 de 32" HARDCODED — não calculam',
      'ChevronRight habilitado MAS sem onClick',
      'currentPage state apenas usado para disabled do ChevronLeft (===1)',
      'Status Modal SEMPRE "Concluída" — sem pending/error/cancelled (5 mocks são todos completed)',
      'Chave PIX (payerKey/recipientKey) presente no mock MAS NÃO renderizada no Modal — gap de comprovante BACEN',
      'Modal sem Copy clipboard nos IDs',
      'End-to-End ID truncado sem tooltip mostrando completo',
      'Modal sem campo "Tipo de Chave" (CPF/CNPJ/Email/Phone/Random)',
      '"Baixar Comprovante" e "Compartilhar" Buttons SEM onClick',
      'Modal usa ternários `received ? payerX : recipientX` repetindo lógica 6× (DRY)',
      'Day headers sem position:sticky — perdem contexto ao rolar listas longas',
      'Heading fixo "Pix Recebido"/"Pix Enviado" 5× igual — ignora `description` rica',
      'Total transactions hardcoded 156 — não vem de count real',
      'Sem skeleton/loading/empty states',
      'Zero uso da SDK base44 — Transaction entity tem timeline, customer, pix_data prontos no schema mas IGNORADOS',
      'Sem botão "Voltar para Home" no header (gap de navegação)',
      'Sem seletor de date range custom apesar da opção "Personalizado" existir',
      'Sem agrupamento alternativo (por categoria, por contraparte, por valor)',
      'Saldos Inicial/Final hardcoded — não calculam dos mocks',
    ],
  },

  technical: {
    fileLocation: 'pages/IBExtract.jsx (511 linhas — 72% maior que IBHome 297L)',
    routePath: '/IBExtract',
    moduleAffinity: 'Internet Banking — segundo item do menu IB no layout.jsx',
    accessedFrom: 'Botão "Ver Extrato" do IBHome (Link → IBExtract) — única entrada conhecida',

    imports: {
      react: 'useState (6× hooks)',
      reactRouter: 'NÃO IMPORTADO (gap — sem Link de volta para IBHome ou outras páginas)',
      i18n: 'NÃO IMPORTADO (zero useTranslation — divergência arquitetural com IBHome)',
      lucide: '[ArrowDownLeft, ArrowUpRight, Download, Filter (importado mas NÃO USADO — dead import), Search, Calendar, ChevronLeft, ChevronRight, FileText, X (importado mas NÃO USADO — dead import), Copy (importado mas NÃO USADO — dead import), Share2, CheckCircle2] — 13 icons importados, 10 usados, 3 dead imports',
      uiComponents: '[Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Select+SelectContent+SelectItem+SelectTrigger+SelectValue, Dialog+DialogContent+DialogHeader+DialogTitle, DropdownMenu+DropdownMenuContent+DropdownMenuItem+DropdownMenuTrigger]',
      utils: 'cn de @/lib/utils',
    },

    deadImports: {
      list: ['Filter', 'X', 'Copy'],
      observation: [
        'Filter: provavelmente intenção abandonada de Filter button extra (talvez para "Filtros avançados")',
        'X: provavelmente para "limpar filtros" Button que não foi implementado',
        'Copy: gap muito sintomático — Copy é EXATAMENTE o que falta no Modal de Detalhes para os IDs (ID da Transação e End-to-End ID) — feature planejada e abandonada',
      ],
    },

    stateManagement: {
      hooksCount: '6 useState — 6× mais que IBHome (1 hook)',
      hooks: [
        'period default "30d" — Select Período',
        'transactionType default "all" — Select Tipo',
        'direction default "all" — Select Direção',
        'searchQuery default "" — Input Search',
        'selectedTransaction default null — Dialog Modal control',
        'currentPage default 1 — Pagination state',
      ],
      functionalityGap: 'Apenas selectedTransaction é FUNCIONAL — outros 5 são "captured but ignored" (UI promete filtros que não filtram)',
    },

    formatCurrencyFunction: {
      definition: 'inline arrow function dentro do componente',
      logic: '`Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(value)`',
      differenceFromIBHome: 'IBHome tinha máscara `••••••` quando !showBalance — IBExtract NÃO TEM toggle de privacidade (gap UX — extrato é ainda mais sensível que home, deveria ter toggle pelo menos opcional)',
      usagePoints: '4 KPIs + 5 valores transação + 5 saldos running + 1 valor Modal = 15 ocorrências',
    },

    formatDateHeaderFunction: {
      definition: 'inline arrow function dentro do componente',
      logic: 'compara dateStr+T00:00:00 com today/yesterday via Date.toDateString — fallback toLocaleDateString pt-BR',
      timezoneHandling: 'Boa prática — concatena T00:00:00 para forçar interpretação local',
      gap: 'Não suporta i18n — pt-BR e "Hoje"/"Ontem" hardcoded',
    },

    groupedTransactionsLogic: {
      pattern: 'Array.reduce com acumulador objeto {[date]: [transactions]}',
      benefit: 'Permite renderização agrupada por dia com cabeçalhos sticky-like',
      complexity: 'O(n) sobre transactions',
      gap: 'Re-executa em cada render (não memoizado com useMemo) — para 5 mocks irrelevante, mas para 156 transações reais teria impacto',
    },

    designSystem: {
      cromaticIdentity: 'NEUTRO — diferente do IBHome que tinha gradient navy + brand emerald protagonistas',
      semanticColors: '[emerald (received/Entradas) / red (sent/Saídas)] — apenas 2 cores semânticas',
      noGradients: 'NENHUM gradient — design sóbrio "extrato bancário"',
      noBlurs: 'NENHUM blur pseudo-element decorativo (IBHome tinha 2)',
      contrastWithIBHome: 'IBHome era VITRINE visual / IBExtract é FERRAMENTA operacional',
    },

    rechartsUsage: 'NENHUMA',

    crossPageNavigation: {
      linksRenderizados: 'NENHUM — IBExtract não linka para nenhuma outra página',
      missingLinks: [
        'Sem Link voltar para IBHome',
        'Sem Link para IBProofs (Comprovantes — relacionado conceitualmente)',
        'Sem Link para IBPixSend/IBPixReceive (continuidade de jornada)',
        'Sem Link para IBSettings/Limites',
      ],
      observation: 'IBExtract é uma ilha de navegação — usuário só sai via header global do app',
    },

    i18nGap: {
      ibHomeKeys: '22 keys do namespace internet_banking',
      ibExtractKeys: '0 — totalmente em português hardcoded',
      hardcodedStrings: [
        'Header: "Extrato", "Histórico completo de movimentações"',
        'Filters: "Hoje", "Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias", "Este mês", "Personalizado", "Tipo", "Todos", "Pix Enviado", "Pix Recebido", "Direção", "Entradas", "Saídas", "Buscar por nome, descrição...", "Exportar"',
        'KPIs: "Saldo Inicial", "Saldo Final", "Entradas", "Saídas"',
        'List: "Movimentações", "Pix Recebido", "Pix Enviado", "Saldo:"',
        'Pagination: "Mostrando 1-5 de 156 movimentações", "Página 1 de 32"',
        'Modal: "Detalhes da Movimentação", "Informações da Transação", "ID da Transação", "End-to-End ID", "Status", "Concluída", "Pagador", "Destinatário", "Nome", "CPF/CNPJ", "Instituição", "Descrição", "Baixar Comprovante", "Compartilhar"',
      ],
      impact: 'Plataforma multilíngue tem coverage TOTAL no IBHome MAS ZERO no IBExtract — usuário pt-BR não nota, mas en-US/zh-CN veriam UI bilíngue quebrada',
    },

    transactionMockStructure: {
      fieldsPerTransaction: 14,
      schema: [
        'id — formato "PIX-AAAAMMDDhhmmnnnnnnn"',
        'endToEndId — formato BACEN "EXX..." 32 chars',
        'type — "received"/"sent"',
        'description — string curta para sublabel',
        'payerName, payerDocument, payerBank, payerKey — 4 campos do pagador',
        'recipientName, recipientDocument, recipientBank, recipientKey — 4 campos do recebedor',
        'amount, balanceAfter — 2 valores monetários',
        'date (YYYY-MM-DD), time (HH:MM:SS) — 2 strings de timestamp',
        'memo — string opcional',
      ],
      richness: 'Estrutura de dados MUITO mais rica que IBHome (5 campos vs 14) — denota intenção de detalhamento profundo',
      schemaAlignmentBASE44: 'Compatível com Transaction entity do schema (transaction_id, end_to_end_id, customer.name, customer.document, customer.email, pix.payer_name, pix.payer_document, pix.payer_bank, amount) — TODOS PRONTOS PARA USO REAL via SDK',
    },

    iconSizingPatterns: {
      modalCircle: '16w16 com icon 8w8 (grande - destaque)',
      rowCircle: '8w8 com icon 4w4 (compacto - lista densa)',
      kpiNoIcon: 'KPIs simples sem icon — minimalismo',
      consistencyWithIBHome: 'IBHome usava 12w12 com icon 6w6 nas linhas — IBExtract reduz para 8w8/4w4 (mais transações por scroll)',
    },

    dataConsistencyChecks: {
      runningBalance: 'CORRETO — cada balanceAfter consistente com sequência de mocks (125430.50 → 120430.50 -5000 / etc)',
      mathConsistency: 'Final-Initial = 65000 = Entradas-Saídas = 250000-185000 (BATE matematicamente)',
      timestampOrder: 'Mocks ordenados desc por data+time (27/01 14:32 → 27/01 11:15 → 27/01 09:45 → 26/01 18:45 → 26/01 10:00) — consistente',
      gap: 'Saldos do periodSummary NÃO derivam dos mocks — são hardcoded independentes (poderia ser sum dos balanceAfter primeiro/último)',
    },

    knownGapsTechnical: [
      '511 linhas 100% MOCK — zero SDK base44 (Transaction entity totalmente compatível ignorada)',
      '13 icons importados, 3 dead imports (Filter, X, Copy)',
      'Copy dead import EXATAMENTE o que falta no Modal — feature planejada e abandonada',
      'ZERO i18n vs IBHome com 22 keys — gap arquitetural inter-página',
      '6 useState mas 5 são captured-but-ignored',
      'Filtros NÃO filtram (period/transactionType/direction/searchQuery são decorativos)',
      'Pagination 100% fake (currentPage usado só p/ disabled do ChevronLeft)',
      'Calendar icon decorativo não-interativo',
      'Período "Personalizado" sem date picker',
      '3 export options (PDF/Excel-CSV/OFX) sem onClick',
      'Dia headers sem position:sticky',
      'Modal sem Copy clipboard (apesar de Copy importado e não usado)',
      'Modal sem campo Chave PIX (presente no mock)',
      'Modal sem campo Tipo de Chave',
      'Status sempre "Concluída" no Modal',
      'Baixar Comprovante e Compartilhar sem onClick',
      'reduce de groupedTransactions sem useMemo',
      'Heading fixo "Pix Recebido/Enviado" 5× igual',
      'Sem cross-page Links (ilha de navegação)',
      'Sem voltar para IBHome',
      'Sem toggle de privacidade (showBalance) que IBHome tinha — extrato é ainda mais sensível',
      'periodSummary saldos não derivam dos mocks',
      'Sem skeleton/loading/empty/error states',
      'Sem export real (apenas labels de menu)',
      'time.slice(0,5) frágil — assume formato HH:MM:SS sempre',
      'open={!!selectedTransaction} truthy-coerção — Boolean(selectedTransaction) seria mais explícito',
    ],
  },
};

export default IBExtractDoc;