# Deploy do Simula Concurso no Render

Este guia publica o Simula Concurso no Render usando Next.js, Prisma, MySQL externo/Aiven e Mercado Pago em producao.

## 1. Banco MySQL

Use o MySQL criado no Aiven. A `DATABASE_URL` deve seguir este formato:

```env
DATABASE_URL="mysql://avnadmin:SUA_SENHA@HOST_AIVEN:PORTA/defaultdb?ssl-mode=REQUIRED"
```

Troque `SUA_SENHA`, `HOST_AIVEN` e `PORTA` pelos dados do painel Aiven. Nao coloque essa URL no codigo.

## 2. Criar Web Service

1. Acesse o Render.
2. Clique em New > Web Service.
3. Conecte o GitHub.
4. Escolha o repositorio `simula-concurso`.
5. Configure:
   - Runtime: Node
   - Branch: `main`
   - Build Command: `npm install && npm run prisma:deploy && npm run build`
   - Start Command: `npm run start`
   - Instance Type: Free ou Starter

O projeto tambem possui `render.yaml`, entao voce pode usar Blueprint se preferir.

## 3. Variaveis de ambiente

Configure em Web Service > Environment:

```env
DATABASE_URL="mysql://usuario:senha@host:porta/banco?ssl-mode=REQUIRED"
JWT_SECRET="gere_uma_chave_segura_com_32_ou_mais_caracteres"
MERCADO_PAGO_ACCESS_TOKEN="APP_USR_SEU_TOKEN_DE_PRODUCAO"
NEXT_PUBLIC_BASE_URL="https://seu-app.onrender.com"
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="APP_USR_SUA_PUBLIC_KEY_DE_PRODUCAO"
ADMIN_EMAIL="admin@seudominio.com.br"
ADMIN_PASSWORD="senha_forte_com_12_ou_mais_caracteres"
SMTP_HOST="smtp.seuprovedor.com"
SMTP_PORT="587"
SMTP_USER="usuario_smtp"
SMTP_PASS="senha_smtp"
SMTP_FROM="Simula Concurso <nao-responda@seudominio.com.br>"
```

Depois do primeiro deploy, copie a URL publica do Render e atualize `NEXT_PUBLIC_BASE_URL`.

## 4. Migrations

O build do Render ja roda:

```bash
npm run prisma:deploy
```

Se precisar rodar manualmente em uma maquina com acesso ao banco:

```bash
npm run prisma:deploy
```

Para criar o admin inicial uma unica vez:

```bash
npm run prisma:seed
```

## 5. Mercado Pago

No Mercado Pago, configure o webhook com a URL publica:

```txt
https://seu-app.onrender.com/api/payments/webhook
```

Evento recomendado: `payment`.

O sistema so atualiza o usuario para `PREMIUM` quando o pagamento estiver com status `approved`.

## 6. Recuperacao de senha

Configure SMTP no Render para o botao "Esqueci minha senha" enviar emails reais.

Exemplos de provedores compativeis: Resend SMTP, Brevo, Mailgun, SendGrid ou SMTP do seu dominio.

A URL enviada no email usa `NEXT_PUBLIC_BASE_URL`, entao mantenha essa variavel com a URL publica atual do Render.

## 7. Checklist

- Cadastro funcionando.
- Login funcionando.
- Recuperacao de senha enviando email.
- Link de redefinicao atualizando a senha.
- Simulados carregando do banco.
- Resultado salvando no banco.
- Plano gratis bloqueando simulados premium.
- Mercado Pago redirecionando para checkout.
- Webhook promovendo usuario aprovado para `PREMIUM`.
- Painel admin protegido.
