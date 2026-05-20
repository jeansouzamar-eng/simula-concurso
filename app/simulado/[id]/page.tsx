import { SimuladoClient } from "./simulado-client";

export default async function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SimuladoClient simuladoId={id} />;
}
