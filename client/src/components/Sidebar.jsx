import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineBell,
  HiOutlineChatAlt2,
  HiOutlineLogout,
  HiOutlineUserGroup,
  HiOutlineX,
  HiOutlineDatabase,
  HiOutlineClock,
} from 'react-icons/hi';

/**
 * Sidebar Navigation
 * Adapts menu items based on user role (admin, worker, citizen).
 * Includes glassmorphism styling, animated links, and responsive collapse.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based navigation items
  const getNavItems = () => {
    const common = [
      { to: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
    ];

    if (user?.role === 'admin') {
      return [
        { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
        { to: '/bins', icon: HiOutlineCube, label: 'Bin Management' },
        { to: '/reports', icon: HiOutlineDocumentText, label: 'Waste Reports' },
        { to: '/tasks', icon: HiOutlineClipboardList, label: 'Collection Tasks' },
        { to: '/vehicles', icon: HiOutlineTruck, label: 'Vehicles' },
        { to: '/users', icon: HiOutlineUserGroup, label: 'Users' },
        { to: '/database', icon: HiOutlineDatabase, label: 'Database Viewer' },
        { to: '/activity-logs', icon: HiOutlineClock, label: 'Activity Logs' },
        ...common,
        { to: '/feedback', icon: HiOutlineChatAlt2, label: 'Feedback' },
      ];
    }

    if (user?.role === 'worker') {
      return [
        { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
        { to: '/tasks', icon: HiOutlineClipboardList, label: 'My Tasks' },
        { to: '/bins', icon: HiOutlineCube, label: 'Assigned Bins' },
        ...common,
      ];
    }

    // citizen
    return [
      { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
      { to: '/complaint', icon: HiOutlineDocumentText, label: 'Report Issue' },
      { to: '/reports', icon: HiOutlineClipboardList, label: 'My Reports' },
      ...common,
      { to: '/feedback', icon: HiOutlineChatAlt2, label: 'Feedback' },
    ];
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
      isActive
        ? 'bg-gradient-to-r from-primary-600/30 to-teal-600/20 text-white border border-primary-500/30 shadow-lg shadow-primary-500/10'
        : 'text-white/50 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-in-out
          bg-dark-950/80 backdrop-blur-2xl border-r border-white/5
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-black text-lg">W</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">WasteWise</h1>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Smart Management</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-white/40 capitalize">{user?.role || 'guest'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {getNavItems().map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
