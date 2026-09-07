import React, { useState } from 'react';
import { Product } from '../types.ts';
import { DEMO_PRODUCTS } from '../data/demoProducts.ts';
import { ProductImage } from './ProductImage.tsx';
import {
  X,
  Search,
  Camera,
  Layers,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  Package,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string; // e.g. "Select Product A" or "Select Product B"
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  currentProductId?: string;
}

export const ProductSelectorModal: React.FC<Props> = ({
  isOpen,
  title,
  onClose,
  onSelectProduct,
  currentProductId,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'catalog' | 'upload'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload states
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [productNameHint, setProductNameHint] = useState('');
  const [uploadCategory, setUploadCategory] = useState<string>('shampoo');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'shampoo', label: 'Shampoo' },
    { id: 'beverage', label: 'Beverage' },
    { id: 'detergent', label: 'Detergent' },
    { id: 'soap', label: 'Soap' },
    { id: 'food', label: 'Food' },
    { id: 'household', label: 'Household' },
  ];

  const filteredProducts = DEMO_PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.packagingMaterial.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isBack: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isBack) {
          setBackImage(reader.result);
        } else {
          setFrontImage(reader.result);
        }
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeUpload = async () => {
    if (!frontImage) {
      setUploadError('Please select at least a front packaging photo.');
      return;
    }

    setIsAnalyzing(true);
    setUploadError(null);

    try {
      const response = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontImageBase64: frontImage,
          backImageBase64: backImage || undefined,
          productNameHint: productNameHint.trim() || undefined,
          categoryHint: uploadCategory,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Analysis failed. Please try again or select from the database.");
      }

      const analyzedProduct: Product = await response.json();
      onSelectProduct(analyzedProduct);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || "Failed to analyze packaging. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">
              Choose from verified products or upload a custom packaging photo
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setMode('catalog')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              mode === 'catalog'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog</span>
          </button>

          <button
            onClick={() => setMode('upload')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              mode === 'upload'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Upload New Packaging</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'catalog' ? (
            <div className="space-y-4">
              {/* Search & Categories */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, brand, material..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === c.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {filteredProducts.map((p) => {
                  const isCurrent = p.id === currentProductId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 bg-white hover:border-emerald-500 hover:shadow-xs group ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="w-14 h-14 shrink-0">
                        <ProductImage
                          src={p.imageUrl}
                          alt={p.name}
                          aspectRatio="aspect-square"
                          minHeight="min-h-[56px]"
                          className="w-14 h-14 border border-slate-200"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {p.brand}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-700">
                            Score: {p.scores.totalScore}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5 group-hover:text-emerald-800">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {p.packagingMaterial}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Upload Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Front Packaging Photo *
                  </label>
                  {frontImage ? (
                    <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-50">
                      <ProductImage
                        src={frontImage}
                        alt="Front"
                        aspectRatio="aspect-video"
                        minHeight="min-h-[140px]"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setFrontImage(null)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-slate-900/80 text-white text-xs z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 cursor-pointer p-4 text-center transition-colors">
                      <Camera className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-900">Upload Front</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, false)} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Back Label (Optional)
                  </label>
                  {backImage ? (
                    <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-50">
                      <ProductImage
                        src={backImage}
                        alt="Back"
                        aspectRatio="aspect-video"
                        minHeight="min-h-[140px]"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setBackImage(null)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-slate-900/80 text-white text-xs z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 cursor-pointer p-4 text-center transition-colors">
                      <Layers className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-900">Upload Back</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, true)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Product Name Hint
                  </label>
                  <input
                    type="text"
                    value={productNameHint}
                    onChange={(e) => setProductNameHint(e.target.value)}
                    placeholder="e.g. EarthCare Botanical Wash"
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900"
                  >
                    <option value="shampoo">Shampoo & Hair</option>
                    <option value="soap">Soap & Body</option>
                    <option value="detergent">Laundry Detergent</option>
                    <option value="beverage">Beverage & Water</option>
                    <option value="food">Food Packaging</option>
                    <option value="household">Household Cleaner</option>
                  </select>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              <button
                disabled={!frontImage || isAnalyzing}
                onClick={handleAnalyzeUpload}
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  !frontImage || isAnalyzing
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze & Select Product</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
