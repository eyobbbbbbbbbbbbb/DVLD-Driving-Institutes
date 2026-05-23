'use client';

type StatusType =
  | 'active'
  | 'inactive'
  | 'completed'
  | 'pending'
  | 'present'
  | 'absent'
  | 'late'
  | 'available'
  | 'in-use'
  | 'maintenance'
  | 'success'
  | 'warning'
  | 'error'
  | 'failed';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<StatusType, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Active' },
  inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Inactive' },
  completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Completed' },
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Pending' },
  present: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Present' },
  absent: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Absent' },
  late: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Late' },
  available: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Available' },
  'in-use': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'In Use' },
  maintenance: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Maintenance' },
  success: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Success' },
  warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Warning' },
  error: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Error' },
  failed: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Failed' },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {displayLabel}
    </span>
  );
}
