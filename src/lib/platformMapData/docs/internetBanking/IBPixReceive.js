// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBPixReceive (Internet Banking) — Entrega 17
// ----------------------------------------------------------------------------
// QUARTA página do módulo INTERNET BANKING — segunda do bloco PIX (4 páginas).
//
//   1. IBPixReceive.jsx (271 linhas) — Receber Pix via chave ou QR Code
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada principalmente pelo Quick Action 2 do IBHome (Link → IBPixReceive blue)
//   E pelo menu IB lateral sub-item de PIX
// - É a CONTRAPARTE simétrica do IBPixSend — enquanto Send é wizard 5-steps de
//   ENVIO, Receive é tela curta single-page para EXPOR chaves e GERAR QR Code
// - Drasticamente MENOR que IBPixSend (271L vs 689L = 39% do tamanho) — denota
//   que receber é fluxo conceitualmente mais simples (não há senha, não há
//   confirmação, não há valor obrigatório, não há autenticação)
//
// PADRÃO ARQUITETURAL — POSITIVO E DIFERENTE DAS DEMAIS:
// - É a PRIMEIRA página do módulo IB com `navigator.clipboard.writeText()` REAL
//   funcional — IBExtract tinha Copy importado mas não usava, IBHome não copia
//   nada, IBPixSend tem Copy icon mas só para "Copia e Cola" no Step 1 QR
//   variant que é dead end. IBPixReceive USA clipboard API NATIVA do browser
//   em 2 lugares distintos (handleCopy nas chaves + onClick no Pix Copia e Cola)
// - É a PRIMEIRA página do módulo com FEEDBACK VISUAL TEMPORÁRIO via setTimeout
//   ("Copiado" check verde por 2000ms → volta para "Copiar") — interatividade
//   NEW para IB
// - QR Code visual é GERADO em JS via `Math.random() > 0.5` em grid 8×8 = 64
//   células — placeholder visual MOCK MUITO INTERESSANTE arquiteturalmente:
//   re-gerada A CADA RENDER (aleatoriedade não memoizada), o que significa que
//   abrir o Modal duas vezes mostra QR Codes DIFERENTES — e o "QR Code" não
//   codifica nada (apenas decoração visual de pixels aleatórios)
// ============================================================================

