// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBSettingsSecurity (Internet Banking) — Entrega 23
// ----------------------------------------------------------------------------
// DÉCIMA página do módulo INTERNET BANKING — terceira do bloco CONFIGURAÇÕES
// (segunda sub-página acessada via hub IBSettings).
//
//   1. IBSettingsSecurity.jsx (205 linhas) — Senha + 2FA + Dispositivos + Histórico
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada via Link do hub IBSettings settingsItems[1] security (Shield emerald)
// - É a 3ª MENOR PÁGINA do módulo IB (205L vs IBSettingsAccount 186L vs
//   IBSettings 90L) — apenas 87% IBProofs (235L), 30% IBPixSend (689L)
// - É a página com MAIS sub-seções verticais do módulo IB inteiro: 4 sections
//   (Senha + 2FA + Dispositivos + Histórico) — IBHome tem 4 também (saldo+QA+
//   resumo+lista) mas aqui são todas seções de SETTINGS com pattern uniforme
// - É TAMBÉM a página com MAIS variantes de PADRÃO Card-com-header-uppercase
//   no módulo IB (4 sub-seções repetem `<h2 uppercase tracking-wider> + <Card>`)
// - É a SEGUNDA página do módulo IB com botão BACK (depois IBSettingsAccount)
//
// PADRÕES NOVOS NA PÁGINA (não vistos nas 9 anteriores do módulo IB):
// - PRIMEIRO uso de `<Switch>` shadcn IMPLÍCITO via state twoFactorEnabled
//   (paradoxalmente o componente Switch é IMPORTADO mas NÃO RENDERIZADO no
//   JSX — gap arquitetural raro: import sem uso DESPITE state existir para o
//   componente que NÃO está visível) — este é um bug arqueológico crítico
// - PRIMEIRO uso REAL e funcional de Trash2 icon em Buttons (excluir
//   dispositivo) — IBPixKeys importou mas usou em SideDrawer trigger, não
//   em Button inline de excluir
// - PRIMEIRO uso de `device.icon` rendering pattern (similar ao IBSettings
//   `<item.icon />` mas em DEVICE list ao invés de SETTINGS list) — Monitor
//   icon para Chrome/Windows, Smartphone para Safari/iPhone
// - PRIMEIRO Badge "Este dispositivo" com variant outline + text-xs distinto
//   do dispositivo atual — UX padrão correto p/ multi-device awareness
// - PRIMEIRO uso de #00D26A (cor oficial PIX) em Button GHOST (text-only sem
//   background) — uso semântico questionável: "Ver histórico completo" não
//   é ação PIX-related mas usa a cor PIX
// ============================================================================

