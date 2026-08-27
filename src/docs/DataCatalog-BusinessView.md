# Catálogo de Dados — Visão de Negócio
**PagSmile Admin · Plataforma de Pagamentos, Conciliação e CRM**

> Documento de referência mapeando todos os dados previstos hoje no modelo da plataforma, traduzidos para linguagem de negócio. Cada seção lista: (a) os registros/dimensões disponíveis, (b) os campos-chave, (c) as métricas derivadas e (d) os filtros e recortes analíticos suportados.

---

## 1. Dashboard Executivo

### Visão Geral do Negócio (Merchant)
- **Volume Financeiro Total (GMV)** — soma bruta de todas as vendas aprovadas no período
- **Volume Líquido Recebido** — GMV menos todas as taxas, estornos e ajustes
- **Ticket Médio** — valor médio por transação aprovada
- **Total de Transações** — contagem de operações aprovadas
- **Taxa de Aprovação** — % de transações aprovadas sobre o total processado
- **Taxa de Recusa** — % de transações recusadas sobre o total processado
- **Saldo Disponível** — valor liberado para saque
- **Saldo a Liberar** — valor pendente de liquidação (D+X)
- **Receita do Período** — líquido realizado no período
- **Projeção Intraday** — estimativa de fechamento do dia baseada no ritmo horário

### Performance por Meio de Pagamento
- **Volume e % por Cartão de Crédito** — participação no GMV
- **Volume e % por PIX** — participação no GMV
- **Volume e % por Boleto** — participação no GMV
- **Volume e % por Débito** — participação no GMV
- **Volume por Bandeira** — Visa, Mastercard, Elo, Hipercard, Amex
- **Volume por Tipo de Captura** — e-commerce, POS, recorrente

### Saúde Operacional
- **Chargeback Ratio** — chargebacks sobre vendas aprovadas (meta < 1%)
- **MED Ratio** — MEDs sobre vendas aprovadas
- **Pré-Chargeback Pendentes** — alertas que podem virar chargeback
- **Disputas em Aberto** — contestações ativas
- **Conciliação Pendente** — transações não reconciliadas tripla

### Comportamento e Conversão
- **Funil de Checkout** — visitas → início de checkout → pagamento → aprovação
- **Taxa de Conversão** — pagamentos aprovados sobre visitas
- **Taxa de Abandono** — desistências no checkout
- **Tempo Médio de Checkout** — latência do preenchimento ao pagamento

### Projeções e Metas
- **Forecast de Volume** — projeção 7/30 dias baseada em histórico
- **Metas de Receita** — progresso vs. meta configurada
- **Comparativo de Períodos** — MoM, YoY, vs. período anterior
- **Top Alavancas de Receita** — produtos/categorias que mais crescem

### Alertas Críticos
- **Queda de Aprovação** — variação negativa significativa vs. baseline
- **Pico de Recusas** — anomalia detectada em tempo real
- **Chargeback Acima do Limite** — excedeu threshold de risco
- **Saldo Bloqueado** — reservas/bloqueios judiciais ativos

---

## 2. Transações

### Identificação
- **ID da Transação** — identificador único PagSmile
- **ID Externo (Order ID)** — referência do merchant
- **ID da Subconta** — qual subconta processou
- **Nome do Merchant** — razão social do estabelecimento
- **ID do Acquirer** — adquirente que processou (Cielo, Stone, Rede, GetNet, etc.)

### Classificação
- **Tipo de Operação** — pagamento, reembolso, reembolso parcial, captura, void, chargeback
- **Meio de Pagamento** — cartão de crédito, débito, PIX, boleto
- **Método de Captura** — e-commerce, POS, recorrente
- **Status** — pendente, autorizada, aprovada, recusada, estornada, estornada parcial, voided, chargeback, chargeback ganho/perdido, expirada, erro, processando

### Valores
- **Valor Bruto** — montante da operação
- **Valor Líquido** — bruto menos taxas
- **Taxa Total** — soma de todas as taxas aplicadas
- **Taxa Efetiva (%)** — taxa total sobre o bruto
- **Moeda** — BRL (default)
- **Parcelas** — número de parcelas (cartão)

