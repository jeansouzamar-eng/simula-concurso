import { PublicPage } from "../components/public-page";

export default function TermsPage() {
  return (
    <PublicPage title="Termos de uso" description="Condicoes gerais para uso do Simula Concurso.">
      <p>Ao usar a plataforma, o usuario concorda em fornecer dados verdadeiros no cadastro e usar os simulados de forma licita.</p>
      <p>Os conteudos, resultados e relatorios sao ferramentas de estudo e nao garantem aprovacao em concursos publicos.</p>
      <p>O acesso Premium pode depender de confirmacao de pagamento aprovado pelo provedor de pagamento configurado.</p>
    </PublicPage>
  );
}
