import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User, Mail, Phone, MapPin, ExternalLink, Globe, Smartphone,
  Fingerprint, Shield, Calendar, ShoppingBag, AlertTriangle, CheckCircle,
} from 'lucide-react';

/**
 * Dados completos do cliente/pagador: identificação, contato, endereço,
 * dispositivo, IP, KYC e histórico resumido.
 */
export default function CustomerDetailCard({ transaction }) {
  const c = transaction.customer || {};
  const name = c.name || transaction.customer_name || 'Cliente';
  const email = c.email || transaction.customer_email || 'cliente@exemplo.com';
  const doc = c.document || transaction.customer_document || '123.456.789-00';
  const phone = c.phone || '(11) 99999-9999';
  const ip = c.ip || '187.45.123.89';
  const deviceId = c.device_id || 'dev_a1b2c3d4e5f6';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4 text-slate-500" />
          Dados do Cliente / Pagador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header: avatar + status */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-900 truncate">{name}</p>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
                <CheckCircle className="w-3 h-3" /> Verificado
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">CPF: {doc}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Cliente desde Set/2024 · 14 transações</p>
          </div>
        </div>

        <Separator />

        {/* Contato */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Contato</p>
          <Field icon={Mail} label="E-mail" value={email} />
          <Field icon={Phone} label="Telefone" value={phone} />
          <Field icon={MapPin} label="Endereço" value="Av. Paulista, 1000 — Bela Vista, São Paulo/SP, 01310-100" multiline />
        </div>

        <Separator />

        {/* Dispositivo / IP */}
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Dispositivo & Sessão</p>
          <Field icon={Globe} label="IP" value={`${ip} · São Paulo/BR`} mono />
          <Field icon={Smartphone} label="User Agent" value="Mozilla/5.0 (iPhone; iOS 17.2)" mono />
          <Field icon={Fingerprint} label="Device ID" value={deviceId} mono />
        </div>

        <Separator />

        {/* KYC / Risco */}
        <div className="grid grid-cols-2 gap-2">
          <StatCell icon={Shield} label="KYC" value="Aprovado" color="emerald" />
          <StatCell icon={AlertTriangle} label="Risco" value="Baixo" color="emerald" />
          <StatCell icon={ShoppingBag} label="Pedidos" value="14" color="slate" />
          <StatCell icon={Calendar} label="Última compra" value="3 dias atrás" color="slate" />
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver Perfil 360° do Cliente
        </Button>
      </CardContent>
    </Card>
  );
}

function Field({ icon: Icon, label, value, mono, multiline }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-slate-400">{label}</p>
        <p className={`text-slate-700 ${mono ? 'font-mono' : ''} ${multiline ? '' : 'truncate'}`}>{value}</p>
      </div>
    </div>
  );
}

function StatCell({ icon: Icon, label, value, color }) {
  const palette = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  return (
    <div className={`rounded-lg p-2 border ${palette[color]}`}>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide font-semibold opacity-80">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
}