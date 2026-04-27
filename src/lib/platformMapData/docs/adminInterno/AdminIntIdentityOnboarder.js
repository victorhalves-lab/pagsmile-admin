// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IDENTITY ONBOARDER (INTERNO) — Entrega 13 (FINAL)
// ----------------------------------------------------------------------------
// Cobre o 5º e ÚLTIMO agente do array `aiAgentsAdminInterno` em layout.jsx
// (linhas 415-421) — fecha o módulo ADMIN INTERNO completo.
//
//   1. AdminIntIdentityOnboarder.jsx          (925 linhas) — A MAIOR página entre TODOS os 5 hubs IA
//   2. AdminIntIdentityOnboarderSettings.jsx  (401 linhas) — Settings standalone 4 Tabs
//
// CONTEXTO IMPORTANTE — POR QUE ESTE AGENTE É O MAIS COMPLEXO E ESPECIAL:
// - É o ÚNICO agente do Admin Interno com SIMULADOR INTERATIVO funcional
//   (form CNPJ+Razão Social+MCC+Volume → 6 etapas progressivas com setTimeout 1500ms cada
//   → score random 60-100 → status condicional → 6 validações + recomendação)
// - É o ÚNICO que se associa a uma "marca de IA" identificada por nome (HELENA AI)
//   referenciada explicitamente em LABELS, BADGES, descriptions e na lógica do score
// - Hub usa Fingerprint icon indigo-purple (azul/violeta) — ÚNICA combinação cromática
// - Settings usa UserCheck violet-purple — DIFERENTE do Hub (gap de identidade visual igual ao Recovery)
// - Está conectado semanticamente com:
//   • Helena AI (treinamento ML 96/94/95 documentado em AdminIntComplianceHelena)
//   • Compliance Queue (Link real `?id=${item.id}` cross-page funcional)
//   • Liveness + Facematch (ScanFace icon — toggle "livenessRequired")
// - Schemas que DEVERIAM ser usados (mas não são): Subaccount.kyc_data,
//   ai_compliance_score, ai_compliance_status, liveness_facematch_status, is_pep
//
// ASSINATURA HISTÓRICA — Identity Onboarder é o agente que finaliza a documentação
// completa do Admin Interno (87 páginas no total: 1 Dashboard + 10 Compliance + 9 Merchants
// + 25 Profile Tabs + 9 Transactions + 11 Financial + 10 Risk + 6 Reports + 6 Communication
// + 13 Administration + 10 AI Agents = 76 menu visíveis + 25 sub-tabs Profile = 100% mapeado).
// ============================================================================

