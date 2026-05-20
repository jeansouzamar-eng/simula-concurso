# Deploy do Simula Concurso

Este guia deixa o projeto pronto para publicar na Vercel usando Next.js, Prisma, MySQL externo e Mercado Pago em producao.

## 1. Banco MySQL externo

Crie um banco MySQL em um provedor externo, por exemplo PlanetScale, Railway, DigitalOcean, AWS RDS, Azure Database for MySQL ou outro provedor compatível.

Crie o banco:

```sql
CREATE DATABASE simula_concurso CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Monte a `DATABASE_URL`:

```env
DATABASE_URL="mysql://usuario:senha@host:porta/banco"
```

Use conexao TLS/SSL se o provedor exigir. Nao use o MariaDB local em producao.

## 2. Variaveis na Vercel

Configure estas variaveis em Project Settings > Environment Variables:

```env
DATABASE_URL="mysql://usuario:senha@host:porta/banco"
JWT_SECRET="gere_uma_chave_segura_aqui"
MERCADO_PAGO_ACCESS_TOKEN="APP_USR_SEU_TOKEN_DE_PRODUCAO"
NEXT_PUBLIC_BASE_URL="https://seudominio.com.br"
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="APP_USR_SUA_PUBLIC_KEY_DE_PRODUCAO"
ADMIN_EMAIL="admin@seudominio.com.br"
ADMIN_PASSWORD="senha_forte_para_seed_inicial"
```

`JWT_SECRET` deve ter pelo menos 32 caracteres e nunca deve ser compartilhado.

## 3. Deploy na Vercel

1. Suba o projeto para GitHub, GitLab ou Bitbucket.
2. Importe o repositório na Vercel.
3. Confirme que o framework detectado e Next.js.
4. Configure as variaveis de ambiente.
5. Faça o primeiro deploy.

O projeto ja possui:

```json
{
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "postinstall": "prisma generate",
  "prisma:deploy": "prisma migrate deploy"
}
```

## 4. Migrations em producao

Antes ou logo apos o deploy, rode no ambiente com acesso ao banco de producao:

```bash
npx prisma migrate deploy
```

Ou pelo script:

```bash
npm run prisma:deploy
```

Para criar um admin inicial, rode uma unica vez:

```bash
npm run prisma:seed
```

Depois troque a senha do admin no proprio banco ou remova `ADMIN_PASSWORD` do ambiente se nao for mais usar seed.

## 5. Mercado Pago

No painel do Mercado Pago, use credenciais de producao:

```env
MERCADO_PAGO_ACCESS_TOKEN="APP_USR_SEU_TOKEN_DE_PRODUCAO"
```

Configure a URL publica de webhook:

```txt
https://seudominio.com.br/api/payments/webhook
```

Evento recomendado:

```txt
payment
```

O sistema consulta o pagamento no Mercado Pago e so atualiza o usuario para `PREMIUM` quando o status for `approved`.

Pagamentos `pending`, `rejected`, `cancelled` ou falhos sao salvos na tabela `payments`, mas nao liberam Premium.

## 6. Segurança

- `.env` esta no `.gitignore`.
- Rotas admin sao protegidas por `proxy.ts`.
- APIs privadas usam `requireAuth` ou `requireAdmin`.
- Senhas sao criptografadas com `bcryptjs`.
- JWT fica em cookie `httpOnly`.
- Logs detalhados sao omitidos em producao.
- Cadastro publico sempre cria usuario `ALUNO` com plano `GRATIS`.

## 7. SEO

O projeto possui:

- `app/layout.tsx` com title, description, Open Graph e Twitter card.
- `app/icon.svg` como favicon.
- `app/robots.ts`.
- `app/sitemap.ts`.

## 8. Checklist de teste em producao

- Cadastro de novo usuario.
- Login e logout.
- Fluxo de simulado gratis.
- Bloqueio de simulado premium para usuario gratis.
- Compra Premium pelo Mercado Pago.
- Webhook promovendo usuario para `PREMIUM`.
- Acesso de Premium a simulado premium.
- Dashboard do aluno.
- Painel admin com usuario ADMIN.
- Layout mobile em `/`, `/login`, `/dashboard`, `/simulados`, `/simulado/[id]`, `/resultado/[id]`, `/planos` e `/admin`.

Antes do deploy final:

```bash
npm run lint
npm run build
```
