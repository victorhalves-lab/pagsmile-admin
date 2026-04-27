// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — SUBACCOUNTS DETAIL (Admin Interno)
// ----------------------------------------------------------------------------
// Cobre o quinteto de páginas de DRILL-DOWN de subcontas / marketplaces:
//   - AdminIntSubaccountDetail.jsx       (307 linhas) — Detail RESUMIDO (5 abas + Progress steps)
//   - AdminIntSubaccountFullDetail.jsx   (704 linhas) — Detail COMPLETO 360° (8 abas + Dialog ações)
//   - AdminIntSubaccountTransactions.jsx (267 linhas) — Lista de transações da subconta
//   - AdminIntSubaccountLimits.jsx       (168 linhas) — Form CRUD limites cartão+PIX
//   - AdminIntSubaccountRates.jsx        (231 linhas) — Form CRUD taxas MDR/PIX/Antecipação
//
// IMPORTANTE: Estas 5 páginas existem PARALELAMENTE ao Perfil 360° de Merchant
// (AdminIntMerchantProfile com 25 abas). Há sobreposição enorme de funcionalidade:
// - SubaccountFullDetail tem 8 das 25 abas que MerchantProfile já cobre
// - SubaccountLimits/Rates duplicam Tab Limites/Tab Taxas do MerchantProfile
// Esta DUPLICIDADE é o gap arquitetural mais crítico desta família.
// ============================================================================

