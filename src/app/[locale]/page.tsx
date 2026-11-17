import { HomeFilm } from '@/components/home/film/HomeFilm';
import { SpotlightHero } from '@/components/home/hero/SpotlightHero';
import { HomeCta } from '@/components/home/HomeCta';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams) {
  const locale = initLocale((await params).locale);
  return { alternates: localeAlternates(locale, '/') };
}

export default async function HomePage({ params }: LocaleParams) {
  initLocale((await params).locale);
  return (
    <>
      <SpotlightHero />
      <HomeFilm />
      <HomeCta />
    </>
  );
}
