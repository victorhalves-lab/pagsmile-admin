import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, Sparkles, AlertTriangle, Send, RotateCcw } from 'lucide-react';
import { mockComplianceRules } from '@/components/admin-interno/compliance/onboarding/mocks/complianceExtraMock';

const actionConfig = {
  auto_approve: { label: 'Auto-aprovar', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
  auto_reject: { label: 'Auto-rejeitar', icon: XCircle, color: 'bg-red-100 text-red-700' },
  manual_review: { label: 'Análise manual', icon: AlertTriangle, color: 'bg-amber-100 text-amber-700' },
  request_documents: { label: 'Solicitar docs', icon: Send, color: 'bg-blue-100 text-blue-700' },
  escalate_senior: { label: 'Escalar Sr', icon: Sparkles, color: 'bg-purple-100 text-purple-700' },
  retry_bdc: { label: 'Retry BDC', icon: RotateCcw, color: 'bg-slate-100 text-slate-700' },
};

export default function RulesAndWorkflows() {
  const [rules, setRules] = useState(mockComplianceRules);

  const toggleRule = (id) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold">{rules.length}</p>
          <p className="text-xs text-slate-500">Regras totais</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{rules.filter((r) => r.isActive).length}</p>
          <p className="text-xs text-slate-500">Ativas</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {rules.reduce((s, r) => s + r.executionsCount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Execuções</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {Math.round((rules.reduce((s, r) => s + r.hits, 0) / rules.reduce((s, r) => s + r.executionsCount, 0)) * 100)}%
          </p>
          <p className="text-xs text-slate-500">Hit rate médio</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Regras Automáticas de Compliance</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Workflows aplicados sequencialmente por prioridade ao receber uma submissão</p>
          </div>
          <Button className="bg-[#2bc196] hover:bg-[#25a880]">
            <Plus className="w-4 h-4 mr-2" /> Nova Regra
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Condição</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Execuções</TableHead>
                <TableHead>Hit Rate</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => {
                const cfg = actionConfig[rule.action] || actionConfig.manual_review;
                const Icon = cfg.icon;
                const hitRate = Math.round((rule.hits / rule.executionsCount) * 100);
                return (
                  <TableRow key={rule.id} className={!rule.isActive ? 'opacity-50' : ''}>
                    <TableCell>
                      <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">P{rule.priority}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {rule.conditions}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${cfg.color} border-0 gap-1`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{rule.executionsCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={hitRate > 90 ? 'text-emerald-600 font-bold' : 'text-slate-700'}>
                        {hitRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}