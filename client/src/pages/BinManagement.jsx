import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineUser } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import { getBins, createBin, updateBin, deleteBin, getUsers } from '../services/api';

/**
 * Bin Management Page
 * Full CRUD for waste bins. Shows fill levels with colored progress bars.
 * Includes worker assignment dropdown in the modal.
 */
const BinManagement = () => {
  const [bins, setBins] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBin, setEditingBin] = useState(null);
  const [form, setForm] = useState({
    binId: '', 
    location: '', 
    area: '', 
    wasteLevel: 0, 
    status: 'active', 
    latitude: '', 
    longitude: '',
    assignedWorker: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBins();
    fetchWorkers();
  }, []);

  const fetchBins = async () => {
    try {
      const res = await getBins();
      setBins(res.data || []);
    } catch (err) {
      console.error('Error fetching bins:', err);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await getUsers();
      const filteredWorkers = res.data.filter(u => u.role === 'worker');
      setWorkers(filteredWorkers);
    } catch (err) {
      console.error('Error fetching workers:', err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setEditingBin(null);
    setForm({ 
      binId: '', 
      location: '', 
      area: '', 
      wasteLevel: 0, 
      status: 'active', 
      latitude: '', 
      longitude: '',
      assignedWorker: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEdit = (bin) => {
    setEditingBin(bin);
    setForm({
      binId: bin.binId,
      location: bin.location,
      area: bin.area,
      wasteLevel: bin.wasteLevel,
      status: bin.status,
      latitude: bin.latitude,
      longitude: bin.longitude,
      assignedWorker: bin.assignedWorker?._id || bin.assignedWorker || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const binData = { ...form };
      if (!binData.assignedWorker) {
        binData.assignedWorker = null;
      }
      
      if (editingBin) {
        await updateBin(editingBin._id, binData);
      } else {
        await createBin(binData);
      }
      setShowModal(false);
      fetchBins();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save bin');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bin?')) {
      try {
        await deleteBin(id);
        fetchBins();
      } catch (err) {
        console.error('Failed to delete bin:', err);
      }
    }
  };

  const filtered = bins.filter(
    (b) =>
      b.binId.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase()) ||
      b.area.toLowerCase().includes(search.toLowerCase()) ||
      (b.assignedWorker?.name && b.assignedWorker.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Bin Management</h2>
          <p className="text-sm text-white/40">{bins.length} bins tracked across the city</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add Bin
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bins by ID, location, area, worker..."
          className="glass-input w-full pl-12"
        />
      </div>

      {/* Bin Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filtered.map((bin) => (
          <div key={bin._id} className="glass-card p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white tracking-wide">{bin.binId}</span>
                <StatusBadge status={bin.status} />
              </div>

              <p className="text-sm text-white/80 mb-1 leading-relaxed">📍 {bin.location}</p>
              <p className="text-xs text-white/40 mb-4">🏘️ {bin.area}</p>

              {/* Waste level */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5 font-semibold">
                  <span className="text-white/40">Waste Level</span>
                  <span className={`${bin.wasteLevel > 80 ? 'text-red-400' : bin.wasteLevel > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {bin.wasteLevel}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      bin.wasteLevel > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                      bin.wasteLevel > 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                      'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${bin.wasteLevel}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              {/* Worker info */}
              <div className="mb-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Assigned Hand</span>
                {bin.assignedWorker ? (
                  <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                    <HiOutlineUser className="w-3.5 h-3.5" /> {bin.assignedWorker.name}
                  </span>
                ) : (
                  <span className="text-xs text-white/30 italic">Unassigned</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button onClick={() => openEdit(bin)} className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1">
                  <HiOutlinePencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(bin._id)} className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20">
                  <HiOutlineTrash className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingBin ? 'Edit Bin details' : 'Add New Bin'}
            </h3>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Bin ID</label>
                  <input name="binId" value={form.binId} onChange={handleChange} className="glass-input w-full" placeholder="e.g. BIN-101" required disabled={!!editingBin} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="glass-input w-full">
                    <option value="active" className="bg-dark-900">Active</option>
                    <option value="inactive" className="bg-dark-900">Inactive</option>
                    <option value="full" className="bg-dark-900">Full</option>
                    <option value="maintenance" className="bg-dark-900">Maintenance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Location Landmark</label>
                <input name="location" value={form.location} onChange={handleChange} className="glass-input w-full" placeholder="e.g. Greenwood Main Gate" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Area / Ward</label>
                <input name="area" value={form.area} onChange={handleChange} className="glass-input w-full" placeholder="e.g. Greenwood Valley" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Waste Level %</label>
                  <input name="wasteLevel" type="number" min="0" max="100" value={form.wasteLevel} onChange={handleChange} className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Latitude</label>
                  <input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} className="glass-input w-full" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Longitude</label>
                  <input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} className="glass-input w-full" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Assign Worker</label>
                <select name="assignedWorker" value={form.assignedWorker} onChange={handleChange} className="glass-input w-full">
                  <option value="" className="bg-dark-900">-- Choose worker --</option>
                  {workers.map(w => (
                    <option key={w._id} value={w._id} className="bg-dark-900">
                      {w.name} ({w.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingBin ? 'Update Bin' : 'Create Bin'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BinManagement;
