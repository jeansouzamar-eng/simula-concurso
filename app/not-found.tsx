import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-slate-50">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.07] p-8 text-center shadow-2xl backdrop-blur-xl">
        <SearchX className="mx-auto text-emerald-300" size={44} />
        <h1 className="mt-6 text-4xl font-black text-white">Pagina nao encontrada</h1>
        <p className="mt-3 leading-7 text-slate-300">
          O endereco acessado nao existe ou foi movido.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 font-black text-[#061421] transition hover:-translate-y-0.5 hover:bg-emerald-300"
        >
          <ArrowLeft size={18} /> Voltar ao inicio
        </Link>
      </section>
    </main>
  );
}
