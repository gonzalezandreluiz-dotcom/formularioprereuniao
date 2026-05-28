-- Tabela de clientes (gerados pelo assessor)
create table if not exists clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  token      uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- Tabela de submissões (preenchidas pelo cliente)
create table if not exists submissions (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references clients(id) on delete cascade,
  pf_data      jsonb,
  pj_data      jsonb,
  submitted_at timestamptz not null default now()
);

-- RLS habilitado mas políticas permissivas (ferramenta interna)
alter table clients    enable row level security;
alter table submissions enable row level security;

create policy "clients: anon full access"
  on clients for all to anon using (true) with check (true);

create policy "submissions: anon full access"
  on submissions for all to anon using (true) with check (true);
