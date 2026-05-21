import { PublicPage } from "../components/public-page";

const faqs = [
  ["Existe plano gratis?", "Sim. O plano gratis permite fazer ate 3 simulados por semana."],
  ["Como acesso simulados premium?", "Usuarios Premium tem acesso ilimitado e podem abrir simulados marcados como premium."],
  ["O resultado fica salvo?", "Sim. As respostas, acertos, erros e percentual ficam salvos no historico do aluno."],
  ["Como viro Premium?", "Pela pagina de planos, usando o checkout do Mercado Pago."],
];

export default function FaqPage() {
  return (
    <PublicPage title="FAQ" description="Respostas rapidas para as duvidas mais comuns.">
      <div className="space-y-4">
        {faqs.map(([question, answer]) => (
          <article key={question} className="rounded-lg border border-white/10 bg-[#061421]/55 p-5">
            <h2 className="font-black text-white">{question}</h2>
            <p className="mt-2 text-slate-300">{answer}</p>
          </article>
        ))}
      </div>
    </PublicPage>
  );
}
