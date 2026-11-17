import { PRODUCTS } from '@/data/products';
import { CATEGORY_SLUGS, type Category, type CategorySlug, type Product } from './types';

/**
 * Catalogue data access. Pages only talk to these functions, so swapping the
 * static seed for MongoDB (day 2) changes this file and nothing else.
 */

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

/** Categories that have products, in menu order (an empty one, e.g. a new range, stays hidden). */
export async function getCategories(): Promise<(Category & { count: number })[]> {
  return CATEGORY_SLUGS.map((slug) => {
    const items = PRODUCTS.filter((p) => p.category === slug);
    const cover = (items.find((p) => p.featured) ?? items[0])?.images[0] ?? '';
    return { slug, cover, count: items.length };
  }).filter((c) => c.count > 0);
}

export async function getProducts(category?: CategorySlug): Promise<Product[]> {
  return category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.featured);
}

export async function getProduct(category: CategorySlug, slug: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.category === category && p.slug === slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, limit);
}

export type { Category, CategorySlug, Product, ProductType, Spec } from './types';
