import React, { useEffect, useState } from 'react';
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { useSettings } from '../../hooks/useSettings';
import type { ReviewDTO } from '@skylite/shared';

// Google "G" SVG Component
const GoogleGIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export const ReviewsPage: React.FC = () => {
  const { toast } = useToast();
  const { settings } = useSettings();
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [relativeTime, setRelativeTime] = useState('Recently');
  const [avatarUrl, setAvatarUrl] = useState('');

  const googleMapsUrl = settings?.googleMapsUrl || 'https://www.google.com/maps/place/SKYLITE+PRIVATE+THEATRE/@12.8948263,77.6360471,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15e2f14d2377:0x47d46b1bedcb865d!8m2!3d12.8948263!4d77.6360471!16s%2Fg%2F11nv10h_pq';
  const googleReviewUrl = settings?.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJdyNN8eIVrjsRXYbL7Rtr1Ec';
  const averageRating = settings?.averageRating || 4.9;
  const totalReviewsCount = settings?.totalReviewsCount || 13;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getReviews();
      setReviews(data);
    } catch (err: any) {
      toast('error', 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSyncGoogle = async () => {
    try {
      setSyncing(true);
      const res = await adminApi.syncGoogleReviews(settings?.googlePlaceId, settings?.googlePlacesApiKey);
      toast('success', `Synced ${res.count} reviews from Google`);
      fetchReviews();
    } catch (err: any) {
      toast('error', 'Failed to sync with Google Places API');
    } finally {
      setSyncing(false);
    }
  };

  const openCreateModal = () => {
    setEditingReview(null);
    setCustomerName('');
    setRating(5);
    setComment('');
    setRelativeTime('Recently');
    setAvatarUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (r: ReviewDTO) => {
    setEditingReview(r);
    setCustomerName(r.customerName);
    setRating(r.rating);
    setComment(r.comment);
    setRelativeTime(r.relativeTime || 'Recently');
    setAvatarUrl(r.avatarUrl || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      toast('error', 'Customer name and review comment are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingReview) {
        await adminApi.updateReview(editingReview.id, {
          customerName,
          rating: Number(rating),
          comment,
          relativeTime,
          avatarUrl: avatarUrl || undefined,
        });
        toast('success', 'Review updated successfully');
      } else {
        await adminApi.createReview({
          customerName,
          rating: Number(rating),
          comment,
          relativeTime,
          avatarUrl: avatarUrl || undefined,
          source: 'GOOGLE',
          isActive: true,
          displayOrder: reviews.length + 1,
        });
        toast('success', 'Google review added successfully');
      }

      setIsModalOpen(false);
      fetchReviews();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await adminApi.deleteReview(id);
      toast('success', 'Review deleted');
      fetchReviews();
    } catch (err) {
      toast('error', 'Failed to delete review');
    }
  };

  const handleToggleActive = async (r: ReviewDTO) => {
    try {
      await adminApi.updateReview(r.id, { isActive: !r.isActive });
      toast('success', r.isActive ? 'Review hidden from homepage' : 'Review visible on homepage');
      fetchReviews();
    } catch (err) {
      toast('error', 'Failed to update visibility');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-2.5">
            <GoogleGIcon className="w-7 h-7" />
            Google Reviews Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Display, sync, and manage customer reviews shown on the homepage carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleSyncGoogle} loading={syncing} className="gap-1.5">
            <RefreshCw className="w-4 h-4" /> Sync from Google API
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Review
          </Button>
        </div>
      </div>

      {/* Google Profile Card */}
      <div className="bg-brand-dark border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-md">
            <GoogleGIcon className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-heading font-bold text-white">SKYLITE PRIVATE THEATRE</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Verified Listing
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{averageRating.toFixed(1)} / 5.0</span>
              </div>
              <span>•</span>
              <span>{totalReviewsCount}+ Reviews on Google Maps</span>
              <span>•</span>
              <span className="text-gray-500">Garvebhavi Palya, Bengaluru</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-800 text-gray-300 text-xs font-semibold border border-gray-700 transition-colors"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-colors"
          >
            <span>Write a Review Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Reviews Table / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-44 bg-gray-900/60 rounded-2xl animate-pulse" />
          <div className="h-44 bg-gray-900/60 rounded-2xl animate-pulse" />
          <div className="h-44 bg-gray-900/60 rounded-2xl animate-pulse" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl bg-brand-dark/40">
          <MessageSquare className="w-14 h-14 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-heading text-gray-300">No reviews found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
            Add authentic customer feedback from Google Maps to display in the homepage carousel.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" /> Add First Review
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`bg-brand-dark border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                r.isActive ? 'border-gray-800 hover:border-blue-500/40 shadow-lg' : 'border-rose-900/40 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {r.avatarUrl ? (
                      <img src={r.avatarUrl} alt={r.customerName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/20">
                        {r.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-heading font-bold text-white">{r.customerName}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <GoogleGIcon className="w-3 h-3" />
                        <span>Google Review</span>
                        {r.relativeTime && <span>• {r.relativeTime}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(r)}
                    title={r.isActive ? 'Hide from homepage' : 'Show on homepage'}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      r.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    {r.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-0.5 mb-2.5">
                  {Array.from({ length: r.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-4">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${r.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {r.isActive ? '● Visible on Site' : '○ Hidden'}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(r)} className="p-1.5 h-auto text-gray-400 hover:text-white">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id, r.customerName)} className="p-1.5 h-auto text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReview ? 'Edit Review' : 'Add Google Review'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Customer / Reviewer Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Rating (Stars) *
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Time Posted
              </label>
              <input
                type="text"
                value={relativeTime}
                onChange={(e) => setRelativeTime(e.target.value)}
                placeholder="e.g. 2 days ago, 1 week ago"
                className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Avatar Photo URL (Optional)
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://... photo url"
              className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Review Comment *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Paste the customer feedback text from Google Maps..."
              className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingReview ? 'Save Changes' : 'Add Review'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReviewsPage;
