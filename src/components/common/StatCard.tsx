import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-[#E7F2EC]',
  iconColor = 'text-[#237A57]',
  trend,
  onClick,
  highlight = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#237A57]/50 hover:shadow-md' : ''
      } ${highlight ? 'border-[#237A57] ring-1 ring-[#237A57]/30 bg-[#E7F2EC]/30' : 'border-[#DFE8E1]'}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#687A70]">{title}</p>
          <p className="text-2xl font-black tracking-tight text-[#263A32] font-mono">{value}</p>
          {subtitle && <p className="text-xs text-[#687A70]">{subtitle}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#DFE8E1] ${iconBgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-[#DFE8E1] pt-2.5 text-xs">
          <span
            className={`font-semibold ${
              trend.isPositive ? 'text-[#237A57]' : 'text-rose-600'
            }`}
          >
            {trend.value}
          </span>
          {trend.label && <span className="text-[#687A70]">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};
