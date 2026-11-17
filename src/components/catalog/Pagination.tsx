'use client';

import { useTranslations } from 'next-intl';

/** Page numbers with previous / next; long runs collapse to 1 … 4 5 6 … 12. */
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  const t = useTranslations('ProductsPage');
  if (pages < 2) return null;

  const numbers: (number | '…')[] = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - page) <= 1) numbers.push(n);
    else if (numbers[numbers.length - 1] !== '…') numbers.push('…');
  }
  const base = 'grid h-10 min-w-10 place-items-center rounded-full border-[1.5px] px-3 text-sm font-bold transition-colors';

  return (
    <nav aria-label={t('pagination')} className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${base} border-ink/30 text-ink hover:border-ink disabled:pointer-events-none disabled:opacity-35`}
      >
        ← <span className="ml-1.5 hidden sm:inline">{t('prev')}</span>
      </button>
      {numbers.map((n, i) =>
        n === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-ink/45">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            aria-current={n === page ? 'page' : undefined}
            onClick={() => onChange(n)}
            className={`${base} ${n === page ? 'border-ink bg-ink text-white' : 'border-ink/30 text-ink hover:border-ink'}`}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className={`${base} border-ink/30 text-ink hover:border-ink disabled:pointer-events-none disabled:opacity-35`}
      >
        <span className="mr-1.5 hidden sm:inline">{t('next')}</span> →
      </button>
    </nav>
  );
}
