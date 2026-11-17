import { getTranslations } from 'next-intl/server';
import { CategoryBrowser } from '@/components/catalog/CategoryBrowser';
import { ContactActions } from '@/components/ui/ContactActions';
import { CatalogHero } from '@/components/catalog/CatalogHero';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { getCategories, getProducts } from '@/lib/catalog';
import { getCatalogText } from '@/lib/catalog/text';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'ProductsPage' });
  return { title: t('title'), description: t('metaDescription'), alternates: localeAlternates(locale, '/products') };
}

export default async function ProductsPage({ params }: LocaleParams) {
  initLocale((await params).locale);
  const [t, nav, text, categories, products] = await Promise.all([
    getTranslations('ProductsPage'),
    getTranslations('Nav'),
    getCatalogText(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <>
      <CatalogHero
        crumbs={[{ label: nav('home'), href: '/' }, { label: nav('products') }]}
        title={t('title')}
        intro={t('intro')}
      />
      <CategoryBrowser
        categories={categories.map((c) => ({
          slug: c.slug,
          name: text.categoryName(c.slug),
          intro: text.categoryIntro(c.slug),
          cover: c.cover,
          count: c.count,
        }))}
        products={products.map((p) => ({ slug: p.slug, code: p.code, category: p.category, name: text.productName(p), image: p.images[0] }))}
      />
      <section className="container-page pb-24">
        <ContactActions />
      </section>
    </>
  );
}
