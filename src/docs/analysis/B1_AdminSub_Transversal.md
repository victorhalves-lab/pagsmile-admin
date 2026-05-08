# Análise Microscópica — B1 Visão Transversal Admin Sub

> Documento-fonte: `B1_PagSmile_AdminSub_Transversal.md` (Bexperience, Maio 2026)
> Análise: 2026-05-08
> Método: inventário 100% das 40 propostas do doc (25 estratégicas + 15 padrões transversais) + benchmark real de mercado (Stripe, Adyen, Mercado Pago, Mercury, Linear, ChartMogul) + parecer fundamentado.

---

## 0. Sumário do que está no documento

O B1 contém **exatamente 40 propostas**, organizadas em:

- **25 oportunidades estratégicas numeradas** (seções 1–25), cada uma com Observação + Proposta + Inspiração.
- **15 padrões cross-tela** (lista final) sem numeração mas tratados como propostas executáveis.

Não há nenhuma proposta sobre código existente — é 100% visão de produto. Todas as 40 estão analisadas abaixo, na ordem do documento, sem pular nenhuma.

**Legenda do parecer:**

- 🟢 **Implementar** — ROI alto, baixo/médio risco, alinhado com competidores ou diferenciador real.
- 🟡 **Implementar com ajustes** — boa ideia mas escopo do doc está super-dimensionado, ambicioso demais ou mal priorizado.
- 🟠 **Adiar** — válido mas não prioritário hoje; só faz sentido após volumes/maturidade maiores.
- 🔴 **Descartar** — caro demais, baixo ROI, ou resolve problema que não temos.

---

## PARTE 1 — As 25 propostas estratégicas

---

### 1. Centro de gravidade — Home única + Cockpits

**Proposta do doc:** unificar 4 dashboards (Dashboard, DisputeDashboard, FinancialOverview, SubaccountsDashboard) em **Home configurável por role** + Cockpits especializados para drill-down.