### Detalhes do Cartão
- **Bandeira** — Visa, Mastercard, Elo, etc.
- **BIN (primeiros 6)** — prefixo do cartão
- **Últimos 4 dígitos**
- **Nome do Portador**
- **Validade** — mês/ano
- **Banco emissor**
- **País de emissão**

### Detalhes PIX
- **End-to-End ID** — identificador único PIX
- **TXID** — identificador da transação
- **QR Code / Copia-e-Cola**
- **Data de Expiração** — validade do QR
- **Nome do Pagador**
- **CPF/CNPJ do Pagador**
- **Banco do Pagador**
- **Tipo de Fluxo** — manual, automático, biométrico, agendado
- **ID do Consentimento Open Finance** (para automático/biométrico)
- **Status do Consentimento** — ativo, revogado, expirado, pendente
- **Método de Autenticação** — Face ID, biometria, senha
- **Latência da Jornada (ms)** — tempo total de autorização
- **Banco do Pagador** (via Open Finance)

### Dados do Adquirente
- **Nome do Adquirente**
- **NSU** — número sequencial único
- **TID** — terminal ID
- **Código de Autorização**
- **Código de Retorno**
- **Mensagem de Retorno**
- **ARN** — acquirer reference number (rastreio chargeback)

### Dados de Antifraude
- **Provedor** — Clearsale, Konduto, etc.
- **Status** — aprovado, reprovado, revisão
- **Score** — pontuação de risco (0-100)
- **Recomendação** — accept, reject, review
- **ID da Análise**

### Dados 3DS (Autenticação)
- **Status** — autenticado, não autenticado, tentativa
- **Versão** — 3DS 1.0, 2.0, 2.1, 2.2
- **ECI** — electronic commerce indicator
- **CAVV** — cardholder authentication verification value
- **XID** — identificador da transação 3DS

### Cliente
- **ID do Cliente**
- **Nome**
- **E-mail**
- **CPF/CNPJ**
- **Telefone**
- **IP de origem**
- **Device ID**

### Itens do Pedido
- **Nome do produto**
- **Descrição**
- **Quantidade**
- **Preço unitário**
- **Categoria**

### Motivo de Recusa
- **Razão da Recusa** — código/mensagem do emissor
- **Categoria da Recusa** — soft decline, hard decline, técnico, fraude

### Split (Divisão de Pagamento)
- **ID do Split**
- **Regras de divisão** — beneficiários, valores, %, responsável por chargeback, cobra taxa

### Conciliação (3-Way)
- **Estado da Reconciliação** — pendente, conciliado com acquirer, conciliado com banco, tripla conciliação, divergente, em investigação, resolvido, suprimido
- **Data do último match**
- **Status MED** — nenhuma, solicitada, aceita, rejeitada, expirada

### Linha do Tempo
- **Histórico de status** — data, status, descrição (auditoria completa)

### Datas
- **Data de Criação**
- **Data de Ocorrência**
- **Data Esperada de Liquidação**
- **Data Real de Liquidação**

### Metadados
- **Metadados customizados** — campos livres do merchant
- **Payload bruto** — JSON original do webhook
- **Hash do payload** — integridade

---

## 3. Links de Pagamento

### Identificação
- **ID do Link**
- **Nome/Título do link**
- **Descrição**
- **URL pública do link**
- **Status** — ativo, inativo, expirado, esgotado, rascunho

### Configuração
- **Tipo** — pago, grátis, com quantidade variável
- **Valor** — fixo ou faixa (mín/máx)
- **Moeda**
- **Métodos aceitos** — cartão, PIX, boleto
- **Parcelamento habilitado** — sim/não + max parcelas
- **Validade** — data de expiração do link
- **Limite de usos** — máximo de pagamentos
- **Contagem de usos atual**

### Recursos
- **Bumps de pedido** — produtos complementares
- **Variações de quantidade**
- **Limite de validade por sessão**
- **Personalização** — logo, cores, nome do merchant
- **Vinculação de cupom** — cupom aplicável
- **Tracking** — UTM source, medium, campaign

