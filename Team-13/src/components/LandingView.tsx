import React from 'react';
import { Product } from '../types.ts';
import { DEMO_PRODUCTS } from '../data/demoProducts.ts';
import { ProductImage } from './ProductImage.tsx';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Camera,
  Layers,
  CheckCircle2,
  Package,
  Recycle,
  Leaf,
  Globe,
  HelpCircle,
} from 'lucide-react';

interface Props {
  onStartAnalysis: () => void;
  onStartComparison: () => void;
  onSelectPair: (prodAId: string, prodBId: string) => void;
  onOpenMethodology: () => void;
}

export const LandingView: React.FC<Props> = ({
  onStartAnalysis,
  onStartComparison,
  onSelectPair,
  onOpenMethodology,
}) => {
  // Pre-loaded comparison demo pairs
  const demoPairs = [
    {
      id: 'shampoo-pair',
      title: 'Shampoo & Hair Care',
      tag: 'Zero-Waste vs Plastic',
      prodA: DEMO_PRODUCTS.find((p) => p.id === 'shampoo-ecopure-bar') || DEMO_PRODUCTS[0],
      prodB: DEMO_PRODUCTS.find((p) => p.id === 'shampoo-clinic-plus' || p.id === 'shampoo-aqualuxe-liquid') || DEMO_PRODUCTS[1],
      highlight: 'Paper packaging & zero liquid transport vs Clinic Plus virgin HDPE bottle',
    },
    {
      id: 'beverage-pair',
      title: 'Beverage Packaging',
      tag: 'Circular Aluminium vs PET',
      prodA: DEMO_PRODUCTS.find((p) => p.id === 'beverage-purespring-can') || DEMO_PRODUCTS[2],
      prodB: DEMO_PRODUCTS.find((p) => p.id === 'beverage-glacier-pet') || DEMO_PRODUCTS[3],
      highlight: 'Infinitely recyclable aluminium vs Virgin PET single-use plastic',
    },
    {
      id: 'detergent-pair',
      title: 'Laundry Detergent',
      tag: 'Concentrated vs Plastic Jug',
      prodA: DEMO_PRODUCTS.find((p) => p.id === 'detergent-earthsheets-strips') || DEMO_PRODUCTS[4],
      prodB: DEMO_PRODUCTS.find((p) => p.id === 'detergent-ultragleam-jug') || DEMO_PRODUCTS[5],
      highlight: 'Ultra-lightweight sheets vs heavy 3L bulky virgin plastic jug',
    },
    {
      id: 'food-pair',
      title: 'Food Packaging',
      tag: 'Compostable vs Styrofoam',
      prodA: DEMO_PRODUCTS.find((p) => p.id === 'food-biobox-bagasse') || DEMO_PRODUCTS[6],
      prodB: DEMO_PRODUCTS.find((p) => p.id === 'food-foam-clamshell') || DEMO_PRODUCTS[7],
      highlight: 'Sugarcane bagasse certified compostable vs Non-biodegradable EPS',
    },
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION                                         */}
      {/* ---------------------------------------------------- */}
      <section className="text-center max-w-3xl mx-auto space-y-6 px-4">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Gemini AI • Evidence-Based Green Audit</span>
        </div>

        {/* Exact Requested Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          Don't just trust the green label. <span className="text-emerald-700">Compare the evidence.</span>
        </h1>

        {/* Exact Requested Short Sentence */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Analyze product packaging and sustainability claims with AI, then compare products using transparent environmental evidence.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="btn-hero-analyze"
            onClick={onStartAnalysis}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Analyze a Product</span>
          </button>

          <button
            id="btn-hero-demo"
            onClick={onStartComparison}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-300 transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <span>Try Demo</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Reassurance notes */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 pt-2 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Deterministic 0–100 Eco Score
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Unbiased, evidence-backed environmental analysis
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Transparent evidence trail
          </span>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* INSTANT DEMO PRESETS (1-CLICK COMPARE)               */}
      {/* ---------------------------------------------------- */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Interactive Demo Samples
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Compare Real-World Alternatives in 1 Click
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Select any pair to inspect deterministic scores, packaging evidence, and why one product is recommended.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {demoPairs.map((pair) => (
            <div
              key={pair.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-900">{pair.title}</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {pair.tag}
                  </span>
                </div>

                {/* Side-by-side thumbnail previews */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Product A */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-2.5">
                    <div className="w-12 h-12 shrink-0">
                      <ProductImage
                        src={pair.prodA.imageUrl}
                        alt={pair.prodA.name}
                        aspectRatio="aspect-square"
                        minHeight="min-h-[48px]"
                        className="w-12 h-12 border border-slate-200"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-900 truncate">
                        {pair.prodA.name}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Eco Score: {pair.prodA.scores.totalScore}
                      </div>
                    </div>
                  </div>

                  {/* Product B */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex items-center gap-2.5">
                    <div className="w-12 h-12 shrink-0">
                      <ProductImage
                        src={pair.prodB.imageUrl}
                        alt={pair.prodB.name}
                        aspectRatio="aspect-square"
                        minHeight="min-h-[48px]"
                        className="w-12 h-12 border border-slate-200"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-900 truncate">
                        {pair.prodB.name}
                      </div>
                      <div className="text-[10px] text-amber-700 font-semibold">
                        Eco Score: {pair.prodB.scores.totalScore}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {pair.highlight}
                </p>
              </div>

              <button
                onClick={() => onSelectPair(pair.prodA.id, pair.prodB.id)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>Compare Head-to-Head</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3-STEP VALUE FLOW                                    */}
      {/* ---------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            How EcoLens Works
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            From Packaging Photo to Objective Decision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900">Upload or Select</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take photos of front/back packaging labels or choose pre-verified products from our catalog.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900">Multimodal AI Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini Vision scans resin recycling numbers, material polymers, certifications, and marketing claims.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900">Deterministic Comparison</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect side-by-side Eco Scores, environmental claim risk evaluations, and a clear recommended choice.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* METHODOLOGY CARD                                     */}
      {/* ---------------------------------------------------- */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Transparent Scoring Methodology
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Deterministic Weights • Zero Guesses
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We never invent carbon numbers. When data is unavailable, we explicitly mark it as <em>"Data unavailable"</em> and weight based on verified physical packaging, compostability, and resin recyclability.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                Packaging 25%
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                Carbon 30%
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                Biodegradability 20%
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                Recyclability 15%
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                Evidence Quality 10%
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenMethodology}
              className="py-2.5 px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Inspect Full Formula</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
