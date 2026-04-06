# 🚛 Sicontrola - Gestão de Frotas Modernizada

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
