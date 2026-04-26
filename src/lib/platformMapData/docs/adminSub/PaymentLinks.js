// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Módulo Links de Pagamento (Admin Sub)
// Páginas: /PaymentLinks (lista) e /PaymentLinkCreate (criação/edição)
// =============================================================================

export const PaymentLinksDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Links de Pagamento',
    body:
      'Hub de gestão dos links de pagamento criados pelo merchant. Cada "link" é uma URL pública que abre uma página de checkout pré-configurada (com valor, descrição, métodos, foto do produto). Apresenta KPIs agregados, filtros, duas visualizações (tabela ou cards) e drawer lateral para compartilhar via QR/WhatsApp/E-mail.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) COBRANÇA RÁPIDA sem integração técnica — merchant cria link e envia por WhatsApp/e-mail; (2) PRODUTO DIGITAL DE PRATELEIRA — link "fixo" para um produto comprável por qualquer pessoa via URL; (3) DOAÇÕES, EVENTOS, INFOPRODUTOS — formato perfeito para venda direta sem e-commerce; (4) MULTI-CANAL — distribuir mesmo link em vários lugares e medir performance unificada.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que é uma das telas mais valiosas para PMEs',
    body:
      'A maioria dos merchants brasileiros NÃO TEM site/loja virtual. Para esses (cabeleireiros, professores, restaurantes, prestadores), Links de Pagamento são a PORTA DE ENTRADA para receber online. Crítico para conversão de "merchant existe" para "merchant ativo".',
  },

  {
    type: 'section',
    title: '1. PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 PageHeader padrão. Título e subtítulo do i18n (t("payment_links.title")). Breadcrumb "Dashboard › Links de Pagamento". À direita: 2 botões.',
      },
      {
        type: 'subsection',
        title: 'Botão "Vitrines" (variant outline)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: navega para /PaymentLinkShowcase — página onde merchant agrupa vários links em uma "vitrine pública" estilo mini-loja com categorias, busca, banner.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: para merchants com 5+ produtos, mandar 1 link de vitrine é melhor que 5 links separados. Vira um "linktr.ee" mas com pagamento embutido.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: outline, ícone LayoutGrid + label "Vitrines". Sem destaque de cor — ação secundária.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE secundário: criar UM LINK é a ação mais comum (90% dos casos). Vitrine é avançado, subset menor.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Criar Link" (verde primário PagSmile)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: navega para /PaymentLinkCreate sem id — modo NOVO link.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: bg-[#00D26A] hover:bg-[#00A854]. Ícone Plus + label "Criar Link". Cor verde reforça ação criativa/positiva.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. Grid de 4 KPIs',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Grid responsivo (1/2/4 colunas) com 4 KPICards calculados em tempo real a partir dos links carregados (até 100 mais recentes).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que estes 4 KPIs',
        body:
          'Cobrem o funil completo: VOLUME (links ativos), RECEITA (total arrecadado), TRANSAÇÕES (vendas geradas), EFICIÊNCIA (conversão média). Em 1 olhada o gestor responde "quantos links tenho? quanto geraram? quantas vendas? converto bem?".',
      },
      {
        type: 'list',
        items: [
          'KPI 1 "Links Ativos" — `activeLinks.length` (filtra status==="active"). Ícone Link2 + bg-blue-100/text-blue-600. Sem delta',
          'KPI 2 "Total Arrecadado" — soma de `total_collected`. Ícone DollarSign + bg-emerald-100/text-emerald-600. Delta hardcoded "+15.3%" (placeholder)',
          'KPI 3 "Total de Transações" — soma de `usage_count`. Ícone BarChart3 + bg-purple-100/text-purple-600',
          'KPI 4 "Taxa de Conversão Média" — `(totalSales / totalViews) * 100`. Ícone TrendingUp + bg-orange-100/text-orange-600',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 LIMITAÇÃO: agregação client-side limita-se aos 100 links carregados. Para merchants com 500+ links, número é aproximação.',
      },
    ],
  },

  {
    type: 'section',
    title: '3. Barra de Filtros + Toggle Tabela/Cards',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Container flex (column em mobile, row em desktop) bg-white com borda. ESQUERDA: Input de busca + Select de status. DIREITA: 2 botões icon-only para alternar visualização.',
      },
      {
        type: 'subsection',
        title: 'Input de Busca',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: filtra por nome OU link_id. Comparação case-insensitive. Placeholder "Buscar por nome ou ID...". max-w-xs (largura limitada).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE busca em 2 campos: o merchant lembra do nome ("Curso de Excel") OU pode ter recebido o link_id em relatório. Dupla busca cobre 2 cenários.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Select de Status (6 opções)',
        children: [
          {
            type: 'list',
            items: [
              '"Todos" (default) — sem filtro',
              '"Ativos" (active) — disponíveis para uso público',
              '"Inativos" (inactive) — pausados manualmente',
              '"Expirados" (expired) — passou data limite',
              '"Esgotados" (sold_out) — atingiu limite de uso/estoque',
              '"Rascunhos" (draft) — criados mas não publicados',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 6 estados: cada um tem semântica e ação distinta. "Esgotado" pode virar "Ativo" se aumentar estoque. "Expirado" exige nova data. "Rascunho" exige completar setup.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Toggle de Visualização (2 botões icon-only)',
        children: [
          {
            type: 'list',
            items: [
              'Botão List (ícone) — viewMode="table". DataTable padrão',
              'Botão LayoutGrid (ícone) — viewMode="cards". Grid de cards visuais',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 2 visualizações: Operadores financeiros preferem TABELA (densa, ordenável). Vendedores e marketing preferem CARDS (visual, com foto, mais "lojinha"). Cada um escolhe.',
          },
          {
            type: 'paragraph',
            text:
              '📐 ATIVO recebe variant="default" (verde sólido); INATIVO fica variant="outline".',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '4. Estado Vazio (EmptyState)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Componente EmptyState com icon=Link2, title="Nenhum link de pagamento", description="Crie seu primeiro link de pagamento para começar a receber", actionLabel="Criar Link", onAction=navigate(/PaymentLinkCreate).',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE incluir CTA: estado vazio sem ação = beco sem saída. CTA imediato guia para próxima etapa. Reduz tempo de TIME-TO-FIRST-LINK.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Limitação atual',
        body:
          'Versão atual mostra MESMA mensagem para "nunca criou nada" e "filtro zerou resultado". Versão ideal distinguiria os 2 cenários.',
      },
    ],
  },

  {
    type: 'section',
    title: '5. Visualização Tabela (DataTable, 7 colunas)',
    children: [
      {
        type: 'subsection',
        title: 'Coluna 1 — "Link" (key=name)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Render: flex items-center gap-3. Esquerda: imagem 40×40 rounded-lg (main_image_url) OU quadrado bg-azul/cinza com ícone Link2 (azul se ativo, cinza se inativo). Direita: nome em font-medium pequeno + URL truncada cinza (max-w-[200px]).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE foto/ícone-fallback: link com produto tem foto. Cobrança avulsa não tem. Sistema lida com ambos elegantemente.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 2 — "Valor" (key=amount)',
        children: [
          {
            type: 'list',
            items: [
              'value_type="open" → texto cinza "Valor aberto" (cliente decide quanto — doações)',
              'value_type="minimum" → "Min. R$ X,XX" (cliente paga >= X)',
              'value_type="fixed" → valor BRL bold preto (uso comum)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 3 modalidades: Fixed = produto/serviço com preço definido. Open = doação/gorjeta. Minimum = "pague o quanto quiser, mínimo X" (assinatura voluntária, fundraising).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 3 — "Status"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 getStatusBadge inline: active→verde, inactive/expired→cinza, sold_out→amarelo (atenção), draft→azul.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 4 — "Uso"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 2 linhas: "X vendas" (preto) + "Y visualizações" (cinza pequeno). Permite calcular conversão mentalmente.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 5 — "Arrecadado"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Valor BRL bold em verde-esmeralda. Cor positiva reforça receita.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 6 — "Conversão" (calculada inline)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 (usage_count / views_count) * 100. Cor adaptativa: ≥5% verde, 2-5% amarelo, <2% cinza. Formato 1 decimal + "%".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE coloração: chama atenção para links com conversão baixa. Thresholds 2% e 5% refletem benchmark e-commerce BR.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 7 — "Ações" (3 botões)',
        children: [
          {
            type: 'list',
            items: [
              'Botão Copy (ícone) — navigator.clipboard.writeText + toast "Link copiado!". Ação MAIS frequente, exposta',
              'Botão Share2 (ícone) — abre SideDrawer ShareOptions na lateral',
              'DropdownMenu (3 pontos): Abrir link → window.open / Editar → /PaymentLinkCreate?id=X / QR Code (mesma ação que Share) / [separador] / Pause "Desativar" ou Play "Ativar" (toggle de status) / "Excluir" em vermelho com confirm()',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE Copy fora do dropdown: AÇÃO MAIS frequente do dia-a-dia (compartilhar via WhatsApp). Tirar do dropdown economiza 1 clique milhares de vezes.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE separador antes de Pause/Excluir: convenção — separar AÇÕES SEGURAS (visualizar, editar) de IMPACTANTES (mudar status, excluir).',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '6. Visualização Cards (LinkCard)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Grid responsivo (1/2/3/4 colunas). Cada link vira card visual estilo "marketplace" — destaque para imagem do produto, valor, KPIs sumarizados e 3 ações inline.',
      },
      {
        type: 'list',
        items: [
          'Card branco rounded-xl com border + hover:shadow-md',
          'TOPO: imagem 100% width × h-40 (main_image_url) OU gradiente cinza com ícone Link2',
          'PADDING 16px: nome em font-semibold + StatusBadge → VALOR em font-bold lg → linha "X vendas + R$Y arrecadado" → 3 botões: "Copiar" (com label, flex-1) / Share2 / Edit',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE no card o Copy tem LABEL e na tabela é só ícone: card tem mais espaço; tabela densa exige economia.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 LIMITAÇÃO: card NÃO oferece DropdownMenu (excluir, ativar/desativar). Para essas ações usuário precisa trocar para tabela.',
      },
    ],
  },

  {
    type: 'section',
    title: '7. SideDrawer de Compartilhamento (ShareOptions)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Painel deslizante lateral aparece quando shareLink é preenchido. Conteúdo via componente ShareOptions(link, onClose).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que SideDrawer e não Dialog modal',
        body:
          'Compartilhar é tarefa CONTEXTUAL — usuário pode querer ver o link na lista enquanto vê opções. SideDrawer mantém contexto; Dialog modal escuro tira foco da lista.',
      },
      {
        type: 'list',
        items: [
          'QR Code grande gerado da URL (download como PNG / impressão)',
          'Botão "WhatsApp" — abre wa.me com mensagem pré-formatada',
          'Botão "E-mail" — mailto: com subject e body pré-preenchidos',
          'Botão "Web Share API" — em mobile, share-sheet nativo',
          'Bloco "Embed iframe" — código <iframe> para colar em sites',
          'Bloco "UTM builder" — adicionar UTM antes de copiar URL final',
        ],
      },
    ],
  },
];

// =============================================================================
// PÁGINA 2: /PaymentLinkCreate
// =============================================================================

export const PaymentLinkCreateDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Criar/Editar Link',
    body:
      'Builder completo de link de pagamento. Mesma página em 2 modos: NOVO (sem ?id=) ou EDIÇÃO (com ?id=). Layout 3 colunas: navegação lateral esquerda (8 abas) + formulário central (seção ativa) + preview ao vivo direita. Fluxo wizard com botões Anterior/Próximo + Save Rascunho ou Save+Activate.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      'Coletar TODA configuração de um link em interface organizada. Cada aba cobre uma dimensão: identificação, preço, quantidade, validade, cupons, rastreamento, visual, métodos. Permite criação RÁPIDA (só básico+valor+save) ou DETALHADA (8 abas).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que NÃO um formulário longo único',
    body:
      'PaymentLink tem ~40 campos. Em formulário único, intimidante. 8 abas + preview lado a lado: foco em 1 dimensão por vez. Reduz fricção, permite "pular" abas avançadas (UTM, custom domain) e ver impacto visual em tempo real.',
  },

  {
    type: 'section',
    title: '1. PageHeader (3 botões)',
    children: [
      {
        type: 'subsection',
        title: 'Título dinâmico por modo',
        children: [
          {
            type: 'list',
            items: [
              'Modo NOVO: title="Novo Link de Pagamento", subtitle="Crie um link para receber pagamentos"',
              'Modo EDIÇÃO: title="Editar Link", subtitle=`Editando: ${formData.name}`',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Voltar" (outline)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 navigate(/PaymentLinks). Volta para lista. NÃO confirma alterações não salvas (limitação UX).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Salvar Rascunho" (outline)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 handleSave("draft"). Persiste com status="draft". Útil para configurar parcialmente e voltar.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE separar de "Criar e Ativar": permite trabalhar em link complexo sem publicá-lo. Reduz risco de URL "vazada" antes de revisão.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Criar e Ativar" / "Atualizar e Ativar" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 handleSave("active"). Persiste e ativa. URL pública passa a aceitar pagamentos. Ícone Check + label dinâmico por modo.',
          },
          {
            type: 'subsection',
            title: 'Validações síncronas (antes da mutação)',
            children: [
              {
                type: 'list',
                items: [
                  'Se !formData.name → toast "Nome é obrigatório" + setActiveTab("basic") (PULA para a aba do erro)',
                  'Se value_type==="fixed" e !formData.amount → toast "Valor é obrigatório" + setActiveTab("value")',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE pular para a aba relevante: validar e ficar parado em outra aba é frustrante. Pulando, cursor já está no campo problemático.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Geração automática (apenas em CREATE)',
            children: [
              {
                type: 'list',
                items: [
                  'link_id = `link_${Date.now()}` — identificador interno',
                  'url = `https://pay.pagsmile.com/${slug || Date.now()}` — URL canônica longa',
                  'short_url = `https://pag.sm/${Date.now().toString(36)}` — URL curtinha (base 36)',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 2 URLs: longa = canônica/SEO; curta = WhatsApp/SMS/cartão visita. Merchant escolhe qual compartilhar.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. Layout 3 Colunas (sidebar 2/12 + form 7/12 + preview 3/12)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Grid lg:grid-cols-12. Sidebar sticky top-24 com 8 abas (col-span-2). Form central card branco (col-span-7). Preview ao vivo (col-span-3, hidden em < lg).',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE esse layout: sidebar fixa permite navegar SEM perder contexto do preview. Form central é onde olhos se concentram. Preview pequeno mas constante mostra impacto imediato.',
      },
    ],
  },

  {
    type: 'section',
    title: '3. Sidebar de Navegação (8 abas)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Estrutura',
        body:
          'Container bg-white rounded-xl com border + sticky top-24. Lista vertical de 8 botões. Aba ativa: bg-[#00D26A]/10 + texto verde. Inativas: cinza com hover bg-gray-50. Cada item: ícone Lucide + label.',
      },
      {
        type: 'list',
        items: [
          'ABA 1 "Informações" (Info) — nome, descrição, imagens',
          'ABA 2 "Valor" (DollarSign) — value_type, amount, sugestões',
          'ABA 3 "Quantidade" (Package) — múltiplos, variações',
          'ABA 4 "Validade" (Clock) — expiração, limite de uso, estoque',
          'ABA 5 "Cupons" (TicketPercent) — vincular cupons',
          'ABA 6 "Rastreamento" (Target) — UTM, pixels, external_reference',
          'ABA 7 "Personalização" (Palette) — cor, logo, mensagens, layout',
          'ABA 8 "Pagamento" (CreditCard) — métodos, parcelamento, desconto PIX',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE essa ordem: começa pelo "que é" (info), passa por "quanto custa" (valor/quantidade), define "regras de uso" (validade/cupons), depois "marketing" (rastreamento/visual) e termina em "como pagar". Reflete pensamento mental do merchant.',
      },
    ],
  },

  {
    type: 'section',
    title: '4. Área do Formulário (centro)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Composição',
        body:
          'Container bg-white rounded-xl border padding-6 que renderiza UM componente de seção por vez baseado em activeTab. Cada componente recebe formData + setFormData (lift state).',
      },
      {
        type: 'subsection',
        title: 'Aba 1: BasicInfoSection — Informações Básicas',
        children: [
          {
            type: 'list',
            items: [
              'Campo "Nome" (obrigatório) — aparece para cliente final no checkout',
              'Campo "Descrição curta" (textarea pequeno) — meta tags / preview WhatsApp',
              'Campo "Descrição longa" (textarea grande, possivelmente Markdown) — exibida no checkout',
              'Upload "Imagem principal" (main_image_url) — capa que aparece em listagens, cards e checkout',
              'Upload "Galeria" (gallery_image_urls[]) — múltiplas em carrossel',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE upload e não URL externa: maioria dos merchants não tem servidor próprio. Sistema usa base44 UploadFile.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba 2: ValueConfigSection — Configuração de Valor',
        children: [
          {
            type: 'list',
            items: [
              'Radio "Tipo de valor" — fixed/open/minimum (3 modalidades)',
              'Input "Valor" (amount) — visível apenas se fixed',
              'Inputs "Mínimo/Máximo" — visíveis se minimum',
              'Tags "Valores sugeridos" — botões pré-definidos no checkout (R$50, R$100, R$200) para acelerar escolha',
              'Select "Moeda" — default BRL. Outras: USD, EUR, MXN (multi-moeda)',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba 3: QuantityVariationsSection — Quantidade e Variações',
        children: [
          {
            type: 'list',
            items: [
              'Toggle "Permitir múltiplas unidades" (allow_quantity)',
              'Input "Quantidade mínima/máxima"',
              'Repeater "Variações" — array {nome:"Tamanho M", preço_extra:0, estoque:50}. Para tamanhos/cores',
              'Repeater "Campos customizados" — coletar dados extras no checkout (CPF beneficiário, mensagem para presente)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE variações: 1 link único pode vender camisetas P/M/G sem criar 3 links. Cliente escolhe no checkout.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba 4: ValidityLimitsSection — Validade e Limites',
        children: [
          {
            type: 'list',
            items: [
              'DatePicker "Data de expiração" — após data link vira "expired"',
              'Radio "Limite de uso" — unlimited/single (1 uso só)/limited',
              'Input "Quantidade de usos" — só se limited',
              'Input "Estoque" — diferente: refere a unidades de produto físico',
              'JSON "Horário de funcionamento" — link só aceita pagamento em horários/dias específicos (ex: delivery 18h-23h)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE distinguir uso de estoque: doação ilimitada tem 10000 usos. Produto físico tem 50 unidades. Conceitos coexistem.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba 5: CouponBindingSection — Vinculação de Cupons',
        children: [
          {
            type: 'list',
            items: [
              'Multi-select "Cupons vinculados" (linked_coupon_ids[]) — cupons existentes aplicáveis',
              'Select "Cupom auto-aplicado" — único, aplica automaticamente sem cliente digitar (link com promoção embutida)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE: em vez de divulgar "use o código BLACKFRIDAY", merchant cria link com cupom JÁ APLICADO. URL única para campanha = mais conversão e melhor tracking.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba 6: TrackingSection — Rastreamento',
        children: [
          {
            type: 'list',
            items: [
              'Object "UTM" (utm_source, utm_medium, utm_campaign) — anexados à URL',
              'Object "Pixel IDs" — Facebook Pixel, GA, TikTok Pixel. Disparam eventos quando cliente acessa/compra',
              'Input "Referência externa" — campo livre para ERP/CRM (número pedido Shopify)',
              'Input "Slug customizado" — substitui ID na URL (/curso-excel em vez de /171936...)',
              'Input "Domínio customizado" — usar dominio.com em vez de pay.pagsmile.com (enterprise/white-label)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE pixel: anúncio Facebook/Google sem pixel não sabe se vendeu. Embutir nos links permite rastreio sem editar tags HTML.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba 7: PersonalizationSection — Personalização Visual',
        children: [
          {
            type: 'list',
            items: [
              'Toggle "Usar checkout padrão" — ON herda config global do CheckoutBuilder. OFF habilita campos abaixo',
              'Select "Layout" — default/minimal/dark templates pré-definidos',
              'Upload "Logo"',
              'ColorPicker "Cor da marca" — default #00D26A',
              'Textarea "Mensagem de sucesso" — suporta {nome}, {pedido}',
              'Input "URL de redirecionamento" — em vez de mensagem, redireciona para outra URL',
              'Textarea "Mensagem de erro"',
              'Object "Configuração thank-you-page" — granular',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba 8: PaymentMethodsSection — Métodos de Pagamento',
        children: [
          {
            type: 'list',
            items: [
              'Multi-select "Métodos aceitos" — card/pix/boleto. Default ["card","pix"]',
              'Reorder "Ordem de exibição" (method_order)',
              'Slider "Máximo de parcelas" — 1 a 12. Default 12',
              'Slider "Parcelas sem juros" — quantas o merchant absorve. Default 1',
              'Toggle "Parcelamento promocional" — "12x sem juros!" mesmo absorvendo (estratégia de aquisição)',
              'Slider "Desconto PIX" — 0-15%. Default 0',
              'Input "Expiração PIX (minutos)" — default 30',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE configurar parcelamento POR LINK: produtos diferentes têm políticas diferentes. Curso R$1500 vale 12x. Produto R$30 não.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '5. Botões Anterior/Próximo (abaixo do formulário)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Linha flex justify-between abaixo do card. Esquerda "Anterior" (disabled na primeira aba), direita "Próximo" (disabled na última). Ambos variant outline. Implementação: tabs.findIndex + setActiveTab.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE manter sidebar E botões wizard: 2 affordances complementares. Sidebar = navegação livre. Botões = fluxo guiado. Atende novato e veterano.',
      },
    ],
  },

  {
    type: 'section',
    title: '6. Preview ao Vivo (PaymentLinkPreview)',
    children: [
      {
        type: 'paragraph',
        text:
          '🎯 Componente recebe formData (atualizado em tempo real) e renderiza miniatura da página do link como cliente verá: imagem principal, nome, valor, descrição curta, botão de pagar com cor da marca.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE preview pequeno e não tela cheia: força priorização — mostra ELEMENTOS-CHAVE que cliente vê antes de scrollar. Versão tela cheia seria distração.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Reage a mudanças em formData.name, main_image_url, amount, brand_color, description. Atualiza visualmente em <100ms.',
      },
    ],
  },

  {
    type: 'section',
    title: '7. Persistência e Estados',
    children: [
      {
        type: 'list',
        items: [
          'formData = useState com ~30 props. Cada section recebe + setFormData e atualiza imutavelmente. Pattern lift-state-up garante consistência',
          'createMutation: sucesso → invalidate cache + toast "Link criado!" + navigate(/PaymentLinks). Erro → toast erro',
          'updateMutation: sucesso → invalidate + toast "Atualizado!" + navigate(/PaymentLinks)',
          'isLoading combinado: createMutation.isPending || updateMutation.isPending. Disabled de botões + label "Salvando..."',
          'Modo edição: useQuery condicional via enabled:!!linkId. useEffect detecta existingLink chegando + setFormData merge para defaults novos',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE estado único e não local em cada section: preview ao vivo precisa enxergar TODOS os campos. Estado único = fonte única de verdade.',
      },
    ],
  },

  {
    type: 'section',
    title: '8. Responsividade',
    children: [
      {
        type: 'list',
        items: [
          'Em < lg: preview oculto (limitação atual). Sidebar e form empilham',
          'Sticky sidebar (top-24): abas sempre acessíveis sem scroll',
          'Header empilha em coluna em mobile (3 botões caem em rows)',
          'Atalhos previstos (não implementados): Cmd+S = Salvar Rascunho; Cmd+Enter = Criar e Ativar; setas = navegar abas',
        ],
      },
    ],
  },
];