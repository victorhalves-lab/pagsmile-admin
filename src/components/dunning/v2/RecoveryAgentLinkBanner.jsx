import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RecoveryAgentLinkBanner() {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-900">Powered by Recovery Agent IA</p>
            <Badge className="bg-purple-100 text-purple-700 border-0 text-[9px]">B17 · Conectado</Badge>
          </div>
          <p className="text-[11px] text-slate-600">
            Esta régua de cobrança é executada pelo Recovery Agent. Métricas, jornada e ações em tempo real lá.
          </p>
        </div>
        <Link to={createPageUrl('RecoveryAgent')}>
          <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 h-8">
            Abrir Recovery Agent <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}