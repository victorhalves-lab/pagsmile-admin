import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Globe, Plus, Trash2, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';

const INITIAL_IPS = [
  { ip: '187.45.123.0/24', label: 'Escritório SP', country: 'BR' },
  { ip: '201.10.50.42', label: 'Home office CEO', country: 'BR' },
];

const COUNTRIES = ['BR', 'US', 'PT', 'AR', 'MX', 'CO'];

export default function IpAllowlistPanel() {
  const [enabled, setEnabled] = useState(false);
  const [ips, setIps] = useState(INITIAL_IPS);
  const [newIp, setNewIp] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [allowedCountries, setAllowedCountries] = useState(['BR']);

  const addIp = () => {
    if (!newIp) return;
    setIps([...ips, { ip: newIp, label: newLabel || 'Sem nome', country: 'BR' }]);
    setNewIp('');
    setNewLabel('');
    toast.success('IP adicionado');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-600" />
          IP Allowlist & Geo Restrictions
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[9px]">Anti-fraud</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="text-sm font-medium">Restringir acesso por IP</p>
            <p className="text-[11px] text-slate-500">Apenas IPs listados poderão acessar este admin</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {enabled && (
          <div className="space-y-2 pl-2 border-l-2 border-emerald-200">
            <p className="text-xs font-bold text-slate-700">IPs Permitidos ({ips.length})</p>
            {ips.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-white px-2 py-0.5 rounded border">{item.ip}</code>
                  <span className="text-xs text-slate-600">{item.label}</span>
                  <Badge variant="outline" className="text-[9px]">{item.country}</Badge>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => setIps(ips.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <Input placeholder="IP ou CIDR (ex: 192.168.1.0/24)" value={newIp} onChange={(e) => setNewIp(e.target.value)} className="text-xs h-8 font-mono" />
              <Input placeholder="Nome" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="text-xs h-8 w-40" />
              <Button size="sm" variant="outline" onClick={addIp} className="h-8">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            <div>
              <p className="text-sm font-medium">Restringir por geolocalização</p>
              <p className="text-[11px] text-slate-500">Bloquear logins de fora destes países</p>
            </div>
          </div>
          <Switch checked={geoEnabled} onCheckedChange={setGeoEnabled} />
        </div>

        {geoEnabled && (
          <div className="pl-2 border-l-2 border-emerald-200 space-y-2">
            <Label className="text-xs">Países permitidos</Label>
            <div className="flex flex-wrap gap-1.5">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setAllowedCountries(allowedCountries.includes(c) ? allowedCountries.filter((x) => x !== c) : [...allowedCountries, c])}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    allowedCountries.includes(c) ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  {c} {allowedCountries.includes(c) && <X className="w-3 h-3 inline ml-0.5" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}