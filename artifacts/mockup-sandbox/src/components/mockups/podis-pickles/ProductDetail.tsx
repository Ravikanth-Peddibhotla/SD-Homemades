import { Check, ChevronDown, Clock3, Minus, Plus, ShieldCheck, Star, Truck, Wheat } from "lucide-react";
import { useState } from "react";

import { AppShell, HeartButton, Toast } from "./_shared/AppShell";
import { formatPrice, products } from "./_shared/data";

export function ProductDetail() {
  const id = new URLSearchParams(window.location.search).get("product") ?? "nalla-karam";
  const product = products.find((item) => item.id === id) ?? products[0];
  const [weight, setWeight] = useState("250 g");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const weightPrice = weight === "500 g" ? product.price + 160 : weight === "1 kg" ? product.price + 420 : product.price;
  return (
    <AppShell noNav title="Product story" back right={<HeartButton active={wishlisted} onClick={() => setWishlisted((value) => !value)} />}>
      <div className="pp-safe-bottom">
        <div className="relative h-[300px] overflow-hidden bg-[#d2a76d]">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#351b17]/25 to-transparent" />
          <span className="absolute bottom-4 left-5 rounded-full bg-[#fffaf2]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-[#6d2925]">{product.tags[0]}</span>
        </div>
        <div className="px-5 pt-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#a9472f]">{product.category} · small batch</p><h1 className="pp-display mt-2 text-[32px] font-semibold leading-[1] tracking-[-.045em]">{product.name}</h1></div><div className="flex items-center gap-1 rounded-full bg-[#ead8b8] px-2.5 py-1.5 text-[11px] font-bold text-[#6d2925]"><Star size={12} fill="currentColor" /> {product.rating}</div></div>
          <p className="mt-4 text-[13px] leading-[1.6] text-[#806b5b]">{product.description}</p>
          <div className="mt-5 flex items-center gap-4 border-y border-[#e7d8c5] py-4 text-[10px] font-bold uppercase tracking-[.08em] text-[#806b5b]"><span className="flex items-center gap-1.5"><Wheat size={15} className="text-[#a9472f]" /> Vegetarian</span><span className="flex items-center gap-1.5"><Clock3 size={15} className="text-[#a9472f]" /> {product.shelf.split("·")[0]}</span><span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-[#a9472f]" /> Clean label</span></div>
          <div className="mt-6"><div className="flex items-center justify-between"><h2 className="text-[12px] font-bold uppercase tracking-[.13em] text-[#806b5b]">Choose your jar</h2><span className="text-[12px] font-bold text-[#a9472f]">{formatPrice(weightPrice * quantity)}</span></div><div className="mt-3 flex gap-2">{["250 g", "500 g", "1 kg"].map((item) => <button key={item} onClick={() => setWeight(item)} className={`flex-1 rounded-xl border py-3 text-[12px] font-bold ${weight === item ? "border-[#6d2925] bg-[#ead8b8] text-[#6d2925]" : "border-[#dfcebb] bg-[#fffaf2] text-[#806b5b]"}`}>{item}</button>)}</div></div>
          <div className="mt-6 flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.13em] text-[#806b5b]">How spicy?</p><div className="mt-2 flex gap-1">{[1, 2, 3].map((item) => <span key={item} className={`h-2 w-7 rounded-full ${item <= (product.heat === "gentle" ? 1 : product.heat === "medium" ? 2 : 3) ? "bg-[#a9472f]" : "bg-[#e5d8ca]"}`} />)}</div></div><div className="flex items-center gap-3 rounded-full border border-[#dfcebb] bg-[#fffaf2] p-1"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-7 w-7 place-items-center rounded-full text-[#6d2925]"><Minus size={14} /></button><span className="w-3 text-center text-[13px] font-bold">{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#ead8b8] text-[#6d2925]"><Plus size={14} /></button></div></div>
          <details className="mt-7 border-t border-[#e7d8c5] py-4"><summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-bold">What’s inside <ChevronDown size={16} /></summary><p className="mt-3 text-[12px] leading-[1.6] text-[#806b5b]">{product.ingredients.join(" · ")}. No preservatives, no artificial colours.</p></details>
          <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#dfe3cf] px-3 py-3 text-[11px] font-semibold text-[#50664b]"><Truck size={16} /> Fresh delivery in 35–45 min to your area</div>
          <button onClick={() => setAdded(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d2925] py-4 text-[13px] font-bold text-[#fff8ed] shadow-[0_8px_20px_rgba(109,41,37,.18)] transition-transform active:scale-[.98]">{added ? <><Check size={17} /> Added to your bag</> : <>Add to bag · {formatPrice(weightPrice * quantity)}</>}</button>
          {added && <a href="/__mockup/preview/podis-pickles/Cart" className="mt-3 block text-center text-[12px] font-bold text-[#a9472f]">Review your bag</a>}
        </div>
      </div>
      {added && <Toast>{product.shortName} is tucked into your bag</Toast>}
    </AppShell>
  );
}