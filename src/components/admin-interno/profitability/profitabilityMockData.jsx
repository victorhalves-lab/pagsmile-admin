/**
 * Mock data e cálculos para a Visão de Rentabilidade.
 * Em produção, substituir pelos dados reais de Transaction, Partner, FeePlan e a calculadora de custo fixo.
 */

export function getProfitabilityData() {
  // ============ BASELINE (Realizado últimos 30d) ============
  const monthlyVolume = 13_000_000; // 13M de transações no mês
  const monthlyTPV = 850_000_000;   // R$ 850M de TPV mensal

  // Receita média por transação (de FeePlan + Antecipação + Fees fixos)
  const revenuePerTx = 0.85; // R$ 0,85/tx

  // Custo variável (de Partners ponderado pelo routing)
  const varCostPerTx = 0.42; // R$ 0,42/tx

  // Custo fixo por transação (vindo da calculadora pessoas+overhead)
  const fixCostPerTx = 0.18; // R$ 0,18/tx

  const monthlyRevenue = revenuePerTx * monthlyVolume;
  const monthlyVarCost = varCostPerTx * monthlyVolume;
  const monthlyFixCost = fixCostPerTx * monthlyVolume;

  const breakdown = {
    revenue: [
      { name: 'MDR Cartão', value: monthlyRevenue * 0.62 },
      { name: 'MDR PIX', value: monthlyRevenue * 0.18 },
      { name: 'Antecipação', value: monthlyRevenue * 0.12 },
      { name: 'Fees Fixos', value: monthlyRevenue * 0.05 },
      { name: 'Antifraude', value: monthlyRevenue * 0.03 },
    ],
    costs: [
      { name: 'Adquirentes', value: monthlyVarCost * 0.55, type: 'variable' },
      { name: 'Bandeiras', value: monthlyVarCost * 0.20, type: 'variable' },
      { name: 'Antifraude', value: monthlyVarCost * 0.10, type: 'variable' },
      { name: '3DS', value: monthlyVarCost * 0.08, type: 'variable' },
      { name: 'PIX SPI', value: monthlyVarCost * 0.07, type: 'variable' },
      { name: 'Pessoas', value: monthlyFixCost * 0.65, type: 'fixed' },
      { name: 'Infraestrutura', value: monthlyFixCost * 0.20, type: 'fixed' },
      { name: 'Overhead', value: monthlyFixCost * 0.15, type: 'fixed' },
    ],
  };

  // ============ PROJEÇÃO (Pipe + Contratado) ============
  const contractedTPV = 950_000_000;  // Subcontas ativas × TPV declarado
  const pipeTPV = 280_000_000;        // Leads em negociação (bruto)
  const weightedPipeTPV = pipeTPV * 0.45; // Ponderado por probabilidade média de fechamento (45%)
  const projectedNet90d = (monthlyRevenue - monthlyVarCost - monthlyFixCost) * 3 * 1.18; // 3 meses + 18% de crescimento

  const projectionTimeline = [
    { month: 'Mês +1', volume: monthlyTPV * 1.05, margin: (revenuePerTx - varCostPerTx - fixCostPerTx) * monthlyVolume * 1.05 },
    { month: 'Mês +2', volume: monthlyTPV * 1.12, margin: (revenuePerTx - varCostPerTx - (fixCostPerTx * 0.92)) * monthlyVolume * 1.12 },
    { month: 'Mês +3', volume: monthlyTPV * 1.20, margin: (revenuePerTx - varCostPerTx - (fixCostPerTx * 0.85)) * monthlyVolume * 1.20 },
  ];

  // ============ CLIENTES (mock) ============
  const planNames = ['Enterprise', 'Pro', 'Growth', 'Starter'];
  const methods = ['Cartão', 'PIX', 'Cartão+PIX'];
  const clients = Array.from({ length: 32 }, (_, i) => {
    const tx = Math.round(50_000 + Math.random() * 800_000);
    const planIdx = Math.floor(Math.random() * 4);
    const rev = 0.5 + Math.random() * 0.8;
    const cost = 0.25 + Math.random() * 0.35;
    const monthlyMargin = (rev - cost - fixCostPerTx) * tx;
    const monthlyRev = rev * tx;
    return {
      id: `sub_${i + 1}`,
      business_name: ['Império Suplementos', 'TechCorp Ltda', 'Beauty Store', 'Café do Povo', 'Loja Online ME', 'Mercado Express', 'Studio Fitness', 'Farmácia Central', 'Pet Shop Vida', 'Boutique Chic'][i % 10] + ' #' + (i + 1),
      plan_name: planNames[planIdx],
      mainMethod: methods[i % 3],
      monthlyTx: tx,
      revenuePerTx: rev,
      varCostPerTx: cost,
      monthlyMargin,
      marginPercent: monthlyRev > 0 ? (monthlyMargin / monthlyRev) * 100 : 0,
    };
  });

  return {
    realized: {
      revenuePerTx,
      varCostPerTx,
      fixCostPerTx,
      monthlyVolume,
      monthlyRevenue,
      monthlyVarCost,
      monthlyFixCost,
      breakdown,
    },
    projection: {
      contractedTPV,
      pipeTPV,
      weightedPipeTPV,
      currentVolume: monthlyVolume,
      projectedNet90d,
      fixCostPerTx,
      projectionTimeline,
    },
    sensitivityBaseline: {
      revenuePerTx,
      varCostPerTx,
      fixCostPerTx,
      monthlyVolume,
      monthlyFixCost,
    },
    clients,
  };
}