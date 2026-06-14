import { useEffect, useState } from 'react';
import { HiOutlineSearch, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineClock, HiOutlineBan, HiOutlineRefresh } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import { getReports, updateReport, deleteReport } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Waste Reports Page
 * Shows list of reported waste issues.
 * Admin: Can edit status of all reports, delete reports.
 * Worker: Can see reports of bins assigned to them.
 * Citizen: Can see reports submitted by them.
 */
const WasteReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports();
      let data = res.data;
      
      // Filter based on user role
      if (user.role === 'worker') {
        // Only show reports where the bin is assigned to the current worker
        data = data.filter(r => r.binId?.assignedWorker === user._id || r.binId?.assignedWorker?._id === user._id);
      } else if (user.role === 'citizen') {
        // Only show reports submitted by the citizen
        data = data.filter(r => r.citizenId === user._id || r.citizenId?._id === user._id);
      }
      
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await updateReport(reportId, { status: newStatus });
      fetchReports();
    } catch (err) {
      console.error('Failed to update report status:', err);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        fetchReports();
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  const filtered = reports.filter(r => {
    const matchesSearch = 
      r.reportId.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.binId?.location && r.binId.location.toLowerCase().includes(search.toLowerCase())) ||
      (r.binId?.binId && r.binId.binId.toLowerCase().includes(search.toLowerCase()));
      
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Waste Reports</h2>
          <p className="text-sm text-white/40">Track and manage citizen-reported waste complaints</p>
        </div>
        <button onClick={fetchReports} className="btn-ghost py-2 flex items-center gap-2 text-xs w-fit">
          <HiOutlineRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by ID, description, bin..."
            className="glass-input w-full pl-12"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-primary-600/30 to-teal-600/20 text-white border-primary-500/30 shadow-lg'
                  : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/30 text-sm">No reports found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((report) => (
            <div key={report._id} className="glass-card p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-sm font-bold text-white tracking-wide">{report.reportId}</span>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      Submitted: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                {report.imageUrl && (
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-black/20">
                    <img 
                      src={report.imageUrl} 
                      alt="Waste Issue" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <p className="text-sm text-white/80 mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                  {report.description}
                </p>

                <div className="space-y-1.5 text-xs text-white/40 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/60">Bin:</span>
                    <span className="text-white/80">{report.binId?.binId || 'Unlinked'} — {report.binId?.location || 'Unknown location'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/60">Area:</span>
                    <span className="text-white/80">{report.binId?.area || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/60">Reported By:</span>
                    <span className="text-white/80">{report.citizenId?.name || 'Anonymous citizen'} ({report.citizenId?.email || 'N/A'})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-2">
                {user.role === 'admin' ? (
                  <>
                    <div className="flex gap-1.5">
                      {report.status !== 'in-progress' && report.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(report._id, 'in-progress')}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <HiOutlineClock className="w-3.5 h-3.5" /> Start Work
                        </button>
                      )}
                      {report.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(report._id, 'resolved')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Resolve
                        </button>
                      )}
                      {report.status !== 'rejected' && report.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(report._id, 'rejected')}
                          className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <HiOutlineBan className="w-3.5 h-3.5" /> Reject
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/40 border border-white/5 hover:border-red-500/20 transition-all duration-300"
                      title="Delete Report"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </>
                ) : user.role === 'worker' ? (
                  <div className="flex gap-2 w-full">
                    {report.status !== 'in-progress' && report.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(report._id, 'in-progress')}
                        className="flex-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <HiOutlineClock className="w-4 h-4" /> Start Work
                      </button>
                    )}
                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(report._id, 'resolved')}
                        className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <HiOutlineCheckCircle className="w-4 h-4" /> Mark Resolved
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-white/30 italic">
                    {report.status === 'pending' && "Awaiting administrator assignment."}
                    {report.status === 'in-progress' && "Worker is actively addressing the issue."}
                    {report.status === 'resolved' && "Issue resolved. Thank you for your report!"}
                    {report.status === 'rejected' && "Report flagged as invalid/rejected."}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WasteReports;
