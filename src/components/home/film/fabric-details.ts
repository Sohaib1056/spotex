import type { CSSProperties } from 'react';

/**
 * Close-ups shown one by one in the Fabric scene's detail card. Each one is either its own
 * HD photo (`src`) or a tile cut from the composite detail photo (`tile`, pixels of that photo).
 * Names live in messages → Film.fabric.details.<key>.
 */
const COMPOSITE = { src: '/products/details/si-jju-1001-details.webp', w: 1672, h: 941 };

type Tile = { x: number; y: number; w: number; h: number };
export type FabricDetail = { key: 'label' | 'embroidery' | 'fabric' | 'belt' | 'drawstring' | 'pants' } & (
  | { src: string; tile?: never }
  | { tile: Tile; src?: never }
);

export const FABRIC_DETAILS: FabricDetail[] = [
  { key: 'label', src: '/products/details/collar-label.webp' },
  { key: 'embroidery', src: '/products/details/chest-embroidery.webp' },
  { key: 'fabric', tile: { x: 1160, y: 15, w: 498, h: 293 } },
  { key: 'belt', tile: { x: 1160, y: 322, w: 498, h: 308 } },
  { key: 'drawstring', tile: { x: 668, y: 643, w: 477, h: 281 } },
  { key: 'pants', tile: { x: 1160, y: 643, w: 498, h: 281 } },
];

/**
 * Background that fills a square card with the centre of one composite tile
 * (like object-fit: cover), a few px inside the tile so its rounded white edge never shows.
 */
export function tileCover(tile: Tile): CSSProperties {
  const inset = 10;
  const side = Math.min(tile.w, tile.h) - inset * 2;
  const x = tile.x + tile.w / 2 - side / 2;
  const y = tile.y + tile.h / 2 - side / 2;
  const sizeX = COMPOSITE.w / side;
  const sizeY = COMPOSITE.h / side;
  const pos = (start: number, total: number, size: number) => ((-(start / total) * size) / (1 - size)) * 100;
  return {
    backgroundImage: `url(${COMPOSITE.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${sizeX * 100}% ${sizeY * 100}%`,
    backgroundPosition: `${pos(x, COMPOSITE.w, sizeX)}% ${pos(y, COMPOSITE.h, sizeY)}%`,
  };
}
