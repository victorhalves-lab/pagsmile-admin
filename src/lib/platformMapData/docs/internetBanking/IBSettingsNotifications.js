// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBSettingsNotifications (Internet Banking) — Entrega 24
// ----------------------------------------------------------------------------
// DÉCIMA-PRIMEIRA página do módulo INTERNET BANKING — quarta do bloco
// CONFIGURAÇÕES (terceira sub-página acessada via hub IBSettings).
//
//   1. IBSettingsNotifications.jsx (190 linhas) — Toggles de email/push por evento
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada via Link do hub IBSettings settingsItems[2] notifications (Bell amber)
// - É a 3ª MENOR PÁGINA do módulo IB (190L vs IBSettingsAccount 186L vs
//   IBSettings 90L) — aproximadamente igual a IBSettingsAccount em tamanho
// - É a PRIMEIRA PÁGINA do módulo IB com PADRÃO DE COMPONENTE INLINE definido
//   dentro da própria página (NotificationRow component definido linha 48-74
//   ANTES do return — quebra padrão de 10 páginas anteriores que tinham apenas
//   componentes inline literal sem extração para sub-componente nomeado)
// - É a PRIMEIRA PÁGINA do módulo IB com USO REAL e funcional do componente
//   `<Checkbox>` shadcn (paradoxalmente IBSettingsSecurity importou Switch sem
//   renderizar — IBSettingsNotifications usa Checkbox de verdade renderizado
//   18 vezes 9 rows × 2 toggles)
// - É a PRIMEIRA PÁGINA do módulo IB com USO REAL e funcional do componente
//   `<Label>` shadcn com htmlFor para acessibilidade (a11y) — primeira tentativa
//   real de a11y no módulo apesar de ainda gaps gerais (sem aria-labels, etc.)
// - É a PRIMEIRA PÁGINA do módulo IB com USO REAL e funcional do componente
//   `<Input>` controlled (value+onChange) — IBPixSend usou Input mas foi para
//   busca rápida não-controlada; aqui Input é controlled real
// - É a PRIMEIRA PÁGINA do módulo IB com TOGGLE INLINE EDIT pattern (mostra
//   visualização → click "Alterar" → vira form editável → click "Salvar"/
//   "Cancelar" volta para visualização) usando `isEditingEmail` boolean state
// - É a SEGUNDA PÁGINA do módulo IB com uso de #00D26A (cor PIX) em Button
//   primary — PRIMEIRA foi IBPixSend submit, SEGUNDA é "Salvar Preferências"
//   aqui (uso semanticamente questionável: salvar prefs de notif não é PIX)
//
// PADRÕES NOVOS NA PÁGINA (não vistos nas 10 anteriores do módulo IB):
// - PRIMEIRO uso de updater FUNCIONAL `setNotifications(prev => ({...prev,
//   [key]: {...prev[key], [type]: !prev[key][type]}}))` — pattern correto de
//   imutabilidade React em update de objeto aninhado
// - PRIMEIRO uso de DOIS-ESTADOS COMPLEXOS coexistindo: `notifications` objeto
//   (9 keys × 2 toggles = 18 booleans) + `notificationEmail` string + 
//   `isEditingEmail` boolean
// - PRIMEIRO uso de Card.bg-slate-50 como LEGEND/key (similar ao Counter
//   IBPixKeys mas semanticamente DIFERENTE — aqui é guia visual de como ler
//   colunas Mail/Push nas tabelas)
// - PRIMEIRO uso REAL de Save icon em Button (IBExtract teve Eye/EyeOff
//   IBProofs teve Eye, IBPixKeys teve QrCode) — Save é o icon "submit form"
//   classic
// - PRIMEIRO uso de PADRÃO MASTER-DETAIL EDIT INLINE no módulo IB
// ============================================================================

export const IBSettingsNotificationsDoc = {
  pageId: 'IBSettingsNotifications',
  pagePaths: ['/IBSettingsNotifications'],
  module: 'Internet Banking',
  section: 'Configurações — Notificações (sub-página do hub IBSettings)',

  explainer: {
    oneLiner:
      'Tela de Configuração de Notificações — 190 linhas 100% MOCK — É aproximadamente IGUAL a IBSettingsAccount em tamanho (190L vs 186L) e a 4ª MENOR PÁGINA do módulo IB (90L < 186L < 190L < 205L < 235L < 271L < 297L < 305L < 372L < 511L < 689L). É a PRIMEIRA PÁGINA do módulo IB com PADRÃO DE COMPONENTE INLINE NOMEADO (NotificationRow definido dentro da página linha 48-74 antes do return) — primeira tentativa de DRY interno apesar de ainda gap arquitetural geral (componente NÃO extraído para arquivo próprio em components/internet-banking/). 6 grandes blocos verticais: (1) **Header com BACK** layout idêntico IBSettingsAccount/Security (3ª página com BACK button consecutivo); (2) **Legend Card** bg-slate-50 destacado (similar Counter IBPixKeys + Limit Info IBPixLimits + Bank Info IBSettingsAccount) com flex items-center justify-end gap-6 — apenas 2 itens icone+label: [Mail icon 4w4 + "E-mail"] + [Bell icon 4w4 + "Push"] — UX guia visual de como ler colunas Mail/Push das tabelas abaixo / **decisão arquitetural correta**: legenda separada antes das tabelas em vez de repetir headers em cada Card; (3) **Transações Section** com label uppercase "Transações" + Card divide-y entre 3 NotificationRow (pixReceived "Pix recebido" / pixSent "Pix enviado" / pixScheduled "Pix agendado executado") — cada NotificationRow é componente inline definido na página recebendo {id, label} e usando state global `notifications[id]` para pegar email/push values + handler global `handleNotificationChange(id, type)` para toggle; (4) **Segurança Section** com label uppercase "Segurança" + Card divide-y entre 4 NotificationRow (newAccess "Novo acesso à conta" / passwordChange "Alteração de senha" / newDevice "Novo dispositivo" / suspiciousAccess "Tentativa de acesso suspeita") — **BACEN-aligned**: notificação de tentativa suspeita habilitada por DEFAULT em mock {email: true, push: true} — correto para regulamentação financeira; (5) **Limites e Conta Section** com label uppercase "Limites e Conta" + Card divide-y entre 2 NotificationRow (limitApproved "Alteração de limite aprovada" {email: true, push: false} — UX correto: alteração aprovada NÃO precisa push interrupcional, email basta / limitReached "Limite diário atingido" {email: true, push: true} — UX correto: limit hit precisa interrupção imediata); (6) **E-mail para Notificações Section** com label uppercase "E-mail para Notificações" + Card padrão SINGLE-CARD com TOGGLE INLINE EDIT — modo VIEW: flex justify-between [Mail icon 5w5 slate-400 + email font-medium "financeiro@lojaabc.com.br" / Button ghost sm Edit3 "Alterar" toggles isEditingEmail=true] — modo EDIT: flex gap-3 [Input controlled value+onChange flex-1 + Button primary "Salvar" toggles isEditingEmail=false (NÃO PERSISTE — só esconde form, valor já mudou via onChange) + Button outline "Cancelar" toggles isEditingEmail=false (TAMBÉM NÃO REVERTE — gap CRÍTICO: cancelar mantém valor digitado já que onChange já mudou state)] — **GAPS arquiteturais críticos**: (a) Cancelar não restaura valor original — bug clássico de inline edit sem snapshot; (b) Salvar não persiste real (sem call SDK base44 User.update); (c) Sem validação format e-mail; (d) Sem envio de código de verificação para novo e-mail (apps reais exigem confirmação no e-mail antes de aceitar mudança); 7º bloco bottom **Save Button** standalone w-full bg-[#00D26A] hover:#00B85C (cor PIX) com Save icon "Salvar Preferências" — **GAP CRÍTICO**: Button SEM onClick — submit dead apesar de aparência primary destacada / **gap UX**: usuário pode achar que tudo já salvou via toggle individual mas o Button standalone parece sugerir salvamento agregado posterior — pattern confuso "auto-save vs explicit-save" sem clareza qual está ativo; gaps arquiteturais: (i) **NotificationRow inline na página** — não extraída para components/internet-banking/NotificationRow.jsx; (ii) **Save Button bottom sem onClick** — submit dead sem persistência SDK; (iii) **Cancelar email edit não restaura valor original** — bug clássico inline edit sem snapshot; (iv) **Sem validação formato e-mail** (regex/zod); (v) **Sem envio código verificação** para novo e-mail antes aceitar mudança; (vi) **Apenas 2 canais (Email + Push)** — apps reais oferecem SMS, WhatsApp, Slack/Discord para corporate; (vii) **Sem opção "horário de não perturbar"** (Do Not Disturb) — apps reais permitem definir janela noturna sem push; (viii) **Sem opção "frequência"** (real-time vs daily digest vs weekly summary); (ix) **Sem categoria "Transações grandes"** com threshold de valor (notificar apenas valores > R$ X); (x) **Sem opção "test notification"** para validar que canal funciona; (xi) **Sem histórico de notificações enviadas** (audit trail); (xii) **Sem opção "preferences per device"** (push em mobile mas não em web, ou vice-versa); (xiii) **Sem opção marketing/promocional** separada de transacionais; (xiv) **9 notificações fixas** sem possibilidade adicionar/remover categorias; (xv) **0 useEffect** — sem refetch on focus, sem auto-save debounced; (xvi) **ZERO uso SDK base44** — schema User poderia ter `notification_preferences` field; (xvii) **NotificationRow lê `notifications[id]` direto sem prop drilling** — funciona via closure mas é anti-pattern React (componente acessa state externo via closure ao invés de receber via props ou context); (xviii) **Continua gap ZERO i18n** inter-página persiste; (xix) **9 categorias mock hardcoded** com nomes em PT-BR; (xx) **Sem feedback visual ao salvar individual toggle** — toggle muda mas sem toast "Preferência atualizada" — usuário não sabe se persistiu (especialmente em conjunto com o gap auto-save vs explicit-save).',

    sectionsBreakdown: {
      headerWithBack: {
        role: 'Header com BACK button pattern padrão sub-page',
        observation: '3ª página consecutiva do módulo IB com BACK button (Account → Security → Notifications)',
      },

      legendCard: {
        role: 'Card guia visual destacado bg-slate-50 explicando colunas das tabelas',
        layout: 'flex items-center justify-end gap-6',
        items: [
          'Mail icon 4w4 + "E-mail"',
          'Bell icon 4w4 + "Push"',
        ],
        decisionGood: 'Decisão arquitetural correta — legenda separada antes das tabelas vs repetir headers em cada Card',
      },

      transactionsSection: {
        role: 'Card divide-y com 3 NotificationRow',
        rows: [
          '{id: "pixReceived", label: "Pix recebido"} — default {email: true, push: true}',
          '{id: "pixSent", label: "Pix enviado"} — default {email: true, push: true}',
          '{id: "pixScheduled", label: "Pix agendado executado"} — default {email: true, push: true}',
        ],
        defaultsAllOn: 'Todas defaults true para Pix — UX correto (transações financeiras precisam visibilidade)',
      },

      securitySection: {
        role: 'Card divide-y com 4 NotificationRow — CATEGORIA MAIOR',
        rows: [
          '{id: "newAccess", label: "Novo acesso à conta"} — default {email: true, push: true}',
          '{id: "passwordChange", label: "Alteração de senha"} — default {email: true, push: true}',
          '{id: "newDevice", label: "Novo dispositivo"} — default {email: true, push: true}',
          '{id: "suspiciousAccess", label: "Tentativa de acesso suspeita"} — default {email: true, push: true}',
        ],
        bacenAligned: 'Tentativa suspeita habilitada por DEFAULT — correto para regulamentação financeira BACEN',
      },

      limitsAccountSection: {
        role: 'Card divide-y com 2 NotificationRow — CATEGORIA MENOR mas com lógica defaults DIFERENCIADA',
        rows: [
          '{id: "limitApproved", label: "Alteração de limite aprovada"} — default {email: true, push: FALSE} ← UNICO false default',
          '{id: "limitReached", label: "Limite diário atingido"} — default {email: true, push: true}',
        ],
        defaultDifferentiation: 'limitApproved push:false — UX correto (alteração aprovada NÃO precisa push interrupcional, email basta) / limitReached push:true — UX correto (limit hit precisa interrupção imediata)',
        designSophistication: 'Único caso de defaults assimétricos — sinaliza atenção UX consciente',
      },

      notificationEmailSection: {
        role: 'Card single com TOGGLE INLINE EDIT pattern',
        viewMode: 'flex justify-between [Mail icon 5w5 + email + Button ghost Edit3 "Alterar"]',
        editMode: 'flex gap-3 [Input controlled flex-1 + Button primary "Salvar" + Button outline "Cancelar"]',
        defaultEmail: '"financeiro@lojaabc.com.br" — matching IBSettingsAccount.email (consistência inter-página ✓)',

        criticalGaps: [
          'Cancelar NÃO restaura valor original — bug clássico inline edit sem snapshot',
          'Salvar não persiste real (sem User.update SDK)',
          'Sem validação formato e-mail (regex/zod)',
          'Sem envio de código verificação para novo e-mail',
        ],
      },

      saveButton: {
        role: 'Button standalone bottom w-full primary cor PIX',
        styling: 'bg-[#00D26A] hover:bg-[#00B85C]',
        icon: 'Save (PRIMEIRO uso real de Save icon no módulo IB)',
        gap: 'SEM onClick — submit dead',
        confusingPattern: 'Pattern auto-save (toggles) vs explicit-save (Button bottom) coexistem sem clareza qual está ativo',
      },
    },

    knownGapsAcrossPage: [
      'NotificationRow inline na página — não extraída para components/internet-banking/',
      'Save Button bottom sem onClick — submit dead sem persistência SDK',
      'Cancelar email edit NÃO restaura valor original — bug inline edit sem snapshot',
      'Sem validação formato e-mail (regex/zod)',
      'Sem envio código verificação para novo e-mail',
      'Apenas 2 canais (Email + Push) — sem SMS/WhatsApp/Slack',
      'Sem horário de não perturbar (Do Not Disturb)',
      'Sem opção frequência (real-time vs digest)',
      'Sem categoria "Transações grandes" com threshold valor',
      'Sem opção test notification',
      'Sem histórico notificações enviadas (audit trail)',
      'Sem preferences per device (push mobile vs web)',
      'Sem categoria marketing/promocional separada',
      '9 notificações fixas sem add/remove categorias',
      '0 useEffect — sem refetch sem auto-save debounced',
      'ZERO uso SDK base44 (schema User notification_preferences)',
      'NotificationRow lê notifications[id] via closure — anti-pattern',
      'Sem feedback visual ao salvar (toast "Preferência atualizada")',
      'Pattern auto-save vs explicit-save confuso (Button bottom não tem onClick)',
      'Continua gap ZERO i18n inter-página IB',
    ],
  },

  technical: {
    fileLocation: 'pages/IBSettingsNotifications.jsx (190 linhas — 4ª MENOR PÁGINA do módulo IB)',
    routePath: '/IBSettingsNotifications',
    moduleAffinity: 'Internet Banking — quarta página do bloco Configurações',
    accessedFrom: ['IBSettings hub via Link settingsItems[2] notifications'],

    imports: {
      react: 'useState (3× hooks)',
      reactRouter: 'Link de react-router-dom',
      utils: 'createPageUrl de @/components/utils',
      lucide: '[ArrowLeft, Bell, Mail, Smartphone, Save, Edit3] — 6 icons',
      uiComponents: '[Card+CardContent+CardHeader (não usado)+CardTitle (não usado), Button, Checkbox, Label, Input]',
      utilsLocal: 'cn de @/lib/utils — IMPORTADO mas não usado no JSX',
    },

    deadImports: {
      list: ['Smartphone — não usado (talvez planejado para canal SMS futuramente)', 'CardHeader — não usado', 'CardTitle — não usado', 'cn — importado mas não usado'],
      count: 4,
      observation: 'IBSettingsNotifications tem 4 dead imports — MELHOR cleanup das 3 sub-páginas Settings (vs Account 6 + Security 6) embora ainda alto',
      smartphoneHypothesis: 'Smartphone sugere canal SMS planejado mas não implementado — gap de produto',
    },

    stateManagement: {
      hooksCount: 3,
      hooks: [
        'notifications {pixReceived, pixSent, pixScheduled, newAccess, passwordChange, newDevice, suspiciousAccess, limitApproved, limitReached} cada com {email, push} = 18 booleans totais',
        'notificationEmail "financeiro@lojaabc.com.br" — string controlled',
        'isEditingEmail false — toggle modo VIEW vs EDIT',
      ],
      complexity: 'TODOS aproveitados — handlers ativos para cada hook (handleNotificationChange + setNotificationEmail + setIsEditingEmail)',
      pattern: 'PRIMEIRO uso de updater funcional pattern com objeto aninhado: setNotifications(prev => ({...prev, [key]: {...prev[key], [type]: !prev[key][type]}}))',
    },

    helperFunctions: {
      handleNotificationChange: 'Toggle imutável de notifications[key][type] — pattern correto React imutabilidade',
      observation: 'Lógica clean e correta — sem efeitos colaterais',
    },

    inlineComponent: {
      name: 'NotificationRow',
      definitionLocation: 'Linhas 48-74 dentro da página, antes do return',
      props: '{id, label, emailKey, pushKey} — porém emailKey e pushKey nunca usados (props undefined)',
      access: 'Lê notifications[id] e chama handleNotificationChange via CLOSURE — anti-pattern React',
      reuse: 'Usado 9 vezes ao longo do JSX',
      observation: 'PRIMEIRO componente inline NOMEADO no módulo IB — primeira tentativa DRY interna',
      extractionGap: 'NÃO extraído para components/internet-banking/NotificationRow.jsx — gap arquitetural',
    },

    crossPageNavigation: {
      linksRenderizados: '1 — Link to=createPageUrl(IBSettings) (back button)',
      observation: '3ª página consecutiva sub-page com pattern back único',
    },

    designSystem: {
      pixOfficialColor: '#00D26A em Save Button bottom — uso semanticamente questionável (salvar prefs notif não é PIX)',
      hoverPixColor: '#00B85C — hover state da cor PIX (PRIMEIRO uso explícito de hover variant cor PIX)',
      checkboxFirstReal: 'PRIMEIRO uso REAL renderizado de Checkbox shadcn no módulo IB',
      labelFirstReal: 'PRIMEIRO uso REAL de Label shadcn com htmlFor (a11y) no módulo IB',
      inputControlledFirst: 'PRIMEIRO uso de Input controlled real (value+onChange) no módulo IB',
      legendCardPattern: 'Card destacado bg-slate-50 como guia visual de leitura',
    },

    notificationsMockData: {
      structure: 'object com 9 keys × {email: bool, push: bool} = 18 booleans',
      defaultsTotalOn: 17 + ' (apenas limitApproved.push é false default)',
      categoriesCount: 9,
      categoriesGroups: '3 grupos: Transações (3) + Segurança (4) + Limites (2)',
      assymetricDefault: 'Único default false: limitApproved.push (UX consciente)',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'Header h1+sublabel + 4 section labels uppercase + 9 notification labels + button labels + email field = ~25 strings',
      impact: 'IBHome (22) → 10 outras páginas (0 cada) → IBSettingsNotifications (0)',
    },

    knownGapsTechnical: [
      '190 linhas 100% MOCK — 4ª MENOR DO MÓDULO IB (vs IBSettingsAccount 186L)',
      '3 useState — 100% aproveitados',
      '0 useEffect',
      'ZERO i18n — gap inter-página persiste',
      '4 DEAD IMPORTS (Smartphone, CardHeader, CardTitle, cn) — MELHOR cleanup das 3 sub-páginas Settings',
      'NotificationRow inline NÃO extraída para components/',
      'NotificationRow recebe props {id, label, emailKey, pushKey} mas emailKey/pushKey NUNCA USADOS — props inúteis',
      'NotificationRow lê notifications[id] via closure — anti-pattern',
      'Save Button bottom sem onClick — submit dead',
      'Cancelar email NÃO restaura valor original (sem snapshot)',
      'Sem validação formato e-mail',
      'Sem código verificação novo e-mail',
      'Pattern auto-save vs explicit-save confuso',
      'Apenas 2 canais (Email + Push) — sem SMS/WhatsApp',
      'Sem Do Not Disturb',
      'Sem frequência (real-time vs digest)',
      'Sem threshold valor para Transações grandes',
      'Sem test notification',
      'Sem audit trail notificações',
      'Sem preferences per device',
      'Sem categoria marketing separada',
      '9 categorias fixas sem add/remove',
      'ZERO uso SDK base44 (User.notification_preferences)',
      '#00D26A em button neutro semanticamente questionável',
      'Sem feedback visual ao salvar (toast)',
    ],
  },
};

export default IBSettingsNotificationsDoc;