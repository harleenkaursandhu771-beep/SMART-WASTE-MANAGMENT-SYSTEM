import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineTrash } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import { getTasks, createTask, updateTask, getBins, getUsers, deleteTask } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Collection Tasks Page
 * Admin: view all tasks, create new ones, update status, delete tasks.
 * Worker: view and update own tasks.
 */
const CollectionTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [bins, setBins] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    taskId: '',
    workerId: '',
    binId: '',
    collectionDate: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [tRes, bRes, uRes] = await Promise.all([getTasks(), getBins(), getUsers()]);
      let allTasks = tRes.data;
      // Workers only see their own tasks
      if (user?.role === 'worker') {
        allTasks = allTasks.filter(
          (t) => t.workerId?._id === user._id || t.workerId === user._id
        );
      }
      setTasks(allTasks);
      setBins(bRes.data);
      setWorkers(uRes.data.filter((u) => u.role === 'worker'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTask(form);
      setShowModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (taskId, dbId, newStatus) => {
    try {
      await updateTask(dbId, { status: newStatus });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        fetchAll();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const filtered = tasks.filter(
    (t) =>
      t.taskId.toLowerCase().includes(search.toLowerCase()) ||
      (t.binId?.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.workerId?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusActions = {
    pending: ['in-progress', 'cancelled'],
    'in-progress': ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Collection Tasks</h2>
          <p className="text-sm text-white/40">{tasks.length} tasks total</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              setForm({
                taskId: `TASK-${Date.now().toString().slice(-6)}`,
                workerId: '',
                binId: '',
                collectionDate: '',
                status: 'pending',
              });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <HiOutlinePlus className="w-4 h-4" /> Create Task
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="glass-input w-full pl-12"
        />
      </div>

      {/* Tasks Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Worker</th>
                <th>Bin</th>
                <th>Location</th>
                <th>Collection Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-white/30">No tasks found</td>
                </tr>
              ) : (
                filtered.map((task) => (
                  <tr key={task._id}>
                    <td className="font-semibold text-white">{task.taskId}</td>
                    <td>{task.workerId?.name || '—'}</td>
                    <td>{task.binId?.binId || '—'}</td>
                    <td>{task.binId?.location || '—'}</td>
                    <td>{new Date(task.collectionDate).toLocaleDateString()}</td>
                    <td><StatusBadge status={task.status} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        {(statusActions[task.status] || []).map((action) => (
                          <button
                            key={action}
                            onClick={() => handleStatusUpdate(task.taskId, task._id, action)}
                            className="px-2 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 hover:text-white capitalize transition-colors border border-white/5"
                          >
                            {action.replace('-', ' ')}
                          </button>
                        ))}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-1 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 border border-transparent hover:border-red-500/10 transition-colors"
                            title="Delete Task"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-lg animate-slide-up">
            <h3 className="text-lg font-bold text-white mb-6">Create Collection Task</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Task ID</label>
                <input name="taskId" value={form.taskId} onChange={handleChange} className="glass-input w-full" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Assign Worker</label>
                <select name="workerId" value={form.workerId} onChange={handleChange} className="glass-input w-full" required>
                  <option value="" className="bg-dark-900">-- Select Worker --</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id} className="bg-dark-900">{w.name} ({w.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Assign Bin</label>
                <select name="binId" value={form.binId} onChange={handleChange} className="glass-input w-full" required>
                  <option value="" className="bg-dark-900">-- Select Bin --</option>
                  {bins.map((b) => (
                    <option key={b._id} value={b._id} className="bg-dark-900">{b.binId} — {b.location}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Collection Date</label>
                <input name="collectionDate" type="date" value={form.collectionDate} onChange={handleChange} className="glass-input w-full" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Create Task</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionTasks;
