import { registerActionHandler } from './actionRegistry';
import { toast } from 'sonner';

/**
 * Registro central dos 8 handlers undo-able do admin.
 *
 * Cada handler é a "ação real" que persiste no backend após o
 * undo window de 60s expirar (ou após o usuário clicar "Confirmar agora").
 *
 * Como o backend real ainda não existe, cada onConfirm hoje é um mock
 * com delay de 600ms. Para conectar a um endpoint real, basta substituir
 * o corpo do onConfirm pela chamada SDK/fetch correspondente.
 *
 * onUndo é geralmente no-op — durante o undo window a ação AINDA NÃO foi
 * persistida, então "desfazer" significa apenas descartar a intenção.
 *
 * Chamar `registerAllActionHandlers()` uma única vez no startup (App.jsx).
 */

function mockApiCall(label, payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.info(`[mock-api] ${label}`, payload);
      resolve({ success: true });
    }, 600);
  });
}

export function registerAllActionHandlers() {
  // ── 1. Bloqueio de Merchant
  registerActionHandler('merchant.block', {
    onConfirm: async ({ entityId, payload }) => {
      await mockApiCall(`POST /merchants/${entityId}/block`, payload);
      toast.success('Merchant bloqueado com sucesso');
    },
    onUndo: async () => { toast.info('Bloqueio cancelado · merchant continua ativo'); },
  });

  // ── 2. Desbloqueio de Merchant
  registerActionHandler('merchant.unblock', {
    onConfirm: async ({ entityId, payload }) => {
      await mockApiCall(`POST /merchants/${entityId}/unblock`, payload);
      toast.success('Merchant desbloqueado com sucesso');
    },
    onUndo: async () => { toast.info('Desbloqueio cancelado'); },
  });

  // ── 3. Suspensão de Merchant
  registerActionHandler('merchant.suspend', {
    onConfirm: async ({ entityId, payload }) => {
      await mockApiCall(`POST /merchants/${entityId}/suspend`, payload);
      toast.success('Merchant suspenso com sucesso');
    },
    onUndo: async () => { toast.info('Suspensão cancelada'); },
  });

  // ── 4. Cancelamento de Subseller
  registerActionHandler('subseller.cancel', {
    onConfirm: async ({ entityId, payload }) => {
      await mockApiCall(`POST /subsellers/${entityId}/cancel`, payload);
      toast.success('Subseller cancelado');
    },
    onUndo: async () => { toast.info('Cancelamento descartado'); },
  });

  // ── 5. Alteração de Plano de Taxa em Massa
  registerActionHandler('fee_plan.bulk_change', {
    onConfirm: async ({ payload }) => {
      await mockApiCall('POST /fee-plans/bulk-apply', payload);
      const n = payload?.merchant_ids?.length || 0;
      toast.success(`Plano aplicado a ${n} merchant(s)`);
    },
    onUndo: async () => { toast.info('Alteração de plano cancelada'); },
  });

  // ── 6. Ajuste Manual Financeiro
  registerActionHandler('manual_adjustment.apply', {
    onConfirm: async ({ payload }) => {
      await mockApiCall('POST /financial/adjustments', payload);
      toast.success('Ajuste manual aplicado');
    },
    onUndo: async () => { toast.info('Ajuste descartado · saldo intacto'); },
  });

  // ── 7. Rejeição de Saque
  registerActionHandler('withdrawal.reject', {
    onConfirm: async ({ entityId, payload }) => {
      await mockApiCall(`POST /withdrawals/${entityId}/reject`, payload);
      toast.success('Saque rejeitado · valor devolvido ao saldo');
    },
    onUndo: async () => { toast.info('Rejeição cancelada · saque continua pendente'); },
  });

  // ── 8. Cancelamento de Antecipação
  registerActionHandler('anticipation.cancel', {
    onConfirm: async ({ entityId, payload }) => {
      await mockApiCall(`POST /anticipations/${entityId}/cancel`, payload);
      toast.success('Antecipação cancelada');
    },
    onUndo: async () => { toast.info('Cancelamento descartado'); },
  });
}