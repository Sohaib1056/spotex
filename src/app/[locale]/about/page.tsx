import { getTranslations } from 'next-intl/server';
import { ContactActions } from '@/components/ui/ContactActions';
import { PageIntro } from '@/components/ui/PageIntro';
import { SITE } from '@/config/site';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: localeAlternates(locale, '/about') };
}

export default async function AboutPage({ params }: LocaleParams) {
  initLocale((await params).locale);
  const t = await getTranslations('AboutPage');
  const values = t.raw('values') as { title: string; text: string }[];

  const facts = [
    { value: String(SITE.foundedYear), label: t('facts.since') },
    { value: `${SITE.stats.staff}+`, label: t('facts.staff') },
    { value: `${SITE.stats.clients}+`, label: t('facts.clients') },
    { value: String(SITE.stats.departments), label: t('facts.departments') },
  ];

  return (
    <>
      <PageIntro eyebrow={t('eyebrow')} titleA={t('titleA')} titleB={t('titleB')} intro={t('intro')} />

      <section className="container-page pb-20">
        <h2 className="sr-only">{t('factsTitle')}</h2>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse rounded-[18px] border-[1.5px] border-line p-6">
              <dt className="mt-1 text-xs font-bold tracking-[0.14em] uppercase">{f.label}</dt>
              <dd className="display text-[clamp(44px,5vw,72px)] text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-soft py-20">
        <div className="container-page">
          <h2 className="display text-[clamp(36px,5vw,64px)] text-ink">{t('valuesTitle')}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-[18px] bg-white p-6">
                <h3 className="display text-3xl text-brand">{v.title}</h3>
                <p className="mt-2 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <ContactActions />
      </section>
    </>
  );
}
