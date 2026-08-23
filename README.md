# MG Store

Loja virtual de celulares, acessórios, periféricos e eletrônicos, com painel administrativo completo em `/admin`.

## Stack escolhida (e por quê)

| Camada | Escolha | Por quê |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind | Gera um build 100% estático, compatível com GitHub Pages, e é rápido de manter. |
| Roteamento | React Router (`BrowserRouter`) | Rotas limpas como `/admin`, `/produto/:id`. Um truque de `404.html` (explicado abaixo) faz isso funcionar no GitHub Pages, que não tem servidor configurável. |
| Banco de dados + Autenticação | Supabase (Postgres + Auth + Storage) | GitHub Pages só serve arquivos estáticos — não roda banco de dados nem backend. Supabase resolve as três coisas que o site precisa (banco, login seguro, upload de imagem) com um serviço gratuito e sem servidor próprio pra manter. |

**Importante:** o código-fonte fica no GitHub. O site (frontend) é publicado no GitHub Pages. O banco de dados e a autenticação ficam no Supabase — nunca dentro do GitHub Pages, porque ele não executa nada no servidor.

---

## 1. Instalar o projeto

```bash
cd mg-store
npm install
```

## Visual da loja

O visual público (loja) segue a mesma identidade do site anterior: fundo
branco/off-white, seções cheias de tela em preto, tipografia grande,
azul (`#0071E3`) como único acento de cor, botões em pílula e botão
flutuante de WhatsApp. O painel `/admin` continua com tema escuro
próprio, por ser uma ferramenta interna — não precisa seguir a
identidade da loja pública.

## 2. Criar o projeto no Supabase

1. Crie uma conta grátis em [supabase.com](https://supabase.com) e crie um novo projeto.
2. Vá em **SQL Editor** → **New query**, cole todo o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**.
   Isso cria as tabelas `products`, `categories`, `orders`, `admin_users`, as regras de segurança (RLS) e o bucket de imagens `produtos`.
3. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public key`

## 3. Configurar as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
VITE_SUPABASE_STORAGE_BUCKET=produtos
VITE_WHATSAPP_NUMBER=5511954196578
```

O `.env` nunca vai para o GitHub (já está no `.gitignore`).

## 4. Criar seu primeiro administrador

1. No Supabase Dashboard, vá em **Authentication → Users → Add user** e crie um usuário com seu e-mail e uma senha.
2. Copie o **UID** desse usuário (aparece na lista de usuários).
3. Vá em **SQL Editor** e rode, trocando os valores:

```sql
insert into admin_users (id, email)
values ('UID_COPIADO_AQUI', 'seuemail@mgstore.com.br');
```

Pronto — esse e-mail e senha já podem logar em `/admin`.

Para adicionar outros administradores depois, repita o processo: crie o usuário em Authentication → Users e insira o UID em `admin_users`. A página `/admin/configuracoes` do painel explica esse mesmo passo a passo.

## 5. Rodar localmente

```bash
npm run dev
```

- Loja pública: `http://localhost:5173/`
- Painel admin: `http://localhost:5173/admin` (redireciona para login se não estiver autenticado)

## 6. Publicar no GitHub

```bash
git init
git add .
git commit -m "MG Store"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mg-store.git
git push -u origin main
```

**Nunca** commite o arquivo `.env` — só o `.env.example`.

## 7. Publicar no GitHub Pages

O jeito mais simples é com o pacote `gh-pages` (já incluso):

```bash
npm run deploy
```

Isso builda o projeto e publica a pasta `dist` na branch `gh-pages`. Depois, no GitHub:
`Settings → Pages → Source: gh-pages branch`.

Seu site ficará em:
`https://SEU_USUARIO.github.io/mg-store/`
e o painel em:
`https://SEU_USUARIO.github.io/mg-store/admin/`

**Sobre as variáveis de ambiente no GitHub Pages:** como o Pages só serve arquivos estáticos, as variáveis `VITE_*` precisam estar preenchidas no `.env` **no momento do `npm run build`**, na sua máquina (ou em uma GitHub Action, se preferir automatizar). Elas ficam embutidas no build — por isso só a chave `anon` (pública por natureza) é usada no frontend; nunca a chave `service_role`.

Se no futuro você quiser trocar para um domínio próprio (ex: `mgstore.com.br`), não precisa mudar nada no código: o projeto usa caminhos relativos (`base: './'` no `vite.config.ts`) e rotas absolutas simples (`/admin`), então basta apontar o domínio para o mesmo build.

### Por que existe um `public/404.html`?

GitHub Pages não tem servidor configurável: se alguém acessa `/admin` direto ou aperta F5 numa rota interna, o GitHub devolve 404 porque não existe um arquivo físico `admin/index.html`. O `404.html` incluso redireciona esse acesso de volta para o `index.html`, guardando a rota original — e um script no `index.html` restaura a URL certa antes do React assumir. Isso é o que permite `/admin` funcionar como uma rota "de verdade", sem hash (`#`) na URL.

### Alternativa: Vercel ou Netlify

Se preferir não usar o truque do `404.html`, qualquer plataforma com suporte nativo a SPA (Vercel, Netlify) publica este mesmo projeto sem configuração extra — é só importar o repositório do GitHub. O banco de dados continua sendo o Supabase de qualquer forma.

---

## 8. Testando o `/admin`

Checklist rápido depois de configurar tudo:

- [ ] Abrir a loja (`/`) e ver os produtos
- [ ] Abrir um produto e adicionar ao carrinho
- [ ] Fazer checkout (cria um pedido no Supabase e abre o WhatsApp)
- [ ] Acessar `/admin` sem estar logado → deve redirecionar para `/admin/login`
- [ ] Logar com o e-mail/senha do primeiro administrador
- [ ] Criar um produto novo, com imagem
- [ ] Editar preço e estoque, e conferir se atualiza na loja pública
- [ ] Duplicar e excluir um produto
- [ ] Criar uma categoria e associar a um produto
- [ ] Marcar um pedido como "confirmado" e ver o estoque baixar automaticamente
- [ ] Deslogar e confirmar que `/admin` pede login de novo

---

## Estrutura do projeto

```
/                     → loja pública
/produto/:id          → página do produto
/carrinho             → carrinho
/checkout             → finalização (cria pedido + abre WhatsApp)
/admin/login          → login do administrador
/admin                → dashboard (protegido)
/admin/produtos       → lista + CRUD de produtos
/admin/produtos/:id   → formulário (novo ou edição)
/admin/estoque        → controle de estoque
/admin/pedidos        → pedidos e status
/admin/categorias     → categorias
/admin/configuracoes  → dados da loja e administradores
```

## O que foi implementado

- Loja pública com produtos, categorias, carrinho e checkout via WhatsApp
- Painel `/admin` completo: dashboard, produtos, estoque, pedidos, categorias, configurações
- Autenticação real via Supabase Auth (não é senha fixa no frontend)
- Proteção de rota: `/admin` sem login redireciona para `/admin/login`; usuário logado mas sem permissão vê "acesso negado"
- Upload, reordenação e remoção de imagens (Supabase Storage)
- Estoque com "em estoque / últimas unidades / esgotado" automático, e baixa automática ao confirmar pedido
- Nenhuma senha, token ou chave secreta no código — tudo via `.env` (não versionado)
- Rotas relativas — funciona em qualquer subpasta do GitHub Pages ou domínio próprio
