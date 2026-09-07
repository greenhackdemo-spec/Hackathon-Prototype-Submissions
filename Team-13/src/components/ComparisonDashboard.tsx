import React, { useState } from 'react';
import { Product, ComparisonResult } from '../types.ts';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface Props {
  comparison: ComparisonResult;
  onOpenWhy: (product: Product) => void;
}

export const ComparisonDashboard: React.FC<Props> = ({ comparison, onOpenWhy }) => {
  const { productA, productB, winnerId, winnerName, scoreDiff, whyExplanation, priceTradeoff, advantagesWinner, limitationsWinner, factors } = comparison;
  const isTie = winnerId === 'tie';
  const winner = winnerId === productA.id ? productA : productB;

  const [activeTab, setActiveTab] = useState<'categories' | 'claims' | 'evidence'>('categories');

  return (
    <div className="space-y-8 mt-6">
      {/* ---------------------------------------------------- */}
      {/* 1. ECO SCORE COMPARISON BAR                          */}
      {/* ---------------------------------------------------- */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Eco Score Head-to-Head Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic 0–100 scale: Packaging (25%), Carbon (30%), Biodegradability (20%), Recyclability (15%), Evidence Quality (10%).
            </p>
          </div>

          {!isTie && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shrink-0">
              <span>{winner.brand} leads by +{scoreDiff} pts</span>
            </div>
          )}
        </div>

        {/* Dual visual score meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Product A Bar */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-slate-900 text-white">
                  Product A
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[200px]">
                  {productA.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{productA.scores.totalScore}</span>
                <span className="text-xs text-slate-500 font-semibold"> / 100</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-700"
                style={{ width: `${Math.max(5, productA.scores.totalScore)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-600">
              <span>Status: <strong className="text-slate-800">{productA.status.label}</strong></span>
              <span>Confidence: <strong>{productA.confidence}</strong></span>
            </div>
          </div>

          {/* Product B Bar */}
          <div className="space-y-2 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-indigo-600 text-white">
                  Product B
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[200px]">
                  {productB.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{productB.scores.totalScore}</span>
                <span className="text-xs text-slate-500 font-semibold"> / 100</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                style={{ width: `${Math.max(5, productB.scores.totalScore)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-600">
              <span>Status: <strong className="text-slate-800">{productB.status.label}</strong></span>
              <span>Confidence: <strong>{productB.confidence}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. RECOMMENDED CHOICE (PROMINENT BANNER)              */}
      {/* ---------------------------------------------------- */}
      <section className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider border border-emerald-700">
              <Trophy className="w-3.5 h-3.5 text-emerald-300" />
              <span>Recommended Choice</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isTie ? 'Balanced Sustainability Match' : `🏆 ${winnerName}`}
            </h2>

            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              {isTie
                ? 'Both products scored identically across circularity, carbon metrics, and packaging recyclability.'
                : `${winnerName} scores higher because ${whyExplanation.toLowerCase()}`}
            </p>

            {/* Price vs Sustainability Tradeoff */}
            {priceTradeoff && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-800/80 border border-emerald-700 text-xs text-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>
                  <strong className="font-semibold text-white">Value Trade-off:</strong> {priceTradeoff.text}
                </span>
              </div>
            )}
          </div>

          {/* Prominent "Why this product?" CTA */}
          <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2">
            <button
              id="btn-why-recommended"
              onClick={() => onOpenWhy(winner)}
              className="py-3 px-6 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-emerald-800" />
              <span>Why this product?</span>
            </button>
            <span className="text-[11px] text-emerald-300/80 text-center sm:text-right">
              View transparent evidence & trade-offs
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. ENVIRONMENTAL DETAIL TABS                         */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'categories'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Category Comparison</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
            {factors.length} Pillars
          </span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'claims'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Evidence & Claim Analysis</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
            {productA.environmentalClaims.length + productB.environmentalClaims.length} Claims
          </span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'evidence'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Data Traceability</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
            Audited
          </span>
        </button>
      </div>

      {/* TAB 1: Category Comparison (5 Environmental Pillars) */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          <div className="p-5 bg-slate-50/80 rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Pillar Breakdown & Deterministic Weights
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Every factor is scored from 0 to 100 according to verifiable physical material metrics.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <span className="text-slate-700">{productA.brand}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span className="text-slate-700">{productB.brand}</span>
              </div>
            </div>
          </div>

          {factors.map((factor) => {
            const isWinnerA = factor.winner === 'A';
            const isWinnerB = factor.winner === 'B';

            return (
              <div key={factor.id} className="p-5 sm:p-6 space-y-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{factor.name}</span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      Weight: {factor.weightLabel}
                    </span>
                  </div>

                  <div className="text-xs font-semibold">
                    {isWinnerA ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {productA.brand} leads (+{factor.scoreA - factor.scoreB} pts)
                      </span>
                    ) : isWinnerB ? (
                      <span className="inline-flex items-center gap-1 text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        {productB.brand} leads (+{factor.scoreB - factor.scoreA} pts)
                      </span>
                    ) : (
                      <span className="text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                        Equal Score
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-side Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product A */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="truncate max-w-[200px]" title={factor.detailA}>{factor.detailA}</span>
                      <span className="font-bold text-slate-900 ml-2">{factor.scoreA} / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-500"
                        style={{ width: `${factor.scoreA}%` }}
                      />
                    </div>
                  </div>

                  {/* Product B */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="truncate max-w-[200px]" title={factor.detailB}>{factor.detailB}</span>
                      <span className="font-bold text-slate-900 ml-2">{factor.scoreB} / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${factor.scoreB}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Evidence & Greenwashing Claim Analysis */}
      {activeTab === 'claims' && (
        <div className="space-y-5">
          {/* Informational Guidance Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800">
                Objective Evidence Assessment
              </p>
              <p className="leading-relaxed">
                EcoLens compares stated packaging claims against visible materials, official certifications, and verified datasets. Claims are classified objectively to help consumers see through vague marketing buzzwords.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product A Claims */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Product A Claims
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{productA.name}</h4>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {productA.environmentalClaims.length} Claims
                </span>
              </div>

              {productA.environmentalClaims.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  No prominent environmental claims detected on packaging.
                </p>
              ) : (
                <div className="space-y-3">
                  {productA.environmentalClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          "{claim.claim}"
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider shrink-0 ${
                            claim.risk === 'low'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : claim.risk === 'moderate'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {claim.risk === 'low'
                            ? '🟢 Stronger evidence'
                            : claim.risk === 'moderate'
                            ? '🟡 Needs verification'
                            : '🔴 Limited / unsupported evidence'}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {claim.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product B Claims */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Product B Claims
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{productB.name}</h4>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {productB.environmentalClaims.length} Claims
                </span>
              </div>

              {productB.environmentalClaims.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  No prominent environmental claims detected on packaging.
                </p>
              ) : (
                <div className="space-y-3">
                  {productB.environmentalClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          "{claim.claim}"
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider shrink-0 ${
                            claim.risk === 'low'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : claim.risk === 'moderate'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {claim.risk === 'low'
                            ? '🟢 Stronger evidence'
                            : claim.risk === 'moderate'
                            ? '🟡 Needs verification'
                            : '🔴 Limited / unsupported evidence'}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {claim.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Evidence Traceability */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Evidence Traceability & Audit Logs
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Every data point in EcoLens is traceable to an observed physical package label, structured dataset, or labeled estimate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product A Evidence */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">{productA.name}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {productA.confidence} Confidence
                </span>
              </div>

              {productA.evidence.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ev.factor}</span>
                    <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {ev.source}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold">{ev.value}</p>
                  {ev.notes && <p className="text-slate-500 text-[11px]">{ev.notes}</p>}
                </div>
              ))}

              {/* Certifications */}
              <div className="pt-2">
                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider block mb-2">
                  Verified Certifications
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {productA.certifications.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Product B Evidence */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900">{productB.name}</span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  {productB.confidence} Confidence
                </span>
              </div>

              {productB.evidence.map((ev, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ev.factor}</span>
                    <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {ev.source}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold">{ev.value}</p>
                  {ev.notes && <p className="text-slate-500 text-[11px]">{ev.notes}</p>}
                </div>
              ))}

              {/* Certifications */}
              <div className="pt-2">
                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider block mb-2">
                  Verified Certifications
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {productB.certifications.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
