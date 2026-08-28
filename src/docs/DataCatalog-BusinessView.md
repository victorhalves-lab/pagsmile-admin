# Catálogo de Dados — Visão Business (Lista vs. Detalhe + Micro-dados + Regras de Negócio)

> **Fonte única de verdade** para todos os dados da plataforma PagSmile Admin.
> Cada campo está anotado com: **(a)** Nome de exibição na UI · **(b)** Origem (entity field path, mock, ou calculado com fórmula) · **(c)** Componente onde aparece.
> Separação explícita entre **ADMIN SUB** (cliente/merchant) e **ADMIN INTERNO** (PagSmile).

---

## Índice

1. [Dashboard Executivo](#1-dashboard-executivo)
2. [Transações — Nível Lista](#2-transações--nível-lista)
3. [Transações — Nível Detalhe](#3-transações--nível-detalhe)
4. [Links de Pagamento](#4-links-de-pagamento)
5. [Recusas](#5-recusas)
6. [Estornos](#6-estornos)
7. [Disputas / Chargebacks / MEDs / Pré-Chargebacks](#7-disputas--chargebacks--meds--pré-chargebacks)
8. [Recebíveis](#8-recebíveis)
9. [Antecipação](#9-antecipação)
10. [Taxas e Tarifas](#10-taxas-e-tarifas)
11. [Extrato Financeiro](#11-extrato-financeiro)
12. [Saques](#12-saques)
13. [Liquidações](#13-liquidações)
14. [Apêndice A — Dimensões Transversais](#apêndice-a--dimensões-transversais)
15. [Apêndice B — Métricas Derivadas](#apêndice-b--métricas-derivadas)
16. [Apêndice C — Variantes por Contexto (Admin Sub vs. Admin Interno)](#apêndice-c--variantes-por-contexto)

---

## 1. Dashboard Executivo

> **Componentes:** `Dashboard.jsx` · `BalanceCard` · `GMVCardConsolidated` · `PerformanceIndicatorsActionable` · `TransactionMetricsCards` · `ForecastRow` · `IntradayProjection` · `FinancialRiskCard` · `GoalsProgressCard` · `AISuggestionsCard` · `RecoveryRevenueCard` · `TopRevenueLevers` · `MoneyFlowCard` · `ChannelBreakdownCard` · `CheckoutFunnelCard` · `AcquirerPerformanceCard` · `CriticalAlertsBanner` · `AlertsPanelEnhanced` · tabs: `ConversionMetricsCards` · `PaymentMethodsChart` · `ApprovalRateChart` · `ComparativeMetrics` · `CardPerformanceFull` · `PixPerformanceFull` · `PixUpliftCard` · `PixFlowCards` · `AdvancedAnalyticsFull`

### NÍVEL LISTA (KPIs do Hero)

#### Zona 1 — Dinheiro Agora (`BalanceCard`)
| Campo UI | Origem | Regra de Cálculo |
|---|---|---|
| Saldo Disponível | Mock (`available={125430.5}`) | Hard-coded no componente |
| Pendente (A Liberar) | Mock (`pending={212880.0}`) | Hard-coded |
| Bloqueado | Mock (`blocked={2500.0}`) | Hard-coded |

#### Zona 1 — Antecipação (`AnticipationContextCard`)
| Campo UI | Origem | Regra |
|---|---|---|
| Recebível disponível | Mock (`receivableAmount={212880}`) | Hard-coded |
| Taxa antecipação % | Mock (`feePercentage={1.99}`) | Hard-coded |

#### Zona 1 — Recebíveis (`ReceivablesBreakdown`)
| Campo UI | Origem | Regra |
|---|---|---|
| Buckets D+0/D+1/D+7/D+15/D+30 | Calculado de `Transaction.expected_settle_date` | Agrupamento por `differenceInDays(settle_date, today)` |

#### Zona 2 — GMV (`GMVCardConsolidated`)
| Campo UI | Origem | Regra |
|---|---|---|
| GMV Hoje | Calculado | `approvedTx.reduce(sum, amount) * 0.15` |
| GMV Ontem | Calculado | `totalGMV * 0.14` |
| GMV 7 dias | Calculado | `approvedTx.reduce(sum, amount)` |
| GMV Mês atual | Calculado | `totalGMV * 2.5` |
| Projeção mês | Calculado | `totalGMV * 4.2` |
| % Change | Mock | Hard-coded (12.5%, -2.3%, 8.7%, 15.2%, 5.1%) |
| Month progress % | Mock | `60` |
| Hoje: Cartão / PIX | Calculado | `totalGMV * 0.10` / `totalGMV * 0.05` |
| **Query base** | `base44.entities.Transaction.list('-created_date', 200)` | Filtra `status === 'approved'` |

#### Zona 4 — Performance (`PerformanceIndicatorsActionable` + `TransactionMetricsCards`)
| Campo UI | Origem | Regra |
|---|---|---|
| Taxa de Aprovação | Calculado de `transactions` | `approved / total * 100` |
| Taxa de Recusa | Calculado | `refused / total * 100` |
| Ticket Médio | Calculado | `sum(amount) / count` onde `status=approved` |
| Volume Cartão | Calculado | `sum(amount)` onde `method=credit_card/debit_card` |
| Volume PIX | Calculado | `sum(amount)` onde `method=pix` |
| Transações/dia | Calculado | `count / dias_no_periodo` |

#### Zona 5 — Forecast (`ForecastRow` + `IntradayProjection`)
| Campo UI | Origem | Regra |
|---|---|---|
| Projeção intraday | Mock | Hard-coded no componente |
| Forecast 7/30 dias | Mock | Hard-coded |

#### Zona 5 — Risco Financeiro (`FinancialRiskCard`)
| Campo UI | Origem | Regra |
|---|---|---|
| Chargeback ratio | Mock | Hard-coded |
| MED ratio | Mock | Hard-coded |
| Reserva bloqueada | Mock | Hard-coded |

#### Zona 5 — Metas (`GoalsProgressCard`)
| Campo UI | Origem | Regra |
|---|---|---|
| Meta de GMV | Mock | Hard-coded |
| % Progresso | Mock | Hard-coded |

#### Zona 6 — IA (`AISuggestionsCard` + `RecoveryRevenueCard`)
| Campo UI | Origem | Regra |
|---|---|---|
| Sugestões IA | Mock | Hard-coded |
| Receita recuperável | Mock | Hard-coded |

#### Zona 7 — Fluxo (`MoneyFlowCard` + `ChannelBreakdownCard` + `CheckoutFunnelCard`)
| Campo UI | Origem | Regra |
|---|---|---|
| Waterfall entradas/saídas | Mock | Hard-coded |
| Breakdown por canal | Mock | Hard-coded |
| Funil: visita→carrinho→checkout→pagamento | Mock | Hard-coded |

#### Zona 8 — Adquirentes (`AcquirerPerformanceCard`)
| Campo UI | Origem | Regra |
|---|---|---|
| Performance por adquirente | Mock | Hard-coded (Cielo, Stone, Rede, Getnet) |

#### Zona 0 — Alertas (`CriticalAlertsBanner` + `AlertsPanelEnhanced`)
| Campo UI | Origem | Regra |
|---|---|---|
| Alertas críticos | Mock | Hard-coded |
| Alertas com snooze | Mock | Hard-coded |

### NÍVEL DETALHE (Tabs Analíticas)

#### Tab: Executive (`ConversionMetricsCards` + `PaymentMethodsChart` + `ApprovalRateChart` + `ComparativeMetrics`)
| Campo UI | Origem | Regra |
|---|---|---|
| Conversão checkout | Mock | Hard-coded |
| Distribuição por meio | Calculado de `transactions` | `sum(amount)` agrupado por `method` |
| Aprovação por bandeira | Calculado de `transactions` | `approved / total` agrupado por `card.brand` |
| Meta de aprovação | Mock | `85%` (hard-coded) |
| Comparativo período | Calculado de `transactions` | Período atual vs. anterior |

#### Tab: Card Performance (`CardPerformanceFull`)
| Campo UI | Origem | Regra |
|---|---|---|
| Aprovação por bandeira | Calculado de `transactions` | Agrupado por `card.brand` |
| Aprovação por adquirente | Calculado | Agrupado por `acquirer_data.name` |
| Aprovação por BIN | Calculado | Agrupado por `card.first6` |
| Aprovação por parcelamento | Calculado | Agrupado por `installments` |
| Declines por motivo | Calculado | Agrupado por `refusal_reason` onde `status=refused` |

#### Tab: PIX Performance (`PixUpliftCard` + `PixFlowCards` + `PixPerformanceFull`)
| Campo UI | Origem | Regra |
|---|---|---|
| PIX Uplift (antes/depois) | Mock | Hard-coded |
| Volume por fluxo (manual/automatic/biometric/scheduled) | Calculado de `transactions` | Agrupado por `pix_flow` |
| Jornada média (ms) | Calculado de `transactions` | `avg(pix_journey_ms)` |
| Consentimento status | Calculado | Agrupado por `pix_consent_status` |

#### Tab: Advanced Analytics (`AdvancedAnalyticsFull`)
| Campo UI | Origem | Regra |
|---|---|---|
| Cohort analysis | Mock | Hard-coded |
| Heatmap por hora/dia | Calculado de `transactions` | Agrupado por `created_date` (hora/dia) |

---

## 2. Transações — Nível Lista

> **Componente principal:** `TransactionDataTable.jsx`
> **Contextos:** `viewContext="merchant"` (Admin Sub) · `viewContext="internal"` (Admin Interno) · default (sem contexto)
> **Modos:** `viewMode="all"` (DEFAULT) · `viewMode="card"` (CARD) · `viewMode="pix"` (PIX)

### Configuração de Colunas — DEFAULT (Todas)

| Coluna | Key | Visível por padrão | Sortable | Origem | Componente |
|---|---|---|---|---|---|
| ID | `transaction_id` | ✅ | ✅ | `Transaction.transaction_id` | `TransactionDataTable` → `renderCell('transaction_id')` |
| Vendedor | `merchant` | ✅ (oculto se merchant) | ✅ | `Transaction.merchant_name` / `subaccount_name` | `renderCell('merchant')` |
| Comprador | `customer` | ✅ | ✅ | `Transaction.customer.name` / `customer_name` | `renderCell('customer')` |
| Pagamento | `payment_block` | ✅ | ❌ | Agregado (ver abaixo) | `renderCell('payment_block')` |
| Datas | `dates_block` | ✅ | ❌ | Agregado (ver `DatesCell`) | `renderCell('dates_block')` |
| Valores | `values_block` | ✅ | ❌ | Agregado (ver `ValuesCell*`) | `renderCell('values_block')` |
| Comissões e Taxas | `fees_block` | ✅ | ❌ | Agregado (ver `FeesCell*`) | `renderCell('fees_block')` |
| Data/Hora | `created_date` | ❌ | ✅ | `Transaction.created_date` | `renderCell('created_date')` |
| Método | `type` | ❌ | ✅ | `Transaction.method` / `type` | `renderCell('type')` |
| Valor | `amount` | ❌ | ✅ | `Transaction.amount` | `renderCell('amount')` |
| Status | `status` | ❌ | ✅ | `Transaction.status` | `renderCell('status')` → `StatusBadge` |
| Sub-seller | `sub_seller` | ❌ | ✅ | `Transaction.sub_seller_name` / `split_rules` | `renderCell('sub_seller')` |
| Bandeira | `card_brand` | ❌ | ✅ | `Transaction.card.brand` / `card_brand` | `renderCell('card_brand')` |
| Últimos 4 | `card_last_four` | ❌ | ❌ | `Transaction.card.last4` / `card_last_four` | `renderCell('card_last_four')` |
| Parcelas | `installments` | ❌ | ✅ | `Transaction.installments` | `renderCell('installments')` |
| Líquido | `net_amount` | ❌ | ✅ | `Transaction.net_amount` | `renderCell('net_amount')` |
| Taxa | `fee_amount` | ❌ | ❌ | `Transaction.fee_amount` | `renderCell('fee_amount')` |
| Canal | `channel` | ❌ | ❌ | `Transaction.capture_method` / `channel` | `renderCell('channel')` |
| ID Pedido | `merchant_order_id` | ❌ | ❌ | `Transaction.external_id` / `merchant_order_id` | `renderCell('merchant_order_id')` |

### Configuração de Colunas — CARD (Cartão)

| Coluna | Key | Visível | Sortable | Origem |
|---|---|---|---|---|
| ID | `transaction_id` | ✅ | ✅ | `Transaction.transaction_id` |
| Vendedor | `merchant` | ✅ | ✅ | `Transaction.merchant_name` |
| Comprador | `customer` | ✅ | ✅ | `Transaction.customer.name` |
| Pagamento | `payment_block` | ✅ | ❌ | Agregado |
| Datas | `dates_block` | ✅ | ❌ | `DatesCell` |
| Valores | `values_block` | ✅ | ❌ | `ValuesCell*` |
| Comissões e Taxas | `fees_block` | ✅ | ❌ | `FeesCell*` |
| Bandeira | `card_brand` | ❌ | ✅ | `Transaction.card.brand` |
| Últimos 4 | `card_last_four` | ❌ | ❌ | `Transaction.card.last4` |
| Parcelas | `installments` | ❌ | ✅ | `Transaction.installments` |
| BIN | `bin` | ❌ | ❌ | `Transaction.card.first6` / fallback `'411111'` |
| Emissor | `issuer` | ❌ | ❌ | Mock (não existe na entity) |
| Cód. Autorização | `authorization_code` | ❌ | ❌ | `Transaction.acquirer_data.authorization_code` |
| 3DS | `threeds` | ❌ | ❌ | `Transaction.three_ds_data.status` / `threeds_authenticated` |
| Sub-seller | `sub_seller` | ❌ | ✅ | `Transaction.sub_seller_name` |

### Configuração de Colunas — PIX

| Coluna | Key | Visível | Sortable | Origem |
|---|---|---|---|---|
| ID | `transaction_id` | ✅ | ✅ | `Transaction.transaction_id` |
| Vendedor | `merchant` | ✅ | ✅ | `Transaction.merchant_name` |
| Comprador (Pagador) | `payer` | ✅ | ✅ | `Transaction.customer.name` / `payer_name` |
| Pagamento | `payment_block` | ✅ | ❌ | Agregado |
| Datas | `dates_block` | ✅ | ❌ | `DatesCell` |
| Valores | `values_block` | ✅ | ❌ | `ValuesCell*` |
| Comissões e Taxas | `fees_block` | ✅ | ❌ | `FeesCell*` |
| Tipo PIX (in/out) | `pix_transaction_type` | ❌ | ✅ | `Transaction.pix_transaction_type` |
| Fluxo PIX | `pix_flow` | ✅ | ✅ | `Transaction.pix_flow` → `PixFlowBadge` |
| E2EID | `e2eid` | ❌ | ❌ | `Transaction.pix.end_to_end_id` / `pix_key` |
| Tipo Cobrança | `pix_type` | ❌ | ❌ | Mock (sempre "Imediata") |
| Jornada (ms) | `pix_journey_ms` | ❌ | ✅ | `Transaction.pix_journey_ms` |
| Tempo Pgto | `payment_time` | ❌ | ❌ | Mock |

### Célula: ID (`transaction_id`)
| Sub-campo | Origem | Regra |
|---|---|---|
| Ícone (PIX/Cartão) | `Transaction.method` | Se `pix` → `QrCode` (mint); senão → `CreditCard` (blue) |
| ID truncado | `Transaction.transaction_id` | `slice(0, 8) + '...'` |
| Badge Antifraude | `Transaction.antifraud_status` | Verde se approved, amarelo se review, vermelho se declined |
| Badge Split | `Transaction.has_split` | Ícone `Split` roxo |
| Badge Recorrente | `Transaction.is_recurring` | Ícone `Repeat` azul |
| Badge Chargeback | `Transaction.status === 'chargeback'` | Ícone `AlertTriangle` vermelho |

### Célula: Pagamento (`payment_block`)
| Sub-campo | Origem | Regra |
|---|---|---|
| Status | `Transaction.status` | `StatusBadge` component |
| Método + Bandeira | `Transaction.method` + `card_brand` | `'PIX'` ou `'Cartão · {brand}'` |
| Fluxo PIX | `Transaction.pix_flow` | `PixFlowBadge` (apenas se PIX) |
| Motivo recusa | `Transaction.refusal_reason` | Exibido apenas se `status === 'refused'` |

### Célula: Datas (`DatesCell`)
| Sub-campo | Origem | Regra de Cálculo |
|---|---|---|
| Criação | `Transaction.created_date` | `format(created_date, 'dd/MM/yyyy - HH:mm:ss')` |
| Liberação | `Transaction.release_date` / `settlement_date` | Se ausente: `created_date + 30 dias` (apenas se `status=approved`) |
| Retenção | `Transaction.retention_release_date` | Se ausente: `created_date + 180 dias` (apenas se `status=approved`) |

> **Regra de negócio:** Liberação segue D+30 padrão para cartão; Retenção (rolling reserve) segue D+180.

### Célula: Valores — Default (`ValuesCell`)
| Sub-campo | Origem | Regra |
|---|---|---|
| Parcelado (se >1x) | `Transaction.installments` + `amount` | `fmt(amount) + ' (' + installments + 'x)'` |
| Bruto / Valor PIX | `Transaction.amount` | `fmt(amount)` — label muda para "Valor PIX (saída)" se `pix_transaction_type='out'` |
| Líquido | `Transaction.net_amount` / calculado | `net_amount ?? (gross - ourFee)` onde `ourFee = fee_amount \|\| mdr_amount` |
| Pendente | `Transaction.pending_amount` / calculado | `pending_amount ?? (status in ['pending','authorized'] ? gross : 0)` |
| Em retenção | `Transaction.retention_amount` / calculado | `retention_amount ?? (gross * 0.05)` — **5% hard-coded** |
| Oculto se PIX out | — | Pendente e Retenção não exibidos para `pix_transaction_type='out'` |

### Célula: Valores — MERCHANT (`ValuesCellMerchant` · Admin Sub)
| Sub-campo | Origem | Regra |
|---|---|---|
| Bruto | `Transaction.amount` | `fmt(amount)` |
| Pendente | `Transaction.pending_amount` / calculado | `pending_amount ?? (status in ['pending','authorized'] ? value : 0)` |
| Em retenção | `Transaction.retention_amount` / calculado | `retention_amount ?? value * 0.05` |
| Líquido a receber | `Transaction.net_amount` / calculado | `net_amount \|\| (value - fees - retention)` onde `fees = (fee_amount \|\| mdr_amount) + antifraud_fee + threeds_fee` |

### Célula: Valores — INTERNAL (`ValuesCellInternal` · Admin Interno)
| Sub-campo | Origem | Regra |
|---|---|---|
| TPV | `Transaction.amount` | `fmt(amount)` |
| Pendente | `Transaction.pending_amount` / calculado | Mesma regra merchant |
| Em retenção | `Transaction.retention_amount` / calculado | `retention_amount ?? tpv * 0.05` |
| Liq. Adquirente | Calculado | `tpv - acquirerCost` onde `acquirerCost = acquirer_fee \|\| partner_cost \|\| (fee_amount * 0.5)` |

> **Regra de negócio (Interno):** Custo do adquirente é simulado como 50% da receita quando `acquirer_fee` ausente.

### Célula: Taxas — Default (`FeesCell`)
| Sub-campo | Origem | Regra |
|---|---|---|
| Nossas Tx. / Taxa PIX | `Transaction.fee_amount` / `mdr_amount` | `fmt(ourFee)` |
| Tx. Adquirente / Custo PIX | `Transaction.acquirer_fee` / `partner_cost` | `fmt(acquirerFee)` ou `'-'` |
| Total Tx. (valor + %) | Calculado | `fmt(totalFee) + ' (' + totalPct.toFixed(2) + '%)'` onde `totalFee = ourFee + acquirerFee`, `totalPct = (totalFee / gross) * 100` |

### Célula: Taxas — MERCHANT (`FeesCellMerchant` · Admin Sub)
| Sub-campo | Origem | Regra |
|---|---|---|
| MDR | `Transaction.fee_amount` / `mdr_amount` | `- fmt(mdrFee)` |
| Antifraude | `Transaction.antifraud_fee` | `- fmt(antifraudFee)` (apenas se > 0) |
| 3DS | `Transaction.threeds_fee` | `- fmt(threeDsFee)` (apenas se > 0) |
| Total taxa | Calculado | `- fmt(mdrFee + antifraudFee + threeDsFee)` |

> **Confidencialidade:** Merchant NÃO vê custo de adquirente nem margem PagSmile.

### Célula: Taxas — INTERNAL (`FeesCellInternal` · Admin Interno)
| Sub-campo | Origem | Regra |
|---|---|---|
| Receita | `Transaction.fee_amount` / `mdr_amount` | `+ fmt(revenue)` |
| Custo Adq. | `Transaction.acquirer_fee` / `partner_cost` / calculado | `- fmt(cost)` onde `cost = acquirer_fee \|\| partner_cost \|\| revenue * 0.5` |
| Margem (valor + %) | Calculado | `± fmt(margin) + ' (' + marginPct.toFixed(0) + '%)'` onde `margin = revenue - cost`, `marginPct = (margin / revenue) * 100` |

### Células Específicas PIX
| Célula | Origem | Regra |
|---|---|---|
| `pix_journey_ms` | `Transaction.pix_journey_ms` | `<30s` → verde ⚡; `<120s` → âmbar; `≥120s` → vermelho (min) |
| `pix_transaction_type` | `Transaction.pix_transaction_type` | `in` → verde "Entrada" (ArrowDownLeft); `out` → vermelho "Saída" (ArrowUpRight) |

### Filtros Aplicados (Sticky + Locais)
| Filtro | Origem | Regra |
|---|---|---|
| Busca (sticky) | `Transaction.transaction_id`, `customer.name`, `customer.email`, `customer_name`, `customer_email` | `toLowerCase().includes(search)` |
| Método (sticky) | `Transaction.method` / `type` | `method === filter \|\| type === filter` |
| Status (sticky) | `Transaction.status` | `statuses.includes(status)` |
| Status (local) | `Transaction.status` | `filters.statuses.includes(status)` |
| Bandeira (local) | `Transaction.card.brand` | `filters.brands.includes(card.brand)` |
| Valor mín/máx (local) | `Transaction.amount` | `amount >= min && amount <= max` |

### KPIs da Lista (`ActionableSummaryCards`)
| KPI | Origem | Regra |
|---|---|---|
| Total transações | `transactions.length` | Count |
| Aprovadas | `transactions.filter(status='approved').length` | Count |
| Recusadas | `transactions.filter(status='refused').length` | Count |
| Volume aprovado | `sum(amount)` onde `status=approved` | Sum |
| Chargebacks | `transactions.filter(status='chargeback').length` | Count |

---

## 3. Transações — Nível Detalhe

> **Componente:** `TransactionDetail.jsx`
> **Query:** `base44.entities.Transaction.filter({ id: transactionId })`
> **5 Tabs:** Visão Geral · Cliente · Eventos & Logs · API · Antifraude & Relacionadas

### Header Card (acima das tabs)
| Campo UI | Origem | Regra |
|---|---|---|
| Valor formatado | `Transaction.amount` | `formatCurrency(amount)` |
| Status | `Transaction.status` | `StatusBadge` size="lg" |
| Transaction ID | `Transaction.transaction_id` | Mono + botão copiar |
| Badge Antifraude | `Transaction.antifraud_status` | Exibido se truthy |
| Badge Split | `Transaction.has_split` | Exibido se truthy |
| Badge Recorrente | `Transaction.is_recurring` | Exibido se truthy |
| Botão Estornar/Devolver | `Transaction.status === 'approved'` | Label muda: PIX → "Devolver", Cartão → "Estornar" |
| Botão Capturar | `Transaction.status === 'pre_authorized'` | Exibido apenas se pre_authorized |
| Botão Cancelar | `Transaction.status === 'pre_authorized'` | Exibido apenas se pre_authorized |
| Botão Nota | Sempre | Abre SideDrawer |
| Botão Reenviar Webhook | Sempre | Mock |
| Botão Imprimir | Sempre | Mock |

### Tab: Visão Geral

#### Sub-card: EnhancedTimeline (`EnhancedTimeline.jsx`)
Timeline do pagamento com 6-7 eventos, cada um com: ícone, cor, título, descrição, timestamp, latência, status.

| # | Evento | Origem | Latência | Status |
|---|---|---|---|---|
| 1 | Transação Criada | `Transaction.channel` / `capture_method` | — | success |
| 2 | Análise Antifraude | `Transaction.antifraud_data.score` / `risk_score` + `antifraud_data.provider` | 850ms | success/error |
| 3 | 3D Secure (apenas cartão) | `Transaction.three_ds_data.status` / `threeds_authenticated` | 550ms | success |
| 4 | Autorizado/Recusado | `Transaction.status` + `acquirer_data.authorization_code` + `acquirer_data.nsu` (cartão) ou `pix.end_to_end_id` (pix) | 700ms | success/error/pending |
| 5 | Captura confirmada (cartão aprovado) | `Transaction.acquirer_data.name` + `acquirer_data.tid` | 200ms | success |
| 6 | Webhook enviado (se aprovado) | Mock | 120ms | success |
| 7 | Previsto para liquidação | `Transaction.expected_settle_date` | — | scheduled |

> **Regra de timestamp:** Todos calculados a partir de `baseDate = new Date(transaction.created_date)` com offsets em ms (850, 1400, 2100, 2300, 2600, 3000).

#### Sub-card: Dados do Cartão (apenas se `type === 'card'`)
| Campo UI | Origem | Regra |
|---|---|---|
| Bandeira | `Transaction.card.brand` | `toUpperCase()` |
| BIN | `Transaction.card.first6` / fallback `'411111'` | Mono + copiar |
| Últimos 4 Dígitos | `Transaction.card.last4` | Mono |
| Tipo de Cartão | Mock | Sempre "Crédito" |
| Banco Emissor | Mock | Sempre "Itaú Unibanco" |
| País de Emissão | Mock | Sempre "🇧🇷 Brasil" |
| Parcelamento | `Transaction.installments` + `amount` | `>1` → `{n}x de {amount/n}`; senão "À vista" |
| Código de Autorização | `Transaction.acquirer_data.authorization_code` / fallback `'123456'` | Mono + copiar |
| NSU | `Transaction.acquirer_data.nsu` / fallback `'789456123'` | Mono + copiar |
| 3D Secure | `Transaction.threeds_authenticated` / `three_ds_data.eci` | `✓ Autenticado (ECI 05)` ou "Não aplicado" |

#### Sub-card: Dados do Pix (apenas se `type === 'pix'`)
| Campo UI | Origem | Regra |
|---|---|---|
| E2EID | `Transaction.pix.end_to_end_id` / `pix_key` / fallback | Mono + copiar |
| Tipo de Cobrança | Mock | Sempre "Cobrança Imediata" |
| Chave Pix Recebedora | Mock | Sempre "pagsmile@empresa.com" |
| Tempo de Pagamento | Mock | Sempre "2 min 34 seg" |
| Data de Liquidação | `Transaction.settlement_date` | `format(settlement_date, 'dd/MM/yyyy HH:mm:ss')` |

#### Sub-card: Valores e Taxas (decomposto via `decomposeFees`)
| Campo UI | Origem | Regra de Cálculo |
|---|---|---|
| Valor Bruto | `Transaction.amount` | `formatCurrency(amount)` |
| MDR (%) | Calculado | `amount * mdrRate` onde mdrRate depende de method/installments (ver `decomposeFees`) |
| Antecipação (%) | Calculado | `amount * anticipationRate` apenas se cartão parcelado; `anticipationRate = 3.99% * (installments-1)/12` |
| Taxa de Transação | Calculado | `R$ 0.40` fixo (se > 0) |
| Antifraude | Calculado | `R$ 0.20` se `antifraud_data` existe (se > 0) |
| 3DS | Calculado | `R$ 0.10` se `three_ds_data.status='authenticated'` (se > 0) |
| Total de Taxas (%) | Calculado | `sum(components)` + `(totalFees / amount * 100)` |
| Valor Líquido | Calculado | `amount - totalFees` |
| Badge "valores estimados" | Calculado | Exibido se `isEstimated = (authoritativeFee === 0)` |
| Data de Liquidação | `Transaction.settlement_date` / `expected_settle_date` / fallback `'D+30'` | — |

> **Regra de decomposição (MARKET_RATES):** `pix_credit: 0.99%` · `debit: 1.99%` · `card_1x: 3.49%` · `card_2_6x: 4.99%` · `card_7_12x: 5.99%` · `anticipation: 3.99% a.a.` · `transaction_fee: R$0.40` · `antifraud_fee: R$0.20` · `threeds_fee: R$0.10`
> **Âncora:** Se `Transaction.fee_amount` existe, componentes são escalados proporcionalmente (`scale = fee_amount / estimatedTotal`).

#### Sub-card: CustomerDetailCard (`CustomerDetailCard.jsx`)
| Campo UI | Origem | Regra |
|---|---|---|
| Nome | `Transaction.customer.name` / `customer_name` / fallback "Cliente" | Avatar com inicial |
| Badge "Verificado" | Mock | Sempre exibido |
| CPF | `Transaction.customer.document` / `customer_document` / fallback | Mono |
| Cliente desde / transações | Mock | "Cliente desde Set/2024 · 14 transações" |
| E-mail | `Transaction.customer.email` / `customer_email` / fallback | — |
| Telefone | `Transaction.customer.phone` / fallback `'(11) 99999-9999'` | — |
| Endereço | Mock | "Av. Paulista, 1000 — Bela Vista, São Paulo/SP" |
| IP | `Transaction.customer.ip` / fallback `'187.45.123.89'` | Mono + "São Paulo/BR" |
| User Agent | Mock | "Mozilla/5.0 (iPhone; iOS 17.2)" |
| Device ID | `Transaction.customer.device_id` / fallback | Mono |
| KYC | Mock | "Aprovado" (verde) |
| Risco | Mock | "Baixo" (verde) |
| Pedidos | Mock | "14" |
| Última compra | Mock | "3 dias atrás" |
| Botão "Ver Perfil 360°" | — | Link para CustomerDetail |

#### Sub-card: Códigos de Referência
| Campo UI | Origem | Regra |
|---|---|---|
| ID PagSmile | `Transaction.transaction_id` | Mono + copiar |
| ID Pedido Merchant | `Transaction.external_id` / `merchant_order_id` / fallback | Mono + copiar |
| TID (apenas cartão) | `Transaction.acquirer_data.tid` / fallback | Mono + copiar |
| ARN (apenas cartão) | `Transaction.acquirer_data.arn` / fallback | Mono + copiar |

#### Sub-card: Metadata
| Campo UI | Origem | Regra |
|---|---|---|
| JSON Metadata | `Transaction.metadata` | `JSON.stringify(metadata, null, 2)` em bloco dark |

### Tab: Cliente
| Sub-card | Componente | Campos |
|---|---|---|
| Dados do Cliente | `CustomerDetailCard` | (mesmos campos da tab Visão Geral) |
| Jornada do Cliente | `CustomerJourneyCard` | 5 passos: Visitou produto → Adicionou ao carrinho → Iniciou checkout → Tentou pagar → Aguardando confirmação (todos mock) |

### Tab: Eventos & Logs

#### Sub-card: EventsLogsCard (`EventsLogsCard.jsx`)
Feed de 7 eventos internos com filtros (Todos/Sistema/Antifraude/Adquirente/Webhooks) e busca.

| # | Code | Type | Level | Message | Payload (campos) |
|---|---|---|---|---|---|
| 1 | `transaction.created` | system | info | "Transação criada via API" | `source, merchant_id, idempotency_key` |
| 2 | `antifraud.evaluated` | antifraud | info | "Análise antifraude concluída" | `provider, score, recommendation, rules_triggered` |
| 3 | `three_ds.requested` | system | info | "3DS 2.0 solicitado ao emissor" | `version, acs_url` |
| 4 | `three_ds.authenticated` | system | success | "3DS autenticado (ECI 05)" | `eci, cavv, xid` |
| 5 | `acquirer.authorized` | acquirer | success | "Autorizado pelo emissor" | `acquirer, auth_code, nsu, return_code` |
| 6 | `webhook.delivered` | webhook | success | "POST /webhooks/payment.approved → 200" | `url, http_status, attempt, response_time_ms` |
| 7 | `settlement.scheduled` | system | info | "Liquidação agendada" | `expected_date, amount_cents` |

> Cada evento é expansível mostrando o payload JSON completo + botão copiar.

#### Sub-card: MentorTechnicalEventsCard
Eventos técnicos adicionais (mock) — logs de infraestrutura, retries, etc.

### Tab: API · Request/Response

#### Sub-card: ApiPayloadsCard (`ApiPayloadsCard.jsx`)
5 payloads JSON em tabs, cada um com botão Copiar e Baixar.

**Payload 1: Request do Cliente**
```json
{
  "amount": "Transaction.amount * 100 (cents)",
  "currency": "Transaction.currency || 'BRL'",
  "payment_method": "Transaction.method || 'credit_card'",
  "installments": "Transaction.installments || 1",
  "capture": true,
  "customer": { "name, email, document, phone" },
  "card": { "brand, first6, last4, holder_name, expiry_month, expiry_year" },
  "items": "Transaction.items || [{ name, quantity, unit_price, category }]",
  "metadata": "Transaction.metadata",
  "external_id": "Transaction.external_id || 'ORD-123456'"
}
```

**Payload 2: Response PagSmile**
```json
{
  "transaction_id": "Transaction.transaction_id",
  "status": "Transaction.status",
  "amount": "Transaction.amount * 100",
  "currency": "Transaction.currency",
  "fee_amount": "Transaction.fee_amount * 100 (ou estimado 3.49%)",
  "net_amount": "Transaction.net_amount * 100 (ou estimado 96.51%)",
  "created_at": "Transaction.created_date",
  "updated_at": "Transaction.updated_date",
  "acquirer": { "name, nsu, authorization_code, tid, return_code" },
  "antifraud": { "provider, score, recommendation" },
  "three_ds": { "status, version, eci" },
  "settlement": { "expected_date, term: 'D+30'" }
}
```

**Payload 3: Request Adquirente** (formato Cielo)
```json
{
  "MerchantOrderId": "Transaction.external_id",
  "Customer": { "Name, Identity, IdentityType: 'CPF'" },
  "Payment": {
    "Type": "CreditCard",
    "Amount": "Transaction.amount * 100",
    "Installments": "Transaction.installments",
    "Capture": true,
    "Authenticate": true,
    "CreditCard": { "CardNumber: '4111****1111', Holder, ExpirationDate, Brand }
  }
}
```

**Payload 4: Response Adquirente**
```json
{
  "MerchantOrderId": "Transaction.external_id",
  "Payment": {
    "ProofOfSale": "789456",
    "Tid": "1234567890123456789",
    "AuthorizationCode": "123456",
    "Status": 2,
    "ReturnCode": "00",
    "ReturnMessage": "Operation Successful",
    "Amount": "Transaction.amount * 100",
    "Currency": "BRL",
    "Country": "BRA",
    "PaymentId": "pmt_a1b2c3d4",
    "ReceivedDate": "Transaction.created_date"
  }
}
```

**Payload 5: Webhook enviado**
```json
{
  "event": "payment.approved",
  "api_version": "2024-01-15",
  "created_at": "Transaction.updated_date",
  "delivery_id": "whk_evt_xyz789",
  "data": { "transaction_id, status, amount, external_id" }
}
```

### Tab: Antifraude & Relacionadas

#### Sub-card: AntifraudExplainCard (`AntifraudExplainCard.jsx`)
Análise antifraude explicável com score + 7 sinais individuais.

| Campo UI | Origem | Regra |
|---|---|---|
| Score (gauge circular) | `Transaction.antifraud_data.score` / `risk_score` / fallback `23` | Cor: ≥70 vermelho, ≥40 âmbar, <40 verde |
| Recomendação | Calculado | `≥70` → "Revisar manualmente"; `≥40` → "Cautela"; `<40` → "Aprovar" |
| Provedor | `Transaction.antifraud_data.provider` / fallback "PagSmile AF" | — |
| Modelo | Mock | "v3.2 (LightGBM + sinais comportamentais)" |

**7 Sinais individuais (cada um com nome, resultado, detalhe, impacto numérico):**

| # | Sinal | Resultado | Detalhe | Impacto |
|---|---|---|---|---|
| 1 | Geolocalização do IP | pass | "IP brasileiro consistente com endereço de cobrança" | -8 |
| 2 | Histórico do device | pass | "Device conhecido — 12 compras anteriores" | -12 |
| 3 | Velocidade transacional | caution | "3 transações nas últimas 6h (atípico)" | +6 |
| 4 | Match nome × cartão | pass | "Nome no cartão = nome do comprador" | -5 |
| 5 | BIN reputation | pass | "BIN 411111 — Itaú, baixo risco histórico" | -3 |
| 6 | Email idade | pass | "Email com 4+ anos, alta reputação" | -7 |
| 7 | Padrão de horário | pass | "Compra em horário típico do cliente" | -2 |

> **Regra:** Impacto negativo reduz score (mais seguro); positivo aumenta. Todos os sinais são mock exceto score que vem da entity.

#### Sub-card: RelatedTransactionsCard (`RelatedTransactionsCard.jsx`)
| Campo UI | Origem | Regra |
|---|---|---|
| Lista de relacionadas | Mock | 3 itens: 2 retries recusados + 1 relacionada aprovada |
| Cada item: label, amount, status, when, id | Mock | Link para `TransactionDetail?id={id}` |

#### Sub-card: MentorSyncReconciliationCard (`MentorSyncReconciliationCard.jsx`)
Comparativo PagSmile vs Adquirente + histórico de conciliações.

| Campo UI | Origem | Regra |
|---|---|---|
| PagSmile: status, valor, liquidação, last_update | Mock | `MOCK_COMPARISON.pagsmile` |
| Adquirente: status, valor, liquidação, source, last_update | Mock | `MOCK_COMPARISON.acquirer` (source: "Cielo API") |
| Match indicator | Calculado | `pagsmile.status === acquirer.status && pagsmile.amount === acquirer.amount` |
| Histórico de conciliações | Mock | 2 entradas: `file_cnab` (matched) + `active_sync` (matched, triggered_by: "opstech@pagsmile.com") |
| Botão "Sincronizar agora" | Mock | Toast após 1.4s |

#### Sub-card: MentorReceiptCard (`MentorReceiptCard.jsx`)
| Campo UI | Origem | Regra |
|---|---|---|
| Comprovante visual (estilo cupom) | `Transaction.transaction_id` + `amount` | Mono, bordas tracejadas |
| Botão "Reimprimir PDF" | Mock | Toast |
| Botão "Enviar ao pagador" | Mock | Toast |

---

## 4. Links de Pagamento

> **Componente:** `PaymentLinks.jsx` · **Entity:** `PaymentLink`
> **Query:** `base44.entities.PaymentLink.list('-created_date', 100)`

### NÍVEL LISTA

#### KPI Bar (`PaymentLinksKpiBar`)
| KPI | Origem | Regra |
|---|---|---|
| Total de links | `links.length` | Count |
| Links ativos | `links.filter(status='active').length` | Count |
| Links com problema | `links.filter(status='active' && usage_count=0 && views_count>30).length` | Count |
| Receita total | `sum(links.total_collected)` | Sum |
| Conversão média | Calculado | `avg(usage_count / views_count * 100)` |

#### Tabela — Modo Table (padrão)
| Coluna | Origem | Regra |
|---|---|---|
| Checkbox | — | Seleção múltipla |
| Link (nome + URL + imagem) | `PaymentLink.name` + `short_url` / `url` + `main_image_url` | Imagem 8x8 ou placeholder |
| Saúde | Calculado | `PaymentLinkHealthScore` → `calcLinkHealth(link).score` |
| Valor | `PaymentLink.amount` / `value_type` | `fixed` → `formatBRL(amount)`; `open` → "Aberto"; `min` → "Min {formatBRL(min_amount)}" |
| Status | `PaymentLink.status` | Badge: active/inactive/expired/sold_out/draft |
| Vendas (count + conversão %) | `PaymentLink.usage_count` + `views_count` | `usage_count` + `(usage_count / views_count * 100).toFixed(1) + '% conv'` |
| Tendência | `PaymentLinkSparkline` | Sparkline baseado em dados mock |
| Arrecadado | `PaymentLink.total_collected` | `formatBRL(total_collected)` em verde |
| Última venda | Calculado | `timeSince(link)` — mock baseado em `usage_count` |
| Ações (copiar, compartilhar, menu) | — | Dropdown: Ver detalhe, Abrir, Editar, QR Code, Desativar/Ativar, Excluir |

#### Modo Cards
| Campo | Origem | Regra |
|---|---|---|
| Imagem | `PaymentLink.main_image_url` | 25% da altura do card |
| Nome + checkbox | `PaymentLink.name` | — |
| Status + Health Score | `PaymentLink.status` + `calcLinkHealth` | — |
| 4 KPIs: Valor, Vendas, Conv, Total | `PaymentLink.amount/value_type` + `usage_count` + conversão + `total_collected` | Grid 2x2 |
| Sparkline + ações | — | Copiar, compartilhar, editar |

#### Modo Kanban
| Coluna | Origem | Regra |
|---|---|---|
| Ativos / Rascunhos / Inativos / Esgotados / Expirados | `PaymentLink.status` | Agrupado por status |
| Cada card: nome, vendas, total, health, sparkline | `PaymentLink.name` + `usage_count` + `total_collected` | — |

#### Filtros (`PaymentLinksFilters`)
| Filtro | Origem | Regra |
|---|---|---|
| Busca | `PaymentLink.name` / `link_id` | `toLowerCase().includes()` |
| Status | `PaymentLink.status` | Filtro especial "problem" = active + 0 vendas + >30 views |
| Método | `PaymentLink.payment_methods` | `pix` (apenas PIX), `card` (apenas cartão), `both` (ambos) |
| Tipo de valor | `PaymentLink.value_type` | fixed/open/min |
| Ordenação | Variados | recent / best_seller / best_conversion / highest_revenue / worst_perf |

### NÍVEL DETALHE (Drawer — `PaymentLinkDetailDrawer`)
| Seção | Campos | Origem |
|---|---|---|
| Header | Nome, status, URL, imagem | `PaymentLink.name`, `status`, `url`, `main_image_url` |
| Configuração | Valor, tipo, métodos, validade, max_uses | `PaymentLink.amount`, `value_type`, `payment_methods`, `expires_at`, `max_uses` |
| Performance | Visitas, vendas, conversão, receita, ticket médio | `PaymentLink.views_count`, `usage_count`, `total_collected` |
| Rastreamento | UTM source/medium/campaign, referrer | `PaymentLink.utm_*` |
| Gestão | Pausar/Ativar, Editar, Duplicar, Excluir | Ações via mutation |

> **Regra de Health Score (`calcLinkHealth`):** Score 0-100 baseado em conversão, volume, recência e status. Links com >30 views e 0 vendas recebem score baixo.

---

## 5. Recusas

> **Componente:** `DeclineAnalysisView.jsx` (tab dentro de Transactions) · `DeclineAnalysis.jsx` (dashboard)
> **Entity base:** `Transaction` filtrado por `status = 'refused'`

### NÍVEL LISTA
| Coluna | Origem | Regra |
|---|---|---|
| ID Transação | `Transaction.transaction_id` | Truncado |
| Comprador | `Transaction.customer.name` | — |
| Valor | `Transaction.amount` | `formatCurrency` |
| Bandeira | `Transaction.card.brand` | — |
| Adquirente | `Transaction.acquirer_data.name` | — |
| Motivo da recusa | `Transaction.refusal_reason` | Texto livre |
| Categoria | `Transaction.refusal_category` | Enum: `soft_decline`, `hard_decline`, `technical`, `fraud` |
| Data | `Transaction.created_date` | Formatado |
| Status | `Transaction.status` | Sempre "Recusada" |

### NÍVEL DETALHE (Drawer/Análise)
| Sub-card | Campos | Origem | Regra |
|---|---|---|---|
| Pareto de motivos | Top 10 motivos + % + count | Calculado de `Transaction.refusal_reason` | Agrupamento + ordenação desc |
| Análise por bandeira | Bandeira → count + % recusa | Calculado de `card.brand` | Agrupado por brand |
| Saúde de orquestração | Adquirente → taxa de recusa | Calculado de `acquirer_data.name` | `refused / total * 100` por adquirente |
| Recuperabilidade | % de recusas recuperáveis | Calculado de `refusal_category` | `soft_decline` = recuperável; `hard_decline` = não |
| Heatmap temporal | Recusas por hora/dia | Calculado de `created_date` | Matriz hora × dia |

> **Regras de categorização:** `soft_decline` = fundos insuficientes, limite excedido (recuperável); `hard_decline` = cartão inválido, expirado (não recuperável); `technical` = timeout adquirente, erro interno (recuperável); `fraud` = bloqueio antifraude (não recuperável).

---

## 6. Estornos

> **Componente:** `RefundsView.jsx` (tab dentro de Transactions)
> **Entity base:** `Transaction` filtrado por `type IN ('refund', 'partial_refund')`

### NÍVEL LISTA
| Coluna | Origem | Regra |
|---|---|---|
| ID Original | `Transaction.transaction_id` (transação pai) | — |
| ID Estorno | `Transaction.transaction_id` | — |
| Tipo | `Transaction.type` | `refund` (total) ou `partial_refund` (parcial) |
| Valor | `Transaction.amount` | `formatCurrency` |
| Motivo | `Transaction.refusal_reason` / metadata | — |
| Data solicitação | `Transaction.created_date` | Formatado |
| Data processamento | `Transaction.updated_date` | Formatado |
| Status | `Transaction.status` | `refunded` / `partial_refunded` / `pending` |

### NÍVEL DETALHE (Drawer)
| Sub-card | Campos | Origem | Regra |
|---|---|---|---|
| Detalhamento por motivo | Top motivos de estorno | Calculado de `refusal_reason` | Agrupamento + count |
| Por meio | Cartão vs PIX | Calculado de `method` | `sum(amount)` por method |
| Por operador | Quem solicitou | `Transaction.created_by_id` | Agrupado por usuário |
| Tempo médio | Solicitação → processamento | Calculado | `avg(updated_date - created_date)` |

---

## 7. Disputas / Chargebacks / MEDs / Pré-Chargebacks

> **Componente:** `Disputes.jsx` (cockpit unificado) · `DisputeDashboard.jsx`
> **Entities:** `Dispute` · `MED` · `PreChargeback`
> **Queries:** `base44.entities.Dispute.list('-created_date', 200)` + `base44.entities.MED.list('-created_date', 100)`

### NÍVEL LISTA (Cockpit Unificado)

#### KPI Bar (`UnifiedQueueKpiBar`)
| KPI | Origem | Regra |
|---|---|---|
| Disputas críticas | `unifiedItems.filter(urgency='critical' && isOpen)` | Count |
| Em aberto | `unifiedItems.filter(isOpen)` | Count |
| Valor em aberto | `sum(amount)` onde isOpen | Sum |
| Valor em risco | `openValue * 0.7` | **70% hard-coded** |
| Pré-chargebacks | `unifiedItems.filter(_channel='precb' && isOpen)` | Count + Sum |
| MEDs | `unifiedItems.filter(_channel='med' && isOpen)` | Count + Sum |
| Taxa de vitória | `won / (won + lost) * 100` | Calculado de `cb` channel |

#### Triage Bar (`UnifiedTriageBar`)
| Chip | Origem | Regra |
|---|---|---|
| Crítico / Alto / Médio | `computeUrgency(item).level` | Count por nível |
| Pré-CB / CB / MED | `item._channel` | Count por canal |

#### Tabela (`UnifiedQueueTable`)
| Coluna | Origem | Regra |
|---|---|---|
| Tipo | `item._channel` | precb / cb / med |
| ID | `Dispute.dispute_id` / `MED.med_id` | — |
| Transação | `Dispute.transaction_id` | — |
| Cliente | `Dispute.customer_name` / `MED.payer_name` | — |
| Valor | `Dispute.amount` / `MED.requested_amount` | `formatCurrency` |
| Bandeira | `Dispute.card_brand` | — |
| Status | `Dispute.status` / `MED.status` | Badge |
| Urgência | `computeUrgency(item)` | critical/high/medium/expired/low |
| Prazo | `Dispute.deadline_at` / `MED.deadline_at` | Formatado |
| Dias restantes | Calculado | `differenceInDays(deadline_at, now)` |
| Probabilidade vitória | `Dispute.win_probability` | % (apenas CB) |

#### Filtros (`UnifiedQueueFilters`)
| Filtro | Origem | Regra |
|---|---|---|
| Busca | `dispute_id`, `med_id`, `transaction_id`, `arn`, `customer_name`, `customer_email`, `payer_name` | `toLowerCase().includes()` |
| Canal | `item._channel` | precb / cb / med |
| Bandeira | `item.card_brand` | Especial: "pix" filtra apenas MED |
| Faixa de valor | `item.amount` / `requested_amount` | low (<100), mid (100-500), high (500-2000), vhigh (≥2000) |
| Urgência | `computeUrgency(item).level` | critical/high/medium/expired/low |
| Saved views | Calculado | critical, precb, cb_high_prob, med_2h, high_value |

> **Regra de urgência (`computeUrgency`):** Calculada por `deadline_at` e `amount`. Crítico = prazo <24h; Alto = <72h; Médio = <7 dias; Expirado = prazo passado.
> **Regra de `isOpen`:** precb: `['received','pending']`; cb: `['received','in_analysis','in_contestation']`; med: `['pending','analyzing']`.
> **Ordenação:** Por urgência × valor (crítico primeiro, depois maior valor).

### NÍVEL DETALHE (Drawer)
| Sub-card | Campos | Origem |
|---|---|---|
| Evidências | Documentos, screenshots, prova de entrega | `Dispute.evidence_files` |
| Checklist | Itens obrigatórios para contestação | Mock |
| Probabilidade de vitória | Score + explicação | `Dispute.win_probability` + `WinProbabilityExplain` |
| Ações automatizadas | Auto-reembolso, auto-contestação | `DisputeAgentConfig` |
| Chargebacks por ciclo | Agrupamento por mês | Calculado |
| MEDs por tipo | Tipo de MED | `MED.med_type` |
| Pré-chargebacks por provedor | Ethoca vs Verifi | `Dispute.type` (alert_ethoca / alert_verifi) |

---

## 8. Recebíveis

> **Componente:** `ReceivablesAgenda.jsx` · **Entity:** `Receivable`
> **Query:** `base44.entities.Receivable.list('settlement_date', 500)`

### NÍVEL LISTA

#### Summary Cards
| KPI | Origem | Regra |
|---|---|---|
| Total a Receber | `sum(Receivable.net_amount)` onde filtrado | `formatCurrency` |
| Disponível para Antecipação | `sum(net_amount)` onde `is_anticipatable=true` | `formatCurrency` |
| Ticket Médio | `total / count` | `formatCurrency` |
| Em chargeback (banner) | `sum(net_amount)` onde `status='blocked'` | Alerta se > 0 |

#### Tabela — Tab Agenda
| Coluna | Origem | Regra |
|---|---|---|
| Data Liquidação + D+X | `Receivable.settlement_date` | `format(date, 'dd/MM/yyyy')` + `differenceInDays(date, today)` como `D+{n}` |
| Transação | `Receivable.transaction_id` | `slice(0, 12) + '...'` mono |
| Método | `Receivable.payment_method` | Ícone: `CreditCard` (card) ou `QrCode` (pix) |
| Parcela | `Receivable.installment_number` / `total_installments` | Badge `{n}/{total}` |
| Bruto | `Receivable.gross_amount` | `formatCurrency` |
| Taxa | `Receivable.fee_amount` | `- formatCurrency` em vermelho |
| Líquido | `Receivable.net_amount` | `formatCurrency` bold |
| Status | `Receivable.status` | Badge: scheduled (azul), settled (verde), anticipated (roxo), blocked (vermelho) |

#### Tab: Cessões e ônus (CERC)
| Coluna | Origem | Regra |
|---|---|---|
| Data Cessão | Mock (`cession_date`) | `format(date, 'dd/MM/yyyy')` |
| Cessionário | Mock (`cession_to`) | Badge roxo: "Banco XYZ" / "FIDC Master" / "Banco Inter" |
| ID Recebível | `Receivable.id` | `slice(0, 16)` mono |
| Vencimento | `Receivable.settlement_date` | Formatado |
| Valor cedido | Mock (`cession_value = net_amount`) | `formatCurrency` bold |
| Status CERC | Mock | Sempre "Registrado" (verde) |

#### Tab: Em chargeback
| Coluna | Origem | Regra |
|---|---|---|
| Recebível | `Receivable.id` | `slice(0, 16)` mono |
| Vencimento original | `Receivable.settlement_date` | Formatado |
| Disputa | Link mock `cb_{id.slice(-6)}` | Link para Chargebacks |
| Valor bloqueado | `Receivable.net_amount` | `formatCurrency` vermelho |
| Status | — | Sempre "Bloqueado" (vermelho) |

#### Filtros
| Filtro | Origem | Regra |
|---|---|---|
| Período | `Receivable.settlement_date` | 7/15/30/60/90 dias |
| Método | `Receivable.payment_method` | card / pix |
| Apenas antecipáveis | `Receivable.is_anticipatable` | Switch |
| Data específica | `Receivable.settlement_date` | Calendar click |

> **Regra de filtragem:** Apenas `status='scheduled'` E `settlement_date >= today` (recebíveis futuros).

### NÍVEL DETALHE (Drawer)
| Sub-card | Campos | Origem |
|---|---|---|
| Buckets por prazo | D+0, D+1, D+7, D+15, D+30, D+60, D+90+ | Calculado de `settlement_date` |
| Análise de concentração | % por meio, por bandeira, por merchant | Calculado |
| Recebíveis em disputa | `status='blocked'` | Lista |
| Recebíveis antecipados | `status='anticipated'` | Lista |
| Forecast | Projeção de liquidação futura | Calculado |

---

## 9. Antecipação

> **Componente:** `Anticipation.jsx` · **Entities:** `Receivable` (filtrado) + `AnticipationConfig`
> **Queries:** `base44.entities.Receivable.filter({ status: 'scheduled', is_anticipatable: true })` + `base44.entities.AnticipationConfig.list()`

### NÍVEL LISTA

#### Hero Card
| Campo | Origem | Regra |
|---|---|---|
| Disponível para antecipar | `sum(Receivable.net_amount)` onde antecipável | `formatCurrency` |
| Nº de recebíveis | `receivables.length` | Count |
| Taxa atual | `AnticipationConfig.fee_percentage_monthly` / fallback `1.99` | `% a.m.` |
| Crédito em até 1h | Mock | Hard-coded |

#### Tab: Histórico
| Campo | Origem | Regra |
|---|---|---|
| Data | Mock (`anticipationHistory[].date`) | `format(date, "dd 'de' MMMM 'de' yyyy")` |
| Valor bruto | Mock (`gross`) | `formatCurrency` |
| Taxa | Mock (`fee`) | `formatCurrency` |
| Líquido | Mock (`net`) | `+ formatCurrency` em verde |
| Status | Mock | Sempre "Concluída" (verde) |

#### Tab: Auto-Antecipação
| Campo | Origem | Regra |
|---|---|---|
| Habilitar | `AnticipationConfig.is_auto_enabled` | Switch |
| Regra | `AnticipationConfig.auto_rule` | all / above_days / above_value |
| Dias mínimos | `AnticipationConfig.auto_min_days` | Input (apenas se above_days) |
| Valor mínimo | `AnticipationConfig.auto_min_value` | Input (apenas se above_value) |
| Taxa máxima aceitável | `AnticipationConfig.max_fee_percentage` / fallback `3` | Input |

### NÍVEL DETALHE

#### Tab: Simular e Antecipar
| Sub-card | Campos | Origem | Regra |
|---|---|---|---|
| Comparativo (Antecipar vs Aguardar vs Empréstimo) | `AnticipationCompareCard` | Calculado com `amount`, `anticipationRate`, `daysToWait` |
| Simulador | `AnticipationSimulator` | Input valor → calcula fee, líquido | `fee = amount * (feePercentage/100) * (days/30)` |
| Pricing Tiers | `AnticipationPricingTiers` | Faixas de volume → taxa | Mock |
| Resumo | Total antecipado, total taxas | `AnticipationConfig.total_anticipated`, `total_fees_paid` | `formatCurrency` |

#### Tab: Insights
| Sub-card | Campos | Origem |
|---|---|---|
| Decomposição do valor disponível | `AvailableValueDecomposition` | Mock |
| Projeção | `AvailableValueProjection` | Mock |
| Limite de exposição | `ExposureLimitCard` | Mock |
| Cenários | `MentorSimulatorScenarios` | Mock |

#### Dialog de Confirmação
| Campo | Origem | Regra |
|---|---|---|
| Valor Bruto | `pendingAnticipation.grossAmount` | `formatCurrency` |
| Taxa de Antecipação | `pendingAnticipation.fee` | `- formatCurrency` vermelho |
| Valor Líquido | `pendingAnticipation.netAmount` | `formatCurrency` verde bold |
| Prazo | Mock | "Crédito em até 1 hora" |

> **Regra de cálculo de taxa:** `fee = amount * (fee_percentage_monthly / 100) * (daysToSettle / 30)` — proporcional aos dias antecipados.

---

## 10. Taxas e Tarifas

> **Componente:** `Fees.jsx` · **Entity base:** `Transaction` (decomposto via `decomposeFees.js`)

### NÍVEL LISTA

#### Anomaly Banner + Effective Rate Hero
| Campo | Origem | Regra |
|---|---|---|
| Taxa efetiva média | Calculado de `Transaction` | `avg(fee_amount / amount * 100)` |
| Anomalias detectadas | Mock | Hard-coded |

#### Tab: Taxas (MDR) — Cards por modalidade
| Card | Bandeira | Origem | Valor |
|---|---|---|---|
| Crédito à Vista (1x) | Visa/Master | Mock (`taxasMDR.vista.visa`) | 2.99% |
| | Elo | Mock | 3.19% |
| | Amex | Mock | 3.49% |
| | Hipercard | Mock | 3.29% |
| Parcelado 2-6x | Visa/Master | Mock | 3.49% |
| | Elo | Mock | 3.69% |
| | Amex | Mock | 3.99% |
| Parcelado 7-12x | Visa/Master | Mock | 3.99% |
| | Elo | Mock | 4.19% |
| | Amex | Mock | 4.49% |
| Débito & PIX | Débito Visa/Master | Mock | 1.99% |
| | Débito Elo | Mock | 2.19% |
| | PIX | Mock | 0.99% |

#### Tab: Taxas — Tabela Completa 1-12x com Antecipação
| Coluna | Origem | Regra de Cálculo |
|---|---|---|
| Parcelas | 1-12 | Loop |
| MDR | Mock | 1x=2.99%; 2-6x=3.49%; 7-12x=3.99% (Visa) |
| Prazo Médio | Calculado | `1x=30`; `n>1 = round((30 + 30*n) / 2)` |
| Custo Antecipação | Calculado | `(prazoMedio - 1) / 30 * 1.99%` |
| Custo Efetivo Total | Calculado | `MDR + Custo Antecipação` — cor: ≤4% verde, ≤6% âmbar, >6% vermelho |

#### Tab: Tarifas — Cards resumo
| Tarifa | Valor | Tipo | Origem |
|---|---|---|---|
| Gateway | R$ 0.49 | Por transação aprovada | Mock |
| 3DS | R$ 0.30 | Autenticação 3D Secure | Mock |
| Antifraude Cartão | R$ 0.70 | Por análise em cartão | Mock |
| Antifraude PIX | R$ 0.08 | Por análise em PIX | Mock |
| Pré-Chargeback | R$ 8.00 | Por alerta Ethoca/Verifi | Mock |
| Chargeback | R$ 30.00 | Multa por chargeback | Mock |

#### Tab: Tarifas — Tabela Completa
| Categoria | Descrição | Tipo | Valor | Origem |
|---|---|---|---|---|
| Gateway | Gateway - Transação Aprovada | Por transação | R$ 0.49 | Mock (`tarifasFixas`) |
| Gateway | Gateway - Transação Recusada | Por transação | R$ 0.00 | Mock |
| 3DS | Autenticação 3D Secure | Por transação | R$ 0.30 | Mock |
| Antifraude | Antifraude - Cartão | Por transação | R$ 0.70 | Mock |
| Antifraude | Antifraude - PIX | Por transação | R$ 0.08 | Mock |
| Pré-Chargeback | Taxa de Pré-Chargeback | Por ocorrência | R$ 8.00 | Mock |
| Chargeback | Multa por Chargeback | Por ocorrência | R$ 30.00 | Mock |
| Saques | Saque via TED | Por operação | R$ 3.90 | Mock |
| Saques | Saque via PIX | Por operação | R$ 0.00 | Mock |
| Estornos | Estorno/Cancelamento | Por operação | R$ 0.00 | Mock |
| Boleto | Emissão de Boleto | Por boleto | R$ 2.90 | Mock |
| Boleto | Boleto Compensado | Por boleto | R$ 0.00 | Mock |

#### Tab: Análise
| Sub-card | Origem | Regra |
|---|---|---|
| Effective Rate Card | Calculado de `Transaction` | `avg(fee_amount / amount * 100)` |
| Industry Benchmarks | Mock | Comparação com mercado |
| Acquirer Routing | Mock | Distribuição por adquirente |

#### Tab: Otimizar IA
| Sub-card | Origem |
|---|---|
| Fees Optimizer IA | Mock (`FeesOptimizerIA`) |
| Pricing Tiers | Mock (`PricingTiersCard`) |

### NÍVEL DETALHE — Simulador de Venda
| Campo | Input | Origem | Regra de Cálculo |
|---|---|---|---|
| Valor da Venda | Input | `simAmount` | — |
| Parcelas | Select 1-12 | `simInstallments` | — |
| Bandeira | Select | `simBrand` | — |
| Valor Bruto | Output | `simAmount` | `formatCurrency(amount)` |
| MDR (%) | Output | Calculado | `1x=2.99%; 2-6x=3.49%; 7-12x=3.99%` (por bandeira) |
| Tarifa Gateway | Output | Mock | `R$ 0.49` |
| 3DS | Output | Mock | `R$ 0.30` |
| Antifraude | Output | Mock | `R$ 0.70` |
| Antecipação D+1 (%) | Output | Calculado | `(prazoMedio - 1) / 30 * 1.99%` |
| Custo Efetivo Total | Output | Calculado | `MDR + Gateway + 3DS + Antifraude + Antecipação` |
| Valor Líquido | Output | Calculado | `amount - custoTotal` |
| % Efetivo | Output | Calculado | `(custoTotal / amount) * 100` |

> **Regra de decomposição (`decomposeFees.js` MARKET_RATES):** `pix_credit: 0.99%` · `debit: 1.99%` · `card_1x: 3.49%` · `card_2_6x: 4.99%` · `card_7_12x: 5.99%` · `anticipation: 3.99% a.a.` · `transaction_fee: R$0.40` · `antifraud_fee: R$0.20` · `threeds_fee: R$0.10`
> **Âncora:** Se `Transaction.fee_amount` existe, `scale = fee_amount / estimatedTotal` e todos componentes são multiplicados por `scale`.

---

## 11. Extrato Financeiro

> **Componente:** `FinancialStatement.jsx` · **Entity:** `FinancialEntry`
> **Query:** `base44.entities.FinancialEntry.list('-created_date', 500)`

### NÍVEL LISTA

#### Summary Cards
| KPI | Origem | Regra |
|---|---|---|
| Saldo Inicial | Calculado | `lastEntry.balance_after - lastEntry.amount` |
| Total Entradas | Calculado | `sum(amount)` onde `type='credit'` |
| Total Saídas | Calculado | `sum(amount)` onde `type='debit'` |
| Saldo Final | `firstEntry.balance_after` (lista ordenada desc) | `formatCurrency` |
| Count entradas/saídas | Calculado | `filter(type).length` |

#### Tabela (`FinancialStatementTable`)
| Coluna | Origem | Regra |
|---|---|---|
| Data | `FinancialEntry.created_date` | `format(date, 'dd/MM/yyyy HH:mm')` |
| Tipo | `FinancialEntry.type` | credit (verde ↑) / debit (vermelho ↓) |
| Categoria | `FinancialEntry.category` | sale/refund/chargeback/withdrawal/anticipation/fee/adjustment/split |
| Descrição | `FinancialEntry.description` | Texto |
| Valor | `FinancialEntry.amount` | `+ formatCurrency` (crédito) / `- formatCurrency` (débito) |
| Saldo | `FinancialEntry.balance_after` | `formatCurrency` (running balance) |
| Contraparte | `FinancialEntry.counterparty` | Nome/documento |

#### Filtros
| Filtro | Origem | Regra |
|---|---|---|
| Período | `FinancialEntry.created_date` | Presets: today/yesterday/7days/30days/thisMonth/custom |
| Categoria | `FinancialEntry.category` | all/sale/refund/chargeback/withdrawal/anticipation/fee/adjustment/split |
| Direção | `FinancialEntry.type` | all/credit/debit |
| Smart Saved Filters | Mock | Combinações salvas |

#### Insights Bar (`StatementInsightsBar`)
| Insight | Origem | Regra |
|---|---|---|
| Maior entrada | Calculado | `max(amount)` onde `type='credit'` |
| Maior saída | Calculado | `max(amount)` onde `type='debit'` |
| Dia mais movimentado | Calculado | Agrupado por data |
| Anomalias | Mock | Hard-coded |

### NÍVEL DETALHE (Drawer — `StatementDrillDownDrawer`)
| Sub-card | Campos | Origem |
|---|---|---|
| Detalhe do lançamento | Todos os campos da entry | `FinancialEntry` |
| Drill-down | Transação vinculada | `FinancialEntry.transaction_id` |
| Waterfall | Composição do saldo | Calculado |
| Exportação | CSV/Excel/PDF/OFX | Mock |

> **Regra de running balance:** `balance_after` é armazenado na entity; saldo inicial = último registro (lista desc) menos seu amount.

---

## 12. Saques

> **Componente:** `Withdrawals.jsx` · **Entities:** `Withdrawal` + `BankAccount` + `WithdrawalConfig`
> **Queries:** `base44.entities.Withdrawal.list('-created_date', 100)` + `base44.entities.BankAccount.filter({ status: 'active' })` + `base44.entities.WithdrawalConfig.list()`

### NÍVEL LISTA

#### Summary Cards (4 colunas)
| Card | Origem | Regra |
|---|---|---|
| Disponível para antecipar (D+2) | Mock (`anticipateBalance = 12500.00`) | Hard-coded |
| Antecipação em processamento | Mock (`anticipationProcessing = 3200.00`) | Hard-coded |
| Valor bloqueado em disputas | Mock (`blockedInDisputes = 1800.00`) | Hard-coded |
| Disponível para saque | Mock (`availableBalance = 45680.50`) | Hard-coded |

#### KPI Bar (`WithdrawalKpiBar`)
| KPI | Origem | Regra |
|---|---|---|
| Total sacado (mês) | `sum(Withdrawal.amount)` onde `status='completed'` | Sum |
| Taxa média | Calculado | `avg(fee)` |
| Tempo médio | Calculado | `avg(completed_date - created_date)` |

#### Tabela
| Coluna | Origem | Regra |
|---|---|---|
| ID | `Withdrawal.withdrawal_id` | Mono |
| Valor | `Withdrawal.amount` | `formatCurrency` bold |
| Tipo | `Withdrawal.pix_key` | Se pix_key existe → "PIX" (QrCode); senão "TED" (Building2) |
| Conta destino | `Withdrawal.bank_name` | — |
| Taxa | `Withdrawal.fee` | `formatCurrency(fee \|\| 0)` |
| Status | `Withdrawal.status` | Badge: pending (Clock), processing (Loader2 spin), completed (CheckCircle2), failed (XCircle), cancelled (XCircle) |
| Criação | `Withdrawal.created_date` | `format(date, 'dd/MM HH:mm')` |

#### Filtros
| Filtro | Origem | Regra |
|---|---|---|
| Busca | `withdrawal_id`, `amount`, `bank_name` | `toLowerCase().includes()` |
| Tipo | `Withdrawal.pix_key` | pix (tem pix_key) / ted (não tem) |
| Status | `Withdrawal.status` | pending/processing/completed/failed/cancelled |

### NÍVEL DETALHE

#### Drawer: Solicitar Saque (`SideDrawer`)
| Campo | Origem | Regra |
|---|---|---|
| Saldo disponível | Mock (`availableBalance`) | `formatCurrency` em verde |
| Valor do saque | Input | Botões 50% / Tudo |
| Tipo (PIX/TED) | Select | PIX = "Instantâneo"; TED = "D+0 / D+1" |
| Conta de destino | `BankAccount` list | `{bank_name} - {pix_key \|\| account_number}` |
| Taxa de saque | `WithdrawalConfig.withdrawal_fee_type/value` | Exibido se não free |
| Preview saldo após saque | Calculado | `availableBalance - withdrawAmount` |

#### Drawer: Timeline do Saque (`WithdrawalTimelineDrawer`)
| Campo | Origem | Regra |
|---|---|---|
| Timeline de status | `Withdrawal.status` history | Mock com timestamps |
| Detalhes bancários | `Withdrawal.bank_name`, `agency`, `account_number`, `pix_key` | — |
| Comprovante | Mock | Botão imprimir/enviar |

#### Configurações (Auto-saque)
| Campo | Origem | Regra |
|---|---|---|
| Habilitar auto-saque | `WithdrawalConfig.is_auto_enabled` | Switch |
| Frequência | `WithdrawalConfig.auto_frequency` | daily/weekly/monthly |
| Valor mínimo | `WithdrawalConfig.min_amount_to_withdraw` / fallback `100` | Input |
| Manter saldo mínimo | `WithdrawalConfig.keep_minimum_balance` / fallback `0` | Input |
| Tipo de taxa | `WithdrawalConfig.withdrawal_fee_type` | free/fixed/percentage |
| Valor da taxa | `WithdrawalConfig.withdrawal_fee_value` | Input |

> **Regra de validação:** Valor mínimo para saque = R$ 10,00 (`minWithdrawal = 10`). Se `amount > availableBalance` → erro.
> **Regra de criação:** `net_amount = amount - (fee_type === 'fixed' ? fee_value : 0)`.

---

## 13. Liquidações

> **Componente:** `AdminIntSettlements.jsx` (Admin Interno) · `Settlement` entity
> **Query:** `base44.entities.Settlement.list('-created_date', 200)`

### NÍVEL LISTA

#### KPI Bar
| KPI | Origem | Regra |
|---|---|---|
| Total liquidado (período) | `sum(Settlement.net_amount)` onde `status='settled'` | Sum |
| Pendente de liquidação | `sum(net_amount)` onde `status='pending'` | Sum |
| Divergentes | `count` onde `reconciliation_state != 'matched_three_way'` | Count |
| Taxa de conciliação | `matched / total * 100` | Calculado |

#### Tabela
| Coluna | Origem | Regra |
|---|---|---|
| ID | `Settlement.settlement_id` | Mono |
| Merchant | `Settlement.merchant_name` | — |
| Bruto | `Settlement.gross_amount` | `formatCurrency` |
| Taxas | `Settlement.fee_amount` | `- formatCurrency` |
| Estornos | `Settlement.refund_amount` | `- formatCurrency` |
| Ajustes | `Settlement.adjustment_amount` | `± formatCurrency` |
| Líquido | `Settlement.net_amount` | `formatCurrency` bold |
| Conta | `Settlement.bank_name` + `account_number` | — |
| Status | `Settlement.status` | Badge: pending/settled/failed |
| Data criação | `Settlement.created_date` | Formatado |
| Data liquidação | `Settlement.settled_date` | Formatado |

### NÍVEL DETALHE (Drawer)
| Sub-card | Campos | Origem | Regra |
|---|---|---|---|
| Composição | Bruto, taxas, estornos, ajustes, líquido | `Settlement` | Breakdown visual |
| Timeline | Criação → processamento → liquidação | `Settlement.timeline` | Mock |
| Health Score | Score 0-100 | Calculado | Baseado em conciliação + divergências |
| Análise | Comparação com período anterior | Calculado | — |
| Governança | Aprovações, auditoria | Mock | — |
| Conciliação 3-way | PagSmile × Adquirente × Banco | `Settlement.reconciliation_state` | matched_three_way / unmatched / divergent |

> **Regra de líquido:** `net_amount = gross_amount - fee_amount - refund_amount + adjustment_amount`
> **Regra de conciliação 3-way:** Compara valor PagSmile vs. arquivo CNAB do adquirente vs. movimento bancário (Lina). Estados: `pending`, `matched_acquirer`, `matched_bank`, `matched_three_way`, `unmatched`, `divergent`.

---

## Apêndice A — Dimensões Transversais

### Filtros Comuns a Todos os Módulos

| Dimensão | Origem | Valores | Aplicável a |
|---|---|---|---|
| Período (tempo) | `created_date` / `settlement_date` | Hoje, Ontem, 7d, 30d, Este mês, Mês passado, 90d, Custom | Todos |
| Merchant / Subconta | `Transaction.merchant_id` / `subaccount_id` | Lista de merchants | Admin Interno |
| Meio de pagamento | `Transaction.method` | credit_card, debit_card, pix, boleto | Transações, Dashboard, Recebíveis |
| Status | `Transaction.status` | pending, authorized, approved, refused, refunded, partial_refunded, voided, chargeback, chargeback_won, chargeback_lost, expired, error, processing | Transações, Disputas |
| Bandeira | `Transaction.card.brand` | visa, mastercard, elo, amex, hipercard | Transações (card), Dashboard |
| Adquirente | `Transaction.acquirer_data.name` | Cielo, Stone, Rede, Getnet, Itaú | Transações, Dashboard, Liquidações |
| Geografia | `Transaction.customer.ip` → geolocalização | Por estado/cidade | Dashboard, CDP |
| Canal de captura | `Transaction.capture_method` | ecommerce, pos, recurring | Transações, Dashboard |
| Valor (faixa) | `Transaction.amount` | <100, 100-500, 500-2000, >2000 | Transações, Disputas |
| Urgência | `computeUrgency(item).level` | critical, high, medium, expired, low | Disputas |

---

## Apêndice B — Métricas Derivadas

| Métrica | Fórmula | Regra de Negócio | Componente |
|---|---|---|---|
| Taxa de Aprovação | `approved / total * 100` | % de transações aprovadas sobre o total | `PerformanceIndicatorsActionable` |
| Taxa de Recusa | `refused / total * 100` | % de transações recusadas | `PerformanceIndicatorsActionable` |
| Chargeback Ratio | `chargebacks / approved * 100` | % de chargebacks sobre aprovadas (meta <1%) | `FinancialRiskCard` |
| MED Ratio | `meds / pix_transactions * 100` | % de MEDs sobre transações PIX | `FinancialRiskCard` |
| Conversão (Link) | `usage_count / views_count * 100` | % de conversão de link de pagamento | `PaymentLinks` |
| Conversão (Checkout) | `pagamentos / visitas_checkout * 100` | % de checkouts que viram pagamento | `CheckoutFunnelCard` |
| Ticket Médio | `sum(amount) / count` onde approved | Valor médio por transação aprovada | `TransactionMetricsCards` |
| Taxa Efetiva | `totalFees / amount * 100` | Custo total efetivo em % | `decomposeFees` / `EffectiveRateCard` |
| Taxa de Recuperação | `recovered / refused * 100` | % de recusas recuperadas | `RecoveryRevenueCard` |
| D+X (prazo) | `settlement_date - created_date` em dias | Dias até liquidação | `DatesCell` / `ReceivablesAgenda` |
| Margem PagSmile | `(revenue - cost) / revenue * 100` | Margem sobre receita (Interno) | `FeesCellInternal` |
| Valor em Risco | `openValue * 0.7` | 70% do valor em disputas abertas | `UnifiedQueueKpiBar` |
| Retenção (rolling reserve) | `amount * 0.05` | 5% do bruto retido por D+180 | `ValuesCell*` |
| Liberação (D+30) | `created_date + 30 dias` | Padrão de liquidação cartão | `DatesCell` |
| Custo Antecipação | `amount * (3.99% * (installments-1)/12)` | Proporcional aos dias antecipados | `decomposeFees` |
| Win Rate (Disputas) | `won / (won + lost) * 100` | % de chargebacks ganhos | `UnifiedQueueKpiBar` |
| Health Score (Link) | `calcLinkHealth(link).score` | 0-100 baseado em conversão, volume, recência | `PaymentLinkHealthScore` |
| Urgência (Disputa) | `computeUrgency(item).level` | Baseado em deadline_at + amount | `Disputes` |

---

## Apêndice C — Variantes por Contexto

### Admin Sub (Cliente/Merchant) vs. Admin Interno (PagSmile)

A mesma transação é exibida de forma **diferente** dependendo do contexto. O `viewContext` é determinado pelo módulo ativo no `Layout.jsx`.

#### Célula de Valores (`values_block`)

| Sub-campo | MERCHANT (Admin Sub) | INTERNAL (Admin Interno) | DEFAULT |
|---|---|---|---|
| Label principal | "Bruto" | "TPV" | "Bruto" / "Valor PIX" |
| Líquido | Líquido a receber = `amount - fees - retention` | — | `net_amount ?? (gross - ourFee)` |
| Pendente | ✅ (se status pending/authorized) | ✅ | ✅ |
| Em retenção | ✅ (`amount * 0.05`) | ✅ | ✅ |
| Liq. Adquirente | ❌ (não visível) | ✅ (`tpv - acquirerCost`) | ❌ |

**Justificativa:** O merchant vê o que **ele** recebe (bruto → líquido após suas taxas). O Admin Interno vê o fluxo financeiro da **PagSmile** (TPV → liquidação do adquirente após custo).

#### Célula de Taxas (`fees_block`)

| Sub-campo | MERCHANT (Admin Sub) | INTERNAL (Admin Interno) | DEFAULT |
|---|---|---|---|
| MDR / Nossas Tx. | ✅ `- fmt(fee_amount)` | — | ✅ `fmt(ourFee)` |
| Antifraude | ✅ (se > 0) | — | — |
| 3DS | ✅ (se > 0) | — | — |
| Total taxa | ✅ `- fmt(total)` | — | — |
| Tx. Adquirente / Custo PIX | ❌ | ✅ `- fmt(cost)` | ✅ |
| Receita | ❌ | ✅ `+ fmt(revenue)` | — |
| Margem | ❌ | ✅ `± fmt(margin) + %` | — |
| Total Tx. (valor + %) | — | — | ✅ |

**Justificativa de confidencialidade:**
- **Merchant** vê apenas o que paga à PagSmile (MDR + antifraude + 3DS). Não vê custo de adquirente nem margem — são informações confidenciais da PagSmile.
- **Admin Interno** vê a economia completa: receita (cobrada do merchant) menos custo (pago ao adquirente) = margem. O custo do adquirente é simulado como 50% da receita quando `acquirer_fee` está ausente.

#### Coluna "Vendedor" na Lista

| Contexto | Comportamento | Regra |
|---|---|---|
| MERCHANT | **Oculta** | `visibleColumns.filter(k => k !== 'merchant')` — o merchant é ele mesmo |
| INTERNAL | **Visível** | Mostra `merchant_name` / `subaccount_name` + email |

#### Detalhe da Transação

| Contexto | Diferenças |
|---|---|
| MERCHANT | Tabs: Visão Geral, Cliente, Eventos & Logs, API, Antifraude & Relacionadas. Não vê MentorSyncReconciliationCard nem MentorReceiptCard em modo separado. |
| INTERNAL | Mesmas tabs + cards adicionais de governança: `MentorSyncReconciliationCard` (comparativo PagSmile vs Adquirente), `MentorTechnicalEventsCard`, `MentorReceiptCard`. |

---

> **Fim do Catálogo.** Este documento é a fonte única de verdade para todos os dados exibidos na plataforma PagSmile Admin. Para cada campo, consulte a seção correspondente do módulo para obter origem, regra de cálculo e componente onde aparece.