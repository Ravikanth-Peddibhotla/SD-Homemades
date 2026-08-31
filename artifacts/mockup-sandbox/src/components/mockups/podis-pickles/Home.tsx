import { ArrowUpRight, Clock3, MapPin, Search, ShoppingBag, Sparkles } from "lucide-react";

import { AppShell, SectionLabel, Wordmark } from "./_shared/AppShell";
import { products } from "./_shared/data";
import { ProductCard } from "./_shared/ProductCard";

const previewPath = (page: string) => `/__mockup/preview/podis-pickles/${page}`;

export function Home() {
  return (
    <AppShell active="home">
      <header className="flex items-center justify-between px-5 pb-3 pt-6">
        <Wordmark />
        <div className="flex items-center gap-2">
          <a href={previewPath("Discover")} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full border border-[#decdb9] bg-[#fffaf2] text-[#6d2925]"><Search size={18} /></a>
          <a href={previewPath("Cart")} aria-label="Shopping bag" className="grid h-10 w-10 place-items-center rounded-full bg-[#6d2925] text-[#fff8ed]"><ShoppingBag size={17} /></a>
        </div>
      </header>
      <div className="px-5 pt-4">
        <button className="flex items-center gap-2 text-left text-[11px] font-bold text-[#806b5b]"><MapPin size={14} className="text-[#a9472f]" /><span>Delivering to <b className="text-[#351b17]">Banjara Hills</b></span><ArrowUpRight size={12} /></button>
      </div>
      <section className="pp-rise relative mx-5 mt-5 h-[315px] overflow-hidden rounded-[28px] bg-[#8b3b2a]">
        <img src="/__mockup/images/podis-hero.jpg" alt="Open parcel of homemade pickles and podis" className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#351b17] via-[#6d2925]/20 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-6 text-[#fff8ed]">
          <span className="mb-3 flex w-fit items-center gap-1.5 rounded-full bg-[#f0c47a] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[#5c281f]"><Sparkles size={12} /> Fresh batch today</span>
          <h1 className="pp-display max-w-[280px] text-[35px] font-semibold leading-[.98] tracking-[-.05em]">The jar that<br /><i className="font-normal text-[#f0c47a]">fixes</i> plain rice.</h1>
          <p className="mt-3 max-w-[260px] text-[12px] leading-[1.45] text-[#f9e7d3]/80">Slow-roasted spices. Bright, honest heat. Packed this morning.</p>
          <a href={`${previewPath("ProductDetail")}?product=nalla-karam`} className="mt-5 flex w-fit items-center gap-2 rounded-full bg-[#fff8ed] px-4 py-2.5 text-[12px] font-bold text-[#6d2925]">Meet Nalla Karam <ArrowUpRight size={15} /></a>
        </div>
      </section>
      <section className="px-5 pt-8">
        <SectionLabel>Shop by mood</SectionLabel>
        <div className="pp-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
          {[
            { name: "The podi shelf", note: "Roasted & nutty", color: "#c67854", href: "Podi" },
            { name: "Pickle weather", note: "Tangy & loud", color: "#788252", href: "Pickle" },
            { name: "Send some love", note: "Ready to gift", color: "#d99a4d", href: "Combo" },
          ].map((item) => (
            <a key={item.name} href={`${previewPath("Discover")}?category=${item.href}`} className="relative h-[112px] w-[150px] shrink-0 overflow-hidden rounded-[20px] p-4 text-[#fff8ed]" style={{ backgroundColor: item.color }}>
              <span className="absolute -right-5 -top-6 h-24 w-24 rounded-full border-[14px] border-[#fff8ed]/15" />
              <span className="relative block text-[14px] font-bold leading-[1.1]">{item.name}</span>
              <span className="relative mt-2 block text-[10px] font-semibold text-[#fff8ed]/75">{item.note}</span>
              <ArrowUpRight className="absolute bottom-3 right-3" size={16} />
            </a>
          ))}
        </div>
      </section>
      <section className="px-5 pt-9">
        <SectionLabel action="See all" href={previewPath("Discover")}>Good this week</SectionLabel>
        <div className="pp-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} compact />)}
        </div>
      </section>
      <section className="mx-5 mt-8 rounded-[24px] border border-[#d6d6b9] bg-[#dfe3cf] p-5">
        <div className="flex items-start justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#50664b]">Why it tastes different</p><h2 className="pp-display mt-2 text-[24px] font-semibold leading-[1] text-[#34472e]">Made like home,<br />not a factory.</h2></div>
          <Clock3 size={22} className="text-[#50664b]" />
        </div>
        <p className="mt-4 max-w-[270px] text-[12px] leading-[1.55] text-[#50664b]">We roast, grind and pack in small batches. Nothing hides behind preservatives or artificial colours.</p>
        <a href={previewPath("Discover")} className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#34472e]">Taste the difference <ArrowUpRight size={14} /></a>
      </section>
    </AppShell>
  );
}