import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

interface PackageSelectorProps {
  packages: Package[];
  selectedPackageId?: string;
  onSelect: (id: string) => void;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({ packages, selectedPackageId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(packages || []).map((pkg) => {
        const isSelected = selectedPackageId === pkg.id;
        const safeFeatures: string[] = Array.isArray(pkg.features)
          ? pkg.features
          : typeof pkg.features === 'string'
          ? (() => {
              try {
                const parsed = JSON.parse(pkg.features);
                return Array.isArray(parsed) ? parsed : [pkg.features];
              } catch {
                return (pkg.features as string).split(',').map((f) => f.trim()).filter(Boolean);
              }
            })()
          : [];

        return (
          <motion.div
            key={pkg.id}
            whileHover={{ y: -5 }}
            onClick={() => onSelect(pkg.id)}
            className={`cursor-pointer bg-brand-darker rounded-xl p-6 border-2 transition-colors relative ${
              isSelected ? 'border-brand-gold' : 'border-gray-800 hover:border-gray-600'
            }`}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark p-1 rounded-bl-lg rounded-tr-lg">
                <Check size={20} />
              </div>
            )}
            <h3 className="text-2xl font-heading text-white mb-2">{pkg.name}</h3>
            <p className="text-gray-400 font-body text-sm mb-6 h-10">{pkg.description}</p>
            <div className="text-3xl font-heading text-brand-gold mb-6">
              ₹{pkg.price}
            </div>
            <ul className="space-y-3 mb-6">
              {safeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start text-sm font-body text-gray-300">
                  <Check size={16} className="text-brand-gold mr-2 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded font-body font-medium transition-colors ${
                isSelected ? 'bg-brand-gold text-brand-dark' : 'bg-transparent border border-brand-gold text-brand-gold'
              }`}
            >
              {isSelected ? 'Selected' : 'Choose Package'}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};