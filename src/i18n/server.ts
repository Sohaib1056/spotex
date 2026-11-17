import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from './routing';

export type LocaleParams<Extra = object> = { params: Promise<{ locale: string } & Extra> };

/**
 * Validates the [locale] segment, enables static rendering for it, and returns it typed.
 * Call at the top of every page and layout under app/[locale].
 */
export function initLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
