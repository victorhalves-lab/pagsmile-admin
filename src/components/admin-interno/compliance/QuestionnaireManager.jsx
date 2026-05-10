import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Search, Plus, FileText, Edit3, Eye, Copy, Activity, Clock,
} from 'lucide-react';
import { mockQuestionnaireTemplates } from '@/components/admin-interno/compliance/onboarding/mocks/complianceExtraMock';

export default function QuestionnaireManager() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockQuestionnaireTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.model.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold">{mockQuestionnaireTemplates.length}</p>
          <p className="text-xs text-slate-500">Templates totais</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {mockQuestionnaireTemplates.filter((t) => t.isActive).length}
          </p>
          <p className="text-xs text-slate-500">Ativos</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {mockQuestionnaireTemplates.reduce((s, t) => s + t.submissionsCount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Submissões totais</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {Math.round(mockQuestionnaireTemplates.reduce((s, t) => s + t.completionAvg, 0) / mockQuestionnaireTemplates.length)}min
          </p>
          <p className="text-xs text-slate-500">Tempo médio</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar template ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-[#2bc196] hover:bg-[#25a880]">
            <Plus className="w-4 h-4 mr-2" /> Novo Template
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <p className="text-xs text-slate-500 font-mono">{t.model}</p>
                  </div>
                </div>
                <Switch checked={t.isActive} />
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{t.description}</p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">v{t.version}</Badge>
                <Badge variant="outline" className="text-xs">{t.segment}</Badge>
                <Badge variant="outline" className="text-xs">{t.questionsCount} perguntas</Badge>
                <Badge variant="outline" className="text-xs">{t.blocksCount} blocos</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div>
                  <p className="text-xs text-slate-500">Submissões</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    {t.submissionsCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tempo médio</p>
                  <p className="font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {t.completionAvg}min
                  </p>
                </div>
              </div>

              <div className="flex gap-1 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Editar
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}