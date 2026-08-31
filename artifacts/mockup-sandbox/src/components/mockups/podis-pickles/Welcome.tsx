import { ArrowRight, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Show, SignInButton, SignUpButton, useClerk, useUser } from "@clerk/react";

import { AppShell, Wordmark } from "./_shared/AppShell";

const previewPath = (page: string) => `/__mockup/preview/podis-pickles/${page}`;

export function Welcome() {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <AppShell noNav>
      <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#6d2925] px-7 pb-8 pt-8 text-[#fff8ed]">
        <div className="absolute -right-28 top-24 h-72 w-72 rounded-full border border-[#e9b763]/25" />
        <div className="absolute -left-40 bottom-[-90px] h-80 w-80 rounded-full bg-[#a9472f]/70" />
        <div className="relative flex items-center justify-between">
          <Wordmark light />
          <span className="rounded-full border border-[#edc98f]/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.16em] text-[#f3d8a7]">Batch 042</span>
        </div>
        <div className="relative mt-16 grow">
          <p className="pp-rise text-[11px] font-bold uppercase tracking-[.25em] text-[#eec37d]">From our kitchen to yours</p>
          <h1 className="pp-display pp-rise pp-rise-2 mt-4 max-w-[330px] text-[52px] font-semibold leading-[.95] tracking-[-.06em]">A little jar<br />of <i className="font-normal text-[#f3c77e]">home.</i></h1>
          <p className="pp-rise pp-rise-3 mt-6 max-w-[280px] text-[15px] leading-[1.55] text-[#f7dfc2]/80">Freshly ground podis and sun-cured pickles, made in small batches with ingredients you can pronounce.</p>
          <Show when="signed-out">
            <div className="pp-rise pp-rise-4 mt-12 rounded-[26px] border border-[#f0c47a]/30 bg-[#fff8ed]/[.09] p-4 backdrop-blur">
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#351b17]/25 p-3 text-[12px] font-bold text-[#fff8ed]">
                <Mail size={15} />
                <span>Email sign-in</span>
                <span className="ml-auto rounded-full bg-[#dbe2c9]/20 px-2 py-1 text-[9px] uppercase tracking-[.12em] text-[#e6edcf]">Secure</span>
              </div>
              <SignInButton mode="modal">
                <button type="button" className="flex w-full items-center justify-between rounded-xl bg-[#fff8ed] px-4 py-3.5 text-left text-[13px] font-bold text-[#6d2925] transition-transform active:scale-[.98]">
                  <span>Continue with email</span>
                  <ArrowRight size={17} />
                </button>
              </SignInButton>
              <p className="mt-3 flex items-center gap-1.5 text-[10px] leading-[1.4] text-[#f7dfc2]/60"><ShieldCheck size={13} /> Your account and session are protected by Clerk.</p>
              <SignUpButton mode="modal">
                <button type="button" className="mt-4 w-full rounded-xl border border-[#f0c47a]/40 py-3 text-[12px] font-bold text-[#fff8ed]">New here? Create an account</button>
              </SignUpButton>
              <p className="mt-3 text-[10px] leading-[1.4] text-[#f7dfc2]/45">Phone OTP can be added later with a dedicated SMS provider.</p>
            </div>
          </Show>
          <Show when="signed-in">
            <div className="pp-rise pp-rise-4 mt-12 rounded-[26px] border border-[#f0c47a]/30 bg-[#fff8ed]/[.09] p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ead8b8] text-[#6d2925]"><UserRound size={20} /></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#f3d8a7]">Welcome back</p>
                  <p className="truncate text-[14px] font-bold text-[#fff8ed]">{user?.firstName || user?.primaryEmailAddress?.emailAddress || "Pantry friend"}</p>
                </div>
              </div>
              <a href={previewPath("Home")} className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#fff8ed] px-4 py-3.5 text-[13px] font-bold text-[#6d2925]">Start shopping <ArrowRight size={17} /></a>
              <button type="button" onClick={() => void signOut()} className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-[11px] font-bold text-[#f7dfc2]/70"><LogOut size={14} /> Sign out</button>
            </div>
          </Show>
        </div>
        <p className="relative mt-8 text-center text-[10px] font-semibold tracking-[.04em] text-[#f7dfc2]/55">No preservatives · No artificial colours · Just good food</p>
      </div>
    </AppShell>
  );
}