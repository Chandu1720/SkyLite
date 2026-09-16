import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '@skylite/shared';
import type { TheatreDTO } from '@skylite/shared';
import { Plus, Edit2, Building2, Users, MapPin, CheckCircle2 } from 'lucide-react';

export const TheatresPage: React.FC = () => {
  const { toast } = useToast();
  const [theatres, setTheatres] = useState<TheatreDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState<TheatreDTO | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState<number>(10);
  const [location, setLocation] = useState('');
  const [facilitiesInput, setFacilitiesInput] = useState('');
  const [basePrice, setBasePrice] = useState<number>(1999);
  const [saving, setSaving] = useState(false);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getTheatres();
      setTheatres(data);
    } catch (err: any) {
      toast('error', 'Failed to load theatres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleOpenCreate = () => {
    setEditingTheatre(null);
    setName('');
    setDescription('');
    setCapacity(10);
    setLocation('SkyLite Main Branch');
    setFacilitiesInput('4K Laser Projection, Dolby Atmos 7.1, Luxury Recliners, Ambient Mood Lighting');
    setBasePrice(1999);
    setModalOpen(true);
  };

  const handleOpenEdit = (theatre: TheatreDTO) => {
    setEditingTheatre(theatre);
    setName(theatre.name);
    setDescription(theatre.description);
    setCapacity(theatre.capacity);
    setLocation(theatre.location);
    const parsedFacilities = Array.isArray(theatre.facilities)
      ? theatre.facilities
      : typeof theatre.facilities === 'string'
      ? JSON.parse(theatre.facilities || '[]')
      : [];
    setFacilitiesInput(parsedFacilities.join(', '));
    setBasePrice(theatre.basePrice);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const facilities = facilitiesInput
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      if (editingTheatre) {
        await adminApi.updateTheatre(editingTheatre.id, {
          name,
          description,
          capacity: Number(capacity),
          location,
          facilities,
          basePrice: Number(basePrice),
        });
        toast('success', 'Theatre updated successfully');
      } else {
        await adminApi.createTheatre({
          name,
          description,
          capacity: Number(capacity),
          location,
          facilities,
          basePrice: Number(basePrice),
        });
        toast('success', 'Theatre created successfully');
      }
      setModalOpen(false);
      fetchTheatres();
    } catch (err: any) {
      toast('error', err.response?.data?.error || 'Failed to save theatre');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Theatres & Halls</h1>
          <p className="text-gray-400 text-sm">Manage private screening halls, seating capacities, and equipment</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Theatre
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading theatres...</div>
      ) : theatres.length === 0 ? (
        <div className="bg-brand-dark border border-gray-800 rounded-xl p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No theatres found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {theatres.map((theatre) => {
            const parsedFacilities: string[] = Array.isArray(theatre.facilities)
              ? theatre.facilities
              : typeof theatre.facilities === 'string'
              ? JSON.parse(theatre.facilities || '[]')
              : [];

            return (
              <div
                key={theatre.id}
                className="bg-brand-dark border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-brand-gold/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-white">{theatre.name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {theatre.location}
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {theatre.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 my-3">{theatre.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 bg-brand-darker/60 p-3 rounded-lg border border-gray-800">
                    <span className="flex items-center gap-1.5 text-white">
                      <Users className="w-4 h-4 text-brand-gold" /> Max {theatre.capacity} Guests
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-white">Base Price: <strong className="text-brand-gold">{formatCurrency(theatre.basePrice)}</strong></span>
                  </div>

                  {parsedFacilities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {parsedFacilities.map((f, i) => (
                        <span key={i} className="text-[11px] bg-gray-800/80 border border-gray-700 px-2 py-0.5 rounded text-gray-300">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(theatre)} className="flex items-center gap-1.5 text-xs">
                    <Edit2 className="w-3.5 h-3.5" /> Edit Theatre
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTheatre ? 'Edit Theatre' : 'Add New Theatre'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Theatre Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal VIP Screening Room"
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
              placeholder="Atmosphere, sound system details, comfort"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Seating Capacity *</label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Base Price (₹) *</label>
              <input
                type="number"
                min={0}
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Location / Address</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. SkyLite Flagship, 2nd Floor"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Facilities & Amenities (comma separated)
            </label>
            <input
              type="text"
              value={facilitiesInput}
              onChange={(e) => setFacilitiesInput(e.target.value)}
              placeholder="4K Laser, Dolby Atmos, Leather Recliners, AC"
              className="w-full bg-brand-darker border border-gray-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              {editingTheatre ? 'Save Changes' : 'Create Theatre'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TheatresPage;