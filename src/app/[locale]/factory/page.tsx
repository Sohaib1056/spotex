import { getTranslations } from 'next-intl/server';
import { ContactActions } from '@/components/ui/ContactActions';
import { PageIntro } from '@/components/ui/PageIntro';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { localeAlternates } from '@/lib/seo';

/** Departments in production order, from design to packing. */
const DEPARTMENTS = ['design', 'pattern', 'fabric', 'knitting', 'dyeing', 'cutting', 'printing', 'stitching', 'inspection', 'packing'] as const;

export async function generateMetadata({ params }: LocaleParams) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'FactoryPage' });
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: localeAlternates(locale, '/factory') };
}

export default async function FactoryPage({ params }: LocaleParams) {
  initLocale((await params).locale);
  const [t, dept] = await Promise.all([getTranslations('FactoryPage'), getTranslations('Departments')]);
  const csr = t.raw('csr') as string[];

  return (
    <>
      <PageIntro eyebrow={t('eyebrow')} titleA={t('titleA')} titleB={t('titleB')} intro={t('intro')} />

      <section className="container-page bg-ink py-20 text-white">
        <ol className="grid gap-px overflow-hidden rounded-[20px] bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {DEPARTMENTS.map((key, i) => (
            <li key={key} className="bg-ink p-6">
              <span className="display text-4xl text-brand-bright">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="display mt-3 text-2xl">{dept(`${key}.name`)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{dept(`${key}.text`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page grid gap-12 py-20 md:grid-cols-2">
        <div>
          <h2 className="display text-[clamp(36px,5vw,64px)] text-ink">{t('qualityTitle')}</h2>
          <p className="mt-4 max-w-lg leading-relaxed">{t('quality')}</p>
        </div>
        <div>
          <h2 className="display text-[clamp(36px,5vw,64px)] text-ink">{t('csrTitle')}</h2>
          <ul className="mt-4 space-y-3">
            {csr.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pb-24">
        <ContactActions />
      </section>
    </>
  );
}
