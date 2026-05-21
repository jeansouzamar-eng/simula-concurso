import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export function PublicPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-5 py-12 text-slate-50">
      <section className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-3 font-black text-white">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-[#061421]">
            <GraduationCap size={22} />
          </span>
          Simula Concurso
        </Link>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300 hover:text-emerald-200">
            <ArrowLeft size={16} /> Voltar
          </Link>
          <h1 className="mt-6 text-4xl font-black text-white">{title}</h1>
          <p className="mt-3 leading-7 text-slate-300">{description}</p>
          <div className="mt-8 space-y-5 leading-7 text-slate-200">{children}</div>
        </div>
      </section>
    </main>
  );
}
