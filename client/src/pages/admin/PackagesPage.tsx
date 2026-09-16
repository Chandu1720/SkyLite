import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '@skylite/shared';
import type { PackageDTO } from '@skylite/shared';
import { Plus, Edit2, CheckCircle2, XCircle, Gift, Check } from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<PackageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageDTO | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [featuresInput, setFeaturesInput] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getPackages();
      setPackages(data);
    } catch (err: any) {
      toast('error', 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenCreate = () => {
    setEditingPkg(null);
    setName('');
    setDescription('');
    setPrice(1999);
    setDurationMinutes(120);
    setFeaturesInput('Private Theatre\nMovie Screening\nSpecial Lighting');
    setIsActive(true);
    setDisplayOrder(packages.length);
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: PackageDTO) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setPrice(pkg.price);
    setDurationMinutes(pkg.durationMinutes);
    const parsedFeatures = Array.isArray(pkg.features)
      ? pkg.features
      : typeof pkg.features === 'string'
      ? JSON.parse(pkg.features || '[]')
      : [];
    setFeaturesInput(parsedFeatures.join('\n'));
    setIsActive(pkg.isActive);
    setDisplayOrder(pkg.displayOrder);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const features = featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (editingPkg) {
        await adminApi.updatePackage(editingPkg.id, {
          name,
          description,
          price: Number(price),
          durationMinutes: Number(durationMinutes),
          features,
          isActive,
          displayOrder: Number(displayOrder),
        });
        toast('success', 'Package updated successfully');
      } else {
        await adminApi.createPackage({
          name,
          description,
          price: Number(price),
          durationMinutes: Number(durationMinutes),
          features,
          isActive,
          displayOrder: Number(displayOrder),
        });
        toast('success', 'Package created successfully');
      }
      setModalOpen(false);
      fetchPackages();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Celebration Packages</h1>
          <p className="text-gray-400 text-sm">Configure dynamic pricing, durations, and included features</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Package
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading packages...</div>
      ) : packages.length === 0 ? (
        <div className="bg-brand-dark border border-gray-800 rounded-xl p-12 text-center">
          <Gift className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No packages configured yet. Click "Add Package" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const parsedFeatures: string[] = Array.isArray(pkg.features)
              ? pkg.features
              : typeof pkg.features === 'string'
              ? JSON.parse(pkg.features || '[]')
              : [];

            return (
              <div
                key={pkg.id}
                className="bg-brand-dark border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-heading font-bold text-white">{pkg.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold ${
                        pkg.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {pkg.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-heading font-bold text-brand-gold">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className="text-xs text-gray-400">/ {pkg.durationMinutes} Mins</span>
                  </div>

                  <p className="text-xs text-gray-400 mb-4">{pkg.description}</p>

                  <div className="space-y-1.5 mb-4">
                    {parsedFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(pkg)} className="flex items-center gap-1.5 text-xs">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Package
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPkg ? 'Edit Package' : 'Create Package'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Package Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Birthday Premium Experience"
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
              placeholder="Brief description of the package"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Base Price (₹) *</label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Duration (Minutes) *</label>
              <input
                type="number"
                min={30}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Included Features (one per line)
            </label>
            <textarea
              rows={4}
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              placeholder="Private Theatre&#10;Birthday Decoration&#10;Cake&#10;Music System"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pkgActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-800 bg-brand-darker text-brand-gold"
            />
            <label htmlFor="pkgActive" className="text-xs text-gray-300">
              Active (Visible during booking)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              {editingPkg ? 'Save Changes' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackagesPage;