# Catálogo de Dados — Visão Admin Sub (Cliente / Merchant Dashboard)

> Visão do merchant: o que ele vende, o que ele recebe e o que ele paga.
> Não inclui dados confidenciais da PagSmile (custo de adquirente, margem, conciliação 3-way).

---

## 1. Dashboard Executivo do Merchant

### Dinheiro Agora
- **Saldo Disponível** — Valor pronto para saque ou uso imediato, já liquidado e sem bloqueios. Expresso em R$.
- **Pendente (A Liberar)** — Valor já aprovado nas suas vendas, mas ainda dentro do prazo de retenção antes de cair no saldo disponível. Expresso em R$.
- **Bloqueado** — Valor retido por disputas em aberto, chargebacks ou bloqueios. Expresso em R$.

### Antecipação
- **Recebível Disponível para Antecipar** — Soma dos seus recebíveis futuros que atendem aos critérios de elegibilidade para antecipação. Expresso em R$.
- **Taxa de Antecipação** — Custo percentual aplicado sobre o valor antecipado, proporcional aos dias antecipados. Expresso em % ao mês.

### Recebíveis por Prazo
- **D+0 / D+1 / D+7 / D+15 / D+30** — Distribuição dos seus recebíveis por janela de liquidação (quantos dias faltam para cair). Cada bucket mostra o valor em R$ e a quantidade de recebíveis.
- **% por Bucket** — Participação de cada janela no total a receber. Expresso em %.

### GMV (Gross Merchandise Volume) — Do Merchant
- **GMV Hoje** — Soma do valor de todas as suas transações aprovadas no dia atual. Expresso em R$.
- **GMV Ontem** — Mesma métrica, referente ao dia anterior. Expresso em R$.
- **GMV 7 Dias** — Soma dos aprovados nos últimos 7 dias corridos. Expresso em R$.
- **GMV Mês Atual** — Acumulado do mês corrente até o momento. Expresso em R$.
- **Projeção de Mês** — Estimativa de fechamento do mês com base no ritmo de vendas até agora. Expresso em R$.
- **% de Mudança** — Variação percentual do período atual versus o período anterior equivalente. Expresso em %.
- **Progresso do Mês** — Percentual do mês já decorrido, usado para contextualizar se a projeção está acima ou abaixo do ritmo ideal. Expresso em %.
- **GMV Hoje por Meio (Cartão / PIX)** — Decomposição do GMV do dia por método de pagamento. Expresso em R$ e % do total.

### Indicadores de Performance — Suas Vendas
- **Taxa de Aprovação** — Proporção de transações aprovadas sobre o total processado. Expresso em %.
- **Taxa de Recusa** — Proporção de transações recusadas sobre o total processado. Expresso em %.
- **Ticket Médio** — Valor médio por transação aprovada. Expresso em R$.
- **Volume em Cartão** — Soma dos valores aprovados via crédito e débito. Expresso em R$.
- **Volume em PIX** — Soma dos valores aprovados via PIX. Expresso em R$.
- **Transações por Dia** — Quantidade média de transações processadas por dia no período. Expresso em quantidade.

### Projeções
- **Projeção Intraday** — Estimativa de volume e valor até o fim do dia com base no ritmo horário observado. Expresso em R$ e quantidade.
- **Forecast 7 / 30 Dias** — Projeção de GMV e transações para as próximas janelas temporais. Expresso em R$.

### Risco Financeiro — Suas Vendas
- **Chargeback Ratio** — Proporção de chargebacks sobre as suas transações aprovadas. Expresso em %.
- **MED Ratio** — Proporção de MEDs sobre as suas transações PIX. Expresso em %.
- **Reserva Bloqueada** — Valor retido em rolling reserve (reserva de garantia). Expresso em R$.

### Metas
- **Meta de GMV** — Objetivo de volume de vendas definido para o período. Expresso em R$.
- **% de Progresso** — Quanto do realizado já atingiu a meta. Expresso em %.

### IA e Recuperação
- **Sugestões de IA** — Recomendações automáticas para otimizar conversão, reduzir custos e mitigar risco.
- **Receita Recuperável** — Valor potencial que pode ser recuperado via retry e renegociação de transações recusadas. Expresso em R$.

### Fluxo de Dinheiro
- **Waterfall Entradas/Saídas** — Visualização das suas entradas (vendas, liquidações) versus saídas (taxas, estornos, saques). Expresso em R$.
- **Breakdown por Canal** — Distribuição do seu volume por canal de captura (e-commerce, recorrente, POS). Expresso em R$ e %.
- **Funil de Checkout** — Sequência: visitas → carrinho → checkout → pagamento. Cada etapa mostra quantidade e % de conversão para a próxima.

