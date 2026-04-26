// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Módulo Cupons e Descontos (Admin Sub)
// Páginas: /CouponsOverview, /CouponList, /CouponForm, /CouponDetail
// =============================================================================

// =============================================================================
// PÁGINA 1: /CouponsOverview (Dashboard)
// =============================================================================

export const CouponsOverviewDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Visão Geral de Cupons',
    body:
      'Dashboard analítico/executivo do módulo de cupons. Diferente de /CouponList (operacional) e /CouponForm (criação), aqui o foco é INTELIGÊNCIA: quanto descontando vs receita gerada, quais cupons performam melhor, distribuição por tipo/status, evolução temporal.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) JUSTIFICAR ROI: provar que descontos geram receita líquida acima da despesa; (2) DETECTAR PROBLEMAS: cupons fraudulentos, taxa anormal; (3) CALIBRAR FUTURAS CAMPANHAS: ver qual modelo (% vs fixo) funciona; (4) APRESENTAR RESULTADOS em reuniões.',
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'Implementação atual',
    body:
      'Página usa dados MOCKADOS (mockCoupons + mockCouponUsageOverTime). Cálculos client-side em cima do mock. Versão final puxará da entidade Coupon.',
  },

  {
    type: 'section',
    title: '1. PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Ícone TicketPercent + título "Cupons e Descontos" + subtítulo. Breadcrumb "Dashboard › Cupons e Descontos". À direita: 1 botão de ação primária.',
      },
      {
        type: 'subsection',
        title: 'Botão "Criar Novo Cupom" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Link para /CouponForm (sem id = modo criação). Botão padrão. Ícone Plus + label.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: ação primária. Dashboard motiva ação — "vejo dados, quero criar mais".',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. Grid de 5 KPIs',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Composição',
        body:
          'Grid responsivo (1/2/5 colunas). Cada card pt-6 com ícone temático em quadrado p-3 + bg-color/10 + text-color (cor distinta por KPI).',
      },
      {
        type: 'list',
        items: [
          'KPI 1 "Cupons Ativos" — Tag (emerald). Filtra status==="active" e mostra .length',
          'KPI 2 "Total em Descontos" — DollarSign (red). Soma total_discount_given. CUSTO bruto. Vermelho pois é despesa',
          'KPI 3 "Receita Gerada" — TrendingUp (blue). Soma total_revenue_generated. Receita BRUTA atribuível',
          'KPI 4 "Utilizações Totais" — Hash (purple). Soma times_used. Locale-formatted (1.234)',
          'KPI 5 "Cupons Nominais" — Users (amber). Cupons restritos a 1 e-mail. Diferencial de produto',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE 5 KPIs (não 4): número ímpar incomum, mas proposital — "Cupons Nominais" é diferencial e merece destaque.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 NUANCE: "Receita Gerada" pode ter VIEZ — se cliente ia comprar de qualquer forma, cupom não "gerou"; só reduziu receita. Versão analítica avançada teria modelo de incrementalidade.',
      },
    ],
  },

  {
    type: 'section',
    title: '3. Grid 2x2 de Gráficos',
    children: [
      {
        type: 'subsection',
        title: 'Gráfico 1 — "Desconto vs. Receita ao Longo do Tempo" (LineChart)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 LineChart duplo (height 280) com 2 séries: receita verde #2bc196 e desconto vermelho #ef4444. Eixo X = month, Eixo Y formatado "R$Xk".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: ver TENDÊNCIA. Ambas crescem juntas → saudável. Desconto cresce e receita estabiliza → cupons CANIBALIZANDO vendas.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Gráfico 2 — "Top 5 Cupons por Receita" (BarChart horizontal)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Barras HORIZONTAIS com 5 cupons rankeados por receita. Cada cupom = 2 barras: receita verde + desconto azul.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE horizontal: códigos de cupom cabem mal em vertical. Horizontal permite ver nome inteiro à esquerda.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 2 séries: ver eficiência relativa. Receita 5x maior que desconto = ouro. Receita similar = problema.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Gráfico 3 — "Distribuição por Tipo" (PieChart)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Pizza inteira (height 250, outerRadius 90, sem innerRadius). 2 fatias: Percentual (verde #2bc196) + Valor Fixo (azul #3b82f6). Label customizado mostra "name: value".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: descobrir preferência da casa. Percentual = melhor para tickets variados. Fixo = melhor para preço único.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Gráfico 4 — "Distribuição por Status" (PieChart)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Pizza com 4 fatias coloridas semanticamente: Ativos (verde), Inativos (cinza), Expirados (laranja), Esgotados (vermelho).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: monitorar HIGIENE. Muitos "Expirados" = catálogo desatualizado. Muitos "Inativos" = trabalho desperdiçado.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '4. Card "Cupons Recentes"',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Card largura total mostra 5 cupons mais recentes. Cada item clicável leva para CouponDetail.',
      },
      {
        type: 'list',
        items: [
          'CardHeader: title + Link "Ver Todos" (Button outline) com ícone ArrowRight para /CouponList',
          'Cada item: Link envolvendo div clicável. Hover bg-slate-50',
          'Esquerda: quadrado p-2 colorido por tipo (percentage=roxo+ícone Percent / fixed_amount=azul+ícone DollarSign) + bloco texto com código font-mono + Badge "Nominal" se aplicável + nome em texto pequeno',
          'Direita: 3 colunas com responsividade progressiva: "Usos" X/Y (oculta em mobile via hidden sm:block), "Receita" formatCurrency verde-esmeralda (oculta em md hidden md:block), Badge de status',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE colunas progressivamente ocultas: em mobile cabe pouco. Mantém-se sempre código + nome + status. "Usos" some primeiro, "Receita" depois.',
      },
    ],
  },
];

