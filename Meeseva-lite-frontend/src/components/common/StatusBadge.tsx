import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText } from 'lucide-react';
import type { ApplicationStatus } from '../../types/index.js';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', showIcon = true }) => {
  const normStatus = status.toLowerCase();

  switch (normStatus) {
    case 'approved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5" />}
          Approved / Delivered
        </span>
      );
    case 'in_review':
    case 'under_review':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}>
          {showIcon && <Clock className="w-3.5 h-3.5" />}
          Under Review
        </span>
      );
    case 'submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
          {showIcon && <AlertCircle className="w-3.5 h-3.5" />}
          Submitted
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5" />}
          Rejected
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          {showIcon && <FileText className="w-3.5 h-3.5" />}
          {status.toUpperCase()}
        </span>
      );
  }
};
