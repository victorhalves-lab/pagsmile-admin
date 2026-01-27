import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { CreditCard, QrCode, Lock, Copy, Clock } from 'lucide-react';

// Renderiza cada tipo de elemento do checkout
export default function CheckoutElementRenderer({ element, config, isSelected }) {
  const { type, props = {} } = element;
  const branding = config?.branding || {};
  const inputStyle = branding.inputs || {};
  const buttonStyle = branding.buttons || {};

  const inputClassName = cn(
    "w-full",
    isSelected && "pointer-events-none"
  );

  const renderField = (label, placeholder, inputType = 'text', mask) => (
    <div className="space-y-1.5">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Input 
        type={inputType}
        placeholder={placeholder}
        className={inputClassName}
        style={{
          backgroundColor: inputStyle.bg_color,
          borderColor: inputStyle.border_color,
          borderRadius: inputStyle.border_radius,
          borderWidth: inputStyle.border_width
        }}
        readOnly
      />
    </div>
  );

  switch (type) {
    // Customer Fields
    case 'full_name':
      return renderField(props.label, props.placeholder);
    
    case 'email':
      return renderField(props.label, props.placeholder, 'email');
    
    case 'cpf':
      return renderField(props.label, props.placeholder);
    
    case 'cnpj':
      return renderField(props.label, props.placeholder);
    
    case 'cpf_cnpj':
      return renderField(props.label, props.placeholder);
    
    case 'phone':
      return renderField(props.label, props.placeholder, 'tel');
    
    case 'birthdate':
      return renderField(props.label, props.placeholder);

    // Address Fields
    case 'cep':
      return renderField(props.label, props.placeholder);
    
    case 'street':
      return renderField(props.label, props.placeholder);
    
    case 'number':
      return renderField(props.label, props.placeholder);
    
    case 'complement':
      return renderField(props.label, props.placeholder);
    
    case 'neighborhood':
      return renderField(props.label, props.placeholder);
    
    case 'city':
      return renderField(props.label, props.placeholder);
    
    case 'state':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{props.label}</Label>
          <Select disabled>
            <SelectTrigger className={inputClassName}>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    
    case 'address_block':
      return (
        <div className="space-y-3 p-4 border rounded-lg bg-gray-50/50">
          <p className="text-sm font-medium text-gray-600 mb-2">Endereço Completo</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Label className="text-xs">CEP</Label>
              <Input placeholder="00000-000" className="mt-1" readOnly />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Rua</Label>
              <Input placeholder="Nome da rua" className="mt-1" readOnly />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <Label className="text-xs">Número</Label>
              <Input placeholder="123" className="mt-1" readOnly />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">Complemento</Label>
              <Input placeholder="Apto" className="mt-1" readOnly />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Bairro</Label>
              <Input placeholder="Bairro" className="mt-1" readOnly />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Cidade</Label>
              <Input placeholder="Cidade" className="mt-1" readOnly />
            </div>
            <div className="col-span-1">
              <Label className="text-xs">Estado</Label>
              <Input placeholder="UF" className="mt-1" readOnly />
            </div>
          </div>
        </div>
      );

    // Payment Fields
    case 'payment_method_selector':
      return (
        <div className="flex border rounded-lg overflow-hidden">
          <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#00D26A]/10 text-[#00D26A] border-b-2 border-[#00D26A]">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Cartão</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 p-3 text-gray-500 hover:bg-gray-50">
            <QrCode className="w-5 h-5" />
            <span className="font-medium">Pix</span>
          </button>
        </div>
      );
    
    case 'card_block':
      return (
        <div className="space-y-3 p-4 border rounded-lg">
          <div>
            <Label className="text-xs">Número do Cartão</Label>
            <div className="relative mt-1">
              <Input placeholder="0000 0000 0000 0000" readOnly />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Validade</Label>
              <Input placeholder="MM/AA" className="mt-1" readOnly />
            </div>
            <div>
              <Label className="text-xs">CVV</Label>
              <Input placeholder="123" className="mt-1" readOnly />
            </div>
          </div>
          <div>
            <Label className="text-xs">Nome no Cartão</Label>
            <Input placeholder="Como está no cartão" className="mt-1" readOnly />
          </div>
        </div>
      );
    
    case 'card_number':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{props.label}</Label>
          <div className="relative">
            <Input placeholder={props.placeholder} className={inputClassName} readOnly />
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      );
    
    case 'card_expiry':
      return renderField(props.label, props.placeholder);
    
    case 'card_cvv':
      return renderField(props.label, props.placeholder);
    
    case 'card_name':
      return renderField(props.label, props.placeholder);
    
    case 'installments_selector':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Parcelas</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Selecione as parcelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1x de R$ 100,00 (sem juros)</SelectItem>
              <SelectItem value="2">2x de R$ 50,00 (sem juros)</SelectItem>
              <SelectItem value="3">3x de R$ 33,33 (sem juros)</SelectItem>
              <SelectItem value="6">6x de R$ 17,50</SelectItem>
              <SelectItem value="12">12x de R$ 9,50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    
    case 'save_card_checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id="save-card" />
          <Label htmlFor="save-card" className="text-sm cursor-pointer">{props.label}</Label>
        </div>
      );
    
    case 'pix_block':
      return (
        <div className="p-4 border rounded-lg text-center space-y-4">
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
            <QrCode className="w-32 h-32 text-gray-400" />
          </div>
          {props.showTimer && (
            <div className="flex items-center justify-center gap-2 text-orange-500">
              <Clock className="w-4 h-4" />
              <span className="font-medium">29:45</span>
            </div>
          )}
          {props.showCopyPaste && (
            <div className="flex items-center gap-2">
              <Input value="00020126580014br.gov.bcb.pix..." className="text-xs" readOnly />
              <Button variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Abra o app do seu banco e escaneie o QR Code
          </p>
        </div>
      );

    // Layout Elements
    case 'heading':
      const HeadingTag = props.level || 'h2';
      const headingSizes = { h1: 'text-3xl', h2: 'text-2xl', h3: 'text-xl', h4: 'text-lg' };
      return (
        <HeadingTag className={cn("font-bold", headingSizes[props.level], `text-${props.align}`)}>
          {props.text}
        </HeadingTag>
      );
    
    case 'paragraph':
      return (
        <p className={cn("text-gray-600", `text-${props.align}`)}>
          {props.text}
        </p>
      );
    
    case 'image':
      return (
        <div className="flex justify-center">
          {props.src ? (
            <img src={props.src} alt={props.alt} style={{ width: props.width }} />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              Imagem
            </div>
          )}
        </div>
      );
    
    case 'logo':
      return (
        <div className={cn("flex", props.position === 'center' && 'justify-center', props.position === 'left' && 'justify-start', props.position === 'right' && 'justify-end')}>
          <div className="w-32 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
            Logo
          </div>
        </div>
      );
    
    case 'divider':
      return (
        <hr style={{ 
          borderColor: props.color, 
          borderWidth: props.thickness,
          borderStyle: props.style 
        }} />
      );
    
    case 'spacer':
      return <div style={{ height: props.height }} />;
    
    case 'container':
      return (
        <div 
          className="min-h-[60px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm"
          style={{ 
            padding: props.padding, 
            backgroundColor: props.background,
            borderRadius: props.borderRadius 
          }}
        >
          Container (arraste elementos aqui)
        </div>
      );
    
    case 'columns':
      return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${props.count}, 1fr)` }}>
          {Array.from({ length: props.count }).map((_, i) => (
            <div key={i} className="min-h-[60px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              Coluna {i + 1}
            </div>
          ))}
        </div>
      );

    // Order Elements
    case 'order_summary':
      return (
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-semibold">Resumo do Pedido</h4>
          <div className="flex items-center gap-3 py-2 border-b">
            {props.showImage && (
              <div className="w-16 h-16 bg-gray-100 rounded" />
            )}
            <div className="flex-1">
              <p className="font-medium">Produto Exemplo</p>
              {props.showQuantity && <p className="text-sm text-gray-500">Qtd: 1</p>}
            </div>
            <p className="font-medium">R$ 99,90</p>
          </div>
        </div>
      );
    
    case 'subtotal':
      return (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>R$ 99,90</span>
        </div>
      );
    
    case 'discount':
      return (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Desconto</span>
          <span className="text-green-600">-R$ 10,00</span>
        </div>
      );
    
    case 'shipping':
      return (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frete</span>
          <span className="text-green-600">Grátis</span>
        </div>
      );
    
    case 'total':
      return (
        <div className={cn("flex justify-between font-bold", props.highlight && "text-lg")}>
          <span>Total</span>
          <span>R$ 89,90</span>
        </div>
      );
    
    case 'coupon_field':
      return (
        <div className="flex gap-2">
          <Input placeholder={props.placeholder} className="flex-1" readOnly />
          <Button variant="outline">{props.buttonText}</Button>
        </div>
      );

    // Action Elements
    case 'pay_button':
      return (
        <Button 
          className="w-full h-12 text-base"
          style={{
            backgroundColor: buttonStyle.bg_color || '#00D26A',
            color: buttonStyle.text_color || '#FFFFFF',
            borderRadius: buttonStyle.border_radius || 8
          }}
        >
          {props.icon === 'lock' && <Lock className="w-5 h-5 mr-2" />}
          {props.text} {props.showValue && '• R$ 89,90'}
        </Button>
      );
    
    case 'secondary_button':
      return (
        <Button variant={props.variant || 'outline'} className="w-full">
          {props.text}
        </Button>
      );
    
    case 'loading_indicator':
      return (
        <div className="flex items-center justify-center gap-2 p-4 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#00D26A] rounded-full animate-spin" />
          <span>{props.message}</span>
        </div>
      );

    // Custom Fields
    case 'custom_text':
      return renderField(props.label, props.placeholder);
    
    case 'custom_select':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{props.label}</Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {(props.options || []).map((opt, i) => (
                <SelectItem key={i} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    
    case 'custom_radio':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{props.label}</Label>
          <RadioGroup className={cn(props.layout === 'horizontal' && 'flex gap-4')}>
            {(props.options || []).map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`${element.id}-${i}`} />
                <Label htmlFor={`${element.id}-${i}`}>{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    
    case 'custom_checkbox':
      return (
        <div className="flex items-start space-x-2">
          <Checkbox id={element.id} className="mt-1" />
          <Label htmlFor={element.id} className="text-sm cursor-pointer">
            {props.link ? (
              <span>
                {props.label.split(props.link)[0]}
                <a href="#" className="text-[#00D26A] underline">{props.link}</a>
                {props.label.split(props.link)[1]}
              </span>
            ) : props.label}
          </Label>
        </div>
      );

    default:
      return (
        <div className="p-4 border border-dashed rounded-lg text-center text-gray-400">
          Elemento: {type}
        </div>
      );
  }
}