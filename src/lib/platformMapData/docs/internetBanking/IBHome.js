// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBHome (Internet Banking) — Entrega 14
// ----------------------------------------------------------------------------
// PRIMEIRA página do módulo INTERNET BANKING — abre a documentação do 3º e
// último módulo da plataforma (após Admin Sub e Admin Interno).
//
//   1. IBHome.jsx (297 linhas) — Tela inicial / Home da Conta Digital
//
// CONTEXTO DO MÓDULO:
// - Internet Banking é a "Conta Digital" integrada à plataforma PagSmile
// - Acessado pelo merchant logado para movimentar saldo (PIX), gerar
//   comprovantes e configurar segurança/notificações/acessos pessoais
// - Identidade visual do módulo: emerald/teal (#10b981) — diferente do
//   Admin Sub (#2bc196 brand PagSmile) e do Admin Interno (#8b5cf6 violet)
// - Navegação dentro do módulo: layout.jsx detecta `currentModule === "internet-banking"`
//   e renderiza menu próprio com Home / Extrato / PIX (4 sub) / Comprovantes /
//   Configurações (5 sub) — total 11 páginas
//
// PADRÃO DE DESIGN OBSERVADO:
// - Esta é a única tela do IB com IDENTIDADE VISUAL DUPLA:
//   • Brand PagSmile #2bc196 (verde-água) para acentos e CTAs
//   • Gradient navy #002443 → #003459 → #004D73 para o card de saldo principal
// - Esses dois conjuntos cromáticos NÃO se repetem em proporção igual em
//   nenhuma outra tela da plataforma — IBHome é a vitrine visual do módulo
// ============================================================================

