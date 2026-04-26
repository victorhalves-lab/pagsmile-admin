// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Subscriptions
// Lista operacional de assinaturas ativas (instâncias de planos)
// =============================================================================

export const SubscriptionsDoc = [
  // ===========================================================================
  // INTRODUÇÃO ESTRATÉGICA
  // ===========================================================================
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Assinaturas',
    body:
      'É o HUB OPERACIONAL de gestão de TODAS as assinaturas (entidade Subscription) do merchant. Esta tela mostra cada cliente recorrente individualmente — qual plano ele assina, quanto paga, em qual ciclo está, quando é a próxima cobrança, qual é o status atual (trial/ativa/inadimplente/pausada/cancelada). Não é uma tela de "configuração de planos" (essa é /SubscriptionPlans) e nem é uma tela de "motor de execução técnico" (essa é /Recurrence). Aqui o foco é GESTÃO DA RELAÇÃO COM CADA ASSINANTE INDIVIDUAL — pausar a assinatura de um cliente específico, cancelar a assinatura do João, oferecer um desconto para a Maria que ameaça cancelar.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve no dia a dia operacional',
    body:
      '(1) GESTÃO INDIVIDUAL: o gestor entra nessa tela quando precisa agir em UM cliente específico — ajustar (cancelar, pausar, descontar, alterar pagamento). (2) MONITORAMENTO DE INADIMPLÊNCIA: o banner laranja chamativo + KPI customizado permitem identificar problemas de receita em tempo real e agir antes de perder o cliente. (3) SUPORTE AO CLIENTE: quando um cliente liga reclamando ou pedindo cancelamento, o atendente abre essa tela, busca pelo nome/email/plano e age em segundos. (4) DISTINÇÃO DE ESTADOS: as 6 abas dividem o universo total em segmentos acionáveis — trial precisa "converter", inadimplente precisa "recuperar", pausada precisa "retomar". (5) CONTROLE DE RECEITA RECORRENTE: o número de MRR sempre visível no topo dá o pulso financeiro do negócio recorrente em segundos.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Diferença crucial entre Subscription, SubscriptionPlan e Recurrence',
    body:
      'PLANO (SubscriptionPlan) = TEMPLATE/produto que o merchant cria UMA VEZ ("Plano Premium R$99/mês com trial de 7 dias"). ASSINATURA (Subscription) = INSTÂNCIA desse plano para 1 cliente específico ("João Silva assina o Plano Premium desde 15/06/2024, está no ciclo 7, próxima cobrança 15/01/2025"). RECORRÊNCIA (Recurrence) = MOTOR DE EXECUÇÃO genérico que cobra automaticamente — não é só de SaaS, pode ser cobrança avulsa recorrente (mensalidade escolar, doação ONG). Esta página gerencia o nível "ASSINATURA" — instâncias vivas, com dados de cliente, ciclo atual, valor cobrado e status operacional.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Fonte real de dados (não é mock)',
    body:
      'Diferente de várias telas analíticas, esta consome DADOS REAIS via base44.entities.Subscription.list("-created_date", 100) — busca as 100 assinaturas mais recentes ordenadas pela data de criação descendente. Toda a interface (KPIs, banner, tabs, tabela) é calculada in-memory a partir desse array. Mutations de pause/resume/cancel/discount também persistem no backend via base44.entities.Subscription.update().',
  },

  // ===========================================================================
  // 1. PAGEHEADER COM 4 BOTÕES DE AÇÃO
  // ===========================================================================
  {
    type: 'section',
    title: '1. PageHeader — título + breadcrumb + 4 botões à direita',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 ESTRUTURA TÉCNICA: usa o componente <PageHeader> compartilhado. title=t("subscriptions.title") (i18n — em PT geralmente "Assinaturas"). subtitle propositalmente recebe a MESMA chave de tradução (igual ao title) — sinaliza que esta é a tela "raiz" do módulo, não precisa de subtítulo descritivo separado. breadcrumb tem 1 nível: "Dashboard › Assinaturas".',
      },
      {
        type: 'paragraph',
        text:
          '📐 ÁREA DE AÇÕES: prop "actions" recebe um <div className="flex gap-2"> contendo 4 botões em sequência horizontal. Os 3 primeiros são variant="outline" (secundários, com borda); o 4º é o botão verde primário (#00D26A) — gradação visual normal para "ações secundárias + ação primária".',
      },

      // ----- Botão 1: Planos -----
      {
        type: 'subsection',
        title: '1.A — Botão "Planos" (outline, ícone Settings)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 onClick: navigate(createPageUrl("SubscriptionPlans")). Ícone: Settings 4×4 (engrenagem). Label: t("subscriptions.plans"). Variant outline = borda fina, sem fundo, hover discreto.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: navega para /SubscriptionPlans, a tela de gestão de TEMPLATES de planos. É um shortcut entre nível "instâncias" (esta tela) e nível "templates" (planos disponíveis para assinar).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE existe esse atalho: gestor frequentemente cria um plano novo na outra tela e quer voltar pra ver assinantes; ou está vendo assinantes de um plano e quer ajustar o template em si. Sem o atalho, teria que navegar pelo menu lateral. Frequência alta justifica botão dedicado.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE ícone Settings (engrenagem): planos = "configuração do produto recorrente". Não é um catálogo passivo (que seria List). É algo que o gestor edita ativamente. Settings comunica essa natureza.',
          },
        ],
      },

      // ----- Botão 2: Dunning -----
      {
        type: 'subsection',
        title: '1.B — Botão "Dunning" (outline, ícone RefreshCw)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 onClick: navigate(createPageUrl("DunningSettings")). Ícone: RefreshCw 4×4 (setas de atualização circular). Label: t("menu.dunning"). Variant outline.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: leva à régua de cobrança — configuração de quantas vezes tentar recobrar uma falha, em quais intervalos, quais e-mails enviar, quando cancelar. É a ALAVANCA ESTRATÉGICA de retenção involuntária. Se a inadimplência sobe, o gestor vai ajustar a régua.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE ícone RefreshCw: comunica a natureza de "tentar de novo" do dunning — toda a régua é sobre RETENTATIVAS após falha. Setas circulares = ciclo de tentar-falhar-tentar-tentar.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 RELAÇÃO DIRETA com o banner laranja: quando há inadimplentes, o banner laranja oferece esse mesmo destino. Redundância intencional — gestor que clica no banner sabe que está agindo sobre o problema visualmente identificado.',
          },
        ],
      },

      // ----- Botão 3: Analytics -----
      {
        type: 'subsection',
        title: '1.C — Botão "Analytics" (outline, ícone BarChart3)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 onClick: navigate(createPageUrl("SubscriptionAnalytics")). Ícone: BarChart3 4×4 (gráfico de barras com 3 colunas). Label: t("menu.analytics"). Variant outline.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: leva ao dashboard analítico de assinaturas — MRR/ARR coloridos, cohort analysis, gráficos de churn por ciclo, motivos de cancelamento. É a "visão estratégica" que complementa essa "visão operacional".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 3 botões de navegação contextual: as três telas (Planos, Dunning, Analytics) formam o ECOSSISTEMA de assinaturas. Estar em uma delas com atalhos para as outras minimiza navegação e mantém o gestor em "modo recorrência" sem perder contexto mental.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE ícone BarChart3: convenção universal para "analytics". Reforça que é zoom-out estratégico (cohort, churn por mês, evolução MRR) — diferente da granularidade individual desta tela.',
          },
        ],
      },

      // ----- Botão 4: Nova Assinatura -----
      {
        type: 'subsection',
        title: '1.D — Botão "Nova Assinatura" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 className="bg-[#00D26A] hover:bg-[#00A854]" — verde PagSmile sólido, hover escurece para verde mais profundo. Ícone: Plus 4×4. Label composto via i18n: t("common.new") + espaço + t("subscriptions.title") → "Novo Assinaturas" (limitação de i18n; em produção viraria "Nova Assinatura").',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: ação primária da página. Permite criar manualmente uma assinatura para um cliente — útil quando vendedor fechou contrato off-channel e precisa registrar a cobrança recorrente.',
          },
          {
            type: 'paragraph',
            text:
              '⚠️ LIMITAÇÃO ATUAL: o botão NÃO TEM onClick handler. É puramente visual. Numa versão final, deve abrir um SideDrawer com formulário: seleção de cliente (autocomplete), seleção de plano (dropdown buscando em SubscriptionPlan), data da primeira cobrança (date picker), método de pagamento. Após salvar, criaria a entidade Subscription apontando para o plano selecionado.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE verde PagSmile e não outline como os outros 3: hierarquia visual clara — os 3 primeiros são "navegação" (cinza/branco), este é "ação criativa". Cor primária verde destaca como CTA principal da tela.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. GRID DE 5 KPIs
  // ===========================================================================
  {
    type: 'section',
    title: '2. Grid de 5 KPIs no topo',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Composição geral do grid',
        body:
          '📐 Grid responsivo Tailwind: grid-cols-1 (mobile) sm:grid-cols-2 (tablet) lg:grid-cols-5 (desktop) gap-4. Os 4 PRIMEIROS KPIs usam o componente compartilhado <KPICard>. O 5º (Inadimplentes) é um BLOCO CUSTOMIZADO inline com bg-white rounded-xl border border-gray-100 p-5 — porque precisa de comportamento que o KPICard padrão não suporta: cor adaptativa baseada no valor + linha extra de "valor em risco" abaixo do número.',
      },

      // ----- KPI 1: MRR -----
      {
        type: 'subsection',
        title: '2.A — KPI 1 "MRR" (DollarSign emerald)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 PROPS DO KPICARD: title="MRR" / value={mrr} / format="currency" / change={8.5} (hardcoded; deveria vir comparando o mês corrente vs anterior) / icon={DollarSign} / iconBg="bg-emerald-100" / iconColor="text-emerald-600".',
          },
          {
            type: 'paragraph',
            text:
              '📐 CÁLCULO REAL: mrr = activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0). activeSubscriptions = subscriptions.filter(s => s.status === "active" || s.status === "trial"). Resumindo: SOMA do amount de toda assinatura que está ATIVA OU EM TRIAL.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 SIGNIFICADO DE NEGÓCIO: MRR (Monthly Recurring Revenue) é a métrica-norte do SaaS. Mostra a receita previsível mensal — quanto entra "sem precisar vender de novo".',
          },
          {
            type: 'paragraph',
            text:
              '⚠️ LIMITAÇÃO IMPORTANTE: este cálculo é SIMPLIFICADO — soma direta SEM normalizar para frequência. Se há um plano anual de R$1.200, ele entra como R$1.200 no "MRR" (errado — deveria ser R$100/mês). A versão CORRETA está em /Recurrence (que multiplica weekly×4, divide quarterly÷3, etc) e em /SubscriptionAnalytics. Aqui é proposital pela velocidade — assume que predominantemente são planos mensais.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE INCLUIR TRIAL no MRR: convenção SaaS — trials geralmente convertem em pagantes (>70% em produtos com cartão exigido). Excluir trials geraria subestimação da capacidade. Padrão da indústria conta como "pré-pagantes".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE COR EMERALD: verde = receita/dinheiro/positivo. Emerald especificamente é o tom mais "vivo" do verde no design system PagSmile, reservado para métricas financeiras core.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE change=+8.5%: hardcoded para demonstração. Em produção viria de query separada comparando MRR atual vs MRR de 30 dias atrás. Sinal de "+" verde com seta para cima dentro do KPICard.',
          },
        ],
      },

      // ----- KPI 2: Assinaturas Ativas -----
      {
        type: 'subsection',
        title: '2.B — KPI 2 "Assinaturas Ativas" (Users blue)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 value={activeSubscriptions.length} (mesmo array do MRR). format="number". change={12}. icon={Users}. iconBg="bg-blue-100" iconColor="text-blue-600".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: contagem PURA de assinantes ativos+trial. Complementa o MRR ao mostrar a OUTRA dimensão: MRR alto + poucos clientes = base concentrada (alto risco se um sair); MRR alto + muitos clientes = base distribuída (saudável).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE COR BLUE: convenção do design system — métrica de "pessoas/usuários" sempre em azul (Users em qualquer parte do app aparece em azul). Diferencia do emerald do MRR.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE INCLUIR TRIAL: mesma lógica do MRR — trial é "quase pagante", cuja exclusão distorceria a leitura do tamanho da base.',
          },
        ],
      },

      // ----- KPI 3: Em Trial -----
      {
        type: 'subsection',
        title: '2.C — KPI 3 "Em Trial" (Calendar purple)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 value={trialing.length}. trialing = subscriptions.filter(s => s.status === "trial"). format="number". SEM prop change (não tem comparação histórica). icon={Calendar}. iconBg="bg-purple-100" iconColor="text-purple-600".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: monitora o PIPELINE de conversão. Trial cheio = boa aquisição/marketing. Trial vazio = problema na captação. Trial conta o que VAI VIRAR pagante nos próximos N dias (definido no plano).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO TEM "change": trial é volátil (entra e sai rápido) e a métrica é mais útil em valor absoluto que em variação. Comparar "+10% vs mês passado" pode mascarar uma queda real se o mês passado foi anomalia.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE COR PURPLE: roxo é cor de "potencial/futuro" no design system. Trial = potencial pagante. Diferencia visualmente de "ativo verde" (já está pagando) e "azul de pessoas" (todos os usuários).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE ÍCONE Calendar: trial é definido por TEMPO ("X dias de teste"). Calendar comunica essa natureza temporal limitada — diferente de um Users genérico ou Star de "premium".',
          },
        ],
      },

      // ----- KPI 4: Churn Rate -----
      {
        type: 'subsection',
        title: '2.D — KPI 4 "Churn Rate" (TrendingDown red)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 value={churnRate}. CÁLCULO: churnRate = subscriptions.length > 0 ? (cancelled.length / subscriptions.length) * 100 : 0. format="percentage". change={-1.2} (hardcoded; queda é positiva nesse contexto). icon={TrendingDown}. iconBg="bg-red-100" iconColor="text-red-600".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 SIGNIFICADO: % de assinaturas cancelado dentre TODAS as registradas. É o termômetro de retenção — alto = problema crônico, baixo = retenção saudável. Benchmarks SaaS BR: <5%/mês saudável, 5-10% atenção, >10% crítico.',
          },
          {
            type: 'paragraph',
            text:
              '⚠️ LIMITAÇÃO TÉCNICA: cálculo é GROSSEIRO (proporção do total HISTÓRICO). A métrica acadêmica de churn precisa de janela temporal: "cancelados no mês X / ativos no início do mês X". A versão precisa está em /SubscriptionAnalytics. Aqui é proxy rápido.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE ÍCONE TrendingDown: detalhe sutil mas importante — ícone reflete a DIREÇÃO DESEJADA, não a atual. Churn caindo é BOM. Por isso TrendingDown (seta para baixo) com cor vermelha (alerta). Se churn está ALTO, change=-1.2 (queda) seria positivo. A semântica é: "queremos esta linha desça sempre".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE COR RED: vermelho = perda/destrutivo no design system. Mesmo quando o número é baixo (saudável), a categoria do KPI é "perda" — ícone e cor sinalizam isso.',
          },
        ],
      },

      // ----- KPI 5: Inadimplentes (CUSTOMIZADO) -----
      {
        type: 'subsection',
        title: '2.E — KPI 5 "Inadimplentes" (BLOCO CUSTOMIZADO inline)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 ESTRUTURA TÉCNICA: bg-white rounded-xl border border-gray-100 p-5. Layout interno flex items-start justify-between mb-2 — esquerda = título+número, direita = ícone em quadrado.',
          },
          {
            type: 'paragraph',
            text:
              '📐 LADO ESQUERDO: <p className="text-sm font-medium text-gray-500">Inadimplentes</p> + <p className="text-2xl font-bold text-gray-900">{delinquent.length}</p>. Número grande, cinza-900 (preto profundo).',
          },
          {
            type: 'paragraph',
            text:
              '📐 LADO DIREITO (ÍCONE COM COR ADAPTATIVA): div p-2.5 rounded-lg cuja classe muda condicionalmente: delinquent.length > 0 ? "bg-orange-100" : "bg-emerald-100". Dentro, AlertTriangle 5×5 com cor: text-orange-600 ou text-emerald-600.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LÓGICA DA COR ADAPTATIVA: se HÁ inadimplentes → laranja (atenção/recuperável). Se ZERO inadimplentes → verde esmeralda (parabéns, tudo ok!). Mesmo ícone (AlertTriangle) muda de "alerta ativo" para "indicador positivo silencioso".',
          },
          {
            type: 'paragraph',
            text:
              '📐 LINHA EXTRA CONDICIONAL: abaixo do número, SE delinquent.length > 0, renderiza <p className="text-xs text-orange-600">{formatCurrency(delinquentValue)} em risco</p>. Texto pequeno laranja mostrando R$X em risco. SE zero, essa linha simplesmente NÃO RENDERIZA (não há fallback "R$0 em risco" — silêncio é positivo).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 CÁLCULO DE delinquentValue: delinquent.reduce((sum, s) => sum + (s.amount || 0), 0). É a SOMA dos valores de cada assinatura inadimplente. NÃO é o quanto está em atraso, mas o "valor de uma cobrança normal de cada uma". Aproximação razoável do dinheiro em risco.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE PRECISOU CUSTOMIZAR (não usar KPICard): KPICard padrão não tem (a) cor adaptativa baseada no valor (b) linha extra contextual abaixo do número. Inadimplência é o KPI MAIS ACIONÁVEL — gestor vê e age. Merece tratamento visual destacado.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE LARANJA E NÃO VERMELHO: vermelho seria "perdido/morto". Laranja é "atenção, ainda recuperável". Inadimplente ≠ cancelado. O dunning vai tentar recuperar. Cor reflete a reversibilidade.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. BANNER DE ALERTA DE INADIMPLÊNCIA (CONDICIONAL)
  // ===========================================================================
  {
    type: 'section',
    title: '3. Banner de Alerta de Inadimplência (renderização condicional)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 RENDERIZAÇÃO CONDICIONAL: o banner SÓ APARECE se delinquent.length > 0. Se zero inadimplentes, sequer existe no DOM — economia visual.',
      },
      {
        type: 'paragraph',
        text:
          '📐 ESTRUTURA: div bg-orange-50 border border-orange-200 rounded-xl p-4 (largura total da seção). Dentro: flex items-start gap-3 com 3 elementos sequenciais.',
      },
      {
        type: 'subsection',
        title: '3.A — Ícone esquerdo: AlertTriangle',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 AlertTriangle 5×5 text-orange-600 flex-shrink-0 mt-0.5. flex-shrink-0 impede o ícone de espremer quando o texto é longo. mt-0.5 alinha verticalmente com a primeira linha do título.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO Info ou Bell: AlertTriangle = perigo iminente (forma de triângulo amarelo da sinalização rodoviária — convenção universal). Inadimplência É perigo (receita escapando). Sinaliza gravidade.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '3.B — Conteúdo central (flex-1)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Título: <h4 className="font-semibold text-orange-900">{delinquent.length} assinatura(s) inadimplente(s)</h4>. Nome interpolado dinamicamente. "(s)" deixa o texto válido para 1 ou N.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Subtítulo: <p className="text-sm text-orange-800 mt-1">O sistema de dunning está ativo tentando recuperar esses pagamentos.</p>. Texto mais escuro (orange-800 em vez de 900) é apenas convenção de hierarquia tipográfica.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 SIGNIFICADO da mensagem: TRANQUILIZA o gestor. "Não fique pânico — o sistema já está agindo." Evita ação manual desnecessária. Direciona para CONFIGURAR a automação (botão à direita) em vez de tentar recuperar manualmente.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '3.C — Botão direito "Configurar Dunning"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 <Button variant="outline" size="sm" className="border-orange-300 text-orange-700" onClick={() => navigate(createPageUrl("DunningSettings"))}>. Borda e texto laranja para harmonia com o banner. size="sm" para não competir visualmente com a mensagem.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: atalho de 1 clique para ajustar a régua de cobrança. Cenário: gestor vê 5 inadimplentes, percebe que talvez a régua esteja muito agressiva ou muito frouxa, e ajusta IMEDIATAMENTE.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO "Ver Inadimplentes": já temos a aba "Inadimplentes" abaixo. Aqui o foco é AGIR ESTRUTURALMENTE (mexer na régua) e não revisar caso a caso.',
          },
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE BANNER E KPI EM REDUNDÂNCIA: KPI mostra NÚMERO frio. Banner mostra CONTEXTO + ATALHO PARA AÇÃO + tom verbal tranquilizador. Redundância intencional — gestor pode ver primeiro o número, depois o banner explica o que fazer.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE LARANJA EM TODA A INTERFACE DE INADIMPLÊNCIA: KPI tem ícone laranja, banner é laranja, badge da aba é laranja. Construímos uma "linguagem visual" — o cérebro do gestor associa laranja = inadimplência. Quando vê laranja em qualquer lugar do app, sabe instantaneamente do que se trata.',
      },
    ],
  },

  // ===========================================================================
  // 4. CARD DE BUSCA + TABS
  // ===========================================================================
  {
    type: 'section',
    title: '4. Card branco com busca textual + 6 abas filtradoras',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 ESTRUTURA: div bg-white rounded-xl border p-4. Dentro, 2 blocos verticais: (1) área de busca, (2) <Tabs> com TabsList horizontal.',
      },

      // ----- 4.A: Input de busca -----
      {
        type: 'subsection',
        title: '4.A — Input de busca textual',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 div com flex flex-col sm:flex-row gap-4 mb-4. Dentro, <Input placeholder="Buscar por cliente, e-mail ou plano..." className="max-w-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}>.',
          },
          {
            type: 'paragraph',
            text:
              '📐 max-w-md = largura máxima ~28rem. Não preenche a linha toda — busca não precisa de largura excessiva e fica mais elegante.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LÓGICA DE FILTRO: searchTerm é usado em filteredSubscriptions = subscriptions.filter(s => { ... matchesSearch = !searchTerm || s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) || s.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) }). 3 campos de busca CASE-INSENSITIVE ligados por OR.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 3 CAMPOS: nome (cliente liga "Sou o João"), e-mail (sistema identifica unicamente), plano (atendente quer ver todos do "Premium"). Cobre os 3 cenários reais de busca em assinatura.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE CASE-INSENSITIVE: cliente raramente lembra capitalização exata do próprio nome. Insensitive evita falsos negativos.',
          },
        ],
      },

      // ----- 4.B: TabsList -----
      {
        type: 'subsection',
        title: '4.B — TabsList com 6 abas filtradoras',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 <Tabs value={activeTab} onValueChange={setActiveTab}> envolvendo um <TabsList> com 6 <TabsTrigger>. activeTab default = "all".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LÓGICA DE FILTRO: matchesTab = activeTab === "all" || s.status === activeTab. Aba "Todas" libera tudo; demais abas filtram pelo status.',
          },

          // Aba 1: Todas
          {
            type: 'subsection',
            title: '4.B.1 — Aba "Todas"',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 value="all". Conteúdo: "Todas" + Badge variant="secondary" className="ml-2" com {subscriptions.length}.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: aba default. Mostra o universo TOTAL — útil quando atendente vai buscar por nome (não sabe o status).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE BADGE CINZA: variant="secondary" gera bg-slate-100/text-slate-700 — neutro. "Todas" é a categoria GUARDA-CHUVA, sem cor própria. O número é informativo, não acionável.',
              },
            ],
          },

          // Aba 2: Ativas
          {
            type: 'subsection',
            title: '4.B.2 — Aba "Ativas"',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 value="active". Badge: className="ml-2 bg-emerald-100 text-emerald-700" com {subscriptions.filter(s => s.status === "active").length}.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: foco no "núcleo saudável" do negócio — clientes pagando regularmente. Quando o gestor quer auditar receita real, esta aba.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE BADGE EMERALD: emerald-100/text-emerald-700 EXATAMENTE o mesmo tom do Badge usado na coluna Status para "active" da tabela abaixo. Padronização — olho cria mapa mental: "verde = ativo".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 NUANCE — Badge não inclui trial: aqui é só "active", não "active + trial" como o KPI. Decisão proposital: a aba é granular, o KPI é estratégico. Atendente que busca um cliente específico usa a aba.',
              },
            ],
          },

          // Aba 3: Trial
          {
            type: 'subsection',
            title: '4.B.3 — Aba "Trial"',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 value="trial". Badge: className="ml-2 bg-blue-100 text-blue-700" com {trialing.length}.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: pipeline de conversão. Time de Customer Success entra aqui para identificar quem está perto do fim do trial e precisa de "empurrão" para converter (e-mail, ligação).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE BADGE BLUE: ALINHADO ao Badge da coluna Status para "trial" — bg-blue-100/text-blue-700. Coerência visual.',
              },
            ],
          },

          // Aba 4: Inadimplentes
          {
            type: 'subsection',
            title: '4.B.4 — Aba "Inadimplentes" (badge condicional)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 value="delinquent". Badge: className="ml-2 bg-orange-100 text-orange-700" com {delinquent.length}. RENDER CONDICIONAL: o Badge SÓ APARECE se delinquent.length > 0.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE BADGE SÓ APARECE QUANDO > 0: silenciar quando zero. Sem inadimplentes = não há nada para chamar atenção. Mostrar "(0)" criaria ruído visual desnecessário e falsa sensação de alerta.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE LARANJA: mantém a "linguagem visual" laranja = inadimplência (KPI customizado, banner, badge). Coerência total.',
              },
            ],
          },

          // Aba 5: Pausadas
          {
            type: 'subsection',
            title: '4.B.5 — Aba "Pausadas" (sem badge)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 value="paused". <TabsTrigger>Pausadas</TabsTrigger> — sem badge contador.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE NÃO TEM BADGE: estados intermediários (pausada/cancelada) raramente exigem visibilidade de contagem rápida. Não são acionáveis em massa — gestor entra na aba só quando precisa olhar especificamente.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: ver quem solicitou pausa (férias, dificuldade temporária). Útil para reconquistar clientes que pausaram — equipe de retenção entra aqui.',
              },
            ],
          },

          // Aba 6: Canceladas
          {
            type: 'subsection',
            title: '4.B.6 — Aba "Canceladas" (sem badge)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 value="cancelled". Sem badge.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: histórico de churn. Gestor revisa para entender padrões, datas, e (com a coluna LTV) quanto cada cancelado deixou em receita acumulada.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE NÃO É VERMELHO COMO O BADGE DE STATUS: cancelados são "passado". Não há urgência. Aba minimalista comunica isso (sem cor de alarme).',
              },
            ],
          },

          {
            type: 'paragraph',
            text:
              '🎯 ORDEM PROPOSITAL DAS ABAS: Todas → Ativas → Trial → Inadimplentes → Pausadas → Canceladas. Vai do MAIS GERAL ao MAIS ESPECÍFICO, e dentro disso, do MAIS POSITIVO ao MAIS NEGATIVO. Inadimplentes está no MEIO porque é a aba "acionável" — o gestor vai PARA ELA com mais frequência que pausadas/canceladas.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. DATATABLE (8 COLUNAS)
  // ===========================================================================
  {
    type: 'section',
    title: '5. DataTable — 8 colunas com renderers customizados',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 PROPS DO COMPONENTE: <DataTable columns={columns} data={filteredSubscriptions} loading={isLoading} pagination pageSize={25} currentPage={1} totalItems={filteredSubscriptions.length} onRefresh={refetch} emptyMessage="Nenhuma assinatura encontrada">. pageSize 25 = padrão SaaS — equilíbrio entre densidade e scroll. emptyMessage mostra texto centralizado quando filtros zeram resultados.',
      },

      // ----- Coluna 1: Assinatura -----
      {
        type: 'subsection',
        title: '5.A — Coluna 1 "Assinatura" (com health bar visual)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="subscription_id". RENDER: <div className="flex items-center gap-3"> com 2 elementos: (1) barra vertical de saúde, (2) bloco de texto.',
          },
          {
            type: 'paragraph',
            text:
              '📐 BARRA DE SAÚDE: <div className={cn("w-2 h-10 rounded-full", healthConfig[row.health_status || "healthy"].className)} />. w-2 h-10 = retângulo VERTICAL fino e alto. rounded-full = pílula vertical. Cor vem de healthConfig: healthy=bg-green-500, attention=bg-yellow-500, risk=bg-red-500.',
          },
          {
            type: 'paragraph',
            text:
              '📐 BLOCO DE TEXTO: <p className="font-medium text-gray-900 text-sm">{row.plan_name}</p> + <p className="text-xs text-gray-500">{value}</p>. Linha 1 = nome do plano. Linha 2 = ID da assinatura (subscription_id) em cinza menor.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE A HEALTH BAR: o health_status é um SCORE COMPOSTO calculado pelo backend que combina inadimplência + uso + NPS + tempo de relacionamento. Saudável = relacionamento estável; Atenção = sinais amarelos (queda de uso, atraso ocasional); Risco = candidato a churn iminente.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE BARRA VERTICAL E NÃO PONTO COLORIDO: barra vertical alta (h-10 = 40px) ao lado do texto cria SEPARAÇÃO VISUAL FORTE que o olho varre rapidamente — a coluna inteira "lista colorida" permite identificar instantaneamente quantos riscos há. Pontos seriam discretos demais.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE PLANO NA LINHA PRINCIPAL E ID NA SECUNDÁRIA: gestor pensa em "Plano Premium" (informação humana). subscription_id é técnico — útil para suporte/integração, mas não é o que o gestor quer ler de relance.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 FALLBACK "healthy": se row.health_status for undefined/null, usa "healthy" como default — assinatura sem score ainda é tratada como ok (não cria alarme falso para registros novos sem cálculo de score ainda).',
          },
        ],
      },

      // ----- Coluna 2: Cliente -----
      {
        type: 'subsection',
        title: '5.B — Coluna 2 "Cliente"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="customer_name". RENDER: 2 linhas — <p className="font-medium text-gray-900 text-sm">{value || "N/A"}</p> + <p className="text-xs text-gray-500">{row.customer_email}</p>.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 2 LINHAS NOME+EMAIL: nomes podem repetir ("João Silva" pode ser várias pessoas). E-mail é IDENTIFICADOR ÚNICO. Mostrar ambos permite confirmar visualmente que é o cliente certo antes de agir.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 FALLBACK "N/A": value || "N/A" cobre o caso raro de assinatura sem nome cadastrado. Em vez de linha vazia (ruído visual), exibe placeholder.',
          },
        ],
      },

      // ----- Coluna 3: Valor -----
      {
        type: 'subsection',
        title: '5.C — Coluna 3 "Valor" (valor + frequência)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="amount". RENDER: <p className="font-semibold text-gray-900">{formatCurrency(value)}</p> + <p className="text-xs text-gray-500">{billingCycleLabels[row.billing_cycle] || row.billing_cycle}</p>.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE VALOR + CICLO JUNTOS: R$99 mensal ≠ R$99 anual ≠ R$99 semanal — sem o ciclo, o valor é AMBÍGUO. Juntos viram afirmação completa.',
          },
          {
            type: 'paragraph',
            text:
              '📐 billingCycleLabels mapeia inglês→PT: weekly→Semanal, biweekly→Quinzenal, monthly→Mensal, bimonthly→Bimestral, quarterly→Trimestral, semiannual→Semestral, annual→Anual. Fallback para o valor cru se não houver mapeamento.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 formatCurrency = Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }) — formato brasileiro padrão (R$ 99,00 com vírgula decimal).',
          },
        ],
      },

      // ----- Coluna 4: Status -----
      {
        type: 'subsection',
        title: '5.D — Coluna 4 "Status" (Badge colorido)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="status". RENDER: const config = statusConfig[value] || statusConfig.pending; return <Badge className={config.className}>{config.label}</Badge>.',
          },
          {
            type: 'paragraph',
            text:
              '📐 statusConfig (6 estados):',
          },
          {
            type: 'list',
            items: [
              'trial → "Trial" / bg-blue-100 text-blue-700',
              'active → "Ativa" / bg-green-100 text-green-700',
              'pending → "Pendente" / bg-yellow-100 text-yellow-700',
              'delinquent → "Inadimplente" / bg-orange-100 text-orange-700',
              'paused → "Pausada" / bg-gray-100 text-gray-600',
              'cancelled → "Cancelada" / bg-red-100 text-red-700',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 SISTEMA DE CORES CONSISTENTE com TabsList badges, KPIs e linguagem visual do app inteiro: trial=azul (potencial neutro), active=verde (saudável), pending=amarelo (atenção média), delinquent=laranja (crítico mas recuperável), paused=cinza (neutro temporário), cancelled=vermelho (terminal).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 FALLBACK statusConfig.pending: se valor for desconhecido (ex: novo status no DB que esqueceram de mapear), exibe "Pendente amarelo" em vez de quebrar a renderização.',
          },
        ],
      },

      // ----- Coluna 5: Próxima Cobrança -----
      {
        type: 'subsection',
        title: '5.E — Coluna 5 "Próxima Cobrança" (render condicional)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="next_billing_date". RENDER: if (row.status === "cancelled" || row.status === "paused") return <span className="text-gray-400">-</span>. Caso contrário: format(new Date(value), "dd/MM/yyyy", { locale: ptBR }) ou "N/A" se value vazio.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE ESCONDER (com "-") em cancelled/paused: dado seria ENGANOSO. Pausada não cobra nada (data antiga ficaria estranha). Cancelada também não. "-" cinza-400 comunica "não se aplica" sem ocupar espaço informacional.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 FORMATO DD/MM/YYYY: padrão brasileiro. date-fns + locale ptBR garante meses por extenso em português se o formato fosse "PPP".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO MOSTRA "EM N DIAS" como /Recurrence faz: tela aqui é DENSA (8 colunas). "Em N dias" exigiria espaço extra. /Recurrence tem espaço pra duas linhas; aqui foco é compacto.',
          },
        ],
      },

      // ----- Coluna 6: Ciclo -----
      {
        type: 'subsection',
        title: '5.F — Coluna 6 "Ciclo" (atual / total opcional)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="current_cycle". RENDER: <span className="text-sm">{value || 1}{row.total_cycles ? `/${row.total_cycles}` : ""}</span>. Default 1 se ausente. Sufixo "/Y" só renderiza se total_cycles existir.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE TOTAL CONDICIONAL: assinaturas podem ser INFINITAS (recorrência sem fim definido — Netflix-like) ou COM PRAZO (12 cobranças contratuais — parcelado). Mostrar "/Y" só quando há prazo deixa claro o tipo. "7" sozinho = ilimitada, "7/12" = parcelada com prazo.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: gestor vê "11/12" e sabe "essa termina mês que vem — preciso ofertar renovação". Visual rápido sem precisar abrir detalhes.',
          },
        ],
      },

      // ----- Coluna 7: LTV -----
      {
        type: 'subsection',
        title: '5.G — Coluna 7 "LTV" (total acumulado pago)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="total_paid". RENDER: <span className="text-sm font-medium text-emerald-600">{formatCurrency(value)}</span>. Cor emerald-600 (verde forte).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 SIGNIFICADO: total_paid = soma histórica de todas as cobranças bem-sucedidas dessa assinatura. É LTV REALIZADO (passado), NÃO projetado. Cliente que paga R$99/mês há 12 meses tem LTV R$1.188.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE EMERALD: dinheiro acumulado = receita realizada = positivo. Verde em qualquer parte do app comunica "isto é dinheiro que entrou".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE NO ATENDIMENTO: cliente liga ameaçando cancelar; atendente vê LTV alto = "vale a pena oferecer desconto". LTV baixo = "talvez aceite o cancelamento sem brigar".',
          },
        ],
      },

      // ----- Coluna 8: Ações -----
      {
        type: 'subsection',
        title: '5.H — Coluna 8 "Ações" (DropdownMenu de até 6 itens condicionais)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 key="actions" / label="" (sem cabeçalho — convenção de coluna de ações). Trigger: <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>. Ghost = transparente até hover. Ícone "..." horizontal padrão de "menu de mais".',
          },
          {
            type: 'paragraph',
            text:
              '📐 DropdownMenuContent align="end" — o menu abre alinhado pela DIREITA do trigger (evita que o menu seja cortado pela borda direita da tabela).',
          },

          // Item 1: Ver detalhes
          {
            type: 'subsection',
            title: '5.H.1 — Item "Ver detalhes" (sempre disponível)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Ver detalhes</DropdownMenuItem>. Sem onClick (ainda não implementado).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVIRÁ: navegar para tela de detalhe da assinatura — histórico de cobranças, mudanças de status, notas, e-mails enviados pelo dunning, etc. Funcionalidade de drill-down ausente nesta versão.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE Eye: convenção universal "olhar/ver detalhes". Ícone discreto que não compete com ações destrutivas.',
              },
            ],
          },

          // Item 2: Alterar pagamento
          {
            type: 'subsection',
            title: '5.H.2 — Item "Alterar pagamento" (sempre disponível)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <DropdownMenuItem><CreditCard className="w-4 h-4 mr-2" />Alterar pagamento</DropdownMenuItem>. Sem onClick.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVIRÁ: trocar o método de pagamento (cartão vencido → novo cartão, ou cartão → Pix). Operação CRÍTICA porque é a #1 razão de inadimplência (cartão vencido). Versão final abriria modal com cartões salvos do cliente ou link de tokenização.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE ÍCONE CreditCard: representa o método mais comum (cartão). Sinal universal de "instrumento de pagamento".',
              },
            ],
          },

          // Item 3: Aplicar desconto
          {
            type: 'subsection',
            title: '5.H.3 — Item "Aplicar desconto" (sempre disponível)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <DropdownMenuItem onClick={() => handleAction("discount", row)}><Gift className="w-4 h-4 mr-2" />Aplicar desconto</DropdownMenuItem>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: ferramenta principal de RETENÇÃO. Cliente liga insatisfeito → atendente oferece "20% off por 3 meses" → cliente fica. Padrão SaaS comprovado (Netflix, Spotify, Adobe).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE ÍCONE Gift (presente): "presente" comunica BENEFÍCIO/CONCESSÃO ao cliente. Diferente de Percent (que seria cinza/técnico). Gift evoca emoção — atendente "presenteando" cliente para mantê-lo.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE SEMPRE DISPONÍVEL (não condicional ao status): faz sentido oferecer desconto até para inadimplentes (último recurso). E para pausadas pode incentivar retomada.',
              },
            ],
          },

          // Separador
          {
            type: 'subsection',
            title: '5.H.4 — Separador <DropdownMenuSeparator>',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Linha horizontal cinza-100 dividindo o menu em DOIS GRUPOS.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE SEPARAR: GRUPO 1 (acima) = ações SEGURAS/INFORMATIVAS (visualizar, editar dados, ofertar). GRUPO 2 (abaixo) = ações de MUDANÇA DE STATUS (impactam diretamente a relação). A separação reduz cliques acidentais — cérebro pausa antes de cancelar.',
              },
            ],
          },

          // Item 4: Pausar
          {
            type: 'subsection',
            title: '5.H.5 — Item "Pausar" (CONDICIONAL — só se active)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 RENDER: {row.status === "active" && (<DropdownMenuItem onClick={() => handleAction("pause", row)}><Pause className="w-4 h-4 mr-2" />Pausar</DropdownMenuItem>)}.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE SÓ PARA "active": pausar uma assinatura "trial" não faz sentido (trial já é temporário). Pausar uma "paused" é redundante. Pausar uma "cancelled" é impossível. Apenas "active" pode transitar para "paused" semanticamente.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: cliente em viagem/dificuldade temporária pede "pausa". Em vez de cancelar (perda definitiva), pausa preserva relação. Quando volta, retoma sem precisar reonboardar.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE ÍCONE Pause (||): convenção universal de player de mídia. Familiar a todos.',
              },
            ],
          },

          // Item 5: Retomar
          {
            type: 'subsection',
            title: '5.H.6 — Item "Retomar" (CONDICIONAL — só se paused)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 RENDER: {row.status === "paused" && (<DropdownMenuItem onClick={() => handleAction("resume", row)}><Play className="w-4 h-4 mr-2" />Retomar</DropdownMenuItem>)}.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE SÓ PARA "paused": só faz sentido retomar algo pausado. Espelho exato do Pausar.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE ÍCONE Play (▶): par natural com Pause. Atendente vê o ícone → entende imediatamente.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 NUANCE: Pausar e Retomar NUNCA aparecem juntos no mesmo menu — são MUTUAMENTE EXCLUSIVOS por status. Esse design "self-explanatory" elimina UI confuso.',
              },
            ],
          },

          // Item 6: Cancelar
          {
            type: 'subsection',
            title: '5.H.7 — Item "Cancelar" (CONDICIONAL + cor vermelha)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 RENDER: {row.status !== "cancelled" && (<DropdownMenuItem className="text-red-600" onClick={() => handleAction("cancel", row)}><XCircle className="w-4 h-4 mr-2" />Cancelar</DropdownMenuItem>)}.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE !==cancelled (em vez de checar status específicos): SEMPRE pode cancelar — exceto quando já está cancelado. Cobre todos os outros estados (active, trial, paused, delinquent, pending) com 1 condição negativa.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE TEXT-RED-600: cor sinaliza AÇÃO DESTRUTIVA. Ícone vermelho XCircle (X dentro de círculo) reforça a gravidade. Toda a indústria usa vermelho para "cancelar/excluir/destruir" — convenção que reduz erros.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE NÃO ESTÁ NO TOPO COMO "AÇÃO PRINCIPAL": ações destrutivas vão para o FIM do menu — princípio UX "destrutivo no fim, fácil de evitar acidente". Reforçado pelo separator.',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. ACTION DIALOG ÚNICO COM 4 MODOS DINÂMICOS
  // ===========================================================================
  {
    type: 'section',
    title: '6. Dialog único de ação (4 modos via state.action)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Arquitetura: 1 Dialog para 4 ações',
        body:
          'UM ÚNICO componente <Dialog> renderiza CONTEÚDO CONDICIONAL baseado no campo actionDialog.action. State estrutura: actionDialog = { action: "pause"|"resume"|"cancel"|"discount", subscription: row } + actionData = { reason?, discount?, cycles? }. Inicia null (fechado). Abre via handleAction(action, subscription) que faz setActionDialog({...}) + setActionData({}).',
      },
      {
        type: 'paragraph',
        text:
          '📐 ABERTURA/FECHAMENTO: <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>. Dupla negação garante boolean. Fechar (clicar fora ou pressionar Esc) seta actionDialog=null.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE 1 DIALOG E NÃO 4: redução massiva de boilerplate. Headers, footers e estrutura compartilham 90% do código. Apenas o BODY interno muda. Manutenção centralizada — corrige 1 vez em vez de 4.',
      },

      // ----- Header dinâmico -----
      {
        type: 'subsection',
        title: '6.A — DialogHeader dinâmico (título + descrição por action)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 4 ternários dentro de <DialogTitle> + 4 dentro de <DialogDescription> (cada um exibe APENAS se action corresponde).',
          },
          {
            type: 'list',
            items: [
              'pause → Title: "Pausar Assinatura" / Desc: "A assinatura será pausada e as cobranças serão suspensas."',
              'resume → Title: "Retomar Assinatura" / Desc: "A assinatura será reativada e as cobranças serão retomadas."',
              'cancel → Title: "Cancelar Assinatura" / Desc: "Esta ação é irreversível. O cliente perderá acesso ao serviço."',
              'discount → Title: "Aplicar Desconto" / Desc: "Aplicar um desconto nos próximos ciclos desta assinatura."',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE LINGUÍSTICA do "cancel": EXCLUSIVAMENTE este menciona "irreversível" e usa palavra forte ("perderá acesso"). Os outros 3 são neutros/reversíveis. Tom verbal sublinha a gravidade.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE A DESCRIPTION: explica o EFEITO COLATERAL antes do clique de confirmação. Atendente lê e tem certeza do que vai acontecer — reduz arrependimento pós-clique.',
          },
        ],
      },

      // ----- Body condicional: pause/resume -----
      {
        type: 'subsection',
        title: '6.B — Body para "pause" e "resume" (sem campos)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 NÃO HÁ campos extras. O Dialog mostra apenas Header (título + descrição) e Footer (botões).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO PEDIR MOTIVO DE PAUSAR: pausa é REVERSÍVEL e geralmente curta. Atrito desnecessário. Atendente em ligação não quer perder tempo digitando. Se quiser registrar motivo, faz nota interna depois.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 RESUMO: este é o caminho de "1 clique" — atendente vê pedido do cliente, abre menu, clica Pausar/Retomar, confirma. Total: 3 cliques.',
          },
        ],
      },

      // ----- Body condicional: cancel -----
      {
        type: 'subsection',
        title: '6.C — Body para "cancel" (Select de motivo)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 RENDER: <div className="space-y-4"> com 1 campo: Label "Motivo do cancelamento" + Select com placeholder "Selecione o motivo".',
          },
          {
            type: 'paragraph',
            text:
              '📐 5 OPÇÕES DO SELECT:',
          },
          {
            type: 'list',
            items: [
              'customer_request → "Solicitação do cliente"',
              'not_using → "Não utiliza mais"',
              'too_expensive → "Preço alto"',
              'found_alternative → "Encontrou alternativa"',
              'other → "Outro"',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 5 CATEGORIAS PADRONIZADAS (e não texto livre): dados ESTRUTURADOS habilitam ANÁLISE FUTURA. Em /SubscriptionAnalytics existe um gráfico "Principais Motivos de Cancelamento" — só funciona porque os motivos são enum, não free-text. Texto livre = ruído ("não gostei", "ruim", "fui embora").',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LIGAÇÃO COM ANALYTICS: cada motivo escolhido aqui ALIMENTA estratégia. "Preço alto" alto → time financeiro avalia ajuste de pricing. "Não utiliza" alto → time produto melhora onboarding. "Alternativa" alto → time competitivo investiga concorrentes.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE INCLUIR "Outro": catch-all para motivos atípicos. Mas se "Outro" representa >20% dos cancelamentos, é sinal de que faltam categorias — momento de adicionar nova opção.',
          },
          {
            type: 'paragraph',
            text:
              '⚠️ LIMITAÇÃO ATUAL: não há campo de "comentário livre" complementar. Versão final adicionaria um Textarea opcional para o atendente capturar nuances ("Cliente disse que está esperando bonificação").',
          },
        ],
      },

      // ----- Body condicional: discount -----
      {
        type: 'subsection',
        title: '6.D — Body para "discount" (2 inputs numéricos)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 RENDER: <div className="space-y-4"> com 2 campos verticais.',
          },
          {
            type: 'paragraph',
            text:
              '📐 CAMPO 1 — Percentual: Label "Percentual de desconto (%)" + <Input type="number" min="1" max="100" placeholder="Ex: 20" value={actionData.discount} onChange={...}>. min=1 max=100 valida no nível HTML.',
          },
          {
            type: 'paragraph',
            text:
              '📐 CAMPO 2 — Ciclos: Label "Por quantos ciclos" + <Input type="number" min="1" placeholder="Ex: 3" value={actionData.cycles} onChange={...}>. min=1 (zero seria sem efeito), sem max (gestor pode dar desconto eterno se quiser, embora ruim).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE A FERRAMENTA: retenção tática. Quando cliente ameaça cancelar, atendente oferece "20% off por 3 ciclos" — cliente continua, gestor preserva LTV.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE PRAZO LIMITADO É CRÍTICO: desconto eterno mata margem do produto. Backend decrementa applied_discount_remaining_cycles a cada cobrança bem-sucedida; quando chega a 0, volta ao preço cheio. Cliente é avisado por e-mail quando expira (e-mail "promo está acabando, mas você pode renovar").',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PLACEHOLDERS "Ex: 20" e "Ex: 3": guiam o atendente para valores RAZOÁVEIS sem forçar. 20% por 3 meses é o "padrão de mercado" para retenção SaaS.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO TEM "Aplicar para sempre": tentação de usar a ferramenta como tarifa permanente. Forçar prazo defende margem.',
          },
        ],
      },

      // ----- DialogFooter -----
      {
        type: 'subsection',
        title: '6.E — DialogFooter (2 botões: Cancelar + Confirmar)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 BOTÃO 1 — Cancelar: <Button variant="outline" onClick={() => setActionDialog(null)}>Cancelar</Button>. Outline = secundário. Fecha sem persistir.',
          },
          {
            type: 'paragraph',
            text:
              '📐 BOTÃO 2 — Confirmar (cor adaptativa): <Button onClick={executeAction} className={actionDialog?.action === "cancel" ? "bg-red-600 hover:bg-red-700" : "bg-[#00D26A] hover:bg-[#00A854]"} disabled={updateMutation.isPending}>{updateMutation.isPending ? "Processando..." : "Confirmar"}</Button>.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LÓGICA DA COR ADAPTATIVA: se action==="cancel" → vermelho (bg-red-600). Caso contrário → verde PagSmile (bg-#00D26A). Cor reflete a NATUREZA da ação: vermelho = destrutivo/irreversível; verde = positivo/reversível.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 ESTADO DE LOADING: updateMutation.isPending muda label para "Processando..." e disabled=true. Previne duplo clique acidental que geraria 2 mutations.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE LABEL GENÉRICO "Confirmar" e não "Pausar agora"/"Cancelar agora": simplicidade. O título do Dialog já diz a ação ("Pausar Assinatura"). Confirmar é universal.',
          },
        ],
      },

      // ----- executeAction -----
      {
        type: 'subsection',
        title: '6.F — Função executeAction (switch sobre 4 actions)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 LÓGICA: const { action, subscription } = actionDialog; let updateData = {}; switch(action) { ... } updateMutation.mutate({ id: subscription.id, data: updateData }).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 CASE "pause": updateData = { status: "paused", pause_start_date: new Date().toISOString() }. Backend recebe novo status + data início da pausa. ISO-8601 padrão UTC garante interoperabilidade.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 CASE "resume": updateData = { status: "active", pause_end_date: new Date().toISOString() }. Volta para active + registra DATA DE FIM da pausa (não limpa pause_start_date — preserva histórico).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 CASE "cancel": updateData = { status: "cancelled", cancellation_date: ISO now, cancellation_reason: actionData.reason, cancellation_type: "voluntary" }.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE CRÍTICA — cancellation_type sempre "voluntary": indica que foi DECISÃO HUMANA (cliente pediu, atendente registrou). Backend tem outro fluxo onde dunning falha por X dias e cancela automaticamente — esse caso seta cancellation_type="involuntary". A distinção é VITAL: voluntary requer melhorar PRODUTO, involuntary requer melhorar DUNNING. Em /SubscriptionAnalytics esses são gráficos separados.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 CASE "discount": updateData = { applied_discount_percentage: parseFloat(actionData.discount) || 0, applied_discount_remaining_cycles: parseInt(actionData.cycles) || 1 }. parseFloat e parseInt garantem que strings vindas do <Input> viram números. || 0 / || 1 = fallback defensivo.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 EFEITO BACKEND DO discount: Recurrence aplica o desconto AUTOMATICAMENTE no próximo billing — gera invoice com amount × (1 - applied_discount_percentage/100), decrementa applied_discount_remaining_cycles em 1, e ao chegar em 0 volta ao preço cheio.',
          },
        ],
      },

      // ----- onSuccess da mutation -----
      {
        type: 'subsection',
        title: '6.G — Comportamento pós-sucesso',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 onSuccess da updateMutation: queryClient.invalidateQueries(["subscriptions"]) + setActionDialog(null) + toast.success("Assinatura atualizada!").',
          },
          {
            type: 'paragraph',
            text:
              '🎯 invalidateQueries força refetch da lista — KPIs, banner e tabela se atualizam imediatamente refletindo a mudança.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 setActionDialog(null) FECHA o Dialog — resultado positivo deve "sumir" o modal automaticamente (atendente não precisa fechar manualmente).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 toast.success genérico "Assinatura atualizada!": mensagem única para 4 ações. Simplificação aceitável — atendente sabe o que fez. Se quiser personalização, pode-se trocar para mensagem específica do action ("Assinatura pausada com sucesso!"). Mas neste caso o feedback visual já vem da tabela atualizada.',
          },
        ],
      },
    ],
  },
];