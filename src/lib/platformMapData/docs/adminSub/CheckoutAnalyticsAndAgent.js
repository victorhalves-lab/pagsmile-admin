// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Checkout Analytics & Converter Agent
// Páginas: /CheckoutAnalytics, /ConverterAgent, /ConverterAgentSettings
// Arquivos-fonte:
//   - pages/CheckoutAnalytics.jsx
//   - pages/ConverterAgent.jsx
//   - pages/ConverterAgentSettings.jsx
// =============================================================================

// =============================================================================
// PÁGINA 1: /CheckoutAnalytics
// =============================================================================

export const CheckoutAnalyticsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Checkout Analytics',
    body:
      'Painel analítico dedicado EXCLUSIVAMENTE à performance dos checkouts. Diferente de "Dashboard" (que mostra performance geral) e "Análise de Recusas" (que olha transações já tentadas), aqui o foco é o FUNIL DO CHECKOUT: visitas → checkouts iniciados → concluídos. A página responde "quanto do meu tráfego converte em venda?".',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) MEDIR a saúde do funil de checkout (taxa de conversão, abandono); (2) ENTENDER comportamento por dia da semana (existem picos de conversão Sex/Sáb? quedas Dom/Seg?); (3) IDENTIFICAR motivos de abandono (frete caro, processo longo, falta de confiança); (4) ANALISAR mix de métodos preferidos pelos clientes; (5) JUSTIFICAR investimentos em otimização (taxa subiu de 10% para 12%? = mais receita sem mais tráfego).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Quem usa',
    body:
      'Gestores de e-commerce, analistas de growth, profissionais de UX. Acessada semanalmente em reuniões de performance. Não é tela operacional do dia — é tela de "olhar o todo e tomar decisão estratégica".',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que separar de outros analytics',
    body:
      'O funil de checkout é uma camada distinta no negócio. Misturar com analytics de transações (que já passaram do checkout) embaralha conceitos: "abandono de carrinho" não é o mesmo que "transação recusada". Página dedicada permite KPIs claros e ações específicas.',
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'Implementação atual',
    body:
      'A versão atual usa dados HARDCODED (mockados) para todos os gráficos e KPIs. Os arrays conversionData, abandonmentReasons, paymentMethodsData e kpis são fixos no componente. A integração com analytics reais (entidades Checkout / events de tracking) virá em iteração futura. A documentação descreve a UX e a INTENÇÃO da página.',
  },

  // ===========================================================================
  // 1. PAGEHEADER
  // ===========================================================================
  {
    type: 'section',
    title: 'PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Título "Analytics de Checkout" + subtítulo "Acompanhe a performance e otimize suas conversões". Breadcrumb "Checkout › Analytics". À direita: Select de período + botão Exportar (ambos como `actions`).',
      },
      {
        type: 'subsection',
        title: 'Select de Período (3 opções)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: filtra todos os KPIs e gráficos da página para um intervalo temporal único. Estado `period` (default "7d"). Largura w-36.',
          },
          {
            type: 'list',
            items: [
              '"Últimos 7 dias" (default) — visão tática semanal. Detecta padrões dia-da-semana',
              '"Últimos 30 dias" — visão tática mensal. Suaviza eventos pontuais',
              '"Últimos 90 dias" — visão estratégica trimestral. Ideal para reuniões executivas',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE só 3 opções e não custom range: simplicidade. Análise de funil precisa de massa estatística — comparar "ontem vs anteontem" gera ruído. Cobrir 90 dias é suficiente para decisões. Custom range pode entrar como evolução futura.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Exportar"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: gerar relatório (CSV/Excel/PDF) do período atual para apresentações, BI externo ou compliance. UI: outline, ícone Download + label.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Versão atual sem handler programado. Esperado: dropdown de formato OU SideDrawer com seleção de gráficos a incluir.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. GRID DE 4 KPIs
  // ===========================================================================
  {
    type: 'section',
    title: 'Linha 1 — Grid de 4 KPIs',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Grid responsivo (1/2/4 colunas) com 4 cards-KPI iguais em estrutura: label cinza pequeno + valor grande bold + linha de tendência colorida (seta + delta) + ícone temático em quadrado azul-claro à direita.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que estes 4 KPIs',
        body:
          'Cobrem as 4 perguntas fundamentais sobre o funil: (1) quanto convertemos? = Taxa de Conversão; (2) quanto perdemos? = Abandono; (3) quanto cada venda vale? = Ticket Médio; (4) qual o tamanho do nosso público? = Visitantes Únicos. Juntos contam a história completa.',
      },
      {
        type: 'list',
        items: [
          'KPI "Taxa de Conversão" — valor "12.4%" (fictício). Trend up verde "+2.1%" (vs período anterior). Ícone TrendingUp. Métrica primária da página',
          'KPI "Abandono de Carrinho" — valor "68.2%". Trend down verde "-3.5%" (queda no abandono é positiva, por isso verde mesmo sendo down). Ícone ShoppingCart',
          'KPI "Ticket Médio" — valor R$ 247,50 (formatado via Intl.NumberFormat pt-BR/BRL). Trend up verde "+8.3%". Ícone CreditCard',
          'KPI "Visitantes Únicos" — valor "8.4K" (notação compacta). Trend up verde "+15.2%". Ícone Users',
        ],
      },
      {
        type: 'paragraph',
        text:
          '📐 Comportamento de tendência: kpi.trend === "up" → verde + ícone TrendingUp; "down" → vermelho + ícone TrendingDown. NOTA da implementação: o "Abandono" tem trend="down" e mostra vermelho — mas semanticamente, queda de abandono é positiva. Versão final deveria tratar inversão semântica (algumas métricas são "lower-is-better").',
      },
      {
        type: 'paragraph',
        text:
          '📐 Layout do card: flex justify-between → texto à esquerda (label + valor + delta), ícone temático à direita em padding de 12px com fundo bg-primary/10 e cor text-primary, rounded-xl.',
      },
    ],
  },

  // ===========================================================================
  // 3. FUNIL DE CONVERSÃO (gráfico de barras agrupadas)
  // ===========================================================================
  {
    type: 'section',
    title: 'Linha 2 — Funil de Conversão (BarChart agrupado)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Card de largura total com gráfico de barras agrupadas (3 barras por dia) cobrindo os 7 dias da semana (Seg-Dom). Cada dia mostra 3 barras lado a lado: cinza (visitas), índigo (checkouts iniciados), verde (concluídos).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Visualizar comportamento DIÁRIO do funil. As 3 barras lado a lado mostram instantaneamente os "vazamentos" — onde o tráfego (cinza) "evapora" antes de virar venda (verde). Também revela padrões dia-da-semana: Sexta tem 1600 visitas, Domingo só 750 — capacidade de planejar campanhas.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Header: ícone MousePointerClick + título "Funil de Conversão". Container h-80 (320px) com ResponsiveContainer 100% × 100%.',
      },
      {
        type: 'list',
        items: [
          'CartesianGrid pontilhado (3 3) cinza claro #e2e8f0 — facilita leitura',
          'XAxis: nomes dos dias (Seg, Ter, Qua...). Cor #64748b (slate-500)',
          'YAxis: valores numéricos automáticos',
          'Tooltip customizado: fundo branco, borda slate-200, border-radius 8px',
          'Bar 1 "Visitas" — fill cinza #94a3b8. Topo arredondado [4,4,0,0]',
          'Bar 2 "Checkouts Iniciados" — fill índigo #6366f1. Topo arredondado',
          'Bar 3 "Concluídos" — fill verde PagSmile #00D26A. Topo arredondado',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE 3 cores progressivas (cinza → índigo → verde): semântica de "esfriamento". Cinza = potencial não engajado; Índigo = engajado mas não confirmado; Verde = sucesso. Sequência cromática conta a história.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE barras agrupadas e não empilhadas: empilhadas mostrariam o total do dia mas esconderiam comparação direta entre etapas. Agrupadas permitem ver rapidamente o "shape" do funil em cada dia.',
      },
    ],
  },

  // ===========================================================================
  // 4. GRID 2x1 DE PIE CHARTS
  // ===========================================================================
  {
    type: 'section',
    title: 'Linha 3 — Grid de 2 Donut Charts (Motivos × Métodos)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Grid responsivo (1/2 colunas) com 2 cards iguais em estrutura: cada um tem PieChart donut no topo (h-64 = 256px, innerRadius 60, outerRadius 90, paddingAngle 2) + LEGENDA TEXTUAL embaixo com pontos coloridos + nome + percentual.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que mostrar legenda textual além do gráfico',
        body:
          'PieChart sozinho dificulta leitura precisa (usuário não sabe se é 35% ou 38%). Lista textual abaixo dá precisão. Combinação visual + textual é a melhor prática — bom para consumo rápido E análise detalhada.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que donut e não pizza inteira',
        body:
          'Donut (innerRadius 60) cria um "vazio central" útil: pode receber valor consolidado no centro (futuro), parece mais moderno e reduz a tendência de comparar áreas (cérebro humano é ruim nisso) — força olhar para os percentuais explícitos.',
      },

      {
        type: 'subsection',
        title: 'Card 1 — "Motivos de Abandono"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: descobrir por que clientes desistem. Cada motivo identificado é uma ação possível: frete caro → revisar política de frete; processo longo → simplificar checkout; falta de confiança → adicionar selos.',
          },
          {
            type: 'list',
            items: [
              '"Frete muito caro" — 35% — vermelho #ef4444. Maior fatia (problema dominante)',
              '"Processo longo" — 25% — laranja #f97316',
              '"Falta de confiança" — 20% — amarelo #eab308',
              '"Erro no pagamento" — 12% — verde #22c55e',
              '"Outros" — 8% — cinza #6b7280',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE cores em escala vermelho→cinza: gradiente de severidade percebida. Vermelho = problema crítico; cinza = bucket residual. Reforça a hierarquia que o donut já mostra por tamanho.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 2 — "Métodos de Pagamento"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: entender preferência do público. Distribuição informa decisões: PIX em 35% justifica priorizar PIX no layout; boleto em 10% pode ser desativado se gerar mais MDR de boleto que receita.',
          },
          {
            type: 'list',
            items: [
              '"Cartão Crédito" — 55% — índigo #6366f1. Líder, default na maioria dos e-commerces',
              '"Pix" — 35% — verde PagSmile #00D26A. Crescendo no mercado',
              '"Boleto" — 10% — âmbar #f59e0b. Caudilhão decrescente',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 3 categorias e não mais: estes são os 3 métodos universais brasileiros. Alguns mercados têm Apple Pay/Google Pay separados, mas em B2C BR isso ainda é minoria — agregar manteria o pie limpo.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. ESTADOS, RESPONSIVIDADE
  // ===========================================================================
  {
    type: 'section',
    title: 'Estados & Responsividade',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Mobile: KPIs viram coluna única; gráficos mantêm largura total (legenda fica abaixo do donut). Botão Exportar e Select empilham no header em coluna.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Sem estado de loading na versão atual (dados hardcoded carregam instantaneamente). Versão futura terá skeleton dos cards + pulse das áreas de gráfico.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Sem estado de erro (dados são estáticos). Versão real terá fallback "Não foi possível carregar analytics" + retry.',
      },
    ],
  },
];

