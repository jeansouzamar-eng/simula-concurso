import { Brand } from "./brand";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12 text-slate-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,211,142,0.22),transparent_32rem)]" />
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl">
        <Brand />
        <div className="mt-10">
          <h1 className="text-3xl font-black tracking-normal text-white">{title}</h1>
          <p className="mt-3 leading-7 text-slate-300">{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
