import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus, Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

export default function KPICardEnhanced({
  title,
  value,
  change,
  changeType = "neutral", // positive, negative, neutral
  icon: Icon,
  sparklineData = [], // Array of { value: number }
  prefix = "",
  suffix = "",
  className,
  loading = false,
  description
}) {
  // Configuração de cores baseada no tipo de mudança
  const colors = {
    positive: { text: "text-[#00D26A]", bg: "bg-[#00D26A]/10", stroke: "#00D26A" },
    negative: { text: "text-red-500", bg: "bg-red-500/10", stroke: "#EF4444" },
    neutral: { text: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", stroke: "#94A3B8" }
  };

  const statusColor = colors[changeType] || colors.neutral;

  if (loading) {
    return (
      <Card className="h-full border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
          <div className="h-8 w-32 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse mb-2" />
          <div className="h-4 w-24 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 group border-slate-100 dark:border-slate-800 dark:bg-[#1E293B]",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-1">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wide">{title}</span>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {prefix}{value}{suffix}
              </h3>
            </div>
          </div>
          
          <div className={cn(
            "p-2.5 rounded-xl transition-colors duration-300",
            "bg-slate-50 dark:bg-slate-800 group-hover:bg-[#00D26A]/10 dark:group-hover:bg-[#00D26A]/20"
          )}>
            {Icon ? (
              <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-[#00D26A] transition-colors" />
            ) : (
              <Activity className="w-5 h-5 text-slate-500 group-hover:text-[#00D26A]" />
            )}
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col gap-1">
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full w-fit",
                statusColor.bg,
                statusColor.text
              )}>
                {changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
                {changeType === 'negative' && <ArrowDownRight className="w-3 h-3" />}
                {changeType === 'neutral' && <Minus className="w-3 h-3" />}
                {change}
              </div>
            )}
            {description && (
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                {description}
              </span>
            )}
          </div>

          {/* Mini Sparkline Chart */}
          {sparklineData.length > 0 && (
            <div className="h-10 w-24 -mb-2">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={statusColor.stroke} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={statusColor.stroke} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={statusColor.stroke} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill={`url(#gradient-${title})`} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}