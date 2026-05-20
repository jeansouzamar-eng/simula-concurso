import { NextResponse } from "next/server";
import { apiError } from "../../../../lib/api";
import {
  fetchMercadoPagoPayment,
  getPaymentIdFromRequest,
  persistMercadoPagoPayment,
} from "../../../../lib/mercado-pago";

export async function POST(request: Request) {
  try {
    const paymentId = await getPaymentIdFromRequest(request);

    if (!paymentId) {
      return NextResponse.json({ ok: true, ignored: "missing_payment_id" });
    }

    const payment = await fetchMercadoPagoPayment(String(paymentId));
    const result = await persistMercadoPagoPayment(payment);

    return NextResponse.json({
      ok: true,
      status: result.status,
      premiumReleased: result.updatedPremium,
    });
  } catch (error) {
    return apiError(error);
  }
}
