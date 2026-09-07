import { Product, ProductCategory, ComparisonResult } from '../types.ts';
import { DEMO_PRODUCTS } from '../data/demoProducts.ts';
import { compareTwoProducts, computeEcoScores, determineSustainabilityStatus } from './scoringService.ts';

/**
 * Product Data Service Layer
 *
 * This service manages product queries and mutations using verified local demo
 * products and in-memory storage for user-uploaded AI-analyzed items.
 * Operates purely locally without any external database dependencies.
 */

let customProductsStore: Product[] = [];

export const productService = {
  /**
   * Retrieves all available products (catalog + any AI-analyzed custom products).
   */
  async getProducts(category?: ProductCategory | string): Promise<Product[]> {
    const all = [...DEMO_PRODUCTS, ...customProductsStore];
    if (category && category !== 'all') {
      return all.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    return all;
  },

  /**
   * Retrieves a single product by its ID.
   */
  async getProductById(id: string): Promise<Product | null> {
    const all = [...DEMO_PRODUCTS, ...customProductsStore];
    const found = all.find((p) => p.id === id);
    return found || null;
  },

  /**
   * Searches products by name, brand, or packaging keyword.
   */
  async searchProducts(query: string, category?: string): Promise<Product[]> {
    const all = await this.getProducts(category);
    if (!query || query.trim() === '') return all;

    const q = query.toLowerCase().trim();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.packagingMaterial.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  },

  /**
   * Stores an AI-analyzed or user-custom product.
   */
  async saveProduct(product: Product): Promise<Product> {
    // In demo mode, persist in in-memory store
    const existingIndex = customProductsStore.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      customProductsStore[existingIndex] = product;
    } else {
      customProductsStore.unshift(product);
    }
    return product;
  },

  /**
   * Compares two products side-by-side using the scoring engine.
   */
  compareProducts(productA: Product, productB: Product): ComparisonResult {
    return compareTwoProducts(productA, productB);
  },

  /**
   * Utility to recompute scores for a partially defined product.
   */
  computeScoresForProduct(product: Partial<Product>): Product {
    const scores = computeEcoScores(product);
    const status = determineSustainabilityStatus(scores.totalScore, product);
    return {
      ...(product as Product),
      scores,
      status,
    };
  },
};
