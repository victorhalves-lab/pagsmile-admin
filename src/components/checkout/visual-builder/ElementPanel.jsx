import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  CreditCard,
  QrCode,
  Type,
  Image,
  Square,
  Columns,
  ChevronDown,
  ChevronRight,
  Hash,
  Calendar,
  CheckSquare,
  List,
  CircleDot,
  ShoppingCart,
  Tag,
  DollarSign,
  MousePointer,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const elementCategories = [
  {
    id: 'customer-fields',
    label: 'Campos do Cliente',
    icon: User,
    elements: [
      { type: 'full_name', label: 'Nome Completo', icon: User, defaultProps: { label: 'Nome Completo', placeholder: 'Digite seu nome', required: true } },
      { type: 'email', label: 'E-mail', icon: Mail, defaultProps: { label: 'E-mail', placeholder: 'seu@email.com', required: true } },
      { type: 'cpf', label: 'CPF', icon: FileText, defaultProps: { label: 'CPF', placeholder: '000.000.000-00', required: true } },
      { type: 'cnpj', label: 'CNPJ', icon: FileText, defaultProps: { label: 'CNPJ', placeholder: '00.000.000/0000-00', required: false } },
      { type: 'cpf_cnpj', label: 'CPF/CNPJ (Automático)', icon: FileText, defaultProps: { label: 'CPF/CNPJ', placeholder: 'Digite seu documento', required: true } },
      { type: 'phone', label: 'Telefone', icon: Phone, defaultProps: { label: 'Telefone', placeholder: '(00) 00000-0000', required: false } },
      { type: 'birthdate', label: 'Data de Nascimento', icon: Calendar, defaultProps: { label: 'Data de Nascimento', format: 'DD/MM/AAAA', required: false } },
    ]
  },
  {
    id: 'address-fields',
    label: 'Campos de Endereço',
    icon: MapPin,
    elements: [
      { type: 'cep', label: 'CEP', icon: MapPin, defaultProps: { label: 'CEP', placeholder: '00000-000', autoFill: true, required: true } },
      { type: 'street', label: 'Rua/Logradouro', icon: MapPin, defaultProps: { label: 'Rua', placeholder: 'Nome da rua', required: true } },
      { type: 'number', label: 'Número', icon: Hash, defaultProps: { label: 'Número', placeholder: '123', required: true } },
      { type: 'complement', label: 'Complemento', icon: MapPin, defaultProps: { label: 'Complemento', placeholder: 'Apto, Bloco...', required: false } },
      { type: 'neighborhood', label: 'Bairro', icon: MapPin, defaultProps: { label: 'Bairro', placeholder: 'Nome do bairro', required: true } },
      { type: 'city', label: 'Cidade', icon: MapPin, defaultProps: { label: 'Cidade', placeholder: 'Nome da cidade', required: true } },
      { type: 'state', label: 'Estado (UF)', icon: MapPin, defaultProps: { label: 'Estado', required: true } },
      { type: 'address_block', label: 'Bloco de Endereço Completo', icon: MapPin, defaultProps: { autoFill: true } },
    ]
  },
  {
    id: 'payment-fields',
    label: 'Campos de Pagamento',
    icon: CreditCard,
    elements: [
      { type: 'payment_method_selector', label: 'Seletor de Método', icon: CreditCard, defaultProps: { style: 'tabs', showIcons: true } },
      { type: 'card_block', label: 'Bloco de Cartão', icon: CreditCard, defaultProps: { layout: 'two-rows' } },
      { type: 'card_number', label: 'Número do Cartão', icon: CreditCard, defaultProps: { label: 'Número do Cartão', placeholder: '0000 0000 0000 0000' } },
      { type: 'card_expiry', label: 'Validade', icon: Calendar, defaultProps: { label: 'Validade', placeholder: 'MM/AA' } },
      { type: 'card_cvv', label: 'CVV', icon: Hash, defaultProps: { label: 'CVV', placeholder: '123' } },
      { type: 'card_name', label: 'Nome no Cartão', icon: User, defaultProps: { label: 'Nome no Cartão', placeholder: 'Como está no cartão' } },
      { type: 'installments_selector', label: 'Seletor de Parcelas', icon: List, defaultProps: { style: 'dropdown', showTotal: true } },
      { type: 'save_card_checkbox', label: 'Salvar Cartão', icon: CheckSquare, defaultProps: { label: 'Salvar cartão para compras futuras', checked: false } },
      { type: 'pix_block', label: 'Bloco Pix', icon: QrCode, defaultProps: { showCopyPaste: true, showTimer: true } },
    ]
  },
  {
    id: 'layout-elements',
    label: 'Elementos de Layout',
    icon: Square,
    elements: [
      { type: 'heading', label: 'Título', icon: Type, defaultProps: { text: 'Título', level: 'h2', align: 'left' } },
      { type: 'paragraph', label: 'Parágrafo', icon: Type, defaultProps: { text: 'Texto do parágrafo aqui...', align: 'left' } },
      { type: 'image', label: 'Imagem', icon: Image, defaultProps: { src: '', alt: '', width: 'auto' } },
      { type: 'logo', label: 'Logo', icon: Image, defaultProps: { position: 'center', maxWidth: 200 } },
      { type: 'divider', label: 'Divisor', icon: Square, defaultProps: { style: 'solid', color: '#E5E7EB', thickness: 1 } },
      { type: 'spacer', label: 'Espaçador', icon: Square, defaultProps: { height: 24 } },
      { type: 'container', label: 'Container', icon: Square, defaultProps: { padding: 16, background: 'transparent', borderRadius: 8 } },
      { type: 'columns', label: 'Colunas', icon: Columns, defaultProps: { count: 2, gap: 16, distribution: '50-50' } },
    ]
  },
  {
    id: 'order-elements',
    label: 'Resumo do Pedido',
    icon: ShoppingCart,
    elements: [
      { type: 'order_summary', label: 'Resumo do Pedido', icon: ShoppingCart, defaultProps: { showImage: true, showQuantity: true, editable: false } },
      { type: 'subtotal', label: 'Subtotal', icon: DollarSign, defaultProps: {} },
      { type: 'discount', label: 'Desconto', icon: Tag, defaultProps: {} },
      { type: 'shipping', label: 'Frete', icon: MapPin, defaultProps: {} },
      { type: 'total', label: 'Total', icon: DollarSign, defaultProps: { highlight: true } },
      { type: 'coupon_field', label: 'Campo de Cupom', icon: Tag, defaultProps: { placeholder: 'Digite o cupom', buttonText: 'Aplicar' } },
    ]
  },
  {
    id: 'action-elements',
    label: 'Botões e Ações',
    icon: MousePointer,
    elements: [
      { type: 'pay_button', label: 'Botão de Pagar', icon: MousePointer, defaultProps: { text: 'Pagar', showValue: true, icon: 'lock' } },
      { type: 'secondary_button', label: 'Botão Secundário', icon: MousePointer, defaultProps: { text: 'Voltar', variant: 'outline' } },
      { type: 'loading_indicator', label: 'Indicador de Loading', icon: Loader2, defaultProps: { type: 'spinner', message: 'Processando...' } },
    ]
  },
  {
    id: 'custom-fields',
    label: 'Campos Customizados',
    icon: FileText,
    elements: [
      { type: 'custom_text', label: 'Campo de Texto', icon: Type, defaultProps: { label: 'Campo Customizado', placeholder: '', required: false } },
      { type: 'custom_select', label: 'Campo de Seleção', icon: List, defaultProps: { label: 'Selecione', options: ['Opção 1', 'Opção 2'], required: false } },
      { type: 'custom_radio', label: 'Radio Buttons', icon: CircleDot, defaultProps: { label: 'Escolha uma opção', options: ['Opção 1', 'Opção 2'], layout: 'vertical' } },
      { type: 'custom_checkbox', label: 'Checkbox', icon: CheckSquare, defaultProps: { label: 'Li e aceito os termos', required: false, link: '' } },
    ]
  }
];

export default function ElementPanel({ onAddElement }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(['customer-fields', 'payment-fields']);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = elementCategories.map(category => ({
    ...category,
    elements: category.elements.filter(el => 
      el.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.elements.length > 0);

  return (
    <div className="w-72 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900 mb-3">Elementos</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar elementos..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCategories.map(category => (
            <div key={category.id} className="mb-2">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-left"
              >
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <category.icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{category.label}</span>
              </button>
              
              {expandedCategories.includes(category.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {category.elements.map(element => (
                    <button
                      key={element.type}
                      onClick={() => onAddElement(element)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[#00D26A]/10 hover:text-[#00D26A] text-left transition-colors group"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('element', JSON.stringify(element));
                      }}
                    >
                      <element.icon className="w-4 h-4 text-gray-400 group-hover:text-[#00D26A]" />
                      <span className="text-sm text-gray-600 group-hover:text-[#00D26A]">{element.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}