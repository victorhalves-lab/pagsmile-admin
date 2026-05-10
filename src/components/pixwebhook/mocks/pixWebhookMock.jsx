// Mock data for PIX Webhook Replay (Mentor API ORIGEM 201)

export const PIX_WEBHOOK_KPIS = {
  total_sent_24h: 28_421,
  success_rate: 99.4,
  avg_response_time_ms: 187,
  manual_replays_24h: 47,
  failed_pending: 23,
  unique_destinations: 412,
  regulatory_breaches: 2,
  bcb_compliance_score: 99.7,
};

export const PIX_RESOURCES = {
  pix_payment_in: { label: 'PIX Recebido (entrada)', color: 'bg-emerald-100 text-emerald-700' },
  pix_payment_out: { label: 'PIX Enviado (saída)', color: 'bg-blue-100 text-blue-700' },
  pix_refund: { label: 'Estorno PIX', color: 'bg-amber-100 text-amber-700' },
  pix_devolution: { label: 'Devolução BCB', color: 'bg-purple-100 text-purple-700' },
};

export const PIX_OPERATIONS = ['created', 'updated', 'completed', 'failed'];

const merchants = [
  { id: 'mer_001', name: 'Loja do Pedro', webhook_url: 'https://pedro.com.br/webhooks/pix' },
  { id: 'mer_002', name: 'TechShop SP', webhook_url: 'https://api.techshop.com/pix-events' },
  { id: 'mer_003', name: 'Marketplace Ace', webhook_url: 'https://hooks.marketplaceace.io/pagsmile' },
  { id: 'mer_004', name: 'Restaurante Bom Sabor', webhook_url: 'https://bomsabor.app/notify' },
];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export const PIX_WEBHOOK_LOGS = Array.from({ length: 25 }, (_, i) => {
  const merchant = pickRandom(merchants);
  const resource = pickRandom(Object.keys(PIX_RESOURCES));
  const operation = pickRandom(PIX_OPERATIONS);
  const success = Math.random() < 0.92;
  const isManualReplay = Math.random() < 0.3;
  return {
    id: `whk_${String(900000 + i).padStart(7, '0')}`,
    pix_event_id: `pix_${String(8000000 + i).padStart(8, '0')}`,
    merchant,
    resource,
    operation,
    status: success ? 'success' : (Math.random() < 0.5 ? 'failed_5xx' : 'failed_timeout'),
    http_status: success ? 200 : (Math.random() < 0.3 ? 408 : 503),
    response_time_ms: success ? 50 + Math.random() * 400 : 30000,
    sent_at: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    is_manual_replay: isManualReplay,
    operator: isManualReplay ? 'ana.souza@pagsmile.com' : null,
    justification: isManualReplay ? 'Reenvio após indisponibilidade reportada pelo lojista' : null,
    attempts: success ? 1 : Math.floor(Math.random() * 4) + 1,
    bcb_window_breached: !success && Math.random() < 0.1,
  };
});

export const PIX_PROBLEMATIC_DESTINATIONS = [
  { merchant: merchants[1], failure_rate: 12.4, total_events: 487, recommendation: 'URL retornando 503 — investigar capacidade do servidor' },
  { merchant: merchants[2], failure_rate: 8.2, total_events: 312, recommendation: 'Tempo de resposta médio 4.2s — sugerir processamento assíncrono' },
  { merchant: merchants[3], failure_rate: 5.7, total_events: 198, recommendation: 'DNS instável intermitente — escalar para Customer Success' },
];

export const PIX_REPLAY_PATTERNS = [
  { pattern: 'Janela 22h-04h tem 78% das falhas', severity: 'high', suggestion: 'Provável manutenção dos sistemas dos lojistas' },
  { pattern: 'TechShop SP teve 50 reenvios em 30 dias', severity: 'critical', suggestion: 'Investigar URL ou sistema do destinatário' },
  { pattern: 'Operador X fez 28 reenvios sem justificativa robusta', severity: 'medium', suggestion: 'Auditar comportamento do operador' },
];