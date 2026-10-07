# Gym Platform · Pulso

Plataforma full stack para encontrar academias perto de você e fazer check-in pelo celular. O conceito é parecido com o de serviços de acesso a academias: o usuário descobre academias e modalidades ao redor, faz check-in quando está a até 100 m de uma delas, e a academia valida a presença.

O projeto nasceu como a API do curso de Node.js da Rocketseat e foi evoluído para um produto completo. O backend foi revisado e ganhou testes e endpoints novos, e ganhou um frontend novo com identidade visual própria: **Pulso**.

```txt
gym-api/
├── backend/    API REST · Node.js, Fastify, Prisma, PostgreSQL
└── frontend/   Web app · React, TypeScript, Vite, Leaflet
```

## Funcionalidades

### Para quem treina

- Cadastro e login, com sessão mantida por refresh token (cookie httpOnly)
- Academias próximas a partir da localização do navegador, com distância até cada uma
- Exploração em **lista ou mapa**, com filtros de distância (1 a 20 km) e modalidade
- Busca por nome, endereço ou modalidade ("natação" vira o filtro de Natação)
- Página da academia com mapa, modalidades e contato
- **Check-in com verificação de distância**: o app mostra quão perto você está e o servidor confirma a regra dos 100 m
- Histórico de check-ins agrupado por mês, com status de validação
- Progresso: treinos na semana e no mês, sequência atual e melhor sequência
- Perfil com tema claro, escuro ou do sistema

### Para administradores

- **Importação de academias reais** do OpenStreetMap num raio de 10 km da localização atual, com nome, endereço, telefone e modalidades
- Fila de check-ins pendentes com contagem regressiva da janela de validação de 20 min
- Cadastro e edição de academias, com a posição escolhida no mapa

## Regras de negócio

As regras são aplicadas no servidor. O frontend só antecipa o feedback.

| Regra | Onde |
|---|---|
| Check-in só a até **100 m** da academia | `CheckInUseCase` |
| **Um check-in por dia** por usuário (o dia segue o fuso `APP_TIMEZONE`) | `CheckInUseCase` |
| Validação do check-in só até **20 minutos** depois de criado, e uma única vez | `ValidateCheckInUseCase` |
| Apenas **ADMIN** cria/edita academias, lista e valida check-ins | `verifyUserRole` |
| E-mail único (sem diferenciar maiúsculas), senha com hash bcrypt | `RegisterUseCase` |
| Listagens paginadas de 20 em 20 | repositories |

## Stack

| | Backend | Frontend |
|---|---|---|
| Linguagem | TypeScript | TypeScript |
| Framework | Fastify 5 | React 19 + Vite |
| Dados | Prisma 6 + PostgreSQL | TanStack Query 5 + Axios |
| Validação | Zod | Zod + React Hook Form |
| Auth | JWT (access token) + refresh token em cookie httpOnly | Token em memória, refresh automático no interceptor |
| Mapas | Haversine (SQL e TS), importação via Overpass API (OSM) | Leaflet + OpenStreetMap (sem chave de API) |
| UI | | Tailwind CSS 4, Motion, Lucide |
| Testes | Vitest (unitários e E2E com Supertest) | Vitest |

## Arquitetura

### Backend

Clean Architecture enxuta, com SOLID e inversão de dependência:

```txt
backend/src/
├── http/
│   ├── controllers/     # validam a entrada (Zod) e chamam os use cases
│   ├── middlewares/     # verifyJwt, verifyUserRole
│   ├── presenters/      # formato público de Gym e User
│   └── error-handler.ts # erro de domínio → status HTTP, em um só lugar
├── use-cases/           # regras de negócio, sem conhecer HTTP nem Prisma
│   ├── errors/          # erros de domínio
│   └── factories/       # montam use cases com os repositories reais
├── repositories/        # interfaces + implementações Prisma e in-memory
├── providers/           # fontes externas (OpenStreetMap/Overpass) atrás de uma interface
├── lib/  env/  utils/
```

Os testes unitários usam os repositories **in-memory**. Os E2E sobem a aplicação real contra um schema do PostgreSQL isolado por arquivo de teste.

A documentação de todas as rotas está em **[backend/docs/API.md](backend/docs/API.md)**.

### Frontend

