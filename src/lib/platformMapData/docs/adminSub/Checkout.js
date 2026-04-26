// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Módulo Checkout (Admin Sub)
// Páginas: /CheckoutBuilder, /Checkouts, /CheckoutTemplates
// Arquivos-fonte: pages/CheckoutBuilder.jsx, pages/Checkouts.jsx, pages/CheckoutTemplates.jsx
// =============================================================================

// =============================================================================
// PÁGINA: /CheckoutBuilder
// =============================================================================

export const CheckoutBuilderDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é o Checkout Builder',
    body:
      'Editor visual completo de páginas de checkout. É a ferramenta mais poderosa do módulo: permite ao merchant criar uma página de pagamento totalmente personalizada (cores, fontes, layout, métodos, mensagens, animações) sem escrever uma linha de código. Combina drag-and-drop visual + 5 painéis de configuração detalhada + integração com IA (Converter Agent) para sugestões de otimização de conversão.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) PERSONALIZAÇÃO DE MARCA — checkout que respira a identidade do merchant aumenta confiança e conversão; (2) OTIMIZAÇÃO DE CONVERSÃO — testar layouts, cores, copy de botão, ordem de campos para encontrar a versão que converte mais; (3) DIFERENCIAÇÃO POR CAMPANHA — checkouts diferentes para Black Friday, lançamentos, infoprodutos vs. e-commerce; (4) COMPLIANCE — adicionar campos customizados exigidos por legislação ou auditoria; (5) MULTI-IDIOMA / MULTI-MOEDA — versões específicas para públicos distintos.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Quando o merchant usa',
    body:
      'Em momentos pontuais mas críticos: (a) primeira configuração ao integrar a PagSmile; (b) campanhas de marketing com novo visual; (c) iteração mensal/trimestral de A/B testing de conversão; (d) ajustes finos quando o Converter Agent (IA) sugere mudança. Não é tela de uso diário — é tela de uso "quando precisa transformar o funil".',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que editor visual e não formulário',
    body:
      'Configurar checkout via formulário com 80+ campos é tortura mental. Editor visual mostra na hora o resultado de cada mudança, ajudando o merchant a decidir por aprovação visual em vez de adivinhar. Reduz tempo de configuração de horas para minutos. Reduz erros (mudou cor errada e não percebeu).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que resolve',
    body:
      'Antes: para ter checkout customizado o merchant precisava de desenvolvedor que codasse uma tela de checkout própria, hospedasse, integrasse com a API de pagamento e mantivesse — semanas de trabalho e R$ milhares. Aqui, em 30 minutos, qualquer não-técnico monta um checkout profissional pronto para receber.',
  },

  // ===========================================================================
  // 1. CARREGAMENTO INICIAL
  // ===========================================================================
  {
    type: 'section',
    title: 'Carregamento inicial e URL',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 A página aceita query parameter ?id=<checkout_id> na URL. Se presente, busca o CheckoutConfig existente via React Query e popula a tela. Se ausente, inicia com defaultCheckoutConfig (template em branco com configurações padrão da PagSmile).',
      },
      {
        type: 'paragraph',
        text:
          '🎯 Por que aceitar id na URL: (1) deep-linking ("editar este checkout") direto da lista /Checkouts; (2) compartilhar URL com outro membro do time para revisão; (3) salvar como bookmark.',
      },
      {
        type: 'paragraph',
        text:
          '📐 defaultCheckoutConfig contém TODAS as configurações default já definidas: cores PagSmile (#00D26A, #101F3E), fonte Inter, layout one-step, summary à direita, métodos de cartão e PIX habilitados, parcelamento 12x com 3x sem juros, juros 2.99% a.m., 3DS condicional, validação realtime, autofill de CEP, animação de confetti no sucesso, etc. — uma "boa configuração inicial" sem precisar configurar nada.',
      },
    ],
  },

  // ===========================================================================
  // 2. PAGE HEADER + BARRA DE AÇÕES
  // ===========================================================================
  {
    type: 'section',
    title: 'PageHeader + Barra de Ações',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Cabeçalho da página com título "Builder de Checkout", subtítulo "Crie e personalize seus checkouts com um editor visual" e — à direita — uma barra com 5 ações operacionais críticas: Undo, Redo, Preview, Salvar e Publicar.',
      },

      {
        type: 'subsection',
        title: 'Botão Undo (↶)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: desfaz a última alteração no checkout (volta um passo no histórico).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: editar é experimentar. Sem Undo, cada erro vira fricção e medo. Com Undo, o merchant explora livremente.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: botão outline size sm com ícone Undo2. Disabled quando historyIndex === 0 (não há nada para desfazer). Implementa um array history que cresce a cada updateConfig + um historyIndex apontando para a posição atual. Click decrementa o índice e seta o config para o snapshot correspondente.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão Redo (↷)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: refaz uma alteração desfeita anteriormente (volta para frente no histórico).',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: outline sm com Redo2. Disabled quando historyIndex === history.length - 1 (não há frente para ir).',
          },
          {
            type: 'callout',
            variant: 'info',
            title: 'Histórico ramifica',
            body:
              'Se o merchant Undo 3 vezes e depois faz uma NOVA edição, o "futuro" é descartado: history.slice(0, historyIndex + 1) corta o que estava à frente. Comportamento padrão de editores (igual Photoshop, VSCode etc.).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Preview"',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: abre janela/aba com simulação real do checkout — sem dados de pagamento reais, mas com layout e fluxo finais.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: ver o checkout como o cliente verá. Mesmo com VisualEditor sendo WYSIWYG, há diferenças sutis (focos, validações, animações reais) que só aparecem no preview funcional.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: outline sm com ícone Eye + label "Preview". Comportamento previsto: abrir nova aba renderizando o checkout em modo de teste com transação dummy.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Salvar" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: persiste o estado atual do checkoutConfig na entidade CheckoutConfig (cria nova ou atualiza existente conforme ?id=).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: garantir que mudanças não se percam ao recarregar/sair. Salvar NÃO publica — o checkout salvo permanece em status="draft" até a publicação.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: variant default (verde primário, bg #00D26A hover #00B85C). Ícone Save + label "Salvar". Quando saveMutation está em curso, label muda para "Salvando..." e botão fica disabled.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Após sucesso: queryClient.invalidateQueries(["checkouts"]) — força a lista /Checkouts a recarregar para mostrar o novo/atualizado checkout.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Botão "Publicar" (azul-marinho primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: publica o checkout — torna-o ativo e acessível pela URL pública. Status muda de "draft" → "active".',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: separar trabalho em andamento (draft) de versão produção. Permite editar com tranquilidade sem afetar checkouts já em uso por clientes finais.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE SEPARAR Salvar de Publicar: deploy em produção exige cuidado extra. Confirmação extra reduz erros de "ah, eu publiquei sem querer". Em iteração futura, esperar diálogo de confirmação ("Tem certeza? Esta versão substituirá a publicada atual.").',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: variant default com cor PagSmile escura (#101F3E hover #1a2d52). Ícone Play + label "Publicar". Versão atual sem handler programado.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. ESTRUTURA DE 6 ABAS
  // ===========================================================================
  {
    type: 'section',
    title: 'Estrutura de Abas (6 painéis)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'TabsList horizontal (flex-wrap, p-1, fundo branco com borda) com 6 TabsTrigger. Cada aba ativa recebe destaque verde claro (#00D26A/10 background + texto verde). Cada uma carrega um painel especializado de configuração.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que ESTAS 6 abas',
        body:
          'Refletem as 6 dimensões de configuração de um checkout: ESTRUTURA (Editor Visual = quais blocos aparecem) + APARÊNCIA (Identidade Visual = cores/fontes/marca) + LAYOUT (organização espacial) + PAGAMENTOS (métodos e regras financeiras) + EXPERIÊNCIA (validações, animações, comportamento) + IA (Converter Agent = otimização inteligente). Separar evita formulário gigante e permite edição focada.',
      },
      {
        type: 'list',
        items: [
          'Aba 1 "Editor Visual" (default) — ícone LayoutTemplate. Drag-and-drop de elementos',
          'Aba 2 "Identidade Visual" — ícone Palette. Cores, fontes, logo',
          'Aba 3 "Layout" — ícone LayoutGrid. Estrutura espacial e responsividade',
          'Aba 4 "Pagamentos" — ícone CreditCard. Métodos aceitos, parcelamento, PIX',
          'Aba 5 "Experiência" — ícone Sparkles. Validação, animações, mensagens',
          'Aba 6 "Converter Agent" — ícone Sparkles. Agente IA que sugere melhorias',
        ],
      },
    ],
  },

  // ===========================================================================
  // 4. ABA "EDITOR VISUAL"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 1: Editor Visual (drag-and-drop)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Aba principal e mais usada. Editor WYSIWYG (What You See Is What You Get) com 3 colunas: PAINEL DE ELEMENTOS (esquerda — bloco-fonte) + EDITOR VISUAL (centro — área de arrastar) + PAINEL DE PROPRIEDADES (direita — config do elemento selecionado). Acima, toolbar com seletor de dispositivo + zoom.',
      },

      {
        type: 'subsection',
        title: 'Toolbar do Editor (linha superior)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'Seletor de Dispositivo (3 ícones)',
            body:
              'Permite alternar visualização entre Desktop / Tablet / Mobile sem mudar o conteúdo — só a renderização visual no centro adapta para o tamanho de tela escolhido.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: container "Dispositivo:" + 3 botões em caixa com border arredondado. Ícones Monitor / Tablet / Smartphone. Botão ativo: bg cinza claro. Click muda estado `device`.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 3 dispositivos: ~50% das transações brasileiras já são mobile. Não testar mobile = perder metade dos clientes. Tablet é menor mas existe (especialmente B2B). Desktop ainda dominante em alguns nichos.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Controle de Zoom',
            body:
              'Botões "ZoomOut" e "ZoomIn" (Lucide ícones) com label "Zoom: X%" entre eles. Range: 50% a 200%, step de 25%. Default: 100%.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: em telas pequenas, dar zoom-out para ver checkout inteiro sem rolar. Em alta densidade (4K), dar zoom-in para ver detalhes e mexer em pixels precisos.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Layout 3-colunas do editor (height: calc(100vh - 340px))',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Container flex com 3 colunas filhas e altura fixa subtraindo header/breadcrumbs/tabs/toolbar. Sem scroll geral — cada coluna scrolla isoladamente.',
          },
          {
            type: 'subsection',
            title: 'Coluna ESQUERDA — ElementPanel',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: lista de "elementos" disponíveis para arrastar para a área central. Cada elemento é um bloco padrão (Cabeçalho, Nome, E-mail, CPF, Endereço, Card de pagamento, Resumo do pedido, Termos, Botão Pagar, Selo de segurança, Texto livre, Imagem, Divisor, etc.).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: oferecer "peças prontas" testadas e otimizadas. O merchant não inventa — escolhe. Padronização reduz risco de checkout mal feito.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 UI esperada: lista vertical com ícone + nome do elemento. Provavelmente categorizada (Identificação / Endereço / Pagamento / Adicional). Click ou drag adiciona ao editor (handleAddElement).',
              },
              {
                type: 'paragraph',
                text:
                  '📐 handleAddElement gera ID único `${type}-${Date.now()}` e copia defaultProps do elemento — isolando esta instância de outras do mesmo tipo.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Coluna CENTRAL — VisualEditor',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: canvas central que renderiza o checkout em construção em tempo real, respeitando device selecionado, zoom, branding, layout e elementos adicionados.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: feedback visual imediato. Cada mudança (cor, fonte, novo elemento) reflete instantaneamente.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Comportamento de seleção: click em elemento renderizado → setSelectedElement(element) → coluna direita carrega config dele. Borda destacada (ring-2 verde) marca o selecionado. Click fora deseleciona.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Reorganização: drag-and-drop entre elementos (provavelmente @hello-pangea/dnd). handleReorderElements recebe array reordenado e atualiza config.elements.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Delete: tecla Delete ou ícone de lixeira flutuante no elemento selecionado → handleDeleteElement(id).',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Coluna DIREITA — PropertiesPanel',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: painel CONTEXTUAL — muda totalmente conforme o elemento selecionado. Sem nada selecionado: mostra ajuda ou propriedades do checkout como um todo. Elemento selecionado: mostra todas as propriedades editáveis dele (label, placeholder, validação, obrigatoriedade, máscara, etc.).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: edição focada, sem poluir tela com 80 campos sempre visíveis. Você seleciona o que quer ajustar e só vê o relevante.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Comportamento: cada mudança chama handleUpdateElement(id, updates) que mescla os updates no element correspondente do array. O VisualEditor re-renderiza automaticamente com nova config.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Botão "Excluir Elemento" no fundo do painel (vermelho) chama handleDeleteElement.',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. ABA "IDENTIDADE VISUAL"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 2: Identidade Visual (BrandingSettings)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Painel completo de personalização visual da marca. Aceita o objeto branding (do checkoutConfig) e dispara updateConfig({ branding }) ao mudar.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Fazer o checkout PARECER da marca do merchant — não da PagSmile. Cliente acessando checkout com cores estranhas/genéricas DESCONFIA. Cores familiares aumentam confiança e conversão.',
      },
      {
        type: 'subsection',
        title: 'Seções dentro do BrandingSettings',
        children: [
          {
            type: 'list',
            items: [
              'LOGO & FAVICON: upload de logo (aparece no topo do checkout) e favicon (aba do navegador). Background image também',
              'CORES (paleta de 9 cores configuráveis): primary (botão principal — default verde PagSmile), secondary (azul-marinho), background (fundo da página), card_background (fundo dos cards), text_primary, text_secondary, success, error, warning. Cada cor tem color picker + input hex',
              'TIPOGRAFIA: font_family (default Inter), title_font (pode ser diferente do body), base_size (default 16px), title_sizes (h1=32, h2=24, h3=20), font_weight (normal/medium/bold), line_height (default 1.5)',
              'BOTÕES: bg_color, text_color, border_radius (0-20px slider), size (small/medium/large), hover_style (darken/lighten/shadow), icon (cadeado/seta/nenhum). Configura aparência de TODOS os botões do checkout',
              'INPUTS: bg_color, border_color, focus_border_color, error_border_color, border_width, border_radius, height (small/normal/large), label_style (above/floating/inside)',
              'CSS CUSTOMIZADO: textarea para CSS livre — para casos avançados que escapam dos campos pré-definidos. Recurso "escape hatch" para devs',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 9 cores e não 3: cores complementares são fundamentais. Cor de erro precisa ser distinta da de sucesso, ambas distintas do hover do botão, etc. 9 cobre todos os estados sem ser confuso.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE permitir CSS customizado: clientes enterprise sempre pedem detalhes únicos (cor do scrollbar, animação específica, fonte de outra fonte custom). Sem escape hatch, eles desistem do builder. Com, ficam.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. ABA "LAYOUT"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 3: Layout (LayoutSettings)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Configura a ESTRUTURA do checkout: fluxo (one-step / multi-step), posição do resumo, comportamento responsivo, footer.',
      },
      {
        type: 'subsection',
        title: 'Configurações',
        children: [
          {
            type: 'list',
            items: [
              'FLOW TYPE: "one-step" (tudo numa página — melhor para alta conversão) vs "multi-step" (várias páginas com progresso — melhor para checkouts B2B com muita info)',
              'STEPS: array de etapas customizáveis (só relevante se multi-step). Cada step com nome, ordem e elementos atribuídos',
              'SUMMARY POSITION: right (padrão desktop) / left / top / bottom — onde aparece o "Resumo do Pedido"',
              'SUMMARY STICKY: true/false — fixa o resumo durante scroll (boas práticas dizem TRUE no desktop)',
              'SUMMARY ITEMS: array com quais campos aparecem no resumo (name / quantity / price / image / description)',
              'SUMMARY EDITABLE: cliente pode editar quantidade no resumo? (true para carrinho dinâmico)',
              'SUMMARY COLLAPSIBLE MOBILE: em mobile, vira accordion no topo? (true por default)',
              'BREAKPOINTS: thresholds em pixels para desktop/tablet/mobile (1200/768/375 default)',
              'MOBILE FONT SCALE: multiplicador de fonte em mobile (1.1 = aumenta 10% para legibilidade)',
              'MOBILE FULL WIDTH BUTTONS: botões 100% width no mobile (true = tap area maior, conversão melhor)',
              'FOOTER: { security_badges (true/false), card_brands (true/false — mostra logos das bandeiras aceitas), security_text (texto SSL), links (políticas, termos), powered_by (mostrar "Powered by PagSmile"?) }',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE one-step é default: estudos mostram que one-step tem ~20% mais conversão que multi-step para tickets <R$500. Multi-step só vale para tickets altos onde o cliente já está comprometido.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE security_badges/card_brands: trust signals. Logos visíveis aumentam ~5-10% de conversão por reduzir ansiedade do cliente.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 7. ABA "PAGAMENTOS"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 4: Pagamentos (PaymentMethodSettings)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Painel financeiro/regulatório do checkout: define quais MÉTODOS aceitar, regras de PARCELAMENTO, tempo de PIX, descontos, ordem de exibição.',
      },
      {
        type: 'subsection',
        title: 'Configurações de Cartão',
        children: [
          {
            type: 'list',
            items: [
              'enabled: true/false — toggle global',
              'brands: lista das bandeiras aceitas (visa, mastercard, elo, amex, hipercard). Bandeiras desligadas mostram cartões recusados antes mesmo da tentativa',
              'max_installments: 1-12. Default 12. Quanto maior, mais conversão (mas mais juros, menos margem)',
              'interest_free_installments: até qual parcela é "sem juros". Ex: 3 = 1x/2x/3x sem juros, 4x+ com juros',
              'interest_rate: taxa mensal aplicada nas parcelas com juros (default 2.99% a.m. — média do mercado)',
              'min_installment_value: valor mínimo da parcela (default R$ 10). Se valor/parcelas < mínimo, parcela não aparece',
              'min_value_to_installment: valor mínimo de venda para HABILITAR parcelamento (default R$ 50)',
              'soft_descriptor: texto que aparece na fatura do cliente (até 22 chars). Reduz chargebacks por "não reconhecimento"',
              'require_cvv: exigir CVV (recomendado true para minimizar fraude)',
              'require_name: exigir nome impresso no cartão (recomendado true)',
              'three_ds: "off" / "risk" (só em transações de risco) / "always". Default "risk"',
              'allow_save_card: cliente pode salvar cartão para próximas compras? (tokenização)',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Configurações de PIX',
        children: [
          {
            type: 'list',
            items: [
              'enabled: toggle',
              'expiration_minutes: validade do QR (default 30min — equilíbrio entre cliente ter tempo e não expor por horas)',
              'discount_percentage: % de desconto se pagar via PIX (default 5%). Forte incentivo — PIX tem MDR muito menor que cartão',
              'custom_message: mensagem extra no QR ("Promoção válida hoje")',
              'instructions: texto de orientação ao cliente. Default explica como pagar (escanear / copiar e colar)',
              'show_copy_paste: mostrar opção de copiar código (true para mobile usuários)',
              'show_timer: contador regressivo até expiração (cria urgência → conversão)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 5% de desconto PIX é razoável: MDR do PIX é ~1% vs ~3.5% do cartão. Ofertar 5% de desconto ainda gera economia líquida de ~2.5% para o merchant — e empurra clientes para PIX que tem 0% de chargeback.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Display (Como exibir os métodos)',
        children: [
          {
            type: 'list',
            items: [
              'order: ordem de exibição (["card", "pix"] = cartão primeiro, PIX segundo). Reordenar pode afetar conversão',
              'default_method: "first" (primeiro da ordem é selecionado por default) ou "card"/"pix" específico',
              'style: "tabs" (abas) / "radio" (lista com radio buttons) / "cards" (cards visuais grandes)',
              'show_icons: ícones do método (true)',
              'show_descriptions: descrição abaixo do nome do método (true)',
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 8. ABA "EXPERIÊNCIA"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 5: Experiência (ExperienceSettings)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Configura COMPORTAMENTOS do checkout: como valida campos, como completa endereço por CEP, animações de feedback, página de sucesso/erro, gatilhos de urgência.',
      },
      {
        type: 'subsection',
        title: 'Validation',
        children: [
          {
            type: 'list',
            items: [
              'realtime: validar enquanto digita (true) ou só ao sair do campo (false). True é melhor UX',
              'delay_ms: debounce em ms (default 300) — não valida a cada tecla',
              'error_position: "below" (abaixo do campo) / "above" / "inline"',
              'error_style: visual da mensagem de erro',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Autofill',
        children: [
          {
            type: 'list',
            items: [
              'cep_lookup: ao digitar CEP, completa endereço automaticamente (default true — economia de 5-7 campos)',
              'browser_autocomplete: deixar browser sugerir valores salvos (true)',
              'remember_customer: salvar dados do cliente para próxima compra? (false default — privacidade)',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Animations',
        children: [
          {
            type: 'list',
            items: [
              'button_loading: tipo de loading no botão pagar (spinner / skeleton / progress)',
              'success_animation: o que tocar ao aprovar pagamento (confetti / checkmark / nada)',
              'error_shake: input chacoalhar quando inválido (true)',
              'step_transition: animação entre passos (slide / fade / none)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE confetti default no sucesso: cliente aprovado é momento de alegria. Reforço positivo + foto compartilhável + sensação de marca premium.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Success Page',
        children: [
          {
            type: 'list',
            items: [
              'message: mensagem com placeholders ({nome}, {pedido}, {valor})',
              'buttons: array de CTAs ("back_to_store", "view_order", "track_shipping")',
              'redirect_url: URL para redirecionar após X segundos',
              'redirect_delay: segundos antes de redirecionar',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Error Page',
        children: [
          {
            type: 'list',
            items: [
              'message: copy genérica de erro',
              'options: o que oferecer ao cliente ("retry" tentar de novo / "other_card" trocar cartão / "pix" oferecer PIX como alternativa / "support" abrir contato)',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 OPCÃO "pix" na error page é OURO: 30-40% das recusas de cartão acabam convertendo se cliente migra para PIX no momento do erro. Recovery in-context > recovery por e-mail depois.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Urgency (Gatilhos de Conversão)',
        children: [
          {
            type: 'list',
            items: [
              'offer_timer: contador regressivo de oferta (false default — usar com moderação)',
              'offer_timer_minutes: quanto tempo o timer roda',
              'stock_limited: mostrar "restam X em estoque"',
              'stock_count: número fictício/real do estoque',
              'social_proof: mostrar "X pessoas compraram nas últimas 24h"',
              'social_proof_count: número',
            ],
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Uso ético',
            body:
              'Gatilhos de urgência só funcionam quando reais. Estoque fake e timers fake erodem confiança a longo prazo. Default é DESLIGADO por isso. Cabe ao merchant decidir uso ético.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 9. ABA "CONVERTER AGENT"
  // ===========================================================================
  {
    type: 'section',
    title: 'Aba 6: Converter Agent (IA de Conversão)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Aba dedicada ao agente IA "Converter Agent" — analisa o checkout em construção (e dados históricos) e sugere melhorias com impacto estimado em conversão. Funciona como um especialista em UX de checkout 24/7 dentro do builder.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Levantar oportunidades que o merchant não vê. Ex: "muitos clientes abandonam no campo CPF — sugerimos máscara automática", "o botão verde está em contraste insuficiente — testar #00B85C", "PIX não aparece como opção principal — clientes mobile preferem PIX".',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Por que como aba dentro do Builder',
        body:
          'Sugestões de IA são mais úteis quando aplicáveis NO MOMENTO da edição. Aba dedicada permite: ver sugestão → clicar "aplicar" → ver mudança no editor → salvar. Tudo em um fluxo. Existe também página externa /ConverterAgent para uso autônomo.',
      },
      {
        type: 'paragraph',
        text:
          '📐 Recebe checkoutId via prop. Se id existe (editando checkout salvo), agente tem dados históricos para personalizar sugestões. Sem id (checkout novo), agente sugere best practices gerais.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Documentação detalhada',
        body:
          'O Converter Agent tem página própria /ConverterAgent (com chat, configurações, métricas) — será documentada detalhadamente na entrega 13 (Agentes IA do Admin Sub).',
      },
    ],
  },

  // ===========================================================================
  // 10. SISTEMA DE HISTÓRICO E PERSISTÊNCIA
  // ===========================================================================
  {
    type: 'section',
    title: 'Sistema de Histórico (Undo/Redo) e Persistência',
    children: [
      {
        type: 'subsection',
        title: 'Histórico em memória',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 useState `history` = array de snapshots completos do checkoutConfig. `historyIndex` = ponteiro para o snapshot atual. Toda mudança via updateConfig: (1) cria novo config, (2) corta o array em historyIndex+1 (descarta "futuro" se houver), (3) adiciona novo snapshot ao final, (4) avança o índice.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PROS: instantâneo, sem flicker, totalmente cliente-side. CONS: não persiste entre recargas (refresh perde histórico). É comportamento esperado em editores — histórico é volátil; o que persiste é o que está SALVO.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Persistência (CheckoutConfig entity)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 saveMutation chama base44.entities.CheckoutConfig.update(id, config) ou .create(config) — cria registro novo se não há id. Schema da entidade aceita TODOS os campos que o builder define: branding, layout, payment_methods, experience, elements (array), version, version_history, ab_tests, conversion_rate, total_sessions, total_completed.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Versionamento: campo `version` incrementa a cada salvar/publicar. `published_version` aponta para qual versão está atualmente em produção. `version_history` array preserva snapshots para rollback futuro (não usado na UI atual mas previsto na entidade).',
          },
        ],
      },
    ],
  },
];

// =============================================================================
// PÁGINA: /Checkouts (Lista de Checkouts criados)
// =============================================================================

export const CheckoutsDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Meus Checkouts',
    body:
      'Listagem dos checkouts criados pelo merchant — uma "biblioteca" visual de páginas de pagamento. Mostra cada checkout como card com nome, status, vendas geradas e URL pública. A partir daqui o merchant cria novo, edita, visualiza, copia URL e exclui.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) ENCONTRAR checkout existente para editar; (2) COMPARTILHAR URL pública com integrações externas (e-mail marketing, anúncios pagos, posts em redes sociais); (3) VER quais geram mais vendas (KPI de vendas no card); (4) ATIVAR/DESATIVAR checkouts antigos sem excluir; (5) CRIAR novo checkout (CTA destacado).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que cards visuais e não tabela',
    body:
      'Checkouts são "produtos" visuais — fazer sentido vê-los lado a lado em cards. Tabela seria útil só se houvesse 30+ checkouts (raro — merchants tipicamente têm 1-5). Cards são mais convidativos visualmente e funcionam melhor em mobile.',
  },

  // ===========================================================================
  // PageHeader
  // ===========================================================================
  {
    type: 'section',
    title: 'PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Título "Meus Checkouts" + subtítulo "Gerencie todos os seus checkouts personalizados". Breadcrumb "Checkout › Meus Checkouts".',
      },
      {
        type: 'subsection',
        title: 'Botão "Novo Checkout" (verde primário)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE FAZ: link wrapping um Button com ícone Plus + label. Leva para /CheckoutBuilder (sem ?id, então cria novo).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 PARA QUE SERVE: ação primária da página. Sempre visível no topo direito.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE em destaque verde: ação CRIATIVA (gera valor) deve sempre se destacar visualmente. Cor verde PagSmile reforça identidade.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // FILTROS
  // ===========================================================================
  {
    type: 'section',
    title: 'Card de Filtros (busca)',
    children: [
      {
        type: 'paragraph',
        text:
          '🎯 O QUE É: card com Input de busca em tempo real. Ícone Search à esquerda do input.',
      },
      {
        type: 'paragraph',
        text:
          '🎯 PARA QUE SERVE: localizar checkout específico por nome quando há vários. Filtragem é client-side (ao digitar, filtra `filteredCheckouts` no array em memória).',
      },
      {
        type: 'paragraph',
        text:
          '📐 Busca case-insensitive (.toLowerCase em ambos os lados). Procura apenas no campo `name` — se merchant não nomeou, busca não encontra.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Outros filtros previstos',
        body:
          'Versão atual só tem busca por nome. Filtros previstos em iteração futura: por status (ativo/draft/inativo), por data de criação, por taxa de conversão. Atualmente o card de filtros só tem o input de busca.',
      },
    ],
  },

  // ===========================================================================
  // ESTADOS DA LISTA
  // ===========================================================================
  {
    type: 'section',
    title: 'Estados da Lista',
    children: [
      {
        type: 'subsection',
        title: 'Loading',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Grid 3 colunas com 3 cards skeleton (animate-pulse): cada card mostra retângulo cinza largo + retângulo cinza menor. Mantém grid igual para evitar layout shift quando dados carregarem.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Vazio (zero checkouts ou nenhum match na busca)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Card grande centralizado: ícone ShoppingCart cinza claro 48px + título "Nenhum checkout encontrado" + descrição "Crie seu primeiro checkout personalizado para começar a vender" + botão "Criar Checkout" (link para CheckoutBuilder).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que mostrar CTA no estado vazio: usuário sem nada vendo geralmente é primeiro acesso. Em vez de tela morta, oferecer próximo passo claro.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Com dados (lista de cards)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Grid responsivo: 1 col mobile, 2 cols tablet, 3 cols desktop. Cada card aplicado hover:shadow-md transition.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // CARD INDIVIDUAL DE CHECKOUT
  // ===========================================================================
  {
    type: 'section',
    title: 'Card Individual de Checkout',
    children: [
      {
        type: 'subsection',
        title: 'CardHeader (topo)',
        children: [
          {
            type: 'list',
            items: [
              'Nome do checkout em fonte média bold (ou "Checkout sem nome" se vazio)',
              'Descrição cinza pequena embaixo (ou "Sem descrição")',
              'À direita: DropdownMenu (ícone MoreVertical 3 pontos verticais)',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Dropdown Menu (3 ações)',
        children: [
          {
            type: 'list',
            items: [
              '"Visualizar" (ícone Eye) — abre o checkout em modo preview (versão atual sem handler)',
              '"Editar" (ícone Pencil) — leva para /CheckoutBuilder?id=<checkout_id> (atualmente sem handler)',
              '"Excluir" (ícone Trash2 + texto vermelho) — remove o checkout. Versão final espera confirmação',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE Excluir está em vermelho: ação destrutiva merece destaque visual de cuidado — convenção universal em UI.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'CardContent (corpo)',
        children: [
          {
            type: 'subsection',
            title: 'Linha 1: Status + Vendas',
            children: [
              {
                type: 'paragraph',
                text:
                  '📐 Status: Badge com 3 variantes: "Ativo" (default verde) / "Inativo" (secondary cinza) / "Rascunho" (outline). Função getStatusBadge mapeia status para config visual.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 Vendas: texto cinza pequeno "X vendas" — KPI quick-view do checkout. Permite ranking visual: olha-se os cards e identifica os "campeões" rapidamente.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Linha 2: URL + Ações de URL (condicional)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE É: linha que SÓ aparece se checkout.url existe. Mostra URL pública em Input readonly + 2 botões.',
              },
              {
                type: 'list',
                items: [
                  'Input readonly text-xs h-8 — exibe URL completa (truncada visualmente se longa)',
                  'Botão Copy (ícone Copy 12×12) — copia URL para clipboard. UX importante: 1 click para compartilhar',
                  'Botão ExternalLink (ícone ExternalLink) — abre URL em nova aba (target="_blank")',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE 2 botões e não 1: diferentes contextos. Copy = compartilhar com terceiro (e-mail, WhatsApp). External = abrir e ver de verdade. Ambos são fluxos comuns.',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // RESPONSIVIDADE & FUTURO
  // ===========================================================================
  {
    type: 'section',
    title: 'Responsividade',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Mobile: cards viram coluna única. Header empilha (título → botão). Input de URL pode quebrar para abaixo dos botões em telas muito pequenas.',
      },
    ],
  },
];

// =============================================================================
// PÁGINA: /CheckoutTemplates
// =============================================================================

export const CheckoutTemplatesDoc = [
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página Templates',
    body:
      'Galeria visual de templates pré-prontos de checkout. Em vez de partir do zero no Builder, o merchant escolhe um template e edita a partir dele. Acelera dramaticamente o onboarding (de horas para minutos).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      '(1) ACELERAR primeiro setup — merchant novo não precisa pensar do zero; (2) DESCOBRIR padrões testados (high-converting templates baseados em data); (3) INSPIRAÇÃO — mesmo merchant experiente pode ver outras opções estéticas; (4) PADRONIZAR estilos para verticais específicas (e-commerce, infoprodutos, SaaS).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que existir essa página',
    body:
      'Builder vazio é intimidante. Template é "ponto de partida amigável". Outros players (Stripe, Shopify) têm o mesmo padrão — galeria de templates é convenção do mercado.',
  },

  // ===========================================================================
  // ESTADO ATUAL (3 templates hardcoded)
  // ===========================================================================
  {
    type: 'section',
    title: 'Estado atual da implementação',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 A página atual usa array hardcoded de 3 templates: "PagSmile Default" (Standard), "Dark High Conversion" (Dark Mode), "Minimalist Pro" (Minimal). Não há integração com a entidade CheckoutTemplate ainda.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Versão final prevista',
        body:
          'A entidade CheckoutTemplate já está modelada para receber: name, description, category (pre-defined / custom / vertical), vertical (ecommerce / saas / services / infoproducts / subscriptions / donations), thumbnail_url, elements, branding, layout, payment_methods, experience, is_public, usage_count. A galeria final irá puxar dessa entidade — provavelmente combinando templates oficiais PagSmile + templates customizados do próprio merchant.',
      },
    ],
  },

  // ===========================================================================
  // PAGEHEADER
  // ===========================================================================
  {
    type: 'section',
    title: 'PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Título "Templates de Checkout" + subtítulo "Escolha um design otimizado para sua loja". Breadcrumb "Checkout › Templates". Sem botão de ação — toda interação é nos cards.',
      },
    ],
  },

  // ===========================================================================
  // GRID DE CARDS DE TEMPLATE
  // ===========================================================================
  {
    type: 'section',
    title: 'Grid de Cards de Template',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Layout',
        body:
          'Grid responsivo (1/2/3 colunas) com gap 32px (gap-8). Cada card tem altura preservada e contém 2 partes: ÁREA DE PREVIEW VISUAL (acima) + ÁREA DE INFORMAÇÃO + AÇÕES (abaixo).',
      },

      {
        type: 'subsection',
        title: 'Área de Preview Visual (h-56 = 224px)',
        children: [
          {
            type: 'paragraph',
            text:
              '🎯 O QUE É: espaço acima do card que mostra mockup visual do checkout. Background com pattern abstrato decorativo (AbstractPattern1 verde, AbstractPattern2 azul-marinho).',
          },
          {
            type: 'paragraph',
            text:
              '📐 Componente CheckoutMockup interno renderiza versão miniaturizada estática do que o checkout pareceria: header com logo + 4 inputs em coluna + botão verde + bloco de resumo à direita. Para variantes "dark" e "minimal", overlay de cor é aplicado para sugerir o estilo.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE mockup estático em vez do checkout real: performance + simplicidade. Mostrar o checkout funcional em pequeno seria pesado e falharia em mostrar a "essência visual" (foco aqui). Mockup estilizado dá ideia clara em uma piscadela.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Hover effects: o mockup escala 105% (transition 500ms) + overlay preto de 5% aparece — efeito visual de "elevação"/"convite a explorar".',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Área de Informação + Ações',
        children: [
          {
            type: 'list',
            items: [
              'Nome do template em font-bold large',
              'Badge secondary com tipo (Standard / Dark Mode / Minimal)',
              'À direita: ícone do estilo em círculo cinza (Layout / Monitor / Smartphone)',
              '2 BOTÕES embaixo lado a lado (gap 12px):',
              '   - "Pré-visualizar" (preto/branco) — abre preview do template em modal/nova aba',
              '   - "Usar Template" (verde PagSmile) — duplica o template e leva para CheckoutBuilder com config carregada',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 POR QUE 2 botões: "Pré-visualizar" é commitment-free (só ver). "Usar Template" é commitment (vai para edição). Separar dá ao usuário controle de exploração.',
          },
        ],
      },

      {
        type: 'subsection',
        title: 'Hover do card inteiro',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Card aplica: hover:shadow-2xl (sombra ampla) + hover:-translate-y-2 (eleva 8px) + transition 300ms. Cria efeito 3D de elevação que comunica interatividade.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // ROADMAP / TEMPLATES POR VERTICAL
  // ===========================================================================
  {
    type: 'section',
    title: 'Roadmap previsto',
    children: [
      {
        type: 'list',
        items: [
          'Galeria expandida com 15-20+ templates oficiais',
          'Categorização por VERTICAL (e-commerce, infoprodutos, SaaS, doações, eventos)',
          'Filtros por: estilo (light/dark/minimal), método primário (cartão/PIX), idioma, idoma',
          'Indicador de "high-converting" — taxa de conversão média do template baseado em uso real',
          'Templates customizados do merchant (salvar configuração atual como template para reuso futuro)',
          'Templates compartilhados publicamente (CheckoutTemplate.is_public)',
          'Integração com Converter Agent IA — recomendação: "merchants do seu segmento usam preferencialmente este template"',
        ],
      },
    ],
  },
];