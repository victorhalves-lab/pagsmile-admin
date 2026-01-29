import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Link2, Copy, Check, QrCode, Mail, MessageSquare, Share2,
  ExternalLink, Eye, Settings, Clock, Users, FileText, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data para links gerados
const generatedLinks = [
  {
    id: 'lnk_001',
    name: 'Campanha Q1 2026',
    form_type: 'kyc_full',
    url: 'https://app.pagsmile.com/compliance/form/abc123',
    short_url: 'https://pgsm.io/c/abc123',
    created_date: '2026-01-15',
    expires_at: '2026-03-31',
    uses: 45,
    max_uses: null,
    status: 'active',
    created_by: 'joao@pagsmile.com'
  },
  {
    id: 'lnk_002',
    name: 'Parceiro XYZ',
    form_type: 'kyc_pix',
    url: 'https://app.pagsmile.com/compliance/form/def456',
    short_url: 'https://pgsm.io/c/def456',
    created_date: '2026-01-20',
    expires_at: null,
    uses: 12,
    max_uses: 100,
    status: 'active',
    created_by: 'maria@pagsmile.com'
  },
  {
    id: 'lnk_003',
    name: 'Evento Fintech 2026',
    form_type: 'kyb_enterprise',
    url: 'https://app.pagsmile.com/compliance/form/ghi789',
    short_url: 'https://pgsm.io/c/ghi789',
    created_date: '2026-01-10',
    expires_at: '2026-01-25',
    uses: 78,
    max_uses: null,
    status: 'expired',
    created_by: 'joao@pagsmile.com'
  },
];

const formTypes = [
  { value: 'kyc_full', label: 'KYC Completo (Pix + Cartão)', description: 'Questionário completo para operação com todos os meios' },
  { value: 'kyc_pix', label: 'KYC Pix Only', description: 'Questionário simplificado para operação apenas com Pix' },
  { value: 'kyc_card', label: 'KYC Cartão', description: 'Questionário para operação com cartão de crédito' },
  { value: 'kyb_enterprise', label: 'KYB Enterprise', description: 'Questionário completo para grandes empresas' },
];

