import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

type Href = Parameters<typeof getPathname>[0]['href'];

/** Public site address; set NEXT_PUBLIC_SITE_URL on Vercel once the domain is live. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Canonical URL plus hreflang links to the same page in every language
 * (x-default points to English), so search engines show each market its own version.
 */
export function localeAlternates(locale: Locale, href: Href): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = getPathname({ locale: l, href });
  languages['x-default'] = getPathname({ locale: routing.defaultLocale, href });
  return { canonical: getPathname({ locale, href }), languages };
}