export const IBPixReceiveDoc = {
  pageId: 'IBPixReceive',
  pagePaths: ['/IBPixReceive'],
  module: 'Internet Banking',
  section: 'PIX — Receber Pix (4ª tela do módulo, 2ª do bloco PIX)',

  explainer: {
    oneLiner:
      'Tela compacta de Receber Pix — 271 linhas 100% MOCK — DRASTICAMENTE menor que IBPixSend (39% do tamanho) refletindo a natureza conceitualmente mais simples do receber: não há wizard, não há password, não há confirmação destrutiva, não há valor obrigatório (no caso de QR estático), não há autenticação intermediária. Página single-page com 3 grandes blocos verticais + 1 Modal popup: (1) **Header simples** título "Receber Pix" 2xl-bold + sublabel "Compartilhe suas chaves ou gere um QR Code" — sem Badge, sem ícone contextual, sem botão de ação no header (continuação do padrão minimalista do IBExtract — diferente da saudação contextual do IBHome) / (2) **Suas Chaves Pix Card** com label de seção uppercase "Suas Chaves Pix" + helper text "Compartilhe uma chave para receber Pix:" + Card body p-0 divide-y entre 3 rows (cnpj / email / random) — cada row é flex justify-between com padding p-4: ESQUERDA traz square 10w10 rounded-lg bg-slate-100 contendo icon contextual da chave (Building2/Mail/Hash) + 2-line text (label "CNPJ"/"E-mail"/"Chave Aleatória" sm slate-500 + valor da chave font-medium slate-900 com `break-all` permitindo word-break em chaves longas — feature crítica para chave aleatória de 36 chars UUID-like que sem break-all quebraria o layout) / DIREITA traz Button outline sm "Copiar" com Copy icon que executa `handleCopy(key)` invocando `navigator.clipboard.writeText(key.value)` REAL + setCopiedKey(key.type) state + setTimeout(reset, 2000ms) que volta para estado original / Quando copiedKey === key.type o Button MUDA visualmente: bg-emerald-50 + border-emerald-200 + text-emerald-600 + label "Copiado" + ícone Check (check verde ao invés de Copy) — feedback temporário UX correto e PRIMEIRO uso real de clipboard API do módulo IB; **mocks das chaves**: 3 hardcoded — CNPJ "98.765.432/0001-10" / E-mail "financeiro@lojaabc.com.br" / Aleatória UUID "a1b2c3d4-e5f6-7890-abcd-ef1234567890" — note que a chave aleatória parece um UUID v4 padrão (8-4-4-4-12 chars com hexadecimal) que de fato é o formato BACEN espera para chaves aleatórias PIX (32 chars hex + dashes). Note também a AUSÊNCIA de tipo CPF e Telefone (4 dos 5 tipos BACEN suportados) — gap de mock: o merchant Loja ABC poderia ter telefone cadastrado, mas só tem 3 chaves expostas; (3) **Gerar QR Code Section** com label uppercase "Gerar QR Code" + grid grid-cols-2 gap-4 com 2 Cards selecionáveis: Card ESTÁTICO (sem valor — pagador informa) com circle 14w14 bg-slate-100 cinza neutro + QrCode icon 7w7 slate-600 + título "QR Code Estático" + descrição "Sem valor definido. O pagador informa o valor." + Button full-width #00D26A "Gerar QR" / Card DINÂMICO (com valor) com circle 14w14 bg-#00D26A/10 + QrCode icon 7w7 #00D26A (cor brand wizard) + título "QR Code com Valor" + descrição "Defina um valor específico para receber." + Button #00D26A "Gerar QR" — note que Card Dinâmico tem o icon JÁ COLORIDO de verde indicando ser a opção PREFERENCIAL/RECOMENDADA visualmente (UX hint sutil) / ambos Cards têm onClick que faz dupla mutação `setQrType("static" OR "dynamic")` + `setShowQrModal(true)` — abrir modal e setar tipo simultaneamente; (4) **QR Code Modal Dialog** controlado por `showQrModal` (boolean) + `qrType` (static/dynamic) com max-w-md e DialogTitle dinâmico baseado em qrType / Renderização condicional em 2 fases: (a) **Fase 1: Input de Valor** quando `qrType === "dynamic" && !qrAmount` — Label "Valor a receber" + Input type="number" placeholder "0,00" h-14 text-xl bold com prefix "R$" absolute decorativo + Button "Gerar QR Code" #00D26A com `disabled={!qrAmount || parseFloat(qrAmount) <= 0}` MAS `onClick={() => {}}` (FUNÇÃO VAZIA — gap funcional crítico — o button "gera" sem nada fazer, dependendo do truque da fase 2 que verifica `qrAmount` truthy para auto-mostrar QR sem clicar no Button — UX confuso pois o Button parece ser obrigatório mas a fase 2 já tinha entrado em vigor depois do user digitar valor) / (b) **Fase 2: QR Code Display** quando `qrType === "static" || qrAmount` — render de 5 sub-blocos: (i) **QR Visual placeholder** flex flex-col items-center p-6 bg-white rounded-2xl border com area 48w48 bg-slate-100 rounded-xl contendo grid 8×8 = 64 cells `Array.from({length: 64}).map((_, i) => <div className="w-4 h-4 rounded-sm" + cn condicional (Math.random() > 0.5 ? "bg-slate-900" : "bg-white")>)` — **DETALHE CRÍTICO**: o `Math.random()` é executado A CADA RENDER do componente — cada vez que o Modal abre/fecha/re-renderiza, o pattern visual MUDA (gap UX — QR não deveria mudar mas placeholder muda, e mais: nenhuma das 64 células codifica dados reais — é estética pura) (ii) Texto "Loja ABC Comércio Ltda" font-semibold + "CNPJ: 98.765.432/0001-10" sm slate-500 — HARDCODED não vem de auth user (iii) Badge condicional: dynamic+amount → `bg-[#00D26A]` text-white text-lg px-4 py-1 com formatCurrency(parseFloat(qrAmount)) / static → `variant="outline"` com label "Valor livre" — comunica visualmente o tipo do QR (iv) **Pix Copia e Cola** com Label "Pix Copia e Cola" sm slate-500 + Input readOnly font-mono text-xs com VALOR HARDCODED `"00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540550.005802BR5925LOJA ABC COMERCIO LTDA..."` (BR Code BACEN truncado com "...") + Button absolute right-1 secondary "Copiar" com `onClick={() => navigator.clipboard.writeText("00020126580014br.gov.bcb.pix...")}` — **GAP CRÍTICO**: o Input mostra a string LONGA mas o clipboard COPIA A STRING TRUNCADA "00020126580014br.gov.bcb.pix..." (sem o `...` interpretado como literal — copia o que o user vê inicialmente mas SEM os bytes finais do BR Code) — copia inválido para pagamento real (mock óbvio mas funcionalmente quebrado se fosse produção) (v) **Share Options** flex gap-3 com 3 Buttons outline flex-1: WhatsApp (MessageCircle icon) / E-mail (Mail icon) / Salvar (Download icon) — **TODOS SEM onClick** (dead actions consistente com gap conhecido do mock); 4 useState hooks (copiedKey null / showQrModal false / qrType "static" / qrAmount "") — todos efetivamente USADOS (ZERO dead state diferente de IBPixSend que tinha saveAsFavorite morto) + 1 array pixKeys com 3 mocks + 2 funções (handleCopy + formatCurrency); gaps arquiteturais: (i) **3 dos 5 tipos BACEN renderizados** — falta CPF e Telefone (mas Loja ABC é CNPJ então CPF não se aplica; telefone é gap de configuração); (ii) **QR Code visual é Math.random() não memoizado** — re-render gera pattern diferente; (iii) **Button "Gerar QR Code" no fase 1 dynamic é onClick vazio** — depende de truque de re-render para passar para fase 2; (iv) **Pix Copia e Cola Input mostra string longa MAS clipboard copia string truncada** — gap funcional crítico em mock; (v) **Share buttons WhatsApp/Email/Salvar todos dead** — sem download de QR como imagem (que seria a ação mais comum); (vi) **Sem geração de imagem PNG do QR para baixar** — Button "Salvar" sem implementação; (vii) **Sem expiração configurável do QR dinâmico** — BACEN suporta cobrança com expiração (ex: 24h) que não é exposta na UI; (viii) **Sem campo "Solicitar identificação do pagador"** — feature comum em apps bancários para conhecer quem está pagando antes de receber; (ix) **Sem campo "Mensagem"/"Memo"** no QR dinâmico para anexar descrição (que IBPixSend tem maxLength=140); (x) **Sem histórico de QR Codes gerados** — cada QR gerado some ao fechar Modal sem persistência; (xi) **Sem QR Code com expiração imediata vs longa** — todo BACEN PIX QR dinâmico exige txid único + expiração — UI promete simplicidade mas omite detalhes BACEN; (xii) **modal close não reseta qrAmount** — abrir modal estático depois de dynamic com amount preenchido pode mostrar fase 2 imediata pois `qrType==="static" || qrAmount` é truthy se qrAmount foi setado em dynamic anterior — bug de state stale; (xiii) **3 chaves no mock mas BACEN limita a 5 chaves por CPF/CNPJ** — IBPixKeys (próxima página do bloco) vai gerenciar adicionar/remover; (xiv) **Sem mostrar quantos PIX foram recebidos via cada chave** — analytics que ajudaria entender uso; (xv) **break-all no valor da chave aleatória** — boa prática para UUID 36-chars que sem break-all quebraria layout horizontal.',

    sectionsBreakdown: {
      headerMinimal: {
        role: 'Header simples sem ícone/badge',
        content: '[Title "Receber Pix" 2xl-bold / Sublabel "Compartilhe suas chaves ou gere um QR Code"]',
        contrastWithIBHome: 'Continua padrão minimalista do IBExtract — sem saudação contextual',
      },

      pixKeysList: {
        role: 'Lista de chaves PIX para compartilhamento direto',
        cardStructure: 'Card divide-y com 3 rows',
        rowLayout: 'flex justify-between p-4 — esquerda info, direita botão Copy',

        leftBlock: {
          structure: '[icon square 10w10 rounded-lg + 2-line text]',
          iconContextual: 'Building2 (CNPJ) / Mail (E-mail) / Hash (Aleatória) — semanticamente apropriado',
          textBlock: '[label "CNPJ"/"E-mail"/"Chave Aleatória" / valor da chave font-medium com break-all]',
          breakAllUtility: 'CSS `break-all` permite quebra de palavra em qualquer char — crítico para chave aleatória 36 chars UUID',
        },

        rightBlock: {
          structure: 'Button outline sm com Copy icon',
          interactivity: 'PRIMEIRA real do módulo IB',
          handleCopy: '`navigator.clipboard.writeText(key.value)` REAL + setCopiedKey(type) + setTimeout reset 2000ms',
          visualFeedback: 'Quando copiedKey === key.type: bg-emerald-50 + border-emerald-200 + text-emerald-600 + Check icon + label "Copiado"',
          duration: '2 segundos visual antes de voltar — UX padrão de copy confirmation',
        },

        mocksKeys: '[CNPJ 98.765.432/0001-10 / E-mail financeiro@lojaabc.com.br / Aleatória a1b2c3d4-e5f6-7890-abcd-ef1234567890]',
        bacenAlignment: 'UUID format 8-4-4-4-12 hex chars — formato BACEN correto para chave aleatória',
        gapsBacenTypes: 'Faltam CPF (não se aplica para CNPJ merchant) e Telefone (configurável mas ausente)',
      },

      generateQRSection: {
        role: 'Geração de QR Code em 2 modalidades',
        gridLayout: 'grid grid-cols-2 gap-4',

        cardStatic: {
          purpose: 'QR sem valor — pagador informa',
          icon: 'QrCode 7w7 slate-600 em circle 14w14 bg-slate-100 (NEUTRO)',
          description: '"Sem valor definido. O pagador informa o valor."',
          buttonAction: '`{ setQrType("static"); setShowQrModal(true); }` dupla mutação',
        },

        cardDynamic: {
          purpose: 'QR com valor específico predefinido',
          icon: 'QrCode 7w7 #00D26A em circle 14w14 bg-#00D26A/10 (BRAND COLOR — UX hint preferencial)',
          description: '"Defina um valor específico para receber."',
          buttonAction: '`{ setQrType("dynamic"); setShowQrModal(true); }`',
          uxHint: 'Card visual já colorido sutilmente sugere ser a opção recomendada',
        },
      },

      qrModalDialog: {
        role: 'Modal de geração e exibição de QR',
        controlState: 'showQrModal boolean + qrType string + qrAmount string',
        renderConditions: '2 fases condicionais',

        phase1AmountInput: {
          condition: 'qrType==="dynamic" && !qrAmount',
          structure: '[Label "Valor a receber" / Input h-14 text-xl R$ prefix / Button "Gerar QR Code"]',
          buttonGap: 'onClick={() => {}} VAZIO — depende de truque de re-render fase 2',
          gap: 'Button parece obrigatório mas é decorativo — UX confuso',
        },

        phase2QRDisplay: {
          condition: 'qrType==="static" OR qrAmount truthy',
          subBlocks: [
            'QR Visual 48w48 placeholder com grid 8×8 cells Math.random()',
            'Texto identificação Loja ABC + CNPJ',
            'Badge condicional (dynamic com valor / static "Valor livre")',
            'Pix Copia e Cola Input readOnly + Button Copy',
            'Share Options 3 Buttons (WhatsApp/Email/Salvar)',
          ],

          qrVisualPattern: {
            implementation: 'Array.from({length: 64}).map com Math.random() > 0.5 → bg-slate-900 ou bg-white',
            criticalGap: 'Math.random() executado A CADA RENDER — pattern muda ao reabrir Modal — não codifica dados reais',
            purpose: 'Decoração visual pura — placeholder MOCK',
          },

          identificationText: {
            content: '"Loja ABC Comércio Ltda" + "CNPJ: 98.765.432/0001-10"',
            gap: 'HARDCODED — não vem de auth user logado',
          },

          conditionalBadge: {
            dynamic: 'bg-#00D26A text-white text-lg com formatCurrency(parseFloat(qrAmount))',
            static: 'variant="outline" com label "Valor livre"',
          },

          pixCopyPaste: {
            inputDisplay: 'BR Code BACEN string longa: "00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540550.005802BR5925LOJA ABC COMERCIO LTDA..."',
            inputType: 'readOnly font-mono text-xs',
            copyButton: 'absolute right-1 secondary',
            criticalBug: 'onClick copia STRING DIFERENTE do que mostra: clipboard.writeText("00020126580014br.gov.bcb.pix...") — copia versão truncada, não o BR Code completo do Input',
          },

          shareOptions: {
            buttons: '[WhatsApp MessageCircle / E-mail Mail / Salvar Download]',
            allDead: 'TODOS sem onClick — dead actions',
          },
        },
      },
    },

    knownGapsAcrossPage: [
      'QR Code visual é Math.random() não memoizado — pattern muda a cada render',
      'Button "Gerar QR Code" fase 1 dynamic tem onClick vazio — depende de truque re-render',
      'Pix Copia e Cola Input mostra string longa MAS clipboard copia string TRUNCADA — bug funcional',
      'Share buttons WhatsApp/Email/Salvar todos dead (sem onClick)',
      'Sem geração de imagem PNG do QR para baixar (Salvar Button morto)',
      'Sem expiração configurável do QR dinâmico (BACEN suporta)',
      'Sem campo Mensagem/Memo no QR dinâmico (IBPixSend tem maxLength=140)',
      'Sem histórico de QR Codes gerados — cada QR some ao fechar',
      '3 dos 5 tipos BACEN renderizados (faltam CPF não-aplicável e Telefone)',
      'Identificação Loja ABC HARDCODED não vem de auth',
      'Modal close não reseta qrAmount — bug de stale state',
      'Sem solicitar identificação do pagador',
      'Sem analytics de uso por chave (quantos PIX recebeu cada uma)',
      'BR Code do Pix Copia e Cola é literal hardcoded sem regenerar para QR dinâmico com valor',
      'Sem QR Code com URL curta para compartilhar (link que abre o QR no mobile)',
      'Sem botão regenerar/atualizar QR',
      'Sem aviso de "QR já compartilhado X vezes"',
    ],
  },

  technical: {
    fileLocation: 'pages/IBPixReceive.jsx (271 linhas — 39% do tamanho de IBPixSend 689L, 53% de IBExtract 511L)',
    routePath: '/IBPixReceive',
    moduleAffinity: 'Internet Banking — segunda página do bloco PIX',
    accessedFrom: [
      'Quick Action 2 do IBHome (Link → IBPixReceive blue gradient)',
      'Menu lateral IB (sub-item de PIX)',
    ],

    imports: {
      react: 'useState (4× hooks)',
      reactRouter: 'NÃO IMPORTADO (gap — sem Link de volta)',
      i18n: 'NÃO IMPORTADO — todas strings em PT hardcoded (gap inter-página)',
      lucide: '[QrCode, Copy, Check, Building2, Mail, Hash, Share2, Download, MessageCircle, ArrowLeft] — 10 icons',
      uiComponents: '[Card, CardContent, CardHeader (não usado), CardTitle (não usado), Button, Badge, Input, Label, Dialog+DialogContent+DialogHeader+DialogTitle]',
      utils: 'cn de @/lib/utils',
    },

    deadImports: {
      list: ['Share2 — importado mas NÃO USADO (Share2 nunca aparece no JSX, talvez confundido com botão WhatsApp/Email/Salvar)', 'ArrowLeft — importado mas NÃO USADO (não há botão back nesta tela)', 'CardHeader — importado mas NÃO USADO', 'CardTitle — importado mas NÃO USADO'],
      observation: '4 dead imports — IBPixReceive tem MAIS dead imports que IBPixSend (1) — inconsistência de cleanup',
    },

    stateManagement: {
      hooksCount: '4 useState — 44% menos que IBPixSend (9), mais que IBHome (1)',
      hooks: [
        'copiedKey default null — controla feedback temporário do botão Copiar',
        'showQrModal default false — controla Dialog open',
        'qrType default "static" — static ou dynamic',
        'qrAmount default "" — valor do QR dinâmico',
      ],
      complexity: 'TODOS efetivamente usados — ZERO dead state (diferente de IBPixSend que tinha saveAsFavorite morto)',
      observation: 'Único caso na plataforma com 100% dos useState aproveitados',
    },

    helperFunctions: {
      handleCopy: '`(key) => { navigator.clipboard.writeText(key.value); setCopiedKey(key.type); setTimeout(() => setCopiedKey(null), 2000); }` — PRIMEIRA implementação real de clipboard API + feedback temporário do módulo IB',
      formatCurrency: 'Inline padrão Intl.NumberFormat pt-BR BRL — sem máscara privacidade',
    },

    clipboardAPIUsage: {
      firstInModule: 'IBPixReceive é PRIMEIRO uso real de navigator.clipboard.writeText() no módulo IB',
      occurrences: 2,
      occurrence1: 'handleCopy invocado por Button outline em cada chave — copia key.value',
      occurrence2: 'onClick do Button "Copiar" no Pix Copia e Cola — copia STRING TRUNCADA hardcoded',
      bug: 'occurrence 2 copia string DIFERENTE do que mostra no Input — gap funcional',
    },

    qrPlaceholderLogic: {
      implementation: '`Array.from({ length: 64 }).map((_, i) => <div className={cn("w-4 h-4 rounded-sm", Math.random() > 0.5 ? "bg-slate-900" : "bg-white")} />)`',
      gridSize: '8×8 = 64 células',
      cellSize: '4w4',
      randomness: 'Math.random() executado A CADA RENDER — pattern muda',
      memoization: 'NÃO memoizado com useMemo — gap performance/UX',
      semantics: 'Decoração visual pura — não codifica dados',
      contrastWithRealQR: 'QR Code real teria pattern fixo determinístico baseado em payload',
    },

    designSystem: {
      pixOfficialColor: '#00D26A — verde oficial PIX (consistente com IBPixSend)',
      brandColorAbsence: 'Brand #2bc196 PagSmile NÃO usado nesta página (igual IBPixSend)',
      consistencyWithIBPixSend: 'Mesma palette emerald-PIX-oficial — coerência inter-página dentro do bloco PIX',
      designPattern: '14w14 circles para Card icons / 10w10 squares para list-row icons / 4w4 cells para QR placeholder',
    },

    rechartsUsage: 'NENHUMA',

    crossPageNavigation: {
      linksRenderizados: 'NENHUM — IBPixReceive não linka para nenhuma outra página',
      missingLinks: [
        'Sem voltar para IBHome',
        'Sem Link para IBPixKeys (gerenciar/adicionar chaves)',
        'Sem Link para IBPixLimits',
        'Sem Link para IBExtract após receber Pix',
      ],
      observation: 'Ilha de navegação como IBExtract — usuário só sai via header global',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'CENTENAS de strings em PT — header, labels uppercase, placeholders, button labels, descriptions, badge labels',
      impact: 'Continua gap inter-página IBHome (22 keys) → IBExtract (0) → IBPixSend (0) → IBPixReceive (0)',
    },

    pixKeysMockData: {
      structure: '[{type, value, icon, label}]',
      count: 3,
      keys: [
        '{type: "cnpj", value: "98.765.432/0001-10", icon: Building2, label: "CNPJ"}',
        '{type: "email", value: "financeiro@lojaabc.com.br", icon: Mail, label: "E-mail"}',
        '{type: "random", value: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", icon: Hash, label: "Chave Aleatória"}',
      ],
      bacenFormatRandom: 'UUID v4-like 8-4-4-4-12 hex — alinhado com formato BACEN',
      missingTypes: 'CPF (não-aplicável CNPJ merchant) / Telefone (gap de configuração)',
      bacenLimitTotal: 'BACEN limita 5 chaves por CNPJ — mock tem 3 (espaço para mais 2)',
    },

    knownGapsTechnical: [
      '271 linhas 100% MOCK — zero SDK base44',
      'ZERO i18n — gap inter-página persiste',
      '4 dead imports (Share2, ArrowLeft, CardHeader, CardTitle)',
      '4 useState — 100% aproveitados (zero dead state — único caso na plataforma)',
      'QR Code visual com Math.random() não memoizado',
      'Button "Gerar QR Code" fase 1 dynamic onClick vazio',
      'Pix Copia e Cola copia string truncada vs Input mostra completo',
      'Share buttons WhatsApp/Email/Salvar todos dead',
      'Sem geração PNG do QR para download',
      'Sem expiração configurável QR dinâmico',
      'Sem campo Mensagem/Memo no QR dinâmico',
      'Sem histórico QR gerados',
      '3/5 tipos BACEN renderizados (CPF e Telefone faltam)',
      'Identificação Loja ABC hardcoded',
      'Modal close não reseta qrAmount (stale state)',
      'Sem solicitar identificação pagador',
      'Sem analytics por chave',
      'BR Code Pix Copia e Cola hardcoded literal — não regenera para QR dinâmico com valor variável',
      'Sem URL curta compartilhável',
      'Sem botão regenerar QR',
      'Sem aviso "QR compartilhado X vezes"',
      'CardHeader e CardTitle importados mas não usados',
      'ArrowLeft importado sem botão back',
      'Share2 importado mas componentes share usam MessageCircle/Mail/Download',
    ],
  },
};

export default IBPixReceiveDoc;