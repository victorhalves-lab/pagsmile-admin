// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /ApiKeys
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/ApiKeys.jsx (375 linhas).
// Cada coluna, cada item do dropdown, cada estado do drawer (modo create vs
// "chave revelada"), cada ícone colorido, cada validação — documentado.
// ============================================================================

export const ApiKeysDoc = {
  pageId: 'ApiKeys',
  pagePath: '/ApiKeys',
  module: 'Integrações',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Painel de gestão de credenciais de API — DataTable com 6 colunas (Nome com ícone color-coded por ambiente, Chave mascarada com toggle Eye/EyeOff + Copy, Status, Último Uso, Criada em, Ações), Alert de Segurança permanente, e SideDrawer com DOIS MODOS dinâmicos: (1) formulário criação (Nome + Ambiente + Tipo de Chave) → (2) chave revelada UMA ÚNICA VEZ com aviso crítico de "copie agora ou perderá".',

    securityFirstDesign: {
      reasoning:
        'Chaves API são CREDENCIAIS DE PRODUÇÃO — vazamento permite operar em nome do merchant. Toda a UI é desenhada para forçar boas práticas: chave SECRET nunca aparece full no listing (sempre mascarada), revelação completa exige clique explícito (toggle Eye), e após criação a chave full é mostrada UMA ÚNICA VEZ.',
      neverDisplayedAfterCreation:
        'Backend NUNCA retorna a chave secreta completa após criação inicial — sistema só guarda hash. Por isso o aviso amarelo crítico "Esta é a única vez que você verá esta chave completa".',
    },

    twoEnvironments: {
      production: { color: 'emerald (#10b981)', label: 'Produção', usage: 'Transações reais com dinheiro de verdade' },
      sandbox: { color: 'yellow (#f59e0b)', label: 'Sandbox (Teste)', usage: 'Desenvolvimento e testes sem cobrar' },
      keyIdPrefix: 'production → "key_live_..." | sandbox → "key_test_..."',
    },

    twoKeyTypes: {
      secret: {
        label: 'Secret Key (Backend)',
        usage: 'Use apenas no backend. Nunca exponha no frontend.',
        sensitivity: 'ALTA — credencial completa que pode criar/cancelar/refundar transações',
      },
      public: {
        label: 'Public Key (Frontend)',
        usage: 'Pode ser usada no frontend para operações limitadas.',
        sensitivity: 'BAIXA — apenas tokenização de cartão e operações read-only',
      },
    },

    sixColumnsTable: {
      col1: 'Nome — quadrado 10x10 color-coded (emerald=production, yellow=sandbox) + Key icon + nome + subtítulo "Produção • Secret"',
      col2: 'Chave — code mascarado (12 chars + "..." + 4 chars) + Eye/EyeOff toggle + Copy button',
      col3: 'Status — StatusBadge (active/revoked)',
      col4: 'Último Uso — format dd/MM/yyyy HH:mm ou "Nunca"',
      col5: 'Criada em — format dd/MM/yyyy ou "N/A"',
      col6: 'Ações — DropdownMenu (Copiar chave / Revogar)',
    },

    twoDrawerModes: {
      mode1Create: {
        title: 'Nova Chave de API',
        description: 'Crie uma nova chave para integrar seus sistemas',
        body: '3 fields: Nome (input) + Ambiente (Select com bolinha colorida) + Tipo de Chave (Select)',
        footer: 'Cancelar + Criar Chave (verde)',
      },
      mode2Revealed: {
        title: 'Chave Criada!',
        description: 'Copie sua chave agora. Ela não será exibida novamente.',
        body: 'Alert amarelo crítico + Code com chave completa + Botão Copy',
        footer: 'NULL — em vez disso, há botão "Concluído" full-width verde no body',
      },
      transitionTrigger: 'createMutation.onSuccess seta createdKey={result} — re-renderiza drawer no modo 2',
    },

    coreCapabilities: [
      'PageHeader com CTA verde "Gerar Chave"',
      'Alert permanente de segurança (amarelo) sempre visível',
      'DataTable com searchable + pagination 25',
      'Mascaramento automático key_id (substring 0,12 + "..." + last 4)',
      'Toggle Eye/EyeOff por linha (state local showSecret={[id]: bool})',
      'Botão Copy com toast.success "Copiado!"',
      'SideDrawer com 2 modos dinâmicos via createdKey state',
      'Generation pseudo-random: Math.random().toString(36).substring(2, 15)',
      'i18n keys: integrations.api_keys, integrations.title, integrations.generate_key, menu.integrations',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/ApiKeys.jsx',
    totalLines: 375,

    imports: {
      react: ['useState'],
      i18n: 'useTranslation',
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.ApiKey',
      sharedComponents: ['PageHeader', 'DataTable', 'StatusBadge', 'SideDrawer'],
      uiComponents: [
        'Button', 'Badge', 'Input', 'Label',
        'DropdownMenu stack', 'Select stack',
        'Alert+AlertDescription',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast', 'date-fns format', 'date-fns/locale ptBR'],
      lucideIcons: [
        'Key — header drawer + col1 da tabela',
        'Plus — header CTA',
        'Eye — toggle revelar chave',
        'EyeOff — toggle mascarar chave',
        'MoreHorizontal — DropdownMenu trigger',
        'Copy — Copy button + DropdownMenu item',
        'Trash2 — Revogar (red)',
        'Shield — Alert de segurança (yellow-600)',
        'AlertTriangle — Alert mode2 (yellow-600)',
      ],
    },

    componentState: {
      isCreateOpen: { initial: 'false', purpose: 'Toggle do SideDrawer' },
      showSecret: { initial: '{}', purpose: 'Object map por id: {[keyId]: bool} — controla visibility por linha' },
      newKey: {
        initial: '{ name: "", type: "production", key_type: "secret" }',
        purpose: 'Form state durante criação',
      },
      createdKey: { initial: 'null', purpose: 'Quando preenchido, drawer entra no MODO 2 (chave revelada)' },
    },

    backendIntegration: {
      query: {
        queryKey: "['api-keys']",
        queryFn: 'base44.entities.ApiKey.list("-created_date", 50)',
      },
      createMutation: {
        mutationFn: '(data) => Generation inline + ApiKey.create',
        keyIdGeneration: '`key_${type === "production" ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`',
        defaultStatus: 'active',
        onSuccess: '(result) => invalidate + setCreatedKey(result) + reset newKey',
        gap: 'createMutation NÃO tem onError — falhas silenciosas',
      },
    },

    helperFunctions: {
      copyToClipboard: '(text) => navigator.clipboard.writeText + toast.success "Copiado!"',
      toggleShowSecret: '(id) => setShowSecret(prev => ({ ...prev, [id]: !prev[id] }))',
      maskKey: {
        signature: '(key) => string',
        formula: 'key.substring(0, 12) + "..." + key.substring(key.length - 4)',
        example: '"key_live_abc123..." → "key_live_abc..." + "...xyz9"',
        nullSafety: 'if (!key) return ""',
      },
      handleCreate: 'if (!newKey.name) toast.error("Nome é obrigatório") + return; senão createMutation.mutate(newKey)',
    },

    layout: {
      pageHeader: {
        title: 't("integrations.api_keys")',
        subtitle: 't("integrations.title")',
        breadcrumbs: [
          { label: 't("menu.integrations")', page: 'Integrations' },
          { label: 't("integrations.api_keys")', page: 'ApiKeys' },
        ],
        actions: 'Button bg-#00D26A + Plus + t("integrations.generate_key") → setIsCreateOpen(true)',
      },

      securityWarning: {
        wrapper: 'Alert bg-yellow-50 border-yellow-200',
        icon: 'Shield 4x4 yellow-600',
        text: 'Nunca compartilhe suas chaves secretas. Use chaves de produção apenas em ambientes seguros e chaves de sandbox para desenvolvimento e testes.',
        textColor: 'yellow-800',
      },

      dataTable: {
        component: 'DataTable',
        props: {
          columns: '6 columns array',
          data: 'apiKeys',
          loading: 'isLoading',
          searchable: true,
          searchPlaceholder: '"Buscar por nome..."',
          pagination: true,
          pageSize: 25,
          emptyMessage: '"Nenhuma chave de API criada"',
        },
        columns: [
          {
            key: 'name',
            render: {
              wrapper: 'flex items-center gap-3',
              colorBox: 'w-10 h-10 rounded-lg color-adaptive: production=bg-emerald-100, sandbox=bg-yellow-100',
              icon: 'Key 5x5: production=text-emerald-600, sandbox=text-yellow-600',
              text: 'value (name) + "Produção/Sandbox • Secret/Public" gray-500',
            },
          },
          {
            key: 'key_id',
            render: {
              wrapper: 'flex items-center gap-2',
              code: 'bg-gray-100 px-2 py-1 rounded font-mono — showSecret[id] ? value : maskKey(value)',
              eyeButton: 'ghost icon h-7 w-7 — toggle Eye/EyeOff',
              copyButton: 'ghost icon h-7 w-7 — Copy',
            },
          },
          { key: 'status', render: 'StatusBadge component' },
          { key: 'last_used_at', render: 'format dd/MM/yyyy HH:mm ou "Nunca"' },
          { key: 'created_date', render: 'format dd/MM/yyyy ou "N/A"' },
          {
            key: 'actions',
            render: {
              dropdown: [
                'Copy + "Copiar chave" → copyToClipboard(row.key_id)',
                'Trash2 + "Revogar" — text-red-600 (gap: SEM onClick — não revoga)',
              ],
            },
          },
        ],
      },

      sideDrawerMode1Create: {
        renderIf: '!createdKey',
        title: '"Nova Chave de API"',
        description: '"Crie uma nova chave para integrar seus sistemas"',
        icon: 'Key',
        body: {
          field1: { label: 'Nome da Chave *', placeholder: 'Ex: Sistema Principal', input: 'native Input' },
          field2: {
            label: 'Ambiente',
            select: 'Select com 2 opções, cada uma com bolinha colorida 2x2 + label',
            options: [
              'production: bg-emerald-500 dot + "Produção"',
              'sandbox: bg-yellow-500 dot + "Sandbox (Teste)"',
            ],
          },
          field3: {
            label: 'Tipo de Chave',
            select: 'Select com secret/public',
            helpText: {
              secret: '"Use apenas no backend. Nunca exponha no frontend."',
              public: '"Pode ser usada no frontend para operações limitadas."',
            },
          },
        },
        footer: 'flex justify-end gap-3: Button outline "Cancelar" + Button verde "Criar Chave" (label "Criando..." se isPending)',
      },

      sideDrawerMode2Revealed: {
        renderIf: '!!createdKey',
        title: '"Chave Criada!"',
        description: '"Copie sua chave agora. Ela não será exibida novamente."',
        icon: 'Key',
        body: {
          alert: {
            wrapper: 'Alert bg-yellow-50 border-yellow-200',
            icon: 'AlertTriangle 4x4 yellow-600',
            text: 'Atenção: Esta é a única vez que você verá esta chave completa. Copie e guarde em local seguro.',
          },
          revealedKey: {
            label: '"Sua Chave"',
            wrapper: 'flex items-center gap-2',
            code: 'flex-1 bg-gray-100 px-3 py-2 rounded font-mono break-all — createdKey.key_id (FULL UNMASKED)',
            copyButton: 'Button outline icon — Copy',
          },
          doneButton: {
            wrapper: 'NÃO está no footer — está no body',
            style: 'Button w-full bg-#00D26A',
            label: 'Concluído',
            onClick: 'setIsCreateOpen(false) + setCreatedKey(null) — fecha e reseta para próximo create',
          },
        },
        footer: 'NULL — sem botões no footer (Concluído está no body)',
      },

      sideDrawerOnOpenChange: {
        logic: '(open) => { setIsCreateOpen(open); if (!open) setCreatedKey(null); }',
        purpose: 'Garante que ao fechar (ESC/overlay), o createdKey é limpo — próximo open volta no Mode 1 limpo',
      },
    },

    knownGaps: [
      'Item "Revogar" do dropdown SEM onClick — não revoga',
      'createMutation SEM onError — falhas silenciosas',
      'Nenhuma proteção contra criar 2 chaves com mesmo nome',
      'Nenhum filtro por type ou key_type',
      'Sem badge contador de chaves total/produção/sandbox',
      'Sem permissions (campo permissions existe no schema mas UI não permite definir)',
      'Sem ip_whitelist (campo existe no schema mas UI não permite definir)',
      'Sem rotação de chaves (regenerar mantendo o id)',
      'Sem log de uso por chave (last_used_at é único campo)',
      'Geração de key usa Math.random — em produção real deve ser server-side com crypto seguro',
      'Após criar, a "key_id" exibida é o próprio identifier do record (não uma chave separada bcrypt)',
      'Sem confirmação dupla na revogação (quando implementada)',
      'Maskey pode falhar em chaves curtas (<16 chars) — não há proteção',
      'Sem export/import de chaves',
    ],

    relationshipsToOtherPages: {
      webhooks: '/Webhooks — irmão de integrações',
      plugins: '/Plugins — irmão de integrações',
      settingsPage: '/SettingsPage — onde configurações gerais ficam',
      adminIntIntegrations: '/AdminIntIntegrations — visão admin interno (audit de uso de chaves cross-merchants)',
    },
  },
};

export default ApiKeysDoc;