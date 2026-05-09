// 50+ webhook events organized by category (Stripe-grade)
export const eventCatalog = [
  {
    category: 'Transações',
    icon: '💳',
    events: [
      { id: 'transaction.approved', label: 'Transação Aprovada' },
      { id: 'transaction.declined', label: 'Transação Recusada' },
      { id: 'transaction.refunded', label: 'Transação Estornada (total)' },
      { id: 'transaction.partial_refunded', label: 'Estorno Parcial' },
      { id: 'transaction.captured', label: 'Capturada' },
      { id: 'transaction.voided', label: 'Cancelada (void)' },
      { id: 'transaction.settled', label: 'Liquidada' },
    ],
  },
  {
    category: 'Disputas & Chargebacks',
    icon: '⚖️',
    events: [
      { id: 'dispute.pre_chargeback', label: 'Pré-chargeback (Ethoca/Verifi)' },
      { id: 'chargeback.received', label: 'Chargeback Recebido' },
      { id: 'chargeback.contested', label: 'Chargeback Contestado' },
      { id: 'chargeback.won', label: 'Chargeback Vencido' },
      { id: 'chargeback.lost', label: 'Chargeback Perdido' },
      { id: 'dispute.evidence_submitted', label: 'Evidências Submetidas' },
    ],
  },
  {
    category: 'MED PIX',
    icon: '🔄',
    events: [
      { id: 'med.received', label: 'MED Recebida' },
      { id: 'med.accepted', label: 'MED Aceita' },
      { id: 'med.rejected', label: 'MED Rejeitada' },
      { id: 'med.expired', label: 'MED Expirada' },
    ],
  },
  {
    category: 'Assinaturas',
    icon: '🔁',
    events: [
      { id: 'subscription.created', label: 'Assinatura Criada' },
      { id: 'subscription.activated', label: 'Ativada' },
      { id: 'subscription.paused', label: 'Pausada' },
      { id: 'subscription.resumed', label: 'Retomada' },
      { id: 'subscription.cancelled', label: 'Cancelada' },
      { id: 'subscription.expired', label: 'Expirada' },
      { id: 'subscription.payment_succeeded', label: 'Pagamento Sucesso' },
      { id: 'subscription.payment_failed', label: 'Pagamento Falhou' },
      { id: 'subscription.payment_retried', label: 'Retry de Pagamento' },
      { id: 'subscription.plan_changed', label: 'Plano Alterado' },
    ],
  },
  {
    category: 'Pix',
    icon: '⚡',
    events: [
      { id: 'pix.received', label: 'Pix Recebido' },
      { id: 'pix.sent', label: 'Pix Enviado' },
      { id: 'pix.refunded', label: 'Pix Devolvido' },
    ],
  },
  {
    category: 'Cliente',
    icon: '👤',
    events: [
      { id: 'customer.created', label: 'Cliente Criado' },
      { id: 'customer.updated', label: 'Cliente Atualizado' },
      { id: 'customer.deleted', label: 'Cliente Removido' },
      { id: 'customer.segment_changed', label: 'Segmento Alterado' },
    ],
  },
  {
    category: 'Subcontas',
    icon: '🏪',
    events: [
      { id: 'subaccount.created', label: 'Subconta Criada' },
      { id: 'subaccount.approved', label: 'Aprovada' },
      { id: 'subaccount.suspended', label: 'Suspensa' },
      { id: 'subaccount.blocked', label: 'Bloqueada' },
    ],
  },
  {
    category: 'Saques & Antecipação',
    icon: '💰',
    events: [
      { id: 'withdrawal.requested', label: 'Saque Solicitado' },
      { id: 'withdrawal.approved', label: 'Aprovado' },
      { id: 'withdrawal.completed', label: 'Concluído' },
      { id: 'withdrawal.failed', label: 'Falhou' },
      { id: 'anticipation.requested', label: 'Antecipação Solicitada' },
      { id: 'anticipation.processed', label: 'Antecipação Processada' },
    ],
  },
  {
    category: 'Antifraude & KYC',
    icon: '🛡️',
    events: [
      { id: 'fraud.flagged', label: 'Transação Sinalizada' },
      { id: 'fraud.blocked', label: 'Transação Bloqueada' },
      { id: 'identity.kyc_started', label: 'KYC Iniciado' },
      { id: 'identity.kyc_approved', label: 'KYC Aprovado' },
      { id: 'identity.kyc_failed', label: 'KYC Falhou' },
    ],
  },
];

export const flatEvents = eventCatalog.flatMap((c) => c.events);

// LEGACY events - kept for compatibility with existing webhook drawer
export const legacyEvents = [
  { id: 'transaction.approved', label: 'Transação Aprovada' },
  { id: 'transaction.declined', label: 'Transação Recusada' },
  { id: 'transaction.refunded', label: 'Transação Estornada' },
  { id: 'chargeback.received', label: 'Chargeback Recebido' },
  { id: 'chargeback.won', label: 'Chargeback Vencido' },
  { id: 'chargeback.lost', label: 'Chargeback Perdido' },
  { id: 'subscription.created', label: 'Assinatura Criada' },
  { id: 'subscription.cancelled', label: 'Assinatura Cancelada' },
  { id: 'subscription.payment_failed', label: 'Pagamento de Assinatura Falhou' },
  { id: 'pix.received', label: 'Pix Recebido' },
  { id: 'withdrawal.completed', label: 'Saque Concluído' },
];