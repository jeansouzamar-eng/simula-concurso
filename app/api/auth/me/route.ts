import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { apiError } from "../../../../lib/api";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    return apiError(error);
  }
}
