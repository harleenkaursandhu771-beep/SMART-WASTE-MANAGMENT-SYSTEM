import { useEffect, useState } from 'react';
import {
  HiOutlineCube,
  HiOutlineExclamationCircle,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineTruck,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getBins, getReports, getTasks, getUsers, getVehicles } from '../services/api';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

/**
 * Admin Dashboard
 * Shows system-wide stats, charts, and recent activity.
 */
const AdminDashboard = () => {
  const [bins, setBins] = useState([]);
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bRes, rRes, tRes, uRes, vRes] = await Promise.all([
          getBins(), getReports(), getTasks(), getUsers(), getVehicles(),
        ]);
        setBins(bRes.data);
        setReports(rRes.data);
        setTasks(tRes.data);
        setUsers(uRes.data);
        setVehicles(vRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const fullBins = bins.filter((b) => b.status === 'full').length;
  const activeWorkers = users.filter((u) => u.role === 'worker').length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  // Chart options for dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 12 } },
      },
    },
    scales: {
      x: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: 'rgba(255,255,255,0.4)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  // Bin status doughnut
  const binStatusData = {
    labels: ['Active', 'Full', 'Maintenance', 'Inactive'],
    datasets: [{
      data: [
        bins.filter((b) => b.status === 'active').length,
        fullBins,
        bins.filter((b) => b.status === 'maintenance').length,
        bins.filter((b) => b.status === 'inactive').length,
      ],
      backgroundColor: ['#10b981', '#ef4444', '#a855f7', '#64748b'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  // Waste level bar chart by area
  const areaMap = {};
  bins.forEach((b) => {
    if (!areaMap[b.area]) areaMap[b.area] = [];
    areaMap[b.area].push(b.wasteLevel);
  });
  const areas = Object.keys(areaMap);
  const avgLevels = areas.map((a) => Math.round(areaMap[a].reduce((s, v) => s + v, 0) / areaMap[a].length));

  const wasteByAreaData = {
    labels: areas,
    datasets: [{
      label: 'Avg Waste Level (%)',
      data: avgLevels,
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: '#6366f1',
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  // Weekly collection trend (aggregated from real tasks database data)
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon=0, Tue=1, ..., Sun=6
  tasks.forEach((t) => {
    if (t.collectionDate) {
      const date = new Date(t.collectionDate);
      let day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const mappedDay = day === 0 ? 6 : day - 1;
      if (mappedDay >= 0 && mappedDay < 7) {
        weekdayCounts[mappedDay]++;
      }
    }
  });

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Collections',
      data: weekdayCounts,
      fill: true,
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      borderColor: '#14b8a6',
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: '#14b8a6',
    }],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineCube} label="Total Bins" value={bins.length} trend="+2 this week" trendUp color="primary" delay={0} />
        <StatCard icon={HiOutlineExclamationCircle} label="Full Bins" value={fullBins} trend="Needs attention" color="red" delay={100} />
        <StatCard icon={HiOutlineUserGroup} label="Active Workers" value={activeWorkers} color="teal" delay={200} />
        <StatCard icon={HiOutlineDocumentText} label="Pending Reports" value={pendingReports} trend={`${reports.length} total`} color="amber" delay={300} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bin Status Doughnut */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Bin Status Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={binStatusData} options={{ ...chartOptions, scales: undefined, cutout: '65%' }} />
          </div>
        </div>

        {/* Waste by Area Bar */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Avg Waste Level by Area</h3>
          <div className="h-64">
            <Bar data={wasteByAreaData} options={chartOptions} />
          </div>
        </div>

        {/* Weekly Trend Line */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Weekly Collections</h3>
          <div className="h-64">
            <Line data={weeklyData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Reports + Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {reports.slice(0, 5).map((report) => (
              <div key={report._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{report.reportId}</p>
                  <p className="text-xs text-white/40 truncate">{report.description}</p>
                </div>
                <StatusBadge status={report.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Fleet & Task Summary */}
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Fleet Status</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-2xl font-bold text-emerald-400">{vehicles.filter((v) => v.status === 'available').length}</p>
                <p className="text-xs text-white/40 mt-1">Available</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-2xl font-bold text-blue-400">{vehicles.filter((v) => v.status === 'in-use').length}</p>
                <p className="text-xs text-white/40 mt-1">In Use</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <p className="text-2xl font-bold text-purple-400">{vehicles.filter((v) => v.status === 'maintenance').length}</p>
                <p className="text-xs text-white/40 mt-1">Maintenance</p>
              </div>
              <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-center">
                <p className="text-2xl font-bold text-primary-400">{vehicles.length}</p>
                <p className="text-xs text-white/40 mt-1">Total Fleet</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Task Progress</h3>
            <div className="space-y-3">
              {['completed', 'in-progress', 'pending'].map((status) => {
                const count = tasks.filter((t) => t.status === status).length;
                const pct = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
                const colors = { completed: 'bg-emerald-500', 'in-progress': 'bg-blue-500', pending: 'bg-amber-500' };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50 capitalize">{status.replace('-', ' ')}</span>
                      <span className="text-white/70 font-medium">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[status]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
