import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  Key,
  QrCode,
  Copy,
  ArrowLeft,
  ArrowRight,
  User,
  Building2,
  Mail,
  Phone,
  Hash,
  CheckCircle2,
  Repeat,
  Star,
  Lock,
  FileText,
  Share2,
  Home,
  Wallet,
  Camera,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function IBPixSend() {
  const [step, setStep] = useState(0); // 0: choose method, 1: key, 2: value, 3: confirm, 4: success
  const [sendMethod, setSendMethod] = useState('key');
  const [keyType, setKeyType] = useState('cnpj');
  const [pixKey, setPixKey] = useState('');
  const [recipientFound, setRecipientFound] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleType, setScheduleType] = useState('now');
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const [password, setPassword] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const balance = 125430.50;

  // Mock recipient data
  const recipient = {
    name: 'Fornecedor ABC Ltda',
    document: '12.345.678/0001-90',
    bank: 'Banco do Brasil (001)'
  };

  // Mock favorites
  const favorites = [
    { id: 1, name: 'Fornec. ABC', key: 'forn@abc.com' },
    { id: 2, name: 'Aluguel Imobiliária', key: '12.345.678/0001-90' },
    { id: 3, name: 'Contador João', key: 'joao@contabil.com' },
  ];

  // Mock recent transactions
  const recentSent = [
    { id: 1, name: 'Fornecedor ABC', amount: 2500.00, date: 'Hoje 11:15' },
    { id: 2, name: 'Aluguel - Imobiliária', amount: 3500.00, date: 'Ontem 10:00' },
    { id: 3, name: 'Contador João', amount: 800.00, date: '20/01' },
  ];

  const handleKeySearch = () => {
    if (pixKey.length > 5) {
      setRecipientFound(true);
    }
  };

  const keyTypeIcons = {
    cnpj: <Building2 className="w-5 h-5" />,
    cpf: <User className="w-5 h-5" />,
    email: <Mail className="w-5 h-5" />,
    phone: <Phone className="w-5 h-5" />,
    random: <Hash className="w-5 h-5" />
  };

  // Step 0: Choose send method
  if (step === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enviar Pix</h1>
            <p className="text-slate-500 dark:text-slate-400">Escolha como deseja enviar</p>
          </div>
        </div>

        {/* Balance */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
          <CardContent className="p-4 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-[#00D26A]" />
            <div>
              <p className="text-xs text-slate-400">Saldo Disponível</p>
              <p className="text-lg font-bold">{formatCurrency(balance)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Send Methods */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Como deseja enviar?
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                sendMethod === 'key' && "ring-2 ring-[#00D26A] border-[#00D26A]"
              )}
              onClick={() => { setSendMethod('key'); setStep(1); }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-3",
                  sendMethod === 'key' ? "bg-[#00D26A]/20" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  <Key className={cn("w-6 h-6", sendMethod === 'key' ? "text-[#00D26A]" : "text-slate-500")} />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">Por Chave</p>
                <p className="text-xs text-slate-500 mt-1">CPF, e-mail, telefone...</p>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                sendMethod === 'qr' && "ring-2 ring-[#00D26A] border-[#00D26A]"
              )}
              onClick={() => { setSendMethod('qr'); setStep(1); }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-3",
                  sendMethod === 'qr' ? "bg-[#00D26A]/20" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  <QrCode className={cn("w-6 h-6", sendMethod === 'qr' ? "text-[#00D26A]" : "text-slate-500")} />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">QR Code</p>
                <p className="text-xs text-slate-500 mt-1">Ler ou colar QR Code</p>
              </CardContent>
            </Card>

            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                sendMethod === 'copy' && "ring-2 ring-[#00D26A] border-[#00D26A]"
              )}
              onClick={() => { setSendMethod('copy'); setStep(1); }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-3",
                  sendMethod === 'copy' ? "bg-[#00D26A]/20" : "bg-slate-100 dark:bg-slate-800"
                )}>
                  <Copy className={cn("w-6 h-6", sendMethod === 'copy' ? "text-[#00D26A]" : "text-slate-500")} />
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">Copia e Cola</p>
                <p className="text-xs text-slate-500 mt-1">Colar código Pix</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Favorites */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Favoritos
            </h2>
            <Button variant="ghost" size="sm" className="text-[#00D26A]">
              Ver todos
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {favorites.map((fav) => (
              <Card
                key={fav.id}
                className="cursor-pointer hover:shadow-lg transition-all min-w-[120px] flex-shrink-0"
                onClick={() => {
                  setPixKey(fav.key);
                  setRecipientFound(true);
                  setSendMethod('key');
                  setStep(2);
                }}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate w-full">{fav.name}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="cursor-pointer hover:shadow-lg transition-all min-w-[120px] flex-shrink-0 border-dashed">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">Adicionar</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Últimos Pix Enviados
          </h2>
          <Card>
            <CardContent className="p-0 divide-y dark:divide-slate-700">
              {recentSent.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => {
                    setSendMethod('key');
                    setStep(2);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</p>
                    <Button variant="ghost" size="sm" className="text-[#00D26A]">
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 1: Enter key / QR Code / Copy-paste
  if (step === 1) {
    if (sendMethod === 'qr') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setStep(0)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">QR Code</h1>
              <p className="text-slate-500 dark:text-slate-400">Ler ou colar código Pix</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 flex flex-col items-center">
              <div className="w-64 h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center mb-4">
                <Camera className="w-12 h-12 text-slate-400 mb-3" />
                <p className="text-slate-500 text-center">Aponte para o QR Code</p>
              </div>
              <p className="text-sm text-slate-500 mb-4">ou</p>
              <div className="w-full space-y-4">
                <Textarea
                  placeholder="Cole o código Pix Copia e Cola aqui..."
                  className="min-h-[100px] font-mono text-sm"
                />
                <Button variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Colar da área de transferência
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar imagem do QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Send by key
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep(0)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enviar por Chave</h1>
            <p className="text-slate-500 dark:text-slate-400">Etapa 1 de 3: Destinatário</p>
          </div>
        </div>

        {/* Key Type Selection */}
        <div>
          <Label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 block">
            Tipo de Chave
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'cnpj', label: 'CPF/CNPJ', icon: Building2 },
              { id: 'email', label: 'E-mail', icon: Mail },
              { id: 'phone', label: 'Telefone', icon: Phone },
              { id: 'random', label: 'Aleatória', icon: Hash },
            ].map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all",
                  keyType === type.id && "ring-2 ring-[#00D26A] border-[#00D26A]"
                )}
                onClick={() => setKeyType(type.id)}
              >
                <CardContent className="p-3 flex flex-col items-center">
                  <type.icon className={cn(
                    "w-5 h-5 mb-1",
                    keyType === type.id ? "text-[#00D26A]" : "text-slate-400"
                  )} />
                  <span className="text-xs text-center">{type.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Input */}
        <div className="space-y-2">
          <Label>Chave Pix</Label>
          <Input
            placeholder={
              keyType === 'cnpj' ? '00.000.000/0000-00' :
              keyType === 'email' ? 'email@exemplo.com' :
              keyType === 'phone' ? '(00) 00000-0000' :
              'Chave aleatória'
            }
            value={pixKey}
            onChange={(e) => {
              setPixKey(e.target.value);
              setRecipientFound(false);
            }}
            onBlur={handleKeySearch}
          />
        </div>

        {/* Recipient Found */}
        {recipientFound && (
          <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-700 dark:text-emerald-400">Chave encontrada</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="text-slate-500">Nome:</span> <span className="font-medium text-slate-900 dark:text-white">{recipient.name}</span></p>
                <p><span className="text-slate-500">CNPJ:</span> <span className="font-medium text-slate-900 dark:text-white">{recipient.document}</span></p>
                <p><span className="text-slate-500">Banco:</span> <span className="font-medium text-slate-900 dark:text-white">{recipient.bank}</span></p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => setStep(2)}
            disabled={!recipientFound}
            className="flex-1 bg-[#00D26A] hover:bg-[#00B85C]"
          >
            Continuar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Enter amount and description
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Informar Valor</h1>
            <p className="text-slate-500 dark:text-slate-400">Etapa 2 de 3: Valor</p>
          </div>
        </div>

        {/* Recipient Summary */}
        <Card className="bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{recipient.name}</p>
              <p className="text-sm text-slate-500">{recipient.document}</p>
            </div>
          </CardContent>
        </Card>

        {/* Amount */}
        <div className="space-y-2">
          <Label>Valor</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">R$</span>
            <Input
              type="number"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-14 text-2xl font-bold h-16"
            />
          </div>
          <p className="text-sm text-slate-500">
            Saldo disponível: {formatCurrency(balance)}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Descrição (opcional)</Label>
          <Textarea
            placeholder="Ex: Pagamento NF 4567 - Material de escritório"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={140}
          />
          <p className="text-xs text-slate-500 text-right">{description.length}/140 caracteres</p>
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          <Label>Quando enviar?</Label>
          <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="now" />
              <Label htmlFor="now" className="font-normal">Agora</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="schedule" id="schedule" />
              <Label htmlFor="schedule" className="font-normal">Agendar para outra data</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Save as favorite */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="favorite"
            checked={saveAsFavorite}
            onCheckedChange={setSaveAsFavorite}
          />
          <Label htmlFor="favorite" className="font-normal">Salvar como favorito</Label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => setStep(3)}
            disabled={!amount || parseFloat(amount) <= 0}
            className="flex-1 bg-[#00D26A] hover:bg-[#00B85C]"
          >
            Continuar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Confirmation
  if (step === 3) {
    const amountValue = parseFloat(amount) || 0;
    const balanceAfter = balance - amountValue;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep(2)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Confirmar Pix</h1>
            <p className="text-slate-500 dark:text-slate-400">Etapa 3 de 3: Confirmar</p>
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-slate-50 dark:bg-slate-800/50">
          <CardContent className="p-6 space-y-4">
            <div className="text-center pb-4 border-b dark:border-slate-700">
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Valor</p>
              <p className="text-4xl font-bold text-[#00D26A]">{formatCurrency(amountValue)}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Destinatário</span>
                <span className="font-medium text-slate-900 dark:text-white">{recipient.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CNPJ</span>
                <span className="font-medium text-slate-900 dark:text-white">{recipient.document}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Instituição</span>
                <span className="font-medium text-slate-900 dark:text-white">{recipient.bank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chave</span>
                <span className="font-medium text-slate-900 dark:text-white">{pixKey || recipient.document}</span>
              </div>
              {description && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Descrição</span>
                  <span className="font-medium text-slate-900 dark:text-white max-w-[200px] text-right">{description}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Data/Hora</span>
                <span className="font-medium text-slate-900 dark:text-white">Agora</span>
              </div>
            </div>

            <div className="pt-4 border-t dark:border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Saldo após transação</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(balanceAfter)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <div className="space-y-2">
          <Label>Digite sua senha para confirmar</Label>
          <Input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center text-2xl tracking-widest"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => setStep(4)}
            disabled={password.length < 4}
            className="flex-1 bg-[#00D26A] hover:bg-[#00B85C]"
          >
            <Lock className="w-4 h-4 mr-2" />
            Confirmar e Enviar
          </Button>
        </div>
      </div>
    );
  }

  // Step 4: Success
  if (step === 4) {
    const amountValue = parseFloat(amount) || 0;

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Pix Enviado com Sucesso!</h1>
            <p className="text-4xl font-bold mb-2">{formatCurrency(amountValue)}</p>
            <p className="text-emerald-100">27/01/2026 às 15:32:45</p>
          </CardContent>
        </Card>

        {/* Receipt */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comprovante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">ID da Transação</span>
              <span className="font-mono text-slate-900 dark:text-white">PIX-2026012715324598765</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">End-to-End ID</span>
              <span className="font-mono text-xs text-slate-900 dark:text-white">E987654322026...</span>
            </div>
            <div className="border-t dark:border-slate-700 pt-3 flex justify-between">
              <span className="text-slate-500">Valor</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(amountValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Destinatário</span>
              <span className="text-slate-900 dark:text-white">{recipient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CNPJ</span>
              <span className="text-slate-900 dark:text-white">{recipient.document}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Instituição</span>
              <span className="text-slate-900 dark:text-white">{recipient.bank}</span>
            </div>
            <div className="border-t dark:border-slate-700 pt-3 flex justify-between">
              <span className="text-slate-500">Pagador</span>
              <span className="text-slate-900 dark:text-white">Loja ABC Comércio Ltda</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CNPJ</span>
              <span className="text-slate-900 dark:text-white">98.765.432/0001-10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Instituição</span>
              <span className="text-slate-900 dark:text-white">PagSmile (XXX)</span>
            </div>
            {description && (
              <div className="border-t dark:border-slate-700 pt-3 flex justify-between">
                <span className="text-slate-500">Descrição</span>
                <span className="text-slate-900 dark:text-white max-w-[200px] text-right">{description}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        <Link to={createPageUrl('IBHome')}>
          <Button variant="ghost" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </Link>
      </div>
    );
  }

  return null;
}