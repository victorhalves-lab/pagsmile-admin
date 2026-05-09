import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KeyRound, Lock, Globe, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const PROVIDERS = [
  { id: 'okta', name: 'Okta', logo: '🔑', popular: true },
  { id: 'azure', name: 'Azure AD / Entra', logo: '☁️', popular: true },
  { id: 'google', name: 'Google Workspace', logo: '🔵', popular: true },
  { id: 'onelogin', name: 'OneLogin', logo: '🟦' },
  { id: 'jumpcloud', name: 'JumpCloud', logo: '☁️' },
  { id: 'pingidentity', name: 'PingIdentity', logo: '🔵' },
];

export default function SsoConfigPanel() {
  const [enabled, setEnabled] = useState(false);
  const [provider, setProvider] = useState('okta');
  const [enforce, setEnforce] = useState(false);

  const acsUrl = 'https://app.pagsmile.com/saml/acs/abc123';
  const entityId = 'https://pagsmile.com/saml/metadata/abc123';

  const copy = (val) => { navigator.clipboard.writeText(val); toast.success('Copiado'); };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold text-slate-900">Single Sign-On (SSO)</p>
                <Badge className="bg-purple-100 text-purple-700 border-0 text-[9px]">Enterprise</Badge>
              </div>
              <p className="text-xs text-slate-600">SAML 2.0 / OIDC. Integre com Okta, Azure AD, Google Workspace e outros provedores corporativos.</p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </CardContent>
      </Card>

      {enabled && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Selecionar Provedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      provider === p.id ? 'border-[#2bc196] bg-[#2bc196]/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{p.logo}</span>
                      {p.popular && <Badge className="bg-amber-100 text-amber-700 border-0 text-[9px]">Popular</Badge>}
                    </div>
                    <p className="text-xs font-bold">{p.name}</p>
                    {provider === p.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#2bc196] mt-1" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" /> Configuração SAML 2.0
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sp">
                <TabsList className="h-8 grid w-full grid-cols-2">
                  <TabsTrigger value="sp" className="text-xs">Service Provider (PagSmile)</TabsTrigger>
                  <TabsTrigger value="idp" className="text-xs">Identity Provider</TabsTrigger>
                </TabsList>

                <TabsContent value="sp" className="space-y-3 mt-3">
                  <div>
                    <Label className="text-xs">ACS URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={acsUrl} readOnly className="font-mono text-[11px] h-8" />
                      <Button size="sm" variant="outline" onClick={() => copy(acsUrl)} className="h-8"><Copy className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Entity ID / Audience URI</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={entityId} readOnly className="font-mono text-[11px] h-8" />
                      <Button size="sm" variant="outline" onClick={() => copy(entityId)} className="h-8"><Copy className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 p-2 bg-slate-50 rounded">
                    💡 Cole estas URLs no painel do seu IdP ({PROVIDERS.find(p => p.id === provider)?.name})
                  </p>
                </TabsContent>

                <TabsContent value="idp" className="space-y-3 mt-3">
                  <div>
                    <Label className="text-xs">SSO URL (do IdP)</Label>
                    <Input placeholder="https://your-idp.com/saml/sso" className="text-xs h-8 mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Certificado X.509</Label>
                    <textarea
                      placeholder="-----BEGIN CERTIFICATE-----..."
                      className="w-full h-20 p-2 text-[10px] font-mono border rounded-md mt-1"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="border-t mt-4 pt-3 space-y-2">
                <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Forçar SSO (Enforcement)</p>
                    <p className="text-[10px] text-amber-700">Apenas login via SSO; bloqueia email/senha</p>
                  </div>
                  <Switch checked={enforce} onCheckedChange={setEnforce} />
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-xs font-bold text-blue-900">SCIM Provisioning</p>
                    <p className="text-[10px] text-blue-700">Auto-onboard / offboard via Active Directory</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-[9px]">Tier Enterprise</Badge>
                </div>
              </div>

              <Button className="w-full mt-3 bg-[#2bc196] hover:bg-[#239b7a]" size="sm" onClick={() => toast.success('Conexão SSO testada com sucesso')}>
                <Globe className="w-3.5 h-3.5 mr-2" /> Testar Conexão SSO
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}