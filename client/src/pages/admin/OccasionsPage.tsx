import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import type { OccasionDTO, TheatreDTO, PackageDTO, AddonDTO } from '@skylite/shared';
import { Plus, Edit2, Sparkles, Star, CheckCircle2, XCircle, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export const OccasionsPage: React.FC = () => {
  const { toast } = useToast();
  const [occasions, setOccasions] = useState<OccasionDTO[]>([]);
  const [theatres, setTheatres] = useState<TheatreDTO[]>([]);
  const [packages, setPackages] = useState<PackageDTO[]>([]);
  const [addons, setAddons] = useState<AddonDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<OccasionDTO | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedTheatreIds, setSelectedTheatreIds] = useState<string[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await adminApi.uploadImage(file);
      setImageUrl(res.url);
      toast('success', 'Occasion photo uploaded successfully!');
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [occList, thList, pkgList, addList] = await Promise.all([
        adminApi.getOccasions(),
        adminApi.getTheatres(),
        adminApi.getPackages(),
        adminApi.getAddons(),
      ]);
      setOccasions(occList);
      setTheatres(thList);
      setPackages(pkgList);
      setAddons(addList);
    } catch (err: any) {
      toast('error', 'Failed to load occasions data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingOccasion(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(occasions.length);
    setIsFeatured(false);
    setIsActive(true);
    setSelectedTheatreIds(theatres.map((t) => t.id));
    setSelectedPackageIds(packages.map((p) => p.id));
    setSelectedAddonIds(addons.map((a) => a.id));
    setModalOpen(true);
  };

  const handleOpenEdit = (occ: any) => {
    setEditingOccasion(occ);
    setName(occ.name);
    setDescription(occ.description);
    setImageUrl(occ.imageUrl || '');
    setDisplayOrder(occ.displayOrder);
    setIsFeatured(occ.isFeatured);
    setIsActive(occ.isActive);

    const linkedTheatres = occ.occasionTheatres?.map((ot: any) => ot.theatreId) || [];
    const linkedPackages = occ.occasionPackages?.map((op: any) => op.packageId) || [];
    const linkedAddons = occ.occasionAddons?.map((oa: any) => oa.addonId) || [];

    setSelectedTheatreIds(linkedTheatres);
    setSelectedPackageIds(linkedPackages);
    setSelectedAddonIds(linkedAddons);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingOccasion) {
        await adminApi.updateOccasion(editingOccasion.id, {
          name,
          description,
          imageUrl: imageUrl || undefined,
          displayOrder: Number(displayOrder),
          isFeatured,
          isActive,
          theatreIds: selectedTheatreIds,
          packageIds: selectedPackageIds,
          addonIds: selectedAddonIds,
        });
        toast('success', 'Occasion updated successfully');
      } else {
        await adminApi.createOccasion({
          name,
          description,
          imageUrl: imageUrl || undefined,
          displayOrder: Number(displayOrder),
          isFeatured,
          isActive,
          theatreIds: selectedTheatreIds,
          packageIds: selectedPackageIds,
          addonIds: selectedAddonIds,
        });
        toast('success', 'Occasion created successfully');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save occasion');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Occasions Management</h1>
          <p className="text-gray-400 text-sm">Configure celebration types, featured badges, and mapped packages</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Occasion
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading occasions...</div>
      ) : occasions.length === 0 ? (
        <div className="bg-brand-dark border border-gray-800 rounded-xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No occasions configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occ) => (
            <div
              key={occ.id}
              className="bg-brand-dark border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-heading font-bold text-white">{occ.name}</h3>
                  <div className="flex items-center gap-1.5">
                    {occ.isFeatured && (
                      <span className="text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-brand-gold" /> Featured
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold ${
                        occ.isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {occ.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {occ.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-4">{occ.description}</p>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(occ)} className="flex items-center gap-1.5 text-xs">
                  <Edit2 className="w-3.5 h-3.5" /> Edit Occasion
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingOccasion ? 'Edit Occasion' : 'Create Occasion'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Occasion Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Birthday Celebration"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for customer discovery"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Occasion Photo</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL (https://...) or upload file"
                  className="flex-1 bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-xs font-medium rounded-lg transition-colors shrink-0">
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              {imageUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-800 bg-brand-darker flex items-center justify-center">
                  <img
                    src={imageUrl.startsWith('/') ? imageUrl : imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-red-400 p-1 rounded-full text-xs"
                    title="Remove Photo"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="occFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-800 bg-brand-darker text-brand-gold"
              />
              <label htmlFor="occFeatured" className="text-xs text-gray-300">
                Featured on Homepage
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="occActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-800 bg-brand-darker text-brand-gold"
              />
              <label htmlFor="occActive" className="text-xs text-gray-300">
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              {editingOccasion ? 'Save Changes' : 'Create Occasion'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OccasionsPage;