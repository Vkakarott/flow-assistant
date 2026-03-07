# Assistente de Definição de Fluxo

Aplicação para modelar e acompanhar fluxos com dependências (pré-requisitos) usando cards conectados por linhas.

## Objetivo

Permitir acompanhar:

- Etapas já concluídas
- Etapas em andamento
- Etapas pendentes
- Etapas bloqueadas por dependência

## Como funciona

- Cada item do fluxo aparece em um card no diagrama.
- A matriz atual é escolhida dinamicamente:
  - Prioridade 1: matrizes do usuário (banco + storage local)
  - Prioridade 2: matrizes padrão do sistema (banco)
- Fallback resiliente:
  - Se banco cair ou não tiver dados, a aplicação carrega a matriz padrão local (`cc-2017`) do JSON.
- Clique em um item disponível para marcar como `cursando`.
- Clique novamente para marcar como `concluída`.
- Clique em uma concluída para voltar para `pendente`.
- Itens bloqueados não permitem seleção até as dependências serem concluídas.

## Dados e persistência

- Itens do fluxo: PostgreSQL (`flow_items`) gerenciado por Prisma
- Progresso do usuário autenticado: PostgreSQL (`user_flow_progress`) gerenciado por Prisma
- Fallback local:
1. Grade: JSON local, caso banco esteja indisponível
2. Progresso: `localStorage`, para sessão não autenticada

Fluxo ativo padrão: `cc-2017` (configurável por `NEXT_PUBLIC_DEFAULT_FLOW_CODE`).

Formato de item (referência):

```json
{
  "id": 1,
  "nome": "Nome da disciplina",
  "periodoIdeal": 1,
  "preRequisitos": [],
  "cargaHoraria": 64,
  "creditos": 4,
  "tipo": "obrigatoria"
}
```

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de produção
- `npm run start`: servidor da build de produção
- `npm run lint`: análise estática
- `npm run typecheck`: validação de tipos
- `npm run prisma:generate`: gera client do Prisma
- `npm run db:init`: aplica migrações Prisma no banco (`prisma migrate deploy`)
- `npm run seed:flow -- --code <flow-code> --file <json-file>`: seed genérico de qualquer fluxo
- `npm run seed:cc2017`: atalho para seed do fluxo `cc-2017`

## Runtime

- Use Node.js 22 LTS (`.nvmrc` = `22`).
- Em versões não suportadas (ex.: Node 25), o Next.js pode apresentar erros de manifest/bundler em dev.

## Setup Banco (Prisma)

1. Aplique as migrações:

```bash
npm run db:init
```

Use `DATABASE_URL` com senha URL-encoded (ex.: `#` vira `%23`) ou entre aspas no `.env.local`.

2. Faça o upload do fluxo:

```bash
npm run seed:cc2017
```

Ou genérico:

```bash
npm run seed:flow -- --code roadmap-2026 --file ./data/roadmap-2026.json
```

## API (Next.js)

Rotas principais:

- `GET /api/flows`: catálogo de matrizes (`systemFlowCodes`, `userFlowCodes`)
- `POST /api/flows`: upload de matriz (`flowCode` + `disciplinas[]`) no formato do JSON
- `GET /api/disciplinas?flow=<flow-code>`: carrega itens do fluxo
- `GET /api/progress?flowCode=<flow-code>`: retorna progresso do usuário autenticado
- `PUT /api/progress`: atualiza progresso do usuário autenticado (envie `flowCode` no body)

### Upload de matriz

- Página: `/nova-matriz` (exige login)
- Payload esperado no `POST /api/flows`:

```json
{
  "flowCode": "cc-2017",
  "disciplinas": [
    {
      "id": 1,
      "nome": "Introdução",
      "periodoIdeal": 1,
      "preRequisitos": [],
      "cargaHoraria": 64,
      "creditos": 4,
      "tipo": "obrigatoria"
    }
  ]
}
```

## Autenticação (NextAuth)

- Login: `/login`
- API de auth: `/api/auth/[...nextauth]`

Copie `.env.example` para `.env.local` e ajuste as credenciais:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AUTH_USERNAME`
- `AUTH_PASSWORD`
- `DATABASE_URL` (Supabase pooling URL para runtime Prisma)
- `DIRECT_URL` (Supabase direct URL para migrações e seed)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_DEFAULT_FLOW_CODE` (fluxo padrão da aplicação)

Regras de conexão:

- Runtime da aplicação: `DATABASE_URL` (pooler)
- Migração e seed (`db:init`, `seed:*`): `DIRECT_URL` quando definido; fallback para `DATABASE_URL`
