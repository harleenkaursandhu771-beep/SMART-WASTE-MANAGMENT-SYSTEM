import { useEffect, useState } from 'react';
import { HiOutlineStar, HiStar, HiOutlineTrash, HiOutlineChatAlt2 } from 'react-icons/hi';
import { getFeedback, createFeedback, deleteFeedback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

/**
 * Feedback Page
 * Admin: View all ratings, delete feedback, view aggregate ratings statistics.
 * Citizen: Submit a new rating and review.
 */
const Feedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [user]);

  const fetchFeedback = async () => {
    if (user.role !== 'admin') {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getFeedback();
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFeedback({ citizenId: user._id, rating, comment });
      setSuccess(true);
      setRating(0);
      setComment('');
      setTimeout(() => setSuccess(false), 3000);
      fetchFeedback();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback entry?')) {
      try {
        await deleteFeedback(id);
        fetchFeedback();
      } catch (err) {
        console.error('Failed to delete feedback:', err);
      }
    }
  };

  // Calculations for stats
  const totalCount = feedbacks.length;
  const averageRating = totalCount > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalCount).toFixed(1) 
    : '0.0';
  const fiveStarCount = feedbacks.filter(f => f.rating === 5).length;
  const fourStarCount = feedbacks.filter(f => f.rating === 4).length;

  if (user.role === 'admin') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-white">Citizen Feedback</h2>
          <p className="text-sm text-white/40">Monitor service ratings and quality reviews from the community</p>
        </div>

        {/* Feedback Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            icon={HiOutlineStar} 
            label="Average Rating" 
            value={`${averageRating} / 5.0`} 
            color="amber" 
            delay={0} 
          />
          <StatCard 
            icon={HiOutlineChatAlt2} 
            label="Total Reviews" 
            value={totalCount} 
            color="primary" 
            delay={100} 
          />
          <StatCard 
            icon={HiStar} 
            label="Excellent Reviews (5★)" 
            value={fiveStarCount} 
            color="teal" 
            delay={200} 
          />
        </div>

        {/* Feedback Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-white/30 text-sm">No citizen feedback entries recorded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map(f => (
              <div key={f._id} className="glass-card p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        i < f.rating ? <HiStar key={i} className="text-amber-400 w-5 h-5" /> : <HiOutlineStar key={i} className="text-white/20 w-5 h-5" />
                      ))}
                    </div>
                    <button 
                      onClick={() => handleDelete(f._id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/40 border border-white/5 hover:border-red-500/20 transition-all duration-300"
                      title="Delete Feedback Entry"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-white/80 italic mb-4 leading-relaxed font-serif">
                    "{f.comment || 'No review comment provided.'}"
                  </p>
                </div>
                
                <div className="text-xs text-white/40 border-t border-white/5 pt-3 mt-4">
                  — <span className="font-semibold text-white/60">{f.citizenId?.name || 'Anonymous citizen'}</span> • {new Date(f.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Citizen submit view
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">How are we doing?</h2>
        <p className="text-sm text-white/40 mt-1">Rate the smart waste collection service to help us optimize zone routing</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-sm animate-slide-up">
          Thank you! Your rating and comments have been recorded.
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
        <div className="flex justify-center gap-4 py-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button 
              key={star} 
              type="button" 
              onClick={() => setRating(star)} 
              className="transition-transform hover:scale-125 focus:outline-none"
            >
              {rating >= star ? (
                <HiStar size={44} className="text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
              ) : (
                <HiOutlineStar size={44} className="text-white/20 hover:text-amber-400/50" />
              )}
            </button>
          ))}
        </div>
        
        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Your Review
          </label>
          <textarea 
            placeholder="Tell us about your experience, collection delays, or staff behavior..." 
            className="glass-input w-full h-32 resize-none leading-relaxed"
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary w-full py-3" 
          disabled={rating === 0}
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
};

export default Feedback;
