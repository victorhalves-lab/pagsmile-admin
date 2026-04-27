// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBPixLimits (Internet Banking) — Entrega 19
// ----------------------------------------------------------------------------
// SEXTA página do módulo INTERNET BANKING — quarta e ÚLTIMA do bloco PIX.
// Encerra completamente o bloco PIX (Send + Receive + Keys + Limits).
//
//   1. IBPixLimits.jsx (305 linhas) — Gestão de limites diurno/noturno
//      + solicitação de alteração + histórico de alterações
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada via menu lateral IB sub-item de PIX (gap consistente — IBHome
//   só linka 4 das 7+ páginas IB e Limits NÃO está nos Quick Actions)
// - É a página menos rica em interatividade do bloco PIX e a SEGUNDA MENOR
//   do bloco depois de IBPixReceive (271L) — 305L vs 372 IBPixKeys vs 689 IBPixSend
// - É a ÚNICA página do bloco PIX que usa o COMPONENTE shadcn `Progress`
//   importado oficialmente (IBPixKeys fez progress bar artesanal inline)
// - É CONCEITUALMENTE complementar a IBPixSend — quando o user envia PIX no
//   Step 2 do wizard com valor X, é AQUI que o sistema validaria se X cabe no
//   `perTransaction` e se sum de X+todayUsedToday ≤ `daily` — gap arquitetural:
//   nenhum link para chegar do Wizard Step 2 (validation client-side ausente)
//   até IBPixLimits para o user solicitar aumento se valor exceder
//
// PADRÕES NOVOS NA PÁGINA (não vistos nas 5 anteriores do módulo IB):
// - PRIMEIRO uso REAL do componente Progress shadcn (IBPixKeys fez artesanal
//   inline) — Progress importado de @/components/ui/progress com value e
//   className h-3
// - PRIMEIRO uso de Sun/Moon icons no módulo IB para temporalidade visual
//   (diurno amber 6h-20h vs noturno indigo 20h-6h)
// - PRIMEIRO uso de TrendingUp + TrendingDown JUNTOS em UL temática
//   explicativa (sobre aumentos vs reduções) — IBHome usa TrendingUp 2× em
//   Cards Entradas+Saídas mas como icon decorativo, não didático
// - PRIMEIRA Card com `border-2` colorido (border-amber-200 + border-indigo-200)
//   delimitando contexto temporal — todas Cards anteriores usavam border padrão
//   slate-100 ou nenhum border destacado
// - PRIMEIRO uso de Badge com 2 variantes condicionais ternárias (approved
//   emerald-100/700 + rejected red-100/700) similar ao IBExtract mas inline
//   (não componente StatusBadge reutilizável)
// ============================================================================

export const IBPixLimitsDoc = {
  pageId: 'IBPixLimits',
  pagePaths: ['/IBPixLimits'],
  module: 'Internet Banking',
  section: 'PIX — Limites Pix (6ª e ÚLTIMA tela do módulo PIX)',

  explainer: {
    oneLiner:
      'Tela de gestão de limites PIX — 305 linhas 100% MOCK — encerra o bloco PIX (4 páginas: Send 689L + Keys 372L + Limits 305L + Receive 271L = 1637L total) — É a SEGUNDA MENOR do bloco depois IBPixReceive e a ÚNICA que usa o componente shadcn `Progress` real importado de @/components/ui/progress (IBPixKeys fez artesanal inline com div+style.width). Página single-page com 4 grandes blocos verticais + 1 Modal Dialog: (1) **Header minimalista** estrutura idêntica a IBPixReceive (sem CTA no header, sem Badge, sem ícone) — h1 "Limites Pix" 2xl-bold + sublabel "Gerencie seus limites de transferência" — note que IBPixKeys teve CTA "Cadastrar Chave" no header, IBPixSend tem progresso wizard, IBExtract tem Export — mas IBPixLimits volta ao minimalismo de IBPixReceive (cada Card tem seu próprio Button "Alterar" — distribuição de actions ao invés de centralizada); (2) **Current Limits grid 2-cols** (responsive: lg:grid-cols-2 / mobile grid-cols-1) com 2 Cards EXCEPCIONAIS na arquitetura visual (PRIMEIRO uso de border colorido temático no módulo IB): Card DIURNO `border-2 border-amber-200 dark:border-amber-800` + Card NOTURNO `border-2 border-indigo-200 dark:border-indigo-800` — bordas grossas (2px) com cores temáticas diferentes para cada janela temporal / cada Card tem CardHeader pb-4 com layout flex justify-between: ESQUERDA traz circle 12w12 rounded-xl bg-amber-100 (ou indigo-100) + Sun icon 6w6 amber-600 (ou Moon 6w6 indigo-600) + CardTitle text-lg "Limite Diurno" (ou "Limite Noturno") + sublabel `{period}` que vem dos mocks ("6h às 20h" / "20h às 6h") / DIREITA traz Button outline sm "Alterar" Edit3 icon que invoca handleEditLimit("daytime" ou "nighttime") abrindo Modal / CardContent space-y-4 contém: (a) **Grid 2-cols com 2 caixas info** (Por Transação + Diário) — cada caixa p-4 bg-slate-50 rounded-xl com label uppercase tracking-wider "POR TRANSAÇÃO" / "DIÁRIO" + valor xl-bold via formatCurrency / **mocks DIURNO**: perTransaction R$ 50.000 + daily R$ 200.000 + usedToday R$ 2.500 + period "6h às 20h" / **mocks NOTURNO**: perTransaction R$ 5.000 + daily R$ 10.000 + usedToday R$ 0 + period "20h às 6h" — note que noturno é 90% MENOR que diurno (R$ 5k vs R$ 50k por transação, R$ 10k vs R$ 200k diário) — coerente com regulamentação BACEN para LIMITES NOTURNOS REDUZIDOS POR SEGURANÇA contra sequestros e coação noturna (b) **Bloco específico Diurno**: 3 linhas verticais — linha "Utilizado hoje" / Progress (componente shadcn real h-3) value=daytimeUsagePercent (calculado 1.25% pois 2500/200000) / linha "Disponível" com valor R$ 197.500 emerald-600 — note que o cálculo `daytimeAvailable = daily - usedToday` está correto matematicamente / **gap funcional crítico**: Progress muito sutil (1.25% = barra praticamente vazia) sem aviso de "abundante disponível" / sem cor diferente quando próximo do limite (ex: 80%+ amarelo, 95%+ vermelho) (c) **Bloco específico Noturno**: NÃO tem Progress nem usedToday/Available (assimétrico vs Diurno!) — ao invés disso renderiza ALERT INFO em bg-indigo-50 com AlertCircle icon indigo-600 + texto "Limites noturnos são mais baixos por segurança. Transações acima do limite serão bloqueadas automaticamente." — **GAP ESTRUTURAL**: 2 Cards aparentemente simétricos (mesmo layout, mesma posição, ambos com Sun/Moon temáticos) MAS conteúdo assimétrico — Diurno mostra usage real, Noturno mostra apenas info textual / um designer rigoroso esperaria simetria total: ambos com Progress (mesmo Noturno em 0% seria informativo) ou ambos com Alert; (3) **Limit Change Info Card** com bg-slate-50 stand-out (similar ao Counter Card de IBPixKeys) p-5 contendo h3 "Sobre alterações de limite" + UL com 2 LIs flex items-start gap-2: LI1 com TrendingUp icon 4w4 amber-500 + texto "<strong>Aumentos</strong> podem levar até 48 horas para serem aprovados e podem requerer análise de segurança." / LI2 com TrendingDown icon 4w4 emerald-500 + texto "<strong>Reduções</strong> são aplicadas imediatamente para sua segurança." — **conteúdo BACEN-ALIGNED**: prazos diferenciados (aumento=análise; redução=imediata) seguem regra de prudência financeira anti-fraude correta / **uso INVERTIDO de cores semânticas**: TrendingUp aqui é amber (warning porque demanda análise) e TrendingDown é emerald (success porque imediato) — em outras páginas TrendingUp normalmente seria emerald (positivo) e TrendingDown red (negativo) — uso CONTEXTUAL inteligente: aqui não é sobre se vai pra cima ou pra baixo é sobre se demora ou é instantâneo; (4) **Histórico de Alterações** com label uppercase "Histórico de Alterações" + Card divide-y entre 2 rows mockadas: row1 `15/01/2026 / "Aumento diurno" / R$ 100.000 → R$ 200.000 / status approved` / row2 `10/12/2025 / "Aumento noturno" / R$ 5.000 → R$ 10.000 / status rejected` — cada row p-4 flex justify-between: ESQUERDA flex gap-4 com [div data text-sm slate-500 w-20 (largura fixa para alinhamento) + bloco multi-linha tipo+from-arrow-to (formatCurrency em ambos pontos com seta unicode →)] / DIREITA Badge condicional ternária 2-state: approved → bg-emerald-100 text-emerald-700 border-0 com CheckCircle2 icon 3w3 / rejected → bg-red-100 text-red-700 com XCircle 3w3 — **inconsistência arqueológica importante**: row2 mostra `from: 5000, to: 10000` aumento PEDIDO mas status=rejected — então o LIMITE ATUAL deveria ser 5000 (rejeição não aplicou) mas o mock atual de noturno EM USO (linha 49-51) mostra `daily: 10000` que é o valor REJEITADO — bug de consistência interna entre mocks: ou rejeição não impediu aplicação, ou o histórico está inconsistente com o estado atual; (5) **Edit Limit Modal Dialog** controlado por `showEditModal` boolean + `editingLimit` string ("daytime" ou "nighttime") com DialogTitle dinâmico "Solicitar Alteração de Limite Diurno" ou "Noturno" via ternário inline + DialogDescription "Informe o novo valor desejado para o limite." / Body py-4 contém: (a) **Input com label dinâmico** que mostra "Limite por transação (atual: R$ 50.000,00)" via formatCurrency aplicado a perTransaction do tipo selecionado — Input number com prefix "R$" absolute decorativo (similar a IBPixSend Step 2) + value linkado a newLimitValue useState (b) **Alert amber prazo** com Clock icon 5w5 amber-600 + título font-medium "Prazo de análise" + descrição "Aumentos de limite podem levar até 48 horas para aprovação." — repetição da info do bloco "Sobre alterações" mas em contexto de submit / **gap UX**: alert está sempre visível mesmo se usuário digitar valor MENOR (redução = imediato segundo info acima) — não detecta direção da mudança / DialogFooter com 2 Buttons: Cancelar outline + Solicitar Alteração #00D26A — **GAP CRÍTICO**: Button "Solicitar Alteração" SEM onClick — submit dead similar ao Cadastrar Chave do IBPixKeys / sem disabled mesmo com newLimitValue vazio / sem validação se novo valor está dentro dos limites BACEN (limite global PIX BACEN é R$ 1 milhão por transação para PJ); 3 useState (showEditModal false + editingLimit null + newLimitValue "") — TODOS aproveitados (continua zero-dead-state padrão pós-IBPixReceive — TERCEIRO caso consecutivo no bloco PIX) + 2 helpers (formatCurrency inline pt-BR + handleEditLimit que faz 3-mutações: setEditingLimit + setNewLimitValue("") + setShowEditModal(true)); gaps arquiteturais: (i) **Assimetria estrutural Diurno vs Noturno** — Diurno tem Progress + usedToday/Available, Noturno não tem (só Alert info) — visual rigoroso quebrado; (ii) **Inconsistência mock interno** — limit history row2 rejected mas estado atual reflete valor rejeitado; (iii) **Button "Solicitar Alteração" sem onClick** — submit dead consistente com gap do bloco PIX (Cadastrar Chave também dead); (iv) **Sem disabled em Solicitar com newLimitValue vazio** — repete gap de IBPixKeys; (v) **Sem validação de novo valor** — usuário pode pedir R$ 10 milhões / valores negativos / decimal com vírgula vs ponto; (vi) **Alert prazo sempre visível** — não detecta aumento vs redução pela direção da mudança; (vii) **Progress sem coloração condicional** — mesmo se uso > 80% Progress mantém cor azul padrão sem warning; (viii) **Histórico de apenas 2 itens hardcoded** — sem paginação, sem filtro, sem busca; (ix) **Sem coluna "Solicitado por"** — quem na empresa pediu o aumento? log auditoria BACEN obrigatório ausente; (x) **Sem motivo da rejeição** — row2 mostra "Negado" mas não diz por quê (compliance? análise risco? doc faltando?); (xi) **Sem possibilidade de cancelar solicitação pendente** — não há mock de status "pending" na lista — todas approved/rejected (gap UX: solicitar fica em "pending" 48h sem feedback durante o aguardo); (xii) **Sem tooltip explicando "noturno por segurança"** — feature regulatória importante sem onboarding; (xiii) **Período "6h às 20h" hardcoded** — em apps reais o usuário pode escolher se quer customizar a janela diurna (alguns bancos permitem); (xiv) **Sem distinção PIX-PIX vs PIX-saque** — BACEN distingue limites para Pix Saque (Limite específico R$ 600 noturno por transação) que aqui não aparece; (xv) **Sem histórico de uso por hora/dia da semana** — analytics que ajudaria entender se usuário precisa de mais limite; (xvi) **Sem botão "voltar ao limite padrão"** — se usuário aumentou e quer reduzir tem que ir Modal manualmente; (xvii) **Sem expor limite mensal além de daily** — BACEN não exige mas alguns bancos oferecem; (xviii) **Sem expor "limite por destinatário"** — comum em apps bancários para travar destinatários novos com valor mais baixo; (xix) **Sem indicar que mudança redefine ou substitui requests pendentes** — se já solicitou aumento e abre Modal de novo, não há aviso; (xx) **0 useEffect** — limites mockados ao mount, sem refetch on focus (usuário não vê mudança se admin aprovar enquanto está com a tela aberta); (xxi) **Sem realtime updates** — Subaccount.subscribe poderia atualizar limites em tempo real; (xxii) **handleEditLimit reseta newLimitValue mas não pre-populates com valor atual** — UX padrão seria pré-preencher com valor corrente para usuário ajustar a partir dele.',

    sectionsBreakdown: {
      headerMinimal: {
        role: 'Header sem CTA sem Badge sem ícone',
        comparisonModule: 'Volta ao minimalismo IBPixReceive (vs IBPixKeys que tem CTA Cadastrar Chave centralizado)',
        actionDistribution: 'Cada Card tem Button "Alterar" próprio — actions distribuídas ao invés de centralizadas no header',
      },

      currentLimitsGrid: {
        role: 'Grid 2-cols com 2 Cards temáticos colorido',
        responsive: 'lg:grid-cols-2 / mobile grid-cols-1',

        cardDaytime: {
          border: 'border-2 border-amber-200 dark:border-amber-800 (PRIMEIRA Card border colorido do módulo IB)',
          headerLeft: '[circle 12w12 bg-amber-100 + Sun 6w6 amber-600 + Title "Limite Diurno" + sublabel "6h às 20h"]',
          headerRight: 'Button outline sm "Alterar" Edit3 invoca handleEditLimit("daytime")',

          contentBlocks: {
            grid2cols: '[Por Transação R$ 50.000 + Diário R$ 200.000 / xl-bold formatCurrency]',
            usageSection: {
              line1: '[label "Utilizado hoje" / valor R$ 2.500]',
              progressBar: 'PRIMEIRO uso real do componente shadcn Progress no módulo IB / value=daytimeUsagePercent / className h-3',
              line2: '[label "Disponível" / valor R$ 197.500 emerald-600]',
              calcCorrect: 'daytimeAvailable = daily - usedToday matematicamente correto',
              gapColorCoding: 'Progress sem cor condicional (80%+ warning, 95%+ critical)',
            },
          },
        },

        cardNighttime: {
          border: 'border-2 border-indigo-200 dark:border-indigo-800',
          headerLeft: '[circle 12w12 bg-indigo-100 + Moon 6w6 indigo-600 + Title "Limite Noturno" + sublabel "20h às 6h"]',
          headerRight: 'Button outline sm "Alterar" → handleEditLimit("nighttime")',

          contentBlocks: {
            grid2cols: '[Por Transação R$ 5.000 + Diário R$ 10.000 / 90% MENOR que diurno — BACEN regula limites noturnos reduzidos por segurança]',

            assimetricBlock: {
              type: 'Alert info (NÃO Progress como Diurno)',
              styling: 'p-4 bg-indigo-50 rounded-xl flex items-start gap-3',
              icon: 'AlertCircle 5w5 indigo-600',
              text: '"Limites noturnos são mais baixos por segurança. Transações acima do limite serão bloqueadas automaticamente."',
              gapStructural: 'Diurno tem Progress + usedToday/Available, Noturno NÃO TEM — assimetria visual/conceitual',
            },
          },
        },
      },

      limitChangeInfoCard: {
        role: 'Card educativo standalone',
        styling: 'bg-slate-50 dark:bg-slate-800/50 (similar ao Counter Card IBPixKeys)',
        title: '"Sobre alterações de limite"',
        list: 'UL com 2 LIs flex items-start gap-2',

        li1: {
          icon: 'TrendingUp 4w4 amber-500',
          content: '<strong>Aumentos</strong> podem levar até 48 horas para serem aprovados e podem requerer análise de segurança.',
          colorSemantic: 'AMBER = warning por demanda análise (NÃO emerald positivo padrão)',
        },

        li2: {
          icon: 'TrendingDown 4w4 emerald-500',
          content: '<strong>Reduções</strong> são aplicadas imediatamente para sua segurança.',
          colorSemantic: 'EMERALD = success por instantaneidade (NÃO red negativo padrão)',
          observation: 'Cores invertidas vs convenção financeira normal — uso CONTEXTUAL: aqui é sobre prazo não sobre direção do valor',
        },

        bacenAlignment: 'Prazos diferenciados (aumento=análise / redução=imediata) seguem prudência financeira anti-fraude',
      },

      historySection: {
        role: 'Lista histórica de mudanças solicitadas',
        cardStructure: 'Card divide-y com 2 rows mockadas',
        rowLayout: 'flex justify-between p-4',

        row1: {
          date: '15/01/2026',
          type: '"Aumento diurno"',
          change: 'R$ 100.000 → R$ 200.000',
          status: 'approved',
          badge: 'bg-emerald-100 text-emerald-700 border-0 + CheckCircle2 3w3',
          badgeLabel: '"Aprovado"',
        },

        row2: {
          date: '10/12/2025',
          type: '"Aumento noturno"',
          change: 'R$ 5.000 → R$ 10.000',
          status: 'rejected',
          badge: 'bg-red-100 text-red-700 border-0 + XCircle 3w3',
          badgeLabel: '"Negado"',
          mockInconsistency: 'CRÍTICO — status rejected mas mock noturno atual mostra daily=10000 (valor pedido) — quer dizer que rejeição NÃO bloqueou aplicação OU histórico inconsistente com estado atual',
        },

        leftBlock: '[date text-sm slate-500 w-20 alinhamento fixo + bloco tipo+from-arrow-to formatCurrency com → unicode]',

        gaps: [
          'Apenas 2 itens hardcoded sem paginação/filtro/busca',
          'Sem coluna "Solicitado por" — log auditoria BACEN ausente',
          'Sem motivo da rejeição',
          'Sem status "pending" — todos approved/rejected',
          'Sem possibilidade de cancelar solicitação pendente',
        ],
      },

      editLimitModal: {
        role: 'Solicitar nova alteração de limite',
        controlState: 'showEditModal + editingLimit + newLimitValue',
        title: 'Dinâmico "Solicitar Alteração de Limite Diurno" OU "Noturno"',
        description: '"Informe o novo valor desejado para o limite."',

        bodyBlocks: {
          inputBlock: {
            label: 'Dinâmico "Limite por transação (atual: {formatCurrency(perTransaction do tipo)})"',
            inputType: 'number com prefix R$ absolute decorativo (similar IBPixSend Step 2)',
            stateBinding: 'newLimitValue useState',
            gap: 'NÃO pre-populates com valor atual — UX padrão seria pré-preencher para ajustar',
          },

          alertPrazo: {
            styling: 'p-4 bg-amber-50 + Clock icon 5w5 amber-600',
            title: '"Prazo de análise"',
            description: '"Aumentos de limite podem levar até 48 horas para aprovação."',
            gapAlwaysVisible: 'Alert sempre visível MESMO se redução (que é imediata segundo info card) — não detecta direção',
          },
        },

        footer: {
          buttons: '[Cancelar outline / Solicitar Alteração #00D26A]',
          gap: 'Button "Solicitar Alteração" SEM onClick — submit dead',
          gap2: 'Sem disabled mesmo com newLimitValue vazio',
          gap3: 'Sem validação de valor (limite global PIX BACEN R$ 1M para PJ)',
        },
      },
    },

    knownGapsAcrossPage: [
      'Assimetria estrutural Diurno (Progress) vs Noturno (Alert) — visual rigoroso quebrado',
      'Inconsistência mock interno — row2 rejected mas estado atual reflete valor rejeitado',
      'Button "Solicitar Alteração" sem onClick — submit dead',
      'Sem disabled em Solicitar com newLimitValue vazio',
      'Sem validação de novo valor (negativos / R$ 10M / decimais)',
      'Alert prazo sempre visível — não detecta aumento vs redução',
      'Progress sem coloração condicional (80%+ warning, 95%+ critical)',
      'Histórico apenas 2 itens hardcoded sem paginação/filtro/busca',
      'Sem coluna "Solicitado por" — log auditoria BACEN ausente',
      'Sem motivo da rejeição na row2',
      'Sem status "pending" — todos approved/rejected (gap fluxo 48h)',
      'Sem cancelar solicitação pendente',
      'Sem tooltip explicando "noturno por segurança"',
      'Período "6h às 20h" hardcoded — não customizável',
      'Sem distinção Pix-Pix vs Pix Saque (BACEN R$ 600 noturno saque)',
      'Sem histórico de uso por hora/dia',
      'Sem botão "voltar ao limite padrão"',
      'Sem limite mensal além de daily',
      'Sem limite por destinatário',
      'Sem aviso ao redefinir requests pendentes',
      '0 useEffect — sem refetch on focus',
      'Sem realtime via Subaccount.subscribe()',
      'handleEditLimit não pre-populates valor atual no input',
      'Continua gap ZERO i18n inter-página IB',
      'Continua ilha de navegação cross-page',
      'Sem link cross-page para IBPixSend (validar valor exceder)',
    ],
  },

  technical: {
    fileLocation: 'pages/IBPixLimits.jsx (305 linhas — segunda menor do bloco PIX após IBPixReceive 271L; 18% menor que IBPixKeys 372L; 56% menor que IBPixSend 689L)',
    routePath: '/IBPixLimits',
    moduleAffinity: 'Internet Banking — quarta e ÚLTIMA página do bloco PIX',
    accessedFrom: ['Menu lateral IB sub-item PIX', 'NÃO está nos Quick Actions do IBHome'],

    imports: {
      react: 'useState (3× hooks)',
      reactRouter: 'NÃO IMPORTADO',
      i18n: 'NÃO IMPORTADO — gap inter-página persiste',
      lucide: '[Sun, Moon, TrendingUp, TrendingDown, AlertCircle, Clock, CheckCircle2, XCircle, Edit3] — 9 icons',
      uiComponents: '[Card+CardContent+CardHeader+CardTitle, Button, Badge, Progress, Input, Label, Dialog (6 sub-components)]',
      utils: 'cn de @/lib/utils',
    },

    deadImports: {
      list: ['cn — importado mas NÃO usado no JSX (todos className são strings literais)'],
      observation: '1 dead import — menos que IBPixReceive (4) e IBPixKeys (2)',
    },

    stateManagement: {
      hooksCount: '3 useState — MENOS que IBPixReceive (4) e IBPixKeys (6)',
      hooks: [
        'showEditModal false — controla Dialog open',
        'editingLimit null — qual limit está sendo editado ("daytime" ou "nighttime")',
        'newLimitValue "" — input do novo valor',
      ],
      complexity: 'TODOS efetivamente usados — ZERO dead state (TERCEIRO caso consecutivo no bloco PIX após Receive e Keys)',
      observation: 'Padrão zero-dead-state se consolida no bloco PIX',
    },

    helperFunctions: {
      formatCurrency: 'Inline padrão Intl.NumberFormat pt-BR BRL — repetido em todas as 4 páginas do bloco PIX (gap: não extraído para utility)',
      handleEditLimit: '`(type) => { setEditingLimit(type); setNewLimitValue(""); setShowEditModal(true); }` — 3 mutations sequenciais',
      gapHelper: 'handleEditLimit reseta newLimitValue mas NÃO pre-populates com valor atual',
    },

    derivedValues: {
      daytimeUsagePercent: '`(2500 / 200000) * 100 = 1.25%`',
      daytimeAvailable: '`200000 - 2500 = 197500` correto matematicamente',
      observation: '2 valores derivados calculados inline no body do componente (boa prática mas poderia ser useMemo se houvesse re-renders pesados)',
    },

    progressComponentUsage: {
      first: 'PRIMEIRA página do módulo IB usando componente shadcn Progress real',
      contrast: 'IBPixKeys fez progress bar artesanal inline com div+style.width',
      props: 'value={daytimeUsagePercent} className="h-3"',
      gap: 'Sem cor condicional — mesma cor azul padrão para 1% ou 95%',
    },

    designSystem: {
      pixOfficialColor: '#00D26A — usado APENAS no Button "Solicitar Alteração" do Modal',
      thematicBordersFirst: 'PRIMEIRO uso de border-2 colorido temático (amber-200 + indigo-200) no módulo IB',
      colorSemanticInverted: 'TrendingUp amber + TrendingDown emerald — cores invertidas vs convenção financeira (uso CONTEXTUAL para prazo não direção do valor)',
      iconographyTemporal: 'Sun (diurno) + Moon (noturno) — primeira temporalidade visual no módulo IB',
      badgeStatusInline: 'PRIMEIRO Badge condicional 2-state inline (approved/rejected) com cores emerald/red — IBExtract tinha conceito similar mas via mapping objeto',
    },

    limitsMockData: {
      structure: '{ daytime: {...}, nighttime: {...} }',
      daytime: {
        perTransaction: 50000,
        daily: 200000,
        usedToday: 2500,
        period: '"6h às 20h"',
      },
      nighttime: {
        perTransaction: 5000,
        daily: 10000,
        usedToday: 0,
        period: '"20h às 6h"',
      },
      bacenAlignment: 'Limites noturnos 90% MENORES — coerente regulamentação BACEN anti-sequestro/coação',
    },

    limitHistoryMockData: {
      structure: '[{id, date, type, from, to, status}]',
      count: 2,
      items: [
        '{id:1, date:"15/01/2026", type:"Aumento diurno", from:100000, to:200000, status:"approved"}',
        '{id:2, date:"10/12/2025", type:"Aumento noturno", from:5000, to:10000, status:"rejected"}',
      ],
      mockInconsistency: 'row2 rejected mas estado atual nighttime daily=10000 (valor pedido) — bug de consistência',
    },

    crossPageNavigation: {
      linksRenderizados: 'NENHUM',
      missingLinks: [
        'Sem voltar para IBHome',
        'Sem Link para IBPixSend (após aumentar limite, ir enviar PIX)',
        'Sem Link reverso de IBPixSend Step 2 quando valor excede limite',
        'Sem Link IBPixReceive ou IBPixKeys',
      ],
      observation: 'Continua ilha de navegação — toda cross-page nav do bloco PIX está ausente',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'CENTENAS — header, labels, placeholders, button labels, dialog titles/descriptions, badge labels, alert messages, helper texts',
      impact: 'Continua gap inter-página IBHome (22 keys) → IBExtract (0) → IBPixSend (0) → IBPixReceive (0) → IBPixKeys (0) → IBPixLimits (0)',
      conclusion: 'Bloco PIX inteiro (Send+Receive+Keys+Limits) com ZERO i18n — gap arquitetural sistêmico',
    },

    blockPixSummary: {
      totalLines: '305 + 271 + 372 + 689 = 1637 linhas no bloco PIX',
      totalUseStateAcrossBlock: '3 + 4 + 6 + 9 = 22 useState',
      progressComponentUsage: 'Apenas IBPixLimits (1/4 páginas)',
      sideDrawerUsage: 'Apenas IBPixKeys (1/4 páginas)',
      alertDialogUsage: 'Apenas IBPixKeys (1/4 páginas)',
      modalDialogUsage: 'IBPixReceive + IBPixLimits (2/4 páginas)',
      i18nKeys: '0 em todas as 4 páginas',
      bacenComplianceVisual: 'Limites noturnos 90% menores ✓ / OTP mencionado ✓ / Limite 20 chaves CNPJ ✓',
      bacenComplianceFunctional: 'Quase nada implementado — 99% mock visual',
      sdkUsage: '0% — nenhuma das 4 páginas usa Subaccount.subscribe ou Transaction.list',
      crossPageNav: '0 Links — todas as 4 páginas são ilhas',
    },

    knownGapsTechnical: [
      '305 linhas 100% MOCK — zero SDK base44',
      '0 useEffect — sem refetch on focus',
      'ZERO i18n — gap inter-página persiste',
      '1 dead import (cn não usado)',
      '3 useState — 100% aproveitados (3º caso zero-dead-state consecutivo no bloco PIX)',
      'PRIMEIRO uso real Progress shadcn no IB',
      'Assimetria Diurno/Noturno (Progress só em diurno)',
      'Inconsistência mock interno (rejected vs estado atual)',
      'Button "Solicitar Alteração" sem onClick — submit dead',
      'Sem disabled em Solicitar com newLimitValue vazio',
      'Sem validação de valor',
      'Alert prazo sempre visível — não detecta direção da mudança',
      'Progress sem cor condicional',
      'Histórico 2 itens hardcoded',
      'Sem auditoria "Solicitado por"',
      'Sem motivo da rejeição',
      'Sem status "pending"',
      'Sem cancelar solicitação pendente',
      'Sem tooltip explicando "noturno por segurança"',
      'Período hardcoded não customizável',
      'Sem distinção Pix-Pix vs Pix Saque',
      'Sem histórico de uso por hora',
      'Sem botão voltar ao limite padrão',
      'Sem limite mensal',
      'Sem limite por destinatário',
      'handleEditLimit não pre-populates valor atual',
      'formatCurrency duplicada nas 4 páginas do bloco PIX (não extraída)',
      'Cross-page navigation ausente — ilha sem Links',
      'Sem realtime via Subaccount.subscribe',
    ],
  },
};

export default IBPixLimitsDoc;