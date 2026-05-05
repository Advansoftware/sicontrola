# Integração Frontend ↔ Backend — Sicontrola

> Documento de rastreamento criado em 04/05/2026.  
> Atualizar este arquivo a cada módulo concluído.

---

## Status Geral

| Módulo                          | Schema DB         | Endpoints    | Status |
| ------------------------------- | ----------------- | ------------ | ------ |
| Schema Prisma                   | 🔄 em andamento    | —            | 🔄      |
| Settings (escolas/rotas/planos) | ✅                 | ❌ faltando   | ❌      |
| Notifications                   | ❌ faltando        | ❌ faltando   | ❌      |
| Reports                         | ✅ (usa existente) | ❌ faltando   | ❌      |
| Students                        | ✅ parcial         | ⚠️ incompleto | ⚠️      |
| Secretary                       | ✅                 | ⚠️ incompleto | ⚠️      |
| Financial                       | ✅                 | ⚠️ incompleto | ⚠️      |
| Usage (QR/embarques)            | ✅                 | ⚠️ incompleto | ⚠️      |
| Drivers                         | ✅                 | ⚠️ sem rota   | ⚠️      |

---

## 1. Schema Prisma — Mudanças Necessárias

### Adições/alterações:
- [x] `School`: adicionar campo `address`
- [x] `Route`: adicionar campos `description`, `driverId` (relação com Driver)
- [x] `Driver`: adicionar campo `routeId` (rota atribuída)
- [x] `Plan`: adicionar campo `description`
- [x] `Payment`: adicionar campo `transactionId`
- [x] Novo modelo `Notification`
- [x] Novo modelo `SystemSettings`

---

## 2. Módulo Settings

### Endpoints necessários:
- `GET  /api/settings/schools` — listar escolas
- `POST /api/settings/schools` — criar escola
- `DELETE /api/settings/schools/:id` — remover escola
- `GET  /api/settings/routes` — listar rotas
- `POST /api/settings/routes` — criar rota
- `DELETE /api/settings/routes/:id` — remover rota
- `GET  /api/settings/plans` — listar planos
- `PATCH /api/settings/plans/:id` — atualizar plano
- `GET  /api/settings/system` — configurações do sistema
- `PATCH /api/settings/system` — atualizar configurações

### Status: ❌ → ✅

---

## 3. Módulo Notifications

### Endpoints necessários:
- `GET  /api/notifications` — listar notificações do usuário
- `PATCH /api/notifications/:id/read` — marcar como lida
- `PATCH /api/notifications/read-all` — marcar todas como lidas

### Status: ❌ → ✅

---

## 4. Módulo Reports

### Endpoints necessários:
- `GET  /api/reports/students` — resumo de alunos
- `GET  /api/reports/financial` — resumo financeiro
- `GET  /api/reports/usage` — uso por dia da semana / por rota

### Status: ❌ → ✅

---

## 5. Módulo Students — Correções

### Endpoints existentes (ok):
- `POST /api/students` — criar cadastro
- `GET  /api/students/me` — meu cadastro
- `POST /api/students/documents` — upload de documento
- `GET  /api/students/schools` — listar escolas
- `GET  /api/students/plans` — listar planos

### Endpoints faltando:
- `GET  /api/students` — listar todos (admin) com paginação e filtros
- `GET  /api/students/:id` — detalhe de um aluno (admin)
- `GET  /api/students/me/weekly-usage` — uso semanal do próprio aluno
- `PATCH /api/students/me` — atualizar dados do próprio cadastro

### Status: ⚠️ → ✅

---

## 6. Módulo Secretary — Correções

### Endpoints existentes (ok):
- `GET  /api/secretary/students/pending` — apenas pendentes
- `PATCH /api/secretary/students/:id/status` — aprovar/reprovar/corrigir
- `GET  /api/secretary/dashboard/stats` — stats básicas

### Correções:
- `GET /api/secretary/students` — todos os alunos com filtro por status (todos, pendentes, aprovados, reprovados, em_correcao)
- Dashboard stats expandido: totalStudents, approved, pending, rejected, correction, monthlyRevenue, boardingsToday

### Status: ⚠️ → ✅

---

## 7. Módulo Financial — Correções

### Endpoints existentes (ok):
- `POST /api/financial/payments` — criar pagamento (aluno)
- `GET  /api/financial/payments/me` — meus pagamentos
- `GET  /api/financial/dashboard` — stats básicas

### Endpoints faltando:
- `GET  /api/financial/students` — todos alunos com status de pagamento (admin)
- `POST /api/financial/payments/admin/:studentId` — admin paga para aluno específico
- Dashboard stats expandido: totalRevenue, pendingCount, pendingTotal, overdueCount, overdueTotal, activeStudents

### Status: ⚠️ → ✅

---

## 8. Módulo Usage — Correções

### Endpoints existentes (ok):
- `POST /api/usage/validate` — validar QR code e registrar embarque

### Endpoints faltando:
- `GET  /api/usage/driver/today` — registros do dia para o motorista logado
- `GET  /api/usage/student/week` — uso semanal do aluno logado

### Status: ⚠️ → ✅

---

## 9. Módulo Drivers — Correções

### Endpoints existentes (ok):
- `GET  /api/drivers` — listar todos
- `POST /api/drivers` — criar motorista
- `PATCH /api/drivers/:id` — atualizar (agora com rota)
- `DELETE /api/drivers/:id` — remover

### Correção:
- Resposta do GET incluir rota associada (já com include)
- DTO para criar/editar motorista com routeId

### Status: ⚠️ → ✅

---

## Notas de Alinhamento Frontend ↔ Backend

### Enums — mapeamento:
| Frontend           | Backend (Prisma) |
| ------------------ | ---------------- |
| `'pending'`        | `PENDENTE`       |
| `'approved'`       | `APROVADO`       |
| `'rejected'`       | `REPROVADO`      |
| `'correction'`     | `EM_CORRECAO`    |
| `'paid'`           | `PAGO`           |
| `'overdue'`        | `ATRASADO`       |
| `'morning'`        | `MANHA`          |
| `'afternoon'`      | `TARDE`          |
| `'night'`          | `NOITE`          |
| role `'admin'`     | `ADMIN`          |
| role `'secretary'` | `SECRETARIA`     |
| role `'student'`   | `ALUNO`          |
| role `'driver'`    | `MOTORISTA`      |
