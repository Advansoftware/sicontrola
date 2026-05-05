# Sicontrola — Backend (API REST)

API REST do sistema Sicontrola, construída com **NestJS 11**, **Prisma 6** e **MySQL 8**.

---

## Stack

- **Framework**: NestJS 11 (TypeScript)
- **ORM**: Prisma 6 (MySQL)
- **Autenticação**: Better-Auth 1.6 (sessions via cookie, Prisma Adapter)
- **Upload**: Multer (arquivos em `/app/uploads`)
- **E-mail**: Nodemailer

---

## Módulos

| Módulo        | Prefixo              | Descrição                            |
| ------------- | -------------------- | ------------------------------------ |
| Auth          | `/api/auth/**`       | Login, logout, session (Better-Auth) |
| Students      | `/api/students`      | Cadastro e perfil do aluno           |
| Secretary     | `/api/secretary`     | Validação de cadastros, dashboard    |
| Financial     | `/api/financial`     | Planos, pagamentos, inadimplência    |
| Usage         | `/api/usage`         | Validação de embarque (QR Code)      |
| Drivers       | `/api/drivers`       | Motoristas e rotas                   |
| Vehicles      | `/api/vehicles`      | Frota                                |
| Refuels       | `/api/refuels`       | Abastecimentos                       |
| Maintenances  | `/api/maintenances`  | Manutenções                          |
| Parts         | `/api/parts`         | Peças                                |
| Fines         | `/api/fines`         | Multas                               |
| Revisions     | `/api/revisions`     | Revisões                             |
| Settings      | `/api/settings`      | Escolas, rotas, planos, sistema      |
| Notifications | `/api/notifications` | Notificações por usuário             |
| Reports       | `/api/reports`       | Relatórios                           |
| Uploads       | `/api/uploads`       | Upload de documentos                 |

---

## Roles

| Role         | Acesso                                                      |
| ------------ | ----------------------------------------------------------- |
| `ADMIN`      | Total                                                       |
| `SECRETARIA` | Alunos, financeiro, relatórios, leitura de drivers/vehicles |
| `ALUNO`      | Próprio perfil, documentos, pagamentos                      |
| `MOTORISTA`  | Validação de embarque, registros do dia                     |

---

## Variáveis de Ambiente

| Variável             | Padrão                  | Descrição                  |
| -------------------- | ----------------------- | -------------------------- |
| `DATABASE_URL`       | —                       | String de conexão MySQL    |
| `BETTER_AUTH_SECRET` | —                       | Chave secreta para sessões |
| `BETTER_AUTH_URL`    | `http://localhost:4000` | URL pública desta API      |
| `UPLOAD_DIR`         | `/app/uploads`          | Diretório de uploads       |
| `SMTP_HOST`          | —                       | Host SMTP                  |
| `SMTP_PORT`          | `587`                   | Porta SMTP                 |
| `SMTP_USER`          | —                       | Usuário SMTP               |
| `SMTP_PASS`          | —                       | Senha SMTP                 |
| `SMTP_FROM`          | —                       | Remetente padrão           |

---

## Desenvolvimento local

```bash
npm install
npm run start:dev
```

O servidor sobe na porta **4000**.

> Requer MySQL rodando. Use `docker compose -f ../docker-compose.dev.yaml up database` para subir só o banco.

---

## Docker (produção)

O `Dockerfile` faz:
1. Build TypeScript (`npm run build`)
2. A imagem final executa `start.sh`:
   - `prisma db push` — sincroniza schema com o banco
   - Seed do usuário admin (`admin@sicontrola.com` / `Admin123!`) se não existir
   - `node dist/src/main` — inicia o servidor

---

## Schema do banco

Arquivo: `prisma/schema.prisma`

Modelos principais: `User`, `Student`, `Driver`, `Vehicle`, `Route`, `School`, `Plan`, `Payment`, `StudentUsage`, `Notification`, `SystemSettings`, e modelos de frota (`Refuel`, `Maintenance`, `Part`, `Fine`, `Revision`).

Para atualizar o banco após mudanças no schema:
```bash
npx prisma db push
```

---

## Testes

```bash
npm run test          # unitários
npm run test:e2e      # end-to-end
npm run test:cov      # cobertura
```


[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
