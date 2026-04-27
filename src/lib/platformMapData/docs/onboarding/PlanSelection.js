import { createPageDoc } from '../../schema';

export const PlanSelectionDoc = createPageDoc({
  pageId: 'PlanSelection',
  pageName: 'Criar Conta — Passo 2 (Escolha de Plano)',
  route: '/PlanSelection',
  module: 'Onboarding & Criação de Conta',

  purpose:
    'Segunda etapa do wizard de criação de conta. Apresenta os 4 planos comerciais disponíveis (Starter, Growth, Pro e Instant D+1) com suas taxas detalhadas (MDR para 1x, 2-6x, 7-12x, taxa de PIX, prazo e taxa de antecipação) e exige que o usuário escolha um antes de prosseguir.',

  userContext:
    'Usuário que acabou de validar identidade no Passo 1. Precisa decidir sob quais condições comerciais quer operar: planos mais baratos têm liquidação mais lenta (D+30), planos mais caros têm liquidação mais rápida (D+1). A escolha aqui compromete o usuário com uma estrutura de custos específica antes mesmo de fornecer dados da empresa.',

  structure: [
    {
      type: 'topbar',
      name: 'Seletor de Idioma',
      description: 'Canto superior direito da tela, padrão do funil.',
    },
    {
      type: 'header',
      name: 'Cabeçalho da Página',
      description: 'Centralizado horizontalmente, com logo + título + barra de progresso.',
      items: [
        {
          name: 'Logo PagSmile clicável',
          description: 'Volta para Landing ao clicar.',
        },
        {
          name: 'Título "Escolha seu Plano"',
          description: 'Texto grande extrabold + subtítulo "Etapa 2 de 3".',
        },
        {
          name: 'Barra de Progresso (3 dots)',
          description: 'Etapa 1 já completa (verde sólido), Etapa 2 atual (glow neon), Etapa 3 apagada.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Grade de Planos',
      description:
        'Grid responsivo com os 4 planos lado a lado (4 colunas no desktop, 2 no tablet, 1 no mobile).',
      layout: 'grid 1/2/4 colunas',
      items: [
        {
          type: 'card',
          name: 'Plano Starter',
          description:
            'Plano mais básico — D+30. Posicionamento "para quem está começando".',
          items: [
            'MDR à vista: 3.99%',
            'MDR 2-6x: 4.49%',
            'MDR 7-12x: 5.49%',
            'Taxa PIX: 0.79%',
            'Prazo de antecipação: D+30',
            'Taxa fixa por antecipação: R$ 0,20',
            'Taxa de antecipação: 1.99%',
          ],
        },
        {
          type: 'card',
          name: 'Plano Growth (Mais Popular)',
          description:
            'Plano com badge "Mais Popular" — D+15. Posicionamento "para negócios em expansão".',
          items: [
            'MDR à vista: 4.09%',
            'MDR 2-6x: 4.69%',
            'MDR 7-12x: 5.49%',
            'Taxa PIX: 0.79%',
            'Prazo de antecipação: D+15',
            'Taxa fixa por antecipação: R$ 0,20',
            'Taxa de antecipação: 2.39%',
            'Badge "Popular" destaque visual',
          ],
        },
        {
          type: 'card',
          name: 'Plano Pro',
          description: 'Plano completo — D+7.',
          items: [
            'MDR à vista: 3.99%',
            'MDR 2-6x: 4.49%',
            'MDR 7-12x: 5.49%',
            'Taxa PIX: 0.79%',
            'Prazo de antecipação: D+7',
            'Taxa fixa por antecipação: R$ 0,20',
            'Taxa de antecipação: 2.59%',
          ],
        },
        {
          type: 'card',
          name: 'Plano Instant (D+1)',
          description:
            'Plano premium — D+1, liquidez máxima. Posicionamento "liquidez máxima".',
          items: [
            'MDR à vista: 3.59%',
            'MDR 2-6x: 4.19%',
            'MDR 7-12x: 4.79%',
            'Taxa PIX: 0.79%',
            'Prazo de antecipação: D+1',
            'Taxa fixa por antecipação: R$ 0,20',
            'Taxa de antecipação: 2.89%',
          ],
        },
      ],
    },
    {
      type: 'section',
      name: 'Rodapé com Botões',
      description: 'Botões fixos no rodapé no mobile, estáticos no desktop.',
      items: [
        {
          name: 'Botão "Voltar"',
          description: 'Volta para o Passo 1 (AccountCreationStep1).',
        },
        {
          name: 'Botão "Continuar"',
          description:
            'Primary verde. DISABLED enquanto nenhum plano está selecionado. Quando ativo: salva o plano escolhido no localStorage e leva para AccountCreationStep3.',
        },
      ],
    },
  ],

  actions: [
    {
      name: 'Selecionar um plano',
      flow:
        'Usuário compara os 4 cards visualmente → clica em um → o card escolhido fica destacado visualmente → o botão "Continuar" se torna clicável.',
      outcome: 'Botão Continuar habilitado',
    },
    {
      name: 'Avançar para o Passo 3',
      flow:
        'Após selecionar plano, clica em "Continuar" → ID do plano é salvo no localStorage como "selected_plan" → navega para /AccountCreationStep3.',
      outcome: 'Avança para o último passo do wizard',
    },
    {
      name: 'Voltar para o Passo 1',
      flow:
        'Clica em "Voltar" → navega para /AccountCreationStep1. Os dados pessoais permanecem em localStorage e são restaurados.',
    },
  ],

  states: [
    {
      name: 'Estado padrão (nenhum plano selecionado)',
      description: 'Botão "Continuar" fica desabilitado (cinza). Cards todos no estado neutro.',
    },
    {
      name: 'Estado com plano selecionado',
      description:
        'Card escolhido fica destacado visualmente. Botão "Continuar" fica ativo (verde clicável).',
    },
  ],

  navigation: [
    { to: '/LandingPage', via: 'Logo' },
    { to: '/AccountCreationStep1', via: 'Botão "Voltar"' },
    { to: '/AccountCreationStep3', via: 'Botão "Continuar" (após selecionar plano)' },
  ],

  dataSources: [
    {
      entity: 'Hardcoded inline',
      type: 'Mock estático',
      description:
        'Os 4 planos estão hardcoded dentro do componente da página — não vêm de uma entidade do banco. Mudar pricing requer mudar o código.',
      fields: ['id', 'name', 'description', 'mdr1x', 'mdr2_6x', 'mdr7_12x', 'pixRate', 'anticipationTerm', 'anticipationFee', 'anticipationRate', 'popular'],
    },
    {
      entity: 'localStorage',
      type: 'Persistência local',
      description: 'Salva o ID do plano escolhido para uso no Passo 3.',
      fields: ['selected_plan'],
    },
  ],

  notes:
    'O componente PlanCard que renderiza cada card está extraído em components/onboarding/PlanCard. Esta é a única tela do funil que reutiliza um componente extraído. Página registrada em noLayoutPages.',
});

export default PlanSelectionDoc;