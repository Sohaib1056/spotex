import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/catalog/types';
import type { CatalogText } from '@/lib/catalog/text';

export function ProductCard({ product, text }: { product: Product; text: CatalogText }) {
  const name = text.productName(product);
  return (
    <Link
      href={{ pathname: '/products/[category]/[product]', params: { category: product.category, product: product.slug } }}
      className="group flex flex-col overflow-hidden rounded-[18px] border-[1.5px] border-line bg-white transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand"
    >
      <div className="relative aspect-[4/5] bg-soft">
        <Image
          src={product.images[0]}
          alt={`${name} ${product.code}`}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
          className="photo-multiply object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 py-3.5">
        <span className="text-[10.5px] font-extrabold tracking-[0.16em] text-brand">{product.code}</span>
        <span className="display text-2xl text-ink">{name}</span>
        <span className="text-xs leading-snug">{text.summary(product)}</span>
      </div>
    </Link>
  );
}
