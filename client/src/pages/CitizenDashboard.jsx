import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineChatAlt2,
} from 'react-icons/hi';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getReports, getFeedback } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Citizen Dashboard
 * Shows the citizen's complaint status, recent reports, and quick actions.
 */
const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, fRes] = await Promise.all([getReports(), getFeedback()]);
        // Filter for current citizen
        const myReports = rRes.data.filter(
          (r) => r.citizenId?._id === user?._id || r.citizenId === user?._id
        );
        const myFeedback = fRes.data.filter(
          (f) => f.citizenId?._id === user?._id || f.citizenId === user?._id
        );
        setReports(myReports);
        setFeedback(myFeedback);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const resolved = reports.filter((r) => r.status === 'resolved').length;
  const pending = reports.filter((r) => r.status === 'pending').length;
  const inProgress = reports.filter((r) => r.status === 'in-progress').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
        <h2 className="text-xl font-bold text-white">Hello, {user?.name}! 👋</h2>
        <p className="text-white/50 text-sm mt-1">Keep your city clean. Report, track, and make a difference.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineDocumentText} label="Total Reports" value={reports.length} color="primary" delay={0} />
        <StatCard icon={HiOutlineClock} label="Pending" value={pending} color="amber" delay={100} />
        <StatCard icon={HiOutlineCheckCircle} label="Resolved" value={resolved} color="emerald" delay={200} />
        <StatCard icon={HiOutlineChatAlt2} label="My Feedback" value={feedback.length} color="purple" delay={300} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/complaint')}
          className="glass-card p-6 text-left group cursor-pointer hover:border-emerald-500/30 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
            <HiOutlineDocumentText className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Report an Issue</h3>
          <p className="text-sm text-white/40">Found a waste problem? File a complaint and we'll handle it.</p>
        </button>

        <button
          onClick={() => navigate('/feedback')}
          className="glass-card p-6 text-left group cursor-pointer hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
            <HiOutlineChatAlt2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Share Feedback</h3>
          <p className="text-sm text-white/40">Rate the service and help us improve waste management.</p>
        </button>
      </div>

      {/* Recent Reports */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">My Recent Reports</h3>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/30 text-sm">You haven't filed any reports yet.</p>
            <button onClick={() => navigate('/complaint')} className="btn-teal text-sm mt-4">
              File Your First Report
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report._id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{report.reportId}</span>
                  <StatusBadge status={report.status} />
                </div>
                <p className="text-xs text-white/50 mb-1 line-clamp-2">{report.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-white/30">
                    📍 {report.binId?.location || 'Unknown Location'}
                  </p>
                  <p className="text-xs text-white/30">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
