import { createPageDoc } from '../../schema';

export const AccountCreationStep1Doc = createPageDoc({
  pageId: 'AccountCreationStep1',
  pageName: 'Criar Conta — Passo 1 (Dados do Representante)',
  route: '/AccountCreationStep1',
  module: 'Onboarding & Criação de Conta',

  purpose:
    'Primeira etapa do wizard de criação de conta. Captura os dados pessoais do representante legal (pessoa física que está abrindo a conta) e valida sua identidade através de código OTP enviado por email ou SMS antes de prosseguir.',

  userContext:
    'Usuário novo que clicou em "Criar Conta" na Landing. Pode ser o próprio dono do negócio, um sócio, ou um responsável legal indicado para abrir a conta empresarial. Esta é a tela onde o sistema "conhece" pela primeira vez a pessoa física por trás da empresa.',

  structure: [
    {
      type: 'topbar',
      name: 'Seletor de Idioma',
      description: 'Canto superior direito da tela, igual à Landing.',
    },
    {
      type: 'header',
      name: 'Cabeçalho do Card Principal',
      description:
        'Topo do card central com logo + título + barra de progresso visual de 3 etapas.',
      items: [
        {
          name: 'Logo PagSmile clicável',
          description:
            'Logo claro centralizado. Clicar leva de volta para a Landing.',
        },
        {
          name: 'Título "Criar Conta"',
          description: 'Texto grande em negrito, sub-texto "Dados do Representante".',
        },
        {
          name: 'Barra de Progresso (3 dots)',
          description:
            'Indicador visual dos 3 passos do wizard. Etapa 1 (atual) brilha em verde com glow neon. Etapas 2 e 3 ficam apagadas em cinza.',
          items: [
            'Dot 1 (atual): círculo branco com borda verde + barra verde gradient + glow shadow',
            'Dots 2 e 3: cinza apagado com opacidade 30%',
          ],
        },
      ],
    },
    {
      type: 'form',
      name: 'Formulário de Dados Pessoais (Fase 1)',
      description:
        'Mostrado por padrão quando a página abre. Ao clicar em "Continuar", esta fase é trocada pela tela de verificação OTP (mesma URL, conteúdo trocado).',
      layout: 'grid 12 colunas responsivo',
      items: [
        {
          name: 'Nome Completo',
          description: 'Campo de texto livre — coluna 6 (metade da largura)',
        },
        {
          name: 'CPF',
          description: 'Campo de texto sem máscara — coluna 3',
        },
        {
          name: 'Telefone',
          description: 'Campo de texto sem máscara — coluna 3',
        },
        {
          name: 'E-mail',
          description: 'Campo type="email" — coluna 6',
        },
        {
          name: 'Data de Nascimento',
          description: 'Date picker nativo do navegador — coluna 3',
        },
        {
          name: 'Representante Legal? (Sim/Não)',
          description:
            'Dois botões de seleção (Sim/Não) lado a lado, com label colorida em verde da marca — coluna 3',
        },
        {
          name: 'Senha',
          description: 'Campo type="password" — coluna 6',
        },
        {
          name: 'Confirmar Senha',
          description: 'Campo type="password" — coluna 6',
        },
        {
          type: 'card',
          name: 'Bloco de Aceite de Termos',
          description:
            'Card destacado em fundo cinza claro com botão de toggle e texto explicativo.',
          items: [
            {
              name: 'Botão Toggle "Aceitar Termos"',
              description:
                'Botão custom com 2 estados visuais: quando NÃO aceito, fica branco com borda verde; quando aceito, fica verde com ícone de check.',
            },
            {
              name: 'Texto descritivo',
              description:
                'Parágrafo com 2 links inline: "Termos de Uso" e "Política de Privacidade".',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      name: 'Rodapé do Card (Fase 1)',
      description:
        'Botões de navegação. No mobile, fica fixo no rodapé da tela (sticky).',
      items: [
        {
          name: 'Botão "Voltar"',
          description: 'Ghost (sem fundo). Volta para Landing.',
        },
        {
          name: 'Botão "Continuar"',
          description:
            'Primary verde com seta. Leva à Fase 2 (verificação OTP) na mesma tela.',
        },
        {
          name: 'Link "Solicitar proposta sob medida"',
          description: 'Texto centralizado abaixo dos botões. Abre link externo.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Tela de Verificação OTP (Fase 2)',
      description:
        'Mostrada após clicar em Continuar. Substitui completamente o formulário, mantendo a mesma URL e o mesmo card.',
      items: [
        {
          type: 'card',
          name: 'Cabeçalho "Verifique sua identidade"',
          description:
            'Ícone de check grande dentro de círculo gradient verde + título + subtítulo.',
        },
        {
          type: 'list',
          name: 'Seleção de Método de Verificação',
          description: 'Dois botões grandes lado a lado, escolhe-se um.',
          items: [
            {
              name: 'Via E-mail',
              description: 'Botão com ícone Mail. Estado selecionado fica verde.',
            },
            {
              name: 'Via SMS',
              description: 'Botão com ícone Smartphone. Estado selecionado fica verde.',
            },
          ],
        },
        {
          type: 'card',
          name: 'Display "Código enviado para"',
          description:
            'Card pequeno verde claro mostrando o destino do código (e-mail OU telefone, dependendo do método selecionado).',
        },
        {
          type: 'field',
          name: 'Input de Código de 6 Dígitos',
          description:
            'Campo grande, centralizado, fonte monospace tamanho 2xl com letter-spacing largo (estilo OTP profissional). Aceita até 6 caracteres.',
        },
        {
          name: 'Link "Não recebi" + "Reenviar agora"',
          description: 'Texto pequeno abaixo do input com link para reenviar código.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Rodapé do Card (Fase 2)',
      description: 'Botões mostrados quando o usuário está na fase de verificação.',
      items: [
        {
          name: 'Botão "Voltar"',
          description:
            'Ghost. Volta para Fase 1 (formulário) — mantém valores preenchidos.',
        },
        {
          name: 'Botão "Confirmar e prosseguir"',
          description:
            'Primary verde. Salva dados no localStorage e leva para /PlanSelection.',
        },
      ],
    },
  ],

  actions: [
    {
      name: 'Preencher dados pessoais',
      flow:
        'Usuário preenche os 8 campos do formulário (nome, CPF, e-mail, telefone, data nascimento, representante, senha, confirmar senha) → marca aceite de termos → clica Continuar.',
      outcome: 'Tela troca para Fase 2 (verificação OTP)',
    },
    {
      name: 'Escolher método de verificação',
      flow:
        'Na Fase 2, clica em "Via E-mail" ou "Via SMS" → display do destino atualiza dinamicamente.',
    },
    {
      name: 'Confirmar identidade com OTP',
      flow:
        'Digita código de 6 dígitos → clica em "Confirmar e prosseguir" → dados são salvos no localStorage como onboarding_user → navega para PlanSelection.',
      outcome: 'Avança para Passo 2 do wizard',
    },
    {
      name: 'Voltar para o formulário',
      flow: 'Na Fase 2, clica em "Voltar" → retorna ao formulário com os valores preservados.',
    },
    {
      name: 'Aceitar Termos de Uso',
      flow:
        'Clica no botão custom "Aceitar Termos" → muda visualmente de branco para verde com ícone de check.',
    },
  ],

  states: [
    {
      name: 'Estado Fase 1 (formulário)',
      description: 'Mostra o formulário de dados pessoais. É o estado padrão ao abrir a página.',
    },
    {
      name: 'Estado Fase 2 (OTP)',
      description:
        'Substitui o formulário pela tela de verificação. Ativada apenas após clicar em Continuar.',
    },
  ],

  navigation: [
    { to: '/LandingPage', via: 'Logo + botão Voltar' },
    { to: '/PlanSelection', via: 'Botão "Confirmar e prosseguir" (após OTP)' },
    {
      to: 'EXTERNO: pagsmileonboarding.base44.app',
      via: 'Link "Solicitar proposta sob medida"',
    },
  ],

  dataSources: [
    {
      entity: 'localStorage',
      type: 'Persistência local',
      description:
        'Os dados preenchidos são salvos no localStorage do navegador (chave "onboarding_user") para serem usados nos passos seguintes do wizard.',
      fields: [
        'fullName',
        'cpf',
        'email',
        'phone',
        'birthDate',
        'isRepresentative',
        'password',
        'confirmPassword',
        'agreeToTerms',
      ],
    },
  ],

  notes:
    'A página usa um padrão "two-phase" — mesma URL, mesmo Card visual, mas conteúdo trocado por uma flag boolean. Não há navegação real entre formulário e OTP. Esta tela está registrada em noLayoutPages — não recebe sidebar nem header da plataforma.',
});

export default AccountCreationStep1Doc;