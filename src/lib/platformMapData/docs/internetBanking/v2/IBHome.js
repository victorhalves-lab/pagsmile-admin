import { createPageDoc } from '../../../schema';

export const IBHomeDoc = createPageDoc({
  pageId: 'IBHome',
  pageName: 'Internet Banking — Home',
  route: '/IBHome',
  module: 'Internet Banking',
  section: 'Home',

  purpose:
    'Tela inicial do módulo de Conta Digital (Internet Banking). É a "home" bancária do merchant: mostra saldo disponível, atalhos rápidos para PIX, resumo do mês (entradas vs saídas) e últimas movimentações. Visualmente diferenciada das telas de Admin Sub — fundo escuro azul-marinho gradient para evocar interface de banco.',

  userContext:
    'Merchant entrando no contexto bancário da conta. Quer rapidamente: ver quanto tem disponível, fazer um PIX urgente, conferir últimas movimentações. Esta é a tela mais frequente do módulo IB — desenhada para 90% das visitas serem resolvidas aqui sem ter que clicar em mais nada.',

  structure: [
    {
      type: 'header',
      name: 'Greeting Header',
      description:
        'Cabeçalho personalizado de boas-vindas. Ícone Sparkles verde + cumprimento dinâmico (Bom dia / Boa tarde / Boa noite) baseado na hora.',
      items: [
        {
          name: 'Saudação dinâmica',
          description: 'Texto verde pequeno com ícone Sparkles (ex: "Bom dia").',
        },
        {
          name: 'Título "Sua Conta Digital"',
          description: 'H1 grande em branco/dark.',
        },
        {
          name: 'Última atualização',
          description: 'Texto cinza pequeno com ícone Clock + "Última atualização: agora mesmo".',
        },
        {
          name: 'Badge "Conta Ativa"',
          description: 'Badge verde gradient no canto direito com ícone CircleDollarSign.',
        },
      ],
    },
    {
      type: 'card',
      name: 'Main Balance Card (HERO)',
      description:
        'Card principal grande com fundo gradient azul-marinho escuro (#002443 → #003459 → #004D73), efeitos de blur radial verde e azul. É o elemento de maior destaque visual da página.',
      items: [
        {
          type: 'section',
          name: 'Bloco do Saldo Disponível',
          description: 'Lado esquerdo do card.',
          items: [
            'Ícone wallet em quadrado verde gradient com glow',
            'Label "SALDO DISPONÍVEL" (uppercase, cinza claro)',
            'Botão de toggle Eye/EyeOff para mostrar/esconder valor',
            'Valor grande em fonte black 4xl branca (ex: R$ 125.430,50)',
            'Quando escondido, mostra "••••••"',
          ],
        },
        {
          type: 'section',
          name: 'Sub-saldos (Bloqueado e Total)',
          description: 'Linha horizontal abaixo do principal, separada por borda sutil.',
          items: [
            'Saldo Bloqueado: ícone Lock em quadrado amarelo + valor em texto âmbar',
            'Divisor vertical cinza',
            'Saldo Total: ícone Banknote + valor (disponível + bloqueado)',
          ],
        },
        {
          type: 'section',
          name: 'Quick Actions Inline (Lado Direito)',
          description: 'Mostrado dentro do mesmo card. 3 botões grandes lado a lado.',
          items: [
            {
              name: 'Botão "Enviar PIX"',
              description: 'Quadrado branco translúcido com ícone Send em gradient verde. Leva para /IBPixSend.',
            },
            {
              name: 'Botão "Receber PIX"',
              description: 'Quadrado branco translúcido com ícone QrCode em gradient azul. Leva para /IBPixReceive.',
            },
            {
              name: 'Botão "Minhas Chaves"',
              description: 'Quadrado branco translúcido com ícone Key em gradient violeta. Leva para /IBPixKeys.',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      name: 'Resumo do Mês',
      description: 'Seção com header "Resumo do Mês" + grid de 2 cards (entradas e saídas).',
      items: [
        {
          name: 'Header da seção',
          description: 'Título com ícone Calendar verde + Badge outline com mês/ano corrente (ex: "Janeiro 2026").',
        },
        {
          type: 'card',
          name: 'Card "Entradas"',
          description:
            'Card verde com gradient suave, glow circular no canto. Borda verde-2.',
          items: [
            'Ícone ArrowDownLeft em quadrado gradient verde com glow',
            'Label "ENTRADAS" + sub-label "Total recebido"',
            'Indicador de variação % (chip verde com TrendingUp)',
            'Valor grande em verde escuro (ex: R$ 250.000,00)',
            'Barra de progresso (representa visualmente o volume)',
          ],
        },
        {
          type: 'card',
          name: 'Card "Saídas"',
          description: 'Mesmo padrão visual mas em vermelho/rosa.',
          items: [
            'Ícone ArrowUpRight em gradient vermelho',
            'Label "SAÍDAS" + sub-label "Total enviado"',
            'Indicador de variação % (chip vermelho)',
            'Valor grande em vermelho escuro',
            'Barra de progresso vermelha (% relativa às entradas)',
          ],
        },
      ],
    },
    {
      type: 'card',
      name: 'Card "Últimas Movimentações"',
      description: 'Card grande com lista das últimas transações.',
      items: [
        {
          type: 'section',
          name: 'Header do Card',
          description: 'Background gradient sutil. Lado esquerdo: ícone Banknote em quadrado verde + título "Últimas Movimentações". Lado direito: botão outline "Ver Extrato" verde com seta.',
        },
        {
          type: 'list',
          name: 'Lista de Transações Recentes',
          description: 'Até 5 transações divididas por divider cinza horizontal.',
          items: [
            {
              name: 'Linha de Transação',
              description: 'Layout: avatar circular colorido (verde para entrada / vermelho para saída) com seta + bloco central com tipo (PIX recebido / PIX enviado), descrição (nome do remetente/destinatário), badge de categoria e data → valor à direita em verde (+) ou vermelho (-).',
            },
          ],
        },
      ],
    },
  ],

  actions: [
    {
      name: 'Mostrar/esconder saldo',
      flow:
        'Clica no botão Eye/EyeOff ao lado do label "Saldo Disponível" → valor é substituído por "••••••" e vice-versa. Estado preservado durante a sessão.',
    },
    {
      name: 'Enviar PIX (atalho do hero)',
      flow: 'Clica no botão "Enviar PIX" dentro do Balance Card → navega para /IBPixSend.',
    },
    {
      name: 'Receber PIX (atalho do hero)',
      flow: 'Clica no botão "Receber PIX" → navega para /IBPixReceive (gera QR Code).',
    },
    {
      name: 'Acessar gestão de chaves PIX',
      flow: 'Clica em "Minhas Chaves" → navega para /IBPixKeys.',
    },
    {
      name: 'Ver extrato completo',
      flow: 'Clica em "Ver Extrato" no card de últimas movimentações → navega para /IBExtract.',
    },
    {
      name: 'Drill-down em movimentação',
      flow:
        'Clica numa linha da lista de últimas movimentações → abre /IBProofs ou drawer com comprovante detalhado da transação específica.',
    },
  ],

  states: [
    {
      name: 'Saldo visível (default)',
      description: 'Todos os valores mostrados normalmente.',
    },
    {
      name: 'Saldo escondido',
      description: 'Valores trocados por "••••••" (privacidade — útil em telas compartilhadas).',
    },
    {
      name: 'Loading inicial',
      description: 'Skeleton dos cards. O Balance Card permanece visível com placeholder, dando "peso visual".',
    },
    {
      name: 'Sem movimentações',
      description: 'Card de últimas movimentações mostra empty state interno: ilustração simples + texto "Você ainda não tem movimentações" + CTA "Faça seu primeiro PIX".',
    },
    {
      name: 'Conta bloqueada',
      description:
        'Badge "Conta Ativa" muda para vermelho "Conta Bloqueada". Botões de ação ficam desabilitados com tooltip explicativo.',
    },
  ],

  navigation: [
    { to: '/IBPixSend', via: 'Botão "Enviar PIX" do Balance Card' },
    { to: '/IBPixReceive', via: 'Botão "Receber PIX" do Balance Card' },
    { to: '/IBPixKeys', via: 'Botão "Minhas Chaves" do Balance Card' },
    { to: '/IBExtract', via: 'Botão "Ver Extrato" do card de movimentações' },
    { to: '/IBProofs', via: 'Click em linha de movimentação para ver comprovante' },
  ],

  dataSources: [
    {
      entity: 'Subaccount',
      type: 'Read (current user)',
      description: 'Fornece todos os saldos e status da conta.',
      fields: ['balance_available', 'balance_blocked', 'balance_pending_release', 'status'],
    },
    {
      entity: 'FinancialEntry',
      type: 'List filtrado por mês corrente',
      description: 'Calcula entradas e saídas do mês para o "Resumo do Mês".',
      fields: ['type', 'category', 'amount', 'created_date'],
    },
    {
      entity: 'Transaction (filtrada por método=PIX)',
      type: 'List ordenada desc, limit 5',
      description: 'Para popular últimas movimentações.',
      fields: ['amount', 'pix.payer_name', 'pix.pix_transaction_type', 'created_date'],
    },
  ],

  notes:
    'Estética é central — esta tela define a identidade visual do módulo IB inteiro. Background gradient, glows blur radial e tipografia black/4xl são as marcas. NUNCA simplificar para parecer com Admin Sub. O componente Quick Actions inline dentro do Balance Card é importante: economiza um scroll para 80% dos casos de uso. Os dados são primariamente mockados no MVP — produção virá de FinancialEntry agregado pelo backend.',
});

export default IBHomeDoc;