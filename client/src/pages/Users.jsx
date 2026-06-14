import { useEffect, useState } from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineLocationMarker } from 'react-icons/hi';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

/**
 * Users Management Page (Admin Only)
 * View and manage system users (Admin, Worker, Citizen) with full CRUD.
 */
const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', role: 'citizen', phone: '', address: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '', // blank by default on edit unless changing
      role: user.role,
      phone: user.phone || '',
      address: user.address || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingUser) {
        // If password is empty, don't update it
        const updateData = { ...form };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateUser(editingUser._id, updateData);
      } else {
        if (!form.password) {
          setError('Password is required for new users');
          return;
        }
        await createUser(form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
      
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">System Users</h2>
          <p className="text-sm text-white/40">Manage user accounts, roles, and contact details</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <HiOutlinePlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, phone..."
            className="glass-input w-full pl-12"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'admin', 'worker', 'citizen'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                roleFilter === role
                  ? 'bg-gradient-to-r from-primary-600/30 to-teal-600/20 text-white border-primary-500/30 shadow-lg'
                  : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <div key={u._id} className="glass-card p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0
                  ${u.role === 'admin' ? 'bg-purple-600 shadow-lg shadow-purple-600/20' : u.role === 'worker' ? 'bg-teal-600 shadow-lg shadow-teal-600/20' : 'bg-primary-600 shadow-lg shadow-primary-600/20'}`}>
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-white font-semibold truncate pr-2" title={u.name}>{u.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      u.role === 'worker' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                      'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <HiOutlineMail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate" title={u.email}>{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <HiOutlinePhone className="w-4 h-4 flex-shrink-0" />
                      <span>{u.phone || 'N/A'}</span>
                    </div>
                    {u.address && (
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <HiOutlineLocationMarker className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate" title={u.address}>{u.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-white/5 pt-4 mt-4">
              <button onClick={() => openEdit(u)} className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1">
                <HiOutlinePencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => handleDelete(u._id)} className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20">
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
              {editingUser ? 'Edit User details' : 'Add New User'}
            </h3>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="glass-input w-full" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="glass-input w-full" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                  Password {editingUser && <span className="text-[10px] text-white/30 lowercase">(leave blank to keep unchanged)</span>}
                </label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="glass-input w-full" placeholder="••••••••" required={!editingUser} />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">System Role</label>
                <select name="role" value={form.role} onChange={handleChange} className="glass-input w-full">
                  <option value="citizen" className="bg-dark-900">Citizen</option>
                  <option value="worker" className="bg-dark-900">Waste Worker</option>
                  <option value="admin" className="bg-dark-900">System Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="glass-input w-full" placeholder="+15550100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">Home/Work Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="glass-input w-full" placeholder="Street Name, Area" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingUser ? 'Update User' : 'Create User'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
