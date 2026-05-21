import { PublicPage } from "../components/public-page";

export default function AboutPage() {
  return (
    <PublicPage
      title="Sobre o Simula Concurso"
      description="Uma plataforma para treinar concursos com simulados, resultados e evolucao real."
    >
      <p>
        O Simula Concurso ajuda candidatos a praticar com questoes organizadas por materia, banca,
        dificuldade e nivel de simulado.
      </p>
      <p>
        A experiencia combina cronometro, gabarito comentado, historico de desempenho e recursos
        premium para quem deseja estudar com mais profundidade.
      </p>
    </PublicPage>
  );
}
