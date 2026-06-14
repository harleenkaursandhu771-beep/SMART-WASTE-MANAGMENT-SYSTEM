/**
 * StatCard Component
 * Glassmorphism stat card with icon, label, value, and optional trend indicator.
 * Used across all dashboards.
 */
const StatCard = ({ icon: Icon, label, value, trend, trendUp, color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    teal: 'from-teal-500 to-teal-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    amber: 'from-amber-500 to-amber-600',
  };

  const shadowMap = {
    primary: 'shadow-primary-500/20',
    teal: 'shadow-teal-500/20',
    emerald: 'shadow-emerald-500/20',
    purple: 'shadow-purple-500/20',
    red: 'shadow-red-500/20',
    amber: 'shadow-amber-500/20',
  };

  return (
    <div
      className="glass-card p-6 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg ${shadowMap[color]}`}
        >
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
