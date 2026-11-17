'use client';

import Image from 'next/image';
import { useState } from 'react';

/** Main photo with thumbnails to switch between front, back and detail shots. */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-soft">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 92vw"
          className="photo-multiply object-contain p-4"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`${alt} ${i + 1}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={`relative h-24 w-20 overflow-hidden rounded-xl border-[1.5px] bg-soft transition-colors ${
                i === active ? 'border-brand' : 'border-line hover:border-ink'
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="photo-multiply object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
