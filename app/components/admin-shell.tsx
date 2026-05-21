"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  FileQuestion,
  LayoutDashboard,
  Menu,
  Users,
  Shield,
} from "lucide-react";
import { Brand } from "./brand";
import { LogoutButton } from "./logout-button";

const adminMenu = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Questoes", href: "/admin/questoes", icon: FileQuestion },
  { label: "Simulados", href: "/admin/simulados", icon: ClipboardList },
  { label: "Concursos", href: "/admin/concursos", icon: Shield },
  { label: "Materias", href: "/admin/materias", icon: BookOpen },
  { label: "Bancas", href: "/admin/bancas", icon: Building2 },
  { label: "Usuarios", href: "/admin/usuarios", icon: Users },
];

export function AdminShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen text-slate-50 lg:grid lg:grid-cols-[18rem_1fr]">
      <aside className="border-b border-white/10 bg-[#061421]/90 px-5 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:py-6">
        <div className="flex items-center justify-between lg:block">
          <Brand />
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 lg:hidden" aria-label="Menu admin">
            <Menu size={18} />
          </button>
        </div>

        <div className="mt-8 hidden rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 lg:block">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-[#061421]">
              <BarChart3 size={20} />
            </span>
            <div>
              <p className="text-sm font-black text-white">Admin Center</p>
              <p className="text-xs text-emerald-200">Controle operacional</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {adminMenu.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-max items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-emerald-400 text-[#061421]"
                    : "border border-white/10 bg-white/[0.06] text-slate-300 hover:bg-white/12 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#061421]/85 backdrop-blur-xl">
          <div className="flex items-center justify-between px-5 py-4 lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
                {eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden rounded-lg border border-white/10 bg-white/8 px-4 py-2 sm:block">
                <p className="text-sm font-black text-white">Admin</p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="px-5 py-8 lg:px-8">{children}</div>
      </section>
    </main>
  );
}
