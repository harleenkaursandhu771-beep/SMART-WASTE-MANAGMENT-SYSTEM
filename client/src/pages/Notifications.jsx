import { useEffect, useState } from 'react';
import { HiOutlineBell, HiOutlineCheck, HiOutlineExclamation, HiOutlineInformationCircle, HiOutlineTrash, HiOutlineMailOpen } from 'react-icons/hi';
import { getNotifications, markNotificationRead, deleteNotification } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Notifications Page
 * Supports: Mark as read, Delete notifications, Filter tabs, Mark all as read.
 */
const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'unread', 'read'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      // Filter for notifications intended for the current logged-in user (or admin sees all)
      const userNotifications = res.data.filter(
        (n) => n.recipientId?._id === user._id || n.recipientId === user._id || user.role === 'admin'
      );
      setNotifications(userNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.readStatus);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map(n => markNotificationRead(n._id)));
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <HiOutlineExclamation className="text-amber-400 w-5 h-5" />;
      case 'success': return <HiOutlineCheck className="text-emerald-400 w-5 h-5" />;
      case 'task': return <HiOutlineBell className="text-blue-400 w-5 h-5" />;
      default: return <HiOutlineInformationCircle className="text-primary-400 w-5 h-5" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterTab === 'unread') return !n.readStatus;
    if (filterTab === 'read') return n.readStatus;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HiOutlineBell className="text-primary-400 animate-pulse" /> Notifications
          </h2>
          <p className="text-sm text-white/40">Stay updated on your tasks, reports, and system alerts</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="btn-ghost py-2 px-4 flex items-center gap-2 text-xs w-fit"
          >
            <HiOutlineMailOpen className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2">
        {['all', 'unread', 'read'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 border flex items-center gap-1.5 ${
              filterTab === tab
                ? 'bg-gradient-to-r from-primary-600/30 to-teal-600/20 text-white border-primary-500/30 shadow-lg'
                : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab}
            {tab === 'unread' && unreadCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/30 text-sm">No notifications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div 
              key={n._id} 
              className={`glass-card p-5 border-l-4 transition-all duration-300 ${
                n.readStatus 
                  ? 'border-white/5 opacity-60' 
                  : 'border-primary-500 shadow-lg shadow-primary-500/5'
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5">
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm leading-relaxed pr-6">{n.message}</p>
                  <p className="text-[10px] text-white/30 mt-2 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {!n.readStatus && (
                    <button 
                      onClick={() => handleMarkAsRead(n._id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-white/40 border border-white/5 hover:border-emerald-500/20 transition-all duration-200"
                      title="Mark as read"
                    >
                      <HiOutlineCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(n._id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/40 border border-white/5 hover:border-red-500/20 transition-all duration-200"
                    title="Delete notification"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
