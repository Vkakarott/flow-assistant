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

## Fluxo genérico

A aplicação é agnóstica ao domínio. Para usar outro fluxo, basta trocar o arquivo:

- `src/data/disciplinas.json`

Formato esperado para cada item:

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

## API (Next.js)

Rota inicial disponível:

- `GET /api/disciplinas`: retorna a grade curricular carregada do JSON

## Autenticação (NextAuth)

- Login: `/login`
- API de auth: `/api/auth/[...nextauth]`

Copie `.env.example` para `.env.local` e ajuste as credenciais:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `AUTH_USERNAME`
- `AUTH_PASSWORD`