export const AdminIntSubaccountsDetailDoc = {
  pageId: 'AdminIntSubaccountsDetail',
  pagePaths: [
    '/AdminIntSubaccountDetail',
    '/AdminIntSubaccountFullDetail',
    '/AdminIntSubaccountTransactions',
    '/AdminIntSubaccountLimits',
    '/AdminIntSubaccountRates',
  ],
  module: 'Admin Interno',
  section: 'Subcontas — Drill-Down (Detail Resumido + Detail Completo + Transações + Limites + Taxas)',

  explainer: {
    oneLiner:
      'Quinteto de drill-down de subcontas paralelo ao MerchantProfile com SOBREPOSIÇÃO MASSIVA de funcionalidade: (1) SubaccountDetail 307L é a versão "leve" — useQuery com mockSubaccounts INLINE 4 entries hardcoded por id (sub1-sub4), Header c/ 2 botões Lembrete KYC+Contato + DropdownMenu 3 ações (Solicitar Documentos / Alterar Plano / Cancelar Conta red — TODOS sem onClick), Card de Status & Progress c/ Progress shadcn altura 2 calculando (currentStepIdx+1)/4*100 + 4 steps custom (Rascunho / Aguard. KYC / Em Análise / Ativo) com bolinhas indigo-600 conectadas, 5 Tabs com border bottom indigo (Basic c/ 4 InfoRow incluindo "IP de Criação 192.168.1.1" HARDCODED PII / Company c/ 6 InfoRow + cálculo company_age_years próprio / Plan c/ 5 InfoRow incluindo "Taxa Pix 0.99% / MDR 3.49% + R$0,50 / D+14" TODOS HARDCODED não vem do mock / KYC c/ Score circle 80+ emerald / 50+ amber / else red + botão "Ir para Análise Completa" → AdminIntKycAnalysis SEM passar id + DocumentItem 2 mocks fixos / Timeline c/ TimelineItem 2 mocks fixos), useParams() COMBINADO com URLSearchParams como fallback, breadcrumb "Contas Self-Service → AdminIntSelfService" mas essa rota NÃO EXISTE no registry; (2) SubaccountFullDetail 704L é a versão "pesada" — usa mockHierarchicalSubaccounts + mockSubaccountTransactions + mockMainMerchants do arquivo central adminInternoMocks, fallback CRÍTICO `subaccount = mockHierarchicalSubaccounts[0]` se id inválido (mascara erro 404 silenciosamente), Header com Action Buttons CONDICIONAIS POR STATUS (pending_compliance → "Aprovar" emerald / active → "Suspender" amber + "Bloquear" red / suspended OR blocked → "Reativar" emerald), 5 KPI cards (Status / Volume Total / Saldo Disponível emerald / Saldo Pendente amber / Saldo Bloqueado red), 8 Tabs com emojis + ícones (📝 Cadastrais / 🏦 Bancários / 📁 Documentos / 🛡️ Compliance & Risco / 💳 Transações / 📊 Limites / 💰 Taxas / 📜 Histórico) — cada tab navega para outras páginas via Link "Ver Todas/Gerenciar/Ver Detalhes" → AdminIntSubaccountTransactions/Limits/Rates passando id, Tab Cadastrais com 4 cards grid 2x2 (Empresa 8 fields / Endereço 6 fields / MCC+CNAE c/ status compliance Badge / Sócios array.map c/ PEP+Sanctions Badges destructive condicional), Tab Bancários array.map bank_accounts c/ "Principal" Badge condicional, Tab Documentos com Table 5-col + 2 botões Eye/Download SEM onClick + Card extra "Dados do Questionário KYC" Object.entries(kyc_data).map gerando cards dinamicamente, Tab Compliance & Risco c/ Score circle 24x24 grande (80+ emerald / 50+ amber / else red) + Justificativa IA + Red Flags array c/ AlertTriangle red OR fallback "Nenhum red flag" emerald + Risk Level + Compliance Status + DUPLICATA da seção "Ações de Gestão" do header, Tab Transações Table 6-col c/ slice(0,5) + Link "Ver Todas" → SubaccountTransactions, Tab Limites grid 5 cards mostrando subaccount.limits.{per_transaction/daily/monthly/pix_per_transaction/pix_daily}, Tab Taxas grid 6 cards mostrando subaccount.rates_config.{mdr_credit/mdr_debit/mdr_pix/fixed_fee_card/fixed_fee_pix/anticipation_rate} + box azul "Plano: {plan_name}", Tab Histórico apenas Notas Internas (sem timeline de eventos!), Dialog único genérico para 4 ações com Textarea reason "(opcional)" + cor do botão dinâmica (emerald approve/reactivate / red block / amber suspend) — confirmAction faz APENAS console.log (NÃO persiste); (3) SubaccountTransactions 267L lista cheia da subconta — fallback idem [0], breadcrumb HIERÁRQUICO 4-level (Gestão Comerciantes → MerchantProfile → SubaccountFullDetail → Transações), 4 KPI cards calculados em tempo real (Total Transações / Volume Total / Volume Aprovado green / Taxa Aprovação % purple), filtros 3 (Search por id+customer.name / Status 6 opções all/approved/refused/pending/refunded/chargeback / Method 4 opções all/credit_card/debit_card/pix), Table 9-col com Link Eye → AdminIntTransactionDetail?id={txn.id} + emptyMessage colSpan=9; (4) SubaccountLimits 168L é form CRUD ISOLADO — useQuery + useEffect que sincroniza state com data, mockSubaccounts INLINE 4 entries (DUPLICA dos outros), 2 cards lado a lado (Cartão 3 inputs per_transaction+daily+monthly / PIX 2 inputs pix_per_transaction+pix_daily) + Alert info "Alterações podem levar até 5 minutos para serem aplicadas", handleSave usa `alert()` JS NATIVO em vez de toast (inconsistência!) com texto "(simulação)", breadcrumb "Subcontas → AdminIntSubaccounts" enquanto FullDetail usa "AdminIntMerchantsOverview"; (5) SubaccountRates 231L gêmeo do Limits — mesmo padrão useQuery+useEffect com mockSubaccounts INLINE outro set 4 entries, 2 cards (Cartão MDR Crédito+Débito+Taxa Fixa / PIX MDR PIX+Taxa Fixa+Antecipação) com Percent icon — primary vs emerald-600 inconsistente, Card adicional "Resumo das Taxas Configuradas" Table 4-row repetindo dados acima (gap: linha Débito mostra fixed_fee_card mesmo conceito de fixa do Crédito — provável bug de copy/paste), Alert info "Novas taxas serão aplicadas apenas para transações futuras", handleSave alert() nativo "(simulação)". GAP TRANSVERSAL: TRÊS páginas (SubaccountDetail, SubaccountLimits, SubaccountRates) têm seus PRÓPRIOS mocks INLINE diferentes — sub1/sub2/sub3/sub4 mas com campos ligeiramente diferentes em cada arquivo, e essa estrutura NÃO casa com mockHierarchicalSubaccounts usado no FullDetail e Transactions. Total = 4 fontes distintas de mock para a mesma entidade.',

    subaccountDetailMicroscopic: {
      role: 'Versão LEVE de detalhes — usada no fluxo Self-Service (contas criadas pelo cliente final)',
      backendIntegration: {
        sdkCalls: 'NENHUMA SDK real — useQuery com mockSubaccounts INLINE dentro do queryFn',
        mockEntries: '4 hardcoded sub1/sub2/sub3/sub4 com campos: id, business_name, document, status, created_date, representative_name+email+phone, legal_name, website, opening_date, address, plan_chosen, account_type (pix/both), kyc_score 0-100, kyc_decision (approved/manual_review)',
        gap: 'Os mesmos sub1-sub4 NÃO existem em mockHierarchicalSubaccounts (estruturas de dados divergentes entre páginas)',
      },
      urlParamsParsing: {
        primary: 'useParams() do react-router (espera /AdminIntSubaccountDetail/:id)',
        fallback: 'URLSearchParams.get("id") — combinação no formato `id || urlParams.get("id")`',
        gap: 'Roteamento ambíguo — FullDetail usa SOMENTE URLSearchParams, divergindo do Detail',
      },
      pageHeader: {
        title: 'subaccount.business_name OR fallback "Detalhes da Conta"',
        subtitle: '"CNPJ: {document || -}"',
        breadcrumbs: '[Contas Self-Service (page=AdminIntSelfService) → {business_name}]',
        gap: 'Página AdminIntSelfService NÃO existe no registry adminInterno.js — link quebrado',
        actions: '3 controles: Button "Lembrete KYC" Mail / Button "Contato" Phone / DropdownMenu "Ações" com 3 itens (Solicitar Documentos / Alterar Plano / Cancelar Conta red) — TODOS sem onClick',
      },
      statusProgressCard: {
        topRow: 'Status atual + StatusBadge / Criado em date',
        progressBar: 'Progress shadcn altura 2 com value={(currentStepIdx+1)/steps.length*100}',
        steps4: [
          'draft → "Rascunho"',
          'awaiting_kyc_start → "Aguard. KYC"',
          'kyc_submitted → "Em Análise"',
          'active → "Ativo"',
        ],
        currentStepLogic: 'findIndex(status) — IF -1 (não match) → fallback hardcoded para 1 (Aguard. KYC)',
        styling: '4 bolinhas absolutas top-4 entre Progress / activeStyle bg-indigo-600 text-indigo-600 font-medium / inactiveStyle bg-slate-200 text-slate-400',
        gap: 'Status enum no schema da entity Subaccount tem 8 valores (draft/pending_compliance/pending_documents/under_review/active/suspended/blocked/cancelled) mas steps usa 4 OUTROS valores (awaiting_kyc_start/kyc_submitted) — impossível casar com data real',
      },
      fiveTabs: {
        basic: {
          title: 'Representante Legal',
          rows: [
            'Nome Completo — representative_name',
            'E-mail — representative_email',
            'Telefone — representative_phone',
            'IP de Criação — "192.168.1.1" HARDCODED PII',
          ],
          gap: 'IP de Criação é PII e está hardcoded para todos os subaccounts',
        },
        company: {
          title: 'Dados da Empresa',
          rows: [
            'Razão Social — legal_name || business_name',
            'Nome Fantasia — business_name',
            'CNPJ — document',
            'Endereço — composição "{street}, {number}, {city} - {state}"',
            'Website',
            'Idade da Empresa — `${company_age_years || 0} anos` (calculado pelo getCompanyAgeYears)',
          ],
          companyAgeFunction: 'helper local que calcula years considerando month e day para precisão',
        },
        plan: {
          title: 'Plano Selecionado',
          rows: [
            'Plano — plan_chosen',
            'Tipo de Conta — IF "both" → "Pix + Cartão" / ELSE "Só Pix"',
            'Taxa Pix — "0.99%" HARDCODED',
            'MDR Cartão Crédito — "3.49% + R$ 0,50" HARDCODED',
            'Prazo de Recebimento — "D+14" HARDCODED',
          ],
          gap: 'Taxas/MDR/Prazo NÃO vem do mock — totalmente hardcoded por isso a página NÃO casa com SubaccountRates que mostra valores diferentes',
        },
        kyc: {
          layout: 'Grid 2 cols',
          leftCard: {
            title: 'Status do Compliance',
            scoreCircle: 'w-20 h-20 rounded-full / kyc_score 80+ emerald / 50+ amber / <50 red',
            decisionLabel: 'kyc_decision com .replace("_"," ") OR fallback "Pendente"',
            actionButton: 'Link → /AdminIntKycAnalysis (rota ABSOLUTA, sem id) — Button "Ir para Análise Completa"',
            gap: 'Link sem passar id — KycAnalysis recebe vazio',
          },
          rightCard: {
            title: 'Documentos',
            items: 'documents.map(DocumentItem) com 2 mocks (CNPJ Card / Social Contract) + emptyMessage',
            documentItem: 'icon FileText slate / status Badge variant success se validated / Button "Ver" + IF rejected → "Solicitar Novo" red',
          },
        },
        timeline: {
          title: 'Histórico de Eventos',
          items: 'timeline.map(TimelineItem) com 2 mocks (account_created / kyc_started)',
          timelineItem: 'Bolinha + Linha vertical com pseudo absolute / event_type.replace("_"," ").toUpperCase() / details / timestamp + actor',
        },
      },
      knownGapsDetail: [
        'Breadcrumb página AdminIntSelfService NÃO existe',
        'IP "192.168.1.1" hardcoded PII para todos',
        'Tab Plan: Taxa/MDR/D+14 todos hardcoded',
        'Status steps usa enum diferente do schema (4 valores próprios vs 8 do schema)',
        'Link KYC sem id',
        'DropdownMenu Ações 3 itens TODOS sem onClick',
        'Botões Lembrete KYC + Contato sem onClick',
        'Mock INLINE 4 entries dentro do queryFn — não compartilhado',
        'Roteamento ambíguo useParams + URLSearchParams',
      ],
    },

    subaccountFullDetailMicroscopic: {
      role: 'Versão PESADA de detalhes 360° — paralela ao MerchantProfile (8 das 25 abas duplicadas)',
      backendIntegration: {
        mockSource: "import { mockHierarchicalSubaccounts, mockSubaccountTransactions, mockMainMerchants } from '@/components/mockData/adminInternoMocks'",
        fallbackCritical: '`subaccount = mockHierarchicalSubaccounts.find(s => s.id === subaccountId) || mockHierarchicalSubaccounts[0]`',
        gap: 'Fallback silencioso para [0] = sempre carrega primeiro subaccount mesmo com id inválido — mascara 404',
      },
      urlParamsParsing: 'APENAS URLSearchParams.get("id") (divergente de Detail que usa useParams)',
      stateManagement: {
        activeTab: 'default "cadastrais"',
        actionDialog: '{ open: false, type: null }',
        actionReason: 'string (textarea)',
      },
      pageHeader: {
        title: 'subaccount.business_name',
        subtitle: '"CNPJ: {document}"',
        icon: 'Store',
        breadcrumbs: '[Gestão de Comerciantes (AdminIntMerchantsOverview) → {parentMerchant.business_name} (AdminIntMerchantProfile?id={parent_id}) → {business_name}]',
        actionButtonsConditional: {
          pending_compliance: 'Button green "Aprovar" Check → handleAction("approve")',
          active: '2 buttons (Suspender amber Pause / Bloquear red Lock) → handleAction',
          suspended_OR_blocked: 'Button green "Reativar" Play → handleAction("reactivate")',
        },
      },
      fiveKPIs: {
        layout: 'grid grid-cols-1 md:grid-cols-5 gap-4',
        cards: [
          'Status — StatusBadge size=lg',
          'Volume Total — formatCurrency(total_volume) text-2xl',
          'Saldo Disponível — formatCurrency(available_balance) text-emerald-600',
          'Saldo Pendente — formatCurrency(pending_balance) text-amber-600',
          'Saldo Bloqueado — formatCurrency(blocked_balance) text-red-600',
        ],
      },
      eightTabs: {
        cadastrais: {
          layout: 'Grid 2x2 — 4 cards',
          cardEmpresa: '8 InfoRows (Nome Fantasia / Razão Social / CNPJ-CPF / E-mail Mail icon / Telefone Phone / Website Globe / Data Abertura Calendar / Categoria)',
          cardEndereco: '6 InfoRows (Logradouro composto / Complemento / Bairro / Cidade / Estado / CEP)',
          cardMccCnae: '4 InfoRows + Badge condicional bottom (success se compliant / destructive caso contrário) — usa subaccount.mcc_compliance_status',
          cardSocios: 'subaccount.partners.map(Card mini) — name + cpf + share + Badges PEP destructive / Sanctions destructive / "Sem restrições" success se ambos false',
        },
        bancarios: {
          title: '"Contas Bancárias Cadastradas"',
          icon: 'Landmark',
          items: 'bank_accounts.map(card) — bank_name + bank_code + Badge "Principal" condicional + grid 4-col (Agência/Conta/Tipo checking→Corrente else Poupança/Chave PIX + tipo)',
        },
        documentos: {
          documentsTable: 'Table 5-col (Documento doc.name / Tipo / Status Badge variant approved=success rejected=destructive else secondary / Data Upload / 2 Buttons Eye+Download SEM onClick)',
          kycDataCard: 'Card extra "Dados do Questionário KYC" — Object.entries(kyc_data).map(([key,value])) gerando cards dinamicamente com key.replace(/_/g," ").toUpperCase()',
          gap: 'Eye + Download sem onClick / kyc_data renderiza qualquer field genérico — sem schema validation',
        },
        compliance: {
          layout: 'Grid 2 cols + Card extra de "Ações de Gestão" abaixo',
          leftCard: {
            title: 'Score de Compliance',
            scoreCircle: 'w-24 h-24 (vs w-20 do Detail) com ai_compliance_score 80+ emerald / 50+ amber / else red',
            statusBadge: 'ai_compliance_status approved=success rejected=destructive else secondary',
            justificativaIA: 'box bg-slate-50 com ai_compliance_justification',
          },
          rightCard: {
            title: 'Red Flags Identificados',
            redFlags: 'IF length>0 → array.map AlertTriangle red items / ELSE → success "Nenhum red flag identificado"',
            riskLevel: 'Badge low=success critical=destructive else secondary com risk_level.toUpperCase()',
            complianceStatus: 'Badge compliant=success else secondary',
          },
          duplicatedActionsCard: 'EXATAMENTE o mesmo grupo de Action Buttons do Header — duplicação consciente para acessibilidade',
        },
        transacoes: {
          title: '"Transações Recentes"',
          headerActionLink: 'Link → AdminIntSubaccountTransactions?id={subaccount.id} Button "Ver Todas"',
          tableSlice: 'transactions.slice(0,5) — Table 6-col (ID font-mono / Data toLocaleString / Valor formatCurrency / Método Badge / Status StatusBadge / Cliente customer.name)',
        },
        limites: {
          title: '"Limites Configurados"',
          headerActionLink: 'Link → AdminIntSubaccountLimits?id={id} Button "Gerenciar Limites"',
          gridCards: '5 cards (Por Transação / Diário / Mensal / PIX Por Transação / PIX Diário) com formatCurrency(subaccount.limits.{field})',
        },
        taxas: {
          title: '"Taxas Configuradas"',
          headerActionLink: 'Link → AdminIntSubaccountRates?id={id} Button "Ver Detalhes"',
          gridCards: '6 cards (MDR Crédito % / MDR Débito % / MDR PIX % / Taxa Fixa Cartão R$.toFixed(2) / Taxa Fixa PIX R$ / Taxa Antecipação %) com subaccount.rates_config.{field}',
          planBox: 'box bg-blue-50 com "Plano: {plan_name}"',
          gap: 'Schema da entity tem rates_config como objeto opcional — pode quebrar se undefined',
        },
        historico: {
          title: '"Notas Internas"',
          icon: 'History',
          items: 'IF subaccount.notes?.length>0 → notes.map(card border-l-4 blue) com note.content + note.user + note.date / ELSE "Nenhuma nota registrada"',
          gap: 'Aba é chamada "Histórico & Notas" mas SÓ tem Notas (não tem timeline real de eventos)',
        },
      },
      actionDialog: {
        title: 'switch case → "Aprovar / Bloquear / Suspender / Reativar Subconta"',
        description: '"Você está prestes a {action} a subconta {business_name}"',
        textareaReason: 'placeholder "Informe o motivo desta ação..." — label "(opcional)"',
        footerButton: 'Confirmar com className DINÂMICA: approve/reactivate=emerald-600 / block=red-600 / else=amber-600',
        confirmAction: 'console.log({type, reason}) + close + clear reason — NÃO PERSISTE em entidade',
        gap: 'Reason "opcional" = pode aprovar/bloquear sem motivo / Sem audit log / Sem notificação ao merchant',
      },
      knownGapsFullDetail: [
        'Fallback [0] mascara 404 — sempre carrega primeiro subaccount',
        'confirmAction() = console.log apenas — NÃO PERSISTE',
        'Eye + Download de docs SEM onClick',
        'Tab Histórico só tem Notas (não tem timeline de eventos)',
        'Action Buttons do Header DUPLICADOS dentro da Tab Compliance',
        'Card MCC tem Badge mas não link para AdminIntMccIrregularities',
        'Tab Bancários sem ações Editar/Adicionar conta',
        'kyc_data render genérico — qualquer field é exibido sem validação',
        'Sobreposição com MerchantProfile (8 das 25 abas duplicadas)',
        'rates_config pode ser undefined — quebra Tab Taxas',
      ],
    },

    subaccountTransactionsMicroscopic: {
      role: 'Lista cheia de transações da subconta — drill-down a partir do FullDetail Tab Transações',
      backendIntegration: {
        mockSource: 'mesmo mockHierarchicalSubaccounts + mockSubaccountTransactions + mockMainMerchants',
        fallbackCritical: 'mockHierarchicalSubaccounts[0] (idêntico ao FullDetail)',
      },
      pageHeader: {
        title: '"Transações: {business_name}"',
        subtitle: '"CNPJ: {document}"',
        icon: 'ArrowLeftRight',
        breadcrumbs: '4-LEVEL hierárquico [Gestão Comerciantes → MerchantProfile?id → SubaccountFullDetail?id → Transações]',
        actions: '2 buttons (Exportar Download / Atualizar RefreshCw) — ambos sem onClick',
      },
      fourKPIs: {
        cards: [
          'Total Transações — transactions.length / icon CreditCard blue',
          'Volume Total — formatCurrency(totalAmount) / icon DollarSign emerald',
          'Volume Aprovado — formatCurrency(approvedAmount) / icon TrendingUp green / valor green',
          'Taxa de Aprovação — approvalRate% / icon TrendingUp purple / valor purple',
        ],
        calcs: '4 KPIs calculados em tempo real após filter chain (search → status → method)',
      },
      filtersHeader: {
        searchInput: 'placeholder "Buscar por ID ou cliente..." — busca em txn.id + customer.name lowercase',
        statusSelect: '6 opções (all/approved/refused/pending/refunded/chargeback)',
        methodSelect: '4 opções (all/credit_card/debit_card/pix)',
      },
      transactionsTable: {
        columns: '9-col',
        cols: [
          'ID Transação — font-mono',
          'Data/Hora — composto (data toLocaleDateString + hora toLocaleTimeString xs slate)',
          'Cliente — composto (name + email xs slate)',
          'Método — Badge convertendo credit_card→Crédito / debit_card→Débito / pix→PIX',
          'Bandeira — txn.brand OR "-"',
          'Parcelas — center {installments}x',
          'Valor — right font-semibold formatCurrency',
          'Status — StatusBadge common',
          'Ações — Link → AdminIntTransactionDetail?id={txn.id} Button Eye',
        ],
        emptyState: 'colSpan=9 "Nenhuma transação encontrada com os filtros aplicados"',
      },
      knownGapsTransactions: [
        'Botões Exportar + Atualizar SEM onClick',
        'Sem paginação (mostra TODAS as transações filtradas)',
        'Sem ordenação por colunas',
        'Filter chain executa a cada render (sem memoização)',
        'Status enum tem 6 valores mas TransactionList do Core tem mais (processing/error)',
        'Method 3 valores mas Transaction.method enum do schema tem 4 (boleto)',
      ],
    },

    subaccountLimitsMicroscopic: {
      role: 'Form CRUD ISOLADO de limites — duplicado em relação ao Tab Limites do MerchantProfile',
      backendIntegration: {
        sdkCalls: 'NENHUMA SDK real — useQuery + useEffect com mockSubaccounts INLINE (4 entries DIFERENTES das outras páginas)',
        formStateInit: 'useEffect quando subaccount?.limits → setLimits(subaccount.limits)',
      },
      pageHeader: {
        title: '"Alterar Limites: {business_name}"',
        subtitle: 'subaccount.document',
        breadcrumbs: '[Admin Interno → Subcontas (AdminIntSubaccounts) → Alterar Limites]',
        actions: 'Button outline "Voltar" → AdminIntSubaccounts',
        gap: 'Breadcrumb usa AdminIntSubaccounts mas FullDetail usa AdminIntMerchantsOverview — inconsistência',
      },
      twoCardsForm: {
        cardCartao: {
          title: '"Limites de Cartão"',
          description: '"Configure os limites para transações com cartão"',
          inputs: '3 number inputs (per_transaction / daily / monthly) sem step',
        },
        cardPIX: {
          title: '"Limites de PIX"',
          description: '"Configure os limites para transações PIX"',
          inputs: '2 number inputs (pix_per_transaction / pix_daily) sem step',
          alertInfo: 'Alert info "Alterações nos limites podem levar até 5 minutos para serem aplicadas"',
        },
      },
      handleSave: '`alert("Limites salvos com sucesso! (simulação)")` — usa alert() JS NATIVO em vez de toast',
      knownGapsLimits: [
        'alert() nativo em vez de toast (inconsistência com outras páginas)',
        'Texto "(simulação)" exposto ao usuário',
        'Mock INLINE 4 entries DIFERENTE de outras páginas',
        'Sem validação de limites mínimos/máximos',
        'Sem confirmação antes de salvar',
        'parseFloat || 0 = se digitar texto, vira 0 silenciosamente',
        'Sem comparação visual antes/depois',
        'Sem audit log',
      ],
    },

    subaccountRatesMicroscopic: {
      role: 'Form CRUD ISOLADO de taxas MDR/PIX/Antecipação — duplicado em relação ao Tab Taxas do MerchantProfile',
      backendIntegration: 'Mesmo padrão de Limits — useQuery + useEffect com mockSubaccounts INLINE (4 entries OUTRO set diferente)',
      pageHeader: {
        title: '"Alterar Taxas: {business_name}"',
        breadcrumbs: '[Admin Interno → Subcontas → Alterar Taxas]',
        actions: 'Button "Voltar" → AdminIntSubaccounts',
      },
      twoCardsForm: {
        cardCartao: {
          title: 'icon Percent text-primary "Taxas de Cartão (MDR)"',
          inputs: '3 number step=0.01 (mdr_credit / mdr_debit / fixed_fee_card)',
        },
        cardPIX: {
          title: 'icon Percent text-emerald-600 "Taxas de PIX"',
          inputs: '3 number step=0.01 (mdr_pix / fixed_fee_pix / anticipation_rate)',
          gap: 'Anticipation_rate misturada com PIX (semanticamente é taxa GERAL não específica de PIX)',
        },
      },
      summaryCard: {
        title: '"Resumo das Taxas Configuradas"',
        table: 'Table 4-row (Crédito / Débito / PIX / Antecipação) x 3-col (Tipo / Taxa% / Taxa Fixa R$)',
        criticalBug: 'Linha Débito mostra `rates.fixed_fee_card.toFixed(2)` (mesmo valor que Crédito) — copy/paste bug, deveria ter campo próprio fixed_fee_debit',
        alertInfo: '"As novas taxas serão aplicadas apenas para transações futuras"',
      },
      handleSave: '`alert("Taxas salvas com sucesso! (simulação)")` — idem Limits',
      knownGapsRates: [
        'BUG copy/paste — Linha Débito do Resumo mostra fixed_fee_card',
        'anticipation_rate categorizado como PIX (incorreto semanticamente)',
        'alert() nativo em vez de toast',
        'Texto "(simulação)" exposto',
        'Mock INLINE outro set diferente',
        'Sem comparação com plano vigente / preço de tabela',
        'Sem validação de margem mínima sobre custo',
        'Sem audit log',
        'Inconsistência ícone Percent: text-primary vs text-emerald-600 entre cards',
      ],
    },
  },

  technical: {
    fileLocations: {
      subaccountDetail: 'pages/AdminIntSubaccountDetail.jsx (307 linhas)',
      subaccountFullDetail: 'pages/AdminIntSubaccountFullDetail.jsx (704 linhas — maior do quinteto)',
      subaccountTransactions: 'pages/AdminIntSubaccountTransactions.jsx (267 linhas)',
      subaccountLimits: 'pages/AdminIntSubaccountLimits.jsx (168 linhas)',
      subaccountRates: 'pages/AdminIntSubaccountRates.jsx (231 linhas)',
    },
    mockSourceFragmentation: {
      problem: '4 fontes diferentes de mock para a mesma entidade Subaccount',
      sources: [
        'SubaccountDetail.jsx — INLINE 4 entries dentro do queryFn (sub1-sub4 com campos KYC + plan_chosen)',
        'SubaccountLimits.jsx — INLINE 4 entries OUTRO set (apenas limits)',
        'SubaccountRates.jsx — INLINE 4 entries OUTRO set (apenas rates)',
        'SubaccountFullDetail.jsx + SubaccountTransactions.jsx — IMPORT mockHierarchicalSubaccounts (estrutura completa diferente)',
      ],
      consequence: 'Os mesmos sub1/sub2/sub3/sub4 NÃO existem cross-page — estrutura divergente impede testes de fluxo end-to-end',
    },
    routingInconsistency: {
      subaccountDetail: 'useParams() COMBINADO com URLSearchParams (espera path + query)',
      subaccountFullDetail: 'APENAS URLSearchParams.get("id")',
      subaccountTransactions: 'APENAS URLSearchParams',
      subaccountLimits: 'APENAS URLSearchParams',
      subaccountRates: 'APENAS URLSearchParams',
      gap: 'Detail diverge do restante — provavelmente legado de versão anterior',
    },
    componentReuse: {
      InfoRow: 'Detail tem inline / FullDetail tem inline com `icon` prop (versões DIFERENTES — não compartilham)',
      DocumentItem: 'apenas em Detail (inline)',
      TimelineItem: 'apenas em Detail (inline)',
      StatusBadge: 'common — usado em Detail + FullDetail + Transactions',
      formatCurrency: 'common @/components/utils — usado em FullDetail + Transactions / Detail tem hardcoded "0.99%" / Limits+Rates não usam (inputs raw)',
      Dialog: 'apenas FullDetail (1 modal genérico para 4 ações)',
      Alert: 'Limits + Rates (info "5 minutos" / "transações futuras")',
    },
    duplicationVsMerchantProfile: {
      subaccountFullDetailTabs: '8 abas (Cadastrais / Bancários / Documentos / Compliance / Transações / Limites / Taxas / Histórico)',
      merchantProfileTabs: '25 abas que INCLUEM TODAS as 8 acima',
      duplicatedTabs: 'Cadastrais=TabDadosCadastrais / Bancários⊂TabFinanceiro / Documentos=TabDocumentos / Compliance=TabKYC+TabRisco / Transações=TabTransacoes / Limites⊂TabConfiguracoes / Taxas=TabTaxas / Histórico=TabAuditoria+TabNotas',
      consequence: 'MANUTENÇÃO DOBRADA — qualquer mudança de schema precisa ser refletida em 2 lugares',
    },
    crossPageNavigation: {
      subaccountDetail_to_kyc: 'Link → /AdminIntKycAnalysis (sem id — quebra)',
      subaccountFullDetail_to_transactions: 'Tab Transações → AdminIntSubaccountTransactions?id={id} ✓',
      subaccountFullDetail_to_limits: 'Tab Limites → AdminIntSubaccountLimits?id={id} ✓',
      subaccountFullDetail_to_rates: 'Tab Taxas → AdminIntSubaccountRates?id={id} ✓',
      subaccountFullDetail_to_parent: 'Breadcrumb → AdminIntMerchantProfile?id={parent_merchant_id} ✓',
      subaccountTransactions_to_txnDetail: 'Eye → AdminIntTransactionDetail?id={txn.id} ✓',
      subaccountLimits_to_back: 'Voltar → AdminIntSubaccounts',
      subaccountRates_to_back: 'Voltar → AdminIntSubaccounts',
    },
    knownGapsCrossSection: [
      'Mock INLINE em 3/5 páginas + import central em 2/5 = 4 fontes divergentes',
      'Roteamento ambíguo: Detail usa useParams+URLSearch, demais só URLSearch',
      'AdminIntSelfService usado em breadcrumb mas não existe no registry',
      'Detail Tab Plan tem dados HARDCODED que conflitam com SubaccountRates',
      'Status enum: schema tem 8 / Detail steps tem 4 / FullDetail action buttons usa 3 grupos diferentes',
      'FullDetail confirmAction faz console.log apenas — não persiste',
      'Limits e Rates usam alert() nativo em vez de toast (inconsistência total com resto da plataforma)',
      'Bug copy/paste: Rates linha Débito mostra fixed_fee_card',
      'IP de Criação hardcoded "192.168.1.1" PII em Detail',
      'Tab Histórico do FullDetail só tem Notas (sem timeline)',
      'Sobreposição arquitetural massiva com MerchantProfile (manutenção dobrada)',
      'Eye/Download de docs no FullDetail sem onClick',
      'DropdownMenu Ações no Detail sem onClick',
    ],
  },
};

export default AdminIntSubaccountsDetailDoc;