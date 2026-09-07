import React, { useState } from 'react';
import { Product } from './types.ts';
import { DEMO_PRODUCTS, DEMO_PRESET_PAIRS } from './data/demoProducts.ts';
import { compareTwoProducts } from './services/scoringService.ts';
import { Navbar } from './components/Navbar.tsx';
import { LandingView } from './components/LandingView.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ComparisonDashboard } from './components/ComparisonDashboard.tsx';
import { ProductSelectorModal } from './components/ProductSelectorModal.tsx';
import { WhyModal } from './components/WhyModal.tsx';
import { AnalyzeView } from './components/AnalyzeView.tsx';
import { CatalogView } from './components/CatalogView.tsx';
import { MethodologyModal } from './components/MethodologyModal.tsx';
import {
  ArrowRightLeft,
  Sparkles,
  Camera,
  Layers,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'compare' | 'analyze' | 'catalog'>('landing');

  // Default comparison products: Solid Shampoo Bar vs Conventional Liquid Bottle (Clinic Plus)
  const [productA, setProductA] = useState<Product>(
    DEMO_PRODUCTS.find((p) => p.id === 'shampoo-ecopure-bar') || DEMO_PRODUCTS[0]
  );
  const [productB, setProductB] = useState<Product>(
    DEMO_PRODUCTS.find((p) => p.id === 'shampoo-clinic-plus' || p.id === 'shampoo-aqualuxe-liquid') || DEMO_PRODUCTS[1]
  );

  // Modals state
  const [selectorModal, setSelectorModal] = useState<{
    isOpen: boolean;
    slot: 'A' | 'B';
  }>({
    isOpen: false,
    slot: 'A',
  });
  const [whyModalProduct, setWhyModalProduct] = useState<Product | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Calculate comparison dynamically
  const comparison = compareTwoProducts(productA, productB);

  // Swap Product A and B
  const handleSwapProducts = () => {
    const temp = productA;
    setProductA(productB);
    setProductB(temp);
  };

  // Load a preset pair
  const handleSelectPresetPair = (pairId: string) => {
    const pair = DEMO_PRESET_PAIRS[pairId];
    if (pair) {
      const pA = DEMO_PRODUCTS.find((p) => p.id === pair.productAId);
      const pB = DEMO_PRODUCTS.find((p) => p.id === pair.productBId);
      if (pA && pB) {
        setProductA(pA);
        setProductB(pB);
        setActiveTab('compare');
      }
    }
  };

  // Set product into slot from Catalog or Analyzer
  const handleSetProduct = (product: Product, slot: 'A' | 'B' = 'A') => {
    if (slot === 'A') {
      setProductA(product);
    } else {
      setProductB(product);
    }
    setActiveTab('compare');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600/15 selection:text-emerald-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onSelectPresetPair={handleSelectPresetPair}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: LANDING PAGE */}
        {activeTab === 'landing' && (
          <LandingView
            onStartComparison={() => setActiveTab('compare')}
            onStartAnalysis={() => setActiveTab('analyze')}
            onSelectPair={(idA, idB) => {
              const pA = DEMO_PRODUCTS.find((p) => p.id === idA);
              const pB = DEMO_PRODUCTS.find((p) => p.id === idB);
              if (pA && pB) {
                setProductA(pA);
                setProductB(pB);
                setActiveTab('compare');
              }
            }}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {/* VIEW 2: PRODUCT COMPARISON DASHBOARD */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            {/* Top comparison controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Head-to-Head Comparison</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Product Comparison
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Evaluating packaging materials, claim validity, and carbon disclosures side-by-side.
                </p>
              </div>

              {/* Action Buttons: Swap, Upload Custom */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="btn-swap-products"
                  onClick={handleSwapProducts}
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                  title="Swap Product A and Product B positions"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                  <span>Swap Sides</span>
                </button>

                <button
                  id="btn-upload-custom"
                  onClick={() => setSelectorModal({ isOpen: true, slot: 'A' })}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Packaging</span>
                </button>
              </div>
            </div>

            {/* Category Demo Tabs for Fast Exploration */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0 mr-1">
                Demo Pairs:
              </span>

              <button
                onClick={() => handleSelectPresetPair('shampoo-pair')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors border ${
                  productA.id === 'shampoo-ecopure-bar' && (productB.id === 'shampoo-clinic-plus' || productB.id === 'shampoo-aqualuxe-liquid')
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                🌿 Shampoo (Bar vs Bottle)
              </button>

              <button
                onClick={() => handleSelectPresetPair('beverage-pair')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors border ${
                  productA.id === 'beverage-purespring-can' && productB.id === 'beverage-glacier-pet'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                🥫 Beverage (Can vs Plastic)
              </button>

              <button
                onClick={() => handleSelectPresetPair('detergent-pair')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors border ${
                  productA.id === 'detergent-earthsheets-strips' && productB.id === 'detergent-ultragleam-jug'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                🧼 Laundry (Sheets vs Jug)
              </button>

              <button
                onClick={() => handleSelectPresetPair('food-pair')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors border ${
                  productA.id === 'food-biobox-bagasse' && productB.id === 'food-foam-clamshell'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                🥡 Food Box (Bagasse vs Foam)
              </button>

              <button
                onClick={() => handleSelectPresetPair('cleaning-pair')}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors border ${
                  productA.id === 'cleaner-cleancraft-glass' && productB.id === 'cleaner-sparkle-spray'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                🧽 Cleaners (Refill vs Spray)
              </button>
            </div>

            {/* Side-by-Side Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product A Card */}
              <ProductCard
                product={productA}
                slotLabel="Product A"
                isWinner={comparison.winnerId === productA.id}
                onChangeProduct={() => setSelectorModal({ isOpen: true, slot: 'A' })}
                onOpenWhy={(p) => setWhyModalProduct(p)}
              />

              {/* Product B Card */}
              <ProductCard
                product={productB}
                slotLabel="Product B"
                isWinner={comparison.winnerId === productB.id}
                onChangeProduct={() => setSelectorModal({ isOpen: true, slot: 'B' })}
                onOpenWhy={(p) => setWhyModalProduct(p)}
              />
            </div>

            {/* Deep Comparison Dashboard (Score delta, Recommendation, Categories, Claims, Traceability) */}
            <ComparisonDashboard
              comparison={comparison}
              onOpenWhy={(p) => setWhyModalProduct(p)}
            />
          </div>
        )}

        {/* VIEW 3: ANALYZE PACKAGING WITH GEMINI AI */}
        {activeTab === 'analyze' && (
          <AnalyzeView
            onCompareWithProduct={(product) => {
              setProductA(product);
              setActiveTab('compare');
            }}
            onOpenWhy={(p) => setWhyModalProduct(p)}
          />
        )}

        {/* VIEW 4: BROWSE CATALOG */}
        {activeTab === 'catalog' && (
          <CatalogView
            onCompareWithProduct={(product, slot) => {
              handleSetProduct(product, slot || 'A');
            }}
            onOpenWhy={(p) => setWhyModalProduct(p)}
          />
        )}
      </main>

      {/* Modals */}
      <ProductSelectorModal
        isOpen={selectorModal.isOpen}
        title={`Select ${selectorModal.slot === 'A' ? 'Product A' : 'Product B'}`}
        currentProductId={selectorModal.slot === 'A' ? productA.id : productB.id}
        onClose={() => setSelectorModal({ isOpen: false, slot: 'A' })}
        onSelectProduct={(product) => {
          if (selectorModal.slot === 'A') {
            setProductA(product);
          } else {
            setProductB(product);
          }
        }}
      />

      <WhyModal
        product={whyModalProduct}
        onClose={() => setWhyModalProduct(null)}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Application Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-900">EcoLens</span>
            <span>·</span>
            <span>AI-Powered Product Packaging & Claim Comparator</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-emerald-700 transition-colors font-semibold"
            >
              Scoring Methodology
            </button>
            <span>·</span>
            <span className="text-slate-400">
              Deterministic scoring • Zero fabricated carbon numbers
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
