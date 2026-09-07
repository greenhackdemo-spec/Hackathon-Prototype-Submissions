import React from 'react';
import { Product } from '../types.ts';
import { EcoScoreBadge } from './EcoScoreBadge.tsx';
import { ProductImage } from './ProductImage.tsx';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Package,
  Leaf,
  Globe,
  Recycle,
  Scale,
} from 'lucide-react';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const WhyModal: React.FC<Props> = ({ product, onClose }) => {
  if (!product) return null;

  const { scores } = product;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">
                Sustainability Deep Dive
              </h3>
              <p className="text-xs text-slate-500">
                Transparent breakdown of scores, evidence, and trade-offs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Product Quick Header */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-16 h-16 shrink-0">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                aspectRatio="aspect-square"
                minHeight="min-h-[64px]"
                className="w-16 h-16 border border-slate-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {product.category} · {product.brand}
              </span>
              <h4 className="font-bold text-slate-900 text-base leading-snug">
                {product.name}
              </h4>
              <div className="mt-2">
                <EcoScoreBadge
                  score={product.scores.totalScore}
                  status={product.status}
                  size="sm"
                  showConfidence={false}
                />
              </div>
            </div>
          </div>

          {/* Mathematical Weighting Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Deterministic Score Composition
              </h5>
              <span className="text-xs text-emerald-800 font-bold">
                Total Score: {scores.totalScore} / 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Package className="w-3.5 h-3.5 text-emerald-700" />
                    Packaging (25%)
                  </span>
                  <span className="text-emerald-800 font-bold">{scores.packagingScore} / 100</span>
                </div>
                <p className="text-slate-500 text-[11px]">{product.packagingMaterial}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    Carbon Impact / Data (30%)
                  </span>
                  <span className="text-emerald-800 font-bold">{scores.carbonScore} / 100</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {product.carbonDataAvailability === 'unavailable' || !product.carbonFootprint
                    ? 'Score reflects the strength and availability of carbon-impact evidence. No product-level footprint was disclosed.'
                    : product.carbonFootprintDisplay}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    Biodegradability (20%)
                  </span>
                  <span className="text-emerald-800 font-bold">{scores.biodegradabilityScore} / 100</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {product.compostable
                    ? `Compostable (${product.compostable})`
                    : product.biodegradable
                    ? 'Biodegradable formula'
                    : 'Standard disposal'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Recycle className="w-3.5 h-3.5 text-emerald-700" />
                    Recyclability (15%)
                  </span>
                  <span className="text-emerald-800 font-bold">{scores.recyclabilityScore} / 100</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {product.recyclable === true
                    ? 'Widely Recyclable'
                    : product.recyclable === 'conditional'
                    ? 'Conditionally Recyclable'
                    : 'Non-Recyclable'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Evidence Quality (10%)
                  </span>
                  <span className="text-emerald-800 font-bold">{scores.evidenceQualityScore} / 100</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Confidence: {product.confidence} • {product.evidence.length} audited data points.
                </p>
              </div>
            </div>
          </div>

          {/* Advantages & Known Trade-offs */}
          {product.summaryTradeoffs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Key Environmental Advantages
                </div>
                <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                  {product.summaryTradeoffs.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Trade-offs & Considerations
                </div>
                <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                  {product.summaryTradeoffs.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Verified Certifications */}
          {product.certifications.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Verified Packaging Certifications
              </span>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
