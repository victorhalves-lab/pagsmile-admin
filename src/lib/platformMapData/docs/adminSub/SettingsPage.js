// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /SettingsPage
// Fidelidade absoluta a pages/SettingsPage.jsx (704 linhas).
// 7 sections lateralizadas, cada uma com inputs/switches/selects específicos.
// ============================================================================

export const SettingsPageDoc = {
  pageId: 'SettingsPage',
  pagePath: '/SettingsPage',
  module: 'Configurações & Suporte',
  parentPage: null,

  explainer: {
    oneLiner:
      'Centro de configurações da conta merchant — Layout split: sidebar lateral com 7 sections (Dados da Conta / Usuários e Permissões / Segurança / Contas Bancárias / Métodos de Pagamento / Notificações / Preferências) e content area que troca conforme activeSection. Cada section tem inputs, switches e selects organizados por subsessões com Separator. SideDrawer "Convidar Usuário" com 3 campos (nome, email, role).',

    sevenSections: {
      account: { icon: 'Building2', label: 'Dados da Conta', subsections: ['Dados Cadastrais (Avatar + 6 inputs)', 'Endereço (4 inputs)'] },
      users: { icon: 'Users', label: 'Usuários e Permissões', subsections: ['Lista 4 usuários mock', 'Papéis/Roles 4 cards'] },
      security: { icon: 'Shield', label: 'Segurança', subsections: ['Autenticação (2FA/Método/Timeout)', 'Alterar Senha (3 inputs)', 'Log de Auditoria (botão)', 'Histórico de Login (3 entries)'] },
      bank: { icon: 'Landmark', label: 'Contas Bancárias', subsections: ['Lista 2 contas mock + Alert validação'] },
      payments: { icon: 'CreditCard', label: 'Métodos de Pagamento', subsections: ['Cartão (Bandeiras/Parcelamento/Soft Descriptor)', 'Pix (QR Code Validade/Desconto)'] },
      notifications: { icon: 'Bell', label: 'Notificações', subsections: ['Alertas por E-mail (6 toggles)', 'Resumo Periódico (frequência)'] },
      preferences: { icon: 'Palette', label: 'Preferências', subsections: ['Fuso Horário/Formato Data/Idioma/Moeda'] },
    },

    fourMockUsers: [
      'João Silva (joao@empresa.com) — Admin — active — 2026-01-27 14:30',
      'Maria Santos (maria@empresa.com) — Financeiro — active — 2026-01-27 10:15',
      'Pedro Costa (pedro@empresa.com) — Operações — pending — Nunca acessou',
      'Ana Oliveira (ana@empresa.com) — Visualizador — active — 2026-01-26 16:45',
    ],

    fourRolesDefined: {
      admin: 'Administrador — Acesso total ao sistema',
      financial: 'Financeiro — Acesso a finanças, saques e relatórios',
      operations: 'Operações — Acesso a transações e disputas',
      viewer: 'Visualizador — Apenas visualização, sem edição',
    },

    twoMockBankAccounts: [
      'Conta Principal (Itaú Ag 1234 Cc 12345-6 checking) — isPrimary: true → Badge "Principal"',
      'Conta Pix (Nubank pix=financeiro@empresa.com) — isPrimary: false → permite Trash2',
    ],

    sixEmailAlertToggles: [
      'Nova transação aprovada (default: true)',
      'Transação recusada (default: true)',
      'Novo chargeback (default: true)',
      'Saque concluído (default: true)',
      'Nova assinatura (default: false)',
      'Assinatura cancelada (default: true)',
    ],

    threeMethodsOf2FA: 'Google Auth (totp default) / SMS / E-mail',
    fourSessionTimeoutOptions: '15 min / 30 min (default) / 1 hora / 4 horas',
    threeRecentLogins: '27/01 14:30 (Chrome/Win), 27/01 10:15 (Safari/macOS), 26/01 18:45 (Chrome/Android) — todos success',

    sideDrawerInviteUser: 'SideDrawer "Convidar Usuário" com 3 campos (Nome/E-mail/Papel) — handleInvite apenas dispara toast.success',
  },

  technical: {
    fileLocation: 'pages/SettingsPage.jsx',
    totalLines: 704,

    imports: {
      react: ['useState'],
      reactQuery: ['useMutation', 'useQueryClient (importados sem uso)'],
      base44: 'base44 importado mas SEM uso real',
      uiComponents: ['Button', 'Input', 'Label', 'Switch', 'Tabs stack (importado sem uso)', 'Avatar+AvatarFallback+AvatarImage', 'Select stack', 'Separator', 'Badge', 'Alert+AlertDescription'],
      sharedComponents: ['PageHeader', 'SideDrawer'],
      utilities: ['cn', 'sonner toast'],
      lucideIcons: 'Settings (sem uso), User (sem uso), Building2, CreditCard, Bell, Shield, Palette, Globe (sem uso), Users, Key (sem uso), ChevronRight (sem uso), Upload, Save, Plus, Trash2, Edit, Check, X (sem uso), History, LogOut (sem uso), Landmark',
    },

    componentState: {
      activeSection: { initial: "'account'", purpose: 'Section ativa do sidebar — 1 de 7 valores' },
      isInviteOpen: { initial: 'false', purpose: 'Toggle SideDrawer Convidar Usuário' },
      inviteData: { initial: '{ email: "", name: "", role: "viewer" }', purpose: 'Form do drawer' },
    },

    backendIntegration: 'NENHUMA — todos dados HARDCODED ou inputs com defaultValue',

    constants: {
      sections: '7 objetos { id, label, icon }',
      mockUsers: '4 objetos { name, email, role, status, lastAccess }',
      mockBankAccounts: '2 objetos diferenciados (checking vs pix)',
      roles: '4 objetos { id, label, description }',
    },

    helperFunctions: {
      handleInvite: '() => toast.success(`Convite enviado para ${email}`) + close drawer + reset form — gap: NÃO envia convite real (não usa base44.users.inviteUser)',
    },

    layout: {
      pageHeader: {
        title: '"Configurações"',
        subtitle: '"Gerencie as configurações da sua conta"',
        breadcrumbs: [{ label: 'Configurações', page: 'SettingsPage' }],
        actions: 'NENHUM',
      },

      mainLayout: {
        wrapper: 'flex flex-col lg:flex-row gap-6',
        sidebar: {
          width: 'lg:w-64 flex-shrink-0',
          card: 'bg-white rounded-xl border p-2',
          renderEachSection: 'button w-full px-3 py-2.5 rounded-lg — active=bg-#00D26A/10 text-#00D26A — icon 5x5 + label',
        },
        content: 'flex-1 + bg-white rounded-xl border p-6 — switch baseado em activeSection',
      },

      sectionAccount: {
        renderIf: 'activeSection === "account"',
        subsection1: {
          title: 'h3 "Dados Cadastrais"',
          avatarBlock: 'Avatar h-20 w-20 + AvatarFallback bg-#101F3E "PS" + Button outline "Upload + Alterar Logo" + p "PNG, JPG até 2MB"',
          formGrid: 'grid 1/2 cols gap-4 — 6 campos:',
          fields: [
            'Razão Social (default "PagSmile Sub Ltda")',
            'Nome Fantasia (default "PagSmile Sub")',
            'CNPJ (default "12.345.678/0001-90") DISABLED',
            'E-mail de Contato (default "contato@pagsmile.com")',
            'Telefone (default "(11) 99999-9999")',
            'Website (default "https://pagsmile.com")',
          ],
        },
        subsection2: {
          title: 'h3 "Endereço"',
          fields: [
            'Logradouro col-span-2 (default "Av. Paulista, 1000")',
            'Cidade (default "São Paulo")',
            'Estado (default "SP")',
            'CEP (default "01310-100")',
          ],
        },
        saveButton: 'Button bg-#00D26A right + Save + "Salvar Alterações" — gap: SEM onClick',
      },

      sectionUsers: {
        renderIf: 'activeSection === "users"',
        header: 'h3 "Usuários e Permissões" + sub "Gerencie quem tem acesso ao admin" + Button bg-#00D26A "Plus + Convidar Usuário" → setIsInviteOpen(true)',
        usersList: {
          renderEach: {
            wrapper: 'p-4 border rounded-lg hover:bg-gray-50',
            left: 'Avatar + AvatarFallback bg-#101F3E iniciais + name + email',
            right: 'Badge outline role + status pill (active=emerald, pending=yellow) + last access + Button ghost icon Edit',
          },
        },
        rolesSection: {
          title: 'h3 "Papéis (Roles)"',
          grid: 'grid 1/2 cols gap-4',
          renderEach: 'p-4 border rounded-lg + label + Button ghost "Editar" + description',
        },
      },

      sectionBank: {
        renderIf: 'activeSection === "bank"',
        header: 'h3 "Contas Bancárias" + sub "Contas para recebimento de saques" + Button bg-#00D26A "Plus + Adicionar Conta"',
        accountsList: {
          renderEach: {
            wrapper: 'p-4 border rounded-lg',
            left: 'iconBox p-3 bg-gray-100 + Landmark 5x5 + name + Badge "Principal" (se isPrimary) + display ("Pix: {pix}" OR "{bank} • Ag {agency} • Cc {account}")',
            right: 'Button ghost Edit + Button ghost Trash2 (apenas se !isPrimary)',
          },
        },
        alert: 'Shield + AlertDescription "Novas contas passam por validação de titularidade antes de serem ativadas"',
      },

      sectionSecurity: {
        renderIf: 'activeSection === "security"',
        subsection1: {
          title: 'h3 "Autenticação"',
          rows: [
            { label: '2FA', sub: 'Adicione uma camada extra de segurança', control: 'Switch defaultChecked' },
            { label: 'Método de 2FA', sub: 'Como você deseja receber o código', control: 'Select w-40 [Google Auth (totp default)/SMS/E-mail]' },
            { label: 'Timeout de Sessão', sub: 'Tempo de inatividade para logout automático', control: 'Select w-32 [15/30 default/60/240 minutos]' },
          ],
        },
        subsection2: {
          title: 'h3 "Alterar Senha"',
          fields: [
            'Senha Atual (Input password)',
            'Nova Senha (Input password) + help "Mínimo 8 caracteres, 1 maiúscula, 1 número"',
            'Confirmar Nova Senha (Input password)',
            'Button bg-#00D26A "Alterar Senha"',
          ],
          gap: 'SEM validação real + SEM submit handler',
        },
        subsection3: 'h3 "Log de Auditoria" + Button outline "History + Ver Log de Auditoria" — gap: sem onClick',
        subsection4: {
          title: 'h3 "Histórico de Login"',
          renderEach: 'p-3 bg-gray-50 rounded-lg — Check emerald + date + ip + device',
          mockEntries: '3 entradas hardcoded (27/01 14:30, 27/01 10:15, 26/01 18:45)',
        },
      },

      sectionPayments: {
        renderIf: 'activeSection === "payments"',
        subsection1: {
          title: 'h3 "Cartão de Crédito"',
          rows: [
            { label: 'Bandeiras Aceitas', sub: 'Visa, Mastercard, Elo, Amex, Hipercard', control: 'Button outline sm "Configurar"' },
            { label: 'Parcelamento Máximo', sub: 'Número máximo de parcelas', control: 'Select w-24 [1x...12x default 12]' },
            { label: 'Soft Descriptor', sub: 'Nome exibido na fatura do cliente', control: 'Input w-48 default "PAGSMILE*"' },
          ],
        },
        subsection2: {
          title: 'h3 "Pix"',
          rows: [
            { label: 'Validade do QR Code', sub: 'Tempo para expiração do código', control: 'Select w-32 [15/30 default/60/1440 minutos]' },
            { label: 'Desconto Pix', sub: 'Percentual de desconto para pagamento via Pix', control: 'Input w-20 default "5%"' },
          ],
        },
      },

      sectionNotifications: {
        renderIf: 'activeSection === "notifications"',
        subsection1: {
          title: 'h3 "Alertas por E-mail"',
          renderEach: 'p-3 border rounded-lg + label + Switch defaultChecked',
          items: '6 toggles enumerados acima',
        },
        subsection2: 'h3 "Resumo Periódico" + linha com label/sub + Select w-32 [Diário default/Semanal/Mensal/Nunca]',
      },

      sectionPreferences: {
        renderIf: 'activeSection === "preferences"',
        subsection: {
          title: 'h3 "Preferências de Exibição"',
          rows: [
            { label: 'Fuso Horário', sub: 'Para exibição de datas e horários', control: 'Select w-48 [America/Sao_Paulo default GMT-3 / America/New_York GMT-5 / Europe/London GMT+0]' },
            { label: 'Formato de Data', sub: 'Como as datas serão exibidas', control: 'Select w-36 [DD/MM/YYYY default / MM/DD/YYYY / YYYY-MM-DD]' },
            { label: 'Idioma', sub: 'Idioma da interface', control: 'Select w-36 [Português (BR) default / English (US) / Español]' },
            { label: 'Moeda Padrão', sub: 'Moeda para exibição de valores', control: 'Select w-24 [BRL default / USD / EUR]' },
          ],
        },
      },

      inviteSideDrawer: {
        component: 'SideDrawer',
        props: {
          open: 'isInviteOpen',
          title: '"Convidar Usuário"',
          description: '"Envie um convite para adicionar um novo usuário"',
          icon: 'Plus',
        },
        body: {
          field1: 'Nome Completo (Input controlado)',
          field2: 'E-mail (Input type=email controlado)',
          field3: 'Papel/Role (Select com 4 roles — cada item com label + description em texto pequeno)',
        },
        footer: 'Button outline Cancelar + Button bg-#00D26A "Enviar Convite" → handleInvite (toast only)',
      },
    },

    knownGaps: [
      'TODOS os dados são MOCK — NENHUMA persistência real (mockUsers, mockBankAccounts, defaultValues hardcoded)',
      'Settings, User, Globe, Key, ChevronRight, X, LogOut (lucide), Tabs/TabsContent (UI), useMutation/useQueryClient (RQ), base44 (sdk) importados sem uso',
      'handleInvite NÃO chama base44.users.inviteUser — só dispara toast (real existe na SDK)',
      'Botão "Salvar Alterações" da seção account SEM onClick',
      'Botão "Alterar Senha" SEM submit handler',
      'Botão "Adicionar Conta" SEM onClick',
      'Botões Edit/Trash2 das contas SEM onClick',
      'Botão "Configurar" das bandeiras SEM onClick',
      'Botão "Ver Log de Auditoria" SEM onClick',
      'Botão "Editar" dos roles SEM onClick',
      'Switches do 2FA/notificações SEM onCheckedChange (apenas defaultChecked)',
      'Selects sem onValueChange — não persistem mudanças',
      'CNPJ com disabled mas resto deveria estar bloqueado (compliance)',
      'Sem validação de form em nenhum lugar (CEP, telefone, email, senhas)',
      'Sem upload real do logo (botão Upload sem handler)',
      'Sem modal de edição de usuário (botão Edit dos users sem onClick)',
      'Sem modal de edição de role (botão Editar dos roles sem onClick)',
      'Histórico de Login + Audit Log são hardcoded',
      'Sem revogação de sessões ativas',
      'Sem confirmação para tornar conta primary diferente',
    ],

    relationshipsToOtherPages: {
      diaCopilot: '/DIACopilot — botão "Configurar" do header do DIA aponta para /SettingsPage',
      withdrawals: '/Withdrawals — usa as Contas Bancárias cadastradas aqui',
      apiKeys: '/ApiKeys — gestão de chaves de API (separada)',
      webhooks: '/Webhooks — endpoints de webhook (separada)',
      adminIntUsers: '/AdminIntUsers — visão admin interno',
      adminIntProfiles: '/AdminIntProfiles — gestão admin de perfis/roles',
      adminIntSettings: '/AdminIntSettings — settings admin interno',
    },
  },
};

export default SettingsPageDoc;