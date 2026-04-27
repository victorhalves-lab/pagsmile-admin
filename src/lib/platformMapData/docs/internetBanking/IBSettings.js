// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBSettings (Internet Banking) — Entrega 21
// ----------------------------------------------------------------------------
// OITAVA página do módulo INTERNET BANKING — primeira do bloco
// CONFIGURAÇÕES (4º e ÚLTIMO bloco do módulo IB).
//
//   1. IBSettings.jsx (90 linhas) — Hub de configurações da conta
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada via menu lateral IB (NÃO está nos Quick Actions do IBHome)
// - É A NOVA MENOR PÁGINA do módulo IB inteiro até o momento — 90L vs IBProofs
//   235L (anterior recordista) — apenas 38% do tamanho de IBProofs e 13% de
//   IBPixSend (689L) — reflete a natureza simples conceitual: HUB de navegação
//   com 4 atalhos de menu para sub-páginas
// - É A PRIMEIRA PÁGINA do módulo IB que usa NAVEGAÇÃO REAL CROSS-PAGE via
//   `<Link to={createPageUrl(...)}>` — quebra a "ilha" arquitetural identificada
//   nas 7 páginas anteriores (todas eram ilhas sem Links cross-page)
// - É A ÚNICA PÁGINA HUB-PURA do módulo — não tem dados próprios, não tem
//   filtros, não tem CRUD, apenas redireciona para 4 sub-páginas (Account,
//   Security, Notifications, Access)
// - DESIGN PATTERN HUB→SPOKES: padrão comum em apps bancários reais (Bradesco
//   "Mais Opções", Itaú "Configurações") onde uma tela centraliza acessos
//
// PADRÕES NOVOS NA PÁGINA (não vistos nas 7 anteriores do módulo IB):
// - PRIMEIRO uso de `<Link>` do react-router-dom no módulo IB (todas anteriores
//   usavam `<Button>` com onClick navegando ou nada)
// - PRIMEIRO uso de `createPageUrl` de @/components/utils no módulo IB
// - PRIMEIRA arquitetura DATA-DRIVEN em settings — array `settingsItems` com
//   {id, title, description, icon, iconBg, iconColor, page} mapeado via .map
//   (similar ao Quick Actions do IBHome mas sem onClick callbacks, com Link)
// - PRIMEIRO uso de `<item.icon />` (rendering icon do array) no módulo IB
//   — IBHome também faz isso mas no contexto de Quick Actions, não settings
// - É A PRIMEIRA PÁGINA do módulo IB com hover styling em rows de lista
//   (`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`) — todas
//   as listas anteriores (IBExtract rows, IBProofs rows, IBPixKeys rows) NÃO
//   tinham hover (eram não-clicáveis ou clicavam em ações específicas)
// ============================================================================

