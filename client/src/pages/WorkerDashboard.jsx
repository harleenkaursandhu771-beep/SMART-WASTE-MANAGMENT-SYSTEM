import { useEffect, useState } from 'react';
import {
  HiOutlineClipboardList,
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from 'react-icons/hi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getTasks, getBins } from '../services/api';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Worker Dashboard
 * Shows tasks assigned to the logged-in worker, bins they manage, and progress.
 */
const WorkerDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, bRes] = await Promise.all([getTasks(), getBins()]);
        // Filter for current worker
        const myTasks = tRes.data.filter(
          (t) => t.workerId?._id === user?._id || t.workerId === user?._id
        );
        const myBins = bRes.data.filter(
          (b) => b.assignedWorker?._id === user?._id || b.assignedWorker === user?._id
        );
        setTasks(myTasks);
        setBins(myBins);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const taskChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [completed, inProgress, pending],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="glass-card p-6 bg-gradient-to-r from-teal-600/10 to-primary-600/10">
        <h2 className="text-xl font-bold text-white">Welcome back, {user?.name}!</h2>
        <p className="text-white/50 text-sm mt-1">Here's your work summary for today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineClipboardList} label="Total Tasks" value={tasks.length} color="primary" delay={0} />
        <StatCard icon={HiOutlineCube} label="Assigned Bins" value={bins.length} color="teal" delay={100} />
        <StatCard icon={HiOutlineCheckCircle} label="Completed" value={completed} color="emerald" delay={200} />
        <StatCard icon={HiOutlineClock} label="Completion Rate" value={`${completionRate}%`} color="purple" delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Progress Chart */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Task Progress</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={taskChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                  legend: { labels: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter' } } },
                },
              }}
            />
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">Overall Completion</span>
              <span className="text-emerald-400 font-semibold">{completionRate}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">My Tasks</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No tasks assigned</p>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{task.taskId}</span>
                    <StatusBadge status={task.status} />
                  </div>
                  <p className="text-xs text-white/40">
                    📍 {task.binId?.location || 'Unknown'} • {task.binId?.area || ''}
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    📅 {new Date(task.collectionDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Assigned Bins */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Assigned Bins</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {bins.map((bin) => (
            <div key={bin._id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">{bin.binId}</span>
                <StatusBadge status={bin.status} />
              </div>
              <p className="text-xs text-white/50 mb-3">📍 {bin.location}</p>
              {/* Waste level bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Fill Level</span>
                  <span className={`font-semibold ${bin.wasteLevel > 80 ? 'text-red-400' : bin.wasteLevel > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {bin.wasteLevel}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      bin.wasteLevel > 80 ? 'bg-red-500' : bin.wasteLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${bin.wasteLevel}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