export const IBHomeDoc = {
  pageId: 'IBHome',
  pagePaths: ['/IBHome'],
  module: 'Internet Banking',
  section: 'Home — primeira tela do módulo',

  explainer: {
    oneLiner:
      'Tela inicial da Conta Digital (Internet Banking) — 297 linhas 100% MOCK — é o "dashboard de bolso" do merchant logado, com 4 grandes blocos verticais que cobrem o ciclo de uso recorrente da conta: saudação personalizada com badge de status / Card de Saldo principal navy gradient com toggle de privacidade (Eye/EyeOff) e 3 valores (disponível big + bloqueado amber + total cinza) + 3 ações rápidas embutidas (Send PIX / Receber PIX / Minhas Chaves) — exclui propositalmente "Cards" do array `quickActions` que existe no código mas só é mostrado nas 4 actions de cima do array (a 4ª "Cards" amber-orange JAMAIS é renderizada porque o `.slice(0, 3)` no JSX corta) / Resumo do Mês com 2 Cards lado a lado (Entradas verde +18% com barra 100% gradient emerald-2bc196 vs Saídas vermelho +5% com barra HARDCODED 74% que NÃO reflete proporção real entre 250k e 185k = 74%? — coincidentalmente bate, mas é string fixa não calculada) / Lista de Transações Recentes com 5 mocks alternando type "received"/"sent" (cada linha tem icon circular gradient direcional ArrowDownLeft emerald p/ recebido / ArrowUpRight red p/ enviado, label fixo "PIX Recebido"/"PIX Enviado" via i18n IGNORANDO a description real do mock que vai como subtítulo, Badge category outline cinza, timestamp string solta, valor color-coded com prefixo + ou - e formatCurrency global) + Botão "Ver Extrato" outline brand-color que é a ÚNICA navegação cross-page real desta tela (Link → IBExtract); state extremamente enxuto (apenas `showBalance` boolean default TRUE controlando privacidade do saldo via Eye/EyeOff toggle e função `formatCurrency` que retorna "••••••" quando hidden — máscara aplicada 7× na página: 1× saldo disponível 4xl + 1× bloqueado + 1× total + 1× entradas 3xl + 1× saídas 3xl + 5× valores das transações = TOTAL 12 ocorrências mascaradas com um único click) / **i18n REAL** com useTranslation() do react-i18next (única página do IB com chaves traduzidas observadas: 14 keys do namespace `internet_banking` — good_morning / your_digital_account / last_update / just_now / account_active / available_balance / blocked / total / month_summary / entries / total_received / exits / total_sent / recent_transactions / your_recent_transactions / see_statement / pix_received / pix_sent / send_pix / receive_pix / my_keys / cards) / **Header/saudação extremamente bem trabalhado** com Sparkles icon brand cor + "Bom dia" verde + "Sua Conta Digital" 2xl bold + Clock icon "Última atualização: agora mesmo" — dá tom acolhedor (PADRÃO DIFERENTE do resto da plataforma onde headers são funcionais/informativos sem saudação contextual — apenas IBHome tem saudação) + Badge gradient verde "Conta Ativa" CircleDollarSign — comunica STATUS positivo permanente (não muda); **Card Saldo Principal é o ELEMENTO VISUAL MAIS RICO de toda a plataforma**: gradient triplo navy `from-[#002443] via-[#003459] to-[#004D73]` (idêntico aos backgrounds dos cards do Admin Sub mas usado AQUI como protagonista), text-white, shadow-2xl, overflow-hidden + 2 BLUR PSEUDO-ELEMENTS decorativos absolute (top-right 64w 64h bg-#2bc196 opacity-10 blur-3xl translate-x/2 -translate-y/2 + bottom-left 48w 48h bg-blue-500 opacity-10 blur-3xl translate inverso) — efeito "bokeh" é EXCLUSIVO desta página em todo o app / Layout interno flex-col lg:flex-row entre área esquerda saldo+stats e área direita 3 quick actions / Esquerda: ícone Wallet em circle gradient brand 12w12 + Label uppercase tracking-wide "Saldo Disponível" + Eye/EyeOff toggle button hover bg-white/10 + Valor 4xl font-black tracking-tight + linha divisória pt-4 border-t border-white/10 com 2 mini-stats lado a lado separados por divisor vertical w-px h-10 bg-white/10: Bloqueado (Lock icon amber-400 em circle bg-amber-500/20) e Total (Banknote icon slate-300 em circle bg-white/10) / Direita: 3 botões Quick Action vindos do array `quickActions` mas com `.slice(0, 3)` cortando o 4º (Cards) — cada botão é Link → page com iconBox 10w10 gradient específico hardcoded (PIX=brand-emerald / Receber=blue-500-600 / Chaves=violet-500-purple-600), bg-white/10 com hover bg-white/20 e hover:scale-105 transition-all duration-300; **Resumo do Mês** intitulado com Calendar icon brand + Badge outline brand "Janeiro 2026" HARDCODED (não pega data real do sistema, apesar de a app rodar em 2026-04 — gap temporal) — 2 Cards grid-cols-1 md:grid-cols-2 que SÃO ESPELHO ATTRIBUTE-POR-ATTRIBUTE (entradas verde / saídas vermelho — idênticos exceto cor): border-2 emerald/red-200, gradient via-50/50 to-white, blur-circle decorativo top-right, group-hover:scale-110 no icon-box ArrowDownLeft/ArrowUpRight, header com label uppercase + sublabel cinza "Total recebido"/"Total enviado", pill TrendingUp +18%/+5% (BUG: ambos usam TrendingUp icon mesmo quando saídas crescerem deveria ser TrendingDown ou alerta — inconsistência semântica de UX), valor 3xl font-black, ProgressBar customizada div h-3 com width inline (`100%` entradas / `74%` saídas — a saída de 185.000 sobre 250.000 dá 74% real; a barra está PROPORCIONAL às entradas mas a entrada está SEMPRE 100% mesmo se cair, hardcode); **Transações Recentes** Card border-2 com Header gradient slate-50 to-white + iconBox brand 10w10 Banknote + título 2xl + sublabel + Botão "Ver Extrato" outline brand → Link IBExtract — body é divide-y entre as 5 linhas mock (sem padding entre, apenas linha hairline): cada linha é flex justify-between com hover:bg-slate-50 e cursor-pointer (mas NÃO tem onClick — gap de UX: cursor sugere clique sem ação) + group para hover:scale-110 no icon / Esquerda: iconBox 12w12 gradient direcional condicional (received=ArrowDownLeft branco em circle gradient emerald-400 to brand shadow-emerald-500/20 / sent=ArrowUpRight branco em circle gradient red-400 to red-600 shadow-red-500/20) + texto duplo (label fixo via i18n "PIX Recebido"/"PIX Enviado" IGNORANDO `transaction.description` que vira sublabel + linha tripla com Badge category outline + timestamp inline) / Direita: valor lg font-bold com prefixo "+ "/"- " + cor condicional emerald/red — linha 0 (mais recente) tem destaque sutil bg-gradient-to-r from-slate-50/50; gaps e quirks da implementação: (a) **showBalance toggle é VISUAL APENAS** — não persiste em localStorage, ao recarregar volta TRUE / mascara substring "••••••" (6 bullets fixos, não escala com tamanho do número — saldo 125.430,50 vira 6 bullets só); (b) **balance.total NÃO É CALCULADO** — é hardcode 130430.50 que coincidentalmente = available 125430.50 + blocked 5000.00 (deveria ser computed `balance.available + balance.blocked`); (c) **monthSummary.exitsChange = +5** com TrendingUp icon — para SAÍDAS aumentar é NEGATIVO em UX bancário (+5% de gastos = ruim) mas a UI mostra TrendingUp green-style (no Card vermelho mas com TrendingUp shape) — inconsistência semântica; (d) **5 transações HARDCODED com timestamps absolutos** (Hoje 14:32 / Hoje 11:15 / Ontem 18:45 / Ontem 10:00 / 25/01 09:23) — não recalcula em runtime, fica desatualizado sempre; (e) **Categorias `category`** declaradas no mock (Vendas/Fornecedores/Despesas/Recebíveis) MAS o JSX renderiza Badge cinza outline genérico sem cor diferenciada por categoria — campo presente mas não destacado visualmente; (f) **Quick Action "Cards"** existe no array `quickActions` (idx 3, ícone CreditCard, gradient amber-orange) mas é **CORTADO PELO `.slice(0, 3)`** no JSX e NUNCA aparece — ou esqueceram de remover do array, ou era para ser exibido em outro local; (g) **`quickActions[3].page` aponta para "IBHome"** (próprio self-link) — confirmação de que é dead code não removido; (h) **NENHUM uso da SDK base44** — não busca user real, não busca saldo real, não busca transações reais (Subaccount entity tem `balance_available`, `balance_blocked`, `balance_pending_release`, `revenue_current_month`, `total_lifetime_tpv` — todos disponíveis no schema mas IGNORADOS); (i) **Sem loading states / sem error states / sem empty states** — se o array de transações fosse vazio, renderiza `divide-y` sem fallback; (j) **Sem onClick nas linhas de transação** apesar de `cursor-pointer` e `group` — visualmente convida ao clique mas é morto; (k) **i18n parcial** — Date label "Janeiro 2026" e timestamps das transações ("Hoje, 14:32" etc) são strings hardcoded SEM tradução, apenas labels macro são traduzidos; (l) **Sem conexão com módulo IBSettings/Notificações** — Bell icon do header global do IB não está aqui, apenas Sparkles+Clock; (m) **Estrutura visual é "vertical-only"** — não há sidebar interna nem tabs nem filtros — IBHome é puramente apresentação, navegação é só pelo Quick Action grid e botão "Ver Extrato".',

    sectionsBreakdown: {
      headerSaudacao: {
        role: 'Header de boas-vindas — único bloco da plataforma com saudação contextual',
        structure: 'flex justify-between',
        leftSide: {
          line1: 'Sparkles icon brand-color w-5 + label "Bom dia" t("internet_banking.good_morning") brand-color font-medium text-sm',
          line2: 'Heading 2xl bold "Sua Conta Digital" t("internet_banking.your_digital_account")',
          line3: 'Clock icon w-4 + "Última atualização: agora mesmo" t("internet_banking.last_update") + t("internet_banking.just_now") — texto slate-500',
        },
        rightSide: {
          element: 'Badge gradient brand → emerald-500 white border-0 px-3 py-1',
          content: 'CircleDollarSign w-3 + t("internet_banking.account_active")',
          gap: 'Status "Conta Ativa" é HARDCODED — sempre verde, não reflete suspensões/bloqueios reais',
        },
        gap: 'Saudação NÃO é dinâmica — sempre "Bom dia" mesmo às 23h (gap de UX — falta lógica condicional baseada em new Date().getHours())',
      },

      cardSaldoPrincipal: {
        role: 'Hero card — protagonista absoluto da página',
        backgroundGradient: '`from-[#002443] via-[#003459] to-[#004D73]` (navy triplo) + 2 blur pseudo-elements decorativos absolute',
        decorativeBlurs: '[bg-#2bc196 opacity-10 blur-3xl top-right / bg-blue-500 opacity-10 blur-3xl bottom-left] — efeito bokeh ÚNICO no app',
        layout: 'flex-col lg:flex-row entre área esquerda (saldo+stats) e área direita (3 quick actions)',

        leftSide: {
          iconBox: 'Wallet w-6 em circle 12w12 gradient brand → emerald-500 shadow-lg shadow-brand/30',
          labelLine: '[Label "Saldo Disponível" uppercase tracking-wide slate-400 / Toggle button Eye/EyeOff hover bg-white/10 — controla showBalance]',
          mainValue: 'Saldo disponível em 4xl font-black tracking-tight white via formatCurrency(balance.available)',
          divider: 'pt-4 border-t border-white/10',
          ministats: '2 stats lado a lado separados por divider vertical w-px h-10',
          stat1Bloqueado: '[Lock icon amber-400 em circle bg-amber-500/20 / Label uppercase "Bloqueado" / Valor amber-400 sm font-bold]',
          stat2Total: '[Banknote slate-300 em circle bg-white/10 / Label uppercase "Total" / Valor white sm font-bold]',
        },

        rightSide: {
          quickActionsGrid: '3 botões via quickActions.slice(0, 3)',
          buttonStructure: 'Link → page + button flex-col p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm hover:scale-105 min-w-[90px]',
          eachButton: '[iconBox 10w10 gradient específico / label texto xs white]',
          actionsRendered: '[Send PIX → IBPixSend brand-emerald / Receber PIX → IBPixReceive blue-500-600 / Chaves → IBPixKeys violet-500-purple-600]',
          slicedOut: 'Cards (idx 3) NÃO renderizado — slice(0,3) corta',
        },
      },

      mainBalanceState: {
        showBalance: 'boolean default TRUE — controla privacidade global da página',
        formatCurrencyFunction: '`formatCurrency(value) → showBalance ? Intl.NumberFormat("pt-BR", BRL) : "••••••"`',
        appliedTo: '7 campos visualmente, 12 ocorrências reais (saldo + bloqueado + total + entradas + saídas + 5 valores transações)',
        gaps: [
          'showBalance NÃO persiste em localStorage — toggle volta TRUE em refresh',
          'Mask "••••••" é 6 bullets FIXOS — não escala com tamanho do valor mascarado',
          'Toggle não tem aria-label (acessibilidade)',
        ],
      },

      hardcodedDataMocks: {
        balance: '{available: 125430.50, blocked: 5000.00, total: 130430.50}',
        balanceTotalGap: 'total = 130430.50 hardcode (deveria ser computed available + blocked = 130430.50 — coincide hoje, mas pode divergir)',
        monthSummary: '{entries: 250000, entriesChange: 18, exits: 185000, exitsChange: 5}',
        recentTransactions: '5 itens com {id, type "received"/"sent", description, date string, amount, category}',
        quickActions: '4 itens MAS apenas 3 renderizados (Cards é dead code)',
        gap: 'Zero useState para data — mocks declarados em escopo de função, recriam a cada render',
      },

      resumoMes: {
        role: 'Resumo financeiro de Entradas vs Saídas',
        header: 'Calendar icon brand + heading "Resumo do Mês" + Badge outline brand "Janeiro 2026" HARDCODED',
        gridLayout: 'grid-cols-1 md:grid-cols-2',

        cardEntradas: {
          theme: 'green/emerald positivo',
          border: 'border-2 emerald-200 dark:emerald-800',
          background: 'gradient via-emerald-50/50 to-white com blur-circle emerald top-right',
          iconBox: 'ArrowDownLeft branco em circle 12w12 gradient emerald-400 → brand shadow-emerald-500/30 group-hover:scale-110',
          headerLabels: '[Label uppercase "Entradas" / Sublabel "Total recebido"]',
          trendBadge: 'pill bg-emerald-100 com TrendingUp icon + "+18%"',
          mainValue: '3xl font-black emerald-700 com formatCurrency(monthSummary.entries)',
          progressBar: 'div h-3 bg-emerald-100 com inner div width inline `100%` HARDCODED',
        },

        cardSaidas: {
          theme: 'red negativo',
          border: 'border-2 red-200 dark:red-800',
          background: 'gradient via-red-50/50 to-white com blur-circle red top-right',
          iconBox: 'ArrowUpRight branco em circle 12w12 gradient red-400 → red-600 shadow-red-500/30',
          headerLabels: '[Label uppercase "Saídas" / Sublabel "Total enviado"]',
          trendBadge: 'pill bg-red-100 com TrendingUp icon + "+5%" — BUG SEMÂNTICO (saídas crescendo deveria ser indicador NEGATIVO ou TrendingDown)',
          mainValue: '3xl font-black red-700',
          progressBar: 'div h-3 bg-red-100 com inner div width inline `74%` HARDCODED (coincidentalmente 185000/250000 = 74%, mas string fixa)',
        },
      },

      transacoesRecentes: {
        role: 'Lista de transações recentes — 5 mocks',
        cardBorder: 'border-2 slate-200',
        header: {
          structure: 'CardHeader gradient slate-50 to-white border-b',
          leftSide: '[Banknote em circle 10w10 brand-gradient / título "Transações Recentes" + sublabel]',
          rightSide: 'Botão "Ver Extrato" outline brand → Link IBExtract — ÚNICA navegação cross-page da página',
        },
        body: 'CardContent p-0 com divide-y entre rows',

        rowStructure: {
          interactivity: 'hover:bg-slate-50 cursor-pointer group — MAS sem onClick (gap UX)',
          firstRowHighlight: '`idx === 0 && bg-gradient-to-r from-slate-50/50` — destaque visual sutil para mais recente',
          leftSide: '[iconBox 12w12 condicional gradient + texto duplo]',
          iconBoxVariants: 'received=ArrowDownLeft white em emerald-400→brand / sent=ArrowUpRight white em red-400→red-600',
          textBlock: '[Label fixo via i18n "PIX Recebido"/"PIX Enviado" IGNORANDO description / description vai como sublabel slate-500 / Badge category outline + timestamp]',
          rightSide: 'Valor lg font-bold com prefixo "+ "/"- " + cor emerald/red',
        },

        labelMappingGap: 'JSX usa t("internet_banking.pix_received")/t("internet_banking.pix_sent") como label MAS o mock tem `description` rica (Empresa XYZ Ltda / Fornecedor ABC) que vai como sublabel — usuário vê 5 vezes "PIX Recebido"/"PIX Enviado" como heading, design force-ia que TODAS são PIX (e se for boleto, TED, transferência interna?)',
      },
    },

    knownGapsAcrossPage: [
      'Zero uso da SDK base44 — Subaccount entity tem balance_available / balance_blocked / balance_pending_release / revenue_current_month / total_lifetime_tpv totalmente compatíveis MAS NÃO USADOS',
      'Sem loading states / Sem error states / Sem empty states (se transações vazias, renderiza divide-y sem fallback)',
      'showBalance NÃO persiste em localStorage — refresh sempre volta TRUE',
      'Máscara "••••••" é 6 bullets fixos — não escala com magnitude do valor',
      'balance.total HARDCODED ao invés de computed available + blocked',
      'monthSummary.exitsChange usa TrendingUp icon mesmo crescendo (semanticamente negativo) — gap de UX',
      'Saudação "Bom dia" HARDCODED — não muda com horário do dia',
      'Badge "Conta Ativa" HARDCODED verde — não reflete suspensões/bloqueios reais',
      'Badge "Janeiro 2026" HARDCODED — não pega Date.now() (atualmente é 04/2026)',
      'Quick Action "Cards" (idx 3) declarada no array MAS dead code (cortada por .slice(0,3))',
      'Quick Action "Cards" tem `page: "IBHome"` (self-link) — confirmação de dead code',
      '5 transações com timestamps STRING ABSOLUTOS hardcoded — não recalculam em runtime',
      'Categorias declaradas no mock mas Badge cinza outline genérico SEM cor por categoria',
      'Label das transações é FIXO "PIX Recebido"/"PIX Enviado" — ignora se for boleto/TED/etc',
      'Description rica vai como sublabel — heading repete-se 5x igual',
      'Linhas de transação têm cursor-pointer + group:hover sem onClick (interatividade falsa)',
      'ProgressBar Entradas SEMPRE 100% (hardcode) — não reflete proporção real',
      'ProgressBar Saídas SEMPRE 74% (hardcode coincidente)',
      'TrendingUp icon usado em ambos cards (entradas E saídas) — falta TrendingDown semântico',
      'i18n parcial — datas e timestamps SEM tradução',
      'Nenhum link para Comprovantes / Settings / Limites — só PIX Send/Receive/Keys + Extrato',
      'Toggle showBalance sem aria-label (acessibilidade)',
      'Sem tooltips em ícones (Lock/Wallet/Banknote) — sem contexto extra',
      'Header não tem botão de Notificações nem de Conta — funções globais ausentes desta tela',
    ],
  },

  technical: {
    fileLocation: 'pages/IBHome.jsx (297 linhas)',
    routePath: '/IBHome',
    moduleAffinity: 'Internet Banking — primeiro item do menu IB no layout.jsx (currentModule === "internet-banking")',

    imports: {
      react: 'useState (1× — showBalance)',
      reactRouter: 'Link de react-router-dom + createPageUrl de @/components/utils',
      i18n: 'useTranslation de react-i18next — namespace `internet_banking`',
      lucide: '[Eye, EyeOff, Send, QrCode, Key, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown (importado mas NÃO USADO — dead import), ChevronRight (importado mas NÃO USADO), Wallet, Lock, Sparkles, Calendar, Clock, CreditCard, Banknote, CircleDollarSign, ArrowRight] — 20 icons importados, 18 usados, 2 dead imports',
      uiComponents: '[Card, CardContent, CardHeader, CardTitle, Button, Badge]',
      utils: 'cn de @/lib/utils',
    },

    deadImports: {
      list: ['TrendingDown', 'ChevronRight'],
      observation: 'TrendingDown seria semanticamente apropriado para o card de Saídas crescendo (gap UX) mas foi importado e não usado — sugere intenção abandonada',
    },

    stateManagement: {
      hooks: '1× useState — `showBalance` boolean default TRUE',
      complexity: 'A MENOR complexidade de state entre todas as páginas documentadas até agora — apenas 1 hook',
      gap: 'Sem persistência em localStorage; sem useReducer; sem context',
    },

    formatCurrencyFunction: {
      definition: 'inline arrow function dentro do componente',
      logic: '`if (!showBalance) return "••••••"; else return Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(value)`',
      bug: 'Função declarada DENTRO do componente — recriada a cada render (gap de performance, embora irrelevante neste caso)',
      usagePoints: '7 chamadas explícitas no JSX (3 no card saldo + 2 no resumo + 5 na lista — 10 totais)',
    },

    designSystem: {
      brandColor: '#2bc196 (PagSmile emerald) — usado em 25+ classes',
      navyGradient: '#002443 → #003459 → #004D73 — protagonista do Card Saldo',
      semanticColors: '[emerald (entradas/recebido) / red (saídas/enviado) / amber (bloqueado) / blue (Receber PIX) / violet (Chaves)]',
      gapsInternoConsistency: 'Quick Action "Cards" amber-orange criaria 5ª cor mas está dead — design system planejou 5 cores e renderiza 4',
    },

    rechartsUsage: 'NENHUMA — IBHome usa apenas div-progress-bars CSS simples (h-3 com width inline %)',

    crossPageNavigation: {
      linksRenderizados: [
        'Quick Action 1 → Link → IBPixSend (Send PIX brand)',
        'Quick Action 2 → Link → IBPixReceive (Receber PIX blue)',
        'Quick Action 3 → Link → IBPixKeys (Minhas Chaves violet)',
        'Botão "Ver Extrato" → Link → IBExtract (outline brand)',
      ],
      linksNAOExistentes: [
        'IBPixLimits (sub-página de PIX) — NÃO LINKADO da Home',
        'IBProofs (Comprovantes) — NÃO LINKADO da Home',
        'IBSettings (Configurações) — NÃO LINKADO da Home',
        'IBSettingsAccount/Security/Notifications/Access — NÃO LINKADOS',
      ],
      observation: 'IBHome linka apenas para 4 das 11 páginas do módulo (36% de coverage de navegação) — ilhamento das demais',
    },

    i18nKeysUsed: {
      namespace: 'internet_banking',
      keysObserved: [
        'good_morning',
        'your_digital_account',
        'last_update',
        'just_now',
        'account_active',
        'available_balance',
        'blocked',
        'total',
        'send_pix',
        'receive_pix',
        'my_keys',
        'cards (declarado mas não renderizado — dead key)',
        'month_summary',
        'entries',
        'total_received',
        'exits',
        'total_sent',
        'recent_transactions',
        'your_recent_transactions',
        'see_statement',
        'pix_received',
        'pix_sent',
      ],
      coverage: '22 keys identificadas — IBHome é a página com mais traduções por linha do IB',
      gaps: [
        'Strings hardcoded sem tradução: "Janeiro 2026", "Hoje, 14:32", "Ontem, 18:45", "25/01, 09:23", description dos mocks (Empresa XYZ, Fornecedor ABC, etc.), Badge category (Vendas, Fornecedores, Despesas, Recebíveis)',
        'Coexistência de português hardcoded + sistema i18n — gap de internacionalização parcial',
      ],
    },

    quickActionsArrayDeepAnalysis: {
      declaration: 'Array de 4 objetos com {icon, labelKey, page, color (gradient class), bgLight, textColor}',
      itensDeclarados: [
        '[0] Send → IBPixSend → from-[#2bc196] to-emerald-600 → bg-emerald-50 → text-emerald-600',
        '[1] QrCode → IBPixReceive → from-blue-500 to-blue-600 → bg-blue-50 → text-blue-600',
        '[2] Key → IBPixKeys → from-violet-500 to-purple-600 → bg-violet-50 → text-violet-600',
        '[3] CreditCard → IBHome (self!) → from-amber-500 to-orange-500 → bg-amber-50 → text-amber-600',
      ],
      renderizados: 'apenas [0..2] via .slice(0, 3) no JSX',
      gap: 'item [3] nunca renderizado — `bgLight` e `textColor` declarados nos 4 itens nunca consumidos no JSX (apenas `color` é usado para o gradient interno)',
      conclusion: 'O array foi planejado para 4 actions mas o card só comporta 3 visualmente — provavelmente design pivotou e o item Cards ficou para futura página /IBCards (que não existe)',
    },

    knownGapsTechnical: [
      '297 linhas 100% MOCK — zero SDK base44',
      '20 icons importados, 2 dead imports (TrendingDown / ChevronRight)',
      'showBalance state local sem persistência',
      'formatCurrency declarada dentro do componente (recriada a cada render)',
      'Hardcode de saudação "Bom dia" sem lógica horária',
      'Hardcode de Badge "Conta Ativa" sem fallback para suspensões',
      'Hardcode "Janeiro 2026" sem Date.now() — fica datado',
      'balance.total hardcoded ao invés de computed',
      'ProgressBar Entradas hardcoded 100%',
      'ProgressBar Saídas hardcoded 74%',
      'monthSummary.exitsChange usa TrendingUp icon mesmo sendo aumento de gastos (semanticamente errado)',
      'Quick Action [3] Cards é dead code (slice + self-link)',
      '4 das 11 páginas do módulo IB linkadas (36% coverage)',
      'Dead import TrendingDown sugere intenção abandonada de corrigir o bug semântico das saídas',
      'Categories no mock sem mapeamento visual diferenciado',
      'Description das transações vai como sublabel — heading repete 5× igual',
      'cursor-pointer + group:hover sem onClick — interatividade falsa nas linhas',
      'i18n parcial — datas/timestamps/mocks em PT hardcoded',
      'Sem tooltips em ícones',
      'Sem aria-label no toggle Eye/EyeOff (acessibilidade)',
      'Sem skeleton/loading/error/empty states',
      'Header sem botão Notifications/Profile globais',
      'Sem usar Subaccount entity (balance_available / blocked / pending_release / revenue_current_month / total_lifetime_tpv prontos no schema)',
    ],
  },
};

export default IBHomeDoc;