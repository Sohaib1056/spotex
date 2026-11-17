import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <section className="container-page flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="display text-[clamp(96px,16vw,220px)] text-brand">404</p>
      <h1 className="display text-5xl text-ink">{t('title')}</h1>
      <p className="mt-3">{t('text')}</p>
      <Link href="/" className="btn mt-8">
        {t('back')}
      </Link>
    </section>
  );
}
