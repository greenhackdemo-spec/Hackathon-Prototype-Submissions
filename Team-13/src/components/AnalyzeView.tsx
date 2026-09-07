import React, { useState } from 'react';
import { Product } from '../types.ts';
import { EcoScoreBadge } from './EcoScoreBadge.tsx';
import { EcoSwitchSection } from './EcoSwitchSection.tsx';
import { ProductImage } from './ProductImage.tsx';
import {
  generateWhyThisScore,
  determineSustainabilityEvidence,
} from '../services/scoringService.ts';
import {
  Upload,
  Camera,
  Layers,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Package,
  Recycle,
  Globe,
  HelpCircle,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  Leaf,
} from 'lucide-react';

interface Props {
  onCompareWithProduct: (product: Product) => void;
  onOpenWhy: (product: Product) => void;
}

export const AnalyzeView: React.FC<Props> = ({ onCompareWithProduct, onOpenWhy }) => {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [productNameHint, setProductNameHint] = useState('');
  const [categoryHint, setCategoryHint] = useState('shampoo');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Product | null>(null);
  const [isCalculationExpanded, setIsCalculationExpanded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isBack: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

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
      setError('Could not read the selected image. Please choose another photo.');
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!frontImage) {
      setError('Please upload at least a front packaging photo to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setAnalysisStep(1);

    const timer = setInterval(() => {
      setAnalysisStep((s) => (s < 4 ? s + 1 : s));
    }, 1100);

    try {
      const response = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontImageBase64: frontImage,
          backImageBase64: backImage || undefined,
          productNameHint: productNameHint.trim() || undefined,
          categoryHint,
        }),
      });

      clearInterval(timer);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Packaging analysis could not be completed. Please retry or pick a sample preset.");
      }

      const product: Product = await response.json();
      setResult(product);
    } catch (err: any) {
      clearInterval(timer);
      setError(err.message || "Packaging analysis could not be completed. Please retry or pick a sample preset.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = (url: string, name: string, cat: string) => {
    setFrontImage(url);
    setProductNameHint(name);
    setCategoryHint(cat);
    setError(null);
    setResult(null);
  };

  const resetForm = () => {
    setFrontImage(null);
    setBackImage(null);
    setProductNameHint('');
    setCategoryHint('shampoo');
    setError(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8">
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal Gemini Packaging Audit</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Analyze Product Packaging
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
          Upload a clear photo of the product packaging. Gemini reads resin codes, evaluates marketing claims against evidence, and computes an objective Eco Score.
        </p>
      </div>

      {/* Preset Samples Bar for Fast Demos */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Demo Samples (Click to load):
          </span>
          <span className="text-[11px] text-slate-500">Instant test cases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() =>
              loadPreset(
                'https://images.unsplash.com/photo-1608248597359-5437936a0d20?auto=format&fit=crop&w=800&q=80',
                'EcoPure Botanical Solid Bar',
                'shampoo'
              )
            }
            className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex items-center gap-3 bg-slate-50 group"
          >
            <div className="w-10 h-10 shrink-0">
              <ProductImage
                src="https://images.unsplash.com/photo-1608248597359-5437936a0d20?auto=format&fit=crop&w=150&q=80"
                alt="Preset 1"
                aspectRatio="aspect-square"
                minHeight="min-h-[40px]"
                className="w-10 h-10 border border-slate-200"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-800">
                Solid Shampoo Bar
              </div>
              <div className="text-[10px] text-slate-500">Unbleached Kraft Paper</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              loadPreset(
                'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
                'PureSpring Mountain Water',
                'beverage'
              )
            }
            className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex items-center gap-3 bg-slate-50 group"
          >
            <div className="w-10 h-10 shrink-0">
              <ProductImage
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=150&q=80"
                alt="Preset 2"
                aspectRatio="aspect-square"
                minHeight="min-h-[40px]"
                className="w-10 h-10 border border-slate-200"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-800">
                Aluminium Water Can
              </div>
              <div className="text-[10px] text-slate-500">Recyclable Alu 41</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              loadPreset(
                'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
                'Ocean Breeze Liquid Detergent',
                'detergent'
              )
            }
            className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex items-center gap-3 bg-slate-50 group"
          >
            <div className="w-10 h-10 shrink-0">
              <ProductImage
                src="https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=150&q=80"
                alt="Preset 3"
                aspectRatio="aspect-square"
                minHeight="min-h-[40px]"
                className="w-10 h-10 border border-slate-200"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-800">
                3L Detergent Jug
              </div>
              <div className="text-[10px] text-slate-500">Virgin PP #5 Resin</div>
            </div>
          </button>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Front Image Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Front Packaging Photo *</span>
              <span className="text-[11px] text-slate-500 font-normal">Primary label</span>
            </label>

            {frontImage ? (
              <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-slate-200 group bg-slate-50">
                <ProductImage
                  src={frontImage}
                  alt="Front package"
                  aspectRatio="aspect-4/3"
                  minHeight="min-h-[160px]"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setFrontImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs transition-colors z-10"
                  title="Remove photo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30 cursor-pointer transition-colors p-6 text-center">
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-900">Upload Front Packaging Photo</span>
                <span className="text-[11px] text-slate-500 mt-1">Shows brand name & front claims</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, false)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Back Image Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>Back / Nutrition / Recycling Label</span>
              <span className="text-[11px] text-emerald-700 font-semibold">Optional</span>
            </label>

            {backImage ? (
              <div className="relative rounded-xl overflow-hidden aspect-4/3 border border-slate-200 group bg-slate-50">
                <ProductImage
                  src={backImage}
                  alt="Back package"
                  aspectRatio="aspect-4/3"
                  minHeight="min-h-[160px]"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setBackImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs transition-colors z-10"
                  title="Remove photo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-4/3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30 cursor-pointer transition-colors p-6 text-center">
                <Layers className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-900">Upload Back / Label Photo</span>
                <span className="text-[11px] text-slate-500 mt-1">Contains resin codes & certifications</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Hints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Product Name (Optional hint)
            </label>
            <input
              type="text"
              value={productNameHint}
              onChange={(e) => setProductNameHint(e.target.value)}
              placeholder="e.g. EarthCare Botanical Wash"
              className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Category
            </label>
            <select
              value={categoryHint}
              onChange={(e) => setCategoryHint(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all"
            >
              <option value="shampoo">Shampoo & Hair Care</option>
              <option value="soap">Soap & Body Care</option>
              <option value="detergent">Laundry Detergent</option>
              <option value="beverage">Beverage & Water</option>
              <option value="food">Food Packaging</option>
              <option value="household">Household Cleaner</option>
            </select>
          </div>
        </div>

        {/* Friendly Error Display with Retry */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Analysis Error</span>
                <p className="text-rose-700 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={runAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-300 hover:bg-rose-100 text-rose-800 font-bold text-xs shrink-0 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Animated Progress State: Exact requested 4 steps */}
        {isAnalyzing && (
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
              <span>Analyzing Packaging with Gemini Multimodal AI...</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-1">
              <div className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                <span>{analysisStep > 1 ? '✓' : '●'} Reading product information</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                <span>{analysisStep > 2 ? '✓' : analysisStep === 2 ? '●' : '○'} Detecting packaging</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                <span>{analysisStep > 3 ? '✓' : analysisStep === 3 ? '●' : '○'} Checking sustainability claims</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStep >= 4 ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                <span>{analysisStep >= 4 ? '●' : '○'} Evaluating evidence</span>
              </div>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            id="btn-run-packaging-analysis"
            disabled={!frontImage || isAnalyzing}
            onClick={runAnalysis}
            className={`flex-1 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              !frontImage || isAnalyzing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Packaging...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Product</span>
              </>
            )}
          </button>

          {(frontImage || result) && (
            <button
              onClick={resetForm}
              className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-colors"
              title="Reset Form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* 1. Product Identity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-start gap-4">
                {(frontImage || result.imageUrl) && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                    <ProductImage
                      src={frontImage || result.imageUrl}
                      alt={result.name}
                      aspectRatio="aspect-square"
                      minHeight="min-h-[64px]"
                      className="w-16 h-16 sm:w-20 sm:h-20 border border-slate-200"
                    />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Packaging Analysis Complete
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
                    {result.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Brand: <span className="text-slate-800 font-semibold">{result.brand}</span> · Category: <span className="capitalize font-medium text-slate-700">{result.category}</span>
                    {result.price ? ` · ${result.currency || '₹'}${result.price}` : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onCompareWithProduct(result)}
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm shrink-0 self-start sm:self-auto"
              >
                <span>Compare Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2 & 3. Eco Score & Sustainability Status */}
            <EcoScoreBadge
              score={result.scores.totalScore}
              status={result.status}
              analysisConfidence={result.confidence}
              sustainabilityEvidence={determineSustainabilityEvidence(result)}
            />

            {/* 4. Eco Score Breakdown (Five Components) */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Eco Score Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Individual scoring across the five core sustainability components:
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Total: {result.scores.totalScore} / 100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* 1. Packaging */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-emerald-700" />
                      Packaging
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">Weight: 25%</span>
                      <span className="font-extrabold text-slate-900">
                        {result.scores.packagingScore} <span className="text-slate-400 font-normal text-[11px]">/ 100</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.scores.packagingScore >= 70
                          ? 'bg-emerald-500'
                          : result.scores.packagingScore >= 45
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, result.scores.packagingScore))}%` }}
                    />
                  </div>
                </div>

                {/* 2. Carbon Impact / Data */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-700" />
                      Carbon Impact / Data
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">Weight: 30%</span>
                      <span className="font-extrabold text-slate-900">
                        {result.scores.carbonScore} <span className="text-slate-400 font-normal text-[11px]">/ 100</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.scores.carbonScore >= 70
                          ? 'bg-emerald-500'
                          : result.scores.carbonScore >= 45
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, result.scores.carbonScore))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {result.carbonDataAvailability === 'unavailable' || !result.carbonFootprint
                      ? 'Score reflects the strength and availability of carbon-impact evidence. No product-level footprint was disclosed.'
                      : `Footprint: ${result.carbonFootprintDisplay}`}
                  </p>
                </div>

                {/* 3. Biodegradability / Compostability */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                      Biodegradability / Compostability
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">Weight: 20%</span>
                      <span className="font-extrabold text-slate-900">
                        {result.scores.biodegradabilityScore} <span className="text-slate-400 font-normal text-[11px]">/ 100</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.scores.biodegradabilityScore >= 70
                          ? 'bg-emerald-500'
                          : result.scores.biodegradabilityScore >= 45
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, result.scores.biodegradabilityScore))}%` }}
                    />
                  </div>
                </div>

                {/* 4. Recyclability / End-of-Life */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Recycle className="w-3.5 h-3.5 text-emerald-700" />
                      Recyclability / End-of-Life
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">Weight: 15%</span>
                      <span className="font-extrabold text-slate-900">
                        {result.scores.recyclabilityScore} <span className="text-slate-400 font-normal text-[11px]">/ 100</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.scores.recyclabilityScore >= 70
                          ? 'bg-emerald-500'
                          : result.scores.recyclabilityScore >= 45
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, result.scores.recyclabilityScore))}%` }}
                    />
                  </div>
                </div>

                {/* 5. Evidence Quality */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs sm:col-span-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Evidence Quality
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">Weight: 10%</span>
                      <span className="font-extrabold text-slate-900">
                        {result.scores.evidenceQualityScore} <span className="text-slate-400 font-normal text-[11px]">/ 100</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.scores.evidenceQualityScore >= 70
                          ? 'bg-emerald-500'
                          : result.scores.evidenceQualityScore >= 45
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, result.scores.evidenceQualityScore))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Expandable Section: How is this score calculated? */}
              <div className="border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCalculationExpanded(!isCalculationExpanded)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-emerald-800 py-1 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                    How is this score calculated?
                  </span>
                  {isCalculationExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isCalculationExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-3 animate-in fade-in duration-200">
                    <p className="text-slate-600 leading-relaxed font-medium">
                      The overall Eco Score synthesizes five weighted sustainability dimensions derived deterministically from packaging facts and environmental indicators:
                    </p>

                    <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                      <li>
                        <strong className="text-slate-900">Packaging — 25%</strong>: Material circularity, presence of post-consumer recycled (PCR) content, and refillability.
                      </li>
                      <li>
                        <strong className="text-slate-900">Carbon impact / data — 30%</strong>: Transparency of product-level carbon footprint and lifecycle emissions disclosure.
                      </li>
                      <li>
                        <strong className="text-slate-900">Biodegradability / compostability — 20%</strong>: Organic breakdown potential and absence of persistent synthetic polymers.
                      </li>
                      <li>
                        <strong className="text-slate-900">Recyclability / end-of-life — 15%</strong>: Compatibility with municipal curbside recovery and mono-material design.
                      </li>
                      <li>
                        <strong className="text-slate-900">Evidence quality — 10%</strong>: Grounded supporting certifications and substantiation of environmental marketing claims.
                      </li>
                    </ul>

                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-[11px] font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Eco Score is a prototype comparison metric, not a certified Life Cycle Assessment.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Highlighted Card: Why this score? */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Why this score?
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
                {generateWhyThisScore(result)}
              </p>
            </div>

            {/* 6. Evidence & Attributes with Source Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Packaging Attributes & Evidence Sources
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified Data Breakdown
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Packaging Material */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Package className="w-3.5 h-3.5 text-emerald-700" />
                    Material
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{result.packagingMaterial}</p>
                    <p className="text-slate-500 text-[11px]">{result.recycledContent}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Observed on packaging
                  </span>
                </div>

                {/* Recyclability */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Recycle className="w-3.5 h-3.5 text-emerald-700" />
                    Recyclability
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {result.recyclable === true
                        ? 'Widely Recyclable'
                        : result.recyclable === 'conditional'
                        ? 'Conditionally Recyclable'
                        : 'Non-Recyclable'}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {result.recyclable === true ? 'Standard curbside collection' : 'Specialized drop-off required'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    Product dataset
                  </span>
                </div>

                {/* Carbon Footprint */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    Carbon Data
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{result.carbonFootprintDisplay}</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                      {result.carbonDataAvailability === 'unavailable' || !result.carbonFootprint
                        ? 'Score reflects the strength and availability of carbon-impact evidence. No product-level footprint was disclosed.'
                        : `${result.carbonDataAvailability} metric`}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      result.carbonDataAvailability === 'verified'
                        ? 'bg-teal-50 text-teal-800 border-teal-200'
                        : result.carbonDataAvailability === 'manufacturer_estimate'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {result.carbonDataAvailability === 'verified'
                      ? 'Verified external data'
                      : result.carbonDataAvailability === 'manufacturer_estimate'
                      ? 'Manufacturer information'
                      : 'Data unavailable'}
                  </span>
                </div>

                {/* Circularity / Refillability */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    Circularity
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {result.refillable ? 'Refillable' : result.reusable ? 'Reusable' : 'Single-Use'}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {result.biodegradable ? 'Biodegradable' : 'Non-biodegradable substrate'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    AI inference & label
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Packaging Claims & Evidence Evaluation (Claim Check) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Packaging Claims & Evidence Evaluation
                </h3>
                <span className="text-[11px] text-slate-500">
                  Neutral fact-check & substantiation audit
                </span>
              </div>

              {result.environmentalClaims.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <h4 className="text-xs font-bold text-slate-800">
                      No specific sustainability claims detected
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                    No specific environmental marketing claim was visible on the uploaded packaging. The absence of marketing claims is a neutral observation and does not penalize the packaging's inherent recyclability or material score.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.environmentalClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-xl border border-slate-200 text-xs space-y-2 bg-slate-50/70"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-medium">Claim:</span>
                          <span className="font-bold text-slate-900 text-sm">"{claim.claim}"</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-medium">Assessment:</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                              claim.risk === 'low'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : claim.risk === 'moderate'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {claim.risk === 'low'
                              ? 'Specific / substantiated'
                              : claim.risk === 'moderate'
                              ? 'Needs verification'
                              : 'Limited supporting evidence'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80">
                        <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">
                          Supporting evidence:
                        </span>
                        <p className="text-xs leading-relaxed">
                          {claim.explanation || 'No specific supporting evidence detected on the uploaded packaging.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 8. 🌱 EcoSwitch (Scenario Simulator) */}
            <div className="pt-3">
              <EcoSwitchSection product={result} />
            </div>

            {/* 9. Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onOpenWhy(result)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 py-2.5 px-4 rounded-xl border border-emerald-200 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={resetForm}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 py-2.5 px-4 rounded-xl border border-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Analyze Another</span>
                </button>
              </div>

              <button
                onClick={() => onCompareWithProduct(result)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 py-2.5 px-5 rounded-xl transition-colors shadow-xs"
              >
                <span>Add to Comparator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
