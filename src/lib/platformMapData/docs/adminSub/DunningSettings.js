// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DunningSettings (Configuração de Dunning)
// ============================================================================
// Arquivo dedicado, fidelidade absoluta ao código real de pages/DunningSettings.jsx.
// Cada switch, cada input numérico, cada dependência condicional, cada estado
// do formulário, cada chamada de mutation, documentado individualmente.
// ============================================================================

export const DunningSettingsDoc = {
  pageId: 'DunningSettings',
  pagePath: '/DunningSettings',
  module: 'Assinaturas',
  parentPage: 'Subscriptions',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Painel de configuração da "régua de cobrança" (dunning) — define com precisão cirúrgica como, quando e por quais canais o sistema vai tentar recuperar pagamentos que falharam, antes de suspender ou cancelar a assinatura.',

    whatIsDunning: {
      definition:
        'Dunning é o processo automatizado de comunicação e tentativa de cobrança após uma falha de pagamento. É a diferença entre perder o cliente silenciosamente (involuntary churn) e recuperar a receita.',
      criticality:
        'Em SaaS com churn de 5%/mês, ~30-40% desse churn é involuntário (cartão expirado, saldo insuficiente, fraude bloqueada). Um bom dunning recupera 50-80% desse volume — convertendo churn evitável em receita salva.',
      analogy:
        'É a "UTI da assinatura": quando o pagamento entra em parada cardíaca, o dunning aplica os procedimentos de ressuscitação na sequência certa antes de declarar o óbito (cancelamento).',
    },

    coreCapabilities: [
      'Define número de retentativas (1 a 6) e intervalos customizados em dias entre cada uma',
      'Estratégia de horário das tentativas: mesmo horário original, IA otimizada, ou horário fixo',
      'Régua de e-mails completa: pré-cobrança, sucesso, falha imediata, lembretes intermediários, último aviso, cancelamento',
      'Canais alternativos: SMS e WhatsApp com gatilhos por dias e limites de envio',
      'Ações pós-falha: suspender após N falhas, cancelar após X dias, ação de cancelamento (silencioso/email/desconto)',
      'Self-service: link único para cliente atualizar cartão e ação automática pós-atualização',
      'Pix como alternativa quando cartão falha, com desconto opcional para incentivar conversão',
    ],

    whoUsesIt: [
      'Time Financeiro: define a política de recuperação alinhada ao apetite de risco da empresa',
      'Time de Customer Success: ajusta tom dos e-mails para preservar relacionamento',
      'Time de Growth: testa estratégias (A/B) de timing e canais para maximizar recuperação',
      'CFO/Diretor: define hard limits (cancel_after_days, suspend_after_failures) para bater LGPD/contratos',
    ],

    distinctionFromRecurrence: {
      recurrence:
        '/Recurrence tem uma aba "Retentativas" que é uma versão SIMPLIFICADA (apenas número e intervalos visuais)',
      dunning:
        '/DunningSettings é a configuração COMPLETA: estratégia de horário, IA, e-mails granulares, SMS, WhatsApp, ações pós-falha, link de update de cartão, Pix com desconto',
    },

    economicImpact: {
      example:
        'Empresa com 10.000 assinantes a R$ 100/mês = R$ 1M MRR. Com 5% de falha de cobrança = R$ 50k em risco/mês. Dunning eficaz recuperando 70% = R$ 35k/mês = R$ 420k/ano em receita preservada.',
      keyMetric: 'recovery_rate (% de pagamentos falhos que viraram aprovados via dunning) — alvo realista 60-80%',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/DunningSettings.jsx',
    totalLines: 606,

    // ------------------------------------------------------------------------
    // IMPORTS
    // ------------------------------------------------------------------------
    imports: {
      reactQuery: ['useQuery (busca DunningConfig do backend)', 'useMutation (salva alterações)', 'useQueryClient (invalida cache após save)'],
      base44: 'base44.entities.DunningConfig (CRUD real, NÃO é mock)',
      lucideIcons: [
        'Save — botão de salvar no header',
        'RefreshCw — aba "Retentativas"',
        'Mail — aba "E-mails"',
        'MessageCircle — aba "SMS/WhatsApp" + ícone do card WhatsApp',
        'Smartphone — ícone do card SMS',
        'Clock — auxiliar de horários',
        'Zap — ícone do alerta de IA (purple-600)',
        'CreditCard — ícone do card "Link de Atualização de Cartão"',
        'QrCode — ícone do card "Pix como Alternativa"',
        'AlertTriangle — ícone do card "Ações após Falhas"',
        'Settings — aba "Ações"',
        'Check — auxiliar (não usado ativamente no JSX final)',
      ],
      uiComponents: ['Button', 'Input (number/time)', 'Label', 'Switch', 'Textarea (importado, não usado)', 'Tabs+TabsList+TabsTrigger+TabsContent', 'Select+items', 'Card stack', 'Slider (importado, não usado)', 'SelectionButton (componente custom para botões selecionáveis estilo "pill")'],
      external: ['toast (sonner) — feedback de save success/error', 'PageHeader compartilhado'],
    },

    // ------------------------------------------------------------------------
    // INTEGRAÇÃO COM BACKEND (não é mock!)
    // ------------------------------------------------------------------------
    backendIntegration: {
      readQuery: {
        queryKey: "['dunning-configs']",
        queryFn: 'base44.entities.DunningConfig.list()',
        defaultFallback: '[] (array vazio se carregando)',
        isLoadingFlag: 'isLoading (não usado para skeleton — gap de UX)',
      },
      writeMutation: {
        purpose: 'Decide entre UPDATE (se já existe config default) e CREATE (se primeira vez)',
        logic: `
          const existingConfig = configs.find(c => c.is_default);
          if (existingConfig) {
            return base44.entities.DunningConfig.update(existingConfig.id, data);
          }
          return base44.entities.DunningConfig.create(data);
        `,
        onSuccess: "queryClient.invalidateQueries(['dunning-configs']) + toast.success('Configurações salvas com sucesso!')",
        onError: "toast.error('Erro ao salvar configurações')",
      },
      hydrationEffect: {
        purpose: 'Quando configs carrega, popular formData com a config default',
        code: `
          useEffect(() => {
            const defaultConfig = configs.find(c => c.is_default) || configs[0];
            if (defaultConfig) {
              setFormData({ ...formData, ...defaultConfig });
            }
          }, [configs]);
        `,
        criticalNuance: 'O spread `{...formData, ...defaultConfig}` preserva campos default que não existam no backend (importante para evolução do schema). Mas tem um BUG SUTIL: como formData está nas deps closure, quando formData muda durante digitação, o effect pode disparar novamente e sobrescrever — porém aqui só dispara em [configs], então está ok na prática (mas o ESLint deveria reclamar).',
      },
    },

    // ------------------------------------------------------------------------
    // ESTADO LOCAL — formData (objeto único com 30+ campos)
    // ------------------------------------------------------------------------
    formDataState: {
      identification: {
        name: { default: "'Configuração Padrão'", purpose: 'Nome humano da configuração — útil quando empresa tiver múltiplas (ex: por subaccount, por plano)' },
        is_default: { default: 'true', purpose: 'Flag que marca a configuração ativa para o sistema usar quando uma falha ocorrer' },
      },

      retryConfiguration: {
        retry_count: {
          default: '5',
          range: '1-6',
          uiControl: 'Grid de 6 SelectionButtons',
          purpose: 'Número MÁXIMO de tentativas antes de declarar falha definitiva',
        },
        retry_intervals: {
          default: '[1, 3, 7, 14, 21]',
          purpose: 'Array de dias entre cada tentativa. Posição 0 = espera entre 1ª e 2ª, posição 1 = entre 2ª e 3ª, etc.',
          uiControl: 'Inputs numéricos w-16 com label "{idx+1}ª:" e sufixo "dias"',
          editLogic: 'Spread imutável: `intervals = [...formData.retry_intervals]; intervals[idx] = parseInt(value) || 1`',
          fallback: '|| 1 — protege contra string vazia',
          gap: 'NÃO há sincronização entre retry_count e o tamanho do array — se reduzir retry_count para 3, ainda existem 5 itens em retry_intervals (apenas os 3 primeiros são usados, mas o array fica "sujo").',
        },
        retry_time_strategy: {
          default: "'optimized'",
          options: ['same_time', 'optimized', 'specific'],
          uiControl: 'Grid de 3 SelectionButtons (md:grid-cols-3)',
          labels: { same_time: 'Mesmo horário', optimized: 'Inteligente (IA)', specific: 'Horário Fixo' },
          businessLogic: {
            same_time: 'Se cobrança original era às 09:00, retentativa também às 09:00',
            optimized: 'IA decide o melhor momento baseado em dados históricos do cliente (ex: salário cai dia 5, melhor cobrar dia 6)',
            specific: 'Empresa força um horário fixo (ex: sempre às 10:00)',
          },
        },
        retry_specific_time: {
          default: "'10:00'",
          uiControl: 'Input type=time w-32',
          conditionalRender: "Só aparece quando retry_time_strategy === 'specific'",
        },
        ai_optimization_enabled: {
          default: 'true',
          uiControl: 'Switch dentro de card destacado purple-50/purple-200',
          visualEmphasis: 'Card especial com Zap purple-600 + título "Otimização com IA" + subtítulo explicativo',
          relationship: 'Independente de retry_time_strategy — mesmo com same_time/specific, IA pode otimizar OUTROS aspectos (canal, mensagem)',
        },
      },

      emailConfiguration: {
        pre_charge_email_enabled: { default: 'true', purpose: 'Lembrete N dias ANTES da cobrança planejada (cliente sabe que vai sair débito, evita disputa por surpresa)' },
        pre_charge_email_days_before: {
          default: '3',
          uiControl: 'Input number w-16 com `disabled={!pre_charge_email_enabled}`',
          businessLogic: 'Trade-off: muito antecedência = cliente esquece. Pouca = surpresa. 3 dias é sweet spot.',
        },
        charge_success_email_enabled: { default: 'true', purpose: 'Recibo automático após cobrança bem-sucedida — reforça percepção de profissionalismo' },
        failure_email_enabled: { default: 'true', purpose: 'Notificação IMEDIATA da falha — cliente pode agir rápido (atualizar cartão antes do próximo retry)' },
        reminder_emails: {
          default: '[{days_after: 3, enabled: true}, {days_after: 7, enabled: true}, {days_after: 15, enabled: true}]',
          purpose: 'E-mails INTERMEDIÁRIOS entre a falha inicial e o cancelamento, para nutrir a recuperação',
          uiControl: 'Loop renderizando cada lembrete com Input para days_after + Switch para enabled',
          editLogic: 'Spread imutável: `reminders = [...formData.reminder_emails]; reminders[idx].days_after = parseInt(...)` — NOTA: muta o objeto interno (mesmo após spread do array, os objetos são por referência), o que poderia ser bug em React strict mode',
          gap: 'Não permite ADICIONAR ou REMOVER lembretes via UI — fixo em 3.',
        },
        final_notice_email_days_before_cancel: {
          default: '3',
          purpose: 'Último aviso antes do cancelamento permanente — última chance de recuperação',
          uiControl: 'Card com bg-red-50 border-red-200 (visual de urgência) + Input number w-16',
          noToggle: 'Não tem switch — sempre habilitado (apenas configura quantos dias antes)',
        },
        cancellation_email_enabled: { default: 'true', purpose: 'Notificação após cancelamento efetivado (compliance + chance de win-back posterior)' },
      },

      smsConfiguration: {
        sms_enabled: {
          default: 'false',
          rationale: 'OFF por padrão porque SMS tem custo (R$ 0,05-0,15 por envio) e exige integração extra',
          uiControl: 'Switch que CONDICIONALMENTE expande os 2 inputs abaixo via `{formData.sms_enabled && <>...</>}`',
        },
        sms_after_failure_days: { default: '5', uiControl: 'Input number w-24 min=1', purpose: 'Quantos dias após a primeira falha disparar primeiro SMS — geralmente DEPOIS de 1-2 e-mails sem resposta' },
        sms_max_count: { default: '2', range: '1-5', purpose: 'Limite de envios para não virar spam — 2 é o padrão (1 inicial + 1 final)' },
      },

      whatsappConfiguration: {
        whatsapp_enabled: {
          default: 'false',
          rationale: 'OFF por padrão — exige template aprovado pelo Meta + Business API',
          uiControl: 'Switch + render condicional dos 2 inputs',
        },
        whatsapp_after_failure_days: { default: '3', purpose: 'WhatsApp tem maior taxa de leitura → pode ser disparado mais cedo que SMS (3 vs 5 dias)' },
        whatsapp_max_count: { default: '2', range: '1-3', purpose: 'Limite mais baixo que SMS porque WhatsApp percebido como mais "íntimo" — risco de bloqueio do número' },
      },

      actionConfiguration: {
        suspend_after_failures: {
          default: '3',
          range: '1-10',
          purpose: 'Número de falhas consecutivas que disparam SUSPENSÃO (acesso bloqueado, mas conta ainda existe — recuperável)',
          uiControl: 'Input number colSpan-1',
        },
        cancel_after_days: {
          default: '30',
          range: '7-90',
          purpose: 'Dias DESDE A PRIMEIRA FALHA até cancelamento permanente — "ponto de não retorno"',
          businessLogic: '30 dias é o padrão SaaS — alinha com ciclos mensais. < 7 é agressivo demais, > 90 é desperdício de capital de cobrança',
        },
        cancellation_action: {
          default: "'send_email'",
          options: ['silent', 'send_email', 'offer_discount'],
          uiControl: 'Select',
          businessLogic: {
            silent: 'Cancela sem comunicação adicional (uso raro: B2B com contrato formal)',
            send_email: 'Envia e-mail formal de cancelamento (padrão LGPD)',
            offer_discount: 'Última tentativa de win-back com oferta especial (ex: "Volte com 30% off por 3 meses")',
          },
        },
      },

      cardUpdateLinkConfiguration: {
        update_card_link_enabled: {
          default: 'true',
          purpose: 'Habilita geração de URL única e segura que cliente recebe por e-mail/SMS para atualizar cartão SEM precisar logar',
          uiControl: 'Switch principal — controla render condicional dos 2 inputs subsequentes',
        },
        update_card_link_validity_hours: {
          default: '72',
          minRange: '24',
          purpose: 'Tempo de validade do link único — após isso ele invalida por segurança (anti-fraude)',
          businessLogic: '72h = 3 dias — balanceia segurança e conveniência. < 24h muito curto, > 168h (1 semana) inseguro',
        },
        action_after_card_update: {
          default: "'retry_immediately'",
          options: ['retry_immediately', 'wait_next_cycle'],
          businessLogic: {
            retry_immediately: 'Tenta cobrar AGORA com novo cartão — recupera receita rapidamente',
            wait_next_cycle: 'Espera próxima data normal — menos agressivo, melhor UX se ciclo está próximo',
          },
        },
      },

      pixAlternativeConfiguration: {
        offer_pix_on_failure: {
          default: 'true',
          purpose: 'Oferece Pix como ALTERNATIVA quando cartão falha — Pix tem 99%+ de aprovação (sem fraude/limite/bandeira)',
          uiControl: 'Switch principal — controla render do desconto',
        },
        pix_discount_on_failure: {
          default: '5 (em %)',
          range: '0-20',
          uiControl: 'Input number w-24',
          businessLogic: 'Desconto INCENTIVA conversão Pix (custo MDR Pix < custo cartão também) → win-win',
          tradeoff: '5% típico. > 10% começa a corroer margem. 0% = oferece Pix sem incentivo (ainda válido se cliente prefere)',
        },
      },
    },

    // ------------------------------------------------------------------------
    // LAYOUT GERAL
    // ------------------------------------------------------------------------
    layout: {
      pageHeader: {
        title: '"Configuração de Dunning"',
        subtitle: '"Configure a régua de cobrança para recuperação de pagamentos"',
        breadcrumbs: [{ label: 'Assinaturas', page: 'Subscriptions' }, { label: 'Dunning' }],
        action: {
          button: 'Save (verde-marca PagSmile)',
          loadingState: '{saveMutation.isPending ? "Salvando..." : <Save icon + "Salvar Configurações">}',
          disabled: 'saveMutation.isPending — previne double-submit',
          onClick: 'handleSave → saveMutation.mutate(formData)',
        },
      },

      tabs: {
        defaultValue: "'retries'",
        triggers: [
          { value: 'retries', icon: 'RefreshCw', label: 'Retentativas' },
          { value: 'emails', icon: 'Mail', label: 'E-mails' },
          { value: 'sms-whatsapp', icon: 'MessageCircle', label: 'SMS/WhatsApp' },
          { value: 'actions', icon: 'Settings', label: 'Ações' },
        ],
        triggerStyle: 'gap-2 (sem destaque ativo customizado — usa padrão Radix)',
        listStyle: 'bg-white border',
      },
    },

    // ------------------------------------------------------------------------
    // TAB 1 — RETENTATIVAS (granular)
    // ------------------------------------------------------------------------
    tabRetries: {
      cardTitle: '"Retentativas Automáticas"',
      cardDescription: '"Configure quantas vezes e quando tentar cobrar após uma falha"',

      sections: [
        {
          name: 'Número de Retentativas',
          control: 'Grid 6 colunas de SelectionButton',
          values: '[1, 2, 3, 4, 5, 6] com sufixo "x"',
          activeLogic: 'selected={formData.retry_count === count}',
          height: 'h-10',
          interaction: 'Click seta retry_count para o valor',
        },
        {
          name: 'Intervalos entre tentativas (dias)',
          control: 'flex flex-wrap gap-2 com Input number w-16 por intervalo',
          rendering: 'formData.retry_intervals.map((interval, idx) => ...)',
          inputProps: 'type=number, min=1',
          labels: '"{idx+1}ª:" antes do input, "dias" depois',
        },
        {
          name: 'Estratégia de Horário',
          control: 'Grid md:grid-cols-3 de SelectionButtons',
          options: '3 botões: same_time | optimized | specific',
        },
        {
          name: 'Horário das tentativas (condicional)',
          conditionalRender: "formData.retry_time_strategy === 'specific'",
          control: 'Input type=time w-32',
        },
        {
          name: 'Otimização com IA',
          wrapper: 'flex justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg',
          icon: 'Zap purple-600 5x5',
          label: 'font-medium text-purple-900 — "Otimização com IA"',
          subLabel: 'text-purple-700 — "IA escolhe o melhor momento baseado em dados"',
          control: 'Switch checked={formData.ai_optimization_enabled}',
        },
      ],
    },

    // ------------------------------------------------------------------------
    // TAB 2 — E-MAILS (granular)
    // ------------------------------------------------------------------------
    tabEmails: {
      cardTitle: '"Régua de E-mails"',
      cardDescription: '"Configure os e-mails enviados durante o processo de dunning"',

      items: [
        {
          name: 'E-mail de Pré-Cobrança',
          subLabel: 'dinâmico: "Lembrete {pre_charge_email_days_before} dias antes"',
          controls: 'Input number w-16 (disabled if !enabled) + Switch enabled',
          dependency: 'Input fica disabled se Switch off (UX inteligente: campo cinza não-editável)',
        },
        {
          name: 'E-mail de Cobrança Realizada',
          subLabel: 'estático: "Confirmação após pagamento"',
          control: 'Apenas Switch (não tem dias configuráveis — é evento)',
        },
        {
          name: 'E-mail de Falha Imediata',
          subLabel: 'estático: "Enviado logo após a falha"',
          control: 'Apenas Switch (evento imediato, sem delay configurável)',
        },
        {
          name: 'E-mails de Lembrete (lista dinâmica)',
          separator: 'border-t pt-4 mt-4 acima do título',
          rendering: 'formData.reminder_emails.map((reminder, idx) => ...)',
          itemControl: 'Input w-16 (days_after) + Switch (enabled)',
          editLogic: 'Spread do array, mutação do índice — atenção ao mutate-by-reference',
          fixedCount: 'Sempre 3 lembretes (3, 7, 15 dias por padrão)',
        },
        {
          name: 'E-mail de Último Aviso',
          wrapper: 'bg-red-50 border-red-200 (urgência visual)',
          subLabel: 'dinâmico: "{X} dias antes de cancelar"',
          control: 'Apenas Input w-16 (sempre habilitado, só configura X dias)',
          businessImportance: 'É o último ponto de recuperação — frequentemente recupera 10-15% dos casos',
        },
        {
          name: 'E-mail de Cancelamento',
          subLabel: 'estático: "Notificação após cancelamento"',
          control: 'Apenas Switch',
          complianceNote: 'Geralmente OBRIGATÓRIO por LGPD/contrato — manter ON',
        },
      ],
    },

    // ------------------------------------------------------------------------
    // TAB 3 — SMS/WHATSAPP (granular)
    // ------------------------------------------------------------------------
    tabSmsWhatsapp: {
      twoCards: 'SMS card primeiro, WhatsApp card segundo (estrutura idêntica)',

      smsCard: {
        cardTitle: 'flex gap-2 + Smartphone 5x5 + "SMS"',
        masterToggle: {
          row: 'flex justify-between p-3 border rounded-lg',
          label: 'Ativar SMS',
          subLabel: 'Enviar SMS durante o dunning',
          control: 'Switch sms_enabled',
        },
        conditionalFields: {
          renderIf: 'formData.sms_enabled === true',
          field1: { label: 'SMS após falha (dias)', control: 'Input number w-24 min=1', binding: 'sms_after_failure_days (default 5)' },
          field2: { label: 'Máximo de SMS', control: 'Input number w-24 min=1 max=5', binding: 'sms_max_count (default 2)' },
        },
      },

      whatsappCard: {
        cardTitle: 'flex gap-2 + MessageCircle 5x5 + "WhatsApp"',
        masterToggle: {
          label: 'Ativar WhatsApp',
          subLabel: 'Enviar mensagens pelo WhatsApp',
          control: 'Switch whatsapp_enabled',
        },
        conditionalFields: {
          renderIf: 'formData.whatsapp_enabled === true',
          field1: { label: 'WhatsApp após falha (dias)', control: 'Input number w-24 min=1', binding: 'whatsapp_after_failure_days (default 3)' },
          field2: { label: 'Máximo de mensagens', control: 'Input number w-24 min=1 max=3', binding: 'whatsapp_max_count (default 2) — NOTA: max=3 (vs 5 no SMS) por questão de bloqueio Meta' },
        },
      },
    },

    // ------------------------------------------------------------------------
    // TAB 4 — AÇÕES (granular)
    // ------------------------------------------------------------------------
    tabActions: {
      threeCards: 'Ações após Falhas | Link de Atualização de Cartão | Pix como Alternativa',

      card1ActionsAfterFailures: {
        cardTitle: 'flex gap-2 + AlertTriangle 5x5 + "Ações após Falhas"',
        gridTwoCols: {
          field1: { label: 'Suspender após X falhas', control: 'Input number min=1 max=10', binding: 'suspend_after_failures (default 3)' },
          field2: { label: 'Cancelar após X dias', control: 'Input number min=7 max=90', binding: 'cancel_after_days (default 30)' },
        },
        select: {
          label: 'Ação de Cancelamento',
          binding: 'cancellation_action',
          options: ['Cancelar silenciosamente (silent)', 'Enviar e-mail de cancelamento (send_email)', 'Oferecer desconto para voltar (offer_discount)'],
        },
      },

      card2CardUpdateLink: {
        cardTitle: 'flex gap-2 + CreditCard 5x5 + "Link de Atualização de Cartão"',
        masterToggle: {
          row: 'flex justify-between p-3 border rounded-lg',
          label: 'Gerar link único',
          subLabel: 'Link seguro para atualizar cartão',
          control: 'Switch update_card_link_enabled (default true)',
        },
        conditionalFields: {
          renderIf: 'formData.update_card_link_enabled === true',
          field1: { label: 'Validade do link (horas)', control: 'Input number w-24 min=24', binding: 'update_card_link_validity_hours (default 72)' },
          field2: {
            label: 'Após atualização',
            control: 'Select',
            binding: 'action_after_card_update',
            options: ['Cobrar imediatamente (retry_immediately)', 'Aguardar próximo ciclo (wait_next_cycle)'],
          },
        },
      },

      card3PixAlternative: {
        cardTitle: 'flex gap-2 + QrCode 5x5 + "Pix como Alternativa"',
        masterToggle: {
          label: 'Oferecer Pix quando cartão falha',
          subLabel: 'Alternativa para recuperar pagamento',
          control: 'Switch offer_pix_on_failure (default true)',
        },
        conditionalField: {
          renderIf: 'formData.offer_pix_on_failure === true',
          field: { label: 'Desconto para Pix (%)', control: 'Input number w-24 min=0 max=20', binding: 'pix_discount_on_failure (default 5)', valueParser: 'parseFloat (permite decimais como 2.5%)' },
        },
      },
    },

    // ------------------------------------------------------------------------
    // GAPS & OPORTUNIDADES
    // ------------------------------------------------------------------------
    knownGaps: [
      'isLoading não usado — sem skeleton durante carregamento (UX não-ideal em conexões lentas)',
      'Editor de templates de e-mail não existe — apenas toggles. Sem preview, sem variáveis ({{nome}}, {{valor}})',
      'Não há A/B testing nativo entre estratégias',
      'reminder_emails fixo em 3 itens — não permite adicionar/remover via UI',
      'Sem sincronização entre retry_count e retry_intervals.length',
      'Sem visualização "linha do tempo" da régua completa (cliente não vê: dia 0=falha, dia 1=retry, dia 3=email1, dia 5=SMS, etc.)',
      'Sem comportamento por motivo de falha (entidade prevê behavior_by_failure_reason mas UI não expõe)',
      'Sem comportamento por valor (behavior_by_value_range existe na entidade mas não tem UI)',
      'Sem suporte a múltiplas configurações (ex: por subaccount, por plano) — apenas 1 default',
      'Imports não usados: Slider, Textarea, Check (code smell — limpeza pendente)',
    ],

    relationshipsToOtherPages: {
      with: '/Recurrence (aba Retentativas)',
      relationship: 'Aba simplificada → este painel é o "advanced settings". Devem estar sincronizados via mesma entidade DunningConfig.',
      with2: '/Subscriptions',
      relationship2: 'Quando subscription.status vira delinquent, o motor consulta esta config para decidir próximos passos',
    },
  },
};

export default DunningSettingsDoc;