// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBPixSend (Internet Banking) — Entrega 16
// ----------------------------------------------------------------------------
// TERCEIRA página do módulo INTERNET BANKING — primeira do bloco PIX (4 páginas).
//
//   1. IBPixSend.jsx (689 linhas) — Wizard multi-step de envio de PIX
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada principalmente pelo Quick Action 1 do IBHome (Link → IBPixSend)
// - É a tela MAIS COMPLEXA do módulo IB até agora — wizard de 5 steps
//   controlados por single useState `step` (0..4)
// - Bloco PIX no menu IB tem 4 páginas: IBPixSend / IBPixReceive / IBPixKeys /
//   IBPixLimits — IBPixSend é a primeira e a com fluxo mais longo
//
// IMPORTANTE — DIFERENÇA ARQUITETURAL CRÍTICA:
// - IBHome usa brand color #2bc196 (PagSmile emerald)
// - IBExtract usa emerald/red genérico Tailwind (sem brand)
// - IBPixSend introduz uma TERCEIRA cor: #00D26A (verde "PIX oficial" do BACEN)
//   — usado em 30+ classes ao longo da página
// - GAP cromático: 3 verdes diferentes em 3 páginas adjacentes do mesmo módulo
//   (#2bc196 / emerald-600 / #00D26A) — inconsistência de design system
//
// ESTRUTURA DO WIZARD:
// - Step 0: Choose method (Por Chave / QR Code / Copia e Cola) + Favoritos + Recents
// - Step 1: Enter key (5 tipos) ou QR Code scanner ou Paste
// - Step 2: Enter amount + description + schedule + favorite checkbox
// - Step 3: Confirmation summary + password input
// - Step 4: Success screen + Comprovante (recibo) + actions
// ============================================================================