### Performance por Adquirente
- **Volume por Adquirente** — Valor processado por cada processador de pagamentos. Expresso em R$ e %.
- **Taxa de Aprovação por Adquirente** — Proporção de aprovação por processador. Expresso em %.

### Alertas
- **Alertas Críticos** — Itens que exigem ação imediata (disputas críticas, falhas de webhook). Expresso em quantidade.
- **Alertas com Snooze** — Itens adiados temporariamente. Expresso em quantidade.

### Tabs Analíticas

**Tab Executivo:**
- **Conversão de Checkout** — Proporção de visitantes que concluem o pagamento. Expresso em %.
- **Distribuição por Meio** — Participação de cada método de pagamento no volume. Expresso em %.
- **Aprovação por Bandeira** — Proporção de aprovação por bandeira de cartão. Expresso em %.
- **Comparativo de Período** — Variação entre período atual e anterior equivalente. Expresso em %.

**Tab Performance de Cartão:**
- **Aprovação por Bandeira** — Proporção de aprovação por bandeira. Expresso em %.
- **Aprovação por Adquirente** — Proporção de aprovação por processador. Expresso em %.
- **Aprovação por BIN** — Proporção de aprovação por BIN (6 primeiros dígitos do cartão). Expresso em %.
- **Aprovação por Parcelamento** — Proporção de aprovação por faixa de parcelas. Expresso em %.
- **Recusas por Motivo** — Ranking de motivos de recusa com participação e quantidade. Expresso em % e quantidade.

**Tab Performance PIX:**
- **PIX Uplift** — Ganho de conversão obtido ao habilitar PIX como método. Expresso em %.
- **Volume por Fluxo** — Distribuição por tipo de PIX (manual, automático, biometria, agendado). Expresso em R$ e %.
- **Jornada Média** — Latência média da jornada de autorização do PIX. Expresso em milissegundos.
- **Status de Consentimento** — Distribuição dos consentimentos Open Finance por status. Expresso em quantidade e %.

**Tab Analytics Avançado:**
- **Análise de Cohort** — Retenção dos seus clientes agrupados por mês de aquisição. Expresso em %.
- **Heatmap por Hora/Dia** — Concentração de transações por hora × dia da semana. Expresso em quantidade.

---

## 2. Transações — Lista (Visão do Merchant)

- **ID da Transação** — Identificador único da transação. Exibido de forma truncada, acompanhado de badges indicadores (antifraude, split, recorrente, chargeback).
- **Comprador** — Nome do cliente que realizou o pagamento.
- **Status** — Estado atual da transação no ciclo de vida (pendente, autorizada, aprovada, recusada, estornada, em chargeback, etc.).
- **Método + Bandeira** — Forma de pagamento utilizada (PIX ou cartão com sua respectiva bandeira).
- **Fluxo PIX** — Tipo de fluxo utilizado na transação PIX (manual, automático, biometria ou agendado).
- **Motivo da Recusa** — Texto descritivo do motivo pelo qual a transação foi recusada. Exibido apenas quando o status é recusada.
- **Data de Criação** — Data e hora em que a transação foi criada.
- **Data de Liberação** — Data prevista para o valor ser liquidado para você. Segue o prazo padrão de liquidação do meio de pagamento.
- **Data de Retenção** — Data prevista para liberação do rolling reserve (reserva de garantia retida temporariamente).
- **Valor Bruto** — Valor total da transação. Expresso em R$. Se parcelado, exibe também o número de parcelas.
- **Valor Líquido a Receber** — Valor que você efetivamente recebe após desconto de taxas e retenção. Expresso em R$.
- **Valor Pendente** — Valor aprovado mas ainda não liberado (em período de retenção ou pré-liqüidação). Expresso em R$.
- **Valor em Retenção** — Parcela do bruto retida como rolling reserve. Expresso em R$.
- **Total de Taxas** — Soma de todas as taxas cobradas na transação (MDR + antifraude + 3DS). Expresso em R$ e % do bruto.
- **MDR** — Taxa de desconto principal cobrada sobre a transação. Expresso em R$.
- **Antifraude** — Custo da análise antifraude realizada na transação. Expresso em R$.
- **3DS** — Custo da autenticação 3D Secure quando aplicada. Expresso em R$.
- **Parcelas** — Número de parcelas em que a compra foi dividida.
- **BIN** — Seis primeiros dígitos do cartão, que identificam o emissor e a bandeira.
- **Últimos 4 Dígitos** — Quatro últimos dígitos do cartão, para identificação segura.
- **Código de Autorização** — Código retornado pelo adquirente confirmando a autorização.
- **3DS** — Indica se a autenticação 3D Secure foi realizada e seu resultado.
- **Canal** — Canal de captura da transação (e-commerce, POS ou recorrente).
- **ID do Pedido** — Referência do pedido informada por você.
- **Jornada PIX** — Latência total da jornada de autorização do PIX. Expresso em milissegundos.
- **Tipo de PIX** — Indica se a transação PIX é de entrada (recebimento) ou saída (envio/devolução).

