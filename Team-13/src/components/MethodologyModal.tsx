import React from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  Package,
  Globe,
  Leaf,
  Recycle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">
                EcoLens Scoring Methodology
              </h3>
              <p className="text-xs text-slate-500">
                Transparent mathematical weighting & evidence principles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Core Philosophy */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-sm text-slate-900">
              Core Principles & Zero Hallucination Standard
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed">
              <li>
                <strong>Sustainability is not binary:</strong> We do not label products as definitively "green" or "bad"—we measure specific material circularity, recovery pathways, and observed evidence.
              </li>
              <li>
                <strong>Zero invented carbon numbers:</strong> When Lifecycle Assessment (LCA) data is missing from manufacturers or verified databases, we explicitly show <em>"Data unavailable"</em> and penalize transparency rather than fabricating estimates.
              </li>
              <li>
                <strong>Multi-factor weighting:</strong> A product with recyclable packaging but non-biodegradable formulation is not awarded an artificial clean pass.
              </li>
            </ul>
          </div>

          {/* Mathematical Pillars */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Formula & Deterministic Weighting
            </h4>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-700" />
                    1. Packaging Material (25%)
                  </span>
                  <span className="text-emerald-800">Weight: 25%</span>
                </div>
                <p className="text-slate-600">
                  Evaluates base substrates: unbleached kraft paper, glass, infinitely recyclable aluminium, post-consumer recycled (PCR) resin, vs. multi-layer non-separable plastics.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-700" />
                    2. Carbon Footprint & Disclosure (30%)
                  </span>
                  <span className="text-emerald-800">Weight: 30%</span>
                </div>
                <p className="text-slate-600">
                  Measures greenhouse gas emissions intensity (kg CO₂e per standard unit/use). If a company fails to disclose emissions, transparency score drops accordingly.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    3. Biodegradability & Compostability (20%)
                  </span>
                  <span className="text-emerald-800">Weight: 20%</span>
                </div>
                <p className="text-slate-600">
                  Distinguishes between certified home compostable (OK Compost HOME), industrial composting (BPI / EN 13432), biodegradable formulations, and persistent polymers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-2">
                    <Recycle className="w-4 h-4 text-emerald-700" />
                    4. Recyclability & Circularity (15%)
                  </span>
                  <span className="text-emerald-800">Weight: 15%</span>
                </div>
                <p className="text-slate-600">
                  Evaluates municipal curbside collection feasibility (e.g. PET #1, HDPE #2, Alu #41) vs. materials requiring specialized drop-off facilities.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    5. Evidence Quality & Traceability (10%)
                  </span>
                  <span className="text-emerald-800">Weight: 10%</span>
                </div>
                <p className="text-slate-600">
                  Rewards third-party audited certifications (FSC, Cradle to Cradle, USDA Organic, B Corp) and flags vague, unsubstantiated marketing claims.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
