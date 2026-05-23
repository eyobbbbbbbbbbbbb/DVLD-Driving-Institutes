'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose';
}

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-400/10 border-cyan-500/30',
  blue: 'from-blue-500/20 to-blue-400/10 border-blue-500/30',
  emerald: 'from-emerald-500/20 to-emerald-400/10 border-emerald-500/30',
  amber: 'from-amber-500/20 to-amber-400/10 border-amber-500/30',
  rose: 'from-rose-500/20 to-rose-400/10 border-rose-500/30',
};

const iconColorClasses = {
  cyan: 'text-cyan-400',
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  rose: 'text-rose-400',
};

export default function KPICard({
  title,
  value,
  icon,
  trend,
  description,
  color = 'cyan',
}: KPICardProps) {
  return (
    <div
      className={`glass card-hover rounded-lg p-6 border bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground text-shadow">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`text-2xl ${iconColorClasses[color]} opacity-80`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
              trend.isPositive
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {Math.abs(trend.value)}%
          </div>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
