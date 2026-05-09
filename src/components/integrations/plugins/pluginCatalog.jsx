// Plugin catalog enriched with BR-native plugins (the strategic differential vs Stripe)
// Each plugin has: id, name, category, description, features, logo (or emoji fallback),
// rating, installs (active install count), last_updated, pricing, documentation_url, is_br

export const pluginCategories = [
  { id: 'all', label: 'Todos', icon: '🌐' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { id: 'erp', label: 'ERP/CRM', icon: '🏢' },
  { id: 'automation', label: 'Automação', icon: '⚡' },
  { id: 'fiscal', label: 'Notas Fiscais', icon: '📄' },
  { id: 'logistics', label: 'Logística', icon: '📦' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'support', label: 'Atendimento', icon: '🎧' },
  { id: 'bi', label: 'BI / Analytics', icon: '📊' },
  { id: 'antifraud', label: 'Antifraude', icon: '🛡️' },
  { id: 'marketplace', label: 'Marketplaces', icon: '🏪' },
];

export const pluginCatalog = [
  // E-commerce (existing - kept verbatim + enriched)
  { id: 'woocommerce', name: 'WooCommerce', category: 'ecommerce', description: 'Plugin para WordPress/WooCommerce', features: ['Checkout transparente', 'Pix automático', 'Webhooks'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/WooCommerce_logo.svg/1200px-WooCommerce_logo.svg.png', emoji: '🛍️', rating: 4.8, reviews: 312, installs: 5840, last_updated: '2026-04-22', pricing: 'free', is_verified: true, is_popular: true, documentation_url: 'https://docs.pagsmile.com/woocommerce' },
  { id: 'shopify', name: 'Shopify', category: 'ecommerce', description: 'App oficial para Shopify', features: ['Instalação via App Store', 'Sincronização automática'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png', emoji: '🛒', rating: 4.7, reviews: 198, installs: 2410, last_updated: '2026-04-15', pricing: 'free', is_verified: true, documentation_url: 'https://docs.pagsmile.com/shopify' },
  { id: 'magento', name: 'Magento 2', category: 'ecommerce', description: 'Extensão para Magento 2', features: ['Suporte a multi-store', 'Checkout customizável'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Magento_Logo.svg/2560px-Magento_Logo.svg.png', emoji: '🏬', rating: 4.5, reviews: 87, installs: 920, last_updated: '2026-03-30', pricing: 'free', is_verified: true, documentation_url: 'https://docs.pagsmile.com/magento' },
  { id: 'vtex', name: 'VTEX', category: 'ecommerce', description: 'Conector nativo para VTEX IO', features: ['VTEX IO nativo', 'SmartCheckout'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/VTEX_Logo.svg/2560px-VTEX_Logo.svg.png', emoji: '🛍️', rating: 4.6, reviews: 124, installs: 1200, last_updated: '2026-04-18', pricing: 'free', is_verified: true, is_br: true, documentation_url: 'https://docs.pagsmile.com/vtex' },
  { id: 'nuvemshop', name: 'Nuvemshop', category: 'ecommerce', description: 'App para Nuvemshop/Tiendanube', features: ['Instalação em 1 clique', 'Suporte em português'], logo: 'https://logovector.net/wp-content/uploads/2023/04/Nuvemshop-Logo.png', emoji: '☁️', rating: 4.9, reviews: 245, installs: 3120, last_updated: '2026-05-01', pricing: 'free', is_verified: true, is_br: true, is_popular: true, documentation_url: 'https://docs.pagsmile.com/nuvemshop' },
  { id: 'prestashop', name: 'PrestaShop', category: 'ecommerce', description: 'Módulo para PrestaShop', features: ['Multi-idioma', 'Fácil instalação'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/PrestaShop_Logo.svg/2560px-PrestaShop_Logo.svg.png', emoji: '🛍️', rating: 4.3, reviews: 56, installs: 480, last_updated: '2026-02-10', pricing: 'free', documentation_url: 'https://docs.pagsmile.com/prestashop' },
  { id: 'tray', name: 'Tray', category: 'ecommerce', description: 'Plataforma brasileira de e-commerce', features: ['Checkout BR', 'Pix nativo', 'Boleto'], emoji: '🇧🇷', rating: 4.6, reviews: 89, installs: 1450, last_updated: '2026-04-25', pricing: 'free', is_verified: true, is_br: true, is_new: true, documentation_url: '#' },
  { id: 'lojaintegrada', name: 'Loja Integrada', category: 'ecommerce', description: 'Plataforma de e-commerce brasileira', features: ['App nativo', 'Configuração rápida'], emoji: '🇧🇷', rating: 4.4, reviews: 64, installs: 980, last_updated: '2026-04-10', pricing: 'free', is_br: true, is_new: true, documentation_url: '#' },

  // ERP/CRM (existing + BR additions)
  { id: 'salesforce', name: 'Salesforce', category: 'erp', description: 'Sincronize clientes e pagamentos', features: ['Sync de clientes', 'Histórico de pagamentos'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png', emoji: '☁️', rating: 4.7, reviews: 156, installs: 540, last_updated: '2026-04-05', pricing: 'free', is_verified: true, documentation_url: 'https://docs.pagsmile.com/salesforce' },
  { id: 'hubspot', name: 'HubSpot', category: 'erp', description: 'Integre pagamentos ao CRM', features: ['Deals automáticos', 'Timeline de pagamentos'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png', emoji: '🧲', rating: 4.6, reviews: 132, installs: 720, last_updated: '2026-04-12', pricing: 'free', is_verified: true, documentation_url: 'https://docs.pagsmile.com/hubspot' },
  { id: 'sap', name: 'SAP', category: 'erp', description: 'Conector para SAP Business One', features: ['Sincronização contábil', 'Conciliação automática'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/2560px-SAP_2011_logo.svg.png', emoji: '💼', rating: 4.4, reviews: 38, installs: 145, last_updated: '2026-03-20', pricing: 'paid', is_verified: true, documentation_url: 'https://docs.pagsmile.com/sap' },
  { id: 'totvs', name: 'TOTVS', category: 'erp', description: 'Integração com Protheus', features: ['Integração financeira', 'Lançamentos automáticos'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/TOTVS_logo.svg/2560px-TOTVS_logo.svg.png', emoji: '🏢', rating: 4.5, reviews: 72, installs: 320, last_updated: '2026-04-08', pricing: 'paid', is_verified: true, is_br: true, documentation_url: 'https://docs.pagsmile.com/totvs' },
  { id: 'contaazul', name: 'ContaAzul', category: 'erp', description: 'ERP brasileiro para PMEs', features: ['NFe automática', 'Conciliação bancária', 'Fluxo fiscal'], emoji: '🇧🇷', rating: 4.9, reviews: 412, installs: 4280, last_updated: '2026-05-02', pricing: 'free', is_verified: true, is_br: true, is_popular: true, is_new: true, documentation_url: '#' },
  { id: 'omie', name: 'Omie', category: 'erp', description: 'Sistema de gestão para pequenos negócios', features: ['ERP completo', 'NFe/NFSe', 'Cobrança recorrente'], emoji: '🇧🇷', rating: 4.8, reviews: 298, installs: 3120, last_updated: '2026-04-28', pricing: 'free', is_verified: true, is_br: true, is_popular: true, is_new: true, documentation_url: '#' },
  { id: 'bling', name: 'Bling', category: 'erp', description: 'Software de gestão online', features: ['Gestão de pedidos', 'Estoque', 'NFe'], emoji: '🇧🇷', rating: 4.7, reviews: 245, installs: 2840, last_updated: '2026-04-30', pricing: 'free', is_verified: true, is_br: true, is_popular: true, is_new: true, documentation_url: '#' },
  { id: 'tiny', name: 'Tiny ERP', category: 'erp', description: 'ERP brasileiro para e-commerce', features: ['Hub de pedidos', 'NFe automática', 'Multi-canal'], emoji: '🇧🇷', rating: 4.6, reviews: 189, installs: 2150, last_updated: '2026-04-22', pricing: 'free', is_verified: true, is_br: true, is_new: true, documentation_url: '#' },
  { id: 'rdstation', name: 'RD Station', category: 'erp', description: 'Marketing & Sales líder no Brasil', features: ['Lead scoring', 'Automation', 'Funil'], emoji: '🇧🇷', rating: 4.8, reviews: 312, installs: 1980, last_updated: '2026-04-26', pricing: 'free', is_verified: true, is_br: true, is_popular: true, is_new: true, documentation_url: '#' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'erp', description: 'CRM focado em vendas', features: ['Pipeline visual', 'Automation', 'Reports'], emoji: '📈', rating: 4.5, reviews: 124, installs: 680, last_updated: '2026-04-15', pricing: 'free', is_new: true, documentation_url: '#' },

  // Automation (existing)
  { id: 'zapier', name: 'Zapier', category: 'automation', description: 'Conecte a milhares de apps', features: ['5000+ apps', 'Triggers e Actions', 'No-code'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Zapier_logo.svg/2560px-Zapier_logo.svg.png', emoji: '⚡', rating: 4.7, reviews: 421, installs: 1840, last_updated: '2026-04-29', pricing: 'freemium', is_verified: true, is_popular: true, documentation_url: 'https://docs.pagsmile.com/zapier' },
  { id: 'make', name: 'Make (Integromat)', category: 'automation', description: 'Automações avançadas', features: ['Cenários complexos', 'Visual builder'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Make_Logo_RGB.svg/2560px-Make_Logo_RGB.svg.png', emoji: '🔧', rating: 4.6, reviews: 178, installs: 920, last_updated: '2026-04-18', pricing: 'freemium', is_verified: true, documentation_url: 'https://docs.pagsmile.com/make' },
  { id: 'n8n', name: 'n8n', category: 'automation', description: 'Automação self-hosted', features: ['Open source', 'Self-hosted', 'Workflows'], logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/N8n-logo.svg/2560px-N8n-logo.svg.png', emoji: '🔄', rating: 4.5, reviews: 92, installs: 480, last_updated: '2026-04-10', pricing: 'free', documentation_url: 'https://docs.pagsmile.com/n8n' },

  // Fiscal (NEW - BR diferencial)
  { id: 'tecnospeed', name: 'Tecnospeed', category: 'fiscal', description: 'Emissor de NFe/NFCe líder BR', features: ['NFe', 'NFCe', 'NFSe', 'CTe'], emoji: '🇧🇷', rating: 4.7, reviews: 156, installs: 1450, last_updated: '2026-04-25', pricing: 'paid', is_verified: true, is_br: true, is_new: true, documentation_url: '#' },
  { id: 'webmania', name: 'WebmaniaBR', category: 'fiscal', description: 'API de emissão fiscal', features: ['NFe', 'NFCe', 'MDFe'], emoji: '🇧🇷', rating: 4.5, reviews: 78, installs: 620, last_updated: '2026-04-12', pricing: 'paid', is_br: true, is_new: true, documentation_url: '#' },
  { id: 'plugnotas', name: 'Plug Notas', category: 'fiscal', description: 'Emissão fiscal as a service', features: ['NFSe', 'NFe', 'API simples'], emoji: '🇧🇷', rating: 4.6, reviews: 64, installs: 480, last_updated: '2026-04-08', pricing: 'paid', is_br: true, is_new: true, documentation_url: '#' },
  { id: 'nfeio', name: 'NFE.io', category: 'fiscal', description: 'NFSe automática', features: ['NFSe nacional', 'Webhook', 'API'], emoji: '🇧🇷', rating: 4.4, reviews: 52, installs: 380, last_updated: '2026-03-28', pricing: 'paid', is_br: true, is_new: true, documentation_url: '#' },

  // Logistics (NEW - BR diferencial)
  { id: 'correios', name: 'Correios', category: 'logistics', description: 'Cálculo de frete e rastreamento', features: ['Cálculo CEP', 'Tracking', 'Etiquetas'], emoji: '📮', rating: 4.3, reviews: 92, installs: 980, last_updated: '2026-04-20', pricing: 'free', is_verified: true, is_br: true, is_new: true, documentation_url: '#' },
  { id: 'loggi', name: 'Loggi', category: 'logistics', description: 'Entrega expressa e logística', features: ['Same-day', 'Última milha', 'API'], emoji: '🚚', rating: 4.5, reviews: 84, installs: 540, last_updated: '2026-04-15', pricing: 'free', is_br: true, is_new: true, documentation_url: '#' },
  { id: 'mercadoenvios', name: 'Mercado Envios', category: 'logistics', description: 'Logística do Mercado Livre', features: ['Multi-canal', 'Tracking', 'Reverso'], emoji: '🛵', rating: 4.4, reviews: 68, installs: 420, last_updated: '2026-04-10', pricing: 'free', is_br: true, is_new: true, documentation_url: '#' },
  { id: 'jadlog', name: 'Jadlog', category: 'logistics', description: 'Transportadora nacional', features: ['Cobertura BR', 'Express', 'Cargo'], emoji: '📦', rating: 4.2, reviews: 38, installs: 240, last_updated: '2026-03-30', pricing: 'free', is_br: true, is_new: true, documentation_url: '#' },

  // WhatsApp (NEW)
  { id: 'whatsapp-business', name: 'WhatsApp Business API', category: 'whatsapp', description: 'API oficial do WhatsApp', features: ['Mensagens', 'Templates', 'Webhooks'], emoji: '💬', rating: 4.7, reviews: 198, installs: 1820, last_updated: '2026-04-28', pricing: 'paid', is_verified: true, is_new: true, documentation_url: '#' },
  { id: 'zapi', name: 'Z-API', category: 'whatsapp', description: 'WhatsApp via API brasileira', features: ['Multi-instância', 'Webhook', 'Mídia'], emoji: '🇧🇷', rating: 4.6, reviews: 142, installs: 1240, last_updated: '2026-04-22', pricing: 'paid', is_br: true, is_new: true, is_popular: true, documentation_url: '#' },
  { id: 'twilio', name: 'Twilio WhatsApp', category: 'whatsapp', description: 'Comunicação via Twilio', features: ['SMS+WhatsApp', 'Voice', 'Verify'], emoji: '📱', rating: 4.5, reviews: 112, installs: 680, last_updated: '2026-04-18', pricing: 'paid', is_new: true, documentation_url: '#' },
  { id: 'wati', name: 'Wati', category: 'whatsapp', description: 'Plataforma WhatsApp Business', features: ['Chatbot', 'CRM integrado', 'Broadcast'], emoji: '💬', rating: 4.4, reviews: 78, installs: 420, last_updated: '2026-04-12', pricing: 'paid', is_new: true, documentation_url: '#' },

  // Support (NEW)
  { id: 'zendesk', name: 'Zendesk', category: 'support', description: 'Plataforma de atendimento global', features: ['Tickets', 'Chat', 'Help Center'], emoji: '🎧', rating: 4.6, reviews: 156, installs: 580, last_updated: '2026-04-20', pricing: 'paid', is_verified: true, is_new: true, documentation_url: '#' },
  { id: 'intercom', name: 'Intercom', category: 'support', description: 'Customer messaging platform', features: ['Chat', 'Bots', 'Support inbox'], emoji: '💬', rating: 4.7, reviews: 132, installs: 480, last_updated: '2026-04-18', pricing: 'paid', is_verified: true, is_new: true, documentation_url: '#' },
  { id: 'octadesk', name: 'Octadesk', category: 'support', description: 'Help desk brasileiro', features: ['Multicanal', 'WhatsApp', 'Tickets'], emoji: '🇧🇷', rating: 4.5, reviews: 64, installs: 320, last_updated: '2026-04-10', pricing: 'paid', is_br: true, is_new: true, documentation_url: '#' },
  { id: 'movidesk', name: 'Movidesk', category: 'support', description: 'Service desk completo BR', features: ['ITIL', 'Tickets', 'KPIs'], emoji: '🇧🇷', rating: 4.4, reviews: 48, installs: 240, last_updated: '2026-04-05', pricing: 'paid', is_br: true, is_new: true, documentation_url: '#' },

  // BI (NEW)
  { id: 'metabase', name: 'Metabase', category: 'bi', description: 'BI open-source', features: ['Dashboards', 'SQL queries', 'Self-hosted'], emoji: '📊', rating: 4.7, reviews: 92, installs: 380, last_updated: '2026-04-15', pricing: 'free', is_new: true, documentation_url: '#' },
  { id: 'looker-studio', name: 'Looker Studio', category: 'bi', description: 'BI gratuito do Google', features: ['Connectors', 'Reports', 'Sharing'], emoji: '📈', rating: 4.5, reviews: 78, installs: 280, last_updated: '2026-04-10', pricing: 'free', is_new: true, documentation_url: '#' },
  { id: 'powerbi', name: 'Power BI', category: 'bi', description: 'Microsoft BI', features: ['Análises', 'Dashboards', 'AI'], emoji: '📊', rating: 4.6, reviews: 112, installs: 420, last_updated: '2026-04-20', pricing: 'paid', is_verified: true, is_new: true, documentation_url: '#' },

  // Antifraud (NEW)
  { id: 'clearsale', name: 'ClearSale', category: 'antifraud', description: 'Antifraude líder no Brasil', features: ['Score IA', 'Manual review', 'Chargeback guarantee'], emoji: '🇧🇷', rating: 4.8, reviews: 168, installs: 920, last_updated: '2026-04-25', pricing: 'paid', is_verified: true, is_br: true, is_popular: true, is_new: true, documentation_url: '#' },
  { id: 'konduto', name: 'Konduto (Stone)', category: 'antifraud', description: 'Antifraude brasileiro', features: ['ML score', 'Behavioral', 'API'], emoji: '🛡️', rating: 4.6, reviews: 92, installs: 480, last_updated: '2026-04-18', pricing: 'paid', is_br: true, is_new: true, documentation_url: '#' },
  { id: 'sift', name: 'Sift', category: 'antifraud', description: 'Digital Trust & Safety global', features: ['Account takeover', 'Payment fraud', 'Content abuse'], emoji: '🛡️', rating: 4.5, reviews: 64, installs: 280, last_updated: '2026-04-12', pricing: 'paid', is_new: true, documentation_url: '#' },

  // Marketplaces (NEW)
  { id: 'mercadolivre', name: 'Mercado Livre', category: 'marketplace', description: 'Maior marketplace LATAM', features: ['Sync produtos', 'Pedidos', 'Anúncios'], emoji: '🛒', rating: 4.6, reviews: 198, installs: 1240, last_updated: '2026-04-28', pricing: 'free', is_verified: true, is_br: true, is_popular: true, is_new: true, documentation_url: '#' },
  { id: 'amazon-br', name: 'Amazon BR', category: 'marketplace', description: 'Amazon Brasil seller', features: ['FBA', 'Sync orders', 'Inventory'], emoji: '📦', rating: 4.5, reviews: 132, installs: 680, last_updated: '2026-04-22', pricing: 'free', is_new: true, documentation_url: '#' },
  { id: 'magalu', name: 'Magalu Marketplace', category: 'marketplace', description: 'Marketplace Magazine Luiza', features: ['Catálogo', 'Pedidos', 'Frete'], emoji: '🇧🇷', rating: 4.4, reviews: 72, installs: 380, last_updated: '2026-04-15', pricing: 'free', is_br: true, is_new: true, documentation_url: '#' },
  { id: 'shopee', name: 'Shopee', category: 'marketplace', description: 'Marketplace asiático com forte presença BR', features: ['Sync', 'Promoções', 'Logística'], emoji: '🛍️', rating: 4.3, reviews: 92, installs: 480, last_updated: '2026-04-10', pricing: 'free', is_new: true, documentation_url: '#' },
];

export const getPluginById = (id) => pluginCatalog.find((p) => p.id === id);

export const filterPlugins = (plugins, { category = 'all', search = '', tab = 'all' }) => {
  let result = plugins;
  if (category !== 'all') result = result.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.features.some((f) => f.toLowerCase().includes(q))
    );
  }
  if (tab === 'popular') result = result.filter((p) => p.is_popular);
  if (tab === 'new') result = result.filter((p) => p.is_new);
  if (tab === 'br') result = result.filter((p) => p.is_br);
  return result;
};