// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — COMUNICAÇÃO (Admin Interno)
// ----------------------------------------------------------------------------
// Cobre as 6 PÁGINAS da seção "Comunicação" do menu lateral do Admin Interno,
// EXATAMENTE na ordem em que aparecem em layout.jsx (linhas 330-341):
//
//   1. AdminIntCommDashboard.jsx    (323 linhas) — KPIs+Charts+Top5+Problemas+Top Automações
//   2. AdminIntCommAutomations.jsx  (397 linhas) — "Régua de E-mails" (45 automations + Modal 4-tab)
//   3. AdminIntCommTemplates.jsx    (311 linhas) — 12 templates + Editor 4-tab Visual/HTML
//   4. AdminIntCommSMTP.jsx         (250 linhas) — Provider switch (5 opts) + Form Amazon SES + Test
//   5. AdminIntCommSenders.jsx      (300 linhas) — Senders+Domains+DNS Records (SPF/DKIM/DMARC)
//   6. AdminIntCommLogs.jsx         (310 linhas) — 6 mocks + 5 filtros + 6 status + Detail Dialog 3-tab
//
// PADRÃO TRANSVERSAL DA SEÇÃO INTEIRA:
// - 100% MOCK (zero SDK, zero base44.entities) — toast.success fake em TODOS os submits
// - Sem entity própria definida (nem Email, nem EmailTemplate, nem EmailLog)
// - Breadcrumb consistente: [Admin Interno → Comunicação → {pagina}]
// - cn() de @/lib/utils + lucide-react + cores #2bc196 (PagSmile primary) recorrentes
// - Provider único hardcoded "Amazon SES" mesmo em providers list mostrando 5 opções
// - Cada página declara seus próprios arrays mock no topo (DRY violation x6)
// ============================================================================

