-- =====================================================================
-- MG STORE — Schema do Supabase
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Dashboard -> SQL Editor -> New query -> colar -> Run)
-- =====================================================================

-- Extensão para gerar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------
create table if not exists products (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  description        text default '',
  price              numeric(10,2) not null default 0,
  promotional_price  numeric(10,2),
  stock              integer not null default 0,
  minimum_stock      integer not null default 3,
  category_id        uuid references categories(id) on delete set null,
  brand              text,
  images             text[] not null default '{}',
  featured           boolean not null default false,
  active             boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Atualiza updated_at automaticamente a cada edição
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------
create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  customer_name   text not null,
  customer_phone  text not null default '',
  items           jsonb not null default '[]',
  total           numeric(10,2) not null default 0,
  payment_method  text default '',
  status          text not null default 'pendente'
    check (status in ('pendente','confirmado','preparando','enviado','entregue','cancelado')),
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ADMIN_USERS
-- Não guardamos senha aqui: a senha/autenticação fica no Supabase Auth
-- (auth.users). Esta tabela só marca QUAIS usuários autenticados têm
-- permissão de administrador — é a lista de controle de acesso do painel.
-- ---------------------------------------------------------------------
create table if not exists admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null default 'admin',
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- Regra geral: qualquer visitante pode LER produtos/categorias ativos
-- (é a loja pública) e criar pedidos (checkout). Só administradores
-- autenticados podem escrever em produtos, categorias e admin_users,
-- ou ler todos os pedidos.
-- =====================================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table admin_users enable row level security;

-- Função auxiliar: o usuário logado é admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql stable;

-- CATEGORIES: leitura pública, escrita só admin
create policy "categorias visiveis para todos"
  on categories for select using (true);
create policy "categorias gerenciadas por admin"
  on categories for all using (is_admin()) with check (is_admin());

-- PRODUCTS: leitura pública, escrita só admin
create policy "produtos visiveis para todos"
  on products for select using (true);
create policy "produtos gerenciados por admin"
  on products for all using (is_admin()) with check (is_admin());

-- ORDERS: qualquer um pode CRIAR um pedido (checkout público),
-- mas só admin pode LER, ATUALIZAR ou EXCLUIR pedidos.
create policy "qualquer um pode criar pedido"
  on orders for insert with check (true);
create policy "somente admin le pedidos"
  on orders for select using (is_admin());
create policy "somente admin atualiza pedidos"
  on orders for update using (is_admin()) with check (is_admin());
create policy "somente admin exclui pedidos"
  on orders for delete using (is_admin());

-- ADMIN_USERS: só admin enxerga a lista de administradores
create policy "somente admin ve admin_users"
  on admin_users for select using (is_admin());
create policy "somente admin gerencia admin_users"
  on admin_users for all using (is_admin()) with check (is_admin());

-- =====================================================================
-- STORAGE — bucket de imagens dos produtos
-- Rode isto também, ou crie o bucket manualmente em
-- Dashboard -> Storage -> New bucket -> nome "produtos" -> Public bucket
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "imagens de produto visiveis para todos"
  on storage.objects for select
  using (bucket_id = 'produtos');

create policy "somente admin envia imagens de produto"
  on storage.objects for insert
  with check (bucket_id = 'produtos' and is_admin());

create policy "somente admin remove imagens de produto"
  on storage.objects for delete
  using (bucket_id = 'produtos' and is_admin());
