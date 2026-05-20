import Link from "next/link";
import { Bell, LogOut, Menu, UserRound } from "lucide-react";
import { Brand } from "./brand";

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Simulados", "/simulados"],
  ["Planos", "/planos"],
  ["Histórico", "/dashboard"],
];

export function AppShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen text-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061421]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Brand />
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12" aria-label="Notificações">
              <Bell size={18} />
            </button>
            <button className="hidden h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-bold text-slate-200 transition hover:bg-white/12 sm:inline-flex">
              <UserRound size={17} /> Ana
            </button>
            <Link href="/login" className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-[#061421]" aria-label="Sair">
              <LogOut size={18} />
            </Link>
            <button className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 md:hidden" aria-label="Menu">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <p className="font-bold uppercase tracking-[0.22em] text-emerald-300">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-normal text-white sm:text-5xl">{title}</h1>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
