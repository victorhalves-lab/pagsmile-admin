import { createPageDoc } from '../../../schema';

export const TransactionDetailDoc = createPageDoc({
  pageId: 'TransactionDetail',
  pageName: 'Detalhe da Transação',
  route: '/TransactionDetail/:id',
  module: 'Admin Sub — Portal do Merchant',
  section: 'Transações',

  purpose:
    'Visão 360º de uma única transação. Mostra TODAS as informações disponíveis: dados do pagamento, cliente, cartão/PIX, antifraude, 3DS, adquirente, timeline de eventos, splits aplicados, itens da venda. É a tela onde o merchant investiga problemas, faz estornos manuais e reúne evidências para disputas.',

  userContext:
    'Merchant fazendo investigação de uma transação específica. Geralmente vem de um link no Dashboard, lista de Transações, alerta de chargeback, ou ticket de suporte do cliente final. Pode ser financeiro (conferindo valor real), operacional (investigando recusa) ou compliance (analisando padrão suspeito).',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho da Transação',
      description: 'Topo grudento com identificação rápida.',
      items: [
        { name: 'Botão Voltar', description: 'Ícone ArrowLeft + texto "Voltar para Transações".' },
        {
          name: 'ID da Transação',
          description: 'H1 com ID + botão de copiar ao lado. Texto monospace.',
        },
        {
          name: 'Badge de Status',
          description:
            'Badge grande colorido (verde=aprovada, vermelho=recusada, amarelo=pendente, etc.). Estados visuais distintos para cada status.',
        },
        {
          name: 'Valor Principal',
          description: 'Valor da transação em fonte 3xl bold ao lado do badge.',
        },
        {
          type: 'section',
          name: 'Botões de Ação Contextuais',
          description: 'Aparecem condicionalmente conforme status.',
          items: [
            'Botão "Estornar" (se aprovada) — abre modal',
            'Botão "Capturar" (se autorizada mas não capturada)',
            'Botão "Cancelar" (se pendente)',
            'Botão "Ver Comprovante" (se aprovada) — abre PDF',
            'Menu 3 pontos: "Reportar Fraude", "Adicionar Tag", "Exportar JSON"',
          ],
        },
      ],
    },
    {
      type: 'tabs',
      name: 'Tabs de Detalhamento',
      description: 'Sistema de abas para organizar informações volumosas.',
      items: [
        {
          type: 'tab',
          name: 'Aba "Visão Geral" (default)',
          description: 'Cards principais com informações resumidas.',
          items: [
            {
              type: 'card',
              name: 'Card "Dados do Pagamento"',
              description: 'Lista label/valor: ID, valor bruto, taxa, valor líquido, MDR, parcelas, método, captura type, moeda, data criação, data atualização.',
            },
            {
              type: 'card',
              name: 'Card "Cliente"',
              description: 'Nome, e-mail, documento, telefone, IP, device_id. Avatar circular gerado.',
            },
            {
              type: 'card',
              name: 'Card "Método de Pagamento" (Cartão)',
              description:
                'Se transaction.method=card: Bandeira (logo), 6 primeiros + 4 últimos dígitos mascarados, nome do portador, validade, banco emissor, país.',
            },
            {
              type: 'card',
              name: 'Card "Método de Pagamento" (PIX)',
              description:
                'Se transaction.method=pix: End-to-End ID, TXID, status do QR, data de expiração, dados do pagador (nome, documento, banco).',
            },
          ],
        },
        {
          type: 'tab',
          name: 'Aba "Antifraude"',
          description: 'Detalhes da análise antifraude.',
          items: [
            'Score de risco (gauge visual 0-100)',
            'Recomendação (Aprovar/Revisar/Recusar)',
            'Provedor antifraude',
            'ID da análise no antifraude',
            'Lista de regras disparadas (se aplicável)',
            'Botão "Ver na ferramenta antifraude" (link externo)',
          ],
        },
        {
          type: 'tab',
          name: 'Aba "3DS"',
          description: 'Dados de autenticação 3DS (se aplicável).',
          items: [
            'Status: Authenticated / Attempt / Not Authenticated',
            'Versão (3DS 1.0 ou 2.0)',
            'ECI (Electronic Commerce Indicator)',
            'CAVV (Cardholder Authentication Verification Value)',
            'XID',
            'Liability shift (se sim/não)',
          ],
        },
        {
          type: 'tab',
          name: 'Aba "Adquirente"',
          description: 'Dados do adquirente que processou.',
          items: [
            'Nome do adquirente',
            'NSU',
            'TID',
            'Authorization code',
            'ARN (Acquirer Reference Number)',
            'Return code + return message',
          ],
        },
        {
          type: 'tab',
          name: 'Aba "Timeline"',
          description:
            'Linha do tempo vertical com TODOS os eventos: criação → autorização → captura → liquidação → eventuais estornos/chargebacks. Cada evento tem ícone, status, descrição e timestamp.',
        },
        {
          type: 'tab',
          name: 'Aba "Splits"',
          description: 'Se a transação teve split: tabela com cada destinatário, valor recebido, %, se está liable e se cobra taxa.',
        },
        {
          type: 'tab',
          name: 'Aba "Itens"',
          description: 'Se transaction.items existir: tabela de produtos/serviços com nome, descrição, quantidade, preço unitário, categoria.',
        },
      ],
    },
    {
      type: 'modal',
      name: 'Modal de Estorno',
      description: 'Aberto pelo botão "Estornar" no header.',
      items: [
        'Título "Estornar Transação"',
        'Aviso amarelo informativo',
        'Radio: "Estorno Total" / "Estorno Parcial"',
        'Campo de valor (se parcial)',
        'Campo de motivo (textarea opcional)',
        'Botões: "Cancelar" / "Confirmar Estorno"',
      ],
    },
  ],

  actions: [
    { name: 'Copiar ID', flow: 'Click no ícone de copy ao lado do ID → toast "Copiado!".' },
    { name: 'Voltar para lista', flow: 'Botão "Voltar para Transações" → /Transactions com filtros preservados.' },
    {
      name: 'Estornar transação',
      flow:
        'Click "Estornar" → modal → escolhe total/parcial → confirma → API de estorno → status muda → timeline atualizada com novo evento.',
    },
    { name: 'Capturar transação autorizada', flow: 'Click "Capturar" → confirma → status passa de authorized para approved.' },
    { name: 'Reportar fraude', flow: 'Menu 3 dots → "Reportar Fraude" → modal de detalhes → cria flag no antifraude.' },
    { name: 'Trocar aba', flow: 'Click numa aba → conteúdo troca instantaneamente.' },
    { name: 'Exportar JSON completo', flow: 'Menu 3 dots → "Exportar JSON" → download de arquivo .json com todos os dados.' },
  ],

  states: [
    { name: 'Loading', description: 'Skeleton em todas as cards e tabs.' },
    { name: 'Transação não encontrada', description: 'EmptyState com 404 e botão de voltar.' },
    { name: 'Transação aprovada', description: 'Badge verde, botão "Estornar" disponível, comprovante baixável.' },
    { name: 'Transação recusada', description: 'Badge vermelho, motivo destacado, sem ações de pagamento.' },
    { name: 'Transação estornada', description: 'Badge laranja "Estornada", timeline mostra evento de estorno.' },
    { name: 'Em chargeback', description: 'Badge vermelho escuro "Chargeback", banner alertando + link para /Chargebacks/:id.' },
  ],

  navigation: [
    { to: '/Transactions', via: 'Botão "Voltar"' },
    { to: '/Chargebacks/:id', via: 'Banner se transação está em chargeback' },
    { to: '/CustomerDetail/:id', via: 'Click no nome do cliente no card "Cliente"' },
  ],

  dataSources: [
    {
      entity: 'Transaction',
      type: 'Read by id',
      description: 'Fonte completa.',
      fields: 'TODOS os campos da entity (incluindo objetos aninhados card, pix, antifraud_data, three_ds_data, acquirer_data, timeline, split_rules, items)',
    },
    { entity: 'Customer', type: 'Read (lookup)', description: 'Para enriquecer aba Cliente.' },
    { entity: 'Dispute', type: 'Filter by transaction_id', description: 'Para detectar e exibir banner de chargeback.' },
  ],

  notes:
    'Página densa em informação — usar tabs para não sobrecarregar visualmente. O JSON exportado deve ser pretty-printed para ser útil em debugging. Considerar adicionar uma view de "developer" mostrando o request/response cru das APIs envolvidas (futuro).',
});

export default TransactionDetailDoc;