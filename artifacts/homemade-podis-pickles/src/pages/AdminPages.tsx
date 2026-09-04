import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';

type Variant = { id: string; label: string; price: number; compareAt: number | null; grams: number };
type Offer = { id: string; name: string; type: 'percentage' | 'fixed'; value: number; active: boolean; startsAt: string; endsAt: string | null };
type ManagedProduct = { id: string; name: string; shortName: string; category: string; active: boolean; variants: Variant[]; offers: Offer[] };

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(`/api${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
  const contentType = response.headers.get('content-type') ?? '';
  const body = response.status === 204 ? null : contentType.includes('application/json') ? await response.json() : null;
  if (!body && !response.ok) {
    throw new Error(response.status === 404 ? 'Admin service is not deployed at this address. Redeploy the API artifact.' : `Admin service returned HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(body?.error ?? 'Request failed');
  return body;
}

export function AdminLoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { await api('/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); navigate('/admin'); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to sign in'); }
    finally { setBusy(false); }
  }
  return <main className="grid min-h-[100dvh] place-items-center bg-[#231b18] px-5 py-10 text-[#fff8ed]"><form onSubmit={submit} className="w-full max-w-[430px] rounded-[28px] border border-[#8c6858] bg-[#382722] p-7 shadow-2xl"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f0c47a]">Private workspace</p><h1 className="pp-display mt-3 text-[42px] leading-none">Superadmin sign in</h1><p className="mt-3 text-[13px] leading-6 text-[#ead8c8]/70">Manage the pantry catalog, prices and live offers.</p><label className="mt-8 block text-[11px] font-bold uppercase tracking-wider text-[#ead8c8]/70">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="username" required className="mt-2 w-full rounded-xl border border-[#8c6858] bg-[#231b18] px-3 py-3 text-sm text-white outline-none" /></label><label className="mt-4 block text-[11px] font-bold uppercase tracking-wider text-[#ead8c8]/70">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-[#8c6858] bg-[#231b18] px-3 py-3 text-sm text-white outline-none" /></label>{error && <p className="mt-4 rounded-xl bg-[#71352d] px-3 py-2 text-xs">{error}</p>}<button disabled={busy} className="mt-6 w-full rounded-xl bg-[#f0c47a] px-4 py-3 text-sm font-bold text-[#382722] disabled:opacity-50">{busy ? 'Signing in...' : 'Enter workspace'}</button><Link href="/" className="mt-5 block text-center text-xs text-[#ead8c8]/60">Back to storefront</Link></form></main>;
}

export function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [error, setError] = useState('');
  const [offerProductId, setOfferProductId] = useState('');
  const [offerName, setOfferName] = useState('');
  const [offerValue, setOfferValue] = useState('10');
  const [offerType, setOfferType] = useState<'percentage' | 'fixed'>('percentage');

  useEffect(() => { api('/admin/products').then(setProducts).catch(() => navigate('/admin/login')); }, [navigate]);
  async function updatePrice(variant: Variant, value: string) {
    const price = Number(value); if (!Number.isInteger(price) || price < 0) return;
    try { const updated = await api(`/admin/variants/${variant.id}`, { method: 'PATCH', body: JSON.stringify({ price }) }); setProducts((current) => current.map((product) => ({ ...product, variants: product.variants.map((item) => item.id === variant.id ? updated : item) }))); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update price'); }
  }
  async function createOffer(event: FormEvent) {
    event.preventDefault(); if (!offerProductId || !offerName) return;
    try { const offer = await api(`/admin/products/${offerProductId}/offers`, { method: 'POST', body: JSON.stringify({ name: offerName, type: offerType, value: Number(offerValue), startsAt: new Date().toISOString(), active: true }) }); setProducts((current) => current.map((product) => product.id === offerProductId ? { ...product, offers: [...product.offers, offer] } : product)); setOfferName(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create offer'); }
  }
  async function logout() { await api('/admin/auth/logout', { method: 'POST' }); navigate('/admin/login'); }
  return <main className="min-h-[100dvh] bg-[#f5eee3] text-[#351b17]"><header className="border-b border-[#dfcebb] bg-[#fffaf2] px-5 py-5 md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a9472f]">Superadmin workspace</p><h1 className="pp-display mt-1 text-3xl font-semibold">Pantry control</h1></div><button onClick={logout} className="rounded-full border border-[#dfcebb] px-4 py-2 text-xs font-bold text-[#6d2925]">Sign out</button></div></header><div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[1fr_320px] md:px-10">{error && <p className="md:col-span-2 rounded-xl bg-[#f5dbc9] px-4 py-3 text-xs text-[#6d2925]">{error}</p>}<section><div className="mb-4 flex items-end justify-between"><div><p className="text-[11px] font-bold uppercase tracking-widest text-[#a9472f]">Live catalog</p><h2 className="pp-display mt-1 text-3xl font-semibold">Products & variants</h2></div><span className="text-xs font-bold text-[#806b5b]">{products.length} products</span></div><div className="space-y-3">{products.map((product) => <article key={product.id} className="rounded-2xl border border-[#dfcebb] bg-[#fffaf2] p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold">{product.name}</h3><p className="mt-1 text-xs text-[#806b5b]">{product.category} · {product.active ? 'Visible' : 'Hidden'}</p></div><span className="rounded-full bg-[#e6ebd9] px-2 py-1 text-[10px] font-bold text-[#50664b]">{product.offers.length} offers</span></div><div className="mt-4 space-y-2">{product.variants.map((variant) => <label key={variant.id} className="flex items-center justify-between rounded-xl bg-[#f5eee3] px-3 py-2 text-xs"><span>{variant.label} · {variant.grams} g</span><span className="flex items-center gap-1 font-bold">₹<input defaultValue={variant.price} onBlur={(event) => updatePrice(variant, event.target.value)} type="number" min="0" className="w-20 rounded-lg border border-[#dfcebb] bg-[#fffaf2] px-2 py-1 text-right outline-none" /></span></label>)}</div>{product.offers.length > 0 && <div className="mt-3 border-t border-[#ead8c8] pt-3 text-xs text-[#65804f]">{product.offers.map((offer) => <p key={offer.id}>{offer.name}: {offer.type === 'percentage' ? `${offer.value}% off` : `₹${offer.value} off`} {offer.active ? '· live' : '· paused'}</p>)}</div>}</article>)}</div></section><aside className="h-fit rounded-2xl border border-[#dfcebb] bg-[#fffaf2] p-5"><p className="text-[10px] font-bold uppercase tracking-widest text-[#a9472f]">Promotion</p><h2 className="pp-display mt-2 text-2xl font-semibold">Add a live offer</h2><form onSubmit={createOffer} className="mt-5 space-y-3"><select value={offerProductId} onChange={(event) => setOfferProductId(event.target.value)} required className="w-full rounded-xl border border-[#dfcebb] bg-[#fffaf2] px-3 py-3 text-xs"><option value="">Choose product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.shortName}</option>)}</select><input value={offerName} onChange={(event) => setOfferName(event.target.value)} required placeholder="Offer name" className="w-full rounded-xl border border-[#dfcebb] bg-[#fffaf2] px-3 py-3 text-xs" /><div className="flex gap-2"><select value={offerType} onChange={(event) => setOfferType(event.target.value as 'percentage' | 'fixed')} className="rounded-xl border border-[#dfcebb] bg-[#fffaf2] px-3 py-3 text-xs"><option value="percentage">Percent</option><option value="fixed">Fixed rupees</option></select><input value={offerValue} onChange={(event) => setOfferValue(event.target.value)} type="number" min="1" required className="min-w-0 flex-1 rounded-xl border border-[#dfcebb] bg-[#fffaf2] px-3 py-3 text-xs" /></div><button className="w-full rounded-xl bg-[#6d2925] px-4 py-3 text-xs font-bold text-[#fff8ed]">Publish offer</button></form><p className="mt-4 text-[11px] leading-5 text-[#806b5b]">Published offers are returned by the live catalog endpoint immediately.</p></aside></div></main>;
}