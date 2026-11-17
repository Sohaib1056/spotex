import type messages from '@/messages/en.json';

/**
 * Catalogue types. Language-independent: every human-readable word is a message key
 * (see src/messages/*.json → "Catalog"), so one product record serves all four languages.
 * The same shapes are used by the MongoDB models later, so pages won't change when data moves.
 */

export const CATEGORY_SLUGS = [
  'bjj-gis',
  'judo-uniforms',
  'karate-uniforms',
  'taekwondo-uniforms',
  'sambo-uniforms',
  'belts',
  'mma-shorts',
  'rash-guards',
  'fight-wear',
  'bags',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type ProductType =
  | 'bjjGi'
  | 'judoUniform'
  | 'karateUniform'
  | 'taekwondoUniform'
  | 'samboUniform'
  | 'bjjBelt'
  | 'giFabricBelt'
  | 'casualBelt'
  | 'judoBelt'
  | 'mmaShorts'
  | 'hoodie'
  | 'singlet'
  | 'giBag';

/** Spec rows shown on the product page. Text values are keys in "Catalog.values". */
export type SpecLabel = 'weave' | 'jacket' | 'weight' | 'pants' | 'colours' | 'waist' | 'width' | 'sizes' | 'print' | 'use';

export type SpecValue = keyof (typeof messages)['Catalog']['values'];

export interface Spec {
  label: SpecLabel;
  /** Message key in "Catalog.values" … */
  value?: SpecValue;
  /** … or a number with a unit. */
  amount?: number;
  unit?: 'gsm' | 'oz' | 'cm';
}

export interface Category {
  slug: CategorySlug;
  /** Image used on the category card. */
  cover: string;
}

export interface Product {
  slug: string;
  code: string;
  category: CategorySlug;
  type: ProductType;
  /** Product line name, kept as-is in every language (e.g. "Academy"). */
  line?: string;
  specs: Spec[];
  /** Absolute image URLs, main photo first. */
  images: string[];
  featured?: boolean;
}
