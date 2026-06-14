import { useEffect, useState } from 'react';
import { HiOutlineSearch, HiOutlineClock, HiOutlineRefresh } from 'react-icons/hi';
import { getActivityLogs } from '../services/api';

/**
 * ActivityLogs Component
 * Renders system-wide activity log timeline/table for Admins.
 * Highlights events with colored badges and supports filtering.
 */
const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getActivityLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEntityBadgeColor = (type) => {
    switch (type) {
      case 'User': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Bin': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'WasteReport': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'CollectionTask': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Vehicle': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Feedback': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'Notification': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-white/5 text-white/50 border-white/5';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.entityType.toLowerCase().includes(search.toLowerCase()) ||
      (log.userId?.name && log.userId.name.toLowerCase().includes(search.toLowerCase()));

    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HiOutlineClock className="text-primary-400" /> Activity Logs
          </h2>
          <p className="text-sm text-white/40">Audit trail of all administrative and citizen actions in the system</p>
        </div>
        <button onClick={fetchLogs} className="btn-ghost py-2 flex items-center gap-2 text-xs w-fit">
          <HiOutlineRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, details, or user..."
            className="glass-input w-full pl-12"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['all', 'User', 'Bin', 'WasteReport', 'CollectionTask', 'Vehicle', 'Feedback'].map((type) => (
            <button
              key={type}
              onClick={() => setEntityFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 border flex-shrink-0 ${
                entityFilter === type
                  ? 'bg-gradient-to-r from-primary-600/30 to-teal-600/20 text-white border-primary-500/30 shadow-lg'
                  : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Types' : type.replace('WasteReport', 'Report').replace('CollectionTask', 'Task')}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed / Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/30 text-sm">No activity logs found.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-glass">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Entity Type</th>
                  <th>Entity ID</th>
                  <th>Performed By</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span className="text-white/60">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-white/30 ml-2">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-white/95 font-semibold bg-white/5 px-2 py-1 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getEntityBadgeColor(log.entityType)}`}>
                        {log.entityType}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-white/40">{log.entityId}</span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white/90">{log.userId?.name || 'System'}</span>
                        <span className="text-[10px] text-white/40 capitalize">{log.userId?.role || 'automatic'}</span>
                      </div>
                    </td>
                    <td className="max-w-xs truncate" title={log.details}>
                      <span className="text-white/70">{log.details}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
