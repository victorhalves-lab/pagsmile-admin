// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /SubscriptionPlans
// CRUD do catálogo de planos (templates) de assinatura
// =============================================================================

export const SubscriptionPlansDoc = [
  // ===========================================================================
  // INTRODUÇÃO ESTRATÉGICA
  // ===========================================================================
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Planos de Assinatura',
    body:
      'É o CRUD do CATÁLOGO DE PRODUTOS RECORRENTES do merchant. Cada SubscriptionPlan é um TEMPLATE — uma definição reutilizável tipo "Plano Premium R$99/mês com trial de 7 dias e 20% off nos 3 primeiros ciclos". Quando um cliente assina, o sistema cria uma INSTÂNCIA Subscription que aponta para o plano. Todos os assinantes do mesmo plano herdam suas regras (preço, ciclo, trial, métodos de pagamento). Editar o plano altera comportamento das NOVAS assinaturas — assinaturas existentes mantêm os parâmetros que tinham no momento em que foram criadas.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve no dia a dia',
    body:
      '(1) DEFINIR OFERTA: gestor monta o portfólio de planos (Básico/Pro/Premium ou Mensal/Anual com desconto). (2) AJUSTAR PREÇO E CONDIÇÕES: editar plano para refletir nova estratégia comercial. (3) MEDIR PERFORMANCE POR PLANO: contagem de assinantes + receita acumulada por plano em colunas dedicadas. (4) APOSENTAR plano antigo (status=inactive) sem afetar quem já assinou — plano "fantasma" preserva continuidade. (5) DUPLICAR planos para criar variações rápidas (Mensal → Anual com desconto).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Hierarquia conceitual',
    body:
      'PLANO (esta página) ⇒ ASSINATURA (/Subscriptions) ⇒ COBRANÇA (/Recurrence). Plano é a "receita do bolo" (template), Assinatura é "o bolo de cada cliente" (instância), Cobrança é "cada fatia entregue mensalmente" (execução). Esta página é o NÍVEL MAIS ALTO de abstração — onde o gestor desenha o produto.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Fonte real de dados',
    body:
      'Página consome DADOS REAIS via base44.entities.SubscriptionPlan.list("-created_date", 100) — 100 planos mais recentes ordenados pela data de criação descendente. Mutations (create, update, delete) também persistem via base44 SDK.',
  },

  // ===========================================================================
  // 1. PAGEHEADER
  // ===========================================================================
  {
    type: 'section',
    title: '1. PageHeader — título + breadcrumb 2 níveis + botão único',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 ESTRUTURA: <PageHeader title="Planos de Assinatura" subtitle="Gerencie seus planos de cobrança recorrente">. Subtitle DESCRITIVO (diferente de /Subscriptions onde subtitle = title) — aqui é uma sub-tela do módulo, então o subtítulo guia o usuário.',
      },
      {
        type: 'paragraph',
        text:
          '📐 BREADCRUMB com 2 níveis: [{ label: "Assinaturas", page: "Subscriptions" }, { label: "Planos" }]. O primeiro é clicável (volta a /Subscriptions). O segundo (atual) é apenas texto. Comunica a hierarquia mental: estamos DENTRO do módulo Assinaturas, na sub-tela Planos.',
      },
      {
        type: 'subsection',
        title: '1.A — Botão único "Novo Plano" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="w-4 h-4 mr-2" />Novo Plano</Button>.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 onClick faz DUAS COISAS em sequência: (1) resetForm() — limpa o state formData de qualquer dado residual de edição anterior. (2) setIsCreateOpen(true) — abre o SideDrawer.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE RESET ANTES DE ABRIR: imagine cenário — usuário editou plano A, fechou drawer, clica "Novo Plano". Sem reset, formData ainda tem os dados do plano A. O reset garante página em branco. É um SAFEGUARD CRÍTICO contra criar planos com dados de outro plano.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO MÚLTIPLOS BOTÕES (como /Subscriptions tem 4): página é mais simples — só CRUD de planos. Sem necessidade de atalhos para outras telas (a navegação contextual já está no breadcrumb).',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 2. GRID DE 3 KPIs
  // ===========================================================================
  {
    type: 'section',
    title: '2. Grid de 3 KPIs no topo',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 ESTRUTURA: <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">. Responsivo: 1 coluna mobile, 3 desktop. Apenas 3 KPIs (não 5 como /Subscriptions) — escopo é template, não instâncias.',
      },

      // ----- KPI 1: Planos Ativos -----
      {
        type: 'subsection',
        title: '2.A — KPI 1 "Planos Ativos" (Repeat purple)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 PROPS: title="Planos Ativos" / value={activePlans.length} / format="number" / icon={Repeat} / iconBg="bg-purple-100" / iconColor="text-purple-600". SEM prop change.',
          },
          {
            type: 'paragraph',
            text:
              '📐 CÁLCULO: activePlans = plans.filter(p => p.status === "active").',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: panorama do PORTFÓLIO. Merchant com 3 planos ativos tem oferta enxuta. Com 12 ativos tem oferta complexa (talvez excessiva). Indicativo de saúde do catálogo.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE COR PURPLE: roxo é a cor associada ao módulo de RECORRÊNCIA no design system PagSmile. Aparece em cabeçalhos, KPIs e ícones do módulo todo. Reforça identidade visual do submódulo.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE ÍCONE Repeat: setas em loop = recorrência/ciclo. Comunica visualmente o que o plano FAZ (cobra repetidamente). Mais semântico que um genérico "Box" ou "Tag".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE NÃO TEM CHANGE: variação de quantidade de planos é comportamento DELIBERADO do gestor (criou ou desativou um). Não é métrica orgânica que vale comparar entre períodos.',
          },
        ],
      },

      // ----- KPI 2: Total Assinantes -----
      {
        type: 'subsection',
        title: '2.B — KPI 2 "Total Assinantes" (Users blue)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 PROPS: title="Total Assinantes" / value={totalSubscribers} / format="number" / icon={Users} / iconBg="bg-blue-100" / iconColor="text-blue-600".',
          },
          {
            type: 'paragraph',
            text:
              '📐 CÁLCULO: totalSubscribers = plans.reduce((sum, p) => sum + (p.current_subscribers || 0), 0). SOMA o campo current_subscribers de TODOS os planos (incluindo inativos — pessoas continuam assinando planos descontinuados).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: contagem total de pessoas que possuem QUALQUER plano. Diferente do KPI "Assinaturas Ativas" em /Subscriptions porque LÁ filtra status=active+trial; AQUI conta TODOS os subscribers de TODOS os planos (incluindo paused, delinquent etc). Métrica de "tamanho da base" agregada por plano.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE FALLBACK || 0: planos recém-criados podem ter current_subscribers=undefined. Sem fallback, reduce explodiria com NaN.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE COR BLUE: convenção do design — Users sempre azul, em qualquer parte do app.',
          },
        ],
      },

      // ----- KPI 3: Receita Total -----
      {
        type: 'subsection',
        title: '2.C — KPI 3 "Receita Total" (DollarSign emerald)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 PROPS: title="Receita Total" / value={totalRevenue} / format="currency" / icon={DollarSign} / iconBg="bg-emerald-100" / iconColor="text-emerald-600".',
          },
          {
            type: 'paragraph',
            text:
              '📐 CÁLCULO: totalRevenue = plans.reduce((sum, p) => sum + (p.total_revenue || 0), 0). total_revenue de cada plano é a SOMA HISTÓRICA de tudo que aquele plano já gerou (não MRR; é receita acumulada desde a criação).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 SIGNIFICADO: "quanto este catálogo de planos já gerou na vida". Métrica de "track record" total. Plano antigo de 5 anos pode ter total_revenue muito maior que plano novo, mesmo que o novo cobre mais por mês.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NÃO É MRR: importante distinguir — MRR (em /Subscriptions e /SubscriptionAnalytics) é PROJEÇÃO mensal. Aqui é HISTÓRICO acumulado. Um plano descontinuado tem MRR 0 mas total_revenue altíssimo se foi vendido por anos.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE COR EMERALD: verde de receita realizada — reforça que é dinheiro que ENTROU.',
          },
        ],
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE SÓ 3 KPIs (e não MRR, churn, cohort): esta tela é de TEMPLATES. Métricas profundas de comportamento (MRR, churn, LTV, cohort) ficam nas outras telas (/Subscriptions, /SubscriptionAnalytics). Aqui foco minimalista responde só "quantos produtos? quantos comprando? quanto gerei?". Mais que isso seria informação demais para a função "gerenciar catálogo".',
      },
    ],
  },

  // ===========================================================================
  // 3. EMPTYSTATE OU DATATABLE
  // ===========================================================================
  {
    type: 'section',
    title: '3. EmptyState (zero planos) OU DataTable (>=1 plano)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 RENDERIZAÇÃO CONDICIONAL: { plans.length === 0 && !isLoading ? <EmptyState ... /> : <DataTable ... /> }. A condição && !isLoading EVITA exibir EmptyState durante o loading (que mostraria "vazio" enganosamente).',
      },

      // ----- EmptyState -----
      {
        type: 'subsection',
        title: '3.A — EmptyState (quando zero planos)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 <EmptyState icon={Repeat} title="Nenhum plano criado" description="Crie seu primeiro plano de assinatura" actionLabel="Criar Plano" onAction={() => setIsCreateOpen(true)} />.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: ONBOARDING para merchants novos. Em vez de tabela vazia confusa, mostra estado intencional com CTA proeminente. Ícone Repeat (mesmo dos KPIs) cria coerência visual.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE actionLabel "Criar Plano" e não "Novo Plano" (como o botão do header): variação intencional. "Criar Plano" no contexto de tela vazia comunica "vamos começar do zero". "Novo Plano" no header é "adicione mais um aos existentes".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE onAction → setIsCreateOpen(true) (sem resetForm): no estado vazio, formData já está vazio (foi inicializado vazio no useState). Reset desnecessário.',
          },
        ],
      },

      // ----- DataTable -----
      {
        type: 'subsection',
        title: '3.B — DataTable (quando >=1 plano)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 PROPS: <DataTable columns={columns} data={plans} loading={isLoading} searchable searchPlaceholder="Buscar por nome..." pagination pageSize={25} currentPage={1} totalItems={plans.length} onRefresh={refetch} emptyMessage="Nenhum plano encontrado">.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 NUANCE — searchable=true (vs /Subscriptions que controla busca manualmente): DataTable já tem busca built-in. Como aqui só precisa filtrar por NOME, basta ativar a flag. Em /Subscriptions a busca é em 3 campos com lógica customizada, por isso o input externo.',
          },

          // Coluna 1: Plano
          {
            type: 'subsection',
            title: '3.B.1 — Coluna 1 "Plano" (ícone colorido + nome + ID)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 key="name". RENDER: flex items-center gap-3. ESQUERDA: quadrado 10×10 com ícone Repeat. DIREITA: nome do plano + plan_id em cinza.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 QUADRADO COLORIDO COM COR ADAPTATIVA: <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", row.status === "active" ? "bg-purple-100" : "bg-gray-100")}>. Active = roxo claro. Inactive = cinza claro.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 ÍCONE INTERNO: <Repeat className={cn("w-5 h-5", row.status === "active" ? "text-purple-600" : "text-gray-400")} />. Active = roxo escuro. Inactive = cinza médio.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE COR CONDICIONAL DUPLA (fundo + ícone): planos inativos ficam VISUALMENTE APAGADOS (cinza completo). Planos ativos ficam VIVOS (roxo). Olhada rápida na tabela permite ver quais estão ativos por intensidade de cor — sem precisar olhar a coluna Status.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 BLOCO DE TEXTO: <p className="font-medium text-gray-900 text-sm">{value}</p> (nome do plano) + <p className="text-xs text-gray-500">{row.plan_id}</p> (ID técnico).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE NOME PRINCIPAL E ID SECUNDÁRIO: gestor pensa em "Plano Premium". plan_id é técnico (necessário para integrações via API mas não é a leitura primária).',
              },
            ],
          },

          // Coluna 2: Valor
          {
            type: 'subsection',
            title: '3.B.2 — Coluna 2 "Valor" (preço + frequência)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 key="amount". RENDER: <div><p className="font-semibold text-gray-900">{formatCurrency(value)}</p><p className="text-xs text-gray-500">{frequencyLabels[row.frequency] || row.frequency}</p></div>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 IDÊNTICO ao padrão de /Subscriptions: valor + ciclo SEMPRE juntos para evitar ambiguidade.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 frequencyLabels mapeia: weekly→Semanal, biweekly→Quinzenal, monthly→Mensal, bimonthly→Bimestral, quarterly→Trimestral, semiannual→Semestral, annual→Anual.',
              },
            ],
          },

          // Coluna 3: Assinantes
          {
            type: 'subsection',
            title: '3.B.3 — Coluna 3 "Assinantes" (atual / limite opcional)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 key="current_subscribers". RENDER: <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" /><span>{value || 0}</span>{row.subscriber_limit_type === "limited" && (<span className="text-gray-400">/ {row.subscriber_limit_count}</span>)}</div>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: contagem direta + (se limitado) progresso até o teto. Plano "Lifetime Founder" pode ter limite 100 — quando 87/100 começa a se aproximar do "esgotado".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE LIMITE CONDICIONAL: planos ilimitados (subscriber_limit_type=unlimited) não devem mostrar "/" — seria visual confuso ("87/" sem número final). Renderiza apenas o número solto.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 ÍCONE Users cinza-400: discreto, dá contexto sem competir visualmente. Diferente do KPI 2 onde o ícone era a peça principal.',
              },
            ],
          },

          // Coluna 4: Trial
          {
            type: 'subsection',
            title: '3.B.4 — Coluna 4 "Trial" (badge "X dias" ou "-")',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 key="trial_days". RENDER: value > 0 ? <Badge variant="outline">{value} dias</Badge> : <span className="text-gray-400 text-sm">-</span>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE BADGE OUTLINE (e não preenchido): trial é INFORMATIVO, não acionável. Outline transmite "neutro/contextual". Contrasta com Status (badges preenchidos = estado ativo).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE "-" QUANDO trial_days=0: planos SEM trial mostram "-" (não "0 dias"). Texto "0 dias" seria estranho — comunica "trial existe mas dura 0 dias". "-" comunica "não há trial configurado".',
              },
            ],
          },

          // Coluna 5: Visibilidade
          {
            type: 'subsection',
            title: '3.B.5 — Coluna 5 "Visibilidade" (ícone + texto Público/Privado)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 key="visibility". RENDER: <div className="flex items-center gap-1.5">{value === "private" ? (<><EyeOff className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-500">Privado</span></>) : (<><Eye className="w-4 h-4 text-blue-500" /><span className="text-sm text-gray-700">Público</span></>)}</div>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 LÓGICA: SE private → ícone EyeOff cinza + texto "Privado" cinza-500. SE public (default) → ícone Eye azul-500 + texto "Público" cinza-700.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE A VISIBILIDADE: planos PÚBLICOS aparecem em vitrine pública (página de planos do site do merchant — ex: stripe.com/pricing). PRIVADOS só são acessíveis via link direto — útil para "Founder", "Enterprise customizado", "Cupom interno".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE EyeOff CINZA E Eye AZUL: privado = "escondido" (ícone com riscado + cor neutra discreta). Público = "visível" (ícone aberto + azul que destaca).',
              },
            ],
          },

          // Coluna 6: Status
          {
            type: 'subsection',
            title: '3.B.6 — Coluna 6 "Status" (Badge Ativo/Inativo)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 key="status". RENDER: <Badge className={value === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>{value === "active" ? "Ativo" : "Inativo"}</Badge>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 NUANCE CRÍTICA — "Inativo" NÃO CANCELA assinaturas existentes: gestor desativa um plano antigo apenas para impedir NOVAS assinaturas. As pessoas que já assinam continuam pagando normalmente. Plano vira "fantasma" no catálogo — invisível mas funcionante.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 USE CASE: plano "Pro Legado R$49" tem 200 assinantes. Lançou "Pro Novo R$79". Não pode forçar migração (legalmente). Inativa o legado → ninguém novo entra, mas os 200 continuam pagando R$49 indefinidamente.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 2 ESTADOS APENAS (vs Visibilidade que tem 2 também — diferença?): Status responde "está disponível para assinar?" (sim/não). Visibilidade responde "está exposto no marketing?" (sim/não). 4 combinações possíveis: Público+Ativo (oferta normal), Privado+Ativo (oferta link-direto), Público+Inativo (vitrine só, não pode comprar), Privado+Inativo (efetivamente arquivado).',
              },
            ],
          },

          // Coluna 7: Ações
          {
            type: 'subsection',
            title: '3.B.7 — Coluna 7 "Ações" (DropdownMenu de 3 itens)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 key="actions" / label="". Trigger: <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>. Sempre visível independente do status.',
              },

              // Item 1: Editar
              {
                type: 'subsection',
                title: 'Item "Editar"',
                children: [
                  {
                    type: 'paragraph',
                    text:
                      '📐 <DropdownMenuItem onClick={() => handleEdit(row)}><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem>.',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '📐 handleEdit popula o formData com a row inteira (setFormData(plan)) e seta editingPlan=row. Isso ABRE O DRAWER (já que open={isCreateOpen || !!editingPlan}) já preenchido com os valores do plano.',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 NUANCE — por que reaproveitar o mesmo Drawer/Form para criar e editar: 95% dos campos são iguais. Manutenção de formulário separado seria duplicação. O state editingPlan é o "modo": null = criação, plan_object = edição.',
                  },
                ],
              },

              // Item 2: Duplicar
              {
                type: 'subsection',
                title: 'Item "Duplicar"',
                children: [
                  {
                    type: 'paragraph',
                    text:
                      '📐 <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />Duplicar</DropdownMenuItem>. SEM onClick (não implementado).',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 PARA QUE SERVIRÁ: gestor com plano "Premium Mensal R$99" cria "Premium Anual R$999 (10% off)" partindo do mensal. Versão final faria: clonar todos os campos, ajustar nome com sufixo "(Cópia)", abrir drawer em modo criação para revisar/ajustar antes de salvar.',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 POR QUE Copy: ícone universal de "duplicar/clonar". Familiar de Word, Excel, OS.',
                  },
                ],
              },

              // Item 3: Excluir
              {
                type: 'subsection',
                title: 'Item "Excluir" (vermelho com confirm())',
                children: [
                  {
                    type: 'paragraph',
                    text:
                      '📐 <DropdownMenuItem className="text-red-600" onClick={() => { if (confirm("Excluir este plano?")) deleteMutation.mutate(row.id); }}><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>.',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 SAFEGUARD VIA window.confirm(): nativa do browser, bloqueia execução até user confirmar. Simplicidade aceitável neste contexto. UX mais sofisticada usaria <AlertDialog> com texto detalhado e botão vermelho destacado, mas confirm() resolve o caso de proteção contra clique acidental.',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 NUANCE CRÍTICA: excluir um plano que TEM ASSINANTES quebraria os registros (foreign key). Versão final deveria validar antes — se current_subscribers > 0, exibir erro "Plano tem X assinantes ativos. Inative em vez de excluir." Atualmente backend que precisa rejeitar.',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 RECOMENDAÇÃO IMPLÍCITA: por isso "Inativo" existe como ESTADO (na coluna Status). Sempre que possível, prefira INATIVAR (preserva histórico) a EXCLUIR (apaga referências).',
                  },
                  {
                    type: 'paragraph',
                    text:
                      '🎯 POR QUE Trash2 e text-red-600: convenção universal — exclusão = lixeira vermelha.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 4. SIDEDRAWER — FORMULÁRIO DE 5 CARDS
  // ===========================================================================
  {
    type: 'section',
    title: '4. SideDrawer — formulário de criação/edição (5 cards)',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 ESTRUTURA: <SideDrawer open={isCreateOpen || !!editingPlan} onOpenChange={...} title={editingPlan ? "Editar Plano" : "Novo Plano de Assinatura"} icon={Repeat} size="lg" footer={...}>. Conteúdo = <SubscriptionPlanForm formData={formData} setFormData={setFormData} />.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 POR QUE SIDEDRAWER E NÃO DIALOG MODAL: o formulário tem 5 cards verticais e ~20 campos. Em modal, ficaria sufocante (modal típico tem 600px de largura). SideDrawer ocupa 50% da tela em laterais largas, permite scroll natural, e PRESERVA visibilidade da tabela atrás — gestor ainda vê outros planos enquanto edita.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 size="lg" → largura ~640px. Suficiente para grids de 2 colunas em campos que não precisam ocupar a linha toda (Valor + Frequência lado a lado).',
      },
      {
        type: 'paragraph',
        text:
          '🎯 TÍTULO DINÂMICO: editingPlan ? "Editar Plano" : "Novo Plano de Assinatura". O usuário sabe IMEDIATAMENTE em que modo está.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 onOpenChange (fechar via ESC ou clicar no overlay): faz 3 limpezas: setIsCreateOpen(false), setEditingPlan(null), resetForm(). Sair do drawer sempre limpa estado — abrir de novo virgem.',
      },

      // ----- Card 1: Informações do Plano -----
      {
        type: 'subsection',
        title: '4.A — Card 1 "Informações do Plano"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 <Card><CardHeader><CardTitle className="text-lg">Informações do Plano</CardTitle></CardHeader><CardContent className="space-y-4">. 4 campos verticais.',
          },

          // Campo 1: Nome
          {
            type: 'subsection',
            title: '4.A.1 — Input "Nome do Plano *" (obrigatório, max 50)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <Input placeholder="Ex: Plano Premium Mensal" value={formData.name} onChange={...} maxLength={50}>. Asterisco visível no Label.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE maxLength=50: nomes longos (>50) quebram visualmente em UIs (tabela, badges, e-mails). Limite força o gestor a ser conciso.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE PLACEHOLDER ESPECÍFICO "Ex: Plano Premium Mensal": sugere padrão de nomenclatura (qualidade do plano + frequência). Reduz dúvida de "como nomear".',
              },
            ],
          },

          // Campo 2: Descrição
          {
            type: 'subsection',
            title: '4.A.2 — Textarea "Descrição" (max 500, h-20)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <Textarea placeholder="O que o plano oferece..." maxLength={500} className="mt-1.5 h-20">. h-20 = 80px (~3 linhas visíveis).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: aparece na vitrine de planos (página de pricing). Persuade o cliente a escolher. Diferente de Benefícios (que é lista bullet), Descrição é texto fluido.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 500 CHARS: o suficiente para 2-3 frases de marketing. Mais que isso vira parágrafo extenso que ninguém lê na vitrine.',
              },
            ],
          },

          // Campo 3: Benefícios
          {
            type: 'subsection',
            title: '4.A.3 — Bloco "Benefícios" (array dinâmico)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 ESTRUTURA: header com Label "Benefícios" à esquerda + Button outline-sm "Adicionar" (ícone Plus 3×3) à direita. Abaixo, lista vertical (space-y-2) de itens.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 CADA ITEM DA LISTA: flex items-center gap-2 com 3 elementos: (1) ícone Check w-4 h-4 text-green-500 flex-shrink-0, (2) <Input flex-1 placeholder="Ex: Acesso ilimitado">, (3) Button ghost-icon com X (remove).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 ESTADO VAZIO: <p className="text-sm text-gray-500">Adicione benefícios para exibir aos clientes</p>. Texto guia quando array é vazio.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 FUNÇÕES: addBenefit() faz [...benefits, ""]. updateBenefit(i, val) atualiza posição. removeBenefit(i) faz splice.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: lista de "vantagens" exibida na vitrine como bullets. "Acesso ilimitado", "Suporte 24/7", "Sem anúncios". Marketing puro de venda comparativa.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE ARRAY DINÂMICO (e não textarea ou checkbox): permite N benefícios. Plano Básico talvez tenha 3, Premium tenha 10. Inflexibilidade de campo fixo limitaria estratégia comercial.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE Check VERDE: ícone verde de "✓ confirmado" reforça MENTALMENTE que é um benefício GANHADO pelo cliente. Cor positiva.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE BOTÃO X É GHOST (sem cor): não destruir visualmente um benefício é "perigoso" como excluir um plano inteiro. Ghost discreto evita ênfase indesejada na ação destrutiva pequena.',
              },
            ],
          },

          // Campo 4: Identificador Externo
          {
            type: 'subsection',
            title: '4.A.4 — Input "Identificador Externo"',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <Input placeholder="Ex: plan_premium_monthly" value={formData.external_id}>. Subtexto cinza: "ID para integração com seu sistema".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: integração ERP/CRM. Merchant tem plano no sistema interno deles com ID "PLAN-PREM-001"; ao integrar via API, mapeia esse ID para o plan_id do PagSmile via external_id. Permite reconciliação cross-sistemas.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE OPCIONAL: muitos merchants pequenos não têm sistema externo. Forçar geraria atrito. Quem precisa, preenche.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE PADRÃO snake_case ("plan_premium_monthly"): convenção API. Sistemas downstream aceitam melhor IDs sem espaços/acentos.',
              },
            ],
          },
        ],
      },

      // ----- Card 2: Preço e Frequência -----
      {
        type: 'subsection',
        title: '4.B — Card 2 "Preço e Frequência"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 CardTitle="Preço e Frequência". Conteúdo: grid 2 cols (Valor + Frequência) e abaixo Dia de Cobrança em linha cheia.',
          },

          // Campo 1: Valor
          {
            type: 'subsection',
            title: '4.B.1 — Input "Valor (R$) *" (obrigatório)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <Input type="number" placeholder="99,90" min="1" step="0.01" onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 step=0.01: aceita centavos (R$99,90). min=1: previne planos absurdos de R$0,01 por engano. parseFloat com fallback || 0 evita NaN.',
              },
            ],
          },

          // Campo 2: Frequência
          {
            type: 'subsection',
            title: '4.B.2 — Select "Frequência *" (7 opções, default monthly)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 7 opções renderizadas via map: Semanal/Quinzenal/Mensal/Bimestral/Trimestral/Semestral/Anual. defaultValue "monthly".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: define o INTERVALO entre cobranças. Cliente do plano Mensal é cobrado a cada 30 dias; Anual a cada 365 dias. Cada frequência tem use cases típicos: Mensal=SaaS padrão, Anual=desconto fidelidade, Semanal=clube de assinatura, Trimestral=academia.',
              },
            ],
          },

          // Campo 3: Dia de Cobrança
          {
            type: 'subsection',
            title: '4.B.3 — Select "Dia de Cobrança" (signup_day OU dia 1-28)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 OPÇÕES: SelectItem "signup_day" → "Dia do cadastro" + 28 SelectItems gerados via [...Array(28)].map → "Dia 1", "Dia 2", ..., "Dia 28".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE LIMITE 1-28 (e não 1-31): meses têm 28, 29, 30 ou 31 dias. Se gestor escolhesse "Dia 31", em fevereiro o sistema teria que decidir entre "cobrar dia 28", "pular este mês", "cobrar dia 1 do mês seguinte" — todos ruins. Limitar a 28 garante que TODO mês tem o dia escolhido.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE "Dia do cadastro" DEFAULT: mais flexível para o cliente. Quem assina dia 17/03 será cobrado dia 17 todos os meses. Não exige sincronização forçada com calendário fiscal do merchant.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVIRIA "Dia 1" (fixo): merchants com fechamento contábil mensal preferem TODOS os clientes pagando dia 1 — facilita reconciliação. Trade-off: clientes podem ter mês inicial parcial (ou são cobrados pro-rata, ou têm "freebie" até dia 1 seguinte).',
              },
            ],
          },
        ],
      },

      // ----- Card 3: Trial e Promoções -----
      {
        type: 'subsection',
        title: '4.C — Card 3 "Trial e Promoções" (com ícone Gift)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 CardTitle inline com ícone: <CardTitle className="text-lg flex items-center gap-2"><Gift className="w-5 h-5" />Trial e Promoções</CardTitle>. Único card com ícone no título — destaca a NATUREZA INCENTIVADORA.',
          },

          // Campo 1: Trial (dias)
          {
            type: 'subsection',
            title: '4.C.1 — Input "Período de Trial (dias)" + Checkbox "Exigir cartão"',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 GRID 2 COLS. ESQUERDA: <Input type="number" min="0" max="90" value={formData.trial_days || 0}>. DIREITA: bloco flex com Checkbox + Label "Exigir cartão no trial".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 LIMITE max=90 dias (3 meses): trials longos viram "freemium" sem qualificação. Padrão indústria 7-30 dias. 90 já é generoso.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 NUANCE — Checkbox "Exigir cartão no trial":',
              },
              {
                type: 'list',
                items: [
                  'ON (default checked): cliente cadastra cartão para iniciar trial. Após X dias, cobra automaticamente. CONVERSÃO REAL ALTA (~70%) mas atrito de cadastro.',
                  'OFF: cliente entra só com e-mail. Após X dias, sistema bloqueia e PEDE cartão. CONVERSÃO MENOR (~20-40%) mas TOPO DE FUNIL maior.',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 TRADE-OFF ESTRATÉGICO: cobrar atrito vs. liberar acesso. Decisão depende do produto — saas onde valor é demonstrado em horas (analytics) → trial sem cartão; saas onde valor leva semanas (ferramenta complexa) → exigir cartão (filtra curiosos).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 IMPLEMENTAÇÃO técnica: checked={formData.require_card_on_trial !== false}. Lógica reversa — se for explicitamente false, desmarca; em qualquer outro caso (true ou undefined), marca. Default ON.',
              },
            ],
          },

          // Campo 2: Setup Fee
          {
            type: 'subsection',
            title: '4.C.2 — Input "Taxa de Adesão (Setup Fee) - R$"',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <Input type="number" placeholder="0,00" min="0" step="0.01">. Subtexto cinza: "Valor único cobrado na primeira cobrança".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: cobrança ÚNICA acrescida na PRIMEIRA cobrança. Common em produtos com onboarding caro (consultoria), ativação de hardware, taxa de matrícula em escola.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE SEPARADO DO amount: contabilidade. Setup fee = receita ÚNICA (entra como "non-recurring"). amount = receita RECORRENTE (entra como MRR). Misturar distorceria métricas SaaS — empresa pode parecer ter MRR alto que na verdade é só setup fee.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 IMPLEMENTAÇÃO BACKEND: na primeira cobrança gerada pelo motor de Recurrence, valor = amount + setup_fee. Demais cobranças = amount apenas.',
              },
            ],
          },

          // Campo 3: Bloco Desconto Inicial
          {
            type: 'subsection',
            title: '4.C.3 — Bloco "Desconto Inicial" (bg-yellow-50)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 div p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3. Contém: título "Desconto Inicial" amarelo-900 + grid 2 cols (Desconto % + Por quantos ciclos).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 CAMPO 1 — Desconto: type=number min=0 max=100 placeholder="0".',
              },
              {
                type: 'paragraph',
                text:
                  '📐 CAMPO 2 — Ciclos: type=number min=1 placeholder="1".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE BG-YELLOW (visualmente destacado): comunica "ATENÇÃO ESPECIAL — promoção/oferta". Distingue do resto do form. Amarelo = "promocional" no design system.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: desconto AUTOMÁTICO nas primeiras N cobranças de qualquer assinante novo. Diferente do desconto manual de retenção em /Subscriptions (que é por cliente). Aqui é OFERTA DE LANÇAMENTO embutida no plano — "20% off nos 3 primeiros meses".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 IMPLEMENTAÇÃO: ao criar Subscription a partir deste plano, sistema preenche applied_discount_percentage e applied_discount_remaining_cycles automaticamente. Decrementa a cada ciclo até 0.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 ESTRATÉGIA COMERCIAL: descontos iniciais aumentam conversão de aquisição (cliente pensa "barato"). Após expirar, cliente pode achar "caro" e churnar — é por isso que há gráficos de churn por ciclo (em /SubscriptionAnalytics) que detectam picos no ciclo X+1 (logo após o desconto acabar).',
              },
            ],
          },
        ],
      },

      // ----- Card 4: Métodos de Pagamento -----
      {
        type: 'subsection',
        title: '4.D — Card 4 "Métodos de Pagamento" (cards clickáveis)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 CardTitle="Métodos de Pagamento". Conteúdo: 2 cards CLICKÁVEIS verticais com Checkbox embutido.',
          },

          // Card Cartão
          {
            type: 'subsection',
            title: '4.D.1 — Card "Cartão de Crédito" (clickable, azul quando ativo)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <div className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${(formData.payment_methods || ["card"]).includes("card") ? "border-blue-500 bg-blue-50" : ""}`} onClick={() => togglePaymentMethod("card")}>.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 INTERIOR: ícone CreditCard 5×5 (azul-600 ativo, cinza-400 inativo) + bloco título "Cartão de Crédito" + subtexto "Cobrança automática recorrente". Direita: <Checkbox checked={...}>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE INCLUDES("card") COM FALLBACK ["card"]: cartão é o método PADRÃO. Se payment_methods for undefined, considera ["card"] e mantém o card destacado. Garante que o estado inicial visual seja "Cartão ativo" mesmo antes de qualquer interação.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 SUBTEXTO "Cobrança automática recorrente": comunica a CARACTERÍSTICA TÉCNICA — sistema cobra sozinho, sem intervenção do cliente. Diferencia de Pix (manual cada ciclo).',
              },
            ],
          },

          // Card Pix
          {
            type: 'subsection',
            title: '4.D.2 — Card "Pix" (clickable, verde quando ativo)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 IGUAL ao Cartão mas com ícone QrCode + cor VERDE quando ativo (border-green-500 bg-green-50, text-green-600).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 SUBTEXTO: "Cobrança manual a cada ciclo".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 NUANCE CRÍTICA — "Cobrança manual a cada ciclo": Pix puro NÃO É RECORRENTE NATIVAMENTE no Brasil (até a chegada do Pix Recorrente DICT, que é fluxo separado). Para um plano com Pix, o sistema GERA UM QR-CODE NOVO a cada ciclo, e o cliente PRECISA pagar manualmente. Se não pagar, vira inadimplente. Conversão mais baixa que cartão automático, mas alguns públicos preferem (não querem cartão salvo).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE COR VERDE PIX: Pix é "verde Banco Central" no imaginário coletivo brasileiro. Convenção visual reforçada em todo o app PagSmile.',
              },
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 SAFEGUARD em togglePaymentMethod: if (methods.includes(method)) { if (methods.length > 1) setFormData(...filter...); }. ⚠️ IMPEDE DESELECIONAR TODOS — sempre pelo menos 1 método deve estar ativo. Sem isso, plano ficaria sem método de pagamento (impossível de cobrar). Tentativa de deselecionar o último é silenciosamente ignorada.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE CARDS CLICKÁVEIS E NÃO RADIO/CHECKBOX SIMPLES: cards comunicam VALOR (ícone + título + subtexto explicativo). Radio/checkbox são minimalistas demais para uma decisão estratégica. Visual rico facilita escolha consciente.',
          },
        ],
      },

      // ----- Card 5: Configurações Avançadas -----
      {
        type: 'subsection',
        title: '4.E — Card 5 "Configurações Avançadas"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 CardTitle="Configurações Avançadas". 3 campos: Limite de Assinantes + Visibilidade + Plano Ativo (Switch).',
          },

          // Campo 1: Limite de Assinantes
          {
            type: 'subsection',
            title: '4.E.1 — Limite de Assinantes (Select + Input condicional)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 ESTRUTURA: Label "Limite de Assinantes" + flex items-center gap-3 com 2 elementos: Select w-40 (Ilimitado/Limitado) + Input numérico w-24 (CONDICIONAL — só aparece se limited).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 SELECT: 2 opções → unlimited (default), limited.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 INPUT NUMÉRICO: <Input type="number" placeholder="100" min="1" className="w-24"> — APENAS RENDERIZA se subscriber_limit_type === "limited".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: criar SCARCITY ARTIFICIAL ou capacidade real. "Plano Founder limitado a 100 vagas" gera urgência e exclusividade. Plano "Onboarding 1:1" pode ter limite real porque escala depende de tempo do CSM.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 RENDER CONDICIONAL DO INPUT: experiência limpa — limitado pede número; ilimitado não pede nada (input some). Sem fields fantasmas.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 BACKEND quando atinge limite: ao tentar criar assinatura nova, sistema verifica current_subscribers >= subscriber_limit_count e rejeita com mensagem "Plano esgotado". Status do plano automaticamente vira "sold_out" em algumas implementações.',
              },
            ],
          },

          // Campo 2: Visibilidade
          {
            type: 'subsection',
            title: '4.E.2 — Visibilidade (bloco com ícone + Select)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 ESTRUTURA: <div className="flex items-center justify-between p-3 border rounded-lg">. ESQUERDA: ícone (EyeOff cinza-400 OR Eye azul-600) + bloco título "Visibilidade" + subtexto dinâmico. DIREITA: Select w-32 com Público/Privado.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 SUBTEXTO DINÂMICO: visibility==="private" ? "Apenas via link direto" : "Visível na página de assinatura". Comunica EM TEMPO REAL o efeito da escolha.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 ÍCONE CONDICIONAL: a coluna da tabela usa o mesmo padrão visual (Eye azul / EyeOff cinza). Coerência visual permite o gestor reconhecer instantaneamente.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE SEPARAR Visibilidade de Status: explicado anteriormente — Visibilidade = DESCOBERTA (exposto no marketing?). Status = DISPONIBILIDADE (pode ser assinado?). 4 combinações estratégicas distintas.',
              },
            ],
          },

          // Campo 3: Plano Ativo (Switch)
          {
            type: 'subsection',
            title: '4.E.3 — Plano Ativo (Switch)',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 <div className="flex items-center justify-between p-3 border rounded-lg">. ESQUERDA: bloco título "Plano Ativo" + subtexto "Disponível para novas assinaturas". DIREITA: <Switch checked={formData.status !== "inactive"} onCheckedChange={(v) => setFormData({ ...formData, status: v ? "active" : "inactive" })}>.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 LÓGICA do checked: status !== "inactive" — qualquer status que não seja "inactive" (incluindo undefined/null/"active") considera ATIVO. Default ON. Forçar OFF requer toggle explícito.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE SWITCH e não Select: switch comunica claramente "ligado/desligado". Para 2 estados binários, switch é mais elegante que dropdown.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 SUBTEXTO "Disponível para novas assinaturas": REFORÇA a nuance crítica — desativar não cancela existentes. Lê-se "se eu desligar, somente NOVAS pessoas serão impedidas. As atuais continuam".',
              },
            ],
          },
        ],
      },

      // ----- Footer do Drawer -----
      {
        type: 'subsection',
        title: '4.F — Footer do SideDrawer (Cancelar + Salvar)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 prop footer={<div className="flex justify-end gap-3">...</div>}. 2 botões alinhados à direita.',
          },
          {
            type: 'paragraph',
            text:
              '📐 BOTÃO 1 — Cancelar (outline): onClick faz 3 limpezas (setIsCreateOpen(false), setEditingPlan(null), resetForm()). Reabre virgem.',
          },
          {
            type: 'paragraph',
            text:
              '📐 BOTÃO 2 — Salvar (verde PagSmile): className="bg-[#00D26A] hover:bg-[#00A854]" onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}.',
          },
          {
            type: 'paragraph',
            text:
              '📐 LABEL DO BOTÃO 2 (3 estados): se isPending → "Salvando...". Se editingPlan → ícone Check + "Atualizar". Se criação → ícone Check + "Criar Plano".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 LÓGICA DE handleSave: validações inline obrigatórias — if (!formData.name) toast.error("Nome é obrigatório"); return;. Mesmo para amount. Validação CLIENT-SIDE rápida sem fechar o drawer (gestor corrige sem perder progresso).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 BIFURCAÇÃO create vs update: if (editingPlan) updateMutation.mutate({ id: editingPlan.id, data: formData }); else createMutation.mutate(formData). O state editingPlan é a chave do "modo".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 onSuccess de ambas mutations: invalidateQueries(["subscription-plans"]) → tabela recarrega. setIsCreateOpen(false) ou setEditingPlan(null) → drawer fecha. resetForm() → estado limpo. toast.success("Plano criado com sucesso!" ou "Plano atualizado com sucesso!").',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 2 MUTATIONS SEPARADAS (não 1 unificada com if): clareza — cada uma tem onSuccess específico, manutenção fácil. createMutation gera plan_id="plan_${Date.now()}" automaticamente; updateMutation só atualiza campos.',
          },
        ],
      },
    ],
  },
];