### Performance
- **Total de visitas** — cliques no link
- **Total de pagamentos** — conversões
- **Taxa de conversão** — pagamentos/visitas
- **Receita gerada** — soma dos pagamentos aprovados
- **Ticket médio** — receita/pagamentos
- **Sparkline** — tendência de visitas/pagamentos
- **Health Score** — score de saúde do link (conversão + volume + recência)

### Rastreamento
- **UTM Source / Medium / Campaign**
- **Origem do tráfego**
- **Dispositivo** — mobile/desktop
- **Geolocalização** (se disponível)

### Gestão
- **Criado por**
- **Data de criação**
- **Última atualização**
- **Tags / categorias**

---

## 4. Recusas de Transações

### Visão Analítica
- **Total de Recusas** — contagem no período
- **Taxa de Recusa (%)** — recusas sobre total processado
- **Taxa de Recusa por Meio** — cartão, PIX, boleto
- **Taxa de Recusa por Bandeira** — Visa, Mastercard, Elo, etc.
- **Recusas por Adquirente** — qual processador mais recusa
- **Recusas por Tipo de Captura** — e-commerce, POS, recorrente

### Categorização
- **Categoria da Recusa** — soft decline, hard decline, técnico, fraude
  - **Soft Decline** — pode tentar novamente (ex: limite excedido, suspeita de fraude)
  - **Hard Decline** — não tentar novamente (ex: cartão inválido, roubo)
  - **Técnico** — erro de infraestrutura/emissor indisponível
  - **Fraude** — bloqueado por antifraude

### Pareto de Motivos
- **Top motivos de recusa** — ranking por frequência
- **Código de retorno do emissor** — mapeado para descrição
- **Mensagem de retorno** — texto original
- **% de impacto** — participação no total de recusas

### Recusas por Bandeira
- **Volume por bandeira** — qual bandeira mais recusa
- **Taxa por bandeira** — % de recusa específica
- **Evolução temporal** — tendência por bandeira

### Saúde de Orquestração
- **Taxa de recusa por rota** — qual conexão adquirente mais falha
- **Tempo de resposta do emissor** — latência média
- **Disponibilidade do emissor** — uptime do processador
- **Recusas técnicas vs. negócio** — separação de infra vs. risco

### Recuperabilidade
- **% recuperável** — soft declines que podem ser retentados
- **Taxa de recuperação** — % de soft declines recuperados via retry
- **Recomendação de ação** — retry, trocar rota, abandonar

### Análise Temporal
- **Recusas por hora do dia** — heatmap
- **Recusas por dia da semana**
- **Picos de recusa** — anomalias detectadas
- **Comparativo de períodos**

---

## 5. Estornos (Refunds)

### Visão Geral
- **Total de Estornos** — contagem no período
- **Volume Estornado** — soma dos valores
- **% sobre Vendas** — estornos sobre aprovados
- **Estornos Totais vs. Parciais** — distribuição

### Detalhamento
- **ID da transação original**
- **ID do estorno**
- **Tipo** — estorno total ou parcial
- **Valor estornado**
- **Valor restante** (em estorno parcial)
- **Motivo do estorno** — solicitado pelo cliente, fraude, erro operacional
- **Data da solicitação**
- **Data da execução**
- **Status** — pendente, processado, falhou

### Por Meio de Pagamento
- **Estornos em cartão**
- **Estornos em PIX** (devolução)
- **Estornos em boleto**

### Análise
- **Estornos por motivo** — ranking
- **Estornos por produto/categoria**
- **Tempo médio de processamento** — solicitação → execução
- **Estornos por operador** — quem solicitou

---

## 6. Disputas / Chargebacks / MEDs / Alertas de Pré-Chargeback

### 6.1 Disputas (Cockpit Unificado)

#### Identificação
- **ID da Disputa**
- **ID da transação original**
- **Merchant**
- **Cliente**

