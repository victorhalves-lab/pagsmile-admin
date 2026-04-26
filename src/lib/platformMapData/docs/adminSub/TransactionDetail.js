// =============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Detalhe da Transação (Admin Sub / Portal Merchant)
// Rota: /TransactionDetail?id=<transaction_id>
// Arquivo-fonte: pages/TransactionDetail.jsx
// =============================================================================

export const TransactionDetailDoc = [
  // ===========================================================================
  // 1. INTRODUÇÃO GERAL DA PÁGINA
  // ===========================================================================
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que é a página de Detalhe da Transação',
    body:
      'Tela "ficha completa" de uma transação individual. Exibe TODAS as informações disponíveis sobre uma transação específica: identificadores, status atual, timeline de eventos, dados do método de pagamento, valores e taxas, dados do pagador, códigos de referência, metadata customizada e ações operacionais (estornar, devolver, capturar, cancelar, anotar).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Para que serve',
    body:
      'Atende 7 cenários reais: (1) ATENDIMENTO AO CLIENTE — operador do merchant precisa investigar uma cobrança questionada por consumidor; (2) AUDITORIA — conferir se uma transação foi liquidada corretamente; (3) DISPUTA / CHARGEBACK — coletar evidências (ARN, TID, autorização, IP, e-mail, endereço) para contestação; (4) ESTORNO — devolver dinheiro ao cliente quando há acordo; (5) CAPTURA / CANCELAMENTO — completar transações pré-autorizadas (hotelaria, locação); (6) CONCILIAÇÃO — bater detalhes com o ERP; (7) DEBUG TÉCNICO — entender por que uma transação foi recusada (motivo, código, scoring antifraude).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Como o usuário chega aqui',
    body:
      'Clicando em qualquer linha da tabela em /Transactions, /CardTransactions, /PixTransactions, /DeclineAnalysis, ou em "Ver detalhes" de qualquer card de transação na home/dashboards. URL inclui o id da transação como query parameter (?id=...).',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'Por que página dedicada (não modal)',
    body:
      'Transação é entidade rica — contém dezenas de campos, múltiplas ações destrutivas (estorno) e a probabilidade de o usuário precisar copiar/colar valores em outro lugar é alta. Modal limitaria espaço e atrapalharia copy-paste cross-window. Página dedicada permite imprimir, compartilhar URL via e-mail/Slack e abrir em nova aba — fluxos comuns no atendimento.',
  },
  {
    type: 'description',
    emoji: '🎯',
    title: 'O que resolve',
    body:
      'Antes desta tela, o operador precisaria consultar pelo menos 3 fontes para responder a uma pergunta de cliente: backoffice da adquirente (TID/NSU), CRM próprio (dados do cliente), planilha financeira (liquidação). Aqui tudo está consolidado e pode ser respondido em segundos.',
  },

  // ===========================================================================
  // 2. ESTADOS DE CARREGAMENTO
  // ===========================================================================
  {
    type: 'section',
    title: 'Estados de Carregamento',
    children: [
      {
        type: 'subsection',
        title: 'Loading inicial (transação sendo buscada)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Mostra dois retângulos cinzas pulsantes: um menor (h-8 w-48) simulando o título e um maior (h-64) simulando o cartão principal. Não bloqueia a navegação — usuário pode voltar.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que skeleton e não spinner: dá ideia da estrutura final, evita "sobressalto" visual quando o conteúdo carrega, e parece mais rápido perceptualmente (mesmo sendo o mesmo tempo).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Estado "Transação não encontrada"',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Bloco centralizado com texto cinza "Transação não encontrada" + botão "Voltar" outline com seta esquerda. Acionado quando o ID na URL não corresponde a nenhuma transação (link quebrado, ID inválido, ou transação de outra subconta sem permissão).',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que UX simples e direto: erro técnico não pede explicação longa; pede caminho claro de volta. Não há botão "Tentar novamente" porque tentativas adicionais não resolveriam.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 3. PAGEHEADER
  // ===========================================================================
  {
    type: 'section',
    title: 'PageHeader',
    children: [
      {
        type: 'paragraph',
        text:
          '📐 Título: "Detalhes da Transação" (fixo). Breadcrumb: Dashboard › Transações › [primeiros 8 caracteres do transaction_id] — clicando em "Transações" volta para a lista; clicando no último segmento permanece na tela. Lado direito: botão "Voltar" (outline) com ícone ArrowLeft que dispara navigate(createPageUrl("Transactions")).',
      },
      {
        type: 'paragraph',
        text:
          '🎯 Por que mostrar só os 8 primeiros caracteres do ID no breadcrumb: IDs completos são muito longos (UUIDs ou similares). 8 caracteres bastam para reconhecer visualmente sem quebrar o layout do breadcrumb.',
      },
    ],
  },

  // ===========================================================================
  // 4. HEADER CARD (Cartão de Resumo Principal)
  // ===========================================================================
  {
    type: 'section',
    title: 'Header Card (Cartão de Resumo Principal)',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'O que é',
        body:
          'Card grande no topo da página, full-width, dividido em duas regiões: lado esquerdo com identidade da transação (ícone + valor + status + badges) e lado direito com botões de ação contextuais.',
      },
      {
        type: 'description',
        emoji: '🎯',
        title: 'Para que serve',
        body:
          'Resposta de 1 segundo: o usuário precisa saber AGORA — quanto, qual status, e o que pode fazer. Esse card responde tudo isso sem rolagem.',
      },
      {
        type: 'subsection',
        title: 'Bloco de Identidade (esquerda)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Ícone grande quadrado (56×56px) arredondado. Cor de fundo e ícone variam pelo método: CARTÃO → bg azul claro com ícone CreditCard azul; PIX → bg verde-água claro com ícone QrCode teal. Imediatamente identifica o método antes de ler.',
          },
          {
            type: 'paragraph',
            text:
              '📐 À direita do ícone: VALOR em fonte grande bold (text-xl) formatado em BRL ("R$ 1.250,00") + StatusBadge size="lg" ao lado. Status badge usa cores semânticas (verde=aprovado, vermelho=recusado, amarelo=pendente, etc.) — vide componente StatusBadge para mapeamento completo.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Linha abaixo do valor: ID completo da transação em fonte mono pequena cinza + ícone Copy clicável. Clique copia para clipboard.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Linha de badges (mostradas só se aplicáveis): "Antifraude" (com ícone Shield) se houve análise antifraude; "Split" (com ícone Split) se há regras de split; "Recorrente" (ícone Repeat) se faz parte de assinatura. Servem como atalhos visuais para informação rica.',
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que badges em vez de texto: economiza espaço e cria padrão visual. Operador experiente identifica "ah, essa tem split" sem ler.',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Bloco de Ações (direita) — botões contextuais',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'Lógica condicional',
            body:
              'Os botões mostrados dependem do STATUS da transação. Cada status libera um conjunto diferente de ações para evitar erros operacionais.',
          },
          {
            type: 'subsection',
            title: 'Botão "Estornar" / "Devolver" (status=approved)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE FAZ: aciona estorno (cartão) ou devolução (PIX). Texto muda conforme método: "Estornar" para cartão, "Devolver" para PIX (terminologia bancária correta).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: cancelar uma cobrança e devolver o dinheiro ao cliente. Pode ser TOTAL (valor cheio) ou PARCIAL (parte do valor — ex: cobrar só o frete que foi prestado).',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 QUANDO SE USA: cliente desistiu da compra, produto avariado, cobrança duplicada, acordo amigável antes de chargeback.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 UI: outline button com ícone RotateCcw + label dinâmico. Click pré-popula refundAmount com transaction.amount (default = valor cheio) e abre SideDrawer detalhado abaixo.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Botões "Capturar" + "Cancelar" (status=pre_authorized)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE SÃO: aparecem só em transações pré-autorizadas (cartão de crédito com captura postergada). Permitem completar a transação capturando o valor reservado, OU cancelar liberando o limite.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVEM: fluxo padrão de hotelaria, locação de carros, marketplaces — onde a cobrança definitiva só ocorre após confirmar o serviço prestado.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 "Capturar": botão verde primário (bg #00D26A), ícone CreditCard. Confirma a cobrança. 📐 "Cancelar": outline, ícone XCircle. Libera o pré-bloqueio.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Botão "Nota" (sempre)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE FAZ: abre SideDrawer pequeno para registrar uma anotação interna sobre essa transação.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: documentar contexto que não cabe nos campos estruturados. Ex: "Cliente ligou em 26/04 reclamando — orientado a aguardar liquidação", "Caso escalado ao jurídico", "Tentei contato 3x e cliente não respondeu".',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 POR QUE EXISTE: sem isso, a equipe perderia histórico crucial entre operadores. Nota fica visível para qualquer um que abrir essa transação.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 UI: outline button, ícone MessageSquare, label "Nota".',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Botão "Reenviar Webhook" (sempre)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE FAZ: re-dispara o webhook desta transação para o endpoint configurado pelo merchant.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: quando o sistema do merchant deixou de receber/processar o webhook original (ERP estava fora, bug que processou mal). Em vez de pedir ao suporte da PagSmile, o próprio merchant resolve.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 QUANDO SE USA: discrepâncias de conciliação onde a transação existe na PagSmile mas o sistema interno do merchant não tem registro.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 UI: outline, ícone Send. Comportamento esperado: ao clicar, dispara API call, mostra toast "Webhook reenviado" ou "Falha ao reenviar — verifique configuração".',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Botão "Imprimir" (sempre)',
            children: [
              {
                type: 'paragraph',
                text:
                  '🎯 O QUE FAZ: aciona window.print() ou geração de PDF "comprovante" da transação.',
              },
              {
                type: 'paragraph',
                text:
                  '🎯 PARA QUE SERVE: anexar em e-mail ao cliente como comprovante, arquivo físico contábil, evidência impressa para disputa em cartório.',
              },
              {
                type: 'paragraph',
                text:
                  '📐 UI: outline, ícone Printer. CSS @media print suprime sidebar/header e formata a página para impressão A4.',
              },
            ],
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 5. GRID PRINCIPAL — COLUNA ESQUERDA
  // ===========================================================================
  {
    type: 'section',
    title: 'Coluna Esquerda (2/3 da largura) — 3 Cards Empilhados',
    children: [
      {
        type: 'description',
        emoji: '🎯',
        title: 'Estrutura',
        body:
          'A página usa grid 3-colunas. A coluna esquerda (2 de 3) é dedicada a informação rica e detalhada (timeline + dados de pagamento + valores). A coluna direita (1 de 3) carrega informações secundárias do contexto (cliente + códigos + metadata).',
      },

      // ---------------- TIMELINE -----------------
      {
        type: 'subsection',
        title: 'Card "Timeline de Eventos"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Linha do tempo vertical com eventos cronológicos da transação: criação → análise antifraude (se houve) → veredito final (aprovado/recusado/pendente).',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Visualizar a JORNADA da transação. Saber em qual etapa algo deu errado. Ex: se foi recusada NA antifraude (score alto) é diferente de ter sido recusada PELO BANCO emissor (saldo). A timeline mostra exatamente onde travou.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que cronológico (vertical) e não tabela',
            body:
              'Eventos têm relação temporal forte e diferença entre eles importa. Vertical com linha conectando comunica "aconteceu na ordem" sem precisar ler datas. Tabela perderia a noção de fluxo.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: cada evento é um TimelineEvent com: bola colorida (32×32) + ícone branco no centro + linha vertical fina cinza conectando ao próximo (oculta no último). À direita: título bold, descrição cinza, timestamp no formato "DD/MM/YYYY às HH:MM:SS" em locale pt-BR.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Mapeamento de cores das bolas:',
          },
          {
            type: 'list',
            items: [
              'Azul (Clock): "Transação Criada" — sempre presente. Descrição mostra origem ("Via API", "Via Checkout", "Via Link de Pagamento")',
              'Verde (Shield): "Análise Antifraude" se aprovada — mostra score',
              'Amarelo (Shield): "Análise Antifraude" se em revisão',
              'Verde (CheckCircle): "Pagamento Aprovado" — mostra autorização (cartão) ou E2EID (PIX)',
              'Vermelho (XCircle): "Pagamento Recusado" — mostra motivo da recusa',
              'Amarelo (Clock): "Aguardando Pagamento" — para PIX/boleto pendentes',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que mostrar autorização/E2EID na descrição: são identificadores que aparecem em outras conversas (com banco, com adquirente, em chargeback). Tê-los visíveis na timeline acelera diagnóstico.',
          },
        ],
      },

      // ---------------- PAYMENT DETAILS -----------------
      {
        type: 'subsection',
        title: 'Card "Dados do Cartão" / "Dados do Pix"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Card com lista vertical de pares "label : valor" descrevendo os dados técnicos do método de pagamento. Título do card muda conforme método: "Dados do Cartão" ou "Dados do Pix".',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Esses são os dados que aparecem em qualquer disputa, contestação ou suporte ao cliente. Saber a bandeira, BIN, banco emissor, parcelamento, autorização e NSU é REQUISITO para responder a chargeback (Visa CE 3.0, Mastercard chargeback flow).',
          },
          {
            type: 'subsection',
            title: 'Se método = CARTÃO — campos exibidos',
            children: [
              {
                type: 'list',
                items: [
                  '"Bandeira" → Visa / Mastercard / Elo / Amex / Hipercard (em uppercase)',
                  '"BIN" → primeiros 6 dígitos do cartão. COPIÁVEL + fonte mono. Para que serve: identificar o emissor e país do cartão; útil para análises de aprovação por BIN',
                  '"Últimos 4 Dígitos" → 4 últimos. Mono. Para que serve: confirmação ao falar com cliente "...terminado em 1234"',
                  '"Tipo de Cartão" → Crédito / Débito',
                  '"Banco Emissor" → ex: Itaú Unibanco. Inferido pelo BIN. Útil para suporte saber com qual banco o cliente vai discutir',
                  '"País de Emissão" → bandeira do país + nome (🇧🇷 Brasil). Discrimina cartões internacionais (sujeitos a regras de IOF, antifraude diferente)',
                  '"Parcelamento" → "À vista" ou "3x de R$ 333,33". Calculado dividindo o amount pelo número de installments',
                  '"Código de Autorização" → COPIÁVEL + mono. O código que o adquirente retornou aprovando a transação. Crítico em contestação',
                  '"NSU" → COPIÁVEL + mono. Número Sequencial Único. Identificador da transação no adquirente. Aparece nos extratos da bandeira',
                  '"3D Secure" → "✓ Autenticado (ECI 05)" ou "Não aplicado". Se 3DS foi usado, a responsabilidade do chargeback transfere ao banco emissor (liability shift)',
                ],
              },
              {
                type: 'paragraph',
                text:
                  '🎯 Por que tantos campos COPIÁVEIS: investigação de chargeback é literalmente "copia este código, cola naquele formulário". Cada copy-button economiza segundos × milhares de disputas.',
              },
            ],
          },
          {
            type: 'subsection',
            title: 'Se método = PIX — campos exibidos',
            children: [
              {
                type: 'list',
                items: [
                  '"E2EID" → COPIÁVEL + mono. End-to-End ID — identificador único do PIX no SPI/BACEN. Crítico para qualquer rastreio',
                  '"Tipo de Cobrança" → "Cobrança Imediata" ou "Cobrança com Vencimento" (PIX pix Cob/CobV)',
                  '"Chave Pix Recebedora" → COPIÁVEL. Chave do merchant que recebeu',
                  '"Tempo de Pagamento" → tempo entre QR code gerado e pago (ex: "2 min 34 seg"). Indicador de comportamento do cliente',
                  '"Data de Liquidação" → quando o valor caiu efetivamente na conta merchant',
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Layout dos InfoRow: linha horizontal com label cinza à esquerda e valor à direita (alinhado à direita). Se valor é copiável, ícone Copy aparece à direita do valor com tooltip "Copiar". Hover muda cor para 600. Click copia para clipboard.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Separador horizontal (1px cinza claro) entre cada linha (divide-y divide-gray-100). Se valor é null/undefined, exibe "-" cinza claro.',
          },
        ],
      },

      // ---------------- VALUES & FEES -----------------
      {
        type: 'subsection',
        title: 'Card "Valores e Taxas"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Decomposição financeira da transação: do valor bruto que o cliente pagou até o valor líquido que o merchant vai receber, passando pelas taxas aplicadas e a data efetiva de liquidação.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              '(1) TRANSPARÊNCIA — merchant entende exatamente quanto foi cobrado de taxa naquela transação específica; (2) CONCILIAÇÃO — bater valor líquido com o que caiu na conta; (3) DETECÇÃO DE COBRANÇAS INDEVIDAS — se a taxa parecer fora do contrato, há evidência clara para abrir suporte.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que detalhado em vez de só "valor X / valor Y"',
            body:
              'Operações brasileiras têm múltiplas camadas de taxa (MDR, antecipação, intermediadora, IOF em casos internacionais). Esconder isso gera dúvida e tickets de suporte. Mostrar tudo discriminado é boa prática regulatória e de UX.',
          },
          {
            type: 'list',
            items: [
              '"Valor Bruto" → valor total cobrado do cliente (transaction.amount). Sem deduções',
              '"MDR (Taxa de Processamento)" → valor + percentual entre parênteses. Ex: "R$ 43,63 (3,49%)". MDR = Merchant Discount Rate, taxa principal cobrada pela PagSmile',
              '"Taxa de Antecipação" → R$ 0,00 se transação não foi antecipada, ou valor se houve antecipação automática/manual',
              '"VALOR LÍQUIDO" → linha destacada com fundo verde claro. Texto bold. É o valor que o merchant efetivamente recebe. Equivalente a transaction.net_amount',
              '"Data de Liquidação" → quando esse valor líquido cai como disponível para saque. Ex: "D+30 - 26/02/2026" para cartão à vista padrão',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que destacar Valor Líquido com fundo verde: é o número que mais importa para o merchant. Visualmente "saltar" essa linha respeita a hierarquia de informação.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 6. GRID PRINCIPAL — COLUNA DIREITA
  // ===========================================================================
  {
    type: 'section',
    title: 'Coluna Direita (1/3 da largura) — 3 Cards Empilhados',
    children: [
      // ---------------- CUSTOMER INFO -----------------
      {
        type: 'subsection',
        title: 'Card "Dados do Pagador"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Card com dados de identidade e contato do cliente que efetuou a transação: nome, documento, e-mail, telefone, endereço de cobrança.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              '(1) ATENDIMENTO — ter contato direto para resolver dúvidas; (2) ANTIFRAUDE PÓS-FATO — verificar se nome do cartão bate com cliente; (3) CHARGEBACK — endereço de cobrança é evidência crítica em contestação; (4) CRM — saber quem comprou para futuro follow-up.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: header com avatar circular cinza (40×40) + ícone User (placeholder genérico) à esquerda + nome em bold preto e CPF mascarado em pequeno cinza à direita. Separator horizontal abaixo.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Lista vertical de contatos com ícones ao lado: Mail (e-mail), Phone (telefone), MapPin (endereço — múltiplas linhas com rua, número, bairro, cidade, estado, CEP). Texto cinza médio.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Botão "Ver Perfil do Cliente" outline tamanho sm com ícone ExternalLink — leva para CustomerDetail filtrado por esse cliente. Para que serve: aprofundar no histórico de compras, scoring, segmento.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'CPF mascarado',
            body:
              'Por padrão CPF é exibido como "***.***.***-**" para proteção de dados (LGPD). Ação para revelar pode estar reservada a perfis com permissão. Versão atual mostra mascarado se transaction.customer_document não estiver disponível.',
          },
        ],
      },

      // ---------------- REFERENCE CODES -----------------
      {
        type: 'subsection',
        title: 'Card "Códigos de Referência"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Card com IDs e códigos de rastreio em diferentes sistemas — TODOS copiáveis em fonte mono.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Permitir cruzamento da transação em qualquer sistema externo: sistema interno do merchant (merchant_order_id), backoffice da bandeira/adquirente (TID, ARN), suporte da PagSmile (transaction_id).',
          },
          {
            type: 'list',
            items: [
              '"ID PagSmile" → identificador único interno. É o transaction.transaction_id mostrado no header também. Copiável',
              '"ID Pedido Merchant" → o ID do pedido no sistema do próprio merchant (ERP, e-commerce). Vem de transaction.merchant_order_id ou metadata. Copiável. Crítico para conciliação',
              '"TID" (só CARTÃO) → Transaction ID do adquirente. 19 dígitos. Copiável',
              '"ARN" (só CARTÃO) → Acquirer Reference Number. 23 dígitos. Identificador único na rede da bandeira. Aparece em chargebacks e disputes',
            ],
          },
          {
            type: 'paragraph',
            text:
              '🎯 Por que separados em card próprio: agregar todos os "rastros" da transação em um lugar facilita debug. Quem investiga sabe que "tudo que é ID está aqui".',
          },
        ],
      },

      // ---------------- METADATA -----------------
      {
        type: 'subsection',
        title: 'Card "Metadata" (condicional)',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Card que SÓ aparece se a transação tiver metadata customizada (transaction.metadata). Mostra o JSON formatado em bloco de código.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Metadata é o "campo livre" onde o merchant guarda informações de negócio próprias na hora de criar a transação: ID de campanha, código de cupom, flag A/B, ID de afiliado, etc. Mostrar aqui permite ver na prática o que foi enviado.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que é condicional',
            body:
              'Maioria das transações não tem metadata. Mostrar card vazio com "{}" polui a interface. Só aparece quando existe valor.',
          },
          {
            type: 'paragraph',
            text:
              '📐 UI: header "Metadata", body com <pre> em fonte monospace pequena (text-xs), fundo cinza claro (bg-gray-50), padding 12px, border-radius lg, max-height 160px com scroll vertical se passar. JSON.stringify com indentação de 2 espaços.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 7. SIDE DRAWER — ESTORNO / DEVOLUÇÃO
  // ===========================================================================
  {
    type: 'section',
    title: 'Side Drawer — "Estornar Transação" / "Devolver Pix"',
    children: [
      {
        type: 'modal',
        title: 'SideDrawer "Estornar Transação" / "Devolver Pix"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Painel deslizante (vindo da direita) que coleta os dados necessários para executar uma operação destrutiva (devolver dinheiro ao cliente). Título e textos adaptam-se ao método: "Estornar Transação" para cartão, "Devolver Pix" para PIX.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Confirmar com o operador (1) o VALOR a estornar/devolver — pode ser parcial; (2) o MOTIVO — obrigatório no caso PIX por exigência regulatória, opcional no cartão; (3) gerar registro auditável da ação.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que SideDrawer e não modal',
            body:
              'Permite ao operador VER os detalhes da transação ao fundo enquanto preenche, principalmente o valor original — evita erros de digitação. Modal cobriria essa informação.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Header do drawer: ícone RotateCcw em fundo vermelho claro (bg-red-100, text-red-600) — vermelho sinaliza "ação destrutiva, atenção". Título dinâmico + subtítulo explicativo ("Solicitar devolução do valor ao pagador" / "Estornar o valor ao cliente").',
          },
          {
            type: 'paragraph',
            text:
              '📐 Conteúdo (space-y-4):',
          },
          {
            type: 'list',
            items: [
              'Campo "Valor a estornar/devolver": Input numérico, pré-preenchido com transaction.amount (valor cheio). O operador pode reduzir para parcial. Texto auxiliar abaixo: "Máximo: R$ X,XX" formatado em BRL — evita digitar valor maior que o original',
              'Campo "Motivo": Textarea livre. Label tem asterisco vermelho * apenas se for PIX (obrigatório). Placeholder "Descreva o motivo..." — incentiva preencher mesmo quando opcional, para registro interno',
            ],
          },
          {
            type: 'paragraph',
            text:
              '📐 Footer do drawer (sticky): botão "Cancelar" outline à esquerda + botão "Confirmar Devolução"/"Confirmar Estorno" verde primário (#00D26A) à direita. Confirmar dispara handleRefund() que (no código atual) só faz console.log e fecha. Versão final invocará função backend transactions/refundTransaction.',
          },
          {
            type: 'callout',
            variant: 'warning',
            title: 'Sem dupla confirmação',
            body:
              'O design atual não tem step de confirmação adicional ("Tem certeza?"). A justificativa é que o drawer já é um passo deliberado — abrir, preencher e confirmar são 3 ações. Adicionar 4ª seria fricção desnecessária. Em casos de valores acima de threshold pode-se adicionar confirmação extra (não implementado ainda).',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 8. SIDE DRAWER — NOTA INTERNA
  // ===========================================================================
  {
    type: 'section',
    title: 'Side Drawer — "Adicionar Nota"',
    children: [
      {
        type: 'modal',
        title: 'SideDrawer "Adicionar Nota"',
        children: [
          {
            type: 'description',
            emoji: '🎯',
            title: 'O que é',
            body:
              'Painel deslizante PEQUENO (size="sm") para registrar uma anotação livre sobre a transação.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Para que serve',
            body:
              'Documentar contexto não estruturado — conversas com cliente, decisões internas, instruções para outros operadores. Notas ficam vinculadas à transação e visíveis para qualquer membro do time.',
          },
          {
            type: 'description',
            emoji: '🎯',
            title: 'Por que size="sm"',
            body:
              'Nota é input simples (só textarea). Não precisa de drawer largo. SM ocupa menos da tela e respeita o "peso" da ação.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Header: ícone MessageSquare + título "Adicionar Nota" + subtítulo "Inserir uma nota interna sobre esta transação".',
          },
          {
            type: 'paragraph',
            text:
              '📐 Conteúdo: Textarea único de 6 linhas (rows=6) com placeholder "Digite sua nota...". Sem outros campos.',
          },
          {
            type: 'paragraph',
            text:
              '📐 Footer: "Cancelar" + "Salvar Nota" verde primário. Salvar dispara handleAddNote — versão final salvaria a nota como entrada em transaction.timeline ou em uma sub-coleção de notas associada.',
          },
        ],
      },
    ],
  },

  // ===========================================================================
  // 9. ESTADOS, RESPONSIVIDADE E ACESSIBILIDADE
  // ===========================================================================
  {
    type: 'section',
    title: 'Estados Adicionais, Responsividade e Acessibilidade',
    children: [
      {
        type: 'subsection',
        title: 'Responsividade',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Mobile (<768px): Header card vira coluna única (ícone+valor em cima, botões empilhados embaixo). Grid principal vira coluna única — primeiro a coluna esquerda inteira, depois a coluna direita. Drawers ocupam 100% da largura no mobile (em desktop ocupam ~640px).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Acessibilidade',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 Botões de copy têm Tooltip "Copiar" via Radix UI (acessível por teclado e leitor de tela). Cores de status sempre acompanham ícone (não dependem só de cor, atendendo WCAG). InfoRow renderiza "-" para valores ausentes em vez de string vazia (leitor de tela anuncia "menos" em vez de pular).',
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Estados especiais por status da transação',
        children: [
          {
            type: 'list',
            items: [
              'STATUS=approved: mostra todas as ações + dados completos + valor líquido em verde no card de Valores',
              'STATUS=refused/declined: NÃO mostra botão de estornar. Card "Valores e Taxas" mostra valores zerados na linha de Valor Líquido (não houve liquidação). Timeline destaca a recusa em vermelho com motivo',
              'STATUS=pending: NÃO mostra estornar (não há o que estornar ainda). Mostra ações de captura/cancelamento se for pré-autorização. Para PIX/boleto pendente, destaca QR Code/linha digitável com botão de "Reenviar para cliente"',
              'STATUS=pre_authorized: mostra Capturar (verde) + Cancelar (outline) em destaque. Outros botões disponíveis também',
              'STATUS=refunded: mostra valor estornado em vermelho. Botão de estorno fica desabilitado ("Já estornado")',
              'STATUS=chargeback: badge "Em Chargeback" no header card. Card extra de "Disputa Associada" com link para contestação',
            ],
          },
        ],
      },
      {
        type: 'subsection',
        title: 'Modo de Impressão (@media print)',
        children: [
          {
            type: 'paragraph',
            text:
              '📐 CSS print remove sidebar, header global, botões de ação e ícones de copy. Mantém apenas: cabeçalho minimalista com nome do merchant + dados completos da transação organizados em layout A4. Footer da página com timestamp da impressão e URL para voltar.',
          },
        ],
      },
    ],
  },
];