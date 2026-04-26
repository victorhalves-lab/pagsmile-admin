// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Plugins
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/Plugins.jsx (391 linhas).
// Cada plugin do catálogo (13 itens), cada categoria (4 filtros), cada card
// (instalado vs disponível), cada bloco da Sandbox Section — documentado.
// ============================================================================

export const PluginsDoc = {
  pageId: 'Plugins',
  pagePath: '/Plugins',
  module: 'Integrações',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Catálogo de plugins/conectores prontos para integrar PagSmile com plataformas externas — Search bar + 4 filtros de categoria (Todos / E-commerce / ERP-CRM / Automação), seção "Instalados" condicional (só renderiza se installedPlugins.length > 0) com cards verde-pastel, grid de 13 plugins disponíveis com cards (logo + features Badges + Instalar/Configurar buttons), e Sandbox Section com 3 mini-cards (Cartões de Teste, Pix de Teste, Webhooks de Teste).',

    whatIsAPlugin: {
      reasoning:
        'Plugin = pacote pré-configurado que conecta PagSmile a uma plataforma específica (WooCommerce, Shopify, Salesforce). Em vez do merchant ler docs e implementar via API, ele instala o plugin e acabou. Reduz time-to-integration de semanas para minutos.',
      vsCustomIntegration: 'Custom = implementar via API + Webhook (alta flexibilidade, alto trabalho). Plugin = pronto pra usar (baixa flexibilidade, zero trabalho)',
    },

    threeCategories: {
      ecommerce: '6 plugins — WooCommerce, Shopify, Magento 2, VTEX, Nuvemshop, PrestaShop',
      erp: '4 plugins — Salesforce, HubSpot, SAP, TOTVS',
      automation: '3 plugins — Zapier, Make (Integromat), n8n',
      total: '13 plugins disponíveis',
    },

    thirteenPlugins: {
      ecommercePlugins: [
        'woocommerce — Plugin para WordPress/WooCommerce — ["Checkout transparente", "Pix automático", "Webhooks"]',
        'shopify — App oficial — ["Instalação via App Store", "Sincronização automática"]',
        'magento — Magento 2 — ["Suporte a multi-store", "Checkout customizável"]',
        'vtex — VTEX IO — ["VTEX IO nativo", "SmartCheckout"]',
        'nuvemshop — Nuvemshop/Tiendanube — ["Instalação em 1 clique", "Suporte em português"]',
        'prestashop — PrestaShop — ["Multi-idioma", "Fácil instalação"]',
      ],
      erpPlugins: [
        'salesforce — Salesforce — ["Sync de clientes", "Histórico de pagamentos"]',
        'hubspot — HubSpot — ["Deals automáticos", "Timeline de pagamentos"]',
        'sap — SAP Business One — ["Sincronização contábil", "Conciliação automática"]',
        'totvs — TOTVS Protheus — ["Integração financeira", "Lançamentos automáticos"]',
      ],
      automationPlugins: [
        'zapier — Zapier — ["5000+ apps", "Triggers e Actions", "No-code"]',
        'make — Make (Integromat) — ["Cenários complexos", "Visual builder"]',
        'n8n — n8n — ["Open source", "Self-hosted", "Workflows"]',
      ],
    },

    threeSandboxCards: {
      cardsDeTest: 'Cartões de Teste — code "4111 1111 1111 1111 (Aprova)" gerado',
      pixDeTest: 'Pix de Teste — Button outline "Gerar QR de Teste" (gap: sem onClick)',
      webhooksDeTest: 'Webhooks de Teste — Button outline "Testar Webhook" (gap: sem onClick)',
    },

    coreCapabilities: [
      'PageHeader sem CTA (catálogo é browse-only)',
      'Search bar com Search icon embutido',
      '4 filtros de categoria como botões (active = bg-#00D26A)',
      'Seção "Instalados" condicional + cards bg-emerald-50/30 + Configure/External buttons',
      'Grid 1/2/3 cols responsivo de plugins disponíveis',
      'Cards de plugin: logo + name + Badge categoria + description + features Badges + Install/External buttons',
      'isInstalled detection: opacity-60 + button "Instalado" disabled (Check icon)',
      'External button abre documentation_url em nova aba',
      'Sandbox Section — gradient gray + Zap yellow icon + 3 mini-cards de teste',
      'Logos via URLs externas (Wikimedia + logovector.net)',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Plugins.jsx',
    totalLines: 391,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient (importados — useMutation/QueryClient sem uso)'],
      base44: 'base44.entities.Plugin (.filter({ is_installed: true }))',
      sharedComponents: ['PageHeader'],
      uiComponents: [
        'Button', 'Badge', 'Input',
        'Tabs+Trigger+Content (importados sem uso ativo)',
        'Card+CardContent+CardHeader+CardTitle+CardDescription',
        'Dialog stack (importado sem uso ativo)',
        'DropdownMenu stack (importado sem uso ativo)',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast'],
      lucideIcons: [
        'Plug — fallback de logo (4x4 ou 6x6 cinza)',
        'Search — input bar',
        'ExternalLink — botão abrir doc',
        'Download — botão Instalar',
        'Check — Badge "Instalado" + botão disabled',
        'Settings — Configurar (instalados)',
        'ShoppingCart — importado sem uso',
        'Building2 — importado sem uso',
        'Zap — Sandbox Section header (yellow)',
        'MoreHorizontal — importado sem uso',
        'ChevronRight — importado sem uso',
        'RefreshCw — importado sem uso',
        'AlertCircle — importado sem uso',
      ],
      constants: {
        pluginCategories: 'Array com 4: { id, label } — all, ecommerce, erp, automation',
        availablePlugins: 'Array com 13 objetos { id, name, description, category, logo, documentation_url, features }',
      },
    },

    componentState: {
      searchTerm: { initial: "''", purpose: 'Filtra por name/description' },
      selectedCategory: { initial: "'all'", purpose: 'Filtra por category' },
      selectedPlugin: { initial: 'null', purpose: 'Plugin sendo configurado (state criado mas SEM dialog renderizado — gap)' },
    },

    backendIntegration: {
      query: {
        queryKey: "['plugins']",
        queryFn: 'base44.entities.Plugin.filter({ is_installed: true })',
        gap: 'Não há ordering nem limit — pode ficar lento se muitos plugins instalados',
      },
    },

    derivedState: {
      installedIds: 'installedPlugins.map(p => p.plugin_id)',
      filteredPlugins: {
        chain: 'matchesSearch (case-insensitive em name/description) && matchesCategory',
      },
    },

    helperFunctions: {
      handleInstall: '(plugin) => toast.success(`Instalando ${plugin.name}...`) — gap: NÃO instala de fato',
      handleConfigure: '(plugin) => setSelectedPlugin(plugin) — gap: dialog não renderiza',
    },

    layout: {
      pageHeader: {
        title: '"Plugins e Conectores"',
        subtitle: '"Integre com suas plataformas favoritas"',
        breadcrumbs: [
          { label: 'Integrações', page: 'Integrations' },
          { label: 'Plugins', page: 'Plugins' },
        ],
        actions: 'NENHUM (catálogo é browse-only)',
      },

      searchAndFilters: {
        wrapper: 'flex flex-col sm:flex-row gap-4',
        searchBar: {
          wrapper: 'relative flex-1',
          icon: 'Search 4x4 gray-400 absolute left-3 top-1/2 -translate-y-1/2',
          input: 'pl-9 + placeholder "Buscar plugins..."',
        },
        categoryButtons: {
          wrapper: 'flex gap-2',
          renderEach: 'Button size="sm" — variant="default" se selectedCategory === id, senão "outline"',
          activeStyle: 'bg-#00D26A hover:bg-#00A854',
          categories: ['all=Todos', 'ecommerce=E-commerce', 'erp=ERP/CRM', 'automation=Automação'],
        },
      },

      installedSection: {
        renderIf: 'installedPlugins.length > 0',
        title: 'h3 text-lg font-semibold "Instalados"',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        cardStyle: 'border-emerald-200 bg-emerald-50/30',
        cardBody: {
          headerRow: {
            logoBox: 'w-12 h-12 bg-white rounded-lg p-2 border + img w-8 h-8 OR Plug fallback',
            titleRow: 'flex items-center justify-between: name + Badge bg-emerald-100 "Check + Instalado"',
            description: 'pluginInfo?.description (lookup em availablePlugins)',
          },
          actions: 'flex gap-2 mt-4: Button outline "Settings + Configurar" + Button outline icon "ExternalLink"',
        },
      },

      availableSection: {
        title: 'h3 dinâmico: selectedCategory==="all" ? "Todos os Plugins" : pluginCategories.find(c.id===selectedCategory)?.label',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        cardStyle: 'hover:shadow-md transition-shadow + opacity-60 se isInstalled',
        cardBody: {
          headerRow: {
            logoBox: 'w-12 h-12 bg-gray-50 rounded-lg p-2 border + img OR Plug fallback',
            titleRow: 'flex items-center gap-2: name + Badge outline categoria capitalize',
            description: 'plugin.description gray-500',
          },
          features: {
            wrapper: 'flex flex-wrap gap-1 mt-3',
            renderEach: 'Badge variant="secondary" text-xs font-normal',
            limit: 'plugin.features.slice(0, 3) — max 3 features visíveis',
          },
          actions: {
            wrapper: 'flex gap-2 mt-4',
            primaryButton: {
              ifInstalled: 'Button outline disabled flex-1 "Check + Instalado"',
              ifNotInstalled: 'Button bg-#00D26A flex-1 "Download + Instalar" → handleInstall(plugin)',
            },
            externalButton: 'Button outline icon ExternalLink → window.open(documentation_url, "_blank")',
          },
        },
      },

      sandboxSection: {
        wrapper: 'Card bg-gradient-to-br from-gray-50 to-gray-100',
        header: {
          icon: 'Zap 5x5 yellow-600 (bg-yellow-100 p-2.5)',
          title: 'CardTitle "Ambiente Sandbox"',
          description: 'CardDescription "Teste suas integrações sem processar transações reais"',
        },
        grid: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        miniCards: [
          {
            title: 'Cartões de Teste',
            sub: 'Use números especiais para simular cenários',
            content: 'code bg-gray-100 px-2 py-1 rounded block "4111 1111 1111 1111 (Aprova)"',
          },
          {
            title: 'Pix de Teste',
            sub: 'Simule pagamentos Pix instantâneos',
            content: 'Button outline sm "Gerar QR de Teste" — gap: sem onClick',
          },
          {
            title: 'Webhooks de Teste',
            sub: 'Dispare eventos de teste',
            content: 'Button outline sm "Testar Webhook" — gap: sem onClick',
          },
        ],
      },
    },

    knownGaps: [
      'useMutation, useQueryClient, Tabs/Tabs*, Dialog/Dialog*, DropdownMenu/DropdownMenu* importados sem uso',
      'ShoppingCart, Building2, MoreHorizontal, ChevronRight, RefreshCw, AlertCircle (lucide) sem uso',
      'handleInstall apenas dispara toast — não instala de verdade',
      'handleConfigure setea selectedPlugin mas não há Dialog renderizado',
      '"Configurar" do bloco Instalados sem onClick',
      'External button do bloco Instalados sem onClick (deveria abrir documentation_url)',
      'Pix de Teste e Webhooks de Teste sem onClick',
      'Plugins instalados não renderizam features do catálogo (apenas description)',
      'Lookup pluginInfo via find pode falhar se id não existe — sem fallback',
      'Logos hospedadas externamente (Wikimedia/logovector) — risco de quebra futura',
      'Sem skeleton loading ao buscar installedPlugins',
      'Sem paginação — se houver 50+ plugins, vai virar scroll infinito',
      'Sem ordenação (alphabetical, popularity, etc.)',
      'Sem reviews/ratings dos plugins',
      'Sem versão de cada plugin visível',
      'Sandbox Section ocupa muito espaço para 3 mini-cards quase decorativos',
    ],

    relationshipsToOtherPages: {
      apiKeys: '/ApiKeys — pode ser pre-requisito para usar plugins',
      webhooks: '/Webhooks — alguns plugins (Zapier, Make, n8n) precisam de webhooks configurados',
      adminIntIntegrations: '/AdminIntIntegrations — visão admin interno',
      adminIntIntegrationDetail: '/AdminIntIntegrationDetail — detalhe individual de cada integração',
      checkoutBuilder: '/CheckoutBuilder — alguns plugins instalam checkouts customizados',
    },
  },
};

export default PluginsDoc;