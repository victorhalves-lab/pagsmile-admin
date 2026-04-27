import { createPageDoc } from '../../schema';

export const AccountCreationStep3Doc = createPageDoc({
  pageId: 'AccountCreationStep3',
  pageName: 'Criar Conta — Passo 3 (Dados da Empresa)',
  route: '/AccountCreationStep3',
  module: 'Onboarding & Criação de Conta',

  purpose:
    'Terceira e última etapa do wizard de criação de conta. Captura todos os dados da pessoa jurídica (CNPJ, razão social, endereço, faturamento, segmento, descrição da operação) e finaliza efetivamente a criação da conta no banco de dados criando uma Subaccount com status pending_compliance.',

  userContext:
    'Usuário que já preencheu dados pessoais (Passo 1) e escolheu plano comercial (Passo 2). Aqui ele descreve a empresa que vai operar a conta. Esta é a única tela do funil que efetivamente cria registro no banco de dados — todos os passos anteriores ficavam no localStorage do navegador.',

  structure: [
    {
      type: 'topbar',
      name: 'Seletor de Idioma',
      description: 'Canto superior direito.',
    },
    {
      type: 'header',
      name: 'Cabeçalho do Card',
      description:
        'Topo do card largo (max-w-7xl) com decoração visual diferente dos passos anteriores.',
      items: [
        {
          name: 'Barra Decorativa Superior',
          description:
            'Faixa horizontal de 8px com gradient verde no topo do card — sinaliza "etapa final".',
        },
        {
          name: 'Logo PagSmile clicável',
          description: 'Volta para Landing.',
        },
        {
          name: 'Título "Dados da Empresa"',
          description: 'Texto extrabold + subtítulo "Etapa 3 de 3".',
        },
        {
          name: 'Barra de Progresso (3 dots)',
          description:
            'Etapas 1 e 2 completas (verdes sólidas). Etapa 3 atual com glow neon. Wizard finalizando.',
        },
      ],
    },
    {
      type: 'form',
      name: 'Formulário de Dados Empresariais',
      description:
        '12 campos organizados em 5 grupos lógicos dentro de um grid de 12 colunas.',
      layout: 'grid 12 colunas responsivo',
      items: [
        {
          type: 'section',
          name: 'Grupo 1 — Identificação',
          description: '3 campos lado a lado, cada um ocupando 4 colunas.',
          items: [
            {
              name: 'CNPJ + Botão de Lookup',
              description:
                'Campo de texto + botão lupa ao lado. Ao clicar na lupa, sistema consulta CNPJ e auto-popula os 3 campos seguintes.',
            },
            {
              name: 'Razão Social',
              description:
                'Campo de texto. Aparece com fundo cinza claro indicando que foi auto-preenchido pela consulta do CNPJ.',
            },
            {
              name: 'Nome Fantasia',
              description: 'Idem — auto-preenchido pelo lookup do CNPJ.',
            },
          ],
        },
        {
          type: 'section',
          name: 'Grupo 2 — Localização',
          description: '1 campo grande na largura.',
          items: [
            {
              name: 'Endereço Completo',
              description:
                'Campo de texto largo, auto-preenchido pelo lookup. Mostra rua + número + bairro + cidade/UF.',
            },
          ],
        },
        {
          type: 'section',
          name: 'Grupo 3 — Volume e Tipo de Negócio',
          description: '2 grupos de seleção em largura completa.',
          items: [
            {
              type: 'list',
              name: 'Faturamento Médio Mensal',
              description: '5 botões de seleção lado a lado (apenas 1 selecionável).',
              items: [
                'R$ 0 a 10k',
                'R$ 10k a 50k',
                'R$ 50k a 100k',
                'R$ 100k a 500k',
                'R$ 500k+',
              ],
            },
            {
              type: 'list',
              name: 'Tipo de Negócio',
              description: '7 botões de seleção lado a lado (apenas 1 selecionável).',
              items: [
                'E-commerce',
                'SaaS',
                'Serviços',
                'Varejo',
                'Marketplace',
                'Infoprodutos',
                'Outro',
              ],
            },
          ],
        },
        {
          type: 'section',
          name: 'Grupo 4 — Detalhes Operacionais',
          description: '3 textareas de descrição livre, ocupando 6 colunas cada.',
          items: [
            {
              name: 'O que sua empresa vende?',
              description: 'Textarea com 2 linhas — descrição livre dos produtos/serviços.',
            },
            {
              name: 'Modelo de Negócio',
              description: 'Textarea com 2 linhas — explica como o negócio funciona.',
            },
            {
              name: 'Detalhes da Operação',
              description: 'Textarea com 2 linhas — explica como a operação é estruturada.',
            },
          ],
        },
        {
          type: 'section',
          name: 'Grupo 5 — Informações Finais',
          description: '2 campos curtos de 3 colunas cada.',
          items: [
            {
              name: 'Site ou Rede Social',
              description: 'Campo de texto. URL ou @user.',
            },
            {
              name: 'Cargo na Empresa',
              description: 'Campo de texto livre.',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      name: 'Rodapé com Botões',
      description: 'Sticky no mobile, estático no desktop.',
      items: [
        {
          name: 'Botão "Voltar"',
          description: 'Ghost. Volta para PlanSelection.',
        },
        {
          name: 'Botão "Finalizar Cadastro"',
          description:
            'Primary verde com ícone Building2. Quando clicado: faz chamada assíncrona ao banco para criar Subaccount, mostra estado "Criando..." durante o processo, e ao concluir navega para /Dashboard. Em caso de erro, log no console.',
        },
      ],
    },
  ],

  actions: [
    {
      name: 'Consultar CNPJ',
      flow:
        'Usuário digita CNPJ no campo → clica no botão lupa → sistema simula consulta e auto-preenche Razão Social, Nome Fantasia e Endereço.',
      outcome: '3 campos auto-preenchidos com fundo cinza claro',
    },
    {
      name: 'Selecionar faturamento mensal',
      flow:
        'Clica em uma das 5 faixas de faturamento → o botão escolhido fica destacado visualmente.',
    },
    {
      name: 'Selecionar tipo de negócio',
      flow: 'Clica em um dos 7 tipos → o botão escolhido fica destacado.',
    },
    {
      name: 'Descrever a operação',
      flow:
        'Preenche as 3 textareas: o que vende / modelo de negócio / detalhes da operação.',
    },
    {
      name: 'Finalizar cadastro (criação real)',
      flow:
        'Clica em "Finalizar Cadastro" → sistema lê dados pessoais (Passo 1) e plano (Passo 2) do localStorage → cria registro no banco como entidade Subaccount com status "pending_compliance" → navega para /Dashboard.',
      outcome: 'Conta efetivamente criada no banco de dados',
    },
    {
      name: 'Voltar para o Passo 2',
      flow: 'Clica em "Voltar" → retorna a /PlanSelection. Plano selecionado permanece marcado.',
    },
  ],

  states: [
    {
      name: 'Estado padrão',
      description: 'Formulário vazio aguardando preenchimento. Botão "Finalizar" ativo.',
    },
    {
      name: 'Estado pós-CNPJ',
      description:
        'Após consulta, campos Razão Social, Nome Fantasia e Endereço aparecem auto-preenchidos com fundo cinza claro indicando origem automática.',
    },
    {
      name: 'Estado loading (criando conta)',
      description:
        'Ao clicar em Finalizar, o botão troca o label para "Criando..." e fica desabilitado até a chamada ao banco completar.',
    },
    {
      name: 'Estado de sucesso',
      description: 'Subaccount criada com sucesso → redireciona para /Dashboard automaticamente.',
    },
    {
      name: 'Estado de erro',
      description:
        'Em caso de falha na criação, erro é registrado no console. Usuário fica na mesma tela.',
    },
  ],

  navigation: [
    { to: '/LandingPage', via: 'Logo' },
    { to: '/PlanSelection', via: 'Botão "Voltar"' },
    {
      to: '/Dashboard',
      via: 'Botão "Finalizar Cadastro" após criação bem-sucedida',
    },
  ],

  dataSources: [
    {
      entity: 'localStorage',
      type: 'Leitura',
      description: 'Lê os dados acumulados nos passos anteriores do wizard.',
      fields: ['onboarding_user (do Passo 1)', 'selected_plan (do Passo 2)'],
    },
    {
      entity: 'Subaccount',
      type: 'Criação no banco',
      description:
        'Esta é a ÚNICA tela do funil de onboarding que efetivamente cria registro no banco. Cria uma nova Subaccount com status inicial pending_compliance.',
      fields: [
        'business_name',
        'legal_name',
        'document (CNPJ)',
        'document_type',
        'email',
        'phone',
        'status: pending_compliance',
        'selected_plan',
        'onboarding_step: 3',
        'website',
        'kyc_data (formData + userData)',
      ],
    },
  ],

  notes:
    'Esta é a tela MAIS LARGA do funil (max-w-7xl) e a única que faz operação de escrita no banco. Após o sucesso, a Subaccount fica com status pending_compliance e o usuário precisará completar o fluxo de compliance/KYC depois de entrar no Dashboard.',
});

export default AccountCreationStep3Doc;