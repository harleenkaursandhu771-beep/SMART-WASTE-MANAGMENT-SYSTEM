import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlineTruck, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, getUsers } from '../services/api';

/**
 * Vehicle Management Page (Admin)
 * View and manage the waste collection fleet.
 * Assigns workers/drivers to vehicles.
 */
const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form, setForm] = useState({
    vehicleId: '',
    vehicleNumber: '',
    driverName: '',
    capacity: 0,
    status: 'available',
    assignedWorker: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVehicles();
    fetchWorkers();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(res.data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
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

  const openCreate = () => {
    setEditingVehicle(null);
    setForm({
      vehicleId: '',
      vehicleNumber: '',
      driverName: '',
      capacity: 0,
      status: 'available',
      assignedWorker: ''
    });
    setError('');
    setShowModal(true);
  };

  const openEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setForm({
      vehicleId: vehicle.vehicleId,
      vehicleNumber: vehicle.vehicleNumber,
      driverName: vehicle.driverName,
      capacity: vehicle.capacity,
      status: vehicle.status,
      assignedWorker: vehicle.assignedWorker?._id || vehicle.assignedWorker || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const vehicleData = { ...form };
      // If no worker is selected, set to null
      if (!vehicleData.assignedWorker) {
        vehicleData.assignedWorker = null;
      }
      
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }
      
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle from the fleet?')) {
      try {
        await deleteVehicle(id);
        fetchVehicles();
      } catch (err) {
        console.error('Failed to delete vehicle:', err);
      }
    }
  };

  const filtered = vehicles.filter(v => 
    v.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
    v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.driverName.toLowerCase().includes(search.toLowerCase()) ||
    (v.assignedWorker?.name && v.assignedWorker.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Vehicle Fleet</h2>
          <p className="text-sm text-white/40">Manage collection vehicles, driver assignments, and capacity limits</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fleet by ID, plate, or driver..."
          className="glass-input w-full pl-12" 
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(v => (
          <div key={v._id} className="glass-card p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                  <HiOutlineTruck size={24} />
                </div>
                <StatusBadge status={v.status} />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-0.5">{v.vehicleNumber}</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-4">{v.vehicleId}</p>
              
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Driver Name</span>
                  <span className="text-white/80 font-semibold">{v.driverName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Capacity Limit</span>
                  <span className="text-white/80 font-semibold">{v.capacity} kg</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-white/40">Assigned Driver</span>
                  {v.assignedWorker ? (
                    <span className="text-teal-400 font-semibold flex items-center gap-1">
                      <HiOutlineUser className="w-3.5 h-3.5" /> {v.assignedWorker.name}
                    </span>
                  ) : (
                    <span className="text-white/30 italic text-xs">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-white/5 pt-4 mt-6">
              <button onClick={() => openEdit(v)} className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1">
                <HiOutlinePencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(v._id)} className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20">
                <HiOutlineTrash className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingVehicle ? 'Edit Vehicle details' : 'Add New Vehicle'}
            </h3>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Vehicle ID</label>
                <input 
                  name="vehicleId" 
                  value={form.vehicleId} 
                  onChange={e => setForm({...form, vehicleId: e.target.value})} 
                  placeholder="e.g. VEH-101" 
                  className="glass-input w-full" 
                  required 
                  disabled={!!editingVehicle}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">License Plate Number</label>
                <input 
                  name="vehicleNumber" 
                  value={form.vehicleNumber} 
                  onChange={e => setForm({...form, vehicleNumber: e.target.value})} 
                  placeholder="e.g. KA-03-HA-1234" 
                  className="glass-input w-full" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Driver Name</label>
                <input 
                  name="driverName" 
                  value={form.driverName} 
                  onChange={e => setForm({...form, driverName: e.target.value})} 
                  placeholder="e.g. John Driver" 
                  className="glass-input w-full" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Capacity (kg)</label>
                <input 
                  name="capacity" 
                  type="number" 
                  value={form.capacity} 
                  onChange={e => setForm({...form, capacity: Number(e.target.value)})} 
                  placeholder="e.g. 1500" 
                  className="glass-input w-full" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Assigned Worker (System Driver Account)</label>
                <select 
                  name="assignedWorker" 
                  value={form.assignedWorker} 
                  onChange={e => setForm({...form, assignedWorker: e.target.value})} 
                  className="glass-input w-full"
                >
                  <option value="" className="bg-dark-900">-- Choose worker --</option>
                  {workers.map(w => (
                    <option key={w._id} value={w._id} className="bg-dark-900">
                      {w.name} ({w.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Vehicle Fleet Status</label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={e => setForm({...form, status: e.target.value})} 
                  className="glass-input w-full"
                >
                  <option value="available" className="bg-dark-900">Available</option>
                  <option value="in-use" className="bg-dark-900">In Use</option>
                  <option value="maintenance" className="bg-dark-900">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Save Vehicle</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
