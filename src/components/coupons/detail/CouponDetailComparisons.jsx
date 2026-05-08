import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, Globe2 } from 'lucide-react';
import { calcRoi, calcConversion } from '../utils';

export default function CouponDetailComparisons({ coupon }) {
  const roi = calcRoi(coupon);
  const conv = calcConversion(coupon);
  // Mocks
  const portfolioAvgRoi = 6.2;
  const portfolioAvgConv = 18.5;
  const benchmarkRoi = 4.8;
  const benchmarkConv = 14.0;

  const renderRow = (label, you, avg, suffix = '') => {
    const diff = ((you - avg) / avg) * 100;
    const isUp = diff >= 0;
    return (
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-slate-600">{label}</span>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold">{you.toFixed(1)}{suffix}</p>
            <p className="text-[10px] text-slate-400">vs {avg.toFixed(1)}{suffix}</p>
          </div>
          <Badge className={isUp ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
            {isUp ? '↑' : '↓'} {Math.abs(diff).toFixed(0)}%
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="w-4 h-4" /> vs Seu portfólio
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
          {renderRow('ROI', roi, portfolioAvgRoi, 'x')}
          {renderRow('Conversão', conv, portfolioAvgConv, '%')}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe2 className="w-4 h-4" /> vs Benchmark do mercado
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100 dark:divide-slate-800">
          {renderRow('ROI', roi, benchmarkRoi, 'x')}
          {renderRow('Conversão', conv, benchmarkConv, '%')}
        </CardContent>
      </Card>
    </div>
  );
}