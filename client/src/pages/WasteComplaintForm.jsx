import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { getBins, createReport } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * Waste Complaint Form
 * Citizens submit reports about waste issues linked to specific bins.
 */
const WasteComplaintForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    binId: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await getBins();
        setBins(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBins();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const reportData = {
        reportId: `RPT-${Date.now().toString().slice(-6)}`,
        citizenId: user._id,
        binId: form.binId,
        description: form.description,
        imageUrl: form.imageUrl,
      };
      await createReport(reportData);
      setSuccess(true);
      setForm({ binId: '', description: '', imageUrl: '' });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Report a Waste Issue</h2>
        <p className="text-sm text-white/40 mt-1">Help us keep the city clean by reporting waste problems.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-slide-up">
          ✅ Your report has been submitted successfully! We'll look into it.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
        {/* Select Bin */}
        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Select Bin
          </label>
          <select
            name="binId"
            value={form.binId}
            onChange={handleChange}
            className="glass-input w-full"
            required
          >
            <option value="" className="bg-dark-900">-- Choose a bin --</option>
            {bins.map((bin) => (
              <option key={bin._id} value={bin._id} className="bg-dark-900">
                {bin.binId} — {bin.location} ({bin.area})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="glass-input w-full resize-none"
            placeholder="Describe the waste issue in detail..."
            required
          />
        </div>

        {/* Image URL (placeholder for future file upload) */}
        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
            Image URL (Optional)
          </label>
          <div className="relative">
            <HiOutlinePhotograph className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="glass-input w-full pl-12"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <p className="text-xs text-white/30 mt-1">You can paste an image URL or upload one later.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-emerald flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Submit Report'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-ghost flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WasteComplaintForm;