#### Classificação
- **Tipo** — chargeback, pré-chargeback, MED (Retrieval Request)
- **Motivo do chargeback** — fraude, serviço não prestado, produto não recebido, duplicidade, crédito não processado, etc.
- **Código do motivo** — código da bandeira
- **Bandeira do cartão**

#### Valores
- **Valor em disputa**
- **Valor contestado**
- **Valor recuperado** (em disputas ganhas)

#### Status e Prazos
- **Status** — aberta, em contestação, ganha, perdida, expirada, aceita pelo merchant
- **Data de abertura**
- **Data limite de contestação** — prazo fatal
- **Dias restantes** — contagem regressiva
- **Horizonte de prazo** — crítico (<3d), atenção (3-7d), confortável (>7d)

#### Evidências
- **Evidências enviadas** — documentos, comprovantes, logs
- **Checklist de evidências** — itens obrigatórios vs. enviados
- **Score de completude** — % de evidências fornecidas
- **Carta de contestação** — texto formal enviado

#### Probabilidade
- **Probabilidade de vitória** — score calculado (0-100%)
- **Fatores de vitória** — evidências fortes, histórico, motivo
- **Fatores de derrota** — evidências faltantes, motivo difícil

#### Ações Automatizadas
- **Reembolso automático sugerido** — quando vale mais a pena reembolsar
- **Regras de auto-decisão** — aceitar/rejeitar automaticamente por critério
- **Contestação automática** — quando probabilidade é alta

### 6.2 Chargebacks
- **Total de chargebacks**
- **Volume chargebackado**
- **Chargeback Ratio** — sobre vendas aprovadas (meta < 1%)
- **Chargebacks por motivo** — ranking
- **Chargebacks por bandeira**
- **Taxa de vitória** — % de disputas ganhas
- **Valor recuperado** — soma de vitórias
- **Chargebacks por ciclo** — 1º, 2º, 3º (arbitration)

### 6.3 MEDs (Merchant Error Detection / Retrieval Requests)
- **Total de MEDs**
- **MED Ratio** — sobre vendas
- **MEDs por tipo** — solicitação de informação, cópia de documento
- **Status** — solicitada, aceita, rejeitada, expirada
- **Prazo de resposta** — dias para responder
- **MEDs não respondidas** — risco de virar chargeback
- **Taxa de conversão MED → Chargeback**

### 6.4 Pré-Chargebacks (Alertas)
- **Total de alertas** — Ethoca, Verifi, CFPB
- **Provedor do alerta** — Ethoca, Verifi, CFPB
- **Status** — recebido, em análise, reembolsado, escalado para chargeback
- **Valor em risco** — soma dos alertas
- **Taxa de prevenção** — % de alertas que NÃO viraram chargeback
- **Economia gerada** — chargebacks evitados × valor médio
- **Regras de auto-reembolso** — critérios para reembolsar preventivamente
- **Impacto preview** — projeção se não agir

### 6.5 Anomalias e Alertas
- **Pico de chargebacks** — anomalia detectada
- **Chargeback ratio acima do limite** — excedeu threshold
- **Merchant de alto risco** — padrão suspeito
- **Cluster de fraude** — grupo de transações relacionadas

---

## 7. Agenda de Recebíveis

### Visão de Calendário
- **Recebíveis por dia** — valor a receber em cada data
- **Recebíveis por semana/mês** — agregado
- **Calendário visual** — heatmap por dia com valor

### Detalhamento por Recebível
- **ID do recebível**
- **ID da transação origem**
- **Valor bruto** — montante original
- **Valor líquido** — após taxas
- **Taxa aplicada**
- **Data prevista de recebimento** — D+X
- **Data real de recebimento**
- **Status** — pendente, liquidado, antecipado, cancelado, em disputa
- **Meio de pagamento** — cartão, PIX, boleto
- **Parcela** — número/total (cartão parcelado)
- **Bandeira**

### Buckets por Prazo
- **A receber hoje (D+0)**
- **A receber amanhã (D+1)**
- **Próximos 7 dias (D+1 a D+7)**
- **Próximos 30 dias**
- **A receber a partir de 30 dias**
- **Vencidos** — passou da data prevista e não liquidou

