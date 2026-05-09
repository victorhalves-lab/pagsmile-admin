import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowRight } from 'lucide-react';

export default function FeesAnalysisLinkBanner() {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-blue-900">Esta análise também vive em <span className="underline">Tarifas e Taxas</span></p>
          <p className="text-[11px] text-blue-700">
            Acesse a perspectiva combinada: configuração + análise histórica + otimização IA na mesma tela.
          </p>
        </div>
        <Link to={createPageUrl('Fees')}>
          <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 h-8">
            Ver em Tarifas <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}