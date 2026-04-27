// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBSettingsAccount (Internet Banking) — Entrega 22
// ----------------------------------------------------------------------------
// NONA página do módulo INTERNET BANKING — segunda do bloco CONFIGURAÇÕES
// (primeira sub-página acessada via hub IBSettings).
//
//   1. IBSettingsAccount.jsx (186 linhas) — Dados cadastrais e bancários da conta
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada via Link do hub IBSettings (PRIMEIRO Link de IBSettings linkando
//   para esta sub-página) — fluxo navegacional COMPLETO IBSettings → IBSettingsAccount
// - É a SEGUNDA MENOR PÁGINA do módulo IB inteiro (186L vs IBSettings 90L
//   anterior recordista) — apenas 79% IBProofs (235L), 36% IBExtract (511L),
//   27% IBPixSend (689L), 63% IBHome (297L)
// - É a PRIMEIRA PÁGINA do módulo IB com BOTÃO DE VOLTAR (ArrowLeft Link → hub)
//   — quebra padrão das 8 anteriores (todas eram páginas root sem voltar)
// - É a TERCEIRA PÁGINA do módulo IB que usa `navigator.clipboard.writeText`
//   real (depois de IBPixReceive e dentro de IBPixKeys) — porém com diferença:
//   IBPixReceive copia chave individual, IBPixKeys copia chave individual,
//   IBSettingsAccount copia TODOS os dados bancários AGREGADOS em string
//   multi-linha
//
// PADRÕES NOVOS NA PÁGINA (não vistos nas 8 anteriores do módulo IB):
// - PRIMEIRO botão BACK no header (ArrowLeft Link to=IBSettings via Button ghost
//   icon-only) — quebra padrão de 8 páginas root
// - PRIMEIRO uso REAL e funcional de Edit3 icon em Buttons "Editar" inline
//   (embora SEM onClick — botões dead) — IBPixLimits usou Edit3 mas com onClick
//   que abre Modal real, IBSettingsAccount tem Edit3 inline na linha sem ação
// - PRIMEIRO uso de COPIAR DADOS AGREGADOS em string multi-linha (template
//   literal com 7 linhas formatadas "Banco: X / ISPB: Y / Agência: Z..." )
//   — IBPixReceive copia 1 chave, IBPixKeys copia 1 chave por vez, este copia
//   bloco completo de dados bancários
// - PRIMEIRO uso de Card.bg-slate-50 standalone para destacar bloco de dados
//   bancários (similar ao Counter Card de IBPixKeys e Limit Change Info de
//   IBPixLimits, mas aqui o conteúdo é dados estáticos não interativos)
// - PRIMEIRO uso de "Dica" introduzida com `<strong>` em Alert info — UX padrão
//   educativo cross-link conceitual ("use chaves Pix" sugere migrar para
//   IBPixReceive em vez de transferência tradicional via dados bancários)
// ============================================================================

export const IBSettingsAccountDoc = {
  pageId: 'IBSettingsAccount',
  pagePaths: ['/IBSettingsAccount'],
  module: 'Internet Banking',
  section: 'Configurações — Dados da Conta (sub-página do hub IBSettings)',

  explainer: {
    oneLiner:
      'Tela de Dados Cadastrais e Bancários — 186 linhas 100% MOCK — É A 2ª MENOR PÁGINA do módulo IB inteiro (186L vs IBSettings 90L anterior recordista; 79% IBProofs 235L; 27% IBPixSend 689L). É a PRIMEIRA SUB-PÁGINA do hub IBSettings (acessada via Link do array settingsItems[0]) e a PRIMEIRA PÁGINA do módulo IB com botão BACK no header (ArrowLeft via Link to=IBSettings) — quebra padrão de 8 páginas root anteriores. 3 grandes blocos verticais: (1) **Header com BACK BUTTON** flex items-center gap-4 — ESQUERDA Link to=createPageUrl(IBSettings) wrapping Button ghost size="icon" com ArrowLeft 5w5 / DIREITA bloco h1 "Dados da Conta" 2xl-bold + sublabel "Informações cadastrais e bancárias" — note layout HORIZONTAL header (back+title side-by-side) em vez de VERTICAL stack — mais compacto e padrão "iOS-like" de drilldown navigation; (2) **Cadastral Data Section** com label uppercase "Dados Cadastrais" + Card divide-y entre 5 rows (Razão Social / CNPJ / Nome Fantasia / E-mail / Telefone) — cada row p-4 flex items-center justify-between com bloco label-text-sm slate-500 + value font-medium slate-900 / **APENAS 2 das 5 rows têm Button "Editar"** (E-mail + Telefone) — lógica: Razão Social/CNPJ/Nome Fantasia são dados REGULATÓRIOS imutáveis pela conta cliente (BACEN exige alteração via processo formal de re-KYC) e apenas E-mail/Telefone são dados de CONTATO atualizáveis pelo titular — **decisão de design CORRETA conceitualmente** alinhada com regulamentação financeira brasileira / **GAP CRÍTICO**: ambos Buttons "Editar" (Edit3 icon "Editar") SEM onClick — dead actions / **gap UX crítico adicional**: dados regulatórios imutáveis (Razão Social/CNPJ/Nome Fantasia) deveriam ter ícone Lock 4w4 ou Badge "Imutável" para sinalizar visualmente por que NÃO TÊM botão Editar (vs E-mail/Telefone que têm) — atualmente o usuário pode pensar que o botão "esqueceu de aparecer" / **mocks**: razaoSocial "Loja ABC Comércio Ltda" / cnpj "98.765.432/0001-10" formatado padrão BR / nomeFantasia "Loja ABC" / email "financeiro@lojaabc.com.br" / telefone "(11) 3456-7890" formatado padrão BR — todos coerentes com persona MERCHANT do app inteiro; (3) **Bank Data Section** com label uppercase "Dados Bancários (Para receber)" + sublabel inline "Compartilhe estes dados para receber transferências:" + Card destacado bg-slate-50 dark:bg-slate-800/50 (similar Counter IBPixKeys + Info IBPixLimits) com layout INTERNO grid 2-cols 6 fields (Banco / ISPB / Agência / Conta / Tipo / Titular — note CNPJ está disponível em bankData mas NÃO RENDERIZADO no grid — aparece apenas no template literal de copia tudo / decisão consciente para não duplicar visualmente já que CNPJ aparece também em Dados Cadastrais acima) + bloco bottom pt-4 border-t com Button outline w-full "Copiar tudo" Copy icon condicional Check quando copied=true / **handleCopyAll** constrói template literal multi-linha 7 linhas "Banco: X\\nISPB: Y\\nAgência: Z\\nConta: W\\nTipo: V\\nTitular: U\\nCNPJ: T" via navigator.clipboard.writeText REAL (PRIMEIRO uso de copy AGREGADO no módulo IB) + setTimeout 2000ms para reset feedback / **mocks bancários**: banco "PagSmile Instituição de Pagamento" (correto BACEN — IPs como PagSmile NÃO são bancos) / ispb "12345678" (8 dígitos numéricos correto BACEN para Instituições) / agencia "0001" (padrão para single-branch IPs) / conta "9876543-2" (formato padrão com dígito verificador) / tipo "Conta de Pagamento" (correto BACEN — IPs não têm "Conta Corrente" tradicional) / titular "Loja ABC Comércio Ltda" + cnpj "98.765.432/0001-10" matching dados cadastrais (consistência interna ✓) / **gap regulatório**: faltam fields BACEN comuns: tipo de PIX disponível (chaves cadastradas) / código DOC-TED (compatibilidade com transferências legadas) / IBAN brasileiro (formato 32 chars usado em transferências internacionais) / Bottom Alert info bg-blue-50 com Info icon 5w5 blue-600 + "Dica: Para receber via Pix, use suas chaves cadastradas. É mais rápido e prático!" — **PRIMEIRO cross-link CONCEITUAL no módulo IB** — sugere migrar do método tradicional (transferência via dados bancários) para PIX (mais rápido) — porém SEM Link clicável para /IBPixKeys (gap UX: dica sem ação direta); 1 useState (copied false) — 100% aproveitado (5º caso CONSECUTIVO zero-dead-state após Receive→Keys→Limits→Proofs→SettingsAccount no módulo IB); gaps arquiteturais: (i) **2 Buttons "Editar" sem onClick** — dead inline actions (E-mail e Telefone deveriam abrir Dialog/Drawer para edição); (ii) **Dados regulatórios sem visual lock** — Razão Social/CNPJ/Nome Fantasia precisam de ícone Lock ou Badge "Imutável"; (iii) **Cross-link conceitual sem Link funcional** — Alert "use suas chaves cadastradas" deveria ter Link to=/IBPixKeys ou /IBPixReceive; (iv) **CNPJ duplicado entre accountData.cnpj e bankData.cnpj** — gap arquitetural (mesmo dado em 2 fontes); (v) **Sem audit log** — quando o usuário editar e-mail/telefone deveria ficar registrado em log para fins de auditoria BACEN; (vi) **Sem confirmação 2FA** — apps reais exigem código SMS/email para confirmar mudança de e-mail (ironicamente o e-mail novo); (vii) **Sem upload de comprovante** — em apps bancários reais alterar telefone exige selfie/comprovante; (viii) **Sem expor "Status conta"** — ativa/suspensa/em análise (informação útil para o titular saber); (ix) **Sem expor "Data de abertura da conta"** — dado comum em apps bancários; (x) **Sem expor "Tipo de pessoa" PF/PJ** — apesar dos dados claramente PJ não há badge dizendo; (xi) **Sem download dos dados em PDF** — LGPD requer disponibilizar dados em formato portable; (xii) **Sem opção de "Solicitar alteração de razão social"** — apesar de ser imutável o user deveria poder iniciar processo formal; (xiii) **Sem ICP-Brasil ou compliance MEI vs ME vs LTDA** — diferenciação tributária não exposta; (xiv) **Faltam fields BACEN comuns**: tipo PIX disponível, código DOC-TED, IBAN brasileiro; (xv) **0 useEffect** — dados mockados ao mount sem refetch; (xvi) **ZERO uso SDK base44** — schema Subaccount tem todos esses fields (business_name + legal_name + document + email + phone + bank_account inteiro com structure {bank, ispb, agencia, conta, type, holder}) prontos para uso; (xvii) **Continua gap ZERO i18n** inter-página (todas labels hardcoded em PT-BR — "Dados Cadastrais", "Dados Bancários", "Para receber", "Compartilhe estes dados", "Dica", etc.); (xviii) **Bank account info pre-trimmed para apenas 6 fields** quando mock contém 7 (CNPJ presente mas não renderizado no grid).',

    sectionsBreakdown: {
      headerWithBack: {
        role: 'Header com PRIMEIRO botão BACK do módulo IB',
        layout: 'flex items-center gap-4',
        leftBlock: 'Link to=createPageUrl("IBSettings") wrapping Button ghost icon ArrowLeft 5w5',
        rightBlock: 'h1 "Dados da Conta" + sublabel "Informações cadastrais e bancárias"',
        observation: 'Quebra padrão das 8 páginas anteriores (todas root sem back) / iOS-like drilldown nav',
      },

      cadastralDataSection: {
        role: 'Card divide-y com 5 rows de dados cadastrais',
        rows: [
          '{label: "Razão Social", value: "Loja ABC Comércio Ltda", editable: false}',
          '{label: "CNPJ", value: "98.765.432/0001-10", editable: false}',
          '{label: "Nome Fantasia", value: "Loja ABC", editable: false}',
          '{label: "E-mail", value: "financeiro@lojaabc.com.br", editable: true (dead onClick)}',
          '{label: "Telefone", value: "(11) 3456-7890", editable: true (dead onClick)}',
        ],
        editableLogic: 'APENAS 2/5 (E-mail + Telefone) têm Button Editar — Razão Social/CNPJ/Nome Fantasia regulatórios imutáveis BACEN-aligned',
        designCorrectness: 'Decisão CORRETA conceitualmente — alinhada regulamentação financeira BR',
        gaps: [
          'Buttons "Editar" sem onClick — dead inline actions',
          'Dados imutáveis sem ícone Lock/Badge "Imutável" sinalizando porque não têm botão',
          'Sem audit log para mudanças de email/telefone',
          'Sem confirmação 2FA SMS/email',
          'Sem upload comprovante (apps reais exigem)',
        ],
      },

      bankDataSection: {
        role: 'Card destacado bg-slate-50 com dados bancários para compartilhamento',
        contextLabel: '"Dados Bancários (Para receber)"',
        contextSublabel: '"Compartilhe estes dados para receber transferências:"',

        bankData: {
          banco: '"PagSmile Instituição de Pagamento" — correto BACEN (IPs ≠ bancos)',
          ispb: '"12345678" — 8 dígitos numéricos correto BACEN',
          agencia: '"0001" — padrão single-branch IPs',
          conta: '"9876543-2" — formato com dígito verificador correto',
          tipo: '"Conta de Pagamento" — correto BACEN (IPs não têm CC tradicional)',
          titular: '"Loja ABC Comércio Ltda" matching cadastrais ✓',
          cnpj: '"98.765.432/0001-10" presente em mock mas NÃO renderizado no grid (apenas no copy template)',
        },

        innerLayout: 'grid grid-cols-2 gap-4 com 6 fields (CNPJ omitido)',
        copyButton: {
          element: 'Button outline w-full "Copiar tudo" / "Copiado!" condicional',
          icon: 'Copy → Check quando copied=true',
          stateClass: 'cn class condicional emerald-50 quando copied',
          handler: 'handleCopyAll constrói template literal 7 linhas + clipboard.writeText REAL + setTimeout 2000ms reset',
          uniqueness: 'PRIMEIRO uso de copy AGREGADO multi-linha no módulo IB',
        },

        bottomAlert: {
          styling: 'bg-blue-50 + Info icon blue-600',
          content: '"Dica: Para receber via Pix, use suas chaves cadastradas. É mais rápido e prático!"',
          uniqueness: 'PRIMEIRO cross-link conceitual do módulo IB — sugere migrar para /IBPixKeys',
          gap: 'CONCEITUAL apenas — sem Link funcional para /IBPixKeys ou /IBPixReceive',
        },
      },
    },

    knownGapsAcrossPage: [
      '2 Buttons "Editar" (E-mail + Telefone) sem onClick — dead inline actions',
      'Dados regulatórios sem ícone Lock/Badge "Imutável" sinalizando porque não têm botão Editar',
      'Cross-link conceitual sem Link funcional para /IBPixKeys',
      'CNPJ duplicado entre accountData.cnpj e bankData.cnpj — gap arquitetural',
      'Sem audit log para mudanças de e-mail/telefone',
      'Sem confirmação 2FA SMS/email para mudança de contato',
      'Sem upload de comprovante para alteração',
      'Sem expor Status conta (ativa/suspensa/em análise)',
      'Sem expor Data de abertura da conta',
      'Sem expor Tipo de pessoa PF/PJ via badge',
      'Sem download dos dados em PDF (LGPD)',
      'Sem opção "Solicitar alteração de razão social" formal',
      'Sem diferenciação tributária MEI/ME/LTDA',
      'Faltam fields BACEN comuns: tipo PIX, código DOC-TED, IBAN brasileiro',
      '0 useEffect — sem refetch on focus',
      'ZERO uso SDK base44 (schema Subaccount tem TODOS fields prontos)',
      'CNPJ presente em bankData mas NÃO renderizado no grid (só no copy template)',
      'Continua gap ZERO i18n inter-página IB',
    ],
  },

  technical: {
    fileLocation: 'pages/IBSettingsAccount.jsx (186 linhas — 2ª MENOR PÁGINA do módulo IB; 79% IBProofs 235L; 27% IBPixSend 689L; 63% IBHome 297L)',
    routePath: '/IBSettingsAccount',
    moduleAffinity: 'Internet Banking — segunda página do bloco Configurações (sub-página)',
    accessedFrom: ['IBSettings hub via Link settingsItems[0] account'],

    imports: {
      react: 'useState (1× hook)',
      reactRouter: 'Link de react-router-dom (PRIMEIRO uso após IBSettings)',
      utils: 'createPageUrl de @/components/utils',
      lucide: '[ArrowLeft, Building2, Mail, Phone, Edit3, Copy, Check, Info] — 8 icons',
      uiComponents: '[Card+CardContent+CardHeader (não usado)+CardTitle (não usado), Button, Badge (não usado)]',
      utilsLocal: 'cn de @/lib/utils — usado no Button copyAll',
    },

    deadImports: {
      list: ['Building2 — não usado (talvez planejado para header icon?)', 'Mail — não usado (E-mail row sem icon)', 'Phone — não usado (Telefone row sem icon)', 'CardHeader — não usado', 'CardTitle — não usado', 'Badge — não usado'],
      count: 6,
      observation: 'IBSettingsAccount tem 6 dead imports — PIOR cleanup superando IBProofs (5) anterior recordista / Mail/Phone presentes mas rows não usam icons → linha simples só com label+value (consistência)',
      hypothesisHistorical: 'Mail/Phone sugerem versão anterior do mock tinha icons em cada row (similar IBPixKeys) que foram removidos para layout mais limpo, mas imports ficaram',
    },

    stateManagement: {
      hooksCount: 1,
      hooks: ['copied false — controla feedback visual do button "Copiar tudo"'],
      complexity: 'TODOS aproveitados — 5º caso CONSECUTIVO zero-dead-state (Receive→Keys→Limits→Proofs→SettingsAccount)',
      pattern: 'Padrão de copy-feedback igual IBPixReceive — setTimeout 2000ms reset',
    },

    helperFunctions: {
      handleCopyAll: 'Constrói template literal multi-linha + clipboard.writeText + setCopied(true) + setTimeout(2000) reset',
      observation: 'Padrão idêntico a IBPixReceive handleCopy mas com PAYLOAD agregado (7 linhas vs 1 chave)',
      duplicationGap: 'Padrão setTimeout copy feedback DUPLICADO entre IBPixReceive (1×) + IBPixKeys (1×) + IBSettingsAccount (1×) = 3 implementações inline sem extrair para hook useCopyToClipboard',
    },

    crossPageNavigation: {
      linksRenderizados: '1 — Link to=createPageUrl(IBSettings) (back button)',
      observation: 'Quebra ilha das páginas root — primeiro back button do módulo IB',
      missingLinks: [
        'Sem Link funcional na "Dica" de baixo para /IBPixKeys ou /IBPixReceive',
        'Sem Link para outras sub-pages settings (Security/Notifications/Access)',
      ],
    },

    designSystem: {
      backButtonPattern: 'PRIMEIRO botão BACK do módulo IB — Link to=hub via Button ghost icon ArrowLeft',
      cardElevationContrast: 'Cadastral Card normal vs Bank Card bg-slate-50 standalone — distinção visual clara entre dados editáveis (em Card neutro) vs dados compartilháveis (Card destacado)',
      dataImmutabilityVisual: 'GAP — sem Lock icon ou Badge "Imutável" para dados regulatórios',
      copyFeedbackPattern: 'Copy → Check + bg-emerald-50 / 5º caso de feedback temporal no módulo IB',
    },

    accountDataMockData: {
      structure: '{razaoSocial, cnpj, nomeFantasia, email, telefone}',
      values: {
        razaoSocial: '"Loja ABC Comércio Ltda"',
        cnpj: '"98.765.432/0001-10" (formato BR padrão)',
        nomeFantasia: '"Loja ABC"',
        email: '"financeiro@lojaabc.com.br"',
        telefone: '"(11) 3456-7890" (formato BR padrão)',
      },
      consistency: 'Persona MERCHANT consistente com app inteiro',
    },

    bankDataMockData: {
      structure: '{banco, ispb, agencia, conta, tipo, titular, cnpj}',
      values: {
        banco: '"PagSmile Instituição de Pagamento" — BACEN-aligned (IP ≠ banco)',
        ispb: '"12345678" — 8 dígitos correto BACEN',
        agencia: '"0001" — padrão single-branch',
        conta: '"9876543-2" — formato com dígito verificador',
        tipo: '"Conta de Pagamento" — BACEN-aligned (IPs não têm CC)',
        titular: '"Loja ABC Comércio Ltda" matching accountData.razaoSocial ✓',
        cnpj: '"98.765.432/0001-10" matching accountData.cnpj ✓',
      },
      duplicationGap: 'CNPJ duplicado entre accountData e bankData — mesmo valor em 2 fontes',
      gridRendering: 'CNPJ presente no objeto mas NÃO renderizado no grid (decisão consciente — apenas no copy template)',
      missingFields: [
        'tipo de PIX disponível (chaves cadastradas)',
        'código DOC-TED (compat transferências legadas)',
        'IBAN brasileiro (32 chars internacionais)',
      ],
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'Header h1+sublabel + 2 section labels + 5 row labels cadastrais + 7 field labels bancários + button text + alert text = ~20 strings hardcoded',
      impact: 'IBHome (22) → 8 outras páginas (0 cada) → IBSettingsAccount (0)',
    },

    knownGapsTechnical: [
      '186 linhas 100% MOCK — 2ª MENOR DO MÓDULO IB',
      '1 useState — 100% aproveitado (5º caso consecutivo zero-dead-state)',
      '0 useEffect',
      'ZERO i18n — gap inter-página persiste',
      '6 DEAD IMPORTS — PIOR cleanup do módulo IB superando IBProofs (5)',
      '2 Buttons Editar dead onClick',
      'Dados imutáveis sem visual Lock/Badge',
      'Cross-link conceitual sem Link funcional',
      'CNPJ duplicado em 2 fontes (accountData+bankData)',
      'CNPJ presente em bankData mas omitido do grid render',
      'Sem audit log mudanças contato',
      'Sem confirmação 2FA mudança email',
      'Sem upload comprovante',
      'Sem Status conta exposto',
      'Sem Data abertura conta',
      'Sem Badge tipo PF/PJ',
      'Sem download LGPD PDF',
      'Sem solicitar alteração razão social formal',
      'Sem diferenciação tributária MEI/ME/LTDA',
      'Faltam fields BACEN: PIX disponível, DOC-TED, IBAN',
      'ZERO uso Subaccount.get() do SDK',
      'Padrão setTimeout copy feedback duplicado 3× no módulo (não extraído para hook)',
      'PRIMEIRO botão BACK do módulo IB',
      'PRIMEIRO copy AGREGADO multi-linha do módulo IB',
      'PRIMEIRO cross-link conceitual do módulo IB',
    ],
  },
};

export default IBSettingsAccountDoc;