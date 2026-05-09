import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, AlertTriangle } from 'lucide-react';

export default function ProjectHealthScore({ project }) {
  if (!project) return null;
  const score = project.health_score || 0;
  const color = score >= 85 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Heart className={`w-4 h-4 ${color}`} />Health Score do projeto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-3">
          <div className={`text-4xl font-bold ${color}`}>{score}</div>
          <div className="flex-1">
            <Progress value={score} className="h-2" />
            <p className="text-[10px] text-slate-500 mt-1">{score >= 85 ? 'Excelente · operação saudável' : score >= 60 ? 'Atenção · alguns indicadores no limiar' : 'Crítico · ação imediata requerida'}</p>
          </div>
        </div>
        {project.bottlenecks?.length > 0 && (
          <div className="space-y-1 pt-2 border-t">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Gargalos detectados</p>
            {project.bottlenecks.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 ${b.severity === 'high' ? 'text-red-500' : b.severity === 'medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>{b.message}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}