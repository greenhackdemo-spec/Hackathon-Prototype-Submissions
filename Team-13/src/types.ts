export type ProductCategory =
  | 'shampoo'
  | 'soap'
  | 'detergent'
  | 'beverage'
  | 'food'
  | 'household';

export type ClaimRisk = 'low' | 'moderate' | 'high';
export type ClaimClassification = 'specific' | 'insufficient_evidence' | 'broad_unsupported';

export interface EnvironmentalClaim {
  id: string;
  claim: string;
  risk: ClaimRisk;
  classification: ClaimClassification;
  explanation: string;
  source: 'packaging' | 'marketing' | 'website';
}

export type EvidenceSource =
  | 'Product packaging'
  | 'Product database'
  | 'Manufacturer-provided information'
  | 'Verified external dataset'
  | 'AI inference'
  | 'Unknown';

export type DataOrigin = 'observed' | 'dataset' | 'estimated' | 'unknown';
export type EvidenceConfidence = 'High' | 'Moderate' | 'Low' | 'Unknown';
export type SustainabilityEvidenceLevel = 'Strong' | 'Moderate' | 'Limited' | 'Insufficient';

export interface EcoSwitchState {
  recycledMaterial: boolean;
  refillableDesign: boolean;
  betterEndOfLife: boolean;
}

export interface EcoSwitchProjection {
  currentScore: number;
  projectedScore: number;
  delta: number;
  projectedBreakdown: EcoScoreBreakdown;
  reasons: Array<{
    id: keyof EcoSwitchState;
    icon: string;
    title: string;
    explanation: string;
  }>;
}

export interface EvidenceItem {
  factor: string;
  value: string;
  source: EvidenceSource;
  confidence: EvidenceConfidence;
  dataOrigin: DataOrigin;
  notes?: string;
}

export interface EcoScoreBreakdown {
  totalScore: number;
  packagingScore: number;
  carbonScore: number;
  biodegradabilityScore: number;
  recyclabilityScore: number;
  evidenceQualityScore: number;
  weights: {
    packaging: number;
    carbon: number;
    biodegradability: number;
    recyclability: number;
    evidence: number;
  };
}

export type SustainabilityStatusLevel = 'better' | 'mixed' | 'lower' | 'unknown';

export interface SustainabilityStatus {
  label:
    | 'Better sustainable choice'
    | 'Mixed environmental impact'
    | 'Lower sustainability score'
    | 'Insufficient data';
  level: SustainabilityStatusLevel;
  badgeClass: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory | string;
  price?: number;
  currency?: string;
  imageUrl: string;
  backImageUrl?: string;
  packagingMaterial: string;
  recycledContent: string;
  recyclable: boolean | 'conditional' | null;
  reusable: boolean | null;
  refillable: boolean | null;
  biodegradable: boolean | null;
  compostable: boolean | 'industrial' | 'home' | null;
  carbonFootprint: number | null; // in kg CO2e or null
  carbonDataAvailability: 'verified' | 'manufacturer_estimate' | 'industry_average' | 'unavailable';
  carbonFootprintDisplay: string;
  environmentalClaims: EnvironmentalClaim[];
  evidence: EvidenceItem[];
  certifications: string[];
  observedEvidence: string[];
  scores: EcoScoreBreakdown;
  status: SustainabilityStatus;
  confidence: EvidenceConfidence;
  sourceType: 'database' | 'ai_analyzed' | 'user_custom';
  summaryTradeoffs?: {
    advantages: string[];
    limitations: string[];
  };
}

export interface ComparisonFactor {
  id: string;
  name: string;
  weightLabel: string;
  weightPct: number;
  scoreA: number;
  scoreB: number;
  detailA: string;
  detailB: string;
  winner: 'A' | 'B' | 'equal';
}

export interface ComparisonResult {
  productA: Product;
  productB: Product;
  winnerId: string | 'tie';
  winnerName: string;
  scoreDiff: number;
  headline: string;
  whyExplanation: string;
  priceTradeoff?: {
    diffPrice: number;
    cheaperName: string;
    expensiveName: string;
    scoreDelta: number;
    text: string;
  };
  advantagesWinner: string[];
  limitationsWinner: string[];
  factors: ComparisonFactor[];
}

export interface AnalyzeImageRequest {
  frontImageBase64: string;
  backImageBase64?: string;
  productNameHint?: string;
  categoryHint?: string;
}
