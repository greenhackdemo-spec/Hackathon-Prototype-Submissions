import {
  EcoScoreBreakdown,
  Product,
  SustainabilityStatus,
  ComparisonResult,
  ComparisonFactor,
  EcoSwitchState,
  EcoSwitchProjection,
  SustainabilityEvidenceLevel,
} from '../types.ts';

// Configurable prototype weights (Section 11)
export const SCORE_WEIGHTS = {
  packaging: 0.25,
  carbon: 0.30,
  biodegradability: 0.20,
  recyclability: 0.15,
  evidence: 0.10,
};

/**
 * Deterministically evaluates the packaging score (0-100) based on
 * packaging material, recycled content percentage, and refillability.
 */
export function calculatePackagingScore(product: Partial<Product>): number {
  let score = 50; // baseline
  const mat = (product.packagingMaterial || '').toLowerCase();
  const recycled = (product.recycledContent || '').toLowerCase();

  // Material circularity heuristics
  if (mat.includes('bagasse') || mat.includes('paper') || mat.includes('cardboard') || mat.includes('bamboo') || mat.includes('solid bar')) {
    score += 35;
  } else if (mat.includes('aluminium') || mat.includes('aluminum')) {
    score += 25; // highly recyclable closed-loop
  } else if (mat.includes('glass')) {
    score += 15; // reusable & recyclable, heavier shipping
  } else if (mat.includes('pcr') || mat.includes('post-consumer') || mat.includes('recycled pet')) {
    score += 20;
  } else if (mat.includes('virgin') || mat.includes('single-use') || mat.includes('styrofoam') || mat.includes('polystyrene')) {
    score -= 35;
  } else if (mat.includes('hdpe') || mat.includes('pet') || mat.includes('pp')) {
    score -= 10;
  }

  // Recycled content bonus
  if (recycled.includes('100%')) {
    score += 20;
  } else if (recycled.includes('70%') || recycled.includes('75%') || recycled.includes('80%')) {
    score += 15;
  } else if (recycled.includes('50%') || recycled.includes('40%')) {
    score += 10;
  } else if (recycled.includes('none') || recycled.includes('0%') || recycled.includes('virgin')) {
    score -= 10;
  }

  // Refillable / reusable bonus
  if (product.refillable || product.reusable) {
    score += 15;
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

/**
 * Deterministically evaluates carbon impact (0-100).
 * Emphasizes carbon data availability and verified efficiency.
 * If data is unavailable, assigns an objective neutral/uncertain penalty.
 */
export function calculateCarbonScore(product: Partial<Product>): number {
  const availability = product.carbonDataAvailability || 'unavailable';
  const footprint = product.carbonFootprint;

  if (availability === 'unavailable' || footprint === null) {
    // Missing data cannot receive full score, but avoids extreme penalty
    return 35;
  }

  let score = 60;

  if (availability === 'verified') {
    score += 25;
  } else if (availability === 'manufacturer_estimate') {
    score += 15;
  } else if (availability === 'industry_average') {
    score += 5;
  }

  // If quantified (kg CO2e per unit):
  // < 0.2 kg -> excellent (solid bars, lightweight concentrates)
  // 0.2 - 0.5 kg -> good
  // 0.5 - 1.5 kg -> moderate
  // > 1.5 kg -> heavy / high emissions
  if (footprint !== null) {
    if (footprint < 0.15) score += 20;
    else if (footprint < 0.4) score += 10;
    else if (footprint < 0.8) score += 0;
    else if (footprint < 1.5) score -= 15;
    else score -= 30;
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

/**
 * Deterministically calculates biodegradability & compostability score (0-100).
 */
export function calculateBiodegradabilityScore(product: Partial<Product>): number {
  let score = 40;

  if (product.compostable === 'home') {
    score += 45;
  } else if (product.compostable === 'industrial' || product.compostable === true) {
    score += 35;
  }

  if (product.biodegradable === true) {
    score += 25;
  } else if (product.biodegradable === false) {
    score -= 20;
  }

  const mat = (product.packagingMaterial || '').toLowerCase();
  if (mat.includes('bagasse') || mat.includes('banana leaf') || mat.includes('kraft paper')) {
    score += 15;
  } else if (mat.includes('plastic') || mat.includes('pet') || mat.includes('polystyrene')) {
    score -= 15;
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

/**
 * Deterministically calculates recyclability & end-of-life score (0-100).
 */
export function calculateRecyclabilityScore(product: Partial<Product>): number {
  let score = 45;

  if (product.recyclable === true) {
    score += 35;
  } else if (product.recyclable === 'conditional') {
    score += 15;
  } else if (product.recyclable === false) {
    score -= 30;
  }

  const mat = (product.packagingMaterial || '').toLowerCase();
  if (mat.includes('aluminium') || mat.includes('aluminum')) {
    score += 20; // Infinitely recyclable metal
  } else if (mat.includes('glass')) {
    score += 15;
  } else if (mat.includes('pcr pet') || mat.includes('recycled pet')) {
    score += 10;
  } else if (mat.includes('multi-layer') || mat.includes('composite') || mat.includes('pouch')) {
    score -= 25; // Complex non-separable layers
  }

  return Math.min(100, Math.max(10, Math.round(score)));
}

/**
 * Deterministically calculates evidence quality & environmental claim verification score (0-100).
 */
export function calculateEvidenceQualityScore(product: Partial<Product>): number {
  let score = 50;

  // Certifications provide strong factual grounding
  const certCount = (product.certifications || []).filter(
    (c) => !c.toLowerCase().includes('none detected')
  ).length;
  score += Math.min(30, certCount * 10);

  // Confidence rating from evidence items
  const conf = product.confidence;
  if (conf === 'High') score += 20;
  else if (conf === 'Moderate') score += 5;
  else if (conf === 'Low') score -= 20;

  // Deduct for high-risk unsubstantiated claims
  const claims = product.environmentalClaims || [];
  const highRiskClaims = claims.filter((c) => c.risk === 'high').length;
  const specificClaims = claims.filter((c) => c.risk === 'low' || c.classification === 'specific').length;

  score -= highRiskClaims * 12;
  score += specificClaims * 8;

  return Math.min(100, Math.max(10, Math.round(score)));
}

/**
 * Computes full Eco Score breakdown.
 */
export function computeEcoScores(product: Partial<Product>): EcoScoreBreakdown {
  const packagingScore = calculatePackagingScore(product);
  const carbonScore = calculateCarbonScore(product);
  const biodegradabilityScore = calculateBiodegradabilityScore(product);
  const recyclabilityScore = calculateRecyclabilityScore(product);
  const evidenceQualityScore = calculateEvidenceQualityScore(product);

  const totalScore = Math.round(
    packagingScore * SCORE_WEIGHTS.packaging +
      carbonScore * SCORE_WEIGHTS.carbon +
      biodegradabilityScore * SCORE_WEIGHTS.biodegradability +
      recyclabilityScore * SCORE_WEIGHTS.recyclability +
      evidenceQualityScore * SCORE_WEIGHTS.evidence
  );

  return {
    totalScore,
    packagingScore,
    carbonScore,
    biodegradabilityScore,
    recyclabilityScore,
    evidenceQualityScore,
    weights: { ...SCORE_WEIGHTS },
  };
}

/**
 * Determines non-binary sustainability status based on score and data availability.
 */
export function determineSustainabilityStatus(
  score: number,
  product: Partial<Product>
): SustainabilityStatus {
  // If crucial data is completely absent
  if (
    (!product.packagingMaterial || product.packagingMaterial === 'Unknown') &&
    product.confidence === 'Unknown'
  ) {
    return {
      label: 'Insufficient data',
      level: 'unknown',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      description: 'Not enough visible or verified packaging data to assign an impact rating.',
    };
  }

  if (score >= 75) {
    return {
      label: 'Better sustainable choice',
      level: 'better',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200',
      description: 'High circularity packaging, verified recyclability or compostability, and substantiated claims.',
    };
  }

  if (score >= 50) {
    return {
      label: 'Mixed environmental impact',
      level: 'mixed',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-200',
      description: 'Contains sustainable attributes but has trade-offs in packaging, missing carbon data, or end-of-life.',
    };
  }

  return {
    label: 'Lower sustainability score',
    level: 'lower',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200',
    description: 'Relies on conventional virgin materials, non-recyclable formats, or broad unsubstantiated environmental claims.',
  };
}

/**
 * Generates an explainable comparison between Product A and Product B.
 */
export function compareTwoProducts(productA: Product, productB: Product): ComparisonResult {
  const scoreA = productA.scores.totalScore;
  const scoreB = productB.scores.totalScore;
  const diff = Math.abs(scoreA - scoreB);

  let winnerId: string | 'tie' = 'tie';
  let winner = productA;
  let runnerUp = productB;

  if (scoreA > scoreB) {
    winnerId = productA.id;
    winner = productA;
    runnerUp = productB;
  } else if (scoreB > scoreA) {
    winnerId = productB.id;
    winner = productB;
    runnerUp = productA;
  }

  // Structured comparative factors
  const factors: ComparisonFactor[] = [
    {
      id: 'packaging',
      name: 'Packaging & Circularity',
      weightLabel: '25%',
      weightPct: 25,
      scoreA: productA.scores.packagingScore,
      scoreB: productB.scores.packagingScore,
      detailA: `${productA.packagingMaterial} (${productA.recycledContent || 'No PCR'})`,
      detailB: `${productB.packagingMaterial} (${productB.recycledContent || 'No PCR'})`,
      winner:
        productA.scores.packagingScore > productB.scores.packagingScore
          ? 'A'
          : productB.scores.packagingScore > productA.scores.packagingScore
          ? 'B'
          : 'equal',
    },
    {
      id: 'carbon',
      name: 'Carbon Impact / Data',
      weightLabel: '30%',
      weightPct: 30,
      scoreA: productA.scores.carbonScore,
      scoreB: productB.scores.carbonScore,
      detailA: productA.carbonFootprintDisplay,
      detailB: productB.carbonFootprintDisplay,
      winner:
        productA.scores.carbonScore > productB.scores.carbonScore
          ? 'A'
          : productB.scores.carbonScore > productA.scores.carbonScore
          ? 'B'
          : 'equal',
    },
    {
      id: 'biodegradability',
      name: 'Biodegradability & Compostability',
      weightLabel: '20%',
      weightPct: 20,
      scoreA: productA.scores.biodegradabilityScore,
      scoreB: productB.scores.biodegradabilityScore,
      detailA: productA.compostable
        ? `Compostable (${productA.compostable})`
        : productA.biodegradable
        ? 'Biodegradable formula'
        : 'Non-biodegradable packaging',
      detailB: productB.compostable
        ? `Compostable (${productB.compostable})`
        : productB.biodegradable
        ? 'Biodegradable formula'
        : 'Non-biodegradable packaging',
      winner:
        productA.scores.biodegradabilityScore > productB.scores.biodegradabilityScore
          ? 'A'
          : productB.scores.biodegradabilityScore > productA.scores.biodegradabilityScore
          ? 'B'
          : 'equal',
    },
    {
      id: 'recyclability',
      name: 'Recyclability & End-of-Life',
      weightLabel: '15%',
      weightPct: 15,
      scoreA: productA.scores.recyclabilityScore,
      scoreB: productB.scores.recyclabilityScore,
      detailA:
        productA.recyclable === true
          ? 'Widely recyclable'
          : productA.recyclable === 'conditional'
          ? 'Conditionally recyclable'
          : 'Non-recyclable / hard-to-recycle',
      detailB:
        productB.recyclable === true
          ? 'Widely recyclable'
          : productB.recyclable === 'conditional'
          ? 'Conditionally recyclable'
          : 'Non-recyclable / hard-to-recycle',
      winner:
        productA.scores.recyclabilityScore > productB.scores.recyclabilityScore
          ? 'A'
          : productB.scores.recyclabilityScore > productA.scores.recyclabilityScore
          ? 'B'
          : 'equal',
    },
    {
      id: 'evidence',
      name: 'Evidence Quality & Claim Backing',
      weightLabel: '10%',
      weightPct: 10,
      scoreA: productA.scores.evidenceQualityScore,
      scoreB: productB.scores.evidenceQualityScore,
      detailA: `${productA.confidence} confidence · ${productA.certifications.length} verified certs`,
      detailB: `${productB.confidence} confidence · ${productB.certifications.length} verified certs`,
      winner:
        productA.scores.evidenceQualityScore > productB.scores.evidenceQualityScore
          ? 'A'
          : productB.scores.evidenceQualityScore > productA.scores.evidenceQualityScore
          ? 'B'
          : 'equal',
    },
  ];

  // Derive advantages and limitations for the winning product
  const advantagesWinner: string[] = [];
  const limitationsWinner: string[] = [];

  factors.forEach((f) => {
    const isWinnerA = winnerId === productA.id;
    const isFactorWon = (isWinnerA && f.winner === 'A') || (!isWinnerA && f.winner === 'B');
    const isFactorLost = (isWinnerA && f.winner === 'B') || (!isWinnerA && f.winner === 'A');

    if (isFactorWon) {
      advantagesWinner.push(`Superior ${f.name.toLowerCase()} (${isWinnerA ? f.scoreA : f.scoreB} vs ${isWinnerA ? f.scoreB : f.scoreA})`);
    } else if (isFactorLost) {
      limitationsWinner.push(`Lower ${f.name.toLowerCase()} score than ${runnerUp.name}`);
    }
  });

  if (winner.carbonDataAvailability === 'unavailable') {
    limitationsWinner.push('Carbon footprint lifecycle data is currently unavailable');
  }

  if (winner.certifications.length === 0 || winner.certifications.includes('None detected')) {
    limitationsWinner.push('No formal 3rd-party environmental certifications detected on packaging');
  }

  // Price trade-off analysis
  let priceTradeoff: ComparisonResult['priceTradeoff'];
  if (productA.price && productB.price) {
    const diffPrice = Math.abs(productA.price - productB.price);
    const curr = productA.currency || '₹';
    if (diffPrice > 0) {
      const isMoreExpensiveWinner =
        (winnerId === productA.id && productA.price > productB.price) ||
        (winnerId === productB.id && productB.price > productA.price);

      if (isMoreExpensiveWinner) {
        priceTradeoff = {
          diffPrice,
          cheaperName: runnerUp.name,
          expensiveName: winner.name,
          scoreDelta: diff,
          text: `${curr}${diffPrice} more for ${winner.name} → ${diff}-point higher Eco Score`,
        };
      } else {
        priceTradeoff = {
          diffPrice,
          cheaperName: winner.name,
          expensiveName: runnerUp.name,
          scoreDelta: diff,
          text: `${winner.name} is ${curr}${diffPrice} cheaper AND scores ${diff} points higher`,
        };
      }
    }
  }

  // Explainable rationale
  let headline = `${winner.name} is the more sustainable choice`;
  let whyExplanation = `${winner.name} achieves a higher Eco Score (${winner.scores.totalScore} vs ${runnerUp.scores.totalScore}) because it employs more circular packaging materials, offers better end-of-life recovery, and provides more substantiated environmental claims.`;

  if (winnerId === 'tie') {
    headline = 'Both products show comparable overall environmental impact';
    whyExplanation = `Both products achieved identical overall Eco Scores (${scoreA}/100), but each has distinct trade-offs across material composition, recyclability, and data transparency.`;
  }

  return {
    productA,
    productB,
    winnerId,
    winnerName: winnerId === 'tie' ? 'Tie' : winner.name,
    scoreDiff: diff,
    headline,
    whyExplanation,
    priceTradeoff,
    advantagesWinner,
    limitationsWinner,
    factors,
  };
}

/**
 * Separates analysis confidence from actual sustainability evidence.
 * Evaluates the depth of verified external audits, certifications, and disclosed data.
 */
export function determineSustainabilityEvidence(product: Product): SustainabilityEvidenceLevel {
  const hasVerifiedCarbon = product.carbonDataAvailability === 'verified';
  const certCount = (product.certifications || []).filter(
    (c) => !c.toLowerCase().includes('none detected')
  ).length;
  const specificClaims = (product.environmentalClaims || []).filter(
    (c) => c.risk === 'low' || c.classification === 'specific'
  ).length;
  const highRiskClaims = (product.environmentalClaims || []).filter(
    (c) => c.risk === 'high'
  ).length;

  if ((hasVerifiedCarbon && certCount >= 1) || certCount >= 2) {
    return 'Strong';
  }

  if (certCount >= 1 || (specificClaims >= 1 && highRiskClaims === 0) || product.evidence.length >= 3) {
    return 'Moderate';
  }

  if (product.environmentalClaims && product.environmentalClaims.length > 0) {
    return 'Limited';
  }

  return 'Insufficient';
}

/**
 * Generates an objective, factual 2–4 sentence explanation of why this product received its Eco Score.
 * Strictly based ONLY on actual extracted product properties without inventing data.
 */
export function generateWhyThisScore(product: Product): string {
  const mat = (product.packagingMaterial || '').toLowerCase();
  const isRecyclable = product.recyclable === true;
  const isConditional = product.recyclable === 'conditional';
  const isBio = product.biodegradable === true;
  const isCompostable = product.compostable === 'home' || product.compostable === 'industrial' || product.compostable === true;
  const hasPcr = (product.recycledContent || '').toLowerCase().includes('recycled') ||
    (product.recycledContent || '').toLowerCase().includes('pcr') ||
    (product.recycledContent || '').toLowerCase().includes('%');
  const isPlastic = mat.includes('plastic') || mat.includes('pet') || mat.includes('hdpe') || mat.includes('pp') || mat.includes('polystyrene') || mat.includes('foam');
  const isRefillable = product.refillable || product.reusable;
  const carbonAvailable = product.carbonDataAvailability === 'verified' || product.carbonDataAvailability === 'manufacturer_estimate';

  const sentences: string[] = [];

  // Sentence 1: Key strengths / baseline
  if (isRecyclable) {
    if (mat.includes('hdpe')) {
      sentences.push('This product performs relatively well on recyclability because HDPE is widely recyclable in standard municipal streams.');
    } else if (mat.includes('aluminium') || mat.includes('aluminum')) {
      sentences.push('This product scores strongly on material circularity because aluminium is infinitely recyclable with minimal material loss.');
    } else if (mat.includes('pet')) {
      sentences.push('This product achieves moderate circularity marks because PET plastic maintains established curbside collection pathways.');
    } else if (mat.includes('paper') || mat.includes('kraft') || mat.includes('cardboard') || mat.includes('bagasse')) {
      sentences.push('This product gains substantial points from its renewable plant-fiber packaging substrate and circular material base.');
    } else {
      sentences.push(`This product scores well on end-of-life processing as the ${product.packagingMaterial} packaging is curbside recyclable.`);
    }
  } else if (isCompostable || isBio) {
    sentences.push(`This product achieves strong biodegradability marks due to its ${isCompostable ? 'compostable' : 'biodegradable'} composition.`);
  } else if (isRefillable) {
    sentences.push('This product benefits from a reusable or refill-oriented format that helps avoid single-use packaging lifecycles.');
  } else if (hasPcr) {
    sentences.push(`This product incorporates ${product.recycledContent}, reducing its initial demand for virgin feedstocks.`);
  } else {
    sentences.push(`This product utilizes standard consumer packaging made from ${product.packagingMaterial}.`);
  }

  // Sentence 2: Limitations / Score deductions
  const deductions: string[] = [];
  if (isPlastic && !hasPcr) {
    deductions.push('the packaging relies on conventional virgin plastic');
  } else if (!isRecyclable && !isCompostable) {
    deductions.push('the packaging format is not widely accepted in standard recycling systems');
  } else if (isConditional) {
    deductions.push('recycling requires specialized local drop-off facilities');
  }

  if (!isBio && !isCompostable) {
    deductions.push('it is not biodegradable');
  }

  if (!carbonAvailable) {
    deductions.push('no product-level carbon footprint data is publicly disclosed on the label');
  }

  if (deductions.length > 0) {
    if (deductions.length === 1) {
      sentences.push(`However, its score is reduced because ${deductions[0]}.`);
    } else if (deductions.length === 2) {
      sentences.push(`However, its score is reduced because ${deductions[0]}, and ${deductions[1]}.`);
    } else {
      sentences.push(`However, its score is reduced because ${deductions[0]}, ${deductions[1]}, and ${deductions[2]}.`);
    }
  }

  // Sentence 3: Claims / Evidence observation
  const claims = product.environmentalClaims || [];
  const highRisk = claims.filter((c) => c.risk === 'high');
  const lowRisk = claims.filter((c) => c.risk === 'low' || c.classification === 'specific');

  if (highRisk.length > 0) {
    sentences.push('Additionally, the score is tempered because certain broad environmental claims lack third-party certification on the packaging.');
  } else if (lowRisk.length > 0 && product.certifications.length > 0) {
    sentences.push('On the other hand, its rating is supported by verified label markings and accredited third-party standards.');
  }

  return sentences.join(' ');
}

/**
 * Deterministically projects EcoScore improvements under hypothetical design scenarios.
 * Strictly capped between the current score and 100 with explainable component impact.
 */
export function calculateEcoSwitchProjection(
  product: Product,
  switchState: EcoSwitchState
): EcoSwitchProjection {
  const currentScores = product.scores;
  const currentTotal = currentScores.totalScore;

  if (!switchState.recycledMaterial && !switchState.refillableDesign && !switchState.betterEndOfLife) {
    return {
      currentScore: currentTotal,
      projectedScore: currentTotal,
      delta: 0,
      projectedBreakdown: { ...currentScores },
      reasons: [],
    };
  }

  let projectedPkg = currentScores.packagingScore;
  let projectedCarbon = currentScores.carbonScore;
  let projectedBio = currentScores.biodegradabilityScore;
  let projectedRec = currentScores.recyclabilityScore;
  const projectedEv = currentScores.evidenceQualityScore;

  const reasons: EcoSwitchProjection['reasons'] = [];

  // 1. Recycled Packaging Material scenario
  if (switchState.recycledMaterial) {
    // Boost packaging score by up to 26 points, minimum 75
    projectedPkg = Math.min(100, Math.max(75, projectedPkg + 26));
    reasons.push({
      id: 'recycledMaterial',
      icon: '♻️',
      title: 'Recycled Packaging Material',
      explanation: 'Use post-consumer recycled (PCR) material or another verified lower-impact packaging material. Improves the Packaging component by reducing reliance on virgin material.',
    });
  }

  // 2. Refillable Design scenario
  if (switchState.refillableDesign) {
    // Improves packaging, reduces lifecycle carbon demand, and extends product circularity
    projectedPkg = Math.min(100, projectedPkg + 18);
    projectedCarbon = Math.min(100, projectedCarbon + 22);
    projectedRec = Math.min(100, projectedRec + 12);
    reasons.push({
      id: 'refillableDesign',
      icon: '🔄',
      title: 'Refillable Design',
      explanation: 'A refillable system could reduce the need for repeated single-use packaging. Improves Packaging, Carbon, and Recyclability components.',
    });
  }

  // 3. Better End-of-Life scenario
  if (switchState.betterEndOfLife) {
    // Improves recyclability component to at least 85 or adds 32 points
    projectedRec = Math.min(100, Math.max(85, projectedRec + 32));
    // If not already biodegradable, give minor recovery boost for circular design
    if (projectedBio < 60) {
      projectedBio = Math.min(100, projectedBio + 15);
    }
    reasons.push({
      id: 'betterEndOfLife',
      icon: '📦',
      title: 'Better End-of-Life',
      explanation: 'Improved mono-material curbside recycling or certified compostability makes recovery easier. Improves the Recyclability / End-of-Life component.',
    });
  }

  // Deterministic weighted formula
  const calculatedTotal = Math.round(
    projectedPkg * SCORE_WEIGHTS.packaging +
      projectedCarbon * SCORE_WEIGHTS.carbon +
      projectedBio * SCORE_WEIGHTS.biodegradability +
      projectedRec * SCORE_WEIGHTS.recyclability +
      projectedEv * SCORE_WEIGHTS.evidence
  );

  // Guarantee score is capped between current score and 100
  const projectedScore = Math.min(100, Math.max(currentTotal, calculatedTotal));
  const delta = Math.max(0, projectedScore - currentTotal);

  return {
    currentScore: currentTotal,
    projectedScore,
    delta,
    projectedBreakdown: {
      totalScore: projectedScore,
      packagingScore: projectedPkg,
      carbonScore: projectedCarbon,
      biodegradabilityScore: projectedBio,
      recyclabilityScore: projectedRec,
      evidenceQualityScore: projectedEv,
      weights: { ...SCORE_WEIGHTS },
    },
    reasons,
  };
}
