import React from 'react';
import { cn } from '@/lib/utils';

export default function DisputeRatioGauge({ 
  value = 0, 
  thresholdWarning = 0.65, 
  thresholdCritical = 0.9,
  maxValue = 2,
  label = "Ratio",
  showPercentage = true,
  size = "default" // "sm", "default", "lg"
}) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getColor = () => {
    if (value >= thresholdCritical) return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
    if (value >= thresholdWarning) return { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' };
    return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' };
  };

  const getStatus = () => {
    if (value >= thresholdCritical) return 'Crítico';
    if (value >= thresholdWarning) return 'Atenção';
    return 'Normal';
  };

  const colors = getColor();
  
  const sizeClasses = {
    sm: { container: 'h-20', value: 'text-lg', label: 'text-xs' },
    default: { container: 'h-28', value: 'text-2xl', label: 'text-sm' },
    lg: { container: 'h-36', value: 'text-3xl', label: 'text-base' }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex flex-col items-center justify-center", sizes.container)}>
      <div className="relative w-full max-w-[120px]">
        {/* Background arc */}
        <svg viewBox="0 0 100 60" className="w-full">
          {/* Background track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Warning zone indicator */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={colors.bg}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 1.26} 126`}
            className="transition-all duration-500"
          />
          {/* Threshold markers */}
          <circle 
            cx={10 + (thresholdWarning / maxValue) * 80} 
            cy={50 - Math.sin(Math.acos((thresholdWarning / maxValue - 0.5) * 2)) * 40}
            r="2"
            fill="#eab308"
          />
          <circle 
            cx={10 + (thresholdCritical / maxValue) * 80} 
            cy={50 - Math.sin(Math.acos((thresholdCritical / maxValue - 0.5) * 2)) * 40}
            r="2"
            fill="#ef4444"
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className={cn("font-bold", sizes.value, colors.text)}>
            {showPercentage ? `${value.toFixed(2)}%` : value.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="text-center mt-1">
        <p className={cn("font-medium text-gray-700", sizes.label)}>{label}</p>
        <span className={cn(
          "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
          colors.light, colors.text
        )}>
          {getStatus()}
        </span>
      </div>
    </div>
  );
}