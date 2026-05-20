import { NextResponse } from "next/server";

export function apiError(error: unknown) {
  if (error instanceof Response) {
    return NextResponse.json(
      { error: error.status === 403 ? "Acesso negado" : "Nao autenticado" },
      { status: error.status },
    );
  }

  if (error instanceof Error && error.message.includes("MERCADO_PAGO_ACCESS_TOKEN")) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
  return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