export const IBSettingsDoc = {
  pageId: 'IBSettings',
  pagePaths: ['/IBSettings'],
  module: 'Internet Banking',
  section: 'Configurações — Hub principal (8ª tela do módulo, primeira do bloco Configurações)',

  explainer: {
    oneLiner:
      'Tela de Configurações HUB — 90 linhas 100% MOCK estrutural — É A NOVA MENOR PÁGINA do módulo IB inteiro até agora (90L vs IBProofs 235L anterior recordista; 13% IBPixSend 689L; 18% IBExtract 511L; 30% IBHome 297L) — refletindo natureza simples HUB-PURO com 4 redirects para sub-páginas. É TAMBÉM a PRIMEIRA PÁGINA do módulo IB com NAVEGAÇÃO REAL CROSS-PAGE via `<Link to={createPageUrl(...)}>` — quebrando o padrão de ILHA das 7 páginas anteriores (todas isoladas sem Links). Apenas 2 blocos verticais estruturais: (1) **Header simples** padrão IBPixReceive/IBPixLimits/IBProofs — h1 "Configurações" 2xl-bold + sublabel "Gerencie sua conta e preferências" — sem CTA, sem Badge, sem ícone — terceiro caso consecutivo de header minimalista (IBPixReceive→IBPixLimits→IBProofs→IBSettings = 4 páginas sem CTA no header); (2) **Settings Menu Card** com `divide-y dark:divide-slate-700` entre 4 rows iteradas via `.map(item)` sobre array `settingsItems` (PRIMEIRA arquitetura DATA-DRIVEN de settings no módulo IB) — cada row é um `<Link to={createPageUrl(item.page)}>` flex items-center justify-between p-4 com `hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors` (PRIMEIRO hover styling em row do módulo IB) — layout de cada row: ESQUERDA flex items-center gap-4 com [icon square 12w12 rounded-xl com BG colorido condicional pelo iconBg da config + `<item.icon />` 6w6 com cor condicional pelo iconColor] + bloco 2 linhas (title font-semibold + description text-sm slate-500) / DIREITA ChevronRight 5w5 slate-400 — sinalizador clássico de "tem sub-tela" / Os 4 SETTINGS HARDCODED são: (a) **Dados da Conta** id="account" → IBSettingsAccount com User icon BLUE (bg-blue-100 + text-blue-600) descrição "Informações cadastrais e dados bancários" / (b) **Segurança** id="security" → IBSettingsSecurity com Shield icon EMERALD (bg-emerald-100 + text-emerald-600) descrição "Senha, autenticação e dispositivos" / (c) **Notificações** id="notifications" → IBSettingsNotifications com Bell icon AMBER (bg-amber-100 + text-amber-600) descrição "Configurar alertas e avisos" / (d) **Perfis de Acesso** id="access" → IBSettingsAccess com Users icon PURPLE (bg-purple-100 + text-purple-600) descrição "Gerenciar usuários e permissões" — palette colorida 4 cores distintas (blue/emerald/amber/purple) consistente com Quick Actions de IBHome e Documents Cards de IBProofs (FileSpreadsheet blue + File purple) — paleta convergente "blue=user/financeiro, emerald=segurança/positivo, amber=avisos/aumentos, purple=avançado/users"; gaps arquiteturais: (i) **3 dead imports MASSIVOS** — Building2, CreditCard, Lock, Smartphone (4 ICONS importados mas NÃO USADOS no JSX) — Building2 sugere "Empresa" (talvez planejado para sub-item Empresa que foi mergeado em Account?), CreditCard sugere "Cartões" (planejado mas não criado?), Lock sugere "Privacidade" (mergeado em Security?), Smartphone sugere "Dispositivos" (mergeado em Security?) — 4 imports = 4 SUB-PÁGINAS PLANEJADAS MAS NÃO IMPLEMENTADAS ou NÃO LIGADAS no menu — gap de planejamento histórico (em apps bancários reais é comum ter 6-8+ sub-páginas em Settings: Account, Security, Notifications, Cards, Devices, Privacy, Permissions, etc.) (ii) **Sem agrupamento/seções** — em apps maduros Settings tem grupos como "Conta" (Account, Security), "Comunicação" (Notifications), "Acesso" (Users, Permissions) com headers de seção — aqui são 4 items soltos sem hierarquia (iii) **ChevronRight idêntico em todos** — sem distinção visual de sub-tipo (configuração simples vs configuração que abre sub-tree) (iv) **Sem badge "NOVO" ou "RECOMENDADO"** — apps reais sinalizam configurações novas com badge para chamar atenção (v) **Sem indicador de status atual** — ex: "Notificações: 5 ativas" / "Segurança: 2FA habilitado" / "Acesso: 3 usuários" — apps reais mostram quick state na descrição para evitar entrar na sub-tela só para verificar (vi) **Sem sub-item "Sobre/Versão"** — comum em apps bancários para mostrar versão do app, termos de uso, política de privacidade (vii) **Sem sub-item "Sair"/"Logout"** — apesar de logout não ser settings tecnicamente, é COMUM colocar no final do hub Settings em apps mobile-first (viii) **Sem busca em Settings** — apps grandes (Google Settings, iOS Settings) têm searchbar para encontrar config rápido (ix) **Sem distinção mobile vs desktop** — em mobile rows de menu deveriam ser maiores (touch-target 44px+), aqui são p-4 = 32px que é 73% do mínimo Apple HIG (x) **Item "Perfis de Acesso" só faz sentido em conta PJ** — em conta PF não faz sentido ter "gerenciar usuários" mas o hub não distingue tipo de conta (xi) **i18n GAP** — todos textos hardcoded incluindo title+description+header (continua padrão das 7 páginas anteriores) (xii) **Continua ZERO uso SDK base44** — apesar deste hub ser estrutural sem dados, em apps reais alguns campos são dinâmicos (ex: "Notificações: 5 ativas" requer count dinâmico) (xiii) **Sem analytics tracking** — clicks em rows não invocam `base44.analytics.track()` para entender qual config é mais procurada (xiv) **Sem confirmação para ações destrutivas** — "Perfis de Acesso" leva direto para sub-tela sem warning de "atenção: ações afetam outros usuários" (xv) **Cor purple em "Perfis de Acesso"** alinha com convenção Admin (purple = avançado) consistente com módulo Admin Interno (xvi) **0 useState** — primeiro caso de zero hooks no módulo IB (todas anteriores tinham 1+) — coerente com natureza HUB-PURO sem state local.',

    sectionsBreakdown: {
      headerSimple: {
        role: 'Header padrão minimalista',
        title: '"Configurações" 2xl-bold',
        subtitle: '"Gerencie sua conta e preferências"',
        observation: 'Quarto caso consecutivo de header minimalista (Receive→Limits→Proofs→Settings)',
      },

      settingsMenuCard: {
        role: 'Card divide-y com 4 rows-link iteradas via .map',
        dataSource: 'Array settingsItems hardcoded (4 items)',

        rowStructure: {
          element: 'React Router Link to={createPageUrl(item.page)}',
          layout: 'flex items-center justify-between p-4',
          hover: 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors (PRIMEIRO hover row no módulo IB)',
          leftBlock: '[icon square 12w12 rounded-xl bg condicional + item.icon 6w6 cor condicional + bloco title+description]',
          rightBlock: 'ChevronRight 5w5 slate-400 (sinalizador padrão sub-tela)',
        },

        items: [
          {
            id: 'account',
            title: '"Dados da Conta"',
            description: '"Informações cadastrais e dados bancários"',
            icon: 'User',
            color: 'BLUE (bg-blue-100 + text-blue-600)',
            target: 'IBSettingsAccount',
          },
          {
            id: 'security',
            title: '"Segurança"',
            description: '"Senha, autenticação e dispositivos"',
            icon: 'Shield',
            color: 'EMERALD (bg-emerald-100 + text-emerald-600)',
            target: 'IBSettingsSecurity',
          },
          {
            id: 'notifications',
            title: '"Notificações"',
            description: '"Configurar alertas e avisos"',
            icon: 'Bell',
            color: 'AMBER (bg-amber-100 + text-amber-600)',
            target: 'IBSettingsNotifications',
          },
          {
            id: 'access',
            title: '"Perfis de Acesso"',
            description: '"Gerenciar usuários e permissões"',
            icon: 'Users',
            color: 'PURPLE (bg-purple-100 + text-purple-600)',
            target: 'IBSettingsAccess',
          },
        ],

        paletteConsistency: 'blue=user/financeiro / emerald=segurança/positivo / amber=avisos / purple=avançado/users — convergente com IBHome Quick Actions e IBProofs Documents',
      },
    },

    knownGapsAcrossPage: [
      '4 DEAD IMPORTS MASSIVOS (Building2, CreditCard, Lock, Smartphone) — sugere 4 sub-páginas planejadas mas não implementadas',
      'Sem agrupamento/seções de settings (apps maduros têm "Conta"/"Comunicação"/"Acesso")',
      'ChevronRight idêntico em todos — sem distinção visual sub-tipos',
      'Sem badge "NOVO"/"RECOMENDADO" para configurações',
      'Sem indicador de status atual (ex: "Notificações: 5 ativas")',
      'Sem sub-item "Sobre/Versão" (termos de uso, política de privacidade)',
      'Sem sub-item "Sair/Logout"',
      'Sem busca em Settings (search dentro do hub)',
      'Touch-target p-4 = 32px abaixo do mínimo Apple HIG 44px',
      'Item "Perfis de Acesso" só faz sentido em conta PJ — sem distinção tipo conta',
      'Continua ZERO i18n inter-página IB',
      'Sem analytics tracking de clicks em rows',
      'Sem confirmação para ações destrutivas (Perfis de Acesso afeta outros usuários)',
      '0 useState — primeiro caso zero hooks no módulo IB (coerente com HUB-puro)',
    ],
  },

  technical: {
    fileLocation: 'pages/IBSettings.jsx (90 linhas — A NOVA MENOR PÁGINA do módulo IB; 38% IBProofs 235L; 13% IBPixSend 689L; 30% IBHome 297L)',
    routePath: '/IBSettings',
    moduleAffinity: 'Internet Banking — primeira página do bloco Configurações',
    accessedFrom: ['Menu lateral IB', 'NÃO está nos Quick Actions do IBHome'],

    imports: {
      react: 'NÃO importa useState/useEffect (PRIMEIRO caso ZERO hooks no módulo IB)',
      reactRouter: 'PRIMEIRO uso de Link no módulo IB',
      utils: 'createPageUrl de @/components/utils — PRIMEIRO uso no módulo IB',
      lucide: '[User, Shield, Bell, ChevronRight, Building2, CreditCard, Lock, Smartphone, Users] — 9 icons',
      uiComponents: '[Card, CardContent]',
    },

    deadImports: {
      list: ['Building2 — sugere sub-item "Empresa" planejado', 'CreditCard — sugere sub-item "Cartões" planejado', 'Lock — sugere sub-item "Privacidade" planejado', 'Smartphone — sugere sub-item "Dispositivos" planejado'],
      count: 4,
      observation: 'IBSettings tem 4 dead imports — paralelo IBProofs (5) e IBPixReceive (4) — gap de cleanup persiste / mas aqui dead imports REVELAM ROADMAP de sub-páginas planejadas mas não implementadas',
      hypothesisHistorical: 'Em apps bancários reais settings tem 6-8+ sub-páginas (Account, Security, Notifications, Cards, Devices, Privacy, Permissions, About, Logout) — 4 imports não usados sugerem versão anterior do mock tinha mais sub-itens',
    },

    stateManagement: {
      hooksCount: 0,
      observation: 'PRIMEIRO caso ZERO hooks no módulo IB — todas anteriores tinham mínimo 1 useState (IBHome: 1, IBExtract: 6, IBPixSend: 9, IBPixReceive: 4, IBPixKeys: 6, IBPixLimits: 3, IBProofs: 3) / Coerente com natureza HUB-PURO sem state local',
    },

    crossPageNavigation: {
      linksRenderizados: '4 — Link to IBSettingsAccount/Security/Notifications/Access',
      observation: 'PRIMEIRA PÁGINA DO MÓDULO IB COM CROSS-PAGE NAV REAL — quebra padrão de ilha das 7 anteriores (apenas IBHome tinha 4 Quick Actions com Link, mas IBSettings tem 100% das rows como Links)',
      missingLinks: [
        'Sem voltar para IBHome',
        'Sem Link para outras pages IB principais (Extract/PIX/Proofs)',
      ],
    },

    helperFunctions: {
      formatCurrency: 'NÃO usado (HUB sem valores monetários)',
      observation: 'Quebra padrão das 7 páginas anteriores que TODAS usavam formatCurrency — 7 → 0 helpers',
    },

    designSystem: {
      pixOfficialColor: 'NÃO usado (HUB neutro)',
      paletteSettings: '4 cores hardcoded inline para 4 settings (blue/emerald/amber/purple) — convergente com Quick Actions IBHome e Documents IBProofs',
      hoverStylingFirst: 'PRIMEIRO hover row do módulo IB (transição padrão hover:bg-slate-50)',
      iconRenderPattern: '<item.icon /> dinâmico — PRIMEIRO uso desse padrão no módulo IB',
    },

    settingsItemsArray: {
      structure: '[{id, title, description, icon, iconBg, iconColor, page}]',
      count: 4,
      hardcodedColorClasses: 'iconBg e iconColor como strings hardcoded — Tailwind purga classes não-literais MAS aqui são literais ✓ funciona / em apps mais maduros estaria em config externa ou theme',
    },

    pageReferences: {
      targets: ['IBSettingsAccount', 'IBSettingsSecurity', 'IBSettingsNotifications', 'IBSettingsAccess'],
      observation: 'Todas as 4 sub-páginas EXISTEM no projeto (confirmado pela lista de other_files do snapshot) — Links válidos sem 404',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'Header h1+sublabel + 4 titles + 4 descriptions = ~10 strings hardcoded',
      impact: 'IBHome (22) → 7 outras páginas (0 cada) → IBSettings (0)',
    },

    knownGapsTechnical: [
      '90 linhas 100% MOCK — A MENOR DO MÓDULO IB',
      '0 useState — PRIMEIRO caso zero hooks no módulo',
      '0 useEffect',
      'ZERO i18n — gap inter-página persiste',
      '4 dead imports (Building2, CreditCard, Lock, Smartphone) — revelam roadmap não implementado',
      'PRIMEIRA cross-page nav real do módulo IB (4 Links válidos)',
      'PRIMEIRO hover styling em row do módulo IB',
      'PRIMEIRO uso Link + createPageUrl no módulo IB',
      'PRIMEIRO uso <item.icon /> rendering pattern',
      'Sem agrupamento/seções de settings',
      'Sem badges NOVO/RECOMENDADO',
      'Sem indicador status atual (notif ativas, 2FA habilitado, etc.)',
      'Sem sub-item Sobre/Versão',
      'Sem sub-item Logout',
      'Sem busca em Settings',
      'Touch-target abaixo HIG 44px',
      'Sem distinção tipo conta PF/PJ',
      'Sem analytics tracking clicks',
      'Sem confirmação ações destrutivas',
    ],
  },
};

export default IBSettingsDoc;