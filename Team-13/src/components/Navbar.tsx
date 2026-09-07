import React, { useState } from 'react';
import {
  Camera,
  Layers,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Package,
  ArrowRightLeft,
  ChevronDown,
} from 'lucide-react';

interface Props {
  activeTab: 'landing' | 'compare' | 'analyze' | 'catalog';
  onSelectTab: (tab: 'landing' | 'compare' | 'analyze' | 'catalog') => void;
  onOpenMethodology: () => void;
  onSelectPresetPair: (prodAId: string, prodBId: string) => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onOpenMethodology,
  onSelectPresetPair,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);

  const demoPresets = [
    { label: 'Solid Shampoo vs Bottle', a: 'demo-shampoo-bar', b: 'demo-shampoo-bottle' },
    { label: 'Aluminium Can vs PET Bottle', a: 'demo-water-can', b: 'demo-water-bottle' },
    { label: 'Detergent Sheets vs Plastic Jug', a: 'demo-detergent-sheets', b: 'demo-detergent-jug' },
    { label: 'Compostable Bagasse vs Foam', a: 'demo-food-container-compostable', b: 'demo-food-container-foam' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                onSelectTab('landing');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-tight">
                  EcoLens
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight hidden sm:block">
                  Compare the evidence
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onSelectTab('landing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'landing'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => onSelectTab('compare')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'compare'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>

              <button
                onClick={() => onSelectTab('analyze')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'analyze'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Analyze</span>
              </button>

              <button
                onClick={() => onSelectTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'catalog'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Catalog</span>
              </button>
            </div>
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Demo Pairs Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors flex items-center gap-1"
              >
                <span>Try Demo</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showDemoDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowDemoDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Sample Comparisons
                    </div>
                    {demoPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelectPresetPair(preset.a, preset.b);
                          setShowDemoDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors block"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Methodology Dialog Button */}
            <button
              onClick={onOpenMethodology}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="View Scoring Methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => onSelectTab('analyze')}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Analyze Product</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onSelectTab('analyze')}
              className="py-1.5 px-3 rounded-lg bg-emerald-700 text-white text-xs font-bold"
            >
              Analyze
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              onSelectTab('landing');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'landing' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              onSelectTab('compare');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'compare' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
            }`}
          >
            Compare Products
          </button>

          <button
            onClick={() => {
              onSelectTab('analyze');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'analyze' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
            }`}
          >
            Analyze Packaging
          </button>

          <button
            onClick={() => {
              onSelectTab('catalog');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
              activeTab === 'catalog' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
            }`}
          >
            Product Catalog
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenMethodology();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-slate-600 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Scoring Methodology</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
