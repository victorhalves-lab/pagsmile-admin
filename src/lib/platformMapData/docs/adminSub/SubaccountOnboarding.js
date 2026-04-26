// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /SubaccountOnboarding
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/SubaccountOnboarding.jsx (733 linhas).
// Cada step, cada campo, cada bandeira de UF, cada validação, cada partner,
// cada banco do select, cada chave PIX — documentado individualmente.
// ============================================================================

export const SubaccountOnboardingDoc = {
  pageId: 'SubaccountOnboarding',
  pagePath: '/SubaccountOnboarding',
  module: 'Subcontas',
  parentPage: 'SubaccountsDashboard',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Wizard de cadastro de nova subconta no marketplace em 5 steps sequenciais — Dados da Empresa (CNPJ + endereço completo + MCC) → Sócios (lista dinâmica com participação societária e flag de representante legal) → Documentos (4 uploads) → Conta Bancária (dados + chave PIX opcional) → Revisão final, com Progress bar contínua e cards de checkpoint visuais por step.',

    fiveStepsConcept: {
      step1: 'Dados da Empresa — Building2 — 8 campos + 8 do endereço (16 inputs)',
      step2: 'Sócios — User — lista dinâmica com Add/Remove + 4 campos por sócio',
      step3: 'Documentos — FileText — 4 uploads obrigatórios (Contrato Social/CNPJ/Endereço/RG-CNH)',
      step4: 'Conta Bancária — CreditCard — banco + tipo + agência + conta-dígito + PIX opcional',
      step5: 'Revisão — CheckCircle2 — preview consolidado + Submit',
    },

    sevenMCCOptions: {
      '5411': 'Supermercados e Mercearias',
      '5812': 'Restaurantes',
      '5691': 'Vestuário',
      '5732': 'Eletrônicos',
      '7311': 'Publicidade',
      '8099': 'Serviços de Saúde',
      '5999': 'Varejo em Geral',
    },

    twentySevenUFs: {
      list: '[AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO]',
      gap: 'Hardcoded — não vem do backend',
    },

    sixBanks: {
      '001': 'Banco do Brasil',
      '341': 'Itaú',
      '033': 'Santander',
      '104': 'Caixa',
      '237': 'Bradesco',
      '260': 'Nubank',
      gap: 'Apenas 6 hardcoded — falta lista completa de bancos brasileiros',
    },

    fourPIXKeyTypes: ['cnpj', 'email', 'phone', 'random'],

    fourDocumentTypes: {
      contrato_social: 'Contrato Social / Estatuto',
      cartao_cnpj: 'Cartão CNPJ',
      comprovante_endereco: 'Comprovante de Endereço',
      documento_socio: 'RG ou CNH dos Sócios',
    },

    partnersComplianceRule: {
      reasoning:
        'BACEN exige cadastro de sócios com participação >25% (UBO - Ultimate Beneficial Owner) para combate à lavagem de dinheiro',
      uiHint: 'Alert Info: "Todos os sócios com participação acima de 25% devem ser cadastrados. Ao menos um representante legal é obrigatório."',
      defaultPartner: '{ name, cpf, birth_date, ownership_percentage: 100, is_legal_representative: true }',
    },

    submissionLogic: {
      payload: '...formData + subaccount_id: SUB-${Date.now()} + status: under_review + onboarding_step: 5 + onboarding_completed: true',
      onSuccess: [
        'invalidate query subaccounts',
        'toast.success "Subconta cadastrada com sucesso! Aguardando análise."',
        'window.location.href = createPageUrl("Subaccounts") (full page reload)',
      ],
    },

    coreCapabilities: [
      'Progress visual com 5 ícones circulares + linhas conectoras coloridas',
      'Progress bar contínua na base do header (currentStep/5 * 100)',
      'Step states: completed (green CheckCircle2) / current (blue) / pending (gray)',
      'Botões "Voltar" disabled em step 1 / "Próximo" steps 1-4 / "Enviar Cadastro" step 5',
      'Loader2 animate-spin durante submit',
      'Add/Remove de sócios dinâmico com Trash2',
      'Estado consolidado em formData (objeto único profundo)',
      'updateField / updateNestedField / updatePartner como helpers',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/SubaccountOnboarding.jsx',
    totalLines: 733,

    imports: {
      react: ['useState'],
      reactQuery: ['useMutation', 'useQueryClient'],
      base44: 'base44.entities.Subaccount',
      navigation: ['useNavigate (react-router-dom — importado sem uso real)', 'createPageUrl from ../utils'],
      sharedComponents: ['PageHeader'],
      uiComponents: [
        'Card stack', 'Button', 'Badge', 'Input', 'Label', 'Textarea',
        'Select stack', 'Progress',
        'Alert+AlertDescription',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast'],
      lucideIcons: [
        'Building2 — Step 1 + ícone',
        'User — Step 2',
        'FileText — Step 3',
        'CreditCard — Step 4',
        'CheckCircle2 — Step 5 + completed states + submit button',
        'ChevronRight / ChevronLeft — Próximo/Voltar',
        'Upload — uploads de documentos',
        'Plus — Adicionar Sócio',
        'Trash2 — Remover Sócio',
        'Loader2 — submit loading',
        'AlertTriangle — Alert step 3',
        'Info — Alert step 2 + step 5',
      ],
      constants: {
        steps: '5 objetos { id, title, icon }',
        mccOptions: '7 MCCs hardcoded',
      },
    },

    componentState: {
      currentStep: { initial: '1', purpose: 'Step ativo (1-5)' },
      formData: {
        initial: 'objeto profundo com 4 sub-objetos: company fields, address, partners array, documents array, bank_account',
        purpose: 'Estado consolidado de todo o wizard',
      },
    },

    backendIntegration: {
      createMutation: {
        mutationFn: 'Subaccount.create({ ...data, subaccount_id, status:under_review, onboarding_step:5, onboarding_completed:true })',
        onSuccess: 'invalidate + toast + window.location.href = "/Subaccounts"',
      },
    },

    helperFunctions: {
      updateField: '(field, value) => setFormData(prev => ({ ...prev, [field]: value }))',
      updateNestedField: '(parent, field, value) => setFormData prev → parent: { ...prev[parent], [field]: value }',
      addPartner: 'setFormData prev → partners: [...prev.partners, { name, cpf, birth_date, ownership_percentage:0, is_legal_representative:false }]',
      removePartner: '(index) => filter partners',
      updatePartner: '(index, field, value) => map partners with [field]=value at index',
      handleNext: 'currentStep < 5 → setCurrentStep(currentStep + 1)',
      handleBack: 'currentStep > 1 → setCurrentStep(currentStep - 1)',
      handleSubmit: 'createMutation.mutate(formData)',
    },

    layout: {
      pageHeader: {
        title: '"Nova Subconta"',
        subtitle: '"Cadastre uma nova subconta no seu marketplace"',
        breadcrumbs: [{ label: 'Subcontas', href: 'SubaccountsDashboard' }, { label: 'Novo Cadastro' }],
        actions: 'NENHUM',
      },

      progressCard: {
        wrapper: 'Card → CardContent p-6',
        stepsRow: {
          layout: 'flex items-center justify-between mb-4',
          eachStep: {
            iconCircle: {
              completedClass: 'bg-green-500 text-white (currentStep > step.id)',
              currentClass: 'bg-blue-500 text-white (currentStep === step.id)',
              pendingClass: 'bg-gray-200 text-gray-500',
              completedIcon: 'CheckCircle2',
              otherIcon: 'step.icon (Building2/User/FileText/CreditCard/CheckCircle2)',
            },
            stepTitle: 'hidden md:block ml-2 text-sm font-medium — color: gray-900 (>= step.id) ou gray-500',
            connectorLine: 'flex-1 h-0.5 mx-4 — green se currentStep > step.id, senão gray-200',
          },
        },
        progressBar: 'Progress h-2 value=(currentStep/5)*100',
      },

      step1Company: {
        title: 'Building2 + "Dados da Empresa"',
        firstGrid: {
          layout: 'grid grid-cols-1 md:grid-cols-2 gap-4',
          fields: [
            { label: 'CNPJ *', placeholder: '00.000.000/0000-00' },
            { label: 'Razão Social *', placeholder: 'Razão Social da Empresa LTDA' },
            { label: 'Nome Fantasia *', placeholder: 'Nome Fantasia' },
            { label: 'MCC (Categoria) *', component: 'Select 7 opções' },
            { label: 'E-mail Comercial *', type: 'email', placeholder: 'contato@empresa.com' },
            { label: 'Telefone Comercial *', placeholder: '(11) 99999-9999' },
            { label: 'Website', placeholder: 'https://www.empresa.com' },
            { label: 'Data de Abertura', type: 'date' },
          ],
        },
        addressSection: {
          headerLine: 'border-t pt-4 + h4 "Endereço Comercial"',
          grid: 'grid grid-cols-1 md:grid-cols-3 gap-4',
          fields: [
            { label: 'CEP *', placeholder: '00000-000' },
            { label: 'Rua *', span: 'md:col-span-2' },
            { label: 'Número *' },
            { label: 'Complemento' },
            { label: 'Bairro *' },
            { label: 'Cidade *' },
            { label: 'Estado *', component: 'Select 27 UFs' },
          ],
        },
      },

      step2Partners: {
        header: 'User + "Sócios e Representantes" + Button outline sm "Adicionar Sócio"',
        partnerCard: {
          wrapper: 'p-4 border rounded-lg space-y-4',
          topBar: '"Sócio {index+1}" + Trash2 button (red) — só renderiza se partners.length > 1',
          fields: [
            { label: 'Nome Completo *', placeholder: 'Nome completo' },
            { label: 'CPF *', placeholder: '000.000.000-00' },
            { label: 'Data de Nascimento *', type: 'date' },
            { label: 'Participação Societária (%)', type: 'number', min: 0, max: 100 },
          ],
          checkbox: 'native input type=checkbox + Label "Este sócio é representante legal da empresa"',
        },
        bottomAlert: 'Info icon + "Todos os sócios com participação acima de 25% devem ser cadastrados. Ao menos um representante legal é obrigatório."',
      },

      step3Documents: {
        title: 'FileText + "Documentos"',
        grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        documents: 'Array hardcoded com 4 docs',
        eachDoc: {
          wrapper: 'p-4 border-2 border-dashed rounded-lg text-center',
          icon: 'Upload 8x8 gray-400',
          label: 'font-medium text-sm',
          subtitle: 'PDF, PNG ou JPG até 10MB',
          cta: 'Button outline sm "Selecionar Arquivo" (gap: SEM onClick — não faz upload real)',
        },
        bottomAlert: 'AlertTriangle + "Os documentos serão validados automaticamente. Documentos ilegíveis ou inválidos podem atrasar a aprovação."',
      },

      step4BankAccount: {
        title: 'CreditCard + "Conta Bancária para Recebimentos"',
        firstGrid: {
          fields: [
            {
              label: 'Banco *',
              component: 'Select 6 opções (001/341/033/104/237/260)',
              onValueChange: 'set bank_code + auto-set bank_name from hardcoded map',
            },
            {
              label: 'Tipo de Conta *',
              component: 'Select [checking (Conta Corrente), savings (Conta Poupança)]',
            },
            { label: 'Agência *', placeholder: '0000' },
            {
              label: 'Conta *',
              layout: 'flex gap-2: Input flex-1 (account_number) + Input w-16 (account_digit)',
            },
          ],
        },
        pixSection: {
          headerLine: 'border-t pt-4 + h4 "Chave Pix (opcional)"',
          fields: [
            { label: 'Tipo de Chave', component: 'Select [cnpj, email, phone, random]' },
            { label: 'Chave Pix', placeholder: 'Informe a chave' },
          ],
        },
      },

      step5Review: {
        title: 'CheckCircle2 + "Revisão do Cadastro"',
        grid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
        leftColumn: [
          {
            card: 'p-4 bg-gray-50',
            title: 'Building2 + "Empresa"',
            fields: ['CNPJ', 'Razão Social', 'Nome Fantasia', 'MCC', 'E-mail'],
            renderLogic: '"<gray-500>Label:</gray-500> {value || \'-\'}"',
          },
          {
            card: 'p-4 bg-gray-50',
            title: 'User + "Sócios"',
            list: 'partners.map → flex justify-between: name|"Sócio {i+1}" + Badge outline {ownership_percentage}%',
          },
        ],
        rightColumn: [
          {
            card: 'p-4 bg-gray-50',
            title: 'CreditCard + "Conta Bancária"',
            fields: ['Banco', 'Agência', 'Conta-{digit}', 'Pix (opcional)'],
          },
          {
            alert: 'bg-blue-50 border-blue-200 + Info blue-600',
            text: 'Após o envio, o cadastro será analisado automaticamente pelo nosso sistema de IA. Você receberá uma notificação com o resultado em até 24 horas.',
          },
        ],
      },

      navigation: {
        wrapper: 'flex items-center justify-between pt-6 border-t mt-6',
        leftButton: 'Button outline + ChevronLeft + "Voltar" — disabled when currentStep === 1',
        rightButton: {
          steps1to4: 'Button "Próximo" + ChevronRight → handleNext',
          step5: 'Button bg-green-600 hover:bg-green-700 → handleSubmit',
          step5Loading: 'Loader2 animate-spin + "Enviando..." — disabled isPending',
          step5Idle: 'CheckCircle2 + "Enviar Cadastro"',
        },
      },
    },

    knownGaps: [
      'useNavigate importado mas usa window.location.href (full reload em vez de SPA navigation)',
      'Botões "Selecionar Arquivo" do Step 3 SEM onClick — não fazem upload real',
      'Apenas 6 bancos hardcoded — falta lista completa via API',
      '7 MCCs hardcoded — em produção precisa Select pesquisável com 200+ opções',
      'Sem validação por step — usuário pode avançar com campos vazios',
      'Sem máscaras nos inputs (CNPJ, CPF, telefone, CEP) — UX ruim',
      'CEP não busca endereço automaticamente (ViaCEP)',
      'Sem total de % participação calculada e validada (deveria somar 100%)',
      'Sem indicador visual quando algum sócio é UBO (>25%)',
      'Step 5 review não mostra documentos enviados',
      'Step 5 não mostra endereço completo (apenas alguns campos da empresa)',
      'breadcrumbs.href "SubaccountsDashboard" — possível alias quebrado',
      'Onsuccess força window.location.href = "/Subaccounts" — rota legacy (deveria ser /SubaccountsList)',
      'Sem botão "Salvar como rascunho" para retornar depois (entity tem onboarding_step mas não usado)',
    ],

    relationshipsToOtherPages: {
      subaccountsDashboard: '/SubaccountsDashboard — pai (breadcrumb + 2 CTAs apontam aqui)',
      subaccountsList: '/Subaccounts e /SubaccountsList — destino do onSuccess',
      adminIntKYCQueue: '/AdminIntKYCQueue — onde admin interno avalia o status under_review criado',
      adminIntKycAnalysis: '/AdminIntKycAnalysis — análise individual KYC',
      adminIntComplianceQueue: '/AdminIntComplianceQueue — fila de compliance que recebe esta criação',
    },
  },
};

export default SubaccountOnboardingDoc;