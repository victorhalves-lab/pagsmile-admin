import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, FileText, Download, Receipt, AlertCircle, Sparkles } from 'lucide-react';

const REGIMES = [
  { value: 'simples', label: 'Simples Nacional', desc: 'Faturamento até R$ 4.8M/ano' },
  { value: 'presumido', label: 'Lucro Presumido', desc: 'Até R$ 78M/ano · Trib. simplificada' },
  { value: 'real', label: 'Lucro Real', desc: 'Acima de R$ 78M ou opcional' },
  { value: 'mei', label: 'MEI', desc: 'Microempreendedor · até R$ 81k/ano' },
];

export default function FiscalSettingsPanel() {
  const [regime, setRegime] = useState('presumido');
  const [nfeEnabled, setNfeEnabled] = useState(false);
  const [stEnabled, setStEnabled] = useState(false);

  return (
    <div className="space-y-4">
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Configurações Fiscais BR</p>
            <p className="text-xs text-amber-700">Necessárias para emissão de NF-e, retenções e compliance fiscal brasileiro.</p>
          </div>
          <Badge className="bg-amber-500 text-white border-0 text-[9px]">Diferencial BR</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Regime Tributário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {REGIMES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRegime(r.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  regime === r.value ? 'border-[#2bc196] bg-[#2bc196]/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="text-xs font-bold">{r.label}</p>
                <p className="text-[10px] text-slate-500">{r.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div>
              <Label className="text-xs">CNAE Principal</Label>
              <Input defaultValue="6612-6/04" className="font-mono text-xs h-8 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Inscrição Estadual</Label>
              <Input defaultValue="111.222.333.444" className="font-mono text-xs h-8 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Inscrição Municipal</Label>
              <Input defaultValue="98765-4" className="font-mono text-xs h-8 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Atividade Econômica</Label>
              <Select defaultValue="services">
                <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="services" className="text-xs">Prestação de serviços</SelectItem>
                  <SelectItem value="ecommerce" className="text-xs">E-commerce</SelectItem>
                  <SelectItem value="retail" className="text-xs">Comércio varejista</SelectItem>
                  <SelectItem value="industry" className="text-xs">Indústria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4" /> NF-e Eletrônica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Emissão automática de NF-e</p>
              <p className="text-[11px] text-slate-500">Gera NF para cada transação aprovada</p>
            </div>
            <Switch checked={nfeEnabled} onCheckedChange={setNfeEnabled} />
          </div>

          {nfeEnabled && (
            <div className="space-y-2 pl-2 border-l-2 border-emerald-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Provedor NF-e</Label>
                  <Select defaultValue="bling">
                    <SelectTrigger className="h-8 text-xs mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bling" className="text-xs">Bling</SelectItem>
                      <SelectItem value="omie" className="text-xs">Omie</SelectItem>
                      <SelectItem value="contaazul" className="text-xs">ContaAzul</SelectItem>
                      <SelectItem value="tecnospeed" className="text-xs">Tecnospeed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Série</Label>
                  <Input defaultValue="1" className="h-8 text-xs mt-1" />
                </div>
              </div>
              <div className="p-2 bg-blue-50 rounded text-[11px] text-blue-700 flex items-start gap-1.5">
                <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Conecte plugins fiscais brasileiros via Marketplace de Apps para automação completa.</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Substituição Tributária</p>
              <p className="text-[11px] text-slate-500">Para verticais específicos (ICMS-ST)</p>
            </div>
            <Switch checked={stEnabled} onCheckedChange={setStEnabled} />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Retenções automáticas</p>
              <p className="text-[11px] text-slate-500">IRRF, CSLL, COFINS, PIS, ISS</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> Documentos & Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {[
            'Contrato Social',
            'Comprovante CNPJ',
            'Inscrição Estadual',
            'Alvará Municipal',
            'Procuração Sócios',
            'Última Apuração de Impostos',
          ].map((doc, i) => (
            <div key={i} className="p-2 border rounded-lg flex items-center justify-between hover:bg-slate-50">
              <span className="text-xs">{doc}</span>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}