### Análise
- **Volume a receber por dia** — série temporal
- **Concentração por bandeira**
- **Concentração por meio de pagamento**
- **Recebíveis em disputa** — bloqueados por chargeback
- **Recebíveis antecipados** — já convertidos em cash adiantado
- **Anomalias** — recebíveis que não liquidaram no prazo

### Projeção
- **Forecast de recebimento** — próximos 30/60/90 dias
- **Fluxo de caixa projetado** — entrada esperada por dia
- **Comparativo realizado vs. projetado**

---

## 8. Antecipação

### Visão Geral
- **Volume antecipado** — total adiantado no período
- **Custo de antecipação** — taxa paga pela antecipação
- **Taxa de antecipação (%)** — custo sobre volume
- **Saldo antecipável disponível** — recebíveis elegíveis
- **Taxa média ponderada** — custo médio das operações

### Solicitações
- **ID da solicitação**
- **Merchant**
- **Valor solicitado**
- **Valor aprovado**
- **Recebíveis vinculados** — quais recebíveis foram antecipados
- **Taxa aplicada** — % e valor
- **Deságio** — valor descontado
- **Líquido recebido pelo merchant** — valor após deságio
- **Status** — solicitada, em análise, aprovada, rejeitada, executada, liquidada
- **Data da solicitação**
- **Data da execução**
- **Data de liquidação esperada**

### Configuração
- **Antecipação automática habilitada** — sim/não
- **Taxa configurada** — % a.a. ou % por operação
- **Limite de antecipação** — teto por merchant
- **Período mínimo** — D+X mínimo elegível
- **Bandeiras elegíveis** — quais bandeiras podem antecipar

### Análise
- **Antecipação por dia** — série temporal
- **Custo efetivo vs. configurado** — divergências
- **Economia vs. não antecipar** — comparação de fluxo de caixa
- **Taxas por registradora** — custo por CERC/registradora
- **Breakdown financeiro** — recebíveis, deságio, comissão, líquido

### Governança
- **Aprovações pendentes** — solicitações em análise
- **Aprovado por** — analista responsável
- **Rejeições** — motivo da recusa
- **Auditoria** — histórico de alterações

---

## 9. Taxas e Tarifas

### Visão por Transação (Decomposição)
- **Valor Bruto**
- **MDR (Merchant Discount Rate)** — taxa principal de processamento
  - % à vista: ~3,49%
  - % parcelado: 4,99%–5,99% (escala por parcelas)
- **Taxa de Antecipação** — custo do adiantamento (3,99% a.a. típico)
- **Taxa Fixa por Transação** — R$ 0,40 (cartão), R$ 0,00 (PIX)
- **Taxa de Antifraude** — R$ 0,20 (quando habilitado)
- **Taxa 3DS** — R$ 0,10 (autenticação)
- **Total de Taxas** — soma de todos os componentes
- **Taxa Efetiva (%)** — total sobre bruto
- **Valor Líquido** — bruto menos total de taxas

### Visão Agregada (Período)
- **Volume bruto processado**
- **Total de taxas cobradas**
- **Taxa efetiva média (%)** — taxas sobre volume
- **MDR total** — soma do MDR
- **Antecipação total** — soma do custo de antecipação
- **Taxas fixas totais** — soma por transação
- **Antifraude total**
- **3DS total**
- **Líquido repassado** — volume menos taxas

### Tarifas por Meio
- **Cartão de Crédito** — MDR + fixa + antecipação (se aplicável)
- **Cartão de Débito** — MDR menor + fixa
- **PIX** — taxa fixa ou gratuita
- **Boleto** — taxa fixa por boleto

### Tarifas por Bandeira
- **Visa** — MDR específico
- **Mastercard** — MDR específico
- **Elo** — MDR específico
- **Hipercard** — MDR específico
- **Amex** — MDR específico

