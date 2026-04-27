// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — ADMINISTRAÇÃO CORE (Admin Interno)
// ----------------------------------------------------------------------------
// Cobre as PRIMEIRAS 8 páginas da seção "Administração" do menu lateral,
// EXATAMENTE na ordem em que aparecem em layout.jsx (linhas 349-356):
//
//   1. AdminIntSettings.jsx       (193 linhas) — 5 Sections (Empresa+Operação+Segurança+Limites+Notificações)
//   2. AdminIntUsers.jsx          (278 linhas) — 5 stats + filtros + 5 user cards + Modal Novo Usuário 3-grupos
//   3. AdminIntProfiles.jsx       (243 linhas) — 5 perfis SISTEMA + Custom + permissionsData 6 módulos / 50+ perms
//   4. AdminIntGlobalRates.jsx    (206 linhas) — 7 cards taxas (Crédito Table + Débito + PIX + Boleto + Antec + Saque + Liquid)
//   5. AdminIntRiskParams.jsx     (194 linhas) — 4 grupos (CB Ratio thresholds + Antifraude + Limites + Monitoramento c/ Switches)
//   6. AdminIntIntegrations.jsx   (232 linhas) — 4 categorias (Acquirers/Antifraude/Banking/Notif) + 2 SideDrawers
//   7. AdminIntTemplates.jsx      (197 linhas) — 4 Tabs (Merchant/Transaction/Financial/System) + Edit Modal + Preview
//   8. AdminIntSystemLogs.jsx     (222 linhas) — 4 Tabs (Audit/System/API/Errors) + filtros + Pagination
//
// IMPORTANTE: A seção "Administração" tem 13 páginas no total. Esta entrega cobre as
// 8 primeiras (Settings → SystemLogs). As 5 últimas (MCCs/MCCsAnalysis/Partners/
// FeePlans/AiAgents) ficam para a Entrega 10 — Administração Avançada.
// ============================================================================