export const IBPixSendDoc = {
  pageId: 'IBPixSend',
  pagePaths: ['/IBPixSend'],
  module: 'Internet Banking',
  section: 'PIX — Enviar Pix (3ª tela do módulo, 1ª do bloco PIX)',

  explainer: {
    oneLiner:
      'Wizard multi-step de envio de Pix — 689 linhas 100% MOCK — A página MAIS COMPLEXA do módulo IB até agora, controlada por um ÚNICO useState `step` (0..4) que determina qual de 5 telas distintas é renderizada via early returns sequenciais (`if (step === 0) return ...; if (step === 1) return ...; etc`) — padrão "render-by-step" que diverge totalmente do padrão react-router-stepper visto em outros wizards da plataforma (Onboarding/AccountCreation que usam progress bar + Form context); todos os estados do fluxo coexistem em UM componente: 9 useState hooks (step / sendMethod / keyType / pixKey / recipientFound / amount / description / scheduleType / saveAsFavorite / password) — quando step volta para trás (ArrowLeft), os states ANTERIORES preservam-se permitindo edição não-destrutiva, MAS quando o user fecha a página (navigate away) PERDE TUDO — sem persistência intermediária; **STEP 0 (Choose method)** é hub de entrada visualmente rico em 4 sub-blocos verticais: (1) Header simples título "Enviar Pix" 2xl-bold + sublabel "Escolha como deseja enviar" / (2) **Card Saldo Disponível** gradient slate-900 to slate-800 (DARK PROTAGONISTA — diferente do gradient navy do IBHome): wallet icon #00D26A + label uppercase "Saldo Disponível" + valor lg-bold formatCurrency(125430.50) HARDCODED — DESIGN ARQUITETURALMENTE DIFERENTE de IBHome onde saldo era hero 4xl com 2 blurs decorativos (aqui é compact horizontal 4-row strip) / (3) **Send Methods grid 3 cols** com 3 Cards cursor-pointer sincronizados ao state sendMethod via cn() conditional class `sendMethod === X && "ring-2 ring-[#00D26A] border-[#00D26A]"` + onClick faz dupla mutação `{ setSendMethod("X"); setStep(1); }` (auto-avança ao clicar — não há botão "continuar" neste step) — 3 opções: Key (CPF/email/phone — descrição "CPF, e-mail, telefone..."), QrCode ("Ler ou colar QR Code"), Copy ("Colar código Pix") cada uma com circle 14w14 rounded-2xl com bg condicional (#00D26A/20 quando ativo / slate-100 quando inativo) e icon 6w6 colorido condicionalmente / (4) **Favoritos horizontal scroll** com label uppercase "Favoritos" + Button ghost "Ver todos" (#00D26A — sem onClick funcional, dead action) + flex gap-3 overflow-x-auto pb-2 com cards 120px min-width: 3 mocks (Fornec. ABC / Aluguel Imobiliária / Contador João) — cada card tem onClick que dispara cascata 4-set-states `{ setPixKey(fav.key); setRecipientFound(true); setSendMethod("key"); setStep(2); }` PULANDO o Step 1 inteiro (atalho UX inteligente — favorito já tem chave validada, vai direto para valor) + Card adicional "Adicionar" com border-dashed e Star icon — sem onClick (gap funcional — o usuário não consegue adicionar favorito desta tela; supõe-se que aconteça em outro lugar mas sem indicação) / (5) **Últimos Pix Enviados** label uppercase + Card divide-y com 3 mocks (Fornecedor ABC R$ 2.500 Hoje 11:15 / Aluguel-Imobiliária R$ 3.500 Ontem 10:00 / Contador João R$ 800 20/01) — cada row tem onClick que faz `{ setSendMethod("key"); setStep(2); }` MAS NÃO popula recipientFound nem pixKey (gap funcional — clicar em "Repetir" leva ao Step 2 com state vazio, sem trazer o destinatário do PIX original — quebra a expectativa do nome "repetir") + Button ghost com Repeat icon #00D26A inline (que é o mesmo onClick do row, redundância com o div container clicável); **STEP 1 (Enter key)** é renderizado em 2 variantes condicionais baseadas em sendMethod: variante (a) sendMethod==="qr" mostra QR Code scanner mockup — header com ArrowLeft button → setStep(0) + título "QR Code" + sublabel "Ler ou colar código Pix" + Card com area 64w64 bg-slate-100 rounded-2xl simulando viewfinder de câmera (Camera icon 12w12 + label "Aponte para o QR Code") — divisor "ou" + Textarea 100px-min-h font-mono "Cole o código Pix Copia e Cola aqui..." + 2 Buttons outline "Colar da área de transferência" Copy icon e "Enviar imagem do QR Code" Upload icon — TODOS sem onClick funcional (mockup completo) — gap arquitetural: este step QR não tem caminho de avanço para Step 2 (não há botão "Continuar"), é uma DEAD END visual / variante (b) default Send by key (sendMethod==="key" ou "copy" — copy é tratado como key implicitamente!) mostra Header com ArrowLeft → setStep(0) + título "Enviar por Chave" + sublabel "Etapa 1 de 3: Destinatário" — note que o LABEL diz "1 de 3" MAS o wizard real tem 5 steps (0..4) — labelling apenas para os steps perceptíveis user-facing (Step 0 e Step 4 não contam como "etapa do wizard") + Key Type Selection grid 5 cols MAS apenas 4 Cards renderizados via array literal de 4 itens (cnpj / email / phone / random — array começa com cnpj label "CPF/CNPJ" mas falta o tipo `cpf` separado, foi mergeado em "CPF/CNPJ" sob keyType="cnpj" — gap arquitetural: se BACEN diferencia CPF de CNPJ, o backend precisaria desse split) — cada Card tem ring-2 ring-[#00D26A] quando keyType matches + icon 5w5 colorido condicionalmente + label xs centered / Input Pix Key com placeholder DINÂMICO baseado em keyType (máscara CNPJ XX.XXX.XXX-barra-XXXX-XX / email@exemplo.com / parênteses DDD espaço XXXXX-XXXX / Chave aleatória) + onChange duplo `setPixKey(value); setRecipientFound(false)` (reseta found ao editar) + onBlur dispara `handleKeySearch()` que apenas verifica `pixKey.length > 5` setRecipientFound(true) (validação ESTÚPIDA — só checa comprimento, qualquer string >5 chars valida — mock óbvio) / Recipient Found Card emerald conditional render quando recipientFound=true: bg-emerald-50 + CheckCircle2 + label "Chave encontrada" + 3 rows nome/CNPJ/banco DA VARIÁVEL `recipient` HARDCODED ("Fornecedor ABC Ltda / 12.345.678/0001-90 / Banco do Brasil 001") — INDEPENDENTE da pixKey digitada (gap óbvio mock — qualquer chave digitada retorna o MESMO destinatário Fornecedor ABC) / 2 Buttons rodapé "Voltar" outline → setStep(0) + "Continuar" #00D26A com `disabled={!recipientFound}` → setStep(2); **STEP 2 (Amount)** — Header com ArrowLeft → setStep(1) + título "Informar Valor" + sublabel "Etapa 2 de 3: Valor" / Recipient Summary Card cinza compacto com Building2 icon + nome+CNPJ (sempre `recipient` hardcoded) — feedback visual de quem é o destinatário consolidado / **Amount Input MAGNUM** com Label "Valor" + relative wrapper com span "R$" absolute left-4 top-1/2 -translate-y-1/2 text-2xl-bold slate-400 decorativo + Input type="number" placeholder="0,00" + className "pl-14 text-2xl font-bold h-16" — CAMPO XL para destacar valor sendo digitado (mesmo padrão do app bancário tradicional Brasil) + sublabel "Saldo disponível: R$ X" / Description Textarea com Label "Descrição (opcional)" placeholder "Ex: Pagamento NF 4567 - Material de escritório" + maxLength=140 (limite EXATO do BACEN para PIX memo!) + counter visual right-aligned "X/140 caracteres" — implementação correta do limite BACEN / Schedule RadioGroup "Quando enviar?" com 2 opts: "Agora" (now) / "Agendar para outra data" (schedule) — RADIO funcional MAS escolher "schedule" NÃO ABRE date picker (gap UX — opção promete agendar mas não tem UI de data) / Save as favorite Checkbox "Salvar como favorito" — funciona o toggle MAS o booleano não tem efeito real downstream (Step 3/4 não persiste favorito) / 2 Buttons rodapé "Voltar" → setStep(1) + "Continuar" #00D26A com `disabled={!amount || parseFloat(amount) <= 0}` (validação numérica básica — aceita strings inválidas no Input type=number do browser nativo) → setStep(3); **STEP 3 (Confirmation)** — Header com ArrowLeft → setStep(2) + título "Confirmar Pix" + sublabel "Etapa 3 de 3: Confirmar" / **Summary Card** bg-slate-50 com 3 sub-blocos: (a) Center hero text-center pb-4 border-b com label uppercase "Valor" + valor 4xl-bold #00D26A formatCurrency(amountValue) — DESTAQUE do montante / (b) 5-6 rows flex justify-between (Destinatário / CNPJ / Instituição / Chave (pixKey OR recipient.document fallback) / Descrição condicional / Data-Hora "Agora" HARDCODED — não muda se scheduleType=schedule!) / (c) pt-4 border-t com row "Saldo após transação" calculado real `balance - amountValue` — feedback financeiro responsável / **Password Input** Label "Digite sua senha para confirmar" + Input type="password" placeholder "••••••" 6 bullets + className "text-center text-2xl tracking-widest" (visual de PIN bancário — não faz validação real, apenas length>=4) / 2 Buttons rodapé "Voltar" → setStep(2) + "Confirmar e Enviar" #00D26A com Lock icon + `disabled={password.length < 4}` → setStep(4); **STEP 4 (Success)** — SEM Header de Wizard (não tem etapa, é resultado) / **Success Card** gradient emerald-500 to emerald-600 (#10b981) — DIFERENTE do #00D26A usado no resto do wizard! gap cromático: o success state usa o GREEN GENÉRICO Tailwind enquanto wizard usa o GREEN OFICIAL PIX — design system inconsistente / Card content text-center: circle 20w20 bg-white/20 com CheckCircle2 10w10 white + título 2xl-bold "Pix Enviado com Sucesso!" + valor 4xl-bold (mesmo formatCurrency) + timestamp HARDCODED "27/01/2026 às 15:32:45" (não usa Date.now() — fica datado igual o "Janeiro 2026" do IBHome) / **Comprovante Card** com CardTitle "Comprovante" base size + 9 rows + 3 borders (separadores entre seções da transação): seção 1 ID (PIX-2026012715324598765 HARDCODED) + End-to-End ID (E987654322026... truncated HARDCODED) — TODOS HARDCODED, mesma string para qualquer Pix enviado / seção 2 Valor + Destinatário (recipient.name) + CNPJ (recipient.document) + Instituição (recipient.bank) — usa as variáveis mas todas hardcoded para "Fornecedor ABC" / seção 3 Pagador HARDCODED "Loja ABC Comércio Ltda" + CNPJ "98.765.432/0001-10" + Instituição "PagSmile (XXX)" — HARDCODED não vem de auth do user logado / seção 4 Descrição condicional (se description preenchida) / 2 Buttons "Baixar PDF" e "Compartilhar" SEM onClick (dead actions — mesmo gap do IBExtract) + Button ghost full-width "Voltar ao Início" Home icon — Link → IBHome (única navegação cross-page real do wizard); 9 useState hooks coexistindo + função handleKeySearch trivial + função formatCurrency local + objeto keyTypeIcons mapping (5 keys mas Step 1 só renderiza 4 — `cpf` no map nunca é usado pois array Step 1 unifica em "cnpj") + 3 mocks (recipient / favorites / recentSent) + 1 numero balance (125430.50) HARDCODED idêntico ao IBHome (consistência cross-page mas sem fonte única) — total 9 estados + 4 estruturas mock + 2 funções + 1 dictionary; gaps arquiteturais: (i) **Wizard step controlado por integer** ao invés de string enum — `step === 1` em vez de `step === "key"` — menos legível mas funcional; (ii) **`step` integer NÃO mapeia 1:1 com label "Etapa X de 3"** — Step 0 e 4 não contam, Step 1/2/3 viram "1 de 3 / 2 de 3 / 3 de 3" — confuso para code review; (iii) **State PERDIDO ao sair da página** — sem useEffect que persista em localStorage / sem context / sem URL params — usuário que fecha aba perde tudo; (iv) **handleKeySearch é trivialmente fake** — apenas length>5 — qualquer string longa "encontra" um destinatário que é SEMPRE Fornecedor ABC; (v) **Variante QR no Step 1 é DEAD END** — não tem botão Continuar, então o user que escolhe QR no Step 0 fica preso (cliente fechado); (vi) **`copy` (Copia e Cola) NÃO TEM RENDERING próprio** — é tratado como variante key default, but não tem Textarea de paste de código copia-e-cola (gap arquitetural — 3 métodos no Step 0 mas só 2 telas de input no Step 1); (vii) **Schedule "Agendar" sem date picker** — radio promete agendamento que não funciona; (viii) **Save as favorite toggle morto** — booleano capturado mas nunca usado downstream; (ix) **scheduleType="schedule" não muda o Data/Hora "Agora"** no Step 3 — review summary mente; (x) **Comprovante Step 4 100% HARDCODED** — IDs / Pagador / CNPJ / timestamp não vêm da operação real, sempre os mesmos valores; (xi) **3 verdes diferentes na mesma página** — #00D26A (PIX oficial wizard), #10b981 (success card), brand #2bc196 (não usado aqui mas usado em outras IB); (xii) **Sem indicador de progresso visual** — labels "Etapa X de 3" são textuais, sem progress bar ou stepper visual (gap UX em wizard de 5 steps); (xiii) **Sem confirmação destrutiva ao usar ArrowLeft** — back não pergunta "deseja descartar dados?" mesmo com formulário preenchido; (xiv) **password length>=4 valida** — qualquer "1234" passa, sem regra real de senha forte; (xv) **0 useEffect** apesar de wizard complexo (sem analytics tracking de step changes, sem auto-save).',

    sectionsBreakdown: {
      stepZeroChooseMethod: {
        role: 'Hub de entrada — primeiro contato com fluxo de envio',
        subBlocks: [
          'Header minimal (sem ícone — diferente do IBHome)',
          'Card Saldo gradient slate-900 to slate-800 (compact horizontal — DIFERENTE do hero IBHome)',
          'Send Methods grid 3 cols (Key/QR/Copy)',
          'Favoritos horizontal scroll com 3 mocks + Card "Adicionar"',
          'Últimos Pix Enviados list com 3 mocks + Repeat button',
        ],
        autoAdvancePattern: 'Cards de Send Method têm onClick `{ setSendMethod(X); setStep(1); }` — auto-avança ao clicar (UX moderna, sem botão "continuar")',
        favoriteShortcut: 'Cards de favorito fazem 4-set-states cascata pulando Step 1 inteiro `{ setPixKey; setRecipientFound(true); setSendMethod("key"); setStep(2) }` — atalho inteligente',
        recentBugUX: 'Recents NÃO populam recipientFound nem pixKey — clicar em "Repetir" leva a Step 2 vazio, quebra expectativa semântica de "repetir"',
        deadActions: [
          'Botão "Ver todos" Favoritos sem onClick',
          'Card "Adicionar" favorito sem onClick',
        ],
      },

      stepOneEnterKey: {
        role: 'Identificação do destinatário — duas variantes',
        labelGap: 'Label diz "Etapa 1 de 3" MAS wizard tem 5 steps (0..4) — labelling não bate com state',

        variantQR: {
          condition: 'sendMethod==="qr"',
          structure: '[area 64w64 bg-slate slate viewfinder mockup com Camera icon / divisor "ou" / Textarea paste / 2 Buttons outline]',
          deadEnd: 'NÃO TEM botão "Continuar" — usuário que escolhe QR fica preso',
          gap: 'Mockup completo mas dead-end — gap arquitetural crítico',
        },

        variantKey: {
          condition: 'sendMethod==="key" OR sendMethod==="copy" (copy mergeado em key implicitamente!)',
          missingCopyVariant: 'sendMethod==="copy" deveria ter Textarea paste mas não tem — copy fica indistinguível de key',
          keyTypeSelection: {
            structure: 'grid grid-cols-5 gap-2 MAS array tem apenas 4 itens (gap cosmético — última coluna fica vazia)',
            options: '[cnpj label "CPF/CNPJ" Building2 / email Mail / phone Phone / random Hash]',
            cpfMissing: 'Array unifica CPF e CNPJ em label "CPF/CNPJ" sob keyType="cnpj" — backend precisaria diferenciar',
            keyTypeIconsDict: 'Objeto keyTypeIcons declara 5 keys (cnpj/cpf/email/phone/random) MAS Step 1 só usa 4 — `cpf` é dead key',
          },
          dynamicPlaceholder: 'Input placeholder muda conforme keyType selecionado (CNPJ mascarado, email@exemplo.com, telefone formatado, ou Chave aleatória)',
          handleKeySearch: 'onBlur valida APENAS pixKey.length > 5 — qualquer string longa "encontra" recipient',
          recipientFoundCard: 'Card emerald conditional render com 3 rows hardcoded (Fornecedor ABC) — INDEPENDENTE da chave digitada',
          continueDisabled: 'Button "Continuar" disabled quando !recipientFound — bloqueia avanço sem chave validada',
        },
      },

      stepTwoAmount: {
        role: 'Definição de valor + descrição + agendamento + favorito',
        recipientSummary: 'Card cinza compacto Building2 icon + nome+CNPJ — feedback consolidado',
        amountInput: {
          design: 'Input XL h-16 text-2xl com R$ absolute prefix — padrão app bancário Brasil',
          validation: 'parseFloat(amount) > 0 — básica',
          balanceFeedback: 'Sublabel "Saldo disponível: R$ X" — consciência financeira',
        },
        descriptionTextarea: {
          maxLength: '140 chars — LIMITE EXATO do BACEN para PIX memo (correto)',
          counter: '{description.length}/140 caracteres — feedback right-aligned',
          gap: 'Sem indicador visual de "quase no limite" (90+/140 ficaria amber)',
        },
        scheduleRadio: {
          options: '[Agora (default) / Agendar para outra data]',
          gap: 'Selecionar "schedule" NÃO ABRE date picker — opção promete agendamento sem UI',
        },
        favoriteCheckbox: {
          purpose: 'Salvar destinatário como favorito',
          gap: 'Boolean capturado MAS não usado downstream (Step 3/4 ignora)',
        },
      },

      stepThreeConfirmation: {
        role: 'Revisão final + autenticação',
        summaryCard: {
          centerHero: 'Valor 4xl-bold #00D26A — destaque visual',
          rows: [
            'Destinatário (recipient.name)',
            'CNPJ (recipient.document)',
            'Instituição (recipient.bank)',
            'Chave (pixKey OR recipient.document fallback)',
            'Descrição (conditional)',
            'Data/Hora "Agora" HARDCODED — não muda com scheduleType',
            'Saldo após transação calculado real (balance - amount)',
          ],
          gap: '"Data/Hora: Agora" é hardcoded mesmo se scheduleType=schedule — review summary MENTE quando agendado',
        },
        passwordInput: {
          design: 'type="password" + text-center + text-2xl + tracking-widest — visual de PIN bancário',
          placeholder: '"••••••" 6 bullets',
          validation: 'password.length >= 4 — validação trivial',
          gap: 'Sem regra de senha forte / sem rate limit / sem MFA',
        },
        continueButton: 'Lock icon + "Confirmar e Enviar" #00D26A',
      },

      stepFourSuccess: {
        role: 'Confirmação visual + comprovante + ações',
        successCard: {
          gradient: 'emerald-500 to emerald-600 — DIFERENTE do #00D26A usado em todo wizard!',
          gap: 'Inconsistência cromática — wizard usa green-PIX-oficial, success usa green-Tailwind-genérico',
          structure: '[circle 20w20 bg-white/20 com CheckCircle2 / título 2xl / valor 4xl-bold / timestamp]',
          timestampHardcoded: '"27/01/2026 às 15:32:45" — não usa Date.now()',
        },
        receiptCard: {
          purpose: 'Comprovante PIX detalhado',
          rows: [
            'ID Transação HARDCODED "PIX-2026012715324598765"',
            'End-to-End ID HARDCODED truncado',
            'Valor (formatCurrency real)',
            'Destinatário/CNPJ/Instituição (recipient hardcoded)',
            'Pagador HARDCODED "Loja ABC Comércio Ltda" / CNPJ / PagSmile',
            'Descrição (condicional)',
          ],
          gap: 'IDs e Pagador HARDCODED — mesmo PIX simulado várias vezes mostra IDs idênticos',
        },
        actions: [
          'Baixar PDF FileText icon — sem onClick',
          'Compartilhar Share2 icon — sem onClick',
          'Voltar ao Início Home icon → Link → IBHome (FUNCIONAL)',
        ],
      },
    },

    knownGapsAcrossPage: [
      'Wizard 5 steps controlado por integer — menos legível que enum string',
      'Label "Etapa X de 3" não bate com 5 steps reais (Step 0 e 4 são out-of-wizard)',
      'State PERDIDO ao sair (sem persistência intermediária)',
      'handleKeySearch fake — apenas length>5 — qualquer string longa "encontra"',
      'Recipient SEMPRE "Fornecedor ABC" hardcoded independente da chave digitada',
      'Step 1 variante QR é DEAD END — sem botão Continuar',
      'sendMethod="copy" tratado como key — sem Textarea de paste copia-e-cola',
      'Step 1 grid 5-cols com 4 itens — última coluna vazia',
      'CPF e CNPJ unificados em "CPF/CNPJ" sob keyType="cnpj" — backend precisaria split',
      'keyTypeIcons.cpf é dead key (declarado mas nunca usado)',
      'Schedule "Agendar" sem date picker associado',
      'Save as favorite checkbox morto — boolean capturado e ignorado',
      'Recents onClick não popula pixKey/recipientFound — quebra "Repetir"',
      '"Data/Hora: Agora" HARDCODED no Step 3 mesmo com scheduleType=schedule',
      'Comprovante 100% HARDCODED — IDs e Pagador iguais para qualquer Pix',
      'Timestamp Step 4 hardcoded "27/01/2026" (não usa Date.now)',
      '3 verdes diferentes na página (#00D26A wizard / #10b981 success / brand #2bc196 não usado mas ecosystem)',
      'Sem progress bar/stepper visual — só labels textuais',
      'Sem confirmação destrutiva ao voltar com dados preenchidos',
      'Password validação trivial length>=4 — sem regra forte',
      '0 useEffect apesar de wizard complexo',
      'Sem analytics tracking de step changes',
      'Sem auto-save / sem URL params para deep-link a step específico',
      'Botão "Ver todos" Favoritos dead action',
      'Card "Adicionar" favorito sem onClick',
      'Buttons "Baixar PDF" e "Compartilhar" Step 4 sem onClick',
      'Sem dual-control para valores altos (gap risk)',
      'Sem mostrar limite diário/mensal restante',
      'Sem warning para destinatário recém-cadastrado (anti-fraud)',
      'description maxLength sem visual "quase no limite"',
      'Cancellation/Reversion path inexistente após Step 4',
    ],
  },

  technical: {
    fileLocation: 'pages/IBPixSend.jsx (689 linhas — 35% maior que IBExtract 511L, 132% maior que IBHome 297L)',
    routePath: '/IBPixSend',
    moduleAffinity: 'Internet Banking — primeira página do bloco PIX (4 sub-páginas no menu IB)',
    accessedFrom: [
      'Quick Action 1 do IBHome (Link → IBPixSend brand emerald)',
      'Eventualmente menu lateral IB (sub-item de PIX)',
    ],

    imports: {
      react: 'useState (9× hooks)',
      reactRouter: 'Link de react-router-dom + createPageUrl de @/components/utils — usado APENAS no Step 4 success "Voltar ao Início"',
      i18n: 'NÃO IMPORTADO — todas strings em PT hardcoded (gap arquitetural com IBHome 22 keys)',
      lucide: '[Key, QrCode, Copy, ArrowLeft, ArrowRight, User, Building2, Mail, Phone, Hash, CheckCircle2, Repeat, Star, Lock, FileText, Share2, Home, Wallet, Camera, Upload] — 20 icons todos usados (zero dead imports — diferente de IBExtract)',
      uiComponents: '[Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Label, Textarea, Checkbox, RadioGroup, RadioGroupItem]',
      utils: 'cn de @/lib/utils',
    },

    deadImports: {
      list: ['Badge — importado mas NÃO USADO em nenhum step'],
      observation: 'Badge é único dead import — IBPixSend é mais "limpo" em imports que IBExtract (3 dead) e IBHome (2 dead)',
    },

    stateManagement: {
      hooksCount: '9 useState — 50% mais que IBExtract (6) e 9× mais que IBHome (1)',
      hooks: [
        'step default 0 — controlador do wizard',
        'sendMethod default "key" — método de envio (key/qr/copy)',
        'keyType default "cnpj" — tipo da chave (cnpj/cpf/email/phone/random)',
        'pixKey default "" — input da chave',
        'recipientFound default false — flag de chave validada',
        'amount default "" — valor a enviar',
        'description default "" — memo PIX',
        'scheduleType default "now" — agora ou agendar',
        'saveAsFavorite default false — checkbox de favorito',
        'password default "" — senha de confirmação',
      ],
      complexity: 'Mais complexa página de state do IB — 9 estados acoplados em wizard linear',
      observation: 'Dead state — saveAsFavorite é capturado mas nunca usado downstream',
    },

    helperFunctions: {
      formatCurrency: 'Inline — Intl.NumberFormat pt-BR BRL — sem máscara de privacidade (diferente do IBHome)',
      handleKeySearch: 'Inline — apenas `if (pixKey.length > 5) setRecipientFound(true)` — fake total',
      keyTypeIcons: 'Object dictionary mapping keyType → JSX icon (5 keys, 4 usadas)',
    },

    renderingPattern: {
      pattern: 'render-by-step com early returns sequenciais',
      structure: '`if (step === 0) return ...; if (step === 1) return ...; if (step === 2) return ...; if (step === 3) return ...; if (step === 4) return ...; return null;`',
      pros: [
        'Cada step isolado em bloco JSX próprio',
        'Fácil de ler step a step',
        'Sem state lifting necessário (tudo em um componente)',
      ],
      cons: [
        'Componente fica gigante (689 linhas)',
        'Dificulta testes unitários por step',
        'Sem ability de deep-link (URL não muda)',
        'Re-render do componente inteiro a cada step change',
      ],
      alternativaIdeal: 'Cada step poderia ser componente separado em components/internet-banking/pix-send/Step0.jsx etc, com estado lifted para parent',
    },

    designSystem: {
      pixOfficialColor: '#00D26A — verde "PIX oficial" BACEN — 30+ classes',
      darkBalanceCard: 'gradient slate-900 to slate-800 — dark protagonista (diferente IBHome navy)',
      successGreenInconsistency: 'Step 4 usa emerald-500/600 Tailwind genérico ao invés de #00D26A — gap',
      ringActiveSelection: 'ring-2 ring-[#00D26A] border-[#00D26A] — pattern para Cards selecionados',
      iconSizing: '14w14 (Send Methods) / 10w10 (Favoritos avatares) / 5w5 (Key Type) / 20w20 (Success circle)',
    },

    rechartsUsage: 'NENHUMA',

    crossPageNavigation: {
      linksRenderizados: [
        'Step 4 success → Link → IBHome (Home icon "Voltar ao Início") — único Link cross-page',
      ],
      missingLinks: [
        'Sem Link para IBPixKeys (gerenciar chaves)',
        'Sem Link para IBPixLimits (consultar limites)',
        'Sem Link para IBExtract (ver extrato após envio)',
        'Sem Link para IBProofs (ver comprovantes)',
      ],
      observation: 'Wizard começa pelo IBHome e termina voltando ao IBHome — fluxo circular fechado',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'CENTENAS de strings em PT — header de cada step, labels de inputs, placeholders, helper texts, button labels, validations messages, success messages, comprovante labels',
      impact: 'Igual IBExtract — quebra coverage multilíngue do app',
    },

    validationLogic: {
      handleKeySearch: 'pixKey.length > 5 (trivial)',
      amountValidation: 'parseFloat(amount) > 0',
      passwordValidation: 'password.length >= 4',
      observation: 'Todas validações são trivial / mock — sem feedback de erro detalhado, sem mensagens contextuais',
    },

    knownGapsTechnical: [
      '689 linhas 100% MOCK — zero SDK base44 (Withdrawal/Transaction entities ignoradas)',
      'ZERO i18n vs IBHome 22 keys — gap arquitetural inter-página persiste',
      '9 useState (1 dead — saveAsFavorite)',
      'render-by-step pattern com early returns — gigante sem split em sub-componentes',
      'Step integer ao invés de enum string — menos legível',
      'Label "Etapa X de 3" não bate com 5 steps reais',
      'handleKeySearch fake (length>5)',
      'Recipient sempre "Fornecedor ABC" hardcoded',
      'Step 1 QR é dead-end (sem Continuar)',
      'sendMethod="copy" não tem variante UI própria',
      'CPF/CNPJ unificados sob keyType="cnpj"',
      'keyTypeIcons.cpf dead key',
      'Schedule "Agendar" sem date picker',
      'saveAsFavorite ignorado downstream',
      'Recents onClick não popula state — "Repetir" quebrado',
      'Step 3 "Data/Hora: Agora" hardcoded mesmo se scheduleType=schedule',
      'Comprovante Step 4 100% hardcoded (IDs/Pagador/Timestamp)',
      '3 cores verdes na página (#00D26A wizard / emerald-500-600 success / brand #2bc196 não usado)',
      'Sem progress bar/stepper visual',
      'Sem confirmação destrutiva ao back',
      'Password validação length>=4 trivial',
      '0 useEffect',
      'Badge dead import',
      'Sem analytics tracking',
      'Sem auto-save em localStorage',
      'Sem URL params para deep-link',
      'Sem mostrar limite diário/mensal restante',
      'Sem warning anti-fraud para destinatário novo',
      'Sem dual-control para valores altos',
      'Sem cancellation/reversion path',
      'Sem MFA (apenas password length>=4)',
      'description maxLength sem feedback "quase no limite"',
      'render do componente inteiro a cada step change (sem React.memo)',
      'recipient mock independente de pixKey digitada',
    ],
  },
};

export default IBPixSendDoc;