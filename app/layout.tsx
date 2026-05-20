import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Simula Concurso | Simulados para concursos públicos",
    template: "%s | Simula Concurso",
  },
  description:
    "Treine com simulados inteligentes, métricas de desempenho e planos para acelerar sua aprovação em concursos públicos.",
  applicationName: "Simula Concurso",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Simula Concurso",
    description:
      "Plataforma de simulados para concursos públicos com plano grátis, Premium e relatórios de desempenho.",
    url: baseUrl,
    siteName: "Simula Concurso",
    images: [
      {
        url: "/hero-dashboard.png",
        width: 1536,
        height: 864,
        alt: "Dashboard do Simula Concurso",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simula Concurso",
    description: "Simulados inteligentes para concursos públicos.",
    images: ["/hero-dashboard.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
