import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function DunningBenchmarkBar() {
  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="font-bold text-blue-900">Benchmark</p>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-slate-500">Sua taxa recovery</p>
              <p className="font-bold text-emerald-600">78.3%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Mercado SaaS</p>
              <p className="font-bold">68%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Top 10%</p>
              <p className="font-bold">85%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}