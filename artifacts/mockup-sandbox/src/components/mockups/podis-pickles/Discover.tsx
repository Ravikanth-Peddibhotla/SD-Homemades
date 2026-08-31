import { ChevronDown, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "./_shared/AppShell";
import { products } from "./_shared/data";
import { ProductCard } from "./_shared/ProductCard";

export function Discover() {
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") ?? "All";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [heat, setHeat] = useState<"all" | "gentle" | "fiery">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const results = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    const matchesHeat = heat === "all" || product.heat === heat || (heat === "gentle" && product.heat === "medium");
    return matchesSearch && matchesCategory && matchesHeat;
  }), [category, heat, search]);
  return (
    <AppShell active="discover" title="Discover" back={false} right={<a href="/__mockup/preview/podis-pickles/Cart" className="text-[12px] font-bold text-[#a9472f]">Bag</a>}>
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#dfcebb] bg-[#fffaf2] px-4 py-3">
          <Search size={18} className="text-[#a9472f]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Try “garlic”, “tangy”..." className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:text-[#ad9986]" />
          {search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={15} className="text-[#806b5b]" /></button>}
        </div>
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          {["All", "Podi", "Pickle", "Combo"].map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold transition-colors ${category === item ? "border-[#6d2925] bg-[#6d2925] text-[#fff8ed]" : "border-[#dfcebb] bg-[#fffaf2] text-[#806b5b]"}`}>{item}</button>)}
          <button onClick={() => setFiltersOpen((open) => !open)} className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-bold ${filtersOpen ? "border-[#a9472f] bg-[#f3d8c7] text-[#6d2925]" : "border-[#dfcebb] bg-[#fffaf2] text-[#806b5b]"}`}><SlidersHorizontal size={13} /> Filter</button>
        </div>
        {filtersOpen && <div className="mt-3 rounded-2xl border border-[#dfcebb] bg-[#fffaf2] p-4">
          <div className="flex items-center justify-between"><p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#806b5b]">Heat level</p><Filter size={14} className="text-[#a9472f]" /></div>
          <div className="mt-3 flex gap-2">
            {([["all", "Any heat"], ["gentle", "Gentle"], ["fiery", "Fiery"]] as const).map(([value, label]) => <button key={value} onClick={() => setHeat(value)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${heat === value ? "bg-[#ead8b8] text-[#6d2925]" : "bg-[#f5eee3] text-[#806b5b]"}`}>{label}</button>)}
          </div>
        </div>}
      </div>
      <div className="flex items-baseline justify-between px-5 pb-3 pt-7"><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#a9472f]">The pantry shelf</p><h2 className="pp-display mt-1 text-[29px] font-semibold tracking-[-.045em]">All the good stuff</h2></div><span className="text-[11px] font-semibold text-[#9b897a]">{results.length} jars</span></div>
      {results.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-7 px-5">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mx-5 rounded-[24px] border border-dashed border-[#c9b7a3] bg-[#fffaf2]/60 px-6 py-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#ead8b8] text-[#6d2925]"><Search size={20} /></div><h3 className="pp-display mt-4 text-[23px] font-semibold">No jar by that name</h3><p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-[1.5] text-[#806b5b]">Try a broader search, or clear the filters to see today's batch.</p><button onClick={() => { setSearch(""); setCategory("All"); setHeat("all"); }} className="mt-5 text-[12px] font-bold text-[#a9472f]">Clear all filters <ChevronDown className="inline" size={14} /></button></div>}
    </AppShell>
  );
}