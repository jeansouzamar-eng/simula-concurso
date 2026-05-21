import nodemailer from "nodemailer";

type SendPasswordResetEmailParams = {
  to: string;
  name: string;
  resetUrl: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel ${name} nao configurada.`);
  }

  return value;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailParams) {
  const host = requiredEnv("SMTP_HOST");
  const port = Number(requiredEnv("SMTP_PORT"));
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASS");
  const from = process.env.SMTP_FROM || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Redefinicao de senha - Simula Concurso",
    text: [
      `Ola, ${name}.`,
      "",
      "Recebemos uma solicitacao para redefinir sua senha no Simula Concurso.",
      `Acesse o link abaixo para criar uma nova senha: ${resetUrl}`,
      "",
      "Este link expira em 1 hora. Se voce nao solicitou a redefinicao, ignore este e-mail.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1 style="color:#061421">Redefinir senha</h1>
        <p>Ola, <strong>${name}</strong>.</p>
        <p>Recebemos uma solicitacao para redefinir sua senha no Simula Concurso.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#25d38e;color:#061421;padding:12px 18px;border-radius:8px;font-weight:700;text-decoration:none">
            Criar nova senha
          </a>
        </p>
        <p>Este link expira em 1 hora. Se voce nao solicitou a redefinicao, ignore este e-mail.</p>
      </div>
    `,
  });
}
