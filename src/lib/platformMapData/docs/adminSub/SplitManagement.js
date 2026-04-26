// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /SplitManagement
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/SplitManagement.jsx (510 linhas).
// Cada KPI, cada regra, cada recipient, cada validação, cada select de
// fee_payer / chargeback_liable, cada modo de divisão — documentado.
// ============================================================================

export const SplitManagementDoc = {
  pageId: 'SplitManagement',
  pagePath: '/SplitManagement',
  module: 'Financeiro',
  parentPage: 'FinancialOverview',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Gestão de regras de divisão automática de pagamento entre múltiplos recebedores (subcontas) — cria SplitRule com lista de recipients (subaccount + tipo % ou R$ + valor), configura quem paga MDR (marketplace/seller/proporcional) e quem assume Chargeback, suporta 3 tipos de split (percentage/fixed/mixed) e validação automática de soma 100% para regras percentuais.',

    whatIsSplit: {
      definition:
        'Split divide automaticamente o valor de cada transação entre N recebedores (subcontas) com base em uma SplitRule.',
      useCase: 'Marketplaces (cliente paga R$ 100 → R$ 90 vai para o vendedor + R$ 10 para o marketplace)',
      cardinality: '1 transaction → N split entries (1 por recipient)',
    },

    threeSplitTypes: {
      percentage: 'Percentual — cada recipient recebe X% do valor total. Soma deve ser 100%',
      fixed: 'Valor Fixo — cada recipient recebe R$ Y exato. Sobra fica com a conta principal',
      mixed: 'Misto — combinação de percentual + valor fixo (ex: R$ 5 fixo de gateway + 90% do restante)',
    },

    threeFeePayerOptions: {
      marketplace: 'Marketplace paga 100% do MDR — taxa sai do recipient marketplace',
      seller: 'Seller paga — taxa sai dos recipients vendedores',
      proportional: 'Proporcional — taxa rateada conforme % de cada recipient',
    },

    threeChargebackLiableOptions: {
      marketplace: 'Marketplace assume — débito vai para conta marketplace',
      seller: 'Seller assume — débito vai para conta vendedora',
      proportional: 'Proporcional — débito rateado',
    },

    threeKPIs: {
      activeRules: 'Regras Ativas — count(rules.filter status=active) com Badge indigo',
      participatingSubs: 'Subcontas Participantes — count(subaccounts active)',
      splitVolume: 'Volume com Split — sum(rules.total_volume)',
    },

    coreCapabilities: [
      'Card de info azul indigo explicando o que é Split (educativo)',
      'Grid 3 KPIs (regras ativas / subcontas / volume)',
      'Grid 2 colunas com SplitRuleCard por regra',
      'Empty state quando rules.length === 0 com CTA "Criar Regra"',
      'Loading state com 4 skeleton cards animados',
      'Dialog 2xl com formulário completo: nome, tipo, descrição, recipients, fee_payer, chargeback_liable, default',
      'Validação inline: Total: X% (verde se =100, amarelo caso contrário)',
      'Adicionar/Remover recipients dinamicamente (mínimo 1)',
      'Switch "Regra Padrão" para fallback automático',
      'Ações por card: Editar / Excluir / Duplicar (com sufixo "(Cópia)")',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/SplitManagement.jsx',
    totalLines: 510,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.SplitRule / Subaccount',
      sharedComponents: ['PageHeader', 'SplitRuleCard (components/financial)'],
      uiComponents: [
        'Card stack', 'Button', 'Badge', 'Input', 'Label', 'Textarea', 'Switch',
        'Select stack', 'Dialog stack',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast'],
      lucideIcons: [
        'ArrowLeftRight — KPI ativas + empty state',
        'Plus — botão Nova Regra + Adicionar recipient',
        'Users — KPI subcontas',
        'Percent — importado sem uso',
        'DollarSign — KPI volume',
        'Trash2 — botão remover recipient',
        'Info — card educativo',
        'Building2 — importado sem uso',
      ],
      localUtility: { formatCurrency: 'inline' },
    },

    componentState: {
      showDialog: { initial: 'false', purpose: 'Controla abertura do Dialog de criação/edição' },
      editingRule: { initial: 'null', purpose: 'Regra sendo editada (null = criar nova)' },
      formData: {
        initial: '{ name, description, split_type:percentage, fee_payer:seller, chargeback_liable:seller, is_default:false, recipients:[{name, subaccount_id, type:percentage, value:0}] }',
        purpose: 'Estado completo do formulário do Dialog',
      },
    },

    backendIntegration: {
      queryRules: {
        queryKey: "['split-rules']",
        queryFn: 'base44.entities.SplitRule.list()',
      },
      querySubaccounts: {
        queryKey: "['subaccounts-active']",
        queryFn: "base44.entities.Subaccount.filter({ status: 'active' })",
      },
      createMutation: {
        mutationFn: 'base44.entities.SplitRule.create(data)',
        onSuccess: 'invalidate split-rules + toast "Regra de split criada com sucesso!" + handleCloseDialog',
      },
      updateMutation: {
        mutationFn: '({ id, data }) => SplitRule.update(id, data)',
        onSuccess: 'invalidate + toast "Regra atualizada!" + handleCloseDialog',
      },
      deleteMutation: {
        mutationFn: 'SplitRule.delete(id)',
        onSuccess: 'invalidate + toast "Regra excluída!"',
      },
    },

    handlers: {
      handleOpenDialog: {
        signature: '(rule = null) => void',
        editingMode: 'Se rule passada → setEditingRule(rule) + popula formData com rule.{name, description, split_type, fee_payer, chargeback_liable, is_default, recipients}',
        creatingMode: 'Se sem rule → setEditingRule(null) + reseta formData ao default',
        recipientsFallback: 'rule.recipients || [{name, subaccount_id, type:percentage, value:0}]',
      },
      handleCloseDialog: 'setShowDialog(false) + setEditingRule(null)',
      handleAddRecipient: 'append novo recipient {name, subaccount_id, type:percentage, value:0}',
      handleRemoveRecipient: '(index) => filter recipients out',
      handleRecipientChange: '(index, field, value) => map recipients with [field]=value',
      handleSubmit: {
        validation1: '!formData.name → toast.error("Nome é obrigatório")',
        validation2: 'recipients.length === 0 → toast.error("Adicione pelo menos um recebedor")',
        dataPayload: 'spread formData + status:active + rule_id (existing or `SPLIT-${Date.now()}`)',
        dispatch: 'editingRule ? updateMutation : createMutation',
      },
      cardEvents: {
        onEdit: 'handleOpenDialog(rule)',
        onDelete: 'deleteMutation.mutate(rule.id)',
        onDuplicate: 'handleOpenDialog({ ...rule, name: "{name} (Cópia)", is_default: false })',
      },
    },

    derivedState: {
      totalPercentage: 'formData.recipients.filter(type=percentage).reduce(sum value, 0) — usado para validação visual no formulário',
    },

    layout: {
      pageHeader: {
        title: '"Split de Pagamentos"',
        subtitle: '"Configure como dividir os valores das transações entre recebedores"',
        breadcrumbs: [{ label: 'Financeiro', href: 'Financial' }, { label: 'Split' }],
        actions: 'Button + Plus + "Nova Regra" → handleOpenDialog()',
      },

      infoCard: {
        wrapper: 'Card bg-indigo-50 border-indigo-200 → CardContent p-4',
        layout: 'flex items-start gap-3',
        icon: 'Info indigo-600 mt-0.5',
        title: 'font-medium indigo-900 "O que é Split de Pagamentos?"',
        body: 'text-sm indigo-700 — Split permite dividir automaticamente o valor de cada transação entre múltiplos recebedores. Ideal para marketplaces, plataformas SaaS com parceiros e franquias.',
      },

      kpiCards: {
        layout: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        cards: [
          { icon: 'ArrowLeftRight indigo-600 (bg-indigo-100)', label: 'Regras Ativas', value: 'count active rules' },
          { icon: 'Users green-600 (bg-green-100)', label: 'Subcontas Participantes', value: 'subaccounts.length' },
          { icon: 'DollarSign blue-600 (bg-blue-100)', label: 'Volume com Split', value: 'formatCurrency(sum total_volume)' },
        ],
      },

      rulesGrid: {
        loadingState: 'grid 2 cols + 4× div h-48 bg-gray-100 rounded-lg animate-pulse',
        rulesState: {
          layout: 'grid grid-cols-1 md:grid-cols-2 gap-4',
          component: 'SplitRuleCard',
          props: 'rule, onEdit, onDelete, onDuplicate',
        },
        emptyState: {
          card: 'p-12 text-center',
          icon: 'ArrowLeftRight 12x12 gray-300',
          title: 'Nenhuma regra de split criada',
          subtitle: 'Crie sua primeira regra para dividir automaticamente os pagamentos',
          cta: 'Button + Plus + "Criar Regra"',
        },
      },

      dialogForm: {
        size: 'max-w-2xl max-h-[90vh] overflow-y-auto',
        header: {
          title: 'editingRule ? "Editar Regra de Split" : "Nova Regra de Split"',
          description: 'Configure como dividir o valor das transações entre os recebedores',
        },

        basicInfo: {
          row1: {
            layout: 'grid grid-cols-2 gap-4',
            fields: [
              { label: 'Nome da Regra *', input: 'placeholder "Ex: Split Marketplace"' },
              { label: 'Tipo de Split', select: ['percentage (Percentual)', 'fixed (Valor Fixo)', 'mixed (Misto)'] },
            ],
          },
          row2: {
            field: 'Textarea Descrição rows=2 placeholder "Descreva quando esta regra deve ser usada..."',
          },
        },

        recipientsSection: {
          header: 'Label "Recebedores" + Button outline sm "Adicionar" → handleAddRecipient',
          itemRender: {
            wrapper: 'p-4 border rounded-lg space-y-3',
            topBar: '"Recebedor {index+1}" + Trash2 button (red) — só mostra se recipients.length > 1',
            row1: {
              layout: 'grid grid-cols-2 gap-3',
              fields: [
                {
                  label: 'Subconta',
                  select: 'Opções: "main" (Conta Principal) + lista de subaccounts',
                  onValueChange: 'set subaccount_id + auto-set name = sub.business_name',
                },
                { label: 'Tipo', select: ['percentage (Percentual %)', 'fixed (Valor Fixo R$)'] },
              ],
            },
            row2: {
              label: 'dinâmico: "Percentual (%)" se type=percentage, senão "Valor Fixo (R$)"',
              input: 'type=number step=0.1 (%) ou 0.01 (R$) max-w-[120px] + sufixo "%" ou "BRL"',
            },
          },
          totalValidation: {
            renderIf: 'split_type === "percentage"',
            wrapper: 'p-3 rounded-lg text-sm',
            colorLogic: 'totalPercentage === 100 → bg-green-50 text-green-700, senão bg-yellow-50 text-yellow-700',
            content: '"Total: X%" + (totalPercentage !== 100 ? "(deve somar 100%)" : "")',
          },
        },

        responsibilitiesSection: {
          layout: 'grid grid-cols-2 gap-4',
          feePayer: {
            label: 'Quem paga o MDR?',
            options: ['marketplace (Marketplace)', 'seller (Seller)', 'proportional (Proporcional)'],
          },
          chargebackLiable: {
            label: 'Quem assume Chargeback?',
            options: ['marketplace', 'seller', 'proportional'],
          },
        },

        defaultSwitch: {
          wrapper: 'flex items-center justify-between p-3 border rounded-lg',
          left: 'Label "Regra Padrão" + sub "Aplicar quando nenhuma regra específica for definida"',
          right: 'Switch checked=is_default',
        },

        footer: ['Button outline "Cancelar" → handleCloseDialog', 'Button "Salvar Alterações" ou "Criar Regra" → handleSubmit'],
      },
    },

    knownGaps: [
      'Validação 100% só visual — handleSubmit aceita totalPercentage ≠ 100 (gap crítico)',
      'split_type "mixed" não valida soma específica (sem regra para % + R$)',
      'Sem preview do resultado da divisão antes de salvar',
      'Sem teste com transação simulada (ex: "se vendessem R$ 100, cada um receberia X")',
      'Percent (lucide) e Building2 (lucide) importados sem uso',
      'Recipient com value=0 passa pela validação',
      'Sem suporte a "main" account real — só literal "main" string no select',
      'breadcrumbs.href "Financial" — possível alias quebrado',
      'Empty state CTA dispara mesmo handler do header — duplicado',
      'Edit não previne mudança de regras default (poderia ter mais de uma marcada)',
      'Sem histórico/auditoria de mudanças nas regras',
    ],

    relationshipsToOtherPages: {
      financialOverview: '/FinancialOverview — pai do módulo (Quick Link)',
      subaccountsList: '/SubaccountsList — origem das subcontas usadas como recipients',
      receivablesAgenda: '/ReceivablesAgenda — cada split gera um Receivable separado',
      financialStatement: '/FinancialStatement — entries category=split aparecem aqui',
      adminIntClientSplitDetail: '/AdminIntClientSplitDetail — visão admin interno do split',
    },
  },
};

export default SplitManagementDoc;