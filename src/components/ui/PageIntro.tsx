import type { ReactNode } from 'react';

/** Standard top block for inner pages: eyebrow, two-tone heading, intro text. */
export function PageIntro({
  eyebrow,
  titleA,
  titleB,
  intro,
  children,
}: {
  eyebrow: string;
  titleA: string;
  titleB?: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="container-page pt-28 pb-8 md:pt-32 md:pb-10">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-4 text-[clamp(48px,8vw,120px)] text-ink text-balance">
        {titleA}
        {titleB && (
          <>
            {' '}
            <span className="text-brand">{titleB}</span>
          </>
        )}
      </h1>
      {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg">{intro}</p>}
      {children}
    </section>
  );
}
