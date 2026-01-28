import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Building2,
  Mail,
  Hash,
  Share2,
  Download,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function IBPixReceive() {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrType, setQrType] = useState('static'); // static or dynamic
  const [qrAmount, setQrAmount] = useState('');

  const pixKeys = [
    { type: 'cnpj', value: '98.765.432/0001-10', icon: Building2, label: 'CNPJ' },
    { type: 'email', value: 'financeiro@lojaabc.com.br', icon: Mail, label: 'E-mail' },
    { type: 'random', value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', icon: Hash, label: 'Chave Aleatória' },
  ];

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key.value);
    setCopiedKey(key.type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Receber Pix</h1>
          <p className="text-slate-500 dark:text-slate-400">Compartilhe suas chaves ou gere um QR Code</p>
        </div>
      </div>

      {/* Pix Keys */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Suas Chaves Pix
        </h2>
        <p className="text-sm text-slate-500 mb-4">Compartilhe uma chave para receber Pix:</p>
        
        <Card>
          <CardContent className="p-0 divide-y dark:divide-slate-700">
            {pixKeys.map((key) => (
              <div key={key.type} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <key.icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{key.label}</p>
                    <p className="font-medium text-slate-900 dark:text-white text-sm break-all">
                      {key.value}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(key)}
                  className={cn(
                    "transition-all",
                    copiedKey === key.type && "bg-emerald-50 border-emerald-200 text-emerald-600"
                  )}
                >
                  {copiedKey === key.type ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Generate QR Code */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Gerar QR Code
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-[#00D26A]"
            onClick={() => {
              setQrType('static');
              setShowQrModal(true);
            }}
          >
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <QrCode className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">QR Code Estático</h3>
              <p className="text-sm text-slate-500">
                Sem valor definido. O pagador informa o valor.
              </p>
              <Button className="w-full mt-4 bg-[#00D26A] hover:bg-[#00B85C]">
                Gerar QR
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:border-[#00D26A]"
            onClick={() => {
              setQrType('dynamic');
              setShowQrModal(true);
            }}
          >
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-[#00D26A]/10 flex items-center justify-center mb-4">
                <QrCode className="w-7 h-7 text-[#00D26A]" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">QR Code com Valor</h3>
              <p className="text-sm text-slate-500">
                Defina um valor específico para receber.
              </p>
              <Button className="w-full mt-4 bg-[#00D26A] hover:bg-[#00B85C]">
                Gerar QR
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {qrType === 'static' ? 'QR Code Estático' : 'QR Code com Valor'}
            </DialogTitle>
          </DialogHeader>

          {qrType === 'dynamic' && !qrAmount && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Valor a receber</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">R$</span>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={qrAmount}
                    onChange={(e) => setQrAmount(e.target.value)}
                    className="pl-12 text-xl font-bold h-14"
                  />
                </div>
              </div>
              <Button
                className="w-full bg-[#00D26A] hover:bg-[#00B85C]"
                onClick={() => {}}
                disabled={!qrAmount || parseFloat(qrAmount) <= 0}
              >
                Gerar QR Code
              </Button>
            </div>
          )}

          {(qrType === 'static' || qrAmount) && (
            <div className="space-y-6">
              {/* QR Code Display */}
              <div className="flex flex-col items-center p-6 bg-white rounded-2xl border">
                <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  {/* Placeholder for actual QR code */}
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-4 h-4 rounded-sm",
                          Math.random() > 0.5 ? "bg-slate-900" : "bg-white"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-semibold text-slate-900">Loja ABC Comércio Ltda</p>
                <p className="text-sm text-slate-500">CNPJ: 98.765.432/0001-10</p>
                {qrType === 'dynamic' && qrAmount && (
                  <Badge className="mt-2 bg-[#00D26A] text-white text-lg px-4 py-1">
                    {formatCurrency(parseFloat(qrAmount))}
                  </Badge>
                )}
                {qrType === 'static' && (
                  <Badge variant="outline" className="mt-2">
                    Valor livre
                  </Badge>
                )}
              </div>

              {/* Pix Copia e Cola */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-500">Pix Copia e Cola</Label>
                <div className="relative">
                  <Input
                    readOnly
                    value="00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540550.005802BR5925LOJA ABC COMERCIO LTDA..."
                    className="pr-24 font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      navigator.clipboard.writeText("00020126580014br.gov.bcb.pix...");
                    }}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  E-mail
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}