import { ArrowLeft, ChevronRight, Heart, Home, Search, ShoppingBag, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import "../_group.css";

type ShellProps = {
  children: ReactNode;
  active?: "home" | "discover" | "bag" | "account";
  back?: boolean;
  title?: string;
  right?: ReactNode;
  noNav?: boolean;
};

const previewPath = (page: string) => `/__mockup/preview/podis-pickles/${page}`;

export function AppShell({ children, active, back, title, right, noNav }: ShellProps) {
  return (
    <div className="podis-pickles pp-grain min-h-[100dvh]">
      <div className="mx-auto min-h-[100dvh] w-full max-w-[430px] overflow-hidden bg-[#f5eee3] shadow-[0_0_40px_rgba(53,27,23,.10)]">
        {title && (
          <header className="flex h-[68px] items-center justify-between border-b border-[#e7d8c5] bg-[#f5eee3]/95 px-5 backdrop-blur">
            {back ? (
              <a href={previewPath("Home")} aria-label="Go back" className="grid h-9 w-9 place-items-center rounded-full border border-[#d8c5ae] text-[#6d2925]">
                <ArrowLeft size={18} />
              </a>
            ) : <div className="w-9" />}
            <h1 className="pp-display text-[23px] font-semibold tracking-[-.03em]">{title}</h1>
            {right ?? <div className="w-9" />}
          </header>
        )}
        <main className={noNav ? "" : "pp-safe-bottom"}>{children}</main>
        {!noNav && <BottomNav active={active} />}
      </div>
    </div>
  );
}

function BottomNav({ active }: { active?: ShellProps["active"] }) {
  const items = [
    { id: "home" as const, label: "Home", icon: Home, href: previewPath("Home") },
    { id: "discover" as const, label: "Discover", icon: Search, href: previewPath("Discover") },
    { id: "bag" as const, label: "Bag", icon: ShoppingBag, href: previewPath("Cart") },
    { id: "account" as const, label: "You", icon: UserRound, href: previewPath("Welcome") },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 flex h-[76px] w-full max-w-[430px] -translate-x-1/2 items-center justify-around border-t border-[#e7d8c5] bg-[#fffaf2]/95 px-4 backdrop-blur-md">
      {items.map(({ id, label, icon: Icon, href }) => (
        <a key={id} href={href} className={`flex min-w-[64px] flex-col items-center gap-1 text-[10px] font-semibold tracking-[.02em] transition-transform active:scale-95 ${active === id ? "text-[#6d2925]" : "text-[#9b897a]"}`}>
          <span className={`grid h-8 w-8 place-items-center rounded-full ${active === id ? "bg-[#ead8b8]" : ""}`}><Icon size={18} strokeWidth={active === id ? 2.4 : 1.8} /></span>
          {label}
        </a>
      ))}
    </nav>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${light ? "text-[#fff8ed]" : "text-[#6d2925]"}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-[11px] border ${light ? "border-[#e6c68f] bg-[#dd9b3d]/20" : "border-[#b96342] bg-[#ead8b8]"}`}>
        <span className="h-4 w-4 rotate-45 rounded-[5px] border-2 border-current" />
      </span>
      <span>
        <span className="block text-[15px] font-bold leading-none tracking-[-.04em]">homemade</span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[.22em] opacity-80">podis & pickles</span>
      </span>
    </div>
  );
}

export function SectionLabel({ children, action, href }: { children: ReactNode; action?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="pp-display text-[23px] font-semibold tracking-[-.035em]">{children}</h2>
      {action && href && <a href={href} className="flex items-center gap-1 text-[12px] font-bold text-[#a9472f]">{action}<ChevronRight size={14} /></a>}
    </div>
  );
}

export function Toast({ children }: { children: ReactNode }) {
  return <div className="fixed bottom-[91px] left-1/2 z-50 w-[calc(100%-36px)] max-w-[390px] -translate-x-1/2 rounded-2xl bg-[#351b17] px-4 py-3 text-center text-[13px] font-semibold text-[#fff8ed] shadow-xl">{children}</div>;
}

export function HeartButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return <button aria-label={active ? "Remove from wishlist" : "Add to wishlist"} onClick={onClick} className={`grid h-10 w-10 place-items-center rounded-full border transition-transform active:scale-90 ${active ? "border-[#dcb08b] bg-[#f5dbc9] text-[#a9472f]" : "border-[#dfcebb] bg-[#fffaf2]/80 text-[#806b5b]"}`}><Heart size={18} fill={active ? "currentColor" : "none"} /></button>;
}