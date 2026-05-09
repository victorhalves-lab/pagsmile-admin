import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck, Building2, User, Mail, Phone, MapPin, CreditCard, FileText, Clock, Sparkles, Crown, ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const fmtBRL = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function MentorBeneficiaryDetailPanel({ beneficiary }) {
  if (!beneficiary) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-500">
          Selecione um beneficiário para ver os detalhes 360º
        </CardContent>
      </Card>
    );
  }

  const TypeIcon = beneficiary.type === 'company' ? Building2 : User;

  return (
    <div className="space-y-3">
      {/* Identidade */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${beneficiary.type === 'company' ? 'bg-blue-100 text-blue-600' : 'bg-violet-100 text-violet-600'}`}>
              <TypeIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-black text-slate-900 dark:text-white">{beneficiary.name}</p>
                {beneficiary.is_pep && (
                  <Badge className="bg-amber-100 text-amber-700 gap-1">
                    <Crown className="w-3 h-3" /> PEP {beneficiary.pep_role && `· ${beneficiary.pep_role}`}
                  </Badge>
                )}
                <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                  <ShieldCheck className="w-3 h-3" /> KYC verificado · score {beneficiary.kyc_score}/100
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {beneficiary.document} · KYC válido até {new Date(beneficiary.kyc_expires_at).toLocaleDateString('pt-BR')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] mt-3">
                <div className="flex items-center gap-1 text-slate-600"><Mail className="w-3 h-3" /> {beneficiary.email}</div>
                <div className="flex items-center gap-1 text-slate-600"><Phone className="w-3 h-3" /> {beneficiary.phone}</div>
                <div className="flex items-center gap-1 text-slate-600"><MapPin className="w-3 h-3" /> {beneficiary.address}</div>
                <div className="flex items-center gap-1 text-slate-600"><CreditCard className="w-3 h-3" /> {beneficiary.bank_account}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de recebimento */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            Histórico mensal de recebimento (6m)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={beneficiary.monthly_history}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip formatter={(v) => fmtBRL(v)} />
                <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Splits ativos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Splits Ativos ({beneficiary.active_splits.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {beneficiary.active_splits.map((s) => (
            <Link key={s.split_id} to={createPageUrl('SplitDetail360')}>
              <div className="flex items-center justify-between p-2 rounded-lg border hover:border-violet-300 transition cursor-pointer flex-wrap gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{s.split_name}</p>
                  <code className="text-[10px] font-mono text-slate-500">{s.split_id}</code>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{s.share_pct}%</Badge>
                  <span className="text-xs font-bold text-emerald-700">{fmtBRL(s.avg_monthly_received)}/mês</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Tax docs + audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-600" /> Documentos Fiscais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {beneficiary.tax_documents.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] p-2 rounded border">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{d.doc} {d.year}</span>
                <Badge className="bg-emerald-100 text-emerald-700 text-[9px]">enviado em {new Date(d.sent_at).toLocaleDateString('pt-BR')}</Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full h-7 text-[11px] mt-2">Gerar informe atual</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-600" /> Histórico de Auditoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {beneficiary.audit_log.map((e, i) => (
              <div key={i} className="text-[11px] flex gap-2 py-1 border-b last:border-0">
                <span className="text-slate-400 font-mono text-[10px] w-20 flex-shrink-0">{new Date(e.date).toLocaleDateString('pt-BR')}</span>
                <span className="text-slate-700 dark:text-slate-200">{e.event}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}