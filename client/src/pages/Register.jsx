import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

/**
 * Register Page
 * Creates a new user account. Defaults to 'citizen' role.
 */
const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'citizen',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: HiOutlineUser, placeholder: 'John Doe', required: true },
    { name: 'email', label: 'Email', type: 'email', icon: HiOutlineMail, placeholder: 'you@example.com', required: true },
    { name: 'password', label: 'Password', type: 'password', icon: HiOutlineLockClosed, placeholder: '••••••••', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', icon: HiOutlinePhone, placeholder: '9876543210', required: false },
    { name: 'address', label: 'Address', type: 'text', icon: HiOutlineLocationMarker, placeholder: '123 Street, City', required: false },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow delay-300" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mx-auto mb-4">
            <span className="text-white font-black text-2xl">W</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/40 mt-2">Join WasteWise today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                {f.label}
              </label>
              <div className="relative">
                <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="glass-input w-full pl-12"
                  placeholder={f.placeholder}
                  required={f.required}
                />
              </div>
            </div>
          ))}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
              Register As
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['citizen', 'worker', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 border ${
                    form.role === role
                      ? 'bg-primary-600/30 border-primary-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-emerald w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
