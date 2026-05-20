import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { prisma } from "./prisma";

export const PREMIUM_PLAN_AMOUNT = 19.9;

type MercadoPagoPaymentResponse = {
  id?: number | string;
  status?: string;
  external_reference?: string;
  transaction_amount?: number;
  metadata?: {
    user_id?: string;
    userId?: string;
  };
};

export function getMercadoPagoClient() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN nao configurado.");
  }

  return new MercadoPagoConfig({ accessToken });
}

export async function createPremiumPreference(user: {
  id: string;
  nome: string;
  email: string;
  plano: "GRATIS" | "PREMIUM";
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (user.plano === "PREMIUM") {
    return {
      id: null,
      init_point: `${baseUrl}/planos?status=already-premium`,
    };
  }

  const preference = new Preference(getMercadoPagoClient());
  const result = await preference.create({
    body: {
      items: [
        {
          id: "simula-concurso-premium",
          title: "Plano Premium Simula Concurso",
          description: "Assinatura Premium do Simula Concurso",
          quantity: 1,
          currency_id: "BRL",
          unit_price: PREMIUM_PLAN_AMOUNT,
        },
      ],
      payer: {
        name: user.nome,
        email: user.email,
      },
      external_reference: user.id,
      metadata: {
        user_id: user.id,
        plan: "PREMIUM",
      },
      back_urls: {
        success: `${baseUrl}/planos?status=success`,
        pending: `${baseUrl}/planos?status=pending`,
        failure: `${baseUrl}/planos?status=failure`,
      },
      notification_url: `${baseUrl}/api/payments/webhook`,
    },
  });

  return {
    id: result.id,
    init_point: result.init_point ?? result.sandbox_init_point,
  };
}

export async function fetchMercadoPagoPayment(paymentId: string) {
  const paymentClient = new Payment(getMercadoPagoClient());
  return (await paymentClient.get({ id: paymentId })) as MercadoPagoPaymentResponse;
}

export async function persistMercadoPagoPayment(payment: MercadoPagoPaymentResponse) {
  const paymentId = String(payment.id ?? "");
  const status = payment.status ?? "unknown";
  const userId = payment.external_reference ?? payment.metadata?.user_id ?? payment.metadata?.userId;
  const amount = payment.transaction_amount ?? PREMIUM_PLAN_AMOUNT;

  if (!paymentId || !userId) {
    return { updatedPremium: false, ignored: true, status };
  }

  const result = await prisma.$transaction(async (tx) => {
    const savedPayment = await tx.payment.upsert({
      where: { mercadoPagoPaymentId: paymentId },
      update: {
        status,
        amount,
      },
      create: {
        userId,
        mercadoPagoPaymentId: paymentId,
        status,
        amount,
      },
    });

    if (status === "approved") {
      await tx.user.update({
        where: { id: userId },
        data: {
          plano: "PREMIUM",
          premiumAt: new Date(),
          mercadoPagoPaymentId: paymentId,
        },
      });

      return { savedPayment, updatedPremium: true };
    }

    return { savedPayment, updatedPremium: false };
  });

  return { ...result, ignored: false, status };
}

export async function getPaymentIdFromRequest(request: Request) {
  const url = new URL(request.url);
  const queryId = url.searchParams.get("data.id") ?? url.searchParams.get("id");

  if (queryId) {
    return queryId;
  }

  const body = await request.json().catch(() => null);
  return body?.data?.id ?? body?.id ?? null;
}