> **Nota:** A coluna "Vendedor" é oculta na visão do merchant, pois você é a si mesmo. Você não vê custo de adquirente nem margem PagSmile — esses são dados confidenciais da plataforma.

### KPIs da Lista
- **Total de Transações** — Quantidade de transações no período filtrado.
- **Transações Aprovadas** — Quantidade e participação das aprovadas no total. Expresso em quantidade e %.
- **Transações Recusadas** — Quantidade e participação das recusadas no total. Expresso em quantidade e %.
- **Volume Aprovado** — Soma dos valores das transações aprovadas. Expresso em R$.
- **Chargebacks** — Quantidade de transações em chargeback.

---

## 3. Transações — Detalhe (Visão do Merchant)

### Cabeçalho
- **Valor Formatado** — Valor bruto da transação em R$.
- **Status** — Badge com o estado atual da transação.
- **ID da Transação** — Identificador completo, com botão de copiar.
- **Badges** — Indicadores de antifraude, split e recorrência, quando aplicáveis.
- **Ações** — Estornar/Devolver (se aprovada), Capturar (se pré-autorizada), Cancelar (se pré-autorizada), Adicionar nota, Reenviar webhook, Imprimir.

### Tab: Visão Geral

**Timeline da Transação** — Sequência cronológica dos eventos da transação:
- **Transação Criada** — Registro inicial, com origem (canal de captura).
- **Análise Antifraude** — Resultado da análise, com provedor, score e recomendação.
- **3D Secure** — (apenas cartão) Status da autenticação, versão e ECI.
- **Autorizado/Recusado** — Resultado da autorização com código, NSU (cartão) ou E2EID (PIX).
- **Captura Confirmada** — (cartão aprovado) Confirmação da captura pelo adquirente.
- **Webhook Enviado** — Notificação enviada para você, com URL, status HTTP e tempo de resposta.
- **Previsto para Liquidação** — Data estimada de liberação do valor.

**Dados do Cartão** (apenas cartão):
- Bandeira, BIN, últimos 4 dígitos, tipo (crédito/débito), banco emissor, país de emissão, parcelamento, código de autorização, NSU e status do 3DS.

**Dados do PIX** (apenas PIX):
- E2EID, tipo de cobrança, chave PIX recebedora, tempo de pagamento e data de liquidação.

**Valores e Taxas Decompostos (Visão do Merchant):**
- **Valor Bruto** — Valor total da transação. Expresso em R$.
- **MDR** — Taxa de desconto principal cobrada sobre a transação. Expresso em R$ e %.
- **Antecipação** — Custo de antecipação, proporcional aos dias antecipados (apenas cartão parcelado). Expresso em R$ e %.
- **Taxa de Transação (Gateway)** — Tarifa fixa por transação processada na plataforma. Expresso em R$.
- **Antifraude** — Custo da análise antifraude quando realizada. Expresso em R$.
- **3DS** — Custo da autenticação 3D Secure quando aplicada. Expresso em R$.
- **Total de Taxas** — Soma de todos os componentes acima. Expresso em R$ e % do bruto.
- **Valor Líquido a Receber** — Bruto menos total de taxas menos retenção. Expresso em R$.
- **Data de Liquidação** — Data prevista para liberação.

> **Nota:** Você não vê custo de adquirente nem margem PagSmile — apenas o que você paga e o que você recebe.

**Dados do Cliente:**
- Nome, status de verificação, CPF, tempo de relacionamento, quantidade de transações anteriores, e-mail, telefone, endereço, IP, user agent, device ID, status de KYC, nível de risco, pedidos e data da última compra.

**Códigos de Referência:**
- ID PagSmile, ID do seu pedido, TID (identificador da transação no adquirente, cartão) e ARN (número de referência do adquirente, cartão).

**Metadata:**
- JSON completo enviado na criação da transação.

### Tab: Cliente
- **Dados do Cliente** — Mesmos campos da visão geral.
- **Jornada do Cliente** — Sequência de passos: visitou produto → adicionou ao carrinho → iniciou checkout → tentou pagar → aguardando confirmação.

