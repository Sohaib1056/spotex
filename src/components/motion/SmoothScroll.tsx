'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

/** The page's smooth-scroll instance (null when the visitor prefers reduced motion). */
export const useLenis = () => useContext(LenisContext);

/**
 * Smooth scrolling for the whole site, driven by GSAP's ticker so ScrollTrigger
 * scenes stay in sync with the scroll position.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Late images and web fonts change layout: re-measure every scroll scene once they are in.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const instance = new Lenis({ lerp: 0.085 });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Scrolls smoothly when Lenis is active, natively otherwise. */
export function scrollToY(lenis: Lenis | null, y: number, duration = 1.6) {
  if (lenis) lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}
