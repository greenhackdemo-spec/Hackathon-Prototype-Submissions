import React, { useState } from 'react';
import { Product } from '../types.ts';
import { EcoScoreBadge } from './EcoScoreBadge.tsx';
import { ProductImage } from './ProductImage.tsx';
import { determineSustainabilityEvidence } from '../services/scoringService.ts';
import {
  ArrowRightLeft,
  ChevronRight,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  product: Product;
  slotLabel: string; // "Product A" or "Product B"
  onChangeProduct: () => void;
  onOpenWhy: (product: Product) => void;
  isWinner?: boolean;
}

export const ProductCard: React.FC<Props> = ({
  product,
  slotLabel,
  onChangeProduct,
  onOpenWhy,
  isWinner = false,
}) => {
  const [showBackImage, setShowBackImage] = useState(false);
  const currentImage = showBackImage && product.backImageUrl ? product.backImageUrl : product.imageUrl;
  const isSlotA = slotLabel.toUpperCase().includes('A');

  // Distinct slot badges that keep both products visually distinguished and balanced
  const slotBadgeClass = isSlotA
    ? 'bg-slate-900 text-white'
    : 'bg-indigo-600 text-white';

  return (
    <div
      id={`product-card-${product.id}`}
      className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
        isWinner
          ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
          : 'border-slate-200'
      }`}
    >
      {/* Top Header Bar */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${slotBadgeClass}`}>
              {slotLabel}
            </span>
            {isWinner && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                🏆 Recommended
              </span>
            )}
          </div>

          <button
            onClick={onChangeProduct}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-lg transition-colors"
            title="Choose a different product to compare"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Change</span>
          </button>
        </div>

        {/* Large Actual Product Image Area */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-200/80 group">
          <ProductImage
            src={currentImage}
            alt={`${product.name} packaging`}
            aspectRatio="aspect-4/3"
            minHeight="min-h-[220px]"
            className="w-full h-full object-contain"
          />

          {/* Source badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/95 text-slate-700 border border-slate-200/80 shadow-xs backdrop-blur-xs">
              {product.sourceType === 'ai_analyzed' ? (
                <>
                  <Sparkles className="w-3 h-3 text-emerald-600" /> AI Analyzed
                </>
              ) : product.sourceType === 'user_custom' ? (
                <>👤 User Photo</>
              ) : (
                <>📦 Verified Database</>
              )}
            </span>
          </div>

          {/* Toggle between Front and Back packaging images if available */}
          {product.backImageUrl && (
            <div className="absolute bottom-2.5 right-2.5">
              <button
                type="button"
                onClick={() => setShowBackImage(!showBackImage)}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-900/85 hover:bg-slate-900 text-white px-2.5 py-1 rounded-md backdrop-blur-xs transition-colors shadow-xs"
              >
                <Layers className="w-3 h-3" />
                {showBackImage ? 'Front' : 'Back / Label'}
              </button>
            </div>
          )}
        </div>

        {/* Title, Brand, Category & Price */}
        <div className="space-y-1 mb-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
              {product.name}
            </h2>
            {product.price !== undefined && (
              <span className="text-base font-bold text-slate-900 shrink-0">
                {product.currency || '₹'}
                {product.price}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700">{product.brand}</span> · <span className="capitalize">{product.category}</span>
          </p>
        </div>

        {/* Eco Score Block */}
        <EcoScoreBadge
          score={product.scores.totalScore}
          status={product.status}
          analysisConfidence={product.confidence}
          sustainabilityEvidence={determineSustainabilityEvidence(product)}
        />

        {/* Small category scores with simple horizontal progress */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
          {/* Packaging Material */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 font-medium">Packaging</span>
            <span className="text-slate-900 font-semibold truncate max-w-[170px]" title={product.packagingMaterial}>
              {product.packagingMaterial}
            </span>
          </div>

          {/* Recyclability */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 font-medium">Recyclability</span>
            <span className="font-semibold">
              {product.recyclable === true ? (
                <span className="text-emerald-700">Widely Recyclable</span>
              ) : product.recyclable === 'conditional' ? (
                <span className="text-amber-700">Conditionally Recyclable</span>
              ) : (
                <span className="text-rose-700">Non-Recyclable</span>
              )}
            </span>
          </div>

          {/* End of Life */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 font-medium">End of Life</span>
            <span className="text-slate-900 font-semibold">
              {product.compostable ? (
                <span className="text-emerald-700">Compostable ({product.compostable})</span>
              ) : product.biodegradable ? (
                <span className="text-emerald-700">Biodegradable formula</span>
              ) : (
                <span className="text-slate-600">Standard disposal</span>
              )}
            </span>
          </div>

          {/* Carbon Footprint */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 font-medium">Carbon Data</span>
            <span className="text-slate-900 font-semibold text-[11px]">
              {product.carbonDataAvailability === 'unavailable' ? (
                <span className="text-slate-500">Data unavailable</span>
              ) : (
                <span className="text-emerald-700">{product.carbonFootprintDisplay}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure CTA - Clean Single Action */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <button
          id={`btn-view-details-${product.id}`}
          onClick={() => onOpenWhy(product)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
