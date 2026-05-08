import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, QrCode, Download, Code, MessageCircle, Mail, Twitter, Instagram, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentLinkShareTab({ link }) {
  const url = link?.url || `https://pay.pagsmile.com/${link?.slug || 'link'}`;
  const shortUrl = link?.short_url || `https://pag.sm/${link?.id?.slice(0, 6) || 'xxx'}`;
  const embedCode = `<iframe src="${url}?embed=1" width="100%" height="600" frameborder="0"></iframe>`;

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* QR + URLs */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Links e QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">URL canônica</Label>
              <div className="flex gap-2">
                <Input value={url} readOnly className="text-xs font-mono" />
                <Button size="icon" variant="outline" onClick={() => copy(url, 'URL')}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">URL curta</Label>
              <div className="flex gap-2">
                <Input value={shortUrl} readOnly className="text-xs font-mono" />
                <Button size="icon" variant="outline" onClick={() => copy(shortUrl, 'URL curta')}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-2">
              <Code className="w-3.5 h-3.5" /> Embed code (iframe)
            </Label>
            <div className="flex gap-2">
              <textarea
                value={embedCode}
                readOnly
                rows={2}
                className="flex-1 text-xs font-mono p-2 border rounded resize-none bg-slate-50 dark:bg-slate-800"
              />
              <Button size="icon" variant="outline" onClick={() => copy(embedCode, 'Embed')}>
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs font-semibold mb-2">Compartilhar diretamente:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" /> WhatsApp
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Mail className="w-3.5 h-3.5 mr-1 text-blue-500" /> Email
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Instagram className="w-3.5 h-3.5 mr-1 text-pink-500" /> Instagram
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Twitter className="w-3.5 h-3.5 mr-1 text-sky-500" /> Twitter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <QrCode className="w-4 h-4" /> QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square bg-white border rounded-lg flex items-center justify-center mb-3">
            <div className="w-40 h-40 grid grid-cols-8 gap-0.5 p-2">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={i % 3 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-white'}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full text-xs">
              <Download className="w-3.5 h-3.5 mr-1" /> Baixar PNG
            </Button>
            <Button size="sm" variant="outline" className="w-full text-xs">
              <Download className="w-3.5 h-3.5 mr-1" /> Versão p/ impressão (alta resolução)
            </Button>
            <Button size="sm" variant="outline" className="w-full text-xs">
              <Smartphone className="w-3.5 h-3.5 mr-1" /> Preview no Instagram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social previews */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Como aparece nos canais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* WhatsApp */}
          <div className="border rounded-lg p-3 bg-emerald-50/40 dark:bg-emerald-900/10">
            <p className="text-[11px] font-semibold text-emerald-700 mb-2 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </p>
            <div className="bg-white dark:bg-slate-800 rounded p-2 text-xs space-y-1">
              <p className="font-semibold truncate">{link?.name || 'Seu produto'}</p>
              <p className="text-slate-500 line-clamp-2 text-[11px]">{link?.description || 'Compre agora pelo PagSmile'}</p>
              <p className="text-blue-500 text-[11px]">{shortUrl}</p>
            </div>
          </div>
          {/* Email */}
          <div className="border rounded-lg p-3 bg-blue-50/40 dark:bg-blue-900/10">
            <p className="text-[11px] font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email
            </p>
            <div className="bg-white dark:bg-slate-800 rounded p-2 text-xs space-y-1">
              <p className="font-semibold">Assunto: Garanta o seu — {link?.name || 'oferta'}</p>
              <p className="text-slate-500 text-[11px] line-clamp-3">{link?.long_description || link?.description || 'Veja os detalhes...'}</p>
            </div>
          </div>
          {/* Instagram bio */}
          <div className="border rounded-lg p-3 bg-pink-50/40 dark:bg-pink-900/10">
            <p className="text-[11px] font-semibold text-pink-700 mb-2 flex items-center gap-1">
              <Instagram className="w-3 h-3" /> Instagram bio
            </p>
            <div className="bg-white dark:bg-slate-800 rounded p-2 text-xs space-y-1">
              <p className="text-[11px] text-slate-500">📌 Link na bio</p>
              <p className="font-semibold truncate">{link?.name}</p>
              <p className="text-pink-500 text-[11px]">pag.sm/...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}