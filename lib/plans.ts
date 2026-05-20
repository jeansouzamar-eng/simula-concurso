import { prisma } from "./prisma";

export const FREE_WEEKLY_SIMULATION_LIMIT = 3;

export function getWeekStart(date = new Date()) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export async function getWeeklySimulationCount(userId: string) {
  return prisma.resultado.count({
    where: {
      userId,
      createdAt: {
        gte: getWeekStart(),
      },
    },
  });
}

export async function canUserStartSimulation({
  userId,
  userPlan,
  isPremiumSimulation,
}: {
  userId: string;
  userPlan: "GRATIS" | "PREMIUM";
  isPremiumSimulation: boolean;
}) {
  if (userPlan === "PREMIUM") {
    return { allowed: true, reason: null, weeklyCount: null };
  }

  if (isPremiumSimulation) {
    return {
      allowed: false,
      reason: "Este simulado e exclusivo para assinantes Premium.",
      weeklyCount: null,
    };
  }

  const weeklyCount = await getWeeklySimulationCount(userId);

  if (weeklyCount >= FREE_WEEKLY_SIMULATION_LIMIT) {
    return {
      allowed: false,
      reason: `Plano Gratis permite apenas ${FREE_WEEKLY_SIMULATION_LIMIT} simulados por semana.`,
      weeklyCount,
    };
  }

  return { allowed: true, reason: null, weeklyCount };
}
