// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBProofs (Internet Banking) — Entrega 20
// ----------------------------------------------------------------------------
// SÉTIMA página do módulo INTERNET BANKING — ÚNICA página do bloco
// COMPROVANTES (3º bloco do módulo IB após Home, Extrato e PIX).
//
//   1. IBProofs.jsx (235 linhas) — Central de comprovantes e documentos
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada via menu lateral IB (NÃO está nos Quick Actions do IBHome — gap
//   consistente: IBHome só linka 4 das 7+ páginas IB)
// - É a SEGUNDA MENOR página do módulo IB inteiro (apenas IBPixReceive 271L
//   é menor por pouco — wait, 235L < 271L, então IBProofs é a MENOR PÁGINA do
//   módulo IB inteiro até o momento — 79% do tamanho de IBPixReceive, 35% de
//   IBPixSend, 46% de IBExtract)
// - É CONCEITUALMENTE REDUNDANTE com IBExtract — ambas mostram lista de
//   transações PIX com filtros similares (período + tipo) — a diferença é
//   FUNCIONAL: IBExtract foca em VISUALIZAR transações com Modal de detalhes,
//   IBProofs foca em BAIXAR comprovantes individuais (PDF) + documentos
//   agregados (Extrato Mensal + Informe de Rendimentos)
// - Esta redundância arquitetural reflete uma DIVISÃO COMUM em apps bancários
//   reais (Bradesco, Itaú): "Extrato" mostra movimentações, "Comprovantes"
//   gera documentos imprimíveis — mas no mock atual a divisão é apenas visual
//   pois nenhum botão Download/Compartilhar tem onClick implementado
//
// PADRÕES NOVOS NA PÁGINA (não vistos nas 6 anteriores do módulo IB):
// - PRIMEIRO uso de FileSpreadsheet icon no módulo IB (representando relatórios
//   tabulares) — IBExtract usa ChevronDown para Export mas não FileSpreadsheet
// - PRIMEIRO uso de File icon (genérico não-FileText) no módulo IB — File é
//   visualmente diferente de FileText: File é "documento em branco" sem linhas
//   internas, FileText tem linhas representando texto
// - PRIMEIRO uso de ArrowDownLeft + ArrowUpRight (arrows diagonais) no módulo
//   IB — IBHome usa setas verticais TrendingUp, IBExtract usa setas similares
//   mas sem semântica diagonal de fluxo (entrada/saída)
// - PRIMEIRA divisão em DOIS sub-tipos de items: comprovantes individuais
//   (proofs list 5 items) + documentos agregados (Documents 2 cards)
// ============================================================================

export const IBProofsDoc = {
  pageId: 'IBProofs',
  pagePaths: ['/IBProofs'],
  module: 'Internet Banking',
  section: 'Comprovantes — Central de documentos (7ª tela do módulo, ÚNICA do bloco Comprovantes)',

  explainer: {
    oneLiner:
      'Tela de Central de Comprovantes — 235 linhas 100% MOCK — É A MENOR PÁGINA do módulo IB inteiro até o momento (235L vs IBPixReceive 271L vs IBHome 297L vs IBPixLimits 305L vs IBPixKeys 372L vs IBExtract 511L vs IBPixSend 689L) — refletindo a natureza simples conceitual: listar comprovantes baixáveis + 2 documentos agregados. Página single-page com 4 grandes blocos verticais (sem Modal/Dialog/Drawer — DIFERENTE de IBPixSend/Receive/Keys/Limits que todas têm Modal): (1) **Header minimalista** padrão IBPixReceive/IBPixLimits — h1 "Comprovantes" 2xl-bold + sublabel "Central de documentos e comprovantes" — sem CTA, sem Badge, sem ícone — note o termo "Central" que sugere agregação de documentos diversos (alinhado com a estrutura: lista + 2 docs agregados); (2) **Filters Card** com p-4 flex flex-wrap items-center gap-4 contendo 3 filtros REDUNDANTES com IBExtract: (a) **Period Select** com Calendar icon 4w4 slate-400 + Select w-40 com 4 opções "Últimos 7 dias" / "Últimos 30 dias" (default) / "Últimos 90 dias" / "Este ano" — note que **NÃO tem opção "Personalizado"** (IBExtract tem, mas dead end pois sem date picker mesmo lá) — IBProofs simplifica para 4 períodos predefinidos, possivelmente reconhecendo o gap de IBExtract; (b) **Transaction Type Select** w-36 com 3 opções "Todos" / "Pix Enviado" / "Pix Recebido" — é o MESMO filtro de "Direção" do IBExtract mas SEM o filtro adicional "Tipo" que IBExtract tinha (Tipo+Direção redundantes em IBExtract foram simplificados aqui para apenas Direção); (c) **Search Input** flex-1 min-w-200px com Search icon absolute + placeholder "Buscar por ID, nome..." — o min-w-200px garante que em mobile/wrap o search não fique infinitesimal / **gap funcional crítico**: 3 useState (period, transactionType, searchQuery) são CAPTURED-BUT-IGNORED — nenhum dos 3 filtros é aplicado ao array de proofs renderizado, exatamente igual ao gap arqueológico descoberto em IBExtract (state controllado mas não filtra) — repetição estrutural do mesmo bug arquitetural inter-página IB; (3) **Proofs List section** com label uppercase "Comprovantes" + Card divide-y entre 5 rows mockadas (5 transações PIX RICAS com 6 fields: id+type+description+amount+date+time) — cada row p-4 com layout flex justify-between: ESQUERDA flex items-start gap-4 com [icon square 10w10 rounded-lg condicional bg-emerald-100 (received) ou bg-red-100 (sent) + ArrowDownLeft 5w5 emerald-600 / ArrowUpRight 5w5 red-600] + bloco multi-linha 4 LINHAS: linha 1 "Pix Recebido" ou "Pix Enviado" font-medium + span text-sm slate-500 com "{date} {time}" / linha 2 description text-sm slate-500 (varia com mock: "Fornecedor ABC Ltda" / "Empresa XYZ Ltda" / "Aluguel - Imobiliária" / "João Silva" / "Pagamento Fatura #4523") / linha 3 amount font-semibold com COR CONDICIONAL emerald-600 (received) ou red-600 (sent) + SINAL prefixo "+" ou "-" + formatCurrency(amount) — note prefix antes do R$ não dentro (UX padrão correto) / linha 4 "ID: PIX-2026012715324598765" text-xs slate-400 font-mono / DIREITA flex gap-2 com 2 Buttons: Button outline sm "PDF" com Download icon (LABEL "PDF" descritivo do formato) + Button ghost sm com APENAS Share2 icon SEM label (icon-only para economizar espaço) — **gaps funcionais**: ambos botões SEM onClick (Download e Share2 dead — repetição do gap de IBExtract Export Dropdown e botões Modal Baixar/Compartilhar) / **mocks observação**: 3 dos 5 itens são "received" (60%) e 2 são "sent" (40%) — distribuição similar a IBExtract / IDs seguem padrão `PIX-YYYYMMDDHHMMSS{5digits}` que parece TXID BACEN (mas TXID real BACEN é 26-32 chars alfanuméricos + caracteres especiais permitidos) — semi-correto / 2 dos 5 IDs descrevem a mesma data/hora idêntica `PIX-2026012715324598765` (linha 41) e `PIX-2026012714324598765` (linha 49) que são idênticos exceto pelos digits 1532 vs 1432 — sugere que o gerador de mock truncou hora-minuto no ID (correto BACEN aproximado); (4) **Documents Section** com label uppercase "Documentos" + grid responsive `grid-cols-1 md:grid-cols-2 gap-4` (mobile=1 col, desktop=2 cols) com 2 Cards `hover:shadow-lg transition-all cursor-pointer` — Card 1 EXTRATO MENSAL com circle 14w14 rounded-xl bg-blue-100 + FileSpreadsheet icon 7w7 blue-600 + título font-semibold "Extrato Mensal" + descrição "Gerar extrato em PDF de qualquer período" + Button outline sm mt-3 "Gerar Extrato" / Card 2 INFORME DE RENDIMENTOS com circle 14w14 rounded-xl bg-purple-100 + File icon 7w7 purple-600 + título "Informe de Rendimentos" + descrição "Para declaração de Imposto de Renda" + Button outline sm mt-3 "Baixar 2025" — **GAPS CRÍTICOS**: (a) Cards têm `cursor-pointer` SEM onClick (dead actions enganosas — repetição do padrão de IBPixKeys Portabilidade/Reivindicar) / (b) Buttons dentro dos Cards "Gerar Extrato" e "Baixar 2025" SEM onClick — submit dead / (c) Button "Baixar 2025" hardcoded no ANO específico — não atualiza dinamicamente conforme ano-fiscal corrente (data atual 2026-04-27 sugeriria "Baixar 2025" para IR mas em jan/fev/mar 2027 ainda mostraria "2025") — gap de hardcode temporal / (d) Sem opção "Baixar anos anteriores" — em apps reais Informe IR oferece dropdown para escolher ano (2024, 2023, 2022...) / (e) Sem date picker para "Extrato Mensal de qualquer período" prometido na descrição — clicar em "Gerar Extrato" deveria abrir Modal/Drawer com seletor de período mas não há nada / (f) FileSpreadsheet vs File icon SEMÂNTICA: FileSpreadsheet sugere XLSX/CSV planilha mas descrição diz "PDF" — gap visual; 3 useState totais (period "30d" + transactionType "all" + searchQuery "") TODOS aproveitados (continua zero-dead-state — QUARTO caso consecutivo no módulo após Receive→Keys→Limits→Proofs) MAS captured-but-ignored (3/3 não filtram = padrão IBExtract) + 1 helper formatCurrency duplicada das outras 6 páginas (formatCurrency está em IBHome+IBExtract+IBPixSend+IBPixReceive+IBPixKeys+IBPixLimits+IBProofs = 7× repetida no módulo IB inteiro — gap arquitetural massivo); gaps arquiteturais: (i) **3 filtros captured-but-ignored** — mesmo padrão de bug arquitetural inter-página IB (IBExtract tinha 5/6 filtros sem filtragem real); (ii) **Botões Download e Share2 sem onClick em todos 5 rows** — 10 dead buttons na lista; (iii) **Cards Documents com cursor-pointer enganoso sem onClick**; (iv) **Button "Baixar 2025" hardcoded temporal** — não detecta ano fiscal corrente; (v) **Descrição "Gerar extrato em PDF de qualquer período" sem date picker para escolher período**; (vi) **FileSpreadsheet visual vs PDF descrito** — gap semântico icon vs description; (vii) **Sem distinção visual de comprovantes JÁ baixados** vs novos — em apps reais ícone muda para "✓ Baixado" depois de download; (viii) **Sem busca real** — searchQuery state existe mas não aplica filtragem; (ix) **Sem ordenação** — 5 items na ordem hardcoded (mais recente primeiro implicitamente pelos dates 27/01, 27/01, 26/01, 26/01, 25/01 — pelo menos a ordem do mock é cronológica decrescente); (x) **Sem paginação** — apenas 5 itens hardcoded mas em produção haveria centenas; (xi) **Sem agrupamento por data** — IBExtract agrupa por "Hoje/Ontem/data" via reduce, IBProofs NÃO agrupa apesar de ter date+time disponível; (xii) **Sem Modal de preview do comprovante** antes de baixar; (xiii) **Sem opção bulk download** — selecionar múltiplos e baixar ZIP; (xiv) **Sem geração compartilhada via URL** — apenas Share2 icon sem destino; (xv) **Sem filtro por valor** (range mín-máx que IBExtract também faltava); (xvi) **Sem filtro por destinatário/origem específica** — busca por nome teria essa função; (xvii) **redundância conceitual com IBExtract** — sem distinção clara de propósito UX; (xviii) **0 useEffect** — proofs mockados ao mount sem refetch ou subscription; (xix) **ZERO uso de Transaction.list do SDK** apesar do schema Transaction ter todos os fields necessários (transaction_id, type, amount, created_at, etc.); (xx) **font-mono em ID** — boa prática para IDs alfanuméricos longos; (xxi) **Sem dark mode no Button "PDF"** outline — funciona mas Button shadcn outline tem variante dark já incluída; (xxii) **Filter icon importado mas NÃO USADO** no JSX — dead import similar ao gap de IBPixReceive (Share2/ArrowLeft) e IBPixKeys (CardHeader/CardTitle); (xxiii) **FileText icon importado mas NÃO USADO** — talvez tenha sido planejado para o título "Documentos" ou para Cards mas substituído por FileSpreadsheet/File; (xxiv) **Sem badge "NOVO" para comprovantes recém-recebidos**; (xxv) **Sem audit log de quem baixou o comprovante** — em apps corporativos múltiplos usuários podem baixar e seria útil ter histórico; (xxvi) **Sem distinção de visibility** — todos comprovantes visíveis a todos os usuários da conta sem ACL; (xxvii) **min-w-[200px] no search** garante usabilidade mobile mas pode quebrar layout se houver muitos filtros adicionais.',

    sectionsBreakdown: {
      headerMinimal: {
        role: 'Header pattern minimalista igual IBPixReceive/IBPixLimits',
        title: '"Comprovantes" 2xl-bold',
        subtitle: '"Central de documentos e comprovantes" — termo "Central" sugere agregação',
        observation: 'Sem CTA, sem Badge, sem ícone — minimalismo total',
      },

      filtersCard: {
        role: 'Card com 3 filtros redundantes ao IBExtract',
        layout: 'p-4 flex flex-wrap items-center gap-4',

        periodSelect: {
          icon: 'Calendar 4w4 slate-400',
          width: 'w-40',
          options: ['7d "Últimos 7 dias"', '30d "Últimos 30 dias" (default)', '90d "Últimos 90 dias"', 'year "Este ano"'],
          contrastWithIBExtract: 'NÃO TEM opção "Personalizado" (IBExtract tinha mas dead end) — IBProofs simplifica reconhecendo gap',
        },

        transactionTypeSelect: {
          width: 'w-36',
          options: ['all "Todos"', 'sent "Pix Enviado"', 'received "Pix Recebido"'],
          contrastWithIBExtract: 'IBExtract tinha 2 filtros redundantes (Tipo+Direção); IBProofs simplifica para apenas Direção',
        },

        searchInput: {
          layout: 'flex-1 min-w-[200px] relative',
          icon: 'Search 4w4 slate-400 absolute left-3',
          placeholder: '"Buscar por ID, nome..."',
          stateBinding: 'searchQuery useState',
          minWidthMobile: '200px garante usabilidade em wrap mobile',
        },

        criticalGap: '3 filtros CAPTURED-BUT-IGNORED — mesmo bug arquitetural de IBExtract / nenhum aplica filtragem real',
      },

      proofsListSection: {
        role: 'Lista de comprovantes individuais baixáveis',
        cardStructure: 'Card divide-y com 5 rows mockadas',
        rowLayout: 'p-4 flex justify-between',

        leftBlock: {
          structure: '[icon square 10w10 condicional bg-emerald-100/red-100 + bloco multi-linha 4 linhas]',

          iconStateConditional: {
            received: 'bg-emerald-100 + ArrowDownLeft 5w5 emerald-600',
            sent: 'bg-red-100 + ArrowUpRight 5w5 red-600',
            semantics: 'PRIMEIRO uso ArrowDownLeft/ArrowUpRight (setas DIAGONAIS) no módulo IB para fluxo entrada/saída',
          },

          line1: '[label "Pix Recebido"/"Pix Enviado" font-medium + span "{date} {time}" sm slate-500]',
          line2: 'description text-sm slate-500 (mock variado: Fornecedor ABC, Empresa XYZ, Aluguel-Imobiliária, João Silva, Pagamento Fatura)',
          line3: {
            content: 'amount font-semibold com cor + sinal condicional',
            colorReceived: 'emerald-600',
            colorSent: 'red-600',
            prefixReceived: '"+"',
            prefixSent: '"-"',
            valueFormat: 'formatCurrency(amount)',
            uxPattern: 'Sinal antes do R$ — UX padrão correto para apps financeiros',
          },
          line4: '"ID: PIX-2026012715324598765" text-xs slate-400 font-mono',
        },

        rightBlock: {
          buttons: 2,
          button1: 'Button outline sm "PDF" + Download icon (label descritivo formato)',
          button2: 'Button ghost sm icon-only Share2 (sem label — economia espaço)',
          gap: 'AMBOS buttons SEM onClick — 10 dead buttons total na lista (5 PDF + 5 Share)',
        },

        mocksObservations: {
          count: 5,
          distribution: '3 received (60%) + 2 sent (40%)',
          idFormat: '`PIX-YYYYMMDDHHMMSS{5digits}` semi-aproximado a TXID BACEN (real é 26-32 alfanumérico)',
          chronologicalOrder: '27/01 → 27/01 → 26/01 → 26/01 → 25/01 — ordem decrescente correta',
          missingGroupingByDate: 'IBExtract agrupa por "Hoje/Ontem/data" via reduce; IBProofs NÃO agrupa apesar de ter date+time disponível — gap arquitetural inter-página',
        },
      },

      documentsSection: {
        role: 'Documentos agregados de longo prazo',
        layout: 'grid grid-cols-1 md:grid-cols-2 gap-4',

        cardExtratoMensal: {
          color: 'BLUE — bg-blue-100 + FileSpreadsheet icon 7w7 blue-600',
          title: '"Extrato Mensal"',
          description: '"Gerar extrato em PDF de qualquer período"',
          button: 'outline sm mt-3 "Gerar Extrato"',
          semanticGap: 'FileSpreadsheet icon sugere XLSX mas description diz PDF — incoerência visual',
          functionalGap: 'Sem date picker para "qualquer período" prometido — Button sem onClick',
        },

        cardInformeRendimentos: {
          color: 'PURPLE — bg-purple-100 + File icon 7w7 purple-600',
          title: '"Informe de Rendimentos"',
          description: '"Para declaração de Imposto de Renda"',
          button: 'outline sm mt-3 "Baixar 2025"',
          temporalHardcode: 'Ano "2025" hardcoded — não detecta ano fiscal corrente (em jan/fev/mar 2027 ainda mostraria 2025)',
          functionalGap: 'Button sem onClick / Sem dropdown anos anteriores',
        },

        commonGaps: [
          'cursor-pointer em ambas Cards SEM onClick — dead actions enganosas',
          'Buttons "Gerar Extrato" e "Baixar 2025" sem onClick',
          'Padrão idêntico ao gap de IBPixKeys Portabilidade/Reivindicar',
        ],
      },
    },

    knownGapsAcrossPage: [
      '3 filtros captured-but-ignored — bug arquitetural inter-página IB',
      'Botões Download e Share2 sem onClick em todos 5 rows (10 dead buttons)',
      'Cards Documents com cursor-pointer enganoso sem onClick',
      'Button "Baixar 2025" hardcoded temporal não detecta ano corrente',
      'Descrição "qualquer período" sem date picker',
      'FileSpreadsheet icon vs PDF descrito — gap semântico',
      'Sem distinção visual de comprovantes JÁ baixados',
      'Sem busca real apesar de searchQuery state',
      'Sem ordenação selecionável (apenas hardcoded cronológica decrescente)',
      'Sem paginação para casos com centenas de itens',
      'Sem agrupamento por data (IBExtract agrupa, IBProofs não)',
      'Sem Modal de preview do comprovante antes de baixar',
      'Sem opção bulk download (selecionar múltiplos + ZIP)',
      'Sem geração compartilhada via URL',
      'Sem filtro por valor range mín-máx',
      'Sem filtro por destinatário/origem',
      'Redundância conceitual com IBExtract sem distinção clara',
      '0 useEffect — sem refetch on focus',
      'ZERO uso de Transaction.list do SDK',
      'Filter icon importado mas NÃO USADO',
      'FileText icon importado mas NÃO USADO',
      'Sem badge "NOVO" para comprovantes recém-recebidos',
      'Sem audit log de quem baixou comprovante',
      'Sem ACL/visibility — todos comprovantes visíveis a todos usuários',
      'Continua gap ZERO i18n inter-página IB',
      'Continua ilha de navegação cross-page',
    ],
  },

  technical: {
    fileLocation: 'pages/IBProofs.jsx (235 linhas — A MENOR PÁGINA do módulo IB inteiro até o momento; 79% IBPixReceive 271L; 35% IBPixSend 689L; 46% IBExtract 511L)',
    routePath: '/IBProofs',
    moduleAffinity: 'Internet Banking — única página do bloco Comprovantes',
    accessedFrom: ['Menu lateral IB', 'NÃO está nos Quick Actions do IBHome'],

    imports: {
      react: 'useState (3× hooks)',
      reactRouter: 'NÃO IMPORTADO',
      i18n: 'NÃO IMPORTADO — gap inter-página persiste',
      lucide: '[FileText, Download, Search, Calendar, Share2, Filter, ArrowDownLeft, ArrowUpRight, File, FileSpreadsheet] — 10 icons',
      uiComponents: '[Card+CardContent+CardHeader (não usado)+CardTitle (não usado), Button, Badge (não usado), Input, Select+SelectContent+SelectItem+SelectTrigger+SelectValue]',
      utils: 'cn de @/lib/utils',
    },

    deadImports: {
      list: ['Filter — importado mas NÃO USADO no JSX', 'FileText — importado mas NÃO USADO (substituído por FileSpreadsheet/File)', 'CardHeader — não usado', 'CardTitle — não usado', 'Badge — não usado'],
      count: 5,
      observation: 'IBProofs tem 5 dead imports — MAIS que IBPixReceive (4), IBPixKeys (2), IBPixLimits (1) — pior cleanup do módulo IB',
    },

    stateManagement: {
      hooksCount: '3 useState — igual IBPixLimits',
      hooks: [
        'period default "30d" — controla Period Select',
        'transactionType default "all" — controla Transaction Type Select',
        'searchQuery default "" — controla Search Input',
      ],
      complexity: 'TODOS efetivamente usados (zero dead state — QUARTO caso consecutivo após Receive→Keys→Limits)',
      capturedButIgnored: 'TODOS captured-but-ignored — nenhum aplica filtragem ao array proofs',
      observation: 'Padrão de bug arquitetural igual IBExtract repetido aqui',
    },

    helperFunctions: {
      formatCurrency: 'Inline padrão Intl.NumberFormat pt-BR BRL — 7ª repetição no módulo IB inteiro (IBHome + IBExtract + IBPixSend + IBPixReceive + IBPixKeys + IBPixLimits + IBProofs)',
      observation: 'Não extraída para utility — gap arquitetural massivo',
    },

    designSystem: {
      pixOfficialColor: 'NÃO usado nesta página (apenas IBPixSend/Receive/Keys/Limits usam #00D26A)',
      arrowsDiagonals: 'PRIMEIRO uso de ArrowDownLeft + ArrowUpRight (diagonais) no módulo IB — IBHome usa TrendingUp/Down verticais',
      iconsForFiles: 'PRIMEIRO uso de FileSpreadsheet + File icons (genéricos)',
      colorPaletteRed: 'Sent transactions usam red-600 (negativo) — convenção financeira correta',
      colorPaletteEmerald: 'Received transactions usam emerald-600 (positivo) — convenção correta',
      contrastWithLimits: 'IBPixLimits inverteu cores semânticas (TrendingUp amber + TrendingDown emerald), IBProofs usa convenção padrão',
    },

    proofsMockData: {
      structure: '[{id, type, description, amount, date, time}]',
      count: 5,
      items: [
        '{PIX-2026012715324598765, sent, "Fornecedor ABC Ltda", 2500, 27/01/2026, 15:32}',
        '{PIX-2026012714324598765, received, "Empresa XYZ Ltda", 5000, 27/01/2026, 14:32}',
        '{PIX-2026012610004598765, sent, "Aluguel - Imobiliária", 3500, 26/01/2026, 10:00}',
        '{PIX-2026012618454598765, received, "João Silva", 1200, 26/01/2026, 18:45}',
        '{PIX-2026012509234598765, received, "Pagamento Fatura #4523", 8750, 25/01/2026, 09:23}',
      ],
      idFormat: '`PIX-YYYYMMDDHHMMSS{5digits}` — semi-aproximado TXID BACEN',
      distribution: '60% received / 40% sent',
      chronologicalOrder: 'Decrescente correto (mais recente primeiro)',
      richnessVsIBExtract: 'IBProofs tem 6 fields por mock vs IBExtract 14 fields — IBProofs é mais simples',
    },

    crossPageNavigation: {
      linksRenderizados: 'NENHUM',
      missingLinks: [
        'Sem voltar para IBHome',
        'Sem Link para IBExtract (página com mais detalhes)',
        'Sem Link para IBPixSend/Receive',
      ],
      observation: 'Continua ilha de navegação — TODAS as 7 páginas IB são ilhas (apenas IBHome linka 4 outras)',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'CENTENAS — header, sublabels, labels, placeholders, button labels, descriptions',
      impact: 'Continua gap inter-página IBHome (22 keys) → IBExtract (0) → IBPixSend (0) → IBPixReceive (0) → IBPixKeys (0) → IBPixLimits (0) → IBProofs (0)',
      conclusion: 'Apenas IBHome implementa i18n — restante das 6 páginas IB com ZERO keys',
    },

    knownGapsTechnical: [
      '235 linhas 100% MOCK — zero SDK base44',
      '0 useEffect — sem refetch on focus',
      'ZERO i18n — gap inter-página persiste',
      '5 dead imports (Filter, FileText, CardHeader, CardTitle, Badge) — PIOR cleanup do módulo IB',
      '3 useState — 100% aproveitados (4º caso zero-dead-state consecutivo)',
      '3/3 filtros captured-but-ignored — bug arquitetural inter-página',
      '10 dead buttons na lista (5 PDF Download + 5 Share2)',
      'Cards Documents cursor-pointer sem onClick — dead actions enganosas',
      'Button "Baixar 2025" hardcoded temporal',
      'Descrição "qualquer período" sem date picker',
      'FileSpreadsheet icon vs PDF descrito',
      'Sem distinção visual JÁ baixados',
      'Sem ordenação selecionável',
      'Sem paginação',
      'Sem agrupamento por data (IBExtract agrupa, IBProofs não — inconsistência)',
      'Sem Modal preview',
      'Sem bulk download',
      'Sem geração URL compartilhada',
      'Sem filtro por valor range',
      'Sem filtro por destinatário/origem',
      'Redundância conceitual com IBExtract',
      'ZERO uso Transaction.list SDK',
      'Sem badge NOVO para recém-recebidos',
      'Sem audit log download',
      'Sem ACL/visibility',
      'formatCurrency 7ª repetição no módulo (não extraída)',
      'Cross-page navigation ausente',
    ],
  },
};

export default IBProofsDoc;