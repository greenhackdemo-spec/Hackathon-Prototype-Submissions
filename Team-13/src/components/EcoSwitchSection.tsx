import React, { useState } from 'react';
import { Product, EcoSwitchState } from '../types.ts';
import { calculateEcoSwitchProjection } from '../services/scoringService.ts';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Info,
  Check,
} from 'lucide-react';

interface Props {
  product: Product;
}

export const EcoSwitchSection: React.FC<Props> = ({ product }) => {
  const [switches, setSwitches] = useState<EcoSwitchState>({
    recycledMaterial: false,
    refillableDesign: false,
    betterEndOfLife: false,
  });

  const projection = calculateEcoSwitchProjection(product, switches);

  const toggleSwitch = (key: keyof EcoSwitchState) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSwitches = () => {
    setSwitches({
      recycledMaterial: false,
      refillableDesign: false,
      betterEndOfLife: false,
    });
  };

  const anyActive = switches.recycledMaterial || switches.refillableDesign || switches.betterEndOfLife;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-linear-to-b from-white to-emerald-50/40 p-5 sm:p-7 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            <span>🌱</span>
            <span>EcoSwitch Scenario Simulator</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            What could make this product more sustainable?
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Explore hypothetical packaging design upgrades to simulate potential environmental improvements.
          </p>
        </div>

        {anyActive && (
          <button
            onClick={resetSwitches}
            className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset simulator</span>
          </button>
        )}
      </div>

      {/* Interactive Controls & Projected Score Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: 3 Improvement Toggles (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Select Design Scenarios to Apply:
          </span>

          {/* Toggle 1: Recycled Packaging Material */}
          <button
            type="button"
            onClick={() => toggleSwitch('recycledMaterial')}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              switches.recycledMaterial
                ? 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl p-1.5 rounded-lg bg-emerald-100/70 shrink-0">♻️</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Recycled Packaging Material
                  </span>
                  {switches.recycledMaterial && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Use post-consumer recycled (PCR) material or another verified lower-impact packaging material.
                </p>
                <span className="inline-block mt-1 text-[11px] font-medium text-emerald-700">
                  Target: Packaging circularity (+20 to +26 pts Packaging component)
                </span>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                switches.recycledMaterial ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  switches.recycledMaterial ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          {/* Toggle 2: Refillable Design */}
          <button
            type="button"
            onClick={() => toggleSwitch('refillableDesign')}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              switches.refillableDesign
                ? 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl p-1.5 rounded-lg bg-emerald-100/70 shrink-0">🔄</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Refillable Design
                  </span>
                  {switches.refillableDesign && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Make packaging durable and refillable via concentrated refills or pouches
                </p>
                <span className="inline-block mt-1 text-[11px] font-medium text-emerald-700">
                  Target: Avoided single-use manufacturing & transport emissions
                </span>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                switches.refillableDesign ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  switches.refillableDesign ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          {/* Toggle 3: Better End-of-Life */}
          <button
            type="button"
            onClick={() => toggleSwitch('betterEndOfLife')}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
              switches.betterEndOfLife
                ? 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-400 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl p-1.5 rounded-lg bg-emerald-100/70 shrink-0">📦</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Better End-of-Life
                  </span>
                  {switches.betterEndOfLife && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Design for mono-material curbside recycling or certified compostability
                </p>
                <span className="inline-block mt-1 text-[11px] font-medium text-emerald-700">
                  Target: Eliminate complex mixed multi-layer plastics & hard-to-recycle inks
                </span>
              </div>
            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                switches.betterEndOfLife ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  switches.betterEndOfLife ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Right Column: Dynamic Projected Score Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              <span>Score Projection</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Scenario Mode
              </span>
            </div>

            {/* Score Comparison Display: Current vs Projected */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Current Score
                  </span>
                  <div className="text-2xl font-extrabold text-slate-700">
                    {projection.currentScore}
                    <span className="text-xs font-semibold text-slate-400">/100</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <ArrowRight className="w-5 h-5 text-emerald-600" />
                  {projection.delta > 0 && (
                    <span className="text-[11px] font-extrabold text-emerald-700">
                      +{projection.delta}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Projected Score
                  </span>
                  <div className="text-3xl font-black text-emerald-700">
                    {projection.projectedScore}
                    <span className="text-xs font-semibold text-emerald-600/70">/100</span>
                  </div>
                </div>
              </div>

              {/* Progress visual */}
              <div className="space-y-1 pt-1">
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                  {/* Current base width */}
                  <div
                    className="bg-slate-400 h-full transition-all duration-500"
                    style={{ width: `${projection.currentScore}%` }}
                  />
                  {/* Projected gain width */}
                  {projection.delta > 0 && (
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500 animate-pulse"
                      style={{ width: `${projection.delta}%` }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0</span>
                  {projection.delta > 0 ? (
                    <span className="font-bold text-emerald-700">
                      Potential Improvement: +{projection.delta} points
                    </span>
                  ) : (
                    <span>Select a scenario to simulate projected improvements</span>
                  )}
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Projected Score Status & Visible +X Projected Points Indicator */}
            <div className="mt-3 text-center space-y-2">
              {projection.delta > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-xs">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                    +{projection.delta} Projected Points
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {projection.currentScore} → {projection.projectedScore} / 100
                  </span>
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-slate-100/80 border border-slate-200 text-xs text-slate-600 font-medium">
                  Select a scenario above to simulate projected improvements.
                </div>
              )}

              {/* Component Changes Summary */}
              {projection.delta > 0 && (
                <div className="text-left p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider">
                    Scoring Components Changed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {projection.projectedBreakdown.packagingScore > product.scores.packagingScore && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-300 font-semibold text-[10.5px]">
                        Packaging: {product.scores.packagingScore} → {projection.projectedBreakdown.packagingScore} (+{projection.projectedBreakdown.packagingScore - product.scores.packagingScore} pts)
                      </span>
                    )}
                    {projection.projectedBreakdown.carbonScore > product.scores.carbonScore && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-300 font-semibold text-[10.5px]">
                        Carbon: {product.scores.carbonScore} → {projection.projectedBreakdown.carbonScore} (+{projection.projectedBreakdown.carbonScore - product.scores.carbonScore} pts)
                      </span>
                    )}
                    {projection.projectedBreakdown.recyclabilityScore > product.scores.recyclabilityScore && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-300 font-semibold text-[10.5px]">
                        Recyclability: {product.scores.recyclabilityScore} → {projection.projectedBreakdown.recyclabilityScore} (+{projection.projectedBreakdown.recyclabilityScore - product.scores.recyclabilityScore} pts)
                      </span>
                    )}
                    {projection.projectedBreakdown.biodegradabilityScore > product.scores.biodegradabilityScore && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-300 font-semibold text-[10.5px]">
                        Biodegradability: {product.scores.biodegradabilityScore} → {projection.projectedBreakdown.biodegradabilityScore} (+{projection.projectedBreakdown.biodegradabilityScore - product.scores.biodegradabilityScore} pts)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mandatory Disclaimers */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Scenario projection</span>
            </div>
            <p>
              Scenario projection — not a certified environmental impact measurement. Calculations apply deterministic heuristics to estimate how material or circularity changes could adjust component weights.
            </p>
          </div>
        </div>
      </div>

      {/* "Why does the score change?" Section */}
      {projection.reasons.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-emerald-200/80 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Why does the score change?
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.2 rounded bg-emerald-50 border border-emerald-200">
              {projection.reasons.length} scenario{projection.reasons.length > 1 ? 's' : ''} applied
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {projection.reasons.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <span>{r.icon}</span>
                  <span>{r.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {r.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
