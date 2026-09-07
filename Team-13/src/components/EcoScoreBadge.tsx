import React from 'react';
import { SustainabilityStatus, EvidenceConfidence } from '../types.ts';
import { ShieldCheck, Info } from 'lucide-react';

interface Props {
  score: number;
  status: SustainabilityStatus;
  confidence?: EvidenceConfidence;
  analysisConfidence?: EvidenceConfidence;
  sustainabilityEvidence?: 'Strong' | 'Moderate' | 'Limited' | 'Insufficient';
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
}

export const EcoScoreBadge: React.FC<Props> = ({
  score,
  status,
  confidence,
  analysisConfidence,
  sustainabilityEvidence,
  size = 'md',
  showConfidence = true,
}) => {
  const effectiveAnalysisConfidence = analysisConfidence || confidence;
  // Score color tiers
  const getTheme = () => {
    if (score >= 75) {
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        bar: 'bg-emerald-600',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    }
    if (score >= 50) {
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        bar: 'bg-amber-500',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    }
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      bar: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500',
    };
  };

  const theme = getTheme();

  // Small compact badge (e.g. inside list or headers)
  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${theme.bg} ${theme.text} border ${theme.border}`}>
          {score} / 100
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${theme.badge} border`}>
          {status.label}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Primary Score & Status Display */}
      <div className={`p-4 rounded-xl border ${theme.border} ${theme.bg} transition-all`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${theme.text}`}>
              {score}
            </span>
            <span className="text-xs font-semibold text-slate-500">/ 100</span>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${theme.badge} border shadow-xs`}>
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Informative visual progress bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${theme.bar}`}
              style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium mt-1">
            <span>0</span>
            <span className="font-semibold text-slate-600">Eco Score</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Analysis Confidence & Sustainability Evidence */}
      {showConfidence && (effectiveAnalysisConfidence || sustainabilityEvidence) && (
        <div className="space-y-1.5 pt-1 text-xs">
          {effectiveAnalysisConfidence && (
            <div className="flex items-center justify-between px-1 text-slate-600">
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                Analysis Confidence:
              </span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-md text-[11px] border ${
                  effectiveAnalysisConfidence === 'High'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : effectiveAnalysisConfidence === 'Moderate'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {effectiveAnalysisConfidence === 'High'
                  ? 'High'
                  : effectiveAnalysisConfidence === 'Moderate'
                  ? 'Medium'
                  : 'Low'}
              </span>
            </div>
          )}

          {sustainabilityEvidence && (
            <div className="flex items-center justify-between px-1 text-slate-600">
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <span className="text-xs">🌱</span>
                Sustainability Evidence:
              </span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-md text-[11px] border ${
                  sustainabilityEvidence === 'Strong'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : sustainabilityEvidence === 'Moderate'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : sustainabilityEvidence === 'Limited'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {sustainabilityEvidence}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