### Transparência de Pricing
- **Pricing configurado** — tabela contratada pelo merchant
- **Pricing efetivo** — o que foi realmente cobrado
- **Divergência** — diferença entre configurado e efetivo
- **Benchmark de mercado** — comparação com média do setor
- **Oportunidade de otimização** — onde o merchant paga acima do mercado

### Análise de Custo
- **Custo por transação** — breakdown granular
- **Custo por meio** — qual meio é mais caro
- **Custo por bandeira** — qual bandeira cobra mais
- **Evolução de custo** — tendência temporal
- **Anomalias de taxa** — cobranças fora do padrão

---

## 10. Extrato (Statement)

### Visão Consolidada
- **Saldo inicial do período**
- **Entradas** — créditos (vendas líquidas, antecipações, ajustes a favor)
- **Saídas** — débitos (estornos, chargebacks, saques, taxas, ajustes a débito)
- **Saldo final do período**
- **Variação** — delta do período

### Lançamentos (Linha a Linha)
- **ID do lançamento**
- **Data de ocorrência**
- **Data de registro (posting)**
- **Tipo** — venda, estorno, chargeback, saque, taxa, ajuste, antecipação, split
- **Descrição**
- **Valor** — positivo (crédito) ou negativo (débito)
- **Saldo após lançamento** — running balance
- **ID da transação relacionada**
- **Contraparte** — de onde veio / para onde foi

### Filtros
- **Por tipo de lançamento**
- **Por período**
- **Por valor (faixa)**
- **Por contraparte**
- **Por status** — conciliado, não conciliado

### Análise
- **Resumo diário** — entradas/saídas/saldo por dia
- **Top movimentações** — maiores lançamentos
- **Anomalias** — lançamentos atípicos
- **Fluxo de caixa (waterfall)** — visualização entrada → saída → saldo
- **Drill-down** — do resumo ao lançamento individual

### Exportação
- **Exportar CSV/PDF**
- **Período customizado**
- **Filtros aplicados**

---

## 11. Saques (Withdrawals)

### Visão Geral
- **Total sacado** — volume no período
- **Número de saques**
- **Saque médio** — valor médio por operação
- **Saldo disponível para saque**
- **Saldo bloqueado** — reservas, bloqueios judiciais

### Solicitações
- **ID do saque**
- **Merchant**
- **Valor solicitado**
- **Taxa de saque** — custo da transferência
- **Valor líquido** — valor recebido pelo merchant
- **Conta bancária destino** — banco, agência, conta, titular
- **Método** — TED, PIX, TEF
- **Status** — solicitado, em processamento, aprovado, pago, rejeitado, estornado
- **Data da solicitação**
- **Data do pagamento**
- **Motivo da rejeição** (se aplicável)

### Aprovações
- **Aprovações pendentes** — saques aguardando validação
- **Aprovado por** — analista/sistema
- **Score de risco** — avaliação automática
- **Regras de auto-aprovação** — critérios configurados
- **Limite diário** — teto por merchant/dia
- **Limite por operação** — teto por saque

### Configuração
- **Frequência automática** — diário, semanal, mensal
- **Valor mínimo de saque**
- **Conta padrão** — destino default
- **Reserva de saque** — % retida por segurança
- **Janela de saque** — horários permitidos

### Análise
- **Saques por dia** — série temporal
- **Saques por método** — TED vs. PIX
- **Tempo de processamento** — solicitação → pagamento
- **Taxa de rejeição** — % de saques negados
- **Timeline do saque** — histórico de status
- **Anomalias** — saques atípicos (valor, frequência, destino)

### Governança
- **Aprovações manuais** — fluxo de validação
- **Aprovações automáticas** — via regras
- **Auditoria** — quem aprovou/rejeitou e quando
- **Rolling reserve** — saldo retido por período

---

## 12. Liquidações (Settlements)

### Visão Geral
- **Volume liquidado** — total repassado no período
- **Número de liquidações**
- **Liquidação média** — valor por evento
- **Saldo a liquidar** — pendente de repasse

