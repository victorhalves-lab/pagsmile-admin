// ============================================================================
// SCHEMA DESCRITIVO PARA DOCUMENTAÇÃO DE PÁGINAS
// ----------------------------------------------------------------------------
// Foco: o time precisa entender a tela e conseguir REDESENHAR.
// Não é crítica de bugs — é um mapa visual hierárquico do que existe.
//
// Cada doc é um objeto com a forma:
//
//   {
//     pageId: 'IBHome',
//     pageName: 'Home da Conta Digital',
//     route: '/IBHome',
//     module: 'Internet Banking',
//
//     // Resumo curto da tela (2-4 linhas)
//     purpose: 'Tela inicial...',
//
//     // Quem usa e quando
//     userContext: 'Merchant logado...',
//
//     // Estrutura visual da página: lista hierárquica de blocos
//     structure: [
//       {
//         type: 'header' | 'tabs' | 'wizard-step' | 'section' | 'card' | 'modal' | 'drawer' | 'sidebar',
//         name: 'Nome do bloco',
//         description: 'O que é este bloco',
//         layout: 'opcional - como está disposto visualmente',
//         items: [...] // sub-blocos OU lista de elementos
//       }
//     ],
//
//     // Funcionalidades da tela (o que o usuário pode fazer)
//     actions: [
//       { name: 'Enviar PIX', flow: 'Clica botão → wizard 5 passos → confirma' }
//     ],
//
//     // Estados visuais (loading, vazio, erro, sucesso)
//     states: [
//       { name: 'Loading', description: 'Skeleton cinza nos cards' }
//     ],
//
//     // Navegação para outras telas
//     navigation: [
//       { to: 'IBExtract', via: 'Botão "Ver Extrato"' }
//     ],
//
//     // Dados que a tela mostra (de onde vem)
//     dataSources: [
//       { entity: 'Subaccount', fields: ['balance_available'] }
//     ]
//   }
//
// Tipos de blocos suportados pelo renderer:
// - header / topbar — barra superior
// - tabs — abas horizontais (cada aba é um sub-bloco com children)
// - wizard-step — passos de um wizard sequencial
// - section — seção genérica vertical
// - card — card visual destacado
// - modal — modal/dialog
// - drawer — side drawer
// - sidebar — barra lateral
// - filter-bar — barra de filtros
// - kpi-row — fileira de KPIs
// - table — tabela de dados
// - list — lista vertical
// - form — formulário
// - chart — gráfico
// - empty / loading / error — estados
// ============================================================================

// Helper para criar docs de forma consistente
export function createPageDoc(doc) {
  return {
    schemaVersion: 'v2-descriptive',
    ...doc,
  };
}