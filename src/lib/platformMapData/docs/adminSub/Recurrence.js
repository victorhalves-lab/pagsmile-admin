// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Recurrence (Motor de Recorrência)
// =============================================================================

export const RecurrenceDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Motor de Recorrência',
    body:
      'Painel COMPLETO do motor de cobranças recorrentes — separado das telas de "Assinaturas" porque cobrança recorrente NÃO É APENAS assinatura SaaS. Pode ser: serviço mensal (advogado), parcelamento de produto, mensalidade escolar, doação recorrente de ONG. A entidade aqui é Recurrence (não Subscription). Layout: 5 abas internas (Dashboard, Recorrências, Cobranças, Retentativas, Notificações).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) GESTÃO HOLÍSTICA em um lugar — dashboard analítico, lista operacional, histórico, configuração de retentativas, notificações. (2) MOTOR INTELIGENTE DE RETRY: configura quantas vezes tentar e em quais intervalos quando uma cobrança falha. (3) MULTI-MÉTODO: cartão, Pix Recorrente E boleto. (4) NOTIFICAÇÕES + AUTOMAÇÕES: comunicação automatizada. (5) DIFERENÇA vs Assinaturas: Recurrence é GENÉRICO; Subscriptions é específico de SaaS.',
  },
  {
    type: 'callout',
    variant: 'warning',
    title: 'Implementação atual',
    body:
      'Página USA DADOS MOCKADOS (5 recorrências hardcoded no array recurrences). Cálculos de MRR, distribuições e gráficos são todos in-memory. Quando entidade Recurrence for criada, substituir pelos dados reais via base44.entities.Recurrence.list().',
  },

  {
    type: 'section',
    title: '1. PageHeader (2 botões)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Title="Motor de Recorrência" + subtitle="Gerencie cobranças recorrentes de forma inteligente". Breadcrumb 2 níveis "Dashboard › Assinaturas › Recorrência".',
      },
      {
        type: 'subsection',
        title: 'Botão "Configurar Retentativas" (outline)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 onClick: setShowRetryConfigDialog(true). Atalho redundante — também há aba interna "Retentativas". POR QUE redundância: gestor que VAI configurar quer atalho direto sem ler dashboard.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Nova Recorrência" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 onClick: setShowNewRecurrenceDialog(true). Abre Dialog max-w-lg com formulário simplificado.',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '2. TabsList Principal (5 abas)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 TabsList bg-white border shadow-sm h-12 (mais alto que padrão). Aba ativa: bg-[#00D26A] + text-white (verde sólido). 5 abas com ícones.',
      },
      {
        type: 'list',
        items: [
          'ABA "Dashboard" (BarChart3) — analítica, KPIs e charts',
          'ABA "Recorrências" (Repeat) — lista operacional',
          'ABA "Cobranças" (DollarSign) — histórico de execuções',
          'ABA "Retentativas" (RefreshCw) — config + performance',
          'ABA "Notificações" (Bell) — e-mails automáticos + automações',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE 5 abas e não páginas separadas: cada uma é PERSPECTIVA da mesma entidade. Trocar de aba é mais rápido. Mantém contexto do filtro de período.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 ORDEM proposital: Dashboard (overview) → Recorrências (operacional) → Cobranças (histórico atômico) → Retentativas (config motor) → Notificações (config comunicação). Geral ao específico.',
      },
    ],
  },

  {
    type: 'section',
    title: '3. Aba "Dashboard"',
    children: [
      {
        type: 'subsection',
        title: '3.A — Grid de 4 KPIs',
        children: [
          {
            type: 'list',
            items: [
              'KPI 1 "MRR" (DollarSign emerald) change=12.5. CÁLCULO NORMALIZADO: amount × multiplicador da frequência (weekly×4, biweekly×2, quarterly÷3)',
              'KPI 2 "Recorrências Ativas" (Repeat blue) change=8',
              'KPI 3 "Taxa de Sucesso" (CheckCircle2 green) — chargeSuccessRate=94.5 mock',
              'KPI 4 "Taxa de Recuperação" (RefreshCw purple) — recoveryRate=78 mock',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE MRR aqui é DIFERENTE de /Subscriptions: ali soma BRUTA, aqui NORMALIZADA. Versão correta. Em /Subscriptions é simplificada por assumir mensal predominante.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE distinguir Sucesso vs Recuperação: Sucesso = aprovou de primeira (saúde da carteira). Recuperação = tentativas extras precisaram salvar. Sucesso 99% + Recuperação 0% = base perfeita. Sucesso 80% + Recuperação 90% = motor de retry resgata muito.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '3.B — Banner Pending Retry (condicional)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Card border-amber-200 + bg-amber-50. SÓ aparece se pendingRetry.length > 0. Estrutura: ícone AlertTriangle âmbar + título+descrição + Button outline "Ver Detalhes".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Diferença de COR vs banner laranja em /Subscriptions: aqui AMARELO (warning leve, "aguardando próxima tentativa"). Lá LARANJA (já inadimplente).',
          },
        ],
      },
      {
        type: 'subsection',
        title: '3.C — Grid de Charts (3 cols)',
        children: [
          {
            type: 'subsection',
            title: 'Chart 1 — "Evolução da Receita" (lg:col-span-2, AreaChart 300px)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 AreaChart com gradiente vertical (#00D26A 0.3 → 0.0). 5 pontos. Tooltip formatCurrency. YAxis "R$Xk".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: tendência mensal. Gradiente reforça volume. Ascendente = saudável.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Chart 2 — "Métodos de Pagamento" (PieChart donut 200px)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 PieChart innerRadius=60 outerRadius=80. 3 fatias: Cartão 65% azul, Pix 25% verde, Boleto 10% âmbar. Legenda extra com 3 mini-blocos coloridos abaixo.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: % alto de boleto = nicho B2B/idosos. % alto de Pix = público novo. Decisão estratégica.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Chart 3 — "Distribuição por Frequência" (BarChart 250px)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 BarChart vertical com 4 barras: Mensal 156, Semanal 42, Quinzenal 28, Trimestral 15. Cor única #00D26A. radius=[4,4,0,0].',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: ver qual frequência domina. Mensal sempre lidera. Curiosidades em nichos (semanal = clube assinatura).',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '4. Aba "Recorrências" (lista operacional)',
    children: [
      {
        type: 'subsection',
        title: '4.A — Card de Filtros',
        children: [
          {
            type: 'list',
            items: [
              'Input com ícone Search — busca por cliente, e-mail ou ID',
              'Select "Status" (6 opções: all, active, paused, pending_retry, failed, cancelled)',
              'Select "Método" (4 opções: all, credit_card, pix_recorrente, boleto)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 3 dimensões: Status (operacional). Método (técnico). Texto (pessoal). Combinados resolvem 99% das buscas.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '4.B — Tabela (Card + Table direto, 8 colunas)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 NÃO usa DataTable comum. Implementa Table direto. Header row bg-slate-50.',
          },
          {
            type: 'list',
            items: [
              'Col 1 "Recorrência" — description font-medium + ID xs',
              'Col 2 "Cliente" — name + email',
              'Col 3 "Valor" — formatCurrency + frequencyLabels',
              'Col 4 "Método" — render por tipo: credit_card → CreditCard + "•••• 4532" / pix → QrCode emerald + "Pix" / boleto → texto plano',
              'Col 5 "Próxima Cobrança" — DD/MM/YYYY + "em N dias" via differenceInDays. Esconde se cancelled',
              'Col 6 "Status" — Badge do statusConfig + (se failed_attempts > 0) Badge outline âmbar "X falha(s)"',
              'Col 7 "Total Cobrado" — formatCurrency emerald + "X cobranças" xs',
              'Col 8 "Ações" — DropdownMenu',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE Col 6 dupla badge: status atual + sinal histórico. Cliente "ativa" mas com 2 falhas tem ALERTA contextual.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE "em N dias": mais útil que data isolada. "em 2 dias" → atenção. "em 30 dias" → tranquilo.',
          },
          {
            type: 'subsection',
            title: 'Dropdown de ações (4-5 itens condicionais)',
            children: [
              {
                type: 'list',
                items: [
                  'Eye + "Ver detalhes" (sempre)',
                  'Edit3 + "Editar" (sempre)',
                  '[separador]',
                  'Pause "Pausar" — APENAS se active',
                  'Play "Retomar" — APENAS se paused',
                  'RefreshCw "Forçar retentativa" — APENAS se pending_retry',
                  '[separador]',
                  'XCircle "Cancelar" (text-red-600) — sempre',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 NUANCE "Forçar retentativa": pula intervalo configurado e força tentativa AGORA. Útil quando atendente sabe que cliente acabou de atualizar cartão.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '5. Aba "Cobranças" (histórico atômico)',
    children: [
      {
        type: 'paragraph',
        text:
          '🎯 Tabela de logs de TODA cobrança individual processada. Cada linha = 1 evento de tentativa. Diferente de "Recorrências" (entidades); aqui mostra EXECUÇÕES.',
      },
      {
        type: 'list',
        items: [
          'Col "Data" — DD/MM/YYYY HH:MM',
          'Col "Recorrência" — description + ID curto',
          'Col "Cliente" — name',
          'Col "Valor" — formatCurrency font-semibold',
          'Col "Método" — ícone + identificador',
          'Col "Status" — Badge: Aprovada (green), Aguardando (amber)',
          'Col "Tentativas" — número simples ou "X/Y"',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 PARA QUE SERVE: AUDITORIA. Cliente reclama "fui cobrado 2x" → atendente vê histórico atômico. Diferente de só ver "current_charges_count".',
      },
      {
        type: 'paragraph',
        text:
          '📐 LIMITAÇÃO: dados hardcoded (3 linhas). Versão real: paginação, filtros (data, status, método), exportação.',
      },
    ],
  },

  {
    type: 'section',
    title: '6. Aba "Retentativas" (config + performance)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Grid lg:grid-cols-2 gap-6. ESQUERDA: card de configuração. DIREITA: card de performance dos últimos 30 dias.',
      },
      {
        type: 'subsection',
        title: '6.A — Card "Motor de Retentativas" (config)',
        children: [
          {
            type: 'list',
            items: [
              'Switch "Retentativas Automáticas" (default checked)',
              'Select "Número máximo de tentativas" — 2/3/4/5',
              'BLOCO VISUAL "Intervalo entre tentativas" — Grid 4 cols com cards bg-slate-50: 1ª (1 dia), 2ª (3 dias), 3ª (7 dias), 4ª (15 dias)',
              'Button "Salvar Configurações" verde 100% width',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE intervalos PROGRESSIVAMENTE MAIORES (1-3-7-15): comportamento humano. 1º falhou? Pode ter sido temporário. 3º? Espera maior. 15º? Provável abandono. Curva exponencial vs perda de confiança.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE: configuração mais granular em /DunningSettings. Esta é versão SIMPLIFICADA visual.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '6.B — Card "Performance de Recuperação"',
        children: [
          {
            type: 'subsection',
            title: 'Grid 2 cols com KPIs de resultado',
            children: [
              {
                type: 'list',
                items: [
                  'BLOCO emerald "Recuperadas": 47 cobranças, R$12.350',
                  'BLOCO red "Não recuperadas": 13 cobranças, R$3.420',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 Cores opostas. Verde = sucesso. Vermelho = falha consolidada (após todas tentativas).',
              },
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Progress bar geral: label "Taxa de Recuperação" + valor "78.3%" (verde grande) + Progress h-3. Benchmark BR: 70%+ é excelente.',
          },
          {
            type: 'subsection',
            title: 'Recuperação por tentativa (lista de Progress mini)',
            children: [
              {
                type: 'list',
                items: [
                  '1ª tentativa → 45%',
                  '2ª tentativa → 25%',
                  '3ª tentativa → 6%',
                  '4ª tentativa → 2%',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: prova matemática do retorno decrescente. 1ª salva quase metade. 4ª salva 2%. Justifica configurar limite — 5ª seria custo > benefício.',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '7. Aba "Notificações" (e-mails + automações)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Grid lg:grid-cols-2 gap-6. ESQUERDA: card "E-mails" com Switches. DIREITA: card "Automações" com regras condicionais.',
      },
      {
        type: 'subsection',
        title: '7.A — Card "Notificações por E-mail" (4 Switches)',
        children: [
          {
            type: 'list',
            items: [
              'Lembrete de cobrança — 3 dias antes',
              'Cobrança realizada — Após bem-sucedida',
              'Cobrança falhou — Quando falhar',
              'Cartão expirando — 30 dias antes do vencimento',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Cada item: bg-slate-50 rounded-lg p-3 + título + descrição + Switch (defaultChecked).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 4: cobertura mínima estratégica. Pré-cobrança (transparência), sucesso (segurança), falha (atendimento), expiração (anti-churn involuntário). /DunningSettings tem ~9 expandido.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE "Cartão expirando": prevenção de churn involuntário. Antes do plástico vencer, cliente atualiza. Sem isso, perde receita por vencimento físico.',
          },
        ],
      },
      {
        type: 'subsection',
        title: '7.B — Card "Automações" (3 regras)',
        children: [
          {
            type: 'list',
            items: [
              '"Após 4 falhas consecutivas" → Pausar recorrência e notificar equipe',
              '"Cartão expirado" → Enviar link para atualização',
              '"Cobrança recuperada" → Reativar acesso do cliente',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Cada automação em card border rounded-xl: regra + Badge "Ativo" + ação com ArrowRight.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE da 3ª regra: "Reativar acesso" — quando cobrança recupera, sistema reabilita produto SEM ação humana. Crítico em SaaS — UX-saver.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Button outline "Nova Automação" w-full → abriria builder de regras (não implementado).',
          },
        ],
      },
    ],
  },

  {
    type: 'section',
    title: '8. Dialog "Nova Recorrência" (criação simplificada)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Dialog max-w-lg ativado pelo botão do header. Form de 6 campos para criação RÁPIDA.',
      },
      {
        type: 'list',
        items: [
          'Select "Cliente" — placeholder "Selecione" + 3 mocks',
          'Grid 2 cols: Input "Valor" + Select "Frequência" (default monthly)',
          'Select "Método de Pagamento" — Cartão / Pix Recorrente / Boleto (default credit_card)',
          'Input "Descrição"',
          'Input "Data da primeira cobrança" — type=date',
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE NÃO usar SubscriptionPlan: Recurrence é GENÉRICA. Pode ser cobrança avulsa recorrente customizada. Diferença filosófica importante.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Footer: Cancelar (outline) + Criar Recorrência (verde). LIMITAÇÃO: sem onClick (UI demonstrativa).',
      },
    ],
  },
];