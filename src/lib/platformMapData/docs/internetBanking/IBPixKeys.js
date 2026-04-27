// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — IBPixKeys (Internet Banking) — Entrega 18
// ----------------------------------------------------------------------------
// QUINTA página do módulo INTERNET BANKING — terceira do bloco PIX (4 páginas).
//
//   1. IBPixKeys.jsx (372 linhas) — Gerenciamento completo de chaves PIX
//
// CONTEXTO DENTRO DO MÓDULO:
// - Acessada via menu lateral IB sub-item de PIX, NÃO está nos Quick Actions
//   do IBHome (gap consistente — IBHome só linka 4 das 7+ páginas IB)
// - É a EVOLUÇÃO direta de IBPixReceive — onde Receive apenas EXPÕE chaves
//   existentes para compartilhamento, Keys oferece OPERAÇÕES CRUD COMPLETAS:
//   listagem com badge "Principal", cadastrar nova, definir como principal,
//   excluir com confirmação, portabilidade, reivindicação
// - Compartilha o mesmo array de pixKeys (3 mocks idênticos) com IBPixReceive
//   exceto que aqui há campos adicionais: id (1/2/3), isPrimary (cnpj=true),
//   registeredAt (15/01/2025, 20/01/2025, 25/01/2025) — gap arquitetural:
//   3 fontes hardcoded paralelas para mesma entidade (IBPixReceive, IBPixKeys
//   e potencialmente IBPixSend favorites) sem store compartilhada
//
// PADRÕES NOVOS NA PÁGINA (não vistos nas 4 anteriores do módulo IB):
// - PRIMEIRO uso de SideDrawer no módulo IB (vs Modal Dialog do IBPixReceive)
//   — escolha arquitetural deliberada: drawer lateral é mais espaçoso para
//   forms longos do que dialog central, melhor para listas radio + inputs
// - PRIMEIRO uso de RadioGroup/RadioGroupItem no módulo IB (4 opções de tipo
//   de chave: cnpj/email/phone/random)
// - PRIMEIRO uso de AlertDialog (não Dialog comum) no módulo IB para confirmação
//   destrutiva — semanticamente diferente de Dialog: AlertDialog REQUER
//   interação com Cancel/Action (não fecha clicando fora) seguindo padrão WAI-ARIA
// - PRIMEIRO uso de Progress bar customizada inline (não componente Progress
//   shadcn) no módulo IB — barra 32w-2 com div interna styled width % calculada
// - PRIMEIRO Cards com cursor-pointer + hover:shadow-lg que NÃO levam a lugar
//   nenhum (Portabilidade e Reivindicar) — dead actions decorativos
// ============================================================================