### Detalhamento por Liquidação
- **ID da liquidação**
- **Merchant**
- **Valor bruto liquidado** — soma dos recebíveis
- **Taxas deduzidas** — MDR, antecipação, fixas
- **Estornos deduzidos** — chargebacks, refunds
- **Ajustes aplicados** — débitos/créditos manuais
- **Valor líquido liquidado** — repasse final
- **Conta destino** — banco, agência, conta
- **Status** — pendente, processando, liquidada, falhou, estornada
- **Data prevista**
- **Data de execução**
- **ID bancário** — comprovante (end-to-end, ARN)

### Composição
- **Transações incluídas** — lista de recebíveis agrupados
- **Parcelas** — por parcela (cartão parcelado)
- **Por bandeira** — Visa, Mastercard, etc.
- **Por meio** — cartão, PIX, boleto
- **Por adquirente** — quem processou

### Timeline
- **Histórico de status** — pendente → processando → liquidada
- **Eventos** — cada mudança com timestamp
- **Notas** — observações operacionais
- **Health Score** — score de saúde da liquidação

### Análise
- **Liquidações por dia** — série temporal
- **Liquidações por merchant** — ranking
- **Liquidações por adquirente**
- **Tempo de liquidação** — ocorrência → repasse
- **Divergências** — valor esperado vs. liquidado
- **Falhas** — liquidações que não concretizaram
- **Forecast de liquidação** — projeção de repasse futuro

### Governança
- **Liquidações manuais** — criadas operacionalmente
- **Recálculo** — reprocessamento de liquidação
- **Rollback** — reversão de liquidação
- **Status forçado** — alteração manual de status
- **Auditoria** — histórico completo de mudanças
- **Ações em lote** — purge, recálculo massivo

### Conciliação de Liquidação
- **Liquidação vs. movimento bancário** — bateu?
- **Liquidação vs. recebíveis** — soma confere?
- **Divergências detectadas** — valor, data, status
- **Reconciliação automática** — 3-way (transação × acquirer × banco)

---

## Apêndice: Dimensões Transversais (Filtros Comuns a Todas as Visões)

### Tempo
- Hoje, Ontem, Últimos 7/30/90 dias, Mês atual, Mês anterior, Trimestre, Ano, Período customizado
- Comparativo: vs. período anterior, vs. mesmo período ano anterior (YoY), vs. mês anterior (MoM)

### Merchant / Subconta
- Por merchant específico
- Por grupo de merchants
- Por subconta
- Por sub-seller
- Por tag/categoria

### Meio de Pagamento
- Cartão de crédito, Débito, PIX, Boleto
- Por bandeira (Visa, Mastercard, Elo, Hipercard, Amex)
- Por tipo de captura (e-commerce, POS, recorrente)

### Status
- Aprovado, Recusado, Pendente, Estornado, Em disputa, Liquidado

### Geografia
- Por país, estado, cidade (quando disponível)
- Por banco do pagador (PIX)

### Canal de Origem
- E-commerce, Marketplace, Social Commerce, Conversacional (WhatsApp), Telefone (MOTO)

---

## Apêndice: Métricas Derivadas Comuns

| Métrica | Cálculo | Interpretação |
|--------|---------|---------------|
| **Taxa de Aprovação** | Aprovadas / Total processado | Saúde de processamento |
| **Taxa de Recusa** | Recusadas / Total processado | Problema de processamento/risco |
| **Chargeback Ratio** | Chargebacks / Vendas aprovadas | Risco de fraude (meta < 1%) |
| **MED Ratio** | MEDs / Vendas aprovadas | Erros operacionais |
| **Taxa de Conversão** | Pagamentos / Visitas | Eficácia do checkout |
| **Ticket Médio** | Receita / Transações | Valor médio de venda |
| **Taxa Efetiva** | Total taxas / Volume bruto | Custo real de processamento |
| **Taxa de Recuperação** | Recuperadas / Recusas recuperáveis | Eficácia do retry |
| **D+0 / D+30** | Dias para liquidação | Prazo de recebimento |
| **Liquidez** | Disponível / A receber | Capacidade de caixa |

---

*Documento vivo — atualizado conforme novas entidades e campos são adicionados ao modelo de dados da plataforma.*