export const AdminIntAdministrationCoreDoc = {
  pageId: 'AdminIntAdministrationCore',
  pagePaths: [
    '/AdminIntSettings',
    '/AdminIntUsers',
    '/AdminIntProfiles',
    '/AdminIntGlobalRates',
    '/AdminIntRiskParams',
    '/AdminIntIntegrations',
    '/AdminIntTemplates',
    '/AdminIntSystemLogs',
  ],
  module: 'Admin Interno',
  section: 'Administração — Parte 1: Settings → Users → Profiles → GlobalRates → RiskParams → Integrations → Templates → SystemLogs',

  explainer: {
    oneLiner:
      'Primeira metade da seção "Administração" do menu lateral (layout.jsx linhas 349-356) com 8 páginas — TODAS 100% MOCK — cobrindo configuração geral da plataforma. (1) AdminIntSettings 193L é o hub central de configurações da empresa: SEM Tabs, apenas 5 Cards seção empilhados verticalmente cada um com componente inline `Section` (recebe title/icon/data/fields/onEdit) que renderiza Card com header flex justify-between (title icon + Button outline "Editar" small) e CardContent grid-2 com fields renderizados como `<div>{label}: <strong>{value}</strong></div>` (suporte a fullWidth via col-span-2); 5 seções: 🏢 Dados da Empresa Building2 (8 fields hardcoded — Razão Social "PAGSMILE BRASIL PAGAMENTOS LTDA" / Nome Fantasia / CNPJ "12.345.678/0001-90" / IE / Endereço fullWidth / Telefone / E-mail / Website), ⏰ Operação Clock (7 fields — Fuso "America/Sao_Paulo (BRT -3)" / Moeda / Formato Data "DD/MM/AAAA" / Hora "24h" / Decimal "Vírgula (1.234,56)" / Horário Op "00:00 às 23:59 (24h)" / Feriados fullWidth), 🛡️ Segurança Shield (7 fields TEXTO COMPOSTO via template literal — "2FA obrigatório ✅ Sim" / "Expiração 30 minutos de inatividade" / "Tentativas 5 (depois bloqueia por 15 minutos)" / "Política Mín. 12 caracteres, maiúscula, número, especial" / "Expiração 90 dias" / "Histórico Últimas 5 não podem ser reutilizadas" / IPs fullWidth), 📊 Limites Globais BarChart3 (8 fields todos passados por formatCurrency local — Transação min/max R$1-100k / PIX min/max R$0,01-100k / Boleto min/max R$5-50k / Limite diário CPF R$50k / mensal R$200k), 🔔 Notificações Bell (5 fields — 3 emails diferentes + Slack channel + Webhook URL fullWidth); UM ÚNICO Dialog max-w-lg `editModal` que abre para QUALQUER seção mas com title condicional via ternário aninhado (company/operation/security/limits/notifications) e CONTEÚDO HARDCODED "Formulário de edição seria exibido aqui com os campos correspondentes" — submit faz toast.success "Configurações salvas!" fake; (2) AdminIntUsers 278L gerencia 5 usuários hardcoded (João Admin Tech online com IP 189.45.123.100 / Maria Gerente Op online / Carlos Analista Risco offline 27/01 18:30 / Ana Operador Suporte INACTIVE has2fa=false / Pedro Analista Financeiro offline) com statusConfig para 5 status (online green / offline slate / inactive red / blocked red / pending yellow), Stats grid-5 calculados via filter em runtime (Total 5 / Ativos status!==inactive=4 / Inativos =1 / Online =2 / "Último acesso Agora (João Silva)" hardcoded último card), Filters Card com 2 Selects funcionais + Input search SEM onChange real, Lista de cards verticais com Avatar circular text-lg gerando iniciais via `name.split(" ").map(n => n[0]).join("").slice(0,2)`, cada card mostra nome+Badge status+email+linha de meta "Perfil X | Depto Y | 2FA ✅/❌"+linha de "Último acesso X | IP Y" (IP condicional `user.ip !== "-"`), AÇÕES CONDICIONAIS por status: IF inactive → "Reativar" + Trash2 red / ELSE → "Editar" + "Resetar" Lock + Trash2 red — TODOS toast.success fake; Modal "Novo Usuário" max-w-lg max-h-[90vh] com 3 GRUPOS BORDER-B separados (Dados Pessoais 4 fields incluindo Email com sufixo "@pagsmile.com" em span border-l-0 / Acesso 2 selects 5opts+7opts e 2 checkboxes default / Restrições Adicionais 2 grupos de input radio NATIVO `name="merchants"` e `name="ips"` em vez de RadioGroup — inconsistência); (3) AdminIntProfiles 243L gerencia 5 SystemProfiles + 1 área Customizados — systemProfiles array (admin level 5 / manager 4 / analyst 3 / operator 2 / viewer 1 todos system:true não editáveis) renderizados como cards horizontais com Shield blue + Badge "Nível X" + descrição + Lock icon "Perfil do sistema - Não editável" + lateral "Usuários: X" + Button "Ver detalhes" → setViewModal(profile.id), Card "Perfis Customizados" tem EmptyState centralizado "Nenhum perfil customizado criado" + Button criar; **DOIS objetos críticos**: permissionsData com 6 MÓDULOS e 51 permissões (dashboard 4 / merchants 10 incluindo change_rates+approve_docs+manage_chargebacks / transactions 9 incluindo refund+capture+cancel+resend_webhook+view_sensitive / financial 8 incluindo approve_withdrawals+execute_withdrawals+manual_adjustments / risk 9 incluindo create_rules+edit_lists / config 4) e profilePermissions só com 1 entry (analyst hardcoded com 6 listas) — gap CRÍTICO: View Modal mostra checkboxes mas SEMPRE renderiza profilePermissions.analyst independente do profile clicado (linha 185 `profilePermissions.analyst?.[module] || []`); Modal "Novo Perfil Customizado" max-w-lg c/ 3 fields (Nome / Descrição Textarea / "Baseado em" usando `<select>` HTML NATIVO em vez de Select shadcn — INCONSISTÊNCIA + helper text "As permissões do perfil base serão copiadas para edição"); (4) AdminIntGlobalRates 206L mostra 7 Cards de taxas todos com header "Editar" → setEditModal: ⚠️ amber alert top "Estas são taxas padrão" / 💳 Crédito MDR Table 6-col (Bandeira / 1x / 2-6x / 7-12x / 13+x / Internacional) com 5 bandeiras hardcoded (Visa-Mastercard idênticos 2.99/3.49/3.99/4.49/4.99 / Elo +0.30 / Amex +1.00 / Hipercard +0.50 — formatPercent local) / 💳 Débito 2 fields ÚNICOS (1.99% / 2.99% INTL hardcoded) / 📱 PIX 3 fields (0.99% / R$0 mín / R$50 máx) / 📄 Boleto 2 fields (R$0 emitido / R$2.90 pago) / ⚡ Antecipação 1 field "1,99% ao mês (pró-rata)" / ⬆️ Saque 3 fields (R$5 TED / R$0 PIX / R$100 mín) / 📅 Liquidação Padrão 4 fields hardcoded D+30/D+1/D+1/D+1; UM ÚNICO Dialog vazio "Formulário de edição de taxas seria exibido aqui" toast fake; (5) AdminIntRiskParams 194L tem 4 Cards principais com Edit button cada: ⚠️ Thresholds CB Ratio AlertTriangle com grid-2 de 4 colored boxes (Alerta yellow 0.65% / Crítico orange 0.80% / Programa red 0.90% / Suspensão Auto red-100/300 1.50%) + linha extra "Período avaliação Últimos 3 meses / Mín transações 100" / 🛡️ Antifraude Shield 5 fields (Score block ≥85 / Score review ≥60 / Velocidade 3 tentativas em 1h / Valor cliente novo R$5k / Máx tentativas diárias 10) / 💳 Limites Globais grid-2 5 fields (Máx Cartão 100k / Máx PIX 100k / Diário merchant 1M / Mensal 10M / Aprovação manual >50k) / 📊 Monitoramento BarChart3 com 3 rows estruturadas (Pico volume +200% / Negação >15% / Merchant novo >50k/dia) cada uma com Switch CHECKED hardcoded (sem state controlado — só visual); UM ÚNICO Dialog vazio "Formulário de edição seria exibido aqui" toast fake; (6) AdminIntIntegrations 232L 4 categorias com componente IntegrationCard inline reutilizado: 🏢 Adquirentes (3 — Cielo prod 99.98% / Rede prod 99.95% / Stone Sandbox INACTIVE 0%) / 🛡️ Antifraude (2 — ClearSale Total Guarantee SLA 98.5% score 72 / Konduto Score Only SLA 99.2% score 68) / 🏦 Banking (2 — BB conta+ag+psp Direto 3 keys / Itaú 2 keys) / 📧 Notificações (3 — SendGrid Email 1234 sent24h / Twilio SMS 89 sent / Slack 5 channels); IntegrationCard tem layout flex justify-between c/ icon blue + name + Badge status (active/inactive/error) + 4 condicionais por type (acquirer mostra EC+env / antifraud mostra Conta+Modo / banking mostra Conta+PSP / notification só Tipo) + linhas extras condicionais (lastTransaction / uptime>0 / sla) + 2 Buttons (Configurar → SideDrawer / Testar → toast `Teste de ${name} OK!`); USA SideDrawer (não Dialog) para 2 modais — UM Configurar (com title dinâmico e conteúdo placeholder) e UM Nova Integração (5 fields Tipo Select 4opts / Nome / Ambiente Select sandbox-prod / API Endpoint / API Key type=password) — duas únicas SideDrawers em toda a Administração Core; (7) AdminIntTemplates 197L tem 4 Tabs dividindo 15 templates total: 📧 Merchant 4 (Boas-vindas/Aprovação/Documentos/Alerta CB) / 💳 Transação 4 (Aprovada/Negada/Estorno/CB Recebido) / 💰 Financeiro 3 (Liquidação/Saque/Antecipação) / 🔧 Sistema 4 (Reset Senha/2FA/Alerta Segurança/Código SMS sms type) — TemplateRow component inline com icon condicional (Mail blue para email / MessageSquare green para sms) + Badge active/inactive + 2 Buttons (Preview → setPreviewModal / Editar → setEditModal); 2 Modais separados: Edit Modal max-w-2xl com Nome+IF email→Assunto+Textarea h-48 font-mono content + helper "Variáveis disponíveis: {{merchant_name}}, {{transaction_id}}, {{amount}}, {{date}}" — Preview Modal max-w-2xl mostra Headers email simulados (De: noreply@pagsmile.com / Para: merchant@example.com / Assunto: dinâmico) + body hardcoded "Olá Loja do João, este é um preview do template de {name lowercase}, As variáveis serão substituídas..." gap: NÃO renderiza variáveis reais, conteúdo é literal; gap arquitetural: ESTA PÁGINA DUPLICA AdminIntCommTemplates (Comunicação) — duas páginas de templates de e-mail no menu (Comunicação tem 12 templates, Admin Templates tem 15); (8) AdminIntSystemLogs 222L tem 4 Tabs (Audit/System/API/Errors) com Card de Filters COMPARTILHADO posicionado APÓS o TabsList mas DENTRO do Tabs root (visível em todas as tabs): 4 controls (Período Select 4 opts / Usuário Select 3 opts / Módulo Select 4 opts / Search Input flex-1) + 2 Buttons (Filter / Exportar Download) sem onClick efetivo; tab "audit" 8 logs hardcoded com action diversificada (LOGIN ok / ALTERAÇÃO compound message / ESTORNO / APROVAÇÃO / CRIAÇÃO / LOGIN failed bg-red-50 / ALTERAÇÃO config / SUSPENSÃO) cada renderizado como Card border com Badge action + Badge result success/failed + Pagination "Página 1 de 250" hardcoded fake / tab "system" 5 logs em estilo TERMINAL bg-slate-900 text-slate-100 font-mono com Date+Badge level (INFO blue / WARN yellow / ERROR red / DEBUG slate)+[service cyan]+message+details xs / tab "api" 5 logs em Table 6-col com Method Badge+endpoint font-mono+Status Badge condicional (200=green / 400=red — config tem 5 keys mas mocks só usam 200/201/400)+Tempo+Merchant / tab "errors" PLACEHOLDER vazio "Logs de erro filtrados seriam exibidos aqui". PADRÕES TRANSVERSAIS: TODAS as 8 páginas usam toast.success FAKE sem persistência, 4 páginas (Settings/GlobalRates/RiskParams/Integrations) usam o pattern UM ÚNICO Dialog/SideDrawer reutilizado para todas as ações de edição com conteúdo placeholder, breadcrumbs SEMPRE [Administração → {pagina}] sem `Admin Interno` no início (mesmo Settings que é o equivalente ao Dashboard do módulo), inconsistências de UI: Settings/GlobalRates/RiskParams usam Dialog / Integrations usa SideDrawer / Profiles usa `<select>` HTML nativo no Modal / Users usa `<input type=radio>` nativo no Modal / SystemLogs usa Switch (RiskParams) sem state — não há padrão único, cada página foi feita independentemente.',

    settingsMicroscopic: {
      role: 'Hub central de configurações da empresa — 5 áreas (Empresa/Operação/Segurança/Limites/Notificações)',
      menuPosition: 'Linha 349 do layout.jsx — t("menu_admin.general_settings")',
      breadcrumbs: '[Administração → Configurações]',
      gap_breadcrumb: 'Falta "Admin Interno" no início — todas as páginas Administration têm esse mesmo gap',
      stateManagement: {
        editModal: 'string|null — armazena qual seção está sendo editada (company/operation/security/limits/notifications)',
      },
      hardcodedDataSources: {
        companyData: 'object 8 fields (PAGSMILE BRASIL PAGAMENTOS LTDA / 12.345.678/0001-90 / Av. Paulista 1000)',
        operationData: 'object 7 fields (America/Sao_Paulo BRT-3 / BRL / DD/MM/AAAA / 24h / Vírgula / 24h op / Feriados nacionais+SP)',
        securityData: 'object 8 fields (require2fa true / sessionTimeout 30 / maxLoginAttempts 5 / lockoutDuration 15 / passwordMinLength 12 / passwordExpiry 90 / passwordHistory 5 / ipRestriction "Todos")',
        limitsData: 'object 8 fields (transação 1-100k / PIX 0.01-100k / boleto 5-50k / CPF diário 50k mensal 200k)',
        notificationsData: 'object 5 fields (3 e-mails diferentes alertas/suporte/financeiro / #alertas-operacao Slack / webhook URL)',
      },
      sectionInline: {
        component: 'inline `Section` recebe (title, icon, data, fields, onEdit)',
        structure: 'Card → Header flex justify-between + Title com Icon + Button "Editar" → CardContent grid-2 fields',
        fieldRendering: '<div col-span-1 OR col-span-2>{label}: <strong>{value}</strong></div>',
        fullWidthSupport: 'field.fullWidth → col-span-2 (usado em address, holidays, ipRestriction, webhookUrl)',
      },
      sectionsOrder: [
        '🏢 Dados da Empresa Building2 — 8 fields',
        '⏰ Operação Clock — 7 fields',
        '🛡️ Segurança Shield — 7 fields com VALORES COMPOSTOS via template literal (e.g. "5 (depois bloqueia por 15 minutos)")',
        '📊 Limites Globais BarChart3 — 8 fields todos via formatCurrency',
        '🔔 Notificações Bell — 5 fields',
      ],
      uniqueDialog: {
        scope: 'UM dialog editModal compartilhado para TODAS as 5 seções',
        title: 'TERNÁRIO ANINHADO: company/operation/security/limits/notifications → label PT-BR',
        body: 'placeholder fixo "Formulário de edição seria exibido aqui com os campos correspondentes"',
        submit: 'toast.success("Configurações salvas!") + setEditModal(null)',
      },
      knownGapsSettings: [
        'Dialog vazio para todas as 5 seções — não há forms reais',
        'Breadcrumb sem "Admin Interno"',
        'Sem persistência (toast fake)',
        'Sem entity SystemSettings no schema',
        'Switch require2fa renderizado como string "✅ Sim" em vez de Switch real',
        'TernárioComplexo no DialogTitle — manutenção difícil',
      ],
    },

    usersMicroscopic: {
      role: 'Gestão de usuários internos da PagSmile (não merchants)',
      menuPosition: 'Linha 350 — t("menu_admin.users")',
      breadcrumbs: '[Administração → Usuários]',
      stateManagement: {
        newUserModal: 'boolean — Modal Novo Usuário',
        filterStatus: 'string default "all"',
        filterRole: 'string default "all"',
      },
      hardcodedDataSources: {
        users: '5 (João Admin Tech online / Maria Gerente Op online / Carlos Analista Risco offline / Ana Operador Suporte INACTIVE has2fa=false / Pedro Analista Financeiro offline)',
        statusConfig: '5 status (online green / offline slate / inactive red / blocked red / pending yellow)',
      },
      pageHeaderGap: 'Usa `actionElement` prop em vez de `actions` — bug visto em outras páginas (Salvar/Botão pode não renderizar)',
      stats5Cards: {
        gridLayout: 'grid grid-cols-5 gap-4 — TODOS NATIVE divs (não shadcn Card)',
        items: [
          'Total — users.length',
          'Ativos — users.filter(u => u.status !== "inactive").length',
          'Inativos — users.filter(u => u.status === "inactive").length',
          'Online — users.filter(u => u.status === "online").length',
          '"Último acesso Agora (João Silva)" — HARDCODED 5º card diferente',
        ],
      },
      filtersCard: {
        items: '[Status Select 4opts (all/online/offline/inactive) / Perfil Select 5opts (all/Admin/Gerente/Analista/Operador) / Search Input SEM onChange]',
        filteringActive: 'true — filteredUsers.filter aplica status+role',
        gap: 'Search Input sem onChange handler — não filtra',
      },
      usersList: {
        layout: 'space-y-3 — Cards verticais',
        avatarLogic: 'name.split(" ").map(n => n[0]).join("").slice(0,2) — gera 2 iniciais',
        cardContent: '[Avatar circular slate / Nome+Badge status / email / "Perfil X | Depto Y | 2FA ✅/❌" / "Último acesso | IP Y" condicional]',
        actionsByStatus: {
          ifInactive: '[Reativar RefreshCw → toast / Trash2 red → toast]',
          ifActive: '[Editar / Resetar Lock → toast / Trash2 red → toast]',
          gap: 'Editar SEM onClick / Reativar e Trash2 e Resetar usam toast fake',
        },
      },
      newUserModal: {
        size: 'max-w-lg max-h-[90vh] overflow-y-auto',
        threeGroups: '[Dados Pessoais border-b / Acesso border-b / Restrições Adicionais]',
        groupPersonal: '[Nome obrigatório / E-mail com SUFFIX "@pagsmile.com" em span border-l-0 / CPF / Telefone]',
        groupAccess: '[Perfil Select 5 opts (viewer/operator/analyst/manager/admin) / Departamento Select 7 opts / 2 checkboxes default (Exigir 2FA / Enviar e-mail boas-vindas)]',
        groupRestrictions: '[2 grupos de RADIO NATIVO `<input type="radio" name="merchants">` e `name="ips"` em vez de RadioGroup shadcn — INCONSISTÊNCIA]',
        submit: 'toast.success("Usuário criado com sucesso!") + close',
      },
      knownGapsUsers: [
        'PageHeader prop `actionElement` em vez de `actions` — risco de não renderizar',
        'Search Input sem onChange',
        'Editar Button sem onClick (linha 152)',
        'Restrições Adicionais usa input type=radio nativo (não RadioGroup)',
        '5º stat hardcoded "Agora (João Silva)" — não calculado',
        'Sem entity User customizado (User entity built-in tem só name/email/role)',
      ],
    },

    profilesMicroscopic: {
      role: 'Gestão de perfis de acesso (RBAC) — 5 sistema + customizados',
      menuPosition: 'Linha 351 — t("menu_admin.profiles_permissions")',
      breadcrumbs: '[Administração → Perfis]',
      stateManagement: {
        viewModal: 'string|null — id do profile para ver permissões',
        newProfileModal: 'boolean',
      },
      hardcodedDataSources: {
        systemProfiles: '5 (admin level 5 / manager 4 / analyst 3 / operator 2 / viewer 1) — TODOS system:true não editáveis',
        permissionsData: 'OBJECT GIGANTE com 6 módulos e 51 permissions totais',
        profilePermissions: 'APENAS 1 entry "analyst" hardcoded com 6 listas de keys',
      },
      permissionsDataDetails: {
        dashboard: '4 perms (access/view_indicators/view_charts/export)',
        merchants: '10 perms (list/view/view_transactions/view_financial/create/edit/suspend/change_rates/approve_docs/manage_chargebacks)',
        transactions: '9 perms (list/view/search/export/refund/capture/cancel/resend_webhook/view_sensitive)',
        financial: '8 perms (view_balances/view_settlements/view_withdrawals/approve_withdrawals/execute_withdrawals/manual_adjustments/view_statements/export_reports)',
        risk: '9 perms (view_dashboard/analyze_fraud/block_transaction/approve_pending/manage_chargebacks/manage_meds/create_rules/edit_lists/configure_alerts)',
        config: '4 perms (access/manage_users/manage_profiles/change_params)',
      },
      systemProfilesList: {
        cardTemplate: 'flex justify-between border rounded-lg / Shield blue 10x10 + Nome + Badge "Nível X" + descrição + Lock "Perfil do sistema - Não editável"',
        rightSide: '[span "Usuários: X" / Button "Ver detalhes" → setViewModal(id)]',
      },
      customProfilesEmptyState: '[Texto "Nenhum perfil customizado criado" / Button outline criar]',
      viewPermissionsModal: {
        size: 'max-w-2xl max-h-[90vh] overflow-y-auto',
        title: '"Permissões do Perfil: {nome.toUpperCase()}"',
        content: 'Object.entries(permissionsData).map → Card por módulo com Checkboxes DISABLED checked se profilePermissions.analyst[module].includes(key)',
        criticalGap: 'SEMPRE usa profilePermissions.analyst[module] independente de qual profile foi clicado — admin/manager/operator/viewer ALL renderizam permissões do analyst',
      },
      newProfileModal: {
        size: 'max-w-lg',
        fields: '[Nome obrigatório / Descrição Textarea / "Baseado em" usando `<select>` HTML NATIVO em vez de Select shadcn]',
        submit: 'toast.success("Perfil criado! Configure as permissões.") — fake',
        gap: '<select> nativo quebra design system / não navega para tela de configuração de perms após criar',
      },
      knownGapsProfiles: [
        'View Permissions SEMPRE mostra do analyst (gap CRÍTICO)',
        'Modal usa <select> HTML nativo em vez de Select shadcn',
        'profilePermissions só tem analyst — outros profiles sem dados',
        'Sem persistência (toast fake)',
        'Sem entity Profile/AccessProfile no schema',
        'Custom profiles sempre vazio',
        'Sem heatmap de permissões',
      ],
    },

    globalRatesMicroscopic: {
      role: 'Configuração de TAXAS PADRÃO aplicadas a novos merchants',
      menuPosition: 'Linha 352 — t("menu_admin.global_rates")',
      breadcrumbs: '[Administração → Taxas]',
      stateManagement: {
        editModal: 'string|null — qual card está sendo editado (credit/debit/pix/boleto/anticipation/withdrawal/settlement)',
      },
      hardcodedDataSources: {
        creditCardRates: '5 bandeiras (Visa+Mastercard idênticos 2.99/3.49/3.99/4.49/4.99 / Elo +0.30 / Amex +1.00 / Hipercard +0.50) com 5 colunas (1x/2_6x/7_12x/13x/intl)',
        otherRatesHardcoded: 'TODAS as outras taxas (Débito 1.99/2.99 / PIX 0.99 / Boleto R$2.90 pago / Antecipação 1.99% mês / Saque R$5 TED / Liquidação D+30 D+1 D+1 D+1) escritas DIRETAMENTE no JSX, NÃO em objects',
      },
      topAlert: '⚠️ amber alert "Estas são as taxas padrão aplicadas a novos merchants. Merchants existentes podem ter taxas personalizadas configuradas em seus perfis."',
      sevenCardsList: [
        '💳 Crédito MDR Padrão Table 6-col c/ 5 bandeiras + formatPercent',
        '💳 Débito MDR grid-2 (Taxa única 1.99% / Internacional 2.99%) — HARDCODED no JSX',
        '📱 PIX grid-3 (Taxa 0.99% / Mín R$0 / Máx R$50) — HARDCODED no JSX',
        '📄 Boleto grid-2 (Emitido R$0 / Pago R$2.90) — HARDCODED',
        '⚡ Antecipação 1 field "1,99% ao mês (pró-rata)" — HARDCODED',
        '⬆️ Saque grid-3 (TED R$5 / PIX R$0 / Mín R$100) — HARDCODED',
        '📅 Liquidação Padrão grid-4 (Crédito D+30 / Débito D+1 / PIX D+1 / Boleto D+1) — HARDCODED',
      ],
      uniqueDialog: {
        scope: 'UM dialog reutilizado para 7 ações de Edit',
        title: 'GENÉRICO "Editar Taxas" (não muda por seção)',
        body: 'placeholder "Formulário de edição de taxas seria exibido aqui."',
        submit: 'toast.success("Taxas atualizadas!") fake',
      },
      knownGapsGlobalRates: [
        'Apenas Crédito tem array; outras 6 categorias têm valores hardcoded no JSX',
        'Dialog único genérico (não diferencia por seção)',
        'Sem entity GlobalRates/RateConfig',
        'Sem versionamento de tabelas de preço',
        'Sem A/B testing',
        'Sem export para PDF/Excel',
        'Liquidação D+X não permite override por bandeira/parcela',
      ],
    },

    riskParamsMicroscopic: {
      role: 'Parâmetros globais de risco — thresholds + antifraude + limites + monitoramento',
      menuPosition: 'Linha 353 — t("menu_admin.risk_params")',
      breadcrumbs: '[Administração → Risco]',
      stateManagement: {
        editModal: 'string|null — cb/fraud/limits/monitoring',
      },
      hardcodedDataSources: {
        cbRatioParams: 'object 6 fields (warning 0.65 / critical 0.80 / program 0.90 / autoSuspend 1.50 / period "Últimos 3 meses" / minTransactions 100)',
        fraudParams: 'object 6 fields (block ≥85 / review ≥60 / velocity 3/1h / maxNewCustomer 5000 / dailyAttempts 10)',
        limitsParams: 'object 5 fields (maxCard 100k / maxPix 100k / dailyMerchant 1M / monthlyMerchant 10M / approvalAbove 50k)',
        monitoringParams: 'object 6 fields (3 toggles default true / 3 thresholds)',
      },
      fourCards: [
        {
          title: '⚠️ AlertTriangle "Thresholds de Chargeback Ratio"',
          layout: 'grid-2 com 4 colored boxes (yellow/orange/red/red-strong) + linha extra grid-2',
          colors: 'Cada threshold tem cor escalonada: warning=yellow / critical=orange / program=red-light / autoSuspend=red-100/300',
        },
        {
          title: '🛡️ Shield "Parâmetros de Antifraude"',
          layout: 'grid-2 5 fields',
          composedValues: 'velocityLimit composto template: "{N} tentativas em {window}"',
        },
        {
          title: '💳 CreditCard "Limites de Transação Globais"',
          layout: 'grid-2 5 fields',
          values: 'Todos via formatCurrency',
        },
        {
          title: '📊 BarChart3 "Alertas de Monitoramento"',
          layout: '3 rows com Switch hardcoded checked={monitoringParams.X}',
          gap: 'Switch SEM state controlado nem onCheckedChange — apenas visual',
        },
      ],
      uniqueDialog: {
        scope: 'UM dialog reutilizado para 4 ações',
        body: 'placeholder "Formulário de edição seria exibido aqui."',
        submit: 'toast.success("Parâmetros atualizados!") fake',
      },
      knownGapsRiskParams: [
        'Dialog único genérico',
        'Switches sem state controlado (apenas visual)',
        'Sem entity RiskParams/SystemParams',
        'Sem histórico de alterações',
        'Sem simulador "se mudar X, qto poupa em Y"',
        'Sem alertas no Risk Dashboard quando params são alterados',
        'Threshold colors hardcoded inline (yellow/orange/red) — sem tokens semânticos',
      ],
    },

    integrationsMicroscopic: {
      role: 'Hub de integrações externas (Acquirers/Antifraude/Banking/Notificações)',
      menuPosition: 'Linha 354 — t("menu.integrations")',
      breadcrumbs: '[Administração → Integrações]',
      stateManagement: {
        configModal: 'string|null — nome da integração sendo configurada',
        newIntegrationModal: 'boolean',
      },
      hardcodedDataSources: {
        integrations: 'object com 4 keys: acquirers(3) / antifraud(2) / banking(2) / notifications(3)',
        statusConfig: '3 status (active green / inactive slate / error red)',
      },
      pageHeaderGap: 'Usa `actionElement` prop em vez de `actions`',
      fourSections: [
        {
          title: '🏢 Building2 "Adquirentes"',
          items: '[Cielo prod 99.98% / Rede prod 99.95% / Stone Sandbox INACTIVE 0%]',
          fieldsByType: 'EC code + ambiente + lastTransaction + uptime%',
        },
        {
          title: '🛡️ Shield "Antifraude"',
          items: '[ClearSale Total Guarantee SLA 98.5% score 72 / Konduto Score Only SLA 99.2% score 68]',
          fieldsByType: 'Conta + Modo + SLA + Score médio',
        },
        {
          title: '🏦 Landmark "PIX / Bancos"',
          items: '[Banco do Brasil PSP Direto 3 keys / Itaú 2 keys]',
          fieldsByType: 'Conta + PSP + N keys + lastTransaction',
        },
        {
          title: '📧 Mail "Notificações"',
          items: '[SendGrid Email 1234 sent24h / Twilio SMS 89 / Slack 5 channels]',
          iconOverride: 'IF integration.type==="E-mail" → Mail / ELSE MessageSquare',
        },
      ],
      integrationCardInline: {
        component: '`IntegrationCard` recebe (integration, icon, type)',
        layout: 'flex justify-between p-4 border rounded-lg hover:bg-slate-50',
        leftSide: 'Icon blue 12x12 + Name + Badge status + paragraph TIPO-CONDICIONAL (4 ramos: acquirer/antifraud/banking/notification) + linhas extras condicionais',
        rightSide: '[Configurar → setConfigModal(name) / Testar → toast.success(`Teste de ${name} OK!`) FAKE]',
      },
      twoSideDrawers: {
        configDrawer: 'title dinâmico `Configurar ${name}` + body placeholder + Salvar toast fake',
        newDrawer: 'title "Nova Integração" + 5 fields (Tipo Select 4opts / Nome / Ambiente sandbox/prod / API Endpoint / API Key type=password) + footer toast fake',
        gap: 'Outras páginas Admin Core usam Dialog — somente Integrations usa SideDrawer (inconsistência)',
      },
      knownGapsIntegrations: [
        'PageHeader prop `actionElement` errado',
        'Configurar SideDrawer body é placeholder — sem form real',
        'Testar button toast fake (não testa nada)',
        'Sem entity Integration ou IntegrationConfig',
        'Sem histórico de uptime',
        'Sem alertas quando integração entra em erro',
        'Inconsistência SideDrawer vs Dialog (resto do Admin usa Dialog)',
        'API Key type=password mas sem mask/reveal',
      ],
    },

    templatesMicroscopic: {
      role: 'Gestão de templates de comunicação (Email/SMS) — DUPLICA AdminIntCommTemplates',
      menuPosition: 'Linha 355 — t("menu.templates")',
      breadcrumbs: '[Administração → Templates]',
      stateManagement: {
        editModal: 'object|null — template sendo editado',
        previewModal: 'object|null — template sendo previewed',
      },
      hardcodedDataSources: {
        templates: 'object 4 categorias: merchant(4) / transaction(4) / financial(3) / system(4) — TOTAL 15',
      },
      duplicationGap: 'AdminIntCommTemplates (Comunicação) tem 12 templates DIFERENTES — duas páginas de templates de e-mail no menu (Comunicação=12 / Administração=15)',
      pageHeaderGap: 'Usa `actionElement` em vez de `actions` — Button "Novo Template" pode não renderizar',
      fourTabs: {
        defaultValue: 'merchant',
        items: ['📧 Merchant 4 / 💳 Transação 4 / 💰 Financeiro 3 / 🔧 Sistema 4'],
      },
      templateRowInline: {
        component: '`TemplateRow` recebe `template`',
        leftIcon: 'IF type==="email" → Mail blue / ELSE MessageSquare green',
        leftContent: 'Name + IF subject!=="-" → Assunto + lastEdit',
        rightActions: '[Badge active/inactive / Preview ghost → setPreviewModal / Editar → setEditModal]',
      },
      editModal: {
        size: 'max-w-2xl',
        fields: '[Nome / IF email→Assunto / Textarea h-48 font-mono content + helper "Variáveis disponíveis: {{merchant_name}}, {{transaction_id}}, {{amount}}, {{date}}"]',
        submit: 'toast.success("Template salvo!") fake',
        gap: '4 variáveis hardcoded no helper — não vêm de schema',
      },
      previewModal: {
        size: 'max-w-2xl',
        emailHeaders: 'IF type==="email" → De: noreply@pagsmile.com / Para: merchant@example.com / Assunto dinâmico',
        body: 'HARDCODED prose: "Olá Loja do João, Este é um preview do template de {name lowercase}, As variáveis serão substituídas pelos valores reais no envio, Atenciosamente Equipe PagSmile"',
        gap: 'Não renderiza variáveis reais — corpo é literal',
      },
      knownGapsTemplates: [
        'DUPLICA AdminIntCommTemplates (Comunicação) — duas páginas com templates diferentes',
        'PageHeader prop `actionElement` errado',
        'Preview com corpo hardcoded',
        'Variables hardcoded no helper text — não dinâmico',
        'Sem entity EmailTemplate',
        'Sem A/B testing',
        'Sem versionamento',
        'Tab "system" tem 1 template SMS único — type discrepancy',
      ],
    },

    systemLogsMicroscopic: {
      role: 'Logs e auditoria do sistema — 4 tipos diferentes em Tabs',
      menuPosition: 'Linha 356 — t("menu_admin.system_logs")',
      breadcrumbs: '[Administração → Logs]',
      stateManagement: {
        tab: 'string default "audit"',
      },
      hardcodedDataSources: {
        auditLogs: '8 entries com action diversificada (LOGIN ok / ALTERAÇÃO compound / ESTORNO / APROVAÇÃO / CRIAÇÃO / LOGIN failed bg-red-50 / ALTERAÇÃO config / SUSPENSÃO)',
        systemLogs: '5 entries (INFO/WARN/INFO/ERROR/INFO em api-gateway/antifraud/webhook/acquirer-cielo/settlement)',
        apiLogs: '5 entries com Method+endpoint+Status+time+merchant',
        levelConfig: '4 levels (INFO blue / WARN yellow / ERROR red / DEBUG slate)',
        statusConfig: '5 status keys (200/201/400/401/500) MAS mocks só usam 200/201/400',
      },
      sharedFiltersCard: {
        position: 'INSIDE Tabs root mas APÓS TabsList — visível em todas as tabs',
        items: '[Período Select 4opts / Usuário Select 3opts / Módulo Select 4opts / Search Input flex-1 / Filter button / Export Download button]',
        gap: 'Filtros DECORATIVOS — state não aplicado',
      },
      fourTabs: {
        audit: {
          layout: 'space-y-3 cards bordered (bg-red-50 se result==="failed")',
          cardContent: '[Date / Badge action / User name / details paragraph / Badge result success/failed]',
          pagination: 'HARDCODED "Página 1 de 250" / "Mostrando 1-50 de 12.456" — sem onClick',
        },
        system: {
          style: 'TERMINAL bg-slate-900 text-slate-100 font-mono',
          template: 'date slate-400 + Badge level + [service cyan] + message + details xs',
        },
        api: {
          layout: 'Table 6-col native HTML',
          cols: '[Data/Hora slate / Method Badge outline / endpoint font-mono / Status Badge condicional / Tempo center / Merchant]',
        },
        errors: {
          status: 'PLACEHOLDER VAZIO',
          content: '"Logs de erro filtrados seriam exibidos aqui."',
        },
      },
      knownGapsSystemLogs: [
        'Tab errors PLACEHOLDER vazio',
        'Filters decorativos (não aplicam)',
        'Pagination 100% fake',
        'Sem export real (botão sem onClick efetivo)',
        'Sem entity AuditLog/SystemLog/ApiLog (existe AuditLog no schema mas não usado)',
        'mocks só usam 3 dos 5 status codes definidos',
        'Filter "Módulo" tem 4 opts mas auditLogs.action tem 7+ tipos diferentes — não casa',
      ],
    },
  },

  technical: {
    fileLocations: {
      adminIntSettings: 'pages/AdminIntSettings.jsx (193 linhas)',
      adminIntUsers: 'pages/AdminIntUsers.jsx (278 linhas)',
      adminIntProfiles: 'pages/AdminIntProfiles.jsx (243 linhas)',
      adminIntGlobalRates: 'pages/AdminIntGlobalRates.jsx (206 linhas)',
      adminIntRiskParams: 'pages/AdminIntRiskParams.jsx (194 linhas)',
      adminIntIntegrations: 'pages/AdminIntIntegrations.jsx (232 linhas)',
      adminIntTemplates: 'pages/AdminIntTemplates.jsx (197 linhas)',
      adminIntSystemLogs: 'pages/AdminIntSystemLogs.jsx (222 linhas)',
    },
    menuOrderInLayoutJsx: {
      file: 'layout.jsx',
      block: 'getAdminInternoMenuItems(t) — id="admin" — linhas 343-362 (página inteira é "Administração")',
      submenuLines349_356: [
        { line: 349, page: 'AdminIntSettings', label: 't("menu_admin.general_settings")' },
        { line: 350, page: 'AdminIntUsers', label: 't("menu_admin.users")' },
        { line: 351, page: 'AdminIntProfiles', label: 't("menu_admin.profiles_permissions")' },
        { line: 352, page: 'AdminIntGlobalRates', label: 't("menu_admin.global_rates")' },
        { line: 353, page: 'AdminIntRiskParams', label: 't("menu_admin.risk_params")' },
        { line: 354, page: 'AdminIntIntegrations', label: 't("menu.integrations")' },
        { line: 355, page: 'AdminIntTemplates', label: 't("menu.templates")' },
        { line: 356, page: 'AdminIntSystemLogs', label: 't("menu_admin.system_logs")' },
      ],
      remainingPagesNotInThisDoc: '[357 AdminIntMCCs / 358 AdminIntMCCsAnalysis / 359 AdminIntPartners / 360 AdminIntFeePlans / 361 AdminIntAiAgents] — Entrega 10',
    },
    sharedDialogPlaceholderPattern: {
      pages: ['Settings', 'GlobalRates', 'RiskParams'],
      pattern: 'UM dialog `editModal` reutilizado para todas as ações de Edit — body placeholder fixo "Formulário de edição seria exibido aqui."',
      duplication: '3 páginas com Dialog idênticos — sem componente comum',
    },
    sharedSideDrawerInIntegrations: {
      page: 'Integrations',
      uses: 'SideDrawer em vez de Dialog (única na seção Admin Core)',
      gap: 'Inconsistência — outras 3 páginas com pattern similar (Settings/GlobalRates/RiskParams) usam Dialog',
    },
    sharedPageHeaderActionElementBug: {
      pages: ['Users', 'Profiles', 'Integrations', 'Templates'],
      bug: 'PageHeader prop `actionElement` em vez de `actions` — visualmente quebra Salvar/Novo button',
      consistencyGap: 'Settings/GlobalRates/RiskParams usam Section local com onEdit (não dependem do PageHeader actions)',
    },
    crossPageNavigation: {
      summary: 'NENHUMA — todas as 8 páginas são ilhas isoladas',
      gap1: 'Profiles tem "Usuários: X" mas NÃO LINKA para Users com filtro',
      gap2: 'Users tem Perfil "Admin/Gerente/etc" mas NÃO LINKA para Profiles',
      gap3: 'Integrations não navega para Webhooks/SystemLogs ao falhar',
      gap4: 'SystemLogs não filtra por User/Merchant clicável',
    },
    inconsistenciesNativeVsShadcn: {
      profiles_modal: 'usa <select> HTML nativo em vez de Select shadcn',
      users_modal: 'usa <input type=radio> nativo em vez de RadioGroup shadcn',
      riskParams_switches: 'Switch sem state controlado (apenas checked={static})',
      users_stats: 'grid-5 com <div> nativo em vez de Card shadcn',
    },
    duplicationsAcrossSection: {
      templates_vs_commTemplates: 'AdminIntTemplates DUPLICA AdminIntCommTemplates — 15 templates aqui vs 12 lá',
      systemLogs_vs_commLogs: 'AdminIntSystemLogs.errors tab placeholder vs AdminIntCommLogs com email logs',
      gap: 'Sem central de templates — fragmentação entre Comm e Admin',
    },
    knownGapsCrossSection: [
      '100% mock em todas as 8 páginas — zero entity, zero SDK',
      '3 páginas (Settings/GlobalRates/RiskParams) com Dialog placeholder reutilizado',
      'PageHeader prop `actionElement` em 4 páginas (bug)',
      'Profiles: viewModal SEMPRE mostra do analyst (gap CRÍTICO)',
      'Templates DUPLICA CommTemplates (15 vs 12 templates diferentes)',
      'SystemLogs.errors tab placeholder vazio',
      'Filtros decorativos em SystemLogs (state vazio)',
      'Pagination fake em SystemLogs.audit',
      'Inconsistência native HTML vs shadcn (radio nativo em Users / select nativo em Profiles)',
      'Switches sem state controlado em RiskParams',
      'GlobalRates: 6/7 cards têm valores hardcoded no JSX (só Crédito é array)',
      'Integrations: SideDrawer em vez de Dialog (inconsistência)',
      'Sem entity SystemSettings/Profile/RiskParams/Integration/Template/AuditLog usado',
      'Cross-page navigation ausente (Profiles ↔ Users, Integrations → Webhooks, etc)',
      'Breadcrumbs sem "Admin Interno" no início (todas as 8)',
      'Variáveis de templates hardcoded no helper text',
      'Sem versionamento em GlobalRates/Templates/Profiles',
      'Sem audit history das próprias mudanças (meta-auditoria)',
      'API Key type=password sem reveal/copy em Integrations',
      'Logs sem filtro por severity granular (debug/trace)',
    ],
  },
};

export default AdminIntAdministrationCoreDoc;