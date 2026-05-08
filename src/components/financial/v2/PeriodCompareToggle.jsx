import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeftRight } from 'lucide-react';

// Toggle to compare current period vs previous
export default function PeriodCompareToggle({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg">
      <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
      <Label htmlFor="cmp" className="text-xs cursor-pointer">Comparar período anterior</Label>
      <Switch id="cmp" checked={value} onCheckedChange={onChange} className="scale-75" />
    </div>
  );
}