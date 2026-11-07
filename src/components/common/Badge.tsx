import React from 'react';
import { ComplaintSeverity, ComplaintStatus, WorkerTaskStatus } from '../../types';

interface SeverityBadgeProps {
  severity: ComplaintSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5'
  };

  const config = {
    critical: {
      bg: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500 animate-pulse',
      label: 'Critical'
    },
    high: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
      label: 'High'
    },
    medium: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Medium'
    },
    low: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      label: 'Low'
    }
  }[severity] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: severity
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      <span>{config.label}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: ComplaintStatus | WorkerTaskStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  };

  const config: Record<
    string,
    { bg: string; text: string; border: string; label: string }
  > = {
    submitted: {
      bg: 'bg-[#F4F7F5]',
      text: 'text-[#263A32]',
      border: 'border-[#DFE8E1]',
      label: 'Submitted'
    },
    ai_analyzed: {
      bg: 'bg-[#E7F2EC]',
      text: 'text-[#123D32]',
      border: 'border-[#237A57]/30',
      label: 'AI Analyzed'
    },
    assigned: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: 'Assigned'
    },
    in_progress: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'In Progress'
    },
    awaiting_admin_review: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      label: 'Awaiting Admin Review'
    },
    rework_requested: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      label: 'Rework Requested'
    },
    resolved: {
      bg: 'bg-emerald-50',
      text: 'text-[#123D32]',
      border: 'border-emerald-300 font-bold',
      label: 'Resolved (Awaiting Citizen)'
    },
    verified: {
      bg: 'bg-emerald-100',
      text: 'text-[#123D32]',
      border: 'border-emerald-400 font-bold',
      label: 'Citizen Verified'
    },
    rejected: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      label: 'Rejected'
    },
    reopened: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      label: 'Reopened'
    },
    // Worker task statuses
    not_accepted: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'New Assignment'
    },
    accepted: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: 'Accepted'
    },
    submitted_for_verification: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      label: 'Awaiting Verification'
    },
    approved_by_admin: {
      bg: 'bg-emerald-50',
      text: 'text-[#123D32]',
      border: 'border-emerald-300 font-bold',
      label: 'Admin Approved'
    },
    completed: {
      bg: 'bg-emerald-100',
      text: 'text-[#123D32]',
      border: 'border-emerald-400 font-bold',
      label: 'Completed'
    }
  };

  const item = config[status] || {
    bg: 'bg-[#F4F7F5]',
    text: 'text-[#263A32]',
    border: 'border-[#DFE8E1]',
    label: String(status).replace('_', ' ')
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${item.bg} ${item.text} ${item.border} ${sizeClasses[size]}`}
    >
      {item.label}
    </span>
  );
};
