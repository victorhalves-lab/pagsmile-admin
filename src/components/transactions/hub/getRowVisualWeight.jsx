/**
 * Peso visual adaptativo nas linhas — baixo esforço, alto impacto.
 * Recusa = fundo avermelhado | Suspeita = borda laranja | VIP = anel verde
 * Chargeback = fundo vermelho mais forte
 */
export function getRowVisualWeight(row) {
  if (!row) return '';

  if (row.status === 'chargeback' || row.has_chargeback) {
    return 'bg-red-50/60 dark:bg-red-900/10 hover:bg-red-100/80 dark:hover:bg-red-900/20 border-l-2 border-l-red-500';
  }
  if (row.status === 'refused' || row.status === 'declined') {
    return 'bg-red-50/30 dark:bg-red-900/5 hover:bg-red-50/60 dark:hover:bg-red-900/10';
  }
  if (row.risk_score && row.risk_score >= 70) {
    return 'border-l-2 border-l-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-900/10';
  }
  if (row.customer_segment === 'vip' || row.is_vip) {
    return 'border-l-2 border-l-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10';
  }
  if (row.amount && row.amount >= 5000) {
    return 'font-medium hover:bg-blue-50/30 dark:hover:bg-blue-900/10';
  }
  return '';
}