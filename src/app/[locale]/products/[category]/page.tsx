import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CatalogueExplorer } from '@/components/catalog/CatalogueExplorer';
import { ContactActions } from '@/components/ui/ContactActions';
import { CatalogHero } from '@/components/catalog/CatalogHero';
import { routing } from '@/i18n/routing';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { getCategories, getProducts, isCategorySlug } from '@/lib/catalog';
import { getCatalogText } from '@/lib/catalog/text';
import { localeAlternates } from '@/lib/seo';

type Props = LocaleParams<{ category: string }>;

export async function generateStaticParams() {
  const categories = await getCategories();
  return routing.locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })));
}

export async function generateMetadata({ params }: Props) {
  const { locale: raw, category } = await params;
  const locale = initLocale(raw);
  if (!isCategorySlug(category)) return {};
  const [t, text] = await Promise.all([getTranslations({ locale, namespace: 'CategoryPage' }), getCatalogText()]);
  const name = text.categoryName(category);
  return {
    title: name,
    description: t('metaDescription', { name }),
    alternates: localeAlternates(locale, { pathname: '/products/[category]', params: { category } }),
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  initLocale(locale);
  if (!isCategorySlug(category)) notFound();

  const [nav, text, products, categories] = await Promise.all([
    getTranslations('Nav'),
    getCatalogText(),
    getProducts(category),
    getCategories(),
  ]);
  if (!products.length) notFound();

  return (
    <>
      <CatalogHero
        crumbs={[{ label: nav('home'), href: '/' }, { label: nav('products'), href: '/products' }, { label: text.categoryName(category) }]}
        title={text.categoryName(category)}
        intro={text.categoryIntro(category)}
      />
      <CatalogueExplorer
        current={category}
        items={products.map((p) => ({
          slug: p.slug,
          code: p.code,
          category: p.category,
          name: text.productName(p),
          summary: text.summary(p),
          image: p.images[0],
          specs: p.specs.map((spec) => ({ group: text.specLabel(spec), value: text.specValue(spec) })),
        }))}
        categories={categories.map((c) => ({ slug: c.slug, name: text.categoryName(c.slug), count: c.count }))}
      />
      <section className="container-page pb-24">
        <ContactActions />
      </section>
    </>
  );
}
