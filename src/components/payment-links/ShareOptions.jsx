import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Copy, 
  Check, 
  QrCode, 
  Mail, 
  MessageCircle, 
  Smartphone, 
  Facebook, 
  Linkedin, 
  Twitter,
  Instagram,
  Code,
  Download,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function ShareOptions({ link, onClose }) {
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState(`Pagamento: ${link?.name || ''}`);
  const [emailMessage, setEmailMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState(
    `Olá! Segue o link para pagamento de ${link?.name || ''}:\n\n${link?.short_url || link?.url || ''}`
  );
  const [smsPhone, setSmsPhone] = useState('');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link?.url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${link?.name} - ${formatCurrency(link?.amount)}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(link?.url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link?.url)}`, '_blank');
  };

  const generateEmbedCode = () => {
    return `<a href="${link?.url}" target="_blank" style="display:inline-block;background-color:#00D26A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-family:sans-serif;font-weight:600;">Pagar ${formatCurrency(link?.amount)}</a>`;
  };

  if (!link) return null;

  return (
    <div className="space-y-6">
      {/* Quick Copy */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">URL Completa</Label>
          <div className="flex gap-2 mt-1.5">
            <Input value={link.url || ''} readOnly className="font-mono text-sm" />
            <Button onClick={() => copyToClipboard(link.url)} variant="outline">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {link.short_url && (
          <div>
            <Label className="text-sm font-medium">URL Curta</Label>
            <div className="flex gap-2 mt-1.5">
              <Input value={link.short_url} readOnly className="font-mono text-sm" />
              <Button onClick={() => copyToClipboard(link.short_url)} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="qrcode" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="qrcode"><QrCode className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="email"><Mail className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="whatsapp"><MessageCircle className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="social"><Facebook className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="embed"><Code className="w-4 h-4" /></TabsTrigger>
        </TabsList>

        {/* QR Code */}
        <TabsContent value="qrcode" className="mt-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-4">QR Code para {link.name}</p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email" className="mt-4 space-y-4">
          <div>
            <Label>E-mail do destinatário</Label>
            <Input
              type="email"
              placeholder="cliente@email.com"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Assunto</Label>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Mensagem</Label>
            <Textarea
              placeholder="Mensagem personalizada..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              className="mt-1.5 h-24"
            />
          </div>
          <Button className="w-full bg-[#00D26A] hover:bg-[#00A854]">
            <Mail className="w-4 h-4 mr-2" />
            Enviar E-mail
          </Button>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp" className="mt-4 space-y-4">
          <div>
            <Label>Mensagem</Label>
            <Textarea
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              className="mt-1.5 h-32"
            />
          </div>
          <Button onClick={openWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            Abrir WhatsApp
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Abre o WhatsApp com a mensagem pronta para enviar
          </p>
        </TabsContent>

        {/* Social */}
        <TabsContent value="social" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={shareOnFacebook} variant="outline" className="h-16 flex-col gap-1">
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button onClick={() => copyToClipboard(link.url)} variant="outline" className="h-16 flex-col gap-1">
              <Instagram className="w-5 h-5 text-pink-600" />
              <span className="text-xs">Instagram</span>
            </Button>
            <Button onClick={shareOnTwitter} variant="outline" className="h-16 flex-col gap-1">
              <Twitter className="w-5 h-5 text-sky-500" />
              <span className="text-xs">Twitter/X</span>
            </Button>
            <Button onClick={shareOnLinkedIn} variant="outline" className="h-16 flex-col gap-1">
              <Linkedin className="w-5 h-5 text-blue-700" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>
        </TabsContent>

        {/* Embed */}
        <TabsContent value="embed" className="mt-4 space-y-4">
          <div>
            <Label>Código para incorporar em seu site</Label>
            <Textarea
              value={generateEmbedCode()}
              readOnly
              className="mt-1.5 h-24 font-mono text-xs"
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#00D26A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00A854]"
            >
              Pagar {formatCurrency(link.amount)}
            </a>
          </div>
          <Button onClick={() => copyToClipboard(generateEmbedCode())} variant="outline" className="w-full">
            <Copy className="w-4 h-4 mr-2" />
            Copiar Código
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}