<div align="center">

<img src="public/logo.svg" alt="BEWEAR" height="48" />

# BEWEAR — E-commerce de Moda Full Stack

Loja virtual completa de roupas e acessórios, do catálogo ao pagamento, construída com **Next.js 15**, **React 19**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, **Better Auth** e **Stripe**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)

</div>

---

## Sobre o projeto

A **BEWEAR** é um e-commerce real, não um protótipo de tela. Cada etapa da jornada de compra foi implementada de ponta a ponta: vitrine dinâmica, páginas de categoria e produto com variantes, carrinho persistido no banco, cadastro de endereços de entrega, criação de pedidos em transação, pagamento via Stripe Checkout e confirmação automática por webhook.

O projeto foi pensado com foco em **arquitetura limpa, tipagem de ponta a ponta e boas práticas do ecossistema React moderno**: Server Components para buscar dados, Server Actions para mutações, React Query para estado no cliente e validação com Zod em todas as fronteiras.

## Funcionalidades

### Catálogo
- Home com banners, seção **"Mais vendidos"**, **"Novos produtos"** e seletor de categorias
- Páginas de **categoria** (`/category/[slug]`) com listagem de produtos
- Páginas de **variante de produto** (`/product-variant/[slug]`) com seletor de cor/variante, controle de quantidade e produtos relacionados
- Preços armazenados em **centavos** e formatados em BRL com `Intl.NumberFormat`, sem erros de ponto flutuante

### Autenticação
- Cadastro e login com **e-mail e senha**
- Login social com **Google (OAuth)**
- Sessões gerenciadas pelo **Better Auth**, persistidas no PostgreSQL via adapter do Drizzle

### Carrinho
- Carrinho **persistido no banco** e vinculado ao usuário
- Adicionar, aumentar, diminuir e remover itens e **invalidação automática de cache** via React Query
- Drawer lateral (Sheet) com resumo e subtotal em tempo real

### Checkout
1. **Identificação**: cadastro de endereços de entrega (com máscaras de CEP, telefone e CPF/CNPJ via `react-number-format`) e seleção de endereço salvo
2. **Confirmação**: revisão de itens, endereço e total
3. **Finalização**: criação do pedido e dos itens em **transação atômica**, com snapshot do endereço e dos preços no momento da compra
4. **Pagamento**: redirecionamento para o **Stripe Checkout**
5. **Webhook**: o endpoint `/api/stripe/webhook` valida a assinatura do Stripe e marca o pedido como `paid`

### Pedidos
- Página **Meus Pedidos** com histórico, status (`pending`, `paid`, `canceled`) e itens de cada compra em accordion

## Stack e tecnologias

| Camada | Tecnologias |
| --- | --- |
| **Framework** | Next.js 15 (App Router, Server Components, Server Actions, Route Handlers) |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui, Radix UI, Lucide Icons, Sonner (toasts), tw-animate-css |
| **Formulários** | React Hook Form, Zod, @hookform/resolvers, react-number-format |
| **Estado / dados no cliente** | TanStack React Query 5 |
| **Banco de dados** | PostgreSQL, Drizzle ORM, Drizzle Kit (migrações), Drizzle Seed |
| **Autenticação** | Better Auth (e-mail/senha + Google OAuth) |
| **Pagamentos** | Stripe (Checkout Sessions + Webhooks) |
| **Qualidade** | TypeScript estrito, ESLint, eslint-plugin-simple-import-sort, Prettier + plugin do Tailwind |

## Arquitetura

```
src/
├── actions/            # Server Actions: cada uma em sua pasta com index.ts + schema.ts (Zod)
│   ├── add-cart-product/
│   ├── create-checkout-session/
│   ├── create-shipping-address/
│   ├── finish-order/
│   └── ...
├── app/                # Rotas do App Router
│   ├── api/
│   │   ├── auth/[...all]/      # Handler do Better Auth
│   │   └── stripe/webhook/     # Webhook de pagamento
│   ├── authentication/         # Login e cadastro
│   ├── cart/                   # identification → confirmation
│   ├── category/[slug]/
│   ├── product-variant/[slug]/
│   ├── checkout/success/
│   └── my-orders/
├── components/
│   ├── common/         # Header, Footer, Cart, ProductList, etc.
│   └── ui/             # Componentes shadcn/ui
├── db/                 # Conexão, schema e seed do Drizzle
├── helpers/            # Utilitários puros (ex.: formatação monetária)
├── hooks/
│   ├── queries/        # Hooks do React Query (useCart, useUserAddresses)
│   └── mutations/      # Hooks de mutação (increase/decrease/remove, finish order...)
├── lib/                # Configuração do Better Auth (server e client)
└── providers/          # Provider do React Query
```

### Decisões de projeto

- **Server Components por padrão**: páginas buscam dados direto do banco, sem API intermediária e sem waterfall no cliente.
- **Server Actions com contrato Zod**: cada action valida a entrada com um `schema.ts` próprio e verifica a sessão antes de tocar no banco. Também checa se o recurso pertence ao usuário (ex.: um usuário não consegue pagar o pedido de outro).
- **Query keys centralizadas**: cada hook exporta sua própria função de query/mutation key (`getUseCartQueryKey`), o que deixa a invalidação de cache previsível.
- **Pedidos imutáveis**: o pedido copia endereço e preço unitário no momento da compra, então mudanças futuras no catálogo ou no endereço não alteram o histórico.
- **Integridade referencial**: relações com `onDelete` definidas caso a caso (`cascade`, `set null`, `restrict`) e enum nativo do Postgres para status do pedido.
- **Padrões documentados**: as convenções do projeto (kebab-case, estrutura de actions, uso de hooks, formulários) estão em `.cursor/rules/general.mdc`, o que mantém a consistência do código.

### Modelo de dados

```
user ─┬─< session / account          (Better Auth)
      ├─< shipping_address
      ├── cart ─< cart_item >── product_variant
      └─< order ─< order_item >── product_variant

category ─< product ─< product_variant
```

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- PostgreSQL (local, Docker ou serviço gerenciado como Neon/Supabase)
- Conta no [Stripe](https://stripe.com) (modo de teste) e [Stripe CLI](https://docs.stripe.com/stripe-cli) para testar o webhook
- Credenciais OAuth do Google (opcional, para login social)

### 1. Clone e instale as dependências

```bash
git clone <url-do-repositorio>
cd bewear
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bewear"

BETTER_AUTH_SECRET="uma-string-aleatoria-e-segura"
BETTER_AUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Crie as tabelas e popule o banco

```bash
npx drizzle-kit push
npx tsx src/db/seed.ts
```

O seed cria as categorias (Acessórios, Bermuda & Shorts, Calças, Camisetas, Jaquetas & Moletons, Tênis), os produtos e as variantes com imagens e preços.

### 4. Inicie o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 5. Teste o webhook do Stripe

Em outro terminal:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o `whsec_...` exibido para `STRIPE_WEBHOOK_SECRET` e use o cartão de teste `4242 4242 4242 4242` no checkout.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | Análise estática com ESLint |
| `npx drizzle-kit push` | Sincroniza o schema com o banco |
| `npx drizzle-kit studio` | Interface visual do banco |
| `npx tsx src/db/seed.ts` | Popula o banco com o catálogo |

## Desenvolvido por

Feito com dedicação por **TekhneDev**, como projeto de estudo aprofundado em desenvolvimento full stack moderno: autenticação, modelagem relacional, transações, integração de pagamentos e uma experiência de compra completa.
