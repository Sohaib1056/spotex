'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import type { CategorySlug } from '@/lib/catalog/types';

export interface BrowserCategory {
  slug: CategorySlug;
  name: string;
  intro: string;
  cover: string;
  count: number;
}
export interface BrowserProduct {
  slug: string;
  code: string;
  category: CategorySlug;
  name: string;
  image: string;
}

/**
 * Category overview with a search box, a category dropdown (picking one opens its page) and a sort order. Typing searches the whole catalogue:
 * matching products are listed straight away and only categories that contain a match stay visible.
 */
export function CategoryBrowser({
  categories,
  products,
}: {
  categories: BrowserCategory[];
  products: BrowserProduct[];
}) {
  const t = useTranslations('ProductsPage');
  const common = useTranslations('Common');
  const [query, setQuery] = useState('');
  const router = useRouter();
  const [sort, setSort] = useState<'default' | 'most' | 'name'>('default');

  const words = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const nameOf = useMemo(() => new Map(categories.map((c) => [c.slug, c.name])), [categories]);
  const hits = useMemo(
    () =>
      words.length
        ? products.filter((p) => words.every((w) => `${p.name} ${p.code} ${nameOf.get(p.category)}`.toLowerCase().includes(w)))
        : [],
    [products, words, nameOf],
  );
  const filtered = categories.filter(
    (c) =>
      !words.length || hits.some((p) => p.category === c.slug) || words.every((w) => c.name.toLowerCase().includes(w)),
  );
  const shown =
    sort === 'most' ? [...filtered].sort((a, b) => b.count - a.count) : sort === 'name' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered;

  return (
    <section className="container-page pt-6 pb-20">
      {/* toolbar */}
      <div className="flex flex-col gap-3 rounded-[22px] border-[1.5px] border-ink/30 bg-white p-3 md:flex-row md:items-center">
        <label className="relative w-full md:flex-1">
          <span className="sr-only">{t('searchLabel')}</span>
          <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 fill-none stroke-ink/50 stroke-2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchAll')}
            className="w-full rounded-full border-[1.5px] border-ink/30 bg-white py-3 pr-4 pl-11 text-sm text-ink outline-none placeholder:text-ink/45 focus:border-ink"
          />
        </label>
        <label className="relative md:w-72 md:flex-none">
          <span className="sr-only">{t('categoryLabel')}</span>
          <select
            value=""
            onChange={(e) => e.target.value && router.push({ pathname: '/products/[category]', params: { category: e.target.value as CategorySlug } })}
            className="w-full appearance-none rounded-full border-[1.5px] border-ink/30 bg-white py-3 pr-10 pl-5 text-sm font-semibold text-ink outline-none transition-colors hover:border-ink focus:border-ink"
          >
            <option value="">
              {t('allCategories')} ({categories.length})
            </option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute top-1/2 right-4 h-3.5 w-3.5 -translate-y-1/2 fill-none stroke-ink stroke-[2.5]">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </label>
        <label className="relative md:w-56 md:flex-none">
          <span className="sr-only">{t('sortLabel')}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'default' | 'most' | 'name')}
            className="w-full appearance-none rounded-full border-[1.5px] border-ink/30 bg-white py-3 pr-10 pl-5 text-sm font-semibold text-ink outline-none transition-colors hover:border-ink focus:border-ink"
          >
            <option value="default">
              {t('sortLabel')}: {t('sortDefault')}
            </option>
            <option value="most">
              {t('sortLabel')}: {t('sortMost')}
            </option>
            <option value="name">
              {t('sortLabel')}: {t('sortName')}
            </option>
          </select>
          <svg viewBox="0 0 24 24" aria-hidden className="pointer-events-none absolute top-1/2 right-4 h-3.5 w-3.5 -translate-y-1/2 fill-none stroke-ink stroke-[2.5]">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </label>
      </div>

      {/* products matching the search */}
      {words.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-bold tracking-[0.16em] text-ink/60 uppercase" aria-live="polite">
            {common('products', { count: hits.length })}
          </p>
          {hits.length > 0 ? (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {hits.slice(0, 9).map((p) => (
                <Link
                  key={p.slug}
                  href={{ pathname: '/products/[category]/[product]', params: { category: p.category, product: p.slug } }}
                  className="flex items-center gap-3 rounded-2xl border-[1.5px] border-ink/35 bg-white p-2 pr-4 transition-colors hover:border-ink"
                >
                  <span className="relative h-14 w-14 flex-none overflow-hidden rounded-xl bg-soft">
                    <Image src={p.image} alt="" fill sizes="56px" className="photo-multiply object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-extrabold tracking-[0.14em] text-brand">{p.code}</span>
                    <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                    <span className="block text-[11px] text-ink/60">{nameOf.get(p.category)}</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm">{t('noResults')}</p>
          )}
        </div>
      )}

      {/* categories */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {shown.map((c) => (
          <Link
            key={c.slug}
            href={{ pathname: '/products/[category]', params: { category: c.slug } }}
            className="group grid min-h-[210px] grid-cols-[1fr_42%] overflow-hidden rounded-[22px] border-[1.5px] border-ink bg-white transition-[border-color,box-shadow] duration-300 hover:border-brand hover:shadow-[0_18px_40px_rgba(0,0,0,.08)]"
          >
            <span className="flex flex-col justify-between gap-4 p-5 md:p-6">
              <span>
                <span className="text-[11px] font-extrabold tracking-[0.18em] text-brand">
                  {String(categories.indexOf(c) + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                </span>
                <span className="display mt-2 block text-[clamp(28px,2.6vw,40px)] leading-none text-ink">{c.name}</span>
                <span className="mt-2.5 line-clamp-2 block text-[13px] leading-relaxed text-ink/75">{c.intro}</span>
              </span>
              <span className="flex items-center justify-between gap-3">
                <span className="rounded-full border-[1.5px] border-ink/30 px-3 py-1 text-[10.5px] font-bold tracking-[0.12em] text-ink uppercase">
                  {common('products', { count: c.count })}
                </span>
                <span className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
                  {t('viewRange')} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </span>
            </span>
            <span className="relative bg-soft">
              {c.cover && (
                <Image
                  src={c.cover}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="photo-multiply object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              )}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
