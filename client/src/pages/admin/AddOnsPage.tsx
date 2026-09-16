import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '@skylite/shared';
import type { AddonDTO } from '@skylite/shared';
import { Plus, Edit2, CheckCircle2, XCircle, Package } from 'lucide-react';

export const AddOnsPage: React.FC = () => {
  const { toast } = useToast();
  const [addons, setAddons] = useState<AddonDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonDTO | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchAddons = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAddons();
      setAddons(data);
    } catch (err: any) {
      toast('error', 'Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const handleOpenCreate = () => {
    setEditingAddon(null);
    setName('');
    setDescription('');
    setPrice(0);
    setIsActive(true);
    setDisplayOrder(addons.length);
    setModalOpen(true);
  };

  const handleOpenEdit = (addon: AddonDTO) => {
    setEditingAddon(addon);
    setName(addon.name);
    setDescription(addon.description);
    setPrice(addon.price);
    setIsActive(addon.isActive);
    setDisplayOrder(addon.displayOrder);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingAddon) {
        await adminApi.updateAddon(editingAddon.id, {
          name,
          description,
          price: Number(price),
          isActive,
          displayOrder: Number(displayOrder),
        });
        toast('success', 'Add-on updated successfully');
      } else {
        await adminApi.createAddon({
          name,
          description,
          price: Number(price),
          isActive,
          displayOrder: Number(displayOrder),
        });
        toast('success', 'Add-on created successfully');
      }
      setModalOpen(false);
      fetchAddons();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save add-on');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Add-on Services</h1>
          <p className="text-gray-400 text-sm">Configure dynamic add-ons such as cakes, photography, and decorations</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Add-on
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading add-ons...</div>
      ) : addons.length === 0 ? (
        <div className="bg-brand-dark border border-gray-800 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No add-ons found. Click "Add Add-on" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="bg-brand-dark border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-colors"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-heading font-bold text-white">{addon.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold ${
                      addon.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {addon.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {addon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-4">{addon.description}</p>
                <div className="text-xl font-heading font-bold text-brand-gold mb-4">
                  {formatCurrency(addon.price)}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(addon)} className="flex items-center gap-1.5 text-xs">
                  <Edit2 className="w-3.5 h-3.5" /> Edit Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingAddon ? 'Edit Add-on' : 'Create New Add-on'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Add-on Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Designer Chocolate Cake"
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
              placeholder="e.g. 500g Dutch Truffle Cake with candles"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Price (₹) *</label>
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
              <label className="block text-xs font-medium text-gray-300 mb-1">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="addonActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-800 bg-brand-darker text-brand-gold focus:ring-brand-gold"
            />
            <label htmlFor="addonActive" className="text-xs text-gray-300">
              Active (Visible to customers during booking)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              {editingAddon ? 'Save Changes' : 'Create Add-on'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddOnsPage;