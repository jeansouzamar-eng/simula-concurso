import { PublicPage } from "../components/public-page";

export default function PrivacyPage() {
  return (
    <PublicPage title="Politica de privacidade" description="Como tratamos dados de cadastro, acesso e desempenho.">
      <p>Coletamos dados de cadastro, historico de simulados, respostas e resultados para operar a plataforma.</p>
      <p>Senhas sao armazenadas com hash criptografado. Tokens e credenciais de servicos externos devem ficar apenas em variaveis de ambiente.</p>
      <p>Dados de pagamento sao processados pelo Mercado Pago; o sistema registra apenas informacoes necessarias para liberar o plano Premium.</p>
    </PublicPage>
  );
}