export const AdminIntIdentityOnboarderDoc = {
  pageId: 'AdminIntIdentityOnboarder',
  pagePaths: [
    '/AdminIntIdentityOnboarder',
    '/AdminIntIdentityOnboarderSettings',
  ],
  module: 'Admin Interno',
  section: 'Agentes IA — Identity Onboarder (Hub + Settings) — 5º e ÚLTIMO agente',

  explainer: {
    oneLiner:
      'Quinto e ÚLTIMO agente IA do Admin Interno (sidebar separada `aiAgentsAdminInterno[4]` — layout.jsx linha 420) — 2 páginas (925L Hub + 401L Settings = 1.326 linhas analisadas) AMBAS 100% MOCK — KYC/KYB Copilot com a maior complexidade arquitetural entre todos os agentes da plataforma. (1) **AdminIntIdentityOnboarder 925L** é A MAIOR página entre TODOS os 5 hubs IA do Admin Interno (atrás apenas do PagSmileCopilot 878L em volume mas com complexidade interativa MUITO superior — Identity tem 1 simulador funcional com state machine, 1 fila com Links cross-page reais, 1 analytics tab e 1 settings tab inline c/ 16 campos): Header com **Fingerprint icon** (único do Admin Interno) em gradient indigo-500 to purple-600 (identidade visual ÚNICA — combinação azul-violeta que nenhum outro agente usa: PagSmile=purple solo, Recovery=orange-red, Converter=blue-indigo, Dispute=red-orange) + título "Identity Onboarder" + subtítulo "KYC/KYB Copilot - Validação Inteligente de Identidade" + Badge ESPECIAL DIFERENTE de todos os outros agentes (em vez de contador "X disputas/merchants" tem indicador "Helena AI Ativa" com Brain icon indigo + bg-indigo-500/10 + border-indigo-500/20 — comunica STATUS DO AGENTE em vez de KPI) + Link → AdminIntIdentityOnboarderSettings (página standalone que DUPLICA inline tab "helena-config" mas com KEYS DIVERGENTES — gap arquitetural similar ao PagSmile e Dispute mas com OUTRO sub-padrão); state local extremamente rico (a maior collection state entre os 5 hubs IA): selectedTab string default "simulator" / simulationStep number 0-6 controlando state machine progressiva / simulationData object com 6 fields (cnpj, businessName, openingDate, mcc, estimatedVolume, address) / simulationResults object|null com 8 sub-fields (score, status, validations c/ 6 sub-objects, recommendation, processingTime) / isProcessing boolean / isChatOpen+isFullscreen para chat / helenaSettings com 14 keys (helenaEnabled / autoApproveThreshold 80 / autoRejectThreshold 30 / highRiskMCCAutoApproveLimit 70 / requireManualForHighRiskMCC TRUE / 5 weights mcc=25 / address=20 / document=25 / pep=15 / financial=15 — TOTAL=100 default / pepCheckRequired+sanctionsCheckRequired+addressVerificationRequired+livenessRequired); KPI grid-cols-2 md:grid-cols-3 lg:grid-cols-6 (idêntico em layout aos Recovery e Dispute) com 6 cards: Total Submissões 234 c/ "este mês" / Pendentes 18 amber-50 c/ AlertTriangle e "aguardando" / Tempo Médio 4.2h c/ Zap e "processamento" / Auto-Aprovação 67% green-50 c/ "taxa Helena" / Revisão Manual 28% c/ Eye / Recusas 5% red-50 c/ XCircle e "taxa geral" — destaque para o cálculo: 67% + 28% + 5% = 100% (corretos matematicamente, ao contrário de outros agentes que têm KPIs sem coerência interna); Tabs principal grid-cols-4 com 4 tabs ÚNICAS no ecosistema: ("simulator" / "queue" / "analytics" / "helena-config"): (a) **simulator tab é A FEATURE MAIS COMPLEXA E ÚNICA de TODO o Admin Interno** — Card "Simulador de Validação KYC/KYB" com Play icon indigo + grid-1 lg:grid-3 (1/3 form esquerda + 2/3 progress+results direita): FORM esquerda tem 4 fields obrigatórios (Input CNPJ placeholder "00.000.000/0000-00" / Input Razão Social / Select MCC com 5 opts de demonstração [5411 Supermercados / 5812 Restaurantes / 5912 Farmácias / 5999 E-commerce Geral / 7995 Jogos/Apostas (Alto Risco)] / Select Volume Mensal 4 opts [Até R$ 50k / 50-500k / 500k-2M / Acima 2M]) + 2 Buttons (Iniciar Simulação indigo-600 c/ Loader2 spin condicional + RefreshCw icon Reset condicional `(simulationStep > 0 || simulationResults)`); BOTÃO DESABILITADO inline `disabled={isProcessing || !simulationData.cnpj || !simulationData.businessName}` — VALIDAÇÃO REAL dos campos obrigatórios MAS apenas client-side e binária; FUNÇÃO `startSimulation` é UMA STATE MACHINE PROGRESSIVA REAL (única em todo o Admin Interno) — early return se !cnpj OR !businessName / setIsProcessing(true) / setSimulationStep(1) / async loop `for (let i = 1; i <= 6; i++) { await new Promise(resolve => setTimeout(resolve, 1500)); setSimulationStep(i); }` — TOTAL 9 SEGUNDOS DE ANIMAÇÃO PROGRESSIVA REAL / após loop calcula `score = Math.floor(Math.random() * 40) + 60` (range 60-100, NUNCA gera scores baixos para garantir UX positiva) / status condicional ternário aninhado `score >= 80 ? "approved" : score >= 50 ? "manual_review" : "rejected"` / setSimulationResults com 6 validations (cnpj VÁLIDO HARDCODED / address VÁLIDO HARDCODED / partners CONDICIONAL `score >= 70 ? valid : warning` / pep VÁLIDO HARDCODED / sanctions VÁLIDO HARDCODED / mcc CONDICIONAL `score >= 60 ? valid : warning`) — apenas 2 das 6 validations refletem o score random, as outras 4 são SEMPRE valid (gap de mock); recommendation string condicional 3 opts; processingTime FAKE "3.2s" enquanto o real foi 9000ms + render time; PROGRESS direita renderiza 6 etapas em rows com STYLING TRIPLO CONDICIONAL `isCompleted=simulationStep>idx isCurrent=simulationStep===idx+1 isPending=simulationStep<=idx` que produz 3 estilos visuais distintos (border-green-200 bg-green-50 c/ CheckCircle2 white em circle green / border-indigo-300 bg-indigo-50 c/ Loader2 spin white em circle indigo / border-slate-200 bg-slate-50 c/ step.icon dinâmico); 6 etapas hardcoded em array `simulationSteps` cada com `id+label+icon` (Building2 Dados Cadastrais / FileCheck Validação CNPJ / User Análise Sócios / Shield Verificação PEP / Scale Análise Risco / CheckCheck Decisão Final); RESULTS card RENDERIZADO CONDICIONAL `{simulationResults && (...)}` com animação CSS `animate-in fade-in duration-500` (única no Admin Interno) — Score Card com border duplo condicional 3 cores (green/amber/red) + Brain icon w-8 h-8 + "Helena AI Score" label + "{score}/100" 3xl bold + statusBadge + Progress h-3 + recommendation string + processingTime; Validation Details grid-2 com `Object.entries(simulationResults.validations).map` iterando 6 validations c/ icon condicional CheckCircle2 green ou AlertTriangle amber + key.replace(/_/g, " ") capitalize + message; EMPTY STATE renderizado quando NÃO há simulação `{!simulationResults && simulationStep === 0 && (...)}` com ScanFace icon w-16 h-16 cinza + "Pronto para simular" + "Preencha os dados e clique em Iniciar Simulação" em border-dashed — TRÊS RENDERS CONDICIONAIS DISTINTOS no mesmo container direito (steps progress sempre / results se existe / empty se não started) é PADRÃO ÚNICO na plataforma; (b) **queue tab é UNICA com cross-link REAL**: Card c/ Search Input + Filter Button (sem behavior) + 3 mocks pendingQueue cada um sendo CARD COM PRIORIDADE TRIPLA `item.priority === "critical" ? red border : item.priority === "high" ? amber border : slate default` — KYC-2024-001 TechStore Brasil normal/87 score/2.5h waiting / KYC-2024-002 Fashion Express HIGH/45 score/3.8h waiting / Sócio com restrições + Endereço inconsistente / KYC-2024-003 GameZone Digital CRITICAL/23 score/5.2h waiting + 3 red flags CNPJ com restrições graves + PEP identificado + Setor de alto risco; cada card tem Building2 icon condicional 3 cores `helenaStatus === approved ? green : manual_review ? amber : red` + nome + Badge type.toUpperCase() (KYC_FULL/KYC_PIX) + cnpj+ID+timestamp / 3 cols stats (Helena Score colorido condicional 3 cores `>=70 green / >=40 amber / red` + statusBadge / Em Fila waiting time / Botão "Analisar" indigo COM **Link to={createPageUrl("AdminIntComplianceReview") + `?id=${item.id}`}** — CROSS-PAGE LINK REAL com query string passando ID — ÚNICO Link DESTE TIPO entre todos os 5 agentes IA do Admin Interno; Red Flags renderizadas CONDICIONAL `{item.redFlags && item.redFlags.length > 0 && (...)}` em pt-4 border-t com AlertTriangle red + texto "Red Flags:" + Badge variant outline border-red-300 text-red-600 bg-red-50 para cada flag — design pattern único; (c) **analytics tab é simples** mas com algoritmo de barras CSS divs (NÃO usa Recharts, diferente de Recovery+Converter+Dispute que usam) — grid-2 com Card "Distribuição de Decisões" usando map de 3 items (Auto-Aprovados 67% green / Revisão Manual 28% amber / Recusados 5% red) cada com label + value bold + barra horizontal h-3 c/ width inline `${item.value}%` (sem Math.max do PagSmile) + Card "Performance Helena AI" com 4 rows grid-2 [Precisão 94.2% green / Tempo 2.8s / Falsos Positivos 3.1% amber / Falsos Negativos 0.8% red] — 4 KPIs ML clássicos (precisão/tempo/FP/FN) que apenas este agente exibe; (d) **helena-config tab é a DUPLICAÇÃO PARCIAL da Settings standalone** (mesmo padrão de PagSmile e Dispute mas COM EVOLUÇÃO crítica de UX): grid-1 lg:grid-2 com Card "Thresholds de Decisão" (Switch helenaEnabled / Slider autoApproveThreshold 60-95 step 5 c/ Label dinâmico "{N}" green-bold + descrição contextual / Slider autoRejectThreshold 10-50 step 5 c/ Label "{N}" red-bold / **Bloco amber INTELIGENTE INLINE** "Zona de Revisão Manual: Scores entre {autoRejectThreshold} e {autoApproveThreshold} serão encaminhados para análise manual" — TEXTO DINÂMICO REAL que reflete os valores dos sliders em tempo real — UX SUPERIOR a todos os outros settings que apenas exibem valores estáticos / Slider highRiskMCCAutoApproveLimit 50-90 / Switch requireManualForHighRiskMCC) + Card "Pesos de Risco no Score" (5 Sliders min=5 max=40 step=5 com Icon dinâmico [Target/Building2/FileText/ShieldCheck/Scale] + label + valor "{N}%" + **Bloco SOMA REAL EM TEMPO REAL** `helenaSettings.mccWeight + addressWeight + documentWeight + pepWeight + financialWeight` exibindo "Total: X%" + WARNING CONDICIONAL `if (total !== 100) → ⚠️ O total deve ser 100%` — VALIDAÇÃO MATEMÁTICA REAL (única no Admin Interno entre todos os agentes — outros settings não fazem checks de soma)) + Card "Validações Obrigatórias" grid-4 com 4 Switches (PEP/Sanctions/Address/Liveness) + ALGUNS COM Badge "Crítico" red HARDCODED (PEP+Sanctions têm Badge mas Address+Liveness não) + Save Button indigo SEM onClick efetivo (mesmo gap do Hub do Dispute Manager); AgentChatInterface com accentColor="#6366f1" (indigo-500 — diferente do header gradient indigo-500 to purple-600) processIdentityOnboarderMessage de @/components/agents/IdentityOnboarderChatLogic + AgentFloatingButton fixed; (2) **AdminIntIdentityOnboarderSettings 401L** é A MENOR settings page entre os agentes (Recovery=366L / PagSmile=359L / mas Identity=401L tem mais MOLDAGEM DE DADOS do que código): Header c/ ArrowLeft Link → AdminIntIdentityOnboarder + **UserCheck icon violet-500 to purple-600 gradient (DIFERENTE do Hub que usa Fingerprint indigo-500 to purple-600 — gap de identidade visual igual ao Recovery onde Hub orange-red e Settings amber-orange)** + título "Configurações do Identity Onboarder" + 2 Buttons Resetar+Salvar **violet-600 (DIFERENTE da cor do Hub indigo-600 — outra inconsistência cromática)**; settings state com 18 KEYS distribuídas em 5 grupos (Helena 3 / Risk Weights 5 / Validations 4 / High Risk MCCs 2 / Notifications 5 c/ documentExpiryDays 30 que é EXCLUSIVO desta página); 4 Tabs grid-cols-4 (helena/weights/validations/notifications): (a) "helena" tab tem 2 Cards: Card 1 "Configurações da Helena AI" c/ Switch + 2 Sliders c/ Layout DIFERENTE do Hub (Settings tem flex-1+span w-16 right text-lg-bold-color {N} — IDÊNTICO ao padrão do Converter/Dispute settings — enquanto Hub tem Label inline "Threshold de Auto-Aprovação: {value}" — UX inconsistente entre as 2 páginas mesmo agente); Bloco amber Inteligente IDÊNTICO ao Hub "Zona de Revisão Manual entre {autoRejectThreshold} e {autoApproveThreshold}" — REPLICADO; Card 2 "MCCs de Alto Risco" c/ 1 Slider 50-90 + 1 Switch (b) "weights" tab REPLICA o Pesos de Risco do Hub mas SEM SOMA EM TEMPO REAL no fim (Settings tem soma e warning idêntico ao Hub — aqui são iguais); (c) "validations" tab REPLICA grid-4 mas com 4 ROWS verticais (não grid) cada um c/ DESCRIPTION MAIS RICA que o Hub: "Pessoa Politicamente Exposta" / "Listas OFAC, ONU, UE" / "Comprovante de endereço válido" / "Prova de vida com foto do documento" — Settings é o ÚNICO lugar onde essas descrições aparecem (não estão no Hub); (d) "notifications" tab é EXCLUSIVA da Settings (Hub não tem notifications inline — diferente de PagSmile e Dispute que duplicam tudo) — 4 rows de Switches: notifyAutoApproved DEFAULT FALSE (único default false) / notifyAutoRejected DEFAULT TRUE / notifyManualReview DEFAULT TRUE / **notifyDocumentExpiring c/ Input number "X dias" disabled-when-switch-off** — único agente que tem notification baseada em EXPIRAÇÃO DE DOCUMENTOS (relevante para KYC/KYB) com documentExpiryDays default 30; saveBehavior é `alert("Configurações da Helena AI salvas com sucesso!")` — IGUAL aos outros 4 settings (todos 5 settings dos agentes usam alert browser nativo em vez de toast). PADRÕES TRANSVERSAIS EXCLUSIVOS DESTE AGENTE (achados arqueológicos finais): (i) ÚNICO com SIMULADOR INTERATIVO funcional (state machine progressiva 6 etapas + setTimeout 1500ms cada + Math.random) — feature de demo única; (ii) ÚNICO que executa CROSS-PAGE LINK REAL com query string `?id=${item.id}` para AdminIntComplianceReview; (iii) ÚNICO que tem **soma matemática em tempo real** dos pesos com warning se !== 100% (validação UX real entre os agentes); (iv) ÚNICO que mostra **Zona de Revisão Manual com texto dinâmico** que reflete sliders ao vivo; (v) ÚNICO que NÃO usa Recharts — analytics tab usa barras CSS divs h-3 simples (mais limpo que PagSmile que usa Math.max hack); (vi) ÚNICO que tem **3 renders condicionais distintos no mesmo container** (steps progress sempre + results se existe + empty state se não started); (vii) ÚNICO que se identifica com NOME PRÓPRIO de IA (HELENA AI) referenciada em labels, badges, descriptions; (viii) ÚNICO com **animação CSS animate-in fade-in duration-500** no results; (ix) Hub usa Fingerprint icon indigo MAS Settings usa UserCheck icon violet — gap de identidade visual interno; (x) Score generator `Math.floor(Math.random() * 40) + 60` SEMPRE gera scores >= 60 — viés UX para resultado positivo (gap de mock que distorce demo); (xi) 4 das 6 validations são SEMPRE valid (cnpj/address/pep/sanctions hardcoded) — apenas partners e mcc respondem ao score random; (xii) Cores hardcoded distintas: Hub gradient indigo-500 to purple-600 / Hub buttons indigo-600 / Settings gradient violet-500 to purple-600 / Settings buttons violet-600 / Chat accentColor #6366f1 (indigo-500); (xiii) ÚNICO agente cujo Badge live no header NÃO é contador de KPI (PagSmile=Monitorando 1247 / Recovery=847 ativos / Converter=892 ativos / Dispute=156 abertas) mas é STATUS DO AGENTE ("Helena AI Ativa"); (xiv) Settings tem TAB notifications EXCLUSIVA com documentExpiryDays — único campo desse tipo entre TODOS os settings dos agentes (notification baseada em expiração temporal de documentos é específico de KYC/KYB).',

    hubMicroscopic: {
      role: 'Hub principal "KYC/KYB Copilot - Helena AI" — agente FINAL e mais ARQUITETURALMENTE COMPLEXO do Admin Interno',
      menuPosition: '`aiAgentsAdminInterno[4]` — array linha 420 do layout.jsx — 5º e ÚLTIMO agente da sidebar separada',
      uniqueAmongAgents: 'SIMULADOR INTERATIVO state machine + Cross-page link real + Soma matemática em tempo real + Zona dinâmica + 3 renders condicionais no mesmo container + Animação fade-in + Helena AI nomeada explicitamente',

      pageHeader: {
        icon: 'Fingerprint indigo-500 to purple-600 gradient w-14 h-14 com shadow-indigo-500/25 — ÚNICA combinação cromática (azul-violeta) e ÚNICO uso de Fingerprint entre os 5 agentes',
        title: '"Identity Onboarder"',
        subtitle: '"KYC/KYB Copilot - Validação Inteligente de Identidade"',
        liveBadge: 'div em vez de Badge — `bg-indigo-500/10 border-indigo-500/20` com Brain icon indigo + "Helena AI Ativa" — STATUS de agente em vez de contador KPI (DIFERENTE de todos os outros agentes que mostram contadores)',
        actionButton: 'Link → AdminIntIdentityOnboarderSettings (página separada com state que DUPLICA Tab "helena-config" do Hub)',
      },

      stateManagement: {
        selectedTab: 'string default "simulator" — controla Tabs principal',
        simulationStep: 'number 0-6 — STATE MACHINE progressiva (0=idle, 1-6=etapas, post-6=concluído)',
        simulationData: 'object 6 fields {cnpj, businessName, openingDate, mcc, estimatedVolume, address}',
        simulationResults: 'object|null com 8 sub-fields {score, status, validations 6 sub-objects, recommendation, processingTime}',
        isProcessing: 'boolean — controla disabled de Buttons + Loader spinners',
        isChatOpen: 'boolean — controla AgentChatInterface',
        isFullscreen: 'boolean — toggle fullscreen do chat',
        helenaSettings: 'object 14 keys — DUPLICADO PARCIAL da Settings standalone (Settings tem 18 keys — 4 EXCLUSIVAS Settings)',
      },

      hardcodedDataSources: {
        kpis: '6 KPIs (234 totalSubmissions / 18 pendingAnalysis / 4.2h avgProcessingTime / 67% autoApprovalRate / 28% manualReviewRate / 5% rejectionRate) — único agente com KPIs MATEMATICAMENTE COERENTES (67+28+5=100)',
        pendingQueue: '3 itens DETALHADOS (cada um com 9 fields incluindo redFlags array opcional, priority, helenaScore numérico, helenaStatus string)',
        simulationSteps: '6 etapas com {id, label, icon} (Building2 / FileCheck / User / Shield / Scale / CheckCheck) — array hardcoded para iteração',
        decisionsDistribution: '3 items inline em analytics (Auto 67% green / Manual 28% amber / Rejeitados 5% red) — IDÊNTICOS aos KPIs (consistência interna)',
        helenaPerformanceMetrics: '4 ML metrics (Precisão 94.2% / Tempo 2.8s / FP 3.1% / FN 0.8%) — único agente com FP/FN explícitos',
      },

      simulatorTab: {
        uniqueness: 'A ÚNICA TAB INTERATIVA com STATE MACHINE entre todos os agentes IA do Admin Interno',
        cardLayout: 'grid-cols-1 lg:grid-cols-3 — 1/3 form esquerda + 2/3 progress+results direita',

        leftFormColumn: {
          fields: [
            'Input CNPJ * placeholder "00.000.000/0000-00"',
            'Input Razão Social *',
            'Select MCC com 5 opts demo (5411 Supermercados / 5812 Restaurantes / 5912 Farmácias / 5999 E-commerce / 7995 Jogos/Apostas Alto Risco)',
            'Select Volume com 4 opts (até R$ 50k / 50k-500k / 500k-2M / acima 2M)',
          ],
          buttonGroup: '[Iniciar Simulação indigo-600 c/ Loader2 spin condicional / Reset RefreshCw condicional `(simulationStep > 0 || simulationResults)`]',
          validationLogic: '`disabled={isProcessing || !simulationData.cnpj || !simulationData.businessName}` — VALIDAÇÃO REAL CLIENT-SIDE de campos obrigatórios',
        },

        startSimulationFunction: {
          name: 'startSimulation',
          earlyReturn: '`if (!simulationData.cnpj || !simulationData.businessName) return;`',
          stateMachine: 'setIsProcessing(true) → setSimulationStep(1) → async loop `for (let i = 1; i <= 6; i++) { await new Promise(setTimeout 1500ms); setSimulationStep(i); }` → 9 segundos totais',
          scoreGenerator: 'Math.floor(Math.random() * 40) + 60 — range 60-100 SEMPRE positivo (viés UX)',
          statusTernary: 'score >= 80 ? "approved" : score >= 50 ? "manual_review" : "rejected" — MAS score sempre >= 60 = nunca "rejected" REAL',
          validationsGenerated: '6 sub-objects (cnpj/address/pep/sanctions HARDCODED valid + partners e mcc CONDICIONAIS ao score)',
          recommendationConditional: '3 strings ternárias por status',
          processingTimeFake: '"3.2s" string fixo — apesar do real loop ter 9000ms+',
        },

        rightProgressColumn: {
          stepsRender: 'simulationSteps.map com 3 estados visuais condicionais',
          stylingTriple: '`isCompleted ? green-50/CheckCircle2 : isCurrent ? indigo-50/Loader2 spin : slate-50/step.icon`',
          stepRowStructure: '[circle 8x8 c/ icon condicional / label + "Processando..." se current / Badge ✓ se completed]',
        },

        resultsRender: {
          renderCondition: '`{simulationResults && (...)}`',
          animation: '`animate-in fade-in duration-500` — ÚNICA animação CSS Tailwind no Admin Interno',
          scoreCard: 'border-2 condicional 3 cores (green/amber/red) c/ Brain w-8 + "Helena AI Score" + "{score}/100" 3xl bold + statusBadge + Progress h-3 + recommendation + processingTime',
          validationsGrid: 'grid-cols-2 c/ Object.entries iterando 6 validations c/ icon CheckCircle2 green ou AlertTriangle amber + key.replace(/_/g, " ") capitalize + message',
        },

        emptyStateRender: {
          renderCondition: '`{!simulationResults && simulationStep === 0 && (...)}`',
          structure: 'border-dashed center c/ ScanFace w-16 h-16 cinza + "Pronto para simular" + helper text',
        },

        threeConditionalRendersGap: 'PADRÃO ÚNICO — mesmo container direito tem 3 renders distintos (steps progress sempre / results se existe / empty se não iniciado)',
      },

      queueTab: {
        searchAndFilter: 'Search Input w-64 + Filter Button SEM behavior',
        queueItems: '3 cards com STYLING TRIPLO CONDICIONAL por priority',
        priorityStyling: 'critical=red border bg-red-50/50 / high=amber border bg-amber-50/50 / normal=slate default',

        cardStructure: {
          header: 'Building2 icon condicional 3 cores (approved=green / manual_review=amber / rejected=red)',
          title: 'businessName + Badge type.toUpperCase() outline (KYC_FULL / KYC_PIX)',
          metadata: 'CNPJ + ID + timestamp',
          rightSection: '[Helena Score colorido condicional 3 cores `>=70 green / >=40 amber / <40 red` + statusBadge / Em Fila waiting time / Botão Analisar com cross-link real]',
        },

        crossPageLinkUnique: {
          location: 'Botão "Analisar" indigo-600',
          link: '`Link to={createPageUrl("AdminIntComplianceReview") + ?id=${item.id}}`',
          uniqueness: 'ÚNICO Link CROSS-PAGE com query string passando ID DINÂMICO entre TODOS os 5 agentes IA do Admin Interno — funciona como navegação real para AdminIntComplianceReview',
        },

        redFlagsRender: {
          renderCondition: '`{item.redFlags && item.redFlags.length > 0 && (...)}`',
          structure: 'pt-4 border-t com AlertTriangle red + texto + Badge variant outline border-red-300 text-red-600 bg-red-50 para cada flag',
          examples: '["Sócio com restrições", "Endereço inconsistente", "CNPJ com restrições graves", "PEP identificado", "Setor de alto risco"]',
        },
      },

      analyticsTab: {
        gridLayout: 'grid-cols-1 md:grid-cols-2',
        leftCard: {
          title: '"Distribuição de Decisões"',
          chartType: 'Barras CSS divs h-3 (NÃO usa Recharts — diferente de Recovery/Converter/Dispute)',
          data: '3 items inline (Auto-Aprovados 67% green / Revisão Manual 28% amber / Recusados 5% red)',
          implementation: '`<div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />` SEM Math.max (mais limpo que PagSmile)',
        },
        rightCard: {
          title: '"Performance Helena AI"',
          structure: '4 rows bg-slate-50 c/ label esquerda + valor bold direita',
          metrics: '[Precisão 94.2% green / Tempo 2.8s neutral / FP 3.1% amber / FN 0.8% red]',
          uniqueness: 'ÚNICO agente com FP/FN explicits — métricas ML clássicas',
        },
      },

      helenaConfigTab: {
        uniqueness: 'TAB que DUPLICA parcialmente a Settings standalone — mesmo padrão de PagSmile e Dispute',
        gridLayout: 'grid-cols-1 lg:grid-cols-2',

        leftCardThresholds: {
          title: '"Thresholds de Decisão" c/ Brain icon indigo',
          fields: [
            'Switch helenaEnabled',
            'Slider autoApproveThreshold 60-95 step=5 c/ Label "Threshold de Auto-Aprovação: {N}" green-bold inline',
            'Slider autoRejectThreshold 10-50 step=5 c/ Label "{N}" red-bold inline',
            'BLOCO AMBER DINÂMICO "Zona de Revisão Manual entre {autoRejectThreshold} e {autoApproveThreshold}" — TEXTO DINÂMICO REAL que reflete sliders ao vivo — UX SUPERIOR a TODOS os outros settings',
            'Slider highRiskMCCAutoApproveLimit 50-90 step=5',
            'Switch requireManualForHighRiskMCC',
          ],
          dynamicTextUniqueness: 'Bloco "Zona de Revisão Manual" é o ÚNICO texto contextual dinâmico entre todos os agentes — outros settings exibem valores estáticos isolados',
        },

        rightCardWeights: {
          title: '"Pesos de Risco no Score" c/ Scale icon indigo',
          structure: '5 Sliders min=5 max=40 step=5 com map de array c/ {key, label, icon}',
          weightsArray: '[mccWeight Target / addressWeight Building2 / documentWeight FileText / pepWeight ShieldCheck / financialWeight Scale]',

          realTimeSumValidation: {
            uniqueness: 'VALIDAÇÃO MATEMÁTICA REAL EM TEMPO REAL — ÚNICA entre todos os settings dos agentes',
            implementation: '`{helenaSettings.mccWeight + addressWeight + documentWeight + pepWeight + financialWeight}%` exibido em bloco bg-slate-100',
            warningCondition: '`if (sum !== 100) → ⚠️ O total deve ser 100%` em text-amber-600',
            gap: 'Apesar do warning, NÃO IMPEDE Save — usuário pode salvar com soma inválida',
          },
        },

        validationsCard: {
          title: '"Validações Obrigatórias"',
          gridLayout: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          fields: '[PEP Switch + Badge Crítico red / Sanctions Switch + Badge Crítico red / Address Switch / Liveness Switch]',
          gap: 'Badge "Crítico" hardcoded apenas em PEP+Sanctions — inconsistente (Address+Liveness não têm Badge mas conceitualmente também são críticos KYC)',
        },

        saveButton: 'Button indigo-600 "Salvar Configurações Helena AI" — SEM onClick efetivo (gap igual ao Hub do Dispute Manager)',
      },

      agentChat: {
        component: 'AgentChatInterface',
        agentName: '"identity_onboarder"',
        agentDisplayName: '"Identity Onboarder"',
        agentDescription: '"KYC/KYB Copilot - Helena AI"',
        accentColor: '#6366f1 (indigo-500) — DIFERENTE do header gradient (indigo-500 to purple-600)',
        processor: 'processIdentityOnboarderMessage from @/components/agents/IdentityOnboarderChatLogic',
        floatingButton: 'AgentFloatingButton fixed accentColor=#6366f1',
        welcomeMessage: '"Olá! 👋 Sou o Identity Onboarder, assistente para análise KYC/KYB..."',
        quickPrompts: 'identityOnboarderQuickPrompts (mock)',
      },

      knownGapsHub: [
        'Hub gradient indigo-500 to purple-600 vs Settings gradient violet-500 to purple-600 — gap de identidade visual interno (igual Recovery)',
        'Hub buttons indigo-600 vs Settings buttons violet-600 — duplo gap cromático',
        'state helenaSettings DUPLICADO PARCIAL com Settings standalone (14 vs 18 keys) — 4 keys EXCLUSIVAS Settings',
        'Score generator Math.random()*40+60 SEMPRE >=60 — nunca gera "rejected" real (viés UX para demo)',
        '4 das 6 validations são SEMPRE valid (cnpj/address/pep/sanctions hardcoded) — apenas partners/mcc respondem ao score',
        'processingTime "3.2s" é fake string — real é >9000ms',
        'Save Button helena-config tab SEM onClick efetivo (nem alert nem toast)',
        'Search/Filter buttons na queue tab SEM behavior',
        'simulationData.openingDate e simulationData.address declarados no state mas NÃO usados na UI (form não tem inputs para eles)',
        'Math.random no score quebra reprodutibilidade da demo',
        'Soma de pesos (validação real) NÃO impede Save mesmo se warning ativo',
        'Badge "Crítico" hardcoded apenas em PEP+Sanctions (inconsistente com conceito KYC onde todos são críticos)',
        'AgentChatInterface processa mocks (sem LLM real conectado)',
        'Sem entity Subaccount usada (kyc_data, ai_compliance_score, ai_compliance_status, liveness_facematch_status, is_pep existem no schema)',
        'Sem entity ComplianceQuestionnaire / ComplianceSubmission usadas (existem no schema)',
        'pendingQueue mock NÃO permite ações (apenas Link "Analisar" funcional, sem aprovar/rejeitar inline)',
        'Cross-page link funciona MAS AdminIntComplianceReview pode não receber ID corretamente (gap não testado)',
      ],
    },

    settingsMicroscopic: {
      role: 'Página standalone de configurações da Helena AI — A MENOR settings page entre os 5 agentes em linhas mas com mais densidade de UX patterns',
      menuPosition: 'NÃO está no menu — acessível apenas por Link "Configurar" do Hub',
      uniqueness: 'ÚNICA Settings com Tab "notifications" exclusiva (Hub não duplica) + ÚNICA com documentExpiryDays (notification baseada em expiração temporal de documentos)',

      stateManagement: {
        settings: 'object com 18 KEYS distribuídas em 5 grupos',
        keysBreakdown: {
          helena_3: 'helenaEnabled / autoApproveThreshold 80 / autoRejectThreshold 30 + manualReviewRange aninhado {min:30, max:80} (computado mas não exibido — gap)',
          riskWeights_5: 'mccWeight 25 / addressWeight 20 / documentWeight 25 / pepWeight 15 / financialWeight 15 — total=100 default',
          validations_4: 'pepCheckRequired / sanctionsCheckRequired / addressVerificationRequired / livenessRequired',
          highRiskMCCs_2: 'highRiskMCCAutoApproveLimit 70 / requireManualForHighRiskMCC TRUE',
          notifications_5: 'notifyAutoApproved FALSE (único default false) / notifyAutoRejected TRUE / notifyManualReview TRUE / notifyDocumentExpiring TRUE / documentExpiryDays 30 (EXCLUSIVO desta página)',
        },
        gap: 'manualReviewRange aninhado computado mas NÃO usado na UI (deveria ser derivado dos thresholds)',
      },

      header: {
        backButton: 'ArrowLeft Link → AdminIntIdentityOnboarder',
        icon: 'UserCheck violet-500 to purple-600 gradient — DIFERENTE do Hub que usa Fingerprint indigo-500 to purple-600 (gap de identidade visual)',
        title: '"Configurações do Identity Onboarder"',
        subtitle: '"Parâmetros da Helena AI e validações KYC/KYB"',
        actions: '[Resetar Button outline (sem reset funcional) / Salvar Button violet-600]',
        cromaticInconsistency: 'Hub indigo-600 / Settings violet-600 — segunda diferença cromática',
      },

      tabsContainer: {
        tabsList: 'grid-cols-4 (helena/weights/validations/notifications) — IGUAL ao Recovery+Converter+PagSmile',

        helenaTab: {
          twoCards: '[Configurações Helena AI / MCCs de Alto Risco]',
          card1Fields: [
            'Switch Helena AI Ativa',
            'Slider 60-95 step 5 c/ Layout flex-1+span w-16 right text-lg-bold-green {N} — IDÊNTICO ao Converter/Dispute settings, DIFERENTE do Hub que tem Label inline',
            'Slider 10-50 step 5 c/ mesmo padrão red',
            'Bloco amber Inteligente "Zona de Revisão Manual entre {autoReject} e {autoApprove}" — REPLICADO do Hub',
          ],
          card2Fields: [
            'Slider highRiskMCCAutoApproveLimit 50-90',
            'Switch requireManualForHighRiskMCC',
          ],
          uxLayoutGap: 'Layout dos Sliders DIFERENTE entre Hub (Label inline) e Settings (flex-1 + span direita) — duas UX paradigmas para mesmo dado',
        },

        weightsTab: {
          card: '"Pesos de Risco no Score Helena"',
          structure: '5 Sliders idênticos ao Hub com map array',
          weightsArray: '[mccWeight Target / addressWeight FileText (DIFERENTE do Hub que usa Building2!) / documentWeight FileText / pepWeight ShieldCheck / financialWeight Settings (DIFERENTE do Hub que usa Scale!)]',
          iconInconsistency: 'Settings usa FileText para Address e Settings icon para Financial — Hub usa Building2 para Address e Scale para Financial — INCONSISTÊNCIA DE ÍCONES entre 2 páginas mesmo agente para mesmos campos',
          realTimeSumValidation: 'IDÊNTICA ao Hub — Total + warning amber se !== 100',
        },

        validationsTab: {
          structure: '4 ROWS verticais (não grid como Hub)',
          fieldsWithRicherDescriptions: [
            'PEP Switch + Badge Crítico red + descrição "Pessoa Politicamente Exposta"',
            'Sanctions Switch + Badge Crítico red + descrição "Listas OFAC, ONU, UE"',
            'Address Switch + descrição "Comprovante de endereço válido"',
            'Liveness Switch + descrição "Prova de vida com foto do documento"',
          ],
          uniqueness: 'Settings é o ÚNICO LUGAR com essas descrições contextuais ricas (Hub mostra só labels)',
        },

        notificationsTab: {
          uniqueness: 'TAB EXCLUSIVA da Settings (Hub helena-config NÃO tem notifications inline — diferente de PagSmile e Dispute que duplicam tudo)',
          fields: [
            'Switch notifyAutoApproved DEFAULT FALSE (único default false)',
            'Switch notifyAutoRejected DEFAULT TRUE',
            'Switch notifyManualReview DEFAULT TRUE',
            'Row dupla Switch + Input number "X dias" (documentExpiryDays default 30) disabled-when-switch-off',
          ],
          documentExpiryUniqueness: 'documentExpiryDays é EXCLUSIVO deste agente entre TODOS os settings — único notification baseada em expiração temporal de documentos KYC/KYB',
        },
      },

      saveBehavior: {
        function: 'handleSave',
        action: '`alert("Configurações da Helena AI salvas com sucesso!")` browser nativo',
        gap: 'IGUAL aos outros 4 settings (PagSmile/Recovery/Converter/Dispute) — todos os 5 settings dos agentes usam alert() em vez de toast.success',
      },

      knownGapsSettings: [
        'state DUPLICADO PARCIAL com Hub (14 vs 18 keys) — 4 keys EXCLUSIVAS (notifyAutoApproved, notifyAutoRejected, notifyManualReview, notifyDocumentExpiring + documentExpiryDays)',
        'Hub usa Fingerprint icon indigo-purple, Settings usa UserCheck violet-purple — gap visual interno',
        'Hub buttons indigo-600, Settings buttons violet-600 — segunda inconsistência cromática',
        'manualReviewRange object aninhado computado mas NÃO exibido na UI',
        'Icons inconsistentes entre Hub e Settings para mesmos pesos (Address=Building2 vs FileText / Financial=Scale vs Settings)',
        'Layout dos Sliders Helena DIFERENTE entre Hub (Label inline) e Settings (flex-1+span direita)',
        'Badge "Crítico" hardcoded apenas em PEP+Sanctions — inconsistente',
        'Save = browser alert() em vez de toast',
        'Resetar Button SEM onClick funcional',
        'documentExpiryDays é único no Admin Interno mas Settings standalone NÃO conecta com cron real',
        'Soma de pesos é validada visualmente mas NÃO impede Save',
      ],
    },
  },

  technical: {
    fileLocations: {
      hub: 'pages/AdminIntIdentityOnboarder.jsx (925 linhas — A MAIOR HUB IA do Admin Interno se considerarmos densidade de features interativas)',
      settings: 'pages/AdminIntIdentityOnboarderSettings.jsx (401 linhas — A MENOR settings dos 5 agentes em linhas)',
    },

    arrayLocationInLayoutJsx: {
      file: 'layout.jsx',
      block: '`aiAgentsAdminInterno` — linhas 414-421',
      indexInArray: '4 (5º item, posição 0-indexed) — ÚLTIMO agente do array',
      renderingLocation: 'Sidebar dentro de `<ScrollArea>` em condicional `{sidebarOpen && currentModule === "admin-interno"}`',
      visualSeparation: 'Linha divisória horizontal + label "Agentes IA" purple-400 uppercase tracking-widest',
      iconUsedInSidebar: 'Sparkles purple-to-indigo gradient — TODOS os 5 agentes usam mesmo ícone Sparkles na sidebar (diferente do icon usado dentro da página)',
    },

    sharedAgentChatPattern: {
      sharedComponents: ['AgentChatInterface', 'AgentFloatingButton'],
      sharedImports: '`import { processIdentityOnboarderMessage, identityOnboarderQuickPrompts } from "@/components/agents/IdentityOnboarderChatLogic"`',
      props: '{ agentName="identity_onboarder", agentDisplayName="Identity Onboarder", agentDescription="KYC/KYB Copilot - Helena AI", quickPrompts, onProcessMessage, welcomeMessage, isOpen, onClose, isFullscreen, onToggleFullscreen, accentColor="#6366f1" }',
      consistencyWithOthers: 'Mesmo pattern dos outros 4 agentes (PagSmile/Recovery/Converter/Dispute)',
    },

    saveBehaviorAlertConsistency: {
      pages: ['AllSettings 5 agentes', 'IdentityOnboarderSettings'],
      pattern: 'TODAS as 5 settings pages dos agentes usam `alert()` browser nativo',
      gap: 'Resto do app usa toast.success com sonner — gap UX TRANSVERSAL aos 5 agentes IA do Admin Interno',
    },

    duplicationCriticalIdentity: {
      issue: 'Hub Tab "helena-config" DUPLICA PARCIALMENTE state da Settings standalone (14 vs 18 keys)',
      keysExclusiveToSettings: '[notifyAutoApproved, notifyAutoRejected, notifyManualReview, notifyDocumentExpiring + documentExpiryDays] — 5 keys que SÓ aparecem na página standalone',
      keysExclusiveToHub: 'NENHUMA — Hub é subconjunto da Settings',
      gap: 'Edição em Hub cobre apenas 14 keys; Settings cobre as 18 — usuário deve ir para Settings para acessar notifications',
      comparisonWithOthers: {
        pagSmile: 'DUPLICA 100% (16 keys idênticas)',
        dispute: 'DUPLICA PARCIAL (14 do Hub vs 19 da Settings — 5 EXCLUSIVAS Settings)',
        identity: 'DUPLICA PARCIAL (14 do Hub vs 18 da Settings — 4 EXCLUSIVAS Settings)',
        recovery: 'NÃO DUPLICA (settings só na página standalone)',
        converter: 'NÃO DUPLICA (settings só na página standalone)',
      },
    },

    crossPageNavigation: {
      hubToSettings: 'Link "Configurar" Button outline header → AdminIntIdentityOnboarderSettings',
      settingsToHub: 'ArrowLeft Link header → AdminIntIdentityOnboarder',
      uniqueCrossLink: '`Link to={createPageUrl("AdminIntComplianceReview") + ?id=${item.id}}` no Botão "Analisar" da queue tab — ÚNICO entre todos os 5 agentes IA do Admin Interno',
      isolation: 'Identity Onboarder NÃO linka para AdminIntComplianceQueue / AdminIntComplianceSubmissions / AdminIntComplianceHelena (que existem no Admin Interno e seriam contextualmente relevantes — Helena AI tem página própria de treinamento)',
    },

    rechartsUsage: {
      hubUses: 'NENHUMA — Identity NÃO usa Recharts',
      analyticsTabApproach: 'Barras CSS divs h-3 com width inline percentual + 4 KPI rows simples',
      uniqueness: 'ÚNICO hub IA do Admin Interno que NÃO usa Recharts (PagSmile usa CSS divs também mas Math.max distorce; Recovery/Converter/Dispute usam LineChart/BarChart/PieChart)',
      gapOrIntention: 'Possivelmente intencional — barras simples são mais legíveis que charts complexos para 3 categorias',
    },

    iconColorsHardcoded: {
      hubGradient: 'indigo-500 to purple-600 — única combinação azul-violeta',
      settingsGradient: 'violet-500 to purple-600 (DIFERENTE do Hub — gap igual ao Recovery)',
      hubButtons: 'indigo-600',
      settingsButtons: 'violet-600 (DIFERENTE do Hub)',
      chatAccentColor: '#6366f1 (indigo-500) — alinhado ao Hub',
      hubIcon: 'Fingerprint',
      settingsIcon: 'UserCheck (DIFERENTE do Hub)',
      multipleInconsistencies: 'Identity Onboarder tem TRÊS gaps cromáticos internos (gradient + buttons + icons) — pior que Recovery que tem apenas 1',
    },

    uniqueFeaturesAcrossPlatform: {
      simulator: 'A ÚNICA TAB INTERATIVA com STATE MACHINE entre todos os agentes IA — 6 etapas com setTimeout 1500ms cada (9000ms total)',
      crossPageQueryString: 'A ÚNICA navegação cross-page com query string ?id=X funcional entre os agentes',
      realTimeSumValidation: 'A ÚNICA validação matemática real (sum=100%) com warning condicional',
      dynamicReviewZone: 'A ÚNICA texto contextual dinâmico que reflete sliders ao vivo',
      animateInFadeIn: 'A ÚNICA animação CSS Tailwind animate-in fade-in duration-500',
      threeConditionalRenders: 'O ÚNICO container com 3 renders condicionais distintos (steps + results + empty)',
      namedAI: 'O ÚNICO agente associado a NOME PRÓPRIO de IA (HELENA AI) referenciada em labels/badges',
      mlMetricsExplicit: 'O ÚNICO com FP/FN explícitos em analytics',
      noRecharts: 'O ÚNICO sem Recharts — analytics em CSS divs',
      statusBadge: 'O ÚNICO Badge live no header que mostra STATUS (Helena AI Ativa) em vez de contador KPI',
    },

    knownGapsCrossSection: [
      '2/2 páginas mock — zero entity Subaccount.kyc_data / ai_compliance_score / ai_compliance_status / liveness_facematch_status / is_pep usados (existem completos no schema)',
      'Hub gradient indigo vs Settings gradient violet — gap cromático interno',
      'Hub buttons indigo-600 vs Settings buttons violet-600 — segunda inconsistência cromática',
      'Hub icon Fingerprint vs Settings icon UserCheck — terceira inconsistência cromática',
      'state helenaSettings DUPLICADO PARCIAL (14 vs 18 keys) — 4 keys EXCLUSIVAS Settings',
      'Score generator Math.random()*40+60 SEMPRE >=60 — viés UX para demo (nunca rejeita real)',
      '4 das 6 validations no simulador são SEMPRE valid — só partners e mcc respondem ao score',
      'processingTime "3.2s" string fake (real >9000ms)',
      'simulationData.openingDate e simulationData.address declarados no state mas SEM input correspondente na UI',
      'Save Button helena-config tab no Hub SEM onClick efetivo (gap igual Dispute)',
      'Settings save = browser alert() em vez de toast (gap consistente com os outros 4 settings)',
      'Resetar Buttons (Hub e Settings) SEM onClick funcional',
      'Search/Filter buttons na queue tab SEM behavior',
      'Soma de pesos validada visualmente mas NÃO impede Save mesmo com warning',
      'Badge "Crítico" hardcoded apenas em PEP+Sanctions (Address+Liveness são igualmente críticos KYC)',
      'Icons das pesos INCONSISTENTES entre Hub e Settings (Address=Building2 vs FileText / Financial=Scale vs Settings)',
      'Layout dos Sliders Helena DIFERENTE entre Hub e Settings (Label inline vs flex-1+span)',
      'manualReviewRange aninhado na Settings declarado mas NÃO usado na UI',
      'Sem entity ComplianceQuestionnaire / ComplianceSubmission / ComplianceRule usadas (existem no schema)',
      'Sem cron real para documentExpiryDays — feature declarada sem backend',
      'AgentChatInterface processa mocks (sem LLM real conectado)',
      'pendingQueue mock NÃO permite ações de aprovar/rejeitar inline (apenas Link Analisar funcional)',
      'Cross-page link AdminIntComplianceReview?id=X não testado se a página destino lê o param corretamente',
      'analytics tab usa percentuais hardcoded 67/28/5 (mesmos dos KPIs — boa coerência mas sem fonte dinâmica real)',
      'Helena AI nomeada explicitamente mas SEM conexão com AdminIntComplianceHelena (página de treinamento ML 96/94/95) — agentes vivem em ilhas',
    ],
  },
};

export default AdminIntIdentityOnboarderDoc;