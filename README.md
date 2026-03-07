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
- Clique em um item disponível para marcar como `cursando`.
- Clique novamente para marcar como `concluída`.
- Clique em uma concluída para voltar para `pendente`.
- Itens bloqueados não permitem seleção até as dependências serem concluídas.

## Dados e persistência

- Grade curricular: Supabase (`curriculum_items`)
- Progresso do usuário autenticado: Supabase (`user_progress`)
- Fallback local:
1. Grade: JSON local, caso banco esteja indisponível
2. Progresso: `localStorage`, para sessão não autenticada

Grade ativa atual: `cc-2017`.

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
- `npm run seed:cc2017`: envia o JSON base para o Supabase como grade `cc-2017`

## Setup Supabase

Crie as tabelas:

```sql
create table if not exists curriculum_items (
  curriculum_code text not null,
  id int not null,
  nome text not null,
  periodo_ideal int not null,
  pre_requisitos int[] not null default '{}',
  carga_horaria int not null,
  creditos int not null,
  tipo text not null check (tipo in ('obrigatoria', 'optativa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (curriculum_code, id)
);

create table if not exists user_progress (
  user_identifier text not null,
  curriculum_code text not null,
  ingresso_ano int not null,
  ingresso_semestre int not null check (ingresso_semestre in (1, 2)),
  periodo_offset int not null default 0,
  concluidas int[] not null default '{}',
  cursando int[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_identifier, curriculum_code)
);
```

## API (Next.js)

Rotas principais:

- `GET /api/disciplinas?curriculum=cc-2017`: carrega grade curricular
- `GET /api/progress`: retorna progresso do usuário autenticado
- `PUT /api/progress`: atualiza progresso do usuário autenticado

## Autenticação (NextAuth)

- Login: `/login`
- API de auth: `/api/auth/[...nextauth]`

Copie `.env.example` para `.env.local` e ajuste as credenciais:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AUTH_USERNAME`
- `AUTH_PASSWORD`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (necessária para seed e escrita server-side)