### Tab: Eventos & Logs
- **Feed de Eventos** — Lista cronológica de eventos, com filtros por tipo (Sistema, Antifraude, Adquirente, Webhooks):
  - **Transação Criada** — origem e chave de idempotência.
  - **Antifraude Avaliada** — provedor, score, recomendação e regras disparadas.
  - **3DS Solicitado** — versão e URL do ACS.
  - **3DS Autenticado** — ECI, CAVV e XID.
  - **Adquirente Autorizou** — código de autorização, NSU e código de retorno.
  - **Webhook Entregue** — URL, status HTTP, tentativa e tempo de resposta.
  - **Liquidação Agendada** — data esperada e valor.
- Cada evento é expansível para exibir o payload JSON completo.

### Tab: API
- **Request do Cliente** — JSON enviado na criação (valor, moeda, método, parcelas, cliente, cartão, itens, metadata).
- **Response PagSmile** — JSON de retorno (ID, status, taxas, líquido, dados do adquirente, antifraude, 3DS e liquidação).
- **Request Adquirente** — JSON no formato do processador.
- **Response Adquirente** — JSON retornado pelo processador (TID, código de autorização, código de retorno).
- **Webhook Enviado** — JSON do evento enviado para você (tipo do evento, dados, ID de entrega).

### Tab: Antifraude & Relacionadas
- **Score Antifraude** — Pontuação de risco de 0 a 100. Quanto maior, maior o risco.
- **Recomendação** — Ação sugerida com base no score (aprovar, revisar manualmente ou recusar).
- **Provedor e Modelo** — Quem realizou a análise e versão do modelo utilizado.
- **Sinais Explicáveis** — Fatores individuais que compõem o score, cada um com resultado (pass/fail/caution) e impacto numérico:
  - Geolocalização do IP — consistência entre IP e endereço de cobrança.
  - Histórico do device — se o dispositivo já realizou compras anteriores.
  - Velocidade transacional — quantidade de transações recentes (atípica ou não).
  - Match nome × cartão — se o nome no cartão bate com o comprador.
  - Reputação do BIN — histórico de risco do BIN utilizado.
  - Idade do e-mail — tempo de existência e reputação do e-mail.
  - Padrão de horário — se a compra está em horário típico do cliente.
- **Transações Relacionadas** — Retries recusados e transações vinculadas (ID, valor, status e data).

> **Nota:** A visão do merchant não inclui os cards de governança (conciliação PagSmile × adquirente, eventos técnicos internos, comprovante administrativo) — esses são exclusivos da visão interna PagSmile.

---

## 4. Links de Pagamento

### Lista
- **Nome do Link** — Identificador do produto ou link de pagamento.
- **URL** — Link curto para compartilhamento com o cliente.
- **Imagem** — Imagem do produto associado ao link.
- **Health Score** — Score de 0 a 100 que avalia a saúde do link com base em conversão, volume, recência e status.
- **Valor** — Preço do produto. Pode ser fixo, aberto (cliente define) ou com valor mínimo.
- **Status** — Situação do link (ativo, inativo, expirado, esgotado ou rascunho).
- **Vendas** — Quantidade de conversões e % de conversão (vendas ÷ visitas).
- **Tendência** — Sparkline de performance recente.
- **Total Arrecadado** — Soma de tudo que foi arrecadado pelo link. Expresso em R$.
- **Última Venda** — Tempo decorrido desde a última conversão.

### KPIs
- **Total de Links** — Quantidade de links criados.
- **Links Ativos** — Quantidade e % dos links em status ativo.
- **Links com Problema** — Links ativos com muitas visitas e nenhuma venda. Quantidade.
- **Receita Total** — Soma arrecadada por todos os links. Expresso em R$.
- **Conversão Média** — Média das taxas de conversão de todos os links. Expresso em %.

### Detalhe (Drawer)
- **Configuração** — Valor, tipo, métodos aceitos, validade e máximo de usos.
- **Performance** — Visitas, vendas, conversão, receita e ticket médio.
- **Rastreamento** — Parâmetros UTM (source, medium, campaign) e referrer.
- **Gestão** — Pausar, ativar, editar, duplicar e excluir.

---

## 5. Recusas

### Lista
- **ID da Transação** — Identificador da transação recusada.
- **Comprador** — Nome do cliente.
- **Valor** — Valor da transação recusada. Expresso em R$.
- **Bandeira** — Bandeira do cartão utilizado.
- **Adquirente** — Processador que recusou a transação.
- **Motivo da Recusa** — Texto descritivo do motivo.
- **Categoria** — Classificação da recusa: soft decline (recuperável), hard decline (não recuperável), technical (falha técnica, recuperável) ou fraud (bloqueio antifraude, não recuperável).
- **Data** — Data e hora da recusa.

