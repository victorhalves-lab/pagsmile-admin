import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function SupplierCredentialRotationSuggestions({ credentials = [], onRotate }) {
  // Sugestões: credenciais com mais de X% do período de rotação decorrido
  const suggestions = credentials
    .filter((c) => c.last_rotated && c.rotation_period_days && c.status === 'active')
    .map((c) => {
      const daysSinceRotation = (Date.now() - new Date(c.last_rotated).getTime()) / 86400000;
      const pct = (daysSinceRotation / c.rotation_period_days) * 100;
      return { ...c, pct, daysSinceRotation };
    })
    .filter((c) => c.pct >= 70)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  if (suggestions.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/40 dark:bg-emerald-900/10">
        <CardContent className="p-3 text-xs text-emerald-800 dark:text-emerald-200">
          ✅ Todas as credenciais ativas estão dentro do prazo de rotação saudável
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-violet-200 bg-violet-50/30 dark:bg-violet-900/10">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-violet-900 dark:text-violet-200">
          <Sparkles className="w-4 h-4" />Sugestões proativas de rotação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-violet-100">
            <div className="flex-1">
              <p className="text-sm font-bold">{c.name}</p>
              <p className="text-[10px] text-slate-500">
                Última rotação há {Math.floor(c.daysSinceRotation)}d · período recomendado {c.rotation_period_days}d
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1">
                <div
                  className={`h-1.5 rounded-full ${c.pct >= 100 ? 'bg-red-500' : c.pct >= 90 ? 'bg-orange-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(c.pct, 100)}%` }}
                />
              </div>
            </div>
            <Badge className={`text-[10px] ${c.pct >= 100 ? 'bg-red-100 text-red-700' : c.pct >= 90 ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
              {c.pct.toFixed(0)}%
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onRotate?.(c)}>
              <RefreshCw className="w-3 h-3 mr-1" />Rotacionar
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}