// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DunningSettings e /SubscriptionAnalytics
// =============================================================================

// =============================================================================
// PÁGINA 1: /DunningSettings — Régua de Cobrança
// =============================================================================

export const DunningSettingsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Configuração de Dunning',
    body:
      'PAINEL DE CONFIGURAÇÃO da régua de cobrança — o conjunto de regras automáticas que o sistema executa quando uma cobrança recorrente FALHA. "Dunning" é o jargão internacional para "ações de cobrança/recuperação após falha". Esta tela é um FORMULÁRIO LONGO em 4 abas (Retentativas, E-mails, SMS/WhatsApp, Ações) que persiste 1 entidade DunningConfig. Cada switch/input ajusta DEZENAS de comportamentos do motor.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) MAXIMIZAR RECUPERAÇÃO de receita perdida por falhas técnicas (cartão vencido, saldo insuficiente). (2) AUTOMATIZAR comunicação com cliente (e-mails de pré-cobrança, lembretes, último aviso). (3) DEFINIR EXPERIÊNCIA pós-falha (oferecer Pix com desconto? gerar link de atualização de cartão?). (4) CONFIGURAR ESCALADA: quando dar como perdido (cancelar após X dias). (5) IMPACTO FINANCEIRO: dunning bem configurado pode recuperar 70-80% das falhas — tipicamente 5-10% da receita líquida em SaaS.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que é uma das telas mais valiosas do produto',
    body:
      'Uma falha de cobrança não tratada = receita PERDIDA + cliente PERDIDO + churn involuntário. Dunning bem feito captura ambos. Por isso essa configuração é "estado da arte" — granular, multi-canal, com IA opcional, com escapes (Pix), com timing otimizado. Reflete maturidade SaaS.',
  },

  {
    type: 'section',
    title: '1. PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Title="Configuração de Dunning". Subtitle="Configure a régua de cobrança para recuperação de pagamentos". Breadcrumb 2 níveis "Dashboard › Assinaturas › Dunning".',
      },
      {
        type: 'subsection',
        title: 'Botão "Salvar Configurações" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 onClick: handleSave() → saveMutation.mutate(formData). Backend: se já existe DunningConfig is_default=true, faz UPDATE; caso contrário CREATE. Label dinâmico "Salvando..." durante mutation.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 ÚNICO botão de ação primária — toda a tela é configuração. Sem "Resetar" — gestor que não quer salvar simplesmente sai sem clicar.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. TabsList Principal (4 abas)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 TabsList bg-white border. 4 abas com ícones. defaultValue="retries" (abre na configuração mais crítica).',
      },
      {
        type: 'list',
        items: [
          'ABA "Retentativas" (RefreshCw) — quantas, quando, com IA',
          'ABA "E-mails" (Mail) — régua de e-mails (8 tipos)',
          'ABA "SMS/WhatsApp" (MessageCircle) — canais alternativos',
          'ABA "Ações" (Settings) — comportamentos pós-falha (suspender, cancelar, link cartão, Pix alternativo)',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 ORDEM: começa pelo mecanismo TÉCNICO (retentativas), depois o canal MAIS USADO (e-mail), depois canais ALTERNATIVOS, e por fim AÇÕES TERMINAIS. Vai do "automático imediato" ao "decisão final".',
      },
    ],
  },

  {
    type: 'section',
    title: '3. Aba "Retentativas"',
    children: [
      {
        type: 'subsection',
        title: '3.A — Card "Retentativas Automáticas"',
        children: [
          {
            type: 'subsection',
            title: 'Número de Retentativas (SelectionButton grid 6 cols)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Grid 6 cols com 6 botões "1x" a "6x" usando componente SelectionButton. Selected: visual destacado.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE até 6: Curva de retornos decrescentes — após 4-5 tentativas, ROI próximo de zero. Mais que 6 vira assédio.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Intervalos entre tentativas (array dinâmico)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Mostra retry_intervals[] como array de Inputs editáveis com label "1ª: X dias", "2ª: Y dias", etc. Default [1, 3, 7, 14, 21]. Min=1.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE arrays editáveis: gestor sofisticado quer customizar. Ex: cliente B2B aceita intervalos maiores; B2C melhor mais agressivo no início.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PADRÃO 1-3-7-14-21: cresce não-linearmente (Fibonacci-like). Reflete "se cliente não pagou em 3 dias, pouco provável que pague no 4º; melhor esperar 4 dias". Conservação de recursos.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Estratégia de Horário (3 SelectionButton em grid 3 cols)',
            children: [
              {
                type: 'list',
                items: [
                  '"Mesmo horário" — replica horário da cobrança original',
                  '"Inteligente (IA)" — IA escolhe melhor momento baseado em histórico',
                  '"Horário Fixo" — usuário define HH:MM (input type=time aparece se selecionado)',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 NUANCE "Inteligente (IA)": ML treinado em milhões de transações sabe que "terças 10h" tem maior taxa de aprovação que "domingos 23h". Diferença de 5-15% em recuperação.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE "Horário Fixo" também: nem todos confiam em IA. Algumas indústrias têm padrões previsíveis (folha de pagamento todo dia 5). Permite controle total.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Banner "Otimização com IA" (bg-purple-50 com Switch)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Banner bg-purple-50 com border-purple-200. Ícone Zap roxo + título + descrição "IA escolhe o melhor momento baseado em dados" + Switch ai_optimization_enabled.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE banner separado e roxo: feature PREMIUM/diferencial. Cor roxa = "inteligente/avançado". Destaque visual atrai engajamento.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '4. Aba "E-mails" (régua completa)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Lista vertical de itens (cada um é uma linha border rounded-lg p-3) onde cada e-mail tem Switch on/off + (opcionalmente) input de "dias" para timing. 8 tipos de e-mail cobrindo o ciclo completo de cobrança.',
      },
      {
        type: 'subsection',
        title: 'E-mails de transação (3 itens)',
        children: [
          {
            type: 'list',
            items: [
              'E-mail de Pré-Cobrança — "Lembrete X dias antes" + Input dias + Switch. Default 3 dias',
              'E-mail de Cobrança Realizada — confirmação após sucesso. Switch only',
              'E-mail de Falha Imediata — após primeira falha. Switch only',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE Pré-Cobrança: TRANSPARÊNCIA. Cliente recebe "vamos cobrar R$99 em 3 dias". Reduz disputas e chargebacks por "não reconheço".',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Bloco "E-mails de Lembrete" (array dinâmico)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Border-t pt-4. Renderiza array reminder_emails (default 3 lembretes). Cada item: Input dias após falha + Switch. Default [3, 7, 15].',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 3 lembretes escalonados: 3 dias = "lembrete amistoso". 7 dias = "atenção, atualize cartão". 15 dias = "urgente". Tom progressivamente mais firme. Convenção de marketing de cobrança.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'E-mail de Último Aviso (bg-red-50)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Item destacado bg-red-50 + border-red-200. Texto vermelho. Input "X dias antes de cancelar" (default 3).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE bg vermelho: e-mail TERMINAL. Comunica gravidade ao próprio admin que está configurando — "este é o último". Visual ajuda a não desligar acidentalmente.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'E-mail de Cancelamento',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Switch para enviar e-mail informando que assinatura foi cancelada. POR QUE opcional: alguns merchants preferem cancelamento silencioso para evitar "ressentimento" do cliente. Outros valorizam transparência.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '5. Aba "SMS/WhatsApp"',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Layout',
        body:
          '2 Cards verticais — primeiro SMS, segundo WhatsApp. Mesma estrutura: Switch master + (se habilitado) inputs de timing/limites.',
      },
      {
        type: 'subsection',
        title: 'Card SMS',
        children: [
          {
            type: 'list',
            items: [
              'Switch "Ativar SMS"',
              'Input "SMS após falha (dias)" — default 5',
              'Input "Máximo de SMS" — default 2, max=5',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE limite máx 5: SMS é INVASIVO e tem CUSTO ($0,10/SMS no BR). Limite previne "spamming" + estouro de orçamento.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE só "após X dias": SMS é último recurso (incômodo). Não dispara imediato. Só após 5 dias sem resposta a e-mail.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Card WhatsApp',
        children: [
          {
            type: 'list',
            items: [
              'Switch "Ativar WhatsApp"',
              'Input "WhatsApp após falha (dias)" — default 3',
              'Input "Máximo de mensagens" — default 2, max=3',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE WhatsApp dispara MAIS CEDO que SMS (3 vs 5 dias): WhatsApp é mais aceito culturalmente no BR. Menos invasivo que SMS — pessoa vê mensagens o dia todo.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE limite ainda menor que SMS (3 vs 5): WhatsApp Business tem regras de spam mais rígidas. Mais que 3 = risco de banimento da conta business.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '6. Aba "Ações" (3 cards)',
    children: [
      {
        type: 'subsection',
        title: '6.A — Card "Ações após Falhas"',
        children: [
          {
            type: 'list',
            items: [
              'Grid 2 cols: Input "Suspender após X falhas" (default 3, max 10) + Input "Cancelar após X dias" (default 30, range 7-90)',
              'Select "Ação de Cancelamento" — 3 opções: silent / send_email / offer_discount',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 SUSPENDER ≠ CANCELAR: Suspender = cliente perde acesso temporariamente, mas pode ser RESGATADO. Cancelar = relação encerrada, exige novo onboarding.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE "Ação de Cancelamento":',
          },
          {
            type: 'list',
            items: [
              'silent → cancela sem notificar (evita feedback negativo)',
              'send_email → envia e-mail explicando',
              'offer_discount → ÚLTIMA tentativa: oferece desconto para reativar (Hail Mary do CRM)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE "offer_discount" no momento mais crítico: estatística mostra que 10-15% dos cancelados aceitam desconto na hora certa. Padrão Netflix/Spotify.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '6.B — Card "Link de Atualização de Cartão"',
        children: [
          {
            type: 'list',
            items: [
              'Switch "Gerar link único" (default true)',
              'Input "Validade do link (horas)" — default 72, min 24',
              'Select "Após atualização" — retry_immediately / wait_next_cycle',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: motivo #1 de falhas = cartão vencido. Link permite cliente atualizar cartão SEM logar no sistema (one-click). Aumenta conversão de "cliente quer pagar mas não consegue" em 30%+.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE "Após atualização":',
          },
          {
            type: 'list',
            items: [
              'retry_immediately → tenta cobrança em segundos (cliente que acabou de atualizar)',
              'wait_next_cycle → aguarda próxima cobrança regular (mais conservador)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 72h default: tempo razoável para cliente lembrar. Menor que 24h = cliente não vê. Maior que 7 dias = link "envelhece" sem ser usado.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '6.C — Card "Pix como Alternativa"',
        children: [
          {
            type: 'list',
            items: [
              'Switch "Oferecer Pix quando cartão falha" (default true)',
              'Input "Desconto para Pix (%)" — default 5, max 20',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: quando cartão falha repetidamente, sistema oferece Pix com desconto. Pix tem 99%+ de aprovação. Estratégia "salva-cobrança".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE desconto: incentivar conversão. Sem desconto, cliente pode adiar. Com 5-10% off, vira "boa oferta". Custo do desconto < custo de churn.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE: este Pix é AVULSO (não recorrente). Cliente paga 1 ciclo via Pix; próximo volta para cartão. Salva o ciclo, não muda método permanentemente.',
          },
        ],
      },
    ],
  },
];

// =============================================================================
// PÁGINA 2: /SubscriptionAnalytics — Métricas de SaaS estado-da-arte
// =============================================================================

export const SubscriptionAnalyticsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Analytics de Recorrência',
    body:
      'DASHBOARD ANALÍTICO ESTRATÉGICO para receita recorrente — diferente de /Subscriptions (operacional) e /Recurrence (motor de execução). Aqui foco é INSIGHTS de SaaS-grade: MRR/ARR com gradient cards, secondary KPIs, e 3 abas profundas (Evolução MRR, Análise de Churn, Cohort Analysis com tabela colorida heatmap).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) JUSTIFICAR INVESTIMENTOS: investidores e diretoria querem ARR/MRR para avaliar saúde do negócio. (2) DETECTAR PROBLEMAS DE RETENÇÃO antes de virarem catástrofe (cohort analysis revela em qual mês a coorte cai). (3) ENTENDER POR QUE clientes cancelam (gráfico de motivos). (4) CALIBRAR PREÇOS: ver MRR por plano detecta se Premium vale o esforço. (5) COMPARAR COHORTS para validar hipóteses ("aumentamos preço em Out/24, ela retém pior?").',
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'Implementação atual',
    body:
      'Página combina dados REAIS (subscriptions via base44) com dados MOCKADOS para charts (mrrData, churnByCycleData, churnByPlanData, cohortData). MRR/Ativos calculados de subs reais; charts ilustrativos. Quando histórico tiver volume, charts se tornam reais.',
  },

  {
    type: 'section',
    title: '1. PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Title="Analytics de Recorrência" + subtitle="Métricas de MRR, Churn, LTV e análise de cohorts". Breadcrumb 2 níveis.',
      },
      {
        type: 'subsection',
        title: 'Select de Período (action)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Select w-40 com 4 opções: 30 dias / 3 meses / 6 meses (default) / 12 meses.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 6 meses default: janela suficiente para ver tendências sem ruído de curto prazo. < 3m = ruído. > 12m = obscurece mudanças recentes.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LIMITAÇÃO ATUAL: state period existe mas dados mock NÃO se alteram com mudança. Versão real recalcularia.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. Main KPIs (4 cards GRADIENT coloridos)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Composição',
        body:
          '4 cards COLORIDOS COM GRADIENTE diagonal (from-X-500 to-X-600). Texto branco. Layout flex com ícone grande à direita. DIFERENTE dos KPIs comuns (fundo branco) — chama atenção como "métricas-norte".',
      },
      {
        type: 'list',
        items: [
          'KPI 1 "MRR" (gradient emerald) — formatCurrency(mrr) text-3xl. ArrowUpRight + "+12.5% vs mês anterior". Ícone DollarSign 10×10',
          'KPI 2 "ARR" (gradient blue) — formatCurrency(mrr × 12). Subtexto "Receita anual projetada". Ícone Calendar',
          'KPI 3 "Assinantes Ativos" (gradient purple) — activeSubscriptions.length text-3xl. ArrowUpRight + "+8 novos este mês". Ícone Users',
          'KPI 4 "Churn Rate" (gradient red) — churnRate.toFixed(1) + "%". ArrowDownRight + "-0.5% vs mês anterior". Ícone UserMinus',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE GRADIENT cards: hierarquia visual. Estes 4 são "OS NÚMEROS QUE IMPORTAM". Visual chamativo destaca da grid de KPIs secundários abaixo.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE ARR = MRR × 12: convenção SaaS. Receita recorrente anualizada permite comparar com empresas tradicionais que reportam annual revenue. Investidores BR pedem ARR.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE direções dos arrows: MRR/Ativos têm ArrowUpRight (subindo é bom). Churn tem ArrowDownRight (descendo é bom). Coerência semântica.',
      },
    ],
  },

  {
    type: 'section',
    title: '3. Secondary KPIs (4 KPICards padrão)',
    children: [
      {
        type: 'list',
        items: [
          'KPI "LTV Médio" (Target indigo) — total_paid médio dos ativos',
          'KPI "Ciclos Médios" (RefreshCw orange) — current_cycle médio',
          'KPI "Trial → Pago" (TrendingUp cyan) — % de conversão de trial',
          'KPI "Em Trial" (Clock amber) — count de trial',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE 4 secondary: complementam os 4 primary. LTV explica MRR (cada cliente vale Y). Ciclos = retenção. Trial→Pago = qualidade do funil. Em Trial = pipeline futuro.',
      },
    ],
  },

  {
    type: 'section',
    title: '4. TabsList (3 abas analíticas)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 TabsList bg-white border. defaultValue="mrr". 3 abas profundas.',
      },
      {
        type: 'list',
        items: [
          'ABA "Evolução MRR" — análise temporal de receita',
          'ABA "Análise de Churn" — onde e por que clientes cancelam',
          'ABA "Cohort Analysis" — retenção por safra de aquisição',
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '5. Aba "Evolução MRR" (3 charts)',
    children: [
      {
        type: 'subsection',
        title: '5.A — Chart principal "Evolução do MRR" (AreaChart 320px)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 AreaChart Recharts com 1 série "MRR Total" stroke #10b981 fill com fillOpacity 0.3. 6 meses de dados. CartesianGrid dashed. YAxis tickFormatter "R$Xk".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: ver TENDÊNCIA. Linear ascendente = crescimento saudável. Plateau = saturação. Queda = problema crítico.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '5.B — Grid 2 cols com 2 charts',
        children: [
          {
            type: 'subsection',
            title: 'Chart "Net New MRR" (BarChart agrupado)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 BarChart com 3 séries: Novo (verde #22c55e), Expansão (azul #3b82f6), Churn (vermelho #ef4444 — VALORES NEGATIVOS).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: decomposição do MRR. Net New = Novo + Expansão - Churn. Identifica MOTOR do crescimento. Crescimento por aquisição (verde alto) ≠ por upsell (azul alto). Estratégias diferentes.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE Churn em valores negativos: visualmente "puxa para baixo" da soma. Empilha mentalmente o net.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Chart "MRR por Plano" (PieChart donut)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Donut innerRadius=60 outerRadius=90. 3 fatias hardcoded: Básico R$15k cinza, Pro R$30k azul, Premium R$23k roxo. Label "{name} {percent}%".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: ver QUAL plano gera mais MRR. Pro liderando = ponto-doce do mercado. Premium pequeno = mercado premium subexplorado OU positionamento errado.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '6. Aba "Análise de Churn"',
    children: [
      {
        type: 'subsection',
        title: '6.A — Grid 2 cols com 2 charts',
        children: [
          {
            type: 'subsection',
            title: 'Chart "Churn por Ciclo" (BarChart HORIZONTAL)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 BarChart layout="vertical" (= horizontal visualmente). Eixo X numérico %, Eixo Y categórico ("1º mês", "2º mês", ..., "6º mês+"). Barras vermelhas #ef4444 com radius [0,4,4,0].',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 DADO MOCK típico: 1º mês=18%, 2º=8%, 3º=5%, 4º=3%, 5º=2%, 6º+=1.5%. Curva DECRESCENTE — quem sobrevive aos primeiros meses fica.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: identificar "ciclo de morte" (geralmente 1º-2º mês). Investimento em ONBOARDING tem ROI máximo se mira aqui.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Chart "Churn por Plano" (PieChart donut)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 Donut igual MRR por Plano mas com dados de CHURN: Básico 45%, Pro 30%, Premium 25%.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: distribuição absoluta de cancelamentos. Básico tendendo a churnar mais é normal (mais clientes, menor compromisso). Premium churnando muito = sinal de problema (clientes que pagam mais devem ficar mais).',
              },
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: '6.B — Card "Principais Motivos de Cancelamento" (lista com Progress)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Lista vertical de 5 itens. Cada item: linha 1 com nome + "X (Y%)" + linha 2 com Progress bar h-2 vermelha.',
          },
          {
            type: 'list',
            items: [
              'Não utiliza mais o serviço — 45 (35%)',
              'Preço muito alto — 32 (25%)',
              'Encontrou alternativa melhor — 20 (15%)',
              'Falha de pagamento (involuntário) — 18 (14%)',
              'Outros — 15 (11%)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: cada motivo gera uma estratégia. "Não utiliza" → melhor onboarding. "Preço alto" → revisão de pricing. "Alternativa" → análise competitiva. "Falha de pagamento" → ajustar dunning.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE "Falha de pagamento (involuntário)": esse churn NÃO é vontade do cliente. É falha técnica. Diferenciado dos outros 4 (voluntários). Otimizar dunning afeta DIRETAMENTE este número.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 ORIGEM dos dados: cancellation_reason coletado no modal de cancelamento da página /Subscriptions. Por isso 5 categorias padronizadas lá são CRÍTICAS — sem elas, este chart não existe.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '7. Aba "Cohort Analysis" (HEATMAP)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é Cohort Analysis',
        body:
          'COHORT = grupo de clientes adquiridos no mesmo período. Tabela mostra % retidos a cada mês após aquisição. Ex: "100 clientes adquiridos em Jul/24 — em Jul ainda 100%, em Ago 85%, em Set 78%...". Permite comparar "qualidade" de safras de aquisição.',
      },
      {
        type: 'subsection',
        title: 'Tabela com células coloridas (heatmap)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Table HTML básico. Headers: Cohort + Mês 1 a Mês 6. Linhas = mês de aquisição (Jul/24 a Dez/24). Cada célula colorida via getCellColor(value).',
          },
          {
            type: 'subsection',
            title: 'getCellColor — heatmap de retenção',
            children: [
              {
                type: 'list',
                items: [
                  'null → bg-gray-100 (sem dado, mês ainda não chegou)',
                  '≥80% → bg-green-500 + text-white (excelente)',
                  '60-80% → bg-green-300 (bom)',
                  '40-60% → bg-yellow-300 (atenção)',
                  '20-40% → bg-orange-300 (ruim)',
                  '<20% → bg-red-300 (crítico)',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 5 faixas de cor: heatmap padrão de cohort. Verde "valeu o investimento", amarelo "preocupante", laranja "perdendo", vermelho "fracasso".',
              },
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 INTERPRETAÇÃO PADRÃO da tabela:',
          },
          {
            type: 'list',
            items: [
              'COLUNA Mês 1 sempre 100% verde (baseline — todos vivos no início)',
              'CADA COLUNA seguinte mostra DECAIMENTO',
              'LINHA TRIANGULAR DESCENDENTE — Dez/24 só tem Mês 1 ainda (recém adquirida)',
              'COMPARAR COHORTS verticalmente: Out/24 reteve 87% no Mês 2 vs Set/24 90% — Out foi pior',
              'COMPARAR diagonalmente — qualidade de retenção evoluindo no tempo',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Legenda (final do card)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Linha flex items-center gap-4 com 5 mini-blocos coloridos + label da faixa. "Legenda:" + 80%+ / 60-80% / 40-60% / 20-40% / <20%.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE legenda separada e não inline: cohort é matriz visual densa. Legenda explica código de cor sem poluir matriz. Convenção universal de heatmaps.',
          },
        ],
      },
    ],
  },
];