### Análise
- **Pareto de Motivos** — Ranking dos principais motivos de recusa com participação e quantidade. Expresso em % e quantidade.
- **Recusas por Bandeira** — Quantidade e % de recusa por bandeira.
- **Saúde de Orquestração** — Taxa de recusa por adquirente. Expresso em %.
- **Recuperabilidade** — Proporção de recusas que podem ser recuperadas (soft decline + technical). Expresso em %.
- **Heatmap Temporal** — Distribuição das recusas por hora × dia da semana. Expresso em quantidade.

---

## 6. Estornos

### Lista
- **ID Original** — Transação de origem do estorno.
- **ID do Estorno** — Identificador do estorno.
- **Tipo** — Estorno total ou parcial.
- **Valor** — Valor estornado. Expresso em R$.
- **Motivo** — Texto do motivo do estorno.
- **Data de Solicitação** — Quando o estorno foi pedido.
- **Data de Processamento** — Quando o estorno foi concluído.
- **Status** — Situação do estorno (estornado, parcialmente estornado ou pendente).

### Análise
- **Estornos por Motivo** — Ranking de motivos com quantidade e participação. Expresso em % e quantidade.
- **Estornos por Meio** — Distribuição entre cartão e PIX. Expresso em R$ e %.
- **Estornos por Operador** — Quem solicitou, com quantidade.
- **Tempo Médio** — Tempo entre solicitação e processamento. Expresso em horas ou dias.

---

## 7. Disputas / Chargebacks / MEDs / Pré-Chargebacks

### Lista (Cockpit Unificado)
- **Tipo** — Tipo de disputa (pré-chargeback, chargeback ou MED).
- **ID** — Identificador da disputa ou MED.
- **Transação** — ID da transação vinculada.
- **Cliente** — Nome do pagador envolvido.
- **Valor** — Valor em disputa. Expresso em R$.
- **Bandeira** — Bandeira do cartão (ou PIX, no caso de MED).
- **Status** — Situação atual (recebida, em análise, em contestação, etc.).
- **Urgência** — Nível de urgência calculado pelo prazo: crítica (menos de 24h), alta (menos de 72h), média (menos de 7 dias), expirada ou baixa.
- **Prazo** — Data limite para resposta.
- **Dias Restantes** — Dias até o prazo vencer.
- **Probabilidade de Vitória** — Estimativa de chance de ganhar a disputa (apenas chargebacks). Expresso em %.

### KPIs
- **Disputas Críticas** — Quantidade em aberto com urgência crítica.
- **Em Aberto** — Quantidade total de disputas em aberto.
- **Valor em Aberto** — Soma dos valores em disputa em aberto. Expresso em R$.
- **Valor em Risco** — Estimativa de exposição financeira das disputas em aberto. Expresso em R$.
- **Pré-Chargebacks** — Quantidade e valor. Expresso em quantidade e R$.
- **MEDs** — Quantidade e valor. Expresso em quantidade e R$.
- **Taxa de Vitória** — Proporção de chargebacks ganhos sobre o total de chargebacks resolvidos. Expresso em %.

### Detalhe
- **Evidências** — Documentos, screenshots e prova de entrega anexados à disputa.
- **Checklist** — Itens obrigatórios para montar a contestação.
- **Probabilidade de Vitória** — Score com explicação dos fatores que influenciam.
- **Ações Automatizadas** — Regras de auto-reembolso e auto-contestação configuradas.
- **Chargebacks por Ciclo** — Agrupamento por mês. Expresso em quantidade e R$.
- **MEDs por Tipo** — Distribuição por tipo de MED. Expresso em quantidade e %.
- **Pré-Chargebacks por Provedor** — Distribuição entre provedores de alerta (Ethoca e Verifi). Expresso em quantidade e %.

---

## 8. Recebíveis

### Lista
- **Data de Liquidação** — Data prevista para liberação, com indicador de quantos dias faltam (D+X).
- **Transação** — ID da transação vinculada.
- **Método** — Cartão ou PIX.
- **Parcela** — Número da parcela e total de parcelas.
- **Bruto** — Valor bruto do recebível. Expresso em R$.
- **Taxa** — Valor da taxa descontada. Expresso em R$.
- **Líquido** — Valor que será efetivamente recebido. Expresso em R$.
- **Status** — Situação do recebível (agendado, liquidado, antecipado ou bloqueado).

