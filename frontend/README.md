# Sicontrola — Frontend

Interface web do sistema Sicontrola, construída com **Next.js 16** (App Router), **Tailwind CSS v4** e **shadcn/ui**.

---

## Stack

- **Framework**: Next.js 16 (App Router, Standalone output)
- **Estilo**: Tailwind CSS v4 + shadcn/ui (Radix UI)
- **Autenticação**: Better-Auth React Client (sessões gerenciadas pelo backend)
- **Tabelas**: TanStack Table v8
- **Gráficos**: Recharts
- **Forms**: React Hook Form + Zod
- **Pagamentos**: Stripe.js (checkout no lado do cliente)
- **Estado**: React Context + useReducer

> O frontend **não tem banco de dados**. Toda persistência é feita pelo backend via API REST.

---

## Variáveis de Ambiente

| Variável              | Padrão                  | Descrição                                           |
| --------------------- | ----------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | URL da API backend                                  |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | URL pública deste app (usada pelo auth client)      |
| `STRIPE_SECRET_KEY`   | —                       | Chave secreta Stripe (para API routes de pagamento) |

---

## Desenvolvimento local

```bash
npm install
npm run dev
```

Frontend disponível em **http://localhost:3000**.

O backend deve estar rodando em **http://localhost:4000**. Para subir tudo junto:

```bash
docker compose -f ../docker-compose.dev.yaml up
```

---

## Build de produção

```bash
npm run build
```

Gera saída **standalone** em `.next/standalone/`. Para rodar:

```bash
node .next/standalone/server.js
```

---

## Autenticação

O auth é tratado pelo backend (NestJS + Better-Auth). O frontend usa o Better-Auth React Client que aponta para `/api/auth/**` — essas rotas são proxiadas para o backend via `src/app/api/auth/[...all]/route.ts`.

```
Browser → Next.js /api/auth/** → Backend /api/auth/**
```

Não há Prisma nem conexão direta com banco no frontend.

---

## Estrutura principal

```
src/
├── app/               # Rotas (App Router)
│   ├── api/           # API Routes (proxy auth, pagamentos)
│   ├── login/         # Tela de login
│   ├── dashboard/     # Dashboard principal
│   ├── estudantil/    # Área do aluno
│   ├── motoristas/    # Gestão de motoristas
│   ├── manutencoes/   # Manutenções de frota
│   └── ...
├── components/        # Componentes compartilhados (shadcn/ui)
└── lib/
    ├── auth-client.ts # Cliente Better-Auth
    ├── mock-data.ts   # Dados de exemplo (desenvolvimento)
    ├── types.ts       # Tipos TypeScript
    └── utils.ts       # Utilitários
```

---

## Deploy no Coolify

O `Dockerfile` usa build **multi-stage**:
1. Stage `builder`: instala dependências e executa `next build`
2. Stage `runner`: copia apenas a saída standalone + assets estáticos

As variáveis `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_APP_URL` são injetadas como `ARG` no Dockerfile para que o Next.js as incorpore no bundle de produção.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
