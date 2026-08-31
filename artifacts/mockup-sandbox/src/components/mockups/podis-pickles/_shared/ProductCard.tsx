import { Heart, Plus, Star } from "lucide-react";

import { formatPrice, type Product } from "./data";
import { HeartButton } from "./AppShell";

const previewPath = (page: string) => `/__mockup/preview/podis-pickles/${page}`;

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <article className={`group relative ${compact ? "w-[178px] shrink-0" : ""}`}>
      <a href={`${previewPath("ProductDetail")}?product=${product.id}`} className="block">
        <div className={`relative overflow-hidden rounded-[22px] bg-[#ead8b8] ${compact ? "h-[178px]" : "aspect-square"}`}>
          <img src={product.image} alt={product.name} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 rounded-full bg-[#fffaf2]/90 px-2.5 py-1 text-[10px] font-bold text-[#6d2925]">{product.tags[0]}</span>
        </div>
        <div className="px-1 pt-3">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#a9472f]">{product.category}</p>
          <h3 className="mt-1 text-[14px] font-bold leading-[1.2] text-[#351b17]">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[14px] font-bold">{formatPrice(product.price)}</span>
            {product.compareAt && <span className="text-[11px] text-[#a99482] line-through">{formatPrice(product.compareAt)}</span>}
            <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-[#806b5b]"><Star size={12} fill="#d5963c" strokeWidth={0} /> {product.rating}</span>
          </div>
        </div>
      </a>
      {compact && <button aria-label={`Quick add ${product.name}`} className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-[#6d2925] text-[#fff8ed] shadow-md transition-transform active:scale-90"><Plus size={16} /></button>}
    </article>
  );
}