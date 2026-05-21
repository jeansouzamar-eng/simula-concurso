import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@simulaconcurso.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD deve estar configurada com pelo menos 12 caracteres para executar o seed.");
  }
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      nome: "Carla Admin",
      tipo: "ADMIN",
      plano: "PREMIUM",
    },
    create: {
      nome: "Carla Admin",
      email: adminEmail,
      senhaHash: adminPasswordHash,
      tipo: "ADMIN",
      plano: "PREMIUM",
    },
  });

  const concursos = [
    "Polícia Federal",
    "Polícia Rodoviária Federal",
    "Polícia Civil",
    "Polícia Militar",
    "Polícia Penal",
    "Guarda Municipal",
  ];

  for (const nome of concursos) {
    await prisma.concurso.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const materias = [
    "Português",
    "Raciocínio Lógico",
    "Informática",
    "Direito Constitucional",
    "Direito Administrativo",
    "Direito Penal",
    "Processo Penal",
    "Direitos Humanos",
    "Criminologia",
  ];

  for (const nome of materias) {
    await prisma.materia.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const bancas = ["Cebraspe", "FGV", "Vunesp", "IBFC", "AOCP"];

  for (const nome of bancas) {
    await prisma.banca.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const portugues = await prisma.materia.findUniqueOrThrow({ where: { nome: "Português" } });
  const administrativo = await prisma.materia.findUniqueOrThrow({
    where: { nome: "Direito Administrativo" },
  });
  const constitucional = await prisma.materia.findUniqueOrThrow({
    where: { nome: "Direito Constitucional" },
  });
  const logico = await prisma.materia.findUniqueOrThrow({ where: { nome: "Raciocínio Lógico" } });
  const fgv = await prisma.banca.findUniqueOrThrow({ where: { nome: "FGV" } });
  const policiaFederal = await prisma.concurso.findUniqueOrThrow({
    where: { nome: "Polícia Federal" },
  });

  const questoesBase = [
    {
      enunciado: "Em relacao aos atos administrativos, assinale o atributo classico correto.",
      alternativaA: "Presuncao de legitimidade.",
      alternativaB: "Renuncia obrigatoria.",
      alternativaC: "Autonomia privada absoluta.",
      alternativaD: "Informalidade irrestrita.",
      alternativaCorreta: "A",
      explicacao:
        "A presuncao de legitimidade e um atributo classico dos atos administrativos, ao lado da imperatividade e da autoexecutoriedade em certas hipoteses.",
      materiaId: administrativo.id,
      bancaId: fgv.id,
      dificuldade: "MEDIA",
    },
    {
      enunciado: "Assinale a alternativa em que a concordancia verbal esta correta.",
      alternativaA: "Fazem dez anos que o edital foi publicado.",
      alternativaB: "Houveram muitos recursos contra a prova.",
      alternativaC: "Existem candidatos preparados para a fase discursiva.",
      alternativaD: "Aconteceu varios problemas no certame.",
      alternativaCorreta: "C",
      explicacao:
        "O verbo existir e pessoal e concorda com o sujeito plural: existem candidatos.",
      materiaId: portugues.id,
      bancaId: fgv.id,
      dificuldade: "FACIL",
    },
    {
      enunciado: "Qual principio constitucional exige a divulgacao dos atos da administracao publica?",
      alternativaA: "Impessoalidade.",
      alternativaB: "Publicidade.",
      alternativaC: "Efetividade privada.",
      alternativaD: "Sigilo funcional absoluto.",
      alternativaCorreta: "B",
      explicacao:
        "O principio da publicidade exige transparencia e divulgacao dos atos administrativos, salvo hipoteses legais de sigilo.",
      materiaId: constitucional.id,
      bancaId: fgv.id,
      dificuldade: "FACIL",
    },
    {
      enunciado: "Em uma sequencia 2, 4, 8, 16, qual e o proximo termo?",
      alternativaA: "18",
      alternativaB: "24",
      alternativaC: "30",
      alternativaD: "32",
      alternativaCorreta: "D",
      explicacao:
        "A sequencia dobra a cada termo. Depois de 16, o proximo valor e 32.",
      materiaId: logico.id,
      bancaId: fgv.id,
      dificuldade: "FACIL",
    },
    {
      enunciado: "A anulacao de um ato administrativo decorre, em regra, de qual situacao?",
      alternativaA: "Conveniência e oportunidade.",
      alternativaB: "Ilegalidade.",
      alternativaC: "Renuncia do administrado.",
      alternativaD: "Simples alteracao de governo.",
      alternativaCorreta: "B",
      explicacao:
        "A anulacao decorre de ilegalidade. A revogacao, por sua vez, decorre de conveniencia e oportunidade.",
      materiaId: administrativo.id,
      bancaId: fgv.id,
      dificuldade: "MEDIA",
    },
  ];

  const questoes = [];

  for (const data of questoesBase) {
    const existing = await prisma.questao.findFirst({ where: { enunciado: data.enunciado } });
    questoes.push(existing ?? (await prisma.questao.create({ data })));
  }

  let simulado = await prisma.simulado.findFirst({
    where: { titulo: "Simulado Inicial - Area Administrativa" },
  });

  if (!simulado) {
    simulado = await prisma.simulado.create({
      data: {
        titulo: "Simulado Inicial - Area Administrativa",
        descricao: "Primeiro simulado real para testar o fluxo completo do sistema.",
        tempoLimite: 30,
        nivel: "INTERMEDIARIO",
        isPremium: false,
        quantidadeQuestoes: questoes.length,
        materiaId: administrativo.id,
        bancaId: fgv.id,
        concursos: {
          create: [{ concursoId: policiaFederal.id }],
        },
        questoes: {
          create: questoes.map((questao, index) => ({
            questaoId: questao.id,
            ordem: index + 1,
          })),
        },
      },
    });
  } else {
    await prisma.simulado.update({
      where: { id: simulado.id },
      data: { isPremium: false },
    });
    await prisma.simuladoConcurso.upsert({
      where: {
        simuladoId_concursoId: {
          simuladoId: simulado.id,
          concursoId: policiaFederal.id,
        },
      },
      update: {},
      create: {
        simuladoId: simulado.id,
        concursoId: policiaFederal.id,
      },
    });
  }

  let simuladoPremium = await prisma.simulado.findFirst({
    where: { titulo: "Simulado Premium - FGV Avancado" },
  });

  if (!simuladoPremium) {
    simuladoPremium = await prisma.simulado.create({
      data: {
        titulo: "Simulado Premium - FGV Avancado",
        descricao: "Simulado exclusivo para assinantes Premium com gabarito comentado.",
        tempoLimite: 45,
        nivel: "AVANCADO",
        isPremium: true,
        quantidadeQuestoes: questoes.length,
        materiaId: administrativo.id,
        bancaId: fgv.id,
        concursos: {
          create: [{ concursoId: policiaFederal.id }],
        },
        questoes: {
          create: questoes.map((questao, index) => ({
            questaoId: questao.id,
            ordem: index + 1,
          })),
        },
      },
    });
  } else {
    await prisma.simuladoConcurso.upsert({
      where: {
        simuladoId_concursoId: {
          simuladoId: simuladoPremium.id,
          concursoId: policiaFederal.id,
        },
      },
      update: {},
      create: {
        simuladoId: simuladoPremium.id,
        concursoId: policiaFederal.id,
      },
    });
  }

  console.log("Seed concluido.");
  console.log(`Admin: ${adminEmail}`);
  console.log(`Concursos policiais: ${concursos.length}`);
  console.log(`Simulado: ${simulado.titulo}`);
  console.log(`Simulado premium: ${simuladoPremium.titulo}`);
}

main()
  .catch((error) => {
    console.error("Seed falhou.");
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
