import { createPageDoc } from '../../../schema';

export const IBPixSendDoc = createPageDoc({
  pageId: 'IBPixSend',
  pageName: 'Internet Banking — Enviar PIX',
  route: '/IBPixSend',
  module: 'Internet Banking',
  section: 'PIX',

  purpose:
    'Wizard de envio de PIX em 5 etapas internas (mesma URL, mesma página, conteúdo trocado conforme estado): escolha do método, identificação do destinatário, valor + descrição, confirmação com senha e tela de sucesso/comprovante. É a tela funcional mais crítica do módulo IB — o lojista precisa enviar PIX rapidamente e com confiança.',

  userContext:
    'Merchant precisa pagar fornecedor, transferir para conta pessoal ou pagar conta. Tipicamente vem de um atalho na home ou do menu lateral. Quer fluxo curto e claro, com feedback visual em cada etapa, validação de chave em tempo real, e comprovante baixável após sucesso.',

  structure: [
    {
      type: 'wizard-step',
      name: 'Etapa 0 — Escolha do Método',
      description:
        'Tela de entrada do wizard. 3 opções principais (Por Chave, QR Code, Copia e Cola) + atalhos para favoritos e últimos enviados.',
      items: [
        {
          type: 'header',
          name: 'Cabeçalho',
          description: 'Título "Enviar Pix" + subtítulo "Escolha como deseja enviar".',
        },
        {
          type: 'card',
          name: 'Faixa de Saldo',
          description:
            'Card escuro (gradient slate-900) compacto com ícone Wallet verde + label "Saldo Disponível" + valor formatado em R$. Visível em todas as etapas para constante consciência do saldo.',
        },
        {
          type: 'section',
          name: 'Grid "Como deseja enviar?"',
          description: '3 cards lado a lado, do mesmo tamanho, todos clicáveis.',
          items: [
            {
              type: 'card',
              name: 'Card "Por Chave"',
              description:
                'Ícone Key num círculo cinza/verde + título "Por Chave" + subtítulo "CPF, e-mail, telefone...". Clicar muda para Etapa 1.',
            },
            {
              type: 'card',
              name: 'Card "QR Code"',
              description: 'Ícone QrCode + título "QR Code" + subtítulo "Ler ou colar QR Code". Clicar muda para Etapa 1 em modo QR.',
            },
            {
              type: 'card',
              name: 'Card "Copia e Cola"',
              description: 'Ícone Copy + título "Copia e Cola" + subtítulo "Colar código Pix". Clicar muda para Etapa 1 em modo paste.',
            },
          ],
        },
        {
          type: 'section',
          name: 'Carrossel de Favoritos',
          description: 'Linha horizontal com scroll lateral.',
          items: [
            'Header "FAVORITOS" + link "Ver todos" verde à direita',
            'Cards pequenos (mín 120px) com ícone User circular + nome do contato',
            'Card especial "Adicionar" no final, com borda tracejada e ícone Star',
            'Click num favorito pula direto para Etapa 2 (valor) com chave já preenchida',
          ],
        },
        {
          type: 'section',
          name: 'Lista "Últimos PIX Enviados"',
          description: 'Card com lista das últimas movimentações de saída.',
          items: [
            'Avatar User + nome + data',
            'Valor à direita',
            'Botão Repeat verde — repete o PIX (preenche tudo e leva para Etapa 2)',
          ],
        },
      ],
    },
    {
      type: 'wizard-step',
      name: 'Etapa 1A — Inserir Chave PIX (modo "Por Chave")',
      description: 'Formulário para identificar chave do destinatário.',
      items: [
        {
          type: 'header',
          name: 'Cabeçalho com Voltar',
          description: 'Botão ArrowLeft → volta para Etapa 0. Título "Enviar por Chave" + breadcrumb "Etapa 1 de 3: Destinatário".',
        },
        {
          type: 'section',
          name: 'Seleção de Tipo de Chave',
          description: 'Grid de 5 cards pequenos clicáveis (mas no código só 4 são listados — CPF/CNPJ unificado).',
          items: [
            'CPF/CNPJ (ícone Building2)',
            'E-mail (ícone Mail)',
            'Telefone (ícone Phone)',
            'Aleatória (ícone Hash)',
          ],
        },
        {
          type: 'field',
          name: 'Input da Chave',
          description:
            'Campo de texto com placeholder dinâmico baseado no tipo (ex: "00.000.000/0000-00" para CNPJ, "email@exemplo.com" para email). onBlur dispara busca da chave (handleKeySearch).',
        },
        {
          type: 'card',
          name: 'Card "Chave encontrada"',
          description:
            'Aparece após validação bem-sucedida. Verde claro com borda. Ícone CheckCircle2 + label "Chave encontrada" + lista de dados do destinatário (Nome, CNPJ/CPF, Banco).',
        },
        {
          type: 'section',
          name: 'Botões de Ação',
          description: 'Linha horizontal: "Voltar" (outline, esquerda) + "Continuar" (verde, direita). Continuar fica desabilitado enquanto chave não for encontrada.',
        },
      ],
    },
    {
      type: 'wizard-step',
      name: 'Etapa 1B — Ler/Colar QR Code (modo "QR Code")',
      description: 'Variante da Etapa 1 quando o usuário escolhe QR Code.',
      items: [
        'Cabeçalho "QR Code" + breadcrumb',
        'Área grande quadrada (256x256) com ícone Camera centralizado + texto "Aponte para o QR Code"',
        'Separador "ou"',
        'Textarea grande para colar código PIX Copia e Cola (font mono)',
        'Botão "Colar da área de transferência"',
        'Botão "Enviar imagem do QR Code"',
      ],
    },
    {
      type: 'wizard-step',
      name: 'Etapa 2 — Informar Valor e Descrição',
      description: 'Etapa onde o merchant define quanto enviar e detalhes.',
      items: [
        {
          type: 'card',
          name: 'Resumo do Destinatário',
          description: 'Card cinza compacto reafirmando para quem o PIX vai (avatar + nome + documento).',
        },
        {
          type: 'field',
          name: 'Input de Valor (DESTACADO)',
          description:
            'Input grande, fonte 2xl, h-16. Prefixo "R$" em texto bold cinza dentro do campo. Type number. Abaixo: nota cinza pequena "Saldo disponível: R$ X.XXX,XX".',
        },
        {
          type: 'field',
          name: 'Descrição (Textarea)',
          description: 'Opcional. Limite 140 caracteres. Contador "X/140 caracteres" alinhado à direita.',
        },
        {
          type: 'section',
          name: 'Quando enviar?',
          description: 'RadioGroup com 2 opções.',
          items: [
            { name: '"Agora" (default)', description: 'Envia imediatamente após confirmação.' },
            { name: '"Agendar para outra data"', description: 'Mostra date picker (futuro).' },
          ],
        },
        {
          type: 'field',
          name: 'Checkbox "Salvar como favorito"',
          description: 'Após confirmar, esse destinatário entra na lista de favoritos.',
        },
        {
          type: 'section',
          name: 'Botões',
          description: '"Voltar" + "Continuar" (verde, desabilitado se valor <= 0).',
        },
      ],
    },
    {
      type: 'wizard-step',
      name: 'Etapa 3 — Confirmação com Senha',
      description: 'Tela final de revisão antes da execução.',
      items: [
        {
          type: 'card',
          name: 'Resumo Completo (Card Principal)',
          description: 'Card cinza com sumário visual extenso.',
          items: [
            'Header centralizado: label "Valor" pequeno + valor grande em verde 4xl bold',
            'Linha de separação',
            'Lista de campos label/valor: Destinatário, CNPJ/CPF, Instituição, Chave, Descrição (se houver), Data/Hora',
            'Linha de separação',
            'Linha final: "Saldo após transação" — mostra cálculo (saldo - valor)',
          ],
        },
        {
          type: 'field',
          name: 'Campo de Senha',
          description: 'Input type="password" centralizado, fonte 2xl, letter-spacing widest. Placeholder "••••••". Mínimo 4 caracteres para habilitar botão.',
        },
        {
          type: 'section',
          name: 'Botões',
          description:
            'Linha: "Voltar" (outline) + "Confirmar e Enviar" (verde com ícone Lock). Botão de confirmar desabilitado enquanto senha não atingir 4+ caracteres.',
        },
      ],
    },
    {
      type: 'wizard-step',
      name: 'Etapa 4 — Sucesso (Comprovante)',
      description: 'Tela de confirmação do envio bem-sucedido + comprovante completo.',
      items: [
        {
          type: 'card',
          name: 'Hero de Sucesso',
          description:
            'Card grande gradient verde (emerald-500 → emerald-600), texto branco. Centralizado: círculo branco translúcido com ícone CheckCircle2 grande + título "Pix Enviado com Sucesso!" + valor enviado em fonte 4xl bold + timestamp da transação.',
        },
        {
          type: 'card',
          name: 'Card Comprovante',
          description: 'Card branco com lista detalhada de TODOS os dados da transação.',
          items: [
            'ID da Transação (font mono)',
            'End-to-End ID (E2EID — font mono pequeno)',
            'Bloco DESTINATÁRIO: Valor / Destinatário / CNPJ / Instituição',
            'Bloco PAGADOR: Loja / CNPJ / Instituição (PagSmile)',
            'Descrição (se houver)',
          ],
        },
        {
          type: 'section',
          name: 'Botões de Ação',
          description: 'Linha de 3 botões.',
          items: [
            'Botão "Baixar PDF" (outline com ícone FileText) → gera comprovante PDF',
            'Botão "Compartilhar" (outline com ícone Share2) → abre modal de compartilhamento (WhatsApp, Email, Copy)',
            'Link "Voltar ao Início" (ghost, full width) → volta para /IBHome',
          ],
        },
      ],
    },
  ],

  actions: [
    {
      name: 'Iniciar PIX por chave',
      flow: 'Tela 0 → Click no card "Por Chave" → Tela 1A → seleciona tipo → digita chave → onBlur valida → confirma destinatário → Continuar.',
    },
    {
      name: 'Iniciar PIX via favorito (atalho)',
      flow: 'Tela 0 → Click num card de favorito → pula direto para Tela 2 (valor) com destinatário pré-preenchido.',
    },
    {
      name: 'Iniciar PIX via QR Code',
      flow: 'Tela 0 → Click "QR Code" → Tela 1B → scanner abre câmera OU usuário cola código → após leitura/parse, vai para Tela 2.',
    },
    {
      name: 'Repetir último PIX',
      flow: 'Tela 0 → Click no botão Repeat (ícone) na lista de últimos enviados → todos os dados pré-preenchidos → vai direto para Tela 2 ou 3.',
    },
    {
      name: 'Voltar etapa',
      flow: 'Botão ArrowLeft no header da tela atual → volta uma etapa preservando dados preenchidos.',
    },
    {
      name: 'Confirmar e enviar PIX',
      flow:
        'Tela 3 → digita senha (4+ caracteres) → clica "Confirmar e Enviar" → backend chama API de PIX → sucesso → muda para Tela 4 com comprovante.',
      outcome: 'Cria registro Transaction com method="pix" + pix_transaction_type="out". Atualiza saldo da Subaccount.',
    },
    {
      name: 'Baixar comprovante PDF',
      flow: 'Tela 4 → Botão "Baixar PDF" → gera PDF no backend → download automático.',
    },
    {
      name: 'Compartilhar comprovante',
      flow: 'Tela 4 → Botão "Compartilhar" → modal nativo Web Share API ou fallback (copy link, WhatsApp, Email).',
    },
  ],

  states: [
    { name: 'Etapa 0 (default)', description: 'Mostra opções de envio + favoritos + últimos.' },
    { name: 'Etapa 1A', description: 'Form de chave PIX. Estado "chave não validada" vs "chave encontrada".' },
    { name: 'Etapa 1B', description: 'Scanner QR ou paste de código.' },
    { name: 'Etapa 2', description: 'Form de valor + descrição + agendamento.' },
    { name: 'Etapa 3', description: 'Resumo + senha. Loading enquanto valida senha.' },
    { name: 'Etapa 4', description: 'Sucesso. Botões de comprovante.' },
    {
      name: 'Erro de chave inválida',
      description: 'Card vermelho abaixo do input "Chave não encontrada" + botão "Tentar novamente".',
    },
    {
      name: 'Erro de saldo insuficiente',
      description: 'Bloqueia avanço da Etapa 2 com mensagem vermelha "Valor maior que saldo disponível".',
    },
    {
      name: 'Erro na execução do PIX',
      description: 'Modal vermelho na Etapa 3 com mensagem do backend (ex: "Limite diário excedido", "Conta destino bloqueada"). Botão "Tentar novamente" volta a Etapa 3.',
    },
  ],

  navigation: [
    { to: '/IBHome', via: 'Botão "Voltar ao Início" da Etapa 4' },
    { to: '/IBPixLimits', via: 'Link contextual (futuro) quando atinge limite' },
    { to: '/IBProofs', via: 'Botão "Baixar PDF" também adiciona o comprovante a esta página' },
  ],

  dataSources: [
    {
      entity: 'Subaccount',
      type: 'Read',
      description: 'Saldo atual + limites configurados.',
      fields: ['balance_available', 'limits.pix_per_transaction', 'limits.pix_daily'],
    },
    {
      entity: 'Transaction',
      type: 'Create',
      description: 'Cria registro ao confirmar PIX.',
      fields: ['amount', 'method', 'pix_transaction_type', 'pix.payer_name', 'pix.payer_document', 'status'],
    },
    {
      entity: 'PIX Directory (PSPs)',
      type: 'Lookup externo',
      description: 'Validação da chave PIX consulta diretório centralizado.',
    },
    {
      entity: 'Favorites (futuro)',
      type: 'Create/Read',
      description: 'Lista de destinatários salvos.',
    },
  ],

  notes:
    'Wizard usa state interno (step number) — NÃO usa rotas separadas. Isso permite voltar/avançar sem perder dados. Senha do passo 3 é simulada no MVP — em produção integrará com 2FA. O fluxo deve ser otimizado para mobile (a maioria dos PIX é feita pelo celular). Considerar biometria como alternativa à senha em fase futura.',
});

export default IBPixSendDoc;