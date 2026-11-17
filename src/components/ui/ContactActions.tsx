import { getTranslations } from 'next-intl/server';
import { whatsappLink } from '@/config/site';
import { Link } from '@/i18n/navigation';

/** Quote + WhatsApp buttons used at the end of most pages. */
export async function ContactActions({ whatsappText, className = '' }: { whatsappText?: string; className?: string }) {
  const t = await getTranslations('Common');
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link href="/contact" className="btn">
        {t('requestQuote')}
      </Link>
      <a href={whatsappLink(whatsappText)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
        {t('whatsapp')}
      </a>
    </div>
  );
}
