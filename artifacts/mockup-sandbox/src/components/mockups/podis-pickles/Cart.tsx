import { ArrowRight, Check, ChevronDown, Minus, Plus, Tag, Trash2, Truck } from "lucide-react";
import { useState } from "react";

import { AppShell, Toast } from "./_shared/AppShell";
import { formatPrice, products, type Product } from "./_shared/data";

type CartLine = { product: Product; quantity: number; saved: boolean };

export function Cart() {
  const [lines, setLines] = useState<CartLine[]>([
    { product: products[0], quantity: 1, saved: false },
    { product: products[1], quantity: 1, saved: false },
  ]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [toast, setToast] = useState("");
  const active = lines.filter((line) => !line.saved);
  const subtotal = active.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const discount = couponApplied ? 75 : 0;
  const delivery = subtotal >= 599 ? 0 : 39;
  const tax = Math.round((subtotal - discount) * .05);
  const total = subtotal - discount + delivery + tax;
  const updateQty = (id: string, amount: number) => setLines((items) => items.map((line) => line.product.id === id ? { ...line, quantity: Math.max(1, line.quantity + amount) } : line));
  const toggleSaved = (id: string) => {
    setLines((items) => items.map((line) => line.product.id === id ? { ...line, saved: !line.saved } : line));
    setToast("Saved for later");
    window.setTimeout(() => setToast(""), 1800);
  };
  const remove = (id: string) => setLines((items) => items.filter((line) => line.product.id !== id));
  return (
    <AppShell active="bag" title="Your bag" back right={<span className="text-[11px] font-bold text-[#806b5b]">{active.length} items</span>}>
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#d4dfc0] bg-[#e6ebd9] px-4 py-3 text-[11px] font-bold text-[#50664b]"><Truck size={17} /><span>Free delivery unlocked at ₹599</span><span className="ml-auto text-[10px]">35–45 min</span></div>
        <div className="mt-6 space-y-4">
          {lines.map((line) => <div key={line.product.id} className={`relative flex gap-3 rounded-2xl border p-3 transition-opacity ${line.saved ? "border-[#dfcebb] bg-[#f2e8dc]/70 opacity-70" : "border-[#e7d8c5] bg-[#fffaf2]"}`}>
            <img src={line.product.image} alt="" className="h-[82px] w-[82px] rounded-xl object-cover mix-blend-multiply" />
            <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#a9472f]">{line.product.category}</p><h3 className="mt-1 pr-4 text-[13px] font-bold leading-tight">{line.product.shortName}</h3><p className="mt-1 text-[12px] font-bold">{formatPrice(line.product.price)}</p>
              {!line.saved && <div className="mt-2 flex items-center justify-between"><div className="flex items-center gap-2 rounded-full bg-[#f5eee3] p-0.5"><button onClick={() => updateQty(line.product.id, -1)} className="grid h-6 w-6 place-items-center rounded-full text-[#6d2925]"><Minus size={12} /></button><span className="w-4 text-center text-[11px] font-bold">{line.quantity}</span><button onClick={() => updateQty(line.product.id, 1)} className="grid h-6 w-6 place-items-center rounded-full bg-[#ead8b8] text-[#6d2925]"><Plus size={12} /></button></div><button onClick={() => toggleSaved(line.product.id)} className="text-[10px] font-bold text-[#a9472f]">Save for later</button></div>}
              {line.saved && <button onClick={() => toggleSaved(line.product.id)} className="mt-2 text-[10px] font-bold text-[#a9472f]">Move back to bag</button>}
            </div>
            <button onClick={() => remove(line.product.id)} aria-label={`Remove ${line.product.name}`} className="absolute right-3 top-3 text-[#b79f8b]"><Trash2 size={14} /></button>
          </div>)}
        </div>
        {!active.length && <div className="rounded-2xl border border-dashed border-[#c9b7a3] bg-[#fffaf2]/70 px-5 py-10 text-center"><h2 className="pp-display text-[24px] font-semibold">Your bag is resting</h2><p className="mt-2 text-[12px] text-[#806b5b]">Add a jar or move a saved favourite back to checkout.</p><a href="/__mockup/preview/podis-pickles/Discover" className="mt-4 inline-block text-[12px] font-bold text-[#a9472f]">Browse the pantry</a></div>}
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#e7d8c5] bg-[#fffaf2] p-2"><Tag size={16} className="ml-2 text-[#a9472f]" /><input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Have a coupon?" className="min-w-0 flex-1 bg-transparent px-2 text-[12px] font-semibold outline-none placeholder:text-[#ae9987]" /><button onClick={() => { if (coupon.trim()) { setCouponApplied(true); setToast("Coupon HOME75 applied"); window.setTimeout(() => setToast(""), 1800); } }} className="rounded-lg bg-[#ead8b8] px-3 py-2 text-[11px] font-bold text-[#6d2925]">{couponApplied ? <Check size={15} /> : "Apply"}</button></div>
        <div className="mt-7"><h2 className="pp-display text-[22px] font-semibold">Little details</h2><div className="mt-3 space-y-3 text-[12px]"><div className="flex justify-between text-[#806b5b]"><span>Items</span><span className="font-bold text-[#351b17]">{formatPrice(subtotal)}</span></div>{couponApplied && <div className="flex justify-between text-[#65804f]"><span>Home batch offer</span><span className="font-bold">−{formatPrice(discount)}</span></div>}<div className="flex justify-between text-[#806b5b]"><span>Delivery</span><span className="font-bold text-[#351b17]">{delivery ? formatPrice(delivery) : "Free"}</span></div><div className="flex justify-between text-[#806b5b]"><span>Taxes</span><span className="font-bold text-[#351b17]">{formatPrice(tax)}</span></div><div className="my-2 border-t border-dashed border-[#d7c6b4]" /><div className="flex justify-between text-[16px] font-bold"><span>Total</span><span>{formatPrice(total)}</span></div></div></div>
        <a href={active.length ? "/__mockup/preview/podis-pickles/Checkout" : "/__mockup/preview/podis-pickles/Discover"} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d2925] py-4 text-[13px] font-bold text-[#fff8ed]">{active.length ? <>Continue to checkout <ArrowRight size={17} /></> : "Find something delicious"}</a>
      </div>
      {toast && <Toast>{toast}</Toast>}
    </AppShell>
  );
}