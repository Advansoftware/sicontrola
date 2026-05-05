# Sicontrola — Sistema de Controle de Transporte Escolar

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Better-Auth](https://img.shields.io/badge/Better--Auth-1.6-yellow)](https://better-auth.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)](https://mysql.com/)

Sistema completo para gestão de transporte escolar — cadastro de alunos, validação de embarque via QR Code, controle financeiro, gestão de motoristas, veículos e manutenções.

---

## Arquitetura

```
sicontrola/
├── backend/            # API REST — NestJS 11 + Prisma + MySQL
├── frontend/           # Interface Web — Next.js 16 (App Router)
├── docker-compose.yaml      # Deploy produção (Coolify)
├── docker-compose.dev.yaml  # Desenvolvimento local (hot-reload)
└── INTEGRACAO.md       # Mapeamento de endpoints frontend ↔ backend
```

O frontend **não acessa o banco de dados diretamente**. Toda a lógica de negócio, autenticação e persistência é responsabilidade do backend. O frontend consome a API REST via `NEXT_PUBLIC_API_URL`.

---

## Funcionalidades

| Módulo            | Descrição                                                                |
| ----------------- | ------------------------------------------------------------------------ |
| **Autenticação**  | Login/logout via Better-Auth; roles: ADMIN, SECRETARIA, ALUNO, MOTORISTA |
| **Dashboard**     | KPIs em tempo real: alunos, receita, embarques do dia                    |
| **Alunos**        | Cadastro, envio de documentos, acompanhamento de status                  |
| **Secretaria**    | Validação/aprovação de cadastros, geração de QR Code                     |
| **Financeiro**    | Planos de assinatura, pagamentos, inadimplência                          |
| **Uso / QR Code** | Validação de embarque por QR Code pelo motorista                         |
| **Motoristas**    | Cadastro, CNH, rotas atribuídas                                          |
| **Veículos**      | Frota, manutenções, revisões, abastecimentos, peças, multas              |
| **Configurações** | Escolas, rotas, planos, parâmetros do sistema                            |
| **Notificações**  | Notificações por usuário                                                 |
| **Relatórios**    | Relatórios de alunos, financeiro e uso                                   |

---

## Início Rápido

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### Desenvolvimento local (hot-reload)
```bash
docker compose -f docker-compose.dev.yaml up
```
- Frontend: http://localhost:3000
- Backend (API): http://localhost:4000
- MySQL: localhost:3308

### Produção local
```bash
docker compose up -d --build
```
- Frontend: http://localhost:7001
- Backend (API): http://localhost:7000

---

## Variáveis de Ambiente

### Backend
| Variável                                              | Exemplo                                      | Descrição              |
| ----------------------------------------------------- | -------------------------------------------- | ---------------------- |
| `DATABASE_URL`                                        | `mysql://root:root@database:3306/sicontrola` | Conexão MySQL          |
| `BETTER_AUTH_SECRET`                                  | `sua_chave_secreta`                          | Chave de sessão        |
| `BETTER_AUTH_URL`                                     | `https://api.sicontrola.com.br`              | URL pública da API     |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | —                                            | Configuração de e-mail |
| `UPLOAD_DIR`                                          | `/app/uploads`                               | Diretório de uploads   |

### Frontend
| Variável              | Exemplo                         | Descrição                       |
| --------------------- | ------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://api.sicontrola.com.br` | URL da API backend              |
| `NEXT_PUBLIC_APP_URL` | `https://sicontrola.com.br`     | URL pública do frontend         |
| `STRIPE_SECRET_KEY`   | `sk_live_...`                   | Chave secreta Stripe (opcional) |

---

## Deploy no Coolify

O projeto usa `docker-compose.yaml` para build e deploy automatizado via Coolify.

1. Conecte o repositório no Coolify e selecione o arquivo `docker-compose.yaml`.
2. Configure as variáveis de ambiente no painel do Coolify.
3. O Coolify injeta `NEXT_PUBLIC_API_URL`, `SERVICE_FQDN_BACKEND` e `SERVICE_FQDN_FRONTEND` automaticamente como build args do Docker.

---

## Usuário Admin Padrão

Na primeira inicialização o backend cria automaticamente:

| Campo  | Valor                  |
| ------ | ---------------------- |
| E-mail | `admin@sicontrola.com` |
| Senha  | `Admin123!`            |

Altere a senha após o primeiro login.


[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![Material UI](https://img.shields.io/badge/MUI-v7-007FFF?logo=mui)](https://mui.com/)
[![Better-Auth](https://img.shields.io/badge/Better--Auth-1.5-yellow)](https://better-auth.com/)

**Sicontrola** é uma solução premium e de alto desempenho para gestão completa de frotas, recentemente modernizada para as tecnologias mais avançadas do ecossistema JavaScript/TypeScript. 

Esta versão marca a transição para o **Next.js 16 (App Router)** com **MUI v7**, oferecendo uma experiência de usuário fluida, responsiva e visualmente impressionante no estilo "Dark Tech".

---

## ✨ Funcionalidades Principais

O sistema é composto por 12 módulos integrados, cobrindo todos os aspectos da operação de frotas:

- 📊 **Dashboard Inteligente**: KPIs em tempo real com gráficos dinâmicos (`MUI X-Charts`).
- 🚗 **Gestão de Veículos**: Cadastro completo, monitoramento de KM e especificações técnicas.
- 👨‍✈️ **Controle de Motoristas**: Gestão de CNH, categorias e validades.
- ⛽ **Abastecimentos**: Registro detalhado de consumo, postos e valores.
- 🔧 **Manutenções e Peças**: Controle de estoque de peças e histórico de serviços mecânicos.
- 📅 **Revisões Agendadas**: Alertas e status de revisões preventivas.
- 🎫 **Gestão de Multas**: Acompanhamento de infrações e status de pagamento.
- 📄 **Relatórios e Documentos**: Repositório centralizado e geração de dados analíticos.

---

## 🛠️ Stack Tecnológica

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (Turbopack)
- **UI/UX**: Material UI (MUI) v7 com Custom Theme.
- **Gráficos**: @mui/x-charts v7.
- **Autenticação**: Better-Auth React Client.

### Backend (`/backend`)
- **Framework**: NestJS 11 (Node.js).
- **ORM**: Prisma 7.
- **Banco de Dados**: MySQL 8.
- **Segurança**: Better-Auth Server com Prisma Adapter e Singleton Pattern para estabilidade em Docker.

---

## 🚀 Como Iniciar

O projeto está totalmente containerizado com **Docker**, o que simplifica o deploy e o desenvolvimento local.

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone git@github.com:Advansoftware/sicontrola.git
   cd sicontrola
   ```

2. **Inicie os Containers**:
   Na raiz do projeto, execute:
   ```bash
   docker compose up -d --build
   ```

3. **Acesse as Aplicações**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **API Backend**: [http://localhost:4000](http://localhost:4000)

---

## 📂 Estrutura do Repositório

```text
sicontrola/
├── frontend/           # Aplicação Next.js 16
├── backend/            # API NestJS + Prisma
├── docker-compose.yml  # Orquestração do MySQL, API e Web
├── README.md           # Documentação principal
└── .gitignore          # Regras globais de arquivamento
```

---

## 🛡️ Estabilização e Performance

- **Prisma Singleton**: Implementação de um padrão de instância única para evitar vazamentos de conexão e erros de validação de motor (`engineType`) comuns no Prisma 7 sob Docker.
- **Base Debian Slim**: Migração para imagens Docker `node:22-slim` para garantir compatibilidade nativa com as bibliotecas binárias necessárias para o banco de dados.
- **Better-Auth Integration**: Sistema de autenticação de última geração com suporte nativo a banco de dados relacional.

---

## 📄 Licença

Este projeto é desenvolvido para **Advansoftware**. Todos os direitos reservados.

---
*Documentação gerada com Antigravity* 🌌
