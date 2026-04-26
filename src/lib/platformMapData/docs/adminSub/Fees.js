// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Fees
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/Fees.jsx (663 linhas).
// Cada bandeira, cada modalidade, cada linha 1-12x, cada tarifa fixa,
// cada input do simulador, cada cálculo monetário — documentado individualmente.
// ============================================================================

export const FeesDoc = {
  pageId: 'Fees',
  pagePath: '/Fees',
  module: 'Financeiro',
  parentPage: 'FinancialOverview',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Catálogo completo das taxas e tarifas negociadas do merchant — divide-se em 2 abas (Taxas/MDR percentuais por bandeira × modalidade, e Tarifas Fixas em R$ por evento), com tabela completa 1-12x mostrando custo efetivo (MDR + custo de antecipação para D+1) e simulador interativo de venda mostrando valor líquido e custo efetivo.',

    twoTabsConcept: {
      tab1Taxas: {
        what: 'Taxas (MDR) — Merchant Discount Rate, percentual sobre o valor da venda',
        nature: 'Percentual variável conforme modalidade × bandeira × parcelas',
        modalities: ['Vista (1x crédito)', 'Parcelado 2-6x', 'Parcelado 7-12x', 'Débito', 'PIX'],
        brands: ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'],
      },
      tab2Tarifas: {
        what: 'Tarifas Fixas — valor monetário fixo cobrado por evento',
        nature: 'Valor R$ fixo independente do valor da venda',
        examples: ['Gateway R$ 0,49/tx aprovada', 'Antifraude R$ 0,70/tx', 'Chargeback R$ 15,00/cb'],
      },
    },

    fiveModalities: {
      vista: 'Visa 2.99% / MC 2.99% / Elo 3.19% / Amex 3.49% / Hipercard 3.29%',
      parcelado2a6: 'Visa 3.49% / MC 3.49% / Elo 3.69% / Amex 3.99% / Hipercard 3.79%',
      parcelado7a12: 'Visa 3.99% / MC 3.99% / Elo 4.19% / Amex 4.49% / Hipercard 4.29%',
      debito: 'Visa 1.99% / MC 1.99% / Elo 2.19% (sem Amex/Hipercard)',
      pix: '0.99% (alíquota única)',
    },

    custoEfetivoLogic: {
      formula: 'custoEfetivoTotal = MDR + custoAntecipacaoTotal',
      mdrSelection: '1x → vista; 2-6x → parcelado2a6; 7-12x → parcelado7a12 (apenas Visa nas 12 linhas da tabela)',
      prazoMedio: '1x → D+30; 2x+ → Math.round((30 + 30 * i) / 2)',
      diasAntecipados: 'prazoMedioDias - 1 (assume liquidação em D+1)',
      custoAntecipacaoTotal: '(diasAntecipados / 30) * 1.99% (taxa mensal hardcoded)',
      colorCoding: '<=4% verde / <=6% amber / >6% vermelho',
    },

    tenFixedTariffs: {
      gateway: { categoria: 'Gateway', nome: 'Tarifa por Transação Aprovada', valor: 'R$ 0,49', tipo: 'por_transacao' },
      gatewayRecusada: { categoria: 'Gateway', nome: 'Tarifa por Transação Recusada', valor: 'R$ 0,00', tipo: 'por_transacao' },
      antifraude: { categoria: 'Antifraude', nome: 'Análise Antifraude', valor: 'R$ 0,70', tipo: 'por_transacao' },
      antifraude3DS: { categoria: 'Antifraude', nome: 'Análise Premium (3DS)', valor: 'R$ 0,30', tipo: 'por_transacao' },
      saqueTED: { categoria: 'Saques', nome: 'Saque via TED', valor: 'R$ 3,90', tipo: 'por_operacao' },
      saquePIX: { categoria: 'Saques', nome: 'Saque via PIX', valor: 'R$ 0,00', tipo: 'por_operacao' },
      estorno: { categoria: 'Estornos', nome: 'Estorno/Cancelamento', valor: 'R$ 0,00', tipo: 'por_operacao' },
      chargeback: { categoria: 'Chargeback', nome: 'Taxa de Chargeback', valor: 'R$ 15,00', tipo: 'por_ocorrencia' },
      boletoEmissao: { categoria: 'Boleto', nome: 'Emissão de Boleto', valor: 'R$ 2,90', tipo: 'por_boleto' },
      boletoCompensado: { categoria: 'Boleto', nome: 'Boleto Compensado', valor: 'R$ 0,00', tipo: 'por_boleto' },
    },

    simulatorLogic: {
      inputs: ['Valor da Venda (R$)', 'Parcelas (1-12)', 'Bandeira (visa/mc/elo/amex/hipercard)'],
      outputs: ['Valor Bruto', 'MDR (%)', 'Valor MDR (R$)', 'Tarifa Gateway R$ 0,49 (hardcoded)', 'Antifraude R$ 0,70 (hardcoded)', 'Custo Antecipação D+1 (% e R$)', 'Custo Total (R$)', 'Valor Líquido (R$)', '% Efetivo'],
      mdrSelection: 'igual à tabela: vista/parcelado2a6/parcelado7a12 conforme parcelas',
      antecipacaoIgualTabela: '(diasAntecipados / 30) * 1.99%',
      gapHardcoded: 'Tarifa Gateway e Antifraude são hardcoded no simulador, não vêm da tabela tarifasFixas',
    },

    coreCapabilities: [
      'Toggle Eye/EyeOff para mascarar valores monetários (••••••)',
      'Tabs Taxas (MDR) vs Tarifas (Fixas) com cor verde #00D26A no estado ativo',
      '4 Cards de modalidades com cores temáticas (azul/laranja/roxo/esmeralda)',
      'Tabela Completa 1-12x com 5 colunas (Parcelas, MDR, Prazo, Antecipação, Custo Efetivo)',
      'Simulador interativo com card preto resultado e linhas detalhadas',
      'Tooltip Info no header da tabela explicando cálculo',
      'Período Select (state criado mas SEM USO real — gap)',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Fees.jsx',
    totalLines: 663,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery (importado mas SEM uso real — gap)'],
      base44: 'base44.entities (importado, sem uso — gap)',
      sharedComponents: ['PageHeader'],
      uiComponents: [
        'Button', 'Card+CardContent+CardHeader+CardTitle+CardDescription', 'Badge',
        'Tabs+TabsContent+TabsList+TabsTrigger',
        'Input', 'Label',
        'Select stack',
        'Table stack',
        'Tooltip+TooltipContent+TooltipProvider+TooltipTrigger',
      ],
      utilities: ['cn (lib/utils)', 'date-fns: format', 'date-fns/locale: ptBR (ambos importados sem uso — gap)'],
      lucideIcons: [
        'Wallet, QrCode, CreditCard — modalidades de pagamento',
        'TrendingUp, TrendingDown — alertas (TrendingUp usado em "Taxa de Antecipação"; TrendingDown sem uso)',
        'Percent — tab Taxas',
        'DollarSign — importado sem uso',
        'Download — botão Exportar (sem onClick)',
        'Calendar — importado sem uso',
        'Eye / EyeOff — toggle showValues',
        'Calculator — Simulador',
        'Receipt — tab Tarifas + tabela',
        'Table2 — header tabela 1-12x',
        'Info — tooltip header',
        'Sparkles — card Antifraude',
        'CheckCircle2 — card Saque PIX',
        'ArrowRight — importado sem uso',
      ],
      localUtilities: {
        formatCurrency: 'inline com hide param: showValues=false → "••••••"',
        formatPercent: '${value.toFixed(2)}%',
      },
      localConstants: {
        taxasMDR: 'Object literal hardcoded com 5 sub-objetos (vista/parcelado2a6/parcelado7a12/debito/pix)',
        taxaAntecipacao: '1.99 (% ao mês)',
        tarifasFixas: 'Array de 10 objetos {categoria, nome, valor, tipo}',
      },
    },

    componentState: {
      showValues: { initial: 'true', purpose: 'Toggle para mascarar valores monetários com ••••••' },
      period: { initial: "'30d'", purpose: 'Period filter (state existe mas SEM USO no render — gap)' },
      activeTab: { initial: "'taxas'", purpose: 'Tab principal Taxas vs Tarifas' },
      simAmount: { initial: "'1000'", purpose: 'Input "Valor da Venda" do Simulador' },
      simInstallments: { initial: "'1'", purpose: 'Select "Parcelas" do Simulador (1-12)' },
      simBrand: { initial: "'visa'", purpose: 'Select "Bandeira" do Simulador' },
    },

    backendIntegration: {
      none: 'Página é 100% estática — nenhuma query funcional. useQuery e base44.entities importados mas sem uso',
      gap: 'Em produção deveria buscar taxas negociadas reais do RatePlan/Subaccount',
    },

    keyComputations: {
      generateInstallmentTable: {
        function: 'Função síncrona (não memoized)',
        loopRange: 'for (let i = 1; i <= 12; i++)',
        mdrSelection: {
          'i === 1': 'taxasMDR.vista.visa (2.99%)',
          'i <= 6': 'taxasMDR.parcelado2a6.visa (3.49%)',
          'else (7-12)': 'taxasMDR.parcelado7a12.visa (3.99%)',
        },
        prazoMedioDias: 'i === 1 ? 30 : Math.round((30 + 30 * i) / 2)',
        diasAntecipados: 'prazoMedioDias - 1',
        custoAntecipacaoTotal: '(diasAntecipados / 30) * 1.99',
        custoEfetivoTotal: 'mdr + custoAntecipacaoTotal',
        output: 'Array de 12 rows {parcelas, mdr, prazoMedio, custoAntecipacao, custoEfetivoTotal}',
        gap: 'Tabela usa SOMENTE bandeira Visa — não muda quando o usuário troca simBrand',
      },

      calculateSimulation: {
        function: 'Função síncrona (não memoized — recalcula a cada render)',
        amount: 'parseFloat(simAmount) || 0',
        installments: 'parseInt(simInstallments) || 1',
        mdrSelection: 'igual à tabela mas usa simBrand (com fallback para visa)',
        valorMDR: 'amount * (mdr / 100)',
        tarifaGateway: '0.49 (HARDCODED no simulador)',
        tarifaAntifraude: '0.70 (HARDCODED)',
        custoAntecipacaoPercent: '(diasAntecipados / 30) * 1.99',
        valorAntecipacao: 'amount * (custoAntecipacaoPercent / 100)',
        custoTotal: 'valorMDR + tarifaGateway + tarifaAntifraude + valorAntecipacao',
        valorLiquido: 'amount - custoTotal',
        percentualEfetivo: '(custoTotal / amount) * 100',
      },
    },

    layout: {
      pageHeader: {
        title: '"Tarifas e Taxas"',
        subtitle: '"Visualize suas taxas negociadas, tarifas e simule custos"',
        breadcrumbs: [{ label: 'Financeiro', page: 'FinancialOverview' }, { label: 'Tarifas e Taxas', page: 'Fees' }],
        actions: [
          'Button ghost icon → setShowValues(!showValues): Eye/EyeOff',
          'Button outline + Download + "Exportar" (gap: sem onClick)',
        ],
      },

      tabs: {
        component: 'Tabs value=activeTab onValueChange=setActiveTab',
        tabsList: 'grid w-full max-w-md grid-cols-2 h-12',
        triggers: [
          'taxas: Percent + "Taxas (MDR)" — active bg-#00D26A text-white',
          'tarifas: Receipt + "Tarifas (Fixas)" — active bg-#00D26A text-white',
        ],
      },

      tab1TaxasContent: {
        modalityCards: {
          layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
          cards: [
            {
              name: 'Crédito à Vista',
              border: '2 border-blue-100',
              gradient: 'bg-gradient-to-br from-blue-50 to-white',
              iconBox: 'bg-blue-100 + CreditCard 5x5 blue-600',
              header: { titulo: 'Crédito à Vista', subtitulo: '1x no cartão' },
              rows: [
                'Visa/Master: Badge bg-blue-600 text-white 2.99%',
                'Elo: Badge outline 3.19%',
                'Amex: Badge outline 3.49%',
              ],
            },
            {
              name: 'Parcelado 2-6x',
              border: '2 border-orange-100',
              gradient: 'from-orange-50 to-white',
              rows: ['Visa/Master 3.49% (orange-600)', 'Elo 3.69%', 'Amex 3.99%'],
            },
            {
              name: 'Parcelado 7-12x',
              border: '2 border-purple-100',
              gradient: 'from-purple-50 to-white',
              rows: ['Visa/Master 3.99% (purple-600)', 'Elo 4.19%', 'Amex 4.49%'],
            },
            {
              name: 'Débito & PIX',
              border: '2 border-emerald-100',
              gradient: 'from-emerald-50 to-white',
              iconBox: 'QrCode emerald-600',
              rows: [
                'Débito Visa/Master 1.99% (emerald-600)',
                'Débito Elo 2.19%',
                'PIX: Badge bg-#00D26A text-white 0.99%',
              ],
            },
          ],
        },

        completeTable: {
          card: {
            title: 'Table2 + "Tabela Completa de Taxas (1-12x) com Antecipação"',
            description: 'Custo efetivo total considerando MDR + Antecipação para D+1 (Taxa de antecipação: 1.99% a.m.)',
            tooltip: 'Info icon → "O custo efetivo total considera o MDR da transação mais o custo de antecipação para receber em D+1 ao invés do prazo padrão."',
          },
          headers: ['Parcelas', 'MDR (center)', 'Prazo Médio (center)', 'Custo Antecipação (center)', 'Custo Efetivo Total (center bg-slate-100)'],
          rows: '12 rows (i=1..12) com data de installmentTable',
          colorCoding: {
            green: 'custoEfetivoTotal <= 4 → bg-emerald-100 text-emerald-700',
            amber: '<= 6 → bg-amber-100 text-amber-700',
            red: '> 6 → bg-red-100 text-red-700',
          },
        },

        simulator: {
          card: 'border-2 border-#00D26A/20 bg-gradient-to-br from-#00D26A/5 to-white',
          title: 'Calculator + "Simulador de Venda"',
          layout: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
          inputs: {
            valor: 'Input type=number com prefixo "R$" absoluto à esquerda',
            parcelas: 'Select 12 opções [1..12]x',
            bandeira: 'Select 5 opções (visa/mastercard/elo/amex/hipercard)',
          },
          resultCard: {
            wrapper: 'bg-slate-900 rounded-2xl p-6 text-white',
            title: 'p-slate-400 "Valor Líquido"',
            value: 'p-4xl font-bold text-#00D26A formatCurrency(valorLiquido)',
            details: [
              'Valor Bruto (white)',
              'MDR (X%) → red-400 negativo',
              'Tarifa Gateway → red-400',
              'Antifraude → red-400',
              'Antecipação D+1 (X%) → red-400',
              'Custo Efetivo Total → amber-400 (border-top slate-700)',
            ],
          },
        },
      },

      tab2TarifasContent: {
        summaryCards: {
          layout: 'grid grid-cols-1 md:grid-cols-3 gap-4',
          cards: [
            { theme: 'slate-900 to slate-800 (escuro)', icon: 'Receipt branco', titulo: 'Tarifa por Transação', valor: 'R$ 0,49' },
            { theme: 'orange-50 to white border-orange-200', icon: 'Sparkles orange-600', titulo: 'Antifraude', valor: 'R$ 0,70' },
            { theme: 'emerald-50 to white border-emerald-200', icon: 'CheckCircle2 emerald-600', titulo: 'Saque via PIX', valor: '"Grátis" (texto)' },
          ],
        },

        completeTariffsTable: {
          card: {
            title: 'Receipt + "Tabela Completa de Tarifas"',
            description: 'Todas as tarifas fixas aplicáveis às suas operações',
          },
          headers: ['Categoria', 'Descrição', 'Tipo (center)', 'Valor (right)'],
          rows: '10 rows da constante tarifasFixas',
          tipoLabels: {
            por_transacao: 'Por transação',
            por_operacao: 'Por operação',
            por_ocorrencia: 'Por ocorrência',
            por_boleto: 'Por boleto',
          },
          freeRendering: 'tarifa.valor === 0 → Badge bg-emerald-100 "Grátis"',
        },

        anticipationNote: {
          card: 'border-amber-200 bg-amber-50',
          icon: 'TrendingUp amber-600',
          titulo: 'Taxa de Antecipação',
          texto: 'A taxa de antecipação é de 1.99% ao mês sobre o valor antecipado. Ela é calculada proporcionalmente ao número de dias antecipados.',
          cta: 'Button outline border-amber-300 text-amber-700 + Calculator + "Simular Antecipação" (gap: sem onClick)',
        },
      },
    },

    knownGaps: [
      'useQuery e base44.entities importados mas SEM uso real — página 100% estática',
      'period state existe mas não filtra nada',
      'Botão "Exportar" sem onClick',
      'Botão "Simular Antecipação" no card amber sem onClick (deveria abrir Anticipation)',
      'Tabela 1-12x usa SOMENTE bandeira Visa — não reflete simBrand',
      'Simulador hardcoda Gateway 0,49 e Antifraude 0,70 — não usa array tarifasFixas',
      'date-fns format, ptBR, DollarSign, Calendar, ArrowRight, TrendingDown importados sem uso',
      'Em produção, taxasMDR e tarifasFixas deveriam vir do RatePlan da subaccount',
      'Sem persistência da configuração de exibição (showValues) entre sessões',
      'Não exibe valores efetivos VS valores oficiais Visa/MC (só mostra os negociados)',
    ],

    relationshipsToOtherPages: {
      financialOverview: '/FinancialOverview — pai do módulo (breadcrumb)',
      feesAnalysis: '/FeesAnalysis — análise quantitativa do impacto das taxas no negócio',
      anticipation: '/Anticipation — destino esperado do botão "Simular Antecipação" (gap)',
      adminIntFeePlans: '/AdminIntFeePlans — origem dos planos de taxa que populariam estes cards (admin interno)',
    },
  },
};

export default FeesDoc;