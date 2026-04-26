// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Subscriptions e /SubscriptionPlans
// =============================================================================

// =============================================================================
// PÁGINA 1: /Subscriptions — Lista operacional de assinaturas ativas
// =============================================================================

export const SubscriptionsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Assinaturas',
    body:
      'Hub OPERACIONAL de gestão de todas as assinaturas (Subscription) do merchant. Mostra cada cliente recorrente individualmente — qual plano, quanto paga, em qual ciclo está, quando é a próxima cobrança, qual o status (trial/ativa/inadimplente/pausada/cancelada). Layout: 5 KPIs (MRR, ativas, em trial, churn, inadimplentes), banner de alerta de inadimplência condicional, busca + 6 abas filtradoras com badges contadores, tabela de 8 colunas com health bar visual e ações por linha, e 4 modais de ação operados por um único Dialog dinâmico (pausar/retomar/cancelar/aplicar desconto).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) GESTÃO INDIVIDUAL: gestor entra em UM cliente para ajustar (cancelar, pausar, descontar). (2) MONITORAR INADIMPLÊNCIA: alerta laranja chamativo permite agir antes de perder receita. (3) SUPORTE AO CLIENTE: atendente abre essa tela quando cliente liga e age em segundos. (4) DISTINGUIR ESTADOS: 6 abas separam universo total em segmentos acionáveis — trial precisa "converter", inadimplente precisa "recuperar", pausada precisa "retomar". (5) CONTROLE DE RECEITA RECORRENTE: número MRR sempre visível.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Diferença entre Subscription, SubscriptionPlan e Recurrence',
    body:
      'PLANO (SubscriptionPlan) = TEMPLATE/produto criado UMA VEZ ("Plano Premium R$99/mês"). ASSINATURA (Subscription) = INSTÂNCIA de plano para 1 cliente específico ("João assina o Plano Premium desde 15/06, no ciclo 7"). RECORRÊNCIA (Recurrence) = motor de execução genérico que cobra automaticamente. Esta página gerencia o nível "ASSINATURA".',
  },

  {
    type: 'section',
    title: '1. PageHeader (4 botões à direita)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Title=t("subscriptions.title"), subtitle igual, breadcrumb 1 nível "Dashboard › Assinaturas". À direita 4 botões em flex gap-2.',
      },
      {
        type: 'subsection',
        title: 'Botão "Planos" (outline, ícone Settings)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Navega para /SubscriptionPlans — gestão de TEMPLATES. Shortcut entre nível "instâncias" e "templates". Frequência alta — gestor cria plano novo e quer ver assinantes.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Dunning" (outline, ícone RefreshCw)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Navega para /DunningSettings (régua de cobrança). Dunning é alavanca estratégica — se inadimplência sobe, gestor vai ajustar régua.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Analytics" (outline, ícone BarChart3)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Navega para /SubscriptionAnalytics. Zoom-out estratégico (cohort, churn por ciclo, evolução MRR) versus a granularidade individual desta tela.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Nova Assinatura" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Ação primária. Ícone Plus + label composto via i18n. LIMITAÇÃO ATUAL: sem onClick. Versão final abrirá SideDrawer com seleção de cliente + plano + dia.',
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
          'Grid responsivo (1/2/5 colunas). Os 4 primeiros são KPICard padrão; o 5º (Inadimplentes) é card CUSTOMIZADO inline para ter cor adaptativa e linha extra de "valor em risco".',
      },
      {
        type: 'subsection',
        title: 'KPI 1 — "MRR" (DollarSign emerald)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Cálculo: soma de subscription.amount onde status === active OR trial. format="currency". change=8.5 (hardcoded). Versão simplificada — soma direta sem normalizar ciclos não-mensais. /Recurrence tem versão NORMALIZADA mais sofisticada.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE incluir trial no MRR: trials geralmente convertem (>70%). Excluir gera subestimação. Convenção SaaS: contar como "pré-pagantes".',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'KPI 2 — "Assinaturas Ativas" (Users blue)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 .length de active+trial. format="number". change=12. Complemento ao MRR: MRR alto + poucos clientes = base concentrada (risco). MRR alto + muitos = saudável distribuído.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'KPI 3 — "Em Trial" (Calendar purple)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 .length onde status === trial. SEM change. Monitora PIPELINE de conversão. Trial cheio = boa aquisição. Vazio = problema de marketing. Cor roxa diferencia do verde "já pagante".',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'KPI 4 — "Churn Rate" (TrendingDown red)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Cálculo: (cancelled.length / subscriptions.length) * 100. format="percentage". change=-1.2 (queda é positiva).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LIMITAÇÃO: cálculo GROSSEIRO — proporção do total. Métrica acadêmica precisa de janela temporal (cancelados no mês / ativos no início do mês). Versão precisa em /SubscriptionAnalytics.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE TrendingDown: churn cair é BOM. Ícone reflete a direção desejada (não a atual).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'KPI 5 — "Inadimplentes" (card CUSTOMIZADO)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Estrutura: bg-white, rounded-xl, border, padding 5. Layout flex justify-between: esquerda título+número (text-2xl bold), direita ícone AlertTriangle em quadrado p-2.5.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 COR ADAPTATIVA: se delinquent.length > 0 → bg-orange-100 + text-orange-600 (ALERTA). Se 0 → bg-emerald-100 + text-emerald-600 (TUDO OK).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LINHA EXTRA: se há inadimplentes, mostra texto laranja "R$X em risco" (formatCurrency da soma dos amounts). Se zero, esconde linha.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE customizar: KPI normal não tem cor adaptativa + linha de detalhe contextual. Inadimplência é o KPI MAIS ACIONÁVEL.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '3. Banner de Alerta de Inadimplência (condicional)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Banner laranja largura total. APENAS aparece se delinquent.length > 0. bg-orange-50 + border-orange-200 + flex com 3 elementos: ícone AlertTriangle laranja-600, título+descrição, Button outline "Configurar Dunning" → /DunningSettings.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE banner separado E KPI: KPI mostra NÚMERO. Banner mostra CONTEXTO + ATALHO PARA AÇÃO. Redundância intencional.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE laranja e não vermelho: vermelho seria "perdido". Laranja é "atenção, recuperável".',
      },
    ],
  },

  {
    type: 'section',
    title: '4. Card de Busca + Tabs',
    children: [
      {
        type: 'subsection',
        title: '4.A — Input de Busca',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 Input max-w-md. Placeholder "Buscar por cliente, e-mail ou plano...". Filtra em 3 campos (case-insensitive): customer_name, customer_email, plan_name.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '4.B — TabsList (6 abas com badges contadores)',
        children: [
          {
            type: 'list',
            items: [
              'ABA "Todas" — Badge secondary com subscriptions.length',
              'ABA "Ativas" — Badge bg-emerald-100/text-emerald-700',
              'ABA "Trial" — Badge bg-blue-100/text-blue-700',
              'ABA "Inadimplentes" — Badge laranja APENAS se count > 0',
              'ABA "Pausadas" — sem badge',
              'ABA "Canceladas" — sem badge',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE badges com cores correspondentes ao status: padronização visual com a coluna Status. Olho cria mapa mental de cores.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE Inadimplentes só badge quando > 0: silenciar quando zero é positivo (não cria alarme falso).',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '5. DataTable (8 colunas)',
    children: [
      {
        type: 'subsection',
        title: 'Coluna 1 — "Assinatura"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 flex items-center gap-3. ESQUERDA: Health bar vertical w-2 h-10 rounded-full colorida (verde/amarelo/vermelho) baseada em row.health_status. DIREITA: plan_name + subscription_id.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 HEALTH BAR via healthConfig: healthy=bg-green-500, attention=bg-yellow-500, risk=bg-red-500. Score COMPOSTO calculado por backend (combina inadimplência, uso, NPS). Bar vertical permite VISTA RÁPIDA antes de ler dados.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 2 — "Cliente"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 2 linhas: customer_name font-medium (ou "N/A") + customer_email text-xs gray. POR QUE 2 linhas: nomes podem repetir; e-mail é único.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 3 — "Valor"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 2 linhas: formatCurrency font-semibold + billingCycleLabels (Semanal/Mensal/Anual/etc) text-xs gray. POR QUE valor + ciclo: R$99 mensal ≠ R$99 anual.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 4 — "Status"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Badge mapeado via statusConfig (6 estados): trial=blue, active=green, pending=yellow, delinquent=orange, paused=gray, cancelled=red.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 5 — "Próxima Cobrança"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Render condicional: se status==="cancelled" || "paused" → "—" cinza-400. Caso contrário, formata DD/MM/YYYY (date-fns + ptBR). POR QUE esconder: dado seria enganoso. Pausada não cobra. Cancelada também não.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 6 — "Ciclo"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 span text-sm com value (default 1) + se row.total_cycles existe: "/Y" (ex: "7/12"). Assinaturas podem ser INFINITAS ou COM PRAZO. "/Y" só aparece quando há prazo.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 7 — "LTV"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 formatCurrency text-emerald-600 font-medium do total_paid acumulado. LTV REALIZADO (passado), não projetado. Verde reforça receita.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Coluna 8 — "Ações" (DropdownMenu)',
        children: [
          {
            type: 'list',
            items: [
              'Eye + "Ver detalhes" (sempre)',
              'CreditCard + "Alterar pagamento" (sempre)',
              'Gift + "Aplicar desconto" → handleAction("discount", row)',
              '[separador]',
              'Pause + "Pausar" — APENAS se active',
              'Play + "Retomar" — APENAS se paused',
              'XCircle + "Cancelar" (text-red-600) — APENAS se !cancelled',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE itens condicionais: não mostra "Pausar" para algo já pausado. UI inteligente.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE separator: separa AÇÕES SEGURAS (visualizar, editar pagamento, descontar) das IMPACTANTES (mudar status). Reduz cliques acidentais.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '6. Action Dialogs (4 modais via Dialog único + state)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Arquitetura',
        body:
          'UM componente Dialog renderiza conteúdo CONDICIONAL baseado em actionDialog.action. State: actionDialog={action, subscription} + actionData={...}. Inicia null, abre via handleAction.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE 1 dialog para 4 ações: redução de boilerplate. Headers, footers e botões compartilham padrão.',
      },
      {
        type: 'subsection',
        title: 'DialogHeader dinâmico',
        children: [
          {
            type: 'list',
            items: [
              'pause → "Pausar Assinatura" + "A assinatura será pausada e as cobranças serão suspensas."',
              'resume → "Retomar Assinatura" + "Será reativada e as cobranças serão retomadas."',
              'cancel → "Cancelar Assinatura" + "Esta ação é irreversível. O cliente perderá acesso."',
              'discount → "Aplicar Desconto" + "Aplicar um desconto nos próximos ciclos."',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE cancel tem aviso "irreversível": gravidade da ação merece destaque. Outras 3 são reversíveis.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Campos do form (CONDICIONAIS por action)',
        children: [
          {
            type: 'list',
            items: [
              'Pause/Resume — sem campos (apenas confirmação)',
              'Cancel — Select "Motivo" com 5 opções: customer_request, not_using, too_expensive, found_alternative, other',
              'Discount — Input "Percentual (%)" (1-100) + Input "Por quantos ciclos" (min=1)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 5 opções padronizadas para cancelamento: dados estruturados permitem ANÁLISE FUTURA (gráfico em /SubscriptionAnalytics). Texto livre = ruído.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE Discount: ferramenta de RETENÇÃO. Cliente diz "vou cancelar" → atendente oferece "20% off por 3 meses". Padrão SaaS comprovado.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE prazo no desconto: desconto eterno mata margem. Backend decrementa cycles a cada cobrança.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'DialogFooter',
        children: [
          {
            type: 'list',
            items: [
              'Cancelar (outline) → fecha modal',
              'Confirmar → executeAction(). COR ADAPTATIVA: vermelho se action==="cancel", verde PagSmile caso contrário',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 COR ADAPTATIVA do confirmar: vermelho em cancel comunica destrutividade. Verde nas outras reforça reversibilidade. Loading: label "Processando..." e disabled.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'executeAction — switch sobre action',
        children: [
          {
            type: 'list',
            items: [
              'pause → {status:"paused", pause_start_date: ISO now}',
              'resume → {status:"active", pause_end_date: ISO now}',
              'cancel → {status:"cancelled", cancellation_date, cancellation_reason, cancellation_type:"voluntary"}',
              'discount → {applied_discount_percentage, applied_discount_remaining_cycles}',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE marcar cancellation_type="voluntary": diferencia de involuntary (dunning falhou). Análises separam — voluntary requer melhorar produto, involuntary requer melhorar dunning.',
          },
        ],
      },
    ],
  },
];

// =============================================================================
// PÁGINA 2: /SubscriptionPlans — Catálogo de planos (templates)
// =============================================================================

export const SubscriptionPlansDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Planos de Assinatura',
    body:
      'CRUD do CATÁLOGO DE PRODUTOS RECORRENTES. Cada SubscriptionPlan é um TEMPLATE ("Plano Premium R$99/mês"). Quando alguém assina, sistema cria instância Subscription apontando para o plano. Layout: 3 KPIs + DataTable de 7 colunas + SideDrawer lateral (form de 5 cards) que abre tanto em Criação quanto em Edição.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) DEFINIR OFERTA: gestor monta portfólio (Básico, Pro, Premium). (2) AJUSTAR PREÇO: editar plano altera para NOVOS assinantes (não mexe nos existentes). (3) MEDIR PERFORMANCE POR PLANO: assinantes + receita por plano. (4) APOSENTAR plano antigo sem afetar quem já assinou. (5) DUPLICAR para criar variações rápidas.',
  },

  {
    type: 'section',
    title: '1. PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Title="Planos de Assinatura". Subtitle="Gerencie seus planos de cobrança recorrente". Breadcrumb 2 níveis.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 Botão "Novo Plano" verde — onClick: resetForm() + setIsCreateOpen(true). Reset garante que estado anterior não polui novo plano.',
      },
    ],
  },

  {
    type: 'section',
    title: '2. Grid de 3 KPIs',
    children: [
      {
        type: 'list',
        items: [
          'KPI 1 "Planos Ativos" (Repeat purple)',
          'KPI 2 "Total Assinantes" (Users blue) — soma current_subscribers',
          'KPI 3 "Receita Total" (DollarSign emerald) — soma total_revenue',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE só 3 KPIs: tela de TEMPLATES. Métricas profundas (MRR, churn, cohort) ficam em /Subscriptions e /SubscriptionAnalytics. Aqui foco é "quantos produtos? quantos comprando? quanto gerei?".',
      },
    ],
  },

  {
    type: 'section',
    title: '3. EmptyState OU DataTable',
    children: [
      {
        type: 'subsection',
        title: 'EmptyState (plans.length === 0)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 EmptyState com icon=Repeat, title="Nenhum plano criado", actionLabel="Criar Plano" → setIsCreateOpen.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'DataTable (7 colunas)',
        children: [
          {
            type: 'list',
            items: [
              'Coluna 1 "Plano" — quadrado 10×10 com ícone Repeat (cor adaptativa: ativo=purple/inativo=gray) + name + plan_id',
              'Coluna 2 "Valor" — formatCurrency + frequencyLabels',
              'Coluna 3 "Assinantes" — Users + número + (se limited) "/ Y"',
              'Coluna 4 "Trial" — Badge outline "X dias" se >0, "—" caso contrário',
              'Coluna 5 "Visibilidade" — EyeOff cinza "Privado" / Eye azul "Público"',
              'Coluna 6 "Status" — Badge: active=green/"Ativo", inactive=gray/"Inativo"',
              'Coluna 7 "Ações" — Edit + Copy "Duplicar" + Trash2 vermelho com confirm()',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE CRÍTICA do Status: "Inativo" NÃO cancela assinaturas existentes. Apenas impede NOVAS. Plano-fantasma para preservar continuidade.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE Visibilidade: planos privados não aparecem em listagem pública — só via link direto. Útil para "Founder" exclusivo, "Enterprise customizado".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE Duplicar: criar "Plano Premium Anual" baseado no Mensal economiza setup.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '4. SideDrawer (form de criação/edição)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 SideDrawer size="lg". Title dinâmico: "Novo Plano de Assinatura" OU "Editar Plano". Icon=Repeat. Conteúdo = SubscriptionPlanForm.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE SideDrawer e não Dialog modal: form longo (5 cards). Drawer lateral preserva contexto da tabela. Modal seria opressivo.',
      },

      {
        type: 'subsection',
        title: 'Card 1: Informações do Plano',
        children: [
          {
            type: 'list',
            items: [
              'Input "Nome do Plano *" — maxLength 50',
              'Textarea "Descrição" — h-20, maxLength 500',
              'BLOCO "Benefícios" — array de strings com Add/Remove. Cada item: Check verde + Input + Button ghost X',
              'Input "Identificador Externo" — para integração ERP/CRM',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE benefícios em array: planos competem pela MELHOR LISTA ("Acesso ilimitado", "Suporte 24/7"). Array dinâmico permite quantos.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 2: Preço e Frequência',
        children: [
          {
            type: 'list',
            items: [
              'Grid 2 cols: Input "Valor (R$) *" + Select "Frequência *" (7 opções: Semanal/Quinzenal/Mensal/Bimestral/Trimestral/Semestral/Anual)',
              'Select "Dia de Cobrança" — "Dia do cadastro" (default) OU dia 1 a 28',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE limite 1-28: meses com 28-29-30-31. Restringir a 28 evita problemas de "dia 31 em fevereiro".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE "signup_day" default: cobra todo dia X após cadastro. Mais flexível que data fixa.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 3: Trial e Promoções',
        children: [
          {
            type: 'list',
            items: [
              'Input "Período de Trial (dias)" — min=0 max=90',
              'Checkbox "Exigir cartão no trial" — default true',
              'Input "Taxa de Adesão (Setup Fee) - R$" — valor único',
              'BLOCO bg-yellow-50 "Desconto Inicial": % + por quantos ciclos',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE "Exigir cartão no trial": ON = trial automático vira pagamento. OFF = mais conversão de TOP do funil mas pior conversão real. Trade-off estratégico.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE Setup Fee separado do amount: contábil. Setup = receita única; amount = recorrente (MRR).',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 4: Métodos de Pagamento (clickable cards)',
        children: [
          {
            type: 'list',
            items: [
              'Card "Cartão de Crédito" — selecionado: border-blue-500 + bg-blue-50',
              'Card "Pix" — selecionado: border-green-500 + bg-green-50',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE "Pix manual": Pix puro não é recorrente nativamente — sistema gera QR a cada ciclo. Pix Recorrente DICT é separado.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 SAFEGUARD: togglePaymentMethod impede deselecionar TODAS — sempre 1 método ativo.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Card 5: Configurações Avançadas',
        children: [
          {
            type: 'list',
            items: [
              'Limite de Assinantes: Select unlimited/limited + Input se limited',
              'Visibilidade: Public/Private + ícone',
              'Plano Ativo (Switch) — true=active, false=inactive',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE separar Visibilidade de Status: Visibilidade = DESCOBERTA. Status = DISPONIBILIDADE. Privado+Ativo = só link direto. Público+Inativo = aparece mas não pode assinar.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Footer do drawer',
        children: [
          {
            type: 'list',
            items: [
              'Cancelar (outline) → fecha + reset',
              'Salvar Plano (verde) → handleSave(): valida nome + valor; create OU update mutation',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Validações inline obrigatórias (nome + valor) via toast.error sem fechar drawer (gestor corrige sem perder dados).',
          },
        ],
      },
    ],
  },
];