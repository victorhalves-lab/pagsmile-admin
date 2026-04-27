import { createPageDoc } from '../../schema';

export const LandingPageDoc = createPageDoc({
  pageId: 'LandingPage',
  pageName: 'Landing Page (Tela Inicial)',
  route: '/',
  module: 'Onboarding & Criação de Conta',

  purpose:
    'Primeira tela pública da plataforma — porta de entrada para qualquer pessoa, autenticada ou não. É o gateway entre 4 caminhos diferentes: entrar como usuário existente, criar uma nova conta, solicitar uma proposta comercial sob medida, ou explorar o mapa da plataforma.',

  userContext:
    'Qualquer visitante que chega à URL raiz da plataforma. Pode ser um cliente existente querendo logar, alguém que recebeu indicação para criar conta, um lead enviado pelo time comercial para preencher proposta customizada, ou um membro interno consultando documentação.',

  structure: [
    {
      type: 'header',
      name: 'Background visual de fundo',
      description:
        'Fundo gradient escuro navy com efeitos de luz ambiente. Não é um header funcional — é a estética visual que cobre toda a tela.',
      items: [
        'Gradient navy de canto-superior-esquerdo até canto-inferior-direito (#002443 → #003459 → #002443)',
        'Vinheta superior com gradiente radial simulando iluminação vinda de cima',
        'Dois círculos desfocados grandes (verde-água #2bc196 com 10% de opacidade) posicionados nos cantos diagonais — criam profundidade ambiental',
      ],
    },
    {
      type: 'topbar',
      name: 'Seletor de Idioma',
      description:
        'Posicionado absoluto no canto superior direito da tela. Permite trocar o idioma da interface antes de qualquer ação.',
      layout: 'absolute top-6 right-6',
      items: [
        {
          name: 'Dropdown de idioma',
          description: 'Variante visual escura para contrastar com o fundo navy da landing',
        },
      ],
    },
    {
      type: 'section',
      name: 'Bloco Central de Conteúdo',
      description:
        'Conteúdo principal centralizado vertical e horizontalmente na tela. Composto pelo logo + 4 botões de ação + footer com copyright.',
      layout: 'flex-col centralizado max-w-md',
      items: [
        {
          type: 'card',
          name: 'Logo PagSmile',
          description:
            'Logo grande em versão escura (sempre, mesmo que o sistema esteja em modo claro). Tem efeito hover que aumenta levemente (scale 1.05) ao passar o mouse.',
          items: [
            'Altura fixa de 96px no desktop',
            'Drop-shadow forte para destacar do fundo',
            'Animação de hover de 500ms',
          ],
        },
        {
          type: 'list',
          name: 'Lista de 4 Botões de Ação',
          description:
            'Botões empilhados verticalmente com hierarquia visual decrescente — o mais visualmente destacado é o primeiro (Login).',
          items: [
            {
              name: 'Botão 1 — Entrar (Login)',
              description:
                'Botão primário verde da marca (#2bc196) — visualmente mais destacado de todos. Tem sombra colorida e animação de elevação no hover. Ao clicar: simula login direto e leva para /Dashboard.',
            },
            {
              name: 'Botão 2 — Criar Conta',
              description:
                'Botão outline (borda + fundo transparente) com texto cinza claro. Visualmente secundário ao Login. Leva para /AccountCreationStep1.',
            },
            {
              name: 'Botão 3 — Solicitar Proposta sob Medida',
              description:
                'Link estilizado como botão, com borda verde-água suave. Visualmente menor que os 2 anteriores (sinaliza fluxo alternativo). Abre LINK EXTERNO para questionário público de proposta customizada (clientes Enterprise).',
            },
            {
              name: 'Botão 4 — Mapa da Plataforma',
              description:
                'Link com borda cinza e emoji 🗺️. Visualmente o menos destacado dos 4. Leva para /PlatformMap (esta documentação que você está lendo).',
            },
          ],
        },
        {
          type: 'section',
          name: 'Footer com Copyright',
          description:
            'Texto pequeno cinza no rodapé do bloco central, com ano dinâmico calculado em runtime.',
          items: ['© 2026 PagSmile. Todos os direitos reservados.'],
        },
      ],
    },
  ],

  actions: [
    {
      name: 'Entrar na plataforma (Login)',
      flow:
        'Clica no botão "Entrar" → sistema limpa flag de alerta de compliance no localStorage → navega imediatamente para o Dashboard.',
      outcome: 'Usuário entra na plataforma autenticado',
    },
    {
      name: 'Iniciar criação de nova conta',
      flow:
        'Clica em "Criar Conta" → navega para /AccountCreationStep1 (primeiro passo do wizard de 3 etapas).',
      outcome: 'Inicia funil de cadastro self-service',
    },
    {
      name: 'Solicitar proposta sob medida',
      flow:
        'Clica em "Solicitar Proposta" → abre nova aba com questionário público externo da PagSmile para clientes Enterprise.',
      outcome: 'Lead entra no funil comercial manual',
    },
    {
      name: 'Explorar mapa da plataforma',
      flow: 'Clica em "Mapa da Plataforma" → navega para /PlatformMap (documentação interna).',
      outcome: 'Usuário acessa documentação visual de todas as páginas',
    },
    {
      name: 'Trocar idioma da interface',
      flow:
        'Clica no seletor de idioma no canto superior direito → escolhe idioma (PT-BR, EN, ZH) → toda a interface é re-renderizada no novo idioma.',
    },
  ],

  states: [
    {
      name: 'Estado padrão',
      description:
        'A landing tem apenas um estado visual — sempre mostra os 4 botões e o logo. Não tem loading, não tem erro, não tem variantes condicionais.',
    },
  ],

  navigation: [
    { to: '/Dashboard', via: 'Botão "Entrar"' },
    { to: '/AccountCreationStep1', via: 'Botão "Criar Conta"' },
    { to: '/PlatformMap', via: 'Botão "Mapa da Plataforma"' },
    {
      to: 'EXTERNO: pagsmileonboarding.base44.app',
      via: 'Botão "Solicitar Proposta sob Medida"',
    },
  ],

  dataSources: [
    {
      entity: 'Nenhuma',
      description:
        'A landing não consome dados de nenhuma entidade do banco. É 100% estática — apenas botões de navegação.',
    },
  ],

  notes:
    'Esta é a única tela do sistema que NÃO usa o Layout principal (não tem sidebar nem header da plataforma). Está registrada em "noLayoutPages" no Layout.jsx. O fundo escuro com efeitos de luz é exclusivo desta tela e não se repete em nenhuma outra.',
});

export default LandingPageDoc;