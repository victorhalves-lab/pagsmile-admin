import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TestTube2, Play, Pause, TrendingUp, Trophy, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { mockABAllocations } from '@/components/orchestration/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function AdminIntABVolumeAllocator() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="A/B Volume Allocator"
        subtitle="Teste experimentos de orquestração com tráfego real e detecte vencedores estatisticamente"
        icon={TestTube2}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Orchestration' }]}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo experimento
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Experimentos Ativos</p><p className="text-3xl font-bold text-emerald-600">2</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Receita Adicional</p><p className="text-3xl font-bold text-blue-600">R$ 50k</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Vencedores Detectados</p><p className="text-3xl font-bold text-violet-600">2</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Significância Média</p><p className="text-3xl font-bold">96%</p></CardContent></Card>
      </div>

      <div className="space-y-4">
        {mockABAllocations.map((exp) => (
          <Card key={exp.id} className={exp.status === 'running' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-400'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <span>{exp.name}</span>
                  <Badge className={exp.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                    {exp.status === 'running' ? '▶ Rodando' : '⏸ Pausado'}
                  </Badge>
                  {exp.winner && (
                    <Badge className="bg-amber-100 text-amber-700">
                      <Trophy className="w-3 h-3 mr-1" />
                      Vencedor: Variante {exp.winner}
                    </Badge>
                  )}
                </div>
                <Button size="sm" variant="outline">
                  {exp.status === 'running' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                  {exp.status === 'running' ? 'Pausar' : 'Retomar'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exp.variants.map((v) => (
                  <div key={v.id} className={`rounded-xl border-2 p-4 ${exp.winner === v.id ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="font-bold">Variante {v.id}</Badge>
                      <span className="text-xs text-slate-500">{v.allocation}% do tráfego</span>
                    </div>
                    <p className="font-semibold text-sm mb-3">{v.label}</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-slate-500">Volume</p>
                        <p className="text-sm font-bold">{v.volume.toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Conversão</p>
                        <p className="text-sm font-bold text-emerald-600">{v.conversion}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">MDR</p>
                        <p className="text-sm font-bold">{v.mdr}%</p>
                      </div>
                    </div>
                    {exp.status === 'running' && (
                      <div className="mt-3">
                        <Slider value={[v.allocation]} max={100} step={5} className="w-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-slate-50 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Significância estatística</p>
                  <p className="text-lg font-bold">{Math.round(exp.significance * 100)}%</p>
                </div>
                {exp.revenueLift && (
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Lift de receita</p>
                    <p className="text-lg font-bold text-emerald-600">+R$ {exp.revenueLift.toLocaleString('pt-BR')}</p>
                  </div>
                )}
                {exp.winner && (
                  <Button size="sm">
                    Promover Variante {exp.winner} para 100%
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}