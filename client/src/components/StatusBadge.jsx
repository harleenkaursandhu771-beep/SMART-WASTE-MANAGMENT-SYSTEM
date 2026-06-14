/**
 * StatusBadge Component
 * Renders a color-coded badge for various entity statuses.
 */
const StatusBadge = ({ status }) => {
  const badgeMap = {
    // Reports & Tasks
    pending: 'badge-pending',
    'in-progress': 'badge-progress',
    completed: 'badge-completed',
    resolved: 'badge-completed',
    rejected: 'badge-rejected',
    cancelled: 'badge-rejected',
    // Bins
    active: 'badge-active',
    inactive: 'badge-inactive',
    full: 'badge-full',
    maintenance: 'badge-maintenance',
    // Vehicles
    available: 'badge-active',
    'in-use': 'badge-progress',
    retired: 'badge-inactive',
  };

  const labelMap = {
    'in-progress': 'In Progress',
    'in-use': 'In Use',
  };

  const className = badgeMap[status] || 'badge bg-gray-500/20 text-gray-300 border border-gray-500/30';
  const label = labelMap[status] || status?.charAt(0).toUpperCase() + status?.slice(1);

  return <span className={className}>{label}</span>;
};

export default StatusBadge;
