import React from 'react';
import { Area, ReferenceDot } from 'recharts';

/**
 * Helpers para renderizar overlay de banda de confiança e pontos de anomalia em gráficos recharts.
 * Use dentro de AreaChart/LineChart como filhos adicionais.
 */

export function ConfidenceBand({ dataKey = 'confidence', fill = '#94a3b8', opacity = 0.15 }) {
  return (
    <Area
      type="monotone"
      dataKey={dataKey}
      stroke="none"
      fill={fill}
      fillOpacity={opacity}
      activeDot={false}
      legendType="none"
    />
  );
}

export function AnomalyMarkers({ data = [], xKey = 'date', yKey = 'value' }) {
  return data
    .filter(d => d.anomaly)
    .map((d, i) => (
      <ReferenceDot
        key={`anomaly-${i}`}
        x={d[xKey]}
        y={d[yKey]}
        r={6}
        fill="#ef4444"
        stroke="#fff"
        strokeWidth={2}
        ifOverflow="extendDomain"
      />
    ));
}

export default { ConfidenceBand, AnomalyMarkers };