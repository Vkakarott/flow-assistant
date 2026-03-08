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
  - Catálogo vindo do banco (`systemFlowCodes` + `userFlowCodes`)
  - Sem seleção automática de matriz quando não houver seleção salva válida
- Clique em um item disponível para marcar como `cursando`.
- Clique novamente para marcar como `concluída`.
- Clique em uma concluída para voltar para `pendente`.
- Itens bloqueados não permitem seleção até as dependências serem concluídas.
- A sidebar possui:
  - Lista de pendentes não bloqueadas (ordem por `id`)
  - Botão `Ajuda` com modal flutuante (cores + tutorial)

## Dados e persistência

- Itens do fluxo: PostgreSQL (`flow_items`) gerenciado por Prisma
- Progresso do usuário autenticado: PostgreSQL (`user_flow_progress`) gerenciado por Prisma
- Fallback local:
1. Progresso: `localStorage`, para sessão não autenticada

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
- `GET /api/progress?flowCode=<flow-code>`: retorna progresso do usuário autenticado (`flowCode` obrigatório)
- `PUT /api/progress`: atualiza progresso do usuário autenticado (`flowCode` obrigatório no body)

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
- Fluxo:
  - Se o email não existir, cria usuário automaticamente.
  - Se existir, valida a senha e autentica.

Copie `.env.example` para `.env.local` e ajuste as credenciais:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL` (Supabase pooling URL para runtime Prisma)
- `DIRECT_URL` (Supabase direct URL para migrações e seed)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Regras de conexão:

- Runtime da aplicação: `DATABASE_URL` (pooler)
- Migração e seed (`db:init`, `seed:*`): `DIRECT_URL` quando definido; fallback para `DATABASE_URL`
