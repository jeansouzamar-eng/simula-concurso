"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  FileQuestion,
  GraduationCap,
  LineChart,
  LockKeyhole,
  MessageCircleQuestion,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1600, bounce: 0 });
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(latest).toLocaleString("pt-BR")}${suffix}`;
      }
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const benefits = [
  {
    icon: Target,
    title: "Simulados por banca",
    text: "Treine com provas no estilo Cebraspe, FGV, FCC, Vunesp e outras organizadoras.",
  },
  {
    icon: LineChart,
    title: "Diagnóstico inteligente",
    text: "Veja seus pontos fortes, lacunas e evolução por matéria depois de cada simulado.",
  },
  {
    icon: Clock3,
    title: "Ritmo de prova real",
    text: "Cronômetro, gabarito, revisão e pressão de tempo para chegar preparado no dia.",
  },
  {
    icon: ShieldCheck,
    title: "Plano de estudo guiado",
    text: "Receba prioridades semanais com base no seu desempenho e no edital escolhido.",
  },
];

const steps = [
  ["Escolha o concurso", "Selecione cargo, banca, nível e matérias do seu edital."],
  ["Faça o simulado", "Resolva questões cronometradas em uma experiência parecida com a prova."],
  ["Ajuste a rota", "Use relatórios e recomendações para estudar o que mais aumenta sua nota."],
];

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    description: "Para começar a treinar hoje.",
    features: ["3 simulados mensais", "Ranking geral", "Correção automática"],
    cta: "Criar Conta",
  },
  {
    name: "Premium",
    price: "R$ 29",
    description: "Para estudar com consistência.",
    features: ["Simulados ilimitados", "Relatórios por disciplina", "Plano semanal", "Questões comentadas"],
    cta: "Assinar Premium",
    featured: true,
  },
  {
    name: "Equipe",
    price: "Sob consulta",
    description: "Para cursos e mentores.",
    features: ["Turmas privadas", "Painel de alunos", "Metas compartilhadas"],
    cta: "Fazer Simulado",
  },
];

const faqs = [
  ["Posso simular provas de qualquer banca?", "Sim. A plataforma organiza questões e métricas por banca, cargo, nível e assunto."],
  ["Existe plano gratuito?", "Sim. O plano gratuito permite criar conta e fazer simulados mensais para testar a experiência."],
  ["O Premium renova automaticamente?", "Sim, com cancelamento simples a qualquer momento direto na área da conta."],
  ["Os resultados mostram onde devo estudar?", "Sim. O relatório destaca matérias críticas, tempo por questão e prioridade de revisão."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden text-slate-50">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#061421]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-3 font-bold tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-[#061421]">
              <GraduationCap size={22} />
            </span>
            <span className="text-lg">Simula Concurso</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#beneficios" className="hover:text-white">Benefícios</a>
            <a href="#planos" className="hover:text-white">Planos</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
          <a
            href="/cadastro"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-400 px-4 text-sm font-bold text-[#061421] shadow-[0_16px_40px_rgba(37,211,142,0.25)] transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            Criar Conta <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section className="relative pt-32 sm:pt-36">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(5,20,33,0)_0%,rgba(37,211,142,0.12)_50%,rgba(14,165,233,0.1)_100%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 lg:grid-cols-[0.92fr_1.08fr] lg:pb-24">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200"
            >
              <Sparkles size={16} /> Simulados inteligentes para concursos públicos
            </motion.div>
            <motion.h1 variants={fadeUp} className="max-w-3xl text-5xl font-black leading-[1.03] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Acelere sua aprovação com treino de prova real.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              O Simula Concurso transforma questões, métricas e revisão em um plano claro para você estudar melhor, medir evolução e chegar confiante no dia da prova.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-6 font-bold text-[#061421] shadow-[0_20px_60px_rgba(37,211,142,0.3)] transition hover:-translate-y-1 hover:bg-emerald-300" href="/cadastro">
                Criar Conta <ChevronRight size={18} />
              </a>
              <a className="inline-flex h-13 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/8 px-6 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/12" href="/simulados">
                <PlayCircle size={18} /> Fazer Simulado
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-8 -z-10 rounded-[2rem] bg-emerald-400/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/8 p-2 shadow-2xl backdrop-blur">
              <Image
                src="/hero-dashboard.png"
                alt="Dashboard do Simula Concurso com métricas de desempenho"
                width={1536}
                height={864}
                priority
                className="aspect-[16/10] w-full rounded-xl object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 sm:grid-cols-3"
      >
        {[
          ["questões resolvidas", 480, "k+"],
          ["alunos treinando", 32, "k+"],
          ["bancas mapeadas", 18, "+"],
        ].map(([label, value, suffix]) => (
          <motion.div key={label} variants={fadeUp} className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
            <div className="text-4xl font-black text-emerald-300">
              <AnimatedNumber value={Number(value)} suffix={String(suffix)} />
            </div>
            <p className="mt-2 text-sm font-medium text-slate-300">{label}</p>
          </motion.div>
        ))}
      </motion.section>

      <section id="beneficios" className="bg-slate-50 py-20 text-[#061421]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <p className="font-bold uppercase tracking-[0.22em] text-emerald-600">Benefícios</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Tudo que você precisa para treinar com método.</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <motion.article key={item.title} variants={fadeUp} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <item.icon className="text-emerald-600" size={30} />
                <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-bold uppercase tracking-[0.22em] text-emerald-300">Como funciona</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-white sm:text-5xl">Da escolha do edital ao próximo acerto.</h2>
            <a href="/simulados" className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-5 font-bold text-[#061421] transition hover:-translate-y-1">
              Fazer Simulado <ArrowRight size={18} />
            </a>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-4">
            {steps.map(([title, text], index) => (
              <motion.div key={title} variants={fadeUp} className="flex gap-5 rounded-lg border border-white/10 bg-white/[0.06] p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-400 font-black text-[#061421]">{index + 1}</span>
                <div>
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-300">{text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="planos" className="bg-white py-20 text-[#061421]">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-bold uppercase tracking-[0.22em] text-emerald-600">Planos</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Escolha como quer evoluir.</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <motion.article
                key={plan.name}
                variants={fadeUp}
                className={`rounded-lg border p-7 shadow-sm ${plan.featured ? "border-emerald-400 bg-[#071a2b] text-white shadow-2xl" : "border-slate-200 bg-slate-50"}`}
              >
                {plan.featured && <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1 text-sm font-bold text-[#061421]"><Trophy size={15} /> Mais escolhido</div>}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className={`mt-2 ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{plan.description}</p>
                <div className="mt-7 flex items-end gap-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.price.includes("29") && <span className="pb-1 text-slate-400">/mês</span>}
                </div>
                <ul className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="text-emerald-500" size={18} /> {feature}
                    </li>
                  ))}
                </ul>
                <a className={`mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg font-bold transition hover:-translate-y-1 ${plan.featured ? "bg-emerald-400 text-[#061421] hover:bg-emerald-300" : "bg-[#061421] text-white"}`} href={plan.featured ? "/cadastro" : "/simulados"}>
                  {plan.cta} <ArrowRight size={18} />
                </a>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Passei a enxergar exatamente onde perdia pontos. Em dois meses, minha nota nos simulados subiu muito.", "Mariana Lopes", "Analista Judiciário"],
              ["O modo por banca foi decisivo. A sensação no dia da prova era de que eu já tinha vivido aquele ritmo.", "Rafael Costa", "Técnico Administrativo"],
              ["Uso com meus alunos porque os relatórios poupam horas de correção e deixam a mentoria objetiva.", "Bianca Alves", "Mentora de Concursos"],
            ].map(([quote, name, role]) => (
              <article key={name} className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
                <div className="flex gap-1 text-emerald-300">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div>
                <p className="mt-5 leading-7 text-slate-200">“{quote}”</p>
                <div className="mt-6 font-bold">{name}</div>
                <div className="text-sm text-slate-400">{role}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-slate-50 py-20 text-[#061421]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <MessageCircleQuestion className="text-emerald-600" size={36} />
            <h2 className="mt-4 text-4xl font-black tracking-normal">Perguntas frequentes</h2>
          </div>
          <div className="grid gap-4">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm" open={question.includes("gratuito")}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black">
                  {question}
                  <ChevronRight className="transition group-open:rotate-90" size={18} />
                </summary>
                <p className="mt-4 leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 font-black">
              <FileQuestion className="text-emerald-300" /> Simula Concurso
            </div>
            <p className="mt-2 text-sm text-slate-400">Simulados, métricas e estratégia para concursos públicos.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-slate-300"><Users size={16} /> Comunidade ativa</span>
            <span className="inline-flex items-center gap-2 text-sm text-slate-300"><BarChart3 size={16} /> Dados em tempo real</span>
            <span className="inline-flex items-center gap-2 text-sm text-slate-300"><LockKeyhole size={16} /> Ambiente seguro</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
