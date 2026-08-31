import { ArrowLeft, Check, ChevronRight, CreditCard, LockKeyhole, MapPin, Plus, Smartphone, WalletCards } from "lucide-react";
import { useState } from "react";

import { AppShell } from "./_shared/AppShell";
import { formatPrice, products } from "./_shared/data";

export function Checkout() {
  const [address, setAddress] = useState("home");
  const [payment, setPayment] = useState<"upi" | "card">("upi");
  const [confirmed, setConfirmed] = useState(false);
  const subtotal = products[0].price + products[1].price;
  const tax = Math.round(subtotal * .05);
  const total = subtotal + tax;
  if (confirmed) return (
    <AppShell noNav>
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#6d2925] px-7 text-center text-[#fff8ed]">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#f0c47a] text-[#6d2925]"><Check size={38} strokeWidth={2.5} /></div>
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[.22em] text-[#f0c47a]">Order tucked in</p>
        <h1 className="pp-display mt-3 text-[46px] font-semibold leading-[.95] tracking-[-.06em]">Your kitchen<br /><i className="font-normal text-[#f0c47a]">parcel is coming.</i></h1>
        <p className="mt-5 max-w-[270px] text-[13px] leading-[1.55] text-[#f7dfc2]/75">Order HP0428 is being packed with care and should reach you in 35–45 minutes.</p>
        <div className="mt-8 w-full rounded-2xl border border-[#f0c47a]/25 bg-[#fff8ed]/10 p-4 text-left"><div className="flex justify-between text-[11px]"><span className="text-[#f7dfc2]/60">Delivering to</span><b>Banjara Hills</b></div><div className="mt-3 flex justify-between text-[11px]"><span className="text-[#f7dfc2]/60">Paid securely</span><b>{formatPrice(total)}</b></div></div>
        <a href="/__mockup/preview/podis-pickles/Home" className="mt-8 rounded-full bg-[#fff8ed] px-6 py-3 text-[12px] font-bold text-[#6d2925]">Back to the pantry</a>
      </div>
    </AppShell>
  );
  return (
    <AppShell noNav title="Checkout" back right={<span className="flex items-center gap-1 text-[10px] font-bold text-[#65804f]"><LockKeyhole size={13} /> Secure</span>}>
      <div className="px-5 pb-10 pt-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#65804f]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#d4dfc0]">1</span> Address <span className="mx-1 h-px flex-1 bg-[#d4dfc0]" /><span className="grid h-5 w-5 place-items-center rounded-full bg-[#6d2925] text-[#fff8ed]">2</span> Pay</div>
        <section className="mt-7"><div className="flex items-center justify-between"><h2 className="pp-display text-[24px] font-semibold">Where should we drop it?</h2><button className="flex items-center gap-1 text-[11px] font-bold text-[#a9472f]"><Plus size={14} /> Add new</button></div>
          <div className="mt-4 space-y-3">
            {[
              { id: "home", label: "Home", detail: "12B, Road No. 12 · Banjara Hills, Hyderabad", icon: MapPin },
              { id: "work", label: "Work", detail: "Skyline Towers · Jubilee Hills, Hyderabad", icon: MapPin },
            ].map(({ id, label, detail, icon: Icon }) => <button key={id} onClick={() => setAddress(id)} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${address === id ? "border-[#a9472f] bg-[#f3d8c7]" : "border-[#e7d8c5] bg-[#fffaf2]"}`}><span className={`grid h-8 w-8 place-items-center rounded-full ${address === id ? "bg-[#a9472f] text-[#fff8ed]" : "bg-[#ead8b8] text-[#6d2925]"}`}><Icon size={15} /></span><span className="min-w-0 flex-1"><b className="block text-[12px]">{label}</b><span className="mt-1 block text-[11px] leading-[1.4] text-[#806b5b]">{detail}</span></span><span className={`mt-1 h-4 w-4 rounded-full border-4 ${address === id ? "border-[#6d2925]" : "border-[#d7c6b4]"}`} /></button>)}
          </div>
        </section>
        <section className="mt-8"><h2 className="pp-display text-[24px] font-semibold">Pay your way</h2><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => setPayment("upi")} className={`rounded-2xl border p-4 text-left ${payment === "upi" ? "border-[#a9472f] bg-[#f3d8c7]" : "border-[#e7d8c5] bg-[#fffaf2]"}`}><Smartphone size={19} className="text-[#a9472f]" /><b className="mt-3 block text-[12px]">UPI</b><span className="mt-1 block text-[10px] text-[#806b5b]">GPay, PhonePe</span></button><button onClick={() => setPayment("card")} className={`rounded-2xl border p-4 text-left ${payment === "card" ? "border-[#a9472f] bg-[#f3d8c7]" : "border-[#e7d8c5] bg-[#fffaf2]"}`}><CreditCard size={19} className="text-[#a9472f]" /><b className="mt-3 block text-[12px]">Card</b><span className="mt-1 block text-[10px] text-[#806b5b]">Debit or credit</span></button></div>{payment === "upi" ? <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#dfcebb] bg-[#fffaf2] px-4 py-3"><WalletCards size={16} className="text-[#a9472f]" /><span className="text-[11px] font-semibold text-[#806b5b]">UPI handle will open after review</span><ChevronRight size={15} className="ml-auto text-[#a9472f]" /></div> : <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#dfcebb] bg-[#fffaf2] px-4 py-3"><CreditCard size={16} className="text-[#a9472f]" /><span className="text-[11px] font-semibold text-[#806b5b]">•••• 4821 · saved securely</span><ChevronRight size={15} className="ml-auto text-[#a9472f]" /></div>}</section>
        <section className="mt-8 rounded-2xl border border-[#e7d8c5] bg-[#fffaf2] p-4"><div className="flex items-center justify-between"><h2 className="text-[12px] font-bold uppercase tracking-[.12em] text-[#806b5b]">Order review</h2><a href="/__mockup/preview/podis-pickles/Cart" className="text-[11px] font-bold text-[#a9472f]">Edit bag</a></div><div className="mt-4 space-y-3 text-[12px]"><div className="flex justify-between"><span className="text-[#806b5b]">2 jars</span><b>{formatPrice(subtotal)}</b></div><div className="flex justify-between"><span className="text-[#806b5b]">Delivery</span><b className="text-[#65804f]">Free</b></div><div className="flex justify-between"><span className="text-[#806b5b]">Taxes</span><b>{formatPrice(tax)}</b></div><div className="border-t border-dashed border-[#d7c6b4]" /><div className="flex justify-between text-[16px] font-bold"><span>To pay</span><span>{formatPrice(total)}</span></div></div></section>
        <button onClick={() => setConfirmed(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6d2925] py-4 text-[13px] font-bold text-[#fff8ed] shadow-[0_8px_20px_rgba(109,41,37,.18)]">Place order · {formatPrice(total)} <ArrowLeft className="rotate-180" size={16} /></button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] font-semibold text-[#9b897a]"><LockKeyhole size={12} /> Payments are encrypted and handled securely</p>
      </div>
    </AppShell>
  );
}