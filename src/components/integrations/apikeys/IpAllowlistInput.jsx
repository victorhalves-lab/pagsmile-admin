import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Globe } from 'lucide-react';

export default function IpAllowlistInput({ ips = [], onChange }) {
  const [input, setInput] = useState('');

  const addIp = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (ips.includes(trimmed)) return;
    onChange?.([...ips, trimmed]);
    setInput('');
  };

  const removeIp = (ip) => onChange?.(ips.filter((x) => x !== ip));

  return (
    <div className="space-y-2">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
          <Globe className="w-3 h-3" /> IP Allowlist (opcional)
        </Label>
        <p className="text-xs text-slate-500 mt-1">Esta chave só funcionará se vier dos IPs listados. Suporta CIDR (ex: 192.168.0.0/24).</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Ex: 200.150.20.10 ou 200.150.0.0/16"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIp())}
          className="text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={addIp}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {ips.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {ips.map((ip) => (
            <Badge key={ip} variant="outline" className="font-mono text-xs gap-1 pl-2 pr-1 py-1">
              {ip}
              <button onClick={() => removeIp(ip)} className="ml-1 p-0.5 rounded hover:bg-red-100">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {ips.length === 0 && <p className="text-xs text-slate-400 italic">Sem restrição de IP — chave aceita de qualquer origem.</p>}
    </div>
  );
}