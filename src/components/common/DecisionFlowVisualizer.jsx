import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function DecisionFlowVisualizer({ rule }) {
  return (
    <Card className="p-4 bg-slate-50">
      <div className="flex items-center gap-3 text-sm">
        {/* Condition */}
        <div className="bg-white border-2 border-blue-200 rounded-lg px-3 py-2">
          <p className="font-mono text-xs text-blue-700">
            SE <span className="font-bold">{rule?.condition || "helena_score < 300"}</span>
          </p>
        </div>

        <ArrowRight className="w-5 h-5 text-slate-400" />

        {/* Action */}
        <div className="bg-white border-2 border-green-200 rounded-lg px-3 py-2">
          <p className="font-mono text-xs text-green-700">
            ENTÃO <span className="font-bold">{rule?.action || "manual_review"}</span>
          </p>
        </div>
      </div>

      {/* Example Visualization */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 mb-2">Exemplo de Decisão:</p>
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-slate-600">Score 250 → Revisão Manual Obrigatória</span>
        </div>
      </div>
    </Card>
  );
}