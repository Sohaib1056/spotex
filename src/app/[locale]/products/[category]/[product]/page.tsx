import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/catalog/ProductCard';
import { ProductGallery } from '@/components/catalog/ProductGallery';
import { ContactActions } from '@/components/ui/ContactActions';
import { SITE } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { getProduct, getProducts, getRelatedProducts, isCategorySlug } from '@/lib/catalog';
import { getCatalogText } from '@/lib/catalog/text';
import { localeAlternates } from '@/lib/seo';

type Props = LocaleParams<{ category: string; product: string }>;

export async function generateStaticParams() {
  const products = await getProducts();
  return routing.locales.flatMap((locale) => products.map((p) => ({ locale, category: p.category, product: p.slug })));
}

async function load(category: string, slug: string) {
  if (!isCategorySlug(category)) return undefined;
  return getProduct(category, slug);
}

export async function generateMetadata({ params }: Props) {
  const { locale: raw, category, product: slug } = await params;
  const locale = initLocale(raw);
  const product = await load(category, slug);
  if (!product) return {};
  const [t, text] = await Promise.all([getTranslations({ locale, namespace: 'ProductPage' }), getCatalogText()]);
  const name = text.productName(product);
  return {
    title: `${name} ${product.code}`,
    description: t('metaDescription', { name, code: product.code, specs: text.summary(product) }),
    alternates: localeAlternates(locale, {
      pathname: '/products/[category]/[product]',
      params: { category: product.category, product: product.slug },
    }),
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, category, product: slug } = await params;
  initLocale(locale);
  const product = await load(category, slug);
  if (!product) notFound();

  const [t, text, related] = await Promise.all([
    getTranslations('ProductPage'),
    getCatalogText(),
    getRelatedProducts(product),
  ]);
  const name = text.productName(product);
  const customList = t.raw('customList') as string[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${name} ${product.code}`,
    sku: product.code,
    image: product.images,
    description: text.summary(product),
    brand: { '@type': 'Brand', name: SITE.name },
    manufacturer: { '@type': 'Organization', name: SITE.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-page grid gap-10 pt-32 pb-20 md:pt-36 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={`${name} ${product.code}`} />

        <div className="flex flex-col">
          <Link
            href={{ pathname: '/products/[category]', params: { category: product.category } }}
            className="eyebrow self-start hover:opacity-80"
          >
            {text.categoryName(product.category)}
          </Link>
          <h1 className="display mt-4 text-[clamp(44px,6vw,88px)] text-ink">{name}</h1>
          <p className="mt-2 text-sm font-extrabold tracking-[0.18em] text-brand">
            {t('code')} {product.code}
          </p>

          <h2 className="mt-8 text-xs font-bold tracking-[0.2em] uppercase">{t('specs')}</h2>
          <dl className="mt-3 divide-y divide-line border-y border-line">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm">
                <dt className="font-bold">{text.specLabel(spec)}</dt>
                <dd>{text.specValue(spec)}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-xs font-bold tracking-[0.2em] uppercase">{t('custom')}</h2>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {customList.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-md text-sm leading-relaxed">{t('moq')}</p>
          <ContactActions className="mt-6" whatsappText={t('whatsappText', { code: product.code, name })} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page pb-24">
          <h2 className="display mb-6 text-4xl text-ink">{t('related')}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} text={text} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
