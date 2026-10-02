import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import type { GalleryImageDTO } from '@skylite/shared';

const CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'birthdays', label: 'Birthdays' },
  { id: 'anniversaries', label: 'Anniversaries' },
  { id: 'theatres', label: 'Theatres' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'datenights', label: 'Date Nights' },
];

export const GalleryPage: React.FC = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImageDTO | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('birthdays');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getGalleryImages();
      setImages(data);
    } catch (err: any) {
      toast('error', 'Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openCreateModal = () => {
    setEditingImage(null);
    setTitle('');
    setCategory('birthdays');
    setDescription('');
    setDisplayOrder(images.length + 1);
    setImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadMode('upload');
    setIsModalOpen(true);
  };

  const openEditModal = (img: GalleryImageDTO) => {
    setEditingImage(img);
    setTitle(img.title);
    setCategory(img.category);
    setDescription(img.description || '');
    setDisplayOrder(img.displayOrder);
    setImageUrl(img.imageUrl);
    setSelectedFile(null);
    setPreviewUrl(img.imageUrl);
    setUploadMode('url');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast('error', 'Title is required');
      return;
    }

    try {
      setSubmitting(true);
      let finalImageUrl = imageUrl;

      // Handle file upload if in upload mode
      if (uploadMode === 'upload' && selectedFile) {
        const uploadRes = await adminApi.uploadImage(selectedFile);
        finalImageUrl = uploadRes.url;
      }

      if (!finalImageUrl.trim()) {
        toast('error', 'Please upload an image or provide an image URL');
        setSubmitting(false);
        return;
      }

      if (editingImage) {
        await adminApi.updateGalleryImage(editingImage.id, {
          title,
          category,
          description,
          displayOrder: Number(displayOrder) || 0,
          imageUrl: finalImageUrl,
        });
        toast('success', 'Gallery image updated successfully');
      } else {
        await adminApi.createGalleryImage({
          title,
          category,
          description,
          displayOrder: Number(displayOrder) || 0,
          imageUrl: finalImageUrl,
          isActive: true,
        });
        toast('success', 'Gallery image added successfully');
      }

      setIsModalOpen(false);
      fetchImages();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save gallery image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the gallery?`)) {
      return;
    }
    try {
      await adminApi.deleteGalleryImage(id);
      toast('success', 'Image removed from gallery');
      fetchImages();
    } catch (err: any) {
      toast('error', 'Failed to remove image');
    }
  };

  const handleToggleActive = async (img: GalleryImageDTO) => {
    try {
      await adminApi.updateGalleryImage(img.id, { isActive: !img.isActive });
      toast('success', img.isActive ? 'Image hidden from customer gallery' : 'Image visible in customer gallery');
      fetchImages();
    } catch (err) {
      toast('error', 'Failed to toggle visibility');
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-brand-gold" />
            Gallery Showcase Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Add, organize, and manage celebration photos shown on the customer homepage and gallery page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={fetchImages} className="gap-1.5">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal} className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Image
          </Button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all'
            ? images.length
            : images.filter((img) => img.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-brand-gold text-brand-dark shadow-md shadow-brand-gold/20'
                  : 'bg-brand-dark border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-brand-dark/20 text-brand-dark' : 'bg-gray-800 text-gray-300'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <LoadingSkeleton variant="card" count={8} />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl bg-brand-dark/40">
          <FolderOpen className="w-14 h-14 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-heading text-gray-300">No images in this category</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
            Upload new photos from celebrations to showcase your theatre ambiance.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-1" /> Add Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className={`group bg-brand-dark border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                img.isActive
                  ? 'border-gray-800 hover:border-brand-gold/50 shadow-lg'
                  : 'border-rose-900/40 opacity-60'
              }`}
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-video w-full bg-gray-950 overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 text-brand-gold backdrop-blur-md border border-white/10">
                      {img.category}
                    </span>
                    {!img.isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/80 text-white">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-heading font-bold text-white line-clamp-1 mb-1">
                    {img.title}
                  </h3>
                  {img.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {img.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-3 border-t border-gray-800/80 bg-brand-darker/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(img)}
                  title={img.isActive ? 'Hide image' : 'Show image'}
                  className={`p-2 rounded-lg text-xs transition-colors ${
                    img.isActive
                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                      : 'text-gray-500 hover:bg-gray-800'
                  }`}
                >
                  {img.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(img)}
                    className="p-2 h-auto text-gray-300 hover:text-brand-gold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(img.id, img.title)}
                    className="p-2 h-auto text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingImage ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Title / Occasion Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Glow Birthday Celebration"
              className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold capitalize"
              >
                <option value="birthdays">Birthdays</option>
                <option value="anniversaries">Anniversaries</option>
                <option value="theatres">Theatres</option>
                <option value="proposals">Proposals</option>
                <option value="datenights">Date Nights</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about the decoration theme or screening setup..."
              className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Upload Mode Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Image Source *
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUploadMode('upload')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'upload'
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                    : 'border-gray-800 bg-brand-darker text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Upload File from PC
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all flex items-center justify-center gap-1.5 ${
                  uploadMode === 'url'
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                    : 'border-gray-800 bg-brand-darker text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Provide Image URL
              </button>
            </div>

            {uploadMode === 'upload' ? (
              <div className="border-2 border-dashed border-gray-800 rounded-xl p-4 text-center hover:border-brand-gold/50 transition-colors">
                <input
                  type="file"
                  id="gallery-file-input"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="gallery-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-brand-gold mb-2" />
                  <span className="text-xs text-white font-medium">Click to select photo</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">JPG, PNG, or WEBP (up to 5MB)</span>
                  {selectedFile && (
                    <span className="mt-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Selected: {selectedFile.name}
                    </span>
                  )}
                </label>
              </div>
            ) : (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://images.unsplash.com/... or https://..."
                className="w-full bg-brand-darker border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            )}
          </div>

          {/* Live Preview */}
          {previewUrl && (
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Preview
              </span>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800 bg-gray-950">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingImage ? 'Save Changes' : 'Upload to Gallery'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryPage;
