-- =====================================================================
-- MG STORE — Dados de exemplo (OPCIONAL)
-- Roda isto DEPOIS do schema.sql, no SQL Editor do Supabase, só se
-- quiser ver a loja com produtos de exemplo em vez de vazia.
--
-- IMPORTANTE: são produtos FICTÍCIOS, só para mostrar o layout.
-- Depois de rodar, vá em /admin/produtos e edite cada um (nome real,
-- preço real, fotos reais) ou exclua e cadastre os seus do zero.
-- =====================================================================

-- Categorias (mesmas do site anterior)
insert into categories (name, description, active) values
  ('Celulares',       'iPhone, Samsung, Xiaomi, Motorola e mais.', true),
  ('Fones de Ouvido',  'Bluetooth, com fio, in-ear e over-ear.',    true),
  ('Power Banks',      'Energia extra para o seu dia.',             true),
  ('Carregadores',     'Carregamento rápido e seguro.',             true),
  ('Periféricos',      'Mouse, teclado, headset e acessórios.',     true)
on conflict do nothing;

-- Produtos de exemplo — sem imagem (adicione pelo painel), estoque e
-- preços fictícios só para preencher a vitrine.
insert into products (name, description, price, promotional_price, stock, minimum_stock, category_id, brand, images, featured, active)
select
  'Smartphone Exemplo Pro',
  'Produto de exemplo usado apenas para demonstrar o layout. Edite ou substitua pelo produto real em /admin/produtos.',
  4999.00, 4599.00, 10, 3,
  (select id from categories where name = 'Celulares'),
  'iPhone', '{}', true, true
union all select
  'Smartphone Exemplo Lite',
  'Produto de exemplo usado apenas para demonstrar o layout. Edite ou substitua pelo produto real em /admin/produtos.',
  2199.00, null, 5, 3,
  (select id from categories where name = 'Celulares'),
  'Samsung', '{}', false, true
union all select
  'Fone Bluetooth Exemplo',
  'Produto de exemplo usado apenas para demonstrar o layout. Edite ou substitua pelo produto real em /admin/produtos.',
  249.00, 199.00, 20, 5,
  (select id from categories where name = 'Fones de Ouvido'),
  'Marca Exemplo', '{}', true, true
union all select
  'Power Bank Exemplo 10000mAh',
  'Produto de exemplo usado apenas para demonstrar o layout. Edite ou substitua pelo produto real em /admin/produtos.',
  129.00, null, 15, 4,
  (select id from categories where name = 'Power Banks'),
  'Marca Exemplo', '{}', false, true
union all select
  'Carregador Turbo Exemplo 20W',
  'Produto de exemplo usado apenas para demonstrar o layout. Edite ou substitua pelo produto real em /admin/produtos.',
  79.00, null, 0, 3,
  (select id from categories where name = 'Carregadores'),
  'Marca Exemplo', '{}', false, true
union all select
  'Mouse Gamer Exemplo',
  'Produto de exemplo usado apenas para demonstrar o layout. Edite ou substitua pelo produto real em /admin/produtos.',
  159.00, null, 8, 3,
  (select id from categories where name = 'Periféricos'),
  'Marca Exemplo', '{}', true, true;
