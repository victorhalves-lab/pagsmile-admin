// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Dashboard (Admin Sub / Portal Merchant)
// Rota: /Dashboard
// Arquivo-fonte: pages/Dashboard.jsx
// =============================================================================
// Esta documentação descreve TUDO que existe na tela: cada seção, card, KPI,
// gráfico, aba, botão, dropdown e estado. Para cada elemento explicamos:
//   🎯 O que é         — definição funcional
//   🎯 Para que serve  — propósito/problema que resolve
//   🎯 Quando se usa   — contexto real de uso pelo merchant
//   🎯 Por que existe  — justificativa de design
//   📐 UI/Comportamento — layout, cores, fontes, estados, microinterações
// =============================================================================

export const DashboardDoc = [
  // ===========================================================================
  // 1. INTRODUÇÃO GERAL DA PÁGINA
  // ===========================================================================
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é o Dashboard',
    body:
      'O Dashboard é a tela inicial do Portal do Merchant — primeira página que o usuário vê após o login. Funciona como um centro de comando executivo, agregando em uma única tela: indicadores de volume financeiro (GMV), métricas de transações, performance de aprovação, saldo disponível, gráficos de evolução temporal e atalhos para as ações mais frequentes do dia a dia.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      'Atende 6 propósitos críticos: (1) DIAGNÓSTICO RÁPIDO — em 5 segundos o operador entende se o dia está saudável (volume, aprovação, alertas); (2) MONITORAMENTO DE METAS — comparativos vs. dia/mês anterior mostram se a operação está crescendo ou contraindo; (3) DETECÇÃO DE ANOMALIAS — quedas bruscas em aprovação, picos de recusa ou alertas de risco aparecem destacados; (4) DECISÃO DE LIQUIDEZ — o cartão de saldo informa quanto está disponível para saque agora vs. a receber; (5) ACESSO RÁPIDO — Quick Actions personalizáveis levam para criar link, registrar transação, abrir relatório; (6) NARRATIVA EXECUTIVA — gerentes e diretores extraem daqui o storytelling para reuniões.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Quando o merchant usa',
    body:
      'Várias vezes ao dia. Tipicamente: ao iniciar o expediente (status geral), após o almoço (acompanhar tendência), no fechamento do dia (consolidar números). Times maiores deixam o Dashboard aberto em monitor secundário durante todo o expediente. Diretores acessam semanalmente/mensalmente para extrair indicadores estratégicos.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que tem este desenho (executivo + abas)',
    body:
      'A escolha de mostrar uma "camada executiva" sempre visível (KPIs + gráfico de volume + saldo) e abas abaixo (Executive / Cartão / PIX / Analytics) atende dois perfis de usuário com a mesma tela: o EXECUTIVO/GERENTE precisa de visão consolidada agnóstica de método, enquanto o ANALISTA/OPERADOR precisa mergulhar em performance específica de cartão ou PIX. Em vez de criar dashboards separados, o sistema oferece uma página única com profundidade progressiva.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que resolve',
    body:
      'Antes desta tela, o merchant precisaria abrir múltiplos relatórios, cruzar planilhas com adquirentes, perguntar para o financeiro qual é o saldo disponível e abrir cada módulo (chargebacks, transações, financeiro) para checar se há algo crítico. Aqui, em uma rolagem vertical, ele tem tudo isso consolidado e atualizado em tempo quase real (queries com cache de 5 min via React Query).',
  },

  // ===========================================================================
  // 2. PAGEHEADER
  // ===========================================================================
  {
    type: 'section',
    title: 'PageHeader (Cabeçalho da Página)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Função do cabeçalho',
        body:
          'Estabelece contexto visual ("você está no Dashboard Executivo"), descreve em uma frase o propósito da tela e oferece dois controles globais que afetam TODOS os números da página: o seletor de período e o botão de personalização.',
      },
      {
        type: 'subsection',
        title: 'Título "Dashboard Executivo"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Texto traduzido via i18n (chave dashboard.executive_dashboard). Renderizado em fonte grande (text-3xl), peso bold, cor primária do texto (preto/branco conforme tema). Alinhado à esquerda. Acompanhado por subtítulo logo abaixo (chave dashboard.subtitle) em cinza menor explicando o propósito.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que "Executivo" e não apenas "Dashboard": diferenciação semântica para futuros dashboards customizados (CustomDashboards) que serão pessoais ao usuário. Este é o oficial, alimentado por dados consolidados.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Seletor de Período (dropdown)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Dropdown que define a janela temporal usada por TODOS os indicadores e gráficos da página. É o controle MAIS importante da tela.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Permite que o mesmo dashboard sirva análises distintas: visão diária (24h) para operação, semanal (7d) para acompanhamento tático, mensal (30d) para gestão, trimestral (90d) para diretoria.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que está em destaque no topo',
            body:
              'É o filtro de maior impacto — todos os números mudam quando ele muda. Colocá-lo no header garante que o usuário entenda imediatamente "o período aplicado é X" antes de interpretar os números.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: Componente Select do shadcn/ui. Trigger com largura 144px (w-36), altura 44px, ícone de calendário à esquerda do texto, chevron à direita. Borda cinza clara, fundo branco (modo claro) / fundo escuro do tema (modo escuro). Ao abrir, dropdown com 6 opções:',
          },
          {
            type: 'list',
            items: [
              '"Hoje" (24h) — para operação ao vivo',
              '"Ontem" — para reconciliar o dia anterior fechado',
              '"Últimos 7 dias" — DEFAULT inicial — equilíbrio entre reduzir ruído diário e ainda ser tático',
              '"Este mês" (30d) — para fechamento mensal e comparativo MoM',
              '"Mês passado" — para análise pós-fechamento',
              '"Últimos 90 dias" — visão trimestral / sazonalidade',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que default = 7 dias e não 30: 30 dias dilui o impacto do dia atual; 7 dias mostra variação semanal capturando o efeito fim de semana sem ser "ruidoso demais". Equilíbrio empírico para o B2B brasileiro.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Comportamento ao trocar: o estado React `period` atualiza, todos os componentes filhos que recebem `period` re-renderizam, gráficos são recalculados. Não há indicador global de "atualizando" — cada bloco mostra seu próprio estado de loading.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Personalizar"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Botão secundário (variant="outline", size="sm") com ícone de engrenagem que abre interface de customização do dashboard.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Cada merchant tem prioridades diferentes. Quem opera só PIX não quer ver "Aprovação por Bandeira"; quem é marketplace quer ver split em destaque. O botão de personalização atende essa necessidade reordenando, ocultando ou substituindo blocos.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: Botão pequeno à direita do seletor de período, com ícone Settings (engrenagem) à esquerda do label "Personalizar". Estilo outline (borda cinza, fundo transparente).',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Estado atual do código',
            body:
              'No código atual o handler do botão está sem ação programada (apenas estilizado). A funcionalidade prevista é abrir um SideDrawer com lista arrastável de blocos do dashboard onde o usuário pode ligar/desligar e reordenar. Persistência ficaria em UserPreferences.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. QUICK ACTIONS CUSTOMIZÁVEL
  // ===========================================================================
  {
    type: 'section',
    title: 'Quick Actions (Ações Rápidas Personalizáveis)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Faixa horizontal logo abaixo do header, com 4-6 botões grandes que levam para as ações mais usadas do merchant. Personalizável (cada usuário escolhe quais ações aparecem).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Reduzir cliques para ações de alta frequência. Sem isso, criar um link de pagamento exigiria: (1) clicar em "Links" no menu, (2) clicar em "Novo Link". Com Quick Actions, é UM clique direto do dashboard.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que personalizável',
        body:
          'Os atalhos importantes mudam por perfil. Vendedor de e-commerce prioriza "Criar Link". Operador de marketplace prioriza "Gerenciar Split". Diretor financeiro prioriza "Solicitar Saque". Personalização permite que cada usuário tenha um dashboard verdadeiramente útil.',
      },
      {
        type: 'paragraph',
        text:
          '📐 UI: Grid responsivo (4 colunas no desktop, 2 no tablet, 1 no mobile). Cada card tem ícone grande circular em fundo colorido, título da ação em bold, descrição curta cinza, e (no canto) ícone de seta indicando que é clicável. Hover anima leve translação Y (-2px) e aumento de sombra.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Atalhos default disponíveis (configuráveis em UserPreferences):',
      },
      {
        type: 'list',
        items: [
          '"Nova Transação" → abre drawer para criar transação manual (mesmo do Transactions)',
          '"Criar Link de Pagamento" → /PaymentLinkCreate',
          '"Solicitar Saque" → abre drawer de saque do módulo Withdrawals',
          '"Ver Recebíveis" → /ReceivablesAgenda',
          '"Criar Cupom" → /CouponForm',
          '"Configurar Webhook" → /Webhooks',
          '"Adicionar Subconta" → /SubaccountOnboarding (para marketplaces)',
        ],
      },
      {
        type: 'paragraph',
        text:
          '📐 Botão de "+" no final da faixa (ou ícone de engrenagem flutuante) abre modal/drawer para customizar quais atalhos aparecem.',
      },
    ],
  },

  // ===========================================================================
  // 4. GMV CARDS (Cards de Volume)
  // ===========================================================================
  {
    type: 'section',
    title: 'GMV Cards (6 Cards de Volume Financeiro)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é GMV',
        body:
          'GMV = Gross Merchandise Volume — volume bruto transacionado (somatório do valor de todas as vendas aprovadas no período). É o "faturamento bruto processado" via PagSmile.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que servem os 6 cards',
        body:
          'Mostrar o volume em 6 recortes temporais simultâneos: HOJE, ONTEM, ÚLTIMOS 7 DIAS, MÊS ATUAL (com projeção), MÊS PASSADO, e variação relativa. Esse painel responde de cara: "como estou hoje vs. ontem vs. tendência do mês".',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que mostrar todos juntos e não escolher um',
        body:
          'O número de hoje sozinho não diz nada — precisa ser comparado. Ver hoje + ontem + 7d + mês + mês passado em paralelo permite ao usuário fazer comparações instantâneas sem precisar recalcular ou trocar filtros.',
      },
      {
        type: 'subsection',
        title: 'Card 1 — "Hoje"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Card branco, borda arredondada (2xl), padding 24px. Topo: ícone DollarSign verde + label "GMV Hoje" em cinza. Centro: valor em fonte grande bold (text-3xl) com formatação monetária BRL ("R$ 18.750,00"). Abaixo: badge horizontal com ícone de seta + "+12,5%" (verde se positivo, vermelho se negativo) — comparação automática vs. mesmo dia da semana anterior.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Detalhamento por método logo abaixo do valor: linha horizontal com ícone CreditCard + valor cartão | ícone QrCode + valor PIX. Permite entender a composição do GMV do dia.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que essa decomposição: muitos merchants têm metas separadas para cartão e PIX (ou mesmo equipes diferentes operando cada um). Ver split nativo evita ter que abrir aba PIX para descobrir.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card 2 — "Ontem"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Mesmo formato do card "Hoje". Comparativo é vs. anteontem. Função: dar ao usuário a referência fechada (dia já encerrado) para comparar com o "Hoje" parcial.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card 3 — "Últimos 7 dias"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Mesmo layout. Comparativo vs. 7 dias anteriores (semana retrasada). Suaviza ruído diário (fim de semana, feriado isolado) e mostra tendência semanal.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card 4 — "Mês Atual" (com projeção)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Card destacado (fundo levemente verde claro ou borda mais grossa). Mostra: valor acumulado no mês + barra de progresso indicando "60% do mês decorrido" + projeção linear ("Projeção: R$ 78.750 ao fim do mês").',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que projeção: o número "acumulado de hoje" não diz se o merchant vai bater meta. A projeção (calculada como volume_atual / dias_decorridos × dias_totais_do_mês) responde "se o ritmo continuar, fechamos em X". Crítico para gestores que perseguem metas.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card 5 — "Mês Passado"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Valor consolidado do mês anterior já fechado. Serve de baseline para comparar com a projeção do mês atual ("estamos projetando R$ 78k vs. R$ 75k do mês passado = crescimento de 4%").',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card 6 — Variação MoM (Month-over-Month)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Card focado em uma métrica única e grande: % de variação do mês atual vs. anterior. Ícone de tendência ascendente/descendente, cor verde/vermelha, fonte gigante (text-4xl).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Para que serve: KPI executivo. Esse é o número que vai pra reunião com diretoria. "Crescemos 15% MoM" é o tipo de afirmação que define se o trimestre é positivo.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Estados especiais',
        body:
          'Loading: skeletons cinzas no lugar dos valores. Erro: mensagem "Não foi possível carregar GMV" com botão de retry. Vazio (merchant sem transações): cards mostram R$ 0,00 com mensagem em itálico "Sem transações no período".',
      },
    ],
  },

  // ===========================================================================
  // 5. TRANSACTION METRICS CARDS
  // ===========================================================================
  {
    type: 'section',
    title: 'Transaction Metrics Cards (Cards de Métricas Transacionais)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Faixa de cards focados na quantidade e qualidade das transações (não no volume monetário). Complementa o GMV mostrando a operação em "transações" como unidade.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que separar de GMV',
        body:
          'Volume e quantidade contam histórias diferentes. Um pico de R$ pode ser uma venda gigante isolada. Um pico de quantidade indica saúde de marketing/conversão. Separar em painéis distintos evita confusão analítica.',
      },
      {
        type: 'subsection',
        title: 'Card "Total de Transações"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: contador de TODAS as tentativas de transação no período (aprovadas, recusadas, pendentes). 🎯 PARA QUE SERVE: mede tráfego/demanda. 📐 UI: ícone CreditCard, valor numérico grande, comparativo % vs. período anterior.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card "Aprovadas"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: subset com status="approved". 🎯 PARA QUE SERVE: medir conversão efetiva. É o número que vira receita. 📐 UI: ícone CheckCircle verde, valor + % do total ("1.247 (84,2%)").',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card "Recusadas"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: status="refused" ou "declined". 🎯 PARA QUE SERVE: indicador de problemas — antifraude excessivo, BIN bloqueada, saldo insuficiente do cliente, parametrização ruim. 📐 UI: ícone XCircle vermelho. Hover mostra tooltip com top 3 motivos de recusa.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card "Pendentes"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: status="pending" ou "processing". Tipicamente PIX/boleto aguardando pagamento. 🎯 PARA QUE SERVE: pipeline de receita futura. Saber que há R$ X em pendência é informação financeira importante. 📐 UI: ícone Clock amarelo.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card "Ticket Médio"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: GMV aprovado ÷ quantidade de transações aprovadas. 🎯 PARA QUE SERVE: indicador de "qualidade" da venda média. Aumento de ticket médio costuma ser sinal de cross-sell/up-sell bem-sucedido; queda pode indicar promoções erodindo margem. 📐 UI: ícone DollarSign + valor monetário + comparativo %.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. PERFORMANCE INDICATORS
  // ===========================================================================
  {
    type: 'section',
    title: 'Performance Indicators (Indicadores de Performance)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Faixa de indicadores percentuais e qualitativos: taxa de aprovação geral, taxa de chargeback, score antifraude médio, tempo médio de processamento.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Saúde da operação em uma piscadela. Aprovação caindo? Chargeback subindo? Antifraude ficando lento? Esses 4 indicadores juntos dão um sinal de qualidade quase imediato.',
      },
      {
        type: 'subsection',
        title: 'Indicador "Taxa de Aprovação"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: aprovadas ÷ (aprovadas + recusadas) × 100. Não inclui pendentes (porque ainda não tiveram veredito).',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: gauge semi-circular OU barra horizontal com marcação da meta (linha pontilhada em 85%). Cor adaptativa: verde se ≥85%, amarelo se 75-85%, vermelho se <75%.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que 85% é a meta benchmark: é a média do mercado brasileiro de e-commerce para cartão de crédito. Abaixo disso indica problema (antifraude muito agressivo, MCC errado, BINs bloqueadas, etc.).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Indicador "Taxa de Chargeback"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: chargebacks recebidos ÷ transações aprovadas × 100. 🎯 PARA QUE SERVE: medir saúde do antifraude e qualidade da carteira. As bandeiras Visa e Mastercard monitoram esse indicador (programas VDMP/VFMP/ECM/EFM) e impõem multas se passar de limites (1.0% para Visa, 1.5% para Mastercard em chargebacks gerais).',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: valor com cor adaptativa. Verde <0.5%, amarelo 0.5-1.0%, vermelho >1.0%. Tooltip explicando os thresholds das bandeiras.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Indicador "Score Antifraude Médio"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: média do risk_score retornado pelo provedor antifraude (0-100, onde maior = mais arriscado). 🎯 PARA QUE SERVE: sinal de "qualidade do tráfego" — se o score médio sobe, o merchant está atraindo perfis mais arriscados (talvez por uma campanha de marketing mal segmentada).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Indicador "Tempo Médio de Processamento"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: tempo médio entre transação criada e veredito final (aprovada/recusada). 🎯 PARA QUE SERVE: detectar lentidão da pipeline (adquirente fora do ar, antifraude com timeout). 📐 UI: valor em milissegundos ou segundos. Verde <2s, amarelo 2-5s, vermelho >5s.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 7. BALANCE CARD
  // ===========================================================================
  {
    type: 'section',
    title: 'BalanceCard (Cartão de Saldo Financeiro)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Card horizontal de largura total (full-width) que destaca o saldo da conta merchant em três fatias: Disponível para Saque / A Receber / Bloqueado.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Resposta imediata para a pergunta mais frequente do dia: "quanto eu tenho?". Sem precisar abrir o módulo Financeiro.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que três fatias e não só "saldo total"',
        body:
          'No mundo de payments, "ter dinheiro" é diferente de "poder sacar dinheiro". Recebíveis a vencer (D+30, D+1...) e valores bloqueados por rolling reserve não estão disponíveis. Mostrar separado evita a confusão "achei que tinha mais!" e educa o merchant sobre cash-flow.',
      },
      {
        type: 'subsection',
        title: 'Bloco "Saldo Disponível"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Coluna esquerda. Ícone Wallet verde + label "Disponível para Saque". Valor em fonte grande bold verde (#2bc196) + sufixo "agora" em cinza. Botão "Solicitar Saque" verde primário logo abaixo, levando direto para fluxo de saque.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que botão "Solicitar Saque" aqui: é o ato natural depois de ver o saldo. Reduzir cliques entre "ver" e "agir" aumenta UX.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Bloco "A Receber"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Coluna central. Ícone Clock azul + label "A Receber". Valor + texto auxiliar "em [N] dias" (cálculo da data média de liquidação). Botão secundário "Ver Agenda" → leva para ReceivablesAgenda.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Para que serve: planejamento de fluxo de caixa. Empresário sabe quanto vai entrar nos próximos dias.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Bloco "Bloqueado"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Coluna direita. Ícone Lock vermelho + label "Bloqueado". Valor + texto explicativo "rolling reserve / em disputa". Tooltip "?" explicando o que é rolling reserve.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que destacar: valores bloqueados geram MUITO atrito com merchants quando descobertos por surpresa. Tornar visível e explicado reduz tickets de suporte.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 8. VOLUME CHART
  // ===========================================================================
  {
    type: 'section',
    title: 'VolumeChart (Gráfico de Volume de Vendas)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Gráfico de linhas/áreas mostrando a evolução do GMV ao longo do período selecionado, com duas séries sobrepostas (Cartão vs. PIX).',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Visualizar tendência (subindo, descendo, estável), sazonalidade (picos por dia da semana, hora do dia) e proporção entre cartão e PIX. Identificar "dia ruim" ou "anomalia" facilmente.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que sobrepor cartão e PIX',
        body:
          'Comparação visual entre métodos é uma das análises mais frequentes. Em vez de dois gráficos separados, sobrepor permite ver a "composição" do volume. Permite descobrir, por exemplo, que PIX cresce em dias úteis e cartão cresce em fim de semana (perfil de comprador diferente).',
      },
      {
        type: 'paragraph',
        text:
          '📐 Componente ChartCard que envolve o VolumeChart. Header com título "Volume de Vendas", subtítulo "Cartão vs. PIX", e seletor de período próprio (sincronizado com o do header global).',
      },
      {
        type: 'paragraph',
        text:
          '📐 Eixo X: datas/horas (granularidade adaptativa — 24h mostra de hora em hora, 7d/30d mostra por dia, 90d agrupa semanal). Eixo Y: valor monetário (com formatação K/M para valores grandes — R$ 50K, R$ 1.2M).',
      },
      {
        type: 'paragraph',
        text:
          '📐 Duas linhas/áreas: Cartão em azul (#3b82f6), PIX em verde-água (#14b8a6). Hover sobre qualquer ponto mostra tooltip com data exata + valores das 2 séries + total. Legenda clicável no topo permite ocultar uma série.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Estado vazio: ilustração + texto "Nenhum dado para o período selecionado". Loading: skeleton com altura preservada para evitar layout shift.',
      },
    ],
  },

  // ===========================================================================
  // 9. ABAS DE VISUALIZAÇÃO
  // ===========================================================================
  {
    type: 'section',
    title: 'Abas de Visualização (4 Views Especializadas)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Componente Tabs com 4 abas que organizam análises mais profundas: Executive (visão consolidada), Cartão (deep-dive), PIX (deep-dive), Analytics Avançado.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que abas e não páginas separadas',
        body:
          'Mantém o usuário no mesmo contexto (período aplicado, KPIs visíveis acima). Trocar entre cartão e PIX é tão comum que merece tabs em vez de navegação.',
      },
      {
        type: 'subsection',
        title: 'Aba "Executive" (default)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: visão consolidada para gestor — métricas agnósticas de método, comparativos amplos. 📐 CONTEÚDO: ConversionMetricsCards + 2 ChartCards lado a lado (PaymentMethodsChart e ApprovalRateChart) + ComparativeMetrics.',
          },
          {
            type: 'paragraph',
            text:
              '📐 ConversionMetricsCards: cards com taxa de conversão de checkout (visitantes → iniciaram → concluíram), abandono de carrinho, taxa de retry bem-sucedido.',
          },
          {
            type: 'paragraph',
            text:
              '📐 PaymentMethodsChart: pizza/donut com distribuição % do volume por método (Cartão, PIX, Boleto). Hover mostra valor absoluto.',
          },
          {
            type: 'paragraph',
            text:
              '📐 ApprovalRateChart: barras horizontais — taxa de aprovação POR BANDEIRA (Visa, Mastercard, Elo, Amex, Hipercard). Linha vertical pontilhada na meta de 85%. Bandeiras abaixo da meta destacadas com cor de alerta.',
          },
          {
            type: 'paragraph',
            text:
              '📐 ComparativeMetrics: faixa final com comparações temporais avançadas (este período vs. anterior, este mês vs. mesmo mês ano passado, etc.).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba "Performance Cartão"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: deep-dive em transações de cartão. Para quem opera majoritariamente cartão. 📐 CONTEÚDO: CardPerformanceMetrics (cards com aprovação por bandeira, BINs mais usadas, mix débito/crédito, parcelamento médio, share de cartões internacionais) + DeclineAnalysis (top motivos de recusa com %, agrupados por categoria — soft decline, hard decline, antifraude, etc.).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba "Performance PIX"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: deep-dive PIX. 📐 CONTEÚDO: PixFlowCards (cards com PIX IN — recebidos / PIX OUT — enviados/devoluções / saldo líquido PIX) + PixPerformanceMetrics (taxa de pagamento de QR Codes gerados, tempo médio para pagamento, % expirados, ticket médio PIX) + grid 2x1 com HeatmapChart de "Volume por dia/hora" e HeatmapChart de "Aprovação por dia/hora".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PixFlowCards: PIX é bidirecional (in e out) ao contrário de cartão. Separar entrada e saída é semanticamente correto e necessário para conciliação.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Heatmaps: matriz 7×24 (dias da semana × horas do dia) com cores indicando intensidade. Identifica horários de pico, "horários mortos", padrões de comportamento. Clicar em uma célula filtra a tabela de transações por aquele dia/hora.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Aba "Analytics Avançado"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: análises customizáveis e exploratórias. 📐 CONTEÚDO ATUAL: grid com HeatmapChart de volume + DeclineAnalysis. 📐 EXPANSÃO PREVISTA: cohort analysis, funil de checkout, análise de churn, retention, LTV.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 10. RECENT TRANSACTIONS + ALERTS PANEL
  // ===========================================================================
  {
    type: 'section',
    title: 'Bloco Final — Transações Recentes + Painel de Alertas',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Última seção da página: grid 3-colunas onde 2/3 mostram transações recentes (lista compacta) e 1/3 mostra alertas operacionais ativos.',
      },
      {
        type: 'subsection',
        title: 'RecentTransactions (2/3 da largura)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: lista compacta com as últimas 5-10 transações, mostrando: ícone do método, valor, status (badge colorido), nome do cliente, data relativa ("há 2 min"). Clicável → leva para TransactionDetail.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: confirmar visualmente que está chegando movimento "agora" e identificar problemas em tempo real (várias recusas seguidas no rodapé indicam algo errado).',
          },
          {
            type: 'paragraph',
            text:
              '📐 Card com header "Transações Recentes" + botão "Ver todas" no canto direito → leva para /Transactions. Lista com hover destacando linha. Status como badge colorido (StatusBadge component). Datas relativas calculadas em tempo real (atualiza sozinho conforme tempo passa).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'AlertsPanel (1/3 da largura)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: painel vertical de alertas ativos exigindo atenção do merchant. Cada alerta tem severidade (info, warning, critical), título, descrição curta e botão de ação.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: notificar proativamente sobre coisas que o merchant precisa fazer. Em vez de espalhar alertas pelo sistema, concentra todos aqui.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Tipos de alertas comuns:',
          },
          {
            type: 'list',
            items: [
              '🚨 CRITICAL — "Documento KYC vencido — atualize em 7 dias para evitar bloqueio" → botão "Atualizar"',
              '⚠️ WARNING — "Taxa de chargeback em 0.85% (acima do alvo de 0.5%)" → botão "Ver disputas"',
              '⚠️ WARNING — "3 webhooks falhando há 2h" → botão "Ver webhooks"',
              'ℹ️ INFO — "Novo recurso: Coupons disponível!" → botão "Conhecer"',
              'ℹ️ INFO — "Saque agendado para amanhã: R$ 12.450,00" → botão "Ver detalhes"',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: cada alerta como linha com ícone colorido (vermelho/amarelo/azul), título bold pequeno, descrição cinza menor, botão com seta. Clique no botão executa ação ou navega.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Estado vazio (raro): ilustração de "tudo certo" + texto "Nenhum alerta no momento — operação saudável!".',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 11. ESTADOS GERAIS DA PÁGINA
  // ===========================================================================
  {
    type: 'section',
    title: 'Estados Gerais da Página',
    children: [
      {
        type: 'subsection',
        title: 'Loading inicial',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Cada bloco tem seu próprio skeleton (não há spinner global de página). KPIs viram retângulos cinzas pulsantes, gráficos viram retângulos com altura preservada, listas viram linhas cinzas. UX: a estrutura visual aparece imediatamente, só os números preenchem aos poucos. Evita layout shift.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Erro de carregamento',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Bloco específico que falhou mostra "Não foi possível carregar este painel" + botão "Tentar novamente". Outros blocos continuam funcionais. UX: falha parcial não derruba a página inteira.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Estado "merchant novo" (sem dados)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Quando o merchant ainda não tem nenhuma transação, em vez de mostrar todos os zeros desanimadores, mostra-se um onboarding ilustrado: "Seu dashboard ganha vida quando você processa sua primeira transação. Comece criando um link de pagamento ou integrando via API." + 2 CTAs.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que: primeiro contato é crítico. Mostrar zeros transmite "isso aqui não funciona". Mostrar guidance transmite "vamos te ajudar a começar".',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Modo Escuro',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Toda a página tem suporte completo a dark mode via classes Tailwind. Cards trocam de bg-white para bg-[#003459] (tema PagSmile escuro), bordas para bg-[#004D73], textos invertem hierarquia de cinzas. Cores de status (verde/vermelho/amarelo) ficam levemente mais saturadas no dark para garantir contraste.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Responsividade',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Mobile (<640px): todos os grids viram coluna única. Cards de KPI ficam 1 por linha. Gráficos mantêm altura mas reduzem labels. Abas mantêm formato horizontal com scroll lateral se necessário. Tablet (640-1024): grids 2 colunas. Desktop (>1024px): grids 3-4 colunas como desenhado.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 12. INTEGRAÇÕES E ORIGEM DOS DADOS
  // ===========================================================================
  {
    type: 'section',
    title: 'Integrações & Origem dos Dados',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Os dados vêm de duas queries React Query principais: (1) lista de transações (Transaction.list ordenada por created_date desc, limite 200) e (2) lista de disputas abertas (Dispute.filter status=open). Cálculos de KPIs são feitos no cliente a partir desses dois conjuntos.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Saldos no BalanceCard atualmente vêm com valores mock (125.430,50 / 45.200,75 / 2.500,00). A integração real virá das entidades Subaccount e FinancialEntry com somatório por categoria.',
      },
      {
        type: 'paragraph',
        text:
          '📐 GMV data tem cálculos derivados (today, yesterday, last7days, currentMonth, lastMonth, monthProjection) — atualmente feitos com mock baseado em totalGMV. Versão final calculará agrupando transações aprovadas por janela temporal real.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Cache & Atualização',
        body:
          'React Query mantém cache de 5 minutos por padrão. O usuário não vê o dashboard "ficar velho" porque há refetch automático ao trocar de aba do navegador (refetchOnWindowFocus). Para forçar atualização instantânea, há botão de refresh em cada ChartCard.',
      },
    ],
  },
];