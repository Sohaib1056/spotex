import type { Metadata } from 'next';
import { Bebas_Neue, Montserrat } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { routing } from '@/i18n/routing';
import { initLocale, type LocaleParams } from '@/i18n/server';
import { SITE_URL } from '@/lib/seo';

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('homeTitle'), template: `%s · ${t('siteName')}` },
    description: t('homeDescription'),
    openGraph: { siteName: t('siteName'), locale, type: 'website' },
  };
}

export default async function LocaleLayout({ children, params }: LocaleParams & { children: ReactNode }) {
  const locale = initLocale((await params).locale);

  return (
    <html lang={locale} className={`${bebas.variable} ${montserrat.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SmoothScroll>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