**Benchmark:**
- **Stripe**: Dashboard único com widgets que mudam por permissão de usuário; "Home" é tela inicial e tudo mais é "drill-down". Não tem 4 dashboards competindo.
- **Mercury**: Home + Insights page (real-time customizable financial metrics, [Mercury docs](https://support.mercury.com/hc/en-us/articles/44277089544084-Insights-page-overview)). Hierarquia clara.
- **Mercado Pago**: home unificada com seção de "actividad" + widgets de cobrança/saldo.
- **Adyen**: Customer Area com hub central, módulos específicos como subseções.

**Análise:** o doc está 100% certo. Ter 4 telas chamadas "dashboard" sem hierarquia é débito de UX clássico de produto que cresceu por agregação. Toda referência de mercado tem **uma Home + drilldowns nomeados explicitamente** (não "dashboards"). O custo de renomear `DisputeDashboard → DisputesOverview`, `SubaccountsDashboard → MarketplaceOverview`, `FinancialOverview` (já tem nome correto) é baixíssimo. A parte de **widgets configuráveis por role** (CEO/Risk/Ops/Finance) é maior, mas já existe `CustomDashboards` no produto — basta promover essa engine para a Home.

**Parecer:** 🟢 **Implementar** — fase 1 (renomear) custa <1 sprint; fase 2 (widgets por role usando o builder existente) custa 2–3 sprints. ROI alto: reduz fricção que aparece em B2 (Dashboard duplicado), B8 (DisputeDashboard), B12 (SubaccountsDashboard) — uma decisão arquitetural elimina 3 problemas dos próximos B's.

**Risco:** rebranding pode confundir usuários atuais. Mitigar com tooltip "antes chamado X" por 60 dias.

---

### 2. Inbox universal de itens acionáveis

**Proposta do doc:** Inbox global agregando disputas com prazo, pré-CBs, retentativas, KYC pendente, saques, cartões expirando, cupons sem performance — com filtros de urgência/valor e ações inline.

**Benchmark:**
- **Linear Inbox**: padrão-ouro. Notificações de tudo que precisa atenção, com filtros e snooze.
- **Adyen Notification Center**: agregador de eventos de webhook/balance platform, foca em problemas técnicos ([docs](https://docs.adyen.com/account/notification-center)).
- **GitHub Notifications**: similar ao Linear.
- **Salesforce Home Tasks**: lista de approvals/assignments do dia.

**Análise:** essa é provavelmente a **proposta de maior ROI absoluto** do documento inteiro. Hoje o operador abre 5–7 telas só para descobrir o que precisa fazer. Adyen já tem isso para nicho técnico; nenhum PSP brasileiro tem (Stone/Cielo/PagSeguro/Pagar.me ficam todos no modelo "abra cada tela"). É **diferenciador competitivo claro** + **redutor de churn por fricção**.

**Risco:** se mal feita, vira sino de spam. Precisa de:
1. Filtros agressivos por padrão (só urgência alta + valor relevante).
2. Mark-as-read / snooze.
3. Configurabilidade por usuário (CEO vê diferente do operador).

**Parecer:** 🟢 **Implementar — prioridade máxima**. Sugestão de escopo MVP focado: 5 fontes (disputas com prazo <3d, pré-CBs, retentativas falhando, KYC pendente, saques aguardando aprovação) + filtro por urgência + ação inline. Restante (cartões expirando, cupons performando mal) entra na v2.

---

### 3. Linguagem natural / Cmd+K universal

**Proposta do doc:** caixa de comando global que aceita NL, roteia para o agente certo, executa ações inline.

**Benchmark:**
- **Stripe**: cmd+K é só busca/navegação ([Stripe docs](https://docs.stripe.com/dashboard/search)) — não executa ações.
- **Linear**: cmd+K executa ações (criar issue, mudar estado, etc.) — referência.
- **Notion AI inline**: similar.
- **Adyen, Mercado Pago, Stone, Cielo**: não têm cmd+K.

**Análise:** essa é a **única proposta cuja execução é genuinamente diferenciadora vs Stripe**. Stripe ainda não chegou lá. Mas atenção: o doc mistura 3 coisas em uma:
1. **Busca global** (transações, clientes, links, etc.) — fácil, cmd+K simples.
2. **Roteamento NL para agente** — médio, exige LLM router em cima dos 5 agentes que já existem.
3. **Execução inline de ações** — alto, precisa de tool-calling robusto.

**Parecer:** 🟢 **Implementar em fases**. Fase 1 (cmd+K busca + navegação rápida) é tabaqueiro de mesa, deve ser próximo passo após B1. Fase 2 (NL → agent routing usando InvokeLLM) é projeto trimestral. Fase 3 (execution) só depois de fase 2 estável. **Não tentar fazer tudo de uma vez** — Stripe levou 4 anos para chegar ao cmd+K atual e ainda não tem execução.

---

### 4. Modo guiado para usuário novo

**Proposta do doc:** tour por role + glossário inline + modo "explicado" + empty states educativos + setup checklist persistente.

**Benchmark:**
- **GitHub**: "complete your profile" checklist persistente — referência exata do doc.
- **Stripe**: tem onboarding flow (verificação) mas não tour por role.
- **Mercury**: empty states educativos excelentes.
- **Linear**: setup checklist é central, tira o user de "tela vazia".

**Análise:** o doc agrupa 5 sub-features. Vale separar:
- **Setup checklist persistente** = 🟢 alto ROI, baixo custo. Resolve activation problem.
- **Empty states educativos** = 🟢 baixo custo, alto impacto, deve ser sistemático (entra nos padrões cross-tela).
- **Glossário inline (hover em termos técnicos)** = 🟡 ideia boa mas alto esforço de manutenção. Sugiro fazer só em 10–15 termos críticos (VDMP, MRR, dunning, split, antecipação D+1, MED, ARN, NSU, AUM).
- **Modo "explicado" (toggle global de tooltips)** = 🟠 over-engineering. Preferir ter tooltips bons sempre, sem toggle.
- **Tour por role** = 🟡 valioso mas exige conteúdo cuidadoso, fácil ficar datado. Fazer só se houver budget para manter.

**Parecer geral:** 🟢 com escopo cortado. Fazer setup checklist + empty states + glossário em 10 termos. Ignorar toggle "explicado" e adiar tour por role.

---

### 5. Família visual unificada de agentes IA

**Proposta do doc:** unificar cor/layout dos 5 agentes (DIA, Recovery, Converter, Origination, Dispute) + criar Hub de Agentes.

**Benchmark:**
- **Salesforce Einstein**: família visual fortíssima (cor, ícone Einstein presente em tudo).
- **HubSpot Breeze**: similar.
- **Microsoft Copilot**: ícone unificado em todos os produtos.
- **Intercom Fin**: avatar + cor consistentes.

**Análise:** o doc está certo em diagnóstico mas **errado na proposta de cor**. Sugere "roxo PagSmile [#2bc196] como cor secundária" — mas `#2bc196` é VERDE (a cor primária da marca PagSmile no produto). Isso é um typo do doc. A real proposta é: **uma cor única para toda a família IA**, distinta da cor de produto. Recomendaria **roxo/violeta** (ex: `#7c3aed`) como cor de "IA" — separa identidade de agente da identidade do PagSmile.

Hub de agentes é importante porque hoje cada agente vive isolado — usuário não sabe nem quantos agentes existem.

**Parecer:** 🟢 **Implementar** — cor única para família IA + Hub `/AiAgents` listando os 5 + ícone consistente (Sparkles já é usado, manter). Custo: 2 sprints. ROI: alto em percepção de produto coeso (afeta upsell de planos com IA premium).

---

### 6. Automation Studio do merchant

**Proposta do doc:** builder visual onde merchant cria triggers + conditions + actions próprias. Inspiração Zapier/Make/Stripe Workflows.

**Benchmark:**
- **Stripe Workflows** ([docs.stripe.com/workflows](https://docs.stripe.com/workflows)): visual builder, lançado recentemente. É exatamente o que o doc propõe.
- **Make.com**: referência geral de no-code automation.
- **Zapier**: idem.
- **Pagar.me/Stone/Cielo**: nenhum tem.

**Análise:** essa é uma **megafeature de plataforma**. O paralelo com Stripe Workflows é correto — mas Stripe levou anos para construir e depende de uma camada de eventos consistente que cobre todo o produto. Antes de construir Automation Studio, o pré-requisito é **ter um Event Bus interno coerente** (transação criada, sub criada, KYC mudou, dispute aberta, etc.) — isso atravessa o backend inteiro.

**Risco de fazer cedo demais:** virar feature semi-funcional que ninguém usa porque os triggers/actions disponíveis são poucos.

**Parecer:** 🟠 **Adiar** para fase 2 do produto (12+ meses). **Antes**, fazer:
- Inventário de eventos disponíveis (provavelmente 30+).
- Inbox (proposta 2) primeiro — resolve 70% dos casos sem builder.
- Webhooks como infra robusta (já existe `/Webhooks`, mas gaps em Webhook Logs por evento — ver B16).

Quando tiver Event Bus + 50+ triggers + 30+ actions, **aí** Automation Studio faz sentido. Hoje seria over-engineering.

---

### 7. Audit Trail / Activity Log global

**Proposta do doc:** quem fez / o quê (com diff) / quando / onde / por quê (motivo opcional) / botão reverter.

**Benchmark:**
- **Stripe Events** + **Mercury Activity Log**: padrão-ouro.
- **GitHub Audit Log**: idem para SaaS.
- **AWS CloudTrail**: enterprise.

**Análise:** **obrigatório para fintech** — não é "nice to have", é **requisito de compliance** (LGPD, BACEN, regulação de PSPs). Quando o BACEN auditar, vão pedir isso. Surpreende não existir ainda.

Já existe `AuditLog` entity e `AuditLogs` page (no Admin Interno). Falta:
- Log gerado automaticamente em **toda mutação de configuração** (não só ações financeiras).
- **Tela visível para o merchant** (hoje só Admin Interno vê).
- Diff antes/depois.
- Reversão (alta complexidade — só para casos específicos como "voltar plano de tarifa anterior").

**Parecer:** 🟢 **Implementar — alta prioridade regulatória**. Versão simples (sem reversão) primeiro: instrumentar todas as funções `merchant/update*`, `risk/*`, `merchant/manage*` para gravar em `AuditLog` + criar `/SettingsActivity` no Admin Sub. Reversão fica para v2.

---

### 8. Mobile como experiência primária

**Proposta do doc:** app mobile real com 5–10 telas críticas + push notifications + 2FA mobile + widget.

**Benchmark:**
- **Stripe Dashboard mobile app**: existe e é bom — mas é app limitado, não substitui desktop.
- **Mercury**: app mobile sólido.
- **Mercado Pago**: app mobile é o produto principal ([Google Play](https://play.google.com/store/apps/details?id=com.mercadopago.wallet)) — mais de 100M downloads.
- **Stone, Cielo**: têm apps focados em maquininha + extrato, não em gestão completa.

**Análise:** Para PSP brasileiro, **mobile é crítico** porque PMEs operam pelo celular. Mas construir app nativo é projeto de 6+ meses com time dedicado. **A grande oportunidade é PWA (Progressive Web App)**: o produto já é React, dá para fazer 5 telas críticas funcionarem perfeito em mobile com instalação no home screen + push (via Web Push API) **sem app nativo separado**.

**Parecer:** 🟡 **Implementar com ajuste de escopo**. Em vez de "app mobile real", fazer:
- **PWA** com manifest + service worker.
- 5 telas mobile-otimizadas: Home, Notificações, Aprovação saque, Disputas urgentes, Saldo.
- Push via Web Push.
- 2FA via TOTP (Google Authenticator) — mais robusto que SMS, custa zero.

Adiar app nativo para quando houver volume de uso PWA validado. ROI vs custo de PWA é altíssimo; app nativo só se houver 10k+ usuários ativos diários no PWA.

---

### 9. Marketplace de Templates / Playbooks

**Proposta do doc:** biblioteca curada por vertical/tamanho ("Setup SaaS B2B", "E-commerce ticket alto", etc.) aplicável em 1-click.

**Benchmark:**
- **Vercel Templates**: marketplace robusto, alto uso.
- **Stripe Apps**: marketplace de apps, não de templates de configuração.
- **HubSpot Marketplace**: idem para CRM.
- **Recurly Recipes**: tem playbooks mas pouco usados.

**Análise:** ideia conceitualmente boa mas há **3 problemas práticos**:
1. **Quem cria os templates?** Curadoria interna exige time de produto/conteúdo dedicado.
2. **Verticais reais** do PagSmile hoje (SaaS, e-commerce, infoproduto, marketplace) provavelmente são poucos por enquanto — 4–5 templates iniciais é viável.
3. **Templates ficam datados** rapidamente conforme produto evolui. Manutenção contínua.

**Risco real:** virar feature morta com 5 templates que ninguém atualiza.

**Parecer:** 🟡 **Implementar mínimo**. Versão MVP: hardcoded com 4 playbooks (SaaS B2B / E-commerce / Infoproduto / Marketplace) que aplicam preset de 5–6 configs (dunning + checkout + fees + automations). **NÃO fazer marketplace user-generated** (proposta de "usuários publicarem playbooks") — isso é over-engineering massivo. Templates internos curados por hora.

---

### 10. Impact Preview universal (simulador de impacto)

**Proposta do doc:** antes do "Salvar" em config crítica (dunning, antifraude, fees), mostrar o impacto projetado rerodando os últimos 30 dias com a nova regra.

**Benchmark:**
- **Stripe Sigma queries com preview**: mais fraco que o proposto.
- **Sift simulator**: tem simulador de regras antifraude com replay histórico — referência.
- **Recurly dunning simulator**: tem simulador básico.
- **Lookalike no Meta Ads**: similar conceitualmente.

**Análise:** essa é uma das **propostas mais inovadoras do documento**. Replay histórico é tecnicamente caro mas **diferenciador real** porque resolve o problema-mor de configuração: "vou clicar em Save sem saber o efeito". Sift faz para antifraude e cobra alto — para PagSmile, fazer disso uma feature horizontal (em fees, dunning, antifraude, retention) é potencial USP.

**Custo:** alto. Cada feature precisa engine de replay próprio (não é genérico). Para fees, dá: rerrodar transações dos últimos 30d com tabela nova → mostrar delta de receita. Para dunning, idem. Antifraude é o mais complexo (precisa de scoring engine).

**Parecer:** 🟢 **Implementar em fases**. Fase 1: simulator de **fees** (mudança de plano/MDR) — já existe `merchant/simulateRates` no backend, basta UI. Fase 2: simulator de **dunning** (régua de retentativas). Fase 3: antifraude. Não fazer todos de uma vez.

---

### 11. PagSmile Health Score

**Proposta do doc:** score 0-100 visível em qualquer tela, decomposição ao clicar, comparação com peers do segmento, tendência, acionável.

**Benchmark:**
- **Stripe verification status**: existe mas é só "verified/pending/restricted", não score.
- **Shopify business health**: tem report mas não score persistente no header.
- **Brex Score**: existe.
- **Mercury Insights**: KPIs customizáveis ([docs](https://support.mercury.com/hc/en-us/articles/44277089544084-Insights-page-overview)) mas não score único.
- **NPS aplicado**: comum em SaaS.

**Análise:** ideia conceitualmente forte mas **risco grande de ser manipulada ou ignorada**. Score precisa de:
- Definição **muito clara** dos pesos (caso contrário, vira número aleatório).
- Comparação com peers (precisa de massa crítica de merchants para anonimizar).
- Acionabilidade (cada fator que puxou pra baixo precisa ter "como melhorar" real).

**Realisticamente**: PagSmile ainda não tem volume de merchants suficiente para benchmark anônimo confiável. E definir "saúde" do merchant é problema filosófico (CB ratio importa mais ou menos que MRR growth?).

**Parecer:** 🟠 **Adiar**. Antes, garantir os fundamentos: (a) cada KPI individual está correto e visível, (b) há massa crítica de merchants para benchmark. Health Score sem fundação vira gimmick.

**Alternativa imediata mais barata:** "**Atenção** card" no Dashboard listando 3 fatores que precisam atenção (CB ratio subindo / MRR caindo / dispute deadline próximo) — sem score, mas com a mesma função de "número resumo".

---

### 12. Camada de Forecast em telas-chave

**Proposta do doc:** "próximas 24h: 127 cobranças, R$ 38k previsto" em Recurrence/Anticipation/Subscriptions/Disputes/Withdrawals.

**Benchmark:**
- **Stripe Sigma**: tem forecasts via SQL ([Stripe Sigma](https://stripe.com/sigma)) — não inline em cada tela.
- **ChartMogul**: forecasting é central ([blog ChartMogul](https://chartmogul.com/saas-metrics/mrr/)) — mas é produto separado.
- **Baremetrics**: forecast é principal feature.
- **Recurly**: tem upcoming invoices preview.

**Análise:** Forecast simples (projeção de dados conhecidos, não ML) é **baixíssimo custo e altíssimo ROI**. Para cobranças recorrentes especialmente: o sistema **já sabe** quem vai cobrar amanhã — basta mostrar.

Categorias de forecast:
- **Determinístico** (cobranças agendadas, recebíveis a vencer, saques scheduled): trivial, fazer já.
- **Estatístico simples** (volume previsto baseado em últimos 7d): médio, fazer em fase 2.
- **ML real** (previsão de churn, fraude futura): adiar muito.

**Parecer:** 🟢 **Implementar — alta prioridade**, restrito a forecasts determinísticos. Esse é o tipo de feature que muda percepção de produto: "passa de relatório para central de comando" — exatamente como o doc diz.

---

### 13. Notification Center universal multi-canal

**Proposta do doc:** central única com config por evento + canal (email/SMS/WhatsApp/push/Slack/Discord/Teams/webhook) + por usuário + templates.

**Benchmark:**
- **Linear notifications**: simples e excelente.
- **GitHub notifications**: idem.
- **Adyen Notification Center** ([docs](https://docs.adyen.com/account/notification-center)): focado em webhooks técnicos.
- **Mercury alerts**: bom, multi-canal limitado.

**Análise:** sobreposto com proposta 2 (Inbox) e 13 (Notification Center). Atenção: **são coisas diferentes**:
- **Inbox** = itens **acionáveis** que precisam de decisão humana.
- **Notification Center** = histórico de **eventos passados** (alguém já fez/aconteceu).

Ambos são necessários. Mas o doc trata como duas coisas separadas, e isso é correto.

A parte **multi-canal** (WhatsApp/Slack/Teams/Discord) é over-engineering inicial. Email + SMS + push (in-app + browser) cobrem 90% dos casos. Slack/Teams via webhook (que já existe) basta.

**Parecer:** 🟢 com escopo cortado. Implementar Notification Center com 3 canais (email + SMS + in-app push) + webhook. WhatsApp e Slack/Teams/Discord nativos ficam para fase 2 — fácil de adicionar depois se a infra estiver bem feita. **Templates customizáveis por evento** é prioritário para evitar emails genéricos.

---

### 14. API/SDK como "produto first-class"

**Proposta do doc:** code view toggle em cada tela / Terraform provider / CLI / sandbox 1-click.

**Benchmark:**
- **Stripe CLI** ([docs](https://docs.stripe.com/stripe-cli)): referência absoluta.
- **AWS Console + Terraform**: padrão enterprise.
- **Vercel CLI**: bom.
- **Twilio Code Exchange**: code snippets em cada tela.

**Análise:** Para PagSmile, isso é **estratégia de mercado**: vai atacar developers (alta margem, alto LTV) ou continua focado em low-code merchants? Resposta determina se vale.

Sub-features:
- **Code view toggle** = baixo custo, alto ROI para merchants técnicos. 🟢 fazer.
- **CLI** = médio custo, alto ROI para devs. 🟢 fase 2.
- **Terraform provider** = alto custo, baixo uso real. 🟠 só se PagSmile tiver foco em customers enterprise/devops.
- **Sandbox separado 1-click** = a app já tem Test Database (viu no contexto deste sistema) — basta promover essa feature na UI. 🟢 fazer.

**Parecer:** 🟡 **Implementar com escopo cortado**. Code view + Sandbox toggle visível são quick wins. CLI fase 2. Terraform descartar.

---

### 15. Modos / Perfis de produto por vertical

**Proposta do doc:** SaaS / E-commerce / Marketplace / Infoproduto. Onboarding pergunta vertical e UI adapta (menu, dashboard, destaque de features).

**Benchmark:**
- **Shopify**: tem B2C/B2B/Wholesale modes — referência.
- **Salesforce**: Sales Cloud vs Service Cloud — separação total.
- **Notion**: templates por uso, não modos.

**Análise:** ideia válida mas **execução perigosa**. Riscos:
1. **Reorganizar menu por vertical fragmenta o produto** — usuário muda de vertical, precisa reaprender.
2. **Suporte fica caos** — "qual menu você está vendo?".
3. **Verticais não são limpos** — merchant pode ser SaaS + e-commerce ao mesmo tempo (ex: produto SaaS com loja de templates).

**Versão menos arriscada:** em vez de "modos", **personalização sutil**:
- Onboarding pergunta vertical → **pre-fill** de configurações (dunning + checkout + fees) com playbook (proposta 9).
- **Dashboard inicial** prioriza widgets relevantes (mas menu fica igual).
- **Sem reorganização de menu**.

**Parecer:** 🟡 **Implementar versão soft**. Sem modos rígidos — só pre-fill + dashboard inicial customizado. Evita armadilha de fragmentar produto.

---

### 16. Smart Insights cross-tela

**Proposta do doc:** insights que cruzam dados de telas diferentes ("Cliente João tem 3 chargebacks — sugerir bloqueio?").

**Benchmark:**
- **Stripe Radar**: cross-data fortíssimo.
- **Linear Insights**: sim.
- **Tableau Pulse**: sim.
- **HubSpot AI insights**: sim.

**Análise:** essa é a **promessa central do DIA Copilot** que já existe. Tecnicamente, basta dar ao DIA acesso a entidades cruzadas (Customer + Transaction + Dispute + Subscription) e ele faz isso via prompt. **Já existe `merchant/getDiaInsights` function** — falta promover em telas-chave.

**Parecer:** 🟢 **Implementar — extensão de produto existente**. Em vez de feature nova, é **expor** o DIA Copilot em pontos certos: card "DIA Insight" no topo de Customers, Subscriptions, Disputes, Fees. Custo baixo, ROI alto, **vende o produto IA que já existe**.

---

### 17. Modo Time / Multi-usuário com roles claras

**Proposta do doc:** atribuição de cases / comentários internos / @mentions / permissões granulares / aprovação 2-pessoas / workspace switcher.

**Benchmark:**
- **Linear assignees**: padrão-ouro.
- **Salesforce ownership**: enterprise.
- **Notion permissions**: granulares.
- **Mercury team controls**: bom.
- **Stripe Teams**: existe mas é binário (admin/member).

**Análise:** **crítico para growth para clientes médio/grande**. Hoje produtos B2C-leve (Stone/Mercado Pago) têm permissões binárias — perdem todo o segmento de merchants com 5+ pessoas operando. Stripe e Mercury investem pesado nisso.

Sub-features ranking:
- **Permissões granulares** (ver/editar/aprovar por feature) = 🟢 must-have para B2B sério. Já há `IBAccessProfile` e `AccessProfile` entities.
- **Atribuição de cases** = 🟢 médio custo, alto valor para Disputes/KYC/Saques.
- **Comentários internos + @mentions** = 🟢 baixo custo, alto valor.
- **Aprovação 2-pessoas** = 🟢 obrigatório regulatório para ações críticas (segregação de função).
- **Workspace switcher** (multi-empresa) = 🟠 adiar para v2.

**Parecer:** 🟢 **Implementar — alta prioridade**, exceto workspace switcher.

---

### 18. Documents Hub central

**Proposta do doc:** todos os PDFs gerados pelo sistema em um lugar (recibos, faturas, comprovantes), filtros, bulk download, customização de templates, versionamento.

**Benchmark:**
- **Mercury Statements**: bom, mas focado em extratos.
- **QuickBooks Documents**: referência.
- **Pluggy file vault**: existe.

**Análise:** **importância subestimada no Brasil** — contadores e CFOs vivem disso. Hoje cada módulo tem seu jeito de baixar PDF, e quando contador pede "todos os documentos do mês X", merchant precisa abrir 10 telas.

**Custo:** médio. Tecnicamente é uma view agregada sobre arquivos já gerados + endpoint de bulk download (zip). Customização de templates é o caro (white-label PDFs).

**Parecer:** 🟢 **Implementar versão MVP**. View agregada `/Documents` filtrável por tipo/data + bulk zip download. Customização de templates fica para v2.

---

### 19. World view multi-país/multi-moeda

**Proposta do doc:** switch BRL/USD/EUR + KPIs em moeda escolhida + análise por país + compliance por jurisdição + tax rules.

**Benchmark:**
- **Stripe multi-currency**: nativo, padrão-ouro.
- **Wise dashboard**: similar.
- **Adyen MarketPay**: cross-border profundo.

**Análise:** o doc reconhece "12-24 meses". Está certo. PagSmile é Brasil-first hoje. Construir multi-país antes de saturar Brasil é distração.

**Parecer:** 🔴 **Descartar para análise atual**. Reavaliar quando houver decisão estratégica de expansão.

---

### 20. Board Pack automático

**Proposta do doc:** PDF mensal com KPIs SaaS (MRR/ARR/Churn/LTV/NRR) com template board deck + comparação YoY + comentário inline.

**Benchmark:**
- **ChartMogul board pack**: produto separado pago ([blog](https://chartmogul.com/blog/investor-reporting-best-practices/)).
- **Pry forecasting**: similar.
- **Quaderno.io reports**: financial só.

**Análise:** **só faz sentido se PagSmile mira segmento SaaS B2B com investidores**. Para e-commerce médio brasileiro, board pack não é o que move agulha. ChartMogul cobra US$ 100+/mês só por isso porque atende SaaS startups VC-backed.

Para PagSmile, há proxy mais barato: **export universal** (proposta dos padrões transversais) + 2-3 templates de relatório PDF (Mensal Executivo / Mensal Financeiro / Mensal Risco).

**Parecer:** 🟡 **Implementar versão simplificada**. 2-3 templates de relatório PDF mensal automático, sem builder visual. Ignorar "comentário inline" e "comparação YoY" para v1.

---

### 21. Integração nativa com CRMs

**Proposta do doc:** HubSpot/RD/Pipedrive/Salesforce — sync bidirecional, customer linked record, transações na timeline do CRM, LTV como property, triggers de marketing.

**Benchmark:**
- **Stripe + HubSpot integration**: nativa, robusta.
- **Pipedrive marketplace**: tem Stripe nativo.
- **Recurly + HubSpot**: idem.
- **Pagar.me, Stone, Mercado Pago**: não têm CRM nativo.

**Análise:** **gap competitivo real** vs Stripe — merchant médio brasileiro usa RD Station ou HubSpot, e perde dados quando troca de PSP. Mas construir 4 integrações nativas profundas é alto custo.

**Estratégia mais inteligente:**
- **1 integração profunda primeiro** (HubSpot, é maior).
- Restante via **Zapier / Make** (que já existe via webhooks).

**Parecer:** 🟡 **Implementar 1 integração nativa profunda** (HubSpot) + documentar Zapier/Make recipes para outros 3. ROI real, escopo gerenciável.

---

### 22. Cobrança modular (builder de fluxo)

**Proposta do doc:** combinar blocos (trial + setup fee + recorrência + desconto + split + antecipação) em fluxos.

**Benchmark:**
- **Stripe Billing modular components**: exatamente isso.
- **Recurly subscription rules**: similar.
- **Chargebee billing engine**: idem.

**Análise:** sobrepõe muito com Subscription Plans + Recurrence existentes. O doc descreve como builder visual mas, na prática, **muitos desses "blocos" já existem** distribuídos:
- Trial = `SubscriptionPlan.trial_days`.
- Setup fee = `SubscriptionPlan.setup_fee`.
- Desconto inicial = `SubscriptionPlan.initial_discount_*`.
- Split = `SplitRule`.

**O que falta** não é builder novo, é **unificar a UX** para que merchant veja todos os blocos em um lugar quando cria um fluxo de cobrança.

**Parecer:** 🟡 **Refatorar UX existente**, não criar feature nova. Em vez de "Cobrança modular", **redesenhar SubscriptionPlanForm** para visualizar todos os blocos em um wizard. ROI alto sem esforço de plataforma nova.

---

### 23. Modo Demo / Sandbox destacado

**Proposta do doc:** toggle Demo/Production no top-right + sandbox público pré-signup.

**Benchmark:**
- **Stripe test mode toggle** (top-right): referência exata.
- **Linear demo workspace**: bom.
- **Vercel demo deployments**: bom.

**Análise:** o app **já tem Test Database** (visível em `<test_database_enabled>` no contexto desta plataforma). Falta apenas:
- **UI toggle visível** (hoje não é visual).
- **Banner "Você está em modo Teste"** quando ativo.
- **Dados de demo populados** automaticamente em modo teste.
- **Sandbox público pré-signup** (= landing page com demo embutida).

**Parecer:** 🟢 **Implementar — quick win**. Já existe infra, falta UX. Custo: 1–2 sprints. Sandbox pré-signup é fase 2.

---

### 24. Developer Hub / observabilidade

**Proposta do doc:** uptime + latência + API calls por endpoint + webhook deliverability + rate limits + logs com search + histórico API key.

**Benchmark:**
- **Stripe Developers Dashboard** ([docs](https://docs.stripe.com/development/dashboard)): referência absoluta.
- **Twilio Console**: similar.
- **Vercel Analytics**: bom.
- **Cloudflare Insights**: enterprise.

**Análise:** **diferenciador concreto vs PSPs brasileiros** — Stone/Cielo/PagSeguro/Pagar.me não têm. Stripe sim. Pra PagSmile mirar dev-friendly, é must-have.

Já existem entities e funções relacionadas: `Webhook`, `WebhookLog`, `merchant/monitorWebhookHealth`. Falta UX agregadora.

**Parecer:** 🟢 **Implementar**. Página `/Developers` agregando: status do gateway + API call stats + webhook deliverability + logs. Use entities existentes. Custo médio, ROI alto para segmento técnico.

---

### 25. Suporte com chat live + auto-diagnóstico

**Proposta do doc:** chat live com humano por SLA + status de incidentes + health check do merchant + auto-diagnóstico ("seu webhook falhou 5x") + upgrade path chatbot→humano.

**Benchmark:**
- **Stripe support tiers**: por plano.
- **Mercury concierge**: famoso pelo VIP.
- **Brex direct line**: VIPs.
- **Intercom inside-app chat**: padrão.

**Análise:** chat live com humano **depende de operação** (custo de pessoas), não só de produto. Mas:
- **Auto-diagnóstico** (insights baseados em logs do próprio merchant) = 🟢 puramente produto, alto valor.
- **Status de incidentes (banner)** = 🟢 baixo custo, alto valor de confiança.
- **Health check do merchant** dentro do Support = 🟢 conexão com proposta 11 (mas mais simples).
- **Upgrade path chatbot→humano** = 🟢 produto + processo.
- **Chat live com humano por SLA** = 🟡 depende de decisão de ops, não só produto.

**Parecer:** 🟢 **Implementar partes de produto** (auto-diagnóstico + status incidentes + health check). Chat live é decisão paralela.

---

## PARTE 2 — Os 15 padrões cross-tela

São padrões aplicáveis sistematicamente. Análise mais sucinta porque são padrões UX universalmente validados.

| # | Padrão | Parecer | Justificativa |
|---|--------|---------|---------------|
| **1** | Atalhos de teclado universais (cmd+K, cmd+/, etc.) | 🟢 | Stripe/Linear têm. Deve ser parte de uma sprint dedicada de "Power User UX". Custa pouco, fideliza muito. |
| **2** | Drill-down universal (todo número clicável vira lista filtrada) | 🟢 | Padrão Stripe/Mercury. Hoje 80% dos cards são estáticos — desperdício. Custo: convenção de código, não feature. |
| **3** | Empty states ricos (conceito + CTA + exemplo) | 🟢 | Já abordado em proposta 4. Quick win sistemático. |
| **4** | Toasts ricos (próxima ação, desfazer) | 🟢 | Linear/Notion fazem. Sonner já está instalado. Custa convenção. |
| **5** | Loading states com skeletons | 🟢 | Pure UX. Skeleton já existe em ui/skeleton. Convenção. |
| **6** | Save automático em formulários longos | 🟡 | Útil em forms grandes (Compliance, Checkout Builder). Não fazer universal — overkill. |
| **7** | URL como estado (filtros/tabs em querystring) | 🟢 | Padrão React Router. Resolve problema de "perdi minha view". Convenção. |
| **8** | Comparação com período anterior (toggle global) | 🟢 | Stripe/Baremetrics. Já parcialmente implementado em alguns KPI cards. Sistematizar. |
| **9** | Export universal (PDF/CSV/Excel/JSON) | 🟢 | Must-have para ops. Component reutilizável. |
| **10** | Print stylesheet | 🟠 | Nicho. Não fazer prioritário. |
| **11** | Bulk actions (checkbox em listas) | 🟢 | Já existe em algumas listas (transações). Sistematizar para todas. |
| **12** | Quick filters (chips no topo) | 🟢 | Padrão moderno. Substitui Selects buried. |
| **13** | Saved views (filtros como favoritos) | 🟢 | Stripe tem. Alto valor para ops repetitivos. |
| **14** | Comments / notes em qualquer entidade | 🟢 | Conexão com proposta 17 (multi-usuário). Implementar como sistema cross-entity. |
| **15** | Tags universais aplicáveis a qualquer entidade | 🟡 | Útil mas pode virar feature mal usada. Começar com 3 entidades (Customer, Transaction, Subaccount) e expandir conforme adoção. |

---

## PARTE 3 — Resumo executivo

### 🥇 Top 7 must-have (fazer primeiro)

1. **#2 Inbox universal** — maior ROI absoluto, diferenciador claro vs PSPs BR.
2. **#7 Audit Trail visível** — requisito regulatório + diferenciador.
3. **#1 Centro de gravidade (Home + Cockpits)** — 1 sprint elimina problemas em 4 telas.
4. **#12 Forecast determinístico** — passa produto de retrospectivo para central de comando.
5. **#17 Time/Multi-user com permissões granulares** — gating para ticket médio maior.
6. **#23 Demo mode UX (a infra já existe)** — quick win imediato.
7. **#16 Smart Insights via DIA** — extensão de feature existente, vende IA.

### 🥈 Top 5 fortes (segunda onda)

8. **#5 Família visual de Agentes IA + Hub** — coesão de produto.
9. **#10 Impact Preview (fees primeiro)** — diferenciador, baixa fricção.
10. **#13 Notification Center multi-canal (3 canais)** — sustenta resto.
11. **#14 Code view toggle + Sandbox** — atrai dev segment.
12. **#3 Cmd+K (busca + nav primeiro)** — base para Cmd+K com IA depois.

### 🟠 Adiar para fase 2 (12+ meses)

13. **#6 Automation Studio** — exige Event Bus maduro antes.
14. **#11 Health Score** — exige massa crítica e fundação melhor.
15. **#21 CRM nativo (1 só)** — após ARR justificar.
16. **#9 Playbooks** — após verticais validadas.
17. **#20 Board Pack simplificado** — sem prioridade hoje.
18. **#24 Developer Hub** — após decisão de mirar developers.
19. **#18 Documents Hub** — útil mas não crítico.
20. **#15 Modos por vertical (versão soft)** — fácil errar.

### 🔴 Descartar / Repensar

21. **#19 Multi-país/moeda** — fora de escopo até decisão estratégica.
22. **#8 App nativo mobile** — fazer PWA em vez disso (escopo redirecionado, não descarte total).
23. **#22 Cobrança modular como nova feature** — refatorar UX existente em vez disso (escopo redirecionado).
24. **#4 Modo "explicado" toggle global** — over-engineering. Manter os outros sub-itens da proposta.
25. **#9 Marketplace user-generated de playbooks** — adiar perpetuamente.

### Padrões cross-tela

12 dos 15 são 🟢 **fazer todos** — são pequenos individualmente mas, somados, são a diferença entre produto "amador" e produto "premium". Sugerir uma **Sprint UX Polish** dedicada cobrindo padrões 1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 13.

---

## PARTE 4 — Armadilhas a evitar (lendo o doc inteiro)

1. **Tendência a builders de tudo** (Automation Studio, Cobrança modular, Playbooks user-generated) — risco de over-engineering. Em fintech BR ainda em estágio de adoção, **wizards e templates curados** > builders genéricos.

2. **Sobreposição entre propostas**: Inbox (2) ≈ Notification Center (13) ≈ Smart Insights (16) ≈ DIA Copilot — cada uma com nome próprio. Recomendar **arquitetura unificada de "Avisos & Insights"** com 3 vistas (Inbox = acionável agora / Notifications = histórico / Insights = recomendações DIA), não 3 sistemas separados.

3. **"Cor PagSmile = roxo" no #5** é typo do doc (PagSmile é verde `#2bc196`). Ao implementar, validar paleta com Bexperience.

4. **Health Score (#11)** sem benchmark com peers anônimos é número aleatório. Não fazer antes de massa crítica.

5. **Multi-país (#19) e App nativo (#8)** parecem requisitos genéricos de "produto maduro" — mas são **escolhas estratégicas**, não defaults. Não implementar sem decisão de negócio explícita.

---

## PARTE 5 — Proposta de roadmap consolidado

### Q1 (próximas 12 semanas)
- Inbox universal MVP (5 fontes) — proposta 2.
- Audit Trail visível para merchant — proposta 7.
- Renomeação dos 4 dashboards + Home reorganizada — proposta 1.
- Forecast determinístico em Recurrence + Anticipation + Withdrawals — proposta 12.
- **Sprint UX Polish** (padrões 1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 13) — todos juntos.

### Q2
- Permissões granulares + atribuição de cases + comentários + @mentions — proposta 17.
- Demo mode UX (toggle visível + dados auto) — proposta 23.
- Smart Insights via DIA em Customers/Subscriptions/Disputes/Fees — proposta 16.
- Família visual IA + Hub de Agentes — proposta 5.

### Q3
- Notification Center 3 canais — proposta 13.
- Impact Preview em fees — proposta 10.
- Cmd+K busca + navegação (sem IA ainda) — proposta 3 fase 1.
- Documents Hub MVP — proposta 18.
- Aprovação 2-pessoas para ações críticas — proposta 17 fase 2.

### Q4
- Code view toggle + Sandbox separado — proposta 14.
- Cmd+K com routing IA (proposta 3 fase 2).
- Playbooks 4 templates curados — proposta 9.
- HubSpot integration nativa — proposta 21.

### Backlog (12+ meses, reavaliar)
- Automation Studio (proposta 6).
- Health Score (proposta 11).
- Board Pack (proposta 20).
- Developer Hub completo (proposta 24).
- Multi-país (proposta 19) — só se decisão estratégica.
- App mobile nativo (proposta 8) — só se PWA validar uso.

---

*Fim da análise B1. Aguardando B2 — Dashboard Executivo.*