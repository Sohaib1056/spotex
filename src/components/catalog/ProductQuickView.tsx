'use client';

import { gsap } from 'gsap';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from '@/components/motion/SmoothScroll';
import { Link } from '@/i18n/navigation';
import type { CategorySlug } from '@/lib/catalog/types';
import './quick-view.css';

/** Everything the quick view shows, already translated on the server. */
export interface QuickViewProduct {
  slug: string;
  code: string;
  name: string;
  category: CategorySlug;
  categoryName: string;
  images: string[];
  specs: { label: string; value: string }[];
}

/**
 * "Pick up" view for a product card: the card the visitor clicked lifts out of its place (`origin`),
 * grows to the centre and its details slide out beside it. Closing (Esc, ×, or a click anywhere else)
 * flies the card back into its place before `onClose` runs, so it looks like it was put back.
 */
export function ProductQuickView({
  product,
  origin,
  onClose,
}: {
  product: QuickViewProduct | null;
  /** The card that was clicked; its position is where the lifted card starts and returns to. */
  origin: HTMLElement | null;
  onClose: () => void;
}) {
  const t = useTranslations('Common');
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const info = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  /** Offset + scale that put the big card exactly over the small one. */
  const fromOrigin = useCallback(() => {
    const big = card.current!.getBoundingClientRect();
    const small = origin?.getBoundingClientRect();
    if (!small || !small.width) return { x: 0, y: 40, scale: 0.6, autoAlpha: 0 };
    return { x: small.left - big.left, y: small.top - big.top, scale: small.width / big.width, autoAlpha: 1 };
  }, [origin]);

  // lift the card out of its place
  useLayoutEffect(() => {
    if (!product || !card.current) return;
    closing.current = false;
    setActive(0);
    gsap.set(card.current, { transformOrigin: '0 0' });
    gsap.fromTo(card.current, fromOrigin(), { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.65, ease: 'expo.out' });
    gsap.fromTo(info.current, { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, delay: 0.3, ease: 'power3.out' });
    gsap.fromTo(root.current, { backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: 'rgba(255,255,255,.72)', duration: 0.4 });
  }, [product, fromOrigin]);

  // put it back, then let the parent remove the view
  const close = useCallback(() => {
    if (closing.current || !card.current) return;
    closing.current = true;
    gsap.to(info.current, { x: -20, autoAlpha: 0, duration: 0.2 });
    gsap.to(root.current, { backgroundColor: 'rgba(255,255,255,0)', duration: 0.45 });
    gsap.to(card.current, { ...fromOrigin(), duration: 0.5, ease: 'power3.inOut', onComplete: onClose });
  }, [fromOrigin, onClose]);

  // lock the page while a card is held; Esc puts it back
  useEffect(() => {
    if (!product) return;
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [product, lenis, close]);

  if (!product) return null;
  const alt = `${product.name} ${product.code}`;

  return createPortal(
    <div ref={root} className="qv" role="dialog" aria-modal="true" aria-labelledby="qv-title" onClick={close}>
      <div className="qv-stage" onClick={(e) => e.stopPropagation()}>
        {/* the lifted card: same look as the ring card, only bigger */}
        <div ref={card} className="qv-card">
          <div className="qv-im">
            <Image key={product.images[active]} src={product.images[active]} alt={alt} fill sizes="(max-width: 760px) 70vw, 380px" priority />
          </div>
          <div className="qv-cap">
            <span className="qv-code">{product.code}</span>
            <h3 id="qv-title">{product.name}</h3>
          </div>
        </div>

        {/* details beside it */}
        <div ref={info} className="qv-info">
          <button type="button" className="qv-close" aria-label={t('close')} onClick={close}>
            ×
          </button>
          <p className="eyebrow">{product.categoryName}</p>
          {product.images.length > 1 && (
            <div className="qv-thumbs">
              {product.images.map((src, i) => (
                <button key={src} type="button" aria-label={`${alt} ${i + 1}`} aria-current={i === active} onClick={() => setActive(i)}>
                  <Image src={src} alt="" fill sizes="56px" />
                </button>
              ))}
            </div>
          )}
          {product.specs.length > 0 && (
            <dl className="qv-specs">
              {product.specs.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="qv-note">{t('quickNote')}</p>
          <div className="qv-actions">
            <Link href={{ pathname: '/contact', query: { product: product.code } }} className="btn">
              {t('requestQuote')}
            </Link>
            <Link
              href={{ pathname: '/products/[category]/[product]', params: { category: product.category, product: product.slug } }}
              className="btn btn-ghost"
            >
              {t('viewDetails')} →
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