// =============================================================================
// PÁGINA 2: /CouponList
// =============================================================================

export const CouponListDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Lista de Cupons',
    body:
      'Tabela operacional para gerenciar TODOS os cupons. Foco em ação: filtrar, encontrar, executar (editar, copiar código/link, ativar/desativar, excluir).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) ENCONTRAR cupom específico (busca + 3 filtros); (2) AGIR EM LOTE (futuro); (3) MIGRAR CUPONS (exportar CSV); (4) ATALHOS RÁPIDOS (copiar código sem entrar no detalhe).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Diferença vs CouponsOverview',
    body:
      'Overview = ANALÍTICO (charts). List = OPERACIONAL (tabela densa, filtros, ações por linha). Complementares: insight no dashboard → ação na lista.',
  },

  {
    type: 'section',
    title: '1. PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Título "Lista de Cupons" + breadcrumb 3 níveis "Dashboard › Cupons e Descontos › Lista de Cupons". À direita: 2 botões.',
      },
      {
        type: 'subsection',
        title: 'Botão "Exportar CSV" (outline)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Exporta lista filtrada como CSV. Versão atual sem handler. Para análises externas (Excel, Sheets), relatórios para parceiros, contabilidade.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Posicionado ANTES de "Criar Cupom" — convenção: utilitário antes da ação primária.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Criar Cupom" (verde, size sm)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Link para /CouponForm. POR QUE size sm e não default: economia de espaço no header. Em /CouponsOverview o botão é maior (CTA de dashboard).',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. Card único contendo filtros + tabela',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Estrutura: TODO conteúdo principal está dentro de UM Card. CardHeader = filtros. CardContent = Table.',
      },
      {
        type: 'subsection',
        title: '2.A — CardHeader: Filtros',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 flex (column em mobile, row em desktop). Esquerda: input busca flex-1. Direita: 3 Selects.',
          },
          {
            type: 'subsection',
            title: 'Input de busca (com ícone Search)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Busca em 3 campos: code, name, assigned_to_email. Case-insensitive. Placeholder "Buscar por código, nome ou e-mail...".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 3 campos: gestor lembra do código (DESCONTO10), nome ("Aniversário 2025") OU para nominais busca por joao@gmail.com. Cobre 3 caminhos mentais.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Select "Status" (5 opções)',
            children: [
              {
                type: 'list',
                items: [
                  '"Todos Status" (default)',
                  '"Ativos" (active)',
                  '"Inativos" (inactive)',
                  '"Expirados" (expired)',
                  '"Esgotados" (depleted)',
                ],
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Select "Tipo" (3 opções)',
            children: [
              {
                type: 'list',
                items: [
                  '"Todos Tipos" (default)',
                  '"Percentual" — desconto em %',
                  '"Valor Fixo" — desconto em R$',
                ],
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Select "Escopo" (3 opções)',
            children: [
              {
                type: 'list',
                items: [
                  '"Todos" (default)',
                  '"Nominais" — cupons individualizados (1 cliente)',
                  '"Gerais" — cupons massivos (qualquer cliente)',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE filtro de Escopo: gestão de NOMINAIS é DIFERENTE — cada um tem destinatário, follow-up, link único, prazo. Filtrar permite gestão dedicada.',
              },
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: '2.B — CardContent: Tabela (10 colunas)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 overflow-x-auto + Table do shadcn. 10 colunas para acomodar todo metadata sem cortar info.',
          },
          {
            type: 'list',
            items: [
              'Coluna 1 "Código" — span font-mono bold + Badge "Nominal" com Mail icon (se is_nominal). Linha auxiliar text-[11px] com assigned_to_email se houver',
              'Coluna 2 "Nome" — max-w-[200px] truncate. Tooltip nativo no hover',
              'Coluna 3 "Tipo" — flex gap-1.5 com ícone Percent/DollarSign + texto "Percentual"/"Valor Fixo"',
              'Coluna 4 "Valor" — font-bold. percentage="X%" / fixed_amount=formatCurrency. Centro de atenção',
              'Coluna 5 "Status" — Badge com variant mapeado (default/secondary/destructive/outline)',
              'Coluna 6 "Usos" (text-center) — span font-semibold + se há usage_limit_total: "/Y" cinza-400',
              'Coluna 7 "Desconto" (text-right) — VERMELHO. Soma total. Cor reflete despesa',
              'Coluna 8 "Receita" (text-right) — VERDE-ESMERALDA. Cor reforça receita positiva',
              'Coluna 9 "Validade" — bloco vertical 2 linhas: data início pt-BR + (se end_date) "até DD/MM/YYYY" cinza',
              'Coluna 10 "Ações" (text-right) — DropdownMenu (3 pontos)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE Desconto e Receita LADO A LADO em cores opostas: comparação instantânea. Olho compara visualmente: receita > desconto = saudável.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE font-mono no código: códigos como "SAVE20" são técnicos. Mono é machine-friendly, evita ambiguidades (O vs 0, I vs 1).',
          },
          {
            type: 'subsection',
            title: 'Dropdown de ações (7 itens)',
            children: [
              {
                type: 'list',
                items: [
                  '"Ver Detalhes" (Eye) — Link para /CouponDetail?id=X',
                  '"Editar" (Pencil) — Link para /CouponForm?id=X',
                  '"Copiar Código" (Copy) — clipboard.writeText(code)',
                  '"Copiar Link" (LinkIcon) — APENAS se generated_link existe (cupons nominais)',
                  'Separador',
                  '"Desativar"/"Ativar" (Power) — texto âmbar se ativo (vai desativar), verde se inativo. Hint visual',
                  '"Excluir" (Trash2) — texto vermelho. Destrutivo',
                ],
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Estado vazio',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 TableRow com colSpan={10} + texto centralizado: "Nenhum cupom encontrado com os filtros aplicados.". Genérico (não distingue zero cupons vs filtros vazios).',
              },
            ],
          },
        ],
      },
    ],
  },
];

// =============================================================================
// PÁGINA 3: /CouponForm
// =============================================================================

export const CouponFormDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Criar / Editar Cupom',
    body:
      'Formulário completo de cupom. Dual-mode: NOVO ou EDIÇÃO (com ?id=). Layout 2 colunas: 2/3 form principal (5 cards verticais) + 1/3 Cupom Nominal + Preview ao vivo.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que layout 2 colunas e não wizard',
    body:
      'Cupom tem ~15 campos (menos que PaymentLink). Cabe em 1 tela rolável. Wizard seria overkill. Coluna principal = sequência lógica natural. Coluna lateral = recursos auxiliares contextuais.',
  },

  {
    type: 'section',
    title: '1. PageHeader (dinâmico por modo)',
    children: [
      {
        type: 'list',
        items: [
          'CRIAÇÃO: title="Criar Novo Cupom"',
          'EDIÇÃO: title="Editar Cupom", subtitle=`Editando: ${form.code}`',
          'Ícone TicketPercent. Breadcrumb 3 níveis',
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Cancelar" (outline)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Link para /CouponList. Não confirma alterações não salvas (limitação UX).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Salvar Cupom" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Versão atual: alert + redirect via window.location.href. Implementação real: base44.entities.Coupon.create/update. Ícone Save + label.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LIMITAÇÃO ATUAL: NÃO valida campos obrigatórios antes de salvar (code, name, value, start_date). Versão final adicionará validações + foco no campo.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. Layout 2 Colunas',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Grid lg:grid-cols-3 gap-6. Esquerda lg:col-span-2 (66%) com 5 cards. Direita lg:col-span-1 (33%) com Cupom Nominal + Preview.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Mobile: empilha. Botão Salvar duplicado (lg:hidden) garante CTA acessível sem scroll-up.',
      },
    ],
  },

  {
    type: 'section',
    title: '3. Coluna Esquerda — 5 Cards',
    children: [
      {
        type: 'subsection',
        title: 'Card 1: Informações Básicas',
        children: [
          {
            type: 'subsection',
            title: 'Campo "Código do Cupom *" (com botão de gerador)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Linha flex gap-2: Input font-mono + Button outline icon (Shuffle).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 onChange CONVERTE PARA UPPERCASE: e.target.value.toUpperCase(). Garante padrão "DESCONTO10".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE uppercase forçado: convenção de mercado (cupons sempre maiúsculos). Reduz erros de case-sensitivity.',
              },
              {
                type: 'subsection',
                title: 'Botão Shuffle (gerador aleatório)',
                children: [
                  {
                    type: 'paragraph',
                    text:
                      '🎯 generateRandomCode() — string de 8 caracteres alfanuméricos (A-Z, 0-9). Substitui o valor atual. Title="Gerar código aleatório" (tooltip nativo).',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 PARA QUE SERVE: cupons NÃO-MEMORIZÁVEIS (anti-abuse, individuais). Códigos como "X7K9PM3R" impossíveis de adivinhar.',
                  },
                ],
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo "Nome do Cupom *"',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Descrição interna humana ("10% OFF Primeira Compra"). Aparece em listagens internas para gestor identificar no contexto.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 DIFERENÇA vs código: código = identificador técnico (cliente digita). Nome = legenda interna (gestor lê).',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo "Descrição / Termos de Uso" (Textarea rows=3)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Documentar restrições legais ("válido apenas para clientes novos", "não cumulativo com frete grátis"). Pode ser exibido em página pública do cupom.',
              },
            ],
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 2: Detalhes do Desconto',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 CardTitle muda ÍCONE conforme tipo: Percent ou DollarSign. Detalhe sutil que reforça contexto.',
          },
          {
            type: 'subsection',
            title: 'Select "Tipo de Desconto *" (2 opções com ícones)',
            children: [
              {
                type: 'list',
                items: [
                  'PERCENTUAL (%) — proporcional. Cresce com ticket',
                  'VALOR FIXO (R$) — absoluto. Não cresce com ticket',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 2 modalidades: Percentual = melhor margem em ticket alto. Fixo = melhor para "queimar" produto barato (R$50 numa camiseta R$80 = enorme; em smartphone R$2000 = irrisório).',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo "Valor do Desconto *" (com prefixo dinâmico)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Input number com SPAN absolute esquerda mostrando "%" ou "R$" conforme tipo. Padding-left 10.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE prefixo dinâmico: feedback visual instantâneo. Sem isso, usuário poderia digitar "1500" achando 15%.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo "Valor Mínimo da Compra"',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Forçar ticket mínimo. Ex: "10% OFF acima de R$200". Garante volume; protege margem. Prefixo "R$" fixo.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo "Desconto Máximo (teto)" — APENAS percentage',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Campo CONDICIONAL — só renderiza se type==="percentage". Em fixed_amount não faz sentido.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: limitar exposição em tickets altos. Sem teto, "10% OFF" em compra R$5000 daria R$500 — pode quebrar margem.',
              },
            ],
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 3: Validade e Limites de Uso',
        children: [
          {
            type: 'subsection',
            title: 'Datas (start_date e end_date — datetime-local)',
            children: [
              {
                type: 'list',
                items: [
                  'Data de Início * — quando passa a valer',
                  'Data de Expiração (opcional) — após, status="expired" automaticamente',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE datetime-local: cupons podem ter precisão de horário ("válido até 23:59 do dia 15/05"). Importante para Black Friday.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Em modo edição, backend retorna ISO completo, mas datetime-local input quer "YYYY-MM-DDTHH:mm". Por isso useEffect faz coupon.start_date.slice(0, 16).',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Limites de uso (2 inputs)',
            children: [
              {
                type: 'list',
                items: [
                  'Limite TOTAL — somado por todos os clientes. Ex: 100 = primeiros 100 ganham, depois esgota',
                  'Limite POR Cliente — quantas vezes UM cliente pode usar. Default 1 (cupom novo). Pode ser 5 (programa fidelidade)',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 2 limites: Total = orçamento da campanha. Por cliente = anti-abuse (impedir 1 cliente comprar 100x). Placeholders "Sem limite".',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Toggle "Empilhável com outros descontos"',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 is_stackable. Container bg-slate-50 com texto + Switch. Default false.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE default false: stacking pode QUEBRAR margem. Ex: 10% off cumulativo com Black Friday 30% = 37% off. Conservador por padrão.',
              },
            ],
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 4: CouponLinkBinding (componente externo)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 components/coupons/CouponLinkBinding recebe form + update. Encapsula lógica de vincular cupom a PaymentLinks específicos OU Checkouts específicos OU "todos".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: definir ESCOPO no nível de canal. Cupom em UM link específico (campanha exclusiva) ou em qualquer checkout (genérico).',
          },
          {
            type: 'paragraph',
            text:
              '📐 Campos: link_scope ("all"/"specific"), linked_payment_link_ids[], linked_checkout_ids[].',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 5: Escopo de Aplicação',
        children: [
          {
            type: 'subsection',
            title: 'Select "Aplicável a" (4 opções)',
            children: [
              {
                type: 'list',
                items: [
                  '"Todos os Produtos" (default) — universal',
                  '"Produtos Específicos" — restringe a SKUs',
                  '"Categorias Específicas" — restringe a categorias',
                  '"Planos de Assinatura" — restringe a planos',
                ],
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo condicional "Itens" (apenas se != all_products)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Input livre que aceita strings separadas por vírgula. Ao salvar: split(",").map(trim).filter(Boolean). Label dinâmica: "Produtos"/"Categorias"/"Planos".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 LIMITAÇÃO: input livre. Versão final espera autocompletar buscando produtos/categorias do catálogo.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '4. Coluna Direita — Cupom Nominal + Preview',
    children: [
      {
        type: 'subsection',
        title: 'Card "Cupom Nominal"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que existe',
            body:
              'Nominais são para: (1) reembolso/cortesia para 1 cliente; (2) campanhas de influencer; (3) onboarding VIP; (4) recuperação de cliente insatisfeito. NÃO devem vazar para o público.',
          },
          {
            type: 'subsection',
            title: 'Toggle "Cupom Nominal/Exclusivo"',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Container bg-purple-50 com border roxa + Switch. Cor roxa identifica recurso ESPECIAL.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 Quando ON, revela 2 campos: e-mail + link auto-gerado.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo "E-mail do Destinatário" (apenas se nominal)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 No checkout, sistema valida e-mail do cliente vs este. Caso contrário, recusa. Input type="email" (validação HTML5 nativa).',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Campo "Link com Cupom Automático" (gerado dinamicamente)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Link derivado: `https://checkout.pagsmile.com/pay/link_auto?coupon=${form.code}`. Renderiza APENAS se is_nominal=true E código preenchido.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: economizar fricção. Cliente clica e cupom já entra automaticamente. Para nominais, UX premium.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Input readonly font-mono pequeno + bg cinza-50 + Button outline icon Copy. Hint: "Envie este link ao cliente - o cupom será aplicado automaticamente no checkout".',
              },
            ],
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card "Pré-visualização" (live preview)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Mock visual de como cupom aparece para cliente. Container central com gradiente verde→azul, borda dashed-2 verde, padding 4.',
          },
          {
            type: 'list',
            items: [
              'CIRCULO branco shadow 16×16 com ícone TicketPercent verde',
              'CÓDIGO em font-mono font-bold text-2xl (ou "CÓDIGO" se vazio)',
              'NOME texto cinza pequeno',
              'VALOR em font-black text-3xl verde — "X% OFF" ou "R$X OFF" (ou "-- OFF")',
              'COMPRA MÍNIMA texto cinza pequeno (apenas se preenchido)',
              'BADGE NOMINAL outline roxo com Mail + e-mail (apenas se nominal+email)',
              'VALIDADE "Válido até DD/MM/YYYY" (apenas se end_date)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE valor em "font-black" 3xl: ELEMENTO MAIS IMPORTANTE. Hierarquia visual reflete realidade do produto.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE borda tracejada (dashed): metáfora visual de "ticket" físico. Convenção universal em design de cupons digitais.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Botão Salvar duplicado (lg:hidden)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Botão width 100% que aparece SOMENTE em mobile. Em mobile, botão Salvar do header pode estar fora da tela após scroll. Botão duplicado garante acessibilidade.',
          },
        ],
      },
    ],
  },
];

// =============================================================================
// PÁGINA 4: /CouponDetail
// =============================================================================

export const CouponDetailDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Detalhe do Cupom',
    body:
      'Tela read-only (com botões de ação) que mostra TUDO sobre 1 cupom: dados completos, KPIs de performance, gráfico de utilização diária, histórico de uso. Página de "deep-dive" — gestor entra para AUDITAR.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) AUDITAR USO: ver quem, quando, quanto. Detectar fraude (1 cliente usando 100x); (2) MEDIR PERFORMANCE: ROI, % do limite usado, tendência diária; (3) DECIDIR: renovar?, ampliar limite?, copiar?, desativar?.',
  },

  {
    type: 'section',
    title: '1. PageHeader (3 botões)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 title=coupon.code, subtitle=coupon.name. Breadcrumb 4 níveis: Dashboard › Cupons e Descontos › Lista de Cupons › CÓDIGO. Profundidade reflete navegação real.',
      },
      {
        type: 'subsection',
        title: 'Botão "Editar" (outline)',
        children: [
          {
            type: 'paragraph',
            text: '🎯 Link para /CouponForm?id=X. Pula para edição. Ícone Pencil.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Desativar" / "Ativar" (cor adaptativa)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Cor TEXTUAL adaptativa: âmbar-600 + border-amber-300 se ativo (ação será DESATIVAR — perigosa); verde + border-emerald se inativo (ação será ATIVAR — positiva).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE cor adaptativa: comunicar IMPACTO. Desativar é destrutivo (clientes não conseguirão mais usar). Cor reforça gravidade.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Excluir" (vermelho)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Ação destrutiva permanente. Versão atual sem handler — espera-se confirmação modal.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. Header Card (cupom em destaque)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Estrutura',
        body:
          'Card largura total. Layout flex (column→row). 2 grupos: identidade (esquerda) + valor (direita).',
      },
      {
        type: 'subsection',
        title: 'Esquerda — Identidade',
        children: [
          {
            type: 'list',
            items: [
              'Quadrado p-4 com gradient (emerald-100 → blue-100) rounded-2xl + ícone TicketPercent grande verde',
              'Linha 1: H2 código font-mono font-black + StatusBadge + (se nominal) Badge "Nominal" outline roxo',
              'Linha 2: descrição em texto cinza',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Direita — Valor do Desconto',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 P em text-4xl font-black verde-esmeralda mostrando "X%" ou "R$ X,XX". Embaixo, label cinza: "de desconto" ou "de desconto fixo".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE valor TÃO grande: atributo MAIS IMPORTANTE. Hierarquia visual deixa claro o "produto".',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '3. Grid de 4 KPIs do Cupom',
    children: [
      {
        type: 'list',
        items: [
          'KPI 1 "Utilizações" — Hash (purple). times_used. Se há limit_total: barra Progress h-1.5 + texto extra "X de Y" text-[10px]',
          'KPI 2 "Total em Descontos" — DollarSign (red). formatCurrency em vermelho. CUSTO específico',
          'KPI 3 "Receita Gerada" — TrendingUp (emerald). Valor em verde. Receita atribuída',
          'KPI 4 "ROI do Cupom" — BarChartIcon (blue). (receita/desconto)*100. Texto extra "receita / desconto" para clarificar',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE Progress em Utilizações: mostra GAP de uso. Bar perto de 100% = cupom esgotando. Útil para AUMENTAR limite antes de esgotar.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE ROI em %: convenção financeira. ROI=200% = R$2 retorno para cada R$1 gasto.',
      },
    ],
  },

  {
    type: 'section',
    title: '4. Layout 1/3 + 2/3 (Detalhes + Charts)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Grid lg:grid-cols-3 gap-6. Esquerda lg:col-span-1 = 3 cards de detalhes (com componente reutilizável InfoRow). Direita lg:col-span-2 = chart + tabela.',
      },
      {
        type: 'subsection',
        title: '4.A — Componente InfoRow (reutilizado)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Componente local: flex items-start justify-between py-3 + border-b (last:border-0). Esquerda: ícone (opcional) + label cinza. Direita: valor font-medium preto, text-right, max-w-[55%] para evitar overflow.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE max-w-[55%]: equilibra esquerda/direita. Valor longo (e-mail, lista) quebra linha em vez de empurrar label.',
          },
          {
            type: 'paragraph',
            text: '📐 PADRÃO: value ?? "-" — fallback para nulos.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '4.B — Card "Detalhes do Desconto" (5 InfoRows)',
        children: [
          {
            type: 'list',
            items: [
              'Tipo (Percent/DollarSign) — "Percentual"/"Valor Fixo"',
              'Valor — "X%" ou formatCurrency',
              'Compra Mínima — formatCurrency ou "Sem mínimo"',
              'Desconto Máximo — formatCurrency ou "Sem limite"',
              'Empilhável (Shield) — "Sim"/"Não"',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: '4.C — Card "Validade e Uso" (5+ InfoRows)',
        children: [
          {
            type: 'list',
            items: [
              'Início (Calendar) — datetime pt-BR',
              'Expiração (Clock) — datetime ou "Sem expiração"',
              'Limite Total (Users) — número ou "Ilimitado"',
              'Limite por Cliente — número ou "Ilimitado"',
              'Aplicável a (Target) — label do applies_to',
              'BLOCO bonus — se target_items.length > 0: padding-top com badges secondary listando cada item',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: '4.D — Card "Cupom Nominal" (condicional, apenas se is_nominal)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Card com border-purple. CardTitle com Mail icon roxo. SÓ aparece se is_nominal=true.',
          },
          {
            type: 'list',
            items: [
              'InfoRow "E-mail" (Mail icon) — assigned_to_email',
              'BLOCO "Link com Cupom Automático" (apenas se generated_link existe): label cinza pequeno + Input readonly font-mono pequeno + Button outline icon Copy',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: '4.E — Chart "Utilização Diária (Últimos 7 dias)" (BarChart dual-axis)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 BarChart Recharts (height 250) com 2 eixos Y (esquerda+direita) e 2 séries de barras.',
          },
          {
            type: 'list',
            items: [
              'Eixo Y ESQUERDA — quantidade de utilizações (barras verdes #2bc196)',
              'Eixo Y DIREITA — desconto em R$ (barras azuis #3b82f6), formatado "R$X"',
              'Eixo X — dia (DD/MM, 7 dias mockados)',
              'Barras radius [4, 4, 0, 0] (cantos superiores arredondados)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE dual-axis: quantidades e valores em escalas diferentes (15 usos vs R$450). Eixos separados permitem comparação simultânea sem 1 série esmagar a outra.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: detectar PADRÕES — picos em dias específicos (campanha amplificou no dia X), quedas (cupom "esfriou"), correlações.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '4.F — Tabela "Histórico de Utilização"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Tabela de logs de cada uso individual — quem usou, quando, em qual transação, valor da compra, desconto aplicado. Visão FORENSE.',
          },
          {
            type: 'list',
            items: [
              'Header com ícone ArrowLeftRight + texto',
              'Coluna "Transação" — usage.transaction_id em font-mono',
              'Coluna "Data" — datetime pt-BR',
              'Coluna "Cliente" — bloco com nome em font-medium + e-mail abaixo em text-xs cinza',
              'Coluna "Valor da Compra" (text-right font-medium) — formatCurrency',
              'Coluna "Desconto" (text-right vermelho) — formatCurrency aplicado naquele uso',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: auditoria. (1) confirmar quem usou; (2) detectar padrões fraudulentos (mesmo cliente em horários estranhos); (3) calcular médias por cliente.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Estado vazio: colSpan={5} centralizado "Nenhuma utilização registrada para este cupom.".',
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Limitações',
            body:
              'Versão atual NÃO oferece: busca/filtro dentro do histórico; paginação para 1000+ usos; exportação. Versão final precisa esses recursos.',
          },
        ],
      },
    ],
  },
];