// =============================================================================
// PÁGINA 2: /ConverterAgent
// =============================================================================

export const ConverterAgentDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é o Converter Agent',
    body:
      'Página dedicada ao agente IA "Converter Agent" — especialista virtual em otimização de checkout. NÃO é só um chat: é uma plataforma completa com SIMULADOR INTERATIVO (manipula controles e vê impacto na conversão em tempo real), RESULTADOS A/B, INSIGHTS DE UX e REGRAS DE PERSONALIZAÇÃO DINÂMICA. Combina IA generativa (chat) com IA preditiva (cálculo de lift) e automações.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) SIMULAR mudanças no checkout antes de aplicá-las (ROI estimado em segundos); (2) ANALISAR histórico de testes A/B com recomendação clara do agente; (3) IDENTIFICAR insights de UX (onde abandonam, quem converte mais, quais regras funcionam); (4) AUTOMATIZAR personalização contextual (mobile vê PIX primeiro, B2B vê cartão corporativo etc.); (5) CONVERSAR com o agente via chat para tirar dúvidas e pedir recomendações.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Quem usa',
    body:
      'Profissionais de growth, gestores de e-commerce, analistas de UX. Acesso pode ser semanal (revisar A/B) ou ad-hoc (simular cenário antes de campanha). Page é "central de inteligência de conversão".',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que existir como página separada',
    body:
      'O Converter Agent também aparece como ABA dentro do CheckoutBuilder (uso contextual durante edição). Mas operações DEEP (rodar simulação complexa, comparar 4 testes A/B, gerenciar regras de personalização) merecem espaço próprio. Página dedicada permite zoom no agente sem barulho do builder.',
  },

  // ===========================================================================
  // 1. HEADER ESPECIAL (sem PageHeader)
  // ===========================================================================
  {
    type: 'section',
    title: 'Header Customizado (não usa PageHeader padrão)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Header próprio com layout específico do agente: ícone grande Shuffle em quadrado gradiente azul-índigo (14×14) com sombra colorida + título "Converter Agent" + subtítulo "Otimizador de Checkout e Conversão" + à direita: badge dinâmico de lift atual + botão "Configurar".',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que header próprio',
        body:
          'Agentes IA são produtos em si — merecem identidade visual forte para diferenciar de páginas comuns. Ícone grande, gradiente colorido (cada agente tem sua cor: Converter=azul, DIA=verde, Helena=roxo etc.) e badge dinâmico criam sensação de "ferramenta especial". Reforça percepção de valor.',
      },
      {
        type: 'subsection',
        title: 'Badge dinâmico "+X% lift atual"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: badge verde claro (#dcfce7 / text-green-700) com ícone TrendingUp + texto "+X% lift atual". X vem de `liftPercentage`, recalculado pelo useEffect que reage aos controles do simulador.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: feedback positivo permanente. Mesmo sem interagir com nada, o usuário vê "estamos +X% comparado ao baseline". Isso reforça percepção de que o agente está trabalhando ATIVAMENTE.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Configurar"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: link para /ConverterAgentSettings. Botão outline tamanho sm com ícone Settings + label.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE separar configuração em página própria: configurações são ações ESPORÁDICAS (definidas uma vez, raramente mexidas). Manter na página principal poluiria. Página dedicada também permite isolar permissões (talvez só admin pode configurar).',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. GRID DE 4 KPI CARDS
  // ===========================================================================
  {
    type: 'section',
    title: 'Linha 2 — Grid de 4 KPI Cards Coloridos',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Grid responsivo (2/4 colunas) com 4 cards COMPACTOS (p-4) cada um com fundo colorido temático. Cada card tem: label pequeno em cima (truncado se longo) + Badge à direita com delta + valor numérico grande embaixo (truncado).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que cada card tem cor de fundo distinta',
        body:
          'KPIs do agente têm semântica afetiva: conversão = positivo (verde), abandono = negativo (vermelho), tempo = neutro (slate), revenue incremental = brand (verde PagSmile). Cores criam reconhecimento instantâneo sem precisar ler.',
      },
      {
        type: 'list',
        items: [
          'Card "Taxa de Conversão" — bg-green-50 + border-green-200. Texto verde. Valor "74.2%". Badge verde sólido com delta "+6.8%"',
          'Card "Taxa de Abandono" — bg-red-50 + border-red-200. Texto vermelho. Valor "25.8%". Badge VERDE (delta "-5.2%" é positivo: queda do abandono)',
          'Card "Tempo Médio" — fundo branco (sem cor). Valor "47s". Badge outline verde "-38s" (melhora)',
          'Card "Revenue Incremental" — bg-[#2bc196]/10 + border-[#2bc196]/20. Texto verde PagSmile. Valor "R$ 42.350". Badge verde sólido "+18%"',
        ],
      },
      {
        type: 'paragraph',
        text:
          '📐 Detalhe técnico: classes truncate + whitespace-nowrap + overflow-hidden + text-ellipsis garantem que mesmo em telas pequenas o card NÃO QUEBRE — texto longo vira "..." em vez de quebrar layout.',
      },
    ],
  },

  // ===========================================================================
  // 3. ESTRUTURA DE 4 ABAS PRINCIPAIS
  // ===========================================================================
  {
    type: 'section',
    title: 'Linha 3 — TabsList Principal (4 abas grid)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'TabsList com grid 4-cols ocupando largura total (w-full). Cada TabsTrigger tem texto puro (sem ícones nesta página, design propositalmente mais "denso").',
      },
      {
        type: 'list',
        items: [
          'Aba 1 "Simulador Interativo" (default) — laboratório de experimentação',
          'Aba 2 "Resultados A/B" — histórico de testes rodados',
          'Aba 3 "Insights de UX" — descobertas sobre o comportamento dos usuários',
          'Aba 4 "Personalização" — regras de adaptação dinâmica',
        ],
      },
    ],
  },

  // ===========================================================================
  // 4. ABA 1 — SIMULADOR INTERATIVO
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 1: Simulador Interativo',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Aba PRINCIPAL e mais valiosa do agente. Permite manipular controles → ver checkout simulado renderizar mudanças → ver KPIs (conversão/abandono/lift) recalcularem em TEMPO REAL. É "what-if analysis" instantâneo.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Tomar decisão antes de implementar. "E se eu desse 10% de desconto no PIX?" — mexe slider, vê conversão pular, decide. Reduz risco de mudanças em produção: testar primeiro no simulador.',
      },

      // ---- 4.1 Card de Linguagem Natural ----
      {
        type: 'subsection',
        title: 'Bloco 1 — Card de Linguagem Natural (acima do grid)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Card destacado com gradiente azul claro (from-blue-50/50 to-transparent) e borda azul translúcida. Contém Textarea + 2 botões. Permite descrever o cenário desejado em linguagem natural ao invés de mexer em controles.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que oferecer linguagem natural',
            body:
              'Mexer em 8 controles diferentes é tedioso. Para cenários complexos ("alto ticket com PIX 5% e parcelamento 12x sem juros"), texto livre é mais rápido. IA interpreta + simula. Atende 2 perfis: técnicos (controles) e estratégicos (linguagem natural).',
          },
          {
            type: 'list',
            items: [
              'Header: ícone Sparkles azul + título "Descrever Cenário de Checkout em Linguagem Natural" + descrição',
              'Textarea com placeholder de exemplo, min-h-[80px], resize disabled',
              'Botão "Simular com IA" (azul-500, ícone Sparkles) — flex-1. Disabled enquanto Textarea está vazio (.trim() check)',
              'Botão "Limpar" (outline) — limpa o estado nlScenarioInput',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Comportamento atual do botão "Simular com IA": chama `alert()` com texto fictício mostrando "IA analisou: X | Impacto Estimado: +14.2% conversão | MRR Adicional R$ 32.450/mês | Abandono -8.5%". É placeholder — versão final invocará LLM via base44.integrations.Core.InvokeLLM com response_json_schema estruturado.',
          },
        ],
      },

      // ---- 4.2 Layout 1/3 + 2/3 ----
      {
        type: 'subsection',
        title: 'Bloco 2 — Layout Split (Controles 1/3 + Preview 2/3)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Grid lg:grid-cols-3. Coluna esquerda (1 unidade) = Painel de Controles. Coluna direita (lg:col-span-2 = 2 unidades) = Preview do Checkout + Métricas. Em mobile: empilha (controles em cima).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE essa proporção: o preview é o "produto" da simulação — merece destaque visual. Controles são ferramentas — ficam ao lado mas menores.',
          },
        ],
      },

      // ---- 4.3 Painel de Controles ----
      {
        type: 'subsection',
        title: 'Bloco 3 — Painel de Controles (coluna esquerda)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: Card único com header "Ou Use Controles de Otimização" e 6 grupos de controles empilhados verticalmente (space-y-5).',
          },
          {
            type: 'subsection',
            title: 'Controle 1 — "Layout do Checkout" (RadioGroup)',
            children: [
              {
                type: 'list',
                items: [
                  '"1-Step (tudo na mesma tela)" — formulário único. Maior conversão para tickets baixos',
                  '"2-Steps (dados → pagamento)" — fluxo segmentado. Melhor para tickets altos / formulários complexos',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '📐 Impacto computado: layout==="1-step" → +3% conversão e +3 lift. Reflete data real do mercado.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Controle 2 — "Ordem dos Métodos de Pagamento" (Lista reordenável)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: lista vertical com PIX/Crédito/Débito, cada item em linha de 2 padding e bg-slate-50 com cursor-move. Click move o item UMA POSIÇÃO PARA CIMA (moveMethodUp).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Cada item: NÚMERO em badge circular (1° = verde-PagSmile, demais = cinza) + ícone do método + label + Badge "Destaque" verde (apenas no primeiro). Texto auxiliar abaixo: "Clique para mover para cima".',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Impacto computado: methodsOrder[0] === "pix" → +5% conversão e +5 lift. Reflete preferência mobile-first do mercado brasileiro.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE click-to-move-up em vez de drag-and-drop: simplicidade. Drag-and-drop em mobile é frágil. Click é universal e óbvio com indicador "1, 2, 3" + feedback visual de qual está em destaque.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Controle 3 — "Desconto PIX" (Slider)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: Slider 0-15% step 1, valor inicial 5%. Label dinâmico mostra valor atual: "Desconto PIX: 5%".',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Impacto computado: Math.min(pixDiscount[0] * 0.5, 4) — cada 1% de desconto adiciona 0.5% de conversão, com TETO de +4% (mais que isso seria irrealista — desconto extremo não dobra conversão proporcionalmente).',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Controle 4 — Toggles (Switches)',
            children: [
              {
                type: 'list',
                items: [
                  '"Ocultar campos opcionais" — true/false. Quando true: +2% conversão (campos a menos = menos atrito)',
                  '"Mostrar parcelamento" — true/false. Não afeta cálculo, mas afeta o preview (esconde "Até 12x sem juros" no método crédito)',
                ],
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Controle 5 — "Simular Contexto" (3 botões de dispositivo + 2 de rede)',
            children: [
              {
                type: 'description',
                emoji: '🎯',
                title: 'O que é',
                body:
                  'Linha divisora pt-4 border-t. Label "Simular Contexto". Grid 3-cols com botões Mobile/Desktop/Tablet (só ícones). Abaixo grid 2-cols com botões "Rápida"/"Lenta" (Wifi/WifiOff + label).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Botão ativo recebe borda colorida + bg colorido leve: dispositivo ativo = border-blue-500 / bg-blue-50; rede rápida = green-500/green-50; rede lenta = amber-500/amber-50.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Impacto computado: networkSpeed==="slow" → -8% conversão (rede lenta mata conversão). deviceType==="desktop" → +4%; tablet → +2%; mobile = 0 (baseline).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE simular rede: mercados emergentes (Brasil incluído) ainda têm muitos clientes em 3G/redes ruins. Otimizar para rede ruim é diferencial competitivo. Simular permite ver o impacto.',
              },
            ],
          },
        ],
      },

      // ---- 4.4 Preview do Checkout ----
      {
        type: 'subsection',
        title: 'Bloco 4 — Preview do Checkout (coluna direita)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Card "h-full" com header "Preview do Checkout" (ícone Eye) + ícones de status (dispositivo atual + ícone WifiOff se rede=lenta). Conteúdo: simulação visual de um checkout REAL com bordas tracejadas (border-2 border-dashed) que muda conforme controles.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Comportamento responsivo do preview',
            body:
              'Quando deviceType="mobile", o container do preview ganha className "max-w-sm mx-auto" — limita largura e centraliza, simulando uma tela mobile mesmo em desktop. Para outros dispositivos, ocupa largura toda.',
          },
          {
            type: 'subsection',
            title: 'Estrutura do checkout simulado',
            children: [
              {
                type: 'list',
                items: [
                  'Header verde PagSmile (#2bc196) com texto "Finalizar Compra" + "Total: R$ 150,00"',
                  'Lista de métodos de pagamento — renderizada via methodsOrder.map. PRIMEIRO método tem border-2 verde + bg verde-translúcido + Badge "Recomendado" (ícone-only)',
                  'Para cada método: ícone (QrCode para PIX / CreditCard para crédito/débito) + label + meta-info contextual',
                  'Para PIX (se pixDiscount>0): texto verde "X% de desconto • R$ Y" — calcula valor final em tempo real (150 * (1-pixDiscount/100))',
                  'Para Crédito (se showInstallments=true): texto cinza "Até 12x sem juros"',
                  'Se layout==="1-step": linha divisória + 2 inputs (Email obrigatório / Telefone opcional). Telefone OCULTO se hideOptionalFields=true',
                  'Botão CTA verde grande (h-12) com texto buttonText (default "Pagar Agora")',
                ],
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Indicador de rede lenta (warning condicional)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: bloco que SÓ aparece se networkSpeed==="slow". Bg amber-50 com texto "⚠️ Simulando rede lenta - Layout simplificado ativado".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: comunicar visualmente que o agente "fez algo" automaticamente em resposta ao contexto (rede lenta → simplificação automática). Reforça valor da personalização inteligente.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Métricas embaixo do preview (3 cards horizontais)',
            children: [
              {
                type: 'list',
                items: [
                  'Card 1 (verde) — "Taxa de Conversão" + valor `{conversionRate}%`. Recalculado em tempo real',
                  'Card 2 (vermelho) — "Taxa de Abandono" + valor `{abandonRate}%` (calculado como 100 - conversionRate)',
                  'Card 3 (verde PagSmile) — "Lift Estimado" + valor `+{liftPercentage}%`. Comparação vs baseline',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 3 métricas e não só 1: cada uma responde pergunta diferente. Conversão = "quanto vou ganhar?". Abandono = complementar (info redundante mas humanos respondem melhor a "perdi 25%" que "ganhei 75%"). Lift = "vale a pena mudar?". Trinca cobre todos os ângulos.',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. ABA 2 — RESULTADOS A/B
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 2: Resultados A/B',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Aba que mostra HISTÓRICO de testes A/B já rodados, com comparação visual de cada variante e recomendação clara do agente sobre qual implementar.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Justificar decisões de produto com DADOS. "Por que mudamos para PIX First?" → "porque rodamos teste com 12.380 sessões e teve +11.8% lift, declarado vencedor pelo agente."',
      },

      {
        type: 'subsection',
        title: 'Card "Resultados de Experimentos A/B" — Lista de variantes',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Lista de 4 variantes (controle + 3 alternativas) renderizadas como cards empilhados. Cada card muda visualmente conforme status: winner (verde forte com check), positive (azul claro), baseline (cinza neutro).',
          },
          {
            type: 'list',
            items: [
              '"Controle (2-steps)" — status="baseline" — 68% conversão, 12.450 sessões. Sem badge de lift. Borda cinza',
              '"PIX First" — status="winner" — 76% conversão, 12.380 sessões. Lift "+11.8%". Borda VERDE FORTE + ícone CheckCircle2 em círculo verde + badge verde sólido',
              '"1-Step Layout" — status="positive" — 74%, 12.290 sessões. Lift "+8.8%". Borda azul, badge azul claro',
              '"Campos Reduzidos" — status="positive" — 72%, 12.510 sessões. Lift "+5.9%". Borda azul, badge azul claro',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Cada card: flex justify-between. Esquerda: ícone status (só winner tem) + nome da variante + sub-texto "X sessões". Direita: valor de conversão grande bold + Badge de lift (se aplicável). Embaixo: Progress bar h-2 com value=conversion (mostra ranking visual).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE só "winner" tem ícone destacado: enfatizar a recomendação. Todas as outras são "competidoras". O ícone CheckCircle2 + cor forte cria foco visual no que importa: a variante a implementar.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Recomendação do Agente (caixa verde no fim)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: bloco verde claro (bg-green-50 + border-green-200) com ícone Sparkles + título "Recomendação do Converter Agent" + texto explicativo com valor estimado em destaque negrito.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Texto exemplo: "Implementar variante PIX First como padrão. Estimativa de aumento de receita: R$ 23.450/mês". Apresenta o INSIGHT + AÇÃO + IMPACTO MONETIZADO. Trinca convence.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE valor monetizado: gestores tomam decisão por dinheiro, não por percentual. "+11.8% lift" é abstrato; "R$ 23.450/mês" é dimensionável (cabem 5 funcionários novos? cobre a campanha de Black Friday?).',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card "Performance por Dispositivo"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: lista de 3 linhas (Mobile/Desktop/Tablet). Cada linha em bg cinza claro com ícone do dispositivo em quadrado + nome + "X% tráfego" + Badge verde com conversão + Progress bar h-2.',
          },
          {
            type: 'list',
            items: [
              'Mobile — 68% tráfego, 72% conversão, trend up',
              'Desktop — 28% tráfego, 82% conversão, trend stable',
              'Tablet — 4% tráfego, 76% conversão, trend up',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 INSIGHT que a tabela revela: mobile domina volume (68%) mas converte MENOS (72% vs 82% desktop). Pequenos ganhos em mobile = grandes ganhos absolutos. Justifica priorizar otimização mobile.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. ABA 3 — INSIGHTS DE UX
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 3: Insights de UX',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Aba descobertista. Mostra padrões e oportunidades em formato narrativo curto. Layout grid 1/2 colunas com 2 cards: "Funil de Abandono" (esquerda) + "Insights de UX" (direita).',
      },

      {
        type: 'subsection',
        title: 'Card "Funil de Abandono" (visualização horizontal)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Funil visualizado como barras horizontais decrescentes (uma por etapa). Cada etapa: label + percentual à direita + barra colorida com gradiente verde-PagSmile + número absoluto branco no fim da barra.',
          },
          {
            type: 'list',
            items: [
              '"Início Checkout" — 10.000 — 100% (largura 100%)',
              '"Seleção Método" — 8.500 — 85%',
              '"Preenchimento" — 7.200 — 72%',
              '"Confirmação" — 6.800 — 68%',
              '"Pagamento" — 7.420 — 74.2%',
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Anomalia interessante no funil',
            body:
              'Note que "Pagamento" (74.2%) é MAIOR que "Confirmação" (68%). Isso parece estranho mas reflete dado mockado — em funis reais sempre é monotônico decrescente. Provavelmente é um erro nos mock OU representa visitantes que pulam etapa de confirmação.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Cada barra: bg-slate-100 base + div interno com largura `(step.value / funnelData[0].value) * 100%` + bg-gradient-to-r from-[#2bc196] to-[#5cf7cf]. Texto branco bold com número à direita.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE barras horizontais e não funil tradicional (trapézios): barras horizontais permitem comparação fácil de "X% perdeu daqui pra cá" e cabem todos os labels na esquerda. Trapézios são bonitos mas dificultam leitura.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card "Insights de UX" (3 cards coloridos)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              '3 mini-cards verticais empilhados, cada um com cor temática + emoji + título destacado + texto explicativo curto.',
          },
          {
            type: 'list',
            items: [
              'Card VERDE "✅ Maior impacto" — "PIX como primeiro método aumentou conversão em 12% em mobile". Reforço positivo do que já está funcionando',
              'Card ÂMBAR "⚠️ Oportunidade" — "Mobile tem 68% do tráfego mas menor conversão. Priorize otimização." Aponta gap a explorar',
              'Card AZUL "💡 Sugestão" — "Remover campo telefone reduziu abandono em 5.2% na etapa de preenchimento". Recomendação concreta',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 3 categorias semânticas (impacto/oportunidade/sugestão): força o agente a balancear feedback. Só pontos positivos = complacência. Só negativos = paralisia. Mistura = motiva ação.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 7. ABA 4 — PERSONALIZAÇÃO
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 4: Personalização',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Aba de regras de personalização DINÂMICA — cada regra é um "se contexto X, então faça Y". Lista vertical de 5 regras, cada uma com switch para ativar/desativar.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Automatizar o que humano não consegue fazer em escala. "Se mobile BR, mostre PIX primeiro" = aplica a milhões de visitantes sem intervenção. Cada regra documenta a lógica + impacto medido + estado on/off.',
      },
      {
        type: 'list',
        items: [
          '"Mobile BR" → "PIX primeiro" — impacto +12% — ATIVA',
          '"Desktop B2B" → "Cartão corporativo" — impacto +8% — ATIVA',
          '"Rede lenta" → "Layout simplificado" — impacto -45% abandono — ATIVA',
          '"Cliente recorrente" → "Método salvo" — impacto +25% velocidade — ATIVA',
          '"Ticket > R$ 500" → "Parcelamento destacado" — impacto +18% — INATIVA',
        ],
      },
      {
        type: 'paragraph',
        text:
          '📐 Cada regra: card flex justify-between em lg:p-4. Esquerda: ícone Target verde (se ativa) ou cinza (se inativa) + condition em bold + action em cinza embaixo. Direita: Badge com impacto (verde se ativa, cinza se inativa) + Switch para toggle.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE permitir desativar regras (Switch em vez de só "deletar"): regras mudam de utilidade conforme negócio. Black Friday pode querer DESLIGAR algumas. Ter histórico fácil de re-ativar é valioso.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE mostrar impacto em badge: cada regra tem custo computacional (mais regras = checkout mais lento de renderizar). Saber qual gera +12% e qual gera +8% ajuda a decidir manter ou descartar.',
      },
    ],
  },

  // ===========================================================================
  // 8. CHAT FLUTUANTE
  // ===========================================================================
  {
    type: 'section',
    title: 'AgentFloatingButton + AgentChatInterface',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Botão flutuante (Floating Action Button) no canto inferior direito que abre painel de chat com o agente. Componentes reutilizáveis: AgentFloatingButton (o botão) + AgentChatInterface (o painel).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Conversar diretamente com o agente. Chat permite perguntas livres ("qual minha taxa de conversão hoje?", "como melhorar PIX em desktop?") que não cabem em controles fixos. IA gera resposta personalizada.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Props passadas: agentName="converter_agent", agentDisplayName="Converter Agent", quickPrompts (array de prompts pré-formatados), onProcessMessage=processConverterAgentMessage (handler de IA), welcomeMessage acolhedor, accentColor="#3b82f6" (azul Converter).',
      },
      {
        type: 'paragraph',
        text:
          '📐 Estado: isChatOpen + isFullscreen. Botão flutuante alterna isChatOpen. Dentro do chat, há botão para alternar isFullscreen (vira ocupando tela inteira).',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Documentação detalhada do chat',
        body:
          'Os componentes AgentChatInterface e AgentFloatingButton são reutilizados por todos os agentes (DIA, Helena, Origination, Recovery, Identity Onboarder etc.). A documentação detalhada do CHAT em si será feita uma vez na entrega 13 (Agentes IA do Admin Sub).',
      },
    ],
  },
];

// =============================================================================
// PÁGINA 3: /ConverterAgentSettings
// =============================================================================

export const ConverterAgentSettingsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página de Configurações',
    body:
      'Página dedicada de configurações do Converter Agent. Acessada via botão "Configurar" no header da página /ConverterAgent ou diretamente via URL. Contém 4 abas que cobrem: comportamento geral, regras de experimentos A/B, regras de personalização dinâmica, e canais de notificação.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      'Calibrar o agente conforme apetite ao risco do merchant. Quanto autonomia dar à IA? Aplicar mudanças automaticamente? Que volume mínimo de amostra para confiar num resultado? Quando alertar humano? Página resolve essas escolhas centralizando todos os "knobs".',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Quem usa',
    body:
      'Tipicamente admin/gestor do merchant (não usuário comum). Configuração é definida uma vez e raramente alterada — diferente da página principal que é usada com frequência.',
  },

  // ===========================================================================
  // 1. HEADER (com botão Voltar)
  // ===========================================================================
  {
    type: 'section',
    title: 'Header da página',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Composição',
        body:
          'Header customizado (não usa PageHeader padrão). Linha horizontal com 2 grupos: ESQUERDA = botão Voltar + ícone do agente + títulos. DIREITA = botões Resetar e Salvar.',
      },
      {
        type: 'subsection',
        title: 'Botão Voltar (ícone ArrowLeft)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: navegação rápida de volta para /ConverterAgent. Botão ghost icon-only com ícone ArrowLeft. Padrão "drill-down navigation" — em sub-páginas, sempre oferecer caminho de volta.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Resetar"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: voltar todas as configurações ao default. Útil se merchant fez mudanças desastrosas e quer recomeçar. Sem handler na implementação atual.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: variant outline com ícone RotateCcw + label. Versão final esperada: confirmação modal antes de resetar (ação destrutiva).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Salvar" (azul primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: persiste as configurações. Versão atual chama alert("Configurações salvas com sucesso!") — é placeholder. Versão final invoca função de backend para gravar em DisputeAgentConfig (ou entidade equivalente para Converter).',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: bg-blue-600 + ícone Save + label "Salvar". Cor azul reflete identidade do agente (cada agente tem sua cor; Converter = azul).',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. ESTRUTURA DE 4 ABAS
  // ===========================================================================
  {
    type: 'section',
    title: 'TabsList (4 abas grid full-width)',
    children: [
      {
        type: 'list',
        items: [
          '"Geral" (default) — comportamento global do agente',
          '"Experimentos" — regras de execução de testes A/B',
          '"Personalização" — regras de adaptação dinâmica e seu master switch',
          '"Notificações" — canais e thresholds de alertas',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE essa ordem: Geral é "fundação" (decide se agente está ligado). Experimentos define como ele aprende. Personalização define como ele aplica aprendizado. Notificações fecham com como humanos são informados. Sequência narrativa lógica.',
      },
    ],
  },

  // ===========================================================================
  // 3. ABA "GERAL"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 1: Geral (3 controles)',
    children: [
      {
        type: 'subsection',
        title: 'Toggle "Agente Ativo"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: master switch global. Quando OFF, agente para de fazer tudo (análises, otimizações automáticas, testes). Equivale a "modo manutenção".',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: card com border + Label grande "Agente Ativo" + descrição cinza pequena + Switch à direita.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: emergência ou auditoria. Se algo deu errado e merchant quer congelar tudo, 1 click para off. Versão final esperada: confirmação modal ao desligar (impacto grande).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Toggle "Aplicar Vencedores Automaticamente"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: quando true, ao terminar um teste A/B com vencedor estatisticamente significativo, o agente IMPLEMENTA a variante vencedora sem pedir aprovação. Quando false (default), apenas notifica e espera ação humana.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE default false: autonomia da IA é poderosa MAS arriscada. Em produção, mudar checkout sem revisão humana pode quebrar fluxos críticos. Conservador por default; merchant decide quando confiar.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Slider "Nível de Confiança Estatística"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: define o threshold de p-value para declarar vencedor. Range 90-99%. Default 95% (padrão de mercado).',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: Slider min=90, max=99, step=1. À direita: número grande w-16 com "{value}%". Texto explicativo embaixo: "Maior confiança = menos falsos positivos, mas testes mais longos".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE permitir mexer: 95% é padrão mas alguns merchants com tráfego baixo podem aceitar 90% (decidir mais rápido com mais risco). Enterprise com volume gigante pode subir para 99% (decisões mais lentas mas mais sólidas). Customização vale.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 4. ABA "EXPERIMENTOS"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 2: Experimentos (4 controles)',
    children: [
      {
        type: 'subsection',
        title: 'Select "Máximo de Testes Simultâneos"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: limite de quantos testes A/B podem rodar em paralelo. 4 opções: 1 / 2 / 3 (default) / 5.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE limitar: testes simultâneos podem CONFLITAR estatisticamente — um teste pode "contaminar" outro (mesmo usuário cai em variantes de testes diferentes). 3 simultâneos é equilíbrio entre velocidade de descoberta e validade científica.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Input "Tamanho Mínimo da Amostra"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: número mínimo de conversões antes de declarar vencedor. Default 1000.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 1000: estatisticamente, 1000 conversões permite detectar lifts de ~3% com 95% de confiança. Menos que isso = ruído. Merchants pequenos podem aumentar (mais paciência) ou diminuir (mais risco).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Slider "Duração Mínima do Teste (dias)"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: dias mínimos antes de finalizar teste, mesmo que amostra já seja suficiente. Default 7 dias. Range 3-30.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 7 dias mínimo: capturar ciclo semanal completo (Seg-Dom). Tráfego e comportamento variam ciclicamente — amostra menor pode "vencer" só por estar testando em dias mais favoráveis.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Toggle "Parar Variantes Perdedoras"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: quando true, encerra precocemente variantes que estão claramente perdendo (early stopping). Reduz "perda" durante o teste.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE útil: sem isso, variante ruim continua recebendo 50% do tráfego até fim do teste — afundando conversão e receita. Com isso, agente realoca tráfego para a vencedora assim que confiança é estatisticamente alta.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. ABA "PERSONALIZAÇÃO"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 3: Personalização (master + 3 regras)',
    children: [
      {
        type: 'subsection',
        title: 'Master Switch "Personalização Dinâmica"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: liga/desliga TODAS as regras de personalização de uma vez. Quando OFF, as 3 regras abaixo ficam disabled (cinza, switch trancado).',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: card com border + ícone Zap azul + Label grande + Switch. Acima das 3 regras com bg-slate-50 (que ficam visualmente "abaixo" do master).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE master switch: ergonomia. Em vez de desligar 3 switches separados quando merchant quer pausar tudo, 1 master switch faz o serviço. E indica hierarquia de controle.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Regra 1 — "PIX Primeiro em Mobile"',
        children: [
          {
            type: 'list',
            items: [
              'Ícone Smartphone cinza',
              'Label + descrição "Prioriza PIX para usuários mobile brasileiros"',
              'Badge verde "+12% conv." mostrando impacto histórico',
              'Switch — disabled se master OFF',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 IMPACTO REAL: mobile BR converte muito mais com PIX (preferência cultural + facilidade de pagar pelo bank app já aberto). +12% é número conservador baseado em dados de mercado.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Regra 2 — "Layout Simplificado em Rede Lenta"',
        children: [
          {
            type: 'list',
            items: [
              'Ícone Clock cinza',
              'Descrição "Reduz elementos para conexões lentas"',
              'Badge verde "-45% abandono"',
              'Switch — disabled se master OFF',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 IMPACTO REAL: -45% no abandono é número EXPRESSIVO — reflete que rede lenta + checkout pesado = morte da conversão. Simplificação automática salva muito dinheiro nesses casos.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Regra 3 — "Método Salvo para Recorrentes"',
        children: [
          {
            type: 'list',
            items: [
              'Ícone Target cinza',
              'Descrição "Pré-seleciona último método usado"',
              'Badge verde "+25% veloc." (velocidade de checkout)',
              'Switch — disabled se master OFF',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 IMPACTO: cliente recorrente que NÃO precisa selecionar método novamente economiza tempo. +25% de velocidade reduz fricção e aumenta probabilidade de finalizar (cliente desistir do checkout cai com cada segundo a menos).',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. ABA "NOTIFICAÇÕES"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 4: Notificações (3 canais)',
    children: [
      {
        type: 'subsection',
        title: 'Notificação 1 — "Teste Concluído"',
        children: [
          {
            type: 'list',
            items: [
              'Ícone CheckCircle2 verde',
              'Label + descrição "Notificar quando um teste A/B finalizar"',
              'Switch simples (sem threshold ajustável)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: gestor quer saber quando seu teste acabou para olhar resultado. Default ON.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Notificação 2 — "Lift Significativo Detectado" (com threshold)',
        children: [
          {
            type: 'list',
            items: [
              'Ícone TrendingUp azul',
              'Label + descrição "Quando uma variante supera o threshold"',
              'Input numérico w-20 com valor + "%" — define o threshold de lift',
              'Switch para ligar/desligar a notificação',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Detalhe interessante: o input numérico fica DISABLED se notifySignificantLift=false. Coerência de UI: não faz sentido editar threshold se a notificação está desligada.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: descobrir DURANTE o teste algo notável. "Variante já passou +5% após 1 dia? Algo está acontecendo, vale olhar antes do fim."',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Notificação 3 — "Queda de Conversão" (com threshold)',
        children: [
          {
            type: 'list',
            items: [
              'Ícone AlertTriangle vermelho — visual de alerta',
              'Label + descrição "Alerta quando conversão cair significativamente"',
              'Input numérico para threshold de queda + "%"',
              'Switch',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: detectar problemas REGRESSIVOS. Algo quebrou no checkout? Provedor antifraude começou a recusar tudo? Bug deploy? Alerta proativo de "queda anormal" reduz tempo de detecção de horas para minutos.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 10% default: queda de 1-5% é ruído. 10%+ indica problema real. Threshold permite calibrar: merchant grande pode querer 5% (alta sensibilidade); pequeno pode querer 20% (evitar falsos alarmes).',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 7. PADRÕES TRANSVERSAIS
  // ===========================================================================
  {
    type: 'section',
    title: 'Padrões transversais às 4 abas',
    children: [
      {
        type: 'list',
        items: [
          'Cada controle é envelopado em "card with border" + label grande + descrição cinza pequena explicando o que faz',
          'Switches sempre à direita (convenção)',
          'Inputs numéricos com largura w-20 (pequena) para não dominar visualmente',
          'Texto auxiliar (text-xs slate-500) abaixo de sliders e inputs explicando trade-offs',
          'Espaço vertical (space-y-4 / space-y-6) generoso entre controles para evitar densidade visual',
          'Disabled states semanticamente conectados (controle dependente fica disabled se master toggle off)',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE descrição embaixo de cada label: configurações de IA são DESCONHECIDAS para a maioria dos usuários. Auto-explicação reduz tickets de suporte e medo de mexer. Custo: mais texto na tela. Benefício: confiança do usuário.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Persistência: ao clicar Salvar, todas as 16 configurações da `settings` são gravadas. A entidade que armazena pode ser nova (ConverterAgentConfig) ou compartilhada com outros agentes. Implementação atual: apenas alert() — funcionalidade de persistência em iteração futura.',
      },
    ],
  },
];