export const IBPixKeysDoc = {
  pageId: 'IBPixKeys',
  pagePaths: ['/IBPixKeys'],
  module: 'Internet Banking',
  section: 'PIX — Minhas Chaves Pix (5ª tela do módulo, 3ª do bloco PIX)',

  explainer: {
    oneLiner:
      'Tela de gerenciamento completo de chaves PIX — 372 linhas 100% MOCK — 37% maior que IBPixReceive (271L) refletindo a complexidade adicional de operações CRUD: listar com metadata estendida, cadastrar com flow assistido, definir principal, excluir com confirmação destrutiva, portabilidade e reivindicação. Página single-page com 4 grandes blocos verticais + 1 SideDrawer (cadastrar) + 1 AlertDialog (excluir): (1) **Header com CTA primário** (diferente de IBPixReceive que só tem título) traz à esquerda h1 "Minhas Chaves Pix" 2xl-bold + sublabel "Você pode cadastrar até 20 chaves por conta" — número 20 BACEN-correto para CNPJ (PF tem 5, PJ tem 20) — e à direita Button bg-#00D26A "Cadastrar Chave" com Plus icon que abre o SideDrawer; (2) **Counter Card destaque** com bg-slate-50 (variação stand-out do bg padrão Card) p-4 flex justify-between contendo à esquerda Key icon #00D26A + texto "Chaves cadastradas: 3 de 20" (com `<strong>` para destaque do número) e à direita PROGRESS BAR INLINE customizada 32w-2 — div outer bg-slate-200 rounded-full overflow-hidden com div inner h-full bg-#00D26A rounded-full + style={{width: `${(pixKeys.length / 20) * 100}%`}} = 15% width preenchido (3/20=0.15) — implementação artesanal de progress sem componente shadcn Progress (gap arquitetural — projeto tem componente Progress importado em outras páginas mas IB ignora) / **gap funcional**: o counter está hardcoded em `pixKeys.length` que é 3, então sempre mostra 3/20 = 15% mesmo se um dia houver state real adicionando/removendo chaves; (3) **Active Keys list** com label uppercase "Chaves Ativas" + Card divide-y entre 3 rows (cnpj/email/random — mesmos mocks de IBPixReceive mas com id+isPrimary+registeredAt) — cada row p-4 com layout DIFERENTE de IBPixReceive: ao invés de flex-row direto com Button copy à direita, aqui é estrutura 2-row vertical: row1 superior tem `flex items-start justify-between` com SQUARE 10w10 rounded-lg bg-slate-100 contendo icon contextual da chave (Building2/Mail/Hash) + bloco de texto multi-linha [linha 1: nome do tipo "CNPJ"/"E-mail"/"Chave Aleatória" font-medium + Badge condicional "Principal" #00D26A/10 com Star fill-current 3w3 (renderizada APENAS para isPrimary=true ou seja apenas o CNPJ no mock)] [linha 2: valor da chave font-mono break-all (font-mono é DIFERENTE de IBPixReceive que usava font sans — gap inconsistência intra-bloco-PIX)] [linha 3: text-xs text-slate-400 "Cadastrada em: 15/01/2025"] e row2 INFERIOR com `flex gap-2 mt-4 ml-13` (margin-left 13 = 52px alinhando após o square + gap simulando indentação) contendo 3 Buttons outline sm: Button "Copiar"/"Copiado" idêntico ao IBPixReceive (clipboard real + setTimeout 2000ms feedback verde) + Button condicional "Definir como principal" Star icon outline (ou se isPrimary=true vira "Principal" disabled com Star fill-current text-amber-500 — note cor AMBER do badge ativo conflitante com cor #00D26A do badge na row1: o MESMO conceito "principal" usa duas cores diferentes na mesma row, gap visual de design system) + Button "Excluir" Trash2 com classes `text-red-600 hover:text-red-700 hover:bg-red-50` (estilização inline destructive sem usar variant=destructive do Button) que executa handleDelete abrindo AlertDialog; (4) **Outras Ações** label uppercase + grid 2-cols com 2 Cards `cursor-pointer hover:shadow-lg`: Card BLUE "Portabilidade de Chave" com circle 12w12 rounded-xl bg-blue-100 + ArrowRightLeft icon 6w6 blue-600 + título font-semibold + descrição "Trazer uma chave que está em outro banco para cá." / Card AMBER "Reivindicar Chave" com circle 12w12 rounded-xl bg-amber-100 + Shield icon 6w6 amber-600 + título + descrição "Recuperar uma chave cadastrada indevidamente." — **GAP CRÍTICO**: ambos Cards têm `cursor-pointer` SEM onClick — visualmente prometem ação mas são dead links / portabilidade BACEN é feature complexa (validação na DICT do Banco Central com confirmação 7 dias) e reivindicação envolve disputa entre instituições — gap funcional ENORME oculto sob estética de "feature pronta"; (5) **SideDrawer "Cadastrar Nova Chave Pix"** controlado por `showRegisterModal` boolean (PRIMEIRO uso do componente SideDrawer no módulo IB) com title icon Key + footer fixo com 2 Buttons (Cancelar outline + Cadastrar #00D26A) — body do drawer contém: (i) **RadioGroup com 4 opções** (cnpj/email/phone/random) — cada opção é uma row p-4 rounded-lg border com 4 ESTADOS VISUAIS condicionais: disabled (opacity-50 + bg-slate-50 + cursor-not-allowed quando option.disabled=true) / selected (border-#00D26A + bg-#00D26A/5 quando selectedKeyType === option.id) / hover (hover:border-slate-300 cursor-pointer caso default) — note que CNPJ vem `disabled: true` com disabledReason "Já cadastrado nesta conta" (regra BACEN-correta: cada chave pode pertencer a apenas 1 conta) e mostra texto extra `flex items-center gap-1` com AlertCircle icon 3w3 amber-600 + reason / cada row: RadioGroupItem mt-1 + flex-1 com [icon contextual 4w4 + Label cursor-pointer + descrição sm slate-500] / **mock options**: cnpj label "CPF/CNPJ" desc "Seu CNPJ: 98.765.432/0001-10" disabled / email label "E-mail" desc "Informe o e-mail que deseja cadastrar" / phone label "Telefone" desc "Informe o telefone com DDD" / random label "Chave Aleatória" desc "Geraremos uma chave única automaticamente"; (ii) **Input condicional** renderizado APENAS quando `selectedKeyType === "email" OR "phone"` (NÃO renderizado para random pois sistema gera, NÃO renderizado para cnpj pois disabled) — Label dinâmico "E-mail" ou "Telefone" + Input com placeholder dinâmico (email "vendas-arroba-lojaabc.com.br" ou phone parênteses-DDD-XXXXX-XXXX) + value linkado a newKeyValue useState — o newKeyValue é um STATE COMPARTILHADO entre os 2 tipos: trocar de email para phone NÃO limpa o input, gap UX (digitar email "abc-arroba-x.com" e trocar para phone mostra "abc-arroba-x.com" no campo telefone); (iii) **Alert info amber** flex bg-amber-50 dark:bg-amber-900/20 com AlertCircle icon + texto "Ao cadastrar, você precisará confirmar a posse do e-mail/telefone." — informativo BACEN-correto (envio de OTP/link confirmação) mas SEM implementação real de confirmação posterior; (6) **AlertDialog destrutivo** controlado por `showDeleteDialog` (PRIMEIRO AlertDialog do módulo IB) com title "Excluir Chave Pix?" interrogativo + Description multi-line "Tem certeza que deseja excluir a chave <strong>{keyToDelete?.value}</strong>? Esta ação não pode ser desfeita e você não poderá mais receber Pix nesta chave." — mostra dinamicamente o valor da key armazenada em keyToDelete state via handleDelete + Footer com AlertDialogCancel "Cancelar" + AlertDialogAction "Excluir" classes bg-red-600 (mas SEM onClick implementando exclusão real — alertdialog confirma e fecha sem mutar state); 6 useState hooks (copiedKey null + showRegisterModal false + showDeleteDialog false + selectedKeyType "email" + newKeyValue "" + keyToDelete null) com 100% utilização efetiva (continua o padrão zero-dead-state de IBPixReceive — outro caso raro na plataforma) + 2 arrays mockados (pixKeys 3 itens + keyTypeOptions 4 itens) + 2 funções (handleCopy + handleDelete); gaps arquiteturais: (i) **3 fontes paralelas hardcoded** para mesma entidade pixKeys (IBPixReceive, IBPixKeys, e arrays de favorites no IBPixSend) sem store compartilhada — CHANGES em uma não refletem em outras; (ii) **CNPJ disabled é hardcoded** baseado em mock — em produção precisaria checar quais tipos JÁ existem na conta e desabilitar dinamicamente; (iii) **Limite "3 de 20" é hardcoded** — pixKeys.length é fixo em 3, progress nunca muda; (iv) **Botões "Definir como principal" e "Excluir" sem onClick** — apenas o Excluir abre AlertDialog mas Definir como principal é dead action; (v) **AlertDialog Action "Excluir" sem onClick** — confirma destrutivamente sem afetar state; (vi) **SideDrawer footer Button "Cadastrar" sem onClick** — submit dead; (vii) **Cards Portabilidade e Reivindicar dead** com cursor-pointer enganador; (viii) **newKeyValue state compartilhado entre tipos** — trocar email/phone não reseta; (ix) **Sem validação de formato** email/phone antes de habilitar Button Cadastrar; (x) **Sem step de confirmação OTP** mencionado no info banner mas não implementado (faltaria fluxo: digitar → enviar código → validar → cadastrar); (xi) **Sem mostrar status BACEN da chave** — chave pode estar "em portabilidade" ou "em reivindicação" mas UI não diferencia; (xii) **Conflito de cor "principal"** — Badge row1 usa #00D26A verde mas Button row2 usa amber-500 (Star color); (xiii) **registeredAt é string PT-BR não Date** — não permite ordenação correta nem internacionalização; (xiv) **Sem ordenação/filtro** — 3 chaves sempre na mesma ordem hardcoded; (xv) **Sem busca** — desnecessário com 3 mas necessário se chegar perto de 20; (xvi) **Sem auditoria** — quem criou? quando? a partir de qual IP? log BACEN obrigatório ausente; (xvii) **Sem expor histórico de portabilidade** — se chave foi portada de outro banco deveria mostrar; (xviii) **Sem tooltip explicando "Principal"** — termo importante mas sem onboarding; (xix) **break-all aplicado em font-mono** — font monoespaçada com break-all em UUID 36-chars pode quebrar em qualquer hex char; (xx) **Sem dark mode no Badge "Principal"** — bg-#00D26A/10 fica washed em dark theme; (xxi) **Sem confirmação ao trocar Principal** — uma operação importante (afeta como apps de pagamento default selecionam chave) sem AlertDialog de confirmação; (xxii) **footer SideDrawer com Button "Cadastrar" sem disabled** — habilitado mesmo sem newKeyValue preenchido para email/phone.',

    sectionsBreakdown: {
      headerWithCTA: {
        role: 'Header com Title + CTA primário',
        contrastWithIBPixReceive: 'PRIMEIRA página do bloco PIX com Button no header (Receive não tem)',
        leftSide: '[h1 "Minhas Chaves Pix" / sublabel "Você pode cadastrar até 20 chaves por conta"]',
        rightSide: 'Button bg-#00D26A "Cadastrar Chave" com Plus icon → abre SideDrawer',
        bacenCorrect: 'Limite 20 é correto para CNPJ (PF=5, PJ=20)',
      },

      counterCard: {
        role: 'Card destaque com counter + progress bar inline',
        styling: 'bg-slate-50 stand-out vs bg-white padrão',
        leftBlock: '[Key icon #00D26A + texto "Chaves cadastradas: 3 de 20" com strong no número]',
        rightBlock: 'Progress bar artesanal 32w-2 customizada inline',

        progressImplementation: {
          outer: 'div bg-slate-200 rounded-full overflow-hidden h-2 w-32',
          inner: 'div h-full bg-#00D26A rounded-full',
          calculation: 'style={{width: `${(pixKeys.length / 20) * 100}%`}}',
          currentValue: '15% (3/20)',
          gap: 'NÃO usa componente shadcn Progress que existe na plataforma',
          observation: 'PRIMEIRA progress bar do módulo IB',
        },

        hardcodedGap: 'pixKeys.length é fixo em 3 — counter nunca muda mesmo com state real',
      },

      activeKeysListSection: {
        role: 'Lista de chaves cadastradas com operações por row',
        cardStructure: 'Card divide-y entre 3 rows',
        rowLayout: '2-row vertical (NÃO flex-row como IBPixReceive)',

        row1Upper: {
          structure: 'flex items-start justify-between',
          leftBlock: '[icon square 10w10 + bloco multi-linha 3 linhas]',
          line1: '[label "CNPJ"/"E-mail"/"Chave Aleatória" font-medium + Badge condicional "Principal"]',
          line2: 'valor da chave font-mono break-all (DIFERENTE de IBPixReceive sans-serif)',
          line3: '"Cadastrada em: 15/01/2025" text-xs text-slate-400',
          inconsistency: 'font-mono em IBPixKeys vs font-medium IBPixReceive — gap intra-bloco PIX',
        },

        primaryBadgeRow1: {
          condition: 'isPrimary=true (apenas CNPJ no mock)',
          styling: 'bg-#00D26A/10 text-#00D26A border-0',
          icon: 'Star w-3 h-3 fill-current',
          label: '"Principal"',
        },

        row2Lower: {
          structure: 'flex gap-2 mt-4 ml-13 (margin-left 13 = 52px alinhamento)',
          buttons: '[Copy / Set Primary / Delete]',

          copyButton: {
            implementation: 'Button outline sm com toggle Copy/Check + cn condicional emerald-50/200/600',
            handler: 'handleCopy(key) → navigator.clipboard.writeText + setCopiedKey(id) + setTimeout 2000ms reset',
            consistency: 'IDÊNTICO comportamento de IBPixReceive (boa prática reuso pattern)',
          },

          setPrimaryButton: {
            condition: 'NÃO isPrimary',
            label: '"Definir como principal" Star icon outline',
            disabledVariant: '"Principal" disabled Star fill-current text-amber-500 (quando já é principal)',
            colorConflict: 'Badge row1 usa #00D26A verde / Button row2 disabled usa amber-500 — DOIS conceitos visuais para mesma feature',
            gap: 'SEM onClick — dead action',
          },

          deleteButton: {
            label: '"Excluir" Trash2',
            stylingInline: 'text-red-600 hover:text-red-700 hover:bg-red-50',
            antiPattern: 'NÃO usa variant="destructive" do Button shadcn',
            handler: 'handleDelete(key) → setKeyToDelete + setShowDeleteDialog(true)',
          },
        },
      },

      otherActionsSection: {
        role: 'Operações avançadas BACEN',
        gridLayout: 'grid grid-cols-2 gap-4',

        cardPortability: {
          color: 'BLUE — bg-blue-100 + ArrowRightLeft 6w6 blue-600',
          title: '"Portabilidade de Chave"',
          description: '"Trazer uma chave que está em outro banco para cá."',
          bacenComplexity: 'Feature complexa: validação DICT + confirmação 7 dias',
          gap: 'cursor-pointer SEM onClick — dead action enganoso',
        },

        cardClaim: {
          color: 'AMBER — bg-amber-100 + Shield 6w6 amber-600',
          title: '"Reivindicar Chave"',
          description: '"Recuperar uma chave cadastrada indevidamente."',
          bacenComplexity: 'Disputa entre instituições',
          gap: 'cursor-pointer SEM onClick — dead action enganoso',
        },
      },

      registerSideDrawer: {
        role: 'Drawer lateral para cadastro nova chave',
        firstInModule: 'PRIMEIRO uso de SideDrawer no módulo IB',
        controlState: 'showRegisterModal boolean',
        title: '"Cadastrar Nova Chave Pix"',
        icon: 'Key',
        contentBlocks: '[RadioGroup 4 options / Input condicional / Alert info amber]',

        radioGroupOptions: {
          structure: '4 rows p-4 rounded-lg border com 3 estados visuais',

          stateDisabled: 'opacity-50 + bg-slate-50 + cursor-not-allowed',
          stateSelected: 'border-#00D26A + bg-#00D26A/5',
          stateDefault: 'hover:border-slate-300 cursor-pointer',

          eachRow: '[RadioGroupItem mt-1 + flex-1 com icon contextual + Label + descrição]',

          options: [
            'cnpj label "CPF/CNPJ" desc "Seu CNPJ: 98.765.432/0001-10" disabled=true',
            'email label "E-mail" desc "Informe o e-mail que deseja cadastrar"',
            'phone label "Telefone" desc "Informe o telefone com DDD"',
            'random label "Chave Aleatória" desc "Geraremos uma chave única automaticamente"',
          ],

          disabledReasonMessage: 'AlertCircle icon 3w3 amber-600 + "Já cadastrado nesta conta"',
          bacenCompliance: 'Cada chave pertence a apenas 1 conta — disabled correto',
          hardcodedGap: 'CNPJ disabled fixo no mock, em produção checaria estado real',
        },

        conditionalInput: {
          condition: 'selectedKeyType === "email" OR "phone"',
          renderedLabel: 'dinâmico "E-mail" ou "Telefone"',
          placeholderEmail: '"vendas-arroba-lojaabc.com.br"',
          placeholderPhone: 'parênteses-DDD-XXXXX-XXXX',
          stateGap: 'newKeyValue COMPARTILHADO entre email e phone — trocar tipo não limpa value',
        },

        alertInfo: {
          styling: 'flex p-3 bg-amber-50 + AlertCircle icon',
          message: '"Ao cadastrar, você precisará confirmar a posse do e-mail/telefone."',
          bacenAlignment: 'Confirmação OTP mencionada — fluxo BACEN correto',
          gap: 'Fluxo de confirmação NÃO implementado — apenas info textual',
        },

        footer: {
          buttons: '[Cancelar outline / Cadastrar #00D26A]',
          gap: 'Button "Cadastrar" SEM onClick — submit dead',
          gap2: 'Button "Cadastrar" sem disabled mesmo com newKeyValue vazio',
        },
      },

      deleteAlertDialog: {
        role: 'Confirmação destrutiva de exclusão',
        firstInModule: 'PRIMEIRO uso de AlertDialog (não Dialog) no módulo IB',
        controlState: 'showDeleteDialog + keyToDelete',
        ariaSemantics: 'AlertDialog requer interação Cancel/Action — não fecha clicando fora',
        title: '"Excluir Chave Pix?" interrogativo',
        description: 'multi-line com strong destacando keyToDelete?.value',
        warningText: '"Esta ação não pode ser desfeita e você não poderá mais receber Pix nesta chave."',
        footer: '[AlertDialogCancel "Cancelar" / AlertDialogAction "Excluir" bg-red-600]',
        gap: 'AlertDialogAction SEM onClick — confirma sem afetar state',
      },
    },

    knownGapsAcrossPage: [
      '3 fontes paralelas hardcoded de pixKeys (IBPixReceive + IBPixKeys + IBPixSend favorites) sem store compartilhada',
      'CNPJ disabled hardcoded — em produção checaria dinamicamente',
      'Counter "3 de 20" hardcoded — pixKeys.length fixo, progress nunca muda',
      'Button "Definir como principal" sem onClick — dead action',
      'Button "Cadastrar" no SideDrawer footer sem onClick — submit dead',
      'AlertDialogAction "Excluir" sem onClick — confirma sem afetar state',
      'Cards Portabilidade e Reivindicar dead com cursor-pointer enganador',
      'newKeyValue state compartilhado entre email/phone — trocar tipo não limpa',
      'Sem validação de formato email/phone',
      'Sem fluxo de confirmação OTP mencionado mas não implementado',
      'Sem status BACEN da chave (em portabilidade / em reivindicação)',
      'Conflito de cor "Principal": Badge row1 #00D26A vs Button row2 amber-500',
      'registeredAt string PT-BR não Date — não ordena nem internacionaliza',
      'Sem ordenação/filtro/busca',
      'Sem auditoria (quem/quando/IP) — log BACEN obrigatório',
      'Sem histórico de portabilidade',
      'Sem tooltip explicando "Principal"',
      'Badge "Principal" sem dark mode — washed em dark',
      'Sem confirmação ao trocar Principal (operação importante)',
      'Button Cadastrar SideDrawer não disabled mesmo com newKeyValue vazio',
      'Progress bar artesanal não usa componente shadcn Progress',
      'Botão Excluir não usa variant="destructive" — styling inline',
      'font-mono inconsistente com IBPixReceive (sans-serif)',
      'Não usa SDK base44 / não persiste mudanças',
      'Continua gap ZERO i18n inter-página IB',
      'Cross-page navigation ausente — ilha sem Links',
    ],
  },

  technical: {
    fileLocation: 'pages/IBPixKeys.jsx (372 linhas — 37% maior que IBPixReceive 271L, 73% de IBExtract 511L, 54% de IBPixSend 689L)',
    routePath: '/IBPixKeys',
    moduleAffinity: 'Internet Banking — terceira página do bloco PIX',
    accessedFrom: ['Menu lateral IB sub-item PIX', 'NÃO está nos Quick Actions do IBHome'],

    imports: {
      react: 'useState (6× hooks)',
      reactRouter: 'NÃO IMPORTADO — sem Link cross-page',
      i18n: 'NÃO IMPORTADO — gap inter-página persiste',
      lucide: '[Key, Plus, Copy, Check, Star, Trash2, Building2, Mail, Phone, Hash, ArrowRightLeft, Shield, AlertCircle] — 13 icons',
      uiComponents: '[Card+CardContent+CardHeader (não usado)+CardTitle (não usado), Button, Badge, Input, Label, RadioGroup+RadioGroupItem, AlertDialog (7 sub-components)]',
      sideDrawer: 'SideDrawer de @/components/common/SideDrawer (PRIMEIRO uso no módulo IB)',
      utils: 'cn de @/lib/utils',
    },

    deadImports: {
      list: ['CardHeader (não usado)', 'CardTitle (não usado)'],
      observation: '2 dead imports — menos que IBPixReceive (4) mas continua presente',
    },

    stateManagement: {
      hooksCount: '6 useState — 50% mais que IBPixReceive (4)',
      hooks: [
        'copiedKey null — controla feedback Copy temporário',
        'showRegisterModal false — controla SideDrawer',
        'showDeleteDialog false — controla AlertDialog',
        'selectedKeyType "email" — radio group selection',
        'newKeyValue "" — input email/phone',
        'keyToDelete null — armazena key para mostrar no AlertDialog',
      ],
      complexity: 'TODOS efetivamente usados — ZERO dead state (segundo caso na plataforma após IBPixReceive)',
      observation: 'Padrão zero-dead-state continua dentro do bloco PIX',
    },

    helperFunctions: {
      handleCopy: 'idêntico ao IBPixReceive (clipboard real + setTimeout 2000ms reset) mas key.id ao invés de key.type',
      handleDelete: '`(key) => { setKeyToDelete(key); setShowDeleteDialog(true); }` — 2 mutations sequenciais para abrir AlertDialog com contexto',
    },

    clipboardAPIUsage: {
      occurrences: 1,
      consistency: 'PADRÃO REUSADO de IBPixReceive — boa prática mas duplicação de código (não extraído para hook)',
      gap: 'handleCopy não é hook compartilhado — duplicação',
    },

    designSystem: {
      pixOfficialColor: '#00D26A — verde oficial PIX (consistente com IBPixSend e IBPixReceive)',
      progressBarStyle: 'Implementação artesanal inline (não componente shadcn Progress)',
      destructiveButtonStyle: 'Inline text-red-600/700 + bg-red-50 (não variant="destructive")',
      sideDrawerFirst: 'PRIMEIRO uso no módulo IB',
      alertDialogFirst: 'PRIMEIRO uso no módulo IB',
      radioGroupFirst: 'PRIMEIRO uso no módulo IB',
      colorConflictPrincipal: 'Badge #00D26A vs Button amber-500 — gap design system',
    },

    pixKeysMockData: {
      structure: '[{id, type, value, icon, label, isPrimary, registeredAt}]',
      count: 3,
      keys: [
        '{id:1, type:"cnpj", value:"98.765.432/0001-10", icon:Building2, label:"CNPJ", isPrimary:true, registeredAt:"15/01/2025"}',
        '{id:2, type:"email", value:"financeiro-arroba-lojaabc.com.br", icon:Mail, label:"E-mail", isPrimary:false, registeredAt:"20/01/2025"}',
        '{id:3, type:"random", value:"a1b2c3d4-e5f6-7890-abcd-ef1234567890", icon:Hash, label:"Chave Aleatória", isPrimary:false, registeredAt:"25/01/2025"}',
      ],
      extraFieldsVsIBPixReceive: 'id + isPrimary + registeredAt (3 campos extras)',
      crossPageDuplication: 'Mesmo array conceitual hardcoded 3× (IBPixReceive + IBPixKeys + IBPixSend)',
      registeredAtFormat: 'String PT-BR DD/MM/YYYY — não Date object, não internacionalizável',
    },

    keyTypeOptionsMockData: {
      structure: '[{id, label, description, icon, disabled, disabledReason?}]',
      count: 4,
      options: [
        '{id:"cnpj", label:"CPF/CNPJ", desc:"Seu CNPJ: 98.765.432/0001-10", disabled:true, reason:"Já cadastrado nesta conta"}',
        '{id:"email", label:"E-mail", desc:"Informe o e-mail que deseja cadastrar", disabled:false}',
        '{id:"phone", label:"Telefone", desc:"Informe o telefone com DDD", disabled:false}',
        '{id:"random", label:"Chave Aleatória", desc:"Geraremos uma chave única automaticamente", disabled:false}',
      ],
      bacenAlignment: '4 dos 5 tipos BACEN (falta CPF — Loja ABC é CNPJ então CPF não se aplica)',
    },

    crossPageNavigation: {
      linksRenderizados: 'NENHUM',
      missingLinks: [
        'Sem voltar para IBHome',
        'Sem Link para IBPixReceive (ver QR depois de cadastrar chave)',
        'Sem Link para IBPixSend',
        'Sem Link para IBPixLimits',
      ],
      observation: 'Continua ilha de navegação como IBExtract e IBPixReceive',
    },

    i18nGap: {
      keysUsed: 0,
      hardcodedStrings: 'CENTENAS — header, sublabels uppercase, labels, placeholders, button labels, descriptions, badge labels, dialog titles/descriptions, alert messages',
      impact: 'Continua gap inter-página IBHome (22 keys) → IBExtract (0) → IBPixSend (0) → IBPixReceive (0) → IBPixKeys (0)',
    },

    knownGapsTechnical: [
      '372 linhas 100% MOCK — zero SDK base44',
      'ZERO i18n — gap inter-página persiste',
      '2 dead imports (CardHeader, CardTitle)',
      '6 useState — 100% aproveitados (segundo caso zero-dead-state)',
      'Counter "3 de 20" hardcoded em pixKeys.length',
      'Progress bar artesanal não usa shadcn Progress',
      'Button "Definir como principal" sem onClick',
      'Button "Cadastrar" no SideDrawer footer sem onClick',
      'AlertDialogAction "Excluir" sem onClick — confirma sem efeito',
      'Cards Portabilidade/Reivindicar com cursor-pointer mas sem onClick',
      'newKeyValue compartilhado email/phone',
      'Sem validação de formato',
      'Sem fluxo OTP de confirmação (apenas mencionado)',
      'CNPJ disabled hardcoded',
      'Conflito de cor "Principal" #00D26A vs amber-500',
      'registeredAt string PT-BR (não Date)',
      'Sem ordenação/filtro/busca/auditoria',
      'Sem confirmação ao trocar Principal',
      'Button destructive estilizado inline (não variant)',
      'font-mono em IBPixKeys vs sans em IBPixReceive (inconsistência)',
      'Sem dark mode no Badge "Principal"',
      'Sem tooltip explicando "Principal"',
      'handleCopy duplicado (não extraído para hook)',
      '3 fontes paralelas hardcoded para mesma entidade',
      'Cross-page navigation ausente',
    ],
  },
};

export default IBPixKeysDoc;