```txt
frontend/src/
├── api/          # cliente Axios, refresh single-flight, serviços por recurso
├── components/   # ui/ (design system), gym/, map/, check-in/, layout/...
├── features/     # auth, location (Geolocation API), theme
├── hooks/        # queries e mutations (TanStack Query)
├── pages/        # uma pasta por área: auth, home, explore, gyms, check-ins, profile, admin
├── routes/       # rotas com lazy loading
├── schemas/      # formulários (Zod)
└── utils/        # distância, formatação pt-BR, modalidades
```

O design system está documentado em **[frontend/docs/DESIGN.md](frontend/docs/DESIGN.md)**.

## Como rodar

Pré-requisitos: **Node.js 22+** e **Docker** (ou um PostgreSQL próprio).

### 1. Backend

```bash
cd backend
cp .env.example .env
docker compose up -d     # PostgreSQL na porta 5433
npm install              # também gera o Prisma Client
npm run db:migrate       # aplica as migrations
npm run db:seed          # opcional: usuários e academias de exemplo
npm run dev              # http://localhost:3333
```

O seed cria duas contas, com senha `123456`:

| Conta | Papel |
|---|---|
| `admin@gymplatform.dev` | ADMIN |
| `member@gymplatform.dev` | MEMBER |

Ele também cria 13 academias fictícias ao redor da Av. Paulista (SP), úteis para testar sem internet. Para testar o check-in de onde você está, gere as academias ao seu redor:

```bash
SEED_LATITUDE=-22.9068 SEED_LONGITUDE=-43.1729 npm run db:seed -- --reset
```

A academia **Iron House** fica a ~50 m do ponto central, perto o bastante para o check-in. Também dá para simular a posição no navegador em DevTools → Sensors → Location.

### Academias reais da sua região

As academias reais vêm do [OpenStreetMap](https://www.openstreetmap.org), que é gratuito e não exige chave de API. Há duas formas de importar:

- **Pelo app:** entre como admin e vá em **Painel admin → Academias → Importar academias reais**. O navegador pede sua localização e importa tudo num raio de 10 km.
- **Pelo terminal:**

  ```bash
  npm run gyms:import -- --lat -23.5614 --lng -46.6559 --dry-run   # só lista, sem salvar
  npm run gyms:import -- --lat -23.5614 --lng -46.6559 --radius 10
  ```

Para ficar só com as academias reais, apague as fictícias antes de importar. O comando abaixo remove todas as academias e check-ins e mantém as contas:

```bash
npm run db:seed -- --reset --users-only
```

Importar de novo é seguro: academias já importadas são atualizadas, sem duplicar. Os dados são © colaboradores do OpenStreetMap (ODbL), e a página de cada academia importada mostra esse crédito.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

### Variáveis de ambiente

#### backend/.env

| Variável | Descrição | Padrão |
|---|---|---|
| `NODE_ENV` | `dev`, `test` ou `production` | `dev` |
| `PORT` | Porta da API | `3333` |
| `DATABASE_URL` | Conexão PostgreSQL | obrigatória |
| `JWT_SECRET` | Segredo de assinatura dos tokens | obrigatória |
| `CORS_ORIGIN` | Origens permitidas, separadas por vírgula | `http://localhost:5173` |
| `APP_TIMEZONE` | Fuso que define o "dia" do check-in | `America/Sao_Paulo` |

#### frontend/.env

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL da API | `http://localhost:3333` |

## Scripts

| Backend | |
|---|---|
| `npm run dev` | API em modo watch |
| `npm run build` / `npm start` | Build de produção e execução |
| `npm test` | Testes unitários |
| `npm run test:e2e` | Testes E2E (precisa do PostgreSQL rodando) |
| `npm run lint` / `npm run typecheck` | Qualidade |
| `npm run db:migrate` / `db:deploy` / `db:seed` | Banco de dados |
| `npm run gyms:import -- --lat .. --lng ..` | Importa academias reais do OpenStreetMap |

| Frontend | |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm run preview` | Build de produção e pré-visualização |
| `npm test` | Testes dos utilitários |
| `npm run lint` / `npm run typecheck` | Qualidade |

## Testes

- **Backend:** 66 testes unitários (use cases, cálculo de sequência e importação do OpenStreetMap com `fetch` simulado) e 42 E2E, que cobrem autenticação, permissões (401/403), erros de domínio, refresh token, geolocalização e o fluxo de check-in.
- **Frontend:** testes dos utilitários (distância, formatação, modalidades, agrupamento por mês).
- **CI:** GitHub Actions roda lint, typecheck e testes unitários a cada push, e os E2E em pull requests.

## Autor

Gustavo Santana · [GitHub](https://github.com/gustavosantana-034)