export default function FormLinkGenerator() {
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedFormType, setSelectedFormType] = useState('kyc_full');
  const [linkName, setLinkName] = useState('');
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [hasMaxUses, setHasMaxUses] = useState(false);
  const [maxUses, setMaxUses] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [generatedLink, setGeneratedLink] = useState(null);

  const handleCopyLink = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success('Link copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateLink = () => {
    // Simular geração de link
    const newLink = {
      id: `lnk_${Date.now()}`,
      name: linkName || 'Link sem nome',
      form_type: selectedFormType,
      url: `https://app.pagsmile.com/compliance/form/${Math.random().toString(36).substr(2, 9)}`,
      short_url: `https://pgsm.io/c/${Math.random().toString(36).substr(2, 6)}`,
      created_date: new Date().toISOString().split('T')[0],
      expires_at: hasExpiration ? expirationDate : null,
      uses: 0,
      max_uses: hasMaxUses ? parseInt(maxUses) : null,
      status: 'active',
    };
    setGeneratedLink(newLink);
    toast.success('Link gerado com sucesso!');
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-700">Ativo</Badge>;
    }
    return <Badge className="bg-slate-100 text-slate-700">Expirado</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Link do Formulário de Compliance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gere links únicos para enviar aos clientes preencherem o questionário de compliance.
                Os clientes podem acessar e preencher o formulário sem precisar criar conta previamente.
                Após a submissão, eles entrarão automaticamente na fila de análise.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generate" className="gap-2">
            <Sparkles className="w-4 h-4" /> Gerar Novo Link
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="w-4 h-4" /> Links Gerados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configurar Link</CardTitle>
                <CardDescription>Configure as opções do link do formulário</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Nome do Link (opcional)</Label>
                  <Input
                    placeholder="Ex: Campanha Janeiro, Parceiro ABC..."
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">Ajuda a identificar o link posteriormente</p>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Formulário</Label>
                  <Select value={selectedFormType} onValueChange={setSelectedFormType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <p className="font-medium">{type.label}</p>
                            <p className="text-xs text-slate-500">{type.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-sm">Opções Avançadas</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data de Expiração</Label>
                      <p className="text-xs text-slate-500">O link expira após essa data</p>
                    </div>
                    <Switch checked={hasExpiration} onCheckedChange={setHasExpiration} />
                  </div>
                  {hasExpiration && (
                    <Input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Limite de Usos</Label>
                      <p className="text-xs text-slate-500">Máximo de submissões permitidas</p>
                    </div>
                    <Switch checked={hasMaxUses} onCheckedChange={setHasMaxUses} />
                  </div>
                  {hasMaxUses && (
                    <Input
                      type="number"
                      placeholder="Ex: 100"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                    />
                  )}

                  <div className="space-y-2">
                    <Label>UTM Source (opcional)</Label>
                    <Input
                      placeholder="Ex: email, whatsapp, parceiro_xyz"
                      value={utmSource}
                      onChange={(e) => setUtmSource(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">Para rastrear a origem das submissões</p>
                  </div>
                </div>

                <Button onClick={handleGenerateLink} className="w-full gap-2 bg-[#2bc196] hover:bg-[#239b7a]">
                  <Link2 className="w-4 h-4" /> Gerar Link
                </Button>
              </CardContent>
            </Card>

            {/* Preview & Result */}
            <div className="space-y-6">
              {generatedLink ? (
                <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-green-700">
                      <Check className="w-5 h-5" /> Link Gerado com Sucesso!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Link Completo</Label>
                      <div className="flex gap-2">
                        <Input value={generatedLink.url} readOnly className="bg-white" />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleCopyLink(generatedLink.url, 'full')}
                        >
                          {copiedId === 'full' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Link Curto</Label>
                      <div className="flex gap-2">
                        <Input value={generatedLink.short_url} readOnly className="bg-white" />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleCopyLink(generatedLink.short_url, 'short')}
                        >
                          {copiedId === 'short' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1 gap-2">
                        <QrCode className="w-4 h-4" /> QR Code
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <Mail className="w-4 h-4" /> Enviar por Email
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <MessageSquare className="w-4 h-4" /> WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <Link2 className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Nenhum link gerado</h3>
                      <p className="text-sm text-slate-500">Configure as opções e clique em "Gerar Link"</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Como Funciona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                      <div>
                        <p className="font-medium text-sm">Gere o link</p>
                        <p className="text-xs text-slate-500">Escolha o tipo de formulário e configure as opções</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                      <div>
                        <p className="font-medium text-sm">Envie ao cliente</p>
                        <p className="text-xs text-slate-500">Por email, WhatsApp ou qualquer canal</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                      <div>
                        <p className="font-medium text-sm">Cliente preenche</p>
                        <p className="text-xs text-slate-500">Sem necessidade de criar conta antes</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">4</div>
                      <div>
                        <p className="font-medium text-sm">Entra na fila</p>
                        <p className="text-xs text-slate-500">A submissão aparece automaticamente na Fila de Compliance</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Links Gerados</CardTitle>
              <CardDescription>Histórico de todos os links de formulário criados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedLinks.map((link) => (
                  <div 
                    key={link.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 dark:text-white">{link.name}</p>
                          {getStatusBadge(link.status)}
                        </div>
                        <p className="text-sm text-slate-500">{link.short_url}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {link.uses} usos
                            {link.max_uses && ` / ${link.max_uses}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Criado em {link.created_date}
                          </span>
                          {link.expires_at && (
                            <span className="flex items-center gap-1">
                              Expira em {link.expires_at}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyLink(link.short_url, link.id)}
                        disabled={link.status !== 'active'}
                      >
                        {copiedId === link.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}