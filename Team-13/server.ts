import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DEMO_PRODUCTS } from './src/data/demoProducts.ts';
import { computeEcoScores, determineSustainabilityStatus } from './src/services/scoringService.ts';
import { Product, EnvironmentalClaim, ClaimClassification, ClaimRisk } from './src/types.ts';
import { geminiService } from './src/server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Support large image payloads (front + back images in base64)
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ limit: '35mb', extended: true }));

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: geminiService.isConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Get catalog products (Demo products - 12 verified items)
app.get('/api/products', (req: Request, res: Response) => {
  const { category } = req.query;
  if (category && typeof category === 'string' && category !== 'all') {
    const filtered = DEMO_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return res.json(filtered);
  }
  return res.json(DEMO_PRODUCTS);
});

// Get single product by id
app.get('/api/products/:id', (req: Request, res: Response) => {
  const found = DEMO_PRODUCTS.find((p) => p.id === req.params.id);
  if (!found) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(found);
});

// Analyze product packaging using server-side Gemini service
app.post('/api/analyze-product', async (req: Request, res: Response) => {
  try {
    const { frontImageBase64, backImageBase64, productNameHint, categoryHint } = req.body;

    if (!frontImageBase64) {
      return res.status(400).json({ error: 'Front image is required for product analysis.' });
    }

    // Call server-side dedicated Gemini service
    const rawAnalysis = await geminiService.analyzePackaging({
      frontImageBase64,
      backImageBase64,
      productNameHint,
      categoryHint,
    });

    // Format environmental claims with structured evidence classification
    const formattedClaims: EnvironmentalClaim[] = (rawAnalysis.environmentalClaims || []).map((c, index) => {
      let classification: ClaimClassification = 'insufficient_evidence';
      if (c.assessment === 'Specific claim' || c.assessment === 'Evidence detected') {
        classification = 'specific';
      } else if (c.assessment === 'Needs verification' || c.assessment === 'Limited supporting evidence') {
        classification = 'insufficient_evidence';
      } else {
        classification = 'broad_unsupported';
      }

      const validRisk: ClaimRisk = c.risk === 'low' || c.risk === 'high' ? c.risk : 'moderate';

      return {
        id: `ai-claim-${Date.now()}-${index}`,
        claim: c.claim || 'Environmental statement',
        risk: validRisk,
        classification,
        explanation: c.explanation || 'Claim detected on product packaging.',
        source: 'packaging',
      };
    });

    // Construct partial product
    const rawCompostable =
      rawAnalysis.compostable === 'home' || rawAnalysis.compostable === 'industrial'
        ? rawAnalysis.compostable
        : null;

    const partialProduct: Partial<Product> = {
      id: `custom-${Date.now()}`,
      name: rawAnalysis.productName || productNameHint || 'Analyzed Product',
      brand: rawAnalysis.brand || 'Unknown Brand',
      category: rawAnalysis.category || categoryHint || 'household',
      price: undefined,
      currency: '₹',
      imageUrl: frontImageBase64,
      backImageUrl: backImageBase64 || undefined,
      packagingMaterial: rawAnalysis.packagingMaterial || 'Packaging detected',
      recycledContent: rawAnalysis.recycledContent || 'None detected',
      recyclable: rawAnalysis.recyclable !== undefined ? rawAnalysis.recyclable : 'conditional',
      reusable: Boolean(rawAnalysis.reusable),
      refillable: Boolean(rawAnalysis.refillable),
      biodegradable: Boolean(rawAnalysis.biodegradable),
      compostable: rawCompostable,
      carbonFootprint: rawAnalysis.carbonFootprint || null,
      carbonDataAvailability:
        rawAnalysis.carbonDataAvailability === 'verified' ||
        rawAnalysis.carbonDataAvailability === 'manufacturer_estimate' ||
        rawAnalysis.carbonDataAvailability === 'industry_average'
          ? rawAnalysis.carbonDataAvailability
          : 'unavailable',
      carbonFootprintDisplay: rawAnalysis.carbonFootprintDisplay || 'Carbon footprint: Data unavailable',
      environmentalClaims: formattedClaims,
      evidence: (rawAnalysis.observedEvidence || []).map((obs) => ({
        factor: 'Observed Evidence',
        value: obs,
        source: 'Product packaging',
        confidence: rawAnalysis.confidence || 'Moderate',
        dataOrigin: 'observed',
        notes: 'Extracted directly from package label using multimodal vision.',
      })),
      certifications:
        rawAnalysis.certifications && rawAnalysis.certifications.length > 0
          ? rawAnalysis.certifications
          : ['None detected'],
      observedEvidence: rawAnalysis.observedEvidence || [],
      confidence: rawAnalysis.confidence || 'Moderate',
      sourceType: 'ai_analyzed',
      summaryTradeoffs: {
        advantages: rawAnalysis.summaryAdvantages || [],
        limitations: rawAnalysis.summaryLimitations || [],
      },
    };

    // Calculate deterministic Eco Score using transparent application logic:
    // Packaging 25%, Carbon 30%, Biodegradability 20%, Recyclability 15%, Evidence Quality 10%
    const scores = computeEcoScores(partialProduct);
    const status = determineSustainabilityStatus(scores.totalScore, partialProduct);

    const fullProduct: Product = {
      ...(partialProduct as Product),
      scores,
      status,
    };

    return res.json(fullProduct);
  } catch (error: any) {
    console.error('Packaging analysis failed:', error);
    return res.status(500).json({
      error: "We couldn't complete the AI analysis. Please retry or use Demo Mode.",
    });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 EcoLens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
