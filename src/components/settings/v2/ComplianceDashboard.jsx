import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, FileText, ArrowRight, Download, Award } from 'lucide-react';

const FRAMEWORKS = [
  { id: 'pci', name: 'PCI DSS 4.0', desc: 'Payment Card Industry Data Security Standard', status: 'compliant', score: 98, color: 'emerald', requirements: 12, completed: 12, nextAudit: 'Out/2026' },
  { id: 'lgpd', name: 'LGPD', desc: 'Lei Geral de Proteção de Dados (Brasil)', status: 'attention', score: 78, color: 'amber', requirements: 18, completed: 14, pending: ['Privacy policy versioning', 'Cookie consent management', 'Data retention policy'], nextAudit: 'Contínuo' },
  { id: 'soc2', name: 'SOC 2 Type II', desc: 'Service Organization Control', status: 'in-progress', score: 45, color: 'blue', requirements: 64, completed: 29, pending: ['Audit trail universal', 'SSO ativo', 'Access reviews 90d', 'Just-in-time access'], nextAudit: 'Mar/2027 (preparação)' },
  { id: 'iso27001', name: 'ISO 27001', desc: 'Information Security Management', status: 'planned', score: 22, color: 'slate', requirements: 114, completed: 25, nextAudit: 'A planejar' },
];

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
};

const STATUS_LABELS = {
  compliant: { label: 'Conforme', color: 'bg-emerald-600 text-white' },
  attention: { label: 'Atenção', color: 'bg-amber-500 text-white' },
  'in-progress': { label: 'Em progresso', color: 'bg-blue-600 text-white' },
  planned: { label: 'Planejado', color: 'bg-slate-400 text-white' },
};

export default function ComplianceDashboard() {
  return (
    <div className="space-y-4">
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-emerald-900">Compliance Dashboard</p>
              <p className="text-xs text-emerald-700">Status consolidado de frameworks regulatórios</p>
            </div>
            <Button variant="outline" size="sm" className="border-emerald-300">
              <Download className="w-3.5 h-3.5 mr-1" /> Relatório consolidado
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FRAMEWORKS.map((f) => {
          const c = COLOR_MAP[f.color];
          const status = STATUS_LABELS[f.status];
          return (
            <Card key={f.id} className={`border-2 ${c.border} ${c.bg}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${c.text}`} />
                    <div>
                      <CardTitle className="text-sm">{f.name}</CardTitle>
                      <p className="text-[10px] text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                  <Badge className={`${status.color} text-[9px] border-0`}>{status.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-slate-600">{f.completed} de {f.requirements} requisitos</span>
                    <span className={`text-xs font-bold ${c.text}`}>{f.score}%</span>
                  </div>
                  <Progress value={f.score} className="h-1.5" />
                </div>

                {f.pending && f.pending.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      Pendentes ({f.pending.length})
                    </p>
                    <ul className="space-y-0.5">
                      {f.pending.slice(0, 3).map((p, i) => (
                        <li key={i} className="text-[10px] text-slate-600 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-amber-500" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-[10px] text-slate-500">Auditoria: {f.nextAudit}</span>
                  <Button size="sm" variant="ghost" className="h-6 text-[10px]">
                    Detalhes <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" /> LGPD Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          {[
            { label: 'Data Export Request', desc: 'Customer 1-click export', count: '12 este mês' },
            { label: 'Right to be Forgotten', desc: 'Deletion workflow', count: '3 pendentes' },
            { label: 'Consent Management', desc: 'Opt-in tracking', count: '4.521 ativos' },
            { label: 'Cookie Consent', desc: 'Banner LGPD', count: 'Ativo' },
          ].map((tool, i) => (
            <div key={i} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
              <p className="text-xs font-bold">{tool.label}</p>
              <p className="text-[10px] text-slate-500">{tool.desc}</p>
              <Badge variant="outline" className="mt-1 text-[9px]">{tool.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}