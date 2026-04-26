// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DisputeContestation
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/DisputeContestation.jsx (649 linhas).
// Cada step do wizard, cada bloco de evidência, cada prompt da IA, cada estado,
// cada categoria de reason code (fraud/consumer/auth/processing) — documentado.
// ============================================================================

export const DisputeContestationDoc = {
  pageId: 'DisputeContestation',
  pagePath: '/DisputeContestation',
  module: 'Disputas',
  parentPage: 'Chargebacks',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Wizard guiado de 5 passos para CONTESTAÇÃO de chargeback — leva o operador da análise inicial até o envio do dossiê final, com checklist de evidências obrigatórias por categoria de reason code, upload de arquivos, geração de narrativa via IA e confirmação com protocolo.',

    whyAStepByStep:
      'Contestação de CB é PROCESSO crítico onde cada etapa tem requisitos diferentes. Se merchant pula um passo (ex: não anexa 3DS quando reason é fraud), o caso é descartado pela bandeira automaticamente. Wizard FORÇA o ritual completo.',

    fiveSteps: {
      step0_analysis: 'Mostrar o caso com clareza para a decisão consciente. Botão "Prosseguir para Decisão"',
      step1_decision: 'Forçar escolha binária — Contestar OU Aceitar. Se accept: muta status="accepted" e termina. Se contest: muta para "in_analysis" e pula para Step 2.',
      step2_evidence: 'Coleta MOLDADA pelo reason_category — cada categoria tem evidências obrigatórias diferentes (red) e opcionais (gray). Drop zone para upload.',
      step3_narrative: 'Texto persuasivo apresentando evidências e fatos. Botão "Gerar Narrativa com IA" usa InvokeLLM. Constraint 2000 caracteres.',
      step4_success: 'Confirmação final — gera submission_protocol_id e mostra. Botão "Voltar para Chargebacks"',
    },

    evidenceByCategory: {
      fraud: {
        required: ['IP da Transação', 'Device Fingerprint', 'Resultado AVS/CVV', 'Resultado 3D Secure'],
        optional: ['Histórico do Cliente', 'Comprovante de Entrega', 'Comunicações com Cliente'],
        winRationale: 'Cliente alega que NÃO fez a compra — única forma de provar é mostrar que era ELE: 3DS, IP, AVS, dispositivo',
      },
      consumer: {
        required: ['Comprovante de Entrega', 'Descrição do Produto/Serviço', 'Termos Aceitos pelo Cliente'],
        optional: ['Comunicações', 'Política de Reembolso', 'Informações de Rastreio'],
        winRationale: 'Cliente recebeu mas reclama — provar entrega e termos aceitos',
      },
      authorization: {
        required: ['Código de Autorização', 'Log da Transação'],
        optional: ['Resultado 3D Secure'],
        winRationale: 'Erro técnico — fácil contestar com logs do adquirente',
      },
      processing: {
        required: ['Comprovante do Valor Correto', 'Log da Transação'],
        optional: ['Comprovante de Reembolso'],
        winRationale: 'Erro de processamento — provar valor correto',
      },
    },

    aiNarrativeFeature: {
      flow: 'Operador clica "Gerar Narrativa com IA" → InvokeLLM com prompt detalhado → response_json_schema garante { narrative: string } → seta no Textarea',
      promptIngredients: [
        'Reason code + categoria + descrição',
        'Valor formatado em BRL',
        'Data + cliente',
        'Lista de evidências CHECKADAS (apenas marcadas)',
        'Bandeira (Visa ou Mastercard)',
      ],
      constraints: ['formal e objetivo', 'fatos cronológicos', 'mencionar evidências', 'argumentar contra', 'máximo 2000 caracteres', 'PT-BR'],
    },

    sidebarPanels: {
      summary: 'Resumo permanente da disputa (ID, valor, bandeira, status, prazo)',
      aiRecommendation: 'Card roxo (purple-200) com Bot icon + recomendação contest/accept + reason',
      help: 'Atalhos para Guia de Reason Codes e Documentação (gap: sem onClick)',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/DisputeContestation.jsx',
    totalLines: 649,

    imports: {
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.Dispute (filter, update) + base44.integrations.Core (UploadFile, InvokeLLM)',
      uiComponents: ['PageHeader', 'Card stack', 'Button', 'Badge', 'Input', 'Label', 'Textarea', 'Checkbox', 'Progress', 'Alert+AlertDescription', 'Tabs (importado, sem uso)'],
      utilities: ['cn', 'date-fns: format, differenceInDays'],
      navigation: ['Link', 'createPageUrl from @/utils'],
      lucideIcons: [
        'FileText, Upload, CheckCircle2, XCircle, AlertTriangle, Clock, Bot, Sparkles, Send',
        'ArrowLeft, ArrowRight, FileCheck, Shield, CreditCard, Calendar, Loader2, ExternalLink',
        'User, DollarSign, Copy — importados sem uso ativo',
      ],
      localUtility: {
        formatCurrency: 'Definida INLINE — duplica components/utils (gap)',
      },
      svgComponent: {
        Search: 'Componente SVG INLINE no FINAL (function Search(props)) com circle+path',
        gap: 'Solução estranha para evitar conflito de nome com lucide-react Search',
      },
    },

    constantsMapping: {
      evidenceRequirements: {
        structure: 'Object por reason_category com .required[] e .optional[]',
        fraud: { required: ['ip_address', 'device_fingerprint', 'avs_cvv', '3ds_result'], optional: ['customer_history', 'delivery_proof', 'communications'] },
        consumer: { required: ['delivery_proof', 'product_description', 'terms_accepted'], optional: ['communications', 'refund_policy', 'tracking_info'] },
        authorization: { required: ['authorization_code', 'transaction_log'], optional: ['3ds_result'] },
        processing: { required: ['correct_amount_proof', 'transaction_log'], optional: ['refund_proof'] },
      },
      evidenceLabels: {
        structure: 'Object key→label legível em PT-BR (15 keys total)',
        examples: '{ ip_address: "Endereço IP da Transação", device_fingerprint: "Device Fingerprint", avs_cvv: "Resultado AVS/CVV", "3ds_result": "Resultado 3D Secure", delivery_proof: "Comprovante de Entrega", terms_accepted: "Termos Aceitos pelo Cliente", ... }',
      },
      fallbackBehavior:
        'requirements = dispute?.reason_category ? evidenceRequirements[reason_category] : evidenceRequirements.consumer',
    },

    componentState: {
      currentStep: { initial: '0', purpose: 'Step ativo (0-4)' },
      decision: { initial: 'null', purpose: '"contest" ou "accept"' },
      evidenceChecklist: { initial: '{}', purpose: 'Object key→bool com evidências checadas' },
      uploadedFiles: { initial: '[]', purpose: 'Array de { name, url } após upload' },
      narrative: { initial: "''", purpose: 'Texto da narrativa' },
      isGeneratingNarrative: { initial: 'false', purpose: 'Flag para spinner do botão IA' },
    },

    backendIntegration: {
      readDisputeId: 'urlParams = new URLSearchParams(window.location.search); disputeId = urlParams.get("id")',
      query: {
        queryKey: "['dispute', disputeId]",
        queryFn: 'await base44.entities.Dispute.filter({ id: disputeId }) → return [0]',
        enabled: '!!disputeId',
        gap: 'Filter retornando 1 item é menos eficiente que get direto',
      },
      updateMutation: {
        mutationFn: '(data) => base44.entities.Dispute.update(disputeId, data)',
        onSuccess: 'invalidateQueries(["dispute", disputeId])',
      },
    },

    flowFunctions: {
      handleDecision: {
        signature: '(dec: "contest" | "accept") => void',
        if_accept: 'updateMutation.mutate({ status: "accepted" }) — termina aqui',
        if_contest: 'updateMutation.mutate({ status: "in_analysis" }) + setCurrentStep(2) — pula direto para Evidências',
        criticalDetail: 'Step 1 é só visual no Stepper — quando clica em "Contestar" pula DIRETO para Step 2',
      },
      handleFileUpload: {
        signature: '(e) => Promise<void>',
        flow: 'files = Array.from(e.target.files); for of files → UploadFile({file}) → setUploadedFiles',
        gap: 'Loop sequencial — uploads múltiplos lentos. Promise.all paralelo seria mais rápido.',
      },
      generateNarrative: {
        signature: 'async () => Promise<void>',
        invokeLLM: {
          prompt: 'MULTILINE com 9 placeholders dinâmicos',
          response_json_schema: '{ type: "object", properties: { narrative: { type: "string" } } }',
        },
        errorHandling: 'try/catch + console.error — sem toast (gap)',
      },
      handleSubmit: {
        signature: 'async () => Promise<void>',
        payload: {
          status: '"in_contestation"',
          narrative_text: 'narrative',
          evidence_files: 'uploadedFiles.map(f => f.url)',
          evidence_checklist: 'evidenceChecklist',
          evidence_submitted: 'true',
          submission_date: 'new Date().toISOString()',
          submission_protocol_id: '`PROT-${Date.now()}` (FRONTEND-generated — gap)',
        },
        followup: 'setCurrentStep(4)',
      },
    },

    renderGuards: {
      isLoading: 'Loader2 8x8 animate-spin centralizado',
      noDispute: 'AlertTriangle 12x12 yellow-500 + "Disputa não encontrada" + Button "Voltar para Chargebacks"',
    },

    stepperVisual: {
      structure: '5 steps em linha com conectores',
      stepsArray:
        '[{id:analysis,icon:Search}, {id:decision,icon:Shield}, {id:evidence,icon:FileText}, {id:narrative,icon:Bot}, {id:submit,icon:Send}]',
      circleStates: {
        active_or_done: 'bg-purple-600 border-purple-600 text-white',
        upcoming: 'bg-gray-100 border-gray-300 text-gray-400',
        completed: 'CheckCircle2 substitui o ícone quando idx < currentStep',
      },
      labelVisibility: 'hidden sm:block — só desktop',
    },

    deadlineAlert: {
      renderCondition: 'daysLeft !== null && daysLeft <= 7',
      colorLogic: {
        critical: 'daysLeft <= 3 → border-red-300 bg-red-50',
        warning: 'daysLeft 4-7 → border-yellow-300 bg-yellow-50',
      },
      content: '"Prazo de contestação: X dias restantes até DD/MM/YYYY"',
    },

    stepsDetail: {
      step0_analysis: {
        layout: 'lg:col-span-2 (ocupa 2/3 do grid)',
        sections: [
          'Header: "Análise do Caso" + "Revise os dados antes de decidir"',
          'Grid 2 cols (Valor com CreditCard / Prazo com Calendar)',
          'Reason Code: Badge purple-100 + reason_description',
          'Cliente: customer_name + customer_email',
          'AI Win Probability CONDICIONAL: Progress + valor com cor (>=60 verde, >=30 amber, else red)',
          'CTA: Button w-full "Prosseguir para Decisão" + ArrowRight',
        ],
      },
      step1_decision: {
        sections: [
          'Header: "Decisão" + "Escolha se deseja contestar ou aceitar"',
          'Grid 2 cols: Contestar (Shield green) / Aceitar (XCircle gray)',
          'Active class: contest → border-green-500, accept → border-gray-500',
          'Footer: Button ghost ArrowLeft "Voltar"',
        ],
      },
      step2_evidence: {
        sections: [
          'Required Evidence Block: heading red-600 + checkboxes em red-50/red-100',
          'Optional Evidence Block: heading gray-600 + checkboxes em gray-50',
          'Upload de Arquivos: drop zone border-dashed + Input multiple + UploadFile integration',
          'Lista de uploaded: FileCheck green + file.name',
          'Footer: Voltar + Prosseguir para Narrativa',
        ],
        gap: 'NÃO valida se evidências obrigatórias foram checadas antes de avançar',
      },
      step3_narrative: {
        sections: [
          'Header: "Narrativa de Contestação"',
          'AI Generate Button: Sparkles | Loader2 + "Gerar Narrativa com IA"',
          'Counter: `${narrative.length}/2000` — vermelho se >2000',
          'Textarea rows=12 font-mono text-sm',
          'Footer: Voltar + "Enviar Contestação" (purple-600, disabled se !narrative || >2000)',
        ],
      },
      step4_success: {
        layout: 'Card border-green-200 bg-green-50, p-8 text-center',
        elements: [
          'CheckCircle2 16x16 green-600',
          'h2 "Contestação Enviada!"',
          'Protocol ID em font-mono',
          'Button "Voltar para Chargebacks" via Link',
        ],
      },
    },

    sidebar: {
      summaryCard: {
        title: '"Resumo da Disputa" (text-sm)',
        rows: ['ID (mono)', 'Valor (formatCurrency)', 'Bandeira (Badge outline)', 'Status (Badge)', 'Prazo (cor por urgência)'],
      },
      aiRecommendationCard: {
        renderIf: 'dispute.ai_recommendation',
        wrapper: 'Card border-purple-200',
        header: 'Bot 4x4 purple-600 + "Recomendação IA"',
        body: 'Badge contest (green-100) ou accept (gray-100) + ai_recommendation_reason',
      },
      helpCard: {
        title: '"Precisa de Ajuda?"',
        buttons: ['FileText + "Guia de Reason Codes" (gap: sem onClick)', 'ExternalLink + "Documentação" (gap)'],
      },
    },

    knownGaps: [
      'formatCurrency redefinida inline em vez de importar a centralizada',
      'Componente Search é SVG inline para evitar conflito de nomes',
      'submission_protocol_id gerado no FRONTEND com Date.now() — deveria vir do backend',
      'Step 2 não valida evidências obrigatórias antes de avançar',
      'handleFileUpload faz uploads sequencialmente (loop for) — não paralelo',
      'generateNarrative sem toast/feedback ao usuário em caso de erro',
      'handleDecision quando "contest" pula direto para Step 2 sem mostrar Step 1 ativo',
      'Sidebar Help buttons sem onClick — placeholders visuais',
      'narrative > 2000 chars: counter fica vermelho mas não corta',
      'Sem auto-save de progresso — recarregar perde tudo',
      'Tabs importado do shadcn mas não usado',
      'User, DollarSign, Copy importados sem uso',
    ],

    relationshipsToOtherPages: {
      chargebacks: '/Chargebacks — origem do click no botão FileText roxo. Acessada com ?id=disputeId',
      disputeDashboard: '/DisputeDashboard — pai do módulo via breadcrumb',
      preChargebacks: '/PreChargebacks — não tem fluxo wizard equivalente (lá é dialog universal)',
    },
  },
};

export default DisputeContestationDoc;