export const IBSettingsSecurityDoc = {
  pageId: 'IBSettingsSecurity',
  pagePaths: ['/IBSettingsSecurity'],
  module: 'Internet Banking',
  section: 'Configurações — Segurança (sub-página do hub IBSettings)',

  explainer: {
    oneLiner:
      'Tela de Segurança da Conta — 205 linhas 100% MOCK — É a 3ª MENOR PÁGINA do módulo IB (205L vs IBSettingsAccount 186L vs IBSettings 90L; 87% IBProofs 235L; 30% IBPixSend 689L) — É TAMBÉM a página com MAIS sub-seções verticais uniformes do módulo IB (4 sections com pattern `<h2 uppercase>+<Card>`). É a SEGUNDA SUB-PÁGINA do hub IBSettings (acessada via settingsItems[1] security Shield emerald) e a SEGUNDA PÁGINA com botão BACK depois IBSettingsAccount. 5 grandes blocos verticais: (1) **Header com BACK** layout horizontal idêntico IBSettingsAccount — Link to=createPageUrl(IBSettings) wrapping Button ghost ArrowLeft + h1 "Segurança" 2xl-bold + sublabel "Gerencie a segurança da sua conta" — pattern consistente sub-page navigation; (2) **Senha Section** com label uppercase "Senha" + Card single-row p-4 flex justify-between — ESQUERDA flex gap-4 com [icon square 12w12 rounded-xl bg-slate-100 + Key icon 6w6 slate-600 + bloco "Senha de acesso" font-medium + sublabel "Última alteração: 15/01/2026" hardcoded] / DIREITA Button outline "Alterar Senha" Key icon — **gap funcional**: Button SEM onClick — submit dead / **gap UX**: data hardcoded "15/01/2026" há 3+ meses corretamente (data atual 27/04/2026) — apps reais alertariam "sua senha tem 3 meses, considere trocar" se ultrapasse threshold (90/180/365 dias); (3) **2FA Section** com label uppercase "Autenticação em Dois Fatores (2FA)" + Card single-row complexo flex justify-between — ESQUERDA flex gap-4 com [icon square 12w12 rounded-xl bg-emerald-100 + Shield icon 6w6 emerald-600 (cor consistente com IBSettings hub item Security) + bloco multi-linha: linha1 flex gap-2 com "Autenticação 2FA" font-medium + Badge condicional ternária (twoFactorEnabled true → emerald-100/700 com CheckCircle2 + "Ativado") OU (false → red-100/700 + "Desativado") / linha2 "Método: Aplicativo autenticador (Google Authenticator)"] / DIREITA Button outline "Gerenciar 2FA" — **GAP CRÍTICO ARQUEOLÓGICO**: `Switch` componente IMPORTADO de @/components/ui/switch (linha 19) MAS nunca RENDERIZADO no JSX / nem state setTwoFactorEnabled é invocado em handler / o useState `twoFactorEnabled` é apenas LIDO pela ternária do Badge mas NUNCA ALTERADO — toggle 2FA on/off impossível pelo usuário sem o Switch / **decisão arquitetural questionável**: 2FA usa Badge estático de leitura + Button "Gerenciar 2FA" (que abriria sub-tela ou Modal não implementado) ao invés de Switch inline rápido — apps bancários reais usam Switch inline com confirmação 2FA (toggle + dialog "confirme com código atual" para desativar); (4) **Dispositivos Autorizados Section** com label uppercase "Dispositivos Autorizados" + Card divide-y entre 2 rows mockadas iteradas via .map sobre array `devices` — cada row p-4 flex justify-between: ESQUERDA [icon square 10w10 bg-slate-100 + `<device.icon />` 5w5 (Monitor para Chrome/Windows OU Smartphone para Safari/iPhone — PRIMEIRO icon DEVICE-CONDITIONAL no módulo IB) + bloco linha1 flex gap-2 com `device.name` + Badge condicional `device.isCurrent && <Badge variant="outline" text-xs>Este dispositivo</Badge>` / linha2 "IP: {ip} • Último acesso: {lastAccess}"] / DIREITA Button ghost sm `Trash2` icon condicional `!device.isCurrent` (impede usuário deletar próprio dispositivo — UX correto) com classes inline `text-red-600 hover:text-red-700 hover:bg-red-50` (estilo destructive inline NÃO via variant=destructive) / Bottom Button outline standalone mt-4 "Encerrar todas as outras sessões" XCircle icon com mesmo padrão red inline — **gap funcional**: ambos botões trash + encerrar SEM onClick — dead actions / **gap segurança**: encerrar todas sessões deveria ter AlertDialog confirmação antes de executar (action irreversível); (5) **Histórico de Acessos Section** com label uppercase "Histórico de Acessos" + Card divide-y entre 4 rows mockadas iteradas via .map sobre `accessHistory` — cada row p-4 flex justify-between: ESQUERDA flex gap-4 com [text-sm slate-500 w-24 fixed (alinhamento) com `{date}` + bloco multi-linha: linha1 `{action}` font-medium ("Login" ou "Tentativa") / linha2 `{device} • {ip}`] / DIREITA Badge condicional ternária 2-state `status === "success"` → emerald-100/700 + CheckCircle2 + "Sucesso" / `failed` → red-100/700 + XCircle + "Falhou" / Bottom Button GHOST mt-2 com classe `text-[#00D26A]` (PRIMEIRO uso de cor PIX em button NEUTRO no módulo IB — uso semântico questionável: histórico de acessos não é PIX) "Ver histórico completo" — **mocks accessHistory**: 3 logins success diversos + 1 tentativa failed (Firefox/Linux IP 201.45.67.89 — IP DIFERENTE dos outros 189.123.45.67/68 sinaliza tentativa SUSPEITA correta UX) — **dado importante**: tentativa failed mantida no histórico para audit BACEN-aligned ✓; 1 useState (twoFactorEnabled true) — 100% LIDO mas NUNCA ALTERADO — paradoxalmente "captured-but-never-mutated" (variante do bug captured-but-ignored) similar gap IBExtract/IBProofs / 2 dead imports (CardHeader, CardTitle, AlertCircle, Clock, Switch) — Switch é o pior porque tem state controllado mas componente nunca renderiza; gaps arquiteturais: (i) **Switch importado mas não renderizado** — bug raro (state existe mas componente UI ausente); (ii) **3 Buttons "Alterar Senha", "Gerenciar 2FA", encerrar sessões** sem onClick — submit dead consistent module pattern; (iii) **Encerrar todas sessões sem AlertDialog confirmação** — ação irreversível sem warning; (iv) **Trash dispositivo sem AlertDialog** — IBPixKeys teve AlertDialog para excluir chave, IBSettingsSecurity NÃO TEM para excluir dispositivo (inconsistência módulo); (v) **Sem feedback de senha velha** — atual mock "15/01/2026" 3+ meses sem warning recomendar troca; (vi) **Apenas 1 método 2FA mostrado (Google Authenticator)** — apps reais oferecem múltiplos métodos: SMS, email, app autenticador, security key (FIDO2), biometria — sem dropdown ou seletor; (vii) **Sem histórico de mudanças de senha** — quando trocou, de que IP, etc.; (viii) **Sem expor "senha forte" indicator** com feedback do que tem (mínimo 8 chars, especiais, números); (ix) **Histórico apenas 4 itens hardcoded** — sem paginação, sem filtro por status/IP/dispositivo, sem busca, sem export CSV; (x) **Sem geolocalização do IP** — apps reais mostram "Login de São Paulo, BR" baseado em IP geolocate; (xi) **Sem distinção visual de IPs suspeitos** — IP 201.45.67.89 (failed) deveria ter badge "Suspeito" ou "Localização incomum"; (xii) **Sem agrupamento por data** (similar gap IBProofs vs IBExtract) — IBExtract agrupa Hoje/Ontem, IBSettingsSecurity tem date hardcoded inline mas sem agrupamento; (xiii) **Sem alerta push para tentativa failed** — usuário deveria receber notificação real-time quando tentativa de login falha; (xiv) **Botão "Ver histórico completo" sem onClick** — dead action / também sem destination clara (Modal? sub-página? entity AuditLog filter?); (xv) **Sem opção desativar 2FA** com confirmação 2FA atual (anti-takeover); (xvi) **Sem QR code para reconfigurar 2FA** quando perder dispositivo; (xvii) **Sem códigos de recuperação** (backup codes em apps reais com 2FA); (xviii) **0 useEffect** sem refetch on focus / sem subscription real-time para novos dispositivos; (xix) **ZERO uso SDK base44** — schema AuditLog poderia popular Histórico real, schema User poderia ter twoFactorEnabled field; (xx) **Continua gap ZERO i18n** inter-página persiste; (xxi) **Date format inconsistente entre páginas IB**: IBSettingsAccount usa "15/01/2026" no campo Última alteração, IBSettingsSecurity usa "15/01/2026" mesmo formato (consistente entre essas duas) MAS IBPixLimits histórico usa "15/01/2026" e accessHistory usa "27/01 15:30" (date+time inline) — inconsistência inter-seção; (xxii) **Sem device fingerprint hash** — apps reais armazenam fingerprint para detectar mesmo device com IP mudado; (xxiii) **isCurrent boolean simples** — sem timestamp de quando esse device foi marcado como current.',

    sectionsBreakdown: {
      headerWithBack: {
        role: 'Header com botão BACK pattern padronizado',
        observation: '2ª página do módulo IB com back button (após IBSettingsAccount)',
      },

      senhaSection: {
        role: 'Card single-row para gerenciar senha',
        leftBlock: '[icon square 12w12 bg-slate-100 + Key icon 6w6 slate-600 + bloco "Senha de acesso" + sublabel "Última alteração: 15/01/2026"]',
        button: 'outline "Alterar Senha" Key icon',
        gaps: [
          'Button SEM onClick — dead action',
          'Data "15/01/2026" hardcoded sem alerta de senha velha (3+ meses)',
          'Sem indicador de força da senha',
          'Sem histórico de mudanças de senha',
        ],
      },

      twoFactorSection: {
        role: 'Card single-row com Badge status + Button gerenciar',
        iconColor: 'EMERALD (consistent IBSettings hub Shield emerald-600)',

        statusDisplay: {
          element: 'Badge condicional ternária 2-state',
          enabled: 'emerald-100/700 + CheckCircle2 + "Ativado"',
          disabled: 'red-100/700 + "Desativado"',
        },

        method: '"Método: Aplicativo autenticador (Google Authenticator)"',
        button: 'outline "Gerenciar 2FA"',

        criticalBugSwitchImported: {
          description: 'Componente Switch IMPORTADO mas NUNCA RENDERIZADO no JSX',
          stateAffected: 'twoFactorEnabled é apenas LIDO pela ternária do Badge mas NUNCA ALTERADO',
          impact: 'Toggle 2FA on/off impossível pelo usuário sem o Switch',
          architecturalQuestion: 'Decisão de design questionável — apps bancários reais usam Switch inline com confirmação 2FA',
        },

        gaps: [
          'Switch importado sem renderização — bug arqueológico raro',
          'Apenas 1 método 2FA exposto (Google Authenticator) sem alternativas',
          'Sem QR code reconfigurar 2FA quando perder dispositivo',
          'Sem códigos de recuperação (backup codes)',
          'Sem confirmação 2FA atual ao desativar (anti-takeover)',
        ],
      },

      authorizedDevicesSection: {
        role: 'Card divide-y com lista de dispositivos + Button encerrar todas',
        rowStructure: 'flex justify-between p-4',

        leftBlock: {
          icon: 'square 10w10 bg-slate-100 + <device.icon /> 5w5 condicional',
          iconConditional: 'Monitor (Chrome/Windows) | Smartphone (Safari/iPhone)',
          uniqueness: 'PRIMEIRO icon DEVICE-CONDITIONAL no módulo IB',
          textBlock: '[name + Badge "Este dispositivo" condicional + IP/lastAccess]',
        },

        rightBlock: {
          condition: '!device.isCurrent (impede deletar próprio dispositivo — UX correto)',
          button: 'ghost sm Trash2 icon com classes inline text-red-600 hover:bg-red-50',
          inlineDestructive: 'Estilo destructive INLINE (não via variant=destructive)',
        },

        bottomButton: {
          element: 'outline mt-4 "Encerrar todas as outras sessões" XCircle icon',
          stylingInline: 'text-red-600 hover:bg-red-50',
          gap: 'SEM AlertDialog confirmação para ação irreversível (inconsistência com IBPixKeys que tinha AlertDialog para excluir chave)',
        },

        mocks: [
          '{Chrome-Windows, Monitor, 189.123.45.67, "Agora", isCurrent: true}',
          '{Safari-iPhone, Smartphone, 189.123.45.68, "Ontem às 18:30", isCurrent: false}',
        ],
      },

      accessHistorySection: {
        role: 'Card divide-y com histórico de acessos',
        rowStructure: 'flex justify-between p-4',

        leftBlock: {
          dateColumn: 'text-sm slate-500 w-24 fixed alignment',
          textBlock: '[action + device•ip]',
          actionValues: '["Login", "Tentativa"]',
        },

        rightBlock: {
          element: 'Badge condicional 2-state status',
          success: 'emerald-100/700 + CheckCircle2 + "Sucesso"',
          failed: 'red-100/700 + XCircle + "Falhou"',
        },

        bottomButton: {
          element: 'ghost mt-2 "Ver histórico completo"',
          stylingUnique: 'text-[#00D26A] (PRIMEIRO uso cor PIX em button NEUTRO no módulo IB)',
          semanticQuestion: 'Histórico de acessos não é PIX — uso da cor PIX questionável',
        },

        mocks: [
          '27/01 15:30 / Login / Chrome-Windows / 189.123.45.67 / SUCCESS',
          '27/01 08:15 / Login / Safari-iPhone / 189.123.45.68 / SUCCESS',
          '26/01 22:00 / Login / Chrome-Windows / 189.123.45.67 / SUCCESS',
          '26/01 18:45 / Tentativa / Firefox-Linux / 201.45.67.89 / FAILED — IP DIFERENTE sinaliza suspeito (UX correto)',
        ],

        bacenAuditAligned: 'Tentativa failed mantida no histórico ✓ — necessário para auditoria BACEN',
      },
    },

    knownGapsAcrossPage: [
      'Switch importado mas NUNCA renderizado — bug arqueológico raro',
      '3 Buttons (Alterar Senha, Gerenciar 2FA, Encerrar sessões) sem onClick — dead actions',
      'Encerrar sessões sem AlertDialog confirmação — ação irreversível',
      'Trash dispositivo sem AlertDialog (inconsistência com IBPixKeys que TEM)',
      'Senha hardcoded sem alerta de senha velha (3+ meses)',
      'Apenas 1 método 2FA (sem alternativas SMS/email/security key/biometria)',
      'Sem histórico de mudanças de senha',
      'Sem indicador de força da senha',
      'Histórico apenas 4 itens hardcoded sem paginação/filtro/busca/export',
      'Sem geolocalização do IP',
      'Sem distinção visual de IPs suspeitos',
      'Sem agrupamento por data (gap consistente vs IBExtract)',
      'Sem alerta push para tentativa failed real-time',
      'Botão "Ver histórico completo" sem onClick + sem destination clara',
      'Sem QR code reconfigurar 2FA',
      'Sem códigos de recuperação (backup codes)',
      'Sem confirmação 2FA atual ao desativar',
      'twoFactorEnabled state captured-but-never-mutated',
      '0 useEffect sem refetch sem subscription',
      'ZERO uso SDK base44 (AuditLog/User entities prontos)',
      'Date format inconsistente entre páginas IB',
      'Sem device fingerprint hash',
      'isCurrent boolean simples sem timestamp',
      'Continua gap ZERO i18n inter-página IB',
    ],
  },

  technical: {
    fileLocation: 'pages/IBSettingsSecurity.jsx (205 linhas — 3ª MENOR PÁGINA do módulo IB; 87% IBProofs 235L; 30% IBPixSend 689L)',
    routePath: '/IBSettingsSecurity',
    moduleAffinity: 'Internet Banking — terceira página do bloco Configurações',
    accessedFrom: ['IBSettings hub via Link settingsItems[1] security'],

    imports: {
      react: 'useState (1× hook)',
      reactRouter: 'Link de react-router-dom',
      utils: 'createPageUrl de @/components/utils',
      lucide: '[ArrowLeft, Shield, Key, Smartphone, Monitor, Trash2, CheckCircle2, XCircle, AlertCircle, Clock] — 10 icons',
      uiComponents: '[Card+CardContent+CardHeader (não usado)+CardTitle (não usado), Button, Badge, Switch (NÃO RENDERIZADO!)]',
      utilsLocal: 'cn de @/lib/utils — IMPORTADO mas não usado no JSX',
    },

    deadImports: {
      list: ['CardHeader — não usado', 'CardTitle — não usado', 'AlertCircle — não usado', 'Clock — não usado', 'Switch — IMPORTADO mas componente NUNCA RENDERIZADO no JSX (apesar de twoFactorEnabled state existir)', 'cn — importado mas não usado'],
      count: 6,
      observation: 'IBSettingsSecurity tem 6 dead imports (empata IBSettingsAccount como PIOR cleanup do módulo IB)',
      criticalSwitchBug: 'Switch é o caso MAIS GRAVE: componente importado, state controllado existe, mas Switch nunca renderiza — toggle 2FA impossível pelo usuário',
    },

    stateManagement: {
      hooksCount: 1,
      hooks: ['twoFactorEnabled true — controla Badge "Ativado/Desativado"'],
      complexity: 'TODOS captured-mas-never-mutated — `setTwoFactorEnabled` nunca é chamado em nenhum handler',
      pattern: 'Variante única do bug captured-but-ignored: aqui é READ-ONLY (lido pela ternária mas nunca mudado)',
      observation: 'Quebra padrão de zero-dead-state das 5 páginas anteriores (Receive→Keys→Limits→Proofs→SettingsAccount) — aqui o state existe mas é READ-ONLY',
    },

    crossPageNavigation: {
      linksRenderizados: '1 — Link to=createPageUrl(IBSettings) (back button)',
      observation: 'Pattern idêntico IBSettingsAccount — back para hub apenas',
      missingLinks: [
        'Sem cross-page para IBSettingsAccount/Notifications/Access',
        'Sem Link "Ver histórico completo" para AuditLog page',
      ],
    },

    helperFunctions: {
      observation: 'NENHUMA — sem formatCurrency (não há valores monetários) / sem helpers de date/IP / lógica inline simples',
    },

    designSystem: {
      pixOfficialColor: '#00D26A usado em Button GHOST "Ver histórico completo" — uso semanticamente QUESTIONÁVEL (histórico não é PIX)',
      iconConditionalDevice: 'PRIMEIRO icon DEVICE-CONDITIONAL no módulo IB (Monitor/Smartphone)',
      destructiveStylingInline: 'Buttons destrutivos usam classes inline text-red-600 ao invés de variant=destructive — INCONSISTÊNCIA com IBPixKeys que usa AlertDialogAction',
      badgeStatusPattern: 'Mesmo padrão Badge condicional ternária 2-state (success/failed) que IBPixLimits histórico — consistência intra-módulo',
      switchHiddenUI: 'Switch shadcn IMPORTADO mas componente nunca aparece — gap arqueológico CRÍTICO',
    },

    devicesMockData: {
      structure: '[{id, name, icon, ip, lastAccess, isCurrent}]',
      count: 2,
      mocks: [
        '{1, "Chrome - Windows", Monitor, 189.123.45.67, "Agora", isCurrent: true}',
        '{2, "Safari - iPhone", Smartphone, 189.123.45.68, "Ontem às 18:30", isCurrent: false}',
      ],
    },

    accessHistoryMockData: {
      structure: '[{date, action, device, ip, status}]',
      count: 4,
      distribution: '3 success + 1 failed',
      suspiciousMarker: 'IP 201.45.67.89 (failed) DIFERENTE dos outros 189.x — sinaliza tentativa suspeita corretamente',
      bacenAlignment: 'Tentativa failed mantida no histórico ✓ requisito BACEN',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'Header h1+sublabel + 4 section labels uppercase + button labels + badge labels + alert messages = ~25 strings',
      impact: 'IBHome (22) → 9 outras páginas (0 cada) → IBSettingsSecurity (0)',
    },

    knownGapsTechnical: [
      '205 linhas 100% MOCK — 3ª MENOR DO MÓDULO IB',
      '1 useState mas captured-but-never-mutated (variante de bug)',
      '0 useEffect',
      'ZERO i18n — gap inter-página persiste',
      '6 DEAD IMPORTS (CardHeader, CardTitle, AlertCircle, Clock, Switch, cn) — empata IBSettingsAccount como pior cleanup',
      'Switch importado mas NUNCA RENDERIZADO — bug arqueológico crítico',
      '3 Buttons sem onClick — dead actions',
      'Encerrar sessões sem AlertDialog (inconsistência IBPixKeys)',
      'Trash dispositivo sem AlertDialog (inconsistência IBPixKeys)',
      'Senha hardcoded sem alerta de senha velha',
      'Apenas 1 método 2FA exposto',
      'Sem histórico mudanças senha',
      'Sem indicador força senha',
      'Histórico 4 itens hardcoded sem paginação/filtro/busca',
      'Sem geolocalização IP',
      'Sem distinção visual IPs suspeitos',
      'Sem agrupamento por data',
      'Sem alerta push tentativa failed',
      'Sem QR code reconfigurar 2FA',
      'Sem códigos recuperação',
      'Sem confirmação 2FA atual ao desativar',
      'Botão Ver histórico completo sem onClick + sem destination',
      'Date format inconsistente vs outras páginas',
      'Sem device fingerprint',
      'isCurrent sem timestamp',
      'Destructive styling inline (text-red-600) inconsistente com IBPixKeys variant',
      '#00D26A usado em button neutro semanticamente questionável',
      'ZERO uso SDK base44 (AuditLog/User entities prontos)',
    ],
  },
};

export default IBSettingsSecurityDoc;