// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Transações (Admin Sub / Portal Merchant)
// Rota: /Transactions
// Arquivo-fonte: pages/Transactions.jsx
// Componentes: AllTransactionsView, CardTransactionsView, PixTransactionsView,
//              DeclineAnalysisView, PaymentRecoveryAgentView
// =============================================================================

export const TransactionsDoc = [
  // ===========================================================================
  // 1. INTRODUÇÃO GERAL
  // ===========================================================================
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Transações',
    body:
      'Hub central de transações do merchant. Página única que reúne, em 5 abas distintas, TODAS as visões operacionais sobre as transações processadas pela conta: visão consolidada (todas), deep-dive em cartão, deep-dive em PIX, análise de recusas e o agente de IA de recuperação de pagamentos. É a "central de operações" dia-a-dia.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) OPERAÇÃO DIÁRIA — verificar o que está sendo vendido em tempo real; (2) ATENDIMENTO — localizar uma transação específica para responder cliente; (3) AÇÕES OPERACIONAIS — capturar/cancelar pré-autorizações, estornar, devolver, reenviar webhooks em massa; (4) ANÁLISE — taxa de aprovação por bandeira, motivos de recusa, performance PIX in/out; (5) CONCILIAÇÃO — exportar para bater com ERP; (6) RECUPERAÇÃO DE RECEITA — agente IA reativa transações recusadas via canal alternativo.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que abas em vez de páginas separadas',
    body:
      'Existem rotas diretas /CardTransactions, /PixTransactions e /DeclineAnalysis que renderizam os MESMOS Views — mas o uso real é trocar entre eles muitas vezes ao dia. Manter abas com estado preservado evita perder filtros aplicados ao trocar contexto. As rotas separadas existem para deep-links (alguém compartilha "veja só meus PIX recusados" e cai direto na aba certa).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Quando o merchant usa',
    body:
      'Várias vezes por dia. É a segunda tela mais aberta depois do Dashboard. Operadores financeiros mantêm a aba "Todas" aberta o dia inteiro acompanhando movimento. Atendentes vão direto à aba e usam busca para resolver casos. Gestores acessam Análise de Recusas semanalmente. Operadores PIX/Marketplace acessam aba PIX para devoluções.',
  },

  // ===========================================================================
  // 2. PAGE HEADER
  // ===========================================================================
  {
    type: 'section',
    title: 'PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Título "Transações" (i18n) + subtítulo curto. Breadcrumb minimalista: Dashboard › Transações. Não tem ícone próprio (já está claro pelo título).',
      },
      {
        type: 'subsection',
        title: 'Botão "Exportar"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: único botão de ação no header. Variant outline. Ícone Download à esquerda + label "Exportar". 🎯 PARA QUE SERVE: gerar arquivo da visão atualmente filtrada para uso em planilhas, BI ou compliance contábil.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Comportamento esperado: abrir dropdown OU SideDrawer com escolha de formato (Excel/CSV/PDF), seleção de colunas e período. Versão atual está sem handler programado (apenas UI).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que está no header e não dentro de cada aba: exportação é universal — vale para qualquer aba ativa. Manter no header simplifica a UX e ajuda quem chega à página com intenção clara de exportar.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. ESTRUTURA DE ABAS
  // ===========================================================================
  {
    type: 'section',
    title: 'Estrutura de Abas (TabsList)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Componente Tabs (Radix/shadcn) com 5 TabsTrigger horizontais. flex-wrap permite quebrar em múltiplas linhas em telas pequenas.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que ESTAS 5 abas e não outras',
        body:
          'A composição reflete a estratégia de produto: 3 abas operacionais (Todas/Cartão/PIX) — onde se vê e age sobre transações — + 2 abas analíticas/IA (Análise de Recusas e Recovery Agent) — onde se entende e recupera. Análise + IA estão no fim porque dependem de ter contexto operacional primeiro.',
      },
      {
        type: 'list',
        items: [
          'Aba 1 "Todas" (default) — feed completo unificado, agnóstico de método',
          'Aba 2 "Cartão" — deep-dive em transações de cartão de crédito/débito',
          'Aba 3 "PIX" — deep-dive em PIX (entrada e saída)',
          'Aba 4 "Análise de Recusas" — ícone AlertTriangle. Aba analítica',
          'Aba 5 "Recovery Agent" — ícone Sparkles + badge "AI" verde (#00D26A). Aba de IA',
        ],
      },
      {
        type: 'paragraph',
        text:
          '📐 Aba "Recovery Agent" tem badge "AI" verde com texto branco em fonte pequena (px-1.5 py-0 text-xs) para chamar atenção e diferenciar das demais. Sinaliza recurso premium/inteligente.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Trigger ativo recebe sublinhado/destaque conforme variant padrão do shadcn Tabs. Inativos ficam em cinza. Click trigger mudancia o estado activeTab via setActiveTab.',
      },
    ],
  },

  // ===========================================================================
  // 4. ABA "TODAS" — AllTransactionsView
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba "Todas" — AllTransactionsView',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'View principal e mais usada. Lista UNIFICADA de todas as transações do merchant (cartão + PIX + boleto + qualquer outro método), com filtros, ações em massa, paginação e tabela ordenável.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Ver tudo junto, sem viés de método. Útil quando o operador não sabe qual método o cliente usou, quando precisa exportar massa total, ou quando faz auditoria geral.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Composição (4 blocos verticais)',
        body:
          'TransactionSummaryCards (cards de resumo no topo) → TransactionAdvancedFilters (filtros) → TransactionMassActions (barra de ações em massa, condicional) → TransactionDataTable (tabela paginada).',
      },

      // ---- 4.1 TransactionSummaryCards ----
      {
        type: 'subsection',
        title: 'Bloco 1 — Cards de Resumo (TransactionSummaryCards)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: dar um pulse de "como está o conjunto agora" antes de o usuário rolar para a tabela. Recebe `transactions` (até 500 mais recentes) e calcula KPIs em tempo real.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Tipicamente 4-6 cards horizontais: Total | Aprovadas | Recusadas | Pendentes | Volume Total | Ticket Médio. Cada card: ícone colorido, label uppercase pequeno, número grande, label auxiliar embaixo (% do total ou comparativo). Estilo idêntico ao do Dashboard para consistência visual.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 500 transações: equilíbrio entre dar amostra significativa e não sobrecarregar o cliente (browser lidando com objetos). 500 cobre tipicamente 7-15 dias para merchants médios e <5 dias para grandes.',
          },
        ],
      },

      // ---- 4.2 TransactionAdvancedFilters ----
      {
        type: 'subsection',
        title: 'Bloco 2 — Filtros Avançados (TransactionAdvancedFilters)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Componente de filtros avançados que aceita prop `viewMode` ("all" / "card" / "pix"). Renderiza campos contextualmente — alguns só aparecem para cartão (bandeira), outros só para PIX (chave PIX).',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Reduzir milhares de transações a um subset gerenciável por critérios combinados. Crítico em merchants de alto volume — sem isso a tabela é inutilizável.',
          },
          {
            type: 'list',
            items: [
              'Busca livre (search_id) — busca por transaction_id, customer_name, customer_email, merchant_order_id (4 campos simultâneos). Por que 4: o operador raramente sabe qual ID está copiado',
              'Filtro de status (statuses[]) — multi-select. Cada chip é colorido conforme StatusBadge',
              'Filtro de método (method) — single select. Em viewMode="card" e "pix" fica oculto/forçado',
              'Filtro de bandeira (brands[]) — multi-select. Só aparece se viewMode permite cartão',
              'Faixa de valor (min_value / max_value) — dois inputs com máscara R$',
              'Período (date_from / date_to) — DateRangePicker',
              'Canal (channels[]) — multi-select: API, Checkout, Link, POS',
              'Cliente (customer_search) — busca livre por nome/e-mail',
              'Documento (customer_document) — input com normalização (remove não-dígitos antes de comparar — funciona com CPF formatado ou não)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 UI esperado: card colapsável OU painel com header "Filtros" + botão Limpar e Aplicar. Cada filtro é um campo numerado. Contador "X filtros aplicados" indica estado atual.',
          },
        ],
      },

      // ---- 4.3 TransactionMassActions ----
      {
        type: 'subsection',
        title: 'Bloco 3 — Ações em Massa (TransactionMassActions) — CONDICIONAL',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Barra que SÓ aparece quando o usuário selecionou ≥1 linha da tabela. Permite executar operações em lote em todas as transações selecionadas de uma vez.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Operações repetitivas em escala: cancelar 50 pré-autorizações de uma reserva grande, estornar 20 cobranças duplicadas, reenviar webhooks de 100 transações que o ERP não capturou.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que aparece só sob seleção',
            body:
              'Sem seleção, a barra ocupa espaço desnecessário. Aparecer condicionalmente cria affordance ("para usar isso, selecione algo") e mantém UI limpa.',
          },
          {
            type: 'list',
            items: [
              'Contador "X transações selecionadas" + botão "Limpar" para deselecionar tudo',
              'Botão "Capturar em Lote" — só relevante para pré-autorizações',
              'Botão "Cancelar em Lote" — pré-autorizações novamente',
              'Botão "Estornar em Lote" — abre modal pedindo motivo único para todas',
              'Botão "Reprocessar em Lote" — tenta reprocessar recusadas (retry)',
              'Botão "Adicionar Tags" — adiciona tags em massa (ex: "investigação", "promoção_X")',
              'Botão "Reenviar Webhooks" — re-dispara webhook das selecionadas',
              'Botão "Exportar Selecionadas" — exporta apenas o subset selecionado',
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Estado atual',
            body:
              'Os handlers (handleCaptureBatch, handleRefundBatch etc.) estão atualmente como console.log + comentário "TODO: implement". A integração com backend functions virá em iteração próxima.',
          },
        ],
      },

      // ---- 4.4 TransactionDataTable ----
      {
        type: 'subsection',
        title: 'Bloco 4 — Tabela de Dados (TransactionDataTable)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Tabela paginada e ordenável com selecionador por linha + selecionar todas no header. Cada linha clica para abrir TransactionDetail.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Colunas (em viewMode="all")',
            body:
              'Geralmente: Checkbox de seleção | Status (badge colorido) | Data/Hora | ID curto | Cliente (nome + e-mail) | Método (ícone) | Bandeira/Banco | Valor | Líquido | Ações (menu de 3 pontos por linha).',
          },
          {
            type: 'list',
            items: [
              'CHECKBOX HEADER — clica para selecionar/deselecionar TODAS as linhas da página atual',
              'CHECKBOX LINHA — clica para selecionar/deselecionar aquela linha individual. Suporta shift+click para range',
              'STATUS — StatusBadge colorido (verde/vermelho/amarelo/cinza). Sem texto extra na linha',
              'DATA — formatada como "26/04/2026 14:30:22" (locale pt-BR). Ordenável (clique no header inverte direção)',
              'ID — 8-12 primeiros caracteres em fonte mono. Hover mostra tooltip com ID completo. Click copia para clipboard',
              'CLIENTE — nome em bold + e-mail cinza embaixo (2 linhas)',
              'MÉTODO — ícone (CreditCard/QrCode/Receipt) + label pequeno',
              'BANDEIRA — para cartão: logo da bandeira + 4 últimos dígitos. Para PIX: ícone + tipo de chave',
              'VALOR — formatado em BRL, alinhado à direita. Recusadas em vermelho riscadas',
              'LÍQUIDO — após taxas, em verde quando aprovado. Cinza/dash quando não aplicável',
              'AÇÕES — ícone MoreVertical → dropdown com: Ver detalhes, Estornar, Reenviar webhook, Imprimir, Adicionar nota',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Comportamento de linha:',
          },
          {
            type: 'list',
            items: [
              'Hover destaca linha (bg cinza claro)',
              'Click em qualquer área (exceto checkbox/menu de ações) → handleRowClick → navega para /TransactionDetail?id=<row.id>',
              'Click em checkbox → adiciona/remove de selectedRows (estado local da view)',
              'Click em ações (3 pontos) → abre dropdown sem navegar',
            ],
          },
          {
            type: 'subsection',
            title: 'Paginação (rodapé da tabela)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Linha horizontal com: "Mostrando X-Y de Z" à esquerda + Select de pageSize (10/25/50/100) no centro + botões de navegação (Primeira | Anterior | número da página atual | Próxima | Última) à direita.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 Default pageSize=25: balanço entre densidade visual e tempo de leitura. 50 já gera scroll cansativo; 10 é pouco para varredura. Trocar pageSize reseta page=1 (evita ficar em página inválida).',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Ordenação',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Click no header de uma coluna ordenável: primeira vez = desc; segunda vez = asc; terceira vez = remover ordenação. Ícone de seta indica estado atual. Default = `created_date desc` (mais recente primeiro — comportamento esperado em transações).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Implementação atual: ordenação acontece no servidor (refetch da query Transaction.list passando "-created_date" ou "created_date"). Por isso o queryKey inclui sortColumn/sortDirection — força refetch ao mudar.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Estados especiais da tabela',
            children: [
              {
                type: 'list',
                items: [
                  'Loading (isLoading=true): mostra skeleton de N linhas cinzas pulsando',
                  'Vazio (data.length === 0 e sem filtros): ilustração + texto "Você ainda não tem transações" + CTA para criar',
                  'Vazio com filtros aplicados: "Nenhuma transação para os filtros aplicados" + botão "Limpar filtros"',
                  'Erro: "Não foi possível carregar transações" + botão "Tentar novamente"',
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. ABA "CARTÃO" — CardTransactionsView
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba "Cartão" — CardTransactionsView',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Visão dedicada às transações de cartão (crédito/débito). Filtra automaticamente Transaction onde type=card. Adiciona métricas e visualizações específicas que não fazem sentido para PIX.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que view separada e não só filtro',
        body:
          'Análises de cartão são qualitativamente diferentes: bandeira, BIN, 3DS, parcelamento, pré-autorização. Toda essa riqueza não cabe em "Todas". Aba dedicada permite mostrar 6 cards de KPI específicos + breakdown por bandeira + sub-tabs por estado especial.',
      },

      {
        type: 'subsection',
        title: 'Linha 1 — Grid de 6 KPIs Especializados',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Grid responsivo: 2 cols mobile, 4 cols tablet, 6 cols desktop. Cada card é compacto (p-4) com ícone colorido + label uppercase pequeno + número grande + label auxiliar.',
          },
          {
            type: 'list',
            items: [
              'CARD 1 "Volume Cartão" — ícone CreditCard azul, fundo gradiente azul. Total transacionado de cartão (aprovado). Embaixo: "X transações"',
              'CARD 2 "Taxa Aprovação" — ícone TrendingUp verde. Calculado como aprovadas / (aprovadas + recusadas). NÃO inclui pendentes (sem veredito ainda). Embaixo: "Benchmark: 85%" como referência',
              'CARD 3 "Recusadas" — ícone TrendingDown vermelho, fundo gradiente vermelho. Quantidade + valor total recusado',
              'CARD 4 "Pré-Auth Ativas" — ícone Clock amarelo, fundo gradiente amarelo. Quantidade de pré-autorizações ainda não capturadas/canceladas + valor reservado',
              'CARD 5 "Taxa 3DS" — ícone Shield indigo. % de transações que passaram por 3D Secure (autenticação). Importante: transações 3DS têm liability shift — chargeback fica com o banco emissor',
              'CARD 6 "Top Bandeira" — ícone BarChart3 roxo. Bandeira líder por volume + sua taxa de aprovação. Resposta rápida: "qual bandeira mais movimenta no meu negócio"',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que destacar Pré-Auth: pré-autorizações são "dinheiro virtual reservado". Esquecidas, geram disputa e mau humor com cliente (limite preso). Card sempre visível garante que o operador veja o backlog.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linha 2 — Performance por Bandeira (card horizontal)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: card único de largura total mostrando taxa de aprovação POR BANDEIRA em barras horizontais com cores adaptativas.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: identificar bandeiras "problemáticas" — se Visa aprova 92% e Hipercard aprova 60%, há problema específico (BIN bloqueada, MCC errado para Hipercard, etc.).',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: flex-wrap horizontal. Cada bandeira é um item com largura mínima 180px contendo: Badge outline com nome da bandeira (capitalize) + número de transações em cinza + % de aprovação à direita (verde ≥80%, amarelo 60-80%, vermelho <60%) + barra de progresso fina embaixo com mesma cor.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Ordenação: por volume descendente — bandeiras com mais movimento aparecem primeiro.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linha 3 — Sub-tabs específicas de Cartão',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'TabsList interno (NÃO é o Tabs principal da página) com 4 atalhos especializados que filtram a tabela abaixo. State: activeSubTab.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que sub-tabs e não filtros',
            body:
              'Estes 4 estados (Pré-Auth, 3DS, Recusadas) são tão frequentemente acessados que merecem 1 clique em vez de configurar filtro a cada vez. Pré-Auth e Recusadas mostram BADGE com contador na própria aba — chamando atenção para volumes pendentes de ação.',
          },
          {
            type: 'list',
            items: [
              'SUB-TAB "Todas" (default) — sem filtro adicional sobre o já restrito a cartão',
              'SUB-TAB "Pré-Autorizações" — filtra status="pre_authorized". Badge amarelo com contagem ao lado se >0 (chamada para ação visual)',
              'SUB-TAB "Com 3DS" — filtra threeds_authenticated=true. Sem badge (não é "pendência")',
              'SUB-TAB "Recusadas" — filtra status="declined". Badge vermelho com contagem ao lado se >0',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Note que na implementação atual, abaixo do TabsList NÃO há TabsContent — a filtragem é feita no useMemo de filteredTransactions e a tabela é única. Isso é deliberado: evita re-mount da tabela, preserva paginação/seleção entre sub-tabs.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linhas 4-6 — Filtros + Mass Actions + Tabela',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 TransactionAdvancedFilters com viewMode="card" — esconde filtro de método (já forçado para cartão), mas exibe filtro de bandeira em destaque.',
          },
          {
            type: 'paragraph',
            text:
              '📐 TransactionMassActions e TransactionDataTable idênticos à aba "Todas", mas DataTable com viewMode="card" pode mostrar colunas extras (3DS, BIN, parcelamento).',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. ABA "PIX" — PixTransactionsView
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba "PIX" — PixTransactionsView',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Visão dedicada às transações PIX. Filtra Transaction onde type=pix. Adiciona conceitos exclusivos do PIX: separação IN/OUT, geração de QR Code, devolução de PIX recebido (com regras BACEN).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que separa IN/OUT',
        body:
          'Diferentemente do cartão (sempre uma direção: cliente paga merchant), PIX é bidirecional: o merchant pode RECEBER (in) ou ENVIAR (out — devoluções, pagamentos a fornecedores, etc.). Cada direção tem KPIs próprios e merece destaque visual.',
      },

      {
        type: 'subsection',
        title: 'Linha 1 — Cards Grandes IN/OUT/Saldo Líquido (3 colunas)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Grid 3 colunas (mobile: 1). Cards GRANDES com altura dupla, gradientes coloridos e ícones em quadrados arredondados (10×10).',
          },
          {
            type: 'list',
            items: [
              'CARD "PIX Entrada" — ícone ArrowDownLeft em fundo verde-esmeralda. Header tem badge "X% conv." (taxa de conversão IN). Valor grande verde. Embaixo: "Y pagos de Z gerados" (conversão de QR codes em pagamentos efetivos)',
              'CARD "PIX Saída" — ícone ArrowUpRight em fundo vermelho. Header com badge "X% conv." (% das saídas que foram efetivamente enviadas). Valor grande vermelho. Embaixo: "Y enviados de Z solicitados"',
              'CARD "Saldo Líquido PIX" — ícone Wallet em fundo azul. Calculado como pixInVolume - pixOutVolume. Cor adaptativa: positivo=azul, negativo=vermelho. Texto auxiliar "Saldo positivo" / "Saldo negativo"',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que destacar saldo líquido: para marketplaces e merchants que fazem MUITAS devoluções/repasses, saber o líquido movimentado em PIX é essencial para conciliação bancária. Se o líquido bate com o extrato Banco do PIX, está tudo conciliado.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linha 2 — Grid de 6 KPIs Operacionais PIX',
        children: [
          {
            type: 'list',
            items: [
              'CARD "Volume Total" — gradiente teal. Ícone QrCode. Volume aprovado total (in+out). "X pagos" embaixo',
              'CARD "Conversão Geral" — ícone Percent verde. % de QR codes pagos sobre gerados. "QRs pagos"',
              'CARD "Aguardando" — gradiente amarelo. Ícone Clock. Quantidade de PIX em status pending + valor pendente. Aguardando o cliente efetuar o pagamento',
              'CARD "Expirados" — gradiente cinza. Ícone XCircle. Quantidade de QR codes que expiraram sem pagamento + valor "perdido" (potencial de receita não convertida)',
              'CARD "Tempo Médio" — ícone Timer azul. Minutos médios entre QR gerado e pagamento efetivo. Indicador comportamental — clientes pagam rápido ou demoram?',
              'CARD "Devoluções" — ícone RefreshCw roxo. Quantidade de PIX devolvidos + valor total devolvido',
            ],
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linha 3 — Botão "Gerar Novo QR Pix"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: abre Dialog modal para gerar um novo QR Code de cobrança PIX manualmente, sem passar pelo checkout/API.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: cobranças avulsas/manuais — cliente liga pedindo pagar à vista, atendente gera QR e manda por WhatsApp/e-mail.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: botão verde primário (#00D26A) alinhado à direita (flex justify-end). Ícone Plus + label "Gerar Novo QR Pix".',
          },
        ],
      },

      // ---- 6.4 PIX Type Filter (In/Out) ----
      {
        type: 'subsection',
        title: 'Linha 4 — Filtro Pill IN/OUT (segmented control)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Toggle group customizado tipo "pill" — 3 botões em uma caixa cinza com fundo branco no botão ativo. Filtra a tabela por direção do PIX.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: dentro de container bg-slate-100 com padding 4px e border-radius lg, três botões: "Todos" (sem ícone), "Entrada" (ícone ArrowDownLeft, ativo = bg-emerald-500 com texto branco e badge contador verde claro), "Saída" (ícone ArrowUpRight, ativo = bg-red-500 com texto branco e badge contador vermelho claro).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que botões com cor própria quando ativos: reforça semântica visual — verde sempre = entrada/recebido (positivo), vermelho sempre = saída/enviado (saída de caixa). Usuário associa cor a direção em segundos.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Estado pixTypeFilter combina com activeSubTab e filters no useMemo final.',
          },
        ],
      },

      // ---- 6.5 Sub-tabs estado PIX ----
      {
        type: 'subsection',
        title: 'Linha 5 — Sub-tabs por Estado (PIX-specific)',
        children: [
          {
            type: 'list',
            items: [
              'SUB-TAB "Todos" — sem filtro de status',
              'SUB-TAB "Aguardando" — status=pending. BADGE amarelo com contador',
              'SUB-TAB "Pagos" — status=approved',
              'SUB-TAB "Expirados" — status=expired (QR não pago dentro do prazo)',
              'SUB-TAB "Devolvidos" — status=refunded',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que "Aguardando" tem badge mas "Expirados" não: aguardando = ação possível (cliente ainda pode pagar OU cancelar/cobrar de novo); expirados = histórico só, sem ação. Badge atrai atenção para o que precisa de gestão.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linhas 6-8 — Filtros + Ações em Massa + Tabela',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 TransactionAdvancedFilters com viewMode="pix" — esconde filtros de cartão (bandeira), exibe campo "Chave PIX" pesquisável.',
          },
          {
            type: 'paragraph',
            text:
              '📐 TransactionDataTable com viewMode="pix" — colunas adaptadas: Status | Data | ID | Cliente | Tipo (in/out — ícone colorido) | Chave PIX | Valor | Ações. Ações por linha incluem "Devolver" diretamente (atalho que abre Dialog de devolução pre-populado).',
          },
        ],
      },

      // ---- 6.6 Dialog "Gerar Novo QR Pix" ----
      {
        type: 'modal',
        title: 'Modal Dialog — "Gerar Novo QR Code Pix"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Dialog (não SideDrawer) modal centralizado que coleta dados para gerar um QR Code PIX de cobrança avulsa.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que Dialog em vez de Drawer',
            body:
              'Formulário curto (4 campos) e ação curta. Dialog modal centralizado tem peso visual menor e é mais "rápido" para tarefa pontual. Drawer faria mais sentido se houvesse mais campos ou contexto da tabela ao fundo.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Largura sm:max-w-md (~448px). Header: título "Gerar Novo QR Code Pix" + descrição "Crie um novo QR code para receber pagamentos".',
          },
          {
            type: 'list',
            items: [
              'Campo "Valor" — Input type=number com placeholder "R$ 0,00". Aceita decimal',
              'Campo "Descrição" — Textarea livre. Aparece no QR Code para o cliente entender pelo que está pagando',
              'Campo "Tipo de QR" — Select com 2 opções: "Dinâmico (uso único)" / "Estático (reutilizável)". Default = dinâmico',
              'Campo "Validade (minutos)" — Select com opções 15min / 30min / 1h / 24h. Default = 30 minutos',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que TIPO de QR é decisão importante: DINÂMICO gera QR com ID único e valor fixo — só o cliente A pode pagar aquele QR específico; após pago, vira inativo. ESTÁTICO é reutilizável — útil para "doe qualquer valor" ou ponto de venda físico (loja com QR fixo na mesa).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que VALIDADE em PIX dinâmico importa: BACEN exige expiração explícita. Curto demais (5min) = cliente perde a janela; longo demais (24h) = expõe risco de uso indevido por longos períodos. 30min é equilíbrio para checkout online.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Footer: "Cancelar" (outline) + "Gerar QR Code" (verde primário, ícone QrCode). Submit chama handleGenerateQR (atualmente console.log + reset do form).',
          },
        ],
      },

      // ---- 6.7 Dialog "Devolver Pix" ----
      {
        type: 'modal',
        title: 'Modal Dialog — "Devolver Pix"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Dialog específico de devolução de PIX recebido. Aberto via openRefundDialog passando a transação selecionada.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Devolver um PIX recebido ao pagador original — equivalente ao estorno de cartão, mas no contexto PIX. Operação regulamentada pelo BACEN.',
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Aviso fixo no topo do modal',
            body:
              'Box azul claro com texto: "Atenção: Devoluções Pix podem ser realizadas em até 90 dias após o pagamento original." — informa sobre janela legal pelo BACEN. Reduz tickets de suporte com "por que não consigo devolver?".',
          },
          {
            type: 'list',
            items: [
              'Campo "Valor a devolver" — pré-populado com valor da transação selecionada (devolução total por padrão). "Máximo: R$ X,XX" abaixo. Permite parcial',
              'Campo "Motivo da devolução *" (OBRIGATÓRIO — asterisco vermelho) — Select com 5 opções tipadas pelo BACEN: "Fraude" / "Falha operacional" / "Solicitação do pagador" / "Valor incorreto" / "Outro"',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que motivo é OBRIGATÓRIO em PIX e não em cartão: regulamentação do PIX exige justificativa codificada pelo BACEN — usado para classificação estatística e antifraude na rede SPI. Cartão tem regras mais flexíveis.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Footer: "Cancelar" + "Solicitar Devolução" (verde, ícone RefreshCw). Botão "Solicitar Devolução" fica DISABLED enquanto refundForm.reason for vazio — afordância clara: "preencha motivo".',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 7. ABA "ANÁLISE DE RECUSAS" — DeclineAnalysisView
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba "Análise de Recusas" — DeclineAnalysisView',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Página analítica focada exclusivamente em transações com status="declined". Não tem tabela operacional — é dashboard de inteligência. Mostra POR QUE estão sendo recusadas, ONDE (banco, bandeira, faixa de valor), QUANDO (hora) e o que fazer (recomendações da IA DIA).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Recuperação de receita. Cada recusa é venda perdida. Entender padrões permite agir: trocar provedor antifraude, ativar retry, oferecer PIX como alternativa, bloquear BIN problemática, ajustar regras de risco.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Quem usa',
        body:
          'Gestores de pagamento, diretores comerciais, analistas de antifraude. Geralmente acessada semanalmente ou mensalmente em reuniões de gestão. Não é tela operacional do dia.',
      },

      {
        type: 'subsection',
        title: 'Linha 1 — Header simples + Seletor de Período',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Header com título h3 "Análise de Recusas" + subtítulo "Identifique padrões e oportunidades de melhoria". À direita: Select com opções "Últimos 7 dias" / "Últimos 30 dias" (default) / "Últimos 90 dias". Largura w-40.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que apenas 3 opções de período: análise mais granular (24h/dia) faz pouco sentido aqui — recusas precisam de massa estatística para padrões emergirem. Menos de 7 dias gera ruído.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linha 2 — Grid de 4 KPIs',
        children: [
          {
            type: 'list',
            items: [
              'KPI "Taxa de Recusa" — gradiente vermelho. Ícone TrendingDown. Valor grande em vermelho. Embaixo: "Benchmark: 15%" + barra de progresso fina vermelha mostrando o quanto está acima/abaixo do benchmark',
              'KPI "Transações Recusadas" — fundo branco. Ícone AlertTriangle laranja. Quantidade absoluta. "No período selecionado" embaixo',
              'KPI "Valor Perdido" — gradiente laranja. Ícone DollarSign. Volume monetário recusado total. "Potencial de recuperação" embaixo — mensagem propositiva',
              'KPI "Principal Motivo" — fundo branco. Ícone BarChart3 azul. Categoria mais frequente (NSF, Limite, Fraude...). "X% das recusas" embaixo',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que 15% é o benchmark de "Taxa de Recusa": é a média de recusa do mercado brasileiro de e-commerce. Acima disso indica problema; abaixo disso indica eficiência. Visualizar contra benchmark dá referência objetiva.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linha 3 — Recomendações do DIA (Agente IA)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Card destacado com borda verde-PagSmile (#00D26A) e fundo gradiente leve verde. Header com ícone Sparkles + título "Recomendações do DIA". Conteúdo: grid 3 colunas com 3 recomendações geradas pelo agente IA DIA.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Em vez de apenas mostrar problemas, o agente IA propõe AÇÕES — detectando padrões cruzados (ex: recusas concentradas em horário X com método Y) e sugerindo intervenções concretas com IMPACTO ESTIMADO.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que mockado',
            body:
              'Implementação atual usa array fixo de 3 recomendações exemplares. Versão final invocará a função IA do agente DIA (DIACopilot) que cruza dados de recusas com histórico, regras ativas e contexto de mercado.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Cada card de recomendação tem: ícone Lightbulb colorido (amarelo=warning, azul=insight, verde=opportunity) em quadradinho colorido + título bold + descrição cinza explicativa + linha verde de IMPACTO ("Potencial recuperação: R$ 12.500/mês"). Hover destaca sombra.',
          },
          {
            type: 'list',
            items: [
              'Tipo "warning" (amarelo) — alerta sobre problema detectado. Ex: "Alta taxa de NSF no período da tarde — Considere oferecer PIX como alternativa"',
              'Tipo "insight" (azul) — observação analítica que orienta investigação. Ex: "BIN 411111 com 45% de recusa — revisar ou bloquear"',
              'Tipo "opportunity" (verde) — oportunidade de melhoria com retorno estimado. Ex: "Retry automático pode recuperar 15% das recusas"',
            ],
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Linha 4 — Grid 2x2 de Análises Detalhadas',
        children: [
          {
            type: 'subsection',
            title: 'Card "Motivos de Recusa" (esquerda superior)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: PieChart (donut) à esquerda + lista clicável à direita com 6 categorias: NSF (saldo insuficiente), Limite Excedido, Fraude/Risco, Cartão Inválido, Erro do Emissor, Outros.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Donut: Recharts PieChart com innerRadius 50, outerRadius 80 (espessura 30), paddingAngle 2 (espaços visuais entre fatias), cores definidas por DECLINE_CATEGORIES.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Lista lateral: cada categoria é botão clicável com bolinha colorida + ícone categoria + nome + número de ocorrências + ChevronRight (que rotaciona ao expandir). Click expande detalhes (estado expandedCategory).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 Por que CATEGORIZAR motivos em vez de mostrar códigos brutos: códigos da bandeira (ex: 51, 14, 05, 91, FRAUD_01) são técnicos. Categorizar em 6 buckets de negócio facilita ações: "tenho problema de saldo (NSF)" é actionable; "tenho 200 transações com código 51" exige tradução.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Card "Evolução da Taxa de Recusa" (direita superior)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: gráfico de linha temporal (Recharts LineChart) com taxa de recusa diária ao longo do período.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: detectar TENDÊNCIA. Subindo? Estável? Pico isolado? Identifica visualmente "quando começou o problema".',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Altura 256px (h-64). Eixo X: data (DD/MM). Eixo Y: 0-40%. Linha vermelha #EF4444, espessura 2, sem dots (cleaner). Tooltip ao passar mouse mostra valor exato do dia.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Card "Taxa de Recusa por Bandeira" (esquerda inferior)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: lista vertical com barra de progresso por bandeira, ordenada por TAXA descendente (piores primeiro).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: identificar bandeira com problema. Se Hipercard tem 30% de recusa enquanto outras estão em 10%, isso vira ação concreta — investigar causa específica.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Cada linha: Badge outline com nome (capitalize, w-24) + texto cinza "X/Y recusadas" + % à direita (verde<10%, amarelo 10-20%, vermelho>20%) + Progress bar com cor adaptativa.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Card "Taxa de Recusa por Faixa de Valor" (direita inferior)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: BarChart vertical com 5 faixas de valor ("<R$50", "R$50-200", "R$200-500", "R$500-1000", ">R$1000") e taxa de recusa em cada uma.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: identificar PADRÕES POR TICKET. É comum ver alta recusa em ticket > R$1000 (antifraude mais agressivo) e baixa em < R$50. Ajuda a calibrar regras de antifraude por faixa de valor.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Altura 256px. Barras vermelhas (#EF4444) com bordas superiores arredondadas (radius [4,4,0,0]). Eixo Y mostra %. Tooltip ao hover.',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 8. ABA "RECOVERY AGENT"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba "Recovery Agent" — PaymentRecoveryAgentView',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Aba dedicada ao agente IA "Payment Recovery Agent" — interface conversacional + dashboard que automatiza a recuperação de pagamentos recusados via canais alternativos (PIX, retry inteligente, e-mail com link, WhatsApp).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Aumentar conversão final do funil. De cada 100 transações recusadas, normalmente 15-20% poderiam ter sido aprovadas com retentativa otimizada (intervalo certo, método alternativo, comunicação certa). O agente automatiza esse processo.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que está em aba aqui (e não como página separada)',
        body:
          'Recovery age sobre RECUSAS — naturalmente próximo do contexto de "Análise de Recusas". Manter junto cria narrativa: "vejo o problema → IA me mostra a solução em ação". Existe também página dedicada (/RecoveryAgent) para uso intensivo.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Documentação completa',
        body:
          'A documentação microscópica detalhada do Recovery Agent (interface de chat, configurações, métricas, fluxos de retry, integrações de canais) está na página dedicada /RecoveryAgent — será documentada na entrega 13 (Agentes IA do Admin Sub).',
      },
    ],
  },

  // ===========================================================================
  // 9. RESPONSIVIDADE & ESTADOS GLOBAIS
  // ===========================================================================
  {
    type: 'section',
    title: 'Responsividade, Estados e Acessibilidade',
    children: [
      {
        type: 'subsection',
        title: 'Mobile',
        children: [
          {
            type: 'list',
            items: [
              'Header: título e botão Exportar empilhados em coluna',
              'TabsList: flex-wrap permite quebrar em 2 linhas (5 abas não cabem em mobile)',
              'Grid de KPIs: vira 1 ou 2 colunas',
              'Tabela: scroll horizontal preservando colunas — alternativa: card-mode (cada linha vira card vertical compacto). Não implementado ainda',
              'Modais ocupam 100% largura',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Atalhos de teclado (boas práticas previstas)',
        children: [
          {
            type: 'list',
            items: [
              'Ctrl/Cmd + F → foco no campo de busca',
              'Esc → fecha modais e drawers',
              'Setas ↑↓ → navega entre linhas da tabela quando focada',
              'Enter na linha → abre detalhe',
              'Espaço → seleciona/deseleciona linha (quando focada)',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Loading & Erro',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Cada View tem seu próprio loading (skeleton da tabela). Erro de rede mostra mensagem inline + retry. Cards de KPI mostram "—" enquanto carregam. Trocar de aba re-aciona o useQuery (queryKey diferente) — pode haver pequeno delay perceptível.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Cache (React Query)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 As 4 views usam queryKeys distintas (transactions/all, /card, /pix, /declined). Cache 5min. Trocar de aba e voltar não refaz query (instantâneo). Refresh manual disponível via botão (em iteração futura).',
          },
        ],
      },
    ],
  },
];

// =============================================================================
// VARIANTE — /CardTransactions (rota dedicada)
// =============================================================================
// A rota /CardTransactions é uma página simples que renderiza somente
// CardTransactionsView com PageHeader próprio. Conteúdo é IDÊNTICO ao da
// aba "Cartão" da página /Transactions — apenas o wrapper externo muda.
// =============================================================================

export const CardTransactionsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é',
    body:
      'Página dedicada que renderiza isoladamente o CardTransactionsView. URL própria /CardTransactions, breadcrumb "Transações › Cartão", PageHeader com título "Transações de Cartão" e subtítulo "Visualize e gerencie todas as transações realizadas com cartão de crédito e débito".',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que existe rota dedicada',
    body:
      'Permite deep-linking direto. Compartilhar link "veja minhas transações de cartão" leva exatamente para essa visão (em vez de /Transactions onde teria que clicar na aba Cartão). Útil para bookmarks, e-mails internos, sub-menus laterais.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Conteúdo',
    body:
      'IDÊNTICO ao da Aba "Cartão" em /Transactions. Mesmo CardTransactionsView, mesmos KPIs, mesmas sub-tabs, mesma tabela. A única diferença é o PageHeader externo. Por isso a documentação detalhada está em "Aba Cartão" da página /Transactions — esta página apenas reaproveita.',
  },
];

// =============================================================================
// VARIANTE — /PixTransactions (rota dedicada)
// =============================================================================

export const PixTransactionsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é',
    body:
      'Página dedicada que renderiza isoladamente o PixTransactionsView. URL própria /PixTransactions, breadcrumb "Transações › Pix", PageHeader com título "Transações Pix" e subtítulo "Visualize e gerencie todas as transações realizadas via Pix".',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que existe',
    body:
      'Mesma justificativa de /CardTransactions: deep-linking. Útil também para sidebar com links diretos PIX/Cartão sem passar pelo wrapper Transactions.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Conteúdo',
    body:
      'IDÊNTICO à Aba "PIX" em /Transactions: mesmos cards IN/OUT/Saldo Líquido, mesmos 6 KPIs operacionais, mesmas sub-tabs por estado, mesmo modal de gerar QR e modal de devolver PIX. Documentação detalhada já está em "Aba PIX" da página /Transactions.',
  },
];

// =============================================================================
// VARIANTE — /DeclineAnalysis (rota dedicada)
// =============================================================================
// IMPORTANTE: a rota /DeclineAnalysis renderiza pages/DeclineAnalysis.jsx, que
// é uma versão SIMPLIFICADA com dados estáticos (não usa o DeclineAnalysisView
// completo). É um placeholder mais antigo com estatísticas mock fixas.
// =============================================================================

export const DeclineAnalysisDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é',
    body:
      'Página dedicada de Análise de Recusas. IMPORTANTE: a versão na rota /DeclineAnalysis (pages/DeclineAnalysis.jsx) é uma versão SIMPLIFICADA com dados estáticos — não usa o DeclineAnalysisView completo da aba dentro de /Transactions. Há divergência entre as duas implementações.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Conteúdo da página simplificada (/DeclineAnalysis)',
    body:
      'PageHeader com título "Análise de Recusas" + subtítulo "Entenda os motivos de recusa e recupere vendas" + botão "Filtros Avançados" (outline, ícone Filter). Abaixo, grid de 4 cards de KPIs com VALORES FIXOS HARDCODED (não calculados a partir de dados reais): "Taxa de Recusa Geral 12.5%" / "Total de Recusas 1.234" / "Motivo #1: Fraude 45%" / "Valor Perdido R$ 145.230". Depois grid 2x1 com tabela "Top 5 Motivos de Recusa" (5 linhas hardcoded com motivo, código, qtd, %) e tabela "Performance por Banco Emissor" (5 linhas: Nubank 92% aprov / Itaú 89% / Bradesco 85% / Banco do Brasil 82% / Santander 80%).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Conteúdo da aba dentro de /Transactions (versão completa)',
    body:
      'A versão dentro de /Transactions (DeclineAnalysisView) é MUITO mais rica: tem seletor de período, 4 KPIs calculados em tempo real, recomendações do DIA (IA), donut chart de motivos categorizados, gráfico de evolução temporal, análise por bandeira com barras de progresso e análise por faixa de valor.',
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'Inconsistência entre as duas',
    body:
      'O ideal seria a página /DeclineAnalysis também renderizar o DeclineAnalysisView (como /CardTransactions e /PixTransactions fazem com seus respectivos Views). Atualmente a página simplificada permanece como código legado. Documentação refere-se à versão completa pois é a esperada como produto final. A simplificada deve ser substituída em iteração futura.',
  },
];