export const AdminIntCommunicationDoc = {
  pageId: 'AdminIntCommunication',
  pagePaths: [
    '/AdminIntCommDashboard',
    '/AdminIntCommAutomations',
    '/AdminIntCommTemplates',
    '/AdminIntCommSMTP',
    '/AdminIntCommSenders',
    '/AdminIntCommLogs',
  ],
  module: 'Admin Interno',
  section: 'Comunicação — 6 páginas (Dashboard → Automações → Templates → SMTP → Remetentes → Logs)',

  explainer: {
    oneLiner:
      'Seção "Comunicação" do menu lateral (layout.jsx linhas 330-341) com 6 páginas — TODAS 100% mock — gerenciando o ciclo completo de e-mails transacionais da PagSmile. (1) CommDashboard 323L é o overview executivo: Header com Period Select (7d/30d/90d) como `actions` prop, 5 KPI cards horizontais (Enviados 12.456 blue Send / Entregues 12.180 emerald CheckCircle2 + sub "97,8%" / Abertos 4.872 violet Eye + sub "40,0%" / Clicados 1.218 amber MousePointer + sub "25,0%" / Bounces 276 red AlertTriangle + sub "2,2%" + flag isNegative=true) com lógica COMPLEXA de cor da Badge: a regra é `(changeType="up" && !isNegative) || (changeType="down" && isNegative)` → emerald/ELSE red — ou seja, "subir bounces" é vermelho e "descer bounces" é verde, mas "subir entregas" é verde e "descer entregas" é vermelho — semântica invertida intencional via flag isNegative; grid-2 abaixo: LineChart Recharts altura 200px de "Volume de Envio" últimas 4 semanas (cor #2bc196 stroke 2.5 + dot fill) + "Distribuição por Tipo" com 5 barras horizontais CUSTOM (Onboarding 35% blue / Transacional 28% emerald / Financeiro 22% violet / Risco/CB 10% amber / Sistema 5% slate) — cada barra é div h-2 bg-slate-100 com filho div width=value% colorido por type.color (Tailwind class string); grid-2 seguinte: "Top 5 Templates" lista numerada 1-5 (KYC Aprovado 62.3% / Boas-vindas 58.1% / Saque Processado 55.8% / Primeira Transação 51.2% / Credenciais API 48.9%) com circle index slate + Badge emerald rate% + Link ghost "Ver todos" → AdminIntCommTemplates / "Problemas Recentes" 3 alertas (1 error red "156 bounces de domínio @empresa.com" / 2 warnings amber "SPF inválido marketing@" + "23 e-mails em fila há mais de 1 hora") com Button condicional "Verificar"/"Corrigir"/"Ver fila" — TODOS sem onClick; Card final "Automações Mais Ativas" Table 5-col native (Automação/Enviados/Entrega/Abertura/Status Badge "Ativa" emerald) + Link "Ver todas" → AdminIntCommAutomations; (2) CommAutomations 397L é a "Régua de E-mails" — Stats grid-5 com gradientes Tailwind (Total 45 slate / Ativas 38 emerald / Pausadas 5 amber / Rascunhos 2 slate-light / Disparos 12.456 blue), filtros 3 (Search + Categoria 5 opts + Status 3 opts) NÃO FUNCIONAIS (state armazenado mas .filter nunca aplicado), seções renderizadas via `Object.entries(automationCategories).map` em 4 grupos: 🚀 Onboarding (6 itens), 💳 Transacional (1 item), 💰 Financeiro (2 itens), 🛡️ Risco (2 itens) totalizando 11 automações — gap: stats diz 45 mas só 11 estão renderizadas; AutomationCard inline component com Mail icon green/amber por status + Badge + grid-3 (Gatilho trigger string / Disparos 30d / Taxa Abertura green) + Buttons Edit + Pausar/Ativar (toggle visual sem state); Modal "Nova Automação" max-w-2xl com 4 Tabs: Info (Nome/Descrição/Categoria 4 opts) / Trigger (Select agrupado por evento — Merchant 3 / KYC 3 / Transação 2 / Financeiro 2 totalizando 10 eventos com SelectItem "_group_X" disabled como header — workaround pois shadcn Select não tem grouping nativo) + radio Imediato/Aguardar X minutos|horas|dias / Template (3 opts hardcoded TPL-001/002/005 + Button Preview sem onClick) / Config (Remetente 2 opts + 3 checkboxes tracking abertura/cliques/ativar imediato — 2 defaultChecked); footer 3 botões Cancelar+Enviar Teste+Salvar — toast.success fake; (3) CommTemplates 311L lista 12 templates hardcoded com filtragem REAL via .filter (única página da seção que filtra de verdade!) por search OR category, Table 5-col (ID em <code> bg-slate / Nome / Categoria Badge colorido pelo categoryColors map blue/emerald/violet/red / "Usado em X automações" / 3 ícones Edit Eye Copy — só Edit e Copy têm onClick), Modal Editor max-w-4xl com DialogTitle dinâmico ("Editar Template - {id}" OU "Novo Template") e 4 Tabs: Info (Nome/Categoria/Assunto com placeholder "🎉 Bem-vindo ao PagSmile, {{merchant.trade_name}}!" / Pré-header) / Editor (toggle Visual|HTML em pílulas dentro de bg-slate-100 — modo Visual mostra TOOLBAR custom com Bold/Italic/Underline/Link/Image/List/ListOrdered SEM funcionalidade real + área "preview" hardcoded simulando email "Olá, {{merchant.contact_name}}! Seja bem-vindo... [LOGO PAGSMILE] ... COMPLETAR CADASTRO" — modo HTML mostra apenas Textarea font-mono placeholder "<html>...</html>") / Variables (3 grupos: 👤 Merchant 5 vars / 🔗 Links 4 vars / 📅 Datas 3 vars — Badge clicável que copia via navigator.clipboard + toast "Copiado!") / Preview (placeholder vazio "Preview do e-mail com dados de exemplo"); footer 4 botões Cancelar+Preview+Enviar Teste+Salvar — gap: Editor visual é COMPLETAMENTE estático (toolbar e conteúdo hardcoded — NÃO É contentEditable ou react-quill); (4) CommSMTP 250L é o switcher de provider — Status Card gradient emerald-teal mostrando "Amazon SES" + Badge Conectado + 5 métricas (provider/status/último envio/taxa entrega/fila) + 2 buttons "Testar conexão" (com setTesting + setTimeout 2s + toast.success — UNICA simulação async da seção) e "Ver métricas" sem onClick; Provider Selection grid-5 com 5 cards clicáveis (SMTP Próprio Server / SendGrid Cloud / Amazon SES Cloud + active=true → Badge "ATIVO" emerald absolute / Mailgun Cloud / Postmark Mail) — selectedProvider state controla border 2px emerald — gap: NÃO MUDA o form abaixo, sempre mostra "Configuração - Amazon SES" hardcoded; Form Amazon SES com Região AWS Select 4 opts (us-east-1 default / us-west-2 / sa-east-1 / eu-west-1) + Configuration Set + Access Key ID com mask "AKIA**" prefilled + Secret Access Key com toggle Eye/EyeOff e prefill "secret-access-key-here" (gap CRÍTICO: secret hardcoded em código fonte); seção "Configurações Avançadas" com 4 inputs (Rate limit 50 / Retry 3 opts 1/3/5 / Timeout 30s / Intervalo retries 60s); seção "Opções de Tracking" com 4 checkboxes ALL defaultChecked (tracking abertura pixel / tracking cliques URL rewriting / processar bounces auto / processar complaints auto); footer 3 buttons Cancelar+Testar Conexão+Salvar; (5) CommSenders 300L gerencia ENDEREÇOS e DOMÍNIOS de envio — 4 senders hardcoded (noreply default Star amber+badge PADRÃO / suporte / financeiro / marketing NOT verified + spf=false), card visual de cada sender muda border (amber se !verified) com 4 indicators (Verificado/SPF/DKIM/DMARC) usando StatusIcon helper component (CheckCircle2 emerald se ok / AlertTriangle amber se !ok) + IF !verified → Button "Corrigir configuração" amber; seção "Domínios Verificados" Table 6-col (Domínio / SPF / DKIM / DMARC / Status Badge active=emerald|partial=amber / Ações Settings+RefreshCw — sem onClick), 2 domains mock (pagsmile.com all-true active / pagsmile.io DMARC=false partial); seção "Registros DNS Necessários" 3 cards expandíveis (SPF TXT em @ "v=spf1 include:amazonses.com include:sendgrid.net ~all" / DKIM CNAME "selector1._domainkey.pagsmile.com → dkim.amazonses.com" / DMARC TXT em _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@pagsmile.com") cada um com Input readOnly font-mono + Button Copy (navigator.clipboard + toast "Copiado!") — UMA das poucas funcionalidades REAIS desta seção; 2 Modals (Novo Remetente: email/nome/uso / Novo Domínio: domínio + paragraph informativo); (6) CommLogs 310L exibe histórico DETALHADO de e-mails enviados — Filters Card grid-5 com 5 filtros (Período 4 opts / Tipo 5 opts / Status 5 opts / Destinatário Input email / Merchant Input nome) + button "Filtrar" — gap: filtros NÃO APLICADOS (state armazenado, lista sempre mostra os 6 mocks fixos); Lista de e-mails como CARDS verticais (não table) com 6 mocks variados representando 5 dos 6 status (sent slate / delivered blue / opened emerald + openedAt time / clicked violet + clickedAt + openedAt / bounced red + error message / spam não tem mock) — cada card mostra date font-mono + recipient bold + Badge type + subject + "Merchant: X" + Badge Status com icon dinâmico do statusConfig + linhas openedAt/clickedAt condicionais com icons inline + 2 ações ghost (Eye=abre detail / RefreshCw=toast "E-mail reenviado!") com `opacity-0 group-hover:opacity-100` (aparecem só no hover); Pagination footer hardcoded "Mostrando 1-50 de 12.456" + 3 buttons (Anterior disabled / Página 1 de 250 / Próxima — TODOS sem onClick efetivo); Detail Modal max-w-2xl com 3 Tabs: Info (4 cards 2x2 ID+font-mono / Data+hora HARDCODED "28/01/2026" + dynamic time / Tipo / Template hardcoded "TPL-001" — gap não pega template real do email) + Remetente "noreply@pagsmile.com" hardcoded + Destinatário dinâmico + Assunto + Status atual + IF openedAt → Aberto em / Content (placeholder vazio) / Timeline (4 eventos fixos com 14:35:22 → 14:35:23 → 14:35:24 + spread condicional dos openedAt e clickedAt) — UNICA timeline da seção e usa color dots inline. PADRÕES TRANSVERSAIS: nenhuma página tem entity ou SDK call, todas declaram arrays no topo, 5/6 têm Modal de criação/edição (exceto Dashboard), formato Date é mistura de "28/01 14:35:22" string mock com outras paginas usando ISO — sem helper formatDate central, statusConfig duplicated entre Logs+Senders+Templates com ligeiras diferenças, Card border-amber é convenção visual para "atenção pending" usada em Senders!verified e Logs bounced.',

    commDashboardMicroscopic: {
      role: 'Overview executivo da Comunicação — primeira página acessada via menu lateral',
      menuPosition: 'Linha 335 do layout.jsx — t("menu.dashboard")',
      breadcrumbs: '[Admin Interno → Comunicação]',
      stateManagement: {
        period: 'string default "30d" — Period Select 3 opções (7d/30d/90d)',
      },
      hardcodedDataSources: {
        kpis: '5 itens (Enviados 12.456 / Entregues 12.180+97,8% / Abertos 4.872+40,0% / Clicados 1.218+25,0% / Bounces 276+2,2%)',
        volumeData: '4 semanas hardcoded (Sem 1: 2.800 / Sem 2: 3.200 / Sem 3: 2.900 / Sem 4: 3.500)',
        emailTypeData: '5 categorias (Onboarding 35% blue 4360 / Transacional 28% emerald 3488 / Financeiro 22% violet 2740 / Risco/CB 10% amber 1246 / Sistema 5% slate 622)',
        topTemplates: '5 templates (KYC Aprovado 62.3% / Boas-vindas 58.1% / Saque Processado 55.8% / Primeira Transação 51.2% / Credenciais API 48.9%)',
        problems: '3 alerts (1 error 156 bounces @empresa.com / 2 warnings SPF inválido + 23 e-mails em fila >1h)',
        topAutomations: '5 automações (Boas-vindas 1234 / Lembrete KYC 456 / KYC Aprovado 892 / Merchant Ativado 756 / Saque Processado 2345) — TODAS active',
      },
      kpiCardsGrid: {
        layout: 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4',
        items5: ['Enviados Send blue', 'Entregues CheckCircle2 emerald', 'Abertos Eye violet', 'Clicados MousePointer amber', 'Bounces AlertTriangle red'],
        badgeColorLogic: {
          condition: '(changeType==="up" && !isNegative) || (changeType==="down" && isNegative)',
          true: 'border-emerald + bg-emerald-50 + text-emerald-700',
          false: 'border-red + bg-red-50 + text-red-700',
          rationale: 'Para Bounces (isNegative=true), DESCER é bom (emerald) e SUBIR é ruim (red). Para outros, lógica inversa',
        },
        gap: 'isNegative só está em Bounces — KPI manual de inverter semântica é frágil',
      },
      twoChartsRow: {
        leftCard: {
          title: 'TrendingUp #2bc196 + "Volume de Envio"',
          chartType: 'LineChart Recharts altura h-[200px]',
          line: 'stroke="#2bc196" strokeWidth=2.5 + dot fill #2bc196',
          tooltip: 'estilo customizado white bg + box-shadow inline',
        },
        rightCard: {
          title: 'Mail #2bc196 + "Distribuição por Tipo"',
          chartType: 'CUSTOM bars horizontais (NÃO Recharts)',
          itemTemplate: 'div h-2 bg-slate-100 com filho div width=value% colorido por type.color',
          gap: 'NÃO usa BarChart do Recharts apesar de ser visualmente um bar chart',
        },
      },
      twoListsRow: {
        leftCard: {
          title: 'Zap #2bc196 + "Top 5 Templates"',
          headerAction: 'Link → AdminIntCommTemplates Button "Ver todos" ghost',
          itemTemplate: 'circle index slate + name + Badge emerald rate%',
        },
        rightCard: {
          title: 'AlertTriangle amber + "Problemas Recentes"',
          headerAction: 'Link → AdminIntCommLogs Button "Ver logs" ghost',
          itemColors: 'IF problem.type==="error" → red bg + border / ELSE amber',
          actionButtons: 'Verificar / Corrigir / Ver fila — TODOS SEM onClick',
        },
      },
      bottomTable: {
        title: 'Zap #2bc196 + "Automações Mais Ativas"',
        headerAction: 'Link → AdminIntCommAutomations Button "Ver todas"',
        tableType: 'native HTML <table> (NÃO shadcn Table)',
        cols: '5 (Automação / Enviados text-right / Entrega% / Abertura% / Status Badge "Ativa" emerald)',
        rowHover: 'hover:bg-slate-50 dark:hover:bg-slate-800/50',
      },
      knownGapsDashboard: [
        'Period Select decorativo — não filtra dados (state armazenado mas dados são fixos)',
        '3 botões "Verificar/Corrigir/Ver fila" no Problems sem onClick',
        'Distribuição por Tipo NÃO usa Recharts — divs com width inline',
        'Number formatting inconsistente (12.456 com ponto / 4.872 com ponto / mas porcentagens com vírgula 97,8%)',
        'isNegative flag manual em apenas 1 KPI — escalabilidade ruim',
        'volumeData fixo em 4 pontos — Period Select 90d ainda mostraria 4 semanas',
      ],
    },

    commAutomationsMicroscopic: {
      role: '"Régua de E-mails" — gestão completa de automações trigger-based',
      menuPosition: 'Linha 336 — t("menu_admin.email_automation")',
      breadcrumbs: '[Admin Interno → Comunicação → Automações]',
      stateManagement: {
        searchQuery: 'string — armazenado mas NÃO filtra renderização',
        categoryFilter: 'string default "all" — armazenado mas NÃO filtra',
        statusFilter: 'string default "all" — armazenado mas NÃO filtra',
        newAutomationModal: 'boolean — Dialog Nova Automação',
        activeTab: 'string default "info" — controla 4 tabs do Modal',
      },
      hardcodedDataSources: {
        summaryStats: '{total: 45, active: 38, paused: 5, draft: 2, dispatches: 12456}',
        automationCategories: '4 grupos: onboarding(6 itens) / transactional(1) / financial(2) / risk(2) — TOTAL 11 automações',
        eventOptions: '4 grupos: Merchant(3) / KYC(3) / Transação(2) / Financeiro(2) — TOTAL 10 eventos',
        gap: 'summaryStats.total=45 mas só 11 automações renderizadas — números desconectados',
      },
      headerToolbar: {
        title: '"Régua de E-mails"',
        actions: 'Button Plus "Nova Automação" → setNewAutomationModal(true)',
      },
      summaryStatsGrid: {
        layout: 'grid grid-cols-2 md:grid-cols-5 gap-4',
        cards: [
          'Total 45 slate gradient',
          'Ativas 38 emerald gradient',
          'Pausadas 5 amber gradient',
          'Rascunhos 2 slate-light',
          'Disparos 12.456 blue gradient',
        ],
      },
      filtersCard: {
        items: '[Search Input + Categoria Select 5 opts + Status Select 3 opts]',
        gap: 'Filtros decorativos — state armazenado mas Object.entries mapeia categories diretamente',
      },
      automationCategoriesRender: {
        method: 'Object.entries(automationCategories).map renderiza 4 Cards seções',
        sectionTemplate: 'CardHeader com {icon emoji} + label + count + grid-2 com AutomationCard items',
        AutomationCard: {
          inline: true,
          structure: 'border rounded-xl + flex justify-between (Mail icon green|amber + name + template) + Badge Ativa|Pausada',
          metricsGrid: '3 cols (Gatilho trigger string / Disparos 30d / Taxa Abertura green)',
          actions: '2 Buttons (Edit / IF active → Pausar Pause icon, ELSE → Ativar Play icon)',
          gap: 'Buttons Edit e Pausar/Ativar SEM onClick — visual apenas',
        },
      },
      newAutomationModal: {
        size: 'max-w-2xl max-h-[90vh] overflow-y-auto',
        tabs: ['info', 'trigger', 'template', 'config'],
        tabInfo: '[Nome obrigatório / Descrição Textarea / Categoria Select 4 opts]',
        tabTrigger: {
          eventSelect: 'Select com agrupamento HACK — SelectItem com value="_group_X" disabled como header + items prefixados pl-6',
          gap: 'Workaround porque shadcn Select não tem grouping nativo (componente SelectGroup existe mas não usado)',
          delayRadio: '2 opções: Imediato (defaultChecked) / Aguardar (X Input + minutes/hours/days Select)',
          gapRadio: 'usa input type="radio" nativo (NÃO RadioGroup do shadcn) — inconsistência de design system',
        },
        tabTemplate: '[Template Select 3 opts hardcoded TPL-001/002/005 + Button Preview sem onClick]',
        tabConfig: {
          remetente: 'Select 2 opts (noreply / suporte) sem default value',
          checkboxes: '3 (tracking abertura defaultChecked / tracking cliques defaultChecked / ativar imediato NOT default)',
        },
        footer: '3 botões: Cancelar / Enviar Teste sem onClick / Salvar Automação → toast.success fake',
      },
      knownGapsAutomations: [
        '3 filtros (search + categoria + status) NÃO APLICADOS — state vazio',
        'Stats Total 45 vs 11 renderizadas — desconexão',
        'Buttons Edit + Pausar/Ativar sem onClick — toggle visual fake',
        'Modal Trigger usa SelectItem disabled "_group_X" como header — não é o padrão SelectGroup',
        'Modal Trigger usa input radio nativo em vez de RadioGroup',
        'Modal Template Button Preview sem onClick',
        'Modal Config Remetente sem default value',
        'Salvar Automação → toast fake (sem persistência)',
      ],
    },

    commTemplatesMicroscopic: {
      role: 'Gestão dos 12 templates de e-mail c/ Editor Visual + HTML',
      menuPosition: 'Linha 337 — t("menu.templates")',
      breadcrumbs: '[Admin Interno → Comunicação → Templates]',
      stateManagement: {
        searchQuery: 'string — usado em filteredTemplates ATIVAMENTE (toLowerCase em name + id)',
        categoryFilter: 'string default "all" — usado em filteredTemplates',
        editorModal: 'object|null — Modal de edição/criação',
        editorMode: 'string default "visual" — toggle Visual/HTML no editor',
      },
      hardcodedDataSources: {
        templates: '12 itens com id (TPL-001 → TPL-040) / name / category / usedIn count',
        variablesGroups: '3 grupos: merchant(5 vars) / links(4 vars) / dates(3 vars) — total 12 mustache variables',
        categoryColors: 'map de 4 cores Onboarding=blue / Transacional=emerald / Financeiro=violet / Risco=red',
      },
      filteringLogic: {
        active: true,
        rule: 'matchSearch (name OR id includes searchQuery toLowerCase) AND matchCategory (filter==="all" OR category.toLowerCase()===filter)',
        note: 'ÚNICA página da seção Comunicação que filtra REALMENTE',
      },
      templatesTable: {
        cols: '5 (ID em <code> / Nome / Categoria Badge colorida / Usado em X automações / 3 ícones Edit Eye Copy)',
        actions: '[Edit → setEditorModal(template) / Eye SEM onClick / Copy → toast "Template duplicado!" fake]',
      },
      editorModal: {
        size: 'max-w-4xl max-h-[90vh]',
        title: 'DINÂMICO: IF editorModal.id → "Editar Template - {id}" / ELSE → "Novo Template"',
        tabs: ['info', 'editor', 'variables', 'preview'],
        tabInfo: '[Nome (defaultValue=editorModal.name) / Categoria 4 opts / Assunto / Pré-header]',
        tabEditor: {
          modeToggle: 'Pílulas Visual|HTML em bg-slate-100 — apenas troca renderização condicional',
          visualMode: {
            toolbar: '7 botões custom (Bold/Italic/Underline/Link/Image/List/ListOrdered) c/ Button ghost size=icon — TODOS sem onClick',
            content: 'Box com [LOGO PAGSMILE] hardcoded + 3 paragraphs hardcoded simulando email + Button COMPLETAR CADASTRO + {{link_kyc}} placeholder',
            gap: 'NÃO É contentEditable, NÃO é react-quill, NÃO é tiptap — conteúdo 100% estático fake',
          },
          htmlMode: 'apenas Textarea font-mono min-h-[400px] placeholder "<html>...</html>" — sem real syntax highlight',
        },
        tabVariables: {
          structure: '3 cards bg-slate-50 (Merchant 👤 / Links 🔗 / Datas 📅)',
          itemsBadge: 'Badge clicável que faz `navigator.clipboard.writeText(v) + toast.success("Copiado!")` — funcionalidade REAL',
        },
        tabPreview: 'placeholder vazio "Preview do e-mail com dados de exemplo" — não renderiza nada',
        footer: '4 botões: Cancelar / Preview sem onClick / Enviar Teste sem onClick / Salvar → toast fake',
      },
      knownGapsTemplates: [
        'Eye action da Table sem onClick',
        'Editor Visual toolbar 7 botões sem onClick (Bold, Italic, etc)',
        'Editor Visual conteúdo 100% hardcoded — não editável',
        'Editor HTML apenas Textarea — sem syntax highlight',
        'Preview tab vazio',
        'Footer Preview e Enviar Teste sem onClick',
        'Sem versionamento de templates',
        'Sem A/B testing config',
        'Sem entity Template no schema',
      ],
    },

    commSMTPMicroscopic: {
      role: 'Configuração do provedor de envio (SMTP/API)',
      menuPosition: 'Linha 338 — t("menu_admin.smtp_config")',
      breadcrumbs: '[Admin Interno → Comunicação → Config SMTP]',
      stateManagement: {
        selectedProvider: 'string default "ses" — controla seleção visual dos providers',
        showSecret: 'boolean — toggle Eye/EyeOff do Secret Access Key',
        testing: 'boolean — controla loading do "Testar conexão" (com setTimeout 2s real)',
      },
      hardcodedDataSources: {
        providers: '5 itens (smtp Server / sendgrid Cloud / ses Cloud + active=true / mailgun Cloud / postmark Mail)',
      },
      statusCard: {
        background: 'gradient from-emerald-50 to-teal-50 border-emerald-200',
        title: 'CheckCircle2 + "Status do Serviço"',
        metrics5: '[Provedor atual "Amazon SES" / Status Badge Conectado / Último envio "28/01/2026 14:35" / Taxa entrega "97,8%" emerald / E-mails na fila 12]',
        actions: '[Button "Testar conexão" disabled durante testing + Loader2 spin / Button "Ver métricas" sem onClick]',
        testHandler: 'setTesting(true) + setTimeout 2000ms + setTesting(false) + toast.success — UNICA simulação async REAL da seção',
      },
      providerSelectionGrid: {
        layout: 'grid grid-cols-2 md:grid-cols-5 gap-3',
        items: '5 cards button clicáveis',
        activeBadge: 'IF provider.active=true → Badge "ATIVO" emerald absolute -top-2 -right-2',
        selectionBorder: 'IF selectedProvider===id → border-2 emerald + bg emerald/5 / ELSE slate',
        gap: 'selectedProvider state muda visual MAS form abaixo SEMPRE mostra "Configuração - Amazon SES" hardcoded — não dinâmico',
      },
      configFormSES: {
        title: 'Settings + "Configuração - Amazon SES"',
        gap: 'Hardcoded mesmo se user selecionar SendGrid/Mailgun/etc',
        fields: {
          regionAWS: 'Select default "us-east-1" c/ 4 opts (us-east-1 / us-west-2 / sa-east-1 / eu-west-1)',
          configurationSet: 'Input defaultValue "pagsmile-production"',
          accessKeyID: 'Input font-mono defaultValue "AKIA**********************" mascarado',
          secretAccessKey: 'Input type=password|text c/ Button toggle Eye/EyeOff + defaultValue "secret-access-key-here" — gap CRÍTICO: secret hardcoded em código!',
        },
        advancedConfig: '[Rate limit 50 number / Retry 3 opts (1/3/5) / Timeout 30s number / Intervalo 60s number]',
        trackingOptions: '4 checkboxes ALL defaultChecked (tracking abertura pixel / tracking cliques URL rewriting / processar bounces auto / processar complaints auto)',
      },
      footerActions: '[Cancelar / Testar Conexão (loading) / Salvar Configurações → toast.success fake]',
      knownGapsSMTP: [
        'Form sempre mostra Amazon SES — selectedProvider state ignorado pelo form',
        'Secret Access Key hardcoded "secret-access-key-here" no código fonte (CRÍTICO)',
        'Button "Ver métricas" sem onClick',
        '4 checkboxes defaultChecked sem state controlado',
        'Sem Reset Connection ou Disconnect',
        'Sem teste de envio real (só simulação com setTimeout)',
        'Sem entity SMTPConfig no schema',
      ],
    },

    commSendersMicroscopic: {
      role: 'Gestão de endereços (FROM:) e domínios verificados c/ DNS records',
      menuPosition: 'Linha 339 — t("menu_admin.senders")',
      breadcrumbs: '[Admin Interno → Comunicação → Remetentes]',
      stateManagement: {
        newSenderModal: 'boolean — Modal Novo Remetente',
        newDomainModal: 'boolean — Modal Novo Domínio',
      },
      hardcodedDataSources: {
        senders: '4 (noreply default Star+PADRÃO / suporte / financeiro / marketing not_verified+spf=false)',
        domains: '2 (pagsmile.com all-true active / pagsmile.io DMARC=false partial)',
        dnsRecords: '3 strings (SPF/DKIM/DMARC com TXT/CNAME/TXT em _dmarc)',
      },
      sendersCardList: {
        layout: 'space-y-3 — não tabela',
        cardBorder: 'IF !verified → border-amber bg-amber-50/50 / ELSE border-slate hover',
        senderTemplate: {
          left: 'Mail icon emerald|amber + email + IF isDefault → Badge "PADRÃO" amber + Star / + name + usage',
          right: '[Edit ghost + Trash2 red ghost — sem onClick]',
        },
        statusRow: '4 inline status (Verificado green|Não verificado amber + SPF + DKIM + DMARC) usando StatusIcon helper',
        StatusIcon: {
          inline: true,
          rule: 'IF ok → CheckCircle2 emerald-500 / ELSE → AlertTriangle amber-500',
        },
        notVerifiedAction: 'IF !verified → Button "Corrigir configuração" amber outline (sem onClick)',
      },
      domainsTable: {
        cols: '6 (Domínio / SPF / DKIM / DMARC / Status Badge active=emerald|partial=amber / Ações Settings+RefreshCw)',
        actions: '2 ghost buttons sem onClick',
      },
      dnsRecordsCard: {
        title: 'Settings + "Registros DNS Necessários"',
        description: '"Configure estes registros no seu provedor de DNS"',
        items3: '[SPF (TXT em @) / DKIM (CNAME) / DMARC (TXT em _dmarc)]',
        eachRecord: 'Input readOnly font-mono + Button Copy (navigator.clipboard + toast "Copiado!")',
        note: 'Funcionalidade Copy é REAL — uma das poucas funcionalidades reais da seção',
      },
      newSenderModal: '[email / nome / uso] — toast.success fake',
      newDomainModal: '[domínio + paragraph informativo] — toast.success fake',
      knownGapsSenders: [
        'Buttons Edit/Trash2 do sender sem onClick',
        'Buttons Settings/RefreshCw da domains table sem onClick',
        'Button "Corrigir configuração" sem onClick',
        'Sem teste de SPF/DKIM/DMARC real',
        'Sem fluxo de re-verificação',
        'DNS records hardcoded — não muda se domínio mudar',
        'Sem entity Sender ou Domain no schema',
      ],
    },

    commLogsMicroscopic: {
      role: 'Histórico de e-mails enviados c/ filtros + detalhes + timeline',
      menuPosition: 'Linha 340 — t("menu_admin.logs")',
      breadcrumbs: '[Admin Interno → Comunicação → Logs]',
      stateManagement: {
        period: 'string default "7d" — Period Select 4 opts',
        typeFilter: 'string default "all" — Type Select 5 opts',
        statusFilter: 'string default "all" — Status Select 5 opts',
        searchRecipient: 'string — Input email',
        searchMerchant: 'string — Input nome',
        detailModal: 'object|null — Modal Detalhes do E-mail',
      },
      hardcodedDataSources: {
        emailLogs: '6 itens cobrindo 5 dos 6 status (sent / delivered / opened / clicked + clickedAt / bounced + error / spam SEM mock)',
        statusConfig: '6 status (sent slate Clock / delivered blue CheckCircle2 / opened emerald Eye / clicked violet MousePointer / bounced red XCircle / spam red AlertTriangle)',
      },
      filtersCard: {
        layout: 'grid grid-cols-2 md:grid-cols-5 gap-4',
        items: '[Período 4 opts (today/7d/30d/90d) / Tipo 5 opts / Status 5 opts / Destinatário Input / Merchant Input]',
        actionButton: 'Button "Filtrar" Search — sem onClick efetivo',
        gap: 'Filtros DECORATIVOS — state armazenado mas lista renderiza sempre os 6 mocks',
      },
      emailListCards: {
        layout: 'space-y-3 — cards verticais (NÃO table)',
        cardTemplate: {
          left: 'date font-mono + recipient bold + Badge type / subject / Merchant: X',
          right: 'Status Badge c/ icon dinâmico + IF openedAt → Eye+time + IF clickedAt → MousePointer+time',
          hoverActions: '[Eye → setDetailModal / IF status!=="bounced" → RefreshCw → toast "E-mail reenviado!"] com `opacity-0 group-hover:opacity-100`',
        },
      },
      paginationFooter: {
        text: 'hardcoded "Mostrando 1-50 de 12.456" + "Página 1 de 250"',
        buttons: '[Anterior disabled / Página 1 de 250 / Próxima — sem onClick]',
        gap: 'Paginação 100% visual fake',
      },
      detailModal: {
        size: 'max-w-2xl',
        tabs: ['info', 'content', 'timeline'],
        tabInfo: {
          grid_2x2: '[ID font-mono / Data+hora HARDCODED "28/01/2026" + dynamic time / Tipo / Template HARDCODED "TPL-001"]',
          gap: 'Template não vem do email — sempre TPL-001 mock',
          row2: '[Remetente HARDCODED "noreply@pagsmile.com" / Destinatário dinâmico]',
          row3: 'Assunto dinâmico',
          row4: '[Status atual / IF openedAt → Aberto em "28/01/2026 {time}"]',
        },
        tabContent: 'placeholder vazio "Preview do conteúdo do e-mail"',
        tabTimeline: {
          events4Fixed: '14:35:22 Enviado para fila / 14:35:23 Processado provedor / 14:35:24 Entregue',
          spreadConditional: 'IF openedAt → Primeira abertura emerald / IF clickedAt → Clique em link violet',
          itemTemplate: 'div w-3 h-3 rounded-full + time font-mono w-16 + event text',
          gap: 'Eventos fixos não vêm do log real — todos mocks renderizam mesmo timeline',
        },
        footer: '[Fechar / Ver conteúdo sem onClick / Reenviar → toast fake]',
      },
      knownGapsLogs: [
        '5 filtros decorativos — state vazio, lista sempre 6 mocks',
        'Pagination 100% fake (3 buttons sem onClick)',
        'Detail Modal Tab Content placeholder vazio',
        'Detail Modal Tab Info Template HARDCODED "TPL-001" (não vem do email)',
        'Detail Modal Remetente HARDCODED "noreply@pagsmile.com"',
        'Detail Modal Tab Timeline com 3 primeiros eventos fixos hardcoded',
        '"Ver conteúdo" e "Exportar" do header sem onClick',
        'RefreshCw "Reenviar" toast fake',
        'Sem filtro por data range customizado',
        'Sem entity EmailLog no schema',
      ],
    },
  },

  technical: {
    fileLocations: {
      commDashboard: 'pages/AdminIntCommDashboard.jsx (323 linhas)',
      commAutomations: 'pages/AdminIntCommAutomations.jsx (397 linhas — maior da seção)',
      commTemplates: 'pages/AdminIntCommTemplates.jsx (311 linhas)',
      commSMTP: 'pages/AdminIntCommSMTP.jsx (250 linhas)',
      commSenders: 'pages/AdminIntCommSenders.jsx (300 linhas)',
      commLogs: 'pages/AdminIntCommLogs.jsx (310 linhas)',
    },
    menuOrderInLayoutJsx: {
      file: 'layout.jsx',
      block: 'getAdminInternoMenuItems(t) — id="communication" — linhas 330-341',
      submenu: [
        { line: 335, page: 'AdminIntCommDashboard', label: 't("menu.dashboard")' },
        { line: 336, page: 'AdminIntCommAutomations', label: 't("menu_admin.email_automation")' },
        { line: 337, page: 'AdminIntCommTemplates', label: 't("menu.templates")' },
        { line: 338, page: 'AdminIntCommSMTP', label: 't("menu_admin.smtp_config")' },
        { line: 339, page: 'AdminIntCommSenders', label: 't("menu_admin.senders")' },
        { line: 340, page: 'AdminIntCommLogs', label: 't("menu_admin.logs")' },
      ],
    },
    crossPageNavigation: {
      commDashboard_to_templates: 'Top 5 Templates header → AdminIntCommTemplates',
      commDashboard_to_logs: 'Problemas Recentes header → AdminIntCommLogs',
      commDashboard_to_automations: 'Automações Mais Ativas header → AdminIntCommAutomations',
      commAutomations_to_dashboard: 'Breadcrumb → AdminIntCommDashboard',
      commTemplates_to_dashboard: 'Breadcrumb → AdminIntCommDashboard',
      commSMTP_to_dashboard: 'Breadcrumb → AdminIntCommDashboard',
      commSenders_to_dashboard: 'Breadcrumb → AdminIntCommDashboard',
      commLogs_to_dashboard: 'Breadcrumb → AdminIntCommDashboard',
      gap: 'Templates NÃO LINKA com Automations apesar de cada template ter "Usado em X automações" (texto sem ação)',
    },
    sharedToastPattern: {
      pages: 'TODAS as 6 (toast import sonner em todas)',
      operations: [
        'CommDashboard: nenhum toast — só Period Select decorativo',
        'CommAutomations: "Automação criada com sucesso!" no submit do Modal',
        'CommTemplates: "Template duplicado!" / "Copiado!" / "Template salvo com sucesso!"',
        'CommSMTP: "Conexão testada com sucesso!" (após setTimeout 2s) + "Configurações salvas com sucesso!"',
        'CommSenders: "Copiado!" (DNS records) + "Remetente adicionado!" + "Domínio adicionado!"',
        'CommLogs: "E-mail reenviado!"',
      ],
    },
    sharedNonFunctional: {
      buttonsWithoutOnClick: [
        'CommDashboard: 3 problem actions (Verificar/Corrigir/Ver fila)',
        'CommAutomations: AutomationCard Edit + Pausar/Ativar / Modal Preview / Modal Enviar Teste',
        'CommTemplates: Eye da row / Toolbar 7 buttons / Footer Preview + Enviar Teste',
        'CommSMTP: Status "Ver métricas" button',
        'CommSenders: Sender Edit/Trash2 / Domain Settings/RefreshCw / "Corrigir configuração"',
        'CommLogs: "Filtrar" button / Pagination 3 buttons / Detail "Ver conteúdo" / Header "Exportar"',
      ],
    },
    sharedRealClipboard: {
      pages: ['CommTemplates Variables tab', 'CommSenders DNS Records'],
      pattern: 'navigator.clipboard.writeText + toast.success("Copiado!")',
      note: 'UNICA funcionalidade que TOCA browser API real (clipboard) — todo resto é toast fake',
    },
    iconsUsage: {
      commDashboard: ['Mail', 'Send', 'Eye', 'MousePointer', 'AlertTriangle', 'TrendingUp', 'TrendingDown', 'ArrowRight', 'Zap', 'CheckCircle2'],
      commAutomations: ['Plus', 'Search', 'Mail', 'Pause', 'Play', 'Edit', 'Eye', 'Clock', 'Zap', 'Send', 'CheckCircle2', 'BarChart3'],
      commTemplates: ['Plus', 'Search', 'Edit', 'Eye', 'Copy', 'Mail', 'FileText', 'Bold', 'Italic', 'Underline', 'Link', 'Image', 'List', 'ListOrdered', 'Code'],
      commSMTP: ['CheckCircle2', 'RefreshCw', 'BarChart3', 'Eye', 'EyeOff', 'Server', 'Cloud', 'Mail', 'Settings', 'Loader2'],
      commSenders: ['Plus', 'Edit', 'Trash2', 'Star', 'Copy', 'RefreshCw', 'CheckCircle2', 'AlertTriangle', 'Settings', 'Mail', 'Globe'],
      commLogs: ['Download', 'Search', 'Eye', 'RefreshCw', 'Mail', 'CheckCircle2', 'XCircle', 'Clock', 'MousePointer', 'AlertTriangle', 'History', 'ChevronLeft', 'ChevronRight'],
    },
    knownGapsCrossSection: [
      'TODA a seção é 100% mock — zero entity, zero SDK, zero base44.entities.X.create',
      'Zero entity declarada (sem Email, EmailTemplate, EmailLog, SMTPConfig, Sender, Domain)',
      'Provider SES hardcoded em SMTP form mesmo com 5 providers selecionáveis',
      'Secret Access Key hardcoded "secret-access-key-here" (CRÍTICO de segurança em código fonte)',
      'Filtros decorativos em 4 das 6 (Dashboard Period / Automations 3 / Logs 5 / SMTP form provider)',
      'Apenas Templates filtra REALMENTE (search + category)',
      'Pagination Logs 100% fake',
      'Editor Visual de Templates 100% estático (não é contentEditable, não é rich-text editor real)',
      'Toolbar 7 botões do Editor Visual sem onClick',
      'Toggle Visual/HTML do Editor é apenas troca de renderização condicional',
      'Detail Modal de Logs com Template e Remetente HARDCODED (não vem do log)',
      'Timeline de Logs com 3 primeiros eventos sempre iguais',
      'Sem A/B testing de templates',
      'Sem versionamento de templates',
      'Sem fila de envio real (e-mails na fila = 12 hardcoded)',
      'Sem teste de DNS real (SPF/DKIM/DMARC) — apenas StatusIcon visual',
      'Sem fluxo de re-verificação de domínio/sender',
      'Sem rate limiting real',
      'Sem suporte a multi-locale ou multi-language nos templates',
      'Variables (mustache) listadas mas sem schema de validação',
      'Salvar Automação/Template/Configurações = toast fake (nada vai pro backend)',
      'Reenviar e-mail = toast fake (não há retry queue)',
      'Cores Badge inconsistentes entre páginas (algumas usam border-0, outras outline)',
      'Ícone Mail aparece 6 vezes — provavelmente seria melhor MailOutline ou variantes',
    ],
  },
};

export default AdminIntCommunicationDoc;