import { NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/auth";
import { apiError } from "../../../../../lib/api";
import { createPremiumPreference } from "../../../../../lib/mercado-pago";

export async function POST() {
  try {
    const user = await requireAuth();
    const preference = await createPremiumPreference(user);

    return NextResponse.json({
      id: preference.id,
      redirectUrl: preference.init_point,
    });
  } catch (error) {
    return apiError(error);
  }
}
