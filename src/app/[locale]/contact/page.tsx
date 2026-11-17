import { getTranslations } from 'next-intl/server';
import { ContactActions } from '@/components/ui/ContactActions';
import { PageIntro } from '@/components/ui/PageIntro';
import { SITE, whatsappLink } from '@/config/site';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { localeAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: LocaleParams) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: localeAlternates(locale, '/contact') };
}

export default async function ContactPage({ params }: LocaleParams) {
  initLocale((await params).locale);
  const t = await getTranslations('ContactPage');

  const rows = [
    {
      label: t('address'),
      value: (
        <>
          {SITE.address.street},<br />
          {SITE.address.city} {SITE.address.postalCode}, {SITE.address.country}
        </>
      ),
    },
    { label: t('phone'), value: <a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a> },
    { label: t('email'), value: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> },
    {
      label: t('whatsapp'),
      value: (
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          +{SITE.whatsapp}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageIntro eyebrow={t('eyebrow')} titleA={t('titleA')} titleB={t('titleB')} intro={t('intro')} />
      <section className="container-page grid gap-12 pb-24 lg:grid-cols-[1.2fr_1fr]">
        <dl className="divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-2 py-5 sm:grid-cols-[160px_1fr]">
              <dt className="text-xs font-bold tracking-[0.2em] text-brand uppercase">{r.label}</dt>
              <dd className="text-lg [&_a]:hover:text-brand">{r.value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-[20px] bg-soft p-8">
          <p className="leading-relaxed">{t('formSoon')}</p>
          <ContactActions className="mt-6" />
        </div>
      </section>
    </>
  );
}
