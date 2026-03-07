create table if not exists flow_items (
  flow_code text not null,
  id int not null,
  nome text not null,
  periodo_ideal int not null,
  pre_requisitos int[] not null default '{}',
  carga_horaria int not null,
  creditos int not null,
  tipo text not null check (tipo in ('obrigatoria', 'optativa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (flow_code, id)
);

create table if not exists user_flow_progress (
  user_identifier text not null,
  flow_code text not null,
  ingresso_ano int not null,
  ingresso_semestre int not null check (ingresso_semestre in (1, 2)),
  periodo_offset int not null default 0,
  concluidas int[] not null default '{}',
  cursando int[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_identifier, flow_code)
);
