/**
 * DIA COPILOT - Mapa de Geração de Valor por Seção
 * 
 * Este arquivo documenta como o DIA Copilot gera valor em cada área da aplicação,
 * incluindo os tipos de insights, métricas monitoradas e ações sugeridas.
 */

export const COPILOT_VALUE_MAP = {
  // ==========================================
  // DASHBOARD
  // ==========================================
  dashboard: {
    section: 'Dashboard',
    description: 'Visão geral da saúde do negócio',
    valueProposition: 'Alertas proativos e tendências que impactam o resultado',
    insightTypes: [
      {
        type: 'health_alert',
        title: 'Alerta de Saúde do Negócio',
        example: 'Seu volume de vendas aumentou 15%, mas o lucro caiu 2%. Identifiquei devoluções e taxas de PIX como fatores principais.',
        metrics: ['volume_change', 'profit_margin', 'refund_rate'],
        action: 'Ver análise detalhada'
      },
      {
        type: 'daily_summary',
        title: 'Resumo do Dia',
        example: 'Hoje você processou R$45.000 em 234 transações. Taxa de aprovação de 94.2% (+1.5% vs média).',
        metrics: ['daily_volume', 'transaction_count', 'approval_rate'],
        action: 'Ver transações'
      },
      {
        type: 'opportunity',
        title: 'Oportunidade Identificada',
        example: 'Você tem R$15.000 disponíveis para antecipação com taxa de 1.8%.',
        metrics: ['anticipatable_amount', 'anticipation_rate'],
        action: 'Simular antecipação'
      }
    ]
  },

  // ==========================================
  // TRANSAÇÕES
  // ==========================================
  transactions: {
    section: 'Transações',
    description: 'Monitoramento de pagamentos',
    valueProposition: 'Identificar anomalias, otimizar aprovação e reduzir fraudes',
    subsections: {
      all: {
        insightTypes: [
          {
            type: 'pending_alert',
            title: 'Transações Pendentes',
            example: '10% das suas transações estão pendentes há mais de 24h, impactando R$12.000 no fluxo de caixa.',
            metrics: ['pending_count', 'pending_amount', 'avg_pending_time'],
            action: 'Ver pendentes'
          },
          {
            type: 'peak_detection',
            title: 'Pico de Vendas Detectado',
            example: 'Volume 45% acima da média nas últimas 2 horas. Monitore a capacidade de processamento.',
            metrics: ['hourly_volume', 'avg_hourly_volume'],
            action: 'Ver detalhes'
          }
        ]
      },
      card: {
        insightTypes: [
          {
            type: 'approval_optimization',
            title: 'Otimização de Aprovação',
            example: 'A bandeira Elo tem taxa de aprovação 8% menor que as outras. Recomendo revisar limites de antifraude.',
            metrics: ['brand_approval_rates', 'decline_reasons'],
            action: 'Ver análise de recusas'
          },
          {
            type: 'bin_performance',
            title: 'Performance por BIN',
            example: 'Os BINs 456789 e 523456 representam 60% das recusas por fraude. Considere regras específicas.',
            metrics: ['bin_approval_rate', 'bin_fraud_rate'],
            action: 'Configurar regras'
          }
        ]
      },
      pix: {
        insightTypes: [
          {
            type: 'expiration_alert',
            title: 'PIX Expirando',
            example: '23 cobranças PIX vão expirar nas próximas 2 horas, totalizando R$4.500.',
            metrics: ['expiring_count', 'expiring_amount'],
            action: 'Enviar lembretes'
          },
          {
            type: 'conversion_tip',
            title: 'Dica de Conversão',
            example: 'Sua taxa de conversão PIX é 78%. Clientes que recebem lembrete convertem 15% mais.',
            metrics: ['pix_conversion_rate', 'reminder_impact'],
            action: 'Ativar lembretes automáticos'
          }
        ]
      },
      declineAnalysis: {
        insightTypes: [
          {
            type: 'decline_pattern',
            title: 'Padrão de Recusa',
            example: 'Recusas por "Saldo Insuficiente" aumentaram 30% esta semana. Considere oferecer parcelamento.',
            metrics: ['decline_reasons', 'decline_trend'],
            action: 'Ver estratégias de recuperação'
          },
          {
            type: 'issuer_issue',
            title: 'Problema com Emissor',
            example: 'O banco Itaú está com taxa de recusa 40% acima do normal nas últimas 3 horas.',
            metrics: ['issuer_approval_rates', 'issuer_anomalies'],
            action: 'Monitorar'
          }
        ]
      }
    }
  },

  // ==========================================
  // CHECKOUT
  // ==========================================
  checkout: {
    section: 'Checkout',
    description: 'Otimização da conversão',
    valueProposition: 'Maximizar vendas através de experiência otimizada',
    subsections: {
      builder: {
        insightTypes: [
          {
            type: 'ab_suggestion',
            title: 'Sugestão de Teste A/B',
            example: 'Checkouts com campo de cupom visível têm 12% mais abandono. Recomendo esconder em um dropdown.',
            action: 'Criar teste A/B'
          },
          {
            type: 'mobile_optimization',
            title: 'Otimização Mobile',
            example: '68% dos seus clientes compram pelo celular, mas a conversão mobile é 15% menor. Otimize o layout.',
            metrics: ['mobile_traffic', 'mobile_conversion'],
            action: 'Ver sugestões'
          }
        ]
      },
      converterAgent: {
        insightTypes: [
          {
            type: 'recovery_opportunity',
            title: 'Oportunidade de Recuperação',
            example: 'O Converter Agent recuperou R$8.500 esta semana. 45 carrinhos ainda podem ser recuperados.',
            metrics: ['recovered_amount', 'pending_carts'],
            action: 'Ver carrinhos abandonados'
          }
        ]
      }
    }
  },

  // ==========================================
  // ASSINATURAS
  // ==========================================
  subscriptions: {
    section: 'Assinaturas',
    description: 'Gestão de recorrência',
    valueProposition: 'Reduzir churn e maximizar LTV',
    insightTypes: [
      {
        type: 'churn_prediction',
        title: 'Previsão de Churn',
        example: '15 assinantes têm alta probabilidade de cancelar nos próximos 30 dias. Intervenção pode reter R$2.400/mês.',
        metrics: ['churn_risk_count', 'at_risk_mrr'],
        action: 'Ver assinantes em risco'
      },
      {
        type: 'payment_failure',
        title: 'Falhas de Cobrança',
        example: '8 cobranças falharam por cartão expirado. Notifique os clientes para atualizar os dados.',
        metrics: ['failed_payments', 'failure_reasons'],
        action: 'Iniciar dunning'
      },
      {
        type: 'upgrade_opportunity',
        title: 'Oportunidade de Upgrade',
        example: '23 assinantes do plano Basic têm perfil para o Premium baseado no uso. Potencial de +R$1.150/mês.',
        metrics: ['upgrade_candidates', 'potential_mrr_increase'],
        action: 'Criar campanha de upgrade'
      }
    ]
  },

  // ==========================================
  // DISPUTAS
  // ==========================================
  disputes: {
    section: 'Disputas',
    description: 'Gestão de chargebacks',
    valueProposition: 'Proteger receita e evitar programas de monitoramento',
    subsections: {
      dashboard: {
        insightTypes: [
          {
            type: 'compliance_alert',
            title: 'Alerta de Compliance',
            example: 'Sua taxa de chargeback Visa está em 0.85% (limite: 0.9%). Ação preventiva recomendada.',
            metrics: ['chargeback_ratio', 'fraud_ratio', 'threshold_distance'],
            action: 'Ver plano de ação'
          },
          {
            type: 'trend_alert',
            title: 'Tendência de Disputas',
            example: 'Disputas de "Produto Não Recebido" aumentaram 200%. Revise o processo de entrega.',
            metrics: ['dispute_trend', 'dispute_reasons'],
            action: 'Analisar causas'
          }
        ]
      },
      preChargebacks: {
        insightTypes: [
          {
            type: 'urgent_action',
            title: 'Ação Urgente',
            example: '5 alertas Ethoca vencem em 24h. Reembolso proativo pode evitar R$2.300 em chargebacks.',
            metrics: ['expiring_alerts', 'potential_savings'],
            action: 'Processar alertas'
          },
          {
            type: 'auto_action_report',
            title: 'Ações Automáticas',
            example: 'O agente processou 12 alertas automaticamente, prevenindo R$4.800 em chargebacks.',
            metrics: ['auto_processed', 'prevented_amount'],
            action: 'Ver detalhes'
          }
        ]
      },
      chargebacks: {
        insightTypes: [
          {
            type: 'contestation_priority',
            title: 'Prioridade de Contestação',
            example: '3 chargebacks têm prazo em 5 dias e probabilidade de ganho >70%. Priorize a contestação.',
            metrics: ['urgent_disputes', 'win_probability'],
            action: 'Contestar agora'
          },
          {
            type: 'win_rate_insight',
            title: 'Taxa de Sucesso',
            example: 'Sua taxa de ganho em "Fraude" é 65%, acima da média do mercado (52%).',
            metrics: ['win_rate_by_reason', 'market_benchmark'],
            action: 'Ver estratégias vencedoras'
          }
        ]
      }
    }
  },

  // ==========================================
  // FINANCEIRO
  // ==========================================
  financial: {
    section: 'Financeiro',
    description: 'Gestão de caixa e recebíveis',
    valueProposition: 'Otimizar fluxo de caixa e reduzir custos',
    subsections: {
      overview: {
        insightTypes: [
          {
            type: 'cashflow_alert',
            title: 'Alerta de Fluxo de Caixa',
            example: 'Seu fluxo projetado indica lacuna de R$15.000 na próxima semana. Considere antecipar recebíveis.',
            metrics: ['projected_balance', 'upcoming_expenses'],
            action: 'Simular antecipação'
          },
          {
            type: 'balance_optimization',
            title: 'Otimização de Saldo',
            example: 'Você tem R$45.000 parado há 5 dias. Configure saques automáticos para otimizar rendimentos.',
            metrics: ['idle_balance', 'idle_days'],
            action: 'Configurar auto-saque'
          }
        ]
      },
      fees: {
        insightTypes: [
          {
            type: 'fee_alert',
            title: 'Alerta de Tarifas',
            example: 'Sua taxa média de PIX está 0.05% acima do mercado. Isso representa R$150/mês a mais.',
            metrics: ['avg_fee', 'market_benchmark', 'excess_cost'],
            action: 'Ver pontos de negociação'
          },
          {
            type: 'cost_optimization',
            title: 'Oportunidade de Economia',
            example: 'Aumentando o PIX de 30% para 45% das vendas, você economizaria R$800/mês em tarifas.',
            metrics: ['pix_percentage', 'potential_savings'],
            action: 'Simular cenário'
          },
          {
            type: 'fee_trend',
            title: 'Tendência de Custos',
            example: 'Seu custo de tarifas caiu 0.13% nas últimas 4 semanas. Continue incentivando PIX!',
            metrics: ['fee_percentage_trend'],
            action: 'Ver evolução'
          }
        ]
      },
      receivables: {
        insightTypes: [
          {
            type: 'anticipation_opportunity',
            title: 'Oportunidade de Antecipação',
            example: 'R$38.500 antecipáveis com taxa de 1.8%. Se precisar de liquidez, essa é uma boa opção.',
            metrics: ['anticipatable_amount', 'anticipation_rate'],
            action: 'Simular'
          }
        ]
      },
      anticipation: {
        insightTypes: [
          {
            type: 'smart_anticipation',
            title: 'Antecipação Inteligente',
            example: 'Antecipar apenas parcelas D+30 ou mais reduz seu custo médio de antecipação em 0.3%.',
            metrics: ['optimal_days', 'cost_reduction'],
            action: 'Configurar regra'
          }
        ]
      },
      split: {
        insightTypes: [
          {
            type: 'split_performance',
            title: 'Performance de Split',
            example: 'A subconta "Loja Centro" está com margem 2% menor que as outras. Revise as taxas aplicadas.',
            metrics: ['subaccount_margins'],
            action: 'Ver subconta'
          }
        ]
      }
    }
  },

  // ==========================================
  // CLIENTES
  // ==========================================
  customers: {
    section: 'Clientes',
    description: 'Gestão de relacionamento',
    valueProposition: 'Reter clientes e aumentar lifetime value',
    insightTypes: [
      {
        type: 'churn_risk',
        title: 'Clientes em Risco',
        example: '50 clientes VIP não compram há 30+ dias. Campanhas de reativação podem gerar R$12.000.',
        metrics: ['at_risk_vips', 'potential_revenue'],
        action: 'Criar campanha'
      },
      {
        type: 'high_value_alert',
        title: 'Cliente de Alto Valor',
        example: 'João Silva realizou 5 compras este mês (+300%). Considere oferecer programa de fidelidade.',
        metrics: ['purchase_frequency', 'customer_growth'],
        action: 'Ver perfil'
      },
      {
        type: 'segment_opportunity',
        title: 'Oportunidade por Segmento',
        example: 'Clientes do segmento "Recorrente" têm ticket médio 40% maior. Foque em migrar novos clientes.',
        metrics: ['segment_performance'],
        action: 'Ver segmentos'
      }
    ]
  },

  // ==========================================
  // SUBCONTAS
  // ==========================================
  subaccounts: {
    section: 'Subcontas',
    description: 'Gestão de marketplace/multi-lojas',
    valueProposition: 'Monitorar performance e risco das subcontas',
    insightTypes: [
      {
        type: 'risk_alert',
        title: 'Alerta de Risco',
        example: 'Subconta "Loja Y" tem risco de fraude 30% maior que a média. Recomendo revisão das últimas transações.',
        metrics: ['fraud_risk_score', 'benchmark'],
        action: 'Analisar subconta'
      },
      {
        type: 'performance_comparison',
        title: 'Comparativo de Performance',
        example: 'Subconta "Loja A" tem margem 15% menor devido a maior volume de parcelamento. Ajuste as taxas.',
        metrics: ['margin_comparison', 'volume_breakdown'],
        action: 'Ver comparativo'
      },
      {
        type: 'onboarding_status',
        title: 'Status de Onboarding',
        example: '3 subcontas estão com documentação pendente há mais de 7 dias. Envie lembretes.',
        metrics: ['pending_onboardings', 'days_pending'],
        action: 'Gerenciar onboardings'
      }
    ]
  },

  // ==========================================
  // SAQUES
  // ==========================================
  withdrawals: {
    section: 'Saques',
    description: 'Gestão de transferências',
    valueProposition: 'Otimizar timing e custos de saque',
    insightTypes: [
      {
        type: 'optimal_timing',
        title: 'Momento Ideal de Saque',
        example: 'Sacar às sextas tem 0.5% menos taxa devido ao menor volume. Considere agendar saques automáticos.',
        metrics: ['fee_by_day', 'optimal_day'],
        action: 'Configurar auto-saque'
      },
      {
        type: 'failed_withdrawal',
        title: 'Saque Falhou',
        example: '1 saque de R$5.000 falhou por dados bancários inválidos. Atualize os dados da conta.',
        metrics: ['failed_amount', 'failure_reason'],
        action: 'Corrigir dados'
      }
    ]
  }
};

/**
 * Função para obter insights relevantes para uma seção
 */
export function getInsightsForSection(section, subsection = null) {
  const sectionConfig = COPILOT_VALUE_MAP[section];
  if (!sectionConfig) return [];
  
  if (subsection && sectionConfig.subsections) {
    return sectionConfig.subsections[subsection]?.insightTypes || [];
  }
  
  return sectionConfig.insightTypes || [];
}

/**
 * Função para obter a proposta de valor de uma seção
 */
export function getValueProposition(section) {
  return COPILOT_VALUE_MAP[section]?.valueProposition || '';
}

export default COPILOT_VALUE_MAP;