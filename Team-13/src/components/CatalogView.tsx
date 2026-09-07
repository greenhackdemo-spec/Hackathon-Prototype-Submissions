import React, { useState } from 'react';
import { Product } from '../types.ts';
import { DEMO_PRODUCTS } from '../data/demoProducts.ts';
import { EcoScoreBadge } from './EcoScoreBadge.tsx';
import { ProductImage } from './ProductImage.tsx';
import {
  Search,
  ArrowRightLeft,
  HelpCircle,
  Package,
  Recycle,
  Globe,
  Filter,
  Sparkles,
} from 'lucide-react';

interface Props {
  onCompareWithProduct: (product: Product, slot?: 'A' | 'B') => void;
  onOpenWhy: (product: Product) => void;
}

export const CatalogView: React.FC<Props> = ({ onCompareWithProduct, onOpenWhy }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'shampoo', label: 'Shampoo' },
    { id: 'beverage', label: 'Beverage' },
    { id: 'detergent', label: 'Detergent' },
    { id: 'soap', label: 'Soap' },
    { id: 'food', label: 'Food Packaging' },
    { id: 'household', label: 'Household' },
  ];

  const filtered = DEMO_PRODUCTS.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.packagingMaterial.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Sample Database</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified eco-scored products or select any two to compare head-to-head.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, materials..."
              className="pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900 w-full sm:w-60 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="py-2 px-3 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-emerald-600 transition-all"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Product Image */}
              <div className="relative aspect-4/3 bg-slate-50 overflow-hidden border-b border-slate-100">
                <ProductImage
                  src={prod.imageUrl}
                  alt={prod.name}
                  aspectRatio="aspect-4/3"
                  minHeight="min-h-[180px]"
                  className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-xs text-slate-800 border border-slate-200 shadow-2xs">
                    {prod.category}
                  </span>
                </div>
                {prod.price !== undefined && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/85 text-white backdrop-blur-xs shadow-2xs">
                      {prod.currency || '₹'}
                      {prod.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">by {prod.brand}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <EcoScoreBadge
                    score={prod.scores.totalScore}
                    status={prod.status}
                    confidence={prod.confidence}
                    size="sm"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Packaging:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[60%]">
                      {prod.packagingMaterial}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Carbon:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[60%]">
                      {prod.carbonFootprintDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenWhy(prod)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-200/70 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Details</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCompareWithProduct(prod, 'A')}
                  className="py-1.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
                  title="Set as Product A"
                >
                  Set as A
                </button>
                <button
                  onClick={() => onCompareWithProduct(prod, 'B')}
                  className="py-1.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs"
                  title="Set as Product B"
                >
                  Set as B
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