### KPIs
- **Total a Receber** — Soma dos valores líquidos no período. Expresso em R$.
- **Disponível para Antecipação** — Soma dos recebíveis elegíveis para antecipação. Expresso em R$.
- **Ticket Médio** — Valor médio por recebível. Expresso em R$.
- **Em Chargeback** — Soma dos recebíveis bloqueados por disputa. Expresso em R$ (alerta se maior que zero).

### Tab: Cessões e Ônus (CERC)
- **Data da Cessão** — Quando o recebível foi cedido a um terceiro.
- **Cessionário** — Banco ou FIDC que recebeu a cessão.
- **Valor Cedido** — Valor do recebível cedido. Expresso em R$.
- **Status CERC** — Situação do registro no CERC (registrado, cancelado ou liquidado).

### Tab: Em Chargeback
- **Recebível** — ID do recebível bloqueado.
- **Vencimento Original** — Data prevista antes do bloqueio.
- **Disputa** — Link para o chargeback vinculado.
- **Valor Bloqueado** — Valor retido. Expresso em R$.
- **Status** — Bloqueado.

### Detalhe
- **Buckets por Prazo** — Distribuição por janela de liquidação (D+0, D+1, D+7, D+15, D+30, D+60, D+90+). Expresso em R$ e quantidade por bucket.
- **Concentração** — Distribuição por meio e bandeira. Expresso em %.
- **Recebíveis em Disputa** — Lista dos recebíveis bloqueados.
- **Recebíveis Antecipados** — Lista dos já antecipados.
- **Forecast** — Projeção de liquidação futura. Expresso em R$.

---

## 9. Antecipação

### Lista
- **Disponível para Antecipar** — Soma dos seus recebíveis futuros elegíveis. Expresso em R$.
- **Nº de Recebíveis** — Quantidade de recebíveis elegíveis.
- **Taxa Atual** — Custo percentual mensal aplicado. Expresso em % ao mês.
- **Prazo de Crédito** — Tempo estimado para o valor cair na sua conta.

### Tab: Histórico
- **Data** — Quando a antecipação foi realizada.
- **Valor Bruto** — Valor antecipado. Expresso em R$.
- **Taxa** — Custo da antecipação. Expresso em R$.
- **Líquido** — Valor efetivamente recebido. Expresso em R$.
- **Status** — Concluída.

### Tab: Auto-Antecipação
- **Habilitar** — Liga ou desliga a antecipação automática.
- **Regra** — Critério de disparo (todas as transações, acima de X dias ou acima de X valor).
- **Dias Mínimos** — Quantidade mínima de dias para antecipar (se a regra for por dias).
- **Valor Mínimo** — Valor mínimo para antecipar (se a regra for por valor). Expresso em R$.
- **Taxa Máxima Aceitável** — Teto percentual para antecipar automaticamente. Expresso em %.

### Detalhe
- **Comparativo** — Análise entre antecipar, aguardar a liquidação natural ou buscar empréstimo. Custo de cada opção em R$ e %.
- **Simulador** — Ferramenta que calcula taxa e líquido a partir de um valor informado. A taxa é proporcional aos dias antecipados.
- **Pricing Tiers** — Faixas de volume com taxas diferenciadas. Expresso em R$ e %.
- **Resumo** — Total já antecipado e total de taxas pagas. Expresso em R$.
- **Decomposição** — Origem do valor disponível (vendas a liquidar, retenções, bloqueios).
- **Projeção** — Evolução do disponível ao longo do tempo.
- **Limite de Exposição** — Teto de antecipação permitido. Expresso em R$.
- **Cenários** — Simulações de diferentes cenários.

### Confirmação
- **Valor Bruto** — Valor a ser antecipado. Expresso em R$.
- **Taxa de Antecipação** — Custo descontado. Expresso em R$.
- **Valor Líquido** — Valor que será creditado. Expresso em R$.
- **Prazo** — Tempo estimado para crédito.

---

## 10. Taxas e Tarifas

### Taxas (MDR) por Modalidade
- **Crédito à Vista (1x)** — Taxa aplicada a transações de crédito em parcela única, variando por bandeira.
- **Parcelado 2-6x** — Taxa aplicada a transações parceladas de 2 a 6 vezes, variando por bandeira.
- **Parcelado 7-12x** — Taxa aplicada a transações parceladas de 7 a 12 vezes, variando por bandeira.
- **Débito** — Taxa aplicada a transações de débito, variando por bandeira.
- **PIX** — Taxa aplicada a transações via PIX.

### Tabela Completa 1-12x com Antecipação
- **Parcelas** — Número de parcelas (1 a 12).
- **MDR** — Taxa de desconto por faixa de parcelamento. Expresso em %.
- **Prazo Médio** — Tempo médio até a liquidação, em dias.
- **Custo de Antecipação** — Custo proporcional aos dias antecipados. Expresso em %.
- **Custo Efetivo Total** — Soma do MDR e do custo de antecipação. Expresso em %.

### Tarifas Fixas
- **Gateway** — Custo por transação aprovada processada na plataforma.
- **3DS** — Custo por autenticação 3D Secure realizada.
- **Antifraude Cartão** — Custo por análise antifraude em transação de cartão.
- **Antifraude PIX** — Custo por análise antifraude em transação PIX.
- **Pré-Chargeback** — Custo por alerta de pré-chargeback recebido (Ethoca/Verifi).
- **Chargeback** — Multa cobrada por chargeback recebido.
- **Saque TED** — Custo por operação de saque via TED.
- **Saque PIX** — Custo por operação de saque via PIX.
- **Estorno** — Custo por operação de estorno.
- **Boleto — Emissão** — Custo por boleto emitido.
- **Boleto — Compensação** — Custo por boleto compensado.

### Análise
- **Taxa Efetiva Média** — Média do custo total das suas transações em relação ao valor processado. Expresso em %.
- **Benchmarks de Mercado** — Comparação da sua taxa efetiva com a média do setor. Expresso em %.
- **Distribuição por Adquirente** — Participação de cada processador no seu volume. Expresso em %.

### Otimização IA
- **Recomendações** — Sugestões automáticas para otimização de custos.
- **Pricing Tiers** — Faixas de volume com taxas negociadas. Expresso em %.

### Simulador de Venda
- **Inputs** — Valor da venda, número de parcelas e bandeira.
- **Outputs** — Valor bruto, MDR, gateway, 3DS, antifraude, antecipação, custo total, valor líquido e taxa efetiva.

> **Nota:** Você vê apenas o que paga à PagSmile (MDR + antifraude + 3DS + gateway). Não vê custo de adquirente nem margem PagSmile — são informações confidenciais da plataforma.

---

## 11. Extrato Financeiro

### Lista
- **Data** — Data e hora do lançamento.
- **Tipo** — Crédito (entrada) ou débito (saída).
- **Categoria** — Tipo do lançamento (venda, estorno, chargeback, saque, antecipação, taxa, ajuste ou split).
- **Descrição** — Texto descritivo do lançamento.
- **Valor** — Valor do lançamento, positivo para créditos e negativo para débitos. Expresso em R$.
- **Saldo** — Saldo acumulado após o lançamento. Expresso em R$.
- **Contraparte** — Nome ou documento da outra parte envolvida.

### KPIs
- **Saldo Inicial** — Saldo no início do período. Expresso em R$.
- **Total de Entradas** — Soma dos créditos no período. Expresso em R$.
- **Total de Saídas** — Soma dos débitos no período. Expresso em R$.
- **Saldo Final** — Saldo atual ao fim do período. Expresso em R$.
- **Quantidade de Entradas/Saídas** — Contagem de lançamentos por tipo.

### Insights
- **Maior Entrada** — Crédito de maior valor, com data. Expresso em R$.
- **Maior Saída** — Débito de maior valor, com data. Expresso em R$.
- **Dia Mais Movimentado** — Data com maior volume de lançamentos.
- **Anomalias** — Lançamentos atípicos detectados automaticamente.

### Detalhe
- **Detalhe do Lançamento** — Todos os campos da entrada selecionada.
- **Drill-down** — Transação vinculada ao lançamento.
- **Waterfall** — Composição do saldo (entradas menos saídas).
- **Exportação** — Opções de exportação em CSV, Excel, PDF e OFX.

---

## 12. Saques

### Lista
- **ID** — Identificador do saque.
- **Valor** — Valor solicitado. Expresso em R$.
- **Tipo** — Forma de transferência (PIX, instantâneo, ou TED, D+0/D+1).
- **Conta Destino** — Banco e conta de destino.
- **Taxa** — Custo da operação. Expresso em R$.
- **Status** — Situação do saque (pendente, processando, concluído, falhou ou cancelado).
- **Criação** — Data e hora da solicitação.

### KPIs
- **Total Sacado (mês)** — Soma dos saques concluídos no mês. Expresso em R$.
- **Taxa Média** — Média das taxas cobradas. Expresso em R$.
- **Tempo Médio** — Tempo entre solicitação e conclusão. Expresso em horas.

### Resumo
- **Disponível para Antecipar (D+2)** — Valor elegível para antecipação com liquidação em D+2. Expresso em R$.
- **Antecipação em Processamento** — Valor em processo de antecipação. Expresso em R$.
- **Bloqueado em Disputas** — Valor retido por disputas. Expresso em R$.
- **Disponível para Saque** — Valor pronto para saque. Expresso em R$.

### Solicitar Saque
- **Saldo Disponível** — Valor disponível para saque. Expresso em R$.
- **Valor do Saque** — Valor a sacar, com atalhos para 50% e tudo.
- **Tipo** — PIX (instantâneo) ou TED (D+0/D+1).
- **Conta de Destino** — Lista de contas bancárias ativas.
- **Taxa de Saque** — Custo da operação, se aplicável. Expresso em R$.
- **Saldo Após Saque** — Preview do saldo restante. Expresso em R$.

### Configurações
- **Auto-saque** — Liga ou desliga o saque automático.
- **Frequência** — Periodicidade do saque automático (diária, semanal ou mensal).
- **Valor Mínimo** — Valor mínimo para disparar o auto-saque. Expresso em R$.
- **Saldo Mínimo a Manter** — Valor que deve permanecer na conta após o saque. Expresso em R$.
- **Tipo de Taxa** — Modelo de cobrança (gratuito, fixo ou percentual).
- **Valor da Taxa** — Valor da taxa conforme o modelo escolhido. Expresso em R$ ou %.

### Detalhe (Timeline)
- **Timeline de Status** — Histórico de mudanças de status com timestamps.
- **Detalhes Bancários** — Banco, agência, conta e chave PIX de destino.
- **Comprovante** — Opções de impressão e envio do comprovante.

---

## 13. Liquidações

### Lista
- **ID** — Identificador da liquidação.
- **Bruto** — Valor bruto liquidado. Expresso em R$.
- **Taxas** — Valor das taxas descontadas. Expresso em R$.
- **Estornos** — Valor dos estornos descontados. Expresso em R$.
- **Ajustes** — Ajustes aplicados (positivos ou negativos). Expresso em R$.
- **Líquido** — Valor final após descontos e ajustes. Expresso em R$.
- **Conta** — Banco e conta de destino.
- **Status** — Situação da liquidação (pendente, liquidada ou falhou).
- **Data de Criação** — Quando a liquidação foi gerada.
- **Data de Liquidação** — Quando foi concluída.

### KPIs
- **Total Liquidado (período)** — Soma dos líquidos liquidados. Expresso em R$.
- **Pendente de Liquidação** — Soma dos líquidos pendentes. Expresso em R$.
- **Taxa de Conciliação** — Proporção de liquidações conciliadas sobre o total. Expresso em %.

### Detalhe
- **Composição** — Breakdown visual de bruto, taxas, estornos, ajustes e líquido. Expresso em R$.
- **Timeline** — Sequência: criação → processamento → liquidação.
- **Análise Comparativa** — Comparação com período anterior. Expresso em %.

> **Regra de líquido:** Líquido = bruto - taxas - estornos + ajustes.

---

## Apêndice — Métricas Derivadas (Visão do Merchant)

- **Taxa de Aprovação** — Aprovadas ÷ total × 100. Em %.
- **Taxa de Recusa** — Recusadas ÷ total × 100. Em %.
- **Chargeback Ratio** — Chargebacks ÷ aprovadas × 100. Em %.
- **MED Ratio** — MEDs ÷ transações PIX × 100. Em %.
- **Conversão de Link** — Vendas ÷ visitas × 100. Em %.
- **Conversão de Checkout** — Pagamentos ÷ visitas em checkout × 100. Em %.
- **Ticket Médio** — Soma dos aprovados ÷ quantidade de aprovadas. Em R$.
- **Taxa Efetiva** — Total de taxas ÷ valor × 100. Em %.
- **Taxa de Recuperação** — Recuperadas ÷ recusadas × 100. Em %.
- **D+X (prazo)** — Dias entre a criação e a liquidação. Em dias.
- **Valor em Risco** — Estimativa de exposição das disputas em aberto. Em R$.
- **Retenção (rolling reserve)** — Parcela do bruto retida temporariamente como garantia. Em R$.
- **Liberação (D+30)** — Padrão de prazo de liquidação de cartão. Em dias.
- **Custo de Antecipação** — Proporcional aos dias antecipados. Em R$.
- **Win Rate (Disputas)** — Ganhos ÷ (ganhos + perdas) × 100. Em %.
- **Health Score (Link)** — Score de 0 a 100 baseado em conversão, volume e recência.
- **Urgência (Disputa)** — Calculada pelo prazo restante: crítica, alta, média, expirada ou baixa.

---

> **Fim do Catálogo — Visão Admin Sub.** Esta visão mostra ao merchant o que ele vende, o que ele recebe e o que ele paga, sem expor dados confidenciais da PagSmile (custo de adquirente, margem, conciliação 3-way).