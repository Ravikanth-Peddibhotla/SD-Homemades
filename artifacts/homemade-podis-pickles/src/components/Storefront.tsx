import { ArrowLeft, ArrowUpRight, ChevronRight, Heart, Home, Plus, Search, ShoppingBag, Star, UserRound } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { ReactNode } from 'react';
import { SignInButton, SignUpButton, Show, useClerk, useUser } from '@clerk/react';
import type { Product } from '@/lib/store';
import { formatPrice, useStore } from '@/lib/store';

export function Wordmark({ light = false }: { light?: boolean }) {
  return <div className={`flex items-center gap-2.5 ${light ? 'text-[#fff8ed]' : 'text-[#6d2925]'}`}>
    <span className={`grid h-10 w-10 place-items-center rounded-[12px] border ${light ? 'border-[#e6c68f] bg-[#dd9b3d]/20' : 'border-[#b96342] bg-[#ead8b8]'}`}><span className="h-4 w-4 rotate-45 rounded-[5px] border-2 border-current" /></span>
    <span><span className="block text-[15px] font-bold leading-none tracking-[-.04em]">homemade</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.22em] opacity-80">podis & pickles</span></span>
  </div>;
}

export function AppShell({ children, active, title, back = false, right, noNav = false }: { children: ReactNode; active?: 'home' | 'discover' | 'bag' | 'account'; title?: string; back?: boolean; right?: ReactNode; noNav?: boolean }) {
  const nav = [
    { id: 'home' as const, label: 'Home', icon: Home, href: '/' },
    { id: 'discover' as const, label: 'Discover', icon: Search, href: '/discover' },
    { id: 'bag' as const, label: 'Bag', icon: ShoppingBag, href: '/cart' },
    { id: 'account' as const, label: 'You', icon: UserRound, href: '/account' },
  ];
  const { bagCount } = useStore();
  return <div className="podis-pickles pp-grain min-h-[100dvh]">
    <div className="mx-auto min-h-[100dvh] w-full max-w-[1320px] overflow-hidden bg-[#f5eee3] shadow-[0_0_40px_rgba(53,27,23,.08)]">
      {!noNav && <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-[#e7d8c5] bg-[#f5eee3]/95 px-5 backdrop-blur md:px-10">
        <Link href="/" data-testid="link-wordmark" className="pp-focus"><Wordmark /></Link>
        <nav className="hidden items-center gap-8 text-[12px] font-bold text-[#806b5b] md:flex">
          {nav.slice(0, 2).map(({ id, label, href }) => <Link key={id} href={href} data-testid={`link-desktop-${id}`} className={`pp-focus transition-colors hover:text-[#6d2925] ${active === id ? 'text-[#6d2925]' : ''}`}>{label}</Link>)}
          <Link href="/#story" data-testid="link-desktop-story" className="pp-focus transition-colors hover:text-[#6d2925]">Our kitchen</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/discover" aria-label="Search the pantry" data-testid="link-search" className="pp-focus grid h-10 w-10 place-items-center rounded-full border border-[#decdb9] bg-[#fffaf2] text-[#6d2925]"><Search size={18} /></Link>
          <Link href="/cart" aria-label="Shopping bag" data-testid="link-cart" className="pp-focus relative grid h-10 w-10 place-items-center rounded-full bg-[#6d2925] text-[#fff8ed]"><ShoppingBag size={17} />{bagCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#f0c47a] px-1 text-[9px] font-bold text-[#351b17]">{bagCount}</span>}</Link>
        </div>
      </header>}
      {title && <div className="flex h-[66px] items-center justify-between border-b border-[#e7d8c5] px-5 md:hidden">{back ? <Link href="/" aria-label="Go back" data-testid="link-back" className="pp-focus grid h-9 w-9 place-items-center rounded-full border border-[#d8c5ae] text-[#6d2925]"><ArrowLeft size={18} /></Link> : <div className="w-9" />}<h1 className="pp-display text-[23px] font-semibold tracking-[-.03em]">{title}</h1>{right ?? <div className="w-9" />}</div>}
      <main className={noNav ? '' : 'pp-safe-bottom'}>{children}</main>
      {!noNav && <nav className="fixed bottom-0 left-1/2 z-40 flex h-[78px] w-full max-w-[1320px] -translate-x-1/2 items-center justify-around border-t border-[#e7d8c5] bg-[#fffaf2]/95 px-4 backdrop-blur-md md:hidden">
        {nav.map(({ id, label, icon: Icon, href }) => <Link key={id} href={href} data-testid={`link-nav-${id}`} className={`pp-focus flex min-w-[64px] flex-col items-center gap-1 text-[10px] font-semibold ${active === id ? 'text-[#6d2925]' : 'text-[#9b897a]'}`}><span className={`relative grid h-8 w-8 place-items-center rounded-full ${active === id ? 'bg-[#ead8b8]' : ''}`}><Icon size={18} strokeWidth={active === id ? 2.4 : 1.8} />{id === 'bag' && bagCount > 0 && <i className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#a9472f]" />}</span>{label}</Link>)}
      </nav>}
    </div>
  </div>;
}

export function SectionLabel({ children, action, href }: { children: ReactNode; action?: string; href?: string }) {
  return <div className="flex items-center justify-between"><h2 className="pp-display text-[25px] font-semibold tracking-[-.035em]">{children}</h2>{action && href && <Link href={href} data-testid={`link-section-${action.toLowerCase().replaceAll(' ', '-')}`} className="pp-focus flex items-center gap-1 text-[12px] font-bold text-[#a9472f]">{action}<ChevronRight size={14} /></Link>}</div>;
}

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { wishlist, toggleWishlist, addToBag } = useStore();
  const wished = wishlist.includes(product.id);
  return <article data-testid={`card-product-${product.id}`} className={`group ${compact ? 'w-[172px] shrink-0' : ''}`}>
    <div className="relative overflow-hidden rounded-[22px] border border-[#e2d1bc] bg-[#ead8b8]" style={{ aspectRatio: compact ? '1 / 1.08' : '1 / 1.05' }}>
      <Link href={`/product/${product.id}`} data-testid={`link-product-${product.id}`} className="pp-focus block h-full"><img src={product.image} alt={product.name} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]" /><div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#351b17]/35 to-transparent" /></Link>
      <span className="absolute left-3 top-3 rounded-full bg-[#fffaf2]/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[#6d2925]">{product.tags[0]}</span>
      <button type="button" aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} data-testid={`button-wishlist-${product.id}`} onClick={() => toggleWishlist(product.id)} className={`pp-focus absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur ${wished ? 'bg-[#f3d8c7] text-[#a9472f]' : 'bg-[#fffaf2]/85 text-[#806b5b]'}`}><Heart size={15} fill={wished ? 'currentColor' : 'none'} /></button>
      <button type="button" onClick={() => addToBag(product)} data-testid={`button-add-${product.id}`} className="pp-focus absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#fff8ed] text-[#6d2925] shadow-sm transition-transform hover:scale-105"><Plus size={17} /></button>
    </div>
    <Link href={`/product/${product.id}`} data-testid={`link-name-${product.id}`} className="pp-focus block"><p className="mt-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#a9472f]">{product.category}</p><h3 className="mt-1 text-[13px] font-bold leading-tight">{compact ? product.shortName : product.name}</h3></Link>
    <div className="mt-1 flex items-center justify-between"><span className="text-[13px] font-bold">{formatPrice(product.price)}</span><span className="flex items-center gap-1 text-[10px] font-semibold text-[#806b5b]"><Star size={11} className="text-[#a9472f]" fill="currentColor" />{product.rating}</span></div>
  </article>;
}

export function Toast({ children }: { children: ReactNode }) {
  return <div role="status" data-testid="status-toast" className="fixed bottom-[94px] left-1/2 z-50 w-[calc(100%-36px)] max-w-[390px] -translate-x-1/2 rounded-2xl bg-[#351b17] px-4 py-3 text-center text-[13px] font-semibold text-[#fff8ed] shadow-xl">{children}</div>;
}

export function AuthGate({ children, title = 'Sign in to shop the pantry.' }: { children: ReactNode; title?: string }) {
  return <><Show when="signed-in">{children}</Show><Show when="signed-out"><div className="flex min-h-[calc(100dvh-72px)] items-center justify-center bg-[#6d2925] px-6 py-12 text-[#fff8ed]"><div className="w-full max-w-[400px] rounded-[28px] border border-[#f0c47a]/30 bg-[#fff8ed]/[.09] p-7 text-center backdrop-blur"><img src="/logo.svg" alt="Homemade Podis and Pickles" className="mx-auto h-16 w-16 rounded-2xl" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[.24em] text-[#eec37d]">A little jar of home</p><h1 className="pp-display mt-3 text-[34px] font-semibold leading-none">{title}</h1><p className="mt-4 text-[14px] leading-6 text-[#f7dfc2]/75">Your bag, saved favourites, and delivery details stay with you.</p><SignInButton mode="modal"><button type="button" data-testid="button-sign-in-gate" className="pp-focus mt-7 w-full rounded-2xl bg-[#fff8ed] px-5 py-4 text-[13px] font-bold text-[#6d2925]">Sign in securely</button></SignInButton><SignUpButton mode="modal"><button type="button" data-testid="button-sign-up-gate" className="pp-focus mt-3 w-full rounded-2xl border border-[#f0c47a]/50 px-5 py-4 text-[13px] font-bold text-[#fff8ed]">Create an account</button></SignUpButton><p className="mt-5 text-[10px] text-[#f7dfc2]/55">Secure authentication powered by Clerk</p></div></div></Show></>;
}

export function AccountContent() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();
  return <AuthGate><AppShell active="account" title="You"><div className="mx-auto max-w-3xl px-5 pb-14 pt-7 md:px-10 md:pt-12"><div className="rounded-[28px] bg-[#6d2925] p-6 text-[#fff8ed] md:p-9"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-full bg-[#ead8b8] text-[#6d2925]"><UserRound size={24} /></div><div><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#f3d8a7]">Welcome back</p><h1 data-testid="text-account-name" className="pp-display mt-1 text-3xl font-semibold">{user?.firstName || user?.primaryEmailAddress?.emailAddress || 'Pantry friend'}</h1></div></div><p className="mt-6 text-[13px] leading-6 text-[#f7dfc2]/75">Your favourites and delivery details live here, ready for the next comfort-food emergency.</p></div><div className="mt-6 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#e7d8c5] bg-[#fffaf2] p-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a9472f]">This season</p><p className="pp-display mt-2 text-2xl font-semibold">Fresh batches, often.</p><p className="mt-2 text-[12px] leading-5 text-[#806b5b]">Small-batch jars are made throughout the week, then sent out while they still taste like the kitchen.</p></div><div className="rounded-2xl border border-[#d6d6b9] bg-[#dfe3cf] p-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#50664b]">Saved jars</p><p className="pp-display mt-2 text-2xl font-semibold text-[#34472e]">Your pantry shelf</p><p className="mt-2 text-[12px] leading-5 text-[#50664b]">Wishlist something from Discover to keep it close.</p><Link href="/discover" data-testid="link-account-discover" className="pp-focus mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-[#34472e]">Browse jars <ArrowUpRight size={14} /></Link></div></div><button type="button" data-testid="button-sign-out" onClick={() => { void signOut({ redirectUrl: '/' }); setLocation('/'); }} className="pp-focus mt-8 flex items-center gap-2 text-[12px] font-bold text-[#a9472f]"><ArrowLeft size={15} /> Sign out of account</button></div></AppShell></